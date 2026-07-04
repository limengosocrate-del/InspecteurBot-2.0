/**
 * navigation.js
 * Navigation entre articles (Précédent / Suivant) et historique de lecture
 */

window.CodeTravailNavigation = {
    init: function() {
        const btnPrev = document.getElementById("btnArticlePrecedent");
        const btnNext = document.getElementById("btnArticleSuivant");

        if (btnPrev) {
            btnPrev.addEventListener("click", () => this.previousArticle());
        }
        if (btnNext) {
            btnNext.addEventListener("click", () => this.nextArticle());
        }
    },

    previousArticle: function() {
        const state = window.CodeTravailState;
        if (state.articles.length === 0) return;

        let newIndex = state.currentArticleIndex - 1;
        if (newIndex < 0) {
            newIndex = state.articles.length - 1; // Boucle vers la fin
        }
        if (window.CodeTravailConsultation) {
            window.CodeTravailConsultation.showArticle(newIndex);
        }
    },

    nextArticle: function() {
        const state = window.CodeTravailState;
        if (state.articles.length === 0) return;

        let newIndex = state.currentArticleIndex + 1;
        if (newIndex >= state.articles.length) {
            newIndex = 0; // Boucle vers le début
        }
        if (window.CodeTravailConsultation) {
            window.CodeTravailConsultation.showArticle(newIndex);
        }
    },

    updateButtonsState: function() {
        const btnPrev = document.getElementById("btnArticlePrecedent");
        const btnNext = document.getElementById("btnArticleSuivant");
        const total = window.CodeTravailState.articles.length;

        if (btnPrev && btnNext) {
            btnPrev.disabled = total <= 1;
            btnNext.disabled = total <= 1;
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.CodeTravailNavigation.init();
});
