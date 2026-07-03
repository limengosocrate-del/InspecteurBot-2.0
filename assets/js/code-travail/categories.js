"use strict";

/*==================================================
OBJET CATEGORIES
==================================================*/

const Categories = {

    initialise: false,

    categorieActuelle: null,

    filtresActifs: []

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.Categories = Categories;

/*==================================================
INITIALISATION
==================================================*/

Categories.initialiser = function () {

    if (this.initialise) return;

    this.initialise = true;

    console.log("Module Categories initialisé.");

    this.initialiserEvenements();

    this.initialiserBadges();

};

/*==================================================
ÉVÉNEMENTS UI CATÉGORIES
==================================================*/

Categories.initialiserEvenements = function () {

    const cartes =
        document.querySelectorAll(".category-card");

    cartes.forEach(card => {

        card.addEventListener("click", () => {

            const categorie =
                card.getAttribute("data-category");

            if (!categorie) return;

            this.selectionnerCategorie(categorie);

        });

    });

};

/*==================================================
SÉLECTION CATÉGORIE
==================================================*/

Categories.selectionnerCategorie = function (categorie) {

    if (!window.CodeTravail) return;

    this.categorieActuelle = categorie;

    const articles =
        CodeTravail.getArticlesCategorie(categorie);

    console.log(
        "Catégorie sélectionnée :",
        categorie,
        "|",
        articles.length,
        "articles"
    );

    this.afficherArticlesCategorie(articles);

    this.mettreAJourInfo(categorie, articles.length);

};

/*==================================================
AFFICHER ARTICLES CATÉGORIE
==================================================*/

Categories.afficherArticlesCategorie = function (articles) {

    const container =
        document.getElementById("resultatsRecherche");

    if (!container) return;

    container.innerHTML = "";

    if (!articles || articles.length === 0) {

        container.innerHTML = `
            <div class="no-results">
                Aucun article dans cette catégorie.
            </div>
        `;

        return;

    }

    articles.forEach(article => {

        const div =
            document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `
            <h3>Article ${article.numero}</h3>
            <p>${article.titre || ""}</p>
            <span>${article.categorie || ""}</span>
        `;

        div.addEventListener("click", () => {

            if (window.Consultation) {

                Consultation.afficherArticle(article);

            }

        });

        container.appendChild(div);

    });

};

/*==================================================
INFOS CATÉGORIE
==================================================*/

Categories.mettreAJourInfo = function (categorie, total) {

    const infoCategorie =
        document.getElementById("infoCategorie");

    const infoRecherche =
        document.getElementById("infoRecherche");

    if (infoCategorie) {
        infoCategorie.textContent = categorie;
    }

    if (infoRecherche) {
        infoRecherche.textContent =
            total + " article(s)";
    }

};

/*==================================================
INITIALISER BADGES
==================================================*/

Categories.initialiserBadges = function () {

    if (!window.CodeTravail) return;

    const categories =
        CodeTravail.getCategories();

    categories.forEach(cat => {

        const total =
            CodeTravail.compterCategorie(cat);

        this.mettreBadge(cat, total);

    });

};

/*==================================================
METTRE À JOUR UN BADGE
==================================================*/

Categories.mettreBadge = function (categorie, total) {

    const map = {

        "Dispositions générales": "badgeDispositions",
        "Contrat de travail": "badgeContrat",
        "Salaire": "badgeSalaire",
        "Temps de travail": "badgeTemps",
        "Congés": "badgeConges",
        "Santé et sécurité": "badgeSecurite",
        "Inspection du Travail": "badgeInspection",
        "Infractions et sanctions": "badgeSanctions"

    };

    const id = map[categorie];

    if (!id) return;

    const badge =
        document.getElementById(id);

    if (!badge) return;

    badge.textContent =
        total + " article" +
        (total > 1 ? "s" : "");

};

/*==================================================
FILTRER CATÉGORIE
==================================================*/

Categories.filtrer = function (categorie) {

    if (!window.CodeTravail) return [];

    return CodeTravail.getArticlesCategorie(categorie);

};

/*==================================================
RESET CATÉGORIES
==================================================*/

Categories.reinitialiser = function () {

    this.categorieActuelle = null;
    this.filtresActifs = [];

    const container =
        document.getElementById("resultatsRecherche");

    if (container) {
        container.innerHTML = "";
    }

};

/*==================================================
AUTO INIT
==================================================*/

document.addEventListener("codeTravailCharge", () => {

    Categories.initialiser();

});



