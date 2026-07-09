/* ==================================================================
   ASSISTANT.JS — Chat conversationnel + reconnaissance vocale
   ================================================================== */

const ASSISTANT = {

  conversation: [],
  voiceEnabled: false,
  recognition: null,

  // Ajouter un message à la conversation
  addMessage(role, text) {
    const msg = { role, text, ts: new Date().toISOString() };
    this.conversation.push(msg);
    localStorage.setItem("igt_conversation", JSON.stringify(this.conversation.slice(-100)));
    return msg;
  },

  // Charger conversation précédente
  loadConversation() {
    this.conversation = JSON.parse(localStorage.getItem("igt_conversation") || "[]");
    return this.conversation;
  },

  // Effacer conversation
  clearConversation() {
    this.conversation = [];
    localStorage.removeItem("igt_conversation");
  },

  // Poser une question à l'IA (avec contexte)
  ask(question) {
    this.addMessage("user", question);
    const response = AI_CORE.ask(question, { conversation: this.conversation });
    this.addMessage("bot", response.text);
    return response;
  },

  // Suggestions rapides
  suggestions: [
    "Quel est le SMIG 2025 pour un chauffeur ?",
    "Article 71 du code du travail",
    "Comment calculer le préavis d'un cadre ?",
    "Que contient la fiche F03 ?",
    "Convention OIT 138",
    "Comment déposer une DASMO ?",
    "Combien de jours de congé après 9 ans ?",
    "Formule du décompte final",
    "Taux CNSS en RDC",
    "Différence entre licenciement et faute lourde"
  ],

  // ============ RECONNAISSANCE VOCALE ============
  initVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { console.warn("Reconnaissance vocale non supportée"); return false; }
    this.recognition = new SR();
    this.recognition.lang = "fr-FR";
    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.voiceEnabled = true;
    return true;
  },

  startVoice(onResult, onError) {
    if (!this.recognition && !this.initVoice()) {
      onError && onError("Reconnaissance vocale non disponible sur ce navigateur.");
      return;
    }
    this.recognition.onresult = e => {
      const transcript = e.results[0][0].transcript;
      onResult && onResult(transcript);
    };
    this.recognition.onerror = e => onError && onError(e.error);
    try { this.recognition.start(); } catch(err) { onError && onError(err.message); }
  },

  stopVoice() {
    if (this.recognition) try { this.recognition.stop(); } catch(e){}
  },

  // ============ SYNTHÈSE VOCALE ============
  speak(text) {
    if (!("speechSynthesis" in window)) return;
    const clean = text.replace(/\*\*/g,"").replace(/\n/g," ").replace(/[📄📖⚖️🤖💰🔎✅❌⚠️📊🏢🌍]/g,"");
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = "fr-FR";
    u.rate = 1;
    u.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(u);
  },

  stopSpeaking() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }
};

if (typeof window !== 'undefined') window.ASSISTANT = ASSISTANT;
