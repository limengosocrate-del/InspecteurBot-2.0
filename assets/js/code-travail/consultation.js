"use strict";

/*=====================================================
 INSPECTEURBOT RDC
 CONSULTATION.JS
=====================================================*/

const Consultation = {};

window.Consultation = Consultation;

/*=====================================================
 ARTICLE ACTUEL
=====================================================*/

Consultation.articleActuel = null;

/*=====================================================
 AFFICHER UN ARTICLE
=====================================================*/

Consultation.afficherArticle = function (article) {

    if (!article) return;

    Consultation.articleActuel = article;

    document.getElementById("numeroArticle").textContent =
        "Article " + article.numero;

    document.getElementById("titreArticle").textContent =
        article.titre;

    document.getElementById("categorieArticle").textContent =
        article.categorie;

    document.getElementById("contenuArticle").textContent =
        article.contenu;

    const sanction =
        document.getElementById("sanctionArticle");

    if (article.sanction) {

        sanction.innerHTML = `
            <h4>
                <i class="fa-solid fa-gavel"></i>
                Sanction
            </h4>

            <p>${article.sanction}</p>
        `;

        sanction.style.display = "block";

    } else {

        sanction.innerHTML = "";

        sanction.style.display = "none";

    }

    const questions =
        document.getElementById("questionsIA");

    questions.innerHTML = "";

    if (article.questionsIA &&
        article.questionsIA.length > 0) {

        const titre =
            document.createElement("h4");

        titre.innerHTML =
            '<i class="fa-solid fa-robot"></i> Questions IA';

        questions.appendChild(titre);

        article.questionsIA.forEach(question => {

            const bouton =
                document.createElement("button");

            bouton.className =
                "question-ia";

            bouton.textContent =
                question;

            bouton.onclick = function () {

                const champ =
                    document.getElementById("questionIA");

                if (champ) {

                    champ.value = question;

                    champ.focus();

                }

            };

            questions.appendChild(bouton);

        });

    }

    Consultation.mettreInfos(article);

    window.scrollTo({

        top: document.getElementById("articleCard").offsetTop - 20,

        behavior: "smooth"

    });

};

/*=====================================================
 INFORMATIONS
=====================================================*/

Consultation.mettreInfos = function (article) {

    const infoArticle =
        document.getElementById("infoArticle");

    const infoCategorie =
        document.getElementById("infoCategorie");

    if (infoArticle)

        infoArticle.textContent =
            "Article " + article.numero;

    if (infoCategorie)

        infoCategorie.textContent =
            article.categorie;

};

/*=====================================================
 ARTICLE SUIVANT
=====================================================*/

Consultation.suivant = function () {

    if (!Consultation.articleActuel) return;

    const suivant =
        CodeTravail.articleSuivant(

            Consultation.articleActuel.numero

        );

    Consultation.afficherArticle(suivant);

};

/*=====================================================
 ARTICLE PRECEDENT
=====================================================*/

Consultation.precedent = function () {

    if (!Consultation.articleActuel) return;

    const precedent =
        CodeTravail.articlePrecedent(

            Consultation.articleActuel.numero

        );

    Consultation.afficherArticle(precedent);

};

/*=====================================================
 COPIER
=====================================================*/

Consultation.copier = function () {

    if (!Consultation.articleActuel) return;

    const texte =

        "Article " +

        Consultation.articleActuel.numero +

        "\n\n" +

        Consultation.articleActuel.titre +

        "\n\n" +

        Consultation.articleActuel.contenu;

    navigator.clipboard.writeText(texte);

};

/*=====================================================
 LECTURE VOCALE
=====================================================*/

Consultation.lire = function () {

    if (!Consultation.articleActuel) return;

    speechSynthesis.cancel();

    const lecture =
        new SpeechSynthesisUtterance(

            Consultation.articleActuel.contenu

        );

    lecture.lang = "fr-FR";

    speechSynthesis.speak(lecture);

};

/*=====================================================
 PARTAGER
=====================================================*/

Consultation.partager = async function () {

    if (!Consultation.articleActuel) return;

    const texte =

        "Article " +

        Consultation.articleActuel.numero +

        " - " +

        Consultation.articleActuel.titre +

        "\n\n" +

        Consultation.articleActuel.contenu;

    if (navigator.share) {

        await navigator.share({

            title:
                "Code du Travail RDC",

            text:
                texte

        });

    }

};

/*=====================================================
 INITIALISATION
=====================================================*/

Consultation.initialiser = function () {

    const precedent =
        document.getElementById("btnArticlePrecedent");

    const suivant =
        document.getElementById("btnArticleSuivant");

    const copier =
        document.getElementById("btnCopierArticle");

    const lecture =
        document.getElementById("btnLectureArticle");

    const partager =
        document.getElementById("btnPartagerArticle");

    if (precedent)

        precedent.onclick =
            Consultation.precedent;

    if (suivant)

        suivant.onclick =
            Consultation.suivant;

    if (copier)

        copier.onclick =
            Consultation.copier;

    if (lecture)

        lecture.onclick =
            Consultation.lire;

    if (partager)

        partager.onclick =
            Consultation.partager;

};

/*=====================================================
 DOM READY
=====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    Consultation.initialiser

);
