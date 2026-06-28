/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 1
CONFIGURATION GÉNÉRALE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION
=========================================================*/

const RAGIA={

version:"4.0",

estCharge:false,

modeConversation:true,

rechercheContextuelle:true,

explicationSimple:true,

multilingue:true,

historique:true,

maxArticles:10

};

/*=========================================================
BASE JURIDIQUE
=========================================================*/

let BaseJuridique=[];

let ArticlesSelectionnes=[];

/*=========================================================
ÉTATS
=========================================================*/

const EtatRAG={

PRET:"pret",

CHARGEMENT:"chargement",

ANALYSE:"analyse",

REPONSE:"reponse",

ERREUR:"erreur"

};

let etatRAG=

EtatRAG.PRET;

/*=========================================================
CHANGER L'ÉTAT
=========================================================*/

function definirEtatRAG(

etat

){

etatRAG=etat;

console.log(

"RAG :",etat

);

}

/*=========================================================
CONFIGURATION
=========================================================*/

function configurationRAG(){

return{

version:RAGIA.version,

etat:etatRAG,

charge:RAGIA.estCharge,

conversation:

RAGIA.modeConversation,

multilingue:

RAGIA.multilingue

};

}

/*=========================================================
NOMBRE D'ARTICLES
=========================================================*/

function nombreArticlesRAG(){

return BaseJuridique.length;

}

/*=========================================================
BASE CHARGÉE
=========================================================*/

function baseRAGChargee(){

return RAGIA.estCharge;

}

/*=========================================================
INITIALISATION
=========================================================*/

function initialiserRAG(){

console.log(

"======================================"

);

console.log(

"InspecteurBot IA"

);

console.log(

"RAG.js"

);

console.log(

"Version",

RAGIA.version

);

console.log(

"======================================"

);

}

/*=========================================================
LANCEMENT
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

initialiserRAG();

}

);

console.log(

"RAG.js Partie 1 chargée."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 2
CHARGEMENT DE LA BASE JURIDIQUE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CHEMIN DE LA BASE
=========================================================*/

const BaseRAG={

fichier:"assets/data/code-travail.json",

version:"1.0"

};

/*=========================================================
CHARGER LA BASE
=========================================================*/

async function chargerBaseJuridique(){

definirEtatRAG(

EtatRAG.CHARGEMENT

);

try{

console.log(

"Chargement du Code du Travail..."

);

const reponse=

await fetch(

BaseRAG.fichier

);

if(!reponse.ok){

throw new Error(

"Impossible de charger la base juridique."

);

}

const donnees=

await reponse.json();

if(

!Array.isArray(

donnees

)

){

throw new Error(

"Format de la base invalide."

);

}

BaseJuridique=

donnees;

RAGIA.estCharge=true;

definirEtatRAG(

EtatRAG.PRET

);

console.log(

"Articles chargés :",

BaseJuridique.length

);

/* Intégration Search.js */

if(

typeof chargerBaseArticles===

"function"

){

chargerBaseArticles(

BaseJuridique

);

}

return true;

}

catch(erreur){

RAGIA.estCharge=false;

definirEtatRAG(

EtatRAG.ERREUR

);

console.error(

erreur.message

);

return false;

}

}

/*=========================================================
OBTENIR LA BASE
=========================================================*/

function obtenirBaseJuridique(){

return BaseJuridique;

}

/*=========================================================
OBTENIR UN ARTICLE
=========================================================*/

function articleRAG(

numero

){

if(

typeof articleNumero===

"function"

){

return articleNumero(

numero

);

}

return null;

}

/*=========================================================
RECHARGER LA BASE
=========================================================*/

async function rechargerBaseJuridique(){

RAGIA.estCharge=false;

BaseJuridique=[];

return await

chargerBaseJuridique();

}

/*=========================================================
VÉRIFICATION
=========================================================*/

function verifierBaseJuridique(){

return{

chargee:

RAGIA.estCharge,

articles:

BaseJuridique.length,

version:

BaseRAG.version

};

}

