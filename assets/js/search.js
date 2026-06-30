 /*=========================================
 INSPECTEURBOT IA
 Search Controller V3.0
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("rechercheArticle");
    const button = document.getElementById("btnRecherche");
    const results = document.getElementById("zoneIA");

    if (!input || !button || !results) {
        console.error("Interface de recherche introuvable.");
        return;
    }

    function afficher(message) {
        results.innerHTML = `
            <h3>🤖 InspecteurBot IA</h3>
            ${message}
        `;
    }

    async function rechercher() {

        const question = input.value.trim();

        if (question === "") {
            afficher("<p style='color:#FFD700'>Veuillez saisir un mot-clé ou un numéro d'article.</p>");
            return;
        }

        afficher("<p>⏳ Recherche en cours...</p>");

        try {

            const reponse = await ragSearch(question);

            afficher(reponse);

        } catch (erreur) {

            console.error(erreur);

            afficher(`
                <div class="result-card">
                    <h3>❌ Erreur</h3>
                    <p>Impossible d'effectuer la recherche.</p>
                </div>
            `);

        }

    }

    // Bouton Rechercher
    button.addEventListener("click", rechercher);

    // Touche Entrée
    input.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            rechercher();
        }
    });

});   
