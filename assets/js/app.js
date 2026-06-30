"use strict";

/*===========================
CONFIGURATION
===========================*/

const APP = {
    fichierJSON: "code-travail.json"
};

/*===========================
VARIABLES
===========================*/

let articles = [];

/*===========================
CHARGER LE JSON
===========================*/

async function chargerArticles() {

    try {

        const reponse = await fetch(APP.fichierJSON);

        if (!reponse.ok) {
            throw new Error("Impossible de charger le fichier JSON");
        }

        articles = await reponse.json();

        console.log("Articles chargés :", articles.length);

        rechercher("");

    } catch (e) {

        console.error(e);

        document.getElementById("resultats").innerHTML =
        "<p>Erreur de chargement du Code du travail.</p>";

    }

}

/*===========================
RECHERCHE
===========================*/

function rechercher(mot) {

    mot = mot.toLowerCase().trim();

    if (mot === "") {

        afficher(articles);

        return;

    }

    const resultat = articles.filter(article => {

        const mots = (article.motsCles || []).join(" ").toLowerCase();

        return (

            String(article.numero).includes(mot) ||

            article.titre.toLowerCase().includes(mot) ||

            mots.includes(mot) ||

            article.contenu.toLowerCase().includes(mot)

        );

    });

    afficher(resultat);

}

/*===========================
AFFICHAGE
===========================*/

function afficher(liste) {

    const zone = document.getElementById("resultats");

    zone.innerHTML = "";

    if (liste.length === 0) {

        zone.innerHTML = "<h3>Aucun article trouvé.</h3>";

        return;

    }

    liste.forEach(article => {

        let extrait = article.contenu;

        if (extrait.length > 250) {

            extrait = extrait.substring(0,250) + "...";

        }

        zone.innerHTML += `

        <div class="article">

            <h3>Article ${article.numero}</h3>

            <h4>${article.titre}</h4>

            <p>${extrait}</p>

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

function ouvrirArticle(id){

    const article = articles.find(a => a.id === id);

    if(!article){

        return;

    }

    alert(

        "Article " + article.numero +

        "\n\n" +

        article.titre +

        "\n\n" +

        article.contenu

    );

}

/*===========================
AFFICHAGE
===========================*/

function afficher(liste) {

    const zone = document.getElementById("resultats");

    zone.innerHTML = "";

    if (liste.length === 0) {

        zone.innerHTML = "<p>Aucun résultat.</p>";

        return;

    }

    liste.forEach(article => {

        zone.innerHTML += `

        <div class="article">

            <h3>Article ${article.numero}</h3>

            <h4>${article.titre}</h4>

            <p>${article.contenu}</p>

        </div>

        `;

    });

}

/*===========================
BOUTON RECHERCHE
===========================*/

document.getElementById("btnRecherche")
.addEventListener("click", () => {

    rechercher(

        document.getElementById("recherche").value

    );

});

/*===========================
TOUCHE ENTRÉE
===========================*/

document.getElementById("recherche")
.addEventListener("keyup", e => {

    if (e.key === "Enter") {

        rechercher(e.target.value);

    }

});

/*===========================
DÉMARRAGE
===========================*/

chargerArticles();
