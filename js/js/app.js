'use strict';

/*
====================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 APP.JS
 Contrôleur principal
====================================================
*/


document.addEventListener("DOMContentLoaded",()=>{


console.log(
"🤖 InspecteurBot IA RDC 4.0 Premium démarré"
);



/*====================================================
 INITIALISATION DES MODULES
====================================================*/


const modules = [

"clock",
"weather",
"map",
"voice",
"scanner",
"qrcode",
"verification",
"calendar",
"stats",
"chat-history",
"assistant",
"update"

];



modules.forEach(module=>{

console.log(
"Module chargé :",
module
);

});





/*====================================================
 BOUTON ASSISTANT IA
====================================================*/


const btnAssistant =
document.getElementById("btnAssistant");



if(btnAssistant){


btnAssistant.addEventListener(
"click",
()=>{


if(typeof openAssistant === "function"){

openAssistant();

}

else{


showNotification(
"Assistant IA",
"Module IA en préparation..."
);


}


});

}





/*====================================================
 BOUTON VOIX
====================================================*/


const btnVoice =
document.getElementById("btnVoice");



if(btnVoice){


btnVoice.addEventListener(
"click",
()=>{


if(typeof startVoice === "function"){

startVoice();

}

else{


showNotification(
"Voix",
"Module vocal non chargé"
);


}


});


}







/*====================================================
 BOUTON SCANNER
====================================================*/


const btnCamera =
document.getElementById("btnCamera");



if(btnCamera){


btnCamera.addEventListener(
"click",
()=>{


if(typeof openScanner === "function"){

openScanner();

}

else{


showNotification(
"Scanner",
"Scanner documentaire activé prochainement"
);


}


});


}





/*====================================================
 BOUTON THEME
====================================================*/


const btnTheme =
document.getElementById("btnTheme");



if(btnTheme){


btnTheme.addEventListener(
"click",
()=>{


document.body.classList.toggle(
"dark"
);



localStorage.setItem(
"theme",
document.body.classList.contains("dark")
?"dark"
:"light"
);



showNotification(
"Thème",
"Mode modifié avec succès"
);



});


}






/*====================================================
 RESTAURATION THEME
====================================================*/


const savedTheme =
localStorage.getItem("theme");



if(savedTheme==="dark"){

document.body.classList.add("dark");

}





/*====================================================
 RECHERCHE GLOBALE
====================================================*/


const search =
document.getElementById(
"searchInput"
);



if(search){


search.addEventListener(
"input",
(e)=>{


if(typeof globalSearch==="function"){

globalSearch(
e.target.value
);


}


});


}







/*====================================================
 LANGUES
====================================================*/


const lang =
document.getElementById(
"langSwitcher"
);



if(lang){


lang.addEventListener(
"change",
()=>{


if(typeof changeLanguage==="function"){

changeLanguage(
lang.value
);

}

else{


showNotification(
"Langue",
"Langue sélectionnée : "+
lang.value
);


}


});


}






});





/*====================================================
 SYSTEME NOTIFICATION
====================================================*/


function showNotification(
title,
message
){



let box =
document.createElement(
"div"
);



box.className =
"notification";



box.innerHTML = `

<strong>${title}</strong>
<br>
${message}

`;



document.body.appendChild(box);




setTimeout(()=>{


box.remove();


},4000);



}





window.showNotification =
showNotification;

