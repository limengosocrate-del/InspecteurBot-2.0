/*==================================================
 INSPECTEURBOT RDC
 MODULE RAG IA - COMMUNIQUÉS OFFICIELS

 Fichier : assets/js/rag-communiques.js

 Fonction :
 - Chargement JSON
 - Indexation des communiqués
 - Recherche intelligente
==================================================*/


let baseCommuniquesRAG = [];



/*========================================
 CHARGEMENT COMMUNIQUÉS JSON
========================================*/


async function chargerBaseCommuniquesRAG(){


try{


const response = await fetch(
"assets/data/communiques.json"
);



const data =
await response.json();



baseCommuniquesRAG =
data.communiques;



console.log(
"✅ Base RAG Communiqués chargée :",
baseCommuniquesRAG.length
);



return baseCommuniquesRAG;



}

catch(error){


console.error(
"❌ Erreur chargement RAG Communiqués",
error
);



return [];

}


}





/*========================================
 NORMALISATION TEXTE IA
========================================*/


function normaliserTexteRAG(texte){


return texte

.toLowerCase()

.normalize("NFD")

.replace(/[\u0300-\u036f]/g,"")

.replace(/[^\w\s]/gi,"")

.trim();


}






/*========================================
 CRÉATION DES DOCUMENTS IA
========================================*/


function creerDocumentsRAGCommuniques(){


return baseCommuniquesRAG.map(c=>{


return {


id:c.id,


titre:c.titre,


contenu:


`

${c.titre}

Numéro :
${c.numero}

Date :
${c.datePublication}

Auteur :
${c.auteur}

Catégorie :
${c.categorie}


Description :

${c.description}


Texte officiel :

${c.texte}


Mots clés :

${c.motsCles.join(", ")}

`



};



});


}







/*========================================
 RECHERCHE RAG SIMPLE
========================================*/


function rechercherCommuniqueRAG(question){



let recherche =
normaliserTexteRAG(question);



let documents =
creerDocumentsRAGCommuniques();



let resultats =
documents.filter(doc=>{


let contenu =
normaliserTexteRAG(
doc.contenu
);



return contenu.includes(recherche);



});



return resultats;



}






/*========================================
 REPONSE IA COMMUNIQUÉS
========================================*/


function reponseIACommuniques(question){


let resultats =
rechercherCommuniqueRAG(question);



if(resultats.length===0){


return `

Aucun communiqué correspondant
n'a été trouvé dans la base officielle
InspecteurBot RDC.

`;


}



let reponse =

`

📢 Résultat du Communiqué Officiel :

`;



resultats.forEach(doc=>{


reponse +=

`

Titre :
${doc.titre}


${doc.contenu}


----------------------------

`;


});



return reponse;



}





/*========================================
 INITIALISATION
========================================*/


chargerBaseCommuniquesRAG();

console.log(
"🤖 RAG Communiqués InspecteurBot activé"
);

