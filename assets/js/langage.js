/*=========================================================
INSPECTEURBOT IA
MODULE MULTILINGUE
PARTIE 1
CONFIGURATION GÉNÉRALE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION
=========================================================*/

const LanguesIA = {

    version: "1.0",

    langueDefaut: "fr",

    langueActive: "fr",

    detectionAuto: true,

    syntheseVocale: true,

    reconnaissanceVocale: true

};

/*=========================================================
LANGUES SUPPORTÉES
=========================================================*/

const languesSupportees = {

    fr:{
        code:"fr",
        nom:"Français",
        drapeau:"🇫🇷"
    },

    ln:{
        code:"ln",
        nom:"Lingala",
        drapeau:"🇨🇩"
    },

    sw:{
        code:"sw",
        nom:"Swahili",
        drapeau:"🇨🇩"
    },

    kg:{
        code:"kg",
        nom:"Kikongo",
        drapeau:"🇨🇩"
    },

    lu:{
        code:"lu",
        nom:"Tshiluba",
        drapeau:"🇨🇩"
    },

    en:{
        code:"en",
        nom:"English",
        drapeau:"🇬🇧"
    },

    pt:{
        code:"pt",
        nom:"Português",
        drapeau:"🇵🇹"
    }

};

/*=========================================================
MÉMOIRE
=========================================================*/

let langueUtilisateur = localStorage.getItem("IBIA_LANGUE") || "fr";

/*=========================================================
CHANGER DE LANGUE
=========================================================*/

function changerLangue(code){

    if(!languesSupportees[code]){

        return;

    }

    langueUtilisateur = code;

    LanguesIA.langueActive = code;

    localStorage.setItem(

        "IBIA_LANGUE",

        code

    );

    console.log(

        "Langue active :",

        languesSupportees[code].nom

    );

}

/*=========================================================
OBTENIR LA LANGUE
=========================================================*/

function langueActive(){

    return langueUtilisateur;

}

/*=========================================================
INITIALISATION
=========================================================*/

changerLangue(langueUtilisateur);

console.log(

"======================================"

);

console.log(

"InspecteurBot IA"

);

console.log(

"Module Multilingue chargé"

);

console.log(

"Langue :",languesSupportees[langueUtilisateur].nom

);

console.log(

"======================================"

);

/*=========================================================
INSPECTEURBOT IA
MODULE MULTILINGUE
PARTIE 2
DICTIONNAIRE JURIDIQUE IA
=========================================================*/

/*=========================================================
DICTIONNAIRE MULTILINGUE
=========================================================*/

const dictionnaireJuridique = {

licenciement:{

fr:[
"licenciement",
"renvoi",
"rupture",
"préavis",
"congédiement"
],

ln:[
"kobengana",
"kobwaka mosala",
"kobimisa mosali"
],

sw:[
"kufukuzwa",
"kuondolewa kazini",
"kusimamishwa kazi"
],

kg:[
"kubengana",
"kubasisa kisalu"
],

lu:[
"kubingisha",
"kubengesha mudimu"
],

en:[
"dismissal",
"termination",
"firing",
"notice"
],

pt:[
"demissão",
"rescisão",
"aviso prévio"
]

},

salaire:{

fr:[
"salaire",
"paie",
"rémunération",
"prime",
"indemnité"
],

ln:[
"lifuti",
"mbongo ya mosala"
],

sw:[
"mshahara",
"malipo",
"posho"
],

kg:[
"mfutu",
"mbongo"
],

lu:[
"difutu",
"mushahara"
],

en:[
"salary",
"wage",
"payment",
"bonus"
],

pt:[
"salário",
"pagamento",
"bónus"
]

},

contrat:{

fr:[
"contrat",
"engagement",
"embauche"
],

ln:[
"boyokani",
"kontrá"
],

sw:[
"mkataba",
"ajira"
],

kg:[
"kontrá"
],

lu:[
"kontra"
],

en:[
"contract",
"employment"
],

pt:[
"contrato",
"emprego"
]

},

conge:{

fr:[
"congé",
"repos",
"vacances",
"permission"
],

ln:[
"kopema",
"congé"
],

sw:[
"likizo",
"mapumziko"
],

kg:[
"kupema"
],

lu:[
"kupema"
],

en:[
"leave",
"vacation",
"holiday"
],

pt:[
"licença",
"férias"
]

},

accident:{

fr:[
"accident",
"blessure",
"maladie professionnelle"
],

ln:[
"likama",
"mpasi ya mosala"
],

sw:[
"ajali",
"jeraha"
],

kg:[
"likama"
],

lu:[
"bukole"
],

en:[
"accident",
"injury"
],

pt:[
"acidente",
"lesão"
]

},

inspection:{

fr:[
"inspection",
"contrôle",
"inspecteur"
],

ln:[
"inspection",
"mokengeli"
],

sw:[
"ukaguzi",
"mkaguzi"
],

kg:[
"kukengila"
],

lu:[
"mukengeshi"
],

en:[
"inspection",
"inspector"
],

pt:[
"inspeção",
"inspetor"
]

}

};

