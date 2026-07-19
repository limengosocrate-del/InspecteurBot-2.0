/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Mission Engine: Inspection Missions & Field Case Studies
   ========================================================================== */

const INSPECTION_MISSIONS = [
  {
    id: "MISSION-BTP-01",
    titre: "Chantier BTP Gombe Kinshasa - Contrôle Sécurité & Sous-traitance",
    entreprise: "Congo Bâtiment & Infra SARL",
    secteur: "Bâtiment et Travaux Publics (BTP)",
    effectif: 120,
    motif: "Inspection Inopinée suite à un signalement d'absence d'EPI et d'expatriés non déclarés.",
    etapes: [
      {
        question: "Étape 1 : À votre arrivée sur le chantier BTP, quelle est votre première démarche administrative légale ?",
        choix: [
          { id: "A", texte: "Présenter votre carte d'Inspecteur du Travail au chef de chantier et exiger la fiche F04 (BTP)." },
          { id: "B", texte: "Arrêter immédiatement tous les travaux sans prévenir la direction." },
          { id: "C", texte: "Exiger le paiement d'une caution forfaitaire en liquide sur place." }
        ],
        bonne: ["A"],
        expl: "L'Inspecteur se fait connaître auprès du responsable de l'établissement (Art 189 CT) et déploie la Fiche F04 relative au BTP."
      },
      {
        question: "Étape 2 : Vous constatez 15 ouvriers travaillant à 12 mètres de hauteur sans harnais de sécurité et sans échafaudage conforme. Quelle qualification juridique donnez-vous ?",
        choix: [
          { id: "A", texte: "Violation grave des conditions d'Hygiène et Sécurité (Art 170-171 CT & Arrêté 0013/1972) présentant un danger imminent." },
          { id: "B", texte: "Simple négligence sans portée réglementaire." },
          { id: "C", texte: "Litige individuel de travail." }
        ],
        bonne: ["A"],
        expl: "L'absence d'EPI contre la chute en hauteur relève de l'Art 171 du Code du Travail et de l'Arrêté 0013."
      },
      {
        question: "Étape 3 : Quelle mesure administrative immédiate prenez-vous face à ce danger grave et imminent ?",
        choix: [
          { id: "A", texte: "Dresser un ordre d'arrêt immédiat des travaux en hauteur + Mise en demeure sous 48h + Procès-verbal de constat d'infraction." },
          { id: "B", texte: "Accorder un délai d'un an pour acheter des casques." },
          { id: "C", texte: "Saisir les outils des ouvriers." }
        ],
        bonne: ["A"],
        expl: "L'Inspecteur a le pouvoir d'ordonner des mesures d'exécution immédiate ou la suspension du poste en cas de danger imminent (Art 191 CT)."
      }
    ]
  },
  {
    id: "MISSION-MINE-02",
    titre: "Société Minière du Katanga - Audit Main d'Œuvre Extranationale & SMIG",
    entreprise: "Katanga Copper Resources Mining Ltd",
    secteur: "Industrie Extractive (Mines)",
    effectif: 450,
    motif: "Vérification de la Fiche F02 (Expatriés), du ratio national/étranger et de la grille du SMIG 2025.",
    etapes: [
      {
        question: "Étape 1 : Lors de l'examen de la liste des expatriés, vous découvrez 8 techniciens étrangers occupant des postes réservés aux nationaux (Arrêté 86/001). Quelle est l'action réglementaire ?",
        choix: [
          { id: "A", texte: "Constater l'infraction à l'Arrêté 86/001, exiger le remplacement immédiat par des nationaux et dresser un PV d'infraction (Art 323 CT)." },
          { id: "B", texte: "Tolérer les postes s'ils parlent anglais." },
          { id: "C", texte: "Transférer la société aux impôts." }
        ],
        bonne: ["A"],
        expl: "Les emplois figurant sur la liste de l'Arrêté 86/001 sont exclusivement réservés aux Congolais."
      },
      {
        question: "Étape 2 : L'employeur applique un taux de SMIG inférieur au barème du Décret 25/22 du 30 mai 2025 pour les manoeuvres (Catégorie I). Que décidez-vous ?",
        choix: [
          { id: "A", texte: "Exiger le rappel immédiat des soldes salariaux rétroactifs et dresser une mise en demeure puis un PV CI sous Art 321 CT." },
          { id: "B", texte: "Accepter le taux de l'employeur s'il offre des repas gratuits." },
          { id: "C", texte: "Saisir la banque de l'entreprise." }
        ],
        bonne: ["A"],
        expl: "Le SMIG fixé par le Décret 25/22 du 30 mai 2025 est d'ordre public strict et ne peut être diminué."
      }
    ]
  }
];

class MissionEngine {
  constructor() {
    this.missions = INSPECTION_MISSIONS;
  }

  getMissions() {
    return this.missions;
  }

  getMissionById(id) {
    return this.missions.find(m => m.id === id);
  }

  evaluateStep(missionId, stepIdx, choiceId) {
    const mission = this.getMissionById(missionId);
    if (!mission || !mission.etapes[stepIdx]) return false;

    const step = mission.etapes[stepIdx];
    return step.bonne.includes(choiceId);
  }
}

window.missionEngine = new MissionEngine();
