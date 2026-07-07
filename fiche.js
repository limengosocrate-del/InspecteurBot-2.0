/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 fiche.js
 Fichier principal léger
===================================================*/

"use strict";


/*==================================================
 CONFIGURATION APPLICATION
===================================================*/

const InspecteurBot = {


    name:
    "InspecteurBot IA RDC",


    version:
    "4.0 Premium",


    initialized:
    false


};



/*==================================================
 INITIALISATION
===================================================*/

function initFiche(){


    if(InspecteurBot.initialized)
    return;



    InspecteurBot.initialized =
    true;



    console.log(
        "📋 Fiche système initialisée"
    );



    if(typeof logAction==="function"){


        logAction(
            "Application démarrée"
        );


    }



}



/*==================================================
 INFORMATIONS APPLICATION
===================================================*/

function getAppInfo(){


    return InspecteurBot;


}



/*==================================================
 TEST SYSTEME
===================================================*/

function systemCheck(){


    return {


        status:
        "OK",


        version:
        InspecteurBot.version,


        modules:
        document.scripts.length


    };


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initFiche();


});
