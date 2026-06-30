/*=========================================
 INSPECTEURBOT IA
 RECONNAISSANCE VOCALE
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const btnMicro = document.getElementById("btnMicro");
    const input = document.getElementById("rechercheArticle");

    if (!btnMicro || !input) return;

    if (!("webkitSpeechRecognition" in window) &&
        !("SpeechRecognition" in window)) {

        alert("Votre navigateur ne prend pas en charge la reconnaissance vocale.");
        return;
    }

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    btnMicro.addEventListener("click", () => {

        recognition.start();

    });

    recognition.onresult = (event) => {

        const texte = event.results[0][0].transcript;

        input.value = texte;

        if (typeof rechercheIA === "function") {

            rechercheIA(texte);

        } else if (typeof ragSearch === "function") {

            document.getElementById("btnRecherche").click();

        }

    };

    recognition.onerror = (event) => {

        console.log(event.error);

    };

});
