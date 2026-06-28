/*=========================================================
INSPECTEURBOT IA
VECTORSEARCH.JS
PARTIE 1
CONFIGURATION GÉNÉRALE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION
=========================================================*/

const VectorIA={

version:"4.0",

estCharge:false,

normalisation:true,

rechercheSemantique:true,

cache:true,

scoreMinimum:1,

maxResultats:20

};

/*=========================================================
BASE VECTORIELLE
=========================================================*/

let BaseVectorielle=[];

let IndexVectoriel=[];

/*=========================================================
ÉTATS
=========================================================*/

const EtatVector={

PRET:"pret",

INDEXATION:"indexation",

RECHERCHE:"recherche",

TERMINE:"termine",

ERREUR:"erreur"

};

let etatVector=

EtatVector.PRET;

/*=========================================================
CHANGER L'ÉTAT
=========================================================*/

function definirEtatVector(

etat

){

etatVector=etat;

console.log(

"VectorSearch :",etat

);

}

/*=========================================================
BASE CHARGÉE
=========================================================*/

function baseVectorChargee(){

return VectorIA.estCharge;

}

/*=========================================================
NOMBRE DE DOCUMENTS
=========================================================*/

function nombreDocumentsVector(){

return BaseVectorielle.length;

}

/*=========================================================
CONFIGURATION
=========================================================*/

function configurationVector(){

return{

version:VectorIA.version,

etat:etatVector,

charge:VectorIA.estCharge,

documents:

BaseVectorielle.length,

index:

IndexVectoriel.length

};

}

/*=========================================================
INITIALISATION
=========================================================*/

function initialiserVector(){

console.log(

"======================================"

);

console.log(

"InspecteurBot IA"

);

console.log(

"VectorSearch.js"

);

console.log(

"Version",

VectorIA.version

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

initialiserVector();

}

);

console.log(

"VectorSearch.js Partie 1 chargée."

);

/*=========================================================
INSPECTEURBOT IA
VECTORSEARCH.JS
PARTIE 2
INDEXATION DE LA BASE JURIDIQUE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CHARGER LA BASE
=========================================================*/

function chargerBaseVector(

documents

){

if(

!Array.isArray(documents)

){

return false;

}

BaseVectorielle=documents;

creerIndexVectoriel();

VectorIA.estCharge=true;

definirEtatVector(

EtatVector.TERMINE

);

console.log(

"Base vectorielle chargée :",

BaseVectorielle.length,

"articles."

);

return true;

}

/*=========================================================
CRÉER L'INDEX
=========================================================*/

function creerIndexVectoriel(){

definirEtatVector(

EtatVector.INDEXATION

);

IndexVectoriel=[];

BaseVectorielle.forEach(function(

article

){

IndexVectoriel.push({

numero:

article.numero||"",

titre:

article.titre||"",

contenu:

article.contenu||"",

resume:

article.resume||"",

motsCles:

article.motsCles||[],

document:

article

});

});

definirEtatVector(

EtatVector.TERMINE

);

}

/*=========================================================
OBTENIR L'INDEX
=========================================================*/

function obtenirIndexVectoriel(){

return IndexVectoriel;

}

/*=========================================================
RECHERCHER PAR NUMÉRO
=========================================================*/

function documentNumero(

numero

){

return IndexVectoriel.find(

function(

element

){

return String(

element.numero

)===String(

numero

);

}

);

}

/*=========================================================
RECHARGER L'INDEX
=========================================================*/

function rechargerIndexVectoriel(){

if(

BaseVectorielle.length===0

){

return;

}

creerIndexVectoriel();

}

/*=========================================================
VIDER L'INDEX
=========================================================*/

function viderIndexVectoriel(){

IndexVectoriel=[];

VectorIA.estCharge=false;

}

/*=========================================================
STATISTIQUES
=========================================================*/

function statistiquesVector(){

return{

documents:

BaseVectorielle.length,

index:

IndexVectoriel.length,

etat:

etatVector,

charge:

VectorIA.estCharge

};

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Index juridique chargé."

);

/*=========================================================
INSPECTEURBOT IA
VECTORSEARCH.JS
PARTIE 3
PRÉTRAITEMENT DES TEXTES
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
NORMALISER LE TEXTE
=========================================================*/

