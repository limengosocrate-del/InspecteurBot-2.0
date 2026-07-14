// ======================================================
// SMART GPS IGT - InspecteurBot RDC
// GPS ENGINE
// Partie 2A : Initialisation GPS + Carte interactive
// Créé par Inspecteur Limengo (Pmiller)
// ======================================================



"use strict";




// ======================================================
// VARIABLES GLOBALES
// ======================================================


let map = null;

let userMarker = null;

let accuracyCircle = null;

let routeLine = null;


let currentPosition = {

lat:null,

lng:null,

accuracy:null,

altitude:null,

speed:null

};



let gpsReady = false;





// ======================================================
// INITIALISATION APPLICATION
// ======================================================


document.addEventListener(

"DOMContentLoaded",

()=>{


initGPS();


initMap();


updateNetworkStatus();


});






// ======================================================
// INITIALISER CARTE LEAFLET
// ======================================================


function initMap(){


map = L.map("map",{

zoomControl:true,

attributionControl:true

});




map.setView(

[-4.325,15.322],

13

);




L.tileLayer(

"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

{

maxZoom:19,

attribution:

"© OpenStreetMap"

}

).addTo(map);





routeLine = L.polyline(

[],

{

color:"#FFD700",

weight:5,

opacity:.8

}

).addTo(map);



}








// ======================================================
// INITIALISATION GPS NAVIGATEUR
// ======================================================


function initGPS(){



if(!navigator.geolocation){



showNotification(

"GPS non disponible sur cet appareil"

);



return;


}




navigator.geolocation.watchPosition(


positionSuccess,


positionError,


{

enableHighAccuracy:true,

maximumAge:0,

timeout:10000

}



);



}








// ======================================================
// POSITION REÇUE
// ======================================================


function positionSuccess(pos){



gpsReady=true;




currentPosition.lat =

pos.coords.latitude;



currentPosition.lng =

pos.coords.longitude;



currentPosition.accuracy =

pos.coords.accuracy;



currentPosition.altitude =

pos.coords.altitude || 0;



currentPosition.speed =

pos.coords.speed || 0;





updatePositionInterface();




updateMapPosition();





}





// ======================================================
// ERREUR GPS
// ======================================================


function positionError(error){



let message="";



switch(error.code){


case 1:

message="Autorisation GPS refusée";

break;



case 2:

message="Position impossible";

break;



case 3:

message="Temps GPS dépassé";

break;



default:

message="Erreur GPS inconnue";

}



showNotification(message);



}








// ======================================================
// METTRE À JOUR INTERFACE
// ======================================================


function updatePositionInterface(){



document
.getElementById("latitude")
.textContent =

currentPosition.lat?.toFixed(8) || "--";



document
.getElementById("longitude")
.textContent =

currentPosition.lng?.toFixed(8) || "--";



document
.getElementById("accuracy")
.textContent =

Math.round(

currentPosition.accuracy

) || "--";



document
.getElementById("geoAccuracy")
.textContent =

Math.round(

currentPosition.accuracy

)+" m";





document
.getElementById("preciseLat")
.textContent =

currentPosition.lat;



document
.getElementById("preciseLng")
.textContent =

currentPosition.lng;




document
.getElementById("lastGPS")
.textContent =

new Date()

.toLocaleTimeString();



}







// ======================================================
// POSITION SUR CARTE
// ======================================================


function updateMapPosition(){



if(!map)return;




let lat=currentPosition.lat;

let lng=currentPosition.lng;





if(!userMarker){



userMarker = L.marker(

[lat,lng],

{

title:"Inspecteur position actuelle"

}

)

.addTo(map)

.bindPopup(

"📍 Position Inspecteur"

);



}



else{


userMarker.setLatLng(

[lat,lng]

);


}




if(accuracyCircle){


accuracyCircle.remove();


}




accuracyCircle = L.circle(

[lat,lng],

{

radius:

currentPosition.accuracy,

color:"#FFD700",

fillOpacity:.15

}

)

.addTo(map);





map.setView(

[lat,lng],

16

);



}




