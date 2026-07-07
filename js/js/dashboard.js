/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 dashboard.js
 Gestion du tableau de bord
===================================================*/

"use strict";


/*==================================================
 INITIALISATION DASHBOARD
===================================================*/

function initDashboard(){


    animateSections();


    initCardEffects();


    countModules();


    addNavigationEffects();


}



/*==================================================
 ANIMATION DES SECTIONS
===================================================*/

function animateSections(){


    const sections =
        document.querySelectorAll(
            ".dashboard-section"
        );



    sections.forEach(
        (section,index)=>{


            section.style.opacity =
                "0";


            section.style.transform =
                "translateY(30px)";



            setTimeout(()=>{


                section.style.transition =
                "0.7s ease";


                section.style.opacity =
                "1";


                section.style.transform =
                "translateY(0)";


            },index*150);



        }
    );


}



/*==================================================
 EFFETS SUR LES CARTES
===================================================*/

function initCardEffects(){


    const cards =
        document.querySelectorAll(
            ".card"
        );



    cards.forEach(card=>{


        card.addEventListener(
            "mouseenter",
            ()=>{


                card.classList.add(
                    "active-card"
                );


            }
        );



        card.addEventListener(
            "mouseleave",
            ()=>{


                card.classList.remove(
                    "active-card"
                );


            }
        );



    });


}



/*==================================================
 COMPTER LES MODULES
===================================================*/

function countModules(){


    const cards =
        document.querySelectorAll(
            ".card"
        );



    Storage.save(
        "totalModules",
        cards.length
    );



    console.log(

        "Modules disponibles : "
        +
        cards.length

    );


}



/*==================================================
 NAVIGATION FLUIDE
===================================================*/

function addNavigationEffects(){


    document
    .querySelectorAll(
        "a.card"
    )
    .forEach(card=>{


        card.addEventListener(
            "click",
            ()=>{


                showMessage(
                    "Ouverture du module...",
                    "info"
                );


            }
        );


    });


}



/*==================================================
 RECHERCHE RAPIDE PAR MOT
===================================================*/

function openModule(name){


    const cards =
        document.querySelectorAll(
            ".card"
        );



    cards.forEach(card=>{


        if(
            card.innerText
            .toLowerCase()
            .includes(
                name.toLowerCase()
            )
        ){


            card.click();


        }


    });


}



/*==================================================
 ACTUALISATION DASHBOARD
===================================================*/

function refreshDashboard(){


    animateSections();


    countModules();


    showMessage(
        "Tableau de bord actualisé",
        "success"
    );


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initDashboard();


});
