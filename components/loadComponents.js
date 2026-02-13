async function loadComponent(id, file) {
  const res = await fetch(file);
  const html = await res.text();
  document.getElementById(id).innerHTML = html;

  if (id === "header") {
    fixHeaderLinks();
  }
}

function fixHeaderLinks() {
  // How deep is the current page?
  const depth = location.pathname.split("/").length - 2;

  let base = "";
  for (let i = 0; i < depth; i++) base += "../";

  document.querySelector('[data-link="home"]').href = base + "index.html";
  document.querySelector('[data-link="products"]').href = base + "index.html#products";
  document.querySelector('[data-link="about"]').href = base + "index.html#about";
}

loadComponent("header", "/knighttechlabs/components/header.html");
loadComponent("footer", "/knighttechlabs/components/footer.html");