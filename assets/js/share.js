/**
 * share.js
 * Partage d'articles et de résultats IA via l'API Web Share, WhatsApp, Email ou Presse-papiers
 */

window.ShareEngine = {
    shareArticle: async function(art) {
        if (!art) return;
        const shareData = {
            title: `Code du Travail RDC — Article ${art.numero}`,
            text: `Découvrez l'Article ${art.numero} du Code du Travail RDC (${art.titre}) :\n\n"${art.contenu.substring(0, 200)}..."\n\nConsulté sur InspecteurBot RDC`,
            url: window.location.href
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
                if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Article partagé avec succès !", "fa-share-nodes");
                return;
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error("Erreur de partage Web Share", err);
                }
            }
        }

        // Repli sur modal ou WhatsApp direct
        const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + " - " + shareData.url)}`;
        window.open(whatsappUrl, "_blank");
        if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Ouverture de WhatsApp pour le partage...", "fa-brands fa-whatsapp");
    },

    openShareModal: function() {
        const art = window.CodeTravailConsultation ? window.CodeTravailConsultation.getCurrentArticle() : null;
        if (art) {
            this.shareArticle(art);
        } else {
            const url = encodeURIComponent(window.location.href);
            const text = encodeURIComponent("InspecteurBot RDC — Bibliothèque juridique intelligente de l'Inspection Générale du Travail de la RDC");
            window.open(`https://api.whatsapp.com/send?text=${text}%20-%20${url}`, "_blank");
        }
    }
};
