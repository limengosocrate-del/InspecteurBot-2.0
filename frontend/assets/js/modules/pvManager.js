/**
 * Gestion du cycle de vie des PV + numérotation auto/manuelle.
 * @module modules/pvManager
 */
import store from '../core/store.js';
import eventBus from '../core/eventBus.js';
import { getModele, TYPES_PV } from '../data/templates.js';

export const STATUTS = {
  BROUILLON: 'brouillon',
  EN_COURS: 'en_cours',
  SIGNE: 'signe',
  TRANSMIS: 'transmis',
  ARCHIVE: 'archive'
};

const MOIS_FR = ['JANVIER','FÉVRIER','MARS','AVRIL','MAI','JUIN','JUILLET','AOÛT','SEPTEMBRE','OCTOBRE','NOVEMBRE','DÉCEMBRE'];

/**
 * Génère un numéro selon le mode configuré.
 * @param {string} type type de PV
 * @param {object} data données pour interpolation
 * @returns {string}
 */
export function genererNumero(type, data = {}) {
  const modele = getModele(type);
  if (!modele || !modele.aNumero) return '';

  const params = store.get('parametres');
  let sequence;

  if (params.numerotation.mode === 'auto') {
    sequence = params.numerotation.dernierNumero + 1;
    // vérification anti-doublon
    while (numeroExiste(sequence, type)) sequence++;
    params.numerotation.dernierNumero = sequence;
    store.set('parametres', params);
  } else {
    sequence = data.numeroManuel;
    if (numeroExiste(sequence, type)) {
      throw new Error(`Numéro ${sequence} déjà utilisé (doublon interdit).`);
    }
  }

  const now = new Date();
  return modele.formatNumero
    .replace('....', String(sequence).padStart(3, '0'))
    .replace('{numero}', sequence)
    .replace('{initiales}', data.initiales || 'XXX')
    .replace('{ville}', data.ville || '')
    .replace('{MOIS}', MOIS_FR[now.getMonth()])
    .replace('{ANNEE}', data.annee || now.getFullYear());
}

function numeroExiste(seq, type) {
  return store.get('pvs').some(p => p.type === type && p.sequence === seq);
}

/** Crée un nouveau PV (brouillon par défaut). */
export function creerPV(type, data = {}) {
  const modele = getModele(type);
  if (!modele) throw new Error('Type de PV inconnu : ' + type);

  const pv = {
    type,
    titre: modele.titre,
    statut: STATUTS.BROUILLON,
    infractions: [],
    ...data
  };
  const saved = store.addPV(pv);
  eventBus.emit('pv:created', saved);
  return saved;
}

/** Change le statut avec contrôle de cohérence. */
export function changerStatut(id, statut) {
  const pv = store.getPV(id);
  if (!pv) return null;

  // Contrôle de cohérence : un PV signé exige au moins une signature
  if (statut === STATUTS.SIGNE && !pv.signatureVerbalisateur) {
    throw new Error('Impossible de signer : signature du verbalisateur manquante.');
  }
  store.updatePV(id, { statut });
  eventBus.emit('pv:status', { id, statut });
  return pv;
}

/** Détection de doublons potentiels (même entreprise + même mois). */
export function detecterDoublons(pv) {
  const mois = new Date(pv.dateCreation).getMonth();
  return store.get('pvs').filter(p =>
    p.id !== pv.id &&
    p.type === pv.type &&
    (p.entreprise || '').toLowerCase() === (pv.entreprise || '').toLowerCase() &&
    new Date(p.dateCreation).getMonth() === mois
  );
}

/** Sauvegarde automatique du brouillon (débounce géré côté UI). */
export function sauvegarderBrouillon(id, data) {
  const pv = store.getPV(id);
  if (pv) { store.updatePV(id, { ...data, statut: STATUTS.BROUILLON }); }
  else { return creerPV(data.type, data); }
  eventBus.emit('pv:draft-saved', id);
  return store.getPV(id);
}
