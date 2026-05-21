import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { downloadPdf } from "./utils/download"
import { SETTINGS } from "./config"
import { initHelpWidget } from "../../js/help-widget.js"
import { checkResolvedIssues } from "../../js/support-system.js"

import Header from "../../components/Header"
import Footer from "../../components/Footer"
import TemplateSelector from "./components/TemplateSelector"
import Form from "./components/Form"
import CoverPage from "./components/CoverPage"
// import VUCover from "./components/VUCover"
// import AUCover from "./components/AUCover"
import FreemiumModal from "./components/FreemiumModal"
import Stats from "./components/Stats"

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
        document.title = "UniCover | Free Professional Cover Page Generator";
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
            metaDesc.setAttribute("content", "Generate clean, premium and print-ready assignment, practical and project report cover pages in seconds. Instant free PDF downloads.");
        }
        updateLimits();
        initHelpWidget();
        checkResolvedIssues();
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

        setMissingFields(prev => prev.filter(f => f !== name)); // Clear specific missing field warning on change
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };




    return (
        <div>
            <Header />

            <section className="product-main-section page-offset">
                <div className="unicover-content">
                    <h1>UniCover</h1>
                    <p>
                        Generate clean and professional Assignment / Practical / Project Cover Pages in seconds.
                    </p>
                </div>
            </section>

            <div id="messageBox" className="msg"></div>

            <div id="help"></div>

            <div id="logBox" className="log-box" style={{ display: "none" }}>
                <h3>Payment & Download Log</h3>
                <pre id="logContent"></pre>
                <button id="copyLogBtn">Copy Details</button>
            </div>

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
                                        <div className="pay-sub">UniCover by Virendraxd</div>
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


            <Stats />

            {/* ABOUT */}
            <section id="about-section" className="section-padding light-bg">
                <div className="section-title">
                    <h2>About</h2>
                    <p>
                        Knight Tech Labs is a small product studio focused on building
                        practical tools for students — nothing more, nothing less.
                    </p>
                    <Link to="/about" className="btn-about">Learn More →</Link>
                </div>
            </section>

            {/* DOWNLOAD LOADER */}
            <div id="downloadLoader" className="loader hidden">
                <div className="loader-ring"></div>
            </div>

            <FreemiumModal formData={formData} />

            <Footer />
        </div>
    )
}

export default Unicover