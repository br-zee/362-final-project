import { useSearchParams, Link } from "react-router-dom";
import "./Search.scss";
import { useFetch } from "../../hooks/useFetch";

export default function Search() {

    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('q')

    const { products, loading, error } = useFetch(`/products?filters[title][$containsi]=${searchTerm}&populate=*`)

    return (
        <>
            <h1 className="search-header">Search Results</h1>

            { products.length > 0
                ?
                <div className="search-product-list">
                    {
                        products?.map(product => {

                            const category = product?.categories[0]?.title;

                            // Use unique documentId since strapi ids are inconsistent
                            const productPath = product.sub_categories[0]
                                ? `../${category}/${product.sub_categories[0].title}/${product.documentId}`
                                : `../${category}/${product.documentId}`;

                            return (
                                <div key={product.id} className="search-product-card">
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
                : <p className="search-invalid">No results</p>

            }
            
        </>
    )
}