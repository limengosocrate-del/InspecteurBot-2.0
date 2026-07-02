/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 1/3
 Chargement du JSON
==================================================*/

"use strict";

/*==================================================
ESPACE GLOBAL
==================================================*/

window.CodeTravail = {

    articles: [],

    articleActuel: null,

    indexActuel: -1,

    categories: [],

    statistiques: {

        consultations: 0,

        recherches: 0,

        favoris: 0,

        ia: 0

    }

};

/*==================================================
CHARGEMENT DU JSON
==================================================*/

async function chargerCodeTravail(){

    try{

        const response = await fetch(
            "assets/data/code-travail.json"
        );

        if(!response.ok){

            throw new Error(
                "Impossible de charger le Code du Travail."
            );

        }

        const data = await response.json();

        CodeTravail.articles = data;

        initialiserCategories();

        mettreAJourBadges();

        afficherStatistiques();

        console.log(
            "Code du Travail chargé :",
            data.length,
            "articles"
        );

    }

    catch(erreur){

        console.error(erreur);

        afficherErreurChargement();

    }

}

/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 2/3
 Initialisation
==================================================*/

/*==================================================
INITIALISER LES CATÉGORIES
==================================================*/

function initialiserCategories(){

    const liste = new Set();

    CodeTravail.articles.forEach(article=>{

        if(article.categorie){

            liste.add(article.categorie);

        }

    });

    CodeTravail.categories = [...liste].sort();

}

/*==================================================
BADGES DES CATÉGORIES
==================================================*/

function mettreAJourBadges(){

    const badges={

        "Dispositions générales":"badgeDispositions",

        "Contrat de travail":"badgeContrat",

        "Salaire":"badgeSalaire",

        "Temps de travail":"badgeTemps",

        "Congés":"badgeConges",

        "Santé et sécurité":"badgeSecurite",

        "Inspection du Travail":"badgeInspection",

        "Infractions et sanctions":"badgeSanctions"

    };

    Object.entries(badges).forEach(([categorie,id])=>{

        const element=document.getElementById(id);

        if(!element) return;

        const total=CodeTravail.articles.filter(article=>

            article.categorie===categorie

        ).length;

        element.textContent=

            total+" article"+(total>1?"s":"");

    });

}

/*==================================================
STATISTIQUES
==================================================*/

function afficherStatistiques(){

    const totalArticles=document.getElementById("statArticles");

    if(totalArticles){

        totalArticles.textContent=

            CodeTravail.articles.length;

    }

}

/*==================================================
ERREUR DE CHARGEMENT
==================================================*/

function afficherErreurChargement(){

    const contenu=document.getElementById("contenuArticle");

    if(contenu){

        contenu.innerHTML=`

        <div class="erreur-code">

            <h3>❌ Chargement impossible</h3>

            <p>

                Le fichier code-travail.json est introuvable
                ou contient une erreur.

            </p>

        </div>

        `;

    }

}

/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 3/3
 Démarrage de l'application
==================================================*/

/*==================================================
INITIALISATION DES MODULES
==================================================*/

function demarrerCodeTravail(){

    console.log("Initialisation des modules...");

    if(typeof initialiserConsultation==="function"){

        initialiserConsultation();

    }

    if(typeof initialiserRecherche==="function"){

        initialiserRecherche();

    }

    if(typeof initialiserNavigation==="function"){

        initialiserNavigation();

    }

    if(typeof initialiserCategoriesUI==="function"){

        initialiserCategoriesUI();

    }

    if(typeof initialiserFavoris==="function"){

        initialiserFavoris();

    }

    if(typeof initialiserStatistiques==="function"){

        initialiserStatistiques();

    }

    if(typeof initialiserSpeech==="function"){

        initialiserSpeech();

    }

    if(typeof initialiserAssistantIA==="function"){

        initialiserAssistantIA();

    }

    if(CodeTravail.articles.length>0){

        CodeTravail.articleActuel=
            CodeTravail.articles[0];

        CodeTravail.indexActuel=0;

        if(typeof afficherArticle==="function"){

            afficherArticle(
                CodeTravail.articleActuel
            );

        }

    }

    masquerChargement();

}

/*==================================================
ÉCRAN DE CHARGEMENT
==================================================*/

function masquerChargement(){

    const loading=document.getElementById(
        "loadingScreen"
    );

    if(!loading) return;

    loading.style.opacity="0";

    setTimeout(()=>{

        loading.style.display="none";

    },500);

}

/*==================================================
DÉMARRAGE
==================================================*/

document.addEventListener(
    "DOMContentLoaded",
    async()=>{

        await chargerCodeTravail();

        demarrerCodeTravail();

    }
);

/*==================================================
EXPORT GLOBAL
==================================================*/

window.CodeTravail=CodeTravail;

window.chargerCodeTravail=chargerCodeTravail;

window.demarrerCodeTravail=demarrerCodeTravail;
