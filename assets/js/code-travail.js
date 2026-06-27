/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 1
INITIALISATION GÉNÉRALE
Version 2.0
=========================================================*/

"use strict";

/*=========================================================
CONFIGURATION
=========================================================*/

const CodeTravail = {

    version: "2.0",

    nom: "InspecteurBot IA",

    pays: "République Démocratique du Congo",

    langue: "fr",

    auteur: "InspecteurBot IA",

    modeIA: true

};

/*=========================================================
BASES DE DONNÉES
=========================================================*/

let articles = [];

let articlesFiltres = [];

let favoris = [];

let historiqueRecherche = [];

let dernierArticle = null;

let derniereRecherche = "";

/*=========================================================
RÉFÉRENCES HTML
=========================================================*/

const interfaceCode = {

    recherche:

        document.getElementById("rechercheArticle"),

    resultat:

        document.getElementById("resultatsRecherche"),

    compteur:

        document.getElementById("nombreResultats"),

    categorie:

        document.getElementById("listeCategories"),

    contenu:

        document.getElementById("contenuArticle"),

    resume:

        document.getElementById("resumeIA"),

    explication:

        document.getElementById("explicationIA")

};

/*=========================================================
HORLOGE
=========================================================*/

function mettreAJourHorloge(){

    const maintenant = new Date();

    const heure = maintenant.toLocaleTimeString(

        "fr-FR",

        {

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit"

        }

    );

    const zone = document.getElementById("heureActuelle");

    if(zone){

        zone.textContent = heure;

    }

}

mettreAJourHorloge();

setInterval(

    mettreAJourHorloge,

    1000

);

/*=========================================================
NOTIFICATIONS
=========================================================*/

function notification(message,type="info"){

    console.log(

        "["+

        type.toUpperCase()+

        "] " +

        message

    );

}

/*=========================================================
CHARGEMENT
=========================================================*/

window.addEventListener(

    "load",

    function(){

        notification(

            "Module Code du Travail initialisé."

        );

        notification(

            "Initialisation de l'Assistant IA..."

        );

        notification(

            "Chargement des composants..."

        );

    }

);

console.log(

"=========================================="

);

console.log(

"InspecteurBot IA"

);

console.log(

"Module : Code du Travail"

);

console.log(

"Version : "+CodeTravail.version

);

console.log(

"Mode IA : ACTIVÉ"

);

console.log(

"=========================================="

);

/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 2
CHARGEMENT INTELLIGENT DES ARTICLES
=========================================================*/

/*=========================================================
CONFIGURATION DES DONNÉES
=========================================================*/

const BaseCodeTravail = {

    fichier: "data/code-travail.json",

    charge: false,

    totalArticles: 0,

    dateChargement: null

};

/*=========================================================
INDEX IA
=========================================================*/

let indexIA = new Map();

/*=========================================================
CHARGEMENT DU CODE DU TRAVAIL
=========================================================*/

async function chargerCodeTravail(){

    try{

        notification(

            "Chargement du Code du Travail..."

        );

        const reponse = await fetch(

            BaseCodeTravail.fichier

        );

        if(!reponse.ok){

            throw new Error(

                "Impossible de charger la base de données."

            );

        }

        articles = await reponse.json();

        articlesFiltres = [...articles];

        BaseCodeTravail.totalArticles = articles.length;

        BaseCodeTravail.charge = true;

        BaseCodeTravail.dateChargement = new Date();

        indexerArticles();

        notification(

            articles.length+

            " articles chargés.",

            "success"

        );

        mettreAJourCompteur();

        afficherAccueil();

    }

    catch(erreur){

        console.error(erreur);

        notification(

            "Erreur de chargement du Code du Travail.",

            "error"

        );

    }

}

/*=========================================================
INDEXATION IA
=========================================================*/

function indexerArticles(){

    indexIA.clear();

    articles.forEach(function(article){

        const texte = (

            (article.numero || "") +

            " " +

            (article.titre || "") +

            " " +

            (article.contenu || "")

        ).toLowerCase();

        indexIA.set(

            article.numero,

            texte

        );

    });

}

/*=========================================================
MISE À JOUR DU COMPTEUR
=========================================================*/

