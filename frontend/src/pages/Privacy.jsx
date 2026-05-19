import Header from "../components/Header"
import Footer from "../components/Footer"

import React, { useEffect } from "react"

function Privacy() {
    useEffect(() => {
        document.title = "Privacy Policy | Knight Tech Labs";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Privacy policy for Knight Tech Labs, explaining how we collect and use your data.");
        }
    }, []);

    return (
        <div>

            <Header />

            <section className="page-content light-bg">
                <h1>Privacy Policy - Knight Tech Labs</h1>
                <p><strong>Last updated:</strong> <del>February 2026</del> April 2026</p>
                <br />
                <p>
                    Knight Tech Labs ("we", "our" or "us") respects your privacy and is
                    committed to protecting your personal information.
                </p>

                <h2>Information We Collect</h2>
                <p>We may collect limited information in the following ways:</p>

                <h3>Information You Provide</h3>
                <ul>
                    <li>Name (if submitted through forms)</li>
                    <li>Email address (for contact or support)</li>
                    <li>Any information voluntarily sent to us</li>
                </ul>


                <p>
                    This data is used only to improve website performance and user experience.
                </p>


                <h2>How We Use Information</h2>
                <p>Collected information may be used to:</p>

                <ul>
                    <li>Provide and maintain our services</li>
                    <li>Respond to inquiries and support requests</li>
                    <li>Improve website performance</li>
                    <li>Ensure security and prevent misuse</li>
                </ul>

                <p>
                    We do not sell, rent or trade personal information to third parties.
                </p>

                <h2>Third-Party Services</h2>
                <p>
                    Our website may use trusted third-party services such as hosting providers
                    or analytics tools. These services may collect information according to
                    their own privacy policies.
                </p>

                <h2>Data Security</h2>
                <p>
                    We take reasonable measures to protect information from unauthorized
                    access, alteration or disclosure.
                </p>

                <h2>Changes to This Policy</h2>
                <p>
                    We may update this Privacy Policy from time to time. Updates will be posted
                    on this page with a revised date.
                </p>

                <h2>Contact</h2>
                <p>
                    If you have any questions regarding this Privacy Policy, please contact:
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