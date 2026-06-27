/*=================================================
CODE DU TRAVAIL
PARTIE 1
INITIALISATION
==================================================*/

"use strict";

/*=========================================
HORLOGE
=========================================*/

function updateDateTime(){

    const now = new Date();

    const jours = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
    ];

    const mois = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];

    const clock = document.getElementById("clock");
    const day = document.getElementById("day");
    const date = document.getElementById("date");

    if(clock){
        clock.innerHTML = now.toLocaleTimeString("fr-FR",{
            hour:"2-digit",
            minute:"2-digit"
        });
    }

    if(day){
        day.innerHTML = jours[now.getDay()];
    }

    if(date){
        date.innerHTML =
            now.getDate()+" "+
            mois[now.getMonth()]+" "+
            now.getFullYear();
    }

}

updateDateTime();
setInterval(updateDateTime,1000);

/*=========================================
MÉTÉO
=========================================*/

const temperature = document.getElementById("temperature");
const city = document.getElementById("city");

if(temperature){
    temperature.innerHTML = "26°C";
}

if(city){
    city.innerHTML = "Kinshasa";
}

/*=========================================
BASE DE DONNÉES DES ARTICLES
=========================================*/

let articles = [];

/*=========================================
NOTIFICATION
=========================================*/

function notification(message){

    const box = document.createElement("div");

    box.className = "msg";

    box.innerHTML = message;

    document.body.appendChild(box);

    setTimeout(function(){

        box.remove();

    },3000);

}

/*=========================================
MESSAGE DE DÉMARRAGE
=========================================*/

console.log(
    "InspecteurBot RDC | Code du Travail chargé avec succès."
);
