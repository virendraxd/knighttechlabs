import { SETTINGS } from "../config";

export function applySettingsUI() {

  const discountSection = document.getElementById("discountSection");
  const payMain = document.getElementById("payMain");
  const paySecondary = document.getElementById("paySecondary");

  if (!SETTINGS.enableDiscount) {
    if (discountSection) discountSection.remove();
  }

  if (!SETTINGS.paymentEnabled) {
    if (payMain) payMain.style.display = "none";
    if (paySecondary) paySecondary.style.display = "block";
  }
}
