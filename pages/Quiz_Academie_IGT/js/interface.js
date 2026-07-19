/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Interface: UI Coordinator, Views Router, Toast & Audio
   ========================================================================== */

class InterfaceManager {
  constructor() {
    this.questionBank = [];
    this.activeView = 'view-dashboard';
    this.lastQuestionId = null;
  }

  async init() {
    try {
      const resp = await fetch('data/question_bank.json');
      this.questionBank = await resp.json();
      console.log(`Loaded ${this.questionBank.length} questions into Académie engine.`);
    } catch (err) {
      console.error("Failed to fetch data/question_bank.json:", err);
    }

    this.setupEventListeners();
    this.applyTheme(window.persistenceEngine.getProfile().settings.theme || 'dark');
    this.updateDashboardUI();
    this.switchView('view-dashboard');
  }

  setupEventListeners() {
    document.querySelectorAll('[data-target-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-target-view');
        this.switchView(targetView);
      });
    });
  }

  switchView(viewId) {
    this.activeView = viewId;

    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    const targetPanel = document.getElementById(viewId);
    if (targetPanel) {
      targetPanel.style.display = 'block';
      targetPanel.style.animation = 'fadeIn 250ms ease-out';
    }

    document.querySelectorAll('[data-target-view]').forEach(link => {
      if (link.getAttribute('data-target-view') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (viewId === 'view-formation') {
      this.loadNextFormationQuestion();
    } else if (viewId === 'view-missions') {
      this.renderMissionsList();
    } else if (viewId === 'view-badges') {
      this.renderBadgesOnly();
    } else if (viewId === 'view-certificats') {
      this.renderCertificatesOnly();
    } else if (viewId === 'view-statistiques') {
      this.renderStatistiquesDetail();
    } else if (viewId === 'view-dashboard') {
      this.updateDashboardUI();
    }
  }

  updateDashboardUI() {
    const profile = window.persistenceEngine.getProfile();
    const currentLvlInfo = window.niveauEngine.getLevelInfo(profile.niveauActuel);

    // Header Chips
    const elVies = document.getElementById('chip-vies');
    const elXp = document.getElementById('chip-xp');
    const elSolde = document.getElementById('chip-solde');
    const elSub = document.getElementById('user-grade-subtitle');

    if (elVies) elVies.textContent = `${profile.vies}/${profile.maxVies || 5} ❤️`;
    if (elXp) elXp.textContent = `${profile.xp} XP`;
    if (elSolde) elSolde.textContent = `${profile.solde.CDF.toLocaleString()} CDF`;
    if (elSub) elSub.textContent = `Niveau ${profile.niveauActuel} — Grade : ${profile.grade}`;

    // Quick Stats Overview Cards
    const elGradeVal = document.getElementById('dash-val-grade');
    const elNiveauVal = document.getElementById('dash-val-niveau');
    const elVuesVal = document.getElementById('dash-val-vues');
    const elReussiteVal = document.getElementById('dash-val-reussite');
    const elMaitriseesVal = document.getElementById('dash-val-maitrisees');
    const elMaitrisePct = document.getElementById('dash-val-maitrise-pct');
    const elSerieVal = document.getElementById('dash-val-serie');
    const elTempsVal = document.getElementById('dash-val-temps');

    const stats = profile.statistiques || { vues: 0, bonnes: 0, mauvaises: 0, tempsTotal: 0 };
    const successRate = stats.vues > 0 ? Math.round((stats.bonnes / stats.vues) * 100) : 0;
    const questionsMap = profile.questions || {};
    const records = Object.values(questionsMap);
    const masteredCount = records.filter(q => q.maitrise >= 70).length;

    if (elGradeVal) elGradeVal.textContent = profile.grade;
    if (elNiveauVal) elNiveauVal.textContent = `Niveau ${profile.niveauActuel} sur 7`;
    if (elVuesVal) elVuesVal.textContent = stats.vues.toString();
    if (elReussiteVal) elReussiteVal.textContent = `Taux de réussite : ${successRate}%`;
    if (elMaitriseesVal) elMaitriseesVal.textContent = masteredCount.toString();
    if (elMaitrisePct) elMaitrisePct.textContent = `Maîtrise globale : ${stats.maitriseGlobale || 0}%`;
    if (elSerieVal) elSerieVal.textContent = `${profile.historique ? profile.historique.length : 0} Actions`;
    if (elTempsVal) elTempsVal.textContent = `Temps : ${Math.round((stats.tempsTotal || 0) / 60)} min`;

    // Progress Bar
    const levelQuestions = records.filter(q => q.niveau === profile.niveauActuel);
    const levelMastered = levelQuestions.filter(q => q.maitrise >= 70).length;
    const progressPct = currentLvlInfo.formationReq > 0 ? Math.min(100, Math.round((levelMastered / currentLvlInfo.formationReq) * 100)) : 0;

    const barFill = document.getElementById('dash-bar-fill');
    const barText = document.getElementById('dash-bar-text');
    if (barFill) barFill.style.width = `${progressPct}%`;
    if (barText) barText.textContent = `${levelMastered} / ${currentLvlInfo.formationReq} maîtrises (${progressPct}%)`;

    // Weak points analysis
    const weakList = records.filter(q => q.maitrise < 50 && q.vues > 0);
    const weakBox = document.getElementById('dash-weak-points-list');
    if (weakBox) {
      if (weakList.length > 0) {
        weakBox.innerHTML = `⚠️ ${weakList.length} question(s) nécessitent une révision ciblée. Ex: ${weakList[0].qid}`;
      } else {
        weakBox.textContent = "Aucun point faible majeur. Continuez l'apprentissage !";
      }
    }

    // Level Cards Grid
    const levelCardsContainer = document.getElementById('level-cards-container');
    if (levelCardsContainer) {
      levelCardsContainer.innerHTML = window.niveauEngine.levels.map(lvl => {
        const isUnlocked = lvl.niveau <= profile.niveauActuel;
        const isCurrent = lvl.niveau === profile.niveauActuel;

        return `
          <div class="glass-card" style="${isCurrent ? 'border-color:var(--accent-gold); background:rgba(251,191,36,0.08);' : ''}">
            <div class="card-title">
              <span>Niveau ${lvl.niveau} — ${lvl.grade}</span>
              <span>${isUnlocked ? (isCurrent ? '⭐ Actif' : '✅ Débloqué') : '🔒 Verrouillé'}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:0.75rem;">${lvl.title}</p>
            <div style="font-size:0.8rem; color:var(--text-dim);">
              📚 Formation : ${lvl.formationReq} questions • 🎓 Examen : ${lvl.examReq} questions
            </div>
            <div style="margin-top:1rem;">
              ${isUnlocked ? 
                `<button class="btn-gold" style="width:100%; font-size:0.85rem;" onclick="window.interfaceEngine.startLevelPractice(${lvl.niveau})">S'entraîner au Niveau ${lvl.niveau}</button>` : 
                `<button class="btn-glass" style="width:100%; font-size:0.85rem;" disabled>Requis : Examen Niv. ${lvl.niveau - 1} (≥80%)</button>`
              }
            </div>
          </div>
        `;
      }).join('');
    }
  }

  startLevelPractice(levelNum) {
    const profile = window.persistenceEngine.getProfile();
    profile.niveauActuel = levelNum;
    profile.grade = window.niveauEngine.getLevelInfo(levelNum).grade;
    window.persistenceEngine.saveProfile(profile);

    this.switchView('view-formation');
  }

  loadNextFormationQuestion() {
    const profile = window.persistenceEngine.getProfile();
    const container = document.getElementById('quiz-question-container');

    if (profile.vies <= 0) {
      if (container) {
        container.innerHTML = `
          <div class="glass-card" style="text-align:center; padding:3rem;">
            <div style="font-size:3rem; margin-bottom:1rem;">💔</div>
            <h2>Toutes vos vies sont épuisées !</h2>
            <p style="color:var(--text-muted); margin:1rem 0;">Rechargez vos vies virtuelles pour continuer votre formation professionnelle.</p>
            <button class="btn-gold" onclick="window.rewardEngine.refillLives(window.persistenceEngine.getProfile()); window.interfaceEngine.loadNextFormationQuestion();">
              🔄 Recharger les 5 Vies Virtuelles
            </button>
          </div>
        `;
      }
      return;
    }

    const nextQ = window.revisionEngine.selectNextQuestion(
      this.questionBank,
      profile,
      profile.niveauActuel,
      this.lastQuestionId
    );

    if (!nextQ) {
      if (container) {
        container.innerHTML = `<div class="glass-card">Toutes les questions de ce niveau sont complétées ! Passage à l'examen recommandé.</div>`;
      }
      return;
    }

    this.lastQuestionId = nextQ.id;
    window.quizEngine.loadQuestion(nextQ, container, () => {
      this.loadNextFormationQuestion();
    });
  }

  startOfficialExam() {
    const profile = window.persistenceEngine.getProfile();
    const session = window.examinationEngine.startExam(this.questionBank, profile, profile.niveauActuel);

    if (!session) {
      this.showToast("Impossible de démarrer l'examen.", "error");
      return;
    }

    this.renderExamStep(session.questions[0]);
  }

  renderExamStep(question) {
    const container = document.getElementById('exam-question-container');
    if (!container) return;

    window.quizEngine.loadQuestion(question, container, () => {
      const choiceIds = window.quizEngine.selectedOptionIds;
      const stepResult = window.examinationEngine.recordExamAnswer(choiceIds);

      if (stepResult.sessionOver) {
        this.renderExamResultsUI(stepResult.result);
      } else {
        this.renderExamStep(stepResult.nextQuestion);
      }
    });
  }

  renderExamResultsUI(res) {
    const container = document.getElementById('exam-question-container');
    if (!container) return;

    container.innerHTML = `
      <div class="glass-card" style="text-align:center; padding:3rem;">
        <div style="font-size:3.5rem; margin-bottom:1rem;">${res.reussi ? '🎉' : '❌'}</div>
        <h2 style="font-size:1.8rem; font-weight:900;">${res.reussi ? "EXAMEN RÉUSSI !" : "EXAMEN ÉCHOUÉ"}</h2>
        <div style="font-size:2.5rem; font-weight:900; color:${res.reussi ? 'var(--accent-green)' : 'var(--accent-red)'}; margin:1rem 0;">
          ${res.score}%
        </div>
        <p style="color:var(--text-muted); max-width:500px; margin:0 auto 1.5rem auto;">
          ${res.reussi ? 
            `Félicitations ! Vous avez validé le Grade : ${res.grade}. Votre certificat officiel IGT a été généré.` : 
            `Vous devez obtenir au moins 80% pour valider le grade. Réévisez les chapitres puis réessayez.`
          }
        </p>
        <div style="display:flex; justify-content:center; gap:1rem;">
          <button class="btn-glass" onclick="window.interfaceEngine.switchView('view-dashboard')">Tableau de Bord</button>
          ${res.reussi ? `<button class="btn-gold" onclick="window.interfaceEngine.switchView('view-certificats')">📜 Voir mon Certificat</button>` : `<button class="btn-gold" onclick="window.interfaceEngine.startOfficialExam()">🔄 Réessayer L'Examen</button>`}
        </div>
      </div>
    `;
  }

  renderMissionsList() {
    const container = document.getElementById('missions-list-container');
    if (!container) return;

    const missions = window.missionEngine.getMissions();
    container.innerHTML = missions.map(m => `
      <div class="glass-card" style="margin-bottom:1.5rem;">
        <div class="card-title">
          <span>${m.titre}</span>
          <span class="quiz-meta-tag">${m.secteur}</span>
        </div>
        <p style="color:var(--text-muted); font-size:0.9rem; margin:0.5rem 0;"><strong>Entreprise :</strong> ${m.entreprise} (${m.effectif} travailleurs)</p>
        <p style="font-size:0.88rem; color:var(--text-dim);">${m.motif}</p>
        <div style="margin-top:1rem;">
          <button class="btn-gold" onclick="window.interfaceEngine.runMission('${m.id}')">Lancer la Simulation d'Inspection ➔</button>
        </div>
      </div>
    `).join('');
  }

  runMission(missionId) {
    const m = window.missionEngine.getMissionById(missionId);
    const container = document.getElementById('missions-list-container');
    if (!container || !m) return;

    let currentStep = 0;

    const renderStep = () => {
      const step = m.etapes[currentStep];
      container.innerHTML = `
        <div class="glass-card">
          <h3 style="color:var(--accent-gold); margin-bottom:0.5rem;">${m.titre} — Étape ${currentStep + 1} / ${m.etapes.length}</h3>
          <p style="font-weight:700; font-size:1.1rem; margin:1rem 0;">${step.question}</p>
          <div class="options-grid">
            ${step.choix.map(c => `
              <div class="option-card" onclick="window.interfaceEngine.submitMissionChoice('${m.id}', ${currentStep}, '${c.id}')">
                <div class="option-key">${c.id}</div>
                <div>${c.texte}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    };

    renderStep();
  }

  submitMissionChoice(missionId, stepIdx, choiceId) {
    const isCorrect = window.missionEngine.evaluateStep(missionId, stepIdx, choiceId);
    const m = window.missionEngine.getMissionById(missionId);
    const container = document.getElementById('missions-list-container');

    if (isCorrect) {
      if (stepIdx + 1 < m.etapes.length) {
        this.showToast("Étape validée ! Passage à la suite.", "success");
        const nextStep = stepIdx + 1;
        const step = m.etapes[nextStep];
        container.innerHTML = `
          <div class="glass-card">
            <h3 style="color:var(--accent-gold); margin-bottom:0.5rem;">${m.titre} — Étape ${nextStep + 1} / ${m.etapes.length}</h3>
            <p style="font-weight:700; font-size:1.1rem; margin:1rem 0;">${step.question}</p>
            <div class="options-grid">
              ${step.choix.map(c => `
                <div class="option-card" onclick="window.interfaceEngine.submitMissionChoice('${m.id}', ${nextStep}, '${c.id}')">
                  <div class="option-key">${c.id}</div>
                  <div>${c.texte}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      } else {
        this.showToast("Mission d'inspection accomplie avec succès !", "success");
        const profile = window.persistenceEngine.getProfile();
        profile.xp += 200;
        profile.solde.CDF += 50000;
        window.persistenceEngine.saveProfile(profile);

        container.innerHTML = `
          <div class="glass-card" style="text-align:center; padding:2rem;">
            <h2>🎉 MISSION D'INSPECTION VALIDÉE !</h2>
            <p style="color:var(--text-muted); margin:1rem 0;">+200 XP, +50 000 CDF Virtuels attribués.</p>
            <button class="btn-gold" onclick="window.interfaceEngine.renderMissionsList()">Retour aux Missions</button>
          </div>
        `;
      }
    } else {
      this.showToast("Décision non conforme aux règles juridiques de l'IGT.", "error");
    }
  }

  renderBadgesOnly() {
    const profile = window.persistenceEngine.getProfile();
    window.certificationEngine.checkEarnedBadges(profile);
    const container = document.getElementById('badges-container');
    if (!container) return;

    container.innerHTML = `
      <h2 style="margin-bottom:1rem;">🏆 Badges Professionnels IGT</h2>
      <div class="dashboard-grid">
        ${window.certificationEngine.badges.map(b => {
          const isEarned = profile.niveauActuel >= b.minLevel;
          return `
            <div class="glass-card" style="text-align:center; opacity:${isEarned ? '1' : '0.45'};">
              <div style="font-size:3rem; margin-bottom:0.5rem;">${b.icon}</div>
              <h3 style="font-size:1rem; font-weight:800;">${b.title}</h3>
              <p style="font-size:0.8rem; color:var(--text-muted); margin:0.4rem 0;">${b.desc}</p>
              <span class="quiz-meta-tag">${isEarned ? 'Obtenu' : 'Verrouillé'}</span>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  renderCertificatesOnly() {
    const profile = window.persistenceEngine.getProfile();
    const container = document.getElementById('certificates-container');
    if (!container) return;

    container.innerHTML = `
      <h2 style="margin-bottom:1rem;">📜 Certificat Officiel IGT</h2>
      ${window.certificationEngine.generateCertificateHTML(
        "Inspecteur / Agent IGT",
        profile.niveauActuel,
        profile.grade,
        profile.statistiques.maitriseGlobale || 85
      )}
    `;
  }

  renderStatistiquesDetail() {
    const profile = window.persistenceEngine.getProfile();
    const container = document.getElementById('stats-detail-grid');
    if (!container) return;

    const stats = profile.statistiques || { vues: 0, bonnes: 0, mauvaises: 0, maitriseGlobale: 0 };

    container.innerHTML = `
      <div class="glass-card">
        <h3>Questions Repondues</h3>
        <div class="card-value">${stats.vues}</div>
      </div>
      <div class="glass-card">
        <h3>Bonnes Réponses</h3>
        <div class="card-value" style="color:var(--accent-green);">${stats.bonnes}</div>
      </div>
      <div class="glass-card">
        <h3>Erreurs Commises</h3>
        <div class="card-value" style="color:var(--accent-red);">${stats.mauvaises}</div>
      </div>
      <div class="glass-card">
        <h3>Taux de Maîtrise Globale</h3>
        <div class="card-value" style="color:var(--accent-cyan);">${stats.maitriseGlobale}%</div>
      </div>
    `;
  }

  applyTheme(themeName) {
    if (themeName === 'light') {
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
    }
  }

  showToast(msg, type = "info") {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div>${type === 'success' ? '✅' : (type === 'error' ? '❌' : 'ℹ️')}</div>
      <div>${msg}</div>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
}

window.interfaceEngine = new InterfaceManager();

document.addEventListener('DOMContentLoaded', () => {
  window.interfaceEngine.init();
});
