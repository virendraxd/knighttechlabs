import React, { useEffect } from "react"
import { Link } from "react-router-dom"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Ribbons from "./components/Ribbons"
import "../src/styles/global.css"
import "../src/styles/home.css"
import "../src/styles/ribbons.css"

function Home() {
    useEffect(() => {
        // --- SEO & META OPTIMIZATION ---
        document.title = "Knight Tech Labs | Premium Student Utilities & Productivity Tools";

        const metaDesc = document.querySelector('meta[name="description"]');
        const metaKeywords = document.querySelector('meta[name="keywords"]');

        if (metaDesc) {
            metaDesc.setAttribute("content", "Knight Tech Labs builds clean, professional utilities for students and creators. From UniCover to Bulk Bg Remover, we simplify your academic workflow.");
        }
        if (metaKeywords) {
            metaKeywords.setAttribute("content", "Knight Tech Labs, student tools, productivity tools, online utilities, UniCover, bulk background remover, academic tools, creator tools");
        }

        // --- BRAND SCHEMA INJECTION ---
        const schemaId = 'ktl-brand-schema';
        if (!document.getElementById(schemaId)) {
            const script = document.createElement('script');
            script.id = schemaId;
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Knight Tech Labs",
                "url": "https://knighttechlabs.vercel.app/",
                "logo": "https://knighttechlabs.vercel.app/ktl-favicon.png",
                "description": "A student-focused product studio building professional utilities like UniCover and Bulk Background Remover.",
                "sameAs": [
                    "https://github.com/virendraxd"
                ]
            });
            document.head.appendChild(script);
        }

        return () => {
            const existingSchema = document.getElementById(schemaId);
            if (existingSchema) existingSchema.remove();
        };
    }, []);

    return (
        <div>
            <Header />

            <main>
                {/* HERO */}
                <header className="hero">
                    <span className="badge">KnightTechLabs</span>
                    <h1>
                        Simple tools for<br />
                        <span className="gradient-text">work & productivity</span>
                    </h1>
                    <p>
                        Fast utilities for students, creators and professionals.
                    </p>
                    <div className="cta-group">
                        <a href="#products" className="btn-primary">Explore Products</a>
                    </div>
                </header>

                {/* WHY US - CONTENT SECTION */}
                <section className="content-section">
                    <div className="section-title">
                        <h2>Designed for Real Students</h2>
                        <p>
                            At Knight Tech Labs, we don't just build scripts; we build experiences.
                            Every tool is tested to ensure it solves actual academic pain points.
                        </p>
                    </div>
                    <div className="feature-grid">
                        <div className="feature-item">
                            <i className="fas fa-bolt"></i>
                            <h3>Fast & Lightweight</h3>
                            <p>Our tools are optimized to run smoothly even on low-end devices and slow connections.</p>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-shield-alt"></i>
                            <h3>Privacy Focused</h3>
                            <p>Most of our processing happens locally in your browser. Your data stays yours.</p>
                        </div>
                        <div className="feature-item">
                            <i className="fas fa-check-circle"></i>
                            <h3>Always Free</h3>
                            <p>Essential productivity tools should be accessible to every student, regardless of budget.</p>
                        </div>
                    </div>
                </section>

                {/* PRODUCTS */}
                <section id="products" className="content-section alt-bg">
                    <div className="section-title">
                        <h2>Our Tools</h2>
                        <p>Built for clarity, speed and professional output.</p>
                    </div>

                    <div className="grid">
                        <Link to="products/unicover" className="card">
                            <span className="tag">Academic</span>
                            <Ribbons title="Most Popular" type="popular" />
                            <h3>UniCover</h3>
                            <p>
                                Generate clean, professional university assignment
                                cover pages in seconds. Instant print-ready PDFs.
                            </p>
                            <span className="view-link">Open UniCover</span>
                        </Link>

                        <Link to="products/bulk_bg_remover" className="card">
                            <span className="tag">Utility</span>
                            <Ribbons title="New Release" type="new" />
                            <h3>Bulk Bg Remover</h3>
                            <p>
                                AI-powered background removal for multiple images with batch resizing.
                                Process up to 100 images at once.
                            </p>
                            <span className="view-link">Open Bulk Bg Remover</span>
                        </Link>

                        <div
                            className="card"
                            onClick={(e) => {
                                if (window.showGlobalToast) window.showGlobalToast("Resume Builder coming soon! 🚀", "info");
                            }}
                        >
                            <span className="tag">Career</span>
                            <h3>Resume Builder</h3>
                            <p>
                                Create simple, clean and professional resumes that stand out.
                                Industry-standard formats.
                            </p>
                            <span className="view-link muted no-drop">Coming Soon</span>
                        </div>
                    </div>
                </section>

                {/* MISSION SECTION */}
                <section className="content-section">
                    <div className="mission-box">
                        <h2>Our Mission</h2>
                        <p>
                            "To empower every student with high-performance tools that bridge the gap between effort and excellence.
                            We believe academic success should be accessible, professional and entirely free of clutter."
                        </p>
                        <Link to="/about" className="btn-primary" style={{ marginTop: '2rem' }}>Learn More About Us →</Link>
                    </div>
                </section>

                {/* PRODUCTIVITY HUB */}
                <section className="content-section alt-bg">
                    <div className="section-title">
                        <h2>Mastering Academic Productivity</h2>
                        <p>Practical guides to help you make the most of your student life.</p>
                    </div>
                    <div className="feature-grid">
                        <div className="feature-item" style={{ background: 'var(--white)' }}>
                            <h4 style={{ color: 'var(--cyan)', marginBottom: '1rem', fontWeight: '800' }}>Grade Boosters</h4>
                            <p>Learn how professional formatting in UniCover can improve your presentation score by up to 10%.</p>
                        </div>
                        <div className="feature-item" style={{ background: 'var(--white)' }}>
                            <h4 style={{ color: 'var(--purple)', marginBottom: '1rem', fontWeight: '800' }}>Time Savers</h4>
                            <p>Discover how batch processing in our Bulk Background Remover saves hours of manual work for portfolio building.</p>
                        </div>
                        <div className="feature-item" style={{ background: 'var(--white)' }}>
                            <h4 style={{ color: 'var(--pink)', marginBottom: '1rem', fontWeight: '800' }}>Digital Kit</h4>
                            <p>Essential utilities for students who want to build a high-performance digital workspace for free.</p>
                        </div>
                    </div>
                </section>

                {/* QUICK FAQ */}
                <section className="content-section">
                    <div className="section-title">
                        <h2>General Questions</h2>
                    </div>
                    <div className="faq-container">
                        <details className="faq-item">
                            <summary>Are all tools truly free?</summary>
                            <p>Yes! All our core tools are free for student use. We believe in supporting education without financial barriers.</p>
                        </details>
                        <details className="faq-item">
                            <summary>Do I need to create an account?</summary>
                            <p>No. You can use most of our tools anonymously. We only require accounts for cloud-saving features.</p>
                        </details>
                        <details className="faq-item">
                            <summary>Is my data secure?</summary>
                            <p>Absolutely. We prioritize local processing, meaning your sensitive academic data often never leaves your browser.</p>
                        </details>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

export default Home
