/**
 * search.js
 * Gestionnaire global de recherche rapide
 */

window.GlobalSearch = {

    init() {

        document.addEventListener("keydown", (e) => {

            if (
                ((e.ctrlKey || e.metaKey) && e.key === "k") ||
                (
                    e.key === "/" &&
                    document.activeElement.tagName !== "INPUT" &&
                    document.activeElement.tagName !== "TEXTAREA"
                )
            ) {

                e.preventDefault();

                const input = document.getElementById("searchInput");

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
