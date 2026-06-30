/*===========================
 InspecteurBot RDC
 search.js
===========================*/

let articles = [];

/*===========================
 CHARGER LE JSON
===========================*/

async function chargerArticles() {

    try {

        const reponse = await fetch("assets/data/code-travail.json");

        articles = await reponse.json();

        afficher(articles);

    } catch (e) {

        document.getElementById("searchResults").innerHTML =
            "<h3>❌ Impossible de charger le Code du travail.</h3>";

        console.error(e);

    }

}

/*===========================
 RECHERCHE
===========================*/

function rechercher() {

    const mot = document
        .getElementById("searchInput")
        .value
        .toLowerCase()
        .trim();

    if (mot === "") {

        afficher(articles);

        return;

    }

    const resultat = articles.filter(article => {

        const mots = (article.motsCles || []).join(" ").toLowerCase();

        return (

            String(article.numero).includes(mot) ||

            article.titre.toLowerCase().includes(mot) ||

            article.contenu.toLowerCase().includes(mot) ||

            mots.includes(mot)

        );

    });

    afficher(resultat);

}

/*===========================
 AFFICHAGE
===========================*/

function afficher(liste) {

    const zone = document.getElementById("searchResults");

    zone.innerHTML = "";

    if (liste.length === 0) {

        zone.innerHTML = "<h3>Aucun article trouvé.</h3>";

        return;

    }

    liste.forEach(article => {

        zone.innerHTML += `

<div class="article">

<h3>Article ${article.numero}</h3>

<h4>${article.titre}</h4>

<p>${article.contenu}</p>

<button onclick="ouvrirArticle('${article.id}')">

📖 Lire l'article

</button>

</div>

`;

    });

}

/*===========================
 OUVRIR ARTICLE
===========================*/

function ouvrirArticle(id) {

    const article = articles.find(a => a.id === id);

    if (!article) return;

    alert(
        "Article " + article.numero +
        "\n\n" +
        article.titre +
        "\n\n" +
        article.contenu
    );

}

/*===========================
 DÉMARRAGE
===========================*/

document.addEventListener("DOMContentLoaded", () => {

    chargerArticles();

    document
        .getElementById("searchBtn")
        .addEventListener("click", rechercher);

    document
        .getElementById("searchInput")
        .addEventListener("keyup", function(e) {

            if (e.key === "Enter") {

                rechercher();

            }

        });

});
