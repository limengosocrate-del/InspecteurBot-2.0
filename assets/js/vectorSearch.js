/**
 * vectorSearch.js
 * Moteur de recherche vectorielle sémantique simulé pour le Code du Travail RDC
 * Permet de relier des concepts sans correspondance de mots exacte (ex: "chasser un ouvrier" -> "licenciement")
 */

window.VectorSearchEngine = {
    // Concept embeddings simplifiés pour la sémantique juridique congolaise
    semanticMap: {
        "licenciement": ["renvoi", "chasser", "virer", "rupture", "fin de contrat", "préavis", "indemnité", "abusif", "faute lourde"],
        "salaire": ["rémunération", "argent", "paie", "smig", "bulletin", "virement", "retard de salaire", "primes"],
        "congé": ["vacances", "repos", "pécule", "détente", "jours fériés", "absence"],
        "maternité": ["enceinte", "grossesse", "accouchement", "allaitement", "femme", "bébé"],
        "sécurité": ["accident", "blessure", "hôpital", "casque", "gants", "epi", "danger", "machine", "cnss"],
        "syndicat": ["délégué", "grève", "revendication", "élection", "représentant", "protection"],
        "inspection": ["inspecteur", "contrôleur", "visite", "pv", "amende", "infraction", "tribunal", "conciliation"],
        "enfant": ["mineur", "15 ans", "16 ans", "école", "mines", "exploitation", "pires formes"]
    },

    // Calcule un score de similarité vectorielle (Cosine similarity approchée)
    searchSemantic: function(query) {
        if (!query || !window.CodeTravailState.articles) return [];
        const lower = query.toLowerCase();
        
        // Identifier les concepts sémantiques activés
        const activeConcepts = [];
        Object.keys(this.semanticMap).forEach(concept => {
            if (lower.includes(concept)) activeConcepts.push(concept);
            this.semanticMap[concept].forEach(synonym => {
                if (lower.includes(synonym)) activeConcepts.push(concept);
            });
        });

        if (activeConcepts.length === 0) return [];

        // Scorer les articles par similarité sémantique
        const scoredArticles = window.CodeTravailState.articles.map(art => {
            let score = 0;
            const contentLower = (art.titre + " " + art.contenu + " " + (art.motsCles || []).join(" ")).toLowerCase();

            activeConcepts.forEach(concept => {
                if (contentLower.includes(concept)) score += 10;
                this.semanticMap[concept].forEach(syn => {
                    if (contentLower.includes(syn)) score += 5;
                });
            });

            return { article: art, score: score };
        });

        // Trier par score décroissant et retourner les meilleurs
        return scoredArticles
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score)
            .map(item => item.article);
    }
};
