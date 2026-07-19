/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Examination Engine: Official Grade Pass Examinations
   ========================================================================== */

class ExaminationEngine {
  constructor() {
    this.currentExamSession = null;
  }

  startExam(questionBank, profile, targetLevel = 1) {
    const levelInfo = window.niveauEngine.getLevelInfo(targetLevel);
    const examPool = questionBank.filter(q => q.niveau === targetLevel && q.source === 'EXAMEN');

    if (!examPool || examPool.length === 0) {
      console.error("No exam questions found for level", targetLevel);
      return null;
    }

    // Shuffle and pick target count
    const targetCount = Math.min(levelInfo.examReq, examPool.length);
    const selectedQuestions = [...examPool].sort(() => Math.random() - 0.5).slice(0, targetCount);

    this.currentExamSession = {
      niveau: targetLevel,
      grade: levelInfo.grade,
      questions: selectedQuestions,
      currentIndex: 0,
      bonnes: 0,
      mauvaises: 0,
      startTime: new Date(),
      answers: []
    };

    return this.currentExamSession;
  }

  recordExamAnswer(choiceIds) {
    if (!this.currentExamSession) return null;

    const session = this.currentExamSession;
    const q = session.questions[session.currentIndex];
    
    const isCorrect = choiceIds.length === q.bonne.length && choiceIds.every(id => q.bonne.includes(id));

    if (isCorrect) {
      session.bonnes++;
    } else {
      session.mauvaises++;
    }

    session.answers.push({
      qid: q.id,
      choiceIds,
      isCorrect
    });

    session.currentIndex++;

    if (session.currentIndex >= session.questions.length) {
      return this.finalizeExam();
    }

    return { sessionOver: false, nextQuestion: session.questions[session.currentIndex] };
  }

  finalizeExam() {
    const session = this.currentExamSession;
    const total = session.questions.length;
    const scorePct = Math.round((session.bonnes / total) * 100);
    const isPassed = scorePct >= 80;

    const endTime = new Date();
    const durationSec = Math.round((endTime - session.startTime) / 1000);

    const examResult = {
      score: scorePct,
      reussi: isPassed,
      questions: total,
      bonnes: session.bonnes,
      mauvaises: session.mauvaises,
      temps: durationSec,
      date: new Date().toISOString().split('T')[0],
      niveau: session.niveau,
      grade: session.grade
    };

    const profile = window.persistenceEngine.getProfile();
    if (!profile.examens) profile.examens = [];
    profile.examens.unshift(examResult);

    // If passed, check unlocking next level!
    if (isPassed) {
      window.niveauEngine.unlockNextLevel(profile);
    }

    window.persistenceEngine.saveProfile(profile);
    this.currentExamSession = null;

    return { sessionOver: true, result: examResult };
  }
}

window.examinationEngine = new ExaminationEngine();
