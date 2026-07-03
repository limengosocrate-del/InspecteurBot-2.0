"use strict";

/*=====================================================
  CODE DU TRAVAIL RDC
  INDEX.JS
======================================================*/

const CodeTravail = {};

window.CodeTravail = CodeTravail;

/*=====================================================
 BASE DES ARTICLES
======================================================*/

CodeTravail.articles = [];

/*=====================================================
 CHARGEMENT DU JSON
======================================================*/

fetch("assets/data/code-travail.json")

.then(response => response.json())

.then(data => {

    CodeTravail.articles = data;

    console.log(
        "Code du Travail chargé :",
        data.length,
        "articles"
    );

    if (window.Categories) {
        Categories.initialiser();
    }

    if (window.Navigation) {
        Navigation.initialiser();
    }

})

.catch(error => {

    console.error(
        "Erreur de chargement du Code du Travail",
        error
    );

});

/*=====================================================
 CATÉGORIES
======================================================*/

CodeTravail.getCategories = function () {

    const categories = [];

    CodeTravail.articles.forEach(article => {

        if (!categories.includes(article.categorie)) {

            categories.push(article.categorie);

        }

    });

    return categories.sort();

};

/*=====================================================
 ARTICLES D'UNE CATÉGORIE
======================================================*/

CodeTravail.getArticlesCategorie = function (categorie) {

    return CodeTravail.articles.filter(article =>

        article.categorie === categorie

    );

};

/*=====================================================
 RECHERCHE PAR NUMÉRO
======================================================*/

CodeTravail.selectionnerArticle = function (numero) {

    numero = Number(numero);

    return CodeTravail.articles.find(article =>

        article.numero === numero

    );

};

/*=====================================================
 RECHERCHE PAR ID
======================================================*/

CodeTravail.getArticleId = function (id) {

    return CodeTravail.articles.find(article =>

        article.id === id

    );

};

/*=====================================================
 PREMIER ARTICLE
======================================================*/

CodeTravail.premierArticle = function () {

    return CodeTravail.articles[0];

};

/*=====================================================
 DERNIER ARTICLE
======================================================*/

CodeTravail.dernierArticle = function () {

    return CodeTravail.articles[
        CodeTravail.articles.length - 1
    ];

};

/*=====================================================
 ARTICLE SUIVANT
======================================================*/

CodeTravail.articleSuivant = function (numero) {

    numero = Number(numero);

    const index = CodeTravail.articles.findIndex(

        article => article.numero === numero

    );

    if (index === -1) return null;

    if (index >= CodeTravail.articles.length - 1) {

        return CodeTravail.articles[index];

    }

    return CodeTravail.articles[index + 1];

};

/*=====================================================
 ARTICLE PRÉCÉDENT
======================================================*/

CodeTravail.articlePrecedent = function (numero) {

    numero = Number(numero);

    const index = CodeTravail.articles.findIndex(

        article => article.numero === numero

    );

    if (index === -1) return null;

    if (index <= 0) {

        return CodeTravail.articles[index];

    }

    return CodeTravail.articles[index - 1];

};

/*=====================================================
 RECHERCHE INTELLIGENTE
======================================================*/

CodeTravail.rechercher = function (texte) {

    if (!texte) {

        return [];

    }

    texte = texte.toLowerCase().trim();

    return CodeTravail.articles.filter(article => {

        if (

            article.numero.toString() === texte ||

            ("article " + article.numero).toLowerCase() === texte

        ) {

            return true;

        }

        if (

            article.titre &&

            article.titre.toLowerCase().includes(texte)

        ) {

            return true;

        }

        if (

            article.categorie &&

            article.categorie.toLowerCase().includes(texte)

        ) {

            return true;

        }

        if (

            article.contenu &&

            article.contenu.toLowerCase().includes(texte)

        ) {

            return true;

        }

        if (

            Array.isArray(article.motsCles)

        ) {

            return article.motsCles.some(mot =>

                mot.toLowerCase().includes(texte)

            );

        }

        return false;

    });

};

/*=====================================================
 NOMBRE D'ARTICLES PAR CATÉGORIE
======================================================*/

CodeTravail.nombreArticlesCategorie = function (categorie) {

    return CodeTravail.articles.filter(article =>

        article.categorie === categorie

    ).length;

};

/*=====================================================
 TOUS LES ARTICLES
======================================================*/

CodeTravail.getTousLesArticles = function () {

    return CodeTravail.articles;

};

/*=====================================================
 VÉRIFIER SI UN ARTICLE EXISTE
======================================================*/

CodeTravail.articleExiste = function (numero) {

    numero = Number(numero);

    return CodeTravail.articles.some(article =>

        article.numero === numero

    );

};

/*=====================================================
 RECHERCHE EXACTE
======================================================*/

CodeTravail.rechercheExacte = function (numero) {

    numero = Number(numero);

    return CodeTravail.articles.find(article =>

        article.numero === numero

    ) || null;

};

/*=====================================================
 TRI DES ARTICLES
======================================================*/

CodeTravail.trierArticles = function () {

    CodeTravail.articles.sort((a, b) =>

        a.numero - b.numero

    );

};

/*=====================================================
 INITIALISATION
======================================================*/

CodeTravail.initialiser = function () {

    CodeTravail.trierArticles();

    console.log(

        "InspecteurBot RDC - Code du Travail prêt."

    );

};

/*=====================================================
 FINALISATION
======================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const attendre = setInterval(() => {

        if (CodeTravail.articles.length > 0) {

            clearInterval(attendre);

            CodeTravail.initialiser();

            if (window.Categories &&
                typeof Categories.initialiser === "function") {

                Categories.initialiser();

            }

            if (window.Navigation &&
                typeof Navigation.initialiser === "function") {

                Navigation.initialiser();

            }

            console.log(

                "InspecteurBot RDC prêt."

            );

        }

    }, 100);

});

/*=====================================================
 EXPORT
======================================================*/

window.CodeTravail = CodeTravail;


