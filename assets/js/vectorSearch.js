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

"use strict";

/*=========================================================
OUTILS DE SIMILARITÉ
=========================================================*/

/**
 * Calcul de similarité cosinus simplifiée
 * entre 2 vecteurs (fréquence de mots)
 */
function similariteCosinus(vecteurA, vecteurB){

    if(!vecteurA || !vecteurB){
        return 0;
    }

    let intersection = 0;

    let sommeA = 0;
    let sommeB = 0;

    const tousLesMots = new Set([
        ...Object.keys(vecteurA),
        ...Object.keys(vecteurB)
    ]);

    tousLesMots.forEach(function(mot){

        const valA = vecteurA[mot] || 0;
        const valB = vecteurB[mot] || 0;

        intersection += valA * valB;

        sommeA += valA * valA;
        sommeB += valB * valB;

    });

    if(sommeA === 0 || sommeB === 0){
        return 0;
    }

    return intersection / (Math.sqrt(sommeA) * Math.sqrt(sommeB));
}

/*=========================================================
SIMILARITÉ ENTRE TEXTE ET DOCUMENT
=========================================================*/

function similariteTexteDocument(texteQuery, vecteurDocument){

    const motsQuery = decouperVector(texteQuery);

    const freqQuery = {};

    motsQuery.forEach(function(mot){
        freqQuery[mot] = (freqQuery[mot] || 0) + 1;
    });

    return similariteCosinus(freqQuery, vecteurDocument.vecteur);
}

/*=========================================================
SIMILARITÉ ENTRE DEUX DOCUMENTS
=========================================================*/

function similariteDocuments(docA, docB){

    if(!docA || !docB){
        return 0;
    }

    return similariteCosinus(docA.vecteur, docB.vecteur);
}

/*=========================================================
CALCUL DU SCORE GLOBAL D'UN DOCUMENT
=========================================================*/

function scoreDocumentVectoriel(query, documentVectoriel){

    const scoreTexte = similariteTexteDocument(
        query,
        documentVectoriel
    );

    const scoreLongueur = Math.min(
        documentVectoriel.taille / 100,
        1
    );

    const scoreFinal = (
        scoreTexte * 0.85 +
        scoreLongueur * 0.15
    );

    return {
        scoreTexte,
        scoreLongueur,
        scoreFinal
    };
}

/*=========================================================
SCORE DE TOUS LES DOCUMENTS
=========================================================*/

function scorerTousDocuments(query){

    const resultats = [];

    VecteursSemantiques.forEach(function(vecteur){

        const score = scoreDocumentVectoriel(query, vecteur);

        resultats.push({
            numero: vecteur.numero,
            document: vecteur.document,
            scoreTexte: score.scoreTexte,
            scoreLongueur: score.scoreLongueur,
            scoreFinal: score.scoreFinal
        });

    });

    return resultats.sort(function(a, b){
        return b.scoreFinal - a.scoreFinal;
    });
}

/*=========================================================
TOP RESULTATS
=========================================================*/

function topResultatsVector(query, limite = 10){

    return scorerTousDocuments(query).slice(0, limite);

}

/*=========================================================
DEBUG SIMILARITÉ
=========================================================*/

function debugSimilarite(query){

    const resultats = topResultatsVector(query, 5);

    console.group("=== DEBUG SIMILARITÉ VECTORIELLE ===");
    console.log("Query :", query);

    resultats.forEach(function(r, i){

        console.log("\n#" + (i + 1));
        console.log("Numéro :", r.numero);
        console.log("Score texte :", r.scoreTexte.toFixed(4));
        console.log("Score longueur :", r.scoreLongueur.toFixed(4));
        console.log("Score final :", r.scoreFinal.toFixed(4));

    });

    console.groupEnd();

    return resultats;
}

/*=========================================================
NORMALISATION DU SCORE
=========================================================*/

function normaliserScore(score){

    if(score < 0){
        return 0;
    }

    if(score > 1){
        return 1;
    }

    return score;
}

/*=========================================================
SIMILARITÉ AVANCÉE (VERSION OPTIMISÉE)
=========================================================*/

