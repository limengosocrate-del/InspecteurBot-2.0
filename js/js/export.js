/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 export.js
 Exportation et impression
===================================================*/

"use strict";


/*==================================================
 TELECHARGER UN FICHIER
===================================================*/

function downloadFile(
    content,
    filename,
    type="text/plain"
){


    const blob =
        new Blob(
            [content],
            {
                type:type
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href=url;


    link.download=
        filename;


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();


    URL.revokeObjectURL(
        url
    );


}



/*==================================================
 EXPORT DONNEES APPLICATION
===================================================*/

function exportData(){


    const data = {


        application:
        "InspecteurBot IA RDC 4.0 Premium",


        date:
        new Date(),


        statistiques:
        Storage.get(
            "stats"
        ),


        historique:
        Storage.get(
            "logs"
        ),


        recherches:
        Storage.get(
            "searchHistory"
        )

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



    showMessage(
        "Export terminé",
        "success"
    );


}



/*==================================================
 EXPORT STATISTIQUES
===================================================*/

function exportStats(){


    const stats =
        Storage.get(
            "stats"
        );


    if(!stats){

        showMessage(
            "Aucune statistique disponible",
            "error"
        );

        return;

    }



    const text = `

INSPECTEURBOT IA RDC 4.0 PREMIUM

RAPPORT STATISTIQUE

Date :
${new Date().toLocaleString()}


Visites :
${stats.visits}


Formulaires ouverts :
${stats.cardsOpened}


Recherches :
${stats.searches}


`;



    downloadFile(

        text,

        "rapport-statistique.txt"

    );


}



/*==================================================
 IMPRESSION PROFESSIONNELLE
===================================================*/

function printReport(){


    window.print();



    logAction(
        "Impression rapport"
    );


}



/*==================================================
 CREATION BOUTONS EXPORT
===================================================*/

function createExportButtons(){


    const footer =
        document.querySelector(
            ".footer"
        );


    if(!footer) return;



    const box =
        document.createElement(
            "div"
        );


    box.className=
        "export-buttons";



    box.innerHTML = `


        <button id="exportDataBtn">

        📥 Export Données

        </button>


        <button id="exportStatsBtn">

        📊 Export Stats

        </button>


        <button id="printBtn">

        🖨 Imprimer

        </button>


    `;



    footer.appendChild(
        box
    );



    document
    .getElementById(
        "exportDataBtn"
    )
    .onclick =
        exportData;



    document
    .getElementById(
        "exportStatsBtn"
    )
    .onclick =
        exportStats;



    document
    .getElementById(
        "printBtn"
    )
    .onclick =
        printReport;


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    createExportButtons();


});