function normaliserVector(

texte

){

if(!texte){

return "";

}

if(

typeof normaliserTexte===

"function"

){

return normaliserTexte(

texte

);

}

return String(

texte

)

.toLowerCase()

.normalize("NFD")

.replace(/[\u0300-\u036f]/g,"")

.replace(/[^\w\s]/g," ")

.replace(/\s+/g," ")

.trim();

}

/*=========================================================
DÉCOUPER EN MOTS
=========================================================*/

function decouperVector(

texte

){

return normaliserVector(

texte

)

.split(" ")

.filter(function(

mot

){

return mot.length>2;

});

}

/*=========================================================
SUPPRIMER LES DOUBLONS
=========================================================*/

function supprimerDoublonsVector(

mots

){

return [...new Set(

mots

)];

}

/*=========================================================
PRÉPARER LE DOCUMENT
=========================================================*/

function preparerDocumentVector(

article

){

let texte="";

texte+=

article.numero||"";

texte+=" ";

texte+=

article.titre||"";

texte+=" ";

texte+=

article.resume||"";

texte+=" ";

texte+=

article.contenu||"";

if(

Array.isArray(

article.motsCles

)

){

texte+=" ";

texte+=

article.motsCles.join(

" "

);

}

const mots=

supprimerDoublonsVector(

decouperVector(

texte

)

);

return{

numero:

article.numero,

mots:

mots,

document:

article

};

}

/*=========================================================
PRÉPARER L'INDEX
=========================================================*/

function preparerIndexVectoriel(){

IndexVectoriel=

BaseVectorielle.map(

function(

article

){

return preparerDocumentVector(

article

);

}

);

console.log(

"Documents préparés :",

IndexVectoriel.length

);

}

/*=========================================================
NOMBRE DE MOTS
=========================================================*/

function nombreMotsVector(

article

){

const doc=

preparerDocumentVector(

article

);

return doc.mots.length;

}

/*=========================================================
AFFICHER LE DOCUMENT
=========================================================*/

function afficherDocumentVector(

article

){

const doc=

preparerDocumentVector(

article

);

console.group(

"Document Vectoriel"

);

console.log(

"Article :",

doc.numero

);

console.log(

"Mots :",

doc.mots

);

console.groupEnd();

return doc;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Prétraitement des textes chargé."

);

/*=========================================================
INSPECTEURBOT IA
VECTORSEARCH.JS
PARTIE 4
CRÉATION DES VECTEURS SÉMANTIQUES
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
VECTEURS
=========================================================*/

let VecteursSemantiques=[];

/*=========================================================
CRÉER UN VECTEUR
=========================================================*/

function creerVecteurDocument(

document

){

const mots=

document.mots||[];

const frequence={};

mots.forEach(function(

mot

){

if(

!frequence[mot]

){

frequence[mot]=0;

}

frequence[mot]++;

});

return{

numero:

document.numero,

mots:mots,

vecteur:

frequence,

taille:

mots.length,

document:

document.document

};

}

/*=========================================================
CRÉER TOUS LES VECTEURS
=========================================================*/

function creerVecteursSemantiques(){

definirEtatVector(

EtatVector.INDEXATION

);

VecteursSemantiques=[];

IndexVectoriel.forEach(function(

document

){

VecteursSemantiques.push(

creerVecteurDocument(

document

)

);

});

definirEtatVector(

EtatVector.TERMINE

);

console.log(

"Vecteurs créés :",

VecteursSemantiques.length

);

}

/*=========================================================
OBTENIR LES VECTEURS
=========================================================*/

function obtenirVecteursSemantiques(){

return VecteursSemantiques;

}

/*=========================================================
VECTEUR PAR NUMÉRO
=========================================================*/

function obtenirVecteurNumero(

numero

){

return VecteursSemantiques.find(

function(

vecteur

){

return String(

vecteur.numero

)===String(

numero

);

}

);

}

/*=========================================================
RECONSTRUIRE
=========================================================*/

function reconstruireVecteurs(){

if(

IndexVectoriel.length===0

){

return;

}

creerVecteursSemantiques();

}

/*=========================================================
SUPPRIMER
=========================================================*/

function viderVecteurs(){

VecteursSemantiques=[];

}

/*=========================================================
STATISTIQUES
=========================================================*/

function statistiquesVecteurs(){

return{

vecteurs:

VecteursSemantiques.length,

documents:

IndexVectoriel.length,

etat:

etatVector

};

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Vecteurs sémantiques chargés."

);
