/**
 * index.js — chargement et initialisation du Code du Travail
 * Base embarquée prioritaire : fonctionnement hors ligne sans requête réseau.
 */
(function () {
  "use strict";

  window.CodeTravailState = window.CodeTravailState || {
    articles: [], currentArticleIndex: -1, currentCategory: null,
    searchResults: [], isLoaded: false
  };

  window.CodeTravailLoader = {
    init: async function () {
      const state = window.CodeTravailState;
      if (state.isLoaded) return;
      const loadingEl = document.getElementById("loadingScreen");
      if (loadingEl) loadingEl.classList.remove("hidden");

      try {
        let data = Array.isArray(window.CODE_TRAVAIL_DB) ? window.CODE_TRAVAIL_DB : [];
        if (!data.length) {
          const response = await fetch("assets/js/code-travail/articles.json", { cache: "no-cache" });
          if (!response.ok) throw new Error("Impossible de charger articles.json (" + response.status + ")");
          data = await response.json();
        }

        if (!Array.isArray(data) || data.length !== 334) {
          throw new Error("La base doit contenir exactement 334 articles.");
        }
        const normalized = data.map(function (item, index) {
          const numero = Number(item.numero);
          const contenu = String(item.contenu ?? item.texte ?? "").trim();
          if (numero !== index + 1 || !contenu) {
            throw new Error("Structure invalide à l'article " + (index + 1) + ".");
          }
          return {
            numero: numero,
            titre: String(item.titre || ("Article " + numero)),
            contenu: contenu,
            texte: contenu,
            categorie: String(item.categorie || "Dispositions légales"),
            titreSection: String(item.titreSection || item.categorie || "Code du Travail"),
            sanction: String(item.sanction || "")
          };
        });

        state.articles = normalized;
        state.isLoaded = true;

        if (window.NeuroJuris && typeof window.NeuroJuris.build === "function") {
          window.NeuroJuris.build(normalized);
        }
        if (window.CodeTravailCategories && typeof window.CodeTravailCategories.render === "function") {
          window.CodeTravailCategories.render();
        }
        if (window.CodeTravailConsultation && typeof window.CodeTravailConsultation.showArticle === "function") {
          window.CodeTravailConsultation.showArticle(0);
        }
        if (window.Statistiques && typeof window.Statistiques.init === "function") {
          window.Statistiques.init();
        }
        if (loadingEl) loadingEl.classList.add("hidden");
        if (window.InspecteurUtils) {
          window.InspecteurUtils.showNotification("334 articles du Code du Travail chargés — mode hors ligne disponible.", "fa-database");
        }
      } catch (error) {
        console.error("[CodeTravail] Échec du chargement :", error);
        if (loadingEl) loadingEl.classList.add("hidden");
        const message = document.getElementById("contenuArticle");
        if (message) message.textContent = "La bibliothèque du Code du Travail n'a pas pu être chargée. Vérifiez la base de données et actualisez la page.";
        if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Erreur dans la base du Code du Travail.", "fa-triangle-exclamation");
      }
    },

    getArticleByNumber: function (numero) {
      return window.CodeTravailState.articles.find(function (article) { return article.numero === Number.parseInt(numero, 10); }) || null;
    },
    getAllCategories: function () {
      return Array.from(new Set(window.CodeTravailState.articles.map(function (article) { return article.categorie; })));
    }
  };

  document.addEventListener("DOMContentLoaded", function () { window.CodeTravailLoader.init(); });
})();
