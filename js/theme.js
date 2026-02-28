function initThemeToggle() {

  const btn = document.getElementById("themeToggle");
  if (!btn) return; // Button not loaded yet

  const saved = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", saved);

  btn.style.color = saved === "dark" ? "var(--text-primary)" : "var(--text-primary)";

  btn.onclick = () => {
    const current = document.documentElement.getAttribute("data-theme");

    const next = current === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);

    btn.style.color = next === "dark" ? "var(--text-primary)" : "var(--text-primary)";
  };
}

const interval = setInterval(() => {
  const btn = document.getElementById("themeToggle");
  if (btn) {
    clearInterval(interval);
    initThemeToggle();
  }
}, 100);