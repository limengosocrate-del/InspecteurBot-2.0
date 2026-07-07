/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 voice.js
 Reconnaissance + Synthèse vocale
===================================================*/

"use strict";


let recognition;


/*==================================================
 INITIALISATION VOIX
===================================================*/

function initVoice(){


    const btnVoice =
        document.getElementById(
            "btnVoice"
        );


    if(!btnVoice) return;



    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;



    if(!SpeechRecognition){


        btnVoice.disabled = true;


        btnVoice.title =
            "Reconnaissance vocale non disponible";


        return;

    }



    recognition =
        new SpeechRecognition();



    recognition.lang =
        "fr-FR";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;



    btnVoice.addEventListener(
        "click",
        startListening
    );



    recognition.onstart = ()=>{


        btnVoice.textContent =
            "🎙 Écoute...";


        showMessage(
            "Parlez maintenant..."
        );


    };



    recognition.onend = ()=>{


        btnVoice.textContent =
            "🎙 Voix";


    };



    recognition.onerror = (error)=>{


        console.error(error);


        showMessage(
            "Erreur de reconnaissance vocale",
            "error"
        );


    };



    recognition.onresult = (event)=>{


        const text =
            event.results[0][0]
            .transcript;



        executeVoiceCommand(
            text
        );


    };


}



/*==================================================
 DEMARRER ECOUTE
===================================================*/

function startListening(){


    if(recognition){


        recognition.start();


    }

}



/*==================================================
 COMMANDES VOCALES
===================================================*/

function executeVoiceCommand(command){


    command =
        command.toLowerCase();



    logAction(
        "Commande vocale : "
        + command
    );



    const search =
        document.getElementById(
            "searchInput"
        );



    if(
        command.includes(
            "cherche"
        )
    ){


        const text =
            command.replace(
                "cherche",
                ""
            ).trim();



        if(search){


            search.value =
                text;


            search.dispatchEvent(
                new Event("input")
            );


        }


        speak(
            "Recherche de " + text
        );


        return;

    }



    if(
        command.includes(
            "thème sombre"
        )
    ){


        toggleTheme();


        speak(
            "Mode sombre activé"
        );


        return;

    }



    if(
        command.includes(
            "bonjour"
        )
    ){


        speak(
            "Bonjour Inspecteur. InspecteurBot IA RDC est prêt."
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

function speak(text){


    if(
        !("speechSynthesis" in window)
    )

    return;



    const message =
        new SpeechSynthesisUtterance(
            text
        );



    message.lang =
        "fr-FR";


    message.rate =
        1;



    window.speechSynthesis.cancel();


    window.speechSynthesis.speak(
        message
    );


}



/*==================================================
 TEST VOCAL AU CHARGEMENT
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initVoice();


});