function mettreAJourCompteur(){

    if(interfaceCode.compteur){

        interfaceCode.compteur.textContent =

            BaseCodeTravail.totalArticles+

            " articles";

    }

}

/*=========================================================
PAGE D'ACCUEIL
=========================================================*/

function afficherAccueil(){

    if(!interfaceCode.resultat){

        return;

    }

    interfaceCode.resultat.innerHTML =

    `
    <div class="accueil-code">

        <h2>
            Code du Travail RDC
        </h2>

        <p>

            ${BaseCodeTravail.totalArticles}

            articles disponibles.

        </p>

        <p>

            Utilisez la recherche intelligente
            d'InspecteurBot IA pour trouver
            rapidement un article.

        </p>

    </div>

    `;

}

/*=========================================================
VÉRIFICATION
=========================================================*/

function baseChargee(){

    return BaseCodeTravail.charge;

}

/*=========================================================
DÉMARRAGE
=========================================================*/

window.addEventListener(

    "load",

    function(){

        chargerCodeTravail();

    }

);

/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 3
MOTEUR DE RECHERCHE IA
=========================================================*/

/*=========================================================
DICTIONNAIRE IA
=========================================================*/

const dictionnaireIA = {

    licenciement : [
        "licenciement",
        "renvoi",
        "rupture",
        "préavis",
        "faute lourde",
        "résiliation"
    ],

    salaire : [
        "salaire",
        "rémunération",
        "prime",
        "indemnité",
        "paie"
    ],

    contrat : [
        "contrat",
        "engagement",
        "cdd",
        "cdi",
        "clause"
    ],

    femme : [
        "grossesse",
        "maternité",
        "femme",
        "enceinte"
    ],

    congé : [
        "congé",
        "vacances",
        "repos",
        "permission"
    ],

    apprentissage : [
        "apprenti",
        "apprentissage",
        "maître",
        "formation"
    ]

};

/*=========================================================
NORMALISATION
=========================================================*/

function nettoyerTexte(texte){

    return texte
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"")
        .trim();

}

/*=========================================================
CALCUL DE PERTINENCE
=========================================================*/

function calculerScore(article,recherche){

    let score = 0;

    const texte = nettoyerTexte(

        JSON.stringify(article)

    );

    recherche.forEach(function(mot){

        if(texte.includes(mot)){

            score += 10;

        }

    });

    return score;

}

/*=========================================================
EXTENSION IA
=========================================================*/

function developperRecherche(texte){

    let liste = [];

    texte = nettoyerTexte(texte);

    liste.push(texte);

    Object.keys(dictionnaireIA).forEach(function(cle){

        dictionnaireIA[cle].forEach(function(mot){

            if(texte.includes(mot)){

                liste = liste.concat(

                    dictionnaireIA[cle]

                );

            }

        });

    });

    return [...new Set(liste)];

}

/*=========================================================
RECHERCHE IA
=========================================================*/

function rechercheIA(question){

    if(!baseChargee()){

        notification(

            "Base du Code du Travail non chargée.",

            "error"

        );

        return;

    }

    derniereRecherche = question;

    historiqueRecherche.push(question);

    const mots = developperRecherche(question);

    let resultat = [];

    articles.forEach(function(article){

        const score = calculerScore(

            article,

            mots

        );

        if(score>0){

            article.scoreIA = score;

            resultat.push(article);

        }

    });

    resultat.sort(function(a,b){

        return b.scoreIA-a.scoreIA;

    });

    articlesFiltres = resultat;

    afficherArticles(resultat);

        }

/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 4
AFFICHAGE DES ARTICLES
=========================================================*/

/*=========================================================
AFFICHAGE PRINCIPAL
=========================================================*/

function afficherArticles(liste){

    if(!interfaceCode.resultat){

        return;

    }

    interfaceCode.resultat.innerHTML="";

    if(liste.length===0){

        interfaceCode.resultat.innerHTML=

        `
        <div class="aucun-resultat">

            <h2>Aucun résultat trouvé</h2>

            <p>

                Essayez un autre mot-clé.

            </p>

        </div>
        `;

        return;

    }

    liste.forEach(function(article){

        interfaceCode.resultat.appendChild(

            creerCarteArticle(article)

        );

    });

    mettreAJourCompteur();

}

