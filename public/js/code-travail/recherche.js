/**
 * recherche.js
 * Moteur de recherche plein texte, par numéro d'article ou par mot-clé
 */

window.CodeTravailRecherche = {
    init: function() {
        const input = document.getElementById("rechercheArticle");
        const btnSearch = document.getElementById("btnRecherche");
        const btnClear = document.getElementById("btnEffacerRecherche");
        const suggestionsContainer = document.getElementById("suggestionsRapides");

        if (input && btnSearch) {
            btnSearch.addEventListener("click", () => this.performSearch(input.value));
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") this.performSearch(input.value);
            });
        }

        if (btnClear && input) {
            btnClear.addEventListener("click", () => {
                input.value = "";
                this.clearResults();
                input.focus();
            });
        }

        // Suggestions rapides
        if (suggestionsContainer) {
            suggestionsContainer.addEventListener("click", (e) => {
                const btn = e.target.closest("button");
                if (!btn) return;

                const searchVal = btn.getAttribute("data-search");
                const articleVal = btn.getAttribute("data-article");

                if (articleVal) {
                    const art = window.CodeTravailLoader.getArticleByNumber(articleVal);
                    if (art && window.CodeTravailConsultation) {
                        const idx = window.CodeTravailState.articles.indexOf(art);
                        window.CodeTravailConsultation.showArticle(idx);
                        const card = document.getElementById("articleCard");
                        if (card) card.scrollIntoView({ behavior: "smooth" });
                    } else if (window.InspecteurUtils) {
                        window.InspecteurUtils.showNotification(`Article ${articleVal} en cours de chargement ou non disponible dans la démo.`, "fa-circle-info");
                    }
                } else if (searchVal) {
                    if (input) input.value = searchVal;
                    this.performSearch(searchVal);
                }
            });
        }
    },

    performSearch: function(query) {
        if (!query || !query.trim()) {
            this.clearResults();
            return;
        }
        query = query.trim();
        const lowerQuery = query.toLowerCase();

        const resultsContainer = document.getElementById("resultatsRecherche");
        if (!resultsContainer) return;

        // Si la requête est un nombre (ex: "1", "15", "141") ou commence par "article "
        const numMatch = lowerQuery.match(/^(?:article\s*)?(\d+)$/i);
        if (numMatch) {
            const artNum = parseInt(numMatch[1], 10);
            const foundArt = window.CodeTravailLoader.getArticleByNumber(artNum);
            if (foundArt) {
                this.renderResults([foundArt], query);
                if (window.CodeTravailConsultation) {
                    const idx = window.CodeTravailState.articles.indexOf(foundArt);
                    window.CodeTravailConsultation.showArticle(idx);
                }
                return;
            }
        }

        // Recherche plein texte (titre, contenu, motsCles, catégorie)
        const results = window.CodeTravailState.articles.filter(art => {
            const matchTitle = art.titre.toLowerCase().includes(lowerQuery);
            const matchContent = art.contenu.toLowerCase().includes(lowerQuery);
            const matchCat = art.categorie && art.categorie.toLowerCase().includes(lowerQuery);
            const matchKeywords = art.motsCles && art.motsCles.some(k => k.toLowerCase().includes(lowerQuery));
            return matchTitle || matchContent || matchCat || matchKeywords;
        });

        window.CodeTravailState.searchResults = results;
        this.renderResults(results, query);

        // Mettre à jour l'info de recherche dans la section info
        const infoRecherche = document.getElementById("infoRecherche");
        const infoResultats = document.getElementById("infoResultats");
        if (infoRecherche) infoRecherche.textContent = query;
        if (infoResultats) infoResultats.textContent = `${results.length} article(s)`;

        // Incrémenter les stats
        if (window.Statistiques) {
            window.Statistiques.increment("recherche");
        }
    },

    renderResults: function(results, query) {
        const container = document.getElementById("resultatsRecherche");
        if (!container) return;

        container.innerHTML = "";
        if (results.length === 0) {
            container.innerHTML = `
                <div class="result-item" style="border-left-color: #ef4444;">
                    <h4 style="color: #f87171;"><i class="fa-solid fa-triangle-exclamation"></i> Aucun résultat pour "${window.InspecteurUtils.escapeHtml(query)}"</h4>
                    <p>Essaie avec des termes plus généraux ou vérifie l'orthographe (ex: contrat, salaire, licenciement, congé).</p>
                </div>
            `;
            return;
        }

        results.forEach(art => {
            const item = document.createElement("div");
            item.className = "result-item fade-in";
            
            // Extrait court du contenu
            let snippet = art.contenu.substring(0, 160) + "...";
            if (window.InspecteurUtils && query) {
                snippet = window.InspecteurUtils.highlightText(snippet, query);
            }

            item.innerHTML = `
                <h4>Article ${art.numero} — ${window.InspecteurUtils.escapeHtml(art.titre)}</h4>
                <p>${snippet}</p>
            `;

            item.addEventListener("click", () => {
                const idx = window.CodeTravailState.articles.indexOf(art);
                if (window.CodeTravailConsultation && idx !== -1) {
                    window.CodeTravailConsultation.showArticle(idx);
                    const card = document.getElementById("articleCard");
                    if (card) card.scrollIntoView({ behavior: "smooth" });
                }
            });

            container.appendChild(item);
        });
    },

    clearResults: function() {
        const container = document.getElementById("resultatsRecherche");
        if (container) container.innerHTML = "";
        const infoRecherche = document.getElementById("infoRecherche");
        const infoResultats = document.getElementById("infoResultats");
        if (infoRecherche) infoRecherche.textContent = "Aucune";
        if (infoResultats) infoResultats.textContent = "0";
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.CodeTravailRecherche.init();
});
