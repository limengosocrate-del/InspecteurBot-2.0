/*==================================================
APP.JS - CORE INSPECTEURBOT RDC
VERSION CENTRALISÉE STABLE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("InspecteurBot App chargé ✔");

    initClock();
    initTheme();
    initUIFixes();

});

/*==================================================
HORLOGE + DATE
==================================================*/

function initClock() {

    const clockEl = document.getElementById("clock");
    const dayEl = document.getElementById("day");
    const dateEl = document.getElementById("date");

    if (!clockEl || !dayEl || !dateEl) {
        console.warn("Clock UI manquant");
        return;
    }

    const days = [
        "Dimanche","Lundi","Mardi","Mercredi",
        "Jeudi","Vendredi","Samedi"
    ];

    const months = [
        "janvier","février","mars","avril","mai","juin",
        "juillet","août","septembre","octobre","novembre","décembre"
    ];

    function updateClock() {

        const now = new Date();

        const h = String(now.getHours()).padStart(2, "0");
        const m = String(now.getMinutes()).padStart(2, "0");
        const s = String(now.getSeconds()).padStart(2, "0");

        clockEl.textContent = `${h}:${m}:${s}`;
        dayEl.textContent = days[now.getDay()];
        dateEl.textContent = `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/*==================================================
THEME TOGGLE
==================================================*/

function initTheme() {

    const btn = document.getElementById("themeToggle");
    const icon = document.getElementById("themeIcon");
    const body = document.body;

    if (!btn || !icon) return;

    btn.addEventListener("click", () => {

        body.classList.toggle("dark-theme");
        body.classList.toggle("light-theme");

        const isDark = body.classList.contains("dark-theme");

        icon.textContent = isDark ? "☀️" : "🌙";

        localStorage.setItem("theme", isDark ? "dark" : "light");

    });

    // restore theme
    const saved = localStorage.getItem("theme");

    if (saved === "dark") {
        body.classList.add("dark-theme");
        body.classList.remove("light-theme");
        icon.textContent = "☀️";
    }
}

/*==================================================
FIX UI GLOBAL (ANTI BUG FUTUR)
==================================================*/

function initUIFixes() {

    // Empêche erreurs silencieuses sur boutons manquants

    const safeBind = (id, event, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(event, fn);
    };

    safeBind("btnMicro", "click", () => console.log("Micro"));
    safeBind("btnLecture", "click", () => console.log("Lecture"));
    safeBind("btnPartager", "click", () => console.log("Partager"));
    safeBind("btnImprimer", "click", () => console.log("Imprimer"));
    safeBind("btnFavori", "click", () => console.log("Favori"));
    safeBind("btnParametres", "click", () => console.log("Paramètres"));

}

