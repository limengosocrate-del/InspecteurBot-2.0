/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 translate.js
 Système multilingue
===================================================*/

"use strict";


/*==================================================
 DICTIONNAIRE DES LANGUES
===================================================*/

const translations = {


    fr: {

        title:
        "INSPECTEURBOT IA RDC",

        subtitle:
        "Inspection Générale du Travail",

        dashboard:
        "TABLEAU DE BORD INTELLIGENT",

        search:
        "🔎 Rechercher un formulaire, une loi ou un document...",

        assistant:
        "🤖 IA",

        voice:
        "🎙 Voix",

        scanner:
        "📷 Scanner",

        theme:
        "🌙 Thème"

    },


    en: {

        title:
        "INSPECTORBOT AI DRC",

        subtitle:
        "General Labour Inspectorate",

        dashboard:
        "INTELLIGENT DASHBOARD",

        search:
        "🔎 Search a form, law or document...",

        assistant:
        "🤖 AI",

        voice:
        "🎙 Voice",

        scanner:
        "📷 Scanner",

        theme:
        "🌙 Theme"

    },


    ln: {

        title:
        "INSPEKTORBOT IA RDC",

        subtitle:
        "Bureau ya inspection ya mosala",

        dashboard:
        "TABLEAU YA MAYELE",

        search:
        "🔎 Luka formulaire to mobeko...",

        assistant:
        "🤖 Mayele",

        voice:
        "🎙 Mongongo",

        scanner:
        "📷 Scanner",

        theme:
        "🌙 Motema"


    },


    kg: {

        title:
        "INSPECTEURBOT IA RDC",

        subtitle:
        "Inspection ya kisalu",

        dashboard:
        "Tableau ya kisalu",

        search:
        "🔎 Sosa formulaire",

        assistant:
        "🤖 Mayele",

        voice:
        "🎙 Mvutu",

        scanner:
        "📷 Scanner",

        theme:
        "🌙 Tema"

    },


    sw: {

        title:
        "INSPECTORBOT AI DRC",

        subtitle:
        "Ukaguzi wa Kazi",

        dashboard:
        "DASHIBODI YA AKILI",

        search:
        "🔎 Tafuta hati au sheria",

        assistant:
        "🤖 AI",

        voice:
        "🎙 Sauti",

        scanner:
        "📷 Kichanganuzi",

        theme:
        "🌙 Mandhari"

    }


};



/*==================================================
 CHANGER LA LANGUE
===================================================*/

function changeLanguage(lang){


    const data =
        translations[lang];


    if(!data) return;



    const title =
        document.querySelector(
            ".header-text h1"
        );


    const subtitle =
        document.querySelector(
            ".header-text h2"
        );


    const dashboard =
        document.querySelector(
            ".hero h2"
        );


    const search =
        document.getElementById(
            "searchInput"
        );


    const btnIA =
        document.getElementById(
            "btnAssistant"
        );


    const btnVoice =
        document.getElementById(
            "btnVoice"
        );


    const btnCamera =
        document.getElementById(
            "btnCamera"
        );


    const btnTheme =
        document.getElementById(
            "btnTheme"
        );



    if(title)
        title.textContent=data.title;


    if(subtitle)
        subtitle.textContent=data.subtitle;


    if(dashboard)
        dashboard.textContent=data.dashboard;


    if(search)
        search.placeholder=data.search;


    if(btnIA)
        btnIA.textContent=data.assistant;


    if(btnVoice)
        btnVoice.textContent=data.voice;


    if(btnCamera)
        btnCamera.textContent=data.scanner;


    if(btnTheme)
        btnTheme.textContent=data.theme;



    Storage.save(
        "language",
        lang
    );


    showMessage(
        "Langue changée",
        "success"
    );


}



/*==================================================
 INITIALISATION
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    const selector =
        document.getElementById(
            "langSwitcher"
        );



    const saved =
        Storage.get(
            "language"
        );



    if(saved && selector){

        selector.value=saved;

        changeLanguage(saved);

    }



    if(selector){


        selector.addEventListener(
            "change",
            function(){

                changeLanguage(
                    this.value
                );

            }
        );


    }



});
