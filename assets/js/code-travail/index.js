"use strict";

/*====================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL V4
 INDEX
====================================================*/

const CodeTravail = {

    articles: [],

    articleActuel: null,

    indexActuel: -1,

    categories: [],

    charge: false,

    pret: false

};

window.CodeTravail = CodeTravail;

/*====================================================
CHARGER LE JSON
====================================================*/

CodeTravail.charger = async function () {

    try {

        const reponse = await fetch("assets/data/code-travail.json");

        if (!reponse.ok) {
            throw new Error("Impossible de charger le Code du Travail.");
        }

        const data = await reponse.json();

        if (!Array.isArray(data)) {
            throw new Error("Le fichier JSON est invalide.");
        }

        this.articles = data;

        this.charge = true;

        console.log("Articles chargés :", data.length);

    }

    catch (e) {

        console.error(e);

        this.charge = false;

    }

};

/*====================================================
INITIALISER LES CATEGORIES
====================================================*/

CodeTravail.initialiserCategories = function () {

    const liste = [];

    this.articles.forEach(article => {

        if (
            article.categorie &&
            !liste.includes(article.categorie)
        ) {

            liste.push(article.categorie);

        }

    });

    this.categories = liste.sort();

};

/*====================================================
GETTERS
====================================================*/

CodeTravail.getTousLesArticles = function () {

    return this.articles;

};

CodeTravail.getArticle = function (numero) {

    numero = Number(numero);

    return this.articles.find(a => a.numero === numero);

};

CodeTravail.getCategories = function () {

    return this.categories;

};

CodeTravail.getArticlesCategorie = function (categorie) {

    return this.articles.filter(

        a => a.categorie === categorie

    );

};

/*====================================================
SELECTION
====================================================*/

CodeTravail.selectionnerArticle = function (numero) {

    numero = Number(numero);

    const index = this.articles.findIndex(

        a => a.numero === numero

    );

    if (index === -1) return null;

    this.indexActuel = index;

    this.articleActuel = this.articles[index];

    return this.articleActuel;

};

/*====================================================
NAVIGATION
====================================================*/

CodeTravail.articleSuivant = function () {

    if (this.indexActuel >= this.articles.length - 1) {

        return null;

    }

    this.indexActuel++;

    this.articleActuel = this.articles[this.indexActuel];

    return this.articleActuel;

};

CodeTravail.articlePrecedent = function () {

    if (this.indexActuel <= 0) {

        return null;

    }

    this.indexActuel--;

    this.articleActuel = this.articles[this.indexActuel];

    return this.articleActuel;

};

/*====================================================
RECHERCHE
====================================================*/

CodeTravail.rechercher = function (texte) {

    texte = texte.toLowerCase().trim();

    return this.articles.filter(article => {

        return (

            article.numero.toString().includes(texte)

            ||

            (article.titre || "")
            .toLowerCase()
            .includes(texte)

            ||

            (article.contenu || "")
            .toLowerCase()
            .includes(texte)

            ||

            (article.categorie || "")
            .toLowerCase()
            .includes(texte)

            ||

            (article.motsCles || [])
            .join(" ")
            .toLowerCase()
            .includes(texte)

        );

    });

};

/*====================================================
DEMARRAGE
====================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    await CodeTravail.charger();

    if (!CodeTravail.charge) {

        alert("Impossible de charger le Code du Travail.");

        return;

    }

    CodeTravail.initialiserCategories();

    CodeTravail.selectionnerArticle(1);

    console.log("Code du Travail prêt.");

});

