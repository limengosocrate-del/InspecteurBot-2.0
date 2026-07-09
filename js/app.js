/* ==================================================================
   APP.JS — Contrôleur principal (extrait — LOT 1)
   ================================================================== */

// Horloge & date
function updateClock() {
  const now = new Date();
  const tEl = document.getElementById("currentTime");
  const dEl = document.getElementById("currentDate");
  if (tEl) tEl.textContent = now.toLocaleTimeString("fr-FR");
  if (dEl) dEl.textContent = now.toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long", year:"numeric"});
}
setInterval(updateClock, 1000); updateClock();

// Recherche globale (barre top)
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const q = searchInput.value.trim();
      if (!q) return;
      const r = AI_CORE.ask(q);
      alert(r.text); // temporaire — sera remplacé par un panneau dans LOT 3
    }
  });
}

// Bouton IA → ouvrir assistant (LOT 3)
const btnAssistant = document.getElementById("btnAssistant");
if (btnAssistant) btnAssistant.addEventListener("click", () => {
  window.location.href = "ia/assistant.html";
});

// Bouton Thème
const btnTheme = document.getElementById("btnTheme");
if (btnTheme) btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  localStorage.setItem("igt_theme", document.body.classList.contains("light-theme") ? "light" : "dark");
});
if (localStorage.getItem("igt_theme") === "light") document.body.classList.add("light-theme");

console.log("✅ InspecteurBot IA RDC 4.0 — LOT 1 chargé");
console.log("🧠 IA prête :", AI_CORE.name, "v" + AI_CORE.version);
