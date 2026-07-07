/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 theme.js
 Gestion du thème
===================================================*/

"use strict";


/*==================================================
 INITIALISATION DU THEME
===================================================*/

function initTheme(){


    const btnTheme =
        document.getElementById("btnTheme");


    const savedTheme =
        Storage.get("theme");


    if(savedTheme === "dark"){

        document.body.classList.add(
            "dark-theme"
        );


        if(btnTheme){

            btnTheme.textContent =
                "☀️ Thème";

        }

    }


    if(savedTheme === "light"){

        document.body.classList.remove(
            "dark-theme"
        );


        if(btnTheme){

            btnTheme.textContent =
                "🌙 Thème";

        }

    }


}



/*==================================================
 CHANGEMENT DU THEME
===================================================*/

function toggleTheme(){


    const btnTheme =
        document.getElementById("btnTheme");


    document.body.classList.toggle(
        "dark-theme"
    );


    const dark =
        document.body.classList.contains(
            "dark-theme"
        );


    Storage.save(
        "theme",
        dark ? "dark" : "light"
    );



    if(btnTheme){

        btnTheme.textContent =
            dark
            ? "☀️ Thème"
            : "🌙 Thème";

    }


    showMessage(
        dark
        ? "Mode sombre activé"
        : "Mode clair activé",
        "success"
    );


    logAction(
        "Changement thème : " +
        (dark ? "sombre" : "clair")
    );


}



/*==================================================
 ACTIVATION
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initTheme();


    const btnTheme =
        document.getElementById(
            "btnTheme"
        );


    if(btnTheme){


        btnTheme.addEventListener(
            "click",
            toggleTheme
        );


    }


});
