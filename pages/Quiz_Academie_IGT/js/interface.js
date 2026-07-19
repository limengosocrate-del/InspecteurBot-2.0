/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Interface: UI Coordinator, Splash Screen, Animations & TopBar Modals
   ========================================================================== */

class InterfaceManager {
  constructor() {
    this.questionBank = [];
    this.activeView = 'view-dashboard';
    this.lastQuestionId = null;
  }

  async init() {
    // 26.2 Splash Screen Initialization
    this.runSplashScreen();

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
  }

  runSplashScreen() {
    const splash = document.getElementById('splash-screen');
    if (!splash) return;

    setTimeout(() => {
      splash.classList.add('fade-out');
      setTimeout(() => {
        splash.style.display = 'none';
        this.animateDashboardOpening();
      }, 500);
    }, 1200);
  }

  setupEventListeners() {
    // Navigation routing
    document.querySelectorAll('[data-target-view]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-target-view');
        this.switchView(targetView);
      });
    });

    // Top bar menu toggle
    const btnToggleSidebar = document.getElementById('btn-toggle-sidebar');
    if (btnToggleSidebar) {
      btnToggleSidebar.addEventListener('click', () => {
        document.body.classList.toggle('collapsed-sidebar');
      });
    }

    // Theme toggle button
    const btnThemeToggle = document.getElementById('btn-theme-toggle');
    if (btnThemeToggle) {
      btnThemeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
        
        const profile = window.persistenceEngine.getProfile();
        profile.settings.theme = nextTheme;
        window.persistenceEngine.saveProfile(profile);
      });
    }
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
      this.animateDashboardOpening();
    }
  }

  animateDashboardOpening() {
    // Animate Progress Bar & Count-up numbers (0% -> target%)
    const profile = window.persistenceEngine.getProfile();
    const currentLvlInfo = window.niveauEngine.getLevelInfo(profile.niveauActuel);
    const questionsMap = profile.questions || {};
    const records = Object.values(questionsMap);
    
    const levelQuestions = records.filter(q => q.niveau === profile.niveauActuel);
    const levelMastered = levelQuestions.filter(q => q.maitrise >= 70).length;
    const targetPct = currentLvlInfo.formationReq > 0 ? Math.min(100, Math.round((levelMastered / currentLvlInfo.formationReq) * 100)) : 0;

    const fillBar = document.getElementById('dash-main-bar-fill');
    if (fillBar) {
      fillBar.style.width = '0%';
      setTimeout(() => {
        fillBar.style.width = `${targetPct}%`;
      }, 100);
    }

    const pctText = document.getElementById('dash-main-bar-pct');
    if (pctText) {
      let count = 0;
      const step = Math.max(1, Math.floor(targetPct / 20));
      const interval = setInterval(() => {
        count += step;
        if (count >= targetPct) {
          count = targetPct;
          clearInterval(interval);
        }
        pctText.textContent = `${count} %`;
      }, 25);
    }
  }

  updateDashboardUI() {
    const profile = window.persistenceEngine.getProfile();
    const currentLvlInfo = window.niveauEngine.getLevelInfo(profile.niveauActuel);

    // 26.5 Greeting according to Grade
    let titlePrefix = "Agent";
    if (profile.grade.includes("Contrôleur")) titlePrefix = "Contrôleur";
    else if (profile.grade.includes("Inspecteur Général Adjoint")) titlePrefix = "Inspecteur Général Adjoint";
    else if (profile.grade.includes("Inspecteur Général")) titlePrefix = "Inspecteur Général du Travail";
    else if (profile.grade.includes("Inspecteur")) titlePrefix = "Inspecteur";
    else if (profile.grade.includes("Directeur")) titlePrefix = "Directeur";

    const greetingEl = document.getElementById('user-greeting-heading');
    if (greetingEl) {
      greetingEl.textContent = `Bonjour, ${titlePrefix} 👋`;
    }

    const levelBadgePill = document.getElementById('user-grade-pill');
    if (levelBadgePill) {
      levelBadgePill.textContent = `Niveau 0${profile.niveauActuel} — ${profile.grade}`;
    }

    // 26.6 Main Progress Card
    const questionsMap = profile.questions || {};
    const records = Object.values(questionsMap);
    const masteredCount = records.filter(q => q.maitrise >= 70).length;
    const stats = profile.statistiques || { vues: 0, bonnes: 0, mauvaises: 0, tempsTotal: 0 };
    const successRate = stats.vues > 0 ? Math.round((stats.bonnes / stats.vues) * 100) : 0;

    const elMasteredText = document.getElementById('dash-main-mastered-count');
    if (elMasteredText) elMasteredText.textContent = `${masteredCount} compétences maîtrisées`;

    const elSuccessRateText = document.getElementById('dash-main-success-rate');
    if (elSuccessRateText) elSuccessRateText.textContent = `${successRate} % de réussite`;

    // 26.8 Activity Summary Grid
    const elActMaitrise = document.getElementById('act-val-maitrise');
    const elActReussite = document.getElementById('act-val-reussite');
    const elActTemps = document.getElementById('act-val-temps');
    const elActSerie = document.getElementById('act-val-serie');

    if (elActMaitrise) elActMaitrise.textContent = masteredCount.toString();
    if (elActReussite) elActReussite.textContent = `${successRate} %`;
    if (elActTemps) elActTemps.textContent = `${Math.round((stats.tempsTotal || 0) / 3600)} h`;
    if (elActSerie) elActSerie.textContent = `${records.length > 0 ? records[0].serie || 1 : 0} jours`;

    // 26.9 Points Faibles Breakdown
    const weakPointsBox = document.getElementById('weak-points-breakdown-list');
    if (weakPointsBox) {
      const categoriesList = [
        { name: "Procès-verbaux & Mises en demeure", color: "🔴", pct: 42 },
        { name: "Temps de travail & Heures sup", color: "🟠", pct: 58 },
        { name: "Main d'œuvre étrangère (Arrêté 86/001)", color: "🟡", pct: 64 }
      ];

      weakPointsBox.innerHTML = categoriesList.map(item => `
        <div style="margin-bottom:0.85rem;">
          <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:700; margin-bottom:0.25rem;">
            <span>${item.color} ${item.name}</span>
            <span>${item.pct} %</span>
          </div>
          <div class="progress-container" style="height:6px; margin:0;">
            <div class="progress-fill" style="width:${item.pct}%; background:${item.pct < 50 ? 'var(--accent-red)' : 'var(--accent-gold)'};"></div>
          </div>
        </div>
      `).join('');
    }

    // 26.10 Level Roadmap Timeline
    const pathwayContainer = document.getElementById('level-pathway-timeline');
    if (pathwayContainer) {
      pathwayContainer.innerHTML = window.niveauEngine.levels.map(lvl => {
        const isPassed = lvl.niveau < profile.niveauActuel;
        const isCurrent = lvl.niveau === profile.niveauActuel;

        return `
          <div style="display:flex; align-items:center; gap:0.85rem; padding:0.4rem 0;">
            <span style="font-weight:900; font-size:1.1rem; width:24px; text-align:center; color:${isPassed ? 'var(--accent-green)' : (isCurrent ? 'var(--accent-gold)' : 'var(--text-dim)')};">
              ${isPassed ? '✓' : (isCurrent ? '●' : '🔒')}
            </span>
            <span style="font-weight:${isCurrent ? '800' : '600'}; color:${isCurrent ? 'var(--text-main)' : 'var(--text-muted)'}; font-size:0.92rem;">
              Niveau ${lvl.niveau} — ${lvl.grade}
            </span>
          </div>
        `;
      }).join('');
    }

    // 26.11 Level Cards Grid
    const levelCardsContainer = document.getElementById('level-cards-container');
    if (levelCardsContainer) {
      levelCardsContainer.innerHTML = window.niveauEngine.levels.map(lvl => {
        const isUnlocked = lvl.niveau <= profile.niveauActuel;
        const isCurrent = lvl.niveau === profile.niveauActuel;

        return `
          <div class="glass-card" style="${isCurrent ? 'border-color:var(--accent-gold); background:rgba(251,191,36,0.08);' : ''}">
            <div class="card-title">
              <span>NIVEAU 0${lvl.niveau}</span>
              <span>${isUnlocked ? (isCurrent ? '⭐ ACTIF' : '✓ ACCOMPLI') : '🔒 VERROUILLÉ'}</span>
            </div>
            <h4 style="font-size:1rem; font-weight:800; color:var(--text-main); margin-bottom:0.4rem;">${lvl.grade}</h4>
            <p style="font-size:0.82rem; color:var(--text-muted); margin-bottom:0.75rem;">${lvl.title}</p>
            <div style="font-size:0.8rem; color:var(--text-dim); margin-bottom:1rem;">
              📚 ${lvl.formationReq} questions • 🎓 Examen : ${lvl.examReq} q.
            </div>
            ${isUnlocked ? 
              `<button class="btn-gold" style="width:100%; font-size:0.85rem;" onclick="window.interfaceEngine.startLevelPractice(${lvl.niveau})">S'entraîner au Niveau ${lvl.niveau} →</button>` : 
              `<button class="btn-glass" style="width:100%; font-size:0.85rem;" disabled>Requis : Examen Niv. ${lvl.niveau - 1} (≥80%)</button>`
            }
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
            <div style="font-size:3.5rem; margin-bottom:1rem;">💔</div>
            <h2>Toutes vos vies virtuelles sont épuisées !</h2>
            <p style="color:var(--text-muted); margin:1rem 0;">Rechargez vos 5 vies virtuelles pour poursuivre votre apprentissage.</p>
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
        container.innerHTML = `<div class="glass-card">Toutes les questions de ce niveau sont complétées ! Vous êtes prêt pour l'examen officiel.</div>`;
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
          <span class="badge-level-pill">${m.secteur}</span>
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
      <h2 style="margin-bottom:1rem;">🏅 Badges Professionnels IGT</h2>
      <div class="dashboard-grid">
        ${window.certificationEngine.badges.map(b => {
          const isEarned = profile.niveauActuel >= b.minLevel;
          return `
            <div class="glass-card" style="text-align:center; opacity:${isEarned ? '1' : '0.45'};">
              <div style="font-size:3rem; margin-bottom:0.5rem;">${b.icon}</div>
              <h3 style="font-size:1rem; font-weight:800;">${b.title}</h3>
              <p style="font-size:0.8rem; color:var(--text-muted); margin:0.4rem 0;">${b.desc}</p>
              <span class="badge-level-pill">${isEarned ? 'Obtenu' : 'Verrouillé'}</span>
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
        <h3>Questions Répondues</h3>
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

  toggleNotificationModal() {
    const modal = document.getElementById('notification-modal');
    if (modal) {
      modal.classList.toggle('show');
    }
  }

  toggleProfileModal() {
    const modal = document.getElementById('profile-modal');
    if (modal) {
      modal.classList.toggle('show');
    }
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
