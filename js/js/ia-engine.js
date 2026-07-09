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

/* Enrichissement ask() — chaînage calculs + procédures */
(function patchAI() {
  if (!window.InspecteurAI) return;
  const _ask = InspecteurAI.ask;
  InspecteurAI.ask = function (question, context = {}) {
    const q = (question || "").trim();

    // Calcul préavis express : "préavis cadre 3 ans licenciement"
    let m = q.match(/pr[eé]avis\s+(cadre|ma[iî]trise|classifi\w*)\s+(\d+)\s*ans?\s*(licenciement|d[eé]mission)?/i);
    if (m && window.SMIG_RDC) {
      const map = { cadre: "cadre", "maîtrise": "agent_maitrise", "maitrise": "agent_maitrise", classifie: "agent_classifie", classifié: "agent_classifie" };
      const key = Object.keys(map).find(k => m[1].toLowerCase().includes(k.replace("é","e"))) || "agent_classifie";
      const type = map[key] || "agent_classifie";
      const ans = +m[2];
      const dem = /d[eé]mission/i.test(m[3] || "");
      const p = SMIG_RDC.preavis[type];
      const base = dem ? p.baseDem : p.baseLic;
      const jours = base + p.parAn * ans;
      return {
        id: "AI-" + Date.now(), role: "assistant", confidence: 0.96, ts: new Date().toISOString(),
        text: `Préavis calculé (${type}, ${dem ? "démission" : "licenciement"}, ${ans} an(s)) :\n` +
          `${base} + (${p.parAn} × ${ans}) = **${jours} jours**.\n` +
          `Indemnité compensatrice = ${jours} × (salaire mensuel / 26).\nRéf. pratique IGT + art. 148-149 CT.`
      };
    }

    // Rappel SMIG express
    m = q.match(/rappel\s*smig.*?(\d+).*?(\d+)\s*mois/i) || q.match(/smig\s*classe\s*(\d+).*?(\d+)\s*mois/i);
    if (m && window.SMIG_RDC) {
      const c = SMIG_RDC.getByClasse(+m[1]);
      const mois = +m[2];
      if (c) {
        return {
          id: "AI-" + Date.now(), role: "assistant", confidence: 0.95, ts: new Date().toISOString(),
          text: `Rappel SMIG classe ${c.classe} (${c.echelon}) sur ${mois} mois :\n` +
            `SMIG mensuel : ${c.smigMois.toLocaleString("fr-CD")} FC\n` +
            `Rappel max théorique (si salaire 0) : ${(c.smigMois * mois).toLocaleString("fr-CD")} FC\n` +
            `Formule : (SMIG_classe − salaire_versé) × nombre de mois.\n` +
            `Procédure : ${ (KnowledgeBaseExt?.PROCEDURES_ETENDUES?.rappel_smig || []).join(" → ") }`
        };
      }
    }

    // Procédure accident
    if (/accident.*(grave|mortel|travail)/i.test(q) && window.KnowledgeBaseExt) {
      const steps = KnowledgeBaseExt.PROCEDURES_ETENDUES.accident_grave.join("\n");
      return {
        id: "AI-" + Date.now(), role: "assistant", confidence: 0.94, ts: new Date().toISOString(),
        text: `🚨 Procédure accident du travail grave (IGT) :\n${steps}\n\nFiches : F03 + fiche sectorielle (F04/F05/F06) + F07.\nConventions OIT pertinentes : C155, C81.`
      };
    }

    return _ask.call(InspecteurAI, question, context);
  };
})();

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