function similariteAvancee(query, vecteur){

    const base = similariteTexteDocument(query, vecteur);

    const boostKeywords = vecteur.document.motsCles ?
        vecteur.document.motsCles.length * 0.02 : 0;

    const score = base + boostKeywords;

    return normaliserScore(score);
}

/*=========================================================
INITIALISATION
=========================================================*/

console.log("Calcul de similarité chargé.");

"use strict";

/*=========================================================
LEXIQUE SIMPLE (EXTENSION SÉMANTIQUE)
=========================================================*/

const LexiqueSemantique = {

    "travail": ["emploi", "job", "fonction", "activité", "poste"],
    "contrat": ["accord", "convention", "engagement", "pacte"],
    "licenciement": ["renvoi", "rupture", "fin", "dismissal"],
    "salaire": ["paie", "rémunération", "revenu", "gain"],
    "employeur": ["patron", "entreprise", "société", "organisation"],
    "employé": ["travailleur", "agent", "salarié", "ouvrier"],
    "loi": ["règle", "texte", "norme", "article"],
    "infraction": ["crime", "délit", "faute", "violation"]
};

/*=========================================================
EXPANSION DE REQUÊTE
=========================================================*/

function etendreRequeteSemantique(query){

    const mots = decouperVector(query);

    let etendus = [...mots];

    mots.forEach(function(mot){

        if(LexiqueSemantique[mot]){

            etendus = etendus.concat(LexiqueSemantique[mot]);

        }

    });

    return supprimerDoublonsVector(etendus);
}

/*=========================================================
RECHERCHE SÉMANTIQUE AMÉLIORÉE
=========================================================*/

function rechercheSemantiqueAvancee(query, limite = 10){

    if(!query){
        return [];
    }

    definirEtatVector(EtatVector.RECHERCHE);

    const motsQuery = etendreRequeteSemantique(query);

    const resultats = [];

    VecteursSemantiques.forEach(function(vecteur){

        let score = 0;

        const motsDoc = vecteur.mots;

        motsQuery.forEach(function(mot){

            if(motsDoc.includes(mot)){
                score += 1;
            }

        });

        // normalisation
        score = score / motsQuery.length;

        // boost mots-clés juridiques
        const boost = vecteur.document.motsCles ?
            vecteur.document.motsCles.length * 0.05 : 0;

        const scoreFinal = score + boost;

        if(scoreFinal > 0){

            resultats.push({
                numero: vecteur.numero,
                document: vecteur.document,
                score: scoreFinal
            });

        }

    });

    definirEtatVector(EtatVector.TERMINE);

    return resultats
        .sort(function(a, b){
            return b.score - a.score;
        })
        .slice(0, limite);
}

/*=========================================================
RECHERCHE MULTI-MODE (HYBRIDE + SÉMANTIQUE)
=========================================================*/

function rechercheIntelligente(query, options = {}){

    const mode = options.mode || "auto";

    let resultats = [];

    if(mode === "semantic"){

        resultats = rechercheSemantiqueAvancee(
            query,
            options.limit || 10
        );

    }

    else if(mode === "vector"){

        resultats = topResultatsVector(
            query,
            options.limit || 10
        );

    }

    else{

        // MODE AUTO = combinaison intelligente
        const semantique = rechercheSemantiqueAvancee(query, 5);

        const vectoriel = topResultatsVector(query, 5);

        const fusion = {};

        semantique.forEach(function(r){
            fusion[r.numero] = {
                ...r,
                score: r.score * 0.6
            };
        });

        vectoriel.forEach(function(r){

            if(fusion[r.numero]){

                fusion[r.numero].score += r.scoreFinal * 0.4;

            } else {

                fusion[r.numero] = {
                    numero: r.numero,
                    document: r.document,
                    score: r.scoreFinal * 0.4
                };

            }

        });

        resultats = Object.values(fusion);
    }

    return resultats.sort(function(a, b){
        return b.score - a.score;
    }).slice(0, options.limit || 10);
}

/*=========================================================
FILTRAGE INTELLIGENT (JURIDIQUE)
=========================================================*/

