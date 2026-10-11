import React from 'react'
import CoverPage from './CoverPage'

function DownloadButton({ templateType, formData, setIsBtnSpinning, isBtnSpinning, setMissingFields, canDownloadFree, downloadPdf }) {
    return (
        <div>
 
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
    )
}

export default DownloadButton