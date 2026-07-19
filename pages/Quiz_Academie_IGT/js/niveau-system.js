/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Niveau System: 7 Official Levels, Grades & Lock Rules
   ========================================================================== */

const OFFICIAL_LEVELS = [
  { niveau: 1, grade: "Débutant", formationReq: 100, examReq: 40, total: 140, title: "Initiation au Droit du Travail" },
  { niveau: 2, grade: "Administratif", formationReq: 150, examReq: 60, total: 210, title: "Gestion Administrative & Dossiers" },
  { niveau: 3, grade: "Contrôleur du Travail", formationReq: 200, examReq: 80, total: 280, title: "Visites de Contrôle & Fiches IGT" },
  { niveau: 4, grade: "Inspecteur du Travail", formationReq: 250, examReq: 100, total: 350, title: "Enquêtes, PV & Infractions Legal" },
  { niveau: 5, grade: "Directeur", formationReq: 250, examReq: 120, total: 370, title: "Direction Régionale & Stratégie" },
  { niveau: 6, grade: "Inspecteur Général Adjoint", formationReq: 250, examReq: 130, total: 380, title: "Haute Supervision & Audit National" },
  { niveau: 7, grade: "Inspecteur Général du Travail", formationReq: 300, examReq: 170, total: 470, title: "Direction Générale & Commandement IGT" }
];

class NiveauSystem {
  constructor() {
    this.levels = OFFICIAL_LEVELS;
  }

  getLevelInfo(levelNum) {
    return this.levels.find(l => l.niveau === levelNum) || this.levels[0];
  }

  canUnlockLevel(profile, targetLevel) {
    if (targetLevel <= 1) return true;
    if (targetLevel > profile.niveauActuel + 1) return false;

    // Check if previous level exam was passed with >= 80% and mastery >= 70%
    const prevExam = profile.examens.find(e => e.niveau === (targetLevel - 1) && e.reussi);
    if (!prevExam) return false;

    const prevLevelInfo = this.getLevelInfo(targetLevel - 1);
    const levelQuestions = Object.values(profile.questions || {}).filter(q => q.niveau === (targetLevel - 1));
    const masteredCount = levelQuestions.filter(q => q.maitrise >= 70).length;
    
    const masteryRate = prevLevelInfo.formationReq > 0 ? (masteredCount / prevLevelInfo.formationReq) * 100 : 0;
    
    return prevExam.score >= 80 && masteryRate >= 70;
  }

  unlockNextLevel(profile) {
    const nextLevelNum = profile.niveauActuel + 1;
    if (nextLevelNum <= 7 && this.canUnlockLevel(profile, nextLevelNum)) {
      profile.niveauActuel = nextLevelNum;
      profile.grade = this.getLevelInfo(nextLevelNum).grade;
      window.persistenceEngine.saveProfile(profile);
      return true;
    }
    return false;
  }
}

window.niveauEngine = new NiveauSystem();
