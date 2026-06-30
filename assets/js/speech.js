/*=========================================
 INSPECTEURBOT IA
 RECONNAISSANCE VOCALE V2.0
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    const btnMicro = document.getElementById("btnMicro");
    const input = document.getElementById("rechercheArticle");
    const btnRecherche = document.getElementById("btnRecherche");

    if (!btnMicro || !input || !btnRecherche) return;

    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert("La reconnaissance vocale n'est pas prise en charge par votre navigateur.");

        return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.continuous = false;
    recognition.interimResults = false;

    btnMicro.addEventListener("click", () => {

        btnMicro.innerHTML = "🎙️";

        recognition.start();

    });

    recognition.onresult = (event) => {

        const texte = event.results[0][0].transcript;

        input.value = texte;

        btnRecherche.click();

    };

    recognition.onend = () => {

        btnMicro.innerHTML = "🎤";

    };

    recognition.onerror = (event) => {

        console.log(event.error);

        btnMicro.innerHTML = "🎤";

    };

});
