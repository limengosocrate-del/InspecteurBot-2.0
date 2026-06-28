/*=========================================================
INSPECTEURBOT IA
SPEECH.JS
PARTIE 1
CONFIGURATION GÉNÉRALE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION GÉNÉRALE
=========================================================*/

const SpeechIA={

version:"1.0",

actif:false,

ecouteContinue:true,

reponseVocale:true,

confirmationVocale:true,

langueAuto:true,

volume:1,

vitesse:1,

hauteurVoix:1

};

/*=========================================================
COMPATIBILITÉ NAVIGATEUR
=========================================================*/

const SpeechRecognition=

window.SpeechRecognition||

window.webkitSpeechRecognition||

null;

/*=========================================================
OBJETS PRINCIPAUX
=========================================================*/

let reconnaissance=null;

let synthese=window.speechSynthesis;

let voixChargees=[];

let microphoneDisponible=false;

/*=========================================================
ÉTAT DU MICROPHONE
=========================================================*/

const EtatMicro={

ARRET:"arret",

ECOUTE:"ecoute",

PAUSE:"pause",

ERREUR:"erreur"

};

let etatMicro=

EtatMicro.ARRET;

/*=========================================================
CHARGEMENT DES VOIX
=========================================================*/

function chargerVoixIA(){

if(!synthese){

return;

}

voixChargees=

synthese.getVoices();

console.log(

"Voix disponibles :",

voixChargees.length

);

}

if(synthese){

chargerVoixIA();

speechSynthesis.onvoiceschanged=

chargerVoixIA;

}

/*=========================================================
VÉRIFICATION
=========================================================*/

function verifierCompatibilite(){

if(!SpeechRecognition){

console.warn(

"Reconnaissance vocale non compatible."

);

return false;

}

if(!window.speechSynthesis){

console.warn(

"Synthèse vocale indisponible."

);

}

microphoneDisponible=true;

console.log(

"Microphone compatible."

);

return true;

}

/*=========================================================
INFORMATIONS
=========================================================*/

function informationsSpeech(){

return{

version:SpeechIA.version,

microphone:microphoneDisponible,

etat:etatMicro,

langue:

LanguesIA.langueActive,

voix:

voixChargees.length

};

}

/*=========================================================
INITIALISATION
=========================================================*/

function initialiserSpeech(){

if(!verifierCompatibilite()){

return false;

}

console.log(

"===================================="

);

console.log(

"InspecteurBot IA"

);

console.log(

"Speech.js initialisé"

);

console.log(

"Version :",

SpeechIA.version

);

console.log(

"Langue :",

LanguesIA.langueActive

);

console.log(

"===================================="

);

SpeechIA.actif=true;

return true;

}

/*=========================================================
LANCEMENT
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

initialiserSpeech();

}

);

console.log(

"Speech.js Partie 1 chargée."

);

/*=========================================================
INSPECTEURBOT IA
SPEECH.JS
PARTIE 2
GESTION AVANCÉE DU MICROPHONE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
CRÉATION DE LA RECONNAISSANCE VOCALE
=========================================================*/

function creerReconnaissance(){

if(!SpeechRecognition){

return null;

}

reconnaissance=new SpeechRecognition();

reconnaissance.continuous=

SpeechIA.ecouteContinue;

reconnaissance.interimResults=true;

reconnaissance.maxAlternatives=3;

appliquerLangueMicro();

configurerEvenementsMicro();

return reconnaissance;

}

/*=========================================================
LANGUE DU MICROPHONE
=========================================================*/

function appliquerLangueMicro(){

if(!reconnaissance){

return;

}

const langues={

fr:"fr-FR",

ln:"fr-CD",

sw:"sw-CD",

kg:"fr-CD",

lu:"fr-CD",

en:"en-US",

pt:"pt-PT"

};

reconnaissance.lang=

langues[LanguesIA.langueActive]

||

"fr-FR";

}

/*=========================================================
DÉMARRER L'ÉCOUTE
=========================================================*/

function demarrerMicro(){

if(!SpeechIA.actif){

return;

}

if(!reconnaissance){

creerReconnaissance();

}

try{

reconnaissance.start();

}

catch(e){

console.warn(

"Micro déjà actif."

);

}

}

