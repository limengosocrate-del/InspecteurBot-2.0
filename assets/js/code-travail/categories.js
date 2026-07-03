"use strict";

/*=========================================================
 INSPECTEURBOT RDC
 CATEGORIES.JS
=========================================================*/

const Categories = {};

window.Categories = Categories;

/*=========================================================
 INITIALISATION
=========================================================*/

Categories.initialiser = function () {

    const grille = document.getElementById("categoriesGrid");

    if (!grille) return;

    grille.innerHTML = "";

    const categories = CodeTravail.getCategories();

    categories.forEach(categorie => {

        const nombre =
            CodeTravail.nombreArticlesCategorie(categorie);

        const carte =
            Categories.creerCarte(categorie, nombre);

        grille.appendChild(carte);

    });

};

/*=========================================================
 CREATION D'UNE CARTE
=========================================================*/

Categories.creerCarte = function (categorie, nombre) {

    const article =
        document.createElement("article");

    article.className = "category-card";

    article.dataset.category = categorie;

    article.innerHTML = `

        <i class="${Categories.icone(categorie)}"></i>

        <h3>

            ${categorie}

        </h3>

        <p>

            ${Categories.description(categorie)}

        </p>

        <span class="badge">

            ${nombre} article${nombre > 1 ? "s" : ""}

        </span>

    `;

    article.addEventListener(

        "click",

        () => {

            Categories.ouvrir(categorie);

        }

    );

    return article;

};

/*=========================================================
 OUVRIR UNE CATEGORIE
=========================================================*/

Categories.ouvrir = function (categorie) {

    const articles =
        CodeTravail.getArticlesCategorie(categorie);

    if (!articles.length) return;

    Consultation.afficherArticle(

        articles[0]

    );

};

/*=========================================================
 DESCRIPTION
=========================================================*/

Categories.description = function (categorie) {

    const descriptions = {

        "Dispositions générales":
            "Principes fondamentaux du Code du Travail.",

        "Protection des enfants":
            "Protection des enfants travailleurs.",

        "Formation professionnelle":
            "Organisation de la formation professionnelle.",

        "Contrat d'apprentissage":
            "Apprentissage et formation pratique.",

        "Contrat de travail":
            "Création et exécution du contrat.",

        "Salaire":
            "Paiement et protection du salaire.",

        "Temps de travail":
            "Durée légale et repos.",

        "Congés":
            "Congés annuels et spéciaux.",

        "Santé et sécurité":
            "Prévention et protection.",

        "Inspection du Travail":
            "Pouvoirs des inspecteurs.",

        "Infractions et sanctions":
            "Infractions et amendes."

    };

    return descriptions[categorie]
        || "Articles du Code du Travail.";

};

/*=========================================================
 ICONE
=========================================================*/

Categories.icone = function (categorie) {

    const icones = {

        "Dispositions générales":
            "fa-solid fa-book",

        "Protection des enfants":
            "fa-solid fa-child",

        "Formation professionnelle":
            "fa-solid fa-graduation-cap",

        "Contrat d'apprentissage":
            "fa-solid fa-user-graduate",

        "Contrat de travail":
            "fa-solid fa-file-signature",

        "Salaire":
            "fa-solid fa-money-bill-wave",

        "Temps de travail":
            "fa-solid fa-clock",

        "Congés":
            "fa-solid fa-umbrella-beach",

        "Santé et sécurité":
            "fa-solid fa-helmet-safety",

        "Inspection du Travail":
            "fa-solid fa-user-shield",

        "Infractions et sanctions":
            "fa-solid fa-gavel"

    };

    return icones[categorie]
        || "fa-solid fa-folder";

};

/*=========================================================
 ACTUALISER
=========================================================*/

Categories.actualiser = function () {

    Categories.initialiser();

};

/*=========================================================
 DOM READY
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const attente = setInterval(() => {

            if (

                window.CodeTravail &&

                CodeTravail.articles &&

                CodeTravail.articles.length > 0

            ) {

                clearInterval(attente);

                Categories.initialiser();

            }

        }, 200);

    }

);
