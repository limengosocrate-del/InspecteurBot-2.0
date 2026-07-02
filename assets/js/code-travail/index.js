"use strict";

/* =====================================================
   INSPECTEURBOT RDC
   CODE DU TRAVAIL
   MODULE : INDEX
   ===================================================== */

const CodeTravail = {

    articles: [],

    charge: false,

    async initialiser() {

        try {

            const reponse = await fetch("data/code-travail.json");

            if (!reponse.ok) {

                throw new Error(
                    "Impossible de charger le Code du Travail."
                );

            }

            this.articles = await reponse.json();

            this.charge = true;

            console.log(
                "Code du Travail chargé :",
                this.articles.length,
                "articles."
            );

            document.dispatchEvent(
                new CustomEvent("codeTravailCharge", {
                    detail: this.articles
                })
            );

        } catch (erreur) {

            console.error(erreur);

        }

    }

};

window.CodeTravail = CodeTravail;

document.addEventListener("DOMContentLoaded", () => {

    CodeTravail.initialiser();

});

/* =====================================================
   MÉTHODES D'ACCÈS AUX ARTICLES
   ===================================================== */

CodeTravail.getTous = function () {

    return this.articles;

};

CodeTravail.getParNumero = function (numero) {

    return this.articles.find(

        article => article.numero === Number(numero)

    ) || null;

};

CodeTravail.getParId = function (id) {

    return this.articles.find(

        article => article.id === id

    ) || null;

};

CodeTravail.getParCategorie = function (categorie) {

    return this.articles.filter(

        article => article.categorie === categorie

    );

};

CodeTravail.nombreArticles = function () {

    return this.articles.length;

};
