"use strict";

/*====================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL V4
 CONSULTATION
====================================================*/

const Consultation = {};

window.Consultation = Consultation;

/*====================================================
AFFICHER UN ARTICLE
====================================================*/

Consultation.afficherArticle = function (article) {

    if (!article) return;

    CodeTravail.articleActuel = article;

    CodeTravail.indexActuel =
        CodeTravail.articles.findIndex(
            a => a.numero === article.numero
        );

    const numero = document.getElementById("numeroArticle");
    const titre = document.getElementById("titreArticle");
    const categorie = document.getElementById("categorieArticle");
    const contenu = document.getElementById("contenuArticle");
    const sanction = document.getElementById("sanctionArticle");
    const questions = document.getElementById("questionsIA");

    if (numero)
        numero.textContent = "Article " + article.numero;

    if (titre)
        titre.textContent = article.titre || "";

    if (categorie)
        categorie.textContent = article.categorie || "";

    if (contenu)
        contenu.innerHTML = article.contenu || "";

    if (sanction) {

        if (article.sanction) {

            sanction.innerHTML = `
                <h4>⚖️ Sanction</h4>
                <p>${article.sanction}</p>
            `;

        } else {

            sanction.innerHTML = "";

        }

    }

    if (questions) {

        questions.innerHTML = "";

        if (
            Array.isArray(article.questionsIA) &&
            article.questionsIA.length
        ) {

            const titreQuestions =
                document.createElement("h4");

            titreQuestions.textContent =
                "🤖 Questions IA";

            questions.appendChild(titreQuestions);

            article.questionsIA.forEach(q => {

                const bouton =
                    document.createElement("button");

                bouton.className =
                    "question-ia";

                bouton.textContent = q;

                bouton.addEventListener(
                    "click",
                    () => {

                        const zone =
                            document.getElementById("questionIA");

                        if (zone) {

                            zone.value = q;

                        }

                    }
                );

                questions.appendChild(bouton);

            });

        }

    }

    Consultation.mettreAJourInformations(article);

};

/*====================================================
INFORMATIONS
====================================================*/

Consultation.mettreAJourInformations = function (article) {

    const infoArticle =
        document.getElementById("infoArticle");

    const infoCategorie =
        document.getElementById("infoCategorie");

    if (infoArticle) {

        infoArticle.textContent =
            "Article " + article.numero;

    }

    if (infoCategorie) {

        infoCategorie.textContent =
            article.categorie;

    }

};

/*====================================================
ARTICLE SUIVANT
====================================================*/

Consultation.suivant = function () {

    const article =
        CodeTravail.articleSuivant();

    if (article) {

        Consultation.afficherArticle(article);

    }

};

/*====================================================
ARTICLE PRECEDENT
====================================================*/

Consultation.precedent = function () {

    const article =
        CodeTravail.articlePrecedent();

    if (article) {

        Consultation.afficherArticle(article);

    }

};

/*====================================================
INITIALISATION
====================================================*/

Consultation.initialiser = function () {

    const btnSuivant =
        document.getElementById(
            "btnArticleSuivant"
        );

    const btnPrecedent =
        document.getElementById(
            "btnArticlePrecedent"
        );

    if (btnSuivant) {

        btnSuivant.addEventListener(
            "click",
            Consultation.suivant
        );

    }

    if (btnPrecedent) {

        btnPrecedent.addEventListener(
            "click",
            Consultation.precedent
        );

    }

    if (CodeTravail.articleActuel) {

        Consultation.afficherArticle(
            CodeTravail.articleActuel
        );

    }

};

/*====================================================
DEMARRAGE
====================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTimeout(() => {

            Consultation.initialiser();

        }, 300);

    }
);
