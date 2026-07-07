/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 map.js
 Localisation GPS entreprises
===================================================*/

"use strict";


let mapPosition = null;



/*==================================================
 INITIALISATION CARTE
===================================================*/

function initMap(){


    createMapButton();


}



/*==================================================
 BOUTON CARTE
===================================================*/

function createMapButton(){


    const toolbar =
        document.querySelector(
            ".top-toolbar"
        );


    if(!toolbar)
    return;



    const button =
        document.createElement(
            "button"
        );


    button.textContent =
        "🗺 Carte GPS";


    button.id =
        "mapButton";



    toolbar.appendChild(
        button
    );



    button.onclick =
        openMap;



}



/*==================================================
 OUVRIR CARTE
===================================================*/

function openMap(){


    if(
        !navigator.geolocation
    ){


        showMessage(
            "GPS non disponible",
            "error"
        );


        return;

    }



    navigator.geolocation.getCurrentPosition(

        position=>{


            mapPosition = {


                latitude:
                position.coords.latitude,


                longitude:
                position.coords.longitude


            };



            displayMap();


        },


        ()=>{


            showMessage(
                "Localisation refusée",
                "error"
            );


        }

    );


}



/*==================================================
 AFFICHAGE CARTE
===================================================*/

function displayMap(){


    const box =
        document.createElement(
            "div"
        );


    box.className =
        "map-box";



    box.innerHTML = `


<h2>
📍 Position Inspecteur
</h2>


Latitude :

${mapPosition.latitude}


<br><br>


Longitude :

${mapPosition.longitude}



<br><br>


<a target="_blank"
href="https://www.google.com/maps?q=${mapPosition.latitude},${mapPosition.longitude}">


🌍 Ouvrir dans Google Maps

</a>


<button id="closeMap">

Fermer

</button>


`;



    document.body.appendChild(
        box
    );



    document
    .getElementById(
        "closeMap"
    )
    .onclick =
    ()=>{


        box.remove();


    };


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initMap();


});
