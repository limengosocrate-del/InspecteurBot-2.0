/**
 * index.js
 * Chargement des articles (HORS-LIGNE prioritaire) + init IA locale
 */

window.CodeTravailState = {
  articles: [],
  currentArticleIndex: -1,
  currentCategory: null,
  searchResults: [],
  isLoaded: false
};

window.CodeTravailLoader = {
  init: async function () {
    const loadingEl = document.getElementById("loadingScreen");
    if (loadingEl) loadingEl.classList.remove("hidden");

    try {
      // 1) PRIORITÉ HORS-LIGNE : base embarquée (334 articles)
      if (window.CODE_TRAVAIL_DB && window.CODE_TRAVAIL_DB.length) {
        window.CodeTravailState.articles = window.CODE_TRAVAIL_DB;
      } else {
        // 2) Repli : fetch du JSON (si en ligne)
        const res = await fetch("assets/data/code-travail.json");
        window.CodeTravailState.articles = await res.json();
      }

      window.CodeTravailState.isLoaded = true;

      // Construire l'index de l'IA locale
      if (window.NeuroJuris) {
        window.NeuroJuris.build(window.CodeTravailState.articles);
      }

      // Rendus
      if (window.CodeTravailCategories?.render) window.CodeTravailCategories.render();
      if (window.CodeTravailConsultation?.showArticle) window.CodeTravailConsultation.showArticle(0);
      if (window.Statistiques?.init) window.Statistiques.init();

      if (loadingEl) setTimeout(() => loadingEl.classList.add("hidden"), 500);
      if (window.InspecteurUtils) {
        window.InspecteurUtils.showNotification(
          `✅ ${window.CodeTravailState.articles.length} articles chargés (Mode Hors-ligne actif)`, "fa-database"
        );
      }
    } catch (err) {
      console.error("Chargement:", err);
      if (loadingEl) loadingEl.classList.add("hidden");
      if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Erreur de chargement", "fa-triangle-exclamation");
    }
  },

  getArticleByNumber: function (n) {
    return window.CodeTravailState.articles.find(a => a.numero === parseInt(n, 10));
  },
  getAllCategories: function () {
    return Array.from(new Set(window.CodeTravailState.articles.map(a => a.categorie)));
  }
};

document.addEventListener("DOMContentLoaded", () => window.CodeTravailLoader.init());
