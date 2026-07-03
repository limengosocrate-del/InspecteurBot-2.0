"use strict";

/*==================================================
OBJET ASSISTANT IA
==================================================*/

const AssistantIA = {

    initialisee: false,

    voix: {

        homme: null,

        femme: null

    },

    synthese: window.speechSynthesis,

    enCours: false

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.AssistantIA = AssistantIA;

/*==================================================
INITIALISATION
==================================================*/

AssistantIA.initialiser = function () {

    if (this.initialisee) return;

    this.initialisee = true;

    console.log("Assistant IA initialisé.");

    this.chargerVoix();

};

/*==================================================
CHARGEMENT DES VOIX
==================================================*/

AssistantIA.chargerVoix = function () {

    const voices = speechSynthesis.getVoices();

    if (!voices || voices.length === 0) {

        setTimeout(() => this.chargerVoix(), 500);

        return;

    }

    /*--------------------------
    VOIX FEMME (priorité FR)
    --------------------------*/

    this.voix.femme =
        voices.find(v =>
            v.lang.includes("fr") &&
            v.name.toLowerCase().includes("female")
        ) ||
        voices.find(v =>
            v.lang.includes("fr")
        ) ||
        voices[0];

    /*--------------------------
    VOIX HOMME (approximation)
    --------------------------*/

    this.voix.homme =
        voices.find(v =>
            v.lang.includes("fr") &&
            v.name.toLowerCase().includes("male")
        ) ||
        voices.find(v =>
            v.lang.includes("fr")
        ) ||
        voices[1] ||
        voices[0];

    console.log("Voix chargées :", this.voix);

};

/*==================================================
PARLER TEXTE
==================================================*/

AssistantIA.parler = function (texte, genre = "femme") {

    if (!texte) return;

    if (!this.synthese) return;

    this.stop();

    const utterance =
        new SpeechSynthesisUtterance(texte);

    utterance.lang = "fr-FR";

    if (genre === "homme") {

        utterance.voice = this.voix.homme;

        utterance.pitch = 0.8;

    } else {

        utterance.voice = this.voix.femme;

        utterance.pitch = 1.1;

    }

    utterance.rate = 1;

    this.synthese.speak(utterance);

};

/*==================================================
STOP
==================================================*/

AssistantIA.stop = function () {

    if (this.synthese) {

        this.synthese.cancel();

    }

};

/*==================================================
ANALYSER ARTICLE
==================================================*/

AssistantIA.analyser = function (article, question = "") {

    if (this.enCours) return;

    this.enCours = true;

    let texte = "";

    if (article) {

        texte += "Article " + article.numero + ". ";

        texte += article.titre + ". ";

        texte += article.contenu;

    }

    if (question) {

        texte += " Question : " + question;

    }

    const reponse =
        this.genererReponseSimple(article, question);

    this.afficherReponse(reponse);

    this.enCours = false;

    return reponse;

};

/*==================================================
GÉNÉRATION DE RÉPONSE
==================================================*/

AssistantIA.genererReponseSimple = function (article, question) {

    if (!article && !question) {

        return "Veuillez poser une question ou sélectionner un article.";

    }

    let base = "";

    if (article) {

        base += "Analyse de l'article " + article.numero + " :\n\n";

        base += "Cet article traite de : " +
                (article.titre || "sujet juridique") +
                ".\n\n";

        base += "Explication simplifiée : " +
                this.simplifierTexte(article.contenu) +
                "\n\n";

    }

    if (question) {

        base += "Réponse à la question : " + question + "\n\n";

        base += "Réponse juridique probable basée sur le Code du Travail de la RDC.";

    }

    return base;

};

/*==================================================
SIMPLIFIER TEXTE
==================================================*/

AssistantIA.simplifierTexte = function (texte) {

    if (!texte) return "";

    return texte
        .replace(/\s+/g, " ")
        .trim()
        .substring(0, 300) + "...";

};

/*==================================================
AFFICHER RÉPONSE IA
==================================================*/

AssistantIA.afficherReponse = function (texte) {

    const zone =
        document.getElementById("reponseIA");

    if (!zone) return;

    zone.innerText = texte;

};

/*==================================================
INITIALISATION AUTOMATIQUE
==================================================*/

document.addEventListener("codeTravailCharge", () => {

    AssistantIA.initialiser();

});

/*==================================================
BOUTONS VOIX UI
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const btnLecture =
        document.getElementById("btnLectureIA");

    const btnEffacer =
        document.getElementById("btnEffacerIA");

    const btnCopier =
        document.getElementById("btnCopierIA");

    /*--------------------------
    LECTURE VOCALE (FEMME PAR DÉFAUT)
    --------------------------*/

    if (btnLecture) {

        btnLecture.addEventListener("click", () => {

            const texte =
                document.getElementById("reponseIA")
                ?.innerText;

            AssistantIA.parler(texte, "femme");

        });

    }

    /*--------------------------
    EFFACER
    --------------------------*/

    if (btnEffacer) {

        btnEffacer.addEventListener("click", () => {

            document.getElementById("questionIA").value = "";

            document.getElementById("reponseIA").innerText =
                "Réponse effacée.";

        });

    }

    /*--------------------------
    COPIER
    --------------------------*/

    if (btnCopier) {

        btnCopier.addEventListener("click", () => {

            const texte =
                document.getElementById("reponseIA")
                ?.innerText;

            if (texte) {

                navigator.clipboard.writeText(texte);

            }

        });

    }

});
