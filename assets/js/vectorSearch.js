/*=================================================
 INSPECTEURBOT RDC
 vectorSearch.js
 VERSION 1.0
 RECHERCHE VECTORIELLE
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};

window.CodeTravail.VectorSearch = {};

/*=================================================
 MOTS VIDES
==================================================*/

const MOTS_VIDES = [

    "le","la","les","de","du","des",
    "un","une","et","ou","à","au",
    "aux","pour","par","avec","sur",
    "dans","est","sont","en","d","l"

];

/*=================================================
 NORMALISATION
==================================================*/

function normaliserTexte(texte = "") {

    return texte

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .replace(/[^\w\s]/g, " ")

        .replace(/\s+/g, " ")

        .trim();

}

/*=================================================
 DÉCOUPAGE
==================================================*/

function decouperTexte(texte) {

    return normaliserTexte(texte)

        .split(" ")

        .filter(

            mot =>

                mot.length > 1 &&

                !MOTS_VIDES.includes(mot)

        );

}

/*=================================================
 SCORE D'UN ARTICLE
==================================================*/

function calculerScore(article, motsRecherche) {

    let score = 0;

    const texte = normaliserTexte(

        [

            article.numero,

            article.titre,

            article.categorie,

            article.contenu,

            article.sanction

        ].join(" ")

    );

    motsRecherche.forEach(mot => {

        if (texte.includes(mot)) {

            score += 10;

        }

    });

    return score;

     }

/*=================================================
 PARTIE 2
 MOTEUR DE RECHERCHE VECTORIELLE
==================================================*/

/*=================================================
 RECHERCHE PAR PERTINENCE
==================================================*/

function rechercher(texte) {

    if (
        !window.CodeTravail ||
        !window.CodeTravail.Index ||
        !Array.isArray(window.CodeTravail.Index.articles)
    ) {

        console.error("Base des articles introuvable.");

        return [];

    }

    const articles =
        window.CodeTravail.Index.articles;

    const motsRecherche =
        decouperTexte(texte);

    const resultats = [];

    articles.forEach(article => {

        const score = calculerScore(

            article,

            motsRecherche

        );

        if (score > 0) {

            resultats.push({

                ...article,

                score

            });

        }

    });

    resultats.sort(

        (a, b) => b.score - a.score

    );

    return resultats;

}

/*=================================================
 MEILLEUR RÉSULTAT
==================================================*/

function meilleurResultat(texte) {

    const resultats =
        rechercher(texte);

    if (!resultats.length) {

        return null;

    }

    return resultats[0];

}

/*=================================================
 LIMITER LES RÉSULTATS
==================================================*/

function rechercherLimite(

    texte,

    limite = 20

) {

    return rechercher(texte)

        .slice(0, limite);

}

/*=================================================
 FILTRER PAR CATÉGORIE
==================================================*/

function rechercherCategorie(

    categorie,

    texte = ""

) {

    return rechercher(texte)

        .filter(article =>

            article.categorie === categorie

        );

}

/*=================================================
 PARTIE 3
 SYNONYMES - EXPORT - INITIALISATION
 VERSION FINALE
==================================================*/

/*=================================================
 DICTIONNAIRE DE SYNONYMES
==================================================*/

const SYNONYMES = {

    licenciement: [
        "renvoi",
        "rupture",
        "congédiement"
    ],

    salaire: [
        "paie",
        "rémunération",
        "revenu"
    ],

    employeur: [
        "entreprise",
        "patron",
        "société"
    ],

    travailleur: [
        "employé",
        "salarié",
        "agent"
    ],

    congé: [
        "vacances",
        "repos",
        "permission"
    ],

    inspection: [
        "contrôle",
        "inspecteur",
        "vérification"
    ]

};

/*=================================================
 AJOUTER LES SYNONYMES
==================================================*/

function enrichirMots(mots) {

    const liste = [...mots];

    mots.forEach(mot => {

        if (SYNONYMES[mot]) {

            liste.push(...SYNONYMES[mot]);

        }

    });

    return [...new Set(liste)];

}

/*=================================================
 RECHERCHE INTELLIGENTE
==================================================*/

function rechercherIntelligemment(texte) {

    const mots = enrichirMots(

        decouperTexte(texte)

    );

    const articles =
        window.CodeTravail.Index.articles || [];

    const resultats = [];

    articles.forEach(article => {

        const score = calculerScore(

            article,

            mots

        );

        if (score > 0) {

            resultats.push({

                ...article,

                score

            });

        }

    });

    resultats.sort(

        (a, b) => b.score - a.score

    );

    return resultats;

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.VectorSearch.normaliser =
    normaliserTexte;

window.CodeTravail.VectorSearch.decouper =
    decouperTexte;

window.CodeTravail.VectorSearch.score =
    calculerScore;

window.CodeTravail.VectorSearch.rechercher =
    rechercher;

window.CodeTravail.VectorSearch.rechercherLimite =
    rechercherLimite;

window.CodeTravail.VectorSearch.meilleurResultat =
    meilleurResultat;

window.CodeTravail.VectorSearch.rechercherCategorie =
    rechercherCategorie;

window.CodeTravail.VectorSearch.rechercherIntelligemment =
    rechercherIntelligemment;

/*=================================================
 INITIALISATION
==================================================*/

function initialiserVectorSearch() {

    console.log(

        "🧠 VectorSearch initialisé."

    );

}

window.CodeTravail.VectorSearch.initialiser =
    initialiserVectorSearch;

document.addEventListener(

    "DOMContentLoaded",

    initialiserVectorSearch

);

/*=================================================
 FIN DU FICHIER
==================================================*/
