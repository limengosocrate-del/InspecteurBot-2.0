"use strict";

/*==================================================
INSPECTEURBOT RDC
VECTOR SEARCH V2.0
Compatible code-travail.json
==================================================*/

window.CodeTravail = window.CodeTravail || {};

CodeTravail.VectorSearch = {};

/*==================================================
MOTS VIDES
==================================================*/

const STOP_WORDS = [

"le","la","les","de","du","des","un","une",

"et","ou","en","dans","sur","pour","avec",

"au","aux","par","est","sont","a","à"

];

/*==================================================
NORMALISER
==================================================*/

CodeTravail.VectorSearch.normaliser = function (texte) {

    return String(texte || "")

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/[^\w\s]/g," ")

        .replace(/\s+/g," ")

        .trim();

};

/*==================================================
DÉCOUPAGE
==================================================*/

CodeTravail.VectorSearch.decouper = function (texte) {

    return this.normaliser(texte)

    .split(" ")

    .filter(mot =>

        mot.length>2 &&

        !STOP_WORDS.includes(mot)

    );

};

/*==================================================
SYNONYMES
==================================================*/

CodeTravail.VectorSearch.synonymes = {

licenciement:["renvoi","rupture"],

salaire:["paie","remuneration"],

travailleur:["employe","salarié"],

employeur:["entreprise","patron"],

inspection:["inspecteur","controle"],

conge:["vacances","repos"],

contrat:["cdi","cdd","embauche"],

enfant:["mineur"]

};

/*==================================================
ENRICHIR
==================================================*/

CodeTravail.VectorSearch.enrichir = function (mots) {

    let resultat=[...mots];

    mots.forEach(mot=>{

        if(this.synonymes[mot]){

            resultat.push(

                ...this.synonymes[mot]

            );

        }

    });

    return [...new Set(resultat)];

};

/*==================================================
CALCUL SCORE
==================================================*/

CodeTravail.VectorSearch.score = function (

article,

mots

){

    let score=0;

    mots.forEach(mot=>{

        if(

            String(article.numero)

            .includes(mot)

        )

            score+=80;

        if(

            article.titre

            ?.toLowerCase()

            .includes(mot)

        )

            score+=50;

        if(

            article.categorie

            ?.toLowerCase()

            .includes(mot)

        )

            score+=40;

        if(

            article.contenu

            ?.toLowerCase()

            .includes(mot)

        )

            score+=20;

        if(article.motsCles){

            article.motsCles.forEach(mc=>{

                if(

                    mc.toLowerCase()

                    .includes(mot)

                )

                    score+=60;

            });

        }

        if(

            article.sanction &&

            article.sanction

            .toLowerCase()

            .includes(mot)

        )

            score+=15;

    });

    return score;

};

/*==================================================
RECHERCHE
==================================================*/

CodeTravail.VectorSearch.rechercher = function (

texte,

limite=20

){

    if(

        !window.CodeTravail ||

        !CodeTravail.getTousArticles

    ){

        return [];

    }

    const mots=

        this.enrichir(

            this.decouper(texte)

        );

    const resultat=[];

    CodeTravail

    .getTousArticles()

    .forEach(article=>{

        const score=

            this.score(

                article,

                mots

            );

        if(score>0){

            resultat.push({

                ...article,

                score

            });

        }

    });

    resultat.sort(

        (a,b)=>b.score-a.score

    );

    return resultat.slice(

        0,

        limite

    );

};

/*==================================================
MEILLEUR ARTICLE
==================================================*/

CodeTravail.VectorSearch.meilleurResultat = function (

texte

){

    const r=

        this.rechercher(

            texte,

            1

        );

    return r.length ?

        r[0]

        :

        null;

};

/*==================================================
CATÉGORIE
==================================================*/

CodeTravail.VectorSearch.rechercherCategorie=function(

categorie

){

    return CodeTravail

    .getTousArticles()

    .filter(a=>

        a.categorie===categorie

    );

};

/*==================================================
INITIALISATION
==================================================*/

CodeTravail.VectorSearch.initialiser=function(){

    console.log(

        "VectorSearch V2 prêt."

    );

};

document.addEventListener(

"codeTravailCharge",

()=>{

    CodeTravail

    .VectorSearch

    .initialiser();

}

);
