/* Recherche intelligente du Code du Travail : résultats strictement liés
   à la base officielle chargée dans CodeTravailState et ouverture dans le Mode Livre. */
(function () {
  "use strict";

  const normalize = value => String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const escape = value => window.InspecteurUtils?.escapeHtml(String(value ?? "")) ||
    String(value ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;" }[c]));

  window.CodeTravailRecherche = {
    init() {
      const input = document.getElementById("rechercheArticle");
      const button = document.getElementById("btnRecherche");
      const clear = document.getElementById("btnEffacerRecherche");
      const chips = document.getElementById("suggestionsRapides");

      if (button && input) button.addEventListener("click", () => this.performSearch(input.value));
      if (input) input.addEventListener("keydown", event => {
        if (event.key === "Enter") {
          event.preventDefault();
          this.performSearch(input.value);
        }
      });
      if (clear && input) clear.addEventListener("click", () => {
        input.value = "";
        this.clearResults();
        input.focus();
      });

      if (chips) chips.addEventListener("click", event => {
        const button = event.target.closest("button");
        if (!button) return;
        const articleNumber = button.dataset.article;
        if (articleNumber) {
          const article = window.CodeTravailLoader?.getArticleByNumber(articleNumber);
          if (article) this.openInBook(article);
          return;
        }
        const query = button.dataset.search;
        if (query) {
          if (input) input.value = query;
          this.performSearch(query);
        }
      });
    },

    getArticles() {
      return window.CodeTravailState?.articles || window.CODE_TRAVAIL_DB || [];
    },

    performSearch(query) {
      const value = String(query || "").trim();
      if (!value) {
        this.clearResults();
        return;
      }

      const articles = this.getArticles();
      const host = document.getElementById("resultatsRecherche");
      if (!articles.length) {
        this.renderEmpty("La base du Code du Travail n’est pas encore chargée. Réessayez dans quelques instants.");
        return;
      }

      const normalizedQuery = normalize(value);
      const numberMatch = normalizedQuery.match(/^(?:article\s*)?(\d{1,3})$/);
      let ranked = [];

      if (numberMatch) {
        const exact = articles.find(article => Number(article.numero) === Number(numberMatch[1]));
        if (exact) ranked = [{ article: exact, score: 10000 }];
      } else {
        const tokens = normalizedQuery.split(" ").filter(token => token.length > 1);
        const candidates = new Map();
        const addCandidate = (article, boost) => {
          if (!article) return;
          const key = String(article.numero);
          const previous = candidates.get(key);
          candidates.set(key, { article, boost: Math.max(previous?.boost || 0, boost) });
        };

        // Les deux moteurs ne consultent que les articles du Code du Travail.
        (window.NeuroJuris?.retrieve?.(value, 12) || []).forEach(article => addCandidate(article, 3));
        (window.VectorSearchEngine?.searchSemantic?.(value) || []).slice(0, 12).forEach(article => addCandidate(article, 2));

        // Recherche lexicale sur les champs de la même base, utile pour les numéros,
        // intitulés, catégories, mots-clés et expressions exactes.
        articles.forEach(article => {
          const title = normalize(article.titre);
          const category = normalize(article.categorie + " " + article.titreSection);
          const keywords = normalize((article.motsCles || []).join(" "));
          const content = normalize(article.contenu);
          let score = 0;
          if (title.includes(normalizedQuery)) score += 18;
          if (keywords.includes(normalizedQuery)) score += 14;
          if (category.includes(normalizedQuery)) score += 9;
          if (content.includes(normalizedQuery)) score += 5;
          tokens.forEach(token => {
            if (title.includes(token)) score += 5;
            if (keywords.includes(token)) score += 4;
            if (category.includes(token)) score += 2;
            if (content.includes(token)) score += 1;
          });
          if (score > 0) addCandidate(article, score);
        });

        ranked = [...candidates.values()].map(({ article, boost }) => {
          const title = normalize(article.titre);
          const keywords = normalize((article.motsCles || []).join(" "));
          const category = normalize(article.categorie + " " + article.titreSection);
          const content = normalize(article.contenu);
          let score = boost;
          tokens.forEach(token => {
            if (title.includes(token)) score += 8;
            if (keywords.includes(token)) score += 6;
            if (category.includes(token)) score += 3;
            if (content.includes(token)) score += 1;
          });
          if (title.includes(normalizedQuery)) score += 20;
          if (keywords.includes(normalizedQuery)) score += 16;
          if (article.authentique) score += 0.25;
          return { article, score };
        }).filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score || a.article.numero - b.article.numero)
          .slice(0, 8);
      }

      const results = ranked.map(item => item.article);
      window.CodeTravailState.searchResults = results;
      if (window.Statistiques?.increment) window.Statistiques.increment("recherche");
      this.renderResults(results, value);

      // Une référence unique ou un résultat nettement prioritaire ouvre directement
      // sa page dans le lecteur Mode Livre. Les recherches ambiguës restent listées.
      if (results.length && (numberMatch || results.length === 1 || ranked[0].score >= (ranked[1]?.score || 0) * 1.8)) {
        this.openInBook(results[0], false);
      }
      if (host) host.scrollIntoView({ behavior: "smooth", block: "nearest" });
    },

    openInBook(article, scroll = true) {
      const articles = this.getArticles();
      const index = articles.findIndex(item => Number(item.numero) === Number(article.numero));
      if (index < 0) return;

      // Synchroniser la page affichée et l'index de consultation sur le même article.
      if (window.LivreEngine?.gotoArticle) {
        window.LivreEngine.gotoArticle(Number(article.numero));
      } else if (window.LivreEngine?.render) {
        window.LivreEngine.render(index);
      }
      if (window.CodeTravailState) window.CodeTravailState.currentArticleIndex = index;

      if (scroll) {
        document.getElementById("livreHost")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },

    renderResults(results, query) {
      const host = document.getElementById("resultatsRecherche");
      if (!host) return;
      host.replaceChildren();

      const heading = document.createElement("div");
      heading.className = "search-results-heading";
      heading.textContent = results.length
        ? results.length + " article(s) pertinent(s) dans le Code du Travail"
        : "Aucun article correspondant trouvé dans la base du Code du Travail.";
      host.append(heading);

      results.forEach((article, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "result-item";
        button.setAttribute("aria-label", "Ouvrir l’article " + article.numero + " dans le Mode Livre");
        const number = document.createElement("span");
        number.className = "result-number";
        number.textContent = "ARTICLE " + article.numero;
        const title = document.createElement("strong");
        title.textContent = article.titre || "Disposition légale";
        const category = document.createElement("small");
        category.textContent = article.categorie || article.titreSection || "Code du Travail RDC";
        button.append(number, title, category);
        button.addEventListener("click", () => this.openInBook(article));
        host.append(button);
      });
    },

    renderEmpty(message) {
      const host = document.getElementById("resultatsRecherche");
      if (!host) return;
      host.replaceChildren();
      const notice = document.createElement("p");
      notice.className = "search-empty";
      notice.textContent = message;
      host.append(notice);
    },

    clearResults() {
      const host = document.getElementById("resultatsRecherche");
      if (host) host.replaceChildren();
      if (window.CodeTravailState) window.CodeTravailState.searchResults = [];
    }
  };

  document.addEventListener("DOMContentLoaded", () => window.CodeTravailRecherche.init());
})();
