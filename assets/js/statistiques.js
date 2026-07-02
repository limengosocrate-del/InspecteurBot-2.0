/*=================================================
 INSPECTEURBOT RDC
 statistiques.js
 VERSION 1.0
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};
window.CodeTravail.Statistiques = {};

/*=================================================
 CLÉ LOCALSTORAGE
==================================================*/

const CLE_STATS = "inspecteurbot_statistiques";

/*=================================================
 VALEURS PAR DÉFAUT
==================================================*/

const statistiquesDefaut = {

    articles: 0,

    recherches: 0,

    favoris: 0,

    ia: 0

};

/*=================================================
 CHARGER
==================================================*/

function chargerStatistiques() {

    return window.CodeTravail.Utils.charger(

        CLE_STATS,

        statistiquesDefaut

    );

}

/*=================================================
 SAUVEGARDER
==================================================*/

function sauvegarderStatistiques(stats) {

    window.CodeTravail.Utils.sauvegarder(

        CLE_STATS,

        stats

    );

}

/*=================================================
 RAFRAÎCHIR L'AFFICHAGE
==================================================*/

function actualiserInterface() {

    const stats = chargerStatistiques();

    const articles = document.querySelector("#statArticles");

    const recherches = document.querySelector("#statRecherche");

    const favoris = document.querySelector("#statFavoris");

    const ia = document.querySelector("#statIA");

    if (articles)
        articles.textContent = stats.articles;

    if (recherches)
        recherches.textContent = stats.recherches;

    if (favoris)
        favoris.textContent = stats.favoris;

    if (ia)
        ia.textContent = stats.ia;

      }

/*=================================================
 PARTIE 2
 INCRÉMENTATION DES STATISTIQUES
==================================================*/

/*=================================================
 ARTICLES CONSULTÉS
==================================================*/

function incrementerArticles() {

    const stats = chargerStatistiques();

    stats.articles++;

    sauvegarderStatistiques(stats);

    actualiserInterface();

}

/*=================================================
 RECHERCHES
==================================================*/

function incrementerRecherches() {

    const stats = chargerStatistiques();

    stats.recherches++;

    sauvegarderStatistiques(stats);

    actualiserInterface();

}

/*=================================================
 FAVORIS
==================================================*/

function incrementerFavoris() {

    const stats = chargerStatistiques();

    stats.favoris++;

    sauvegarderStatistiques(stats);

    actualiserInterface();

}

/*=================================================
 ANALYSES IA
==================================================*/

function incrementerIA() {

    const stats = chargerStatistiques();

    stats.ia++;

    sauvegarderStatistiques(stats);

    actualiserInterface();

}

/*=================================================
 DÉCRÉMENTER FAVORIS
==================================================*/

function decrementerFavoris() {

    const stats = chargerStatistiques();

    if (stats.favoris > 0) {

        stats.favoris--;

    }

    sauvegarderStatistiques(stats);

    actualiserInterface();

}

/*=================================================
 REMETTRE À ZÉRO
==================================================*/

function reinitialiserStatistiques() {

    sauvegarderStatistiques({

        articles: 0,

        recherches: 0,

        favoris: 0,

        ia: 0

    });

    actualiserInterface();

    window.CodeTravail.Utils.afficherNotification(

        "Statistiques réinitialisées."

    );

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Statistiques.incrementerArticles =
    incrementerArticles;

window.CodeTravail.Statistiques.incrementerRecherches =
    incrementerRecherches;

window.CodeTravail.Statistiques.incrementerFavoris =
    incrementerFavoris;

window.CodeTravail.Statistiques.decrementerFavoris =
    decrementerFavoris;

window.CodeTravail.Statistiques.incrementerIA =
    incrementerIA;

window.CodeTravail.Statistiques.reinitialiser =
    reinitialiserStatistiques;

/*=================================================
 PARTIE 3
 INITIALISATION
 VERSION FINALE
==================================================*/

/*=================================================
 OBTENIR LES STATISTIQUES
==================================================*/

function obtenirStatistiques() {

    return chargerStatistiques();

}

/*=================================================
 SYNCHRONISER LES FAVORIS
==================================================*/

function synchroniserFavoris() {

    const stats = chargerStatistiques();

    if (
        window.CodeTravail &&
        window.CodeTravail.Favoris &&
        typeof window.CodeTravail.Favoris.nombre === "function"
    ) {

        stats.favoris =
            window.CodeTravail.Favoris.nombre();

        sauvegarderStatistiques(stats);

        actualiserInterface();

    }

}

/*=================================================
 INITIALISATION
==================================================*/

function initialiserStatistiques() {

    synchroniserFavoris();

    actualiserInterface();

    console.log(

        "📊 Statistiques initialisées."

    );

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Statistiques.charger =
    chargerStatistiques;

window.CodeTravail.Statistiques.sauvegarder =
    sauvegarderStatistiques;

window.CodeTravail.Statistiques.actualiser =
    actualiserInterface;

window.CodeTravail.Statistiques.obtenir =
    obtenirStatistiques;

window.CodeTravail.Statistiques.synchroniserFavoris =
    synchroniserFavoris;

window.CodeTravail.Statistiques.initialiser =
    initialiserStatistiques;

/*=================================================
 DÉMARRAGE AUTOMATIQUE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserStatistiques();

    }

);

/*=================================================
 FIN DU FICHIER
==================================================*/
