/*=========================================================
 INSPECTEURBOT IA RDC
 RAG.JS
 Retrieval Augmented Generation
 Version 3.0
=========================================================*/

"use strict";

class RAG{

    constructor(){

        this.articles=[];

        this.estCharge=false;

    }

    async charger(){

        try{

            console.log("Chargement du Code du Travail...");

            const reponse=await fetch("assets/data/code-travail.json");

            if(!reponse.ok){

                throw new Error("Impossible de charger code-travail.json");

            }

            this.articles=await reponse.json();

            this.estCharge=true;

            if(window.vectorSearch){

                window.vectorSearch.charger(this.articles);

            }

            console.log(

                "✅",

                this.articles.length,

                "articles chargés."

            );

            return this.articles;

        }

        catch(erreur){

            console.error(erreur);

            return [];

        }

    }

    rechercher(question){

        if(!this.estCharge){

            console.warn(

                "Base de données non chargée."

            );

            return [];

        }

        return window.vectorSearch.rechercher(question);

    }

    rechercherNumero(numero){

        return window.vectorSearch.rechercherNumero(numero);

    }

    rechercherTitre(titre){

        return window.vectorSearch.rechercherTitre(titre);

    }

    rechercherMotCle(mot){

        return window.vectorSearch.rechercherMotCle(mot);

    }

    totalArticles(){

        return this.articles.length;

    }

}

window.rag=new RAG();

window.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await window.rag.charger();

    }

);

console.log("✅ RAG chargé.");
