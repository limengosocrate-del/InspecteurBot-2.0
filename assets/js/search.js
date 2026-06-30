/*=========================================
 INSPECTEURBOT IA
 Search Controller V4.0
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("searchInput");
    const button = document.getElementById("searchBtn");
    const results = document.getElementById("searchResults");

    if (!input || !button || !results) {
        console.error("Interface de recherche introuvable.");
        return;
    }

    function afficher(html) {
        results.innerHTML = html;
    }

    async function rechercher() {

        const question = input.value.trim();

        if (question === "") {
            afficher("<p style='color:gold'>Veuillez saisir une question.</p>");
            return;
        }

        afficher("<p>⏳ Recherche en cours...</p>");

        try {

            const resultat = await ragSearch(question);

            afficher(resultat);

        } catch (e) {

            console.error(e);

            afficher("<p style='color:red'>Erreur pendant la recherche.</p>");

        }

    }

    button.addEventListener("click", rechercher);

    input.addEventListener("keydown", function(e){

        if(e.key==="Enter"){

            e.preventDefault();

            rechercher();

        }

    });

});
