/*==================================================
 INSPECTEURBOT RDC
 ROUTEUR RAG INTELLIGENT

 Fichier : assets/js/rag-router.js

 Fonction :
 - Centraliser les recherches IA
 - Interroger plusieurs bases
 - Retourner la meilleure réponse
==================================================*/


/*========================================
 DETECTION DU TYPE DE QUESTION
========================================*/


function analyserIntention(question){


let q =
question.toLowerCase();



if(
q.includes("communiqué")
||
q.includes("communique")
||
q.includes("note")
||
q.includes("message")
||
q.includes("information")
||
q.includes("annonce")
){

return "communique";

}



if(
q.includes("article")
||
q.includes("code")
||
q.includes("loi")
||
q.includes("travail")
||
q.includes("licenciement")
||
q.includes("salaire")
){

return "code-travail";

}



return "general";


}





/*========================================
 RECHERCHE IA UNIFIÉE
========================================*/


async function rechercherIA(question){



let intention =
analyserIntention(question);



let resultat = "";





/*==============================
 BASE COMMUNIQUÉS
==============================*/


if(
intention==="communique"
||
intention==="general"
){


resultat +=
reponseIACommuniques(question);



}





/*==============================
 CODE DU TRAVAIL
==============================*/


if(
intention==="code-travail"
||
intention==="general"
){


if(
typeof rechercherRAG === "function"
){


let code =
rechercherRAG(question);



if(code){


resultat +=

`

⚖️ Code du Travail RDC :

${code}

`;

}


}



}





/*==============================
 AUCUN RESULTAT
==============================*/


if(resultat.trim()===""){


resultat =

`

🤖 InspecteurBot IA :

Je n'ai trouvé aucune information
dans mes bases de connaissances.

Veuillez reformuler votre question.

`;

}



return resultat;



}






/*========================================
 EXPORT GLOBAL
========================================*/


window.rechercherIA =
rechercherIA;



console.log(
"✅ Routeur RAG InspecteurBot activé"
);
