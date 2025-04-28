import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import CloseIcon from '@mui/icons-material/Close';

import "./NavBar.css";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { allowedCategories } from '../../stores/allowedCategories';
import { useSelector } from 'react-redux';
import { Cart } from "../../components/Cart/Cart";

export default function NavBar() {

    const products = useSelector((state) => state.cart.products);
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [toggleDropdown, setToggleDropdown] = useState(() => {
        return Object.keys(allowedCategories).map((cat) => {
            return [cat, false];
        });
    })
    const [mobileNav, setMobileNav] = useState(false);
    const [mobileAnimation, setMobileAnimation] = useState("close");

    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const searchRef = useRef(null);

    // Close search when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setShowSearch(false);
        }
    };

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
                
                <div className="category other" ref={searchRef}>
                    {showSearch ? (
                        <form onSubmit={handleSearch} className="search-form">
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                                autoFocus
                            />
                            <button type="submit" className="search-submit">
                                <SearchOutlinedIcon />
                            </button>
                            <button 
                                type="button" 
                                className="search-close"
                                onClick={() => setShowSearch(false)}
                            >
                                <CloseIcon />
                            </button>
                        </form>
                    ) : (
                        <div className="search-icon" onClick={() => setShowSearch(true)}>
                            <SearchOutlinedIcon/>
                        </div>
                    )}
                    <Link to="profile" className="link profile">
                        <PersonOutlineIcon/>
                    </Link>
                    <div className="favorite">
                        <FavoriteBorderIcon/>
                    </div>
                    <div className="shopping-cart" onClick={() => {
                        const userData = JSON.parse(localStorage.getItem("data"));
                        userData ? setOpen(!open) : navigate("/login");
                    }}>
                        <ShoppingCartOutlinedIcon/>
                        <span>{products.length}</span>
                    </div>
                </div>
            </div>

            {/*Mobile Navbar*/}
            <div className="mobile-nav">
                    <div className="links">
                        <Link to="profile" className="link profile">
                            <PersonOutlineIcon/>
                        </Link>
                        <div className="search" 
                            onClick={() => {
                                toggleMobileNav();
                                setShowSearch(true);
                            }}>
                            <SearchOutlinedIcon/>
                        </div>
                        <div className="shopping-cart" onClick={() => setOpen(!open)}>
                            <ShoppingCartOutlinedIcon/>
                            <span>{products.length}</span>
                        </div>
                    </div>

                    <div className="title">
                        <Link className="link" to="/"><h1>Tied & True</h1></Link>
                    </div>

                    <div className="menu-button" onClick={toggleMobileNav}>
                        <MenuOutlinedIcon sx={{ width: 30, height: 30 }}/>

                        {mobileNav &&
                        <div className="mobile-products" style={{ animationName: mobileAnimation }}>

                            {showSearch && (
                                <form onSubmit={handleSearch} className="mobile-search-form">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="search-input"
                                        autoFocus
                                    />
                                    <button type="submit" className="search-submit">
                                        <SearchOutlinedIcon />
                                    </button>
                                    <button 
                                        type="button" 
                                        className="search-close"
                                        onClick={() => setShowSearch(false)}
                                    >
                                        <CloseIcon />
                                    </button>
                                </form>
                            )}
                            
                            {navigationLinks.map(link => {
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
            </div>

            {open && <Cart />}

        </nav>
    );
};