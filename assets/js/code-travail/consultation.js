"use strict";

/* =====================================================
   INSPECTEURBOT RDC
   MODULE : CONSULTATION
   ===================================================== */

const Consultation = {

    article: null,

    initialiser() {

        document.addEventListener(

            "codeTravailCharge",

            () => {

                this.afficherAccueil();

            }

        );

    },

    afficherAccueil() {

        const numero =
            document.getElementById("numeroArticle");

        const titre =
            document.getElementById("titreArticle");

        const contenu =
            document.getElementById("contenuArticle");

        if(numero){

            numero.textContent="Code du Travail";

        }

        if(titre){

            titre.textContent=
            "Bibliothèque juridique intelligente";

        }

        if(contenu){

            contenu.textContent=
            "Utilisez la recherche intelligente, choisissez une catégorie ou sélectionnez un article pour commencer la consultation du Code du Travail de la République Démocratique du Congo.";

        }

    }

};

window.Consultation = Consultation;

document.addEventListener(

    "DOMContentLoaded",

    () => {

        Consultation.initialiser();

    }

);

/* =====================================================
   AFFICHAGE D'UN ARTICLE
   ===================================================== */

Consultation.afficherArticle = function(article){

    if(!article){

        return;

    }

    this.article = article;

    const numero =
    document.getElementById("numeroArticle");

    const titre =
    document.getElementById("titreArticle");

    const contenu =
    document.getElementById("contenuArticle");

    if(numero){

        numero.textContent =
        "Article " + article.numero;

    }

    if(titre){

        titre.textContent =
        article.titre;

    }

    if(contenu){

        contenu.textContent =
        article.contenu;

    }

    this.mettreAJourInformations(article);

};

/* =====================================================
   INFORMATIONS DE CONSULTATION
   ===================================================== */

Consultation.mettreAJourInformations = function(article){

    const infoArticle =
    document.getElementById("infoArticle");

    const infoChapitre =
    document.getElementById("infoChapitre");

    const infoTitre =
    document.getElementById("infoTitre");

    if(infoArticle){

        infoArticle.textContent =
        "Article " + article.numero;

    }

    if(infoChapitre){

        infoChapitre.textContent =
        article.categorie;

    }

    if(infoTitre){

        infoTitre.textContent =
        article.titre;

    }

};

/* =====================================================
   OUVRIR UN ARTICLE PAR NUMÉRO
   ===================================================== */

Consultation.ouvrirArticle = function(numero){

    const article =
    CodeTravail.getParNumero(numero);

    if(!article){

        console.warn(
            "Article introuvable :",
            numero
        );

        return;

    }

    CodeTravail.selectionner(numero);

    this.afficherArticle(article);

};

/* =====================================================
   OUVRIR LE PREMIER ARTICLE
   ===================================================== */

Consultation.premierArticle = function(){

    const articles =
    CodeTravail.getTous();

    if(!articles.length){

        return;

    }

    this.ouvrirArticle(

        articles[0].numero

    );

};

/* =====================================================
   ÉCOUTE DU CHARGEMENT DU CODE DU TRAVAIL
   ===================================================== */

document.addEventListener(

    "codeTravailCharge",

    ()=>{

        Consultation.afficherAccueil();

        console.log(

            "Consultation prête."

        );

    }

);
