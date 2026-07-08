"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 theme.js
 Gestion du thème
===================================================*/

/*==================================================
 INITIALISATION DU THÈME
===================================================*/

function initTheme() {

    const btnTheme =
        document.getElementById("btnTheme");

    const savedTheme =
        localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark");

        if (btnTheme) {
            btnTheme.textContent = "☀️ Thème";
        }

    } else {

        document.body.classList.remove("dark");

        if (btnTheme) {
            btnTheme.textContent = "🌙 Thème";
        }

    }

}

/*==================================================
 CHANGEMENT DU THÈME
===================================================*/

function toggleTheme() {

    const btnTheme =
        document.getElementById("btnTheme");

    document.body.classList.toggle("dark");

    const dark =
        document.body.classList.contains("dark");

    localStorage.setItem(
        "theme",
        dark ? "dark" : "light"
    );

    if (btnTheme) {

        btnTheme.textContent =
            dark
            ? "☀️ Thème"
            : "🌙 Thème";

    }

    if (typeof showNotification === "function") {

        showNotification(
            "Thème",
            dark
                ? "Mode sombre activé"
                : "Mode clair activé"
        );

    }

}

/*==================================================
 DÉMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initTheme();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.toggleTheme = toggleTheme;
window.initTheme = initTheme;
