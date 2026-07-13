/*==================================================
 INSPECTEURBOT RDC
 MODULE COMMUNIQUÉS OFFICIELS
 Fichier : assets/js/communiques.js

 Fonctions :
 - Lecteur audio professionnel
 - Recherche
 - Filtres
 - Statistiques
 - Favoris
 - Partage
 - Notifications
==================================================*/


document.addEventListener("DOMContentLoaded",()=>{


/*==============================
 VARIABLES AUDIO
==============================*/

const player =
document.getElementById("mainPlayer");


const volumeControl =
document.getElementById("volumeControl");


const speedControl =
document.getElementById("speedControl");


const currentTime =
document.getElementById("currentTime");


const duration =
document.getElementById("duration");



/*==============================
 FORMAT TEMPS
==============================*/

function formatTime(seconds){

if(isNaN(seconds))
return "00:00";


let minutes =
Math.floor(seconds / 60);


let secondes =
Math.floor(seconds % 60);


return String(minutes).padStart(2,"0")
+":"+String(secondes).padStart(2,"0");

}



/*==============================
 COMMANDES AUDIO
==============================*/


window.playAudio=function(){

if(player)
player.play();

}



window.pauseAudio=function(){

if(player)
player.pause();

}



window.stopAudio=function(){

if(player){

player.pause();

player.currentTime=0;

}

}



window.forwardAudio=function(){

if(player)
player.currentTime+=10;

}



window.backAudio=function(){

if(player)
player.currentTime-=10;

}



window.muteAudio=function(){

if(player)
player.muted=!player.muted;

}



/*==============================
 CHARGER COMMUNIQUÉ
==============================*/


window.chargerCommunique=function(fichier){

if(player){

player.src=fichier;

player.load();

player.play();

}

}



/*==============================
 AUDIO TEMPS
==============================*/


if(player){


player.addEventListener(
"loadedmetadata",
()=>{

duration.textContent =
formatTime(player.duration);

});


player.addEventListener(
"timeupdate",
()=>{

currentTime.textContent =
formatTime(player.currentTime);

});



}



/*==============================
 VOLUME
==============================*/


if(volumeControl){

volumeControl.addEventListener(
"input",
()=>{

player.volume =
volumeControl.value;

});

}



/*==============================
 VITESSE
==============================*/


if(speedControl){

speedControl.addEventListener(
"change",
()=>{

player.playbackRate =
speedControl.value;

});

}




/*==============================
 RECHERCHE
==============================*/


const recherche =
document.getElementById(
"searchCommunique"
);


const cartes =
document.querySelectorAll(
".card[data-category]"
);



if(recherche){


recherche.addEventListener(
"keyup",
()=>{


let texte =
recherche.value.toLowerCase();



cartes.forEach(carte=>{


let contenu =
carte.innerText.toLowerCase();



if(contenu.includes(texte)){


carte.style.display="block";


}else{


carte.style.display="none";


}


});


});


}



/*==============================
 FILTRES
==============================*/


const categories =
document.querySelectorAll(
".category"
);



categories.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


categories.forEach(b=>
b.classList.remove("active")
);


btn.classList.add("active");


let filtre =
btn.dataset.filter;



cartes.forEach(carte=>{


if(
filtre==="all" ||
carte.dataset.category===filtre
){


carte.style.display="block";


}else{


carte.style.display="none";


}



});


});


});




/*==============================
 STATISTIQUES
==============================*/


const total =
document.getElementById(
"totalCommuniques"
);



if(total){

total.textContent =
cartes.length;

}



/*==============================
 COMPTEUR ÉCOUTES
==============================*/


let lectures =
Number(
localStorage.getItem(
"lecturesCommuniques"
)
)||0;



const affichageLecture =
document.getElementById(
"totalLectures"
);



if(affichageLecture){

affichageLecture.textContent =
lectures;

}



if(player){


player.addEventListener(
"play",
()=>{


lectures++;


localStorage.setItem(
"lecturesCommuniques",
lectures
);



if(affichageLecture)
affichageLecture.textContent =
lectures;



});

}



/*==============================
 PARTAGE
==============================*/


window.partagerCommunique=function(titre){


if(navigator.share){


navigator.share({

title:titre,

text:
"Communiqué officiel InspecteurBot RDC",

url:
window.location.href


});


}else{


alert(
"Partage non disponible"
);


}


};



/*==============================
 FAVORIS
==============================*/


window.ajouterFavori=function(id){


let favoris =
JSON.parse(
localStorage.getItem(
"favorisCommuniques"
)
)||[];



if(!favoris.includes(id)){


favoris.push(id);



localStorage.setItem(
"favorisCommuniques",
JSON.stringify(favoris)
);



alert(
"⭐ Ajouté aux favoris"
);



}



};



/*==============================
 NOTIFICATION
==============================*/


setTimeout(()=>{


if(Notification){

new Notification(
"InspecteurBot RDC",
{
body:
"Nouveau communiqué officiel disponible"
}
);

}


},5000);



console.log(
"✅ communiques.js chargé"
);



});
