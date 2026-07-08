"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 stats.js
 Gestion des statistiques
===================================================*/

const stats = {

    visits: 0,
    cardsOpened: 0,
    searches: 0

};

/*==================================================
 INITIALISATION
===================================================*/

function initStats() {

    stats.visits++;

    trackCards();

    trackSearch();

}

/*==================================================
 SUIVI DES CARTES
===================================================*/

function trackCards() {

    document
        .querySelectorAll(".card")
        .forEach(card => {

            card.addEventListener(
                "click",
                () => {

                    stats.cardsOpened++;

                }
            );

        });

}

/*==================================================
 SUIVI DES RECHERCHES
===================================================*/

function trackSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;

    input.addEventListener(
        "input",
        () => {

            stats.searches++;

        }
    );

}

/*==================================================
 AFFICHER LES STATISTIQUES
===================================================*/

function openStats() {

    const old =
        document.getElementById(
            "statsBox"
        );

    if (old) old.remove();

    const box =
        document.createElement("div");

    box.id = "statsBox";
    box.className = "stats-panel";

    box.innerHTML = `

        <h2>📊 Statistiques</h2>

        <p>Visites : ${stats.visits}</p>

        <p>Cartes ouvertes : ${stats.cardsOpened}</p>

        <p>Recherches : ${stats.searches}</p>

        <button id="closeStats">

        Fermer

        </button>

    `;

    document.body.appendChild(box);

    document
        .getElementById("closeStats")
        .addEventListener(
            "click",
            () => {

                box.remove();

            }
        );

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initStats();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.openStats = openStats;
