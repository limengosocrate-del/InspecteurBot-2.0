"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 calendar.js
 Gestion Agenda
===================================================*/

/*==================================================
 INITIALISATION
===================================================*/

function initCalendar() {

    console.log("Agenda chargé.");

}

/*==================================================
 OUVRIR AGENDA
===================================================*/

function openCalendar() {

    const oldBox =
        document.getElementById("calendarBox");

    if (oldBox) {

        oldBox.remove();

    }

    const box =
        document.createElement("div");

    box.id = "calendarBox";
    box.className = "calendar-box";

    box.innerHTML = `

        <h2>📅 Agenda des missions</h2>

        <p>
        Cette fonctionnalité est disponible.
        </p>

        <button id="closeCalendar">
        Fermer
        </button>

    `;

    document.body.appendChild(box);

    document
        .getElementById("closeCalendar")
        .addEventListener(
            "click",
            () => {

                box.remove();

            }
        );

}

/*==================================================
 AJOUT MISSION
===================================================*/

function createMissionQuick() {

    const entreprise =
        prompt(
            "Nom de l'entreprise"
        );

    if (!entreprise)
        return;

    if (typeof showNotification === "function") {

        showNotification(
            "Agenda",
            "Mission enregistrée : " + entreprise
        );

    }

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initCalendar();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.openCalendar = openCalendar;
window.createMissionQuick = createMissionQuick;
