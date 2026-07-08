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

    if(!("Notification" in window)){
        console.warn("Notifications non supportées");
        return;
    }

    if(Notification.permission === "default"){
        Notification.requestPermission();
    }

}

/*==================================================
 CREER NOTIFICATION
===================================================*/

function sendNotification(title, message){

    if(
        "Notification" in window &&
        Notification.permission === "granted"
    ){

        new Notification(title,{
            body: message,
            icon: "assets/images/logo-igt.png"
        });

    }else{

        if(typeof showMessage === "function"){
            showMessage(message,"info");
        }else{
            console.log(message);
        }

    }

    if(typeof logAction === "function"){
        logAction("Notification : " + title);
    }

}

/*==================================================
 BIENVENUE
===================================================*/

function welcomeNotification(){

    setTimeout(()=>{

        sendNotification(
            "InspecteurBot IA RDC",
            "Bienvenue dans votre tableau de bord intelligent."
        );

    },2000);

}

/*==================================================
 ETAT CONNEXION
===================================================*/

function connectionNotification(){

    window.addEventListener("online",()=>{

        sendNotification(
            "Connexion rétablie",
            "Votre application est de nouveau en ligne."
        );

    });

    window.addEventListener("offline",()=>{

        sendNotification(
            "Mode hors ligne",
            "La connexion Internet est interrompue."
        );

    });

}

/*==================================================
 ALERTE MISSION
===================================================*/

function missionAlert(entreprise){

    sendNotification(
        "Nouvelle mission",
        "Contrôle prévu chez : " + entreprise
    );

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    initNotifications();
    welcomeNotification();
    connectionNotification();

});
