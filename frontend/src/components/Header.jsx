import { Link } from "react-router-dom"
import '../js/global'
import { useContext, useRef, useState, useEffect } from "react"
import { ThemeContext } from "../context/ThemeContext"
import { useAuth } from "../context/AuthContext"

function Header() {
    const { theme, toggleTheme } = useContext(ThemeContext)
    const { user, login, logout } = useAuth();
    const [showDropdown, setShowDropdown] = useState(false);
    const profileBoxRef = useRef(null);

    const isLogged = !!user;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileBoxRef.current && !profileBoxRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div>
            <nav>
                <div className="logo">
                    <Link to="/"><div className="logo-name">Knight<span>Tech</span>Labs</div></Link>
                </div>

                <div className="nav-opt">
                    <div className="nav-links">
                        <Link to="/">Home</Link>
                        <Link to="/#products">Products</Link>
                        <Link to="/about">About</Link>
                    </div>

                    <div className="nav-actions">
                        {/* Auth UI */}
                        <div id="navAuthStatus" className="nav-auth-container">
                            {/* <button id="navLoginBtn" className="nav-link-btn" onClick={handleLogin}> */}
                            <button id="navLoginBtn" className={!isLogged ? "nav-link-btn" : "nav-link-btn hidden"} onClick={login}>
                                Login
                            </button>

                            <div ref={profileBoxRef} id="navProfileBox" className={!isLogged ? "nav-profile-box hidden" : "nav-profile-box"}>
                                {/* The clickable avatar */}
                                <div 
                                    id="navAvatar" 
                                    className="nav-user-icon" 
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <i className="fa-solid fa-user" style={{ color: "rgb(128 128 128)" }}></i>
                                </div>

                                <div id="navProfileDropdown" className={`nav-dropdown ${showDropdown && isLogged ? "show" : ""}`}>
                                    <div className="dropdown-header">
                                        <span id="navAccountName" className="dropdown-name">Loading...</span>
                                        <span id="navAccountEmail" className="dropdown-email">Loading...</span>
                                        <span id="navAccountBadge" className="nav-account-badge nav-standard">Free</span>
                                    </div>
                                    <div id="dropdownBody" className="dropdown-body">
                                        <div id="navUsageText" className="dropdown-usage">Loading limits...</div>
                                    </div>
                                    <div className="dropdown-footer">
                                        <button 
                                            id="navLogoutBtn" 
                                            className="dropdown-logout-btn"
                                            onClick={() => {
                                                logout();
                                                setShowDropdown(false);
                                                if (window.showGlobalToast) {
                                                    window.showGlobalToast("Logged out securely. 👋", "info");
                                                }
                                            }}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Theme */}
                        <button onClick={toggleTheme} id="themeToggle" className="theme-toggle" type="button">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="gray">
                                <path d="M21 12.79A9 9 0 0111.21 3
             7 7 0 0012 21a9 9 0 009-8.21z" />
                            </svg>
                        </button>

                        {/* Mobile */}
                        <button id="menu-btn">☰</button>
                    </div>
                </div>
            </nav>

            <div id="sidebar-overlay"></div>

            <div id="side-panel">
                <div className="side-panel-header">
                    <div className="logo">Knight<span>Tech</span>Labs</div>
                </div>
                <Link to="/">Home</Link>
                <Link to="/products">Products</Link>
                <Link to="/about">About</Link>
            </div>
        </div>
    )
}

export default Header