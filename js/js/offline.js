/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 offline.js
 Mode hors ligne PWA
===================================================*/

"use strict";


/*==================================================
 VERIFICATION CONNEXION
===================================================*/

function checkConnection(){


    const status =
        navigator.onLine
        ? "🟢 En ligne"
        : "🔴 Hors ligne";


    console.log(
        "Statut réseau : " + status
    );


}



/*==================================================
 EVENEMENTS RESEAU
===================================================*/

function networkEvents(){


    window.addEventListener(
        "online",
        ()=>{


            showMessage(
                "Connexion Internet rétablie",
                "success"
            );


        }
    );



    window.addEventListener(
        "offline",
        ()=>{


            showMessage(
                "Mode hors ligne activé",
                "warning"
            );


        }
    );


}



/*==================================================
 ENREGISTREMENT SERVICE WORKER
===================================================*/

function registerServiceWorker(){


    if(
        "serviceWorker" in navigator
    ){


        navigator.serviceWorker
        .register(
            "service-worker.js"
        )

        .then(()=>{


            console.log(
                "Service Worker activé"
            );


        })


        .catch(error=>{


            console.error(
                "Erreur Service Worker",
                error
            );


        });


    }


}



/*==================================================
 INFORMATIONS APPAREIL
===================================================*/

function deviceInfo(){


    console.log({

        navigateur:
        navigator.userAgent,


        langue:
        navigator.language,


        plateforme:
        navigator.platform

    });


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    checkConnection();


    networkEvents();


    registerServiceWorker();


    deviceInfo();


});
