"use strict";

/*==================================================
 INSPECTEURBOT IA RDC
 favoris.js
 VERSION 3.0
 Gestion intelligente des favoris
==================================================*/

/*==================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};
window.CodeTravail.Favoris = {};

/*==================================================
 CONFIGURATION
==================================================*/

const CLE_FAVORIS = "inspecteurbot_favoris";

let favorisCache = [];

/*==================================================
 INITIALISATION DU CACHE
==================================================*/

function initialiserCache() {

    favorisCache = chargerFavoris();

}

/*==================================================
 CHARGER LES FAVORIS
==================================================*/

function chargerFavoris() {

    try {

        const data = localStorage.getItem(CLE_FAVORIS);

        if (!data) return [];

        const favoris = JSON.parse(data);

        return Array.isArray(favoris)
            ? favoris
            : [];

    }

    catch (e) {

        console.error(
            "Erreur lecture favoris :",
            e
        );

        return [];

    }

}

/*==================================================
 SAUVEGARDER
==================================================*/

function sauvegarderFavoris(favoris) {

    try {

        favorisCache = [...favoris];

        localStorage.setItem(

            CLE_FAVORIS,

            JSON.stringify(favorisCache)

        );

    }

    catch (e) {

        console.error(
            "Erreur sauvegarde favoris :",
            e
        );

    }

}

/*==================================================
 OBTENIR TOUS LES FAVORIS
==================================================*/

function obtenirFavoris() {

    return [...favorisCache];

}

/*==================================================
 RECHERCHE PAR NUMÉRO
==================================================*/

function trouverFavori(numero) {

    return favorisCache.find(article =>

        String(article.numero) === String(numero)

    ) || null;

}

/*==================================================
 VÉRIFIER SI EXISTE
==================================================*/

function estFavori(numero) {

    return trouverFavori(numero) !== null;

}

/*==================================================
 EXPORT
==================================================*/

window.CodeTravail.Favoris.charger =
    chargerFavoris;

window.CodeTravail.Favoris.sauvegarder =
    sauvegarderFavoris;

window.CodeTravail.Favoris.obtenir =
    obtenirFavoris;

window.CodeTravail.Favoris.trouver =
    trouverFavori;

window.CodeTravail.Favoris.estFavori =
    estFavori;

/*==================================================
 PARTIE 2
 AJOUT - SUPPRESSION - BASCULE
==================================================*/

/*==================================================
 AJOUTER UN FAVORI
==================================================*/

function ajouterFavori(article) {

    if (!article) return false;

    const numero = String(

        article.numero ||
        article.numeroArticle ||
        ""

    );

    if (!numero) {

        console.warn("Article invalide.");

        return false;

    }

    if (estFavori(numero)) {

        window.CodeTravail.Utils?.afficherNotification(

            "Cet article est déjà enregistré.",

            "warning"

        );

        return false;

    }

    const favori = {

        numero,

        titre:

            article.titre ||
            article.intitule ||
            "Sans titre",

        categorie:

            article.categorie ||
            article.section ||
            "",

        contenu:

            article.contenu || "",

        dateAjout:

            new Date().toISOString()

    };

    favorisCache.push(favori);

    sauvegarderFavoris(favorisCache);

    mettreAJourCompteur();

    actualiserBouton();

    window.CodeTravail.Utils?.afficherNotification(

        "⭐ Article ajouté aux favoris."

    );

    return true;

}

/*==================================================
 SUPPRIMER UN FAVORI
==================================================*/

function supprimerFavori(numero) {

    numero = String(numero);

    const tailleAvant = favorisCache.length;

    favorisCache = favorisCache.filter(

        article =>

            String(article.numero) !== numero

    );

    if (favorisCache.length === tailleAvant) {

        return false;

    }

    sauvegarderFavoris(favorisCache);

    mettreAJourCompteur();

    actualiserBouton();

    window.CodeTravail.Utils?.afficherNotification(

        "Article retiré des favoris."

    );

    return true;

}

/*==================================================
 BASCULER FAVORI
==================================================*/

function basculerFavori(article = null) {

    if (!article) {

        article =

            window.CodeTravail.Utils?.articleActuel?.()

            ||

            null;

    }

    if (!article) {

        window.CodeTravail.Utils?.afficherNotification(

            "Aucun article sélectionné.",

            "warning"

        );

        return;

    }

    const numero =

        article.numero ||

        article.numeroArticle;

    if (!numero) return;

    if (estFavori(numero)) {

        supprimerFavori(numero);

    }

    else {

        ajouterFavori(article);

    }

}

/*==================================================
 EXPORT
==================================================*/

window.CodeTravail.Favoris.ajouter =
    ajouterFavori;

window.CodeTravail.Favoris.supprimer =
    supprimerFavori;

window.CodeTravail.Favoris.basculer =
    basculerFavori;

/*==================================================
 PARTIE 3
 BOUTON - COMPTEUR - SYNCHRONISATION UI
==================================================*/

/*==================================================
 METTRE À JOUR LE COMPTEUR
==================================================*/

function mettreAJourCompteur() {

    const compteur = document.getElementById(
        "statFavoris"
    );

    if (!compteur) return;

    compteur.textContent = favorisCache.length;

}

