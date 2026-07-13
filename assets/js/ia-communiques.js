/*==================================================
 INSPECTEURBOT RDC
 MODULE IA COMMUNIQUÉS

 Fichier :
 assets/js/ia-communiques.js

 Rôle :
 - Connecter les communiqués à l'assistant IA
 - Ajouter la recherche spécifique Communiqués
==================================================*/


document.addEventListener(
"DOMContentLoaded",
()=>{


const bouton =
document.getElementById("searchBtn");


const champ =
document.getElementById("searchInput");


const resultat =
document.getElementById("searchResults");



if(!bouton || !champ || !resultat){

console.log(
"Module IA Communiqués non actif sur cette page"
);

return;

}





bouton.addEventListener(
"click",
async()=>{


const question =
champ.value.trim();



if(!question)
return;



resultat.innerHTML = `

<div class="msg">

🤖 Recherche dans les communiqués officiels...

</div>

`;





try{


let reponse = "";



if(
typeof reponseIACommuniques === "function"
){


reponse =
reponseIACommuniques(question);



}else{


reponse =

"Base Communiqués IA non chargée.";


}





resultat.innerHTML = `

<div class="ia-response">


<h3>
📢 Communiqués InspecteurBot
</h3>


<p>
${reponse.replace(/\n/g,"<br>")}
</p>


</div>

`;





}

catch(e){


console.error(
"Erreur IA Communiqués :",
e
);



resultat.innerHTML =

"❌ Erreur lors de la recherche.";


}


});



});
