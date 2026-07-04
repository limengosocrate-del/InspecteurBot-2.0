/**
 * print.js
 * Impression d'un article ou de la page avec en-tête officiel de l'Inspection Générale du Travail RDC
 */

window.PrintEngine = {
    printArticle: function(art) {
        if (!art) return;
        
        const printWindow = window.open("", "_blank", "width=800,height=900");
        if (!printWindow) {
            if (window.InspecteurUtils) window.InspecteurUtils.showNotification("Veuillez autoriser les popups pour imprimer.", "fa-print");
            return;
        }

        const dateStr = new Date().toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', year: 'numeric' });

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <title>Impression — Article ${art.numero} | Code du Travail RDC</title>
            <style>
                body { font-family: 'Times New Roman', Times, serif; color: #000; padding: 40px; line-height: 1.6; }
                .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                .header h1 { font-size: 20px; text-transform: uppercase; margin: 0; }
                .header h2 { font-size: 16px; margin: 5px 0; font-weight: normal; }
                .header h3 { font-size: 14px; font-style: italic; margin: 0; }
                .meta { font-size: 12px; text-align: right; margin-bottom: 20px; color: #444; }
                .article-box { border-left: 4px solid #000; padding-left: 20px; margin-bottom: 30px; }
                .article-num { font-size: 18px; font-weight: bold; text-decoration: underline; margin-bottom: 10px; }
                .article-title { font-size: 22px; font-weight: bold; margin-bottom: 15px; }
                .article-content { font-size: 16px; text-align: justify; white-space: pre-line; }
                .sanction-box { border: 1px dashed #000; padding: 15px; margin-top: 25px; background: #f9f9f9; }
                .sanction-title { font-weight: bold; margin-bottom: 5px; }
                .footer { margin-top: 50px; font-size: 11px; text-align: center; border-top: 1px solid #ccc; padding-top: 15px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>République Démocratique du Congo</h1>
                <h2>Ministère du Travail et de la Prévoyance Sociale</h2>
                <h3>Inspection Générale du Travail — InspecteurBot RDC</h3>
            </div>
            <div class="meta">
                Document extrait le ${dateStr} à Kinshasa<br>
                Référence légale : Loi n° 015-2002 modifiée par la Loi n° 16/010
            </div>
            <div class="article-box">
                <div class="article-num">ARTICLE ${art.numero}</div>
                <div class="article-title">${art.titre}</div>
                <div class="article-content">${art.contenu}</div>
            </div>
            ${art.sanction ? `
            <div class="sanction-box">
                <div class="sanction-title">⚠️ Sanctions légales prévues :</div>
                <div>${art.sanction}</div>
            </div>` : ''}
            <div class="footer">
                Ce document est généré par InspecteurBot RDC, la bibliothèque juridique intelligente pour les Inspecteurs du Travail.<br>
                © 2026 Inspection Générale du Travail de la République Démocratique du Congo.
            </div>
            <script>
                window.onload = function() {
                    window.print();
                    setTimeout(function() { window.close(); }, 500);
                };
            </script>
        </body>
        </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
    },

    printCurrentPage: function() {
        const art = window.CodeTravailConsultation ? window.CodeTravailConsultation.getCurrentArticle() : null;
        if (art) {
            this.printArticle(art);
        } else {
            window.print();
        }
    }
};
