import {
    executePDFGeneration,
    getSelectedTemplateType,
    getOrCreateUserId,
} from "../script.js";
import { triggerRazorpayPayment } from "./payment.js";

import { saveFormData } from "./saveFormData.js";

let isGenerating = false;

export async function downloadPdf({
    setIsBtnSpinning,
    formData,
    setMissingFields,
    templateType,
}) {
    if (!formData) {
        console.error("formData missing");
        return;
    }
    // 🚫 Prevent spam clicks
    if (isGenerating) return;

    try {
        isGenerating = true;
        setIsBtnSpinning(true);

        // 💾 Save latest form data
        saveFormData(formData);

        const type = templateType || getSelectedTemplateType();

        //
        // =========================================================
        // ✍️ HAND TEMPLATE MODE
        // =========================================================
        //
        if (type === "hand") {

            const handRequired = [
                "institution",
                "session",
                "title",
                "position",
                "course",
                "stream",
                "year",
            ];

            const emptyFields = handRequired.filter(
                (key) => !formData[key]?.trim()
            );

            if (emptyFields.length > 0) {
                setMissingFields(emptyFields);
                if (window.showGlobalToast) {
                    window.showGlobalToast("⚠️ Please fill all required fields before downloading.", "warning");
                }
                const firstEl = document.querySelector(`[name="${emptyFields[0]}"]`);
                if (firstEl) {
                    firstEl.focus();
                    firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
                }
                return;
            }

            //
            // ⭐ PREMIUM USER
            //
            if (window.isPremiumUser) {

                if (window.showGlobalToast) {
                    window.showGlobalToast(
                        "Generating Premium Blank Template...",
                        "success",
                        2000
                    );
                }

                await executePDFGeneration({
                    isWatermarked: false,
                    shouldIncrement: false,
                });

                return;
            }

            //
            // 💳 PAID HAND TEMPLATE
            //
            triggerRazorpayPayment(
                1900,
                "Fill by Hand (Blank) Template",

                async () => {

                    await executePDFGeneration({
                        isWatermarked: false,
                        shouldIncrement: false,
                    });

                }
            );

            return;
        }

        //
        // =========================================================
        // 📄 AUTO FILLED TEMPLATE MODE
        // =========================================================
        //

        const requiredFields = [
            "institution",
            "session",
            "title",
            "subject",
            "faculty",
            "position",
            "studentName",
            "course",
            "stream",
            "year",
        ];

        const emptyFields = requiredFields.filter(
            (key) => !formData[key]?.trim()
        );

        if (emptyFields.length > 0) {
            setMissingFields(emptyFields);
            if (window.showGlobalToast) {
                window.showGlobalToast("⚠️ Please fill all required fields before downloading.", "warning");
            }
            const firstEl = document.querySelector(`[name="${emptyFields[0]}"]`);
            if (firstEl) {
                firstEl.focus();
                firstEl.scrollIntoView({ behavior: "smooth", block: "center" });
            }
            return;
        }

        //
        // ⭐ PREMIUM USER
        //
        if (window.isPremiumUser) {

            if (window.showGlobalToast) {
                window.showGlobalToast(
                    "Generating Premium Clean PDF...",
                    "success",
                    2000
                );
            }

            if (window.saveCoverData) {

                await window.saveCoverData(formData, {
                    razorpay_payment_id: "PREMIUM_USER",
                });

            }

            await executePDFGeneration({
                isWatermarked: false,
                shouldIncrement: false,
            });

            return;
        }

        //
        // 🎁 FREE DOWNLOAD LIMIT CHECK
        //
        if (window.checkDownloadLimit) {

            const userId = getOrCreateUserId();

            const canDownload =
                await window.checkDownloadLimit(userId);

            //
            // ✅ FREE DOWNLOAD AVAILABLE
            //
            if (canDownload) {

                console.log(
                    "✅ Limit Check Passed"
                );

                if (window.saveCoverData) {

                    await window.saveCoverData(formData, {
                        razorpay_payment_id: "FREE_MODE",
                    });

                }

                await executePDFGeneration({
                    isWatermarked: false,
                    shouldIncrement: true,
                });

                if (window.updateFreeDownloadsBar) {
                    window.updateFreeDownloadsBar();
                }

                return;
            }

            //
            // ❌ LIMIT EXCEEDED
            //
            if (window.updateFreeDownloadsBar) {
                window.updateFreeDownloadsBar();
            }

            const modalEl = document.getElementById("freemiumModal");
            if (modalEl) {
                modalEl.classList.remove("hidden");
            }

            return;
        }

        //
        // ⚠️ FALLBACK
        //
        await executePDFGeneration({
            isWatermarked: false,
            shouldIncrement: false,
        });

    } catch (error) {

        console.error("PDF Download Error:", error);

        if (window.showGlobalToast) {
            window.showGlobalToast(
                "❌ Failed to generate PDF"
            );
        }

    } finally {

        setIsBtnSpinning(false);

        isGenerating = false;

        console.log("✅ PDF process finished");
    }
}