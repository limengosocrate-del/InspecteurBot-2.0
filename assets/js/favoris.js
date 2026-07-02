/*=================================================
 INSPECTEURBOT RDC
 favoris.js
 VERSION 1.0
 Gestion des favoris
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};

window.CodeTravail.Favoris = {};

/*=================================================
 CONSTANTES
==================================================*/

const CLE_FAVORIS = "inspecteurbot_favoris";

/*=================================================
 CHARGER LES FAVORIS
==================================================*/

function chargerFavoris() {

    return window.CodeTravail.Utils.charger(

        CLE_FAVORIS,

        []

    );

}

/*=================================================
 SAUVEGARDER LES FAVORIS
==================================================*/

function sauvegarderFavoris(favoris) {

    window.CodeTravail.Utils.sauvegarder(

        CLE_FAVORIS,

        favoris

    );

}

/*=================================================
 VÉRIFIER SI UN ARTICLE EST DÉJÀ EN FAVORI
==================================================*/

function estFavori(numero) {

    const favoris = chargerFavoris();

    return favoris.some(

        article => article.numero === numero

    );

}

/*=================================================
 AJOUTER UN FAVORI
==================================================*/

function ajouterFavori(article) {

    const favoris = chargerFavoris();

    if (estFavori(article.numero)) {

        window.CodeTravail.Utils.afficherNotification(

            "Cet article est déjà enregistré.",

            "warning"

        );

        return;

    }

    favoris.push(article);

    sauvegarderFavoris(favoris);

    mettreAJourCompteur();

    window.CodeTravail.Utils.afficherNotification(

        "Article ajouté aux favoris."

    );

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Favoris.charger = chargerFavoris;

window.CodeTravail.Favoris.sauvegarder = sauvegarderFavoris;

window.CodeTravail.Favoris.estFavori = estFavori;

window.CodeTravail.Favoris.ajouter = ajouterFavori;

/*=================================================
 PARTIE 2
 SUPPRESSION - COMPTEUR - BOUTON FAVORI
==================================================*/

/*=================================================
 SUPPRIMER UN FAVORI
==================================================*/

function supprimerFavori(numero) {

    let favoris = chargerFavoris();

    favoris = favoris.filter(

        article => article.numero !== numero

    );

    sauvegarderFavoris(favoris);

    mettreAJourCompteur();

    window.CodeTravail.Utils.afficherNotification(

        "Article retiré des favoris."

    );

}

/*=================================================
 AJOUT / RETRAIT AUTOMATIQUE
==================================================*/

function basculerFavori() {

    const article =
        window.CodeTravail.Utils.articleActuel();

    if (!article.numero ||
        article.numero === "Article —") {

        window.CodeTravail.Utils.afficherNotification(

            "Aucun article sélectionné.",

            "warning"

        );

        return;

    }

    if (estFavori(article.numero)) {

        supprimerFavori(article.numero);

    } else {

        ajouterFavori(article);

    }

    actualiserBouton();

}

/*=================================================
 METTRE À JOUR LE BOUTON
==================================================*/

function actualiserBouton() {

    const bouton =
        document.querySelector("#btnFavoriArticle");

    if (!bouton) return;

    const article =
        window.CodeTravail.Utils.articleActuel();

    const icone =
        bouton.querySelector("i");

    if (estFavori(article.numero)) {

        icone.className =
            "fa-solid fa-star";

        bouton.classList.add("actif");

    }

    else {

        icone.className =
            "fa-regular fa-star";

        bouton.classList.remove("actif");

    }

}

/*=================================================
 COMPTEUR
==================================================*/

function mettreAJourCompteur() {

    const compteur =
        document.querySelector("#statFavoris");

    if (!compteur) return;

    compteur.textContent =
        chargerFavoris().length;

}

/*=================================================
 NOMBRE TOTAL
==================================================*/

function nombreFavoris() {

    return chargerFavoris().length;

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Favoris.supprimer =
    supprimerFavori;

window.CodeTravail.Favoris.basculer =
    basculerFavori;

window.CodeTravail.Favoris.actualiserBouton =
    actualiserBouton;

window.CodeTravail.Favoris.compteur =
    mettreAJourCompteur;

window.CodeTravail.Favoris.nombre =
    nombreFavoris;

/*=================================================
 PARTIE 3
 INITIALISATION
 VERSION FINALE
==================================================*/

/*=================================================
 AFFICHER LES FAVORIS
==================================================*/

function afficherFavoris() {

    const liste = chargerFavoris();

    console.table(liste);

    return liste;

}

/*=================================================
 VIDER TOUS LES FAVORIS
==================================================*/

function viderFavoris() {

    if (!confirm(
        "Voulez-vous supprimer tous les favoris ?"
    )) {

        return;

    }

    sauvegarderFavoris([]);

    mettreAJourCompteur();

    actualiserBouton();

    window.CodeTravail.Utils.afficherNotification(

        "Tous les favoris ont été supprimés."

    );

}

/*=================================================
 INITIALISATION
==================================================*/

function initialiserFavoris() {

    mettreAJourCompteur();

    actualiserBouton();

    const bouton = document.querySelector(

        "#btnFavoriArticle"

    );

    if (bouton) {

        bouton.addEventListener(

            "click",

            basculerFavori

        );

    }

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Favoris.afficher =
    afficherFavoris;

window.CodeTravail.Favoris.vider =
    viderFavoris;

window.CodeTravail.Favoris.initialiser =
    initialiserFavoris;

/*=================================================
 DÉMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserFavoris();

        console.log(

            "⭐ favoris.js chargé."

        );

    }

);

/*=================================================
 FIN
==================================================*/
