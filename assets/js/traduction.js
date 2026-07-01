"use strict";

/*=========================================================
 INSPECTEURBOT IA RDC
 MODULE TRADUCTION MULTILINGUE
 Version 2.0
=========================================================*/


/*=========================================================
 CONFIGURATION
=========================================================*/


const TraductionIA={

version:"2.0",

actif:true,

langueSource:"fr",

langueCible:"fr",

auto:true,

conserverOriginal:true

};



/*=========================================================
 LANGUES RDC
=========================================================*/


const LanguesIA={


fr:{
nom:"Français",
locale:"fr-FR"
},


ln:{
nom:"Lingala",
locale:"ln-CD"
},


sw:{
nom:"Swahili",
locale:"sw-CD"
},


kg:{
nom:"Kikongo",
locale:"kg-CD"
},


lu:{
nom:"Tshiluba",
locale:"lu-CD"
},


en:{
nom:"English",
locale:"en-US"
},


pt:{
nom:"Português",
locale:"pt-PT"
}


};





/*=========================================================
 DICTIONNAIRE JURIDIQUE
=========================================================*/


const DictionnaireIA={


contrat:{

fr:"contrat de travail",

ln:"kontra ya mosala",

sw:"mkataba wa kazi",

kg:"kontra ya kisalu",

lu:"kontra wa mudimu",

en:"employment contract",

pt:"contrato de trabalho"

},



travailleur:{

fr:"travailleur",

ln:"mosali",

sw:"mfanyakazi",

kg:"musadi",

lu:"mufanyi wa mudimu",

en:"worker",

pt:"trabalhador"

},



employeur:{

fr:"employeur",

ln:"patron",

sw:"mwajiri",

kg:"mfumu",

lu:"patron",

en:"employer",

pt:"empregador"

},



salaire:{

fr:"salaire",

ln:"lifuti",

sw:"mshahara",

kg:"mfutu",

lu:"difutu",

en:"salary",

pt:"salário"

},



licenciement:{

fr:"licenciement",

ln:"kobengana na mosala",

sw:"kufukuzwa",

kg:"kubengana",

lu:"kubingisha",

en:"dismissal",

pt:"demissão"

},



inspection:{

fr:"inspection",

ln:"inspection",

sw:"ukaguzi",

kg:"kukengila",

lu:"mukengeshi",

en:"inspection",

pt:"inspeção"

}


};





/*=========================================================
 NORMALISATION
=========================================================*/


function normaliserTexte(t){

return (t||"")

.toLowerCase()

.normalize("NFD")

.replace(/[\u0300-\u036f]/g,"")

.trim();

}





/*=========================================================
 CHANGER LANGUE
=========================================================*/


function definirLangue(code){


if(LanguesIA[code]){


TraductionIA.langueCible=code;


}


}





/*=========================================================
 DETECTION SIMPLE
=========================================================*/


function detecterLangue(texte){


texte=normaliserTexte(texte);



if(
texte.includes("mbote") ||
texte.includes("mosala")
)

return "ln";



if(
texte.includes("habari") ||
texte.includes("kazi")
)

return "sw";



if(
texte.includes("hello")
)

return "en";



return "fr";


}





/*=========================================================
 RECHERCHE CONCEPT
=========================================================*/


function trouverConcept(mot){


mot=normaliserTexte(mot);



for(let concept in DictionnaireIA){


let langues=DictionnaireIA[concept];



for(let langue in langues){


if(

normaliserTexte(langues[langue])

===mot

)

return concept;



}


}



return null;


}





/*=========================================================
 TRADUCTION MOTS JURIDIQUES
=========================================================*/


function traduireTexteIA(

texte,

langue="fr"

){


let mots=

normaliserTexte(texte)

.split(" ");



let resultat=[];



mots.forEach(mot=>{


let concept=

trouverConcept(mot);



if(concept){


resultat.push(

DictionnaireIA[concept][langue]

);


}else{


resultat.push(mot);


}



});



return resultat.join(" ");


}





/*=========================================================
 TRADUCTION REPONSE IA
=========================================================*/


function traduireReponseIA(

reponse,

langue

){


return {


original:reponse,


traduction:

traduireTexteIA(

reponse,

langue

),


langue:langue,


date:new Date()


};


}





/*=========================================================
 PHRASES TERRAIN INSPECTION
=========================================================*/


const TerrainIA={


contrat:{

fr:"Veuillez présenter le contrat de travail.",

ln:"Lakisa kontra ya mosala.",

sw:"Onyesha mkataba wa kazi.",

en:"Show the employment contract."

},


registre:{

fr:"Veuillez présenter le registre du personnel.",

ln:"Lakisa registre ya basali.",

sw:"Onyesha daftari la wafanyakazi.",

en:"Show employee register."

}


};





function phraseTerrain(

cle,

langue="fr"

){


return TerrainIA[cle]

?
TerrainIA[cle][langue] ||

TerrainIA[cle].fr

:

"";


}





/*=========================================================
 EXPORT GLOBAL
=========================================================*/


window.TraductionIA = TraductionIA;

window.traduireTexteIA = traduireTexteIA;

window.traduireReponseIA = traduireReponseIA;

window.phraseTerrain = phraseTerrain;

window.detecterLangue = detecterLangue;


console.log(
"✅ traduction.js InspecteurBot IA RDC V2 chargé"
);
