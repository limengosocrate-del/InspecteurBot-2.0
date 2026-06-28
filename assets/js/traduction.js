/*=========================================================
INSPECTEURBOT IA
TRADUCTION.JS
PARTIE 1
CONFIGURATION GÉNÉRALE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION
=========================================================*/

const TraductionIA={

version:"1.0",

actif:true,

langueSource:"fr",

langueCible:"fr",

detectionAuto:true,

traductionTerrain:true,

conserverOriginal:true,

journal:false

};

/*=========================================================
LANGUES SUPPORTÉES
=========================================================*/

const LanguesTraduction={

fr:{
code:"fr",
nom:"Français",
locale:"fr-FR"
},

ln:{
code:"ln",
nom:"Lingala",
locale:"fr-CD"
},

sw:{
code:"sw",
nom:"Swahili",
locale:"sw-CD"
},

kg:{
code:"kg",
nom:"Kikongo",
locale:"fr-CD"
},

lu:{
code:"lu",
nom:"Tshiluba",
locale:"fr-CD"
},

en:{
code:"en",
nom:"English",
locale:"en-US"
},

pt:{
code:"pt",
nom:"Português",
locale:"pt-PT"
}

};

/*=========================================================
ÉTAT DE LA TRADUCTION
=========================================================*/

const EtatTraduction={

PRET:"pret",

TRADUCTION:"traduction",

TERMINE:"termine",

ERREUR:"erreur"

};

let etatTraduction=

EtatTraduction.PRET;

/*=========================================================
CHANGER LANGUE SOURCE
=========================================================*/

function definirLangueSource(

code

){

if(

LanguesTraduction[code]

){

TraductionIA.langueSource=

code;

}

}

/*=========================================================
CHANGER LANGUE CIBLE
=========================================================*/

function definirLangueCible(

code

){

if(

LanguesTraduction[code]

){

TraductionIA.langueCible=

code;

}

}

/*=========================================================
OBTENIR CONFIGURATION
=========================================================*/

function configurationTraduction(){

return{

version:

TraductionIA.version,

source:

TraductionIA.langueSource,

cible:

TraductionIA.langueCible,

etat:

etatTraduction,

auto:

TraductionIA.detectionAuto

};

}

/*=========================================================
CHANGER L'ÉTAT
=========================================================*/

function definirEtatTraduction(

etat

){

etatTraduction=etat;

console.log(

"Traduction :",

etat

);

}

/*=========================================================
RÉINITIALISER
=========================================================*/

function reinitialiserTraduction(){

TraductionIA.langueSource="fr";

TraductionIA.langueCible="fr";

etatTraduction=

EtatTraduction.PRET;

}

/*=========================================================
INITIALISATION
=========================================================*/

function initialiserTraduction(){

console.log(

"======================================"

);

console.log(

"InspecteurBot IA"

);

console.log(

"Module Traduction"

);

console.log(

"Version :",

TraductionIA.version

);

console.log(

"======================================"

);

return true;

}

/*=========================================================
LANCEMENT
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

initialiserTraduction();

}

);

console.log(

"traduction.js Partie 1 chargée."

);

/*=========================================================
INSPECTEURBOT IA
TRADUCTION.JS
PARTIE 2
DICTIONNAIRE JURIDIQUE MULTILINGUE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
DICTIONNAIRE JURIDIQUE
=========================================================*/