/*=========================================================
CRÉATION D'UNE CARTE
=========================================================*/

function creerCarteArticle(article){

    const carte=document.createElement("div");

    carte.className="carte-article";

    carte.dataset.numero=article.numero;

    carte.innerHTML=

    `

    <div class="entete-article">

        <span class="numero">

            Article ${article.numero}

        </span>

        <span class="score">

            IA : ${article.scoreIA || 100} %

        </span>

    </div>

    <h3>

        ${article.titre}

    </h3>

    <p>

        ${article.contenu}

    </p>

    <div class="actions">

        <button
            onclick="ouvrirArticle('${article.numero}')">

            Lire

        </button>

        <button
            onclick="ajouterFavori('${article.numero}')">

            Favori

        </button>

        <button
            onclick="copierArticle('${article.numero}')">

            Copier

        </button>

        <button
            onclick="imprimerArticle('${article.numero}')">

            Imprimer

        </button>

        <button
            onclick="resumeIA('${article.numero}')">

            Résumé IA

        </button>

        <button
            onclick="expliquerArticle('${article.numero}')">

            Expliquer IA

        </button>

    </div>

    `;

    return carte;

}

/*=========================================================
OUVRIR UN ARTICLE
=========================================================*/

function ouvrirArticle(numero){

    const article=

    articles.find(function(a){

        return String(a.numero)===String(numero);

    });

    if(!article){

        return;

    }

    dernierArticle=article;

    notification(

        "Article "+numero+" ouvert.",

        "success"

    );

}

/*=========================================================
MISE À JOUR DU COMPTEUR
=========================================================*/

function mettreAJourCompteur(){

    if(interfaceCode.compteur){

        interfaceCode.compteur.textContent=

        articlesFiltres.length+

        " résultat(s)";

    }

}

/*=========================================================
DÉFILEMENT AUTOMATIQUE
=========================================================*/

function allerAuxResultats(){

    if(interfaceCode.resultat){

        interfaceCode.resultat.scrollIntoView({

            behavior:"smooth"

        });

    }

}

/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 5
FAVORIS - HISTORIQUE - SAUVEGARDE
=========================================================*/

/*=========================================================
CHARGER LES FAVORIS
=========================================================*/

function chargerFavoris(){

    const donnees = localStorage.getItem("IBIA_FAVORIS");

    if(donnees){

        favoris = JSON.parse(donnees);

    }

}

/*=========================================================
SAUVEGARDER LES FAVORIS
=========================================================*/

function sauvegarderFavoris(){

    localStorage.setItem(

        "IBIA_FAVORIS",

        JSON.stringify(favoris)

    );

}

/*=========================================================
AJOUTER AUX FAVORIS
=========================================================*/

function ajouterFavori(numero){

    if(favoris.includes(numero)){

        notification(

            "Article déjà dans les favoris."

        );

        return;

    }

    favoris.push(numero);

    sauvegarderFavoris();

    notification(

        "Article "+numero+

        " ajouté aux favoris.",

        "success"

    );

}

/*=========================================================
SUPPRIMER UN FAVORI
=========================================================*/

function supprimerFavori(numero){

    favoris = favoris.filter(function(item){

        return item != numero;

    });

    sauvegarderFavoris();

    notification(

        "Favori supprimé."

    );

}

/*=========================================================
AFFICHER LES FAVORIS
=========================================================*/

function afficherFavoris(){

    const liste = articles.filter(function(article){

        return favoris.includes(

            String(article.numero)

        );

    });

    articlesFiltres = liste;

    afficherArticles(liste);

}

/*=========================================================
SAUVEGARDE HISTORIQUE
=========================================================*/

function sauvegarderHistorique(){

    localStorage.setItem(

        "IBIA_HISTORIQUE",

        JSON.stringify(

            historiqueRecherche

        )

    );

}

/*=========================================================
CHARGER HISTORIQUE
=========================================================*/

function chargerHistorique(){

    const donnees = localStorage.getItem(

        "IBIA_HISTORIQUE"

    );

    if(donnees){

        historiqueRecherche =

        JSON.parse(donnees);

    }

}

/*=========================================================
AJOUT HISTORIQUE
=========================================================*/

