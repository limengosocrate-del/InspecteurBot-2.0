/*====================================================
 INSPECTEURBOT IA RDC
 vectorSearch.js
 Moteur de recherche intelligent
====================================================*/

class VectorSearch {

    constructor() {
        this.articles = [];
    }

    setData(data) {
        this.articles = Array.isArray(data) ? data : [];
    }

    normalize(text) {
        return (text || "")
            .toString()
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    score(article, query) {

        const q = this.normalize(query);

        let score = 0;

        const numero = this.normalize(article.numero);
        const titre = this.normalize(article.titre);
        const contenu = this.normalize(article.contenu);

        if (numero.includes(q))
            score += 100;

        if (titre.includes(q))
            score += 60;

        if (contenu.includes(q))
            score += 30;

        const mots = q.split(/\s+/);

        mots.forEach(mot => {

            if (titre.includes(mot))
                score += 15;

            if (contenu.includes(mot))
                score += 8;

        });

        return score;
    }

    search(query) {

        if (!query || query.trim() === "")
            return [];

        return this.articles
            .map(article => ({
                article,
                score: this.score(article, query)
            }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.article);

    }

}

window.vectorSearch = new VectorSearch();
