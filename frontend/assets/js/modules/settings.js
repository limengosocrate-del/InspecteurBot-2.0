/**
 * Paramètres configurables du module.
 * @module modules/settings
 */
import store from '../core/store.js';

export function getParametres() { return store.get('parametres'); }

export function sauvegarderParametres(maj) {
  const p = { ...store.get('parametres'), ...maj };
  store.set('parametres', p);
  return p;
}

export function ajouterInspecteur(inspecteur) {
  const p = store.get('parametres');
  p.inspecteurs.push({ id: Date.now(), ...inspecteur });
  store.set('parametres', p);
}

export function definirModeNumerotation(mode) {
  const p = store.get('parametres');
  p.numerotation.mode = mode; // 'auto' | 'manuel'
  store.set('parametres', p);
}

/** Sauvegarde / restauration complète (backup). */
export function exporterBackup() {
  return JSON.stringify(store.state, null, 2);
}
export function importerBackup(json) {
  try {
    store.state = JSON.parse(json);
    store.save();
    return true;
  } catch { return false; }
      }