function filtrerDocumentsJuridique(resultats, options = {}){

    let filtres = resultats;

    if(options.numero){

        filtres = filtres.filter(function(r){
            return String(r.numero) === String(options.numero);
        });

    }

    if(options.motsCles){

        filtres = filtres.filter(function(r){

            return options.motsCles.some(function(mot){
                return (r.document.contenu || "")
                    .toLowerCase()
                    .includes(mot.toLowerCase());
            });

        });

    }

    if(options.titre){

        filtres = filtres.filter(function(r){
            return (r.document.titre || "")
                .toLowerCase()
                .includes(options.titre.toLowerCase());
        });

    }

    return filtres;
}

/*=========================================================
EXPLICATION DU SCORE (INTERPRÉTABILITÉ IA)
=========================================================*/

function expliquerScore(query, vecteur){

    const score = scoreDocumentVectoriel(query, vecteur);

    return {
        query: query,
        document: vecteur.numero,
        details: {
            similariteTexte: score.scoreTexte,
            influenceLongueur: score.scoreLongueur,
            scoreFinal: score.scoreFinal
        },
        interpretation: score.scoreFinal > 0.7 ?
            "Très pertinent" :
            score.scoreFinal > 0.4 ?
            "Pertinent" :
            "Faiblement pertinent"
    };
}

/*=========================================================
DEBUG RECHERCHE SÉMANTIQUE
=========================================================*/

function debugRechercheSemantique(query){

    const resultats = rechercheIntelligente(query);

    console.group("=== DEBUG RECHERCHE SÉMANTIQUE ===");
    console.log("Query :", query);

    resultats.forEach(function(r, i){

        console.log("\n#" + (i + 1));
        console.log("Numéro :", r.numero);
        console.log("Score :", r.score.toFixed(4));
        console.log("Titre :", r.document.titre || "Sans titre");

    });

    console.groupEnd();

    return resultats;
}

/*=========================================================
INITIALISATION
=========================================================*/

console.log("Recherche sémantique avancée chargée.");

"use strict";

/*=========================================================
FACTEURS DE CLASSEMENT
=========================================================*/

const FacteursRanking = {

    pertinenceTexte: 0.40,
    pertinenceSemantique: 0.30,
    presenceMotsCles: 0.15,
    longueurDocument: 0.05,
    precisionNumero: 0.05,
    bonusExactMatch: 0.05

};

/*=========================================================
CALCUL DU SCORE DE RANKING GLOBAL
=========================================================*/

function calculerRanking(query, vecteur){

    const scoreBase = scoreDocumentVectoriel(query, vecteur);

    const motsQuery = decouperVector(query);
    const motsDoc = vecteur.mots || [];

    /*=====================================================
    1. PERTINENCE TEXTE
    =====================================================*/
    const scoreTexte = scoreBase.scoreTexte;

    /*=====================================================
    2. PERTINENCE SÉMANTIQUE (simple approximation)
    =====================================================*/
    let scoreSemantique = 0;

    motsQuery.forEach(function(mot){
        if(motsDoc.includes(mot)){
            scoreSemantique += 1;
        }
    });

    scoreSemantique = scoreSemantique / (motsQuery.length || 1);

    /*=====================================================
    3. Mots-clés juridiques
    =====================================================*/
    const motsClesScore = vecteur.document.motsCles
        ? vecteur.document.motsCles.length / 10
        : 0;

    /*=====================================================
    4. Longueur du document (normalisation)
    =====================================================*/
    const longueurScore = Math.min(vecteur.taille / 120, 1);

    /*=====================================================
    5. Match exact numéro/article
    =====================================================*/
    const matchNumero = query === String(vecteur.numero) ? 1 : 0;

    /*=====================================================
    6. BONUS EXACT MATCH TEXTE
    =====================================================*/
    const contenu = (vecteur.document.contenu || "").toLowerCase();

    let exactMatch = 0;

    motsQuery.forEach(function(mot){
        if(contenu.includes(mot)){
            exactMatch += 0.1;
        }
    });

    exactMatch = Math.min(exactMatch, 1);

    /*=====================================================
    SCORE FINAL PONDÉRÉ
    =====================================================*/
    const scoreFinal =

        (scoreTexte * FacteursRanking.pertinenceTexte) +
        (scoreSemantique * FacteursRanking.pertinenceSemantique) +
        (motsClesScore * FacteursRanking.presenceMotsCles) +
        (longueurScore * FacteursRanking.longueurDocument) +
        (matchNumero * FacteursRanking.precisionNumero) +
        (exactMatch * FacteursRanking.bonusExactMatch);

    return {
        scoreFinal,
        scoreTexte,
        scoreSemantique,
        motsClesScore,
        longueurScore,
        matchNumero,
        exactMatch
    };
}

