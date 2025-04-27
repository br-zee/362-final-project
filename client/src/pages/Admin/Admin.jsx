import "./Admin.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { makeRequest } from "../../makeRequest";

export default function Admin() {
    const navigate = useNavigate();
    const submitBtn = useRef(null);

    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [types, setTypes] = useState([]);
    const [colors, setColors] = useState([]);

    const [loading, setLoading] = useState(false);
    const [invalid, setInvalid] = useState({});
    const [success, setSuccess] = useState({});

    const user = JSON.parse(localStorage.getItem("data"));
    if (user.role.type !== 'authenticated') navigate("");

    function handleSubmit(e) {
        e.preventDefault();
        setSuccess({});
        setInvalid({});
        setLoading(true);

        submitBtn.disabled = true;
        // submitBtn.style.background = 'gray';
        
        const title = e.target.title.value;
        const description = e.target.description.value;
        const img = e.target.img.files;
        const price = parseInt(e.target.price.value);
        const type = e.target.type.options[e.target.type.selectedIndex].value
        const color = e.target.color.options[e.target.color.selectedIndex].value;
        const stock = parseInt(e.target.stock.value);

        const checkedCategories = Array.from(e.target.querySelectorAll("input[name='categories']:checked"))
            .map(cb => parseInt(cb.value));

        const checkedSubcategories = Array.from(e.target.querySelectorAll("input[name='subcategories']:checked"))
            .map(cb => parseInt(cb.value));

        const data = {
            title,
            description,
            price,
            type,
            color,
            stock,
            categories: checkedCategories.map(id => ({ id })),
            sub_categories: checkedSubcategories.map(id => ({ id }))
        };
        

        const formData = new FormData();
        try {
            formData.append("files", img[0], img[0].title);
        }
        catch(err) {
            setInvalid({
                msg: "Unsupported/invalid image!"
            })
            return;
        }

        makeRequest.post("/products", { data })
        .then(res => {
            const docId = res.data.data.documentId;

            makeRequest.post(`/upload`, formData)
            .then(res => {
                const imgId = res.data[0].id
                makeRequest.put(`/products/${docId}`, {
                    data: {
                        img: imgId,
                    }
                })
                .then(res => setSuccess({
                    msg: "Product has been uploaded!",
                }))
                .catch(err => setInvalid({
                    msg: "Error linking image to product. Try again later",
                }))
            })
            .catch(err => setInvalid({
                msg: "Error uploading image. Try again later.",
            }))
        })
        .catch(err => setInvalid({
            msg: "Error uploading product. All fields must be filled out."
        }));

        setLoading(false);
        e.target.reset();
    
    }

    useEffect(() => {
        makeRequest.get("/categories?fields[0]=title")
        .then(response => setCategories(response.data.data))
        .catch(error => console.log(error));

        makeRequest.get("/sub-categories?fields[0]=title")
        .then(response => setSubcategories(response.data.data))
        .catch(error => console.log(error));

        makeRequest.get("/content-type-builder/content-types/api::product.product?populate=*")
        .then(response => {
            setTypes(response.data.data.schema.attributes.type.enum);
            setColors(response.data.data.schema.attributes.color.enum);
        })
        .catch(error => console.log(error));
    }, [])

    return (
        <div className="admin-content">
            <Link to="/profile"><button><p>Back</p></button></Link>
            <form className="admin-form" action="" method="POST" onSubmit={handleSubmit}>
                <fieldset>
                    <legend><h1>Add New Product</h1></legend>

                    <div className="form-group title">
                        <label htmlFor="title">Title</label>
                        <input type="text" name="title" id="title" required />
                    </div>

                    <div className="form-group description">
                        <label htmlFor="description">Description</label>
                        <input type="text" name="description" id="description" required />
                    </div>
                    
                    <div className="form-group img">
                        <label htmlFor="img">Image</label>
                        <input type="file" name="img" id="img" required />
                    </div>

                    <div className="form-group price">
                        <label htmlFor="price">Price</label>
                        <span>$<input type="number" name="price" id="price" min="0" required /></span>
                    </div>

                    <div className="form-group categories">
                        <p>Categories</p>
                        <div className="items">
                            {
                                categories?.map(cat =>
                                    <div key={cat.title} className="checkbox">
                                        <input type="checkbox" name="categories" id={cat.title} value={cat.id} />
                                        <label htmlFor={cat.title}>{cat.title[0].toUpperCase() + cat.title.slice(1)}</label>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="form-group sub-categories">
                        <p>Sub-categories</p>
                        <div className="items">
                            {
                                subcategories?.map(subcat =>
                                    <div key={subcat.title} className="checkbox">
                                        <input type="checkbox" name="subcategories" id={subcat.title} value={subcat.id} />
                                        <label htmlFor={subcat.title}>{subcat.title[0].toUpperCase() + subcat.title.slice(1)}</label>
                                    </div>    
                                )
                            }
                        </div>
                    </div>

                    <div className="form-group type">
                        <label htmlFor="type">Type</label>
                        <select type="text" name="type" id="type" required>
                            {
                                types.map(type =>
                                    <option key={type} value={type}>{type[0].toUpperCase() + type.slice(1)}</option>
                                )
                            }
                        </select>
                    </div>

                    <div className="form-group color">
                        <label htmlFor="color">Color</label>
                        <select type="text" name="color" id="color" required>
                            {
                                colors.map(color =>
                                    <option key={color} value={color}>{color[0].toUpperCase() + color.slice(1)}</option>
                                )
                            }
                        </select>
                    </div>

                    <div className="form-group stock">
                        <label htmlFor="stock">Stock</label>
                        <input type="number" name="stock" id="stock" min="0" required />
                    </div>
                    
                    <div className="submit">
                        <input className="submit" type="submit" ref={submitBtn} />
                        {loading && <p>Submitting... please wait.</p>}
                        {success && <p className="submit-msg success">{success?.msg}</p>}
                        {invalid && <p className="submit-msg invalid">{invalid?.msg}</p>}
                    </div>

                </fieldset>
            </form>
        </div>
    )
}