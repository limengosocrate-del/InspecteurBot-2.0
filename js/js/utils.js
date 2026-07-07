/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 utils.js
 Fonctions générales de l'application
===================================================*/

"use strict";


/*==================================================
 SELECTION RAPIDE DES ELEMENTS
===================================================*/

function $(selector) {

    return document.querySelector(selector);

}


function $$(selector) {

    return document.querySelectorAll(selector);

}


/*==================================================
 STOCKAGE LOCAL
===================================================*/

const Storage = {

    save(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    },


    get(key) {

        const data =
            localStorage.getItem(key);

        if (!data) return null;

        try {

            return JSON.parse(data);

        }

        catch {

            return data;

        }

    },


    remove(key) {

        localStorage.removeItem(key);

    }

};


/*==================================================
 NOTIFICATION INTERNE
===================================================*/

function showMessage(message, type="info") {


    const box =
        document.createElement("div");


    box.className =
        "bot-message " + type;


    box.textContent =
        message;


    document.body.appendChild(box);


    setTimeout(()=>{

        box.remove();

    },3000);


}


/*==================================================
 FORMAT DATE
===================================================*/

function formatDate(date=new Date()) {


    return new Intl.DateTimeFormat(
        "fr-FR",
        {
            weekday:"long",
            day:"numeric",
            month:"long",
            year:"numeric"
        }

    ).format(date);


}


/*==================================================
 FORMAT HEURE
===================================================*/

function formatTime(date=new Date()) {


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
 VERIFICATION INTERNET
===================================================*/

function isOnline(){

    return navigator.onLine;

}


/*==================================================
 DEBOUNCE POUR RECHERCHE
===================================================*/

function debounce(func, delay=300){

    let timer;

    return function(...args){

        clearTimeout(timer);

        timer=setTimeout(()=>{

            func.apply(this,args);

        },delay);

    };

}


/*==================================================
 ANIMATION APPARITION
===================================================*/

function reveal(element){

    if(!element) return;


    element.style.opacity="0";

    element.style.transform=
        "translateY(20px)";


    setTimeout(()=>{

        element.style.transition=
            "0.5s ease";


        element.style.opacity="1";

        element.style.transform=
            "translateY(0)";


    },50);


}


/*==================================================
 JOURNAL SYSTEME
===================================================*/

function logAction(action){

    let logs =
        Storage.get("logs") || [];


    logs.push({

        action: action,

        date: new Date().toISOString()

    });


    Storage.save(
        "logs",
        logs
    );

      }