/*=========================================================
ARRÊTER
=========================================================*/

function arreterMicro(){

if(!reconnaissance){

return;

}

reconnaissance.stop();

}

/*=========================================================
PAUSE
=========================================================*/

function pauseMicro(){

if(

etatMicro===

EtatMicro.ECOUTE

){

arreterMicro();

etatMicro=

EtatMicro.PAUSE;

}

}

/*=========================================================
REPRISE
=========================================================*/

function reprendreMicro(){

if(

etatMicro===

EtatMicro.PAUSE

){

demarrerMicro();

}

}

/*=========================================================
ÉTAT
=========================================================*/

function microActif(){

return

etatMicro===

EtatMicro.ECOUTE;

}

/*=========================================================
CHANGER ÉTAT
=========================================================*/

function definirEtatMicro(

etat

){

etatMicro=etat;

console.log(

"Micro :",

etat

);

}

/*=========================================================
BASCULE
=========================================================*/

function basculerMicro(){

if(microActif()){

arreterMicro();

}

else{

demarrerMicro();

}

}

/*=========================================================
BOUTON MICROPHONE
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

const bouton=

document.getElementById(

"btnMicro"

);

if(!bouton){

return;

}

bouton.addEventListener(

"click",

function(){

basculerMicro();

}

);

}

);

/*=========================================================
AFFICHAGE
=========================================================*/

console.log(

"Gestion avancée du microphone chargée."

);

/*=========================================================
INSPECTEURBOT IA
SPEECH.JS
PARTIE 3
RECONNAISSANCE VOCALE INTELLIGENTE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION DES ÉVÉNEMENTS
=========================================================*/

function configurerEvenementsMicro(){

if(!reconnaissance){

return;

}

/*=========================================================
DÉMARRAGE
=========================================================*/

reconnaissance.onstart=function(){

definirEtatMicro(

EtatMicro.ECOUTE

);

console.log(

"🎤 Microphone activé."

);

};

/*=========================================================
FIN
=========================================================*/

reconnaissance.onend=function(){

definirEtatMicro(

EtatMicro.ARRET

);

console.log(

"🎤 Microphone arrêté."

);

if(

SpeechIA.ecouteContinue &&

SpeechIA.actif

){

setTimeout(function(){

try{

demarrerMicro();

}

catch(e){

console.warn(

"Impossible de relancer le micro."

);

}

},800);

}

};

/*=========================================================
RÉSULTATS
=========================================================*/

reconnaissance.onresult=function(e){

let texte="";

for(

let i=e.resultIndex;

i<e.results.length;

i++

){

texte+=

e.results[i][0].transcript+

" ";

}

texte=texte.trim();

console.log(

"🎙 Texte reconnu :",

texte

);

traiterReconnaissance(

texte

);

};

/*=========================================================
ERREURS
=========================================================*/

reconnaissance.onerror=function(e){

definirEtatMicro(

EtatMicro.ERREUR

);

console.error(

"Erreur Speech :",e.error

);

gererErreurMicro(

e.error

);

};

}

/*=========================================================
TRAITEMENT DU TEXTE
=========================================================*/

function traiterReconnaissance(

texte

){

if(!texte){

return;

}

/* Détection automatique */

detecterEtChangerLangue(

texte

);

/* Zone de recherche */

const champ=

document.getElementById(

"rechercheArticle"

);

if(champ){

champ.value=texte;

}

/* IA */

if(

typeof analyserQuestionIA===

"function"

){

analyserQuestionIA(

texte

);

}

}

/*=========================================================
GESTION DES ERREURS
=========================================================*/

function gererErreurMicro(

erreur

){

switch(erreur){

case "not-allowed":

console.warn(

"Permission microphone refusée."

);

break;

case "network":

console.warn(

"Connexion Internet indisponible."

);

break;

case "no-speech":

console.warn(

"Aucune voix détectée."

);

break;

case "audio-capture":

console.warn(

"Microphone introuvable."

);

break;

case "aborted":

console.warn(

"Écoute interrompue."

);

break;

default:

console.warn(

"Erreur :",erreur

);

}

}

/*=========================================================
RECONNEXION
=========================================================*/

