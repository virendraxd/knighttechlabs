import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import React, { useEffect } from 'react'

function About() {
    useEffect(() => {
        document.title = "About Us | Knight Tech Labs - Student-First Technology";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Discover the mission behind Knight Tech Labs. We build clean, high-performance tools like UniCover and Bulk Bg Remover to help students succeed.");
        }
    }, []);

    return (
        <div>
            <Header />

            <section className="page-content light-bg">
                <h1>About - Knight Tech Labs</h1>

                <p>
                    <strong>Knight Tech Labs</strong> is an independent technology initiative focused on building simple,
                    practical digital tools that solve real-world problems for students, creators
                    and everyday users.
                </p>

                <p>
                    We believe powerful software does not need to be complicated. Our goal is to
                    design tools that are fast, intuitive and accessible to everyone — even on
                    low-end devices.
                </p>

                <div className="info-card">
                    <h4>The "People-First" Core</h4>
                    <p>Everything we build follows three simple rules: it must be fast, it must be intuitive and it must provide immediate value. No unnecessary sign-ups and no AI fluff.</p>
                </div>

                <h2>Our Mission</h2>
                <p>
                    To create reliable, user-friendly technology that makes everyday digital tasks
                    easier, faster and more efficient. We aim to bridge the gap between complex technology and everyday academic needs.
                </p>

                <h2>What We Build</h2>
                <p>
                    Knight Tech Labs develops lightweight applications and utilities, including:
                </p>

                <ul>
                    <li><strong>Productivity Tools:</strong> Focused utilities to speed up your workflow.</li>
                    <li><strong>Educational Software:</strong> Standardized document generators.</li>
                    <li><strong>Student Utilities:</strong> Presets and templates for global universities.</li>
                    <li><strong>Web Applications:</strong> Browser-based tools with zero installation.</li>
                </ul>

                <p>
                    Our flagship products include tools like <strong><Link to="/products/unicover">UniCover</Link></strong> and <strong><Link to="/products/bulk_bg_remover">Bulk Background Remover</Link></strong>,
                    designed to automate repetitive chores.
                </p>

                <h2>Our Approach</h2>
                <p>We follow three core principles to ensure academic success:</p>

                <ul>
                    <li><strong>Simplicity</strong> — Clean interfaces with minimal learning curve.</li>
                    <li><strong>Performance</strong> — Fast and lightweight solutions for any device.</li>
                    <li><strong>Practical Impact</strong> — Tools built for real needs, not trends.</li>
                </ul>

                <div className="info-card" style={{background: 'var(--navy)', color: 'white'}}>
                    <h4 style={{color: 'var(--cyan)'}}>Our Philosophy</h4>
                    <p style={{color: 'rgba(255,255,255,0.8)', fontStyle: 'italic'}}>"Simplicity is the ultimate sophistication." — Leonardo da Vinci</p>
                </div>

                <h2>Founder</h2>
                <p>
                    Knight Tech Labs was founded by <strong><a href="https://virendraxd.github.io/" target="_blank" rel="noopener noreferrer">Virendra
                        Singh</a></strong>, a student
                    developer passionate about creating useful technology and learning through
                    real-world projects.
                </p>

                <h2>Future Vision</h2>
                <p>
                    We aim to expand into a broader ecosystem of tools that support education,
                    productivity and digital creativity while remaining accessible to users worldwide.
                </p>

                <h2>Contact & Feedback</h2>
                <p>
                    We value your feedback and tool requests. If there's a utility you wish existed to help with your studies, we'd love to hear about it.
                </p>

                <p>
                    📧 <a href="mailto:devvirendrasingh@gmail.com" className="email">devvirendrasingh@gmail.com</a>
                </p>

                <hr />

                <p>© 2026 Knight Tech Labs. Built with precision and passion for students everywhere.</p>
            </section>

            <Footer />
        </div>
    )
}

export default About
