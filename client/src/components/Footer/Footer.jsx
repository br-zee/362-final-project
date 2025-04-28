import { Link } from "react-router-dom"
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";
import "./Footer.scss"

export default function Footer() {
    return (
        <footer className="footer">

            <div className="main-content">
                <div className="help-links">
                    <h1>Help</h1>
                    <Link className="link" to=""><p>Contact Us</p></Link>
                    <Link className="link" to=""><p>FAQ</p></Link>
                </div>
                <div className="subscribe">
                    <h1>Subscribe</h1>
                    <p>Get reminders about any new products and receive our daily newsletter</p>
                    <form className="footer-form" action="POST" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" name="email" id="email" placeholder="Email Address"/>
                        <input type="submit" />
                    </form>
                </div>
                <div className="social-media">
                    <h1>Follow us:</h1>
                    <div className="social-media-links">
                    <a href="https://www.facebook.com" target="_blank" className="social-media-link facebook">
                        <FaFacebook />
                    </a>
                    <a href="https://www.twitter.com" target="_blank" className="social-media-link twitter">
                        <FaTwitter />
                    </a>
                    <a href="https://www.instagram.com" target="_blank" className="social-media-link instagram">
                        <FaInstagram />
                    </a>
                    </div>
                    
                </div>
            </div>

            <p className="copyright">Copyright 2025 - CPSC362 Group 17</p>
        </footer>
    )
}