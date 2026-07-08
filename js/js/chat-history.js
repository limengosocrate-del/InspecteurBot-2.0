"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 chat-history.js
 Historique des conversations IA
===================================================*/

/*==================================================
 INITIALISATION
===================================================*/

function initChatHistory() {

    if (!Storage.get("chatHistory")) {

        Storage.save(
            "chatHistory",
            []
        );

    }

}

/*==================================================
 AJOUTER UN MESSAGE
===================================================*/

function saveChat(role, message) {

    const history =
        Storage.get("chatHistory") || [];

    history.push({

        role: role,

        message: message,

        date: new Date().toLocaleString()

    });

    Storage.save(
        "chatHistory",
        history
    );

}

/*==================================================
 OUVRIR L'HISTORIQUE
===================================================*/

function openHistory() {

    const old =
        document.getElementById(
            "historyBox"
        );

    if (old) {

        old.remove();

    }

    const history =
        Storage.get("chatHistory") || [];

    const box =
        document.createElement("div");

    box.id = "historyBox";
    box.className = "history-box";

    let html = `

        <h2>💬 Historique IA</h2>

    `;

    if (history.length === 0) {

        html += `

            <p>Aucune conversation enregistrée.</p>

        `;

    } else {

        history.forEach(item => {

            html += `

                <p>

                <strong>${item.role}</strong>

                <br>

                ${item.message}

                <br>

                <small>${item.date}</small>

                </p>

                <hr>

            `;

        });

    }

    html += `

        <button id="closeHistory">

        Fermer

        </button>

    `;

    box.innerHTML = html;

    document.body.appendChild(box);

    document
        .getElementById("closeHistory")
        .addEventListener(
            "click",
            () => {

                box.remove();

            }
        );

}

/*==================================================
 SUPPRIMER L'HISTORIQUE
===================================================*/

function clearHistory() {

    Storage.save(
        "chatHistory",
        []
    );

    if (typeof showNotification === "function") {

        showNotification(
            "Historique",
            "Historique supprimé."
        );

    }

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initChatHistory();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.saveChat = saveChat;
window.openHistory = openHistory;
window.clearHistory = clearHistory;
