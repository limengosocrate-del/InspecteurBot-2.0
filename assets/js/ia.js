"use strict";

/*=========================================================
 INSPECTEURBOT IA RDC
 IA ENGINE V2.0
 RAG + VECTOR SEARCH + TRADUCTION
=========================================================*/


/*=========================================================
 CONFIGURATION
=========================================================*/


const IA_CONFIG = {

    nom:"InspecteurBot IA",

    version:"2.0",

    maxResultats:5

};



/*=========================================================
 ANALYSE QUESTION
=========================================================*/


async function analyserQuestionIA(question){


    if(!question || question.trim()===""){


        return {

            erreur:true,

            message:
            "Veuillez saisir une question."

        };


    }



    let langue="fr";


    if(typeof detecterLangue==="function"){

        langue = detecterLangue(question);

    }



    let resultats=[];



    /*
       Recherche vectorielle
    */

    if(typeof vectorSearch==="function"){


        resultats =
        await vectorSearch(

            question,

            IA_CONFIG.maxResultats

        );


    }




    /*
       Si aucun résultat
    */

    if(resultats.length===0){


        return {


            erreur:false,


            langue:langue,


            reponse:
            messageIA(
                "aucun",
                langue
            ),


            articles:[]


        };


    }




    return {


        erreur:false,


        langue:langue,


        articles:resultats,


        reponse:
        genererReponseIA(
            resultats,
            langue
        )


    };



}





/*=========================================================
 GENERER REPONSE JURIDIQUE
=========================================================*/


function genererReponseIA(resultats,langue="fr"){


    let texte="";


    if(langue==="fr"){


        texte +=
        "Analyse juridique basée sur le Code du Travail de la RDC.\n\n";


    }


    resultats.forEach((item,index)=>{


        const article=item.article;



        texte +=

        "📌 Article "
        +
        article.numeroArticle

        +

        "\n";



        texte +=

        article.intitule

        +

        "\n\n";



        texte +=

        article.contenu.substring(0,400)

        +

        "...\n\n";



    });



    return texte;


}





/*=========================================================
 AFFICHAGE REPONSE
=========================================================*/


async function executerAssistantIA(){


    const input =
    document.getElementById(
        "questionIA"
    );



    const zone =
    document.getElementById(
        "reponseIA"
    );



    if(!input || !zone)

        return;




    const question =
    input.value.trim();



    zone.innerHTML = `

    <div class="result-card">

    <h3>
    🤖 Analyse en cours...
    </h3>

    <p>
    Recherche des dispositions juridiques applicables.
    </p>

    </div>

    `;




    const resultat =
    await analyserQuestionIA(question);




    if(resultat.erreur){


        zone.innerHTML=

        `

        <div class="result-card">

        <h3>
        Erreur
        </h3>

        <p>
        ${resultat.message}
        </p>

        </div>

        `;


        return;


    }





    zone.innerHTML=

    `

    <div class="result-card">


    <h3>
    ⚖️ Réponse InspecteurBot IA
    </h3>


    <p style="
    white-space:pre-line;
    line-height:1.8;
    ">

    ${resultat.reponse}

    </p>


    </div>


    `;



    /*
       Statistique IA
    */


    if(typeof statistiques!=="undefined"){


        statistiques.ia++;


        if(
        typeof mettreAJourStatistiques==="function"
        ){

            mettreAJourStatistiques();

        }


    }



}





/*=========================================================
 MESSAGES TRADUITS
=========================================================*/


function messageIA(cle,langue="fr"){



if(
typeof traduireReponse==="function"
){


return traduireReponse(

cle,

langue

);


}



const messages={


aucun:

"Aucun article juridique trouvé."

};



return messages[cle] || "";



}





/*=========================================================
 INITIALISATION BOUTON IA
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


const bouton =

document.getElementById(
"btnQuestionIA"
);



if(bouton){


bouton.addEventListener(

"click",

executerAssistantIA

);


}



}

);





/*=========================================================
 EXPORT
=========================================================*/


window.executerAssistantIA =
executerAssistantIA;


window.analyserQuestionIA =
analyserQuestionIA;


console.log(
"✅ ia.js InspecteurBot IA RDC V2 chargé"
);
