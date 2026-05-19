import { SETTINGS } from "../config";
import "../script"

// =================-- discount here --=================
const discountInput = document.getElementById("discountCode");
const applyDiscountBtn = document.getElementById("applyDiscount");
const priceBadge = document.querySelector(".price-badge");

let appliedPrice = SETTINGS.price; // default price
let appliedCode = null;

if (SETTINGS.enableDiscount && applyDiscountBtn && discountInput) {

  applyDiscountBtn.addEventListener("click", () => {

    const code = discountInput.value.trim().toUpperCase();

    if (!code) {
      if (window.showGlobalToast) window.showGlobalToast("Enter a discount code.");
      return;
    }

    const coupon = SETTINGS.discountCodes[code];

    if (!coupon) {
      if (window.showGlobalToast) window.showGlobalToast("❌ Invalid discount code", "error");
      return;
    }

    let newPrice = SETTINGS.price;

    if (coupon.type === "percent") {
      newPrice = SETTINGS.price - (SETTINGS.price * coupon.value / 100);
    }

    if (coupon.type === "flat") {
      newPrice = SETTINGS.price - coupon.value;
    }

    newPrice = Math.max(newPrice, 0);

    appliedPrice = newPrice;
    appliedCode = code;

    const priceBadge = document.querySelector(".price-badge");
    if (priceBadge) {
      priceBadge.textContent = "₹" + (appliedPrice / 100);
    }

    if (window.showGlobalToast) window.showGlobalToast("✅ Discount applied!", "success");
  });
}

if (SETTINGS.enableDiscount && discountInput && priceBadge) {

  discountInput.addEventListener("input", () => {
    if (!discountInput.value.trim()) {
      appliedPrice = SETTINGS.price;
      appliedCode = null;
      priceBadge.textContent = `₹${SETTINGS.price / 100}`;
    }
  });
}
