/* ==========================================
   QUIZ ENGINE
   ACADEMIE INSPECTEURBOT IGT RDC
========================================== */



let banqueQuestions = [];

let questionActuelle = null;

let reponseCorrecte = null;

let questionsValidees = [];

let questionsErreur = [];

let xp = 0;

let vies = 5;

let niveauActuel = 1;

let derniereQuestion = null;





/* ==========================================
   CHARGEMENT BANQUE QUESTIONS
========================================== */


async function chargerQuestions(){


try{


let resultat = await fetch(
"data/question_bank.json"
);


banqueQuestions =
await resultat.json();



chargerSauvegarde();


demarrerJeu();



}

catch(erreur){


console.error(
"Erreur chargement questions",
erreur
);


}


}






/* ==========================================
   DEMARRAGE
========================================== */


function demarrerJeu(){


choisirQuestion();


actualiserAffichage();


}








/* ==========================================
   CHOISIR QUESTION ALEATOIRE
========================================== */


function choisirQuestion(){



let disponibles =
banqueQuestions.filter(q=>{


return (

q.niveau <= niveauActuel

&&

!questionsValidees.includes(q.id)

&&

q.id !== derniereQuestion

);


});




if(disponibles.length===0){



disponibles =
banqueQuestions.filter(q=>{


return (

q.niveau <= niveauActuel

&&

!questionsValidees.includes(q.id)

);


});


}





// Si toutes les questions sont maîtrisées

if(disponibles.length===0){


verifierFinNiveau();


return;


}





let hasard =
Math.floor(
Math.random()*disponibles.length
);



questionActuelle =
disponibles[hasard];



derniereQuestion =
questionActuelle.id;



afficherQuestion();


}







/* ==========================================
   AFFICHER QUESTION
========================================== */


function afficherQuestion(){



document.getElementById(
"categorie"
).innerHTML =

questionActuelle.categorie;




document.getElementById(
"question"
).innerHTML =

questionActuelle.question;




let choix =
[...questionActuelle.choix];



choix =
melanger(choix);



reponseCorrecte =
choix.indexOf(
questionActuelle.choix[
questionActuelle.bonne
]
);




let zone =
document.getElementById(
"reponses"
);



zone.innerHTML="";





choix.forEach((texte,index)=>{


let bouton =
document.createElement(
"button"
);



bouton.innerHTML =

(String.fromCharCode(65+index))
+
" - "
+
texte;



bouton.onclick=()=>{


verifierReponse(
index,
bouton
);


};



zone.appendChild(
bouton
);



});


}






/* ==========================================
   VERIFICATION REPONSE
========================================== */


function verifierReponse(index,bouton){



let boutons =
document.querySelectorAll(
"#reponses button"
);



boutons.forEach(b=>{

b.disabled=true;

});




if(index===reponseCorrecte){



bouton.classList.add(
"bonne"
);



document.getElementById(
"message"
).innerHTML =

"✅ Bonne réponse";



xp +=20;



questionsValidees.push(
questionActuelle.id
);



}

else{


bouton.classList.add(
"mauvaise"
);



document.getElementById(
"message"
).innerHTML =

"❌ Mauvaise réponse";



vies--;



questionsErreur.push(
questionActuelle.id
);



verifierVies();



}




sauvegarder();



setTimeout(()=>{


choisirQuestion();


},1200);



}









/* ==========================================
   SYSTEME DE VIES
========================================== */


function verifierVies(){



if(vies<=0){



alert(

"⚠️ Toutes vos vies sont terminées.\n\nVotre parcours doit recommencer depuis le début avec une nouvelle série de questions."

);



reinitialiserProgression();



}



}




function reinitialiserProgression(){



xp=0;


vies=5;


niveauActuel=1;


questionsValidees=[];


questionsErreur=[];



localStorage.removeItem(
"IGT_progression"
);



}








/* ==========================================
   FIN DE NIVEAU
========================================== */


function verifierFinNiveau(){



let niveauQuestions =

banqueQuestions.filter(q=>{


return q.niveau===niveauActuel;


});





let termine =

niveauQuestions.every(q=>{


return questionsValidees.includes(q.id);


});





if(termine){


niveauActuel++;



alert(

"🏆 Niveau réussi ! Nouveau niveau débloqué."

);



sauvegarder();


}



}







/* ==========================================
   MELANGE
========================================== */


function melanger(tableau){


return tableau.sort(
()=>Math.random()-0.5
);


}








/* ==========================================
   SAUVEGARDE
========================================== */


function sauvegarder(){


let donnees={


xp,

vies,

niveauActuel,

questionsValidees,

questionsErreur


};



localStorage.setItem(

"IGT_progression",

JSON.stringify(donnees)

);



actualiserAffichage();



}








/* ==========================================
   CHARGER SAUVEGARDE
========================================== */


function chargerSauvegarde(){



let data =
localStorage.getItem(
"IGT_progression"
);



if(data){


let sauvegarde =
JSON.parse(data);



xp =
sauvegarde.xp ||0;


vies =
sauvegarde.vies ||5;


niveauActuel =
sauvegarde.niveauActuel ||1;


questionsValidees =
sauvegarde.questionsValidees ||[];


questionsErreur =
sauvegarde.questionsErreur ||[];


}


}








/* ==========================================
   AFFICHAGE
========================================== */


function actualiserAffichage(){



let xpZone =
document.getElementById("xp");


if(xpZone)
xpZone.innerHTML=xp;




let vieZone =
document.getElementById("vies");


if(vieZone)
vieZone.innerHTML=vies;



let validation =
document.getElementById(
"validation"
);



if(validation)

validation.innerHTML =
questionsValidees.length;



}






// lancement automatique

chargerQuestions();
