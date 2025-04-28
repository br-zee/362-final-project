import "./Trending.css";
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useRef, useState } from "react";
import { useFetch } from "../../../hooks/useFetch";
import { Link } from "react-router-dom";

export default function Trending() {

    const query = `/products?filters[type][$eq]=featured&sort[0]=publishedAt:desc&pagination[pageSize]=10&populate=*`;
    if (query) {
        var {products, loading, error} = useFetch(query);
    }

    const listRef = useRef(null);

    function next() {
            listRef.current.scrollLeft += listRef.current.offsetWidth;
    }
    function prev() {
            listRef.current.scrollLeft -= listRef.current.offsetWidth;
    }

    return (
        <div className="trending">
            <h1>Make your first impression count</h1>
            <p>Trending styles people are choosing today:</p>

            <div className="content">
                <div className="arrow prev" onClick={prev}>
                    <ChevronLeftOutlinedIcon/>
                </div>

                <div className="trending-product-list" ref={listRef}>
                    {
                        products.map(product =>
                            <Link to={`${product.categories[0]?.title}/${product?.documentId}`} key={product.id} className="link product-card" onClick={() => scrollTo(0, 0)}>
                                <div className="img">
                                    <img src={product?.img?.url} alt={product?.img?.title} />
                                </div>
                                <p>{product?.title}</p>
                            </Link>
                        )
                    }
                </div>

                <div className="arrow next" onClick={next}>
                    <ChevronRightOutlinedIcon/>
                </div>
            </div>

        </div>
    )
}