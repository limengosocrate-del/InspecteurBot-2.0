"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 ia-engine.js
 Moteur IA juridique local
===================================================*/

/*==================================================
 BASE DE CONNAISSANCES
===================================================*/

const legalKnowledge = {

    salaire: {

        keywords: [
            "salaire",
            "paiement",
            "rémunération",
            "smig"
        ],

        analysis:
        "Vérifier le respect des obligations relatives au paiement des salaires et du SMIG."

    },

    contrat: {

        keywords: [
            "contrat",
            "embauche",
            "travailleur",
            "emploi"
        ],

        analysis:
        "Vérifier l'existence et la conformité du contrat de travail."

    },

    securite: {

        keywords: [
            "sécurité",
            "accident",
            "danger",
            "protection"
        ],

        analysis:
        "Contrôler les mesures de santé et sécurité au travail."

    },

    temps: {

        keywords: [
            "heure",
            "durée",
            "repos",
            "congé"
        ],

        analysis:
        "Contrôler le respect du temps de travail et des périodes de repos."

    },

    etranger: {

        keywords: [
            "étranger",
            "visa",
            "autorisation"
        ],

        analysis:
        "Vérifier la conformité administrative de la main-d'œuvre étrangère."

    }

};

/*==================================================
 ANALYSE
===================================================*/

function analyzeText(text) {

    text = text.toLowerCase();

    const results = [];

    Object.values(legalKnowledge).forEach(item => {

        if (
            item.keywords.some(word =>
                text.includes(word)
            )
        ) {

            results.push(item.analysis);

        }

    });

    return results;

}

/*==================================================
 RAPPORT IA
===================================================*/

function generateIAReport(text) {

    const analyses =
        analyzeText(text);

    if (analyses.length === 0) {

        return "Aucune analyse juridique automatique disponible.";

    }

    let report =
        "🤖 RAPPORT D'ANALYSE IA\n\n";

    analyses.forEach(item => {

        report += "• " + item + "\n\n";

    });

    return report;

}

/*==================================================
 REPONSE IA
===================================================*/

function generateAnswer(question) {

    return generateIAReport(question);

}

function askIA(question) {

    return generateAnswer(question);

}

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.analyzeText = analyzeText;
window.generateIAReport = generateIAReport;
window.generateAnswer = generateAnswer;
window.askIA = askIA;

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "IA Engine chargé."
        );

    }
);
