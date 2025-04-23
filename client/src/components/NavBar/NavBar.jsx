import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';

import "./NavBar.css";
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { allowedCategories } from '../../stores/allowedCategories';
import { useSelector } from 'react-redux';

export default function NavBar() {

    const [open, setOpen]  = useState(false);

    const products = useSelector((state) => state.cart.products);


    const [toggleDropdown, setToggleDropdown] = useState(() => {
        return Object.keys(allowedCategories).map((cat) => {
            return [cat, false];
        });
    })

    const [mobileNav, setMobileNav] = useState(false);
    const [mobileAnimation, setMobileAnimation] = useState("close");

    function toggleMobileNav() {
        setMobileAnimation(prev => prev == "close" ? "open" : "close");

        setMobileNav(prev => {
            return !prev ? true : 
                setTimeout(() => {
                    return false;
                }, 300);
        })
        
    }

    function toggleCategory(category) {
        setToggleDropdown(prev => ({
            ...prev,
            [category]: !prev[category]
        }));
    }

    let id = 0;
    const navigationLinks = Object.keys(allowedCategories).map(cat => {
        return {
            id: id++,
            category: cat,
            subcategories: allowedCategories[cat]
        };
    });

    return ( 
        <nav className="navbar">

            {/* Desktop Links */}
            <div className="desktop-nav">

                <div className="category products">

                    {
                        navigationLinks.map(link => {
                            return (
                                <div key={link.id} className={link.category} 
                                    onMouseEnter={() => toggleCategory(link.category)}
                                    onMouseLeave={() => toggleCategory(link.category)}
                                >
                                    <Link className="link" to={link.category}> 
                                        {link.category[0].toUpperCase() + link.category.slice(1)}
                                        <KeyboardArrowDownIcon className="arrow"/>
                                    </Link>

                                    {toggleDropdown[link.category] &&
                                        <div className="dropdown-content">
                                            {   
                                                link.subcategories.map(subcat => 
                                                    <div key={link.id + "-" + subcat} className={`subcategory ${link.category + "-" + subcat}`}>
                                                        <Link className="link" to={link.category + "?type=" + subcat}>
                                                            {
                                                                subcat[0].toUpperCase() + subcat.slice(1)
                                                            }
                                                        </Link>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    }
                                </div>
                            )
                        })
                    }
                </div>

                <div className="category title">
                    <Link className="link" to="/"><h1>Tied & True</h1></Link>
                </div>
                
                <div className="category other">
                    <div className="search">
                        <SearchOutlinedIcon/>
                    </div>
                    <Link to="profile" className="link profile">
                        <PersonOutlineIcon/>
                    </Link>
                    <div className="favorite">
                        <FavoriteBorderIcon/>
                    </div>
                    <div className="cart">
                    <div className="cart" onClick={() => setOpen(!open)}>
                        <ShoppingCartOutlinedIcon/>
                        <span>{products.length}</span>
                    </div>
                </div>
            </div>
        </div>

            {/*Mobile Navbar*/}
            <div className="mobile-nav">
                    <div className="links">
                        <Link to="profile" className="link profile">
                            <PersonOutlineIcon/>
                        </Link>
                        <div className="search">
                            <SearchOutlinedIcon/>
                        </div>
                    </div>

                    <div className="title">
                        <Link className="link" to="/"><h1>Tied & True</h1></Link>
                    </div>

                    <div className="menu-button" onClick={toggleMobileNav}>
                        <MenuOutlinedIcon sx={{ width: 30, height: 30 }}/>

                        {mobileNav &&
                        <div className="mobile-products" style={{ animationName: mobileAnimation }}>
                            {
                            navigationLinks.map(link => {
                                return (
                                    <div key={link.id} className={link.category}>
                                        <Link className="link" to={`/${link.category}`}>
                                            <h1>
                                                {link.category[0].toUpperCase() + link.category.slice(1)}
                                                <ChevronRightOutlinedIcon/>
                                            </h1>
                                        </Link>

                                        {link.subcategories.map(subcat =>
                                            <div key={subcat} className="subcategory">
                                                <Link className="link" to={`/${link.category}?type=${subcat}`}>
                                                    {subcat[0].toUpperCase() + subcat.slice(1)}
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                )
                            })
                            }
                        </div>
                        }
                    </div>
                    {open && <Cart />}
            </div>
        </nav>
    );
};