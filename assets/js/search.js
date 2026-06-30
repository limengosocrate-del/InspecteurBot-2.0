/*=========================================
 INSPECTEURBOT IA
 Search Controller V2.0
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("rechercheArticle");
    const button = document.getElementById("btnRecherche");
    const results = document.getElementById("reponseIA");

    if (!input || !button || !results) {
        console.error("Interface de recherche introuvable.");
        return;
    }

    function afficher(message) {
        results.innerHTML = message;
    }

    async function rechercher() {

        const question = input.value.trim();

        if (question === "") {
            afficher("<p style='color:#FFD700'>Veuillez saisir une recherche.</p>");
            return;
        }

        afficher("<p>⏳ Recherche en cours...</p>");

        try {

            const reponse = await ragSearch(question);

            if (!reponse || reponse.length === 0) {

                afficher(`
                    <div class="result-card">
                        <h3>Aucun résultat trouvé</h3>
                        <p>
                        Aucun article ne correspond actuellement à votre recherche.
                        </p>
                    </div>
                `);

            } else {

                afficher(reponse);

            }

        } catch (e) {

            console.error(e);

            afficher(`
                <div class="result-card">
                    <h3>Erreur</h3>
                    <p>Impossible d'effectuer la recherche.</p>
                </div>
            `);

        }

    }

    button.addEventListener("click", rechercher);

    input.addEventListener("keypress", function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            rechercher();

        }

    });

});
