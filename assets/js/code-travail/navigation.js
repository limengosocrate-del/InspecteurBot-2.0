"use strict";

/* =====================================================
   INSPECTEURBOT RDC
   MODULE : NAVIGATION
   ===================================================== */

const Navigation = {

    initialiser() {

        this.initialiserBoutons();

    },

    initialiserBoutons() {

        const boutons = document.querySelectorAll(
            ".article-actions button"
        );

        if(boutons.length < 2){

            return;

        }

        boutons[0].addEventListener(

            "click",

            () => this.precedent()

        );

        boutons[boutons.length - 1].addEventListener(

            "click",

            () => this.suivant()

        );

    }

};

window.Navigation = Navigation;

document.addEventListener(

    "DOMContentLoaded",

    () => {

        Navigation.initialiser();

    }

);

/* =====================================================
   ARTICLE PRÉCÉDENT
   ===================================================== */

Navigation.precedent = function(){

    if(CodeTravail.indexActuel <= 0){

        return;

    }

    const index =

        CodeTravail.indexActuel - 1;

    const article =

        CodeTravail.articles[index];

    Consultation.afficherArticle(article);

    CodeTravail.selectionner(article.numero);

};

/* =====================================================
   ARTICLE SUIVANT
   ===================================================== */

Navigation.suivant = function(){

    if(
        CodeTravail.indexActuel >=
        CodeTravail.articles.length - 1
    ){

        return;

    }

    const index =

        CodeTravail.indexActuel + 1;

    const article =

        CodeTravail.articles[index];

    Consultation.afficherArticle(article);

    CodeTravail.selectionner(article.numero);

};

/* =====================================================
   NAVIGATION CLAVIER
   ===================================================== */

Navigation.clavier = function(){

    document.addEventListener(

        "keydown",

        (event)=>{

            if(event.key==="ArrowLeft"){

                this.precedent();

            }

            if(event.key==="ArrowRight"){

                this.suivant();

            }

        }

    );

};

Navigation.initialiser = function(){

    this.initialiserBoutons();

    this.clavier();

};