function relancerReconnaissance(){

if(

SpeechIA.actif &&

SpeechIA.ecouteContinue

){

setTimeout(function(){

demarrerMicro();

},1000);

}

}

/*=========================================================
ÉTAT
=========================================================*/

function afficherEtatMicro(){

console.table({

Etat:etatMicro,

Langue:

LanguesIA.langueActive,

EcouteContinue:

SpeechIA.ecouteContinue,

Voix:

voixChargees.length

});

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Reconnaissance vocale intelligente chargée."

);

/*=========================================================
INSPECTEURBOT IA
SPEECH.JS
PARTIE 4
COMMANDES VOCALES INTELLIGENTES
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
COMMANDES VOCALES
=========================================================*/

const CommandesVocales={

recherche:[
"recherche",
"chercher",
"trouver",
"article"
],

lecture:[
"lis",
"lecture",
"lire",
"parle"
],

arret:[
"arrête",
"arrete",
"stop",
"terminer"
],

micro:[
"micro",
"écoute",
"ecoute",
"démarre",
"demarre"
],

francais:[
"français",
"francais"
],

lingala:[
"lingala"
],

swahili:[
"swahili"
],

kikongo:[
"kikongo"
],

tshiluba:[
"tshiluba"
],

anglais:[
"anglais",
"english"
],

portugais:[
"portugais",
"português"
]

};

/*=========================================================
VÉRIFICATION D'UNE COMMANDE
=========================================================*/

function contientCommande(

texte,

liste

){

texte=normaliserTexte(texte);

return liste.some(function(mot){

return texte.includes(

normaliserTexte(mot)

);

});

}

/*=========================================================
CHANGEMENT DE LANGUE
=========================================================*/

function commandeLangue(texte){

if(contientCommande(

texte,

CommandesVocales.francais

)){

changerLangue("fr");

return true;

}

if(contientCommande(

texte,

CommandesVocales.lingala

)){

changerLangue("ln");

return true;

}

if(contientCommande(

texte,

CommandesVocales.swahili

)){

changerLangue("sw");

return true;

}

if(contientCommande(

texte,

CommandesVocales.kikongo

)){

changerLangue("kg");

return true;

}

if(contientCommande(

texte,

CommandesVocales.tshiluba

)){

changerLangue("lu");

return true;

}

if(contientCommande(

texte,

CommandesVocales.anglais

)){

changerLangue("en");

return true;

}

if(contientCommande(

texte,

CommandesVocales.portugais

)){

changerLangue("pt");

return true;

}

return false;

}

/*=========================================================
EXÉCUTER UNE COMMANDE
=========================================================*/

function executerCommandeVocale(

texte

){

texte=normaliserTexte(texte);

/* Arrêt */

if(contientCommande(

texte,

CommandesVocales.arret

)){

arreterLecture();

arreterMicro();

return true;

}

/* Lecture */

if(contientCommande(

texte,

CommandesVocales.lecture

)){

const resultat=

document.getElementById(

"resultatRecherche"

);

if(resultat){

parlerIA(

resultat.innerText

);

}

return true;

}

/* Changement langue */

if(

commandeLangue(

texte

)

){

parlerIA(

messageIA(

"analyse"

)

);

return true;

}

/* Recherche */

if(contientCommande(

texte,

CommandesVocales.recherche

)){

const champ=

document.getElementById(

"rechercheArticle"

);

if(champ){

champ.value=texte;

}

if(

typeof analyserQuestionIA===

"function"

){

analyserQuestionIA(

texte

);

}

return true;

}

return false;

}

/*=========================================================
TRAITEMENT GLOBAL
=========================================================*/

function analyserCommandeVocale(

texte

){

if(

executerCommandeVocale(

texte

)

){

console.log(

"Commande exécutée."

);

return;

}

console.log(

"Aucune commande détectée."

);

}

/*=========================================================
INTÉGRATION
=========================================================*/

const ancienTraitement=

traiterReconnaissance;

traiterReconnaissance=function(

texte

){

ancienTraitement(

texte

);

analyserCommandeVocale(

texte

);

};

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Commandes vocales intelligentes chargées."

);

