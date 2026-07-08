/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 offline.js
 Mode hors ligne PWA
===================================================*/

"use strict";

/*==================================================
 ETAT DE LA CONNEXION
===================================================*/

function checkConnection(){

    const online=navigator.onLine;

    console.log(
        online
        ? "🟢 En ligne"
        : "🔴 Hors ligne"
    );

    return online;

}

/*==================================================
 EVENEMENTS RESEAU
===================================================*/

function networkEvents(){

    window.addEventListener("online",()=>{

        if(typeof showMessage==="function"){
            showMessage(
                "Connexion Internet rétablie",
                "success"
            );
        }

        if(typeof logAction==="function"){
            logAction("Connexion rétablie");
        }

    });

    window.addEventListener("offline",()=>{

        if(typeof showMessage==="function"){
            showMessage(
                "Mode hors ligne activé",
                "warning"
            );
        }

        if(typeof logAction==="function"){
            logAction("Mode hors ligne");
        }

    });

}

/*==================================================
 SERVICE WORKER
===================================================*/

function registerServiceWorker(){

    if(!("serviceWorker" in navigator)){
        console.warn("Service Worker non supporté.");
        return;
    }

    window.addEventListener("load",()=>{

        navigator.serviceWorker
        .register("./service-worker.js")

        .then(reg=>{

            console.log(
                "Service Worker activé",
                reg.scope
            );

        })

        .catch(error=>{

            console.error(
                "Erreur Service Worker",
                error
            );

        });

    });

}

/*==================================================
 INFORMATIONS APPAREIL
===================================================*/

function deviceInfo(){

    console.table({

        navigateur:navigator.userAgent,
        langue:navigator.language,
        plateforme:navigator.platform,
        enLigne:navigator.onLine

    });

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    checkConnection();
    networkEvents();
    registerServiceWorker();
    deviceInfo();

});
