/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Persistence: Storage Management (LocalStorage & State Recovery)
   ========================================================================== */

const STORAGE_KEY = 'InspecteurBot_Academie_IGT_User_Profile_v4';

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
    theme: 'dark', // 'dark', 'light', 'auto'
    reducedMotion: false,
    soundEffects: true
  }
};

class PersistenceManager {
  constructor() {
    this.profile = this.loadProfile();
  }

  loadProfile() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_PROFILE,
          ...parsed,
          userInfo: { ...DEFAULT_PROFILE.userInfo, ...(parsed.userInfo || {}) }
        };
      }
    } catch (err) {
      console.error("Error loading user profile from storage:", err);
    }
    return { ...DEFAULT_PROFILE };
  }

  saveProfile(profileData = null) {
    if (profileData) {
      this.profile = profileData;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.profile));
      return true;
    } catch (err) {
      console.error("Error saving profile to storage:", err);
      return false;
    }
  }

  getProfile() {
    return this.profile;
  }

  resetProfile() {
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
      if (parsed && typeof parsed.niveauActuel === 'number') {
        this.profile = { ...DEFAULT_PROFILE, ...parsed };
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
