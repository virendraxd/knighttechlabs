import React, { useEffect } from 'react'
import VUCover from './VUCover'
import AUCover from './AUCover'
import '../styles.css'

function CoverPage({ formData, templateType }) {
    
    useEffect(() => {
        function scaleCoverToFit() {
            const container = document.getElementById("previewSection");
            if (!container) return;

            const cover = container.querySelector(".cover-page");

            // Don't scale if elements are missing or hidden
            if (!cover || window.getComputedStyle(container).display === 'none') {
                return;
            }

            // A4 dimensions at 96 DPI (standard for most browsers)
            const a4Width = 794;
            const a4Height = 1123;

            // Use clientWidth for the actual available content space (excluding borders/scrollbars)
            const containerWidth = container.clientWidth;

            // If container width is 0, it might be hidden or still rendering; skip for now
            if (containerWidth <= 0) return;

            if (containerWidth < a4Width) {
                // MOBILE/TABLET VIEW: Scale down to fit the width
                const scale = containerWidth / a4Width;

                // Apply scale transformation
                cover.style.transformOrigin = "top left";
                cover.style.transform = `scale(${scale})`;

                // Center the scaled cover if there's any remaining fractional space
                const scaledWidth = a4Width * scale;
                const leftOffset = Math.max(0, (containerWidth - scaledWidth) / 2);
                cover.style.marginLeft = `${leftOffset}px`;

                // Calculate total height needed including the preview note
                const note = container.querySelector(".preview-note");
                const noteHeight = note ? note.offsetHeight + 15 : 0; // 15px is the margin-bottom from CSS

                // Update container height to match scaled content + note + some padding
                container.style.height = `${(a4Height * scale) + noteHeight + 30}px`;

                // Compensate for the layout space still taken by the unscaled element
                // This "pulls up" the bottom of the document flow
                cover.style.marginBottom = `-${a4Height * (1 - scale)}px`;
            } else {
                // DESKTOP VIEW: No scaling needed, just center it
                cover.style.transform = "none";
                cover.style.transformOrigin = "top center";
                cover.style.marginLeft = "0";
                cover.style.marginBottom = "0";
                container.style.height = "auto";
            }
        }

        // Run scaling initially
        scaleCoverToFit();

        // Add event listeners
        window.addEventListener("resize", scaleCoverToFit);

        // Set up ResizeObserver for the preview container to scale immediately on any UI/layout change
        let resizeObserver = null;
        const previewSectionEl = document.getElementById("previewSection");
        if (previewSectionEl && window.ResizeObserver) {
            resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(scaleCoverToFit);
            });
            resizeObserver.observe(previewSectionEl);
        }

        return () => {
            window.removeEventListener("resize", scaleCoverToFit);
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [formData, templateType]);

    if (!formData.institution) {
        return null;
    }

    return (
        <div className="page" id="previewSection" style={{ display: 'block' }}>
            <p className="preview-note">
                ✨ Watermark removed on download • Actual cover may vary
            </p>

            {/* Render ONLY the selected institution's cover */}
            {formData.institution === "vu" && <VUCover formData={formData} templateType={templateType} />}
            {formData.institution === "au" && <AUCover formData={formData} templateType={templateType} />}
        </div>
    )
}

export default CoverPage