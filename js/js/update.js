"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 update.js
 Gestion des mises à jour
===================================================*/

/*==================================================
 INITIALISATION
===================================================*/

function initUpdate() {

    console.log(
        "Module de mise à jour chargé."
    );

}

/*==================================================
 VERIFIER LES MISES A JOUR
===================================================*/

function checkUpdate() {

    const version = "4.0 Premium";

    if (typeof showNotification === "function") {

        showNotification(

            "Mise à jour",

            "Version actuelle : " + version

        );

    } else {

        alert(
            "Version actuelle : " + version
        );

    }

}

/*==================================================
 RECHARGER L'APPLICATION
===================================================*/

function reloadApplication() {

    location.reload();

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initUpdate();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.checkUpdate = checkUpdate;
window.reloadApplication = reloadApplication;
