/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 assistant.js
 Assistant intelligent local
===================================================*/

"use strict";


let assistantBox = null;


/*==================================================
 INITIALISATION ASSISTANT
===================================================*/

function initAssistant(){


    const btnAssistant =
        document.getElementById(
            "btnAssistant"
        );


    if(!btnAssistant) return;



    btnAssistant.addEventListener(
        "click",
        openAssistant
    );


}



/*==================================================
 CREATION FENETRE IA
===================================================*/

function openAssistant(){


    if(assistantBox){

        assistantBox.style.display =
            "block";

        return;

    }



    assistantBox =
        document.createElement(
            "div"
        );


    assistantBox.id =
        "assistantBox";



    assistantBox.innerHTML = `

        <div class="assistant-header">

            🤖 InspecteurBot IA

            <button id="closeAssistant">
                ✖
            </button>

        </div>


        <div id="assistantMessages"
             class="assistant-messages">

            Bonjour Inspecteur,
            comment puis-je vous aider ?

        </div>


        <div class="assistant-input">

            <input 
            id="assistantQuestion"
            placeholder="Posez votre question...">


            <button id="sendAssistant">

            Envoyer

            </button>

        </div>

    `;



    document.body.appendChild(
        assistantBox
    );



    document
    .getElementById(
        "sendAssistant"
    )
    .addEventListener(
        "click",
        sendQuestion
    );



    document
    .getElementById(
        "assistantQuestion"
    )
    .addEventListener(
        "keydown",
        e=>{

            if(e.key==="Enter"){

                sendQuestion();

            }

        }
    );



    document
    .getElementById(
        "closeAssistant"
    )
    .addEventListener(
        "click",
        ()=>{

            assistantBox.remove();

            assistantBox=null;

        }
    );


}



/*==================================================
 ENVOYER QUESTION
===================================================*/

function sendQuestion(){


    const input =
        document.getElementById(
            "assistantQuestion"
        );


    if(!input) return;



    const question =
        input.value.trim();



    if(!question) return;



    addMessage(
        "Vous : " + question
    );



    const response =
        generateAnswer(
            question
        );



    setTimeout(()=>{


        addMessage(
            "🤖 " + response
        );



        if(typeof speak === "function"){

            speak(response);

        }


    },500);



    input.value="";


}



/*==================================================
 AFFICHAGE MESSAGE
===================================================*/

function addMessage(text){


    const box =
        document.getElementById(
            "assistantMessages"
        );


    if(box){

        box.innerHTML +=
            "<br><br>" + text;

        box.scrollTop =
            box.scrollHeight;

    }

}



/*==================================================
 BASE DE CONNAISSANCES
===================================================*/

function generateAnswer(question){


    question =
        question.toLowerCase();



    if(
        question.includes(
            "smig"
        )
    ){

        return "Le SMIG correspond au salaire minimum interprofessionnel garanti applicable selon la réglementation en vigueur en RDC.";

    }



    if(
        question.includes(
            "code du travail"
        )
    ){

        return "Le Code du Travail RDC regroupe les règles relatives aux relations professionnelles, contrats, droits et obligations des travailleurs.";

    }



    if(
        question.includes(
            "inspection"
        )
    ){

        return "L'inspection du travail assure le contrôle de l'application de la législation sociale dans les entreprises.";

    }



    if(
        question.includes(
            "onem"
        )
    ){

        return "L'Office National de l'Emploi intervient notamment dans les questions liées à l'emploi et au marché du travail.";

    }



    return "Je suis actuellement en mode assistant local. Cette fonction sera connectée à une intelligence artificielle complète dans une prochaine version.";

}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initAssistant();


});
