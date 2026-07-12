/**
 * Routeur central de rendu des templates.
 * @module templates/index
 */
import { TYPES_PV } from '../data/templates.js';
import { renderConstatInfraction } from './pvConstatInfraction.js';
import { renderObstruction } from './pvObstruction.js';
import { renderNonConciliation } from './pvNonConciliation.js';
import { renderMiseEnDemeure } from './miseEnDemeure.js';

const RENDERERS = {
  [TYPES_PV.CONSTAT_INFRACTION]: renderConstatInfraction,
  [TYPES_PV.CONSTAT_OBSTRUCTION]: renderObstruction,
  [TYPES_PV.NON_CONCILIATION]: renderNonConciliation,
  [TYPES_PV.MISE_EN_DEMEURE]: renderMiseEnDemeure
};

/**
 * Rend un PV selon son type.
 * @param {object} pv
 * @returns {string} HTML
 */
export function renderPV(pv) {
  const renderer = RENDERERS[pv.type];
  if (!renderer) return `<div class="erreur">Modèle inconnu : ${pv.type}</div>`;
  return renderer(pv);
}

/** Permet d'enregistrer un nouveau renderer (évolutivité). */
export function enregistrerRenderer(type, fn) {
  RENDERERS[type] = fn;
}
