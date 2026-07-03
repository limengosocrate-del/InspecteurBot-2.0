"use strict";

/*==================================================
 RECHERCHE DES ARTICLES
 InspecteurBot RDC
==================================================*/

const Recherche = {};

window.Recherche = Recherche;

/*=========================================
 Initialisation
=========================================*/

Recherche.initialiser = function () {

    const input = document.getElementById("rechercheArticle");
    const bouton = document.getElementById("btnRecherche");
    const resultat = document.getElementById("resultatsRecherche");

    if (!input || !bouton || !resultat) return;

    bouton.onclick = () => {

        Recherche.rechercher(input.value);

    };

    input.addEventListener("keyup", function (e) {

        if (e.key === "Enter") {

            Recherche.rechercher(this.value);

        }

    });

    /* Suggestions rapides */

    document
        .querySelectorAll("#suggestionsRapides button")
        .forEach(btn => {

            btn.onclick = function () {

                if (this.dataset.search) {

                    input.value = this.dataset.search;

                    Recherche.rechercher(this.dataset.search);

                }

                if (this.dataset.article) {

                    const article =
                        CodeTravail.selectionnerArticle(
                            Number(this.dataset.article)
                        );

                    if (article) {

                        Consultation.afficherArticle(article);

                    }

                }

            };

        });

};

/*=========================================
 Recherche principale
=========================================*/

Recherche.rechercher = function (texte) {

    const resultat =
        document.getElementById("resultatsRecherche");

    resultat.innerHTML = "";

    texte = texte.trim().toLowerCase();

    if (!texte) return;

    const liste =
        CodeTravail.getTousArticles();

    const trouve = liste.filter(article => {

        return (

            article.numero.toString() === texte ||

            article.titre.toLowerCase().includes(texte) ||

            article.categorie.toLowerCase().includes(texte) ||

            article.contenu.toLowerCase().includes(texte) ||

            (article.motsCles || []).join(" ").toLowerCase().includes(texte)

        );

    });

    document.getElementById("infoRecherche").textContent = texte;
    document.getElementById("infoResultats").textContent = trouve.length;

    if (trouve.length === 0) {

        resultat.innerHTML =

            "<p>Aucun article trouvé.</p>";

        return;

    }

    trouve.forEach(article => {

        const carte =
            document.createElement("div");

        carte.className = "result-card";

        carte.innerHTML = `

            <h3>

                Article ${article.numero}

            </h3>

            <p>

                <strong>${article.titre}</strong>

            </p>

            <small>

                ${article.categorie}

            </small>

        `;

        carte.onclick = function () {

            Consultation.afficherArticle(article);

            resultat.innerHTML = "";

        };

        resultat.appendChild(carte);

    });

};

/*=========================================
 Chargement automatique
=========================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        Recherche.initialiser();

    }

);
