/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 report.js
 Gestion des rapports d'inspection
===================================================*/

"use strict";


/*==================================================
 CREER UN RAPPORT
===================================================*/

function createReport(data={}){


    const report = {


        id:
        Date.now(),


        entreprise:
        data.entreprise || "Non renseignée",


        inspecteur:
        data.inspecteur || "Non renseigné",


        objet:
        data.objet || "Contrôle inspection",


        observations:
        data.observations || "",


        recommandations:
        data.recommandations || "",


        date:
        new Date()


    };



    if(typeof addRapport==="function"){


        addRapport(
            report
        );


    }



    return report;


}



/*==================================================
 AFFICHER RAPPORT
===================================================*/

function displayReport(report){


    const box =
    document.createElement(
        "div"
    );


    box.className =
    "report-preview";



    box.innerHTML = `


<h2>
📋 Rapport d'inspection
</h2>


<b>Entreprise :</b>
${report.entreprise}


<br><br>


<b>Inspecteur :</b>
${report.inspecteur}


<br><br>


<b>Objet :</b>
${report.objet}


<br><br>


<b>Observations :</b>

<p>
${report.observations}
</p>


<b>Recommandations :</b>

<p>
${report.recommandations}
</p>


<hr>


Date :
${new Date(report.date).toLocaleString()}


<button onclick="printReport()">

🖨 Imprimer

</button>


`;



    document.body.appendChild(
        box
    );


}



/*==================================================
 GENERER RAPPORT DEPUIS OCR
===================================================*/

function reportFromOCR(){


    const text =
    Storage.get(
        "lastOCR"
    );



    if(!text){


        showMessage(
            "Aucun document OCR disponible",
            "error"
        );


        return;


    }



    const report =
    createReport({

        objet:
        "Analyse document OCR",


        observations:
        text


    });



    displayReport(
        report
    );


}



/*==================================================
 EXPORT TEXTE RAPPORT
===================================================*/

function exportReport(report){


    const content = `


INSPECTEURBOT IA RDC 4.0 PREMIUM

RAPPORT D'INSPECTION


Entreprise :
${report.entreprise}


Inspecteur :
${report.inspecteur}


Objet :
${report.objet}


Observations :
${report.observations}


Recommandations :
${report.recommandations}


Date :
${report.date}



`;



    downloadFile(

        content,

        "rapport-inspection.txt"

    );


}



/*==================================================
 INITIALISATION
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


console.log(
"Module rapport chargé"
);


});