/*=========================================================
RECHERCHE D'UN MOT
=========================================================*/

function rechercherConcept(mot){

mot = mot.toLowerCase();

for(const concept in dictionnaireJuridique){

const langues = dictionnaireJuridique[concept];

for(const langue in langues){

if(langues[langue].includes(mot)){

return concept;

}

}

}

return mot;

}

/*=========================================================
TRADUCTION D'UN MOT
=========================================================*/

function traduireConcept(concept,langue="fr"){

if(

dictionnaireJuridique[concept] &&

dictionnaireJuridique[concept][langue]

){

return dictionnaireJuridique[concept][langue][0];

}

return concept;

}

/*=========================================================
LISTE DES CONCEPTS
=========================================================*/

function conceptsDisponibles(){

return Object.keys(

dictionnaireJuridique

);

}

console.log(

"Dictionnaire juridique chargé :",

conceptsDisponibles().length,

"concepts."

);

/*=========================================================
INSPECTEURBOT IA
MODULE MULTILINGUE
PARTIE 3
DÉTECTION AUTOMATIQUE DE LA LANGUE
Version 1.0
=========================================================*/

/*=========================================================
MOTS CLÉS PAR LANGUE
=========================================================*/

const detecteurLangues={

fr:[
"bonjour","article","travail","contrat",
"salaire","employeur","travailleur",
"licenciement","inspection","congé",
"préavis","entreprise"
],

ln:[
"mbote","patron","mosala","lifuti",
"mokengeli","kobengana","mbongo",
"mosali","boyokani","likama"
],

sw:[
"habari","kazi","mwajiri",
"mfanyakazi","mshahara",
"mkataba","ukaguzi",
"likizo","ajali"
],

kg:[
"mbote","kisalu","mfutu",
"kubengana","kukengila"
],

lu:[
"moyo","mudimu","difutu",
"mukengeshi","kupema"
],

en:[
"hello","work","salary",
"employee","employer",
"contract","inspection",
"dismissal","leave"
],

pt:[
"olá","salário","contrato",
"emprego","inspeção",
"demissão","férias"
]

};

/*=========================================================
NORMALISATION
=========================================================*/

function normaliserTexte(texte){

return texte
.toLowerCase()
.normalize("NFD")
.replace(/[\u0300-\u036f]/g,"")
.trim();

}

/*=========================================================
DÉTECTION DE LA LANGUE
=========================================================*/

function detecterLangue(texte){

texte=normaliserTexte(texte);

let scores={};

Object.keys(detecteurLangues).forEach(function(langue){

scores[langue]=0;

detecteurLangues[langue].forEach(function(mot){

if(texte.includes(normaliserTexte(mot))){

scores[langue]++;

}

});

});

let meilleure="fr";

let score=0;

Object.keys(scores).forEach(function(langue){

if(scores[langue]>score){

score=scores[langue];

meilleure=langue;

}

});

return meilleure;

}

/*=========================================================
CHANGEMENT AUTOMATIQUE
=========================================================*/

function detecterEtChangerLangue(texte){

if(!LanguesIA.detectionAuto){

return LanguesIA.langueActive;

}

const langue=detecterLangue(texte);

changerLangue(langue);

return langue;

}

/*=========================================================
OBTENIR LE NOM
=========================================================*/

