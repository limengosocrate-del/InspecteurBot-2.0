"use strict";

/*==================================================
OBJET NAVIGATION
==================================================*/

const Navigation = {

    initialisee: false,

    verrou: false

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.Navigation = Navigation;

/*==================================================
INITIALISATION
==================================================*/

Navigation.initialiser = function () {

    if (this.initialisee) return;

    this.initialisee = true;

    console.log("Module Navigation initialisé.");

    this.initialiserEvenements();

};

/*==================================================
ÉVÉNEMENTS NAVIGATION
==================================================*/

Navigation.initialiserEvenements = function () {

    const btnPrecedent =
        document.getElementById("btnArticlePrecedent");

    const btnSuivant =
        document.getElementById("btnArticleSuivant");

    /*------------------------------
    PRÉCÉDENT
    ------------------------------*/

    if (btnPrecedent) {

        btnPrecedent.addEventListener("click", () => {

            this.precedent();

        });

    }

    /*------------------------------
    SUIVANT
    ------------------------------*/

    if (btnSuivant) {

        btnSuivant.addEventListener("click", () => {

            this.suivant();

        });

    }

    /*------------------------------
    NAVIGATION CLAVIER (optionnel)
    ------------------------------*/

    document.addEventListener("keydown", (e) => {

        if (!CodeTravail || !CodeTravail.estCharge()) return;

        if (e.key === "ArrowLeft") {
            this.precedent();
        }

        if (e.key === "ArrowRight") {
            this.suivant();
        }

    });

};

/*==================================================
ARTICLE PRÉCÉDENT
==================================================*/

Navigation.precedent = function () {

    if (this.verrou) return;

    if (!window.CodeTravail) return;

    const article =
        CodeTravail.articlePrecedent();

    if (!article) {

        console.log("Début de la liste atteint.");

        return;

    }

    this.afficher(article);

};

/*==================================================
ARTICLE SUIVANT
==================================================*/

Navigation.suivant = function () {

    if (this.verrou) return;

    if (!window.CodeTravail) return;

    const article =
        CodeTravail.articleSuivant();

    if (!article) {

        console.log("Fin de la liste atteinte.");

        return;

    }

    this.afficher(article);

};

/*==================================================
AFFICHER ARTICLE
==================================================*/

Navigation.afficher = function (article) {

    if (!article) return;

    this.verrou = true;

    if (window.Consultation) {

        Consultation.afficherArticle(article);

    }

    if (window.Statistiques) {

        if (Statistiques.incrementer) {

            Statistiques.incrementer("consultations");

        }

    }

    setTimeout(() => {

        this.verrou = false;

    }, 200);

};

/*==================================================
ALLER À UN ARTICLE
==================================================*/

Navigation.allerA = function (numero) {

    if (!window.CodeTravail) return;

    const article =
        CodeTravail.selectionner(numero);

    if (!article) {

        console.log("Article introuvable :", numero);

        return;

    }

    this.afficher(article);

};

/*==================================================
PREMIER ARTICLE
==================================================*/

Navigation.premier = function () {

    if (!window.CodeTravail) return;

    if (CodeTravail.articles.length === 0) return;

    const article =
        CodeTravail.articles[0];

    CodeTravail.indexActuel = 0;

    this.afficher(article);

};

/*==================================================
DERNIER ARTICLE
==================================================*/

Navigation.dernier = function () {

    if (!window.CodeTravail) return;

    const last =
        CodeTravail.articles.length - 1;

    const article =
        CodeTravail.articles[last];

    CodeTravail.indexActuel = last;

    this.afficher(article);

};

/*==================================================
VÉRIFICATION NAVIGATION POSSIBLE
==================================================*/

Navigation.peutPreceder = function () {

    return CodeTravail.indexActuel > 0;

};

/*==================================================
VÉRIFICATION SUIVANT POSSIBLE
==================================================*/

Navigation.peutSuivre = function () {

    return CodeTravail.indexActuel <
        CodeTravail.articles.length - 1;

};

/*==================================================
AUTO INIT
==================================================*/

document.addEventListener("codeTravailCharge", () => {

    Navigation.initialiser();

});

