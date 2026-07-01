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

    /*=========================================================
 INSPECTEURBOT IA RDC
 ia.js
 PARTIE 2/4
 RAG + VECTOR SEARCH + REPONSE JURIDIQUE
=========================================================*/


/*=========================================================
 RECHERCHE DANS LA BASE JURIDIQUE
=========================================================*/


async function rechercherBaseJuridique(question){


    let resultats=[];


    /*
    Priorité 1 :
    Recherche vectorielle
    */


    if(typeof vectorSearch === "function"){


        try{


            resultats = await vectorSearch(

                question,

                InspecteurBotIA.maxResultats

            );


        }

        catch(e){


            console.log(

                "Erreur Vector Search",

                e

            );


        }


    }



    /*
    Priorité 2 :
    RAG classique
    */


    if(

        resultats.length===0 &&

        typeof ragSearch === "function"

    ){


        try{


            const ragResultat =

            await ragSearch(question);



            return {

                type:"html",

                contenu:ragResultat,

                articles:[]

            };


        }

        catch(e){


            console.log(

                "Erreur RAG",

                e

            );


        }


    }



    return {


        type:"articles",


        contenu:"",


        articles:

        resultats.map(r=>r.article)


    };


}





/*=========================================================
 EXTRACTION DES ARTICLES
=========================================================*/


function extraireInformationsArticles(articles){


    if(!articles || articles.length===0){


        return [];


    }



    return articles.map(article=>{


        return {


            numero:

            article.numero || "",


            titre:

            article.titre || "",


            contenu:

            article.contenu || "",


            categorie:

            article.categorie || ""


        };


    });


}





/*=========================================================
 CONSTRUCTION DE LA REPONSE IA
=========================================================*/


function construireReponseJuridique(data){



    if(

        !data ||

        (!data.articles || data.articles.length===0)

    ){


        return {


            trouve:false,


            message:

            "Aucun article du Code du Travail correspondant n'a été trouvé."


        };


    }



    const articles =

    extraireInformationsArticles(

        data.articles

    );



    let texte =

    "Analyse juridique basée sur le Code du Travail RDC :\n\n";



    articles.forEach(article=>{


        texte +=

        "📌 Article "

        +

        article.numero

        +

        "\n";



        if(article.titre){


            texte +=

            article.titre

            +

            "\n";


        }



        texte +=

        article.contenu

        +

        "\n\n";



    });



    return {


        trouve:true,


        message:texte,


        articles:articles


    };


}





/*=========================================================
 ANALYSE JURIDIQUE COMPLETE
=========================================================*/


async function analyserJuridiquement(question){



    MemoireIA.recherches++;



    sauvegarderQuestion(question);



    const analyse =

    analyserQuestion(question);



    const recherche =

    await rechercherBaseJuridique(question);



    const reponse =

    construireReponseJuridique(recherche);



    MemoireIA.reponses++;



    if(reponse.articles){


        MemoireIA.derniersArticles =

        reponse.articles;


    }



    return {


        question:question,


        analyse:analyse,


        resultat:reponse,


        date:new Date()


    };



}





/*=========================================================
 REPONSE POUR INTERFACE WEB
=========================================================*/


async function poserQuestionIA(question){



    const resultat =

    await analyserJuridiquement(question);



    let html="";



    if(!resultat.resultat.trouve){


        html=`

        <div class="result-card">


        <h3>🤖 InspecteurBot IA</h3>


        <p>

        ${resultat.resultat.message}

        </p>


        </div>

        `;



    }

    else{


        html=`

        <div class="result-card">


        <h3>

        🤖 Analyse juridique

        </h3>


        <p>

        ${resultat.resultat.message}

        </p>


        </div>


        `;



    }



    return html;


}






/*=========================================================
 EXPORT GLOBAL
=========================================================*/


window.InspecteurBotIA = InspecteurBotIA;

window.poserQuestionIA = poserQuestionIA;

window.analyserJuridiquement = analyserJuridiquement;

window.rechercherBaseJuridique = rechercherBaseJuridique;


console.log(

"ia.js Partie 2 chargée."

);
 
/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js
 PARTIE 3/4
 INTERFACE ASSISTANT IA
=========================================================*/


/*=========================================================
 AFFICHAGE REPONSE DANS DASHBOARD
=========================================================*/


async function afficherReponseIA(question){


    const zone =

    document.getElementById(

        "reponseIA"

    );



    if(!zone){

        return;

    }



    zone.innerHTML = `

    <div class="result-card">

        <h3>

        🤖 InspecteurBot IA analyse...

        </h3>


        <p>

        Recherche dans le Code du Travail RDC...

        </p>


    </div>

    `;



    try{


        const resultat =

        await poserQuestionIA(question);



        zone.innerHTML=resultat;



    }


    catch(error){


        console.error(error);



        zone.innerHTML=`

        <div class="result-card">


        <h3>

        ❌ Erreur IA

        </h3>


        <p>

        Impossible de traiter cette question.

        </p>


        </div>

        `;


    }



}






/*=========================================================
 BOUTON ASSISTANT IA
=========================================================*/


function initialiserAssistantIA(){



    const bouton =

    document.getElementById(

        "btnQuestionIA"

    );



    const champ =

    document.getElementById(

        "questionIA"

    );



    if(!bouton || !champ){

        return;

    }



    bouton.addEventListener(

    "click",

    async()=>{


        const question =

        champ.value.trim();



        if(question===""){


            alert(

            "Veuillez écrire votre question."

            );


            return;


        }



        await afficherReponseIA(

            question

        );



        mettreAJourStatIA();



    });



}





/*=========================================================
 STATISTIQUES
=========================================================*/


function mettreAJourStatIA(){



    const zone =

    document.getElementById(

        "statIA"

    );



    if(zone){


        zone.innerHTML =

        MemoireIA.reponses;


    }



    const recherches =

    document.getElementById(

        "statRecherche"

    );



    if(recherches){


        recherches.innerHTML =

        MemoireIA.recherches;


    }



}





/*=========================================================
 TRADUCTION DE LA QUESTION
=========================================================*/


async function questionMultilingueIA(

question,

langue

){



    let questionFinale = question;



    if(

        typeof traduireQuestionComplete ===

        "function"

    ){



        const traduction =

        traduireQuestionComplete(

            question,

            langue

        );



        if(traduction){


            questionFinale = traduction;


        }



    }



    return await poserQuestionIA(

        questionFinale

    );



}





/*=========================================================
 REPONSE MULTILINGUE
=========================================================*/


function traduireResultatIA(

texte,

langue

){



    if(

        typeof traduireReponseComplete ===

        "function"

    ){



        return traduireReponseComplete(

            texte,

            langue

        );


    }



    return {


        original:texte,


        traduction:texte,


        langue:langue


    };



}






/*=========================================================
 LECTURE VOCALE IA
=========================================================*/


function lireReponseIA(

texte

){



    if(

        typeof parlerIA ===

        "function"

    ){


        parlerIA(

            texte

        );


        return true;


    }



    if(

        "speechSynthesis" in window

    ){



        const voix =

        new SpeechSynthesisUtterance(

            texte

        );



        voix.lang="fr-FR";



        speechSynthesis.speak(

            voix

        );



        return true;


    }



    return false;


}







/*=========================================================
 BOUTON LECTURE
=========================================================*/


function initialiserLectureIA(){



    const bouton =

    document.getElementById(

        "btnLecture"

    );



    if(!bouton){

        return;

    }



    bouton.addEventListener(

    "click",

    ()=>{


        const contenu =

        document.getElementById(

            "reponseIA"

        );



        if(contenu){



            lireReponseIA(

                contenu.innerText

            );



        }


    });



}






/*=========================================================
 INITIALISATION MODULE
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


    initialiserAssistantIA();


    initialiserLectureIA();


    mettreAJourStatIA();


});



console.log(

"ia.js Partie 3 chargée."

);

/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js
 PARTIE 4/4
 COPILOTE INSPECTION - RAPPORTS - OPJ
=========================================================*/


/*=========================================================
 PROFIL INSPECTION
=========================================================*/