// ======================================================
// BOUTON OBTENIR POSITION
// ======================================================


document
.getElementById("btnLocate")
.onclick = ()=>{


if(gpsReady){


updateMapPosition();


showNotification(

"Position actualisée"

);


}

else{


showNotification(

"Recherche GPS..."

);


}



};





// ======================================================
// NOTIFICATION
// ======================================================


function showNotification(text){



let box=

document.getElementById(

"notification"

);



if(!box)return;



box.textContent=text;



box.classList.add(

"show"

);



setTimeout(()=>{


box.classList.remove(

"show"

);



},3000);



}






// ======================================================
// ETAT RESEAU
// ======================================================


function updateNetworkStatus(){



let el=

document.getElementById(

"networkStatus"

);



if(!el)return;



el.textContent =

navigator.onLine ?

"En ligne" :

"Hors connexion";



}



window.addEventListener(

"online",

updateNetworkStatus

);



window.addEventListener(

"offline",

updateNetworkStatus

);  

// ======================================================
// SMART GPS IGT - InspecteurBot RDC
// Partie 2B : Suivi mission intelligent
// Créé par Inspecteur Limengo (Pmiller)
// ======================================================



// ======================================================
// VARIABLES MISSION
// ======================================================


let missionActive = false;

let missionPaused = false;


let missionStartTime = null;

let missionTimer = null;


let missionSeconds = 0;


let missionDistance = 0;


let gpsPoints = [];


let lastPoint = null;


let movementCounter = 0;







// ======================================================
// DÉMARRER MISSION
// ======================================================


document
.getElementById("btnStart")
.onclick = ()=>{


if(missionActive){

showNotification(
"Une mission est déjà active"
);

return;

}



missionActive = true;

missionPaused = false;


missionStartTime = new Date();


missionSeconds = 0;

missionDistance = 0;

gpsPoints = [];

movementCounter = 0;


if(routeLine){

routeLine.setLatLngs([]);

}



document
.getElementById("missionState")
.textContent =

"🟢 En cours";



document
.getElementById("missionStatus")
.textContent =

"Active";



startMissionTimer();



showNotification(

"Mission GPS démarrée"

);



};







// ======================================================
// PAUSE MISSION
// ======================================================


document
.getElementById("btnPause")
.onclick = ()=>{


if(!missionActive){

return;

}



missionPaused = !missionPaused;



document
.getElementById("btnPause")
.innerHTML =

missionPaused ?

"▶️ Reprendre" :

"⏸️ Pause";



showNotification(

missionPaused ?

"Mission en pause" :

"Mission reprise"

);



};








// ======================================================
// TERMINER MISSION
// ======================================================


document
.getElementById("btnStop")
.onclick = ()=>{


if(!missionActive){

return;

}



missionActive=false;


missionPaused=false;



clearInterval(

missionTimer

);



document
.getElementById("missionState")
.textContent =

"🔴 Terminée";



document
.getElementById("missionStatus")
.textContent =

"Terminée";



document
.getElementById("endPoint")
.textContent =

currentPosition.lat+

", "+

currentPosition.lng;



showNotification(

"Mission terminée"

);



};








// ======================================================
// CHRONOMÈTRE
// ======================================================


function startMissionTimer(){



clearInterval(

missionTimer

);



missionTimer=setInterval(()=>{


if(

missionActive && !missionPaused

){


missionSeconds++;


updateTimerDisplay();



}


},1000);



}





function updateTimerDisplay(){



let h=Math.floor(

missionSeconds/3600

);



let m=Math.floor(

(missionSeconds%3600)/60

);



let s=

missionSeconds%60;



let value=

`${String(h).padStart(2,"0")}:
${String(m).padStart(2,"0")}:
${String(s).padStart(2,"0")}`;



document
.getElementById("timerValue")
.textContent=value;



document
.getElementById("activeTime")
.textContent=value;



}









