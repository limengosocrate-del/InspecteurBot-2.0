/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 calendar.js
 Gestion agenda missions
===================================================*/

"use strict";


function initCalendar(){


    createCalendarButton();


}



function createCalendarButton(){


    const footer =
        document.querySelector(".footer");


    if(!footer) return;



    const button =
        document.createElement("button");


    button.textContent =
        "📅 Agenda missions";


    button.className =
        "calendar-btn";



    footer.appendChild(button);



    button.addEventListener(
        "click",
        openCalendar
    );


}



/*==================================================
 OUVRIR AGENDA
===================================================*/

function openCalendar(){


    const db =
        getDatabase();



    const missions =
        db ? db.missions : [];



    const box =
        document.createElement("div");


    box.className =
        "calendar-box";



    box.innerHTML = `

    <h2>
    📅 Agenda des missions
    </h2>


    <button id="closeCalendar">
    Fermer
    </button>


    <hr>


    ${
        missions.length

        ?

        missions.map(m=>`

        <p>

        📌 ${m.entreprise || "Entreprise"}

        <br>

        ${m.date || ""}

        <br>

        Statut :
        ${m.statut || "Prévue"}

        </p>

        `).join("")

        :

        "<p>Aucune mission enregistrée</p>"

    }


    `;



    document.body.appendChild(
        box
    );



    document
    .getElementById(
        "closeCalendar"
    )
    .onclick =
    ()=>{

        box.remove();

    };


}



/*==================================================
 AJOUT RAPIDE MISSION
===================================================*/

function createMissionQuick(){


    const entreprise =
        prompt(
            "Nom de l'entreprise"
        );


    if(!entreprise)
    return;



    addMission({

        entreprise:
        entreprise,


        statut:
        "Prévue",


        date:
        new Date().toLocaleDateString()

    });



    showMessage(
        "Mission ajoutée",
        "success"
    );


}



document.addEventListener(
"DOMContentLoaded",
()=>{

    initCalendar();

});
