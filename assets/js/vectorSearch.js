/*=========================================================
 INSPECTEURBOT IA RDC
 VECTOR SEARCH V4.0
 Compatible avec code-travail.json
=========================================================*/

"use strict";

let CODE_TRAVAIL = [];
let INDEX_READY = false;

/*=========================================================
CHARGEMENT
=========================================================*/

async function loadCodeTravail(){

    if(INDEX_READY) return CODE_TRAVAIL;

    try{

        const response = await fetch("assets/code-travail.json");

        if(!response.ok)
            throw new Error("Impossible de charger code-travail.json");

        CODE_TRAVAIL = await response.json();

        INDEX_READY = true;

        console.log(
            "✅ Code du Travail chargé :",
            CODE_TRAVAIL.length,
            "articles"
        );

        return CODE_TRAVAIL;

    }catch(e){

        console.error(e);

        return [];

    }

}

/*=========================================================
NORMALISATION
=========================================================*/

function normalize(text){

    if(!text) return "";

    return text
        .toString()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .replace(/[^\w\s]/g," ")
        .replace(/\s+/g," ")
        .trim();

}

/*=========================================================
CALCUL DU SCORE
=========================================================*/

function computeScore(article,query){

    let score=0;

    const q=normalize(query);

    const numero=normalize(article.numero);

    const titre=normalize(article.titre);

    const categorie=normalize(article.categorie);

    const contenu=normalize(article.contenu);

    const mots=(article.motsCles||[])
        .join(" ");

    const keywords=normalize(mots);

    if(numero===q)
        score+=500;

    if(numero.includes(q))
        score+=250;

    if(titre.includes(q))
        score+=150;

    if(categorie.includes(q))
        score+=80;

    if(keywords.includes(q))
        score+=120;

    if(contenu.includes(q))
        score+=60;

    q.split(" ").forEach(word=>{

        if(word.length<2) return;

        if(titre.includes(word))
            score+=20;

        if(keywords.includes(word))
            score+=15;

        if(contenu.includes(word))
            score+=8;

    });

    return score;

}

/*=========================================================
RECHERCHE
=========================================================*/

async function vectorSearch(query,limit=10){

    await loadCodeTravail();

    if(!query) return [];

    const results=[];

    CODE_TRAVAIL.forEach(article=>{

        const score=computeScore(article,query);

        if(score>0){

            results.push({

                score,

                article

            });

        }

    });

    results.sort((a,b)=>b.score-a.score);

    return results.slice(0,limit);

}

/*=========================================================
EXPORT
=========================================================*/

window.vectorSearch=vectorSearch;
window.loadCodeTravail=loadCodeTravail;
