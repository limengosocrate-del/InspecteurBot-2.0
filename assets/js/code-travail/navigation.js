"use strict";

/*==================================================
 NAVIGATION DES ARTICLES
 InspecteurBot RDC
==================================================*/

const Navigation = {};

window.Navigation = Navigation;

/*=========================================
 Initialisation
=========================================*/

Navigation.initialiser = function () {

    const btnPrecedent =
        document.getElementById("btnArticlePrecedent");

    const btnSuivant =
        document.getElementById("btnArticleSuivant");

    if (btnPrecedent) {

        btnPrecedent.onclick = Navigation.precedent;

    }

    if (btnSuivant) {

        btnSuivant.onclick = Navigation.suivant;

    }

};

/*=========================================
 Article précédent
=========================================*/

Navigation.precedent = function () {

    const article =
        CodeTravail.articleActuel;

    if (!article) return;

    const liste =
        CodeTravail.getTousArticles();

    const index =
        liste.findIndex(a => a.numero === article.numero);

    if (index <= 0) return;

    const precedent =
        liste[index - 1];

    CodeTravail.articleActuel =
        precedent;

    Consultation.afficherArticle(precedent);

};

/*=========================================
 Article suivant
=========================================*/

Navigation.suivant = function () {

    const article =
        CodeTravail.articleActuel;

    if (!article) return;

    const liste =
        CodeTravail.getTousArticles();

    const index =
        liste.findIndex(a => a.numero === article.numero);

    if (index === -1) return;

    if (index >= liste.length - 1) return;

    const suivant =
        liste[index + 1];

    CodeTravail.articleActuel =
        suivant;

    Consultation.afficherArticle(suivant);

};

/*=========================================
 Aller à un article
=========================================*/

Navigation.aller = function (numero) {

    const article =
        CodeTravail.selectionnerArticle(numero);

    if (!article) return;

    Consultation.afficherArticle(article);

};

/*=========================================
 Premier article
=========================================*/

Navigation.premier = function () {

    const liste =
        CodeTravail.getTousArticles();

    if (!liste.length) return;

    CodeTravail.articleActuel =
        liste[0];

    Consultation.afficherArticle(liste[0]);

};

/*=========================================
 Dernier article
=========================================*/

Navigation.dernier = function () {

    const liste =
        CodeTravail.getTousArticles();

    if (!liste.length) return;

    const dernier =
        liste[liste.length - 1];

    CodeTravail.articleActuel =
        dernier;

    Consultation.afficherArticle(dernier);

};

/*=========================================
 Vérifie si un article existe
=========================================*/

Navigation.existe = function (numero) {

    return CodeTravail
        .getTousArticles()
        .some(a => a.numero == numero);

};

/*=========================================
 Chargement automatique
=========================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        Navigation.initialiser();

    }

);
