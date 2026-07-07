/*==================================================
INSPECTEURBOT IA RDC
fiche.js
PARTIE 1
Créé par Inspecteur Limengo (Pmiller) © 2026
==================================================*/

"use strict";

/*==================================================
OBJET PRINCIPAL
==================================================*/

const InspecteurBot = {

    version: "2.0 Premium",

    auteur: "Limengo (Pmiller)",

    annee: "2026"

};

/*==================================================
DEMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        updateClock();

        setInterval(updateClock,1000);

        updateNetworkStatus();

        restoreTheme();

        welcomeMessage();

    }

);

/*==================================================
DATE ET HEURE
==================================================*/

function updateClock(){

    const now = new Date();

    const date = now.toLocaleDateString(

        "fr-FR",

        {

            weekday:"long",

            day:"2-digit",

            month:"long",

            year:"numeric"

        }

    );

    const heure = now.toLocaleTimeString(

        "fr-FR"

    );

    const dateElement = document.getElementById(

        "currentDate"

    );

    const timeElement = document.getElementById(

        "currentTime"

    );

    if(dateElement){

        dateElement.textContent = date;

    }

    if(timeElement){

        timeElement.textContent = heure;

    }

}

/*==================================================
ETAT INTERNET
==================================================*/

function updateNetworkStatus(){

    const el = document.getElementById(

        "networkStatus"

    );

    if(!el){

        return;

    }

    if(navigator.onLine){

        el.textContent = "🟢 En ligne";

    }

    else{

        el.textContent = "🔴 Hors ligne";

    }

}

window.addEventListener(

    "online",

    updateNetworkStatus

);

window.addEventListener(

    "offline",

    updateNetworkStatus

);

/*==================================================
MESSAGE BIENVENUE
==================================================*/

function welcomeMessage(){

    setTimeout(

        ()=>{

            showToast(

                "Bienvenue sur InspecteurBot IA RDC"

            );

        },

        800

    );

}

/*==================================================
TOAST
==================================================*/

function showToast(message){

    let toast = document.createElement(

        "div"

    );

    toast.className = "toast";

    toast.innerHTML = message;

    document.body.appendChild(

        toast

    );

    requestAnimationFrame(

        ()=>{

            toast.classList.add(

                "show"

            );

        }

    );

    setTimeout(

        ()=>{

            toast.classList.remove(

                "show"

            );

            setTimeout(

                ()=>{

                    toast.remove();

                },

                500

            );

        },

        3500

    );

}

/*==================================================
SCROLL DOUX
==================================================*/

