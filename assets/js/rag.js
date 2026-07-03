"use strict";

/*==================================================
INSPECTEURBOT RDC
RAG ENGINE V3.0
Compatible code-travail.json
==================================================*/

const RAG = {};

window.RAG = RAG;

RAG.articles = [];

/*==================================================
CHARGEMENT
==================================================*/

RAG.charger = async function () {

    if (this.articles.length > 0) {

        return this.articles;

    }

    try {

        const response = await fetch(
            "assets/data/code-travail.json"
        );

        this.articles = await response.json();

        console.log(
            "Code du Travail chargé :",
            this.articles.length,
            "articles"
        );

    }

    catch (e) {

        console.error(e);

        this.articles = [];

    }

    return this.articles;

};

/*==================================================
NORMALISATION
==================================================*/

RAG.normaliser = function (texte) {

    return String(texte || "")

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g, "")

        .trim();

};

/*==================================================
RECHERCHE RAG
==================================================*/

RAG.rechercher = async function (question) {

    await this.charger();

    if (this.articles.length === 0) {

        return [];

    }

    const recherche =
        this.normaliser(question);

    const mots =
        recherche.split(/\s+/);

    let resultat = [];

    this.articles.forEach(article => {

        let score = 0;

        const texte =

            this.normaliser(article.numero) + " " +

            this.normaliser(article.titre) + " " +

            this.normaliser(article.categorie) + " " +

            this.normaliser(article.contenu) + " " +

            this.normaliser(
                (article.motsCles || []).join(" ")
            ) + " " +

            this.normaliser(article.sanction) + " " +

            this.normaliser(
                (article.questionsIA || []).join(" ")
            );

        if (

            recherche.startsWith("article") &&

            texte.includes(recherche.replace("article","").trim())

        ) {

            score += 100;

        }

        mots.forEach(mot => {

            if (mot.length < 2) return;

            if (texte.includes(mot))

                score += 10;

        });

        if (score > 0) {

            resultat.push({

                score,

                article

            });

        }

    });

    resultat.sort(

        (a,b)=>b.score-a.score

    );

    return resultat;

};

/*==================================================
RÉPONSE HTML
==================================================*/

RAG.genererHTML = async function (question) {

    const resultat =
        await this.rechercher(question);

    if (resultat.length === 0) {

        return `

<div class="article-card">

<h3>Aucun résultat</h3>

<p>

Aucun article trouvé.

</p>

</div>

`;

    }

    let html = "";

    resultat.slice(0,5).forEach(item => {

        const a = item.article;

        html += `

<div class="article-card">

<div class="article-number">

Article ${a.numero}

</div>

<h3 class="article-title">

${a.titre}

</h3>

<div class="article-category">

${a.categorie}

</div>

<div class="article-content">

${a.contenu}

</div>

${

a.sanction ?

`<div class="article-sanction">

<b>Sanction :</b><br>

${a.sanction}

</div>`

:

""

}

</div>

`;

    });

    return html;

};

/*==================================================
RECHERCHE SIMPLE
==================================================*/

window.ragSearch = async function (question) {

    return await RAG.genererHTML(question);

};

console.log("RAG Engine V3 chargé.");
