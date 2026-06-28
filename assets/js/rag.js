/*=========================================
 INSPECTEURBOT IA
 RAG ENGINE V2.0
==========================================*/

let ARTICLES = [];

/* Chargement des articles */

async function chargerArticles() {

    if (ARTICLES.length > 0) return ARTICLES;

    try {

        const response = await fetch("assets/data/code-travail.json");

        ARTICLES = await response.json();

        console.log("Articles chargés :", ARTICLES.length);

        return ARTICLES;

    } catch (e) {

        console.error("Erreur chargement JSON :", e);

        return [];

    }

}

/* Normalisation */

function normaliser(texte) {

    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}

/* Recherche intelligente */

async function ragSearch(question) {

    await chargerArticles();

    if (ARTICLES.length === 0) {

        return `
        <div class="result-card">
            <h3>Aucune donnée</h3>
            <p>Le fichier code-travail.json est vide.</p>
        </div>
        `;

    }

    const recherche = normaliser(question);

    let resultat = [];

    ARTICLES.forEach(article => {

        const numero = normaliser(article.numero || "");
        const titre = normaliser(article.titre || "");
        const contenu = normaliser(article.contenu || "");

        let score = 0;

        if (numero.includes(recherche))
            score += 100;

        if (titre.includes(recherche))
            score += 60;

        if (contenu.includes(recherche))
            score += 40;

        recherche.split(" ").forEach(mot => {

            if (titre.includes(mot))
                score += 15;

            if (contenu.includes(mot))
                score += 10;

        });

        if (score > 0) {

            resultat.push({
                score,
                article
            });

        }

    });

    resultat.sort((a,b)=>b.score-a.score);

    if(resultat.length===0){

        return `
        <div class="result-card">

            <h3>Aucun résultat</h3>

            <p>
            Aucun article trouvé pour :
            <strong>${question}</strong>
            </p>

        </div>
        `;

    }

    let html="";

    resultat.slice(0,5).forEach(item=>{

        html+=`

<div class="article-card">

<div class="article-number">
${item.article.numero}
</div>

<h3 class="article-title">
${item.article.titre}
</h3>

<div class="article-content">
${item.article.contenu}
</div>

</div>

`;

    });

    return html;

       }