function scrollTopPage(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

/*==================================================
RESTAURATION DU THEME
==================================================*/

function restoreTheme(){

    const theme = localStorage.getItem(

        "theme"

    );

    if(theme==="light"){

        document.body.classList.add(

            "light"

        );

    }

}

/*==================================================
FIN PARTIE 1
Créé par Inspecteur Limengo (Pmiller) © 2026
==================================================*/

/*==================================================
INSPECTEURBOT IA RDC
fiche.js
PARTIE 2
Créé par Inspecteur Limengo (Pmiller) © 2026
==================================================*/

/*==================================================
THEME SOMBRE / CLAIR
==================================================*/

const btnTheme=document.getElementById("btnTheme");

if(btnTheme){

    btnTheme.addEventListener(

        "click",

        toggleTheme

    );

}

function toggleTheme(){

    document.body.classList.toggle(

        "light"

    );

    if(

        document.body.classList.contains(

            "light"

        )

    ){

        localStorage.setItem(

            "theme",

            "light"

        );

        showToast(

            "☀️ Mode clair activé"

        );

    }

    else{

        localStorage.setItem(

            "theme",

            "dark"

        );

        showToast(

            "🌙 Mode sombre activé"

        );

    }

}

/*==================================================
LANGUE
==================================================*/

const lang=document.getElementById(

    "langSwitcher"

);

if(lang){

    const saved=localStorage.getItem(

        "language"

    );

    if(saved){

        lang.value=saved;

    }

    lang.addEventListener(

        "change",

        ()=>{

            localStorage.setItem(

                "language",

                lang.value

            );

            showToast(

                "🌍 Langue enregistrée"

            );

        }

    );

}

/*==================================================
RECHERCHE
==================================================*/

const search=document.getElementById(

    "searchInput"

);

if(search){

search.addEventListener(

"keyup",

function(){

const value=this.value.toLowerCase();

document.querySelectorAll(

".card"

).forEach(

card=>{

const txt=card.innerText.toLowerCase();

card.style.display=

txt.includes(value)

?

"flex"

:

"none";

}

);

}

);

}

/*==================================================
BOUTON RETOUR HAUT
==================================================*/

const btnTop=document.getElementById(

"btnTop"

);

if(btnTop){

btnTop.addEventListener(

"click",

scrollTopPage

);

}

/*==================================================
BOUTON ACCUEIL
==================================================*/

const btnHome=document.getElementById(

"btnHome"

);

if(btnHome){

btnHome.addEventListener(

"click",

()=>{

window.location.href="fiche.html";

}

);

}

/*==================================================
ASSISTANT IA
==================================================*/

const btnIA=document.getElementById(

"btnAssistant"

);

if(btnIA){

btnIA.addEventListener(

"click",

()=>{

showToast(

"🤖 Assistant InspecteurBot bientôt disponible."

);

}

);

}

/*==================================================
BOUTON RECHERCHE
==================================================*/

const btnSearch=document.getElementById(

"btnSearch"

);

if(btnSearch){

btnSearch.addEventListener(

"click",

()=>{

search.focus();

}

);

}

/*==================================================
ANIMATION APPARITION
==================================================*/

const observer=

new IntersectionObserver(

entries=>{

entries.forEach(

entry=>{

if(entry.isIntersecting){

entry.target.classList.add(

"show"

);

}

}

);

},

{

threshold:.15

}

);

document.querySelectorAll(

".card,.category,.footer-card"

)

.forEach(

element=>{

element.classList.add(

"fade-up"

);

observer.observe(

element

);

}

);

/*==================================================
MESSAGE VERSION
==================================================*/

console.log(

"InspecteurBot IA RDC",

InspecteurBot.version,

"Créé par",

InspecteurBot.auteur,

InspecteurBot.annee

);

/*==================================================
FIN PARTIE 2
Créé par Inspecteur Limengo (Pmiller) © 2026
==================================================*/

/*==================================================
INSPECTEURBOT IA RDC
fiche.js
PARTIE 3
Créé par Inspecteur Limengo (Pmiller) © 2026
==================================================*/

/*==================================================
METEO
(Open-Meteo : API gratuite)
==================================================*/

async function loadWeather(){

    const weather=document.getElementById("weather");

    if(!weather) return;

    if(!navigator.geolocation){

        weather.textContent="Position indisponible";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            try{

                const lat=position.coords.latitude;

                const lon=position.coords.longitude;

                const url=

                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

                const response=await fetch(url);

                const data=await response.json();

                const t=data.current_weather.temperature;

                weather.textContent=`🌡 ${t}°C`;

            }

            catch{

                weather.textContent="Météo indisponible";

            }

        },

        ()=>{

            weather.textContent="Localisation refusée";

        }

    );

}

loadWeather();

/*==================================================
COMPTEUR DES FORMULAIRES
==================================================*/

function countForms(){

    const total=document.querySelectorAll(".card").length;

    console.log(

        "Nombre de formulaires :",total

    );

}

countForms();

/*==================================================
RACCOURCIS CLAVIER
==================================================*/

document.addEventListener(

    "keydown",

    e=>{

        if(e.key==="/"){

            e.preventDefault();

            document

            .getElementById("searchInput")

            ?.focus();

        }

        if(e.key==="t"){

            toggleTheme();

        }

        if(e.key==="Home"){

            scrollTopPage();

        }

    }

);

/*==================================================
EFFET CARTE
==================================================*/

document.querySelectorAll(".card")

.forEach(card=>{

card.addEventListener(

"mouseenter",

()=>{

card.style.transform=

"translateY(-12px) scale(1.04)";

}

);

card.addEventListener(

"mouseleave",

()=>{

card.style.transform="";

}

);

});

/*==================================================
MESSAGE SELON L'HEURE
==================================================*/

function greeting(){

    const h=new Date().getHours();

    if(h<12){

        showToast(

            "☀️ Bonjour Inspecteur."

        );

    }

    else if(h<18){

        showToast(

            "👋 Bon après-midi."

        );

    }

    else{

        showToast(

            "🌙 Bonne soirée."

        );

    }

}

setTimeout(

    greeting,

    1800

);

/*==================================================
VERIFICATION MISE A JOUR
==================================================*/

console.log(

"InspecteurBot IA RDC",

InspecteurBot.version,

"chargé avec succès."

);

/*==================================================
PIED DE PAGE
==================================================*/

console.log(

"Créé par Inspecteur Limengo (Pmiller) © 2026"

);

/*==================================================
FIN
==================================================*/


