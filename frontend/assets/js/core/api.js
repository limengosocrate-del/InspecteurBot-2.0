/**
 * Couche de synchronisation avec l'API backend.
 * Fonctionne hors-ligne (localStorage) puis synchronise.
 * @module core/api
 */
const BASE_URL = window.IBOT_API || 'http://localhost:3000/api';

async function requete(url, options = {}) {
  try {
    const res = await fetch(BASE_URL + url, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    if (!res.ok) throw new Error((await res.json()).erreur || 'Erreur API');
    return await res.json();
  } catch (e) {
    console.warn('[API] Mode hors-ligne :', e.message);
    return { horsLigne: true, erreur: e.message };
  }
}

export const API = {
  creerPV:    (data)     => requete('/pv', { method: 'POST', body: JSON.stringify(data) }),
  listerPV:   (q = '')   => requete('/pv' + q),
  obtenirPV:  (id)       => requete('/pv/' + id),
  majPV:      (id, data) => requete('/pv/' + id, { method: 'PUT', body: JSON.stringify(data) }),
  supprimerPV:(id)       => requete('/pv/' + id, { method: 'DELETE' }),
  dashboard:  ()         => requete('/stats/dashboard'),
  infractions:()         => requete('/infractions')
};

/**
 * File de synchronisation : rejoue les actions faites hors-ligne.
 */
export async function synchroniser(fileActions) {
  const restantes = [];
  for (const action of fileActions) {
    const r = await requete(action.url, action.options);
    if (r.horsLigne) restantes.push(action);
  }
  return restantes;
  }
