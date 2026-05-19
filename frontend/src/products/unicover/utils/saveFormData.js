
export function saveFormData(formData) {
  localStorage.setItem(
    "unicover_last_data",
    JSON.stringify(formData)
  );
}