/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 update.js
 Gestion mise à jour application
===================================================*/

"use strict";


const APP_VERSION =
"4.0 Premium";



function initUpdate(){


    checkVersion();


}



/*==================================================
 VERIFICATION VERSION
===================================================*/

function checkVersion(){


    const saved =
        Storage.get(
            "appVersion"
        );



    if(!saved){


        Storage.save(
            "appVersion",
            APP_VERSION
        );


        return;

    }



    if(saved !== APP_VERSION){


        showMessage(
            "Nouvelle version détectée",
            "success"
        );


        Storage.save(
            "appVersion",
            APP_VERSION
        );


    }


}



/*==================================================
 INFORMATIONS APPLICATION
===================================================*/

function appInfo(){


    return {

        name:
        "InspecteurBot IA RDC",


        version:
        APP_VERSION,


        date:
        "2026"


    };


}



/*==================================================
 RECHARGER APPLICATION
===================================================*/

function reloadApp(){


    location.reload();


}



document.addEventListener(
"DOMContentLoaded",
()=>{


    initUpdate();


});
