/*=================================================
 INSPECTEURBOT RDC
 traduction.js
 VERSION 1.0
 GESTION DES LANGUES
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};
window.CodeTravail.Traduction = {};

/*=================================================
 LANGUE PAR DÉFAUT
==================================================*/

let langueCourante = "fr";

/*=================================================
 DICTIONNAIRE
==================================================*/

const DICTIONNAIRE = {

    fr: {

        recherche: "Recherche Intelligente",

        consulter: "Consultation des Articles",

        assistant: "Assistant Juridique IA",

        analyser: "Analyser",

        effacer: "Effacer",

        copier: "Copier",

        partager: "Partager",

        imprimer: "Imprimer",

        favoris: "Favori"

    },

    en: {

        recherche: "Smart Search",

        consulter: "Article Viewer",

        assistant: "AI Legal Assistant",

        analyser: "Analyze",

        effacer: "Clear",

        copier: "Copy",

        partager: "Share",

        imprimer: "Print",

        favoris: "Favorite"

    },

    ln: {

        recherche: "Boluki",

        consulter: "Kotala Article",

        assistant: "Mosungi IA",

        analyser: "Talela",

        effacer: "Longola",

        copier: "Kopi",

        partager: "Kabola",

        imprimer: "Imprimer",

        favoris: "Favori"

    },

    sw: {

        recherche: "Utafutaji",

        consulter: "Soma Makala",

        assistant: "Msaidizi IA",

        analyser: "Chambua",

        effacer: "Futa",

        copier: "Nakili",

        partager: "Shiriki",

        imprimer: "Chapisha",

        favoris: "Pendwa"

    },

    lu: {

        recherche: "Kulonda",

        consulter: "Kubala",

        assistant: "Musadidi IA",

        analyser: "Sangana",

        effacer: "Futa",

        copier: "Kopiya",

        partager: "Kabula",

        imprimer: "Imprima",

        favoris: "Favori"

    },

    kg: {

        recherche: "Sosa",

        consulter: "Tanga",

        assistant: "Nsadisi IA",

        analyser: "Tala",

        effacer: "Katula",

        copier: "Kopa",

        partager: "Kabula",

        imprimer: "Imprimer",

        favoris: "Favori"

    }

};

/*=================================================
 PARTIE 2
 CHANGEMENT DE LANGUE
==================================================*/

/*=================================================
 APPLIQUER UNE LANGUE
==================================================*/

function appliquerLangue(langue = "fr") {

    if (!DICTIONNAIRE[langue]) {

        langue = "fr";

    }

    langueCourante = langue;

    localStorage.setItem(

        "inspecteurbot_langue",

        langue

    );

    /*=========================================
      SYNCHRONISATION AVEC SPEECH.JS
    =========================================*/

    if (window.CodeTravail.Speech) {

        const langues = {

            fr: "fr-FR",

            en: "en-GB",

            ln: "fr-CD",

            sw: "sw-CD",

            lu: "fr-CD",

            kg: "fr-CD"

        };

        window.CodeTravail.Speech
            .changerLangue(

                langues[langue] || "fr-FR"

            );

    }

    /*=========================================
      BOUTONS
    =========================================*/

    document
        .querySelector("#btnQuestionIA")
        ?.replaceChildren(

            document.createTextNode(

                DICTIONNAIRE[langue].analyser

            )

        );

    document
        .querySelector("#btnEffacerIA")
        ?.replaceChildren(

            document.createTextNode(

                DICTIONNAIRE[langue].effacer

            )

        );

    document
        .querySelector("#btnCopierIA")
        ?.replaceChildren(

            document.createTextNode(

                DICTIONNAIRE[langue].copier

            )

        );

    document
        .querySelector("#btnPartagerArticle")
        ?.replaceChildren(

            document.createTextNode(

                DICTIONNAIRE[langue].partager

            )

        );

    document
        .querySelector("#btnImprimerArticle")
        ?.replaceChildren(

            document.createTextNode(

                DICTIONNAIRE[langue].imprimer

            )

        );

    document
        .querySelector("#btnFavoriArticle")
        ?.replaceChildren(

            document.createTextNode(

                DICTIONNAIRE[langue].favoris

            )

        );

    window.CodeTravail.Utils
        ?.afficherNotification(

            "Langue : " + langue.toUpperCase()

        );

}

/*=================================================
 LANGUE SAUVEGARDÉE
==================================================*/

function chargerLangue() {

    const langue =

        localStorage.getItem(

            "inspecteurbot_langue"

        ) || "fr";

    const select =

        document.querySelector("#langue");

    if (select) {

        select.value = langue;

    }

    appliquerLangue(langue);

     }

/*=================================================
 PARTIE 3
 INITIALISATION
 VERSION FINALE
==================================================*/

/*=================================================
 CHANGEMENT DE LANGUE
==================================================*/

function changerLangue(event) {

    appliquerLangue(event.target.value);

}

/*=================================================
 LANGUE ACTUELLE
==================================================*/

function obtenirLangue() {

    return langueCourante;

}

/*=================================================
 CODE VOCAL
==================================================*/

function obtenirCodeVocal() {

    switch (langueCourante) {

        case "en":
            return "en-GB";

        case "ln":
            return "fr-CD";

        case "sw":
            return "sw-CD";

        case "lu":
            return "fr-CD";

        case "kg":
            return "fr-CD";

        default:
            return "fr-FR";

    }

}

/*=================================================
 INITIALISATION
==================================================*/

function initialiserTraduction() {

    const select =

        document.querySelector("#langue");

    if (select) {

        select.addEventListener(

            "change",

            changerLangue

        );

    }

    chargerLangue();

    console.log(

        "🌍 traduction.js initialisé."

    );

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Traduction.initialiser =
    initialiserTraduction;

window.CodeTravail.Traduction.appliquer =
    appliquerLangue;

window.CodeTravail.Traduction.obtenirLangue =
    obtenirLangue;

window.CodeTravail.Traduction.obtenirCodeVocal =
    obtenirCodeVocal;

/*=================================================
 DÉMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserTraduction();

    }

);

/*=================================================
 FIN DU FICHIER
==================================================*/
