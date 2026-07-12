/**
 * Recherche avancée multi-critères.
 * @module modules/search
 */
import store from '../core/store.js';

export function rechercher(criteres = {}) {
  let resultats = [...store.get('pvs')];
  const f = (v) => (v || '').toString().toLowerCase();

  if (criteres.numero)     resultats = resultats.filter(p => f(p.numero).includes(f(criteres.numero)));
  if (criteres.entreprise) resultats = resultats.filter(p => f(p.entreprise).includes(f(criteres.entreprise)));
  if (criteres.inspecteur) resultats = resultats.filter(p => f(p.inspecteur).includes(f(criteres.inspecteur)));
  if (criteres.province)   resultats = resultats.filter(p => f(p.province).includes(f(criteres.province)));
  if (criteres.commune)    resultats = resultats.filter(p => f(p.commune).includes(f(criteres.commune)));
  if (criteres.type)       resultats = resultats.filter(p => p.type === criteres.type);
  if (criteres.statut)     resultats = resultats.filter(p => p.statut === criteres.statut);
  if (criteres.dateDebut)  resultats = resultats.filter(p => new Date(p.dateCreation) >= new Date(criteres.dateDebut));
  if (criteres.dateFin)    resultats = resultats.filter(p => new Date(p.dateCreation) <= new Date(criteres.dateFin));
  if (criteres.infraction) resultats = resultats.filter(p =>
    (p.infractions || []).some(i => f(i.libelle).includes(f(criteres.infraction))));

  return resultats;
                                                        }