// ======================================================
// ENREGISTREMENT DES POINTS GPS
// ======================================================


function saveGPSPoint(){



if(

!missionActive ||

missionPaused ||

!currentPosition.lat

)return;



let point={


lat:

currentPosition.lat,


lng:

currentPosition.lng,


time:

Date.now()


};





if(lastPoint){



let d =

calculateDistance(

lastPoint.lat,

lastPoint.lng,

point.lat,

point.lng

);



if(d>0.005){


missionDistance += d;


movementCounter++;


}



}



gpsPoints.push(point);


lastPoint=point;



updateRoute();


updateMissionStats();



}







// ======================================================
// CALCUL DISTANCE HAVERSINE
// ======================================================


function calculateDistance(

lat1,

lon1,

lat2,

lon2

){



const R=6371;



const dLat=

(lat2-lat1)

*Math.PI/180;



const dLon=

(lon2-lon1)

*Math.PI/180;



const a=

Math.sin(dLat/2)**2+

Math.cos(lat1*Math.PI/180)*

Math.cos(lat2*Math.PI/180)*

Math.sin(dLon/2)**2;



const c=

2*Math.atan2(

Math.sqrt(a),

Math.sqrt(1-a)

);



return R*c;



}







// ======================================================
// TRACÉ SUR CARTE
// ======================================================


function updateRoute(){



if(!routeLine)return;



let coords = gpsPoints.map(p=>[

p.lat,

p.lng

]);



routeLine.setLatLngs(coords);



document
.getElementById("movementCount")
.textContent =

movementCounter;



}






// ======================================================
// STATISTIQUES MISSION
// ======================================================


function updateMissionStats(){



document
.getElementById("distanceValue")
.textContent =

missionDistance.toFixed(2)

+" km";



document
.getElementById("pointsValue")
.textContent =

gpsPoints.length;



let speed =

(currentPosition.speed*3.6)||0;



document
.getElementById("speedValue")
.textContent =

speed.toFixed(1)

+" km/h";



document
.getElementById("altitudeValue")
.textContent =

Math.round(

currentPosition.altitude

)

+" m";



let progress =

Math.min(

missionDistance,

100

);



document
.getElementById("missionProgress")
.style.width=

progress+"%";



}






// ======================================================
// CAPTURE AUTOMATIQUE DES POSITIONS
// ======================================================


setInterval(()=>{


saveGPSPoint();


},5000);

// ======================================================
// SMART GPS IGT - InspecteurBot RDC
// Partie 2C : Gestion des missions et historique
// Créé par Inspecteur Limengo (Pmiller)
// ======================================================




// ======================================================
// VARIABLES STOCKAGE
// ======================================================


const STORAGE_KEY =

"SMART_GPS_IGT_MISSIONS";





// ======================================================
// SAUVEGARDER UNE MISSION
// ======================================================


document
.getElementById("saveMission")
.onclick = ()=>{


let mission={


id:

"IGT-"+

Date.now(),



entreprise:

document
.getElementById("companyName")
.value,



inspecteur:

document
.getElementById("inspectorName")
.value,



type:

document
.getElementById("missionType")
.value,



date:

document
.getElementById("missionDate")
.value || 

new Date()
.toISOString()
.split("T")[0],



objet:

document
.getElementById("missionObject")
.value,



notes:

document
.getElementById("fieldNotes")
.value,



positionDepart:

gpsPoints[0] || null,



positionFin:

gpsPoints[gpsPoints.length-1] || null,



distance:

missionDistance.toFixed(2),



points:

gpsPoints.length,



duree:

missionSeconds,



signature:

window.signatureData || null,



created:

new Date()
.toLocaleString()



};




let missions =

getMissions();



missions.unshift(mission);



localStorage.setItem(

STORAGE_KEY,

JSON.stringify(missions)

);





displayMissions();



generateQRCode(mission);



showNotification(

"Mission enregistrée avec succès"

);



};








// ======================================================
// RÉCUPÉRER MISSIONS
// ======================================================


