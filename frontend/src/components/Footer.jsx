import { Link } from 'react-router-dom'

function Footer() {
    return (
        <div>
            <footer id="contact" className="site-footer">

                <div className="footer-container">

                    {/* BRAND */}
                    <div className="footer-brand">
                        <div className="logo white">Knight<span>Tech</span>Labs</div>
                        <p>Simple tools. Real impact.</p>
                    </div>

                    {/* PRODUCTS */}
                    <div className="footer-links">
                        <h4>Products</h4>
                        <Link to="/products/unicover">UniCover</Link>
                        <Link to="/products/bulk_bg_remover">Bulk Background Remover</Link>
                        <a 
                            href="#" 
                            onClick={(e) => { 
                                e.preventDefault(); 
                                if (window.showGlobalToast) window.showGlobalToast("Resume Builder coming soon! 🚀", "info"); 
                            }}
                        >
                            Resume Builder
                        </a>
                    </div>

                    {/* COMPANY */}
                    <div className="footer-links">
                        <h4>Company</h4>
                        <Link to="/about" data-link="about">About</Link>
                        <Link to="/privacy" data-link="privacy">Privacy Policy</Link>
                        <Link to="/terms" data-link="terms">Terms</Link>
                    </div>

                    {/* CONTACT */}
                    <div className="footer-contact">
                        <h4>Contact</h4>
                        <a href="mailto:devvirendrasingh@gmail.com" className="email">
                            devvirendrasingh@gmail.com
                        </a>
                    </div>

                </div>

                <div className="footer-bottom">
                    © 2026 Knight Tech Labs. All rights reserved.
                </div>

            </footer>
        </div>
    )
}

export default Footer