async function loadComponent(id, file) {
  const el = document.getElementById(id);
  if (!el) return;

  const res = await fetch(file);
  const html = await res.text();
  el.innerHTML = html;
}

/* Detect if page is inside /products/ */
const basePath =
  location.pathname.includes("/products/")
    ? "../../components/"
    : "components/";

/* Load components */
loadComponent("header", basePath + "header.html");
loadComponent("footer", basePath + "footer.html");