/*=========================================================
RANKING GLOBAL DE TOUS LES DOCUMENTS
=========================================================*/

function rankingGlobal(query){

    const resultats = [];

    VecteursSemantiques.forEach(function(vecteur){

        const score = calculerRanking(query, vecteur);

        resultats.push({
            numero: vecteur.numero,
            document: vecteur.document,
            score: score.scoreFinal,
            details: score
        });

    });

    return resultats.sort(function(a, b){
        return b.score - a.score;
    });
}

/*=========================================================
TOP RANKING
=========================================================*/

function topRanking(query, limite = 10){

    return rankingGlobal(query).slice(0, limite);

}

/*=========================================================
BOOSTING JURIDIQUE (LOIS IMPORTANTES)
=========================================================*/

function boosterJuridique(resultats){

    return resultats.map(function(r){

        let boost = 0;

        const titre = (r.document.titre || "").toLowerCase();

        /* Lois importantes */
        if(
            titre.includes("constitution") ||
            titre.includes("code du travail") ||
            titre.includes("code pénal")
        ){
            boost += 0.2;
        }

        /* Articles courts prioritaires */
        if((r.document.contenu || "").length < 500){
            boost += 0.05;
        }

        return {
            ...r,
            score: r.score + boost
        };

    }).sort(function(a, b){
        return b.score - a.score;
    });
}

/*=========================================================
PÉNALITÉ DE BRUIT (DOCUMENTS PEU PERTINENTS)
=========================================================*/

function penaliserBruit(resultats, query){

    const motsQuery = decouperVector(query);

    return resultats.map(function(r){

        const motsDoc = r.document.contenu || "";

        let bruit = 0;

        motsQuery.forEach(function(mot){

            if(!motsDoc.toLowerCase().includes(mot)){
                bruit += 0.05;
            }

        });

        const scoreFinal = Math.max(r.score - bruit, 0);

        return {
            ...r,
            score: scoreFinal
        };

    });
}

/*=========================================================
RANKING FINAL OPTIMISÉ
=========================================================*/

function rankingFinal(query, options = {}){

    let resultats = rankingGlobal(query);

    /* BOOST JURIDIQUE */
    if(options.boost !== false){
        resultats = boosterJuridique(resultats);
    }

    /* PÉNALITÉ DE BRUIT */
    if(options.noisePenalty !== false){
        resultats = penaliserBruit(resultats, query);
    }

    /* TRI FINAL */
    resultats.sort(function(a, b){
        return b.score - a.score;
    });

    return resultats.slice(0, options.limit || 10);
}

/*=========================================================
NORMALISATION DU RANKING
=========================================================*/

function normaliserRanking(resultats){

    if(resultats.length === 0){
        return [];
    }

    const max = resultats[0].score;

    return resultats.map(function(r){
        return {
            ...r,
            scoreNormalise: r.score / (max || 1)
        };
    });

}

/*=========================================================
DEBUG RANKING
=========================================================*/

function debugRanking(query){

    const resultats = rankingFinal(query);

    console.group("=== DEBUG RANKING INTELLIGENT ===");
    console.log("Query :", query);

    resultats.forEach(function(r, i){

        console.log("\n#" + (i + 1));
        console.log("Numéro :", r.numero);
        console.log("Score final :", r.score.toFixed(4));
        console.log("Titre :", r.document.titre || "Sans titre");

    });

    console.groupEnd();

    return resultats;
}

/*=========================================================
INITIALISATION
=========================================================*/

console.log("Ranking intelligent chargé.");

"use strict";

/*=========================================================
CACHE GLOBAL
=========================================================*/

const CacheVector = {

    requetes: new Map(),

    vecteurs: new Map(),

    rankings: new Map(),

    maxCache: 100

};

/*=========================================================
HASH SIMPLE DE REQUÊTE
=========================================================*/

function hashRequete(query){

    let hash = 0;

    const str = String(query);

    for(let i = 0; i < str.length; i++){

        hash = ((hash << 5) - hash) + str.charCodeAt(i);

        hash = hash & hash;

    }

    return hash;

}

