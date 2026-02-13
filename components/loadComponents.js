async function loadComponent(id, file) {
  const container = document.getElementById(id);
  if (!container) return;

  const res = await fetch(file);
  const html = await res.text();
  container.innerHTML = html;

  if (id === "header") {
    fixHeaderLinks();
  }
}

function fixHeaderLinks() {
  const depth = location.pathname.split("/").length - 2;

  let base = "";
  for (let i = 0; i < depth; i++) base += "../";

  const home = document.querySelector('[data-link="home"]');
  const products = document.querySelector('[data-link="products"]');
  const about = document.querySelector('[data-link="about"]');

  if (home) home.href = base + "knighttechlabs/index.html";
  if (products) products.href = base + "index.html#products";
  if (about) about.href = base + "index.html#about";
}

// ⭐ IMPORTANT — use project path
loadComponent("header", "/knighttechlabs/components/header.html");
loadComponent("footer", "/knighttechlabs/components/footer.html");
