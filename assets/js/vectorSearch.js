/*==================================================
INSPECTEURBOT IA RDC
VECTOR SEARCH OFFLINE V2.0
Fonctionne avec code-travail.js
==================================================*/

"use strict";

/*
Le fichier assets/data/code-travail.js
doit contenir :

const CODE_TRAVAIL = [
   {...},
   {...}
];
*/

const ARTICLES = Array.isArray(CODE_TRAVAIL)
    ? CODE_TRAVAIL
    : [];

console.log("Articles chargés :", ARTICLES.length);

/*=========================================
NETTOYAGE TEXTE
=========================================*/

function normalizeText(text){

    if(!text) return "";

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^\w\s]/g," ")
        .replace(/\s+/g," ")
        .trim();

}

/*=========================================
TOKENISATION
=========================================*/

function tokenize(text){

    return normalizeText(text).split(" ");

}

/*=========================================
SCORE
=========================================*/

function computeScore(article,query){

    const q=tokenize(query);

    const contenu=
        normalizeText(
            article.numero+" "+
            article.titre+" "+
            article.contenu
        );

    let score=0;

    q.forEach(word=>{

        if(word.length<2) return;

        if(contenu.includes(word))
            score++;

    });

    return score;

}

/*=========================================
RECHERCHE
=========================================*/

function vectorSearch(query,limit=10){

    if(!query) return [];

    const resultats=[];

    ARTICLES.forEach(article=>{

        const score=computeScore(article,query);

        if(score>0){

            resultats.push({

                article,

                score

            });

        }

    });

    resultats.sort((a,b)=>b.score-a.score);

    return resultats.slice(0,limit);

}

/*=========================================
ARTICLE PAR NUMERO
=========================================*/

function getArticle(numero){

    return ARTICLES.find(a=>{

        return normalizeText(a.numero)===normalizeText(numero);

    });

}

/*=========================================
EXPORT GLOBAL
=========================================*/

window.vectorSearch=vectorSearch;

window.getArticle=getArticle;

window.CODE_TRAVAIL_DATA=ARTICLES;


