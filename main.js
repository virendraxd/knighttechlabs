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

// AUTHENTICATION UI (NAVBAR)
window.updateAuthUI = function () {
  const loginBtn = document.getElementById("navLoginBtn");
  const profileBox = document.getElementById("navProfileBox");
  const emailObj = document.getElementById("navAccountEmail");
  const badgeObj = document.getElementById("navAccountBadge");

  // Read local cache to render instantly
  const cachedEmail = localStorage.getItem("ktl_user_email");
  const cachedPremium = localStorage.getItem("ktl_user_premium") === "true";
  
  // Decide login status based on either Firebase (if resolved) or Local Cache (if initial load)
  const isLogged = window.currentUser || cachedEmail;

  if (!isLogged) {
    profileBox?.classList.add("hidden");
    loginBtn?.classList.remove("hidden");
    return;
  }

  // Optimistically show user profile
  loginBtn?.classList.add("hidden");
  profileBox?.classList.remove("hidden");

  if (emailObj) {
    emailObj.textContent = window.currentUser ? window.currentUser.email : cachedEmail;
  }

  if (badgeObj) {
    const isPremium = window.currentUser ? window.isPremiumUser : cachedPremium;
    if (isPremium) {
      badgeObj.textContent = "Premium";
      badgeObj.className = "nav-account-badge nav-premium";
    } else {
      badgeObj.textContent = "Free";
      badgeObj.className = "nav-account-badge nav-standard";
    }
  }
};

// GLOBAL TOAST NOTIFICATION
window.showGlobalToast = function(msg, type = "info", duration = 3000) {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "global-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `global-toast toast-${type}`;
  toast.innerText = msg;

  container.appendChild(toast);

  // Animate in
  setTimeout(() => toast.classList.add("show"), 10);

  // Animate out
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

document.body.addEventListener("click", async (e) => {

  const loginBtn = e.target.closest("#navLoginBtn");
  const logoutBtn = e.target.closest("#navLogoutBtn");

  if (loginBtn) {
    if (window.triggerLoginOnly) {
      window.showGlobalToast("Please sign in with Google...", "info", 3000);

      const loggedIn = await window.triggerLoginOnly();

      if (loggedIn) {
        window.showGlobalToast("Signed in successfully! 🎉", "success", 4000);
        // Refresh page for secure UX after brief delay to show toast
        setTimeout(() => window.location.reload(), 1200);
      } else {
        window.showGlobalToast("Sign in canceled or failed.", "error", 4000);
      }
    }
  }

  if (logoutBtn) {
    if (window.logoutUser) {
      await window.logoutUser();
      window.showGlobalToast("Logged out securely. Refreshing...", "info");
      
      // Refresh page for secure UX
      setTimeout(() => window.location.reload(), 1200);
    }
  }
});

// Run auth updater immediately after `loadComponents.js` injects the navbar
window.addEventListener('componentsLoaded', () => {
  if (typeof window.updateAuthUI === "function") {
    window.updateAuthUI();
  }
});
