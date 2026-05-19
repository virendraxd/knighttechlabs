import { addLog, getOrCreateUserId } from "../script.js";

export async function triggerRazorpayPayment(amountInPaise, description, onSuccessCallback) {
  const coverStudent = document.getElementById("coverStudent");
  const studentName = coverStudent?.innerText || "Student";
  const userId = getOrCreateUserId();

  try {
    addLog("⏳ Initiating secure payment...");

    // Open Razorpay Checkout
    const rzpOptions = {
      key: "rzp_live_SFfynYVohQVMSU", // Sandbox/Live Key 
      amount: amountInPaise,
      currency: "INR",
      name: "UniCover by Virendraxd",
      description: description,
      prefill: {
        name: window.currentUser?.displayName || studentName,
        email: window.currentUser?.email || "student@example.com",
        contact: "9999999999"
      },
      theme: { color: "#3399cc" },
      handler: async function (response) {
        const logBox = document.getElementById("logBox");
        if (logBox) logBox.style.display = "block";
        addLog("✅ Payment Successful!");
        addLog("Payment ID: " + response.razorpay_payment_id);

        await onSuccessCallback(response);
      }
    };

    if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded on window.");
    }

    const rzp = new window.Razorpay(rzpOptions);
    rzp.on('payment.failed', function (res) {
      console.error("Payment failed", res.error);
      if (window.showGlobalToast) window.showGlobalToast("Payment failed! Please try again.", "error");
    });
    rzp.open();

  } catch (err) {
    console.error("Payment Initiation Error:", err);
    if (window.showGlobalToast) window.showGlobalToast("Could not open payment gateway. Please try again.", "error");
  }
}
