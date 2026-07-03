/*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 1
 INITIALISATION GÉNÉRALE
==================================================*/

"use strict";

/*==================================================
ESPACE GLOBAL
==================================================*/

const CodeTravail = {

    articles: [],

    articleActuel: null,

    indexActuel: -1,

    categories: [],

    charge: false,

    statistiques:{

        consultations:0,

        recherches:0,

        favoris:0,

        ia:0

    }

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.CodeTravail = CodeTravail;

/*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 2
 CHARGEMENT DU CODE DU TRAVAIL
==================================================*/

/*==================================================
CHARGER LE FICHIER JSON
==================================================*/

async function chargerCodeTravail(){

    try{

        const reponse = await fetch(

            "assets/data/code-travail.json",

            {

                cache:"no-cache"

            }

        );

        if(!reponse.ok){

            throw new Error(

                "Impossible de charger le fichier code-travail.json"

            );

        }

        const donnees = await reponse.json();

        if(!Array.isArray(donnees)){

            throw new Error(

                "Le fichier JSON est invalide."

            );

        }

        CodeTravail.articles = donnees;

        CodeTravail.charge = true;

        console.log(

            "Code du Travail chargé :",

            donnees.length,

            "articles"

        );

        document.dispatchEvent(

            new CustomEvent(

                "codeTravailCharge",

                {

                    detail:{

                        total:donnees.length

                    }

                }

            )

        );

    }

    catch(erreur){

        console.error(

            "Erreur de chargement :",

            erreur

        );

        CodeTravail.charge = false;

        document.dispatchEvent(

            new CustomEvent(

                "codeTravailErreur",

                {

                    detail:erreur

                }

            )

        );

    }

 /*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 3
 MÉTHODES GLOBALES
==================================================*/

/*==================================================
OBTENIR TOUS LES ARTICLES
==================================================*/

CodeTravail.getTous = function(){

    return this.articles;

};

/*==================================================
OBTENIR UN ARTICLE PAR NUMÉRO
==================================================*/

CodeTravail.getParNumero = function(numero){

    return this.articles.find(

        article => article.numero === Number(numero)

    ) || null;

};

/*==================================================
OBTENIR UN ARTICLE PAR ID
==================================================*/

CodeTravail.getParId = function(id){

    return this.articles.find(

        article => article.id === id

    ) || null;

};

/*==================================================
OBTENIR UN ARTICLE PAR INDEX
==================================================*/

CodeTravail.getParIndex = function(index){

    if(

        index < 0 ||

        index >= this.articles.length

    ){

        return null;

    }

    return this.articles[index];

};

/*==================================================
SÉLECTIONNER UN ARTICLE
==================================================*/

CodeTravail.selectionner = function(numero){

    const index = this.articles.findIndex(

        article => article.numero === Number(numero)

    );

    if(index === -1){

        return null;

    }

    this.indexActuel = index;

    this.articleActuel = this.articles[index];

    return this.articleActuel;

};

/*==================================================
OBTENIR L'ARTICLE ACTUEL
==================================================*/

CodeTravail.getArticleActuel = function(){

    return this.articleActuel;

};

/*==================================================
VÉRIFIER SI LE CODE EST CHARGÉ
==================================================*/

CodeTravail.estCharge = function(){

    return this.charge;

};

/*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 4
 GESTION DES CATÉGORIES
==================================================*/

/*==================================================
INITIALISER LES CATÉGORIES
==================================================*/

CodeTravail.initialiserCategories = function(){

    const liste = new Set();

    this.articles.forEach(article=>{

        if(article.categorie){

            liste.add(

                article.categorie.trim()

            );

        }

    });

    this.categories =

        [...liste].sort();

};

/*==================================================
OBTENIR LES CATÉGORIES
==================================================*/

CodeTravail.getCategories = function(){

    return this.categories;

};

/*==================================================
OBTENIR LES ARTICLES D'UNE CATÉGORIE
==================================================*/

CodeTravail.getArticlesCategorie = function(categorie){

    return this.articles.filter(article=>

        article.categorie===categorie

    );

};

/*==================================================
COMPTER LES ARTICLES D'UNE CATÉGORIE
==================================================*/

CodeTravail.compterCategorie = function(categorie){

    return this.getArticlesCategorie(

        categorie

    ).length;

};

/*==================================================
METTRE À JOUR LES BADGES
==================================================*/

CodeTravail.mettreAJourBadges = function(){

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

    Object.entries(

        badges

    ).forEach(([categorie,id])=>{

        const badge =

            document.getElementById(id);

        if(!badge){

            return;

        }

        const total =

            this.compterCategorie(

                categorie

            );

        badge.textContent =

            total+" article"+

            (total>1?"s":"");

    });

};

 /*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 5
 INITIALISATION DU MODULE
==================================================*/

/*==================================================
INITIALISER LE MODULE
==================================================*/

async function initialiserCodeTravail(){

    await chargerCodeTravail();

    if(!CodeTravail.estCharge()){

        return;

    }

    CodeTravail.initialiserCategories();

    CodeTravail.mettreAJourBadges();

    console.log(

        "Catégories :", 

        CodeTravail.categories.length

    );

    console.log(

        "Articles :", 

        CodeTravail.articles.length

    );

    if(CodeTravail.articles.length>0){

        CodeTravail.articleActuel=

            CodeTravail.articles[0];

        CodeTravail.indexActuel=0;

    }

    document.dispatchEvent(

        new CustomEvent(

            "codeTravailPret",

            {

                detail:{

                    articles:

                    CodeTravail.articles.length,

                    categories:

                    CodeTravail.categories.length

                }

            }

        )

    );

}

/*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 6
 STATISTIQUES ET CHARGEMENT
==================================================*/

/*==================================================
METTRE À JOUR LES STATISTIQUES
==================================================*/

CodeTravail.mettreAJourStatistiques = function(){

    const totalArticles =

        document.getElementById(

            "statArticles"

        );

    if(totalArticles){

        totalArticles.textContent =

            this.articles.length;

    }

};

/*==================================================
MASQUER L'ÉCRAN DE CHARGEMENT
==================================================*/

function masquerChargement(){

    const loading =

        document.getElementById(

            "loadingScreen"

        );

    if(!loading){

        return;

    }

    loading.style.opacity = "0";

    setTimeout(()=>{

        loading.style.display = "none";

    },500);

}

/*==================================================
AFFICHER UNE ERREUR
==================================================*/

function afficherErreurChargement(){

    const contenu =

        document.getElementById(

            "contenuArticle"

        );

    if(!contenu){

        return;

    }

    contenu.innerHTML = `

        <div class="erreur-code">

            <h3>

                ❌ Chargement impossible

            </h3>

            <p>

                Le Code du Travail n'a pas pu être chargé.

            </p>

            <p>

                Vérifiez le fichier
                <strong>code-travail.json</strong>
                puis rechargez la page.

            </p>

        </div>

    `;

}

/*==================================================
FIN DU CHARGEMENT
==================================================*/

document.addEventListener(

    "codeTravailPret",

    ()=>{

        CodeTravail.mettreAJourStatistiques();

        masquerChargement();

    }

);

/*==================================================
ERREUR DE CHARGEMENT
==================================================*/

document.addEventListener(

    "codeTravailErreur",

    ()=>{

        afficherErreurChargement();

        masquerChargement();

    }

);

 /*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 7
 INITIALISATION DES MODULES
==================================================*/

/*==================================================
INITIALISER LES MODULES
==================================================*/

function initialiserModules(){

    console.log(

        "Initialisation des modules..."

    );

    if(

        window.Consultation &&

        typeof Consultation.initialiser==="function"

    ){

        Consultation.initialiser();

    }

    if(

        window.Navigation &&

        typeof Navigation.initialiser==="function"

    ){

        Navigation.initialiser();

    }

    if(

        window.Recherche &&

        typeof Recherche.initialiser==="function"

    ){

        Recherche.initialiser();

    }

    if(

        window.Categories &&

        typeof Categories.initialiser==="function"

    ){

        Categories.initialiser();

    }

    if(

        window.Favoris &&

        typeof Favoris.initialiser==="function"

    ){

        Favoris.initialiser();

    }

    if(

        window.Statistiques &&

        typeof Statistiques.initialiser==="function"

    ){

        Statistiques.initialiser();

    }

    if(

        window.Speech &&

        typeof Speech.initialiser==="function"

    ){

        Speech.initialiser();

    }

    if(

        window.AssistantIA &&

        typeof AssistantIA.initialiser==="function"

    ){

        AssistantIA.initialiser();

    }

}

/*==================================================
AFFICHER LE PREMIER ARTICLE
==================================================*/

function afficherPremierArticle(){

    if(

        !CodeTravail.estCharge()

    ){

        return;

    }

    if(

        CodeTravail.articles.length===0

    ){

        return;

    }

    CodeTravail.articleActuel =

        CodeTravail.articles[0];

    CodeTravail.indexActuel = 0;

    if(

        window.Consultation &&

        typeof Consultation.afficherArticle==="function"

    ){

        Consultation.afficherArticle(

            CodeTravail.articleActuel

        );

    }

}

/*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 8
 DÉMARRAGE DE L'APPLICATION
==================================================*/

/*==================================================
DÉMARRER L'APPLICATION
==================================================*/

async function demarrerApplication(){

    console.log(

        "Démarrage du Code du Travail..."

    );

    await initialiserCodeTravail();

    if(

        !CodeTravail.estCharge()

    ){

        return;

    }

    initialiserModules();

    afficherPremierArticle();

    console.log(

        "Application prête."

    );

}

/*==================================================
ATTENDRE LE CHARGEMENT DE LA PAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        await demarrerApplication();

    }

);

/*==================================================
RECHARGER LE CODE DU TRAVAIL
==================================================*/

CodeTravail.recharger = async function(){

    this.articles = [];

    this.categories = [];

    this.articleActuel = null;

    this.indexActuel = -1;

    this.charge = false;

    await demarrerApplication();

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.demarrerApplication =

    demarrerApplication;

window.initialiserCodeTravail =

    initialiserCodeTravail;

/*==================================================
 INSPECTEURBOT IA RDC
 CODE DU TRAVAIL
 index.js
 PARTIE 9
 OUTILS ET MÉTHODES UTILITAIRES
==================================================*/

/*==================================================
ARTICLE PRÉCÉDENT
==================================================*/

CodeTravail.articlePrecedent = function(){

    if(this.indexActuel<=0){

        return null;

    }

    this.indexActuel--;

    this.articleActuel=

        this.articles[this.indexActuel];

    return this.articleActuel;

};

/*==================================================
ARTICLE SUIVANT
==================================================*/

CodeTravail.articleSuivant = function(){

    if(

        this.indexActuel>=

        this.articles.length-1

    ){

        return null;

    }

    this.indexActuel++;

    this.articleActuel=

        this.articles[this.indexActuel];

    return this.articleActuel;

};

/*==================================================
VÉRIFIER SI UN ARTICLE EXISTE
==================================================*/

CodeTravail.existe = function(numero){

    return this.articles.some(article=>

        article.numero===Number(numero)

    );

};

/*==================================================
RECHERCHE PAR MOT-CLÉ
==================================================*/

CodeTravail.rechercher = function(texte){

    if(!texte){

        return [];

    }

    texte=texte
        .toLowerCase()
        .trim();

    return this.articles.filter(article=>{

        const numero=

            String(article.numero);

        const titre=

            (article.titre||"")

            .toLowerCase();

        const contenu=

            (article.contenu||"")

            .toLowerCase();

        const categorie=

            (article.categorie||"")

            .toLowerCase();

        const mots=

            Array.isArray(article.motsCles)

            ?

            article.motsCles.join(" ")

            .toLowerCase()

            :

            "";

        return(

            numero.includes(texte)||

            titre.includes(texte)||

            contenu.includes(texte)||

            categorie.includes(texte)||

            mots.includes(texte)

        );

    });

};

/*==================================================
OBTENIR LE NOMBRE TOTAL D'ARTICLES
==================================================*/

CodeTravail.totalArticles=function(){

    return this.articles.length;

};

/*==================================================
VIDER LA SÉLECTION
==================================================*/

CodeTravail.reinitialiser=function(){

    this.articleActuel=null;

    this.indexActuel=-1;

};

/*==================================================
FIN PARTIE 9
==================================================*/ 
}
