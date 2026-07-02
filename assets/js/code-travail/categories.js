"use strict";

/* =====================================================
   INSPECTEURBOT RDC
   MODULE : CATÉGORIES
   ===================================================== */

const Categories = {

    initialiser(){

        this.initialiserCartes();

    }

};

window.Categories = Categories;

/* =====================================================
   INITIALISATION DES CARTES
   ===================================================== */

Categories.initialiserCartes = function(){

    const cartes =

        document.querySelectorAll(

            ".category-card"

        );

    cartes.forEach(carte=>{

        carte.addEventListener(

            "click",

            ()=>{

                const categorie =

                    carte.dataset.categorie;

                this.ouvrir(categorie);

            }

        );

    });

};

/* =====================================================
   OUVERTURE D'UNE CATÉGORIE
   ===================================================== */

Categories.ouvrir = function(categorie){

    if(!categorie){

        return;

    }

    const articles =

        CodeTravail.articles.filter(

            article=>

                article.categorie
                .toLowerCase()===

                categorie.toLowerCase()

        );

    if(articles.length===0){

        alert(

            "Aucun article trouvé."

        );

        return;

    }

    Consultation.afficherArticle(

        articles[0]

    );

    CodeTravail.selectionner(

        articles[0].numero

    );

};

/* =====================================================
   FONCTION HTML
   Compatible avec ton HTML actuel
   ===================================================== */

window.ouvrirCategorie = function(categorie){

    Categories.ouvrir(categorie);

};

/* =====================================================
   INITIALISATION
   ===================================================== */

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        Categories.initialiser();

    }

);

