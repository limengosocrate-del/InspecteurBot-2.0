/**
 * Taux officiels en USD - Arrêté interministériel
 * N°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 &
 * N°CAB/MIN/FINANCES/127/09/2023 du 03/10/2023.
 * Payable en francs congolais au taux officiel du jour.
 * @module data/tauxAmendes
 */

/** Droits d'octroi de la carte de travail pour étranger (USD) */
export const CARTE_TRAVAIL_ETRANGER = {
  A: { taux: 500,  secteurs: ["Agro-pastoral", "Élevage", "Plantation", "Pêche", "Exploitation forestière", "Extraction matériaux construction", "Recherche fondamentale", "Forage puits filtrants"] },
  B: { taux: 700,  secteurs: ["Construction (génie civil/métallique)", "Énergie", "Transports/Communications", "Services", "Industrie manufacturière", "Agro-industrie"] },
  C: { taux: 1000, secteurs: ["Commerce général", "Secteur bancaire", "Institution financière", "Assurance"] },
  D: { taux: 1500, secteurs: ["Activité pétrolière (hors exploration/raffinage)", "Secteur minier", "Comptoirs minerais", "Taillerie/fonderie"] },
  E: { taux: 2000, secteurs: ["Télécommunications", "Jeux d'argent (casino, loteries, loisirs)"] },
  F: { taux: 2800, secteurs: ["Exploitation pétrolière/raffinage", "Exploitation minière", "Traitement minerais", "Comptoir matières précieuses", "Construction minière"] }
};

/** Droits divers (USD) */
export const DROITS_DIVERS = {
  enregistrement_organisation_syndicale: 1000,
  vente_revue_travail: 30,
  visa_reglement_entreprise: 600,
  visa_reglement_ordre_interieur_delegation: 100,
  visa_horaire_travail: 100,
  visa_convention_collective: 1000,
  visa_classification_emploi: 500,
  visa_protocole_accord: 600
};

/** Amendes transactionnelles - Emploi et Travail (USD) */
export const AMENDES_TRANSACTIONNELLES = {
  defaut_carte_travail_etranger: {
    mode: "multiple",
    min: 1, max: 5,
    base: "taux_droits_octroi",
    description: "Du simple au quintuple du taux des droits d'octroi"
  },
  defaut_enregistrement_syndicat: {
    mode: "multiple",
    min: 1, max: 5,
    base: "taux_droits_enregistrement",
    description: "Du simple au quintuple du taux des droits d'enregistrement"
  },
  autres_violations_emploi: {
    mode: "fourchette",
    min: 600, max: 5600,
    unite: "violation",
    description: "600 à 5600 USD / violation"
  },
  autres_violations_prevoyance: {
    mode: "fourchette",
    min: 500, max: 2500,
    unite: "violation",
    description: "500 à 2500 USD / violation"
  }
};

/** Services de sécurité et santé au travail - Agrément (USD) */
export const SST_AGREMENT = {
  A: { taux: 6000, risque: "Haut risque (hydrocarbure, pétrole, gaz, minière, métallique...)" },
  B: { taux: 5000, risque: "Moyen risque (brassicole, pharmaceutique, bois, alimentaire...)" },
  C: { taux: 4000, risque: "Faible risque (commercial, service...)" }
};

/** Services SST - Autorisation (USD) */
export const SST_AUTORISATION = {
  A: 3000, B: 2500, C: 2000,
  medecin_expatrie: 2500,
  medecin_national: 1250,
  personnel_soignant: 750
};

/**
 * Calcule l'amende sur base du mode.
 * @param {object} regle
 * @param {object} params { multiplicateur, tauxBase, quantite, montantManuel }
 * @returns {number} montant en USD
 */
export function calculerAmende(regle, params = {}) {
  switch (regle.mode) {
    case "multiple":
      return (params.tauxBase || 0) * (params.multiplicateur || regle.min);
    case "fourchette":
      return (params.montantManuel != null)
        ? Math.min(Math.max(params.montantManuel, regle.min), regle.max)
        : regle.min;
    default:
      return params.montantManuel || 0;
  }
}

/** Conversion USD -> FC (taux du jour paramétrable) */
export function convertirUsdVersFc(montantUsd, tauxJour) {
  return Math.round(montantUsd * (tauxJour || 2800));
}
