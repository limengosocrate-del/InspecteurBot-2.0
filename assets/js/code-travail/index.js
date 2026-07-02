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
