/* =====================================================
   QUIZ ENGINE V3
   ACADEMIE INSPECTEURBOT IGT RDC
===================================================== */


let questions = [];

let questionActuelle = null;

let reponseCorrecte = null;

let historiqueQuestions = [];

let erreurs = [];



/* ===============================
 PROFIL JOUEUR
=============================== */


let profil = {

nom:"Inspecteur en Formation",

grade:"Débutant",

niveau:1,

vies:5,

cdf:0,

usd:0,

questionsValidees:0,

examens:0,

missions:0

};






/* ===============================
 CHARGEMENT QUESTIONS
=============================== */


async function chargerQuestions(){


try{


let response = await fetch(
"data/question_bank.json"
);


questions = await response.json();


chargerSauvegarde();


nouvelleQuestion();


afficherProfil();


}

catch(error){

console.error(
"Erreur chargement banque questions",
error
);

}


}







/* ===============================
 NOUVELLE QUESTION
=============================== */


function nouvelleQuestion(){


let disponibles =
questions.filter(q=>{


return (

q.niveau <= profil.niveau

&&

!historiqueQuestions.includes(q.id)

);


});



if(disponibles.length===0){


historiqueQuestions=[];


disponibles=questions;


}




let index =
Math.floor(
Math.random()*disponibles.length
);



questionActuelle =
disponibles[index];



historiqueQuestions.push(
questionActuelle.id
);



afficherQuestion();


}








/* ===============================
 AFFICHAGE QUESTION
=============================== */


function afficherQuestion(){



document.getElementById(
"categorieQuiz"
).innerHTML =

questionActuelle.categorie || "Formation";




document.getElementById(
"questionText"
).innerHTML =

questionActuelle.question;



let zone =
document.getElementById(
"answersContainer"
);



zone.innerHTML="";





let choix =
[...questionActuelle.choix];



choix.sort(
()=>Math.random()-0.5
);





choix.forEach((texte)=>{


let bouton =
document.createElement(
"button"
);



bouton.textContent =
texte;



bouton.onclick=()=>{


verifierReponse(
texte,
bouton
);


};



zone.appendChild(
bouton
);



});



afficherRecompense();



}









/* ===============================
 VERIFICATION
=============================== */


function verifierReponse(
choix,
bouton
){



let boutons =
document.querySelectorAll(
"#answersContainer button"
);



boutons.forEach(b=>{

b.disabled=true;

});





let bonneReponse =

questionActuelle.choix[
questionActuelle.bonne
];





if(choix===bonneReponse){



bouton.classList.add(
"correct"
);



profil.questionsValidees++;



attribuerRecompense();




document.getElementById(
"feedback"
).innerHTML =

"✅ Bonne réponse ! Progression validée.";




}

else{


bouton.classList.add(
"wrong"
);



profil.vies--;



erreurs.push(
questionActuelle.id
);



document.getElementById(
"feedback"
).innerHTML =

"❌ Mauvaise réponse. Vous perdez une vie.";





verifierVies();


}




sauvegarder();



setTimeout(()=>{


nouvelleQuestion();


},1500);



}








/* ===============================
 SYSTEME RECOMPENSES
=============================== */


function attribuerRecompense(){



let recompense =

questionActuelle.recompense;



if(!recompense){


recompense={

type:"CDF",

montant:10000

};


}





if(recompense.type==="CDF"){


profil.cdf +=
recompense.montant;


}

else{


profil.usd +=
recompense.montant;


}




}





function afficherRecompense(){



let zone =
document.getElementById(
"rewardDisplay"
);



if(!zone)
return;




let r =
questionActuelle.recompense;



if(r){


if(r.type==="CDF")

zone.innerHTML =
r.montant+" FC";


else

zone.innerHTML =
r.montant+" $";


}


}









/* ===============================
 VIES
=============================== */


function verifierVies(){



if(profil.vies<=0){



alert(

"⚠️ Toutes vos vies sont terminées.\nVotre parcours recommence au début du niveau."

);



profil.vies=5;

profil.niveau=1;

profil.cdf=0;

profil.usd=0;

profil.questionsValidees=0;



historiqueQuestions=[];



}


}









/* ===============================
 GRADE
=============================== */


function verifierPromotion(){



if(
profil.questionsValidees>=100
&&
profil.niveau===1
){


profil.niveau=2;

profil.grade="Administratif";


alert(
"🎖️ Promotion obtenue : Administratif"
);


}



}









/* ===============================
 AFFICHAGE PROFIL
=============================== */


function afficherProfil(){



let vie =
document.getElementById(
"lifeDisplay"
);



if(vie)

vie.innerHTML =
"❤️".repeat(profil.vies);





let fc =
document.getElementById(
"cdf"
);



if(fc)

fc.innerHTML =
profil.cdf+" FC";





let usd =
document.getElementById(
"usd"
);



if(usd)

usd.innerHTML =
profil.usd+" $";





let grade =
document.getElementById(
"grade"
);



if(grade)

grade.innerHTML =
profil.grade;


}









/* ===============================
 SAUVEGARDE
=============================== */


function sauvegarder(){


localStorage.setItem(

"IGT_ACADEMIE",

JSON.stringify(profil)

);



afficherProfil();


}






function chargerSauvegarde(){



let data =
localStorage.getItem(
"IGT_ACADEMIE"
);



if(data){


profil =
JSON.parse(data);


}


}








/* ===============================
 MODE SOMBRE
=============================== */


let darkButton =
document.getElementById(
"darkModeBtn"
);



if(darkButton){


darkButton.onclick=function(){


document.body.classList.toggle(
"dark-mode"
);



localStorage.setItem(

"theme",

document.body.classList.contains(
"dark-mode"
)

);



};


}






if(
localStorage.getItem("theme")
==="true"

){


document.body.classList.add(
"dark-mode"
);


}





/* ===============================
 DEMARRAGE
=============================== */


chargerQuestions();
