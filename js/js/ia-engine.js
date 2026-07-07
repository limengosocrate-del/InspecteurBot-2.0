/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 ia-engine.js
 Moteur IA juridique local
===================================================*/

"use strict";


/*==================================================
 BASE DE CONNAISSANCES
===================================================*/

const legalKnowledge = {


    salaire: {

        keywords:[
            "salaire",
            "paiement",
            "rémunération",
            "smig"
        ],

        analysis:
        "Vérifier le respect des obligations relatives au paiement des salaires et au minimum légal applicable."

    },


    contrat: {

        keywords:[
            "contrat",
            "embauche",
            "travailleur",
            "emploi"
        ],

        analysis:
        "Vérifier l'existence, la conformité et les conditions du contrat de travail."

    },


    securite: {

        keywords:[
            "sécurité",
            "accident",
            "danger",
            "protection"
        ],

        analysis:
        "Analyser les conditions de santé et sécurité au travail."

    },


    temps: {

        keywords:[
            "heure",
            "durée",
            "repos",
            "congé"
        ],

        analysis:
        "Contrôler le respect du temps de travail et des périodes de repos."

    },


    etranger: {

        keywords:[
            "étranger",
            "visa",
            "autorisation"
        ],

        analysis:
        "Vérifier la conformité administrative de la main-d'œuvre étrangère."

    }


};



/*==================================================
 ANALYSE TEXTE
===================================================*/

function analyzeText(text){


    text =
    text.toLowerCase();



    let results = [];



    Object.keys(
        legalKnowledge
    )
    .forEach(key=>{


        const item =
            legalKnowledge[key];



        const found =
            item.keywords.some(
                word=>
                text.includes(word)
            );



        if(found){


            results.push({

                domaine:key,

                analyse:
                item.analysis

            });


        }


    });



    if(results.length===0){


        results.push({

            domaine:
            "Général",


            analyse:
            "Aucun élément juridique détecté automatiquement. Une analyse approfondie est nécessaire."

        });


    }



    return results;


}



/*==================================================
 GENERER RAPPORT IA
===================================================*/

function generateIAReport(text){


    const analysis =
        analyzeText(
            text
        );



    let report = `

🤖 RAPPORT ANALYSE IA

Date :
${new Date().toLocaleString()}


`;



    analysis.forEach(item=>{


        report += `

📌 Domaine :
${item.domaine}


Analyse :
${item.analyse}


`;

    });



    return report;


}



/*==================================================
 CONSEILS INSPECTEUR
===================================================*/

function inspectorAdvice(text){


    const result =
        analyzeText(
            text
        );



    let advice =
    "Recommandations :\n";



    result.forEach(item=>{


        advice +=

        "- Vérifier : "
        +
        item.domaine
        +
        "\n";


    });



    return advice;


}



/*==================================================
 CONNEXION ASSISTANT IA
===================================================*/

function askIA(question){


    const answer =
        generateIAReport(
            question
        );


    return answer;


}



/*==================================================
 TEST AUTOMATIQUE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    console.log(
        "IA Engine chargé"
    );


});
