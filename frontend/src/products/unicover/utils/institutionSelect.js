const universitySelect = document.getElementById("university");
const previewSection = document.getElementById("previewSection");

export function institutionSelect() {

    if (universitySelect) {
        universitySelect.addEventListener("change", () => {

            const selectedUni = universitySelect.value;

            // ⭐ If nothing selected → disable inputs and hide preview
            if (!selectedUni) {
                disableFormInputs();
                previewSection.style.display = "none";
                resetTheme();
                return;
            }

            // ⭐ Show preview and enable inputs when university selected
            enableFormInputs();
            previewSection.style.display = "block";

            const uni = UNIVERSITY_CONFIG[selectedUni];
            if (!uni) return;

            // Switch covers
            document.querySelectorAll(".cover-page")
                .forEach(c => c.classList.add("hidden"));

            const coverPage = document.getElementById(uni.coverId);
            coverPage.classList.remove("hidden");

            // Change preview image
            document.getElementById("coverPreview").src = uni.preview;

            // Apply theme colors
            applyTheme(uni);

            // Trigger scaling after a short delay for layout to settle
            setTimeout(scaleCoverToFit, 50);
        });
    }
}
