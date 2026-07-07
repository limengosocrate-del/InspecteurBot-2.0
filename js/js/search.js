/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 search.js
 Moteur de recherche intelligent
===================================================*/

"use strict";


let searchHistory = [];


/*==================================================
 INITIALISATION RECHERCHE
===================================================*/

function initSearch(){


    const input =
        document.getElementById(
            "searchInput"
        );


    if(!input) return;


    searchHistory =
        Storage.get("searchHistory") || [];



    input.addEventListener(
        "input",
        debounce(
            function(){

                searchCards(
                    this.value
                );

            },
            200
        )
    );



    input.addEventListener(
        "keydown",
        function(e){

            if(e.key === "Enter"){

                saveSearch(
                    this.value
                );

            }

        }
    );


}



/*==================================================
 RECHERCHE DES CARTES
===================================================*/

function searchCards(text){


    const value =
        text
        .toLowerCase()
        .trim();


    const cards =
        document.querySelectorAll(
            ".card"
        );


    let count = 0;



    cards.forEach(card=>{


        const content =
            card.innerText
            .toLowerCase();



        if(
            content.includes(value)
            ||
            value === ""
        ){


            card.style.display =
                "";


            reveal(card);


            count++;


        }

        else{


            card.style.display =
                "none";


        }


    });



    updateSearchCount(
        count
    );


}



/*==================================================
 SAUVEGARDE HISTORIQUE
===================================================*/

function saveSearch(text){


    text =
        text.trim();


    if(!text) return;



    searchHistory.unshift(
        text
    );



    searchHistory =
        [...new Set(searchHistory)]
        .slice(0,20);



    Storage.save(
        "searchHistory",
        searchHistory
    );


    logAction(
        "Recherche : " + text
    );


}



/*==================================================
 COMPTEUR RESULTATS
===================================================*/

function updateSearchCount(number){


    let counter =
        document.getElementById(
            "searchCounter"
        );



    if(!counter){


        counter =
            document.createElement(
                "span"
            );


        counter.id =
            "searchCounter";


        const toolbar =
            document.querySelector(
                ".top-toolbar"
            );


        if(toolbar){

            toolbar.appendChild(
                counter
            );

        }


    }



    counter.textContent =
        "Résultats : " + number;


}



/*==================================================
 RACCOURCI CLAVIER
===================================================*/

document.addEventListener(
"keydown",
function(e){


    if(
        e.ctrlKey &&
        e.key.toLowerCase()==="f"
    ){


        e.preventDefault();


        const input =
            document.getElementById(
                "searchInput"
            );


        if(input){

            input.focus();

        }


    }


});



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{

    initSearch();

});
