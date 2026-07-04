/**
 * utils.js
 * Utilitaires pour l'application InspecteurBot RDC
 */

window.InspecteurUtils = {
    // Afficher une notification toast
    showNotification: function(message, icon = "fa-circle-check") {
        const notif = document.getElementById("notification");
        const text = document.getElementById("notificationText");
        if (!notif || !text) return;

        text.textContent = message;
        const iconEl = notif.querySelector("i");
        if (iconEl) iconEl.className = `fa-solid ${icon}`;

        notif.classList.add("show");
        clearTimeout(this._notifTimer);
        this._notifTimer = setTimeout(() => {
            notif.classList.remove("show");
        }, 3500);
    },

    // Formater la date en français
    formatDateFr: function(date = new Date()) {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return date.toLocaleDateString('fr-FR', options);
    },

    // Formater l'heure (HH:MM:SS)
    formatTime: function(date = new Date()) {
        return date.toLocaleTimeString('fr-FR');
    },

    // Formater le jour de la semaine
    formatDayFr: function(date = new Date()) {
        const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
        return days[date.getDay()];
    },

    // Surligner un mot-clé dans un texte
    highlightText: function(text, query) {
        if (!query || !text) return text;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escaped})`, 'gi');
        return text.replace(regex, '<mark class="search-highlight">$1</mark>');
    },

    // Copier du texte dans le presse-papiers
    copyToClipboard: async function(text, successMessage = "Texte copié avec succès !") {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification(successMessage);
        } catch (err) {
            console.error("Erreur de copie :", err);
            this.showNotification("Impossible de copier le texte.", "fa-triangle-exclamation");
        }
    },

    // Échapper le HTML pour la sécurité
    escapeHtml: function(str) {
        if (!str) return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};
