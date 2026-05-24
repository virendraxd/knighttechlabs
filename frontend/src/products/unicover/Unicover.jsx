import { useState, useEffect } from "react"
import { downloadPdf } from "./utils/download"
import { SETTINGS } from "./config"
import { initHelpWidget } from "../../js/help-widget.js"
import { checkResolvedIssues } from "../../js/support-system.js"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import TemplateSelector from "./components/TemplateSelector"
import Form from "./components/Form"
import CoverPage from "./components/CoverPage"
import FreemiumModal from "./components/FreemiumModal"
import Stats from "./components/Stats"
import UnicoverSEOContent from "./components/UnicoverSEOContent"

import "./styles.css"
import "./config.js"
import "./script.js"

function Unicover({ }) {

    const [isBtnSpinning, setIsBtnSpinning] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    const [templateType, setTemplateType] = useState("auto");
    const [canDownloadFree, setCanDownloadFree] = useState(true);

    const updateLimits = async () => {
        const userId = window.currentUser?.uid || window.getDeviceUserId();
        if (typeof window.getFreeDownloadsRemaining === "function") {
            const remaining = await window.getFreeDownloadsRemaining(userId);
            setCanDownloadFree(remaining > 0);
        }
    };

    useEffect(() => {
        // --- SEO & META OPTIMIZATION ---
        document.title = "UniCover | Free Professional University Assignment Cover Page Generator";

        const metaDesc = document.querySelector('meta[name="description"]');
        const metaKeyword = document.querySelector('meta[name="keywords"]');

        if (metaDesc) {
            metaDesc.setAttribute("content", "Generate clean, premium and print-ready assignment, practical and project report cover pages in seconds. Instant free PDF downloads for university students.");
        }
        if (metaKeyword) {
            metaKeyword.setAttribute("content", "UniCover, assignment cover page generator, project report cover page, practical file cover page, university cover page, free PDF cover page, student assignment tools")
        }

        // --- FAQ SCHEMA INJECTION ---
        const schemaId = 'unicover-faq-schema';
        if (!document.getElementById(schemaId)) {
            const script = document.createElement('script');
            script.id = schemaId;
            script.type = 'application/ld+json';
            script.innerHTML = JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "How can I generate an assignment cover page for free?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "You can use Knight Tech Labs' UniCover tool to generate professional assignment cover pages for free. Simply select your university template, enter your details like name and subject and download the print-ready PDF instantly."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Do I need to sign up to use the cover page maker?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "No account is required for standard use. You can fill in your information and download your cover page without any registration."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Are the PDF cover pages print-ready?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes, all cover pages are generated as high-resolution PDFs perfectly formatted for A4 size paper, making them ready for instant printing."
                        }
                    }
                ]
            });
            document.head.appendChild(script);
        }

        updateLimits();
        initHelpWidget();
        checkResolvedIssues();

        return () => {
            const existingSchema = document.getElementById(schemaId);
            if (existingSchema) existingSchema.remove();
        };
    }, []);

    useEffect(() => {
        if (templateType === "auto" && typeof window.updateFreeDownloadsBar === "function") {
            window.updateFreeDownloadsBar();
        }
    }, [templateType]);

    const [formData, setFormData] = useState({
        institution: "",
        session: "",
        title: "",
        subject: "",
        faculty: "",
        position: "",
        studentName: "",
        course: "",
        stream: "",
        year: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setMissingFields(prev => prev.filter(f => f !== name));
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="unicover-page">
            <Header />

            <main>
                {/* HERO & INTRODUCTION */}
                <section className="product-main-section page-offset">
                    <div className="unicover-content">
                        <h1>UniCover</h1>
                        <p>
                            The #1 tool for generating professional Assignment, Practical and Project Report Cover Pages.
                        </p>
                        <div className="cta-group" style={{ marginTop: '2rem' }}>
                            <a href="#tool-main" className="btn-primary">Get Started Now ↓</a>
                        </div>
                    </div>
                </section>

                <div id="messageBox" className="msg"></div>
                <div id="help"></div>

                <div id="logBox" className="log-box" style={{ display: "none" }}>
                    <h3>Payment & Download Log</h3>
                    <pre id="logContent"></pre>
                    <button id="copyLogBtn">Copy Details</button>
                </div>

                {/* HIGH-VALUE CONTENT BEFORE TOOL */}
                <section className="content-section">
                    <div className="section-title">
                        <h2>Academic Excellence Starts with a Great Cover</h2>
                        <p>
                            A well-structured cover page is more than just a requirement; it shows your dedication and attention to detail.
                            Our generator helps thousands of students daily to create official-looking covers.
                        </p>
                    </div>
                </section>

                <div id="tool-main">
                    <TemplateSelector templateType={templateType} setTemplateType={setTemplateType} />

                    <main className="unicover-layout">
                        {/* LEFT SIDE: FORM */}
                        <div className="form-area">
                            <Form formData={formData} setFormData={setFormData} handleChange={handleChange} missingFields={missingFields} setIsBtnSpinning={setIsBtnSpinning} templateType={templateType} />
                            <form id="coverForm">
                                <div className="payment-box" id="paymentBox">
                                    {/* ACCESS CODE */}
                                    {SETTINGS.enableAccessCode && (
                                        <div className="input-group" id="accessGroup">
                                            <label>Access Code</label>
                                            <div className="input-with-icon">
                                                <span>🔐</span>
                                                <input type="text" id="accessKey" placeholder="Enter access code" />
                                            </div>
                                        </div>
                                    )}

                                    {/* DISCOUNT */}
                                    {SETTINGS.enableDiscount && (
                                        <div className="input-group" id="discountSection">
                                            <label>Discount Code</label>
                                            <div className="discount-row">
                                                <input type="text" id="discountCode" placeholder="Enter coupon code" />
                                                <button type="button" id="applyDiscount">Apply</button>
                                            </div>
                                            <div className="discount-note">
                                                🎁 Limited offer — Use code <b>SAVE5</b> and pay only ₹5
                                            </div>
                                        </div>
                                    )}

                                    {templateType === "auto" && !window.isPremiumUser && (
                                        <div id="freeDownloadsBar" className="free-downloads-bar">
                                            <span id="freeDownloadsText">🎁 10/10 free premium downloads remaining</span>
                                        </div>
                                    )}

                                    {/* PAY BUTTON */}
                                    <button type="button" id="downloadPdf" disabled={isBtnSpinning} className="pay-btn" onClick={() => downloadPdf({ setIsBtnSpinning, formData, setMissingFields, templateType })}>
                                        {isBtnSpinning ? (
                                            <div className="btn-spinner" id="btnSpinner">
                                                <span className="btn-spinner-ring"></span>
                                                <span className="btn-spinner-text">Generating...</span>
                                            </div>
                                        ) : (
                                            <div id="btnContent" className="btn-content">
                                                <div className="pay-main" id="payMain" style={{ display: "flex" }}>
                                                    <span className="pay-title">
                                                        {templateType === "hand"
                                                            ? "Download Cover"
                                                            : (window.isPremiumUser || canDownloadFree ? "Download Cover" : "Pay & Download Cover")}
                                                    </span>
                                                    {templateType === "hand" && !window.isPremiumUser && (
                                                        <span className="price-badge" style={{ display: "inline-block" }}>₹19</span>
                                                    )}
                                                </div>
                                                <div className="pay-sub">UniCover by Knight Tech Labs</div>
                                            </div>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="note">
                                <p>
                                    📄 Official-style format • 🖨️ Print-ready • ⏱️ Instant download
                                </p>
                            </div>
                        </div>

                        {/* RIGHT SIDE: PREVIEW */}
                        <CoverPage formData={formData} templateType={templateType} />
                    </main>
                </div>

                <Stats />

                {/* COMPREHENSIVE SEO CONTENT SECTION */}
                <UnicoverSEOContent />

                {/* DOWNLOAD LOADER */}
                <div id="downloadLoader" className="loader hidden">
                    <div className="loader-ring"></div>
                </div>

                <FreemiumModal formData={formData} />
            </main>

            <Footer />
        </div >
    )
}

export default Unicover