/*=========================================================
CACHE DES VECTEURS
=========================================================*/

function getVecteurCache(numero){

    if(CacheVector.vecteurs.has(numero)){

        return CacheVector.vecteurs.get(numero);

    }

    const vecteur = obtenirVecteurNumero(numero);

    if(vecteur){

        CacheVector.vecteurs.set(numero, vecteur);

    }

    return vecteur;

}

/*=========================================================
CACHE DES REQUÊTES (RESULTATS COMPLETS)
=========================================================*/

function getCacheRequete(query){

    const key = hashRequete(query);

    if(CacheVector.requetes.has(key)){

        return CacheVector.requetes.get(key);

    }

    return null;

}

/*=========================================================
STOCKER CACHE REQUÊTE
=========================================================*/

function setCacheRequete(query, resultats){

    const key = hashRequete(query);

    if(CacheVector.requetes.size >= CacheVector.maxCache){

        /* suppression du plus ancien */
        const firstKey = CacheVector.requetes.keys().next().value;

        CacheVector.requetes.delete(firstKey);

    }

    CacheVector.requetes.set(key, {

        query: query,

        resultats: resultats,

        timestamp: Date.now()

    });

}

/*=========================================================
CACHE DES RANKINGS
=========================================================*/

function getCacheRanking(query){

    const key = hashRequete(query);

    return CacheVector.rankings.get(key) || null;

}

function setCacheRanking(query, resultats){

    const key = hashRequete(query);

    CacheVector.rankings.set(key, resultats);

}

/*=========================================================
RECHERCHE OPTIMISÉE AVEC CACHE
=========================================================*/

function rechercheOptimisee(query, options = {}){

    /*=====================================================
    1. CACHE HIT
    =====================================================*/
    const cache = getCacheRequete(query);

    if(cache){

        return cache.resultats;

    }

    /*=====================================================
    2. CALCUL NORMAL
    =====================================================*/
    const resultats = rankingFinal(query, options);

    /*=====================================================
    3. STOCKAGE CACHE
    =====================================================*/
    setCacheRequete(query, resultats);

    return resultats;
}

/*=========================================================
PRÉ-INDEXATION (OPTIMISATION LOURDE)
=========================================================*/

function preIndexationCache(){

    console.log("Pré-indexation en cours...");

    const motsClesFrequent = [

        "travail",
        "contrat",
        "licenciement",
        "salaire",
        "loi",
        "article",
        "code"

    ];

    motsClesFrequent.forEach(function(mot){

        const resultats = rankingFinal(mot, {limit: 10});

        setCacheRequete(mot, resultats);

    });

    console.log("Pré-indexation terminée.");

}

/*=========================================================
OPTIMISATION DES VECTEURS
=========================================================*/

function optimiserVecteurs(){

    console.log("Optimisation des vecteurs...");

    VecteursSemantiques.forEach(function(v){

        if(!v.vecteur){

            v.vecteur = {};

        }

        /* normalisation légère */
        const keys = Object.keys(v.vecteur);

        keys.forEach(function(k){

            if(v.vecteur[k] === 1){

                v.vecteur[k] = 1;

            }

        });

    });

    console.log("Optimisation terminée.");

}

/*=========================================================
NETTOYAGE DU CACHE
=========================================================*/

function nettoyerCache(){

    CacheVector.requetes.clear();

    CacheVector.rankings.clear();

    console.log("Cache vidé.");

}

/*=========================================================
STATS CACHE
=========================================================*/

function statsCache(){

    return {

        requetes: CacheVector.requetes.size,

        rankings: CacheVector.rankings.size,

        vecteurs: CacheVector.vecteurs.size,

        max: CacheVector.maxCache

    };

}

/*=========================================================
CACHE DEBUG
=========================================================*/

function debugCache(){

    console.group("=== DEBUG CACHE VECTOR ===");

    console.log("Requêtes en cache :", CacheVector.requetes.size);

    console.log("Rankings en cache :", CacheVector.rankings.size);

    console.log("Vecteurs en cache :", CacheVector.vecteurs.size);

    console.groupEnd();

}

/*=========================================================
INITIALISATION
=========================================================*/

