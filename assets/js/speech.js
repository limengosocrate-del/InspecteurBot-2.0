/*=================================================
 INSPECTEURBOT RDC
 speech.js
 VERSION 1.0
 RECONNAISSANCE ET LECTURE VOCALE
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};
window.CodeTravail.Speech = {};

/*=================================================
 COMPATIBILITÉ NAVIGATEUR
==================================================*/

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

const synthese =
    window.speechSynthesis;

/*=================================================
 RECONNAISSANCE VOCALE
==================================================*/

let reconnaissance = null;

if (SpeechRecognition) {

    reconnaissance = new SpeechRecognition();

    reconnaissance.lang = "fr-FR";

    reconnaissance.continuous = false;

    reconnaissance.interimResults = false;

    reconnaissance.maxAlternatives = 1;

}

/*=================================================
 ÉTAT
==================================================*/

let ecouteActive = false;

/*=================================================
 DÉMARRER L'ÉCOUTE
==================================================*/

function demarrerEcoute() {

    if (!reconnaissance) {

        window.CodeTravail.Utils
            .afficherNotification(

                "Reconnaissance vocale indisponible.",

                "warning"

            );

        return;

    }

    try {

        reconnaissance.start();

    }

    catch (e) {

        console.error(e);

    }

}

/*=================================================
 ARRÊTER L'ÉCOUTE
==================================================*/

function arreterEcoute() {

    if (!reconnaissance) return;

    reconnaissance.stop();

}

/*=================================================
 ÉVÉNEMENTS
==================================================*/

if (reconnaissance) {

    reconnaissance.onstart = () => {

        ecouteActive = true;

        window.CodeTravail.Utils
            .afficherNotification(

                "🎤 Écoute en cours..."

            );

    };

    reconnaissance.onend = () => {

        ecouteActive = false;

    };

}

/*=================================================
 PARTIE 2
 DICTÉE VOCALE ET LECTURE
==================================================*/

/*=================================================
 RÉSULTAT DE LA DICTÉE
==================================================*/

if (reconnaissance) {

    reconnaissance.onresult = (event) => {

        const texte = event.results[0][0].transcript;

        const champRecherche =
            document.querySelector("#rechercheArticle");

        const questionIA =
            document.querySelector("#questionIA");

        if (champRecherche) {

            champRecherche.value = texte;

        }

        if (
            window.CodeTravail &&
            window.CodeTravail.Search &&
            typeof window.CodeTravail.Search.rechercher === "function"
        ) {

            window.CodeTravail.Search.rechercher();

        }

        if (questionIA && document.activeElement === questionIA) {

            questionIA.value = texte;

        }

        window.CodeTravail.Utils
            .afficherNotification(

                "Recherche vocale terminée."

            );

    };

}

/*=================================================
 GESTION DES ERREURS
==================================================*/

if (reconnaissance) {

    reconnaissance.onerror = (event) => {

        console.error(event.error);

        window.CodeTravail.Utils
            .afficherNotification(

                "Erreur du microphone.",

                "error"

            );

    };

}

/*=================================================
 LECTURE D'UN TEXTE
==================================================*/

function lire(texte) {

    if (!synthese || !texte) return;

    synthese.cancel();

    const voix =
        new SpeechSynthesisUtterance(texte);

    voix.lang = "fr-FR";

    voix.rate = 1;

    voix.pitch = 1;

    voix.volume = 1;

    synthese.speak(voix);

}

/*=================================================
 ARRÊTER LA LECTURE
==================================================*/

function arreterLecture() {

    if (!synthese) return;

    synthese.cancel();

}

/*=================================================
 LIRE L'ARTICLE
==================================================*/

function lireArticle() {

    const numero =
        document.querySelector("#numeroArticle")?.textContent || "";

    const titre =
        document.querySelector("#titreArticle")?.textContent || "";

    const contenu =
        document.querySelector("#contenuArticle")?.textContent || "";

    lire(

`${numero}. ${titre}. ${contenu}`

    );

}

/*=================================================
 LIRE LA RÉPONSE IA
==================================================*/

function lireReponseIA() {

    const texte =
        document.querySelector("#reponseIA")?.textContent || "";

    lire(texte);

}

/*=================================================
 PARTIE 3
 INITIALISATION
 VERSION FINALE
==================================================*/

/*=================================================
 INITIALISATION DES BOUTONS
==================================================*/

function initialiserSpeech() {

    document
        .querySelector("#btnMicro")
        ?.addEventListener(

            "click",

            demarrerEcoute

        );

    document
        .querySelector("#btnRechercheVocale")
        ?.addEventListener(

            "click",

            demarrerEcoute

        );

    document
        .querySelector("#btnLecture")
        ?.addEventListener(

            "click",

            lireArticle

        );

    document
        .querySelector("#btnLectureArticle")
        ?.addEventListener(

            "click",

            lireArticle

        );

    document
        .querySelector("#btnLectureIA")
        ?.addEventListener(

            "click",

            lireReponseIA

        );

    console.log(

        "🎤 speech.js initialisé."

    );

}

/*=================================================
 CHANGER LA LANGUE
==================================================*/

function changerLangue(langue = "fr-FR") {

    if (!reconnaissance) return;

    reconnaissance.lang = langue;

}

/*=================================================
 ÉTAT DU MICROPHONE
==================================================*/

function microphoneActif() {

    return ecouteActive;

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Speech.demarrer =
    demarrerEcoute;

window.CodeTravail.Speech.arreter =
    arreterEcoute;

window.CodeTravail.Speech.lire =
    lire;

window.CodeTravail.Speech.lireArticle =
    lireArticle;

window.CodeTravail.Speech.lireIA =
    lireReponseIA;

window.CodeTravail.Speech.arreterLecture =
    arreterLecture;

window.CodeTravail.Speech.changerLangue =
    changerLangue;

window.CodeTravail.Speech.microphoneActif =
    microphoneActif;

window.CodeTravail.Speech.initialiser =
    initialiserSpeech;

/*=================================================
 DÉMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserSpeech();

    }

);

/*=================================================
 FIN DU FICHIER
==================================================*/
