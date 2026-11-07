/* ==================================================================
   HISTORY.JS — Historique global des missions et actions
   ================================================================== */

let historyStorageKey = "igt_historique_local";
const HISTORY = {
  keyFor(base) { return base + historyStorageKey.slice("igt_historique".length); },
  ready: new Promise(resolve => {
    const init = async () => {
      const client = window.inspecteurBotAuthClient;
      if (client && client.auth) {
        try {
          const { data } = await client.auth.getSession();
          const id = data && data.session && data.session.user && data.session.user.id;
          if (id) historyStorageKey = "igt_historique_" + id;
        } catch (e) { console.warn("Historique local : session indisponible", e); }
      }
      resolve();
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
    else init();
  }),

  add(type, description, data = {}) {
    let hist = [];
    try { hist = JSON.parse(localStorage.getItem(historyStorageKey) || "[]"); if (!Array.isArray(hist)) hist = []; }
    catch (e) { console.warn("Historique local corrompu : une liste vide est affichée.", e); }
    hist.unshift({
      id: "H-" + Date.now(),
      type, description, data,
      timestamp: new Date().toISOString()
    });
    try { localStorage.setItem(historyStorageKey, JSON.stringify(hist.slice(0,1000))); }
    catch (e) { console.warn("Impossible de sauvegarder l’historique local.", e); }
  },

  getAll(filtre = "") {
    const hist = JSON.parse(localStorage.getItem(historyStorageKey) || "[]");
    if (!filtre) return hist;
    const f = filtre.toLowerCase();
    return hist.filter(h => 
      h.type.toLowerCase().includes(f) ||
      h.description.toLowerCase().includes(f)
    );
  },

  clear() {
    try { localStorage.removeItem(historyStorageKey); } catch (e) { console.warn("Impossible d’effacer l’historique local.", e); }
  },

  export() {
    return JSON.stringify(this.getAll(), null, 2);
  }
};

if (typeof window !== 'undefined') window.HISTORY = HISTORY;
