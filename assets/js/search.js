/*====================================================
 INSPECTEURBOT IA RDC
 search.js
 Gestion de la recherche intelligente
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const input =
        document.getElementById("rechercheArticle") ||
        document.getElementById("searchInput");

    const button =
        document.getElementById("btnRecherche") ||
        document.getElementById("searchBtn");

    if (!input || !button) return;

    button.addEventListener("click", rechercher);

    input.addEventListener("keypress", function(e) {

        if (e.key === "Enter") {

            e.preventDefault();

            rechercher();

        }

    });

});

function rechercher() {

    const input =
        document.getElementById("rechercheArticle") ||
        document.getElementById("searchInput");

    if (!input) return;

    const question = input.value.trim();

    if (question === "") {

        alert("Veuillez saisir votre recherche.");

        return;

    }

    const resultats = window.rag.rechercher(question);

    afficherResultats(resultats);

}

function afficherResultats(resultats) {

    /* ===== Page Code du Travail ===== */

    if (document.getElementById("numeroArticle")) {

        if (resultats.length === 0) {

            document.getElementById("numeroArticle").innerHTML = "";

            document.getElementById("titreArticle").innerHTML =
                "Aucun résultat";

            document.getElementById("contenuArticle").innerHTML =
                "Aucun article ne correspond à votre recherche.";

            return;

        }

        const article = resultats[0];

        document.getElementById("numeroArticle").innerHTML =
            article.numero || "";

        document.getElementById("titreArticle").innerHTML =
            article.titre || "";

        document.getElementById("contenuArticle").innerHTML =
            article.contenu || "";

        const ia = document.getElementById("reponseIA");

        if (ia) {

            ia.innerHTML =
                "J'ai trouvé <strong>" +
                resultats.length +
                "</strong> article(s) correspondant à votre recherche.";

        }

    }

    /* ===== Dashboard ===== */

    const zone = document.getElementById("searchResults");

    if (!zone) return;

    zone.innerHTML = "";

    if (resultats.length === 0) {

        zone.innerHTML =
            "<div class='result-card'><h3>Aucun résultat</h3><p>Essayez un autre mot-clé.</p></div>";

        return;

    }

    resultats.forEach(article => {

        zone.innerHTML += `

        <div class="result-card">

            <h3>${article.numero}</h3>

            <strong>${article.titre}</strong>

            <p>${article.contenu}</p>

        </div>

        `;

    });

}

/* Suggestions rapides */

function rechercheRapide(texte) {

    const input =
        document.getElementById("rechercheArticle");

    if (!input) return;

    input.value = texte;

    rechercher();

  }
