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

  updateMastery(profile, questionId, isCorrect, levelNum = 1, categoryName = '') {
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

    if (categoryName) record.categorie = categoryName;
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
    const pool = (questionBank || []).filter(q => Number(q.niveau) === Number(targetLevel) && q.source === 'FORMATION');
    if (!pool.length) return null;

    if (!profile.questions) profile.questions = {};
    if (!profile.questionCycles) profile.questionCycles = {};
    let cycle = profile.questionCycles[targetLevel] || { cycle: 1, seenIds: [], initialized: false };
    const seen = new Set((cycle.seenIds || []).map(String));

    // Migration des anciennes progressions : les questions déjà traitées sont considérées comme vues.
    if (!cycle.initialized) {
      pool.forEach(q => {
        const record = profile.questions[String(q.id)];
        if (record && Number(record.vues) > 0) seen.add(String(q.id));
      });
      cycle.initialized = true;
    }

    let remaining = pool.filter(q => !seen.has(String(q.id)));
    if (!remaining.length) {
      // Un cycle complet est terminé : nouveau tirage sans répétition immédiate.
      cycle = { cycle: Number(cycle.cycle || 1) + 1, seenIds: [], initialized: true };
      remaining = pool.slice();
    }

    let candidates = remaining.filter(q => String(q.id) !== String(lastQuestionId));
    if (!candidates.length) candidates = remaining;

    const status = q => this.getQuestionStatus(profile.questions[String(q.id)]);
    const newOrWeak = candidates.filter(q => status(q) === 'NOUVELLE' || status(q) === 'EN APPRENTISSAGE');
    const learning = candidates.filter(q => status(q) === 'RÉUSSIE');
    const mastered = candidates.filter(q => status(q) === 'MAÎTRISÉE');
    const selectedPool = newOrWeak.length ? newOrWeak : (learning.length ? learning : (mastered.length ? mastered : candidates));

    // Mélange Fisher–Yates : chaque question n'est proposée qu'une fois par cycle de niveau.
    const shuffled = selectedPool.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    const selected = shuffled[0];
    if (!selected) return null;

    cycle.seenIds = Array.from(new Set([...(cycle.seenIds || []).map(String), String(selected.id)]));
    profile.questionCycles[targetLevel] = cycle;
    if (window.persistenceEngine && window.persistenceEngine.storageReady) window.persistenceEngine.saveProfile(profile);
    return selected;
  }
}

window.revisionEngine = new RevisionEngine();
