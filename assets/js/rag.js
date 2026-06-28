/*====================================================
 INSPECTEURBOT IA RDC
 rag.js
 Chargement intelligent du Code du Travail
====================================================*/

class RAG {

    constructor() {
        this.data = [];
    }

    async load() {

        try {

            const response = await fetch("assets/data/code-travail.json");

            this.data = await response.json();

            if (window.vectorSearch) {
                window.vectorSearch.setData(this.data);
            }

            console.log("✅ Code du Travail chargé :", this.data.length, "articles");

        } catch (e) {

            console.error("Erreur de chargement :", e);

        }

    }

    rechercher(question) {

        if (!window.vectorSearch)
            return [];

        return window.vectorSearch.search(question);

    }

}

window.rag = new RAG();

window.addEventListener("DOMContentLoaded", () => {
    window.rag.load();
});
