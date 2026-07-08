"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 export.js
 Exportation
===================================================*/

/*==================================================
 TÉLÉCHARGER UN FICHIER
===================================================*/

function downloadFile(content, filename, type = "text/plain") {

    const blob = new Blob(
        [content],
        { type: type }
    );

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);

}

/*==================================================
 EXPORT DONNÉES
===================================================*/

function exportData() {

    const data = {

        application:
            "InspecteurBot IA RDC 4.0 Premium",

        date:
            new Date().toLocaleString(),

        version:
            "4.0 Premium"

    };

    downloadFile(

        JSON.stringify(
            data,
            null,
            4
        ),

        "inspecteurbot-export.json",

        "application/json"

    );

    if (typeof showNotification === "function") {

        showNotification(
            "Export",
            "Export terminé avec succès."
        );

    }

}

/*==================================================
 EXPORT TEXTE
===================================================*/

function exportStats() {

    const text = `

INSPECTEURBOT IA RDC 4.0 PREMIUM

Rapport généré le :

${new Date().toLocaleString()}

`;

    downloadFile(

        text,

        "rapport.txt"

    );

}

/*==================================================
 IMPRESSION
===================================================*/

function printReport() {

    window.print();

}

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.exportData = exportData;
window.exportStats = exportStats;
window.printReport = printReport;
