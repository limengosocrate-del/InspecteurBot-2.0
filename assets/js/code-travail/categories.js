"use strict";

/*====================================================
 INSPECTEURBOT RDC
 CATEGORIES DYNAMIQUES V4
====================================================*/

const Categories = {};

window.Categories = Categories;

/*====================================================
CREER LES CARTES
====================================================*/

Categories.initialiser = function () {

    const grille =
        document.getElementById("categoriesGrid");

    if (!grille) return;

    grille.innerHTML = "";

    CodeTravail.getCategories().forEach(categorie => {

        const total =
            CodeTravail.getArticlesCategorie(categorie).length;

        const carte =
            document.createElement("article");

        carte.className = "category-card";

        carte.innerHTML = `
            <h3>${categorie}</h3>

            <p>${total} article${total > 1 ? "s" : ""}</p>
        `;

        carte.addEventListener("click", () => {

            Categories.afficherArticles(categorie);

        });

        grille.appendChild(carte);

    });

};

/*====================================================
AFFICHER ARTICLES
====================================================*/

Categories.afficherArticles = function (categorie) {

    const zone =
        document.getElementById("resultatsRecherche");

    if (!zone) return;

    zone.innerHTML = "";

    const articles =
        CodeTravail.getArticlesCategorie(categorie);

    articles.forEach(article => {

        const bouton =
            document.createElement("button");

        bouton.className = "result-item";

        bouton.innerHTML =
            `<strong>Article ${article.numero}</strong><br>${article.titre}`;

        bouton.onclick = () => {

            CodeTravail.selectionnerArticle(article.numero);

            Consultation.afficherArticle(article);

            document
                .getElementById("articleCard")
                .scrollIntoView({

                    behavior: "smooth"

                });

        };

        zone.appendChild(bouton);

    });

};

/*====================================================
DEMARRAGE
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {

        Categories.initialiser();

    }, 500);

});
