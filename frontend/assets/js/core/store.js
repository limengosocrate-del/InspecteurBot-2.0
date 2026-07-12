/**
 * Store réactif + persistance locale (sauvegarde automatique).
 * @module core/store
 */
import eventBus from './eventBus.js';

const STORAGE_KEY = 'inspecteurbot_pv_data';

class Store {
  constructor() {
    this.state = this._load() || {
      pvs: [],
      brouillons: [],
      parametres: {
        inspecteurs: [],
        signatures: [],
        cachets: [],
        numerotation: { mode: 'auto', dernierNumero: 0 },
        tauxUsdFc: 2800
      },
      journal: []
    };
  }

  _load() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)); }
    catch { return null; }
  }

  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    eventBus.emit('store:saved', this.state);
  }

  get(key) { return this.state[key]; }

  set(key, value) {
    this.state[key] = value;
    this.save();
    eventBus.emit(`store:changed:${key}`, value);
  }

  // ---- PV ----
  addPV(pv) {
    pv.id = pv.id || this._uid();
    pv.dateCreation = new Date().toISOString();
    pv.dateModification = pv.dateCreation;
    pv.versions = [{ ...pv, versionDate: pv.dateCreation }];
    this.state.pvs.push(pv);
    this.logAction('creation', `PV ${pv.numero || pv.id} créé`);
    this.save();
    return pv;
  }

  updatePV(id, data) {
    const idx = this.state.pvs.findIndex(p => p.id === id);
    if (idx === -1) return null;
    const pv = this.state.pvs[idx];
    pv.versions.push({ ...pv, versionDate: new Date().toISOString() });
    Object.assign(pv, data);
    pv.dateModification = new Date().toISOString();
    this.logAction('modification', `PV ${pv.numero || id} modifié`);
    this.save();
    return pv;
  }

  deletePV(id) {
    const pv = this.state.pvs.find(p => p.id === id);
    if (!pv) return false;
    // Archivage sécurisé avant suppression
    (this.state.archives ||= []).push({ ...pv, dateArchivage: new Date().toISOString() });
    this.state.pvs = this.state.pvs.filter(p => p.id !== id);
    this.logAction('suppression', `PV ${pv.numero || id} archivé/supprimé`);
    this.save();
    return true;
  }

  getPV(id) { return this.state.pvs.find(p => p.id === id); }

  // ---- Journal (sécurité) ----
  logAction(type, description) {
    this.state.journal.push({
      type, description,
      date: new Date().toISOString(),
      utilisateur: this.state.utilisateurCourant || 'système'
    });
    if (this.state.journal.length > 5000) this.state.journal.shift();
  }

  _uid() {
    return 'pv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }
}
export default new Store();
