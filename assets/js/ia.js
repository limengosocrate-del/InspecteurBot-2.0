/*=================================================
 INSPECTEURBOT RDC
 ia.js
 VERSION 1.0
 ASSISTANT JURIDIQUE IA
 PARTIE 1
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};

window.CodeTravail.IA = {};

/*=================================================
 ÉLÉMENTS HTML
==================================================*/

const champQuestion =
    document.querySelector("#questionIA");

const boutonAnalyser =
    document.querySelector("#btnQuestionIA");

const boutonEffacer =
    document.querySelector("#btnEffacerIA");

const boutonCopier =
    document.querySelector("#btnCopierIA");

const boutonLecture =
    document.querySelector("#btnLectureIA");

const zoneReponse =
    document.querySelector("#reponseIA");

/*=================================================
 ÉTAT
==================================================*/

let historiqueQuestions = [];

let derniereQuestion = "";

let derniereReponse = "";

/*=================================================
 POSER UNE QUESTION
==================================================*/

function analyserQuestion() {

    const question =
        champQuestion.value.trim();

    if (!question.length) {

        window.CodeTravail.Utils
            .afficherNotification(

                "Veuillez saisir une question.",

                "warning"

            );

        return;

    }

    derniereQuestion = question;

    historiqueQuestions.push({

        question,

        date: new Date()

    });

    rechercherReponse(question);

}

/*=================================================
 RECHERCHER UNE RÉPONSE
==================================================*/

function rechercherReponse(question) {

    if (

        window.CodeTravail.VectorSearch &&
        typeof window.CodeTravail.VectorSearch.rechercherIntelligemment === "function"

    ) {

        const resultats =

            window.CodeTravail.VectorSearch
                .rechercherIntelligemment(question);

        genererReponse(question, resultats);

    }

    else {

        afficherReponse(

            "La recherche intelligente est indisponible."

        );

    }

                      }

/*=================================================
 PARTIE 2
 GÉNÉRATION DE LA RÉPONSE IA
==================================================*/

/*=================================================
 GÉNÉRER LA RÉPONSE
==================================================*/

function genererReponse(question, resultats = []) {

    if (!resultats.length) {

        afficherReponse(

`Je n'ai trouvé aucun article correspondant à votre question.

Essayez d'utiliser d'autres mots-clés ou recherchez directement un numéro d'article.`

        );

        return;

    }

    const article = resultats[0];

    let reponse = "";

    reponse += "Question :\n";

    reponse += question;

    reponse += "\n\n";

    reponse += "Article recommandé : ";

    reponse += article.numero;

    reponse += "\n";

    reponse += article.titre;

    reponse += "\n\n";

    reponse += "Catégorie : ";

    reponse += article.categorie;

    reponse += "\n\n";

    reponse += "Explication :\n";

    reponse += article.contenu;

    if (

        article.sanction &&

        article.sanction.length

    ) {

        reponse += "\n\n";

        reponse += "Sanction prévue :\n";

        reponse += article.sanction;

    }

    afficherReponse(reponse);

    if (

        window.CodeTravail.Consultation &&

        typeof window.CodeTravail.Consultation.afficherArticle === "function"

    ) {

        window.CodeTravail.Consultation

            .afficherArticle(article);

    }

    if (

        window.CodeTravail.Statistiques

    ) {

        window.CodeTravail.Statistiques

            .incrementerIA();

    }

}

/*=================================================
 AFFICHER LA RÉPONSE
==================================================*/

function afficherReponse(texte) {

    derniereReponse = texte;

    if (zoneReponse) {

        zoneReponse.textContent = texte;

    }

}

/*=================================================
 OBTENIR LA DERNIÈRE RÉPONSE
==================================================*/

function obtenirDerniereReponse() {

    return derniereReponse;

}

/*=================================================
 PARTIE 3
 ACTIONS - EXPORT - INITIALISATION
 VERSION FINALE
==================================================*/

"use strict";

/*=================================================
 EFFACER
==================================================*/

function effacerQuestion() {

    if (champQuestion) {

        champQuestion.value = "";

        champQuestion.focus();

    }

    afficherReponse(

        "Bonjour 👋\n\nJe suis votre assistant juridique intelligent.\n\nPosez votre question concernant le Code du Travail."

    );

}

/*=================================================
 COPIER LA RÉPONSE
==================================================*/

function copierReponse() {

    if (!derniereReponse.length) return;

    navigator.clipboard
        .writeText(derniereReponse)
        .then(() => {

            window.CodeTravail.Utils
                ?.afficherNotification(

                    "Réponse copiée."

                );

        });

}

/*=================================================
 LECTURE VOCALE
==================================================*/

function lireReponse() {

    if (

        window.CodeTravail.Speech &&

        typeof window.CodeTravail.Speech.lire === "function"

    ) {

        window.CodeTravail.Speech

            .lire(derniereReponse);

    }

}

/*=================================================
 QUESTIONS RAPIDES
==================================================*/

function initialiserQuestionsRapides() {

    document

        .querySelectorAll(

            "#questionsRapides button"

        )

        .forEach(button => {

            button.addEventListener(

                "click",

                () => {

                    const question =

                        button.dataset.question || "";

                    if (champQuestion) {

                        champQuestion.value = question;

                    }

                    analyserQuestion();

                }

            );

        });

}

/*=================================================
 INITIALISATION
==================================================*/

function initialiserIA() {

    boutonAnalyser?.addEventListener(

        "click",

        analyserQuestion

    );

    boutonEffacer?.addEventListener(

        "click",

        effacerQuestion

    );

    boutonCopier?.addEventListener(

        "click",

        copierReponse

    );

    boutonLecture?.addEventListener(

        "click",

        lireReponse

    );

    champQuestion?.addEventListener(

        "keydown",

        event => {

            if (

                event.key === "Enter" &&

                !event.shiftKey

            ) {

                event.preventDefault();

                analyserQuestion();

            }

        }

    );

    initialiserQuestionsRapides();

    console.log(

        "🤖 ia.js initialisé."

    );

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.IA.analyser =
    analyserQuestion;

window.CodeTravail.IA.afficher =
    afficherReponse;

window.CodeTravail.IA.effacer =
    effacerQuestion;

window.CodeTravail.IA.copier =
    copierReponse;

window.CodeTravail.IA.lire =
    lireReponse;

window.CodeTravail.IA.derniereReponse =
    obtenirDerniereReponse;

window.CodeTravail.IA.initialiser =
    initialiserIA;

/*=================================================
 DÉMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserIA();

    }

);

/*=================================================
 FIN DU FICHIER
==================================================*/

