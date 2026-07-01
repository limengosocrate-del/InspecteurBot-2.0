/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js
 MOTEUR INTELLIGENCE JURIDIQUE V3.0
 Compatible :
 - rag.js
 - vector-search.js
 - traduction.js
 - speech.js
=========================================================*/

"use strict";


/*=========================================================
 CONFIGURATION IA
=========================================================*/

const InspecteurBotIA = {

    version:"3.0",

    nom:"InspecteurBot IA RDC",

    domaine:"Code du Travail RDC",

    actif:true,

    mode:"juridique",

    maxResultats:5,

    historique:true

};


/*=========================================================
 MÉMOIRE IA
=========================================================*/


let MemoireIA = {


    questions:[],


    recherches:0,


    reponses:0,


    derniersArticles:[]

};



/*=========================================================
 NORMALISATION TEXTE
=========================================================*/


function nettoyerQuestion(texte){


    if(!texte){

        return "";

    }


    return texte

    .toLowerCase()

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g,"")

    .replace(/[?!.,;:()]/g," ")

    .replace(/\s+/g," ")

    .trim();


}



/*=========================================================
 EXTRACTION DES MOTS IMPORTANTS
=========================================================*/


function extraireMotsImportants(question){


    const stopWords=[

        "le",
        "la",
        "les",
        "un",
        "une",
        "des",
        "de",
        "du",
        "dans",
        "pour",
        "avec",
        "est",
        "sont",
        "quel",
        "quelle",
        "quelles",
        "comment",
        "que",
        "qui"

    ];



    return nettoyerQuestion(question)

    .split(" ")

    .filter(mot=>{

        return mot.length>2 && 
        !stopWords.includes(mot);

    });


}



/*=========================================================
 ANALYSE DE LA QUESTION
=========================================================*/


function analyserQuestion(question){


    const mots = extraireMotsImportants(question);



    let type="general";


    if(
        mots.includes("licenciement") ||
        mots.includes("renvoi")
    ){

        type="licenciement";

    }


    else if(

        mots.includes("salaire") ||
        mots.includes("remuneration")

    ){

        type="salaire";

    }


    else if(

        mots.includes("contrat")

    ){

        type="contrat";

    }


    else if(

        mots.includes("conge")

    ){

        type="conge";

    }


    else if(

        mots.includes("inspection") ||
        mots.includes("controle")

    ){

        type="inspection";

    }



    return {


        question:question,


        mots:mots,


        categorie:type,


        date:new Date()


    };


}



/*=========================================================
 SAUVEGARDE HISTORIQUE
=========================================================*/


function sauvegarderQuestion(question){


    if(!InspecteurBotIA.historique){

        return;

    }


    MemoireIA.questions.push({

        question:question,

        date:new Date()

    });



    localStorage.setItem(

        "inspecteurbot_historique",

        JSON.stringify(MemoireIA.questions)

    );


}



/*=========================================================
 CHARGER HISTORIQUE
=========================================================*/


function chargerHistoriqueIA(){


    const data=

    localStorage.getItem(

        "inspecteurbot_historique"

    );



    if(data){


        MemoireIA.questions=

        JSON.parse(data);


    }


}


/*=========================================================
 INITIALISATION
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


    chargerHistoriqueIA();


    console.log(

    "================================="

    );


    console.log(

    "🤖 InspecteurBot IA RDC"

    );


    console.log(

    "Version",

    InspecteurBotIA.version

    );


    console.log(

    "Moteur juridique activé"

    );


    console.log(

    "================================="

    );


}

);