function ajouterHistorique(texte){

    if(

        texte.trim()===""

    ){

        return;

    }

    historiqueRecherche.unshift(

        texte

    );

    historiqueRecherche =

    historiqueRecherche.slice(

        0,

        20

    );

    sauvegarderHistorique();

}

/*=========================================================
VIDER HISTORIQUE
=========================================================*/

function viderHistorique(){

    historiqueRecherche=[];

    sauvegarderHistorique();

    notification(

        "Historique vidé."

    );

}

/*=========================================================
INITIALISATION
=========================================================*/

chargerFavoris();

chargerHistorique();

/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 6
ASSISTANT IA JURIDIQUE
=========================================================*/

/*=========================================================
ANALYSE DE LA QUESTION
=========================================================*/

function analyserQuestionIA(question){

    if(!question){

        return;

    }

    question = nettoyerTexte(question);

    rechercheIA(question);

    genererReponseIA(question);

}

/*=========================================================
GÉNÉRATION DE LA RÉPONSE
=========================================================*/

function genererReponseIA(question){

    if(!interfaceCode.resume){

        return;

    }

    if(articlesFiltres.length===0){

        interfaceCode.resume.innerHTML=

        `
        <div class="ia-message">

            Aucun article du Code du Travail
            ne correspond à votre question.

        </div>
        `;

        return;

    }

    let article = articlesFiltres[0];

    interfaceCode.resume.innerHTML=

    `

    <div class="ia-message">

        <h3>

            Réponse d'InspecteurBot IA

        </h3>

        <p>

            Votre question concerne :

            <strong>

            ${question}

            </strong>

        </p>

        <p>

            L'article le plus pertinent est

            l'Article

            <strong>

            ${article.numero}

            </strong>

            intitulé

            <strong>

            ${article.titre}

            </strong>.

        </p>

        <p>

            Consultez également les autres

            articles proposés ci-dessous.

        </p>

    </div>

    `;

}

/*=========================================================
EXPLICATION SIMPLE
=========================================================*/

function expliquerArticle(numero){

    const article = articles.find(function(a){

        return String(a.numero)===String(numero);

    });

    if(!article){

        return;

    }

    if(!interfaceCode.explication){

        return;

    }

    interfaceCode.explication.innerHTML=

    `

    <div class="explication-ia">

        <h3>

            Explication IA

        </h3>

        <p>

            Cet article traite principalement de

            <strong>

            ${article.titre}

            </strong>.

        </p>

        <p>

            En langage simple,

            cet article fixe les règles que

            doivent respecter les travailleurs

            et les employeurs concernant

            ce sujet.

        </p>

    </div>

    `;

}

/*=========================================================
RÉSUMÉ IA
=========================================================*/

function resumeIA(numero){

    const article = articles.find(function(a){

        return String(a.numero)===String(numero);

    });

    if(!article){

        return;

    }

    if(!interfaceCode.resume){

        return;

    }

    interfaceCode.resume.innerHTML=

    `

    <div class="resume-ia">

        <h3>

            Résumé IA

        </h3>

        <p>

            ${article.contenu.substring(0,400)}...

        </p>

    </div>

    `;

}

/*=========================================================
LANCER L'ASSISTANT IA
=========================================================*/

function lancerAssistantIA(){

    if(!interfaceCode.recherche){

        return;

    }

    const question=

    interfaceCode.recherche.value;

    analyserQuestionIA(question);

}

/*=========================================================
TOUCHE ENTRÉE
=========================================================*/

if(interfaceCode.recherche){

    interfaceCode.recherche.addEventListener(

        "keydown",

        function(e){

            if(e.key==="Enter"){

                lancerAssistantIA();

            }

        }

    );

}

console.log(

"Assistant IA juridique activé."

);

/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 7
COPIE - IMPRESSION - PARTAGE - EXPORT
=========================================================*/

/*=========================================================
COPIER UN ARTICLE
=========================================================*/

async function copierArticle(numero){

    const article = articles.find(function(a){

        return String(a.numero)===String(numero);

    });

    if(!article){

        notification("Article introuvable.","error");

        return;

    }

    const texte =

`Code du Travail RDC

Article ${article.numero}

${article.titre}

${article.contenu}`;

    try{

        await navigator.clipboard.writeText(texte);

        notification(

            "Article copié dans le presse-papiers.",

            "success"

        );

    }

    catch(e){

        notification(

            "Impossible de copier l'article.",

            "error"

        );

    }

}

