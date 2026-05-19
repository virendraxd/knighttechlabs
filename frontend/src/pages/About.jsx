import Header from '../components/Header'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

import React, { useEffect } from 'react'

function About() {
    useEffect(() => {
        document.title = "About | Knight Tech Labs";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Learn about Knight Tech Labs, our mission, values, and student productivity utilities.");
        }
    }, []);

    return (
        <div>
            {/* --- NAVBAR --- */}
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

                <h2>Our Mission</h2>
                <p>
                    To create reliable, user-friendly technology that makes everyday digital tasks
                    easier, faster and more efficient.
                </p>

                <h2>What We Build</h2>
                <p>
                    Knight Tech Labs develops lightweight applications and utilities, including:
                </p>

                <ul>
                    <li>Productivity tools</li>
                    <li>Educational software</li>
                    <li>Student-focused utilities</li>
                    <li>Web applications</li>
                    <li>Experimental projects and prototypes</li>
                </ul>

                <p>
                    Our flagship product includes tools like <strong><Link to="/products/unicover">UniCover</Link></strong>,
                    designed to simplify academic document creation.
                </p>

                <h2>Our Approach</h2>
                <p>We follow three core principles:</p>

                <ul>
                    <li><strong>Simplicity</strong> — Clean interfaces with minimal learning curve</li>
                    <li><strong>Performance</strong> — Fast and lightweight solutions</li>
                    <li><strong>Practical Impact</strong> — Tools built for real needs, not trends</li>
                </ul>

                <h2>Founder</h2>
                <p>
                    Knight Tech Labs was founded by <strong><a href="https://virendraxd.github.io/" target="_blank">Virendra
                        Singh</a></strong>, a student
                    developer passionate about creating useful technology and learning through
                    real-world projects.
                </p>

                <h2>Future Vision</h2>
                <p>
                    We aim to expand into a broader ecosystem of tools that support education,
                    productivity and digital creativity while remaining accessible to users worldwide.
                </p>

                <h2>Contact</h2>
                <p>
                    For inquiries, feedback or collaboration opportunities:
                </p>

                <p>
                    📧 <a href="mailto:devvirendrasingh@gmail.com" className="email">devvirendrasingh@gmail.com</a>
                </p>

                <hr />

                <p>© 2026 Knight Tech Labs. All rights reserved.</p>

            </section>

            {/* --- FOOTER --- */}
            <Footer />
        </div>
    )
}

export default About