function getMissions(){



return JSON.parse(

localStorage.getItem(

STORAGE_KEY

)

) || [];



}








// ======================================================
// AFFICHER HISTORIQUE
// ======================================================


function displayMissions(list=null){



let container =

document
.getElementById("missionHistory");



if(!container)return;



let missions =

list || getMissions();





if(missions.length===0){



container.innerHTML=`

<div class="history-item">

<h4>
Aucune mission
</h4>

<p>
Les missions apparaîtront ici.
</p>

</div>

`;

return;

}




container.innerHTML="";




missions.forEach(m=>{



let item=

document.createElement("div");



item.className=

"history-item";



item.innerHTML=`

<h4>

${m.entreprise || "Mission terrain"}

</h4>


<p>

👤 Inspecteur :
${m.inspecteur}

</p>


<p>

📅 Date :
${m.date}

</p>


<p>

🚗 Distance :
${m.distance} km

</p>


<p>

📍 Points GPS :
${m.points}

</p>


<button 
class="btn-gps"
onclick="deleteMission('${m.id}')">

🗑 Supprimer

</button>

`;



container.appendChild(item);



});



}








// ======================================================
// SUPPRIMER MISSION
// ======================================================


window.deleteMission=function(id){



let missions=

getMissions();



missions =

missions.filter(

m=>m.id!==id

);



localStorage.setItem(

STORAGE_KEY,

JSON.stringify(missions)

);



displayMissions();



showNotification(

"Mission supprimée"

);



};








// ======================================================
// RECHERCHE INTELLIGENTE
// ======================================================


document
.getElementById("searchMission")
.addEventListener(

"input",

(e)=>{



let value=

e.target.value

.toLowerCase();



let missions=

getMissions();



let result=

missions.filter(m=>



JSON.stringify(m)

.toLowerCase()

.includes(value)



);



displayMissions(result);



}

);








// ======================================================
// ACTUALISATION HISTORIQUE
// ======================================================


document
.getElementById("refreshHistory")
.onclick=()=>{


displayMissions();



showNotification(

"Historique actualisé"

);



};








// ======================================================
// QR CODE MISSION
// ======================================================


function generateQRCode(mission){



let box=

document
.getElementById("qrcode");



if(!box)return;



box.innerHTML="";



new QRCode(

box,

{

text:

JSON.stringify({

id:mission.id,

inspecteur:mission.inspecteur,

date:mission.date

}),


width:160,

height:160


}

);



}






// ======================================================
// CHARGEMENT AUTOMATIQUE
// ======================================================


window.addEventListener(

"load",

()=>{


displayMissions();



});

// ======================================================
// SMART GPS IGT - InspecteurBot RDC
// Partie 2D : Signature + SOS + Partage GPS
// Créé par Inspecteur Limengo (Pmiller)
// ======================================================





// ======================================================
// SIGNATURE NUMÉRIQUE CANVAS
// ======================================================


let canvas =

document.getElementById(
"signaturePad"
);



let ctx = null;

let drawing = false;




if(canvas){


ctx = canvas.getContext("2d");

ctx.lineWidth = 3;

ctx.lineCap="round";

ctx.strokeStyle="#06111f";





canvas.addEventListener(

"mousedown",

startDraw

);



canvas.addEventListener(

"mousemove",

draw

);



canvas.addEventListener(

"mouseup",

stopDraw

);



canvas.addEventListener(

"mouseleave",

stopDraw

);





// Mobile


canvas.addEventListener(

"touchstart",

startDraw

);



canvas.addEventListener(

"touchmove",

draw

);



canvas.addEventListener(

"touchend",

stopDraw

);



}







function getMousePosition(e){



let rect=

canvas.getBoundingClientRect();



let x,y;



if(e.touches){


x=e.touches[0].clientX-rect.left;

y=e.touches[0].clientY-rect.top;



}

else{


x=e.clientX-rect.left;

y=e.clientY-rect.top;



}



return {x,y};

}





