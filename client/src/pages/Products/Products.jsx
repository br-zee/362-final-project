import { useParams, Navigate, useSearchParams, Link, useNavigate } from "react-router-dom"
import { isValidProduct } from "../../stores/allowedCategories";
import { useFetch } from "../../hooks/useFetch";
import { allowedCategories } from "../../stores/allowedCategories";
import "./Products.css";
import { useState, useEffect, useRef } from "react";

export default function Products() {
    const navigate = useNavigate();

    const { category } = useParams();
    if (!isValidProduct(category)) return <Navigate to="/notfound" />;

    const [maxPrice, setMaxPrice] = useState(100);
    const [sort, setSort] = useState(null);
    const [selectedSubCats, setSelectedSubCats] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);

    const colors = [
        'red', 'orange', 'yellow',
        'green', 'blue', 'purple',
        'black', 'brown', 'gray',
        'pink', 'silver', 'gold',
        'white', 'turquoise', 'multicolored',
    ];
    
    let filters = [];
    let filterIndex = 0;

    // Category filter
    filters.push(`filters[$and][${filterIndex}][categories][title][$eq]=${category}`);
    filterIndex++;

    // Subcategories filter (multiple ANDs)
    if (selectedSubCats.length > 0) {
        selectedSubCats.forEach((type) => {
            filters.push(`filters[$and][${filterIndex}][sub_categories][title][$eq]=${type}`);
            filterIndex++;
        });
    }

    // Colors filter (multiple ANDs)
    if (selectedColors.length > 0) {
        selectedColors.forEach((color) => {
            filters.push(`filters[$and][${filterIndex}][color][$eq]=${color}`);
            filterIndex++;
        });
    }

    // Price filter
    filters.push(`filters[$and][${filterIndex}][price][$lte]=${maxPrice}`);
    filterIndex++;

    const baseQuery = `/products?`;
    const sortFilter = sort ? `&sort=price:${sort}` : '';
    const populateQuery = `&populate=*`;

    const finalQuery = baseQuery + filters.join('&') + sortFilter + populateQuery;    

    const { products, loading, error } = useFetch(finalQuery);

    const [placeholders, setPlaceholders] = useState(0);
    const formRef = useRef(null);

    useEffect(() => {
        const rows = Math.floor(window.innerHeight / 250);
        const cols = Math.floor(window.innerWidth / 250);
        const placeholderAmnt = rows * cols;
        const placeholderArr = [];
        for (let i = 0; i < placeholderAmnt; i++) {
            placeholderArr.push(
                <div key={i} className="placeholder-card">
                    <div className="loader"></div>
                </div>
            );
        }
        setPlaceholders(placeholderArr);        
    },[]);

    function clearFilters() {
        setSelectedColors([]);
        setSelectedSubCats([]);
        setSort(null);
        setMaxPrice(100);
        navigate("");
    }

    const handleSubCatChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        const newSubCats = isChecked
            ? [...selectedSubCats, value]
            : selectedSubCats.filter(item => item !== value);

        setSelectedSubCats(newSubCats);
        updateURL({ types: newSubCats });
    };

    const handleColorChange = (e) => {
        const value = e.target.value;
        const isChecked = e.target.checked;

        const newColors = isChecked
            ? [...selectedColors, value]
            : selectedColors.filter(item => item !== value);

        setSelectedColors(newColors);
        updateURL({ colors: newColors });
    };

    const handleSortChange = (value) => {
        setSort(value);
        updateURL({ sort: value });
    };

    const updateURL = ({ types = selectedSubCats, colors = selectedColors, sort = null }) => {
        const params = new URLSearchParams();
        
        // Add types to URL
        types.forEach(type => params.append('type', type));
        
        // Add colors to URL
        colors.forEach(color => params.append('color', color));
        
        // Add sort to URL
        if (sort) params.set('sort', sort);
        
        navigate(`?${params.toString()}`, { replace: true });
    };
    
    return (
        <div className="product-page">

            <div className="product-sidebar">
                <p>Filter by:</p>
                <button onClick={clearFilters}><p>Clear all</p></button>
                <form action="" method="GET" ref={formRef}>
                    <fieldset id="product-type">
                        <legend><p>Type</p></legend>
                        {
                            allowedCategories[category].map((subcat) =>
                                <p key={`subcategory-${subcat}`} id={subcat}>
                                    <input type="checkbox" name="type" id={`subcategory-${subcat}`} value={subcat} onChange={handleSubCatChange} checked={selectedSubCats.includes(subcat)} />
                                    <label htmlFor={`subcategory-${subcat}`}>{subcat[0].toUpperCase() + subcat.slice(1)}</label>
                                </p>
                            )
                        }
                    </fieldset>

                    <fieldset id="product-color">
                        <legend><p>Color</p></legend>
                        {
                            colors.map(color =>
                                <p key={`color-${color}`} id={color}>
                                    <input type="checkbox" name="color" id={`color-${color}`} value={color} onChange={handleColorChange} checked={selectedColors.includes(color)}/>
                                    <label htmlFor={`color-${color}`}>{color[0].toUpperCase() + color.slice(1)}</label>
                                </p>
                            )
                        }
                    </fieldset>

                    <fieldset id="product-price">
                        <h3>Price Range</h3>
                        <div className="price-range">
                            <span>0</span>
                            <input
                                type="range"
                                min={0}
                                max={100}
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                            />
                            <span>${maxPrice}</span>
                        </div>
                    </fieldset>

                    <fieldset id="product-sort">
                        <h3>Sort by</h3>
                        <div className="filter-option">
                            <input
                                type="radio"
                                id="asc"
                                name="sort"
                                value="asc"
                                onChange={() => handleSortChange("asc")}
                                checked={sort === "asc"}
                            />
                            <label htmlFor="asc">Price (Lowest first)</label>
                        </div>
                        <div className="filter-option">
                            <input
                                type="radio"
                                id="desc"
                                name="sort"
                                value="desc"
                                onChange={() => handleSortChange("desc")}
                                checked={sort === "desc"}
                            />
                            <label htmlFor="desc">Price (Highest first)</label>
                        </div>
                    </fieldset>
                </form>
            </div>

            <div className="product-page-content">

                <h1 className="header">{category[0].toUpperCase() + category.slice(1)}</h1>

                {
                    loading ?
                    (
                        <div className="placeholder-list">
                            { placeholders?.map(placeholder => placeholder) }
                        </div>
                    )
                    : error ? <p>{error}</p>
                    :
                    <div>
                        <p className="results">{products?.length} Results</p>
                        <div className="product-list">
                        {
                            products?.map(product => {

                                // Use unique documentId since strapi ids are inconsistent
                                const productPath = product.sub_categories[0]
                                    ? `../${category}/${product.sub_categories[0].title}/${product.documentId}`
                                    : `../${category}/${product.documentId}`;

                                return (
                                    <div key={product.id} className="product-card">
                                        <Link to={productPath} className="link" onClick={() => window.scrollTo(0, 0)}>
                                            <img src={product?.img?.url} alt={product?.img?.name} />
                                        </Link>
                                        <h1>{product.title}</h1>
                                        <p>${product.price}</p>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>
                }
            </div>

        </div>
    )
}