/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 1
CONFIGURATION GÉNÉRALE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION
=========================================================*/

const SearchIA={

version:"4.0",

actif:true,

langue:"fr",

rechercheSemantique:true,

rechercheMultilingue:true,

rechercheApproximate:true,

historique:true,

resultatsMaximum:50,

journal:false

};

/*=========================================================
ÉTATS
=========================================================*/

const EtatRecherche={

PRET:"pret",

RECHERCHE:"recherche",

TERMINE:"termine",

ERREUR:"erreur"

};

let etatRecherche=

EtatRecherche.PRET;

/*=========================================================
HISTORIQUE
=========================================================*/

let historiqueRecherche=[];

let dernierResultat=[];

/*=========================================================
CHANGER L'ÉTAT
=========================================================*/

function definirEtatRecherche(

etat

){

etatRecherche=etat;

console.log(

"Recherche :",etat

);

}

/*=========================================================
LANGUE ACTIVE
=========================================================*/

function langueRecherche(){

if(

typeof langueActive==="function"

){

return langueActive();

}

return SearchIA.langue;

}

/*=========================================================
CONFIGURATION
=========================================================*/

function configurationRecherche(){

return{

version:

SearchIA.version,

langue:

langueRecherche(),

etat:

etatRecherche,

semantique:

SearchIA.rechercheSemantique,

multilingue:

SearchIA.rechercheMultilingue

};

}

/*=========================================================
HISTORIQUE
=========================================================*/

function ajouterHistorique(

question

){

if(

!SearchIA.historique

){

return;

}

historiqueRecherche.push({

question:question,

date:new Date()

});

}

/*=========================================================
OBTENIR L'HISTORIQUE
=========================================================*/

function obtenirHistorique(){

return historiqueRecherche;

}

/*=========================================================
VIDER L'HISTORIQUE
=========================================================*/

function viderHistorique(){

historiqueRecherche=[];

}

/*=========================================================
INITIALISATION
=========================================================*/

function initialiserRecherche(){

console.log(

"======================================"

);

console.log(

"InspecteurBot IA"

);

console.log(

"Search.js"

);

console.log(

"Version",

SearchIA.version

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

initialiserRecherche();

}

);

console.log(

"Search.js Partie 1 chargée."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 2
INDEXATION DES ARTICLES
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
BASE DE DONNÉES
=========================================================*/

let BaseCodeTravail=[];

/*=========================================================
INDEX DES ARTICLES
=========================================================*/

let IndexArticles=new Map();

let IndexNumeros=new Map();

let IndexTitres=new Map();

/*=========================================================
CHARGER LA BASE
=========================================================*/

function chargerBaseArticles(

articles

){

if(

!Array.isArray(articles)

){

console.error(

"Base juridique invalide."

);

return false;

}

BaseCodeTravail=articles;

construireIndex();

return true;

}

/*=========================================================
CONSTRUIRE LES INDEX
=========================================================*/

function construireIndex(){

IndexArticles.clear();

IndexNumeros.clear();

IndexTitres.clear();

BaseCodeTravail.forEach(function(

article,

position

){

if(!article){

return;

}

IndexArticles.set(

position,

article

);

if(article.numero){

IndexNumeros.set(

String(article.numero),

article

);

}

if(article.titre){

IndexTitres.set(

normaliserTexte(

article.titre

),

article

);

}

});

console.log(

"Articles indexés :",

IndexArticles.size

);

}

/*=========================================================
NOMBRE D'ARTICLES
=========================================================*/

function nombreArticles(){

return IndexArticles.size;

}

/*=========================================================
ARTICLE PAR NUMÉRO
=========================================================*/

function articleNumero(

numero

){

return IndexNumeros.get(

String(numero)

)||null;

}

/*=========================================================
ARTICLE PAR TITRE
=========================================================*/

function articleTitre(

titre

){

return IndexTitres.get(

normaliserTexte(titre)

)||null;

}

/*=========================================================
LISTE DES ARTICLES
=========================================================*/

function tousLesArticles(){

return BaseCodeTravail;

}

/*=========================================================
BASE CHARGÉE
=========================================================*/

function baseChargee(){

return BaseCodeTravail.length>0;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Indexation des articles prête."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 3
RECHERCHE PAR NUMÉRO D'ARTICLE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
EXTRAIRE LE NUMÉRO
=========================================================*/

function extraireNumeroArticle(

texte

){

if(!texte){

return null;

}

texte=normaliserTexte(

texte

);

const resultat=

texte.match(/\d+/);

if(resultat){

return resultat[0];

}

return null;

}

/*=========================================================
RECHERCHE PAR NUMÉRO
=========================================================*/

function rechercherParNumero(

texte

){

const numero=

extraireNumeroArticle(

texte

);

if(!numero){

return null;

}

return articleNumero(

numero

);

}

/*=========================================================
VÉRIFIER SI C'EST UNE RECHERCHE
PAR NUMÉRO
=========================================================*/

function estRechercheNumero(

texte

){

texte=normaliserTexte(

texte

);

return(

/article/.test(texte)||

/art/.test(texte)||

/^\d+$/.test(texte)

);

}

/*=========================================================
LANCER LA RECHERCHE
=========================================================*/

function rechercherArticleNumero(

texte

){

if(

!baseChargee()

){

console.warn(

"La base juridique n'est pas chargée."

);

return null;

}

const article=

rechercherParNumero(

texte

);

if(article){

dernierResultat=[

article

];

ajouterHistorique(

texte

);

}

return article;

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherArticleNumero(

texte

){

const article=

rechercherArticleNumero(

texte

);

if(!article){

return null;

}

if(

typeof afficherArticles===

"function"

){

afficherArticles([

article

]);

}

return article;

}

/*=========================================================
TEST RAPIDE
=========================================================*/

function testRechercheNumero(){

console.log(

"Test Article 15 :",

rechercherParNumero(

"Article 15"

)

);

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Recherche par numéro chargée."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 4
RECHERCHE PAR MOTS-CLÉS
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
RECHERCHE PAR MOT-CLÉ
=========================================================*/

function rechercherParMotCle(

mot

){

if(

!baseChargee()

){

return [];

}

mot=

normaliserTexte(

mot

);

let resultats=[];

BaseCodeTravail.forEach(function(

article

){

let trouve=false;

/* Numéro */

if(

article.numero &&

String(article.numero)

.includes(mot)

){

trouve=true;

}

/* Titre */

if(

!trouve &&

article.titre &&

normaliserTexte(

article.titre

).includes(mot)

){

trouve=true;

}

/* Contenu */

if(

!trouve &&

article.contenu &&

normaliserTexte(

article.contenu

).includes(mot)

){

trouve=true;

}

/* Mots-clés */

if(

!trouve &&

Array.isArray(

article.motsCles

)

){

trouve=

article.motsCles.some(

function(

motCle

){

return normaliserTexte(

motCle

).includes(mot);

}

);

}

if(

trouve

){

resultats.push(

article

);

}

});

return resultats;

}

/*=========================================================
RECHERCHE MULTI MOTS
=========================================================*/

function rechercherParExpression(

texte

){

const mots=

normaliserTexte(

texte

)

.split(/\s+/)

.filter(function(

mot

){

return mot.length>1;

});

let resultat=[];

mots.forEach(function(

mot

){

const liste=

rechercherParMotCle(

mot

);

liste.forEach(function(

article

){

if(

!resultat.includes(

article

)

){

resultat.push(

article

);

}

});

});

return resultat;

}

/*=========================================================
LANCER RECHERCHE
=========================================================*/

function rechercherMotsCles(

texte

){

const resultat=

rechercherParExpression(

texte

);

dernierResultat=

resultat;

ajouterHistorique(

texte

);

return resultat;

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherRechercheMots(

texte

){

const resultat=

rechercherMotsCles(

texte

);

if(

typeof afficherArticles===

"function"

){

afficherArticles(

resultat

);

}

return resultat;

}

/*=========================================================
NOMBRE DE RÉSULTATS
=========================================================*/

function nombreResultats(){

return

dernierResultat.length;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Recherche par mots-clés chargée."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 5
RECHERCHE MULTILINGUE INTELLIGENTE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
PRÉPARER LA QUESTION
=========================================================*/

function preparerQuestionRecherche(

question

){

if(!question){

return "";

}

if(

typeof preparerQuestionMultilingue===

"function"

){

const analyse=

preparerQuestionMultilingue(

question

);

return analyse.question;

}

return question;

}

/*=========================================================
LANGUE DE RECHERCHE
=========================================================*/

function langueRechercheActive(){

if(

typeof langueActive===

"function"

){

return langueActive();

}

return "fr";

}

/*=========================================================
RECHERCHE MULTILINGUE
=========================================================*/

function rechercherMultilingue(

question

){

const texte=

preparerQuestionRecherche(

question

);

const resultat=

rechercherParExpression(

texte

);

dernierResultat=

resultat;

ajouterHistorique(

question

);

return resultat;

}

/*=========================================================
RECHERCHE GLOBALE
=========================================================*/

function rechercherArticles(

question

){

if(

!baseChargee()

){

console.warn(

"Base juridique non chargée."

);

return [];

}

definirEtatRecherche(

EtatRecherche.RECHERCHE

);

let resultat=[];

if(

estRechercheNumero(

question

)

){

const article=

rechercherArticleNumero(

question

);

if(article){

resultat=[

article

];

}

}else{

resultat=

rechercherMultilingue(

question

);

}

definirEtatRecherche(

EtatRecherche.TERMINE

);

dernierResultat=

resultat;

return resultat;

}

/*=========================================================
AFFICHER LES RÉSULTATS
=========================================================*/

function afficherRecherche(

question

){

const resultat=

rechercherArticles(

question

);

if(

typeof afficherArticles===

"function"

){

afficherArticles(

resultat

);

}

return resultat;

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function annoncerRecherche(

question

){

const resultat=

rechercherArticles(

question

);

if(

typeof parlerIA===

"function"

){

if(

resultat.length>0

){

parlerIA(

resultat.length+

" article(s) trouvé(s)."

);

}else{

parlerIA(

"Aucun article trouvé."

);

}

}

return resultat;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Recherche multilingue intelligente chargée."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 6
RECHERCHE SÉMANTIQUE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CALCUL DE PERTINENCE
=========================================================*/

function calculerPertinence(

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

/* Titre */

concepts.forEach(function(

concept

){

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
RECHERCHE SÉMANTIQUE
=========================================================*/

function rechercherSemantique(

question

){

if(

!baseChargee()

){

return [];

}

let concepts=[];

if(

typeof identifierConcepts===

"function"

){

concepts=

identifierConcepts(

question

);

}

let resultat=[];

BaseCodeTravail.forEach(function(

article

){

const score=

calculerPertinence(

article,

concepts

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

return resultat.map(function(

item

){

return item.article;

});

}

/*=========================================================
RECHERCHE IA
=========================================================*/

function rechercherIA(

question

){

const resultat=

rechercherSemantique(

question

);

if(

resultat.length>0

){

dernierResultat=

resultat;

ajouterHistorique(

question

);

}

return resultat;

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherRechercheIA(

question

){

const resultat=

rechercherIA(

question

);

if(

typeof afficherArticles===

"function"

){

afficherArticles(

resultat

);

}

return resultat;

}

/*=========================================================
LECTURE
=========================================================*/

function annoncerRechercheIA(

question

){

const resultat=

rechercherIA(

question

);

if(

typeof parlerIA===

"function"

){

parlerIA(

resultat.length+

" résultat(s) trouvé(s)."

);

}

return resultat;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Recherche sémantique chargée."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 7
CLASSEMENT INTELLIGENT DES RÉSULTATS
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CALCUL DU SCORE GLOBAL
=========================================================*/

function calculerScoreGlobal(

article,

question

){

let score=0;

const concepts=

typeof identifierConcepts==="function"

?identifierConcepts(question)

:[];

/* Pertinence */

score+=calculerPertinence(

article,

concepts

);

/* Priorité */

if(article.priorite){

score+=Number(

article.priorite

);

}

/* Article important */

if(article.important===true){

score+=20;

}

/* Article récent */

if(article.misAJour){

score+=5;

}

return score;

}

/*=========================================================
CLASSER LES ARTICLES
=========================================================*/

function classerResultats(

articles,

question

){

let classement=[];

articles.forEach(function(

article

){

classement.push({

article:article,

score:

calculerScoreGlobal(

article,

question

)

});

});

classement.sort(function(

a,

b

){

return b.score-a.score;

});

return classement;

}

/*=========================================================
EXTRAIRE LES ARTICLES
=========================================================*/

function extraireArticles(

classement

){

return classement.map(function(

element

){

return element.article;

});

}

/*=========================================================
RECHERCHE AVANCÉE
=========================================================*/

function rechercherAvancee(

question

){

const resultat=

rechercherIA(

question

);

const classement=

classerResultats(

resultat,

question

);

const articles=

extraireArticles(

classement

);

dernierResultat=

articles;

return articles;

}

/*=========================================================
SUGGESTIONS
=========================================================*/

function suggererArticles(

question,

limite=5

){

const articles=

rechercherAvancee(

question

);

return articles.slice(

0,

limite

);

}

/*=========================================================
MEILLEUR RÉSULTAT
=========================================================*/

function meilleurArticle(

question

){

const articles=

suggererArticles(

question,

1

);

return articles.length

?articles[0]

:null;

}

/*=========================================================
AFFICHAGE
=========================================================*/

function afficherRechercheAvancee(

question

){

const resultat=

rechercherAvancee(

question

);

if(

typeof afficherArticles===

"function"

){

afficherArticles(

resultat

);

}

return resultat;

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log(

"Classement intelligent chargé."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 8
FAVORIS ET HISTORIQUE
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
CLÉS DE SAUVEGARDE
=========================================================*/

const CLE_HISTORIQUE="IBIA_HISTORIQUE";

const CLE_FAVORIS="IBIA_FAVORIS";

/*=========================================================
CHARGEMENT
=========================================================*/

function chargerHistorique(){

const donnees=

localStorage.getItem(

CLE_HISTORIQUE

);

if(donnees){

historiqueRecherche=

JSON.parse(

donnees

);

}

}

function chargerFavoris(){

const donnees=

localStorage.getItem(

CLE_FAVORIS

);

if(donnees){

return JSON.parse(

donnees

);

}

return [];

}

/*=========================================================
SAUVEGARDE
=========================================================*/

function sauvegarderHistorique(){

localStorage.setItem(

CLE_HISTORIQUE,

JSON.stringify(

historiqueRecherche

)

);

}

function sauvegarderFavoris(

favoris

){

localStorage.setItem(

CLE_FAVORIS,

JSON.stringify(

favoris

)

);

}

/*=========================================================
AJOUT HISTORIQUE
=========================================================*/

function ajouterRechercheHistorique(

question

){

historiqueRecherche.unshift({

question:question,

date:new Date()

});

if(

historiqueRecherche.length>100

){

historiqueRecherche.pop();

}

sauvegarderHistorique();

}

/*=========================================================
AJOUT FAVORI
=========================================================*/

function ajouterFavori(

article

){

let favoris=

chargerFavoris();

const existe=

favoris.some(function(

item

){

return item.numero===

article.numero;

});

if(!existe){

favoris.push(

article

);

sauvegarderFavoris(

favoris

);

}

}

/*=========================================================
SUPPRIMER FAVORI
=========================================================*/

function supprimerFavori(

numero

){

let favoris=

chargerFavoris();

favoris=

favoris.filter(function(

article

){

return String(

article.numero

)!==String(

numero

);

});

sauvegarderFavoris(

favoris

);

}

/*=========================================================
OBTENIR FAVORIS
=========================================================*/

function obtenirFavoris(){

return chargerFavoris();

}

/*=========================================================
VIDER HISTORIQUE
=========================================================*/

function effacerHistoriqueRecherche(){

historiqueRecherche=[];

sauvegarderHistorique();

}

/*=========================================================
DERNIÈRES RECHERCHES
=========================================================*/

function dernieresRecherches(

limite=10

){

return historiqueRecherche.slice(

0,

limite

);

}

/*=========================================================
STATISTIQUES
=========================================================*/

function statistiquesRecherche(){

return{

historique:

historiqueRecherche.length,

favoris:

obtenirFavoris().length

};

}

/*=========================================================
INITIALISATION
=========================================================*/

chargerHistorique();

console.log(

"Historique et favoris chargés."

);

/*=========================================================
INSPECTEURBOT IA
SEARCH.JS
PARTIE 9
INTÉGRATION DES MODULES IA
Version 4.0
=========================================================*/

"use strict";

/*=========================================================
VÉRIFICATION DES MODULES
=========================================================*/

const ModulesIA={

langues:false,

traduction:false,

speech:false,

rag:false,

vectorSearch:false

};

/*=========================================================
INITIALISER LES MODULES
=========================================================*/

function initialiserModulesIA(){

ModulesIA.langues=

typeof LanguesIA!=="undefined";

ModulesIA.traduction=

typeof preparerQuestionMultilingue==="function";

ModulesIA.speech=

typeof parlerIA==="function";

ModulesIA.rag=

typeof analyserQuestionIA==="function";

ModulesIA.vectorSearch=

typeof rechercherSemantique==="function";

console.table(

ModulesIA

);

}

/*=========================================================
PRÉPARER LA QUESTION
=========================================================*/

function preparerQuestionIA(

question

){

let texte=question;

/* Traduction */

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

return texte;

}

/*=========================================================
RECHERCHE COMPLÈTE
=========================================================*/

function rechercherIAComplete(

question

){

const texte=

preparerQuestionIA(

question

);

let resultat=[];

/* Recherche sémantique */

if(

typeof rechercherSemantique===

"function"

){

resultat=

rechercherSemantique(

texte

);

}

/* Recherche classique */

if(

resultat.length===0

){

resultat=

rechercherArticles(

texte

);

}

dernierResultat=

resultat;

ajouterRechercheHistorique(

question

);

return resultat;

}

/*=========================================================
RÉPONSE JURIDIQUE IA
=========================================================*/

function lancerAnalyseIA(

question

){

const articles=

rechercherIAComplete(

question

);

if(

typeof analyserQuestionIA===

"function"

){

analyserQuestionIA(

question,

articles

);

}

return articles;

}

/*=========================================================
LECTURE VOCALE
=========================================================*/

function lireResultatsIA(

articles

){

if(

typeof parlerIA!==

"function"

){

return;

}

if(

articles.length===0

){

parlerIA(

"Aucun article trouvé."

);

return;

}

parlerIA(

articles.length+

" article(s) trouvé(s)."

);

}

/*=========================================================
RECHERCHE GLOBALE
=========================================================*/

function rechercherEtLire(

question

){

const articles=

lancerAnalyseIA(

question

);

lireResultatsIA(

articles

);

return articles;

}

/*=========================================================
ÉTAT DES MODULES
=========================================================*/

function afficherEtatModules(){

console.group(

"Modules InspecteurBot IA"

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

initialiserModulesIA();

afficherEtatModules();

}

);

console.log(

"Intégration IA terminée."

);
