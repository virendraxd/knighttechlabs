function getBasePath() {
  const isGitHub = location.hostname.includes("github.io");

  if (isGitHub) {
    return "/knighttechlabs/"; // your repo name
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
}

loadAll();
