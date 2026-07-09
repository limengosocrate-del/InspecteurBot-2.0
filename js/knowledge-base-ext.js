/* ============================================================
   js/knowledge-base-ext.js
   Extension KB : Constitution, OIT, décrets, jurisprudence,
   conventions, arrêtés, notes – pour IA locale
   ============================================================ */

const KnowledgeBaseExt = (() => {
  "use strict";

  const CONSTITUTION = {
    titre: "Constitution de la RDC (18 février 2006, révisée 2011)",
    articles: {
      "36": "Le travail est un droit et un devoir pour chaque Congolais. L'État garantit le droit au travail, la protection contre le chômage et des conditions justes et équitables.",
      "37": "L'État garantit la liberté d'association. Les pouvoirs publics collaborent avec les associations qui contribuent au développement social, économique…",
      "38": "Le droit de fonder des syndicats est garanti. Aucun travailleur ne peut être soumis à des mesures discriminatoires en raison de ses activités syndicales.",
      "39": "Le droit de grève est reconnu et garanti. Il s'exerce dans les conditions fixées par la loi qui peut en interdire ou limiter l'exercice dans les domaines de défense nationale et de sécurité ou pour tout service ou activité publique d'intérêt vital.",
    }
  };

  const OIT = [
    { num: "C29", titre: "Travail forcé (1930)", resume: "Interdiction du travail forcé ou obligatoire." },
    { num: "C87", titre: "Liberté syndicale (1948)", resume: "Droit des travailleurs et employeurs de constituer des organisations." },
    { num: "C98", titre: "Droit d'organisation et de négociation collective (1949)", resume: "Protection contre la discrimination antisyndicale." },
    { num: "C100", titre: "Égalité de rémunération (1951)", resume: "Égalité de rémunération entre hommes et femmes pour un travail de valeur égale." },
    { num: "C105", titre: "Abolition du travail forcé (1957)", resume: "Abolition de toute forme de travail forcé." },
    { num: "C111", titre: "Discrimination (emploi et profession) (1958)", resume: "Élimination de la discrimination en matière d'emploi." },
    { num: "C138", titre: "Âge minimum (1973)", resume: "Âge minimum d'admission à l'emploi." },
    { num: "C182", titre: "Pires formes de travail des enfants (1999)", resume: "Interdiction des pires formes de travail des enfants." },
    { num: "C155", titre: "Sécurité et santé des travailleurs (1981)", resume: "Politique nationale de sécurité et santé au travail." },
    { num: "C081", titre: "Inspection du travail (1947)", resume: "Organisation et fonctionnement de l'inspection du travail dans l'industrie et le commerce." }
  ];

  const DECRETS = [
    {
      id: "25/22",
      date: "30/05/2025",
      titre: "Fixation du SMIG, allocations familiales minima et contre-valeur du logement",
      points: [
        "Base manœuvre : 14 500 FC/j (paie mai 2025) puis 21 500 FC/j (paie janv. 2026)",
        "Tension salariale classes 1 à 17",
        "Alloc. fam. = 1/27 du SMIG manœuvre par enfant/jour",
        "Abroge Décret 18/017 du 22/05/2018"
      ]
    },
    {
      id: "25/21",
      date: "30/05/2025",
      titre: "Modalités de fixation et d'ajustement du SMIG",
      points: ["Cadre méthodologique d'ajustement du SMIG", "Commission tripartite de suivi"]
    },
    {
      id: "18/017",
      date: "22/05/2018",
      titre: "Ancien SMIG (ABROGÉ par 25/22)",
      points: ["Ne plus appliquer — référence historique uniquement"]
    }
  ];

  const ARRETES = [
    { id: "AM-MOE", titre: "Main-d'œuvre étrangère / cartes de travail", theme: "etrangers", resume: "Conditions d'octroi, renouvellement et contrôle des cartes de travail des étrangers." },
    { id: "AM-DUREE", titre: "Durée du travail et repos", theme: "duree", resume: "Modalités d'application de la durée légale, repos hebdomadaire, jours fériés." },
    { id: "AM-HYG", titre: "Hygiène et sécurité au travail", theme: "hygiene", resume: "Prescriptions générales d'hygiène et de sécurité dans les établissements." },
    { id: "AM-SAL", titre: "Modalités de paiement du salaire", theme: "salaire", resume: "Périodicité, bulletin de paie, interdictions de retenues illégales." }
  ];

  const NOTES = [
    { id: "NC-SMIG-2025", titre: "Note d'application SMIG Décret 25/22", resume: "Instructions aux inspecteurs pour le contrôle du nouveau SMIG et des rappels de salaire." },
    { id: "NC-PV", titre: "Rédaction des procès-verbaux d'inspection", resume: "Formalisme du PV, force probante, transmission." },
    { id: "NC-ONEM", titre: "Collaboration IGT – ONEM", resume: "Échanges d'informations sur déclarations d'établissement et DASMO." },
    { id: "NC-ACC", titre: "Accidents du travail graves", resume: "Procédure d'enquête immédiate et coordination CNSS." }
  ];

  const CONVENTIONS = [
    { id: "CC-GEN", secteur: "Interprofessionnel / type", resume: "Cadre type de convention collective : salaires, primes, préavis plus favorables, classification." },
    { id: "CC-MINES", secteur: "Mines", resume: "Dispositions sectorielles mines : primes de risque, rotation, sécurité." },
    { id: "CC-BTP", secteur: "BTP", resume: "Chantiers, intempéries, équipements, hébergement chantier." },
    { id: "CC-COM", secteur: "Commerce", resume: "Horaires magasin, dimanches, commissions." },
    { id: "CC-BANQ", secteur: "Banques & assurances", resume: "Classifications cadres, horaires, avantages." }
  ];

  const JURISPRUDENCE = [
    {
      id: "JP-01",
      principe: "Requalification CDD en CDI",
      resume: "Le dépassement de la durée maximale ou des renouvellements irréguliers du CDD peut entraîner la requalification en CDI (art. 40 CT).",
      application: "Vérifier dates, avenants, nature du travail (emploi permanent ou non)."
    },
    {
      id: "JP-02",
      principe: "Licenciement abusif",
      resume: "Absence de motif réel et sérieux ou vice de procédure ouvre droit à dommages-intérêts (art. 150 CT).",
      application: "Exiger dossier disciplinaire, convocation, PV d'audition, lettre de licenciement motivée."
    },
    {
      id: "JP-03",
      principe: "Salaire minimum d'ordre public",
      resume: "Toute clause salariale inférieure au SMIG est nulle. Le rappel est dû.",
      application: "Appliquer Décret 25/22 ; calculer rappel sur période non prescrite."
    },
    {
      id: "JP-04",
      principe: "Force probante du PV d'inspecteur",
      resume: "Le PV fait foi jusqu'à preuve contraire (art. 238 CT).",
      application: "Rédiger avec précision date, heure, faits, articles violés, identité des parties."
    },
    {
      id: "JP-05",
      principe: "Égalité de traitement",
      resume: "Discrimination salariale injustifiée entre travailleurs placés dans la même situation est illicite.",
      application: "Comparer classifications, ancienneté, fonctions réelles (F01)."
    }
  ];

  const PROCEDURES_ETENDUES = {
    accident_grave: [
      "1. Se rendre immédiatement sur les lieux",
      "2. Sécuriser / faire sécuriser (mesures conservatoires)",
      "3. Identifier victimes, témoins, responsables",
      "4. Photographies, croquis, saisies documentaires",
      "5. Vérifier déclaration CNSS",
      "6. Fiches F03/F04/F05/F06 selon activité",
      "7. PV d'enquête + mesures d'arrêt si danger grave",
      "8. Rapport hiérarchique sous 48-72 h"
    ],
    plainte_travailleur: [
      "1. Enregistrer la plainte (identité, faits, pièces)",
      "2. Convocation employeur",
      "3. Auditions contradictoires",
      "4. Contrôle documentaire et sur place si besoin",
      "5. Tentative de conciliation",
      "6. Calcul décompte / rappels si dû",
      "7. PV ou recommandations motivées",
      "8. Suivi des délais de mise en conformité"
    ],
    rappel_smig: [
      "1. Identifier la classe SMIG du poste",
      "2. Comparer salaire versé vs SMIG Décret 25/22",
      "3. Calculer l'écart mensuel × mois concernés",
      "4. Mise en demeure avec délai",
      "5. Vérifier paiement effectif",
      "6. PV d'infraction si refus",
      "7. Information travailleur sur ses droits"
    ]
  };

  function searchExtended(query) {
    const q = (query || "").toLowerCase();
    const hits = [];

    if (/constitution|article\s*3[6-9]/.test(q)) {
      for (const [num, txt] of Object.entries(CONSTITUTION.articles)) {
        if (q.includes(num) || /constitution|syndicat|grève|travail/.test(q)) {
          hits.push({ source: "CONSTITUTION", ref: "Art. " + num, text: txt });
        }
      }
    }

    for (const c of OIT) {
      if (q.includes(c.num.toLowerCase()) || q.includes(c.titre.toLowerCase().slice(0, 12)) ||
          (/oit|convention\s*internationale|travail\s*forc[eé]|enfant|syndic/.test(q) && hits.length < 6)) {
        hits.push({ source: "OIT", ref: c.num, text: c.titre + " — " + c.resume });
      }
    }

    for (const d of DECRETS) {
      if (q.includes(d.id) || /smig|d[eé]cret\s*25|salaire\s*minimum/.test(q)) {
        hits.push({ source: "DECRET", ref: d.id, text: d.titre + " (" + d.date + "). " + d.points.join(" | ") });
      }
    }

    for (const a of ARRETES) {
      if (q.includes(a.theme) || q.includes("arrêté") || q.includes("arrete") || q.includes(a.id.toLowerCase())) {
        hits.push({ source: "ARRETE", ref: a.id, text: a.titre + " — " + a.resume });
      }
    }

    for (const n of NOTES) {
      if (q.includes("note") || q.includes("circulaire") || q.includes(n.id.toLowerCase()) ||
          (n.titre.toLowerCase().split(/\s+/).some(w => w.length > 4 && q.includes(w)))) {
        hits.push({ source: "NOTE", ref: n.id, text: n.titre + " — " + n.resume });
      }
    }

    for (const c of CONVENTIONS) {
      if (q.includes("convention") || q.includes(c.secteur.toLowerCase()) || q.includes(c.id.toLowerCase())) {
        hits.push({ source: "CC", ref: c.id, text: c.secteur + " — " + c.resume });
      }
    }

    for (const j of JURISPRUDENCE) {
      if (q.includes(j.id.toLowerCase()) || q.includes(j.principe.toLowerCase()) ||
          /jurisprudence|requalification|abusif|pv|discrimination|ordre\s*public/.test(q)) {
        hits.push({ source: "JP", ref: j.id, text: j.principe + " : " + j.resume + " Application : " + j.application });
      }
    }

    // Procédures
    for (const [k, steps] of Object.entries(PROCEDURES_ETENDUES)) {
      if (q.includes(k.replace(/_/g, " ")) || (k === "rappel_smig" && /rappel|smig/.test(q)) ||
          (k === "accident_grave" && /accident/.test(q)) || (k === "plainte_travailleur" && /plainte/.test(q))) {
        hits.push({ source: "PROCEDURE", ref: k, text: steps.join("\n") });
      }
    }

    return hits;
  }

  function formatHits(hits) {
    if (!hits.length) return null;
    return hits.slice(0, 8).map(h => `• [${h.source} ${h.ref}]\n  ${h.text}`).join("\n\n");
  }

  function listAll(category) {
    switch (category) {
      case "oit": return OIT;
      case "decrets": return DECRETS;
      case "arretes": return ARRETES;
      case "notes": return NOTES;
      case "conventions": return CONVENTIONS;
      case "jurisprudence": return JURISPRUDENCE;
      case "constitution": return CONSTITUTION;
      default: return null;
    }
  }

  // Patch KnowledgeBase.search si présent
  function install() {
    if (!window.KnowledgeBase) return;
    const orig = KnowledgeBase.search.bind(KnowledgeBase);
    KnowledgeBase.search = function (query) {
      const base = orig(query);
      const ext = searchExtended(query);
      const extTxt = formatHits(ext);
      if (extTxt && (base.type === "fallback" || base.type === "search" || (base.confidence || 0) < 0.9)) {
        if (base.type === "fallback") {
          return { type: "extended", answer: extTxt, confidence: 0.88 };
        }
        return {
          type: base.type,
          answer: base.answer + "\n\n—— Complément juridique ——\n" + extTxt,
          confidence: Math.max(base.confidence || 0.7, 0.85)
        };
      }
      if (extTxt && base.type === "faq") {
        return { ...base, answer: base.answer + "\n\n" + extTxt };
      }
      return base;
    };
    KnowledgeBase.EXT = { CONSTITUTION, OIT, DECRETS, ARRETES, NOTES, CONVENTIONS, JURISPRUDENCE, PROCEDURES_ETENDUES, listAll, searchExtended };
  }

  if (typeof window !== "undefined") {
    window.KnowledgeBaseExt = { searchExtended, formatHits, listAll, install, CONSTITUTION, OIT, DECRETS, ARRETES, NOTES, CONVENTIONS, JURISPRUDENCE, PROCEDURES_ETENDUES };
    // auto-install after DOM scripts
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => setTimeout(install, 0));
    } else {
      setTimeout(install, 0);
    }
  }

  return { searchExtended, formatHits, listAll, install };
})();
