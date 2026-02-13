async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(file);
  el.innerHTML = await res.text();
}

async function loadAll() {
  await loadComponent("header", "../../components/header.html");
  await loadComponent("footer", "../../components/footer.html");

  // Now safe to run page scripts
  if (typeof initPage === "function") {
    initPage();
  }
}

loadAll();
