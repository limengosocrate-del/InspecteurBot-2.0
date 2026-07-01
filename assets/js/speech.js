"use strict";

/*=========================================
 INSPECTEURBOT IA RDC
 RECONNAISSANCE VOCALE V2.0
 Compatible recherche Code du Travail JSON 2.0
=========================================*/


document.addEventListener("DOMContentLoaded",()=>{


    const btnMicro = document.getElementById(
        "btnMicro"
    );


    const input = document.getElementById(
        "rechercheArticle"
    );


    const btnRecherche = document.getElementById(
        "btnRecherche"
    );



    if(
        !btnMicro ||
        !input ||
        !btnRecherche
    ){

        console.log(
            "Éléments vocaux introuvables"
        );

        return;

    }




    const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;



    if(!SpeechRecognition){


        btnMicro.style.display="none";


        console.log(
            "Reconnaissance vocale non disponible"
        );


        return;


    }





    const recognition = new SpeechRecognition();



    recognition.lang = "fr-FR";

    recognition.continuous = false;

    recognition.interimResults = false;




    let enEcoute = false;





    /*===========================
       ACTIVATION MICRO
    ===========================*/


    btnMicro.addEventListener(
    "click",
    ()=>{


        if(enEcoute){

            recognition.stop();

            return;

        }



        try{


            enEcoute = true;


            btnMicro.innerHTML =
            "🔴";


            recognition.start();



        }


        catch(e){


            console.log(e);


        }



    });






    /*===========================
       TEXTE RECONNU
    ===========================*/


    recognition.onresult=(event)=>{


        const texte =

        event.results[0][0].transcript;



        input.value = texte;



        // Lance automatiquement la recherche

        btnRecherche.click();



    };






    /*===========================
       FIN ÉCOUTE
    ===========================*/


    recognition.onend=()=>{


        enEcoute=false;


        btnMicro.innerHTML =
        "🎤";



    };






    /*===========================
       ERREUR
    ===========================*/


    recognition.onerror=(event)=>{


        console.log(
            "Erreur micro :",
            event.error
        );


        enEcoute=false;


        btnMicro.innerHTML =
        "🎤";



    };



});
