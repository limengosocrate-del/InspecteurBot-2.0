/**
 * Statistiques du module.
 * @module modules/stats
 */
import store from '../core/store.js';

export function genererStatistiques() {
  const pvs = store.get('pvs');
  const grouper = (fn) => pvs.reduce((acc, p) => {
    const k = fn(p) || 'Non renseigné';
    acc[k] = (acc[k] || 0) + 1; return acc;
  }, {});

  return {
    parType: grouper(p => p.titre),
    parProvince: grouper(p => p.province),
    parInspecteur: grouper(p => p.inspecteur),
    parStatut: grouper(p => p.statut),
    parSecteur: grouper(p => p.secteurActivite),
    entreprisesControlees: new Set(pvs.map(p => p.entreprise).filter(Boolean)).size,
    totalInfractions: pvs.reduce((s, p) => s + (p.infractions?.length || 0), 0),
    totalAmendes: pvs.reduce((s, p) => s + (p.totalGeneral || 0), 0),
    infractionsFrequentes: infractionsFrequentes(pvs)
  };
}

function infractionsFrequentes(pvs) {
  const compte = {};
  pvs.forEach(p => (p.infractions || []).forEach(i => {
    compte[i.libelle] = (compte[i.libelle] || 0) + 1;
  }));
  return Object.entries(compte).sort((a,b) => b[1]-a[1]).slice(0, 10);
      }
