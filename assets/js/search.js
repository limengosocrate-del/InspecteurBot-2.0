/*=================================================
 INSPECTEURBOT RDC
 search.js
 VERSION 1.0
 MOTEUR DE RECHERCHE PRINCIPAL
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};

window.CodeTravail.Search = {};

/*=================================================
 ÉLÉMENTS HTML
==================================================*/

const champRecherche =
    document.querySelector("#rechercheArticle");

const boutonRecherche =
    document.querySelector("#btnRecherche");

const boutonEffacer =
    document.querySelector("#btnEffacerRecherche");

const zoneResultats =
    document.querySelector("#resultatsRecherche");

/*=================================================
 RECHERCHE
==================================================*/

function rechercher() {

    const texte = champRecherche.value.trim();

    if (!texte.length) {

        window.CodeTravail.Utils.afficherNotification(

            "Veuillez saisir une recherche.",

            "warning"

        );

        return;

    }

    rechercherTexte(texte);

}

/*=================================================
 LANCER LA RECHERCHE
==================================================*/

function rechercherTexte(texte) {

    if (

        !window.CodeTravail ||

        !window.CodeTravail.Recherche ||

        typeof window.CodeTravail.Recherche.rechercher !==
        "function"

    ) {

        console.error("recherche.js absent.");

        return;

    }

    const resultat =

        window.CodeTravail.Recherche.rechercher(

            texte

        );

    afficherResultats(resultat);

    if (

        window.CodeTravail.Statistiques

    ) {

        window.CodeTravail.Statistiques
            .incrementerRecherches();

    }

}

/*=================================================
 PARTIE 2
 AFFICHAGE DES RÉSULTATS
==================================================*/

/*=================================================
 AFFICHER LES RÉSULTATS
==================================================*/

function afficherResultats(resultats = []) {

    if (!zoneResultats) return;

    zoneResultats.innerHTML = "";

    if (!resultats.length) {

        zoneResultats.innerHTML = `

        <div class="search-empty">

            <i class="fa-solid fa-circle-info"></i>

            <p>Aucun résultat trouvé.</p>

        </div>

        `;

        return;

    }

    resultats.forEach(article => {

        const carte = document.createElement("article");

        carte.className = "search-card";

        carte.innerHTML = `

            <h3>

                Article ${article.numero}

            </h3>

            <h4>

                ${article.titre}

            </h4>

            <p>

                ${article.categorie}

            </p>

        `;

        carte.addEventListener(

            "click",

            () => ouvrirArticle(article)

        );

        zoneResultats.appendChild(carte);

    });

}

/*=================================================
 OUVRIR UN ARTICLE
==================================================*/

function ouvrirArticle(article) {

    if (

        window.CodeTravail.Consultation &&

        typeof window.CodeTravail.Consultation.afficherArticle === "function"

    ) {

        window.CodeTravail.Consultation

            .afficherArticle(article);

    }

    if (

        window.CodeTravail.Statistiques

    ) {

        window.CodeTravail.Statistiques

            .incrementerArticles();

    }

    zoneResultats.innerHTML = "";

}

/*=================================================
 SUGGESTIONS RAPIDES
==================================================*/

function initialiserSuggestions() {

    document

        .querySelectorAll(

            "#suggestionsRapides button"

        )

        .forEach(bouton => {

            bouton.addEventListener(

                "click",

                () => {

                    const texte =

                        bouton.dataset.search ||

                        bouton.dataset.article ||

                        "";

                    champRecherche.value = texte;

                    rechercher();

                }

            );

        });

}

/*=================================================
 EFFACER
==================================================*/

function effacerRecherche() {

    champRecherche.value = "";

    zoneResultats.innerHTML = "";

    champRecherche.focus();

}

/*=================================================
 PARTIE 3
 INITIALISATION
 VERSION FINALE
==================================================*/

/*=================================================
 RECHERCHE AVEC LA TOUCHE ENTRÉE
==================================================*/

function gererClavier(event) {

    if (event.key === "Enter") {

        event.preventDefault();

        rechercher();

    }

}

/*=================================================
 RECHERCHE EN TEMPS RÉEL
==================================================*/

function rechercherInstantanement() {

    if (!champRecherche) return;

    const texte = champRecherche.value.trim();

    if (texte.length < 2) {

        if (zoneResultats) {

            zoneResultats.innerHTML = "";

        }

        return;

    }

    rechercherTexte(texte);

}

/*=================================================
 INITIALISATION
==================================================*/

function initialiserRecherche() {

    if (boutonRecherche) {

        boutonRecherche.addEventListener(

            "click",

            rechercher

        );

    }

    if (boutonEffacer) {

        boutonEffacer.addEventListener(

            "click",

            effacerRecherche

        );

    }

    if (champRecherche) {

        champRecherche.addEventListener(

            "keydown",

            gererClavier

        );

        champRecherche.addEventListener(

            "input",

            window.CodeTravail.Utils.debounce(

                rechercherInstantanement,

                300

            )

        );

    }

    initialiserSuggestions();

    console.log(

        "🔍 search.js initialisé."

    );

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Search.rechercher =
    rechercher;

window.CodeTravail.Search.rechercherTexte =
    rechercherTexte;

window.CodeTravail.Search.afficherResultats =
    afficherResultats;

window.CodeTravail.Search.ouvrirArticle =
    ouvrirArticle;

window.CodeTravail.Search.effacer =
    effacerRecherche;

window.CodeTravail.Search.initialiser =
    initialiserRecherche;

/*=================================================
 DÉMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserRecherche();

    }

);

/*=================================================
 FIN DU FICHIER
==================================================*/
