import React, { useEffect } from 'react'

import VUCover from './covers/VUCover'
import AUCover from "./covers/AUCover"
import LPUCover from "./covers/LPUCover"

import '../styles.css'

function CoverPage({ formData, templateType }) {

    // All covers registry in one place
    const COVER_COMPONENTS = {
        vu: VUCover,
        au: AUCover,
        lpu: LPUCover,
    };

    // Get selected cover component dynamically
    const SelectedCover = COVER_COMPONENTS[formData.institution];

    useEffect(() => {

        function scaleCoverToFit() {
            const container = document.getElementById("previewSection");
            if (!container) return;

            const cover = container.querySelector(".cover-page");

            if (!cover || window.getComputedStyle(container).display === "none") {
                return;
            }

            // A4 size
            const a4Width = 794;
            const a4Height = 1123;

            const containerWidth = container.clientWidth;

            if (containerWidth <= 0) return;

            if (containerWidth < a4Width) {

                const scale = containerWidth / a4Width;

                cover.style.transformOrigin = "top left";
                cover.style.transform = `scale(${scale})`;

                const scaledWidth = a4Width * scale;
                const leftOffset = Math.max(
                    0,
                    (containerWidth - scaledWidth) / 2
                );

                cover.style.marginLeft = `${leftOffset}px`;

                const note = container.querySelector(".preview-note");

                const noteHeight = note
                    ? note.offsetHeight + 15
                    : 0;

                container.style.height =
                    `${(a4Height * scale) + noteHeight + 30}px`;

                cover.style.marginBottom =
                    `-${a4Height * (1 - scale)}px`;

            } else {

                cover.style.transform = "none";
                cover.style.transformOrigin = "top center";
                cover.style.marginLeft = "0";
                cover.style.marginBottom = "0";
                container.style.height = "auto";
            }
        }

        // Initial scale
        scaleCoverToFit();

        // Resize listener
        window.addEventListener("resize", scaleCoverToFit);

        // Resize observer
        let resizeObserver = null;

        const previewSectionEl =
            document.getElementById("previewSection");

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

    // No institution selected
    if (!formData?.institution) {
        return null;
    }

    return (
        <div
            className="page"
            id="previewSection"
            style={{ display: "block" }}
        >

            <p className="preview-note">
                ✨ Watermark removed on download • Actual cover may vary
            </p>

            {/* ✅ Dynamic cover rendering */}
            {SelectedCover ? (
                <SelectedCover
                    formData={formData}
                    templateType={templateType}
                />
            ) : (
                <div className="unsupported-cover">
                    Cover template not available
                </div>
            )}

        </div>
    )
}

export default CoverPage