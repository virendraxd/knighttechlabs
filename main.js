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
window.updateAuthUI = async function () {
  const loginBtn = document.getElementById("navLoginBtn");
  const profileBox = document.getElementById("navProfileBox");
  const nameObj = document.getElementById("navAccountName");
  const emailObj = document.getElementById("navAccountEmail");
  const badgeObj = document.getElementById("navAccountBadge");
  const usageText = document.getElementById("navUsageText");

  // Read local cache for immediate render
  const cachedEmail = localStorage.getItem("ktl_user_email");
  const cachedName = localStorage.getItem("ktl_user_name") || "User";
  const cachedPremium = localStorage.getItem("ktl_user_premium") === "true";
  const isLogged = window.currentUser || cachedEmail;

  if (!isLogged) {
    profileBox?.classList.add("hidden");
    loginBtn?.classList.remove("hidden");
    return;
  }

  // Display profile avatar box
  loginBtn?.classList.add("hidden");
  profileBox?.classList.remove("hidden");

  // Populating Dropdown Details
  if (nameObj) nameObj.textContent = window.currentUser ? (window.currentUser.displayName || "User") : cachedName;
  if (emailObj) emailObj.textContent = window.currentUser ? window.currentUser.email : cachedEmail;

  const isPremium = window.currentUser ? window.isPremiumUser : cachedPremium;
  if (badgeObj) {
    badgeObj.textContent = isPremium ? "Premium" : "Free";
    badgeObj.className = "nav-account-badge " + (isPremium ? "nav-premium" : "nav-standard");
  }

  // Populating Usage Details (ONLY on UniCover page)
  const isUniCoverPage = window.location.pathname.includes("/products/unicover/");
  const usageContainer = usageText?.closest(".dropdown-body");

  if (usageText) {
    if (isUniCoverPage) {
      if (usageContainer) usageContainer.style.display = "block";
      if (isPremium) {
        usageText.textContent = "Unlimited Clean Downloads ✨";
      } else {
        let uId = window.currentUser ? window.currentUser.uid : window.getDeviceUserId();
        if (uId && window.getDownloadUsage) {
          const count = await window.getDownloadUsage(uId);
          const left = Math.max(0, 3 - count);
          usageText.textContent = `${left} free download${left !== 1 ? 's' : ''} left`;
        } else {
          usageText.textContent = "3 free downloads left";
        }
      }
    } else {
      // Hide entire body div on non-product pages to avoid empty padding
      if (usageContainer) usageContainer.style.display = "none";
    }
  }

  // Avatar Color
  const navAvatar = document.getElementById("navAvatar");
  let nameLenght = nameObj.innerHTML.trim();

  if (nameLenght.length % 2 == 0) {
    navAvatar.classList.add("even")
  }
  else {
    navAvatar.classList.add("odd")
  }
};

// GLOBAL TOAST NOTIFICATION
window.showGlobalToast = function (msg, type = "info", duration = 3000) {
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
  const avatarBtn = e.target.closest("#navAvatar");
  const dropdown = document.getElementById("navProfileDropdown");

  // Handle Avatar Toggle
  if (avatarBtn) {
    dropdown?.classList.toggle("show");
    e.stopPropagation(); // Avoid closing immediately
    return;
  }

  // Close dropdown if clicked outside
  if (dropdown?.classList.contains("show") && !e.target.closest("#navProfileBox")) {
    dropdown.classList.remove("show");
  }

  if (loginBtn) {
    if (window.triggerLoginOnly) {
      window.showGlobalToast("Please sign in with Google...", "info", 3000);

      const loggedIn = await window.triggerLoginOnly();

      if (loggedIn) {
        window.showGlobalToast("Signed in successfully! 🎉", "success", 4000);
      } else {
        window.showGlobalToast("Sign in canceled or failed.", "error", 4000);
      }
    }
  }

  if (logoutBtn) {
    if (window.logoutUser) {
      await window.logoutUser();
      window.showGlobalToast("Logged out securely.", "info");
    }
  }
});

// Run auth updater immediately after `loadComponents.js` injects the navbar
window.addEventListener('componentsLoaded', () => {
  if (typeof window.updateAuthUI === "function") {
    window.updateAuthUI();
  }
});

