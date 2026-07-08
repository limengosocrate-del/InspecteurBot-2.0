"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 assistant.js
 Assistant IA
===================================================*/

/*==================================================
 OUVERTURE DE L'ASSISTANT IA
===================================================*/

function openAssistant() {

    const assistantPage = "ia/assistant.html";

    if (window.location.pathname.endsWith(assistantPage)) {

        showNotification(
            "Assistant IA",
            "Assistant déjà ouvert."
        );

        return;
    }

    window.location.href = assistantPage;

}

/*==================================================
 QUESTIONS RAPIDES
===================================================*/

function askAssistant(question) {

    if (!question) return;

    logAction(
        "Question IA : " + question
    );

    showNotification(
        "Assistant IA",
        "Recherche : " + question
    );

}

/*==================================================
 RECHERCHE IA
===================================================*/

function searchAssistant() {

    const input =
        document.getElementById("searchInput");

    if (!input) return;

    const question =
        input.value.trim();

    if (question === "") {

        showNotification(
            "Assistant IA",
            "Veuillez saisir une recherche."
        );

        return;
    }

    askAssistant(question);

}

/*==================================================
 INITIALISATION
===================================================*/

function initAssistant() {

    const btnAssistant =
        document.getElementById("btnAssistant");

    if (!btnAssistant) return;

    btnAssistant.addEventListener(
        "click",
        openAssistant
    );

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initAssistant();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.openAssistant = openAssistant;
window.askAssistant = askAssistant;
