/* ==========================================================================
   INSPECTEURBOT RDC - ACADÉMIE IGT
   Module Quiz Engine: Instant Auto-Validation & Fluid Transition Engine
   ========================================================================== */

class QuizEngine {
  constructor() {
    this.currentQuestion = null;
    this.shuffledChoix = [];
    this.timerInterval = null;
    this.autoAdvanceTimeout = null;
    this.countdownInterval = null;
    this.timeLeft = 60;
    this.selectedOptionIds = [];
    this.isAnswered = false;
    this.autoAdvanceDelay = 14000; // Réponse et explication visibles pendant 14 secondes
  }

  loadQuestion(question, containerEl, onFinishCallback) {
    if (!question || !containerEl) return;

    // Clear previous timeouts
    clearTimeout(this.autoAdvanceTimeout);
    clearInterval(this.timerInterval);
    clearInterval(this.countdownInterval);

    this.currentQuestion = question;
    this.onFinishCallback = onFinishCallback;
    this.selectedOptionIds = [];
    this.isAnswered = false;

    // 9. Shuffle options dynamically for position-independent learning
    this.shuffledChoix = [...question.choix].sort(() => Math.random() - 0.5);

    this.renderQuestionUI(containerEl);
    this.setupCardEventListeners(containerEl);
    this.startTimer(60, containerEl.querySelector('#quiz-timer-val'));
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
          this.autoSubmitOnTimeout();
        }
      }
    }, 1000);
  }

  renderQuestionUI(containerEl) {
    const q = this.currentQuestion;
    const initialLives = Number(window.persistenceEngine?.getProfile?.().vies ?? 5);

    // 11. Scale / Fade Slide-up visual container transition
    containerEl.innerHTML = `
      <div class="quiz-shell" style="animation: slideUp 300ms cubic-bezier(0.16, 1, 0.3, 1);">
        <div class="quiz-header">
          <div>
            <span class="quiz-meta-tag">${q.type || 'QCM'} • ${q.difficulte || 'Normal'}</span>
            <span class="quiz-meta-tag" style="margin-left:8px; border-color:var(--accent-gold); color:var(--accent-gold);">${q.categorie || 'Code du Travail'}</span>
          </div>
          <div class="quiz-status-right" style="display:flex;align-items:center;justify-content:flex-end;gap:10px;flex-wrap:wrap;">
            <div class="quiz-timer">
              ⏱️ <span id="quiz-timer-val">60s</span>
            </div>
            <div id="quiz-lives-val" style="display:inline-flex;align-items:center;gap:5px;padding:7px 10px;border:1px solid var(--border-glass);border-radius:999px;background:var(--bg-card);color:var(--text-main);font-size:0.82rem;font-weight:800;white-space:nowrap;">
              ❤️ ${initialLives} vie(s) restante(s)
            </div>
          </div>
        </div>

        <div class="question-title">
          ${q.question}
        </div>

        <div class="options-grid" id="options-grid-list">
          ${this.shuffledChoix.map((choix, idx) => `
            <div class="option-card" data-choice-id="${choix.id}" tabindex="0" role="button">
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

        <div id="auto-advance-bar" style="display:none; margin-top:1.25rem; align-items:center; justify-content:space-between; background:rgba(255,255,255,0.04); padding:0.75rem 1rem; border-radius:var(--radius-md); border:1px solid var(--border-glass);">
          <div style="font-size:0.85rem; color:var(--text-muted); font-weight:700;">
            ⏳ Question suivante dans <span id="countdown-seconds" style="color:var(--accent-gold); font-weight:900;">2</span>s...
          </div>
          <button type="button" class="btn-gold" style="padding:0.5rem 1rem; font-size:0.85rem;" onclick="window.quizEngine.skipAutoAdvance()">
            Passer Directement ➔
          </button>
        </div>

        <div style="display:flex; justify-content:flex-start; margin-top:1rem;">
          <button type="button" class="btn-glass" id="btn-audio-speak" style="font-size:0.82rem; padding:0.4rem 0.85rem;">🔊 Écouter la question</button>
        </div>
      </div>
    `;
  }

  // 1. Instant Event Delegation on Card Touch/Click
  setupCardEventListeners(containerEl) {
    const gridList = containerEl.querySelector('#options-grid-list');

    if (gridList) {
      gridList.addEventListener('click', (e) => {
        if (this.isAnswered) return;
        const card = e.target.closest('.option-card');
        if (card) {
          const choiceId = card.getAttribute('data-choice-id');
          this.processInstantChoiceSelection(choiceId);
        }
      });
    }

    const btnAudio = containerEl.querySelector('#btn-audio-speak');
    if (btnAudio) {
      btnAudio.addEventListener('click', () => {
        this.speakQuestion();
      });
    }
  }

  // 1 & 4. Instant Selection & Double Selection Prevention
  processInstantChoiceSelection(choiceId, timedOut = false) {
    if (this.isAnswered || (!choiceId && !timedOut)) return;

    this.isAnswered = true;
    clearInterval(this.timerInterval);

    // 4. Lock options container immediately to prevent double clicks
    const gridList = document.getElementById('options-grid-list');
    if (gridList) {
      gridList.style.pointerEvents = 'none';
    }

    this.selectedOptionIds = choiceId ? [choiceId] : [];
    const q = this.currentQuestion;
    const correctIds = q.bonne || [];
    const isCorrect = correctIds.includes(choiceId);

    // 2. Instant Visual Feedback Rendering
    document.querySelectorAll('.option-card').forEach(card => {
      const cid = card.getAttribute('data-choice-id');
      const indicator = card.querySelector('.option-check-indicator');

      if (choiceId && cid === choiceId) {
        if (isCorrect) {
          card.classList.add('correct');
          if (indicator) indicator.textContent = '✅';
        } else {
          card.classList.add('incorrect');
          if (indicator) indicator.textContent = '❌';
        }
      } else if (correctIds.includes(cid)) {
        // Highlight the true correct answer if user chose incorrectly
        card.classList.add('correct');
        if (indicator) indicator.textContent = '✅';
      }
    });

    // 3. Show Explanation Box
    const explBox = document.getElementById('explanation-box');
    const explTitle = document.getElementById('expl-verdict-title');
    const explText = document.getElementById('expl-text-content');

    if (explBox && explTitle && explText) {
      explBox.classList.add('show');
      if (timedOut) {
        explTitle.innerHTML = `<span style="color:var(--accent-red); font-size:1.05rem;">⏰ TEMPS ÉCOULÉ — BONNE RÉPONSE AFFICHÉE</span>`;
      } else if (isCorrect) {
        explTitle.innerHTML = `<span style="color:var(--accent-green); font-size:1.05rem;">✅ BONNE RÉPONSE !</span> (+${q.recompense ? q.recompense.montant : 5000} CDF)`;
      } else {
        explTitle.innerHTML = `<span style="color:var(--accent-red); font-size:1.05rem;">❌ MAUVAISE RÉPONSE</span> (-${q.perte_vie || 1} Vie)`;
      }
      explText.innerHTML = q.explication || "Explication d'ordre public conforme au Code du Travail de la RDC.";
    }

    // 5. Update State & Auto-Persistence
    const profile = window.persistenceEngine.getProfile();
    const answerResult = window.rewardEngine.awardAnswer(profile, q, isCorrect);
    window.revisionEngine.updateMastery(profile, q.id, isCorrect, q.niveau, q.categorie || q.category || '');
    const livesDisplay = document.getElementById('quiz-lives-val');
    if (livesDisplay) {
      livesDisplay.hidden = false;
      livesDisplay.textContent = '❤️ ' + Number(answerResult.livesLeft ?? profile.vies) + ' vie(s) restante(s)';
    }
    window.persistenceEngine.saveProfile(profile);

    if (window.interfaceEngine) {
      window.interfaceEngine.updateDashboardUI();
    }

    // 6. Start Auto-Advance Timer & Countdown
    this.triggerAutoAdvanceCountdown();
  }

  triggerAutoAdvanceCountdown() {
    const bar = document.getElementById('auto-advance-bar');
    const countEl = document.getElementById('countdown-seconds');
    if (bar) bar.style.display = 'flex';

    let secondsLeft = Math.ceil(this.autoAdvanceDelay / 1000);
    if (countEl) countEl.textContent = secondsLeft;

    clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      secondsLeft--;
      if (countEl) countEl.textContent = secondsLeft;
      if (secondsLeft <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);

    this.autoAdvanceTimeout = setTimeout(() => {
      clearInterval(this.countdownInterval);
      this.skipAutoAdvance();
    }, this.autoAdvanceDelay);
  }

  skipAutoAdvance() {
    clearTimeout(this.autoAdvanceTimeout);
    clearInterval(this.countdownInterval);
    if (typeof this.onFinishCallback === 'function') {
      this.onFinishCallback();
    }
  }

  autoSubmitOnTimeout() {
    this.processInstantChoiceSelection(null, true); // Révéler la bonne réponse puis passer après 14 secondes
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
