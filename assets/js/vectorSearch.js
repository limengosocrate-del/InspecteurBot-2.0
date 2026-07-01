/*=========================================================
 INSPECTEURBOT IA RDC
 VECTOR SEARCH V5.0
 Compatible avec code-travail.json 2.0
=========================================================*/

"use strict";


let CODE_TRAVAIL = [];

let INDEX_READY = false;



/*=========================================================
CHARGEMENT
=========================================================*/


async function loadCodeTravail(){


    if(INDEX_READY)

        return CODE_TRAVAIL;



    try{


        const response = await fetch(
            "assets/data/code-travail.json"
        );



        if(!response.ok)

            throw new Error(
                "Impossible de charger code-travail.json"
            );



        CODE_TRAVAIL = await response.json();



        INDEX_READY = true;



        console.log(

            "✅ Base juridique chargée :",

            CODE_TRAVAIL.length,

            "articles"

        );



        return CODE_TRAVAIL;



    }


    catch(e){


        console.error(e);


        return [];


    }



}





/*=========================================================
NORMALISATION
=========================================================*/


function normalize(text){


    if(!text)

        return "";



    return text

        .toString()

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[^\w\s]/g,
            " "
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();



}





/*=========================================================
CONSTRUCTION TEXTE ARTICLE
=========================================================*/


function articleText(article){


    return normalize(


        article.numeroArticle +

        " " +

        article.titreCode +

        " " +

        article.chapitre +

        " " +

        article.section +

        " " +

        article.intitule +

        " " +

        article.contenu +

        " " +

        (article.motsCles || []).join(" ") +

        " " +

        (article.infractions || []).join(" ") +

        " " +

        (article.questionsIA || []).join(" ") +

        " " +

        (article.documentsAssocies || []).join(" ")


    );


}





/*=========================================================
CALCUL DU SCORE
=========================================================*/


function computeScore(article,query){


    let score=0;


    const q = normalize(query);



    const numero = normalize(

        article.numeroArticle

    );



    const intitule = normalize(

        article.intitule

    );



    const contenu = normalize(

        article.contenu

    );



    const mots = normalize(

        (article.motsCles || []).join(" ")

    );



    const infractions = normalize(

        (article.infractions || []).join(" ")

    );



    const texte = articleText(article);





    if(numero === q)

        score += 500;




    if(numero.includes(q))

        score += 250;




    if(intitule.includes(q))

        score += 180;




    if(infractions.includes(q))

        score += 160;




    if(mots.includes(q))

        score += 120;




    if(contenu.includes(q))

        score += 80;




    q.split(" ")

    .forEach(word=>{


        if(word.length < 2)

            return;



        if(intitule.includes(word))

            score +=30;



        if(mots.includes(word))

            score +=20;



        if(infractions.includes(word))

            score +=20;



        if(texte.includes(word))

            score +=10;



    });




    return score;


}





/*=========================================================
RECHERCHE VECTORIELLE
=========================================================*/


async function vectorSearch(query,limit=10){



    await loadCodeTravail();



    if(!query)

        return [];



    const results=[];



    CODE_TRAVAIL.forEach(article=>{



        const score = computeScore(

            article,

            query

        );



        if(score>0){



            results.push({

                score,

                article

            });



        }



    });





    results.sort(

        (a,b)=>b.score-a.score

    );





    return results.slice(

        0,

        limit

    );



}





/*=========================================================
EXPORT
=========================================================*/


window.vectorSearch = vectorSearch;

window.loadCodeTravail = loadCodeTravail;
