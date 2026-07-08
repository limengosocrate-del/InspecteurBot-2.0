"use strict";

/*====================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 app.js
 Contrôleur principal
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("🤖 InspecteurBot IA RDC 4.0 Premium démarré");

    /*====================================================
     INITIALISATION DES MODULES
    ====================================================*/

    const modules = [
        "clock",
        "weather",
        "map",
        "voice",
        "scanner",
        "qrcode",
        "calendar",
        "stats",
        "assistant",
        "export",
        "history",
        "update"
    ];

    modules.forEach(module => {
        console.log("Module chargé :", module);
    });

    /*====================================================
     ASSISTANT IA
    ====================================================*/

    const btnAssistant = document.getElementById("btnAssistant");

    if (btnAssistant) {
        btnAssistant.addEventListener("click", () => {

            if (typeof openAssistant === "function") {
                openAssistant();
            } else {
                showNotification("Assistant IA", "Module indisponible");
            }

        });
    }

    /*====================================================
     VOIX
    ====================================================*/

    const btnVoice = document.getElementById("btnVoice");

    if (btnVoice) {
        btnVoice.addEventListener("click", () => {

            if (typeof startVoice === "function") {
                startVoice();
            } else if (typeof startListening === "function") {
                startListening();
            } else {
                showNotification("Voix", "Module vocal indisponible");
            }

        });
    }

    /*====================================================
     SCANNER
    ====================================================*/

    const btnCamera = document.getElementById("btnCamera");

    if (btnCamera) {
        btnCamera.addEventListener("click", () => {

            if (typeof openScanner === "function") {
                openScanner();
            } else {
                showNotification("Scanner", "Module scanner indisponible");
            }

        });
    }

    /*====================================================
     THEME
    ====================================================*/

    const btnTheme = document.getElementById("btnTheme");

    if (btnTheme) {
        btnTheme.addEventListener("click", () => {

            if (typeof toggleTheme === "function") {
                toggleTheme();
            } else {

                document.body.classList.toggle("dark");

                localStorage.setItem(
                    "theme",
                    document.body.classList.contains("dark")
                        ? "dark"
                        : "light"
                );

                showNotification("Thème", "Thème modifié");
            }

        });
    }

    /*====================================================
     RESTAURATION THEME
    ====================================================*/

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
    }

    /*====================================================
     AGENDA
    ====================================================*/

    const btnCalendar = document.getElementById("btnCalendar");

    if (btnCalendar) {
        btnCalendar.addEventListener("click", () => {

            if (typeof openCalendar === "function") {
                openCalendar();
            } else {
                showNotification("Agenda", "Module agenda indisponible");
            }

        });
    }

    /*====================================================
     GPS
    ====================================================*/

    const btnMap = document.getElementById("btnMap");

    if (btnMap) {
        btnMap.addEventListener("click", () => {

            if (typeof openMap === "function") {
                openMap();
            } else if (typeof initMap === "function") {
                initMap();
            } else {
                showNotification("GPS", "Module GPS indisponible");
            }

        });
    }

    /*====================================================
     STATISTIQUES
    ====================================================*/

    const btnStats = document.getElementById("btnStats");

    if (btnStats) {
        btnStats.addEventListener("click", () => {

            if (typeof createStatsPanel === "function") {
                createStatsPanel();
            } else if (typeof displayStats === "function") {
                displayStats();
            } else {
                showNotification("Statistiques", "Module indisponible");
            }

        });
    }

    /*====================================================
     EXPORT
    ====================================================*/

    const btnExport = document.getElementById("btnExport");

    if (btnExport) {
        btnExport.addEventListener("click", () => {

            if (typeof exportData === "function") {
                exportData();
            } else {
                showNotification("Export", "Module indisponible");
            }

        });
    }

    /*====================================================
     HISTORIQUE IA
    ====================================================*/

    const btnHistory = document.getElementById("btnHistory");

    if (btnHistory) {
        btnHistory.addEventListener("click", () => {

            if (typeof openHistory === "function") {
                openHistory();
            } else {
                showNotification("Historique", "Historique indisponible");
            }

        });
    }

    /*====================================================
     MISE A JOUR
    ====================================================*/

    const btnUpdate = document.getElementById("btnUpdate");

    if (btnUpdate) {
        btnUpdate.addEventListener("click", () => {

            if (typeof checkUpdate === "function") {
                checkUpdate();
            } else if (typeof updateApplication === "function") {
                updateApplication();
            } else {
                showNotification("Mise à jour", "Aucune mise à jour disponible");
            }

        });
    }

    /*====================================================
     RECHERCHE
    ====================================================*/

    const search = document.getElementById("searchInput");

    if (search) {
        search.addEventListener("input", (e) => {

            if (typeof globalSearch === "function") {
                globalSearch(e.target.value);
            }

        });
    }

    /*====================================================
     LANGUE
    ====================================================*/

    const lang = document.getElementById("langSwitcher");

    if (lang) {
        lang.addEventListener("change", () => {

            if (typeof changeLanguage === "function") {
                changeLanguage(lang.value);
            } else {
                showNotification("Langue", "Langue : " + lang.value);
            }

        });
    }

});

/*====================================================
 NOTIFICATIONS
====================================================*/

function showNotification(title, message) {

    const box = document.createElement("div");

    box.className = "notification";

    box.innerHTML = `
        <strong>${title}</strong><br>
        ${message}
    `;

    document.body.appendChild(box);

    setTimeout(() => {
        box.remove();
    }, 3500);

}

window.showNotification = showNotification;
