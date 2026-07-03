/*==================================================
APP.JS
CORE CENTRALISÉ - INSPECTEURBOT RDC
VERSION STABLE & RAPIDE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("InspecteurBot App initialisé ✔");

    // Initialisation globale propre
    initUI();
    initModules();

});

/*==================================================
INITIALISATION UI
==================================================*/

function initUI() {

    initClockSafe();
    initThemeSafe();
    initButtonsSafe();

}

/*==================================================
MODULES (STATS + IA + AUTRES)
==================================================*/

function initModules() {

    // Stats
    if (window.initStats) {
        window.initStats();
    }

    // Tu peux ajouter ici les autres modules plus tard
    // initSearch();
    // initIA();
    // initSpeech();

}

/*==================================================
HORLOGE (SAFE - SANS CRASH)
==================================================*/

function initClockSafe() {

    const clockEl = document.getElementById("clock");
    const dayEl = document.getElementById("day");
    const dateEl = document.getElementById("date");

    if (!clockEl || !dayEl || !dateEl) return;

    const days = [
        "Dimanche","Lundi","Mardi","Mercredi",
        "Jeudi","Vendredi","Samedi"
    ];

    const months = [
        "janvier","février","mars","avril","mai","juin",
        "juillet","août","septembre","octobre","novembre","décembre"
    ];

    function update() {

        const now = new Date();

        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        const s = String(now.getSeconds()).padStart(2, "0");

        clockEl.textContent = `${h}:${m}:${s}`;
        dayEl.textContent = days[now.getDay()];
        dateEl.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;

    }

    update();
    setInterval(update, 1000);

}

/*==================================================
THEME (SAFE)
==================================================*/

function initThemeSafe() {

    const btn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");

    if (!btn || !icon) return;

    const body = document.body;

    btn.addEventListener("click", () => {

        body.classList.toggle("dark-theme");
        body.classList.toggle("light-theme");

        const isDark = body.classList.contains("dark-theme");

        icon.textContent = isDark ? "☀️" : "🌙";

        localStorage.setItem("theme", isDark ? "dark" : "light");

    });

    // restore
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {

        body.classList.add("dark-theme");
        body.classList.remove("light-theme");

        icon.textContent = "☀️";

    }

}

/*==================================================
BOUTONS SAFE (ANTI CRASH TOTAL)
==================================================*/

function initButtonsSafe() {

    safeClick("btnMicro", () => console.log("Micro"));
    safeClick("btnLecture", () => console.log("Lecture"));
    safeClick("btnPartager", () => console.log("Partager"));
    safeClick("btnImprimer", () => console.log("Imprimer"));
    safeClick("btnFavori", () => console.log("Favori"));
    safeClick("btnParametres", () => console.log("Paramètres"));

}

/*==================================================
UTILITAIRE SAFE CLICK
==================================================*/

function safeClick(id, callback) {

    const el = document.getElementById(id);

    if (!el) return;

    el.addEventListener("click", callback);

}
