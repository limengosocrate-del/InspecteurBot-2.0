/**
 * search.js
 * Gestionnaire global de recherche rapide et liaison avec les sous-modules
 */

window.GlobalSearch = {
    init: function() {
        // Raccourci clavier Ctrl+K ou / pour focaliser la recherche
        document.addEventListener("keydown", (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k" || (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA")) {
                e.preventDefault();
                const input = document.getElementById("rechercheArticle");
                if (input) {
                    input.focus();
                    input.select();
                }
            }
        });
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.GlobalSearch.init();
});