const DictionnaireIA={

contrat:{

fr:["contrat","contrat de travail","engagement","embauche"],

ln:["boyokani","kontra","mosala"],

sw:["mkataba","ajira"],

kg:["kontra","kisalu"],

lu:["kontra","mudimu"],

en:["contract","employment contract"],

pt:["contrato","contrato de trabalho"]

},

salaire:{

fr:["salaire","rémunération","paie","prime"],

ln:["lifuti","mbongo ya mosala"],

sw:["mshahara","malipo"],

kg:["mfutu"],

lu:["difutu"],

en:["salary","wage","payment"],

pt:["salário","pagamento"]

},

licenciement:{

fr:["licenciement","renvoi","préavis"],

ln:["kobengana","kobwaka mosala"],

sw:["kufukuzwa","kuondolewa kazini"],

kg:["kubengana"],

lu:["kubingisha"],

en:["dismissal","termination"],

pt:["demissão","rescisão"]

},

conge:{

fr:["congé","vacances","repos"],

ln:["kopema"],

sw:["likizo"],

kg:["kupema"],

lu:["kupema"],

en:["leave","vacation"],

pt:["férias","licença"]

},

tempsTravail:{

fr:["temps de travail","horaire","heures"],

ln:["ntango ya mosala"],

sw:["muda wa kazi"],

kg:["ntangu ya kisalu"],

lu:["ntangu wa mudimu"],

en:["working hours"],

pt:["horário de trabalho"]

},

inspection:{

fr:["inspection","inspecteur","contrôle"],

ln:["mokengeli","inspection"],

sw:["ukaguzi","mkaguzi"],

kg:["kukengila"],

lu:["mukengeshi"],

en:["inspection","inspector"],

pt:["inspeção","inspetor"]

},

accident:{

fr:["accident","accident du travail","blessure"],

ln:["likama"],

sw:["ajali"],

kg:["likama"],

lu:["bukole"],

en:["accident","injury"],

pt:["acidente","lesão"]

},

employeur:{

fr:["employeur","patron","entreprise"],

ln:["patron"],

sw:["mwajiri"],

kg:["mfumu"],

lu:["patron"],

en:["employer"],

pt:["empregador"]

},

travailleur:{

fr:["travailleur","salarié","employé"],

ln:["mosali"],

sw:["mfanyakazi"],

kg:["musadi"],

lu:["mufanyi wa mudimu"],

en:["worker","employee"],

pt:["trabalhador","empregado"]

},

procesVerbal:{

fr:["procès-verbal","pv"],

ln:["proces verbal"],

sw:["ripoti"],

kg:["proces verbal"],

lu:["proces verbal"],

en:["report"],

pt:["auto de infração"]

},

miseEnDemeure:{

fr:["mise en demeure","avertissement"],

ln:["bokebisi"],

sw:["onyo"],

kg:["nkebolo"],

lu:["dikebula"],

en:["formal notice"],

pt:["notificação"]

}

};

/*=========================================================
CONCEPTS DISPONIBLES
=========================================================*/

function listeConceptsIA(){

return Object.keys(

DictionnaireIA

);

}

/*=========================================================
VÉRIFICATION D'UN CONCEPT
=========================================================*/

function conceptExiste(

concept

){

return

DictionnaireIA.hasOwnProperty(

concept

);

}

/*=========================================================
OBTENIR LES MOTS
=========================================================*/

function motsConcept(

concept,

langue="fr"

){

if(

conceptExiste(concept) &&

DictionnaireIA[concept][langue]

){

return DictionnaireIA[concept][langue];

}

return [];

}

/*=========================================================
RECHERCHE D'UN CONCEPT
=========================================================*/

function trouverConcept(

mot

){

mot=normaliserTexte(mot);

for(

const concept in DictionnaireIA

){

const langues=

DictionnaireIA[concept];

for(

const langue in langues

){

const liste=

langues[langue];

for(

const element of liste

){

if(

normaliserTexte(element)===mot

){

return concept;

}

}

}

}

return null;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Dictionnaire IA chargé."

);

console.log(

"Concepts :",

listeConceptsIA().length

);

/*=========================================================
INSPECTEURBOT IA
TRADUCTION.JS
PARTIE 3
TRADUCTION AUTOMATIQUE DES QUESTIONS
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
NETTOYAGE DU TEXTE
=========================================================*/

function nettoyerTexte(question){

if(!question){

return "";

}

return question

.toLowerCase()

.normalize("NFD")

.replace(/[\u0300-\u036f]/g,"")

.replace(/[?!.,;:()]/g," ")

.replace(/\s+/g," ")

.trim();

}

/*=========================================================
EXTRACTION DES MOTS
=========================================================*/

function extraireMotsQuestion(question){

return nettoyerTexte(question)

.split(" ")

.filter(function(mot){

return mot.length>1;

});

}

/*=========================================================
IDENTIFICATION DES CONCEPTS
=========================================================*/

function identifierConcepts(question){

const mots=

extraireMotsQuestion(question);

let concepts=[];

mots.forEach(function(mot){

const concept=

trouverConcept(mot);

if(

concept &&

!concepts.includes(concept)

){

concepts.push(concept);

}

});

return concepts;

}

/*=========================================================
LANGUE SOURCE
=========================================================*/

function detecterLangueQuestion(question){

if(

typeof detecterLangue===

"function"

){

return detecterLangue(question);

}

return "fr";

}

/*=========================================================
PRÉPARATION DE LA TRADUCTION
=========================================================*/

function preparerTraduction(question){

const langue=

detecterLangueQuestion(question);

const concepts=

identifierConcepts(question);

return{

questionOriginale:question,

langueSource:langue,

langueCible:

TraductionIA.langueCible,

concepts:concepts,

date:new Date(),

etat:

EtatTraduction.PRET

};

}

