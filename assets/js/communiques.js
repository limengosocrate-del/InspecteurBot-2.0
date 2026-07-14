/*==================================================
 INSPECTEURBOT RDC
 MODULE COMMUNIQUÉS OFFICIELS
 Fichier : assets/js/communiques.js

 Version : JSON dynamique
==================================================*/


let listeCommuniques = [];

let player;



document.addEventListener("DOMContentLoaded",()=>{


player = document.getElementById("mainPlayer");

chargerCommuniques();


initialiserRecherche();

initialiserFiltres();

initialiserAudio();



});



/*==================================================
 CHARGEMENT DU JSON
==================================================*/


async function chargerCommuniques(){


try{


const response =
await fetch("assets/data/communiques.json");



const data =
await response.json();



listeCommuniques =
data.communiques;



afficherCommuniques(listeCommuniques);



mettreAJourStatistiques();



console.log(
"✅ Communiqués chargés depuis JSON"
);



}catch(error){


console.error(
"Erreur chargement communiqués : ",
error
);


}


}





/*==================================================
 CREATION AUTOMATIQUE DES CARTES
==================================================*/


function afficherCommuniques(data){



const container =
document.getElementById("listeCommuniques");



if(!container)
return;



container.innerHTML="";



data.forEach(communique=>{


let badgeClass =
"informaton";



if(communique.priorite==="haute"){

badgeClass="urgent";

}

else if(communique.priorite==="importante"){

badgeClass="important";

}



container.innerHTML += `


<div class="card"
data-category="${communique.categorie}">


<span class="badge ${badgeClass}">

${communique.priorite}

</span>


<h2>

📢 ${communique.titre}

</h2>


<div class="infos">


<span>

<i class="fa-solid fa-calendar"></i>

${communique.datePublication}

</span>


<span>

<i class="fa-solid fa-user"></i>

${communique.auteur}

</span>


<span>

<i class="fa-solid fa-clock"></i>

${communique.duree}

</span>


</div>



<audio controls>

<source src="${communique.audio}"

type="audio/mpeg">

</audio>



<p>

${communique.description}

</p>



<div class="actions">


<button onclick="chargerCommunique('${communique.audio}')">

🎧 Écouter

</button>


<button onclick="lireCommunique(${communique.id})">

📄 Lire

</button>


<button onclick="telechargerAudio('${communique.audio}')">

⬇ Télécharger

</button>


<button onclick="partagerCommunique('${communique.titre}')">

🔗 Partager

</button>


</div>


</div>


`;



});



}






/*==================================================
 LECTEUR AUDIO PRINCIPAL
==================================================*/


function chargerCommunique(audio){


if(player){


player.src=audio;


player.play();


}


}



window.chargerCommunique =
chargerCommunique;






/*==================================================
 RECHERCHE
==================================================*/


function initialiserRecherche(){


const input =
document.getElementById("searchCommunique");



if(!input)
return;



input.addEventListener(
"input",
()=>{


let recherche =
input.value.toLowerCase();



let resultat =
listeCommuniques.filter(c=>


c.titre.toLowerCase()
.includes(recherche)


||


c.description.toLowerCase()
.includes(recherche)


||


c.numero.toLowerCase()
.includes(recherche)


);



afficherCommuniques(resultat);



});


}





/*==================================================
 FILTRES
==================================================*/


function initialiserFiltres(){


const boutons =
document.querySelectorAll(".category");



boutons.forEach(btn=>{


btn.addEventListener(
"click",
()=>{


let filtre =
btn.dataset.filter;



if(filtre==="all"){


afficherCommuniques(
listeCommuniques
);


return;


}



afficherCommuniques(

listeCommuniques.filter(
c=>c.categorie===filtre
)

);


});


});


}






/*==================================================
 STATISTIQUES
==================================================*/


function mettreAJourStatistiques(){



let total =
listeCommuniques.length;



const element =
document.getElementById(
"totalCommuniques"
);



if(element){

element.textContent=total;

}



}







/*==================================================
 TELECHARGEMENT
==================================================*/


function telechargerAudio(fichier){


let lien =
document.createElement("a");


lien.href=fichier;


lien.download="communique.mp3";


lien.click();


}


window.telechargerAudio =
telechargerAudio;







/*==================================================
 PARTAGE
==================================================*/


function partagerCommunique(titre){


if(navigator.share){


navigator.share({

title:titre,

text:
"Communiqué officiel InspecteurBot RDC",

url:
window.location.href


});


}


}


window.partagerCommunique =
partagerCommunique;







/*==================================================
 LECTURE PROFESSIONNELLE D'UN COMMUNIQUÉ
==================================================*/

function lireCommunique(id){

    const communique = listeCommuniques.find(c => c.id === id);

    if(!communique){
        return;
    }

    // Ouverture de la fenêtre
    document.getElementById("lectureModal").style.display = "flex";

    // Remplissage des informations
    document.getElementById("lectureTitre").textContent =
        communique.titre;

    document.getElementById("lectureNumero").textContent =
        "Communiqué N° " + communique.numero;

    document.getElementById("lectureDate").innerHTML =
        "📅 " + communique.datePublication;

    document.getElementById("lectureAuteur").innerHTML =
        "👤 " + communique.auteur;

    document.getElementById("lectureCategorie").innerHTML =
        "📂 " + communique.categorie;

    document.getElementById("lectureTexte").textContent =
        communique.texte;

    // Bouton Écouter
    document.getElementById("btnEcouterLecture").onclick = function(){

        chargerCommunique(communique.audio);

    };

}

window.lireCommunique = lireCommunique;

/*==================================================
 FERMETURE DE LA FENÊTRE
==================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    const fermer =
    document.getElementById("btnFermerLecture");

    if(fermer){

        fermer.onclick = function(){

            document.getElementById("lectureModal")
            .style.display = "none";

        };

    }

});

/*==================================================
 FERMER EN CLIQUANT À L'EXTÉRIEUR
==================================================*/

window.onclick = function(event){

    const modal =
    document.getElementById("lectureModal");

    if(event.target === modal){

        modal.style.display = "none";

    }

};
