/*=========================================================
 INSPECTEURBOT IA RDC
 SEARCH.JS
 Gestionnaire de recherche
 Version 3.0
=========================================================*/

"use strict";

document.addEventListener("DOMContentLoaded",function(){

    const champ=document.getElementById("rechercheArticle");
    const bouton=document.getElementById("btnRecherche");

    if(!champ){
        return;
    }

    if(bouton){

        bouton.addEventListener("click",lancerRecherche);

    }

    champ.addEventListener("keydown",function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            lancerRecherche();

        }

    });

});

async function lancerRecherche(){

    const champ=document.getElementById("rechercheArticle");

    if(!champ){
        return;
    }

    const question=champ.value.trim();

    if(question===""){

        alert("Veuillez saisir une recherche.");

        champ.focus();

        return;

    }

    if(window.rag && !window.rag.estCharge){

        await window.rag.charger();

    }

    const resultats=window.rag.rechercher(question);

    afficherResultatsRecherche(resultats,question);

}

function afficherResultatsRecherche(resultats,question){

    if(typeof articles!=="undefined"){

        articlesFiltres=resultats;

    }

    if(typeof afficherArticles==="function"){

        afficherArticles(resultats);

    }

    if(typeof genererReponseIA==="function"){

        genererReponseIA(question);

    }

    if(typeof allerAuxResultats==="function"){

        allerAuxResultats();

    }

}

function rechercherArticle(numero){

    if(!window.rag){

        return null;

    }

    return window.rag.rechercherNumero(numero);

}

function rechercherParTitre(titre){

    if(!window.rag){

        return [];

    }

    return window.rag.rechercherTitre(titre);

}

function rechercherParMotCle(mot){

    if(!window.rag){

        return [];

    }

    return window.rag.rechercherMotCle(mot);

}

console.log("✅ Search.js chargé.");
