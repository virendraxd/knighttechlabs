function getBasePath() {
  const path = location.pathname;

  // If inside /knighttechlabs/
  if (path.startsWith("/knighttechlabs/")) {
    return "/knighttechlabs/"; // repo name
  }

  return "/"; // localhost
}


const BASE = getBasePath();

async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(BASE + file);
  el.innerHTML = await res.text();
}

async function loadAll() {
  await loadComponent("header", "components/header.html");
  await loadComponent("footer", "components/footer.html");

  applyDataLinks(); // ⭐ APPLY TO BOTH HEADER + FOOTER
  initMobileMenu(); // ⭐ INIT MOBILE MENU (AFTER HEADER LOAD)
  initThemeToggle();

  if (typeof fixNavForUniCover === "function") {
    fixNavForUniCover();
  }
}

loadAll();

function applyDataLinks() {
  const links = document.querySelectorAll("[data-link]");

  links.forEach(link => {
    const type = link.dataset.link;

    switch (type) {
      case "home":
        link.href = BASE + "index.html";
        break;

      case "products":
        link.href = BASE + "#products";
        break;

      case "unicover":
        link.href = BASE + "products/unicover/index.html";
        break;

      case "about-section":
        link.href = "#about-section"; // not use BASE here
        break;

      case "about":
        link.href = BASE + "pages/about.html";
        break;

      case "privacy":
        link.href = BASE + "pages/privacy_policy.html";
        break;

      case "terms":
        link.href = BASE + "pages/terms.html";
        break;
    }
  });
}

function initMobileMenu() {
  const menuBtn = document.getElementById("menu-btn");
  const sidePanel = document.getElementById("side-panel");
  const overlay = document.getElementById("sidebar-overlay");

  if (!menuBtn || !sidePanel) return; // safety check

  // Open panel
  menuBtn.onclick = () => {
    sidePanel.classList.add("active");
    if (overlay) overlay.classList.add("active");
  };

  // Close when clicking overlay
  if (overlay) {
    overlay.addEventListener("click", () => {
      sidePanel.classList.remove("active");
      overlay.classList.remove("active");
    });
  }

  // Close when clicking outside
  document.addEventListener("click", e => {
    if (
      sidePanel.classList.contains("active") &&
      !sidePanel.contains(e.target) &&
      !menuBtn.contains(e.target)
    ) {
      sidePanel.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
    }
  });

  // Close when a link inside panel is clicked
  const links = sidePanel.querySelectorAll("a");

  links.forEach(link => {
    link.addEventListener("click", () => {
      sidePanel.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
    });
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      sidePanel.classList.remove("active");
      if (overlay) overlay.classList.remove("active");
    }
  });

}

