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

    let [searchParams] = useSearchParams();
    const selectedType = searchParams.get("type");
    const selectedColor = searchParams.get("color");

    const colors = [
        'red',
        'orange',
        'yellow',
        'green',
        'blue',
        'purple',
        'black',
        'brown',
        'gray',
        'pink',
        'silver',
        'gold',
        'white',
        'turquoise',
        'multicolored',
    ];
    
    const productQuery = `/products?filters[categories][title][$eq]=${category}`;
    const typeFilter = `&filters[sub_categories][title][$eq]=${selectedType}`;
    const colorFilter = `&filters[color]=${selectedColor}`;
    const populateQuery = `&populate=*`;

    if (productQuery) {
        var {products, loading, error} = selectedType && selectedColor 
            ? useFetch(productQuery + typeFilter + colorFilter + populateQuery)
            : selectedType 
            ? useFetch(productQuery + typeFilter + populateQuery)
            : selectedColor
            ? useFetch(productQuery + colorFilter + populateQuery)
            : useFetch(productQuery + populateQuery);
    }

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
        const filters = formRef.current.querySelectorAll("fieldset p input");
        filters.forEach(filter => {
            filter.checked = false;
        })
        navigate("");
    }

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
                                <p key={subcat} id={subcat}>
                                    <input type="radio" name="type" id={subcat} value={subcat} onChange={() => formRef.current.submit()} defaultChecked={subcat === selectedType} />
                                    <label htmlFor={subcat}>{subcat[0].toUpperCase() + subcat.slice(1)}</label>
                                </p>
                            )
                        }
                    </fieldset>

                    <fieldset id="product-color">
                        <legend><p>Color</p></legend>
                        {
                            colors.map(color =>
                                <p key={color} id={color}>
                                    <input type="radio" name="color" id={color} value={color} onChange={() => formRef.current.submit()} defaultChecked={color === selectedColor}/>
                                    <label htmlFor={color}>{color[0].toUpperCase() + color.slice(1)}</label>
                                </p>
                            )
                        }
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
                        <p className="results">{products.length} Results</p>
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