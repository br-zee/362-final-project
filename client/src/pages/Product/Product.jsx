import "./Product.css";
import { useParams, Navigate } from "react-router-dom"
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

import { isValidProduct } from "../../stores/allowedCategories"
import { useFetch } from "../../hooks/useFetch";
import { makeRequest } from "../../makeRequest";
import { addToCart } from "../../redux/cartReducer";

import StarOutlineOutlinedIcon from '@mui/icons-material/StarOutlineOutlined';
import StarHalfOutlinedIcon from '@mui/icons-material/StarHalfOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';

import Linebreak from "../../components/Linebreak/Linebreak";

export default function Product() {
    const {category, subcategory, id} = useParams();
    if (!isValidProduct(category, subcategory)) return <Navigate to="/notfound" />;

    const dispatch = useDispatch();
    const formRef = useRef(null);

    const [quantity, setQuantity] = useState(1);
    const [avgRating, setAvgRating] = useState([]);


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
    if (query) {
        var { products: [product], loading, error } = useFetch(query);
    }

    useEffect(() => {
        const ratingsLength = product?.ratings?.length;
        let totalRatings = 0;
        product?.ratings?.map(rating => totalRatings += rating.value);
        setAvgRating(Math.floor((totalRatings / ratingsLength) * 2) / 2);
    }, [product])    

    function submitReview(e) {
        e.preventDefault();

        const value = e.target.stars.value;
        const title = e.target.title.value;
        const description = e.target.review.value;
        const reviewer = JSON.parse(localStorage.getItem("data"))?.username || "Anonymous";

        makeRequest.post('/ratings', {
            data: {
                title,
                description,
                value,
                reviewer,
            },
        })
        .then((res) => {
            const reviewId = res.data.data.id;

            const uploadedReviews = product.ratings.map((rating) => {return { id: rating.id }});
            uploadedReviews.push({id: reviewId});

            console.log(uploadedReviews);

            makeRequest.put(`/products/${product?.documentId}`, {
                data: {
                    ratings: uploadedReviews
                }
            })
            .then(res => location.reload())
            .catch(err => console.log(err))
        })
        .catch(err => console.log(err));
    }
    
    return (
        <>
            <div className="product-details">
                <div className="product-img">
                    <img src={product?.img?.url} alt={product?.img?.name} />
                </div>
                <div className="product-actions">
                    <h1 className="product-title">{product?.title}</h1>
                    <a href="#reviews" className="rating">
                        <div className="stars">
                        {
                            [1,2,3,4,5].map((num) =>
                            <Fragment key={num}>
                                {
                                num < avgRating
                                ? <StarOutlinedIcon/>
                                : avgRating > num-1 && avgRating !== num-1
                                    ? <StarHalfOutlinedIcon/>
                                    : <StarOutlineOutlinedIcon/>
                                }
                            </Fragment>    
                            )
                        }
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

                                    <button method="submit" 
                                        onClick={() => {
                                            dispatch(addToCart({
                                                id: product.documentId,
                                                title: product.title,
                                                desc: product.description,
                                                price: product.price,
                                                img: product.img.url,
                                                stock: product.stock,
                                                quantity,
                                            }));
                                        }}
                                    >
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
                {/* to be implemented maybe */}
            </div>

            <div className="reviews" id="reviews">
                <Linebreak/>

                <div className="overall-rating">
                    <h1>Users rate this product:</h1>
                    <div className="stars">
                        {
                        [1,2,3,4,5].map((num) =>
                        <Fragment key={num}>
                            {
                            num < avgRating
                            ? <StarOutlinedIcon/>
                            : avgRating > num-1 && avgRating !== num-1
                                ? <StarHalfOutlinedIcon/>
                                : <StarOutlineOutlinedIcon/>
                            }
                        </Fragment>    
                        )   
                        }
                    </div>
                </div>

                <Linebreak/>

                <form className="submit-review" onSubmit={submitReview}>
                    <h1>Review this product</h1>
                    <>
                        <span>
                            <select name="stars" id="submit-stars" required>
                                <option value="5">5</option>
                                <option value="4.5">4.5</option>
                                <option value="4">4</option>
                                <option value="3.5">3.5</option>
                                <option value="3">3</option>
                                <option value="2.5">2.5</option>
                                <option value="2">2</option>
                                <option value="1.5">1.5</option>
                                <option value="1">1</option>
                                <option value="0">0</option>
                            </select>

                            <p>Stars</p>
                        </span>
                    </>

                    <>
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" id="submit-title" required/>
                    </>

                    <>
                        <label htmlFor="submit-review">Leave your review:</label>
                        <textarea name="review" id="submit-review" placeholder="Ex: this tie fit well!" /> 
                    </>

                    <input type="submit" />
                </form>

                <Linebreak/>
                
                <div className="user-reviews">
                    {product?.ratings?.length > 0 
                        ? product.ratings.map(rating => {

                            const totalStars = [];

                            const numStars = Math.floor(rating.value);
                            for (let i = 0; i < numStars; i++) {
                                totalStars.push(<StarOutlinedIcon/>);
                            }

                            const hasHalfStar = (rating.value*10).toString()[1] === '5';
                            if (hasHalfStar) totalStars.push(<StarHalfOutlinedIcon/>);

                            const numZeroStars = Math.floor(5 - rating.value);
                            for (let j = 0; j < numZeroStars; j++) {
                                totalStars.push(<StarOutlineOutlinedIcon/>);
                            }

                            return (
                                <div key={rating.id} className="product-rating">
                                    <p>{rating.reviewer}</p>
                                    <div className="stars">
                                        { totalStars.map((star, i) => <Fragment key={i}> { star } </Fragment>) }
                                    </div>
                                    <h1>{rating.title}</h1>
                                    <p>{rating.description}</p>
                                </div>
                            )
                        })
                        : <p>No reviews yet.</p>
                    }
                </div>
            </div>

        </>
    )
}