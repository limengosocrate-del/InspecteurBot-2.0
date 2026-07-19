/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Revision Engine: Smart Spaced Repetition & Mastery System
   ========================================================================== */

class RevisionEngine {
  constructor() {}

  getQuestionStatus(record) {
    if (!record || record.vues === 0) return 'NOUVELLE';
    if (record.maitrise < 50) return 'EN APPRENTISSAGE';
    if (record.maitrise < 80) return 'RÉUSSIE';
    return 'MAÎTRISÉE';
  }

  updateMastery(profile, questionId, isCorrect, levelNum = 1) {
    if (!profile.questions) profile.questions = {};
    
    let record = profile.questions[questionId] || {
      qid: questionId,
      niveau: levelNum,
      vues: 0,
      bonnes: 0,
      mauvaises: 0,
      serie: 0,
      maitrise: 0,
      derniereVue: null,
      prochaineRevision: null
    };

    record.vues += 1;
    record.derniereVue = new Date().toISOString();

    if (isCorrect) {
      record.bonnes += 1;
      record.serie += 1;
      record.maitrise = Math.min(100, record.maitrise + 25 + (record.serie * 5));
    } else {
      record.mauvaises += 1;
      record.serie = 0;
      record.maitrise = Math.max(0, record.maitrise - 20);
    }

    // Schedule next revision (Spaced repetition)
    const delayHours = isCorrect ? Math.pow(2, record.serie) * 12 : 1;
    const nextDate = new Date();
    nextDate.setHours(nextDate.getHours() + delayHours);
    record.prochaineRevision = nextDate.toISOString();

    profile.questions[questionId] = record;
    this.recalculateGlobalStats(profile);
  }

  recalculateGlobalStats(profile) {
    const qMap = profile.questions || {};
    const records = Object.values(qMap);
    
    let totalVues = 0;
    let totalBonnes = 0;
    let totalMauvaises = 0;
    let sumMaitrise = 0;

    records.forEach(r => {
      totalVues += r.vues;
      totalBonnes += r.bonnes;
      totalMauvaises += r.mauvaises;
      sumMaitrise += r.maitrise;
    });

    profile.statistiques = {
      vues: totalVues,
      bonnes: totalBonnes,
      mauvaises: totalMauvaises,
      tempsTotal: profile.statistiques ? profile.statistiques.tempsTotal || 0 : 0,
      maitriseGlobale: records.length > 0 ? Math.round(sumMaitrise / records.length) : 0
    };
  }

  selectNextQuestion(questionBank, profile, targetLevel = 1, lastQuestionId = null) {
    const pool = questionBank.filter(q => q.niveau === targetLevel && q.source === 'FORMATION');
    if (!pool || pool.length === 0) return null;

    const qMap = profile.questions || {};

    // Partition pool into priority buckets
    const priorityMax = [];
    const priorityMed = [];
    const priorityLow = [];

    pool.forEach(q => {
      if (q.id === lastQuestionId && pool.length > 1) return; // Avoid immediate repeat

      const rec = qMap[q.id];
      const status = this.getQuestionStatus(rec);

      if (status === 'NOUVELLE' || status === 'EN APPRENTISSAGE') {
        priorityMax.push(q);
      } else if (status === 'RÉUSSIE') {
        priorityMed.push(q);
      } else {
        priorityLow.push(q);
      }
    });

    let selectedList = priorityMax;
    if (selectedList.length === 0) selectedList = priorityMed;
    if (selectedList.length === 0) selectedList = priorityLow;
    if (selectedList.length === 0) selectedList = pool;

    const randomIndex = Math.floor(Math.random() * selectedList.length);
    return selectedList[randomIndex];
  }
}

window.revisionEngine = new RevisionEngine();
