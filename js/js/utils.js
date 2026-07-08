/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 utils.js
 Fonctions générales de l'application
===================================================*/

"use strict";

/*==================================================
 SELECTION RAPIDE
===================================================*/

function $(selector){
    return document.querySelector(selector);
}

function $$(selector){
    return document.querySelectorAll(selector);
}

/*==================================================
 STOCKAGE LOCAL
===================================================*/

const Storage={

    save(key,value){

        try{

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );

        }catch(e){

            console.error(e);

        }

    },

    get(key){

        try{

            const data=
                localStorage.getItem(key);

            return data
                ? JSON.parse(data)
                : null;

        }catch(e){

            console.error(e);
            return null;

        }

    },

    remove(key){

        localStorage.removeItem(key);

    },

    clear(){

        localStorage.clear();

    }

};

/*==================================================
 MESSAGE
===================================================*/

function showMessage(message,type="info"){

    const box=
        document.createElement("div");

    box.className=
        "bot-message "+type;

    box.textContent=
        message;

    document.body.appendChild(box);

    reveal(box);

    setTimeout(()=>{

        box.remove();

    },3000);

}

/*==================================================
 DATE
===================================================*/

function formatDate(date=new Date()){

    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            weekday:"long",
            day:"2-digit",
            month:"long",
            year:"numeric"
        }
    ).format(date);

}

/*==================================================
 HEURE
===================================================*/

function formatTime(date=new Date()){

    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        }
    ).format(date);

}

/*==================================================
 INTERNET
===================================================*/

function isOnline(){

    return navigator.onLine;

}

/*==================================================
 DEBOUNCE
===================================================*/

function debounce(callback,delay=300){

    let timer;

    return function(...args){

        clearTimeout(timer);

        timer=setTimeout(()=>{

            callback.apply(this,args);

        },delay);

    };

}

/*==================================================
 ANIMATION
===================================================*/

function reveal(element){

    if(!element) return;

    element.style.opacity="0";
    element.style.transform="translateY(15px)";
    element.style.transition="all .35s ease";

    requestAnimationFrame(()=>{

        element.style.opacity="1";
        element.style.transform="translateY(0)";

    });

}

/*==================================================
 JOURNAL SYSTEME
===================================================*/

function logAction(action){

    let logs=
        Storage.get("logs") || [];

    logs.push({

        action:action,
        date:new Date().toLocaleString("fr-FR")

    });

    if(logs.length>300){

        logs=logs.slice(-300);

    }

    Storage.save("logs",logs);

}

/*==================================================
 INITIALISATION
===================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    console.log("Utils chargé.");

});
