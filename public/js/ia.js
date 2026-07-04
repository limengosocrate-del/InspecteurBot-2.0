/**
 * ia.js
 * Assistant IA InspecteurBot — branché sur le moteur HORS-LIGNE NeuroJuris
 */

window.IAEngine = {
  init: function () {
    const btnAnalyze = document.getElementById("btnQuestionIA");
    const btnClear = document.getElementById("btnEffacerIA");
    const btnSpeak = document.getElementById("btnLectureIA");
    const btnCopy = document.getElementById("btnCopierIA");
    const input = document.getElementById("questionIA");
    const quick = document.getElementById("questionsRapides");

    if (btnAnalyze && input) {
      btnAnalyze.addEventListener("click", () => this.analyze(input.value));
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) this.analyze(input.value);
      });
    }

    if (btnClear && input) {
      btnClear.addEventListener("click", () => {
        input.value = "";
        this.resetResponse();
        input.focus();
      });
    }

    if (btnSpeak) btnSpeak.addEventListener("click", () => {
      const box = document.getElementById("reponseIA");
      if (box && window.SpeechEngine) window.SpeechEngine.speak(box.innerText, window.currentLang || "fr");
    });

    if (btnCopy) btnCopy.addEventListener("click", () => {
      const box = document.getElementById("reponseIA");
      if (box && window.InspecteurUtils) window.InspecteurUtils.copyToClipboard(box.innerText, "Réponse IA copiée !");
    });

    if (quick) quick.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const q = btn.getAttribute("data-question");
      if (q && input) { input.value = q; this.analyze(q); document.getElementById("assistantIA")?.scrollIntoView({ behavior: "smooth" }); }
    });
  },

  resetResponse: function () {
    const box = document.getElementById("reponseIA");
    if (box) box.innerHTML = "Bonjour 👋\n\nJe suis InspecteurBot, votre IA juridique HORS-LIGNE.\nPosez une question sur le Code du Travail RDC (contrat, salaire, congé, licenciement, sanctions...).";
  },

  analyze: function (question) {
    if (!question || !question.trim()) {
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Posez une question juridique", "fa-circle-exclamation");
      return;
    }
    const box = document.getElementById("reponseIA");
    if (!box) return;

    box.innerHTML = `<div style="display:flex;align-items:center;gap:10px;color:#FFD700;"><div class="loader" style="width:24px;height:24px;margin:0;border-width:3px;"></div><em>InspecteurBot réfléchit (moteur local NeuroJuris)...</em></div>`;

    if (window.Statistiques) window.Statistiques.increment("ia");

    setTimeout(() => {
      let result = { text: "", confidence: 0 };
      if (window.NeuroJuris && window.NeuroJuris.ready) {
        result = window.NeuroJuris.answer(question, window.currentLang || "fr");
      } else {
        result.text = "Le moteur IA n'est pas encore prêt. Réessayez dans un instant.";
      }

      const conf = Math.round((result.confidence || 0.7) * 100);
      const barColor = conf > 80 ? "#4ade80" : conf > 60 ? "#FFD700" : "#f87171";

      box.innerHTML =
        `<div style="margin-bottom:12px;font-size:12px;color:#dbe8ff;">
           🧠 Fiabilité de l'analyse : <strong style="color:${barColor}">${conf}%</strong> — Mode 100% Hors-ligne
         </div>` +
        this._format(result.text);

      if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Analyse locale terminée ✅", "fa-robot");
    }, 700);
  },

  explainArticle: function (art) {
    if (!art) return;
    const input = document.getElementById("questionIA");
    if (input) input.value = `Explique-moi l'article ${art.numero}`;
    this.analyze(`Explique en détail l'article ${art.numero} : ${art.titre}. ${art.contenu.substring(0, 100)}`);
    document.getElementById("assistantIA")?.scrollIntoView({ behavior: "smooth" });
  },

  _format: function (text) {
    // Convertir **gras** en <strong> + conserver retours ligne
    return (text || "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\n/g, "<br>");
  }
};

document.addEventListener("DOMContentLoaded", () => window.IAEngine.init());
