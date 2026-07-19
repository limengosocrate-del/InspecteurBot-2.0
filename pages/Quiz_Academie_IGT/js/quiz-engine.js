/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Quiz Engine: Core Question & Validation Engine
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
    this.currentQuestion = question;
    this.onFinishCallback = onFinishCallback;
    this.selectedOptionIds = [];
    this.isAnswered = false;

    // Shuffle options to ensure position independence!
    this.shuffledChoix = [...question.choix].sort(() => Math.random() - 0.5);

    this.renderQuestionUI(containerEl);
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
    const isMultiple = q.type === 'MULTIPLE' || q.bonne.length > 1;

    containerEl.innerHTML = `
      <div class="quiz-shell">
        <div class="quiz-header">
          <div>
            <span class="quiz-meta-tag">${q.type} • ${q.difficulte}</span>
            <span class="quiz-meta-tag" style="margin-left:8px; border-color:var(--accent-gold); color:var(--accent-gold);">${q.categorie}</span>
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
            <div class="option-card" data-choice-id="${choix.id}" onclick="window.quizEngine.toggleOption('${choix.id}', ${isMultiple})">
              <div class="option-key">${String.fromCharCode(65 + idx)}</div>
              <div class="option-text">${choix.texte}</div>
            </div>
          `).join('')}
        </div>

        <div class="explanation-box" id="explanation-box">
          <div class="explanation-title" id="expl-verdict-title"></div>
          <div id="expl-text-content"></div>
          <div class="legal-source-ref">
            🏛️ <strong>Source Légale :</strong> ${q.source_document || q.reference} (${q.article || 'Article non spécifié'})
          </div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.5rem;">
          <button class="btn-glass" onclick="window.quizEngine.speakQuestion()">🔊 Écouter</button>
          <button class="btn-gold" id="btn-submit-answer" onclick="window.quizEngine.validateSelection()">
            Valider la réponse ➔
          </button>
        </div>
      </div>
    `;
  }

  toggleOption(choiceId, isMultiple) {
    if (this.isAnswered) return;

    if (isMultiple) {
      if (this.selectedOptionIds.includes(choiceId)) {
        this.selectedOptionIds = this.selectedOptionIds.filter(id => id !== choiceId);
      } else {
        this.selectedOptionIds.push(choiceId);
      }
    } else {
      this.selectedOptionIds = [choiceId];
    }

    // Update visual selection
    document.querySelectorAll('.option-card').forEach(card => {
      const cid = card.getAttribute('data-choice-id');
      if (this.selectedOptionIds.includes(cid)) {
        card.classList.add('selected');
      } else {
        card.classList.remove('selected');
      }
    });
  }

  validateSelection() {
    if (this.isAnswered) {
      if (this.onFinishCallback) this.onFinishCallback();
      return;
    }
    if (this.selectedOptionIds.length === 0) {
      if (window.interfaceEngine) window.interfaceEngine.showToast("Veuillez sélectionner au moins une réponse.", "info");
      return;
    }
    this.submitAnswer(this.selectedOptionIds, false);
  }

  submitAnswer(selectedIds, isTimeout = false) {
    clearInterval(this.timerInterval);
    this.isAnswered = true;

    const q = this.currentQuestion;
    const correctIds = q.bonne; // Array of correct IDs e.g. ["A"] or ["B", "C"]

    // Check match regardless of order or index
    const isCorrect = !isTimeout &&
      selectedIds.length === correctIds.length &&
      selectedIds.every(id => correctIds.includes(id));

    // Update UI option cards with correct / incorrect badges
    document.querySelectorAll('.option-card').forEach(card => {
      const cid = card.getAttribute('data-choice-id');
      if (correctIds.includes(cid)) {
        card.classList.add('correct');
      } else if (selectedIds.includes(cid)) {
        card.classList.add('incorrect');
      }
    });

    // Process profile rewards & mastery updates
    const profile = window.persistenceEngine.getProfile();
    const result = window.rewardEngine.awardAnswer(profile, q, isCorrect);
    window.revisionEngine.updateMastery(profile, q.id, isCorrect, q.niveau);
    window.persistenceEngine.saveProfile(profile);

    // Show Explanation box
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
      explText.innerHTML = q.explication;
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
      const textToSpeak = `${this.currentQuestion.question}. ${this.currentQuestion.explication}`;
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  }
}

window.quizEngine = new QuizEngine();
