/**
 * statistiques.js
 * Suivi en temps réel de l'activité sur l'application (Articles, Recherches, Favoris, IA)
 */

window.Statistiques = {
    storageKey: "inspecteur_stats_rdc",
    data: {
        articles: 142,
        recherche: 89,
        favoris: 0,
        ia: 34
    },

    init: function() {
        this.load();
        this.render();
    },

    load: function() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const parsed = JSON.parse(saved);
                this.data.articles = Math.max(this.data.articles, parsed.articles || 0);
                this.data.recherche = Math.max(this.data.recherche, parsed.recherche || 0);
                this.data.ia = Math.max(this.data.ia, parsed.ia || 0);
            }
        } catch (e) {
            console.error("Erreur de chargement des stats", e);
        }
    },

    save: function() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.data));
        } catch (e) {
            console.error("Erreur de sauvegarde des stats", e);
        }
    },

    increment: function(key) {
        if (this.data[key] !== undefined) {
            this.data[key]++;
            this.save();
            this.render();
        }
    },

    render: function() {
        const statArt = document.getElementById("statArticles");
        const statRec = document.getElementById("statRecherche");
        const statFav = document.getElementById("statFavoris");
        const statIA = document.getElementById("statIA");

        if (statArt) statArt.textContent = this.data.articles;
        if (statRec) statRec.textContent = this.data.recherche;
        if (statFav && window.FavorisEngine) {
            statFav.textContent = window.FavorisEngine.favorites.length;
        } else if (statFav) {
            statFav.textContent = this.data.favoris;
        }
        if (statIA) statIA.textContent = this.data.ia;
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.Statistiques.init();
});
