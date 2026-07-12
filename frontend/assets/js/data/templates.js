/**
 * Registre évolutif des modèles de PV.
 * Architecture ouverte : ajout de modèles sans modifier le système.
 * @module data/templates
 */

export const TYPES_PV = {
  CONSTAT_INFRACTION: 'constat_infraction',
  CONSTAT_OBSTRUCTION: 'constat_obstruction',
  NON_CONCILIATION: 'non_conciliation',
  MISE_EN_DEMEURE: 'mise_en_demeure',
  INSTALLATION_CSHE: 'installation_cshe'
};

/**
 * Chaque modèle déclare :
 *  - ses champs variables (schema)
 *  - s'il possède un numéro
 *  - son format de numérotation
 *  - s'il comporte un tableau d'infractions
 */
export const MODELES = {
  [TYPES_PV.CONSTAT_INFRACTION]: {
    id: TYPES_PV.CONSTAT_INFRACTION,
    titre: "PROCÈS-VERBAL DE CONSTAT D'INFRACTION",
    aNumero: true,
    formatNumero: "N°..../MET/IGT/ADMC/DEP/IT/OPJ/{initiales}/{MOIS}/{ANNEE}",
    aTableauInfractions: true,
    aAmendes: true,
    aSignatures: ['contrevenant', 'verbalisateur'],
    champs: [
      'province', 'directionProvinciale', 'inspection', 'numero',
      'annee', 'jour', 'mois', 'inspecteur', 'numeroHabilitation',
      'ordreMission', 'entreprise', 'adresse', 'quartier', 'commune',
      'ville', 'representant', 'representantFonction', 'representantTel',
      'temoin2', 'temoin2Fonction', 'temoin2Tel', 'lieuFait', 'dateFait'
    ]
  },

  [TYPES_PV.CONSTAT_OBSTRUCTION]: {
    id: TYPES_PV.CONSTAT_OBSTRUCTION,
    titre: "PROCÈS-VERBAL DE CONSTAT D'OBSTRUCTION",
    aNumero: true,
    formatNumero: "N°..../METPS/IGT/IT-{initiales}/OPJ/{numero}/{ANNEE}",
    aTableauInfractions: false,
    aAmendes: false,
    aSignatures: ['contrevenant', 'inspecteur'],
    articleReference: "Art. 322 CT ; Ord.-loi N°16/010 du 15/07/2016",
    champs: [
      'province', 'directionProvinciale', 'inspection', 'numero',
      'annee', 'jour', 'mois', 'inspecteur', 'assermentation',
      'ordreMission', 'entreprise', 'adresse', 'commune', 'quartier',
      'dateControle', 'responsable', 'responsableFonction'
    ]
  },

  [TYPES_PV.NON_CONCILIATION]: {
    id: TYPES_PV.NON_CONCILIATION,
    titre: "PROCÈS-VERBAL DE NON CONCILIATION DE LITIGE INDIVIDUEL DU TRAVAIL",
    aNumero: true,
    formatNumero: "N°..../MET/DPS/IPT1-{initiales}/{numero}/{ANNEE}",
    aTableauInfractions: false,
    aAmendes: false,
    aSections: ['constat', 'conclusion', 'proposition', 'desaccord'],
    aSignatures: ['demandeur', 'defendeur', 'inspecteur'],
    champs: [
      'province', 'directionProvinciale', 'inspection', 'numero',
      'annee', 'jour', 'mois', 'inspecteur', 'numeroAssermentation',
      'demandeur', 'demandeurAdresse', 'demandeurAvocat',
      'defendeur', 'defendeurAdresse', 'defendeurAvocat',
      'faits', 'montantReclame', 'constat', 'conclusion',
      'proposition', 'articlesApplicables'
    ]
  },

  [TYPES_PV.MISE_EN_DEMEURE]: {
    id: TYPES_PV.MISE_EN_DEMEURE,
    titre: "MISE EN DEMEURE",
    aNumero: true,
    formatNumero: "N°..../MET/IGT/IGTal-{initiales}/{ville}/{numero}/{ANNEE}",
    aTableauInfractions: false,
    aAmendes: false,
    format: 'lettre',
    aSignatures: ['opj'],
    champs: [
      'province', 'directionProvinciale', 'numero', 'annee',
      'opj', 'opjAdresse', 'destinataire', 'destinataireAdresse',
      'objet', 'copies', 'corps', 'delai', 'articlesReferences',
      'lieu', 'date'
    ]
  }
};

export function getModele(type) { return MODELES[type] || null; }
export function getModelesForSelect() {
  return Object.values(MODELES).map(m => ({ id: m.id, titre: m.titre }));
}

/**
 * Enregistre un nouveau modèle dynamiquement (évolutivité).
 * @param {string} id
 * @param {object} definition
 */
export function enregistrerModele(id, definition) {
  MODELES[id] = { id, ...definition };
  return MODELES[id];
    }
