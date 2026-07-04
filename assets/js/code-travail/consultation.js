/**
 * consultation.js
 * Rendu détaillé d'un article, affichage des sanctions pénales/civiles et questions IA
 */

window.CodeTravailConsultation = {
    init: function() {
        const btnCopy = document.getElementById("btnCopierArticle");
        const btnSpeak = document.getElementById("btnLectureArticle");
        const btnAI = document.getElementById("btnExpliquerIA");
        const btnShare = document.getElementById("btnPartagerArticle");
        const btnPrint = document.getElementById("btnImprimerArticle");
        const btnFav = document.getElementById("btnFavoriArticle");

        if (btnCopy) {
            btnCopy.addEventListener("click", () => {
                const art = this.getCurrentArticle();
                if (!art) return;
                const text = `Code du Travail RDC — Article ${art.numero} (${art.titre})\n\n${art.contenu}\n\n${art.sanction ? 'Sanction : ' + art.sanction : ''}\n\nSource : InspecteurBot RDC (2026)`;
                if (window.InspecteurUtils) window.InspecteurUtils.copyToClipboard(text, "Article copié dans le presse-papiers !");
            });
        }

        if (btnSpeak) {
            btnSpeak.addEventListener("click", () => {
                const art = this.getCurrentArticle();
                if (!art) return;
                if (window.SpeechEngine && window.SpeechEngine.speak) {
                    window.SpeechEngine.speak(`Article ${art.numero}. ${art.titre}. ${art.contenu}`);
                } else {
                    if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Synthèse vocale en cours de lecture...", "fa-volume-high");
                }
            });
        }

        if (btnAI) {
            btnAI.addEventListener("click", () => {
                const art = this.getCurrentArticle();
                if (!art) return;
                if (window.IAEngine && window.IAEngine.explainArticle) {
                    window.IAEngine.explainArticle(art);
                }
                const aiSection = document.getElementById("assistantIA");
                if (aiSection) aiSection.scrollIntoView({ behavior: "smooth" });
            });
        }

        if (btnShare && window.ShareEngine) {
            btnShare.addEventListener("click", () => {
                const art = this.getCurrentArticle();
                if (art) window.ShareEngine.shareArticle(art);
            });
        }

        if (btnPrint && window.PrintEngine) {
            btnPrint.addEventListener("click", () => {
                const art = this.getCurrentArticle();
                if (art) window.PrintEngine.printArticle(art);
            });
        }

        if (btnFav && window.FavorisEngine) {
            btnFav.addEventListener("click", () => {
                const art = this.getCurrentArticle();
                if (art) window.FavorisEngine.toggleFavorite(art);
            });
        }
    },

    getCurrentArticle: function() {
        const idx = window.CodeTravailState.currentArticleIndex;
        if (idx === -1 || !window.CodeTravailState.articles[idx]) return null;
        return window.CodeTravailState.articles[idx];
    },

    showArticle: function(index) {
        const state = window.CodeTravailState;
        if (index < 0 || index >= state.articles.length) return;

        state.currentArticleIndex = index;
        const art = state.articles[index];

        const numEl = document.getElementById("numeroArticle");
        const titleEl = document.getElementById("titreArticle");
        const catEl = document.getElementById("categorieArticle");
        const contentEl = document.getElementById("contenuArticle");
        const sanctionEl = document.getElementById("sanctionArticle");
        const questionsEl = document.getElementById("questionsIA");

        if (numEl) numEl.textContent = `Article ${art.numero}`;
        if (titleEl) titleEl.textContent = art.titre;
        if (catEl) catEl.textContent = art.categorie || "Dispositions légales";
        if (contentEl) contentEl.textContent = art.contenu;

        // Sanction
        if (sanctionEl) {
            if (art.sanction && art.sanction.trim()) {
                sanctionEl.innerHTML = `
                    <h4><i class="fa-solid fa-triangle-exclamation"></i> Sanction légale prévue par le Code</h4>
                    <p>${window.InspecteurUtils.escapeHtml(art.sanction)}</p>
                `;
                sanctionEl.classList.add("visible");
            } else {
                sanctionEl.innerHTML = "";
                sanctionEl.classList.remove("visible");
            }
        }

        // Questions IA
        if (questionsEl) {
            questionsEl.innerHTML = `<h4><i class="fa-solid fa-circle-question"></i> Questions fréquentes posées à InspecteurBot :</h4>`;
            const tagsBox = document.createElement("div");
            tagsBox.className = "questions-tags";

            const qs = art.questionsIA || [
                `Que dit l'article ${art.numero} en résumé ?`,
                `Quelles sont les obligations de l'employeur dans l'article ${art.numero} ?`
            ];

            qs.forEach(q => {
                const btn = document.createElement("button");
                btn.className = "question-tag-btn";
                btn.textContent = `🤖 ${q}`;
                btn.addEventListener("click", () => {
                    const input = document.getElementById("questionIA");
                    if (input) {
                        input.value = q;
                        const btnAnalyze = document.getElementById("btnQuestionIA");
                        if (btnAnalyze) btnAnalyze.click();
                        const aiSec = document.getElementById("assistantIA");
                        if (aiSec) aiSec.scrollIntoView({ behavior: "smooth" });
                    }
                });
                tagsBox.appendChild(btn);
            });

            questionsEl.appendChild(tagsBox);
        }

        // Mettre à jour la section info
        const infoArt = document.getElementById("infoArticle");
        const infoCat = document.getElementById("infoCategorie");
        if (infoArt) infoArt.textContent = `Article ${art.numero}`;
        if (infoCat) infoCat.textContent = art.categorie || "—";

        // Mettre à jour l'état du bouton favoris
        if (window.FavorisEngine) {
            window.FavorisEngine.updateButtonState(art);
        }

        // Mettre à jour la navigation
        if (window.CodeTravailNavigation) {
            window.CodeTravailNavigation.updateButtonsState();
        }

        // Incrémenter la statistique de lecture
        if (window.Statistiques) {
            window.Statistiques.increment("articles");
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.CodeTravailConsultation.init();
});
