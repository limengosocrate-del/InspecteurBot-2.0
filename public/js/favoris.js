/**
 * favoris.js
 * Gestion des articles favoris dans le localStorage du navigateur
 */

window.FavorisEngine = {
    storageKey: "inspecteur_favoris_rdc",
    favorites: [],

    init: function() {
        this.loadFavorites();
    },

    loadFavorites: function() {
        try {
            const data = localStorage.getItem(this.storageKey);
            this.favorites = data ? JSON.parse(data) : [];
        } catch (e) {
            this.favorites = [];
        }
        this.updateStats();
    },

    saveFavorites: function() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.favorites));
            this.updateStats();
        } catch (e) {
            console.error("Erreur de sauvegarde des favoris", e);
        }
    },

    isFavorite: function(articleId) {
        return this.favorites.some(f => f.id === articleId);
    },

    toggleFavorite: function(art) {
        if (!art) return;
        if (this.isFavorite(art.id)) {
            this.favorites = this.favorites.filter(f => f.id !== art.id);
            if (window.InspecteurUtils) window.InspecteurUtils.showNotification(`Article ${art.numero} retiré des favoris`, "fa-star");
        } else {
            this.favorites.push({ id: art.id, numero: art.numero, titre: art.titre, categorie: art.categorie, dateAjout: new Date().toISOString() });
            if (window.InspecteurUtils) window.InspecteurUtils.showNotification(`Article ${art.numero} ajouté aux favoris ⭐`, "fa-star");
        }
        this.saveFavorites();
        this.updateButtonState(art);
    },

    updateButtonState: function(art) {
        const btnFav = document.getElementById("btnFavoriArticle");
        if (!btnFav || !art) return;

        if (this.isFavorite(art.id)) {
            btnFav.style.background = "#FFD700";
            btnFav.style.color = "#041c5c";
            btnFav.innerHTML = `<i class="fa-solid fa-star"></i> Favoris ⭐`;
        } else {
            btnFav.style.background = "";
            btnFav.style.color = "";
            btnFav.innerHTML = `<i class="fa-regular fa-star"></i> Favoris`;
        }
    },

    updateStats: function() {
        const statFav = document.getElementById("statFavoris");
        if (statFav) statFav.textContent = this.favorites.length;
    },

    showFavoritesModal: function() {
        if (this.favorites.length === 0) {
            if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Aucun article favori enregistré pour le moment.", "fa-circle-info");
            return;
        }

        let msg = `⭐ Vos Articles Favoris (${this.favorites.length}) :\n\n`;
        this.favorites.forEach((f, i) => {
            msg += `${i + 1}. Article ${f.numero} — ${f.titre}\n`;
        });
        alert(msg);
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.FavorisEngine.init();
});
