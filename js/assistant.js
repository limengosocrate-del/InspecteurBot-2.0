/* ==================================================================
   ASSISTANT.JS — Chat conversationnel + reconnaissance vocale
   ================================================================== */

(function () {
'use strict';
const ASSISTANT = {

  conversation: [],
  voiceEnabled: false,
  recognition: null,
  accountId: null,
  storageKey() { return this.accountId ? "igt_conversation_" + this.accountId : null; },
  setAccount(userId) { this.accountId = String(userId || ""); this.conversation = []; try { localStorage.removeItem("igt_conversation"); } catch (_) {} this.loadConversation(); },

  // Ajouter un message à la conversation
  addMessage(role, text) {
    const msg = { role, text, ts: new Date().toISOString() };
    this.conversation.push(msg);
    const key = this.storageKey(); if (key) localStorage.setItem(key, JSON.stringify(this.conversation.slice(-100)));
    return msg;
  },

  // Charger conversation précédente
  loadConversation() {
    const key = this.storageKey(); this.conversation = key ? JSON.parse(localStorage.getItem(key) || "[]") : [];
    return this.conversation;
  },

  // Effacer conversation
  clearConversation() {
    this.conversation = [];
    const key = this.storageKey(); if (key) localStorage.removeItem(key);
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
    "Différence entre licenciement et faute lourde",
    "Quels sont les différents types de procès-verbaux ?",
    "Prépare une trame de PV de constat d’infraction.",
    "Quelles sont les étapes d’une mission d’inspection ?",
    "Quels contrôles effectuer avec la fiche F03 ?",
    "Explique les missions du menu IGT et de l’annuaire.",
    "Quelles données faut-il pour établir un décompte final ?"
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
    const clean = text.replace(/\*\*/g,"").replace(/
/g," ").replace(/[📄📖⚖️🤖💰🔎✅❌⚠️📊🏢🌍]/g,"");
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

window.ASSISTANT = ASSISTANT;
})();
