/* ==================================================================
   APP.JS — Contrôleur principal FINAL (LOTS 1+2+3+4)
   ================================================================== */

// ==================== HORLOGE ====================
function updateClock() {
  const now = new Date();
  const t = document.getElementById("currentTime");
  const d = document.getElementById("currentDate");
  if (t) t.textContent = now.toLocaleTimeString("fr-FR");
  if (d) d.textContent = now.toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long", year:"numeric"});
}
setInterval(updateClock, 1000); updateClock();

// ==================== MÉTÉO (simplifié) ====================
async function loadWeather() {
  const el = document.getElementById("weather");
  if (!el) return;
  try {
    const p = await new Promise((res, rej) => 
      navigator.geolocation.getCurrentPosition(res, rej, {timeout:5000}));
    const r = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${p.coords.latitude}&longitude=${p.coords.longitude}&current_weather=true`);
    const d = await r.json();
    el.textContent = `${Math.round(d.current_weather.temperature)}°C`;
  } catch { el.textContent = "N/A"; }
}
loadWeather();

// ==================== RECHERCHE GLOBALE ====================
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const q = searchInput.value.trim();
      if (!q) return;
      // Redirige vers la recherche juridique IA
      window.location.href = "juridique/recherche-ia.html?q=" + encodeURIComponent(q);
    }
  });
}

// ==================== BOUTONS TOOLBAR ====================
const routes = {
  btnAssistant: "ia/assistant.html",
  btnCamera:    "autres/qrcode.html",
  btnCalendar:  "autres/historique.html",
  btnMap:       "autres/gps.html",
  btnStats:     "autres/statistiques.html",
  btnHistory:   "ia/assistant.html"
};
Object.entries(routes).forEach(([id, url]) => {
  const btn = document.getElementById(id);
  if (btn) btn.addEventListener("click", () => window.location.href = url);
});

// Bouton Voix
const btnVoice = document.getElementById("btnVoice");
if (btnVoice) btnVoice.addEventListener("click", () => {
  if (typeof ASSISTANT !== "undefined") {
    ASSISTANT.startVoice(
      txt => {
        if (searchInput) { searchInput.value = txt; searchInput.dispatchEvent(new KeyboardEvent("keypress", {key:"Enter"})); }
      },
      err => alert("Vocal : " + err)
    );
  } else window.location.href = "ia/assistant.html";
});

// Bouton Export global
const btnExport = document.getElementById("btnExport");
if (btnExport) btnExport.addEventListener("click", () => {
  const data = {
    decomptes: JSON.parse(localStorage.getItem("igt_decomptes") || "[]"),
    missions: JSON.parse(localStorage.getItem("igt_missions") || "[]"),
    conversations: JSON.parse(localStorage.getItem("igt_ai_memory") || "[]"),
    exportDate: new Date().toISOString(),
    version: "4.0-premium"
  };
  const blob = new Blob([JSON.stringify(data,null,2)], {type:"application/json"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `inspecteurbot_export_${Date.now()}.json`;
  a.click();
});

// Bouton Update
const btnUpdate = document.getElementById("btnUpdate");
if (btnUpdate) btnUpdate.addEventListener("click", () => {
  if (confirm("🔄 Vider le cache et recharger l'application ?")) {
    if ('caches' in window) caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
    location.reload(true);
  }
});

// Bouton Thème
const btnTheme = document.getElementById("btnTheme");
if (btnTheme) btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  localStorage.setItem("igt_theme", document.body.classList.contains("light-theme") ? "light" : "dark");
});
if (localStorage.getItem("igt_theme") === "light") document.body.classList.add("light-theme");

// ==================== SÉLECTEUR LANGUE ====================
const TRANSLATIONS = {
  fr: { dashboard: "TABLEAU DE BORD INTELLIGENT" },
  en: { dashboard: "INTELLIGENT DASHBOARD" },
  ln: { dashboard: "ETANDA YA MOSALA YA MAYELE" },
  kg: { dashboard: "KISALASALA YA MAYELE" },
  ts: { dashboard: "TSHIBIDILU TSHIA LUNGENYI" },
  sw: { dashboard: "DASHBOARD YA AKILI" }
};
const lang = document.getElementById("langSwitcher");
if (lang) {
  lang.value = localStorage.getItem("igt_lang") || "fr";
  lang.addEventListener("change", () => {
    localStorage.setItem("igt_lang", lang.value);
    const h = document.querySelector(".hero h2");
    if (h && TRANSLATIONS[lang.value]) h.textContent = TRANSLATIONS[lang.value].dashboard;
  });
  lang.dispatchEvent(new Event("change"));
}

console.log("✅ InspecteurBot IA RDC 4.0 Premium — Tous les lots chargés");
console.log("🧠 IA :", typeof AI_CORE !== "undefined" ? AI_CORE.name + " v" + AI_CORE.version : "N/A");