/*=========================================================
INITIALISATION
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

async function(){

await chargerBaseJuridique();

}

);

console.log(

"Chargement de la base juridique prêt."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 3
ANALYSE INTELLIGENTE DE LA QUESTION
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
ANALYSE COURANTE
=========================================================*/

let AnalyseCourante=null;

/*=========================================================
NETTOYER LA QUESTION
=========================================================*/

function nettoyerQuestion(

question

){

if(!question){

return "";

}

if(

typeof normaliserTexte===

"function"

){

return normaliserTexte(

question

);

}

return question

.toLowerCase()

.trim();

}

/*=========================================================
IDENTIFIER LES CONCEPTS
=========================================================*/

function conceptsQuestion(

question

){

if(

typeof identifierConcepts===

"function"

){

return identifierConcepts(

question

);

}

return [];

}

/*=========================================================
DÉTECTER LA LANGUE
=========================================================*/

function langueQuestion(

question

){

if(

typeof detecterLangue===

"function"

){

return detecterLangue(

question

);

}

return "fr";

}

/*=========================================================
ANALYSER LA QUESTION
=========================================================*/

function analyserQuestionIA(

question

){

const propre=

nettoyerQuestion(

question

);

const concepts=

conceptsQuestion(

propre

);

const langue=

langueQuestion(

propre

);

AnalyseCourante={

questionOriginale:

question,

question:

propre,

langue:

langue,

concepts:

concepts,

date:new Date()

};

definirEtatRAG(

EtatRAG.ANALYSE

);

return AnalyseCourante;

}

/*=========================================================
OBTENIR L'ANALYSE
=========================================================*/

function obtenirAnalyseIA(){

return AnalyseCourante;

}

/*=========================================================
RÉINITIALISER
=========================================================*/

function reinitialiserAnalyse(){

AnalyseCourante=null;

}

/*=========================================================
AFFICHER L'ANALYSE
=========================================================*/