function startDraw(e){


drawing=true;


let pos=getMousePosition(e);


ctx.beginPath();


ctx.moveTo(

pos.x,

pos.y

);



e.preventDefault();


}





function draw(e){


if(!drawing)return;



let pos=getMousePosition(e);



ctx.lineTo(

pos.x,

pos.y

);



ctx.stroke();



e.preventDefault();


}




function stopDraw(){


drawing=false;


if(canvas){


window.signatureData=

canvas.toDataURL();



}


}





// ======================================================
// EFFACER SIGNATURE
// ======================================================


document
.getElementById("clearSignature")
?.addEventListener(

"click",

()=>{


ctx.clearRect(

0,

0,

canvas.width,

canvas.height

);



window.signatureData=null;



showNotification(

"Signature effacée"

);



});







// ======================================================
// VALIDATION SIGNATURE
// ======================================================


document
.getElementById("saveSignature")
?.addEventListener(

"click",

()=>{


window.signatureData=

canvas.toDataURL();



showNotification(

"Signature validée"

);



});








// ======================================================
// COPIER COORDONNÉES
// ======================================================


document
.getElementById("btnCopy")
?.addEventListener(

"click",

()=>{


let text=

`${currentPosition.lat},
${currentPosition.lng}`;



navigator.clipboard.writeText(text);



showNotification(

"Coordonnées copiées"

);



});








// ======================================================
// PARTAGE POSITION
// ======================================================


document
.getElementById("btnShare")
?.addEventListener(

"click",

()=>{


shareGPS();



});






function shareGPS(){



let url=

`https://maps.google.com/?q=${

currentPosition.lat

},

${

currentPosition.lng

}`;





if(navigator.share){



navigator.share({


title:

"Position Inspecteur IGT",


text:

"Ma position GPS terrain",


url:url



});



}

else{



window.open(

url,

"_blank"

);



}



}








// ======================================================
// SOS INSPECTEUR
// ======================================================


document
.getElementById("btnSOS")
?.addEventListener(

"click",

()=>{



let message=

`🚨 SOS INSPECTEUR

Position urgente :

https://maps.google.com/?q=${
currentPosition.lat
},${
currentPosition.lng
}

InspecteurBot RDC`;





if(navigator.share){



navigator.share({


title:

"SOS Inspecteur",


text:

message



});



}

else{


alert(message);


}



showNotification(

"Signal SOS envoyé"

);



});









// ======================================================
// ENVOI POSITION URGENCE
// ======================================================


document
.getElementById("btnSendPosition")
?.addEventListener(

"click",

()=>{


shareGPS();



});








// ======================================================
// NAVIGATION GOOGLE MAPS
// ======================================================


document
.getElementById("btnNavigate")
?.addEventListener(

"click",

()=>{


let url=

`https://www.google.com/maps/dir/?api=1&destination=${

currentPosition.lat

},

${

currentPosition.lng

}`;



window.open(

url,

"_blank"

);



});







// ======================================================
// LIEN GOOGLE MAPS AUTOMATIQUE
// ======================================================


function updateGoogleMapsLink(){



let link=

document
.getElementById(

"googleMapsLink"

);



if(!link)return;



link.href=

`https://maps.google.com/?q=${
currentPosition.lat
},
${
currentPosition.lng
}`;



}



setInterval(

updateGoogleMapsLink,

3000

);

// ======================================================
// SMART GPS IGT - InspecteurBot RDC
// Partie 2E : Rapports, exports et fonctions finales
// Créé par Inspecteur Limengo (Pmiller)
// ======================================================





// ======================================================
// GÉOCODAGE AUTOMATIQUE ADRESSE
// ======================================================


async function getAddress(lat,lng){


try{


let response=

await fetch(

`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`

);



let data=

await response.json();



let address=

data.display_name || "Adresse inconnue";



document
.getElementById("address")
.textContent=

address;



document
.getElementById("fullAddress")
.textContent=

address;



return address;



}

catch(e){


return "Adresse indisponible";


}



}








// Mise à jour adresse après position


