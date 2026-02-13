async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(file);
  el.innerHTML = await res.text();
}

function setNavLinks() {
  const home = document.querySelector('[data-link="home"]');
  const products = document.querySelector('[data-link="products"]');
  const about = document.querySelector('[data-link="about"]');

  const path = location.pathname;

  // 🏠 Homepage
  if (path === "/" || path.includes("index.html")) {
    if (home) home.href = "index.html";
    if (products) products.href = "#products";
    if (about) about.href = "#about";
  }

  // 📦 Subpages (UniCover etc.)
  else {
    if (home) home.href = "/index.html";
    if (products) products.href = "/index.html#products";
    if (about) about.href = "/index.html#about";
  }
}

async function loadAll() {
  await loadComponent("header", "/components/header.html");
  await loadComponent("footer", "/components/footer.html");

  setNavLinks();
}

loadAll();