/*=========================================================
INSPECTEURBOT IA
SPEECH.JS
PARTIE 5
DIALOGUE NATUREL IA
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
DIALOGUES
=========================================================*/

const DialogueIA={

salutations:[
"bonjour",
"salut",
"mbote",
"habari",
"hello",
"bonsoir"
],

remerciements:[
"merci",
"thank you",
"asante",
"matondo"
],

aurevoir:[
"au revoir",
"bye",
"kwaheri",
"adieu"
]

};

/*=========================================================
RÉPONSE DU DIALOGUE
=========================================================*/

function obtenirDialogue(texte){

texte=normaliserTexte(texte);

/* Bonjour */

if(

contientCommande(

texte,

DialogueIA.salutations

)

){

return reponseConversation(

"bonjour"

);

}

/* Merci */

if(

contientCommande(

texte,

DialogueIA.remerciements

)

){

return reponseConversation(

"merci"

);

}

/* Au revoir */

if(

contientCommande(

texte,

DialogueIA.aurevoir

)

){

return reponseConversation(

"aurevoir"

);

}

return null;

}

/*=========================================================
PARLER
=========================================================*/

function parlerDialogue(texte){

const reponse=

obtenirDialogue(texte);

if(!reponse){

return false;

}

parlerIA(reponse);

console.log(

"Dialogue :",reponse

);

return true;

}

/*=========================================================
QUESTION JURIDIQUE
=========================================================*/

function estQuestionJuridique(

texte

){

const concepts=

extraireConcepts(

texte

);

return concepts.length>0;

}

/*=========================================================
TRAITEMENT IA
=========================================================*/

function traiterDialogueIA(

texte

){

if(

parlerDialogue(

texte

)

){

return true;

}

if(

estQuestionJuridique(

texte

)

){

const conseil=

conseilIA(

texte

);

parlerIA(

conseil

);

console.log(

"Conseil :",conseil

);

return true;

}

return false;

}

/*=========================================================
CONFIRMATION
=========================================================*/

function confirmerAction(

question,

callback

){

parlerIA(question);

setTimeout(function(){

if(

typeof callback===

"function"

){

callback();

}

},1500);

}

/*=========================================================
QUESTION À L'IA
=========================================================*/

function poserQuestionIA(

question

){

console.group(

"InspecteurBot IA"

);

console.log(

"Utilisateur :",

question

);

const resultat=

traiterDialogueIA(

question

);

console.log(

"Réponse :",resultat

);

console.groupEnd();

return resultat;

}

/*=========================================================
INTÉGRATION
=========================================================*/

const ancienAnalyseCommande=

analyserCommandeVocale;

analyserCommandeVocale=

function(texte){

ancienAnalyseCommande(

texte

);

poserQuestionIA(

texte

);

};

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Dialogue naturel IA chargé."

);

/*=========================================================
INSPECTEURBOT IA
SPEECH.JS
PARTIE 6
OPTIMISATION MOBILE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION MOBILE
=========================================================*/

const MobileSpeech={

android:/Android/i.test(navigator.userAgent),

chrome:/Chrome/i.test(navigator.userAgent),

edge:/Edg/i.test(navigator.userAgent),

mobile:/Mobi/i.test(navigator.userAgent),

permissionMicro:false

};

/*=========================================================
INFORMATIONS APPAREIL
=========================================================*/

function informationsMobile(){

return{

android:MobileSpeech.android,

chrome:MobileSpeech.chrome,

edge:MobileSpeech.edge,

mobile:MobileSpeech.mobile

};

}

/*=========================================================
VÉRIFICATION MICROPHONE
=========================================================*/

async function verifierPermissionMicro(){

if(

!navigator.mediaDevices ||

!navigator.mediaDevices.getUserMedia

){

console.warn(

"Microphone non disponible."

);

return false;

}

try{

const flux=

await navigator.mediaDevices.getUserMedia({

audio:true

});

flux.getTracks().forEach(function(track){

track.stop();

});

MobileSpeech.permissionMicro=true;

console.log(

"Permission microphone accordée."

);

return true;

}

catch(e){

MobileSpeech.permissionMicro=false;

console.warn(

"Permission microphone refusée."

);

return false;

}

}