/*==================================================
 ACTUALISER LE BOUTON FAVORI
==================================================*/

function actualiserBouton(article = null) {

    const bouton = document.getElementById(
        "btnFavoriArticle"
    );

    if (!bouton) return;

    if (!article) {

        article =
            window.CodeTravail.Utils
            ?.articleActuel?.() || null;

    }

    if (!article) {

        bouton.classList.remove("actif");

        return;

    }

    const numero = String(

        article.numero ||

        article.numeroArticle ||

        ""

    );

    const icone = bouton.querySelector("i");

    const actif = estFavori(numero);

    if (icone) {

        icone.className = actif

            ? "fa-solid fa-star"

            : "fa-regular fa-star";

    }

    bouton.classList.toggle(

        "actif",

        actif

    );

    bouton.setAttribute(

        "aria-pressed",

        actif

    );

    bouton.title = actif

        ? "Retirer des favoris"

        : "Ajouter aux favoris";

}

/*==================================================
 RAFRAÎCHIR L'INTERFACE
==================================================*/

function rafraichirFavoris(article = null) {

    mettreAJourCompteur();

    actualiserBouton(article);

}

/*==================================================
 ARTICLE CHANGÉ
==================================================*/

function synchroniserArticle(article) {

    rafraichirFavoris(article);

}

/*==================================================
 ÉVÉNEMENT PERSONNALISÉ
==================================================*/

document.addEventListener(

    "articleChange",

    event => {

        synchroniserArticle(

            event.detail || null

        );

    }

);

/*==================================================
 EXPORT
==================================================*/

window.CodeTravail.Favoris.compteur =
    mettreAJourCompteur;

window.CodeTravail.Favoris.actualiserBouton =
    actualiserBouton;

window.CodeTravail.Favoris.rafraichir =
    rafraichirFavoris;

window.CodeTravail.Favoris.synchroniser =
    synchroniserArticle;

/*==================================================
 PARTIE 4
 LISTE - RECHERCHE - EXPORT / IMPORT - VIDAGE
==================================================*/

/*==================================================
 AFFICHER LES FAVORIS
==================================================*/

function afficherFavoris() {

    const container = document.getElementById("listeFavoris");

    if (!container) return;

    if (favorisCache.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                <h3>Aucun favori</h3>
                <p>Vos articles favoris apparaîtront ici.</p>
            </div>
        `;

        return;

    }

    container.innerHTML = favorisCache.map(article => {

        return `
            <div class="favori-card">

                <div class="favori-header">

                    <strong>Article ${article.numero}</strong>

                    <button class="btn-supprimer"
                        data-numero="${article.numero}">
                        ✖
                    </button>

                </div>

                <h4>${article.titre}</h4>

                <p class="categorie">
                    ${article.categorie || "Non classé"}
                </p>

                <p class="preview">
                    ${(article.contenu || "").substring(0, 120)}...
                </p>

            </div>
        `;

    }).join("");

    /* événements suppression */

    container.querySelectorAll(".btn-supprimer")
        .forEach(btn => {

            btn.addEventListener("click", (e) => {

                const numero = e.target.dataset.numero;

                supprimerFavori(numero);

                afficherFavoris();

            });

        });

}

/*==================================================
 RECHERCHE DANS LES FAVORIS
==================================================*/

function rechercherFavoris(texte) {

    const q = (texte || "").toLowerCase();

    return favorisCache.filter(article => {

        return (

            article.numero.includes(q) ||
            article.titre.toLowerCase().includes(q) ||
            (article.contenu || "").toLowerCase().includes(q)

        );

    });

}

/*==================================================
 EXPORT JSON
==================================================*/

function exporterFavoris() {

    const data = JSON.stringify(favorisCache, null, 2);

    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = "favoris_inspecteurbot.json";

    a.click();

    URL.revokeObjectURL(url);

}

/*==================================================
 IMPORT JSON
==================================================*/

function importerFavoris(fichier) {

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const data = JSON.parse(e.target.result);

            if (Array.isArray(data)) {

                favorisCache = data;

                sauvegarderFavoris(favorisCache);

                rafraichirFavoris();

                afficherFavoris();

                window.CodeTravail.Utils?.afficherNotification(

                    "Import réussi ✔"

                );

            }

        }

        catch (err) {

            window.CodeTravail.Utils?.afficherNotification(

                "Erreur import fichier",

                "error"

            );

        }

    };

    reader.readAsText(fichier);

}

/*==================================================
 VIDER LES FAVORIS
==================================================*/

function viderFavoris() {

    if (!confirm("Voulez-vous supprimer tous les favoris ?")) {

        return;

    }

    favorisCache = [];

    sauvegarderFavoris(favorisCache);

    rafraichirFavoris();

    afficherFavoris();

    window.CodeTravail.Utils?.afficherNotification(

        "Tous les favoris ont été supprimés."

    );

}

/*==================================================
 EXPORT GLOBAL
==================================================*/

window.CodeTravail.Favoris.afficher =
    afficherFavoris;

window.CodeTravail.Favoris.rechercher =
    rechercherFavoris;

window.CodeTravail.Favoris.exporter =
    exporterFavoris;

window.CodeTravail.Favoris.importer =
    importerFavoris;

window.CodeTravail.Favoris.vider =
    viderFavoris;


