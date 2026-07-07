/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 notification.js
 Système de notifications
===================================================*/

"use strict";


/*==================================================
 INITIALISATION
===================================================*/

function initNotifications(){


    if(
        !("Notification" in window)
    ){

        console.warn(
            "Notifications non supportées"
        );

        return;

    }



    if(
        Notification.permission === "default"
    ){

        Notification.requestPermission();

    }


}



/*==================================================
 CREER NOTIFICATION
===================================================*/

function sendNotification(
    title,
    message
){


    if(
        Notification.permission ===
        "granted"
    ){


        new Notification(
            title,
            {

                body: message,

                icon:
                "assets/images/logo-igt.png"

            }

        );


    }

    else{


        showMessage(
            message
        );


    }



    logAction(
        "Notification : "
        + title
    );


}



/*==================================================
 NOTIFICATIONS SYSTEME
===================================================*/

function welcomeNotification(){


    setTimeout(()=>{


        sendNotification(

            "InspecteurBot IA RDC",

            "Bienvenue dans votre tableau de bord intelligent."

        );


    },3000);



}



/*==================================================
 NOTIFICATION CONNEXION
===================================================*/

function connectionNotification(){


    window.addEventListener(
        "online",
        ()=>{


            sendNotification(

                "Connexion rétablie",

                "Votre application est de nouveau en ligne."

            );


        }
    );



    window.addEventListener(
        "offline",
        ()=>{


            sendNotification(

                "Mode hors ligne",

                "La connexion Internet est interrompue."

            );


        }
    );

}



/*==================================================
 ALERTES PROFESSIONNELLES
===================================================*/

function missionAlert(
    entreprise
){


    sendNotification(

        "Nouvelle mission",

        "Contrôle prévu chez : " + entreprise

    );


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initNotifications();


    welcomeNotification();


    connectionNotification();


});
