/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 stats.js
 Statistiques du tableau de bord
===================================================*/

"use strict";


/*==================================================
 INITIALISATION STATISTIQUES
===================================================*/

function initStats(){


    createStatsStorage();


    trackCards();


    displayStats();


}



/*==================================================
 CREATION STOCKAGE
===================================================*/

function createStatsStorage(){


    if(!Storage.get("stats")){


        Storage.save(
            "stats",
            {

                visits:0,

                cardsOpened:0,

                searches:0,

                lastVisit:
                new Date()

            }
        );


    }



    let stats =
        Storage.get("stats");



    stats.visits++;


    stats.lastVisit =
        new Date();



    Storage.save(
        "stats",
        stats
    );


}



/*==================================================
 SUIVI OUVERTURE DES CARTES
===================================================*/

function trackCards(){


    const cards =
        document.querySelectorAll(
            ".card"
        );



    cards.forEach(card=>{


        card.addEventListener(
            "click",
            ()=>{


                let stats =
                    Storage.get(
                        "stats"
                    );



                stats.cardsOpened++;



                Storage.save(
                    "stats",
                    stats
                );



                logAction(
                    "Ouverture : "
                    +
                    card.innerText
                );


            }
        );


    });


}



/*==================================================
 SUIVI RECHERCHE
===================================================*/

function trackSearch(){


    const input =
        document.getElementById(
            "searchInput"
        );



    if(!input) return;



    input.addEventListener(
        "change",
        ()=>{


            let stats =
                Storage.get(
                    "stats"
                );



            stats.searches++;



            Storage.save(
                "stats",
                stats
            );


        }
    );


}



/*==================================================
 AFFICHAGE STATISTIQUES
===================================================*/

function displayStats(){


    const stats =
        Storage.get(
            "stats"
        );



    console.log(
        "===== STATISTIQUES ====="
    );


    console.log(
        "Visites : ",
        stats.visits
    );


    console.log(
        "Formulaires ouverts : ",
        stats.cardsOpened
    );


    console.log(
        "Recherches : ",
        stats.searches
    );


}



/*==================================================
 CREATION PANNEAU STATS
===================================================*/

function createStatsPanel(){


    const footer =
        document.querySelector(
            ".footer"
        );


    if(!footer) return;



    const stats =
        Storage.get(
            "stats"
        );



    const box =
        document.createElement(
            "div"
        );


    box.className =
        "stats-panel";



    box.innerHTML = `

    📊 Statistiques IA

    <br>

    Visites :
    ${stats.visits}

    <br>

    Formulaires :
    ${stats.cardsOpened}

    <br>

    Recherches :
    ${stats.searches}

    `;



    footer.appendChild(
        box
    );


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initStats();


    trackSearch();


    createStatsPanel();


});