setInterval(()=>{


if(

currentPosition.lat &&

currentPosition.lng

){


getAddress(

currentPosition.lat,

currentPosition.lng

);



}



},15000);







// ======================================================
// RAPPORT COMPLET MISSION
// ======================================================


document
.getElementById("generateReport")
?.addEventListener(

"click",

()=>{


let report = createReport();



let blob=

new Blob(

[report],

{

type:"text/plain"

}

);



let url=

URL.createObjectURL(blob);



let link=

document.createElement("a");



link.href=url;



link.download=

"Rapport_GPS_IGT.txt";



link.click();



showNotification(

"Rapport généré"

);



});







function createReport(){



let missions=

getMissions();



let last=

missions[0] || {};





return `

SMART GPS IGT

InspecteurBot RDC

====================


IDENTIFIANT :

${last.id || "--"}


Inspecteur :

${last.inspecteur || "--"}


Entreprise :

${last.entreprise || "--"}


Type mission :

${last.type || "--"}


Date :

${last.date || "--"}


Objet :

${last.objet || "--"}


Notes terrain :

${last.notes || "--"}


DISTANCE :

${last.distance || "0"} km


POINTS GPS :

${last.points || 0}


DUREE :

${formatSeconds(last.duree || 0)}


POSITION DEPART :

${JSON.stringify(last.positionDepart)}


POSITION FIN :

${JSON.stringify(last.positionFin)}



Signature :

${last.signature ? "Validée" : "Non disponible"}



====================

SMART GPS IGT © 2026

Créé par Inspecteur Limengo (Pmiller)

`;



}








// ======================================================
// FORMAT TEMPS
// ======================================================


function formatSeconds(sec){



let h=

Math.floor(sec/3600);



let m=

Math.floor((sec%3600)/60);



let s=

sec%60;



return

`${h}h ${m}min ${s}s`;



}







// ======================================================
// EXPORT DONNÉES JSON
// ======================================================


document
.getElementById("exportData")
?.addEventListener(

"click",

()=>{



let data=

JSON.stringify(

getMissions(),

null,

2

);



let blob=

new Blob(

[data],

{

type:"application/json"

}

);



let link=

document.createElement("a");



link.href=

URL.createObjectURL(blob);



link.download=

"missions_IGT.json";



link.click();



showNotification(

"Données exportées"

);



});







// ======================================================
// IMPRESSION RAPPORT
// ======================================================


document
.getElementById("printReport")
?.addEventListener(

"click",

()=>{


window.print();



});







// ======================================================
// BATTERIE APPAREIL
// ======================================================


if(navigator.getBattery){



navigator
.getBattery()
.then(

battery=>{


function updateBattery(){



let el=

document
.getElementById("battery");



if(el){


el.textContent=

Math.round(

battery.level*100

)+"%";



}



}



updateBattery();



battery.addEventListener(

"levelchange",

updateBattery

);



}

);



}







// ======================================================
// CONNEXION TYPE
// ======================================================


if(navigator.connection){


document
.getElementById("connectionType")
.textContent=

navigator.connection.effectiveType;


}







// ======================================================
// ACTUALISATION DIRECTION
// ======================================================


if(window.DeviceOrientationEvent){



window.addEventListener(

"deviceorientation",

event=>{


let angle=

Math.round(

event.alpha || 0

);



let el=

document
.getElementById("compass");



if(el){


el.textContent=

angle+"°";

}



document
.getElementById("direction")
.textContent=

angle+"°";



});



}








// ======================================================
// RAFRAICHISSEMENT GPS MANUEL
// ======================================================


document
.getElementById("btnRefresh")
?.addEventListener(

"click",

()=>{


if(currentPosition.lat){


updateMapPosition();



showNotification(

"GPS actualisé"

);



}



});








// ======================================================
// INITIALISATION FINALE
// ======================================================


console.log(

"SMART GPS IGT chargé avec succès"

);



console.log(

"Créé par Inspecteur Limengo (Pmiller)"

);

