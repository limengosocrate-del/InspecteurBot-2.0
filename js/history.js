/* ==================================================================
   HISTORY.JS — Historique global des missions et actions
   ================================================================== */

let historyStorageKey = "igt_historique_local";
const HISTORY = {
  ready: (async () => {
    const client = window.inspecteurBotAuthClient;
    if (!client || !client.auth) return;
    try {
      const { data } = await client.auth.getSession();
      const id = data && data.session && data.session.user && data.session.user.id;
      if (id) historyStorageKey = "igt_historique_" + id;
    } catch (e) { console.warn("Historique local : session indisponible", e); }
  })(),

  add(type, description, data = {}) {
    const hist = JSON.parse(localStorage.getItem(historyStorageKey) || "[]");
    hist.unshift({
      id: "H-" + Date.now(),
      type, description, data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem(historyStorageKey, JSON.stringify(hist.slice(0,1000)));
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
    localStorage.removeItem(historyStorageKey);
  },

  export() {
    return JSON.stringify(this.getAll(), null, 2);
  }
};

if (typeof window !== 'undefined') window.HISTORY = HISTORY;