console.log("Optimisation et cache chargés.");

"use strict";

/*=========================================================
PIPELINE GLOBAL IA
=========================================================*/

/**
 * Pipeline principal unifié :
 * 1. normalisation
 * 2. expansion sémantique
 * 3. recherche vectorielle
 * 4. ranking
 * 5. cache
 */
function search(query, options = {}){

    if(!query || query.trim() === ""){
        return [];
    }

    const mode = options.mode || "auto";

    let resultats = [];

    /*=====================================================
    MODE CACHE OPTIMISÉ
    =====================================================*/
    const cache = getCacheRequete(query);

    if(cache && options.ignoreCache !== true){
        return cache.resultats;
    }

    /*=====================================================
    MODE AUTO (INTELLIGENT)
    =====================================================*/
    if(mode === "auto"){

        resultats = rankingFinal(query, options);

    }

    /*=====================================================
    MODE SÉMANTIQUE PUR
    =====================================================*/
    else if(mode === "semantic"){

        resultats = rechercheSemantiqueAvancee(
            query,
            options.limit || VectorIA.maxResultats
        );

    }

    /*=====================================================
    MODE VECTORIEL PUR
    =====================================================*/
    else if(mode === "vector"){

        resultats = topRanking(
            query,
            options.limit || VectorIA.maxResultats
        );

    }

    /*=====================================================
    MODE HYBRIDE AVANCÉ
    =====================================================*/
    else if(mode === "hybrid"){

        const sem = rechercheSemantiqueAvancee(query, 5);
        const vec = topRanking(query, 5);

        const fusion = {};

        sem.forEach(function(r){
            fusion[r.numero] = {
                numero: r.numero,
                document: r.document,
                score: r.score * 0.6
            };
        });

        vec.forEach(function(r){

            if(fusion[r.numero]){
                fusion[r.numero].score += r.score * 0.4;
            }
            else{
                fusion[r.numero] = {
                    numero: r.numero,
                    document: r.document,
                    score: r.score * 0.4
                };
            }

        });

        resultats = Object.values(fusion);

    }

    /*=====================================================
    FILTRAGE FINAL
    =====================================================*/
    if(options.filter){

        resultats = filtrerDocumentsJuridique(
            resultats,
            options.filter
        );

    }

    /*=====================================================
    LIMITATION
    =====================================================*/
    resultats = resultats.slice(0, options.limit || VectorIA.maxResultats);

    /*=====================================================
    CACHE RESULTATS
    =====================================================*/
    setCacheRequete(query, resultats);

    return resultats;
}

/*=========================================================
API PRINCIPALE INSPECTEURBOT
=========================================================*/

function inspecteurBotSearch(query, options = {}){

    const resultats = search(query, options);

    return {

        query: query,

        total: resultats.length,

        etat: etatVector,

        resultats: resultats

    };

}

/*=========================================================
INITIALISATION AUTOMATIQUE DU PIPELINE
=========================================================*/

function initialiserPipeline(){

    console.log("======================================");

    console.log("InspecteurBot IA");

    console.log("Pipeline VectorSearch actif");

    console.log("Version :", VectorIA.version);

    console.log("======================================");

}

/*=========================================================
CHARGEMENT GLOBAL
=========================================================*/

document.addEventListener("DOMContentLoaded", function(){

    initialiserPipeline();

});

/*=========================================================
DEBUG GLOBAL SYSTEM
=========================================================*/

function debugSystem(query){

    console.group("=== DEBUG INSPECTEURBOT IA ===");

    console.log("Query :", query);

    console.log("Etat :", etatVector);

    const res = search(query);

    console.log("Résultats :", res.length);

    console.groupEnd();

    return res;

}

/*=========================================================
STATISTIQUES GLOBALES IA
=========================================================*/

function statsIA(){

    return {

        version: VectorIA.version,

        documents: BaseVectorielle.length,

        index: IndexVectoriel.length,

        vecteurs: VecteursSemantiques.length,

        cache: statsCache(),

        etat: etatVector

    };

}

/*=========================================================
RESET GLOBAL SYSTEM
=========================================================*/

function resetSystem(){

    nettoyerCache();

    BaseVectorielle = [];

    IndexVectoriel = [];

    VecteursSemantiques = [];

    VectorIA.estCharge = false;

    definirEtatVector(EtatVector.PRET);

    console.log("Système réinitialisé.");

}

