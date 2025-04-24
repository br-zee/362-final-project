import { useParams, Navigate, data } from "react-router-dom"
import { isValidProduct } from "../../stores/allowedCategories"
import { useEffect, useRef, useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import "./Product.css";
import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/cartReducer";

export default function Product() {
    const {category, subcategory, id} = useParams();
    if (!isValidProduct(category, subcategory)) return <Navigate to="/notfound" />;

    const dispatch = useDispatch();

    const [quantity, setQuantity] = useState(1);
    function changeQuantity(e) {
        switch(e.target.textContent) {
            case "-":
                quantity > 1 ? setQuantity(quantity-1) : null;
                break;
            case "+":
                quantity < product.stock ? setQuantity(quantity+1) : null; 
                break;
        }
    }

    const query = `/products?filters[documentId][$eq]=${id}&populate=*`;
    const formRef = useRef(null);

    if (query) {
        var { products: [product], loading, error } = useFetch(query);
    }
    
    return (
        <div>
            <div className="product-details">
                <div className="product-img">
                    <img src={product?.img?.url} alt={product?.img?.name} />
                </div>
                <div className="product-actions">
                    <h1 className="product-title">{product?.title}</h1>
                    <a href="#reviews" className="rating">
                        <div className="stars">
                            <StarOutlinedIcon/>
                            <StarOutlinedIcon/>
                            <StarOutlinedIcon/>
                            <StarOutlinedIcon/>
                            <StarOutlinedIcon/>
                        </div>
                        <p>{product?.ratings?.length} Review(s)</p>
                    </a>

                    <form className="product-form" action="" method="POST" ref={formRef} onSubmit={(e) => e.preventDefault()}>
                        <select name="size" id="size" defaultValue={product?.sub_categories[0].title}>
                            {
                                product?.sub_categories?.map(subcat =>
                                    <option key={subcat.title} value={subcat.title} name="size">
                                        {subcat.title[0].toUpperCase() + subcat.title.slice(1)}
                                    </option>
                                )
                            }
                        </select>

                        {
                            product?.stock > 0
                                ? <>
                                    <p>{product?.stock} remaining</p>
                                    <div className="quantity">
                                        <div className="change-quantity minus" onClick={changeQuantity}>-</div>
                                        <div className="amount">{quantity}</div>
                                        <div className="change-quantity plus" onClick={changeQuantity}>+</div>
                                    </div>

                                    <button method="submit" onClick={() => dispatch(addToCart({
                                        id: product.documentId,
                                        title: product.title,
                                        desc: product.description,
                                        price: product.price,
                                        img: product.img.url,
                                        quantity,
                                        stock: product.stock,
                                    }))}>
                                        <p>Add to cart</p>
                                    </button>
                                </>
                                : <>
                                    <p style={{color:'crimson'}}>Out of stock</p>
                                    
                                </>
                        }

                        
                    </form>
                </div>
            </div>

            <div className="additional-products">
                
            </div>

            <div className="reviews" id="reviews">
                
            </div>

        </div>
    )
}