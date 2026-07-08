"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 voice.js
 Reconnaissance + Synthèse vocale
===================================================*/

let recognition = null;

/*==================================================
 INITIALISATION VOIX
===================================================*/

function initVoice() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        console.warn(
            "Reconnaissance vocale non disponible."
        );

        return;
    }

    recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {

        const btn =
            document.getElementById("btnVoice");

        if (btn) {

            btn.textContent =
                "🎙 Écoute...";

        }

        if (typeof showNotification === "function") {

            showNotification(
                "Voix",
                "Parlez maintenant..."
            );

        }

    };

    recognition.onend = () => {

        const btn =
            document.getElementById("btnVoice");

        if (btn) {

            btn.textContent =
                "🎙 Voix";

        }

    };

    recognition.onerror = (event) => {

        console.error(event);

        if (typeof showNotification === "function") {

            showNotification(
                "Voix",
                "Erreur de reconnaissance vocale"
            );

        }

    };

    recognition.onresult = (event) => {

        const text =
            event.results[0][0].transcript;

        executeVoiceCommand(text);

    };

}

/*==================================================
 DEMARRER ECOUTE
===================================================*/

function startListening() {

    if (recognition) {

        recognition.start();

    }

}

/*==================================================
 COMPATIBILITÉ AVEC app.js
===================================================*/

function startVoice() {

    startListening();

}

/*==================================================
 COMMANDES VOCALES
===================================================*/

function executeVoiceCommand(command) {

    command =
        command.toLowerCase();

    const search =
        document.getElementById(
            "searchInput"
        );

    if (command.includes("cherche")) {

        const text =
            command.replace(
                "cherche",
                ""
            ).trim();

        if (search) {

            search.value = text;

            search.dispatchEvent(
                new Event("input")
            );

        }

        speak(
            "Recherche de " + text
        );

        return;

    }

    if (command.includes("thème sombre")) {

        if (typeof toggleTheme === "function") {

            toggleTheme();

        }

        speak(
            "Mode sombre activé"
        );

        return;

    }

    if (command.includes("bonjour")) {

        speak(
            "Bonjour Inspecteur. Je suis prêt."
        );

        return;

    }

    speak(
        "Commande non reconnue"
    );

}

/*==================================================
 SYNTHESE VOCALE
===================================================*/

function speak(text) {

    if (!("speechSynthesis" in window))
        return;

    const message =
        new SpeechSynthesisUtterance(text);

    message.lang = "fr-FR";
    message.rate = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(message);

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initVoice();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.startVoice = startVoice;
window.startListening = startListening;
window.speak = speak;
window.executeVoiceCommand = executeVoiceCommand;
