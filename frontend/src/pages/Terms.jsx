import Header from '../components/Header'
import Footer from '../components/Footer'

import React, { useEffect } from 'react'

function Terms() {
    useEffect(() => {
        document.title = "Terms of Service | Knight Tech Labs";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Terms of service for Knight Tech Labs, detailing usage guidelines, disclaimers and guidelines.");
        }
    }, []);

    return (
        <div>
            <Header />

            <section className="page-content light-bg">
                <h1>Terms of Service - Knight Tech Labs</h1>
                <p><strong>Last updated:</strong> February 2026</p>
                <br />
                <p>
                    By accessing or using the Knight Tech Labs website or services, you agree
                    to the following terms and conditions.
                </p>

                <h2>Use of Services</h2>
                <p>You agree to use our website and tools only for lawful purposes. You must not:</p>

                <ul>
                    <li>Use the services for illegal activities</li>
                    <li>Attempt to disrupt or damage the website</li>
                    <li>Interfere with security features</li>
                    <li>Misuse or exploit any functionality</li>
                </ul>

                <h2>Intellectual Property</h2>
                <p>
                    All content on this website, including text, graphics, logos and
                    software, is the property of Knight Tech Labs unless otherwise stated.
                    Unauthorized reproduction or distribution is prohibited.
                </p>

                <h2>Disclaimer</h2>
                <p>
                    All services are provided "as is" without warranties of any kind. We do
                    not guarantee uninterrupted availability, accuracy or suitability for
                    specific purposes.
                </p>

                <h2>Limitation of Liability</h2>
                <p>
                    Knight Tech Labs shall not be liable for any direct, indirect or
                    consequential damages resulting from the use or inability to use our
                    services.
                </p>

                <h2>External Links</h2>
                <p>
                    Our website may contain links to third-party websites. We are not
                    responsible for the content or practices of those sites.
                </p>

                <h2>Modifications</h2>
                <p>
                    We reserve the right to modify or discontinue any part of the services at
                    any time without notice.
                </p>

                <h2>Changes to Terms</h2>
                <p>
                    These Terms of Service may be updated periodically. Continued use of the
                    website after changes constitutes acceptance of the updated terms.
                </p>

                <h2>Governing Law</h2>
                <p>
                    These terms shall be governed by applicable laws in your jurisdiction.
                </p>

                <h2>Contact</h2>
                <p>For questions regarding these Terms:</p>

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
export default Terms