// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
      .scrollIntoView({ behavior: "smooth" });
  });
});

function initPage() {
  console.log("Page initialized after components loaded");
}

function applySettingsUI() {

  const discountSection = document.getElementById("discountSection");
  const payMain = document.getElementById("payMain");
  const paySecondary = document.getElementById("paySecondary");
  // const paymentBox = document.getElementById("paymentBox");

  // Hide discount section
  if (!SETTINGS.ENABLE_DISCOUNT) {
    if (discountSection) discountSection.remove();
  }

  // Switch payment UI
  if (!SETTINGS.PAYMENT_ENABLED) {
    if (payMain) payMain.style.display = "none";
    if (paySecondary) paySecondary.style.display = "block";
  }

  // if (!SETTINGS.PAYMENT_ENABLED && !SETTINGS.ENABLE_DISCOUNT) {
  //   if (paymentBox) paymentBox.style.border = "none";
  // }
}