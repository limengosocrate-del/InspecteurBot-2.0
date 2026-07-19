/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Quiz Engine: Core Question & Validation Engine (Fixed & Optimized)
   ========================================================================== */

class QuizEngine {
  constructor() {
    this.currentQuestion = null;
    this.shuffledChoix = [];
    this.timerInterval = null;
    this.timeLeft = 30;
    this.selectedOptionIds = [];
    this.isAnswered = false;
  }

  loadQuestion(question, containerEl, onFinishCallback) {
    if (!question || !containerEl) return;

    this.currentQuestion = question;
    this.onFinishCallback = onFinishCallback;
    this.selectedOptionIds = [];
    this.isAnswered = false;

    // Shuffle options to ensure position independence!
    this.shuffledChoix = [...question.choix].sort(() => Math.random() - 0.5);

    this.renderQuestionUI(containerEl);
    this.setupCardEventListeners(containerEl);
    this.startTimer(question.temps || 30, containerEl.querySelector('#quiz-timer-val'));
  }

  startTimer(seconds, timerDisplayEl) {
    clearInterval(this.timerInterval);
    this.timeLeft = seconds;
    if (timerDisplayEl) timerDisplayEl.textContent = `${this.timeLeft}s`;

    this.timerInterval = setInterval(() => {
      this.timeLeft--;
      if (timerDisplayEl) timerDisplayEl.textContent = `${this.timeLeft}s`;
      if (this.timeLeft <= 0) {
        clearInterval(this.timerInterval);
        if (!this.isAnswered) {
          this.submitAnswer([], true); // Time out
        }
      }
    }, 1000);
  }

  renderQuestionUI(containerEl) {
    const q = this.currentQuestion;
    const isMultiple = q.type === 'MULTIPLE' || (q.bonne && q.bonne.length > 1);

    containerEl.innerHTML = `
      <div class="quiz-shell">
        <div class="quiz-header">
          <div>
            <span class="quiz-meta-tag">${q.type || 'QCM'} • ${q.difficulte || 'Normal'}</span>
            <span class="quiz-meta-tag" style="margin-left:8px; border-color:var(--accent-gold); color:var(--accent-gold);">${q.categorie || 'General'}</span>
          </div>
          <div class="quiz-timer">
            ⏱️ <span id="quiz-timer-val">${q.temps || 30}s</span>
          </div>
        </div>

        <div class="question-title">
          ${q.question}
        </div>

        <div class="options-grid" id="options-grid-list">
          ${this.shuffledChoix.map((choix, idx) => `
            <div class="option-card" data-choice-id="${choix.id}" tabindex="0" role="button" aria-pressed="false">
              <div class="option-key">${String.fromCharCode(65 + idx)}</div>
              <div class="option-text">${choix.texte}</div>
              <div class="option-check-indicator">⚪</div>
            </div>
          `).join('')}
        </div>

        <div class="explanation-box" id="explanation-box">
          <div class="explanation-title" id="expl-verdict-title"></div>
          <div id="expl-text-content"></div>
          <div class="legal-source-ref">
            🏛️ <strong>Source Légale :</strong> ${q.source_document || q.reference || 'Code du Travail RDC'} (${q.article || 'Article non spécifié'})
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem; flex-wrap:wrap; gap:1rem;">
          <button type="button" class="btn-glass" id="btn-audio-speak">🔊 Écouter</button>
          <button type="button" class="btn-gold" id="btn-submit-answer">
            Valider la réponse ➔
          </button>
        </div>
      </div>
    `;
  }

  setupCardEventListeners(containerEl) {
    const gridList = containerEl.querySelector('#options-grid-list');
    const isMultiple = this.currentQuestion.type === 'MULTIPLE' || (this.currentQuestion.bonne && this.currentQuestion.bonne.length > 1);

    if (gridList) {
      gridList.addEventListener('click', (e) => {
        const card = e.target.closest('.option-card');
        if (card) {
          const choiceId = card.getAttribute('data-choice-id');
          this.toggleOption(choiceId, isMultiple);
        }
      });
    }

    const btnSubmit = containerEl.querySelector('#btn-submit-answer');
    if (btnSubmit) {
      btnSubmit.addEventListener('click', () => {
        this.validateSelection();
      });
    }

    const btnAudio = containerEl.querySelector('#btn-audio-speak');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        this.speakQuestion();
      });
    }
  }

  toggleOption(choiceId, isMultiple) {
    if (this.isAnswered || !choiceId) return;

    if (isMultiple) {
      if (this.selectedOptionIds.includes(choiceId)) {
        this.selectedOptionIds = this.selectedOptionIds.filter(id => id !== choiceId);
      } else {
        this.selectedOptionIds.push(choiceId);
      }
    } else {
      this.selectedOptionIds = [choiceId];
    }

    // Update Visual States on all Option Cards
    document.querySelectorAll('.option-card').forEach(card => {
      const cid = card.getAttribute('data-choice-id');
      const indicator = card.querySelector('.option-check-indicator');

      if (this.selectedOptionIds.includes(cid)) {
        card.classList.add('selected');
        card.setAttribute('aria-pressed', 'true');
        if (indicator) indicator.textContent = '🟢';
      } else {
        card.classList.remove('selected');
        card.setAttribute('aria-pressed', 'false');
        if (indicator) indicator.textContent = '⚪';
      }
    });
  }

  validateSelection() {
    if (this.isAnswered) {
      if (typeof this.onFinishCallback === 'function') {
        this.onFinishCallback();
      }
      return;
    }

    if (this.selectedOptionIds.length === 0) {
      if (window.interfaceEngine) {
        window.interfaceEngine.showToast("Veuillez sélectionner au moins une option avant de valider.", "info");
      }
      return;
    }

    this.submitAnswer(this.selectedOptionIds, false);
  }

  submitAnswer(selectedIds, isTimeout = false) {
    clearInterval(this.timerInterval);
    this.isAnswered = true;

    const q = this.currentQuestion;
    const correctIds = q.bonne || [];

    const isCorrect = !isTimeout &&
      selectedIds.length === correctIds.length &&
      selectedIds.every(id => correctIds.includes(id));

    // Update UI Cards Visuals for Answer Correction
    document.querySelectorAll('.option-card').forEach(card => {
      const cid = card.getAttribute('data-choice-id');
      const indicator = card.querySelector('.option-check-indicator');

      if (correctIds.includes(cid)) {
        card.classList.add('correct');
        if (indicator) indicator.textContent = '✅';
      } else if (selectedIds.includes(cid)) {
        card.classList.add('incorrect');
        if (indicator) indicator.textContent = '❌';
      }
    });

    // Update User Profile Data
    const profile = window.persistenceEngine.getProfile();
    const result = window.rewardEngine.awardAnswer(profile, q, isCorrect);
    window.revisionEngine.updateMastery(profile, q.id, isCorrect, q.niveau);
    window.persistenceEngine.saveProfile(profile);

    // Show Explanation
    const explBox = document.getElementById('explanation-box');
    const explTitle = document.getElementById('expl-verdict-title');
    const explText = document.getElementById('expl-text-content');

    if (explBox && explTitle && explText) {
      explBox.classList.add('show');
      if (isCorrect) {
        explTitle.innerHTML = `<span style="color:var(--accent-green)">✅ RÉPONSE CORRECTE !</span> (+${result.xpGained} XP)`;
      } else {
        explTitle.innerHTML = `<span style="color:var(--accent-red)">❌ RÉPONSE INCORRECTE</span> (-${q.perte_vie || 1} Vie)`;
      }
      explText.innerHTML = q.explication || "Explication réglementaire d'ordre public.";
    }

    const btnSubmit = document.getElementById('btn-submit-answer');
    if (btnSubmit) {
      btnSubmit.textContent = "Question Suivante ➔";
    }

    if (window.interfaceEngine) {
      window.interfaceEngine.updateDashboardUI();
    }
  }

  speakQuestion() {
    if ('speechSynthesis' in window && this.currentQuestion) {
      window.speechSynthesis.cancel();
      const textToSpeak = `${this.currentQuestion.question}. ${this.currentQuestion.explication || ''}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  }
}

window.quizEngine = new QuizEngine();
