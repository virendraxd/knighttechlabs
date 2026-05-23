import { executePDFGeneration } from "../script.js";
import { triggerRazorpayPayment } from "../utils/payment.js";
import { AiOutlineStop } from "react-icons/ai";

function FreemiumModal({ formData }) {
  const handleClose = () => {
    const freemiumModal = document.getElementById("freemiumModal");
    if (freemiumModal) freemiumModal.classList.add("hidden");
    const downloadBtn = document.getElementById("downloadPdf");
    if (downloadBtn) downloadBtn.disabled = false;
  };

  const handleFree = async () => {
    const freemiumModal = document.getElementById("freemiumModal");
    if (freemiumModal) freemiumModal.classList.add("hidden");
    const downloadBtn = document.getElementById("downloadPdf");
    if (downloadBtn) downloadBtn.disabled = false;

    if (window.showGlobalToast) {
      window.showGlobalToast("Generating free watermarked PDF... 💧", "success");
    }

    if (window.saveCoverData) {
      await window.saveCoverData(formData, {
        razorpay_payment_id: "FREE_WATERMARK",
      });
    }

    await executePDFGeneration({ 
      setIsBtnSpinning: () => {}, 
      isWatermarked: true, 
      shouldIncrement: false 
    });
  };

  const handleSingle = async () => {
    const freemiumModal = document.getElementById("freemiumModal");
    if (freemiumModal) freemiumModal.classList.add("hidden");

    const downloadBtn = document.getElementById("downloadPdf");

    triggerRazorpayPayment(500, "Single Clean Download", async (response) => {
      if (window.showGlobalToast) {
        window.showGlobalToast("✅ Payment successful! Generating Clean PDF...", "success");
      }
      
      if (window.saveCoverData) {
        await window.saveCoverData(formData, response);
      }

      await executePDFGeneration({ 
        setIsBtnSpinning: () => {}, 
        isWatermarked: false, 
        shouldIncrement: false 
      });
      
      if (downloadBtn) downloadBtn.disabled = false;
    });
  };

  const handleUnlimited = async () => {
    const freemiumModal = document.getElementById("freemiumModal");

    // 1. Force Login FIRST securely
    if (typeof window.triggerLoginOnly === "function") {
      const loggedIn = await window.triggerLoginOnly();
      if (!loggedIn) {
        if (window.showGlobalToast) {
          window.showGlobalToast("Google Sign-In required to unlock Premium. 🔐", "warning", 4000);
        }
        const downloadBtn = document.getElementById("downloadPdf");
        if (downloadBtn) downloadBtn.disabled = false;
        return;
      }
    }

    if (freemiumModal) freemiumModal.classList.add("hidden");
    const downloadBtn = document.getElementById("downloadPdf");

    triggerRazorpayPayment(2900, "Unlimited Clean PDF Access", async (response) => {
      if (typeof window.markPremiumInDB === "function") {
        const upgraded = await window.markPremiumInDB();
        if (upgraded && window.showGlobalToast) {
          window.showGlobalToast("Premium Unlocked Successfully! 🎉", "success", 5000);
        }
      }

      if (window.saveCoverData) {
        await window.saveCoverData(formData, response);
      }
      
      await executePDFGeneration({ 
        setIsBtnSpinning: () => {}, 
        isWatermarked: false, 
        shouldIncrement: false 
      });
      
      if (downloadBtn) downloadBtn.disabled = false;
    });
  };

  return (
    <div id="freemiumModal" className="freemium-modal-overlay hidden">
      <div className="freemium-modal">

        <div className="fm-icon-header"><AiOutlineStop /></div>
        <h2>Free Limit Reached</h2>
        <p>You've used all <strong>10 free premium downloads</strong>. Choose how you'd like to continue:</p>

        <div className="freemium-divider">Your options</div>

        <div className="freemium-options">
          <button id="fmBtnFree" className="fm-btn fm-btn-free" onClick={handleFree}>
            <span className="fm-btn-badge" style={{ background: '#e2e8f0', color: '#64748b' }}>FREE</span>
            💧 Download with Watermark
            <span className="fm-subtext">Always free · Contains a "Created with UniCover" watermark</span>
          </button>

          <button id="fmBtnSingle" className="fm-btn fm-btn-single" onClick={handleSingle}>
            <span className="fm-btn-badge">₹5</span>
            ✨ Single Clean Download
            <span className="fm-subtext">No watermark · One-time, valid for this download only</span>
          </button>

          <button id="fmBtnUnlimited" className="fm-btn fm-btn-unlimited" onClick={handleUnlimited}>
            <span className="fm-btn-badge" style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>BEST ⭐</span>
            🚀 Unlock Unlimited Clean — ₹29
            <span className="fm-subtext">No watermark forever · Requires Google Sign-In</span>
          </button>
        </div>

        <button id="fmBtnClose" className="modal-close" onClick={handleClose}>Maybe later</button>
      </div>
    </div>
  )
}

export default FreemiumModal;