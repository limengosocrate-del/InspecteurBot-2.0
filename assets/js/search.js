/*=========================================================
 INSPECTEURBOT IA RDC
 search.js
 MOTEUR DE RECHERCHE JURIDIQUE INTELLIGENT
 PARTIE 1/5
 Version 3.0
 Compatible :
 - ia.js
 - rag.js
 - vector-search.js
 - traduction.js
 - code-travail.js
=========================================================*/

"use strict";


/*=========================================================
 CONFIGURATION RECHERCHE
=========================================================*/

const RechercheIA = {

    version:"3.0",

    nom:"Recherche Juridique InspecteurBot",

    actif:true,

    maxResultats:10,

    rechercheArticle:true,

    rechercheMotCle:true,

    rechercheNaturelle:true,

    historique:true

};



/*=========================================================
 MÉMOIRE RECHERCHE
=========================================================*/

let MemoireRecherche = {

    recherches:0,

    resultats:0,

    derniersTermes:[],

    dernierResultat:[]

};



/*=========================================================
 NETTOYAGE TEXTE RECHERCHE
=========================================================*/

function nettoyerRecherche(texte){

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
 DÉTECTION NUMÉRO ARTICLE
=========================================================*/

function detecterNumeroArticle(texte){


    const resultat =

    nettoyerRecherche(texte)

    .match(

        /article\s*(\d+)/i

    );


    if(resultat){

        return resultat[1];

    }


    const nombre =

    nettoyerRecherche(texte)

    .match(/^\d+$/);


    if(nombre){

        return nombre[0];

    }


    return null;

}



/*=========================================================
 EXTRACTION MOTS CLÉS
=========================================================*/

function extraireMotsRecherche(texte){


    const stopWords=[

        "le",
        "la",
        "les",
        "un",
        "une",
        "des",
        "du",
        "de",
        "dans",
        "pour",
        "avec",
        "sur",
        "quel",
        "quelle",
        "comment",
        "est",
        "sont",
        "faire",
        "avoir"

    ];


    return nettoyerRecherche(texte)

    .split(" ")

    .filter(mot=>{


        return mot.length>2 &&

        !stopWords.includes(mot);


    });


}



/*=========================================================
 ANALYSE DE LA RECHERCHE
=========================================================*/

function analyserRecherche(texte){


    const numero =

    detecterNumeroArticle(texte);



    const mots =

    extraireMotsRecherche(texte);



    return {

        texteOriginal:texte,

        numeroArticle:numero,

        motsCles:mots,

        date:new Date()

    };


}



/*=========================================================
 RECHERCHE DIRECTE DANS CODE DU TRAVAIL
=========================================================*/

async function rechercherArticleDirect(critere){


    let base=[];


    try{


        if(typeof loadCodeTravail==="function"){


            base=

            await loadCodeTravail();


        }


    }

    catch(e){


        console.error(

            "Erreur chargement Code Travail",

            e

        );


    }



    if(!Array.isArray(base)){

        return [];

    }



    const analyse =

    analyserRecherche(critere);



    let resultats=[];



    base.forEach(article=>{


        let correspond=false;



        /* Recherche par numéro */

        if(

            analyse.numeroArticle &&

            String(article.numero)

            ===

            String(analyse.numeroArticle)

        ){

            correspond=true;

        }



        /* Recherche par mots */

        analyse.motsCles.forEach(mot=>{


            const contenu =

            (

            article.titre+

            " "+

            article.contenu+

            " "+

            article.categorie

            )

            .toLowerCase();



            if(

            contenu.includes(mot)

            ){

                correspond=true;

            }


        });



        if(correspond){

            resultats.push(article);

        }



    });



    return resultats.slice(

        0,

        RechercheIA.maxResultats

    );


}



/*=========================================================
 FIN PARTIE 1
=========================================================*/


console.log(

"search.js Partie 1/5 chargée."

);


/*=========================================================
 INSPECTEURBOT IA RDC
 search.js
 PARTIE 2/5
 VECTOR SEARCH + RAG INTELLIGENT
 Version 3.0
=========================================================*/


/*=========================================================
 RECHERCHE VECTORIELLE
=========================================================*/


async function rechercherVectorielle(question){


    let resultats=[];



    if(

        typeof vectorSearch === "function"

    ){


        try{


            resultats = await vectorSearch(

                question,

                RechercheIA.maxResultats

            );


        }

        catch(error){


            console.log(

                "Erreur recherche vectorielle :",

                error

            );


        }


    }



    return resultats;


}




/*=========================================================
 RECHERCHE RAG
=========================================================*/


async function rechercherRAG(question){


    if(

        typeof ragSearch !== "function"

    ){

        return null;

    }



    try{


        const resultat =

        await ragSearch(question);



        return resultat;


    }

    catch(error){


        console.log(

            "Erreur RAG :",

            error

        );


        return null;


    }


}




/*=========================================================
 MOTEUR DE RECHERCHE COMPLET
=========================================================*/


async function rechercherJuridiquement(question){


    MemoireRecherche.recherches++;



    MemoireRecherche.derniersTermes.push(

        question

    );



    let resultats=[];



    /*
    1 - Recherche vectorielle
    */


    const vector =

    await rechercherVectorielle(

        question

    );



    if(

        Array.isArray(vector)

        &&

        vector.length>0

    ){


        resultats = vector;


    }




    /*
    2 - Recherche directe Code du Travail
    */


    if(

        resultats.length===0

    ){


        resultats =

        await rechercherArticleDirect(

            question

        );


    }




    /*
    3 - Recherche RAG
    */


    let rag=null;



    if(

        resultats.length===0

    ){


        rag=

        await rechercherRAG(

            question

        );


    }




    MemoireRecherche.resultats +=

    resultats.length;



    MemoireRecherche.dernierResultat=

    resultats;




    return {


        question:question,


        articles:resultats,


        rag:rag,


        nombre:resultats.length,


        date:new Date()


    };


}





/*=========================================================
 TRI DES RÉSULTATS
=========================================================*/


function classerResultats(resultats){


    if(

        !Array.isArray(resultats)

    ){

        return [];

    }



    return resultats.sort(

        (a,b)=>{


            let scoreA =

            a.score || 0;



            let scoreB =

            b.score || 0;



            return scoreB-scoreA;


        }

    );


}





/*=========================================================
 FORMATAGE ARTICLE
=========================================================*/


function formaterArticle(article){


    if(!article){

        return "";

    }



    return `

    <div class="article-result">

        <h3>

        📌 Article ${article.numero || ""}

        </h3>


        <h4>

        ${article.titre || ""}

        </h4>


        <p>

        ${article.contenu || ""}

        </p>


        <button

        onclick="ouvrirArticle('${article.numero}')">

        Consulter

        </button>


    </div>

    `;


}





/*=========================================================
 EXPORT
=========================================================*/


window.rechercherJuridiquement =

rechercherJuridiquement;


window.rechercherVectorielle =

rechercherVectorielle;


window.rechercherRAG =

rechercherRAG;



console.log(

"search.js Partie 2/5 chargée."

);


/*=========================================================
 INSPECTEURBOT IA RDC
 search.js
 PARTIE 3/5
 INTERFACE RECHERCHE ET CONSULTATION ARTICLE
 Version 3.0
=========================================================*/


/*=========================================================
 AFFICHER LES RÉSULTATS
=========================================================*/


function afficherResultatsRecherche(resultat){


    const zone =

    document.getElementById(

        "listeArticles"

    );



    if(!zone){

        return;

    }



    if(

        !resultat ||

        resultat.articles.length===0

    ){


        zone.innerHTML=`

        <div class="empty-result">

            <i class="fas fa-circle-info"></i>

            <h3>Aucun résultat trouvé</h3>

            <p>

            Essayez un autre mot-clé ou posez votre question à InspecteurBot IA.

            </p>

        </div>

        `;


        return;

    }




    let html="";



    resultat.articles.forEach(article=>{


        html += formaterArticle(article);


    });



    zone.innerHTML=html;



}





/*=========================================================
 OUVRIR UN ARTICLE
=========================================================*/


async function ouvrirArticle(numero){


    const zone =

    document.getElementById(

        "contenuArticle"

    );



    if(!zone){

        return;

    }



    let articleTrouve=null;



    try{


        const articles =

        await loadCodeTravail();



        articleTrouve =

        articles.find(

            article =>

            String(article.numero)

            ===

            String(numero)

        );


    }

    catch(error){


        console.log(

            "Erreur ouverture article",

            error

        );


    }





    if(!articleTrouve){


        zone.innerHTML=`

        <p>

        Article introuvable.

        </p>

        `;


        return;

    }





    zone.innerHTML=`

    <div class="article-view">


        <h2>

        📖 Article ${articleTrouve.numero}

        </h2>



        <h3>

        ${articleTrouve.titre || ""}

        </h3>



        <p>

        ${articleTrouve.contenu || ""}

        </p>



        <small>

        Source : Code du Travail RDC

        </small>


    </div>

    `;



    localStorage.setItem(

        "dernier_article",

        JSON.stringify(articleTrouve)

    );



    mettreAJourStatArticle();



}





/*=========================================================
 RECHERCHE PRINCIPALE
=========================================================*/


async function lancerRecherche(){


    const champ =

    document.getElementById(

        "rechercheArticle"

    );



    if(!champ){

        return;

    }



    const question =

    champ.value.trim();



    if(question===""){


        alert(

        "Veuillez saisir une recherche."

        );


        return;


    }





    const zone =

    document.getElementById(

        "listeArticles"

    );



    if(zone){


        zone.innerHTML=`

        <p>

        🤖 InspecteurBot IA recherche dans le Code du Travail...

        </p>

        `;


    }





    const resultat =

    await rechercherJuridiquement(

        question

    );



    afficherResultatsRecherche(

        resultat

    );



    mettreAJourStatRecherche();



}





/*=========================================================
 INITIALISATION BOUTON RECHERCHE
=========================================================*/


function initialiserRecherche(){



    const bouton =

    document.getElementById(

        "btnRecherche"

    );



    if(bouton){


        bouton.addEventListener(

        "click",

        lancerRecherche

        );


    }



    const champ =

    document.getElementById(

        "rechercheArticle"

    );



    if(champ){


        champ.addEventListener(

        "keypress",

        function(e){


            if(e.key==="Enter"){


                lancerRecherche();


            }


        });


    }



}





/*=========================================================
 STATISTIQUES ARTICLE
=========================================================*/


function mettreAJourStatArticle(){



    const compteur =

    document.getElementById(

        "statArticles"

    );



    if(compteur){


        let valeur =

        Number(

        compteur.innerHTML

        );



        compteur.innerHTML =

        valeur+1;


    }



}





/*=========================================================
 STATISTIQUES RECHERCHE
=========================================================*/


function mettreAJourStatRecherche(){



    const compteur =

    document.getElementById(

        "statRecherche"

    );



    if(compteur){


        compteur.innerHTML =

        MemoireRecherche.recherches;


    }


}





/*=========================================================
 INITIALISATION MODULE
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


    initialiserRecherche();



});



window.ouvrirArticle =

ouvrirArticle;



window.lancerRecherche =

lancerRecherche;



console.log(

"search.js Partie 3/5 chargée."

);


/*=========================================================
 INSPECTEURBOT IA RDC
 search.js
 PARTIE 4/5
 FAVORIS - PARTAGE - IMPRESSION - VOIX
 Version 3.0
=========================================================*/


/*=========================================================
 MÉMOIRE FAVORIS
=========================================================*/


let FavorisIA = [];


/*=========================================================
 CHARGER FAVORIS
=========================================================*/


function chargerFavoris(){


    const data =

    localStorage.getItem(

        "inspecteurbot_favoris"

    );



    if(data){


        try{


            FavorisIA =

            JSON.parse(data);


        }

        catch(e){


            FavorisIA=[];


        }


    }


}





/*=========================================================
 SAUVEGARDER FAVORIS
=========================================================*/


function sauvegarderFavoris(){


    localStorage.setItem(

        "inspecteurbot_favoris",

        JSON.stringify(FavorisIA)

    );


}





/*=========================================================
 AJOUT FAVORI
=========================================================*/


function ajouterFavori(){



    const article =

    JSON.parse(

        localStorage.getItem(

            "dernier_article"

        )

    );



    if(!article){


        alert(

        "Aucun article sélectionné."

        );


        return;


    }



    const existe =

    FavorisIA.some(

        item =>

        item.numero===article.numero

    );



    if(existe){


        alert(

        "Article déjà dans les favoris."

        );


        return;


    }



    FavorisIA.push(article);



    sauvegarderFavoris();



    alert(

    "Article ajouté aux favoris ⭐"

    );



}





/*=========================================================
 SUPPRIMER FAVORI
=========================================================*/


function supprimerFavori(numero){


    FavorisIA =

    FavorisIA.filter(

        article =>

        article.numero!==numero

    );



    sauvegarderFavoris();


}





/*=========================================================
 PARTAGER ARTICLE
=========================================================*/


async function partagerArticle(){



    const article =

    JSON.parse(

        localStorage.getItem(

            "dernier_article"

        )

    );



    if(!article){


        return;


    }



    const texte =


    "Code du Travail RDC\n\n"

    +

    "Article "

    +

    article.numero

    +

    "\n\n"

    +

    article.contenu;




    if(

        navigator.share

    ){


        navigator.share({

            title:

            "InspecteurBot IA RDC",

            text:texte


        });


    }

    else{


        navigator.clipboard.writeText(

            texte

        );



        alert(

        "Article copié."

        );


    }



}





/*=========================================================
 IMPRESSION ARTICLE
=========================================================*/


function imprimerArticle(){



    const article =

    JSON.parse(

        localStorage.getItem(

            "dernier_article"

        )

    );



    if(!article){

        return;

    }



    const fenetre =

    window.open(

        "",

        "_blank"

    );



    fenetre.document.write(`


    <html>

    <head>

    <title>

    Article ${article.numero}

    </title>


    </head>


    <body>


    <h2>

    InspecteurBot IA RDC

    </h2>



    <h3>

    Code du Travail RDC

    </h3>



    <h1>

    Article ${article.numero}

    </h1>



    <p>

    ${article.contenu}

    </p>


    </body>

    </html>


    `);



    fenetre.print();


}





/*=========================================================
 LECTURE VOCALE ARTICLE
=========================================================*/


function lireArticle(){



    const article =

    JSON.parse(

        localStorage.getItem(

            "dernier_article"

        )

    );



    if(!article){

        return;

    }



    const texte =


    "Article "

    +

    article.numero

    +

    ". "

    +

    article.contenu;




    if(

        typeof parlerIA === "function"

    ){


        parlerIA(

            texte

        );


        return;


    }





    if(

        "speechSynthesis"

        in window

    ){


        const voix =

        new SpeechSynthesisUtterance(

            texte

        );


        voix.lang="fr-FR";


        speechSynthesis.speak(

            voix

        );


    }


}





/*=========================================================
 HISTORIQUE RECHERCHE
=========================================================*/


function afficherHistoriqueRecherche(){


    return MemoireRecherche.derniersTermes;


}





/*=========================================================
 INITIALISATION BOUTONS
=========================================================*/


function initialiserActionsArticle(){



    const favoris =

    document.getElementById(

        "btnFavori"

    );



    if(favoris){


        favoris.addEventListener(

        "click",

        ajouterFavori

        );


    }




    const partager =

    document.getElementById(

        "btnPartager"

    );



    if(partager){


        partager.addEventListener(

        "click",

        partagerArticle

        );


    }





    const imprimer =

    document.getElementById(

        "btnImprimer"

    );



    if(imprimer){


        imprimer.addEventListener(

        "click",

        imprimerArticle

        );


    }





    const lecture =

    document.getElementById(

        "btnLecture"

    );



    if(lecture){


        lecture.addEventListener(

        "click",

        lireArticle

        );


    }



}





document.addEventListener(

"DOMContentLoaded",

()=>{


    chargerFavoris();


    initialiserActionsArticle();



});






window.ajouterFavori =

ajouterFavori;


window.partagerArticle =

partagerArticle;


window.imprimerArticle =

imprimerArticle;


window.lireArticle =

lireArticle;



console.log(

"search.js Partie 4/5 chargée."

);


/*=========================================================
 INSPECTEURBOT IA RDC
 search.js
 PARTIE 5/5
 INTÉGRATION IA - VOCAL - SUGGESTIONS - EXPORT FINAL
 Version 3.0
=========================================================*/


/*=========================================================
 SUGGESTIONS INTELLIGENTES IA
=========================================================*/


function suggererRecherche(texte){


    const question =

    nettoyerRecherche(texte);



    if(!question){

        return [];

    }



    const suggestions=[


        "Article concernant le licenciement",


        "Conditions du contrat de travail",


        "Droits du travailleur",


        "Obligations de l'employeur",


        "Temps de travail et repos",


        "Congés annuels",


        "Hygiène et sécurité au travail",


        "Main-d'œuvre étrangère"



    ];



    return suggestions.filter(item=>{


        return item

        .toLowerCase()

        .includes(

            question

        );


    });



}





/*=========================================================
 RECHERCHE VOCALE
=========================================================*/


function initialiserRechercheVocale(){



    const bouton =

    document.getElementById(

        "btnMicro"

    );



    const champ =

    document.getElementById(

        "rechercheArticle"

    );



    if(!bouton || !champ){

        return;

    }



    bouton.addEventListener(

    "click",

    ()=>{



        if(

            typeof demarrerReconnaissanceVocale

            ===

            "function"

        ){



            demarrerReconnaissanceVocale(

                function(texte){


                    champ.value=texte;


                    lancerRecherche();


                }

            );



        }



        else if(

            "webkitSpeechRecognition"

            in window

        ){



            const reconnaissance =

            new webkitSpeechRecognition();



            reconnaissance.lang="fr-FR";



            reconnaissance.start();



            reconnaissance.onresult=

            function(event){


                champ.value =

                event.results[0][0].transcript;


                lancerRecherche();


            };



        }



    });



}





/*=========================================================
 CONNEXION ASSISTANT IA
=========================================================*/


async function envoyerQuestionAssistant(question){



    if(

        typeof poserQuestionIA

        ===

        "function"

    ){



        return await poserQuestionIA(

            question

        );



    }



    return `


    <div class="result-card">


    <h3>

    🤖 InspecteurBot IA

    </h3>


    <p>

    Assistant IA indisponible.

    </p>


    </div>


    `;


}





/*=========================================================
 RECHERCHE HYBRIDE IA
=========================================================*/


async function rechercheHybrideIA(question){



    const analyse =

    analyserRecherche(question);



    const resultat =

    await rechercherJuridiquement(

        question

    );



    if(

        resultat.articles.length>0

    ){


        return resultat;


    }




    const reponseIA =

    await envoyerQuestionAssistant(

        question

    );



    return {


        question:question,


        articles:[],


        reponseIA:reponseIA,


        analyse:analyse


    };



}





/*=========================================================
 INITIALISATION COMPLETE
=========================================================*/


function initialiserMoteurRecherche(){



    chargerFavoris();


    initialiserRecherche();


    initialiserActionsArticle();


    initialiserRechercheVocale();



    console.log(

    "================================"

    );



    console.log(

    "🔎 InspecteurBot IA RDC"

    );



    console.log(

    "Moteur recherche juridique activé"

    );



    console.log(

    "Version :",

    RechercheIA.version

    );



    console.log(

    "================================"

    );


}





/*=========================================================
 EXPORT GLOBAL FINAL
=========================================================*/


window.RechercheIA =

RechercheIA;



window.rechercherJuridiquement =

rechercherJuridiquement;



window.rechercheHybrideIA =

rechercheHybrideIA;



window.suggererRecherche =

suggererRecherche;



window.afficherHistoriqueRecherche =

afficherHistoriqueRecherche;



window.ouvrirArticle =

ouvrirArticle;



window.lancerRecherche =

lancerRecherche;



window.lireArticle =

lireArticle;



window.partagerArticle =

partagerArticle;



window.imprimerArticle =

imprimerArticle;





document.addEventListener(

"DOMContentLoaded",

()=>{


    initialiserMoteurRecherche();


});




console.log(

"================================================"

);


console.log(

"InspecteurBot IA RDC - search.js V3.0 chargé avec succès"

);


console.log(

"Recherche juridique intelligente opérationnelle"

);


console.log(

"================================================"

);
