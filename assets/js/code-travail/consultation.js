"use strict";

/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 CONSULTATION V3
 PARTIE 1/8
==================================================*/

/*==================================================
OBJET CONSULTATION
==================================================*/

const Consultation = {

    article: null,
    index: -1,
    initialise: false,
    historique: []

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.Consultation = Consultation;

/*==================================================
INITIALISATION
==================================================*/

Consultation.initialiser = function () {

    if (this.initialise) return;

    this.initialise = true;

    console.log("Consultation V3 initialisée");

};

/*==================================================
CHARGEMENT CODE DU TRAVAIL
==================================================*/

document.addEventListener("codeTravailCharge", () => {

    Consultation.initialiser();

    Consultation.afficherAccueil();

});

/*==================================================
AFFICHAGE ACCUEIL
==================================================*/

Consultation.afficherAccueil = function () {

    const numero = document.getElementById("numeroArticle");
    const titre = document.getElementById("titreArticle");
    const contenu = document.getElementById("contenuArticle");

    if (numero) numero.textContent = "Code du Travail";
    if (titre) titre.textContent = "Bibliothèque juridique intelligente";

    if (contenu) {

        contenu.innerHTML = `
            <div class="accueil-box">
                <p>
                    Bienvenue dans le Code du Travail de la RDC.
                </p>
                <p>
                    Utilisez la recherche ou les catégories pour commencer.
                </p>
            </div>
        `;

    }

};

/*==================================================
AFFICHER ARTICLE
==================================================*/

Consultation.afficherArticle = function (article) {

    if (!article) return;

    this.article = article;

    const numero = document.getElementById("numeroArticle");
    const titre = document.getElementById("titreArticle");
    const contenu = document.getElementById("contenuArticle");
    const categorie = document.getElementById("categorieArticle");

    if (numero) numero.textContent = `Article ${article.numero || "-"}`;
    if (titre) titre.textContent = article.titre || "Sans titre";

    if (contenu) {

        contenu.innerHTML = `
            <div class="article-text">
                ${article.contenu || "Contenu indisponible"}
            </div>
        `;

    }

    if (categorie) {
        categorie.textContent = article.categorie || "Non classé";
    }

    this.ajouterHistorique(article);

    this.mettreAJourInfos(article);

};

/*==================================================
INFOS ARTICLE
==================================================*/

Consultation.mettreAJourInfos = function (article) {

    const infoArticle = document.getElementById("infoArticle");
    const infoCategorie = document.getElementById("infoCategorie");

    if (infoArticle) {
        infoArticle.textContent = `Article ${article.numero || "-"}`;
    }

    if (infoCategorie) {
        infoCategorie.textContent = article.categorie || "-";
    }

};

/*==================================================
HISTORIQUE
==================================================*/

Consultation.ajouterHistorique = function (article) {

    if (!article) return;

    this.historique =
        this.historique.filter(a => a.id !== article.id);

    this.historique.unshift(article);

    if (this.historique.length > 30) {
        this.historique.pop();
    }

};

Consultation.getHistorique = function () {
    return [...this.historique];
};

/*==================================================
NAVIGATION ARTICLE
==================================================*/

Consultation.articlePrecedent = function () {

    if (!window.CodeTravail) return;

    const article = CodeTravail.articlePrecedent();

    if (article) this.afficherArticle(article);

    return article;

};

Consultation.articleSuivant = function () {

    if (!window.CodeTravail) return;

    const article = CodeTravail.articleSuivant();

    if (article) this.afficherArticle(article);

    return article;

};

/*==================================================
EVENTS UI
==================================================*/

Consultation.initialiserEvenements = function () {

    const on = (id, fn) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener("click", fn);
    };

    on("btnArticlePrecedent", () => this.articlePrecedent());
    on("btnArticleSuivant", () => this.articleSuivant());

    on("btnCopierArticle", () => {
        if (this.article) {
            navigator.clipboard?.writeText(this.article.contenu || "");
        }
    });

    on("btnImprimerArticle", () => window.print());

};

document.addEventListener("DOMContentLoaded", () => {

    Consultation.initialiser();
    Consultation.initialiserEvenements();

    console.log("Consultation V3 prête");

});