function nomLangue(code){

if(languesSupportees[code]){

return languesSupportees[code].nom;

}

return "Français";

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherLangueDetectee(texte){

const code=detecterEtChangerLangue(texte);

console.log(

"🌍 Langue détectée :",

nomLangue(code)

);

return code;

}

console.log(
"Détection automatique des langues activée."
);

/*=========================================================
INSPECTEURBOT IA
MODULE MULTILINGUE
PARTIE 4
TRADUCTION INTELLIGENTE DES RECHERCHES
Version 1.0
=========================================================*/

/*=========================================================
TRADUIRE UNE PHRASE
=========================================================*/

function traduireRecherche(texte){

texte=normaliserTexte(texte);

const mots=texte.split(/\s+/);

let resultat=[];

mots.forEach(function(mot){

const concept=rechercherConcept(mot);

resultat.push(concept);

});

return resultat.join(" ");

}

/*=========================================================
MOTS JURIDIQUES DÉTECTÉS
=========================================================*/

function extraireConcepts(texte){

texte=normaliserTexte(texte);

const mots=texte.split(/\s+/);

let concepts=[];

mots.forEach(function(mot){

const concept=rechercherConcept(mot);

if(

dictionnaireJuridique[concept] &&

!concepts.includes(concept)

){

concepts.push(concept);

}

});

return concepts;

}

/*=========================================================
LANGUE SOURCE → FRANÇAIS
=========================================================*/

function versFrancais(texte){

const concepts=extraireConcepts(texte);

if(concepts.length===0){

return texte;

}

return concepts.join(" ");

}

/*=========================================================
TRADUIRE VERS UNE LANGUE
=========================================================*/

function traduireVers(concepts,langue){

if(typeof concepts==="string"){

concepts=concepts.split(" ");

}

let resultat=[];

concepts.forEach(function(concept){

resultat.push(

traduireConcept(concept,langue)

);

});

return resultat.join(" ");

}

/*=========================================================
PRÉPARATION DE LA RECHERCHE IA
=========================================================*/

function preparerRechercheIA(question){

const langue=detecterEtChangerLangue(question);

const texte=versFrancais(question);

return{

questionOriginale:question,

langue:langue,

questionNormalisee:texte,

concepts:extraireConcepts(question)

};

}

/*=========================================================
AFFICHAGE CONSOLE
=========================================================*/

console.log(

"Traducteur juridique IA activé."

);

console.log(

"Recherche multilingue disponible."

);

/*=========================================================
INSPECTEURBOT IA
MODULE MULTILINGUE
PARTIE 5
INTERPRÈTE IA JURIDIQUE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
RÉPONSES PRÉDÉFINIES
=========================================================*/

const reponsesMultilingues={

fr:{
analyse:"Analyse juridique terminée.",
recherche:"Recherche des articles en cours...",
aucun:"Aucun article correspondant.",
conseil:"Veuillez consulter les articles proposés."
},

ln:{
analyse:"Botali ya mibeko esili.",
recherche:"Nazali koluka mikapo ya mibeko...",
aucun:"Article moko ezwami te.",
conseil:"Talá mikapo oyo epesami."
},

sw:{
analyse:"Uchambuzi wa sheria umekamilika.",
recherche:"Inatafuta vifungu vya sheria...",
aucun:"Hakuna kifungu kilichopatikana.",
conseil:"Tafadhali soma vifungu vilivyopendekezwa."
},

kg:{
analyse:"Kulonguka nsiku me mana.",
recherche:"Mono ke sosa mikanda...",
aucun:"Mukanda ve.",
conseil:"Tala mikanda yai."
},

lu:{
analyse:"Dilongolola dimane.",
recherche:"Ndi nkeba nkanda...",
aucun:"Nkanda kayena.",
conseil:"Tangila nkanda yitabu."
},

en:{
analyse:"Legal analysis completed.",
recherche:"Searching legal articles...",
aucun:"No article found.",
conseil:"Please review the suggested articles."
},

pt:{
analyse:"Análise jurídica concluída.",
recherche:"Pesquisando artigos...",
aucun:"Nenhum artigo encontrado.",
conseil:"Consulte os artigos sugeridos."
}

};

/*=========================================================
MESSAGE IA
=========================================================*/

function messageIA(cle){

const langue=LanguesIA.langueActive;

if(

reponsesMultilingues[langue] &&
reponsesMultilingues[langue][cle]

){

return reponsesMultilingues[langue][cle];

}

return reponsesMultilingues.fr[cle];

}

/*=========================================================
INTERPRÉTER UNE QUESTION
=========================================================*/

function interpreterQuestion(question){

const analyse=preparerRechercheIA(question);

return{

questionOriginale:analyse.questionOriginale,

langueDetectee:analyse.langue,

concepts:analyse.concepts,

questionNormalisee:analyse.questionNormalisee,

date:new Date(),

etat:"prete"

};

}

/*=========================================================
AFFICHAGE CONSOLE
=========================================================*/

function afficherAnalyse(question){

const resultat=interpreterQuestion(question);

console.group("InspecteurBot IA");

console.log("Langue :",nomLangue(resultat.langueDetectee));

console.log("Question :",resultat.questionOriginale);

console.log("Concepts :",resultat.concepts);

console.log("Recherche :",resultat.questionNormalisee);

console.groupEnd();

return resultat;

}

/*=========================================================
CONSEIL IA
=========================================================*/

function conseilIA(question){

const analyse=interpreterQuestion(question);

let texte="";

if(analyse.concepts.includes("licenciement")){

texte="Vérifiez la procédure de licenciement et le respect du préavis.";

}

else if(analyse.concepts.includes("salaire")){

texte="Contrôlez les bulletins de paie et les preuves de paiement.";

}

else if(analyse.concepts.includes("contrat")){

texte="Examinez le contrat de travail signé.";

}

else if(analyse.concepts.includes("accident")){

texte="Contrôlez les mesures de sécurité et les déclarations d'accident.";

}

else{

texte=messageIA("conseil");

}

return texte;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(
"Interprète juridique IA activé."
);

/*=========================================================
INSPECTEURBOT IA
MODULE MULTILINGUE
PARTIE 6
RECONNAISSANCE VOCALE IA
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION
=========================================================*/

const SpeechRecognitionAPI =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

let reconnaissance = null;

let ecouteActive = false;

/*=========================================================
INITIALISATION
=========================================================*/

function initialiserReconnaissance(){

    if(!SpeechRecognitionAPI){

        console.warn(
            "Reconnaissance vocale non disponible."
        );

        return false;

    }

    reconnaissance = new SpeechRecognitionAPI();

    reconnaissance.continuous = false;

    reconnaissance.interimResults = false;

    reconnaissance.maxAlternatives = 1;

    appliquerLangueReconnaissance();

    reconnaissance.onstart = function(){

        ecouteActive = true;

        console.log("🎤 Écoute démarrée...");

    };

    reconnaissance.onend = function(){

        ecouteActive = false;

        console.log("🎤 Écoute terminée.");

    };

    reconnaissance.onerror = function(e){

        console.error(
            "Erreur vocale :",
            e.error
        );

    };

    reconnaissance.onresult = function(e){

        const texte =
        e.results[0][0].transcript;

        console.log(
            "Texte reconnu :",
            texte
        );

        traiterTexteReconnu(texte);

    };

    return true;

}

/*=========================================================
LANGUE VOCALE
=========================================================*/

function appliquerLangueReconnaissance(){

    if(!reconnaissance){

        return;

    }

    const langues = {

        fr:"fr-FR",

        ln:"fr-CD",

        sw:"sw-CD",

        kg:"fr-CD",

        lu:"fr-CD",

        en:"en-US",

        pt:"pt-PT"

    };

    reconnaissance.lang =

    langues[LanguesIA.langueActive] ||

    "fr-FR";

}

/*=========================================================
DÉMARRER
=========================================================*/

function demarrerEcoute(){

    if(!reconnaissance){

        if(!initialiserReconnaissance()){

            return;

        }

    }

    appliquerLangueReconnaissance();

    reconnaissance.start();

}

/*=========================================================
ARRÊTER
=========================================================*/

function arreterEcoute(){

    if(reconnaissance && ecouteActive){

        reconnaissance.stop();

    }

}

/*=========================================================
TRAITEMENT
=========================================================*/

function traiterTexteReconnu(texte){

    const input =

    document.getElementById(

        "rechercheArticle"

    );

    if(input){

        input.value = texte;

    }

    if(typeof analyserQuestionIA==="function"){

        analyserQuestionIA(texte);

    }

}

/*=========================================================
BOUTON MICRO
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

const bouton =

document.getElementById(

"btnMicro"

);

if(bouton){

bouton.addEventListener(

"click",

function(){

demarrerEcoute();

}

);

}

}

);

console.log(
"Reconnaissance vocale IA chargée."
);

