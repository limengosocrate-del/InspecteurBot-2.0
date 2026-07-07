'use strict';

/*
====================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM

 CLOCK.JS
 Gestion Heure & Date

====================================================
*/


function updateClock(){


const now = new Date();





/*====================================================
 HEURE
====================================================*/


const time = now.toLocaleTimeString(
"fr-FR",
{

hour:"2-digit",

minute:"2-digit",

second:"2-digit"

}

);






/*====================================================
 DATE
====================================================*/


const date = now.toLocaleDateString(

"fr-FR",

{

weekday:"long",

year:"numeric",

month:"long",

day:"numeric"

}

);





const timeBox =
document.getElementById(
"currentTime"
);



const dateBox =
document.getElementById(
"currentDate"
);






if(timeBox){


timeBox.textContent =
time;


}





if(dateBox){


dateBox.textContent =
date.charAt(0).toUpperCase()
+
date.slice(1);



}



}





/*====================================================
 DEMARRAGE HORLOGE
====================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


updateClock();



setInterval(

updateClock,

1000

);



}

);






window.updateClock =
updateClock;