/*=========================================================
EXPORT FINAL (OPTIONNEL NODE JS)
=========================================================*/

if(typeof module !== "undefined"){

    module.exports = {

        search,

        inspecteurBotSearch,

        debugSystem,

        statsIA,

        resetSystem

    };

}

/*=========================================================
FIN PARTIE 9
=========================================================*/

console.log("Intégration système IA chargée.");

"use strict";

/*=========================================================
MODE PRODUCTION
=========================================================*/

const MODE_PRODUCTION = true;

/*=========================================================
VALIDATION GLOBALE
=========================================================*/

function validerSysteme(){

    const erreurs = [];

    if(!Array.isArray(BaseVectorielle)){
        erreurs.push("BaseVectorielle invalide");
    }

    if(!Array.isArray(IndexVectoriel)){
        erreurs.push("IndexVectoriel invalide");
    }

    if(!Array.isArray(VecteursSemantiques)){
        erreurs.push("VecteursSemantiques invalide");
    }

    if(typeof search !== "function"){
        erreurs.push("Fonction search manquante");
    }

    return {
        valide: erreurs.length === 0,
        erreurs: erreurs
    };

}

/*=========================================================
OPTIMISATION FINALE AUTOMATIQUE
=========================================================*/

function optimisationFinale(){

    console.log("Optimisation finale du système...");

    /* Nettoyage mémoire léger */
    if(CacheVector){

        const taille = CacheVector.requetes.size;

        if(taille > CacheVector.maxCache){

            nettoyerCache();

        }

    }

    /* Vérification vecteurs */
    if(VecteursSemantiques.length > 0){

        VecteursSemantiques.forEach(function(v){

            if(!v.vecteur){
                v.vecteur = {};
            }

        });

    }

    console.log("Optimisation terminée.");

}

/*=========================================================
SÉCURISATION DU PIPELINE
=========================================================*/

function securiserQuery(query){

    if(!query){
        return "";
    }

    return String(query)
        .replace(/</g, "")
        .replace(/>/g, "")
        .replace(/script/gi, "")
        .trim();

}

/*=========================================================
PIPELINE FINAL SÉCURISÉ
=========================================================*/

function searchSecure(query, options = {}){

    const safeQuery = securiserQuery(query);

    if(!safeQuery || safeQuery.length < 2){
        return [];
    }

    return search(safeQuery, options);

}

/*=========================================================
VERSION STABLE API
=========================================================*/

const VectorSearchAPI = {

    version: VectorIA.version,

    search: searchSecure,

    rawSearch: search,

    stats: statsIA,

    debug: debugSystem,

    reset: resetSystem,

    validate: validerSysteme

};

/*=========================================================
INITIALISATION PRODUCTION
=========================================================*/

function initialisationProduction(){

    console.log("======================================");

    console.log("INSPECTEURBOT IA");

    console.log("VECTORSEARCH.JS");

    console.log("VERSION", VectorIA.version);

    console.log("MODE PRODUCTION :", MODE_PRODUCTION);

    console.log("======================================");

    const validation = validerSysteme();

    if(!validation.valide){

        console.warn("Système non valide :", validation.erreurs);

    } else {

        console.log("Système validé avec succès.");

    }

    optimisationFinale();

}

/*=========================================================
HOOK GLOBAL DÉMARRAGE
=========================================================*/

document.addEventListener("DOMContentLoaded", function(){

    initialisationProduction();

});

/*=========================================================
EXPORT FINAL GLOBAL
=========================================================*/

if(typeof module !== "undefined"){

    module.exports = VectorSearchAPI;

}

/*=========================================================
FONCTION DE TEST FINAL
=========================================================*/

function testFinal(query = "travail contrat"){

    console.group("=== TEST FINAL INSPECTEURBOT IA ===");

    const resultats = searchSecure(query);

    console.log("Query :", query);

    console.log("Résultats :", resultats.length);

    console.groupEnd();

    return resultats;

}

/*=========================================================
FIN VERSION 4.0
=========================================================*/

console.log("VECTORSEARCH.JS VERSION 4.0 COMPLET ET PRODUCTION READY");



