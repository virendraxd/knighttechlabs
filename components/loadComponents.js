// 🔥 Detect correct base path automatically
function getBasePath() {
  const path = location.pathname;

  // If hosted on GitHub Pages repo
  if (path.includes("/knighttechlabs/")) {
    return "/knighttechlabs/";
  }

  // Localhost
  return "/";
}

const BASE = getBasePath();

async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(BASE + file);
  el.innerHTML = await res.text();
}

function setNavLinks() {
  const home = document.querySelector('[data-link="home"]');
  const products = document.querySelector('[data-link="products"]');
  const about = document.querySelector('[data-link="about"]');

  const path = location.pathname;

  // 🏠 Homepage
  if (path.endsWith("/") || path.endsWith("index.html")) {
    if (home) home.href = BASE + "index.html";
    if (products) products.href = BASE + "index.html#products";
    if (about) about.href = BASE + "index.html#about";
  }

  // 📦 Subpages
  else {
    if (home) home.href = BASE + "index.html";
    if (products) products.href = BASE + "index.html#products";
    if (about) about.href = BASE + "index.html#about";
  }
}

async function loadAll() {
  await loadComponent("header", "components/header.html");
  await loadComponent("footer", "components/footer.html");

  setNavLinks();
}

loadAll();
