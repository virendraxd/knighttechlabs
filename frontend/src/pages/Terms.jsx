import Header from '../components/Header'
import Footer from '../components/Footer'
import React, { useEffect } from 'react'

function Terms() {
    useEffect(() => {
        document.title = "Terms of Service | Knight Tech Labs - Usage Guidelines";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Terms of service for Knight Tech Labs, detailing usage guidelines, student responsibilities and legal disclaimers.");
        }
    }, []);

    return (
        <div>
            <Header />

            <section className="page-content light-bg">
                <h1>Terms of Service - Knight Tech Labs</h1>
                <p><strong>Last updated:</strong> May 22, 2026</p>
                <br />
                <p>
                    By accessing or using the Knight Tech Labs website or digital tools, you agree
                    to the following terms and conditions. These terms ensure a fair and secure experience for all students and creators.
                </p>

                <div className="info-card">
                    <h4>Ethical Use Policy</h4>
                    <p>Our tools are designed to assist in academic and creative workflows. We encourage all users to provide accurate information and respect the academic integrity guidelines of their respective institutions.</p>
                </div>

                <h2>1. Use of Services</h2>
                <p>You agree to use our website and tools only for lawful purposes. You must not:</p>

                <ul>
                    <li>Use the services for illegal activities or academic fraud.</li>
                    <li>Attempt to disrupt or damage the performance of the website.</li>
                    <li>Interfere with security features or circumvent tool limits.</li>
                    <li>Misuse or exploit any functionality, including automated scraping.</li>
                </ul>

                <h2>2. Intellectual Property</h2>
                <p>
                    All content on this website, including text, graphics, logos and
                    software, is the property of Knight Tech Labs. While you retain rights to the data you input, the underlying generation logic and design assets remain ours.
                </p>

                <h2>3. Disclaimer</h2>
                <p>
                    All services are provided "as is" without warranties of any kind. We do
                    not guarantee uninterrupted availability, accuracy of specific university templates, or suitability for high-stakes purposes without your final verification.
                </p>

                <h2>4. Limitation of Liability</h2>
                <p>
                    Knight Tech Labs shall not be liable for any direct, indirect or
                    consequential damages resulting from the use or inability to use our
                    services, including academic disputes or data loss.
                </p>

                <h2>5. External Links</h2>
                <p>
                    Our website may contain links to third-party academic resources or university portals. We are not
                    responsible for the content or practices of those external sites.
                </p>

                <div className="info-card">
                    <h4>Modifications</h4>
                    <p>We reserve the right to update these terms at any time. Continued use of the platform after changes constitutes your acceptance of the updated terms.</p>
                </div>

                <h2>6. Governing Law</h2>
                <p>
                    These terms shall be governed by applicable laws in your jurisdiction, ensuring a safe digital environment for all users.
                </p>

                <h2>Contact</h2>
                <p>For questions regarding these Terms or for reporting misuse:</p>

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
