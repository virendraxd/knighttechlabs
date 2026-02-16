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

      case "about":
        link.href = BASE + "#about";
        break;

      case "unicover":
        link.href = BASE + "products/unicover/index.html";
        break;
    }
  });
}