/*=========================================================
OPTIMISATION MOBILE
=========================================================*/

async function optimiserMobile(){

if(!MobileSpeech.mobile){

return;

}

await verifierPermissionMicro();

if(

MobileSpeech.permissionMicro

){

console.log(

"Optimisation mobile activée."

);

}

}

/*=========================================================
REPRISE AUTOMATIQUE
=========================================================*/

document.addEventListener(

"visibilitychange",

function(){

if(

document.visibilityState==="visible" &&

SpeechIA.actif &&

SpeechIA.ecouteContinue &&

etatMicro===EtatMicro.ARRET

){

setTimeout(function(){

demarrerMicro();

},500);

}

}

);

/*=========================================================
SURVEILLANCE CONNEXION
=========================================================*/

window.addEventListener(

"online",

function(){

console.log(

"Connexion Internet rétablie."

);

if(

SpeechIA.ecouteContinue

){

demarrerMicro();

}

}

);

window.addEventListener(

"offline",

function(){

console.warn(

"Mode hors ligne."

);

});

/*=========================================================
RÉVEIL APRÈS VEILLE
=========================================================*/

window.addEventListener(

"focus",

function(){

if(

SpeechIA.ecouteContinue &&

etatMicro===EtatMicro.ARRET

){

demarrerMicro();

}

});

/*=========================================================
INITIALISATION
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

async function(){

await optimiserMobile();

});

console.log(

"Optimisation mobile chargée."

);

/*=========================================================
INSPECTEURBOT IA
SPEECH.JS
PARTIE 7
INTÉGRATION COMPLÈTE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
MODULES DISPONIBLES
=========================================================*/

const ModulesIA={

langues:false,

search:false,

rag:false,

traduction:false,

vecteur:false

};

/*=========================================================
VÉRIFICATION DES MODULES
=========================================================*/

function verifierModulesIA(){

ModulesIA.langues=

typeof LanguesIA!=="undefined";

ModulesIA.search=

typeof rechercherArticles==="function";

ModulesIA.rag=

typeof analyserQuestionIA==="function";

ModulesIA.traduction=

typeof traduireQuestion==="function";

ModulesIA.vecteur=

typeof rechercherSemantique==="function";

console.table(

ModulesIA

);

}

/*=========================================================
TRAITEMENT GLOBAL
=========================================================*/

function traiterQuestionComplete(

question

){

if(!question){

return;

}

/* Détection langue */

if(

typeof detecterEtChangerLangue===

"function"

){

detecterEtChangerLangue(

question

);

}

/* Traduction */

let texteRecherche=

question;

if(

typeof preparerRechercheIA===

"function"

){

const analyse=

preparerRechercheIA(

question

);

texteRecherche=

analyse.questionNormalisee;

}

/* Recherche IA */

if(

typeof analyserQuestionIA===

"function"

){

analyserQuestionIA(

texteRecherche

);

}

}

/*=========================================================
LECTURE AUTOMATIQUE
=========================================================*/

function lireResultat(){

const resultat=

document.getElementById(

"resultatRecherche"

);

if(

resultat &&

resultat.innerText.trim()!==""

){

parlerIA(

resultat.innerText

);

}

}

/*=========================================================
BOUTON LECTURE
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

const bouton=

document.getElementById(

"btnLecture"

);

if(!bouton){

return;

}

bouton.addEventListener(

"click",

function(){

lireResultat();

});

});

/*=========================================================
TRAITEMENT VOCAL GLOBAL
=========================================================*/

const ancienTraitementGlobal=

traiterReconnaissance;

traiterReconnaissance=

function(texte){

ancienTraitementGlobal(

texte);

traiterQuestionComplete(

texte

);

};

/*=========================================================
ÉTAT DES MODULES
=========================================================*/

function afficherEtatModules(){

console.group(

"InspecteurBot IA"

);

console.log(

"Speech :",SpeechIA.actif

);

console.log(

"Langue :",

LanguesIA.langueActive

);

console.table(

ModulesIA

);

console.groupEnd();

}

/*=========================================================
INITIALISATION
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

verifierModulesIA();

afficherEtatModules();

});

console.log(

"Intégration complète terminée."

);

