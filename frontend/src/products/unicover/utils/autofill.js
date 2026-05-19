export function autofillForm(setFormData) {
  const saved = localStorage.getItem("unicover_last_data");
  if (!saved) {
    if (window.showGlobalToast) {
      window.showGlobalToast("No saved details found");
    } else {
      alert("No saved details found");
    }
    return;
  }

  const data = JSON.parse(saved);

  setFormData((prev) => ({
    ...prev,
    ...data,
  }));

  if (window.showGlobalToast) {
    window.showGlobalToast("Details autofilled ✅", "success");
  }
}
