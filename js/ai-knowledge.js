/* ==================================================================
   AI-KNOWLEDGE.JS — Base de connaissances Inspection du Travail RDC
   Loi n° 015/2002 du 16 octobre 2002 portant Code du Travail
   modifiée et complétée par Loi n° 016/010 du 15 juillet 2016
   ================================================================== */

const KNOWLEDGE_BASE = {

  // ============ CODE DU TRAVAIL RDC — Articles clés ============
  codeTravail: [
    { art:1,   titre:"Objet et champ d'application", texte:"Le présent Code s'applique à tous les travailleurs et à tous les employeurs, y compris ceux des entreprises publiques, exerçant leur activité professionnelle sur toute l'étendue de la République Démocratique du Congo, quels que soient la race, le sexe, l'état civil, la religion, l'opinion politique, l'ascendance nationale, l'origine sociale, la nationalité des parties, la nature des prestations, la rémunération ou le lieu de conclusion du contrat." },
    { art:7,   titre:"Définitions",  texte:"Travailleur : toute personne physique en âge de contracter, quels que soient son sexe, son état civil et sa nationalité, qui s'est engagée à mettre son activité professionnelle, moyennant rémunération, sous la direction et l'autorité d'une personne physique ou morale, publique ou privée, dans les liens d'un contrat de travail." },
    { art:38,  titre:"Contrat à durée déterminée", texte:"Le contrat à durée déterminée ne peut être conclu pour une durée supérieure à 2 ans. Renouvellement possible mais nombre limité." },
    { art:39,  titre:"Contrat à durée indéterminée", texte:"Le contrat à durée indéterminée est celui dont la durée n'est pas fixée à l'avance." },
    { art:62,  titre:"Résiliation abusive", texte:"Le licenciement sans motif valable ouvre droit à une indemnité compensatoire." },
    { art:64,  titre:"Préavis", texte:"Le contrat à durée indéterminée peut prendre fin par la volonté de l'une des parties. Cette volonté est subordonnée au préavis donné par la partie qui prend l'initiative de la rupture." },
    { art:71,  titre:"Indemnité de préavis", texte:"En cas de non-respect du préavis, la partie qui rompt le contrat doit verser à l'autre une indemnité équivalente à la rémunération et aux avantages de toute nature dont aurait bénéficié le travailleur pendant la durée du préavis restant à courir." },
    { art:87,  titre:"SMIG — fondement légal", texte:"Le salaire minimum interprofessionnel garanti est fixé par décret du Premier ministre, pris après avis du Conseil national du travail." },
    { art:91,  titre:"Secteurs agro-industriels", texte:"Des dispositions spécifiques peuvent être prises pour alléger les difficultés des secteurs agro-industriels et pastoraux." },
    { art:119, titre:"Heures supplémentaires", texte:"La durée légale du travail ne peut excéder 45 heures par semaine et 9 heures par jour. Les heures effectuées au-delà donnent lieu à majoration : +30% pour les 6 premières heures supplémentaires par semaine, +60% au-delà, +100% pour dimanches et jours fériés." },
    { art:140, titre:"Congé annuel", texte:"Le travailleur adulte a droit à un congé annuel dont la durée ne peut être inférieure à 1 jour ouvrable par mois entier de service, soit 12 jours minimum. En pratique 18 jours pour les adultes, 26 pour les moins de 18 ans, avec 1 jour supplémentaire par tranche de 3 années d'ancienneté." },
    { art:159, titre:"Décompte final", texte:"À la fin du contrat, l'employeur doit remettre au travailleur un décompte final comprenant : salaire restant dû, indemnité compensatoire de préavis (si non presté), indemnité compensatoire de congé, gratifications, indemnités de logement et de transport." },
    { art:317, titre:"Inspection du travail", texte:"L'Inspection Générale du Travail est chargée de veiller à l'application des dispositions du Code du travail et de ses mesures d'exécution." },
    { art:321, titre:"Pouvoirs de l'inspecteur", texte:"L'inspecteur du travail peut pénétrer librement, à toute heure du jour et de la nuit, dans tout établissement assujetti au contrôle de l'Inspection du travail." }
  ],

  // ============ FICHES DE CONTRÔLE F01-F07 & S01-S03 ============
  fiches: {
    F01: { code:"F01", nom:"Contrôle de la main-d'œuvre", 
           objectif:"Vérifier la conformité de l'emploi (contrats, registre, déclarations ONEM, respect SMIG).",
           pointsCles:["Registre d'employeur","Contrats écrits","Déclarations d'embauche","Bulletins de paie","Respect du SMIG","Allocations familiales"] },
    F02: { code:"F02", nom:"Contrôle de la main-d'œuvre étrangère",
           objectif:"Contrôler la carte de travail des étrangers et proportion 90/10.",
           pointsCles:["Cartes de travail","Autorisations ONEM","Ratio 90% nationaux / 10% étrangers","Contrats visés"] },
    F03: { code:"F03", nom:"Hygiène et santé au travail",
           objectif:"Contrôler les conditions d'hygiène, EPI, médecine du travail.",
           pointsCles:["Eau potable","Sanitaires","EPI","Médecin du travail","Registre des accidents","Vaccinations"] },
    F04: { code:"F04", nom:"Sécurité technique BTP",
           objectif:"Contrôler la sécurité sur chantiers.",
           pointsCles:["Casques","Harnais","Échafaudages","Balisage","Formation sécurité"] },
    F05: { code:"F05", nom:"Sécurité dans les mines",
           objectif:"Contrôler la sécurité minière.",
           pointsCles:["Ventilation","Étayage","Détection gaz","Équipements individuels","Formation risques"] },
    F06: { code:"F06", nom:"Sécurité entreprises à haut risque",
           objectif:"Contrôler produits chimiques, explosifs, radiations.",
           pointsCles:["Fiches de données de sécurité","Stockage","Plan d'urgence","Formations spécialisées"] },
    F07: { code:"F07", nom:"Protection sociale",
           objectif:"Vérifier affiliation CNSS, INPP, ONEM et paiement des cotisations.",
           pointsCles:["Affiliation CNSS","Cotisations à jour","Déclarations trimestrielles","Attestations","Registre affiliés"] },
    S01: { code:"S01", nom:"Visite d'inspection spéciale",
           objectif:"Inspection ciblée sur plainte ou signalement.",
           pointsCles:["Objet de la plainte","Auditions","Preuves","PV constat"] },
    S02: { code:"S02", nom:"Contre-enquête",
           objectif:"Vérifier contradictions ou compléments d'enquête.",
           pointsCles:["Décision antérieure","Nouveaux éléments","Confrontations"] },
    S03: { code:"S03", nom:"Administration et Finance",
           objectif:"Contrôle administratif et financier des employeurs.",
           pointsCles:["Livre de paie","Reçus","Retenues fiscales","Versements"] }
  },

  // ============ ONEM ============
  onem: {
    declaration: "Toute entreprise doit déposer une déclaration d'établissement à l'ONEM dans les 15 jours suivant l'ouverture.",
    dasmo: "Déclaration Annuelle de la Situation de la Main-d'Œuvre — obligatoire avant le 31 mars de chaque année.",
    bilanSocial: "Document annuel récapitulatif emploi, formation, sécurité, dialogue social."
  },

  // ============ CONVENTIONS OIT ratifiées par la RDC ============
  oit: [
    { num:"C29",  nom:"Travail forcé (1930)", ratif:"1960" },
    { num:"C87",  nom:"Liberté syndicale (1948)", ratif:"2001" },
    { num:"C98",  nom:"Droit d'organisation et de négociation collective (1949)", ratif:"1969" },
    { num:"C100", nom:"Égalité de rémunération (1951)", ratif:"1969" },
    { num:"C105", nom:"Abolition du travail forcé (1957)", ratif:"2001" },
    { num:"C111", nom:"Discrimination emploi et profession (1958)", ratif:"2001" },
    { num:"C138", nom:"Âge minimum (1973)", ratif:"2001" },
    { num:"C182", nom:"Pires formes de travail des enfants (1999)", ratif:"2001" }
  ],

  // ============ MÉMOIRE FAQ INSPECTEUR ============
  faq: [
    { q:"Quel est le SMIG en RDC en 2025 ?", 
      r:"Selon le Décret n° 25/22 du 30 mai 2025 : 14 500 FC/jour à partir de la paie de mai 2025, puis 21 500 FC/jour à partir de janvier 2026 pour le manœuvre ordinaire (catégorie I échelon 1)." },
    { q:"Comment calcule-t-on le préavis ?",
      r:"Préavis = base + (rang par année d'ancienneté). Manœuvres/classifiés : 14j + 7j/an. Maîtrise : 26j + 9j/an. Cadres : 78j + 16j/an. En cas de démission volontaire, la base est divisée par 2." },
    { q:"Qu'est-ce que l'indemnité de congé compensatoire ?",
      r:"Formule : (jours de préavis × 18) / 365 = nombre de jours à payer. Puis multiplié par le taux salaire journalier." },
    { q:"Que doit contenir un décompte final ?",
      r:"1) Prestations du mois en cours (salaire + ration + transport), 2) Préavis légal, 3) Indemnité congé compensatoire, 4) Indemnité logement (30% du salaire de base), moins les retenues (IPR, CNSS, ONEM, INPP)." },
    { q:"Quel est le taux logement ?",
      r:"30% du salaire de base selon la pratique, ou contre-valeur légale = 1/5 des allocations familiales journalières × 26 (Décret 25/22 art. 6)." }
  ]
};

if (typeof window !== 'undefined') window.KNOWLEDGE_BASE = KNOWLEDGE_BASE;
if (typeof module !== 'undefined') module.exports = KNOWLEDGE_BASE;
