"use strict";

/*==================================================
 APP.JS
 INSPECTEURBOT RDC 2026
 CORE PRINCIPAL
==================================================*/

const App = {};

window.App = App;

/*==================================================
 INITIALISATION
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    console.log("✅ InspecteurBot RDC démarré");

    App.demarrer();

});

/*==================================================
 DÉMARRAGE
==================================================*/

App.demarrer = function () {

    App.initHorloge();

    App.initTheme();

    App.initBoutons();

    App.initMeteo();

    App.initStatistiques();

    App.masquerChargement();

};

/*==================================================
 HORLOGE
==================================================*/

App.initHorloge = function () {

    const clock = document.getElementById("clock");
    const day = document.getElementById("day");
    const date = document.getElementById("date");

    if (!clock || !day || !date) return;

    const jours = [

        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"

    ];

    const mois = [

        "janvier",
        "février",
        "mars",
        "avril",
        "mai",
        "juin",
        "juillet",
        "août",
        "septembre",
        "octobre",
        "novembre",
        "décembre"

    ];

    function afficher() {

        const maintenant = new Date();

        clock.textContent =
            maintenant.toLocaleTimeString("fr-FR");

        day.textContent =
            jours[maintenant.getDay()];

        date.textContent =
            maintenant.getDate() +
            " " +
            mois[maintenant.getMonth()] +
            " " +
            maintenant.getFullYear();

    }

    afficher();

    setInterval(afficher, 1000);

};

/*==================================================
 THÈME
==================================================*/

App.initTheme = function () {

    const bouton =
        document.getElementById("themeToggle");

    const icon =
        document.getElementById("themeIcon");

    if (!bouton || !icon) return;

    let theme =
        localStorage.getItem("theme") || "light";

    appliquer(theme);

    bouton.onclick = function () {

        theme =
            theme === "light"
                ? "dark"
                : "light";

        appliquer(theme);

        localStorage.setItem("theme", theme);

    };

    function appliquer(mode) {

        document.body.classList.remove(
            "light-theme",
            "dark-theme"
        );

        document.body.classList.add(
            mode + "-theme"
        );

        icon.textContent =
            mode === "dark"
                ? "☀️"
                : "🌙";

    }

};

/*==================================================
 BOUTONS
==================================================*/

App.initBoutons = function () {

    App.click("btnPartager", () => {

        if (window.Utils)
            Utils.partagerArticle();

    });

    App.click("btnImprimer", () => {

        window.print();

    });

    App.click("btnLecture", () => {

        if (window.Utils)
            Utils.lireArticle();

    });

    App.click("btnFavori", () => {

        if (window.Utils)
            Utils.favori();

    });

    App.click("btnMicro", () => {

        console.log("Micro activé");

    });

    App.click("btnParametres", () => {

        alert("Paramètres bientôt disponibles.");

    });

};

/*==================================================
 MÉTÉO
==================================================*/

App.initMeteo = function () {

    const ville =
        document.getElementById("city");

    const temperature =
        document.getElementById("temperature");

    if (!ville || !temperature) return;

    ville.textContent = "Kinshasa";

    temperature.textContent = "--°C";

};

/*==================================================
 STATISTIQUES
==================================================*/

App.initStatistiques = function () {

    const total =
        window.CodeTravail
            ? CodeTravail.getTousArticles().length
            : 0;

    const el =
        document.getElementById("statArticles");

    if (el)
        el.textContent = total;

};

/*==================================================
 ÉCRAN DE CHARGEMENT
==================================================*/

App.masquerChargement = function () {

    const ecran =
        document.getElementById("loadingScreen");

    if (!ecran) return;

    setTimeout(() => {

        ecran.style.opacity = "0";

        setTimeout(() => {

            ecran.style.display = "none";

        }, 400);

    }, 1200);

};

/*==================================================
 RACCOURCI CLICK
==================================================*/

App.click = function (id, action) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.addEventListener(
        "click",
        action
    );

};
