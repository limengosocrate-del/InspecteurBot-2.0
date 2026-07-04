/**
 * rag.js
 * Pipeline RAG (Retrieval-Augmented Generation) pour l'Assistant IA
 * Sélectionne les articles pertinents comme contexte avant génération de réponse
 */

window.RAGEngine = {
    // Récupérer le contexte juridique optimal pour une question
    retrieveContext: function(question) {
        if (!question) return { contextText: "", articles: [] };

        // 1. Recherche par mots-clés standard
        let articles = window.CodeTravailState.articles.filter(art => {
            const qLower = question.toLowerCase();
            return art.titre.toLowerCase().includes(qLower) || 
                   art.contenu.toLowerCase().includes(qLower) ||
                   (art.motsCles && art.motsCles.some(k => qLower.includes(k.toLowerCase())));
        });

        // 2. Si pas assez d'articles, utiliser la recherche vectorielle sémantique
        if (articles.length < 2 && window.VectorSearchEngine) {
            const semanticResults = window.VectorSearchEngine.searchSemantic(question);
            semanticResults.forEach(art => {
                if (!articles.includes(art)) articles.push(art);
            });
        }

        // Limiter au top 3 articles les plus pertinents
        const topArticles = articles.slice(0, 3);
        const contextText = topArticles.map(a => `[Article ${a.numero}: ${a.titre}]\n${a.contenu}\n${a.sanction ? 'Sanctions légales: ' + a.sanction : ''}`).join("\n\n---\n\n");

        return {
            contextText: contextText,
            articles: topArticles
        };
    }
};
