/* ==================================================================
   HISTORY.JS — Historique global des missions et actions
   ================================================================== */

const HISTORY = {

  add(type, description, data = {}) {
    const hist = JSON.parse(localStorage.getItem("igt_historique") || "[]");
    hist.unshift({
      id: "H-" + Date.now(),
      type, description, data,
      timestamp: new Date().toISOString()
    });
    localStorage.setItem("igt_historique", JSON.stringify(hist.slice(0,1000)));
  },

  getAll(filtre = "") {
    const hist = JSON.parse(localStorage.getItem("igt_historique") || "[]");
    if (!filtre) return hist;
    const f = filtre.toLowerCase();
    return hist.filter(h => 
      h.type.toLowerCase().includes(f) ||
      h.description.toLowerCase().includes(f)
    );
  },

  clear() {
    localStorage.removeItem("igt_historique");
  },

  export() {
    return JSON.stringify(this.getAll(), null, 2);
  }
};

if (typeof window !== 'undefined') window.HISTORY = HISTORY;