function afficherAnalyseIA(

question

){

const analyse=

analyserQuestionIA(

question

);

console.group(

"Analyse IA"

);

console.log(

"Question :",

analyse.questionOriginale

);

console.log(

"Langue :",

analyse.langue

);

console.log(

"Concepts :",

analyse.concepts

);

console.groupEnd();

return analyse;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Analyse intelligente des questions chargée."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 4
RECHERCHE CONTEXTUELLE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
ARTICLES RETENUS
=========================================================*/

let ArticlesContextuels=[];

/*=========================================================
CALCULER LE SCORE
=========================================================*/

function calculerScoreArticle(

article,

concepts

){

let score=0;

if(

!article ||

!concepts ||

concepts.length===0

){

return score;

}

concepts.forEach(function(

concept

){

/* Titre */

if(

article.titre &&

normaliserTexte(

article.titre

).includes(

concept

)

){

score+=5;

}

/* Contenu */

if(

article.contenu &&

normaliserTexte(

article.contenu

).includes(

concept

)

){

score+=3;

}

/* Mots-clés */

if(

Array.isArray(

article.motsCles

)

){

article.motsCles.forEach(function(

mot

){

if(

normaliserTexte(

mot

).includes(

concept

)

){

score+=2;

}

});

}

});

return score;

}

/*=========================================================
RECHERCHE CONTEXTUELLE
=========================================================*/

function rechercherArticlesContextuels(

question

){

if(

!baseRAGChargee()

){

return [];

}

const analyse=

analyserQuestionIA(

question

);

let resultat=[];

BaseJuridique.forEach(function(

article

){

const score=

calculerScoreArticle(

article,

analyse.concepts

);

if(

score>0

){

resultat.push({

article:article,

score:score

});

}

});

resultat.sort(function(

a,

b

){

return b.score-a.score;

});

ArticlesContextuels=

resultat.map(function(

item

){

return item.article;

});

return ArticlesContextuels;

}

/*=========================================================
MEILLEURS ARTICLES
=========================================================*/

function meilleursArticles(

limite=5

){

return ArticlesContextuels.slice(

0,

limite

);

}

/*=========================================================
OBTENIR LES ARTICLES
=========================================================*/

function obtenirArticlesContextuels(){

return ArticlesContextuels;

}

/*=========================================================
VIDER LE CONTEXTE
=========================================================*/

function viderContexte(){

ArticlesContextuels=[];

}

/*=========================================================
AFFICHER LE CONTEXTE
=========================================================*/

function afficherContexte(

question

){

const articles=

rechercherArticlesContextuels(

question

);

console.group(

"Contexte juridique"

);

console.log(

"Articles :",articles.length

);

console.groupEnd();

return articles;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Recherche contextuelle chargée."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 5
GÉNÉRATION DE RÉPONSES JURIDIQUES
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
DERNIÈRE RÉPONSE
=========================================================*/

let DerniereReponseIA=null;

/*=========================================================
CRÉER LE RÉSUMÉ
=========================================================*/

function creerResumeArticle(

article

){

if(!article){

return "";

}

if(article.resume){

return article.resume;

}

if(article.contenu){

return article.contenu.substring(

0,

300

)+"...";

}

return "";

}

/*=========================================================
GÉNÉRER LA RÉPONSE
=========================================================*/

function genererReponseIA(

question

){

const articles=

rechercherArticlesContextuels(

question

);

if(

articles.length===0

){

DerniereReponseIA={

question:question,

reponse:

"Aucun article correspondant n'a été trouvé.",

articles:[],

date:new Date()

};

return DerniereReponseIA;

}

const principal=

articles[0];

let texte="";

texte+="Analyse juridique terminée.\n\n";

if(principal.numero){

texte+="Article "+

principal.numero;

}

if(principal.titre){

texte+=" : "+

principal.titre;

}

texte+="\n\n";

texte+=creerResumeArticle(

principal

);

if(

articles.length>1

){

texte+="\n\n";

texte+="Articles associés : ";

articles.slice(

1,

5

).forEach(function(

article,

index

){

if(index>0){

texte+=", ";

}

texte+=article.numero;

});

}

DerniereReponseIA={

question:question,

reponse:texte,

articlePrincipal:principal,

articles:articles,

date:new Date()

};

definirEtatRAG(

EtatRAG.REPONSE

);

return DerniereReponseIA;

}

/*=========================================================
OBTENIR LA RÉPONSE
=========================================================*/

function obtenirReponseIA(){

return DerniereReponseIA;

}

/*=========================================================
AFFICHER
=========================================================*/

function afficherReponseIA(

question

){

const resultat=

genererReponseIA(

question

);

console.group(

"Réponse IA"

);

console.log(

resultat.reponse

);

console.groupEnd();

return resultat;

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function lireReponseJuridique(

question

){

const resultat=

genererReponseIA(

question

);

if(

typeof parlerIA===

"function"

){

parlerIA(

resultat.reponse

);

}

return resultat;

}

/*=========================================================
RÉINITIALISER
=========================================================*/

function viderReponseIA(){

DerniereReponseIA=null;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Générateur de réponses juridiques chargé."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 6
EXPLICATION JURIDIQUE SIMPLIFIÉE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
EXPLICATION COURANTE
=========================================================*/

let ExplicationCourante=null;

/*=========================================================
CRÉER UNE EXPLICATION
=========================================================*/

function creerExplicationSimple(

article

){

if(!article){

return "";

}

let explication="";

explication+="Explication simplifiée :\n\n";

if(article.titre){

explication+=

article.titre+

"\n\n";

}

if(article.resume){

explication+=

article.resume;

}

else if(article.contenu){

explication+=

article.contenu.substring(

0,

400

)+"...";

}

explication+="\n\n";

explication+=

"Conseil : Vérifiez toujours les conditions prévues par le Code du travail avant de prendre une décision.";

return explication;

}

/*=========================================================
EXPLIQUER UN ARTICLE
=========================================================*/

function expliquerArticle(

article

){

const texte=

creerExplicationSimple(

article

);

ExplicationCourante={

article:article,

texte:texte,

date:new Date()

};

return ExplicationCourante;

}

/*=========================================================
EXPLIQUER UNE QUESTION
=========================================================*/

function expliquerQuestion(

question

){

const reponse=

genererReponseIA(

question

);

if(

!reponse.articlePrincipal

){

return{

texte:

"Aucune explication disponible."

};

}

return expliquerArticle(

reponse.articlePrincipal

);

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function lireExplication(

question

){

const resultat=

expliquerQuestion(

question

);

if(

typeof parlerIA===

"function"

){

parlerIA(

resultat.texte

);

}

return resultat;

}

/*=========================================================
OBTENIR L'EXPLICATION
=========================================================*/

function obtenirExplication(){

return ExplicationCourante;

}

/*=========================================================
EFFACER
=========================================================*/

function effacerExplication(){

ExplicationCourante=null;

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherExplication(

question

){

const resultat=

expliquerQuestion(

question

);

console.group(

"Explication IA"

);

console.log(

resultat.texte

);

console.groupEnd();

return resultat;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Mode Explication Simplifiée chargé."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 7
CONSEILLER JURIDIQUE IA
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CONSEIL COURANT
=========================================================*/

let ConseilCourant=null;

/*=========================================================
GÉNÉRER UN CONSEIL
=========================================================*/

function genererConseilIA(

analyse

){

let conseils=[];

if(!analyse){

return conseils;

}

if(

analyse.concepts.includes(

"licenciement"

)

){

conseils.push(

"Vérifiez le respect de la procédure de licenciement."

);

conseils.push(

"Contrôlez le délai de préavis."

);

conseils.push(

"Vérifiez les indemnités éventuelles."

);

}

if(

analyse.concepts.includes(

"salaire"

)

){

conseils.push(

"Examinez les bulletins de paie."

);

conseils.push(

"Vérifiez les preuves de paiement."

);

conseils.push(

"Contrôlez les retenues effectuées."

);

}

if(

analyse.concepts.includes(

"contrat"

)

){

conseils.push(

"Vérifiez le contrat signé."

);

conseils.push(

"Contrôlez les clauses principales."

);

}

if(

analyse.concepts.includes(

"accident"

)

){

conseils.push(

"Vérifiez la déclaration d'accident."

);

conseils.push(

"Contrôlez les mesures de sécurité."

);

}

if(

analyse.concepts.includes(

"inspection"

)

){

conseils.push(

"Préparez les documents d'inspection."

);

conseils.push(

"Vérifiez le registre du personnel."

);

}

if(

conseils.length===0

){

conseils.push(

"Analysez les articles proposés avant toute décision."

);

}

return conseils;

}

/*=========================================================
CRÉER LE RAPPORT
=========================================================*/

function creerConseilJuridique(

question

){

const analyse=

analyserQuestionIA(

question

);

const recommandations=

genererConseilIA(

analyse

);

ConseilCourant={

question:question,

analyse:analyse,

recommandations:

recommandations,

date:new Date()

};

return ConseilCourant;

}

/*=========================================================
AFFICHER
=========================================================*/

function afficherConseilIA(

question

){

const resultat=

creerConseilJuridique(

question

);

console.group(

"Conseiller Juridique IA"

);

console.log(

"Question :",

resultat.question

);

console.log(

"Concepts :",

resultat.analyse.concepts

);

console.log(

"Recommandations :"

);

resultat.recommandations.forEach(

function(

conseil,

index

){

console.log(

(index+1)+".",

conseil

);

}

);

console.groupEnd();

return resultat;

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function lireConseilIA(

question

){

const resultat=

creerConseilJuridique(

question

);

if(

typeof parlerIA===

"function"

){

parlerIA(

resultat.recommandations.join(

". "

)

);

}

return resultat;

}

/*=========================================================
OBTENIR LE CONSEIL
=========================================================*/

function obtenirConseilIA(){

return ConseilCourant;

}

/*=========================================================
RÉINITIALISER
=========================================================*/

function viderConseilIA(){

ConseilCourant=null;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Conseiller Juridique IA chargé."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 8
MÉMOIRE CONVERSATIONNELLE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
MÉMOIRE
=========================================================*/

const MemoireIA={

conversation:[],

maximum:20

};

/*=========================================================
AJOUTER UN MESSAGE
=========================================================*/

function ajouterMessageIA(

role,

texte

){

MemoireIA.conversation.push({

role:role,

texte:texte,

date:new Date()

});

if(

MemoireIA.conversation.length>

MemoireIA.maximum

){

MemoireIA.conversation.shift();

}

}

/*=========================================================
OBTENIR LA CONVERSATION
=========================================================*/

function obtenirConversationIA(){

return MemoireIA.conversation;

}

/*=========================================================
DERNIER MESSAGE
=========================================================*/

function dernierMessageIA(){

if(

MemoireIA.conversation.length===0

){

return null;

}

return MemoireIA.conversation[

MemoireIA.conversation.length-1

];

}

/*=========================================================
EFFACER LA CONVERSATION
=========================================================*/

function effacerConversationIA(){

MemoireIA.conversation=[];

}

/*=========================================================
RÉSUMÉ DE LA CONVERSATION
=========================================================*/

function resumeConversationIA(){

return MemoireIA.conversation

.map(function(

message

){

return(

message.role+

" : "+

message.texte

);

})

.join("\n");

}

/*=========================================================
TRAITER UNE QUESTION
=========================================================*/

function conversationIA(

question

){

ajouterMessageIA(

"Utilisateur",

question

);

const reponse=

genererReponseIA(

question

);

ajouterMessageIA(

"InspecteurBot IA",

reponse.reponse

);

return reponse;

}

/*=========================================================
AFFICHER LA CONVERSATION
=========================================================*/

function afficherConversationIA(){

console.group(

"Conversation IA"

);

MemoireIA.conversation.forEach(

function(

message

){

console.log(

message.role+

" :",

message.texte

);

}

);

console.groupEnd();

}

/*=========================================================
SAUVEGARDE
=========================================================*/

function sauvegarderConversationIA(){

localStorage.setItem(

"IBIA_CONVERSATION",

JSON.stringify(

MemoireIA.conversation

)

);

}

/*=========================================================
CHARGEMENT
=========================================================*/

function chargerConversationIA(){

const donnees=

localStorage.getItem(

"IBIA_CONVERSATION"

);

if(

donnees

){

MemoireIA.conversation=

JSON.parse(

donnees

);

}

}

/*=========================================================
INITIALISATION
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

chargerConversationIA();

}

);

window.addEventListener(

"beforeunload",

function(){

sauvegarderConversationIA();

}

);

console.log(

"Mémoire conversationnelle chargée."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 9
INTÉGRATION COMPLÈTE DES MODULES IA
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
MODULES IA
=========================================================*/

const ModulesRAG={

langues:false,

traduction:false,

speech:false,

search:false,

vectorSearch:false

};

/*=========================================================
INITIALISATION
=========================================================*/

function initialiserModulesRAG(){

ModulesRAG.langues=

typeof LanguesIA!=="undefined";

ModulesRAG.traduction=

typeof preparerQuestionMultilingue==="function";

ModulesRAG.speech=

typeof parlerIA==="function";

ModulesRAG.search=

typeof rechercherArticles==="function";

ModulesRAG.vectorSearch=

typeof rechercherSemantique==="function";

console.table(

ModulesRAG

);

}

/*=========================================================
QUESTION COMPLÈTE
=========================================================*/

function traiterQuestionComplete(

question

){

let texte=question;

/* Langues */

if(

typeof preparerQuestionMultilingue===

"function"

){

const analyse=

preparerQuestionMultilingue(

question

);

texte=

analyse.question;

}

/* Recherche */

let articles=[];

if(

typeof rechercherArticles===

"function"

){

articles=

rechercherArticles(

texte

);

}

/* Réponse */

const reponse=

genererReponseIA(

texte

);

/* Mémoire */

ajouterMessageIA(

"Utilisateur",

question

);

ajouterMessageIA(

"InspecteurBot IA",

reponse.reponse

);

return{

question:question,

questionNormalisee:texte,

articles:articles,

reponse:reponse

};

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function lireReponseComplete(

question

){

const resultat=

traiterQuestionComplete(

question

);

if(

typeof parlerIA===

"function"

){

parlerIA(

resultat.reponse.reponse

);

}

return resultat;

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherAnalyseComplete(

question

){

const resultat=

traiterQuestionComplete(

question

);

console.group(

"InspecteurBot IA"

);

console.log(

"Question :",

resultat.question

);

console.log(

"Question normalisée :",

resultat.questionNormalisee

);

console.log(

"Articles trouvés :",

resultat.articles.length

);

console.log(

"Réponse :",

resultat.reponse.reponse

);

console.groupEnd();

return resultat;

}

/*=========================================================
ÉTAT DES MODULES
=========================================================*/

function etatModulesRAG(){

return ModulesRAG;

}

/*=========================================================
AFFICHER LES MODULES
=========================================================*/

function afficherModulesRAG(){

console.group(

"Modules RAG"

);

console.table(

ModulesRAG

);

console.groupEnd();

}

/*=========================================================
INITIALISATION
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

initialiserModulesRAG();

afficherModulesRAG();

}

);

console.log(

"Intégration complète des modules IA chargée."

);

/*=========================================================
INSPECTEURBOT IA
RAG.JS
PARTIE 10
OPTIMISATION ET FINALISATION
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CACHE DES RÉPONSES
=========================================================*/

const CacheRAG=new Map();

/*=========================================================
OBTENIR LE CACHE
=========================================================*/

function obtenirCacheRAG(

question

){

return CacheRAG.get(

normaliserTexte(question)

);

}

/*=========================================================
ENREGISTRER LE CACHE
=========================================================*/

function enregistrerCacheRAG(

question,

reponse

){

CacheRAG.set(

normaliserTexte(question),

reponse

);

}

/*=========================================================
VIDER LE CACHE
=========================================================*/

function viderCacheRAG(){

CacheRAG.clear();

}

/*=========================================================
STATISTIQUES
=========================================================*/

function statistiquesRAG(){

return{

version:RAGIA.version,

etat:etatRAG,

charge:RAGIA.estCharge,

articles:BaseJuridique.length,

articlesSelectionnes:

ArticlesContextuels.length,

conversation:

MemoireIA.conversation.length,

cache:

CacheRAG.size

};

}

/*=========================================================
AFFICHER LES STATISTIQUES
=========================================================*/

function afficherStatistiquesRAG(){

console.group(

"RAG.js"

);

console.table(

statistiquesRAG()

);

console.groupEnd();

}

/*=========================================================
RÉINITIALISER LE MOTEUR
=========================================================*/

function reinitialiserRAG(){

viderCacheRAG();

viderContexte();

viderReponseIA();

effacerExplication();

viderConseilIA();

effacerConversationIA();

reinitialiserAnalyse();

definirEtatRAG(

EtatRAG.PRET

);

console.log(

"Moteur RAG réinitialisé."

);

}

/*=========================================================
TEST
=========================================================*/

function testerRAG(){

console.log(

"===== TEST RAG ====="

);

console.log(

statistiquesRAG()

);

console.log(

"===================="

);

}

/*=========================================================
MAINTENANCE
=========================================================*/

function maintenanceRAG(){

console.log(

"Maintenance RAG..."

);

afficherStatistiquesRAG();

}

/*=========================================================
INITIALISATION
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

function(){

maintenanceRAG();

}

);

console.log(

"======================================"

);

console.log(

"InspecteurBot IA"

);

console.log(

"RAG.js Version 4.0"

);

console.log(

"Moteur juridique intelligent prêt."

);

console.log(

"======================================"

);
