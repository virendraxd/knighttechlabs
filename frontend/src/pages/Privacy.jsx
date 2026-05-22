import Header from "../components/Header"
import Footer from "../components/Footer"
import React, { useEffect } from "react"

function Privacy() {
    useEffect(() => {
        document.title = "Privacy Policy | Knight Tech Labs - Secure Data Processing";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Our commitment to your privacy. Learn how Knight Tech Labs handles your data with secure, client-side processing and local AI.");
        }
    }, []);

    return (
        <div>
            <Header />

            <section className="page-content light-bg">
                <h1>Privacy Policy - Knight Tech Labs</h1>
                <p><strong>Last updated:</strong> May 22, 2026</p>
                <br />
                <p>
                    Knight Tech Labs ("we", "our" or "us") respects your privacy and is
                    committed to protecting your personal information. This policy outlines our commitment to data minimization and secure document generation.
                </p>

                <div className="info-card">
                    <h4>Local Processing Guarantee</h4>
                    <p>Our primary design philosophy is to process data <strong>locally on your device</strong>. Whether you are generating a cover page in UniCover or removing backgrounds in our Bulk BG Remover, your data often never even reaches our servers.</p>
                </div>

                <h2>Information We Collect</h2>
                <p>We may collect limited information in the following ways:</p>

                <h3>1. Information You Provide</h3>
                <ul>
                    <li><strong>Voluntary Info:</strong> Name and email address if submitted through contact forms or support requests.</li>
                    <li><strong>Tool Data:</strong> Details like Roll No and Institution names are used in real-time to generate your PDFs and are not stored permanently in our database for anonymous users.</li>
                </ul>

                <h3>2. Technical Logs</h3>
                <p>Standard server logs including IP addresses and browser types to ensure security and prevent platform misuse.</p>

                <h2>How We Use Information</h2>
                <p>Collected information is used only to:</p>

                <ul>
                    <li>Provide and maintain our productivity services.</li>
                    <li>Respond to inquiries and support requests efficiently.</li>
                    <li>Improve website performance and tool accuracy.</li>
                    <li>Ensure platform security and prevent automated misuse.</li>
                </ul>

                <p>
                    We do not sell, rent or trade student or creator information to third parties.
                </p>

                <h2>Third-Party Services</h2>
                <p>
                    Our platform utilizes trusted services to enhance your experience:
                </p>
                <ul>
                    <li><strong>Vercel:</strong> For fast, global website hosting.</li>
                    <li><strong>Firebase:</strong> For optional secure authentication.</li>
                    <li><strong>Razorpay:</strong> For processing premium feature payments securely.</li>
                </ul>

                <h2>Data Security</h2>
                <p>
                    We take industry-standard measures to protect information from unauthorized
                    access. Because we favor client-side AI and browser-based PDF generation, the risk of data exposure is significantly minimized.
                </p>

                <h2>Contact</h2>
                <p>
                    If you have any questions regarding this Privacy Policy or how your data is handled, please contact:
                </p>

                <p>
                    📧 <a href="mailto:devvirendrasingh@gmail.com">devvirendrasingh@gmail.com</a>
                </p>

                <hr />

                <p>© 2026 Knight Tech Labs. All rights reserved.</p>
            </section>

            <Footer />
        </div>
    )
}
export default Privacy