const CopiloteInspection = {


    actif:true,


    version:"1.0",


    modules:[

        "Contrôle main-d’œuvre F01",

        "Main-d’œuvre étrangère F02",

        "Hygiène et santé au travail F03",

        "Code du Travail RDC"

    ]


};





/*=========================================================
 ANALYSE D'UNE SITUATION D'INSPECTION
=========================================================*/


function analyserInspection(description){


    const texte =

    nettoyerQuestion(description);



    let risques=[];


    if(

        texte.includes("etranger") ||

        texte.includes("étranger")

    ){


        risques.push(

        "Vérifier la conformité de la main-d’œuvre étrangère (F02)."

        );


    }



    if(

        texte.includes("securite") ||

        texte.includes("accident") ||

        texte.includes("hygiene")

    ){


        risques.push(

        "Contrôle hygiène et sécurité au travail (F03)."

        );


    }



    if(

        texte.includes("travailleur") ||

        texte.includes("contrat")

    ){


        risques.push(

        "Vérifier les documents de travail et contrats (F01)."

        );


    }



    if(risques.length===0){


        risques.push(

        "Effectuer une vérification générale selon le Code du Travail RDC."

        );


    }



    return {


        situation:description,


        pointsControle:risques,


        date:new Date()


    };


}





/*=========================================================
 GÉNÉRATION PLAN DE VISITE
=========================================================*/


function genererPlanInspection(entreprise){



    return {


        entreprise:entreprise,


        étapes:[

            "Identification de l'entreprise",

            "Présentation de la mission d'inspection",

            "Contrôle des documents obligatoires",

            "Vérification des travailleurs",

            "Contrôle sécurité et conditions de travail",

            "Constatations et observations",

            "Rédaction du rapport"

        ],


        date:new Date()


    };


}





/*=========================================================
 GÉNÉRATION PROCÈS-VERBAL
=========================================================*/


function genererPVInspection(donnees){



    return `


PROCÈS-VERBAL D'INSPECTION


République Démocratique du Congo

Inspection Générale du Travail



Entreprise :

${donnees.entreprise || "Non renseignée"}



Objet :

${donnees.objet || "Contrôle du respect du Code du Travail"}



Constatations :

${donnees.constatations || "Aucune constatation renseignée"}



Dispositions applicables :

${donnees.articles || "Articles du Code du Travail RDC à compléter"}



Inspecteur :

${donnees.inspecteur || "Inspecteur du Travail"}



Date :

${new Date().toLocaleDateString("fr-FR")}



Signature :

________________________



`;

}





/*=========================================================
 ASSISTANCE JURIDIQUE INSPECTEUR
=========================================================*/


async function assistantInspecteur(question){



    const analyse =

    analyserInspection(question);



    const juridique =

    await analyserJuridiquement(question);



    return {


        inspection:analyse,


        juridique:juridique,


        date:new Date()


    };


}





/*=========================================================
 COMPTEUR ARTICLES
=========================================================*/


async function compterArticles(){


    try{


        if(typeof loadCodeTravail==="function"){


            const articles =

            await loadCodeTravail();



            const compteur =

            document.getElementById(

                "compteurArticles"

            );



            if(compteur){


                compteur.innerHTML =

                articles.length +

                " articles";


            }


            return articles.length;


        }


    }

    catch(e){


        console.log(e);


    }



    return 0;


}





/*=========================================================
 INITIALISATION COMPLETE
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


    compterArticles();



    console.log(

    "🤖 Copilote Inspection activé"

    );


    console.log(

    "Modules :",

    CopiloteInspection.modules

    );


});





/*=========================================================
 EXPORT FINAL
=========================================================*/


window.CopiloteInspection =

CopiloteInspection;



window.analyserInspection =

analyserInspection;



window.genererPlanInspection =

genererPlanInspection;



window.genererPVInspection =

genererPVInspection;



window.assistantInspecteur =

assistantInspecteur;



window.lireReponseIA =

lireReponseIA;



console.log(

"================================================"

);


console.log(

"InspecteurBot IA RDC - ia.js V3.0 chargé avec succès"

);


console.log(

"================================================"

);
    "================================="

    );


}

);
