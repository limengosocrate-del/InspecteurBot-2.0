/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Persistence: Storage Management (LocalStorage & State Recovery)
   ========================================================================== */

let STORAGE_KEY = null;
const STORAGE_PREFIX = 'InspecteurBot_Academie_IGT_User_Profile_v4_';

const DEFAULT_PROFILE = {
  niveauActuel: 1,
  grade: "Débutant",
  vies: 5,
  maxVies: 5,
  xp: 0,
  solde: {
    CDF: 0,
    USD: 0
  },
  userInfo: {
    nomComplet: "Inspecteur / Agent IGT",
    matricule: "IGT-2026-RDC",
    direction: "Direction Générale IGT Kinshasa",
    antenne: "Antenne Centrale"
  },
  questions: {}, // qid -> { vues, bonnes, mauvaises, serie, maitrise, derniereVue, prochaineRevision }
  statistiques: {
    vues: 0,
    bonnes: 0,
    mauvaises: 0,
    tempsTotal: 0,
    maitriseGlobale: 0
  },
  badges: [],
  certificats: [],
  examens: [],
  missions: [],
  historique: [],
  settings: {
    theme: 'light', // Thème clair par défaut; le thème sombre reste disponible.
    reducedMotion: false,
    soundEffects: true
  }
};

class PersistenceManager {
  constructor() {
    this.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    this.storageReady = false;
    this.userId = null;
  }

  loadProfile() {
    if (!STORAGE_KEY) return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...JSON.parse(JSON.stringify(DEFAULT_PROFILE)),
          ...parsed,
          solde: { ...DEFAULT_PROFILE.solde, ...(parsed.solde || {}) },
          userInfo: { ...DEFAULT_PROFILE.userInfo, ...(parsed.userInfo || {}) },
          statistiques: { ...DEFAULT_PROFILE.statistiques, ...(parsed.statistiques || {}) },
          settings: { ...DEFAULT_PROFILE.settings, ...(parsed.settings || {}) },
          questions: parsed.questions && typeof parsed.questions === 'object' ? parsed.questions : {},
          badges: Array.isArray(parsed.badges) ? parsed.badges : [],
          certificats: Array.isArray(parsed.certificats) ? parsed.certificats : [],
          examens: Array.isArray(parsed.examens) ? parsed.examens : [],
          missions: Array.isArray(parsed.missions) ? parsed.missions : [],
          historique: Array.isArray(parsed.historique) ? parsed.historique : []
        };
      }
    } catch (err) {
      console.error("Error loading account-specific profile from local storage:", err);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
  }

  async initializeForUser(user) {
    const id = user && user.id;
    if (!id) return false;
    if (this.storageReady && this.userId === id) return true;
    this.storageReady = false;
    this.userId = id;
    STORAGE_KEY = STORAGE_PREFIX + id;
    this.profile = this.loadProfile();

    // À la première ouverture de cette version, chaque compte commence en thème clair.
    // Le choix ultérieur du thème sombre est conservé pour les ouvertures suivantes.
    const themeMigrationKey = 'InspecteurBot_Academie_IGT_light_default_v1_' + id;
    try {
      if (!localStorage.getItem(themeMigrationKey)) {
        this.profile.settings.theme = 'light';
        localStorage.setItem(themeMigrationKey, '1');
      }
    } catch (_) {
      this.profile.settings.theme = 'light';
    }

    this.storageReady = true;
    this.saveProfile();
    window.dispatchEvent(new Event('igt-profile-loaded'));
    return true;
  }

  saveProfile(profileData = null) {
    if (profileData) this.profile = profileData;
    if (!this.storageReady || !STORAGE_KEY || !this.userId) return false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      return true;
    } catch (err) {
      console.error("Error saving account-specific profile to local storage:", err);
      return false;
    }
  }

  getProfile() {
    return this.profile;
  }

  resetProfile() {
    if (!this.storageReady) return this.profile;
    this.profile = JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    this.saveProfile();
    return this.profile;
  }

  exportProfileJSON() {
    return JSON.stringify(this.profile, null, 2);
  }

  importProfileJSON(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed && typeof parsed.niveauActuel === 'number' && this.storageReady) {
        this.profile = {
          ...JSON.parse(JSON.stringify(DEFAULT_PROFILE)),
          ...parsed,
          solde: { ...DEFAULT_PROFILE.solde, ...(parsed.solde || {}) },
          userInfo: { ...DEFAULT_PROFILE.userInfo, ...(parsed.userInfo || {}) },
          statistiques: { ...DEFAULT_PROFILE.statistiques, ...(parsed.statistiques || {}) },
          settings: { ...DEFAULT_PROFILE.settings, ...(parsed.settings || {}) },
          questions: parsed.questions || {}
        };
        this.saveProfile();
        return true;
      }
    } catch (err) {
      console.error("Invalid import JSON:", err);
    }
    return false;
  }
}
window.persistenceEngine = new PersistenceManager();
window.addEventListener('load', async () => {
  const client = window.inspecteurBotAuthClient;
  if (client && client.auth) {
    try {
      const { data } = await client.auth.getSession();
      const id = data && data.session && data.session.user && data.session.user.id;
      if (id) {
        STORAGE_KEY = 'InspecteurBot_Academie_IGT_User_Profile_v4_' + id;
        window.persistenceEngine.profile = window.persistenceEngine.loadProfile();
        window.dispatchEvent(new Event('igt-profile-loaded'));
      }
    } catch (e) { console.warn('Profil Académie local : session indisponible', e); }
  }
});

window.addEventListener('inspecteurbot:authenticated', event => {
  const user = event.detail && event.detail.user;
  if (user) void window.persistenceEngine.initializeForUser(user);
});
window.addEventListener('load', async () => {
  const client = window.inspecteurBotAuthClient;
  if (client && client.auth) {
    try {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      if (data && data.session && data.session.user) {
        await window.persistenceEngine.initializeForUser(data.session.user);
      }
    } catch (error) {
      console.warn('Profil Académie : session non disponible; aucune donnée partagée ne sera chargée.', error);
    }
  }
});
