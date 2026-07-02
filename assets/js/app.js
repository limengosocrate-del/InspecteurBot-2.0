/*=================================================
 INSPECTEURBOT RDC
 app.js
 VERSION 1.0
 CHEF D'ORCHESTRE DE L'APPLICATION
 PARTIE 1
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};

window.CodeTravail.App = {};

/*=================================================
 CONFIGURATION
==================================================*/

const CONFIG = {

    version: "2026.1",

    nom: "InspecteurBot RDC",

    auteur: "Inspecteur Limengo (Pmiller)",

    modeDebug: false

};

/*=================================================
 ÉTAT GLOBAL
==================================================*/

const ETAT = {

    initialise: false,

    demarrage: null,

    modulesCharges: []

};

/*=================================================
 ENREGISTRER UN MODULE
==================================================*/

function enregistrerModule(nom) {

    if (!ETAT.modulesCharges.includes(nom)) {

        ETAT.modulesCharges.push(nom);

    }

}

/*=================================================
 VÉRIFIER UN MODULE
==================================================*/

function verifierModule(objet, nom) {

    if (objet) {

        enregistrerModule(nom);

        return true;

    }

    console.warn(

        "Module absent :", nom

    );

    return false;

        }

/*=================================================
 PARTIE 2
 INITIALISATION DES MODULES
==================================================*/

/*=================================================
 INITIALISER UN MODULE
==================================================*/

function initialiserModule(module, nom) {

    try {

        if (

            module &&

            typeof module.initialiser === "function"

        ) {

            module.initialiser();

            enregistrerModule(nom);

            console.log(

                "✅ " + nom + " initialisé."

            );

        }

    }

    catch (erreur) {

        console.error(

            "Erreur dans " + nom,

            erreur

        );

    }

}

/*=================================================
 INITIALISATION GÉNÉRALE
==================================================*/

function initialiserApplication() {

    ETAT.demarrage = new Date();

    /*=========================================
      CODE DU TRAVAIL
    =========================================*/

    initialiserModule(

        window.CodeTravail.Index,

        "Index"

    );

    initialiserModule(

        window.CodeTravail.Consultation,

        "Consultation"

    );

    initialiserModule(

        window.CodeTravail.Recherche,

        "Recherche"

    );

    initialiserModule(

        window.CodeTravail.Navigation,

        "Navigation"

    );

    initialiserModule(

        window.CodeTravail.Categories,

        "Categories"

    );

    /*=========================================
      MODULES PRINCIPAUX
    =========================================*/

    initialiserModule(

        window.CodeTravail.VectorSearch,

        "VectorSearch"

    );

    initialiserModule(

        window.CodeTravail.Search,

        "Search"

    );

    initialiserModule(

        window.CodeTravail.Speech,

        "Speech"

    );

    initialiserModule(

        window.CodeTravail.Traduction,

        "Traduction"

    );

    initialiserModule(

        window.CodeTravail.Favoris,

        "Favoris"

    );

    initialiserModule(

        window.CodeTravail.Statistiques,

        "Statistiques"

    );

    initialiserModule(

        window.CodeTravail.IA,

        "IA"

    );

    ETAT.initialise = true;

}

/*=================================================
 PARTIE 3
 EXPORT - DÉMARRAGE
 VERSION FINALE
==================================================*/

/*=================================================
 INFORMATIONS
==================================================*/

function informations() {

    return {

        nom: CONFIG.nom,

        version: CONFIG.version,

        auteur: CONFIG.auteur,

        initialise: ETAT.initialise,

        demarrage: ETAT.demarrage,

        modules: ETAT.modulesCharges

    };

}

/*=================================================
 RAPPORT
==================================================*/

function afficherRapport() {

    console.group(

        "📋 InspecteurBot RDC"

    );

    console.log(

        "Nom :", CONFIG.nom

    );

    console.log(

        "Version :", CONFIG.version

    );

    console.log(

        "Auteur :", CONFIG.auteur

    );

    console.log(

        "Modules :", ETAT.modulesCharges

    );

    console.groupEnd();

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.App.config =
    CONFIG;

window.CodeTravail.App.etat =
    ETAT;

window.CodeTravail.App.initialiser =
    initialiserApplication;

window.CodeTravail.App.informations =
    informations;

window.CodeTravail.App.rapport =
    afficherRapport;

/*=================================================
 DÉMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserApplication();

        afficherRapport();

        console.log(

            "🚀 InspecteurBot RDC prêt."

        );

    }

);

/*=================================================
 GESTION DES ERREURS GLOBALES
==================================================*/

window.addEventListener(

    "error",

    event => {

        console.error(

            "Erreur JavaScript :",

            event.message

        );

    }

);

window.addEventListener(

    "unhandledrejection",

    event => {

        console.error(

            "Promesse rejetée :",

            event.reason

        );

    }

);

/*=================================================
 FIN DU FICHIER
==================================================*/