/*=========================================================
IMPRESSION
=========================================================*/

function imprimerArticle(numero){

    const article = articles.find(function(a){

        return String(a.numero)===String(numero);

    });

    if(!article){

        return;

    }

    const fenetre = window.open("","PRINT");

    fenetre.document.write(

    `

    <html>

    <head>

        <title>

        Article ${article.numero}

        </title>

    </head>

    <body>

        <h2>

        Code du Travail RDC

        </h2>

        <h3>

        Article ${article.numero}

        </h3>

        <h4>

        ${article.titre}

        </h4>

        <p>

        ${article.contenu}

        </p>

    </body>

    </html>

    `

    );

    fenetre.document.close();

    fenetre.focus();

    fenetre.print();

    fenetre.close();

}

/*=========================================================
PARTAGE
=========================================================*/

async function partagerArticle(numero){

    const article = articles.find(function(a){

        return String(a.numero)===String(numero);

    });

    if(!article){

        return;

    }

    if(navigator.share){

        try{

            await navigator.share({

                title:

                "Article "+article.numero,

                text:

                article.titre+

                "\n\n"+

                article.contenu

            });

        }

        catch(e){

            console.log(e);

        }

    }

    else{

        copierArticle(numero);

    }

}

/*=========================================================
EXPORT PDF
=========================================================*/

function exporterPDF(numero){

    notification(

        "Le module PDF sera activé après l'intégration de jsPDF.",

        "info"

    );

}

/*=========================================================
APERÇU
=========================================================*/

function apercuArticle(numero){

    ouvrirArticle(numero);

    allerAuxResultats();

}

console.log(

"Module Impression / Copie / Partage chargé."

);

/*=========================================================
INSPECTEURBOT IA
MODULE CODE DU TRAVAIL
PARTIE 8
MODE INSPECTEUR IA
=========================================================*/

/*=========================================================
MOTS VIDES
=========================================================*/

const motsVides = [

    "le","la","les","un","une","des",

    "de","du","dans","sur","pour",

    "avec","par","et","ou","au","aux",

    "je","tu","il","elle","nous","vous",

    "ils","elles","mon","ma","mes"

];

/*=========================================================
EXTRACTION DES MOTS IMPORTANTS
=========================================================*/

function extraireMotsImportants(texte){

    return nettoyerTexte(texte)

    .split(" ")

    .filter(function(mot){

        return mot.length>2 &&

        !motsVides.includes(mot);

    });

}

/*=========================================================
ANALYSE DE LA SITUATION
=========================================================*/

function analyserSituation(texte){

    if(!texte){

        notification(

            "Veuillez saisir une situation.",

            "error"

        );

        return;

    }

    const mots =

    extraireMotsImportants(texte);

    rechercheIA(

        mots.join(" ")

    );

    genererAnalyseIA(

        texte,

        mots

    );

}

/*=========================================================
GÉNÉRATION DE L'ANALYSE
=========================================================*/

function genererAnalyseIA(texte,mots){

    if(!interfaceCode.resume){

        return;

    }

    interfaceCode.resume.innerHTML =

    `

    <div class="analyse-ia">

        <h2>

            Analyse InspecteurBot IA

        </h2>

        <p>

            Situation analysée :

        </p>

        <blockquote>

            ${texte}

        </blockquote>

        <p>

            Mots-clés détectés :

            <strong>

            ${mots.join(", ")}

            </strong>

        </p>

        <p>

            Les articles affichés ci-dessous

            sont les plus pertinents pour

            cette situation.

        </p>

    </div>

    `;

}

/*=========================================================
SUGGESTIONS IA
=========================================================*/

function suggestionsIA(){

    return [

        "Licenciement",

        "Contrat",

        "Congé",

        "Salaire",

        "Faute lourde",

        "Préavis",

        "Temps de travail",

        "Accident du travail",

        "Apprentissage",

        "Discipline"

    ];

}

/*=========================================================
AFFICHER LES SUGGESTIONS
=========================================================*/

function afficherSuggestions(){

    console.log(

        suggestionsIA()

    );

}

console.log(

"Mode Inspecteur IA chargé."

);



    