/*=========================================================
TRADUIRE LES CONCEPTS
=========================================================*/

function traduireConceptsQuestion(

question,

langue="fr"

){

const concepts=

identifierConcepts(question);

let resultat=[];

concepts.forEach(function(concept){

const mots=

motsConcept(

concept,

langue

);

if(

mots.length>0

){

resultat.push(

mots[0]

);

}

});

return resultat.join(" ");

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherAnalyseQuestion(

question

){

const analyse=

preparerTraduction(

question

);

console.group(

"Analyse Traduction"

);

console.log(

"Question :",

analyse.questionOriginale

);

console.log(

"Langue :",

analyse.langueSource

);

console.log(

"Concepts :",

analyse.concepts

);

console.groupEnd();

return analyse;

}

/*=========================================================
TRADUCTION COMPLÈTE
=========================================================*/

function traduireQuestionComplete(

question,

langue

){

return traduireConceptsQuestion(

question,

langue

);

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Traduction automatique des questions chargée."

);

/*=========================================================
INSPECTEURBOT IA
TRADUCTION.JS
PARTIE 4
TRADUCTION DES RÉPONSES JURIDIQUES
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
RÉPONSES PRÉDÉFINIES
=========================================================*/

const ReponsesIA={

analyse:{

fr:"Analyse juridique terminée.",

ln:"Botali ya mibeko esili.",

sw:"Uchambuzi wa sheria umekamilika.",

kg:"Kulonguka nsiku me mana.",

lu:"Dilongolola dimane.",

en:"Legal analysis completed.",

pt:"Análise jurídica concluída."

},

recherche:{

fr:"Recherche des articles en cours...",

ln:"Nazali koluka mikapo ya mibeko...",

sw:"Inatafuta vifungu vya sheria...",

kg:"Mono ke sosa mikanda...",

lu:"Ndi nkeba nkanda...",

en:"Searching legal articles...",

pt:"Pesquisando artigos..."

},

aucun:{

fr:"Aucun article correspondant.",

ln:"Article moko ezwami te.",

sw:"Hakuna kifungu kilichopatikana.",

kg:"Mukanda ve.",

lu:"Nkanda kayena.",

en:"No article found.",

pt:"Nenhum artigo encontrado."

},

conseil:{

fr:"Veuillez consulter les articles proposés.",

ln:"Talá mikapo oyo epesami.",

sw:"Tafadhali soma vifungu vilivyopendekezwa.",

kg:"Tala mikanda yai.",

lu:"Tangila nkanda yitabu.",

en:"Please review the suggested articles.",

pt:"Consulte os artigos sugeridos."

}

};

/*=========================================================
TRADUIRE UNE RÉPONSE
=========================================================*/

function traduireReponse(

cle,

langue

){

langue=

langue||

TraductionIA.langueCible;

if(

ReponsesIA[cle] &&

ReponsesIA[cle][langue]

){

return ReponsesIA[cle][langue];

}

return ReponsesIA[cle]

? ReponsesIA[cle].fr

: "";

}

/*=========================================================
MESSAGE IA
=========================================================*/

function messageTraduit(

cle

){

return traduireReponse(

cle,

TraductionIA.langueCible

);

}

/*=========================================================
TRADUIRE TEXTE LIBRE
=========================================================*/

function traduireTexteLibre(

texte,

langue

){

if(!texte){

return "";

}

const concepts=

identifierConcepts(

texte

);

if(

concepts.length===0

){

return texte;

}

let resultat=[];

concepts.forEach(function(

concept

){

const mots=

motsConcept(

concept,

langue

);

if(

mots.length

){

resultat.push(

mots[0]

);

}

});

return resultat.join(" ");

}

/*=========================================================
TRADUIRE RÉPONSE COMPLÈTE
=========================================================*/

function traduireReponseComplete(

texte,

langue

){

const traduction=

traduireTexteLibre(

texte,

langue

);

return{

original:texte,

traduction:traduction,

langue:langue,

date:new Date()

};

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherReponseTraduite(

texte,

langue

){

const resultat=

traduireReponseComplete(

texte,

langue

);

console.group(

"Réponse traduite"

);

console.log(

"Original :",

resultat.original

);

console.log(

"Traduction :",

resultat.traduction

);

console.log(

"Langue :",

resultat.langue

);

console.groupEnd();

return resultat;

}

/*=========================================================
LECTURE AUTOMATIQUE
=========================================================*/

function lireReponseTraduite(

texte,

langue

){

const resultat=

traduireReponseComplete(

texte,

langue

);

if(

typeof parlerIA===

"function"

){

parlerIA(

resultat.traduction

);

}

return resultat.traduction;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Traduction des réponses juridiques chargée."

);

/*=========================================================
INSPECTEURBOT IA
TRADUCTION.JS
PARTIE 5
MODE TRADUCTION TERRAIN
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
PHRASES D'INSPECTION
=========================================================*/

const TerrainIA={

presentation:{

fr:"Bonjour. Je suis Inspecteur du Travail.",

ln:"Mbote. Nazali Inspecteur ya Mosala.",

sw:"Habari. Mimi ni Mkaguzi wa Kazi.",

kg:"Mbote. Mono kele Inspecteur ya Kisalu.",

lu:"Moyo. Ndi Mukengeshi wa Mudimu.",

en:"Hello. I am a Labour Inspector.",

pt:"Olá. Sou Inspetor do Trabalho."

},

identite:{

fr:"Veuillez présenter votre pièce d'identité.",

ln:"Lakisa mokanda na yo ya bomoto.",

sw:"Tafadhali onyesha kitambulisho chako.",

kg:"Lakisa mukanda na nge.",

lu:"Lekela mukanda webe.",

en:"Please present your identity document.",

pt:"Apresente o seu documento de identificação."

},

contrat:{

fr:"Veuillez présenter le contrat de travail.",

ln:"Lakisa contrat ya mosala.",

sw:"Tafadhali wasilisha mkataba wa kazi.",

kg:"Lakisa kontrá ya kisalu.",

lu:"Lekela kontrat wa mudimu.",

en:"Please present the employment contract.",

pt:"Apresente o contrato de trabalho."

},

registre:{

fr:"Veuillez présenter le registre du personnel.",

ln:"Lakisa registre ya basali.",

sw:"Tafadhali wasilisha daftari la wafanyakazi.",

kg:"Lakisa registre ya basadi.",

lu:"Lekela registre wa bafanyi ba mudimu.",

en:"Please present the employee register.",

pt:"Apresente o registo dos trabalhadores."

},

finInspection:{

fr:"Merci de votre collaboration.",

ln:"Matondo mpo na lisalisi na bino.",

sw:"Asante kwa ushirikiano wako.",

kg:"Matondo na lusadisu na nge.",

lu:"Twasakidila bua disungidi.",

en:"Thank you for your cooperation.",

pt:"Obrigado pela sua colaboração."

}

};

/*=========================================================
TRADUIRE UNE PHRASE
=========================================================*/

function traduireTerrainIA(

cle,

langue

){

langue=

langue||

TraductionIA.langueCible;

if(

TerrainIA[cle] &&

TerrainIA[cle][langue]

){

return TerrainIA[cle][langue];

}

return TerrainIA[cle]

? TerrainIA[cle].fr

: "";

}

/*=========================================================
LISTE DES PHRASES
=========================================================*/

function phrasesTerrain(){

return Object.keys(

TerrainIA

);

}

/*=========================================================
AFFICHER UNE PHRASE
=========================================================*/

function afficherPhraseTerrain(

cle,

langue

){

const phrase=

traduireTerrainIA(

cle,

langue

);

console.log(

"Terrain :",phrase

);

return phrase;

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function parlerTerrainIA(

cle,

langue

){

const phrase=

traduireTerrainIA(

cle,

langue

);

if(

typeof parlerIA===

"function"

){

parlerIA(

phrase

);

}

return phrase;

}

/*=========================================================
CONVERSATION TERRAIN
=========================================================*/

function conversationTerrain(

cle

){

const phrase=

traduireTerrainIA(

cle,

TraductionIA.langueCible

);

return{

phrase:phrase,

langue:

TraductionIA.langueCible,

date:new Date()

};

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Mode Traduction Terrain chargé."

);

console.log(

"Phrases disponibles :",

phrasesTerrain().length

);

/*=========================================================
INSPECTEURBOT IA
TRADUCTION.JS
PARTIE 6
DÉTECTION AUTOMATIQUE DE LA LANGUE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
LANGUE AUTOMATIQUE
=========================================================*/

function detecterLangueTraduction(texte){

if(

typeof detecterLangue==="function"

){

return detecterLangue(texte);

}

return "fr";

}

/*=========================================================
MISE À JOUR DES LANGUES
=========================================================*/

function mettreAJourLangues(texte){

const langue=

detecterLangueTraduction(texte);

definirLangueSource(langue);

if(

TraductionIA.detectionAuto

){

definirLangueCible(langue);

}

return langue;

}

/*=========================================================
PRÉPARATION
=========================================================*/

function preparerMessage(texte){

const langue=

mettreAJourLangues(texte);

const concepts=

identifierConcepts(texte);

return{

texteOriginal:texte,

langueSource:

TraductionIA.langueSource,

langueCible:

TraductionIA.langueCible,

concepts:concepts,

langueDetectee:langue,

date:new Date()

};

}

/*=========================================================
TRADUIRE AUTOMATIQUEMENT
=========================================================*/

function traductionAutomatique(

texte

){

const analyse=

preparerMessage(texte);

return{

original:

analyse.texteOriginal,

traduction:

traduireConceptsQuestion(

texte,

analyse.langueCible

),

langue:

analyse.langueCible,

concepts:

analyse.concepts

};

}

/*=========================================================
CHANGER LA LANGUE CIBLE
=========================================================*/

function changerLangueTraduction(

langue

){

if(

LanguesTraduction[langue]

){

TraductionIA.langueCible=

langue;

console.log(

"Nouvelle langue :",

LanguesTraduction[langue].nom

);

return true;

}

return false;

}

/*=========================================================
OBTENIR LA LANGUE ACTIVE
=========================================================*/

function langueTraductionActive(){

return

TraductionIA.langueCible;

}

/*=========================================================
RAPPORT DE TRADUCTION
=========================================================*/

function rapportTraduction(

texte

){

const resultat=

traductionAutomatique(

texte

);

console.group(

"Rapport Traduction"

);

console.log(

"Original :",

resultat.original

);

console.log(

"Traduction :",

resultat.traduction

);

console.log(

"Langue :",

resultat.langue

);

console.log(

"Concepts :",

resultat.concepts

);

console.groupEnd();

return resultat;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Détection automatique de traduction chargée."

);

/*=========================================================
INSPECTEURBOT IA
TRADUCTION.JS
PARTIE 7
INTÉGRATION COMPLÈTE
Version 1.0
=========================================================*/

"use strict";

/*=========================================================
MODULES CONNECTÉS
=========================================================*/

const ModulesTraduction={

langues:false,

speech:false,

search:false,

rag:false,

vectorSearch:false

};

/*=========================================================
VÉRIFICATION DES MODULES
=========================================================*/

function verifierModulesTraduction(){

ModulesTraduction.langues=

typeof LanguesIA!=="undefined";

ModulesTraduction.speech=

typeof parlerIA==="function";

ModulesTraduction.search=

typeof rechercherArticles==="function";

ModulesTraduction.rag=

typeof analyserQuestionIA==="function";

ModulesTraduction.vectorSearch=

typeof rechercherSemantique==="function";

console.table(

ModulesTraduction

);

}

/*=========================================================
PRÉPARATION GLOBALE
=========================================================*/

function preparerQuestionMultilingue(

question

){

const analyse=

preparerMessage(

question

);

return{

original:

analyse.texteOriginal,

langue:

analyse.langueDetectee,

concepts:

analyse.concepts,

question:

traduireConceptsQuestion(

question,

"fr"

)

};

}

/*=========================================================
RECHERCHE JURIDIQUE
=========================================================*/

function lancerRechercheTraduite(

question

){

const resultat=

preparerQuestionMultilingue(

question

);

if(

typeof rechercherArticles===

"function"

){

rechercherArticles(

resultat.question

);

}

return resultat;

}

/*=========================================================
RÉPONSE IA
=========================================================*/

function reponseJuridique(

question

){

const resultat=

lancerRechercheTraduite(

question

);

if(

typeof conseilIA===

"function"

){

const conseil=

conseilIA(

question

);

return{

analyse:resultat,

conseil:conseil

};

}

return resultat;

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function lireReponseIA(

texte

){

if(

typeof parlerIA===

"function"

){

parlerIA(

texte

);

}

}

/*=========================================================
TRADUCTION + LECTURE
=========================================================*/

function traduireEtLire(

texte,

langue

){

const resultat=

traduireReponseComplete(

texte,

langue

);

lireReponseIA(

resultat.traduction

);

return resultat;

}

/*=========================================================
AFFICHER ÉTAT
=========================================================*/

function afficherEtatTraduction(){

console.group(

"InspecteurBot IA"

);

console.log(

"Module Traduction"

);

console.table(

ModulesTraduction

);

console.groupEnd();

}

/*=========================================================
INITIALISATION
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

verifierModulesTraduction();

afficherEtatTraduction();

});

console.log(

"Traduction IA entièrement intégrée."

);
