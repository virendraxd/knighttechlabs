import "../src/styles/global.css"
import "../src/styles/home.css"

import Header from "./components/Header"
import Footer from "./components/Footer"
import { Link } from "react-router-dom"

import React, { useEffect } from "react"

function Home() {
    useEffect(() => {
        document.title = "Knight Tech Labs | Student Utilities & Tools";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Knight Tech Labs builds premium, clean, and professional utilities for students. Use UniCover to generate print-ready cover pages.");
        }
    }, []);

    return (
        <div>
            {/* --- NAVBAR --- */}
            <Header />

            {/* HERO */}
            <header className="hero">
                <span className="badge">KnightTechLabs</span>

                <h1>
                    Simple tools for<br />
                    <span className="gradient-text">student productivity</span>
                </h1>

                <p>
                    We build focused tools that make academic work faster and easier.
                </p>

                <div className="cta-group">
                    <a href="#products" className="btn-primary">Explore</a>
                </div>
            </header>

            {/* PRODUCTS */}
            <section id="products" className="section-padding light-bg">
                <div className="section-title">
                    <h2>Products</h2>
                    <p>Built for clarity, speed and real use.</p>
                </div>


                <div className="grid">
                    <div className="card">
                        <span className="tag">Utility</span>
                        <span className="ribbon-popular">Most Popular</span>

                        <h3>UniCover</h3>
                        <p>
                            Generate clean, professional university assignment
                            cover pages in seconds.
                        </p>
                        <Link to="products/unicover" className="view-link">Open UniCover</Link>
                    </div>

                    <div className="card">
                        <span className="tag">Utility</span>
                        {/* <span className="ribbon-popular">Most Popular</span> */}

                        <h3>Bulk Bg Remover</h3>
                        <p>
                            AI-powered background removal for multiple images with batch resizing.
                        </p>
                        <Link to="products/bulk_bg_remover" className="view-link">Open Bulk Bg Remover</Link>
                    </div>

                    <div className="card">
                        <span className="tag">Utility</span>

                        <h3>Resume Builder</h3>
                        <p>
                            Create simple, clean and professional resumes that stand out.
                        </p>
                        <a 
                            href="#" 
                            className="view-link muted no-drop"
                            onClick={(e) => {
                                e.preventDefault();
                                if (window.showGlobalToast) window.showGlobalToast("Resume Builder coming soon! 🚀", "info");
                            }}
                        >
                            Coming Soon
                        </a>
                    </div>


                </div>
            </section>

            {/* --- ABOUT --- */}
            <section id="about-section" className="section-padding">
                <div className="section-title">
                    <h2>About</h2>

                    <p>
                        Knight Tech Labs is a small product studio focused on building
                        practical tools for students — nothing more, nothing less.
                    </p>

                    <Link to="/about" className="btn-about">
                        Learn More →
                    </Link>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <Footer />

        </div>
    )
}

export default Home