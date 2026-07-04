/**
 * speech.js
 * Reconnaissance vocale + Lecture vocale (Synthèse) HORS-LIGNE
 * Prise en charge de DEUX VOIX : Masculine et Féminine
 * Langues : Français, Anglais, Lingala, Kikongo, Tshiluba, Swahili
 */

window.SpeechEngine = {
  isSpeaking: false,
  isListening: false,
  currentVoiceGender: "female", // "female" | "male"
  voices: [],

  init: function () {
    this.loadVoices();
    if ("speechSynthesis" in window) {
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }

    const btnVoiceSearch = document.getElementById("btnRechercheVocale");
    if (btnVoiceSearch) btnVoiceSearch.addEventListener("click", () => this.toggleVoiceSearch());

    // Sélecteur de genre de voix (créé dynamiquement si absent)
    const savedGender = localStorage.getItem("inspecteur_voice_gender");
    if (savedGender) this.currentVoiceGender = savedGender;
  },

  loadVoices: function () {
    if ("speechSynthesis" in window) {
      this.voices = window.speechSynthesis.getVoices();
    }
  },

  setVoiceGender: function (gender) {
    this.currentVoiceGender = gender;
    localStorage.setItem("inspecteur_voice_gender", gender);
    if (window.InspecteurUtils) {
      window.InspecteurUtils.showNotification(
        gender === "male" ? "🔊 Voix masculine activée" : "🔊 Voix féminine activée",
        "fa-volume-high"
      );
    }
  },

  pickVoice: function (lang) {
    const langCode = lang === "en" ? "en" : "fr"; // langues nationales lues en base FR
    const candidates = this.voices.filter(v => v.lang.toLowerCase().startsWith(langCode));
    if (!candidates.length) return null;

    // Heuristique genre : noms connus
    const maleHints = ["male","homme","thomas","paul","daniel","google français","rémi","henri","man"];
    const femaleHints = ["female","femme","amelie","amélie","marie","julie","celine","céline","aurelie","woman","zira","google uk english female"];

    const wantMale = this.currentVoiceGender === "male";
    const hints = wantMale ? maleHints : femaleHints;

    // 1) match par indice de nom
    let match = candidates.find(v => hints.some(h => v.name.toLowerCase().includes(h)));
    if (match) return match;

    // 2) sinon on prend selon l'ordre (souvent index 0 = par défaut)
    // Pour varier male/female si pas d'indice : alterner
    if (candidates.length >= 2) {
      return wantMale ? candidates[candidates.length - 1] : candidates[0];
    }
    return candidates[0];
  },

  speak: function (text, lang) {
    lang = lang || (window.currentLang || "fr");
    if (!("speechSynthesis" in window)) {
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Lecture vocale non supportée", "fa-volume-xmark");
      return;
    }
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Lecture arrêtée", "fa-volume-xmark");
      return;
    }
    if (!text || !text.trim()) return;

    // Nettoyage des emojis/markdown pour une lecture fluide
    const clean = text.replace(/[#*_>`]/g, "").replace(/[📌📖💡👔👷🚨📚⚖️🏷️🌍🤖]/g, "");

    const utter = new SpeechSynthesisUtterance(clean);
    utter.lang = lang === "en" ? "en-US" : "fr-FR";
    utter.rate = 0.98;
    utter.pitch = this.currentVoiceGender === "male" ? 0.85 : 1.15; // grave vs aigu
    const voice = this.pickVoice(lang);
    if (voice) utter.voice = voice;

    utter.onstart = () => {
      this.isSpeaking = true;
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification(
        `Lecture (voix ${this.currentVoiceGender === "male" ? "masculine" : "féminine"})...`, "fa-volume-high");
    };
    utter.onend = () => { this.isSpeaking = false; };
    utter.onerror = () => { this.isSpeaking = false; };

    window.speechSynthesis.speak(utter);
  },

  toggleVoiceSearch: function () {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Reconnaissance vocale non supportée", "fa-microphone-slash");
      return;
    }
    if (this.isListening && this.recognition) { this.recognition.stop(); return; }

    const btn = document.getElementById("btnRechercheVocale");
    const input = document.getElementById("rechercheArticle");
    this.recognition = new SR();
    this.recognition.lang = (window.currentLang === "en") ? "en-US" : "fr-FR";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (btn) btn.classList.add("listening");
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification("🔴 Parlez maintenant...", "fa-microphone");
    };
    this.recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      if (input) input.value = transcript;
      if (window.CodeTravailRecherche) window.CodeTravailRecherche.performSearch(transcript);
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification(`Reconnu : "${transcript}"`, "fa-circle-check");
    };
    this.recognition.onerror = () => { if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Erreur micro", "fa-triangle-exclamation"); };
    this.recognition.onend = () => { this.isListening = false; if (btn) btn.classList.remove("listening"); };
    this.recognition.start();
  }
};

document.addEventListener("DOMContentLoaded", () => window.SpeechEngine.init());
