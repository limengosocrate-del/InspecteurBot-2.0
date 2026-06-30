/*=========================================================
 INSPECTEURBOT IA RDC
 MODULE : CODE DU TRAVAIL
 Version : 3.0 Professionnelle
 Développeur : InspecteurBot IA
 Compatible : Android - iPhone - iPad - PC
=========================================================*/

"use strict";

/*=========================================================
 CONFIGURATION GÉNÉRALE
=========================================================*/

const APP = {

    nom: "InspecteurBot IA",

    version: "3.0",

    pays: "République Démocratique du Congo",

    langue: "fr",

    auteur: "InspecteurBot IA",

    json: "assets/data/code-travail.json",

    theme: "light",

    modeIA: true,

    debug: true

};

/*=========================================================
 BASE DE DONNÉES
=========================================================*/

let articles = [];
let articlesFiltres = [];
let favoris = [];
let historiqueRecherche = [];
let dernierArticle = null;
let derniereRecherche = "";

/*=========================================================
 ÉTAT DE L'APPLICATION
=========================================================*/

const Etat = {

    charge: false,

    totalArticles: 0,

    dateChargement: null,

    rechercheEnCours: false

};

/*=========================================================
 ÉLÉMENTS HTML
=========================================================*/

const UI = {

    recherche: document.getElementById("rechercheArticle"),

    boutonRecherche: document.getElementById("btnRecherche"),

    resultat: document.getElementById("zoneIA"),

    compteur: null,

    contenu: document.getElementById("contenuArticle"),

    numero: document.getElementById("numeroArticle"),

    titre: document.getElementById("titreArticle"),

    resume: document.getElementById("reponseIA"),

    explication: document.getElementById("reponseIA"),

    heure: document.getElementById("clock"),

    theme: document.getElementById("themeToggle"),

    themeIcon: document.getElementById("themeIcon")

};

/*=========================================================
 NOTIFICATIONS
=========================================================*/

function notifier(message,type="info"){

    console.log(

        "["+type.toUpperCase()+"]",

        message

    );

}

/*=========================================================
 HORLOGE TEMPS RÉEL
=========================================================*/

function mettreAJourHorloge(){

    if(!UI.heure) return;

    UI.heure.textContent =

    new Date().toLocaleTimeString(

        "fr-FR",

        {

            hour:"2-digit",

            minute:"2-digit",

            second:"2-digit"

        }

    );

}

setInterval(

    mettreAJourHorloge,

    1000

);

mettreAJourHorloge();

/*=========================================================
 INITIALISATION
=========================================================*/

window.addEventListener(

    "DOMContentLoaded",

    function(){

        notifier(

            APP.nom+

            " "+

            APP.version+

            " démarré.",

            "success"

        );

    }

);

console.log(

"===================================="

);

console.log(APP.nom);

console.log("Version :",APP.version);

console.log("Mode IA :",APP.modeIA);

console.log("====================================");

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 2
 CHARGEMENT INTELLIGENT DU CODE DU TRAVAIL
=========================================================*/

/*=========================================================
 CHARGEMENT DE LA BASE JURIDIQUE
=========================================================*/

async function chargerBaseJuridique(){

    try{

        notifier("Chargement du Code du Travail...","info");

        if(window.rag){

            articles = await window.rag.charger();

        }else{

            const reponse = await fetch(APP.json);

            if(!reponse.ok){

                throw new Error("Impossible de charger le fichier JSON.");

            }

            articles = await reponse.json();

        }

        if(!Array.isArray(articles)){

            throw new Error("Base juridique invalide.");

        }

        articlesFiltres = [...articles];

        Etat.charge = true;

        Etat.totalArticles = articles.length;

        Etat.dateChargement = new Date();

        mettreAJourCompteur();

        afficherMessageAccueil();

        notifier(

            Etat.totalArticles+

            " articles chargés avec succès.",

            "success"

        );

    }

    catch(erreur){

        console.error(erreur);

        notifier(

            "Erreur lors du chargement du Code du Travail.",

            "error"

        );

        afficherErreurChargement();

    }

}

/*=========================================================
 COMPTEUR
=========================================================*/

function mettreAJourCompteur(){

    if(!UI.compteur){

        return;

    }

    UI.compteur.textContent =

        Etat.totalArticles+

        " articles disponibles";

}

/*=========================================================
 PAGE D'ACCUEIL
=========================================================*/

function afficherMessageAccueil(){

    if(!UI.resultat){

        return;

    }

    UI.resultat.innerHTML = `

    <div class="accueil-code">

        <h2>

            ⚖️ InspecteurBot IA

        </h2>

        <p>

            Base juridique chargée avec succès.

        </p>

        <p>

            <strong>${Etat.totalArticles}</strong>

            articles du Code du Travail sont disponibles.

        </p>

        <p>

            Saisissez un numéro d'article,

            un mot-clé ou une question juridique.

        </p>

    </div>

    `;

}

/*=========================================================
 ERREUR DE CHARGEMENT
=========================================================*/

function afficherErreurChargement(){

    if(!UI.resultat){

        return;

    }

    UI.resultat.innerHTML = `

    <div class="erreur-base">

        <h2>

            ❌ Erreur

        </h2>

        <p>

            Impossible de charger le Code du Travail.

        </p>

        <p>

            Vérifiez le fichier :

            <strong>

            ${APP.json}

            </strong>

        </p>

    </div>

    `;

}

/*=========================================================
 VÉRIFICATION
=========================================================*/

function baseChargee(){

    return Etat.charge;

}

/*=========================================================
 DÉMARRAGE AUTOMATIQUE
=========================================================*/

window.addEventListener(

    "DOMContentLoaded",

    async function(){

        await chargerBaseJuridique();

    }

);

console.log("✅ Partie 2 chargée.");

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 3
 MOTEUR DE RECHERCHE IA
 Version 3.0
=========================================================*/

/*=========================================================
 DICTIONNAIRE DES SYNONYMES
=========================================================*/

const DictionnaireIA={

    licenciement:[
        "licenciement",
        "renvoi",
        "rupture",
        "préavis",
        "congédiement"
    ],

    salaire:[
        "salaire",
        "paie",
        "prime",
        "indemnité",
        "rémunération"
    ],

    contrat:[
        "contrat",
        "cdi",
        "cdd",
        "engagement",
        "clause"
    ],

    conge:[
        "congé",
        "repos",
        "vacances",
        "permission"
    ],

    femme:[
        "grossesse",
        "maternité",
        "enceinte",
        "femme"
    ],

    accident:[
        "accident",
        "sécurité",
        "hygiène",
        "protection"
    ]

};

/*=========================================================
 NORMALISATION
=========================================================*/

function nettoyerTexte(texte){

    return String(texte||"")

    .toLowerCase()

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g,"")

    .replace(/[^\w\s]/g," ")

    .replace(/\s+/g," ")

    .trim();

}

/*=========================================================
 DÉVELOPPEMENT DE LA RECHERCHE
=========================================================*/

function developperRecherche(question){

    let mots=

    nettoyerTexte(question)

    .split(" ")

    .filter(m=>m.length>2);

    Object.values(DictionnaireIA)

    .forEach(liste=>{

        liste.forEach(mot=>{

            if(mots.includes(

                nettoyerTexte(mot)

            )){

                mots=[

                    ...mots,

                    ...liste

                ];

            }

        });

    });

    return [...new Set(mots)];

}

/*=========================================================
 RECHERCHE IA
=========================================================*/

async function rechercheIA(question){

    if(!question){

        return;

    }

    if(!Etat.charge){

        await chargerBaseJuridique();

    }

    derniereRecherche=question;

    historiqueRecherche.unshift(question);

    historiqueRecherche=

    historiqueRecherche.slice(0,30);

    const mots=

    developperRecherche(question);

    let resultat=[];

    if(window.vectorSearch){

        resultat=

        window.vectorSearch.rechercher(

            mots.join(" ")

        );

    }else{

        resultat=

        articles.filter(article=>{

            const texte=

            nettoyerTexte(

                JSON.stringify(article)

            );

            return mots.some(

                mot=>texte.includes(mot)

            );

        });

    }

    articlesFiltres=resultat;

    mettreAJourCompteurRecherche();

    afficherArticles(resultat);

    genererReponseIA(question);

    allerAuxResultats();

}

/*=========================================================
 COMPTEUR
=========================================================*/

function mettreAJourCompteurRecherche(){

    if(UI.compteur){

        UI.compteur.textContent=

        articlesFiltres.length+

        " résultat(s)";

    }

}

/*=========================================================
 BOUTON RECHERCHER
=========================================================*/

if(UI.boutonRecherche){

    UI.boutonRecherche.addEventListener(

        "click",

        function(){

            rechercheIA(

                UI.recherche.value

            );

        }

    );

}

/*=========================================================
 TOUCHE ENTRÉE
=========================================================*/

if(UI.recherche){

    UI.recherche.addEventListener(

        "keydown",

        function(e){

            if(e.key==="Enter"){

                e.preventDefault();

                rechercheIA(

                    UI.recherche.value

                );

            }

        }

    );

}

/*=========================================================
 SUGGESTIONS IA
=========================================================*/

function suggestionsIA(texte){

    texte=

    nettoyerTexte(texte);

    if(texte.length<2){

        return [];

    }

    let suggestions=[];

    Object.keys(DictionnaireIA)

    .forEach(cle=>{

        if(cle.startsWith(texte)){

            suggestions.push(cle);

        }

    });

    return suggestions;

}

console.log("✅ Partie 3 - Moteur de recherche IA chargé.");

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 4
 AFFICHAGE INTELLIGENT DES ARTICLES
 Version 3.0
=========================================================*/

/*=========================================================
 AFFICHAGE DES RÉSULTATS
=========================================================*/

function afficherArticles(liste){

    if(!UI.resultat){
        return;
    }

    UI.resultat.innerHTML="";

    if(!liste || liste.length===0){

        UI.resultat.innerHTML=`

        <div class="aucun-resultat">

            <h2>🔍 Aucun résultat</h2>

            <p>

                Aucun article ne correspond à votre recherche.

            </p>

        </div>

        `;

        return;

    }

    liste.forEach(article=>{

        UI.resultat.appendChild(

            creerCarteArticle(article)

        );

    });

}

/*=========================================================
 CARTE D'ARTICLE
=========================================================*/

function creerCarteArticle(article){

    const carte=document.createElement("div");

    carte.className="carte-article";

    carte.dataset.numero=article.numero;

    const score=article.scoreIA || 100;

    carte.innerHTML=`

        <div class="carte-entete">

            <span class="badge-article">

                Article ${article.numero}

            </span>

            <span class="badge-score">

                ${score}% IA

            </span>

        </div>

        <h3>

            ${article.titre}

        </h3>

        <p>

            ${tronquerTexte(article.contenu,300)}

        </p>

        <div class="actions-article">

            <button onclick="ouvrirArticle('${article.numero}')">

                📖 Lire

            </button>

            <button onclick="resumeIA('${article.numero}')">

                🤖 Résumé IA

            </button>

            <button onclick="expliquerArticle('${article.numero}')">

                💡 Expliquer

            </button>

            <button onclick="ajouterFavori('${article.numero}')">

                ⭐ Favori

            </button>

            <button onclick="copierArticle('${article.numero}')">

                📋 Copier

            </button>

            <button onclick="imprimerArticle('${article.numero}')">

                🖨️ Imprimer

            </button>

            <button onclick="partagerArticle('${article.numero}')">

                📤 Partager

            </button>

        </div>

    `;

    return carte;

}

/*=========================================================
 OUVRIR L'ARTICLE
=========================================================*/

function ouvrirArticle(numero){

    const article=articles.find(a=>

        String(a.numero)===String(numero)

    );

    if(!article){

        notifier("Article introuvable.","error");

        return;

    }

    dernierArticle=article;

    if(UI.numero){

        UI.numero.textContent=

        "Article "+article.numero;

    }

    if(UI.titre){

        UI.titre.textContent=

        article.titre;

    }

    if(UI.contenu){

        UI.contenu.innerHTML=

        article.contenu;

    }

    allerAuxResultats();

}

/*=========================================================
 TEXTE COURT
=========================================================*/

function tronquerTexte(texte,longueur=300){

    if(!texte){

        return "";

    }

    if(texte.length<=longueur){

        return texte;

    }

    return texte.substring(0,longueur)+"...";

}

/*=========================================================
 DÉFILEMENT AUTOMATIQUE
=========================================================*/

function allerAuxResultats(){

    if(UI.resultat){

        UI.resultat.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }

}

/*=========================================================
 ARTICLE SUIVANT
=========================================================*/

function articleSuivant(){

    if(!dernierArticle){

        return;

    }

    const index=articles.findIndex(a=>

        String(a.numero)===

        String(dernierArticle.numero)

    );

    if(index<articles.length-1){

        ouvrirArticle(

            articles[index+1].numero

        );

    }

}

/*=========================================================
 ARTICLE PRÉCÉDENT
=========================================================*/

function articlePrecedent(){

    if(!dernierArticle){

        return;

    }

    const index=articles.findIndex(a=>

        String(a.numero)===

        String(dernierArticle.numero)

    );

    if(index>0){

        ouvrirArticle(

            articles[index-1].numero

        );

    }

}

console.log("✅ Partie 4 - Affichage intelligent chargé.");

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 5
 ASSISTANT JURIDIQUE IA
 Version 3.0 Professionnelle
=========================================================*/

/*=========================================================
 DOMAINES JURIDIQUES
=========================================================*/

const DomainesIA={

    contrat:[
        "contrat","cdi","cdd","engagement",
        "embauche","clause"
    ],

    licenciement:[
        "licenciement","renvoi","rupture",
        "préavis","faute"
    ],

    salaire:[
        "salaire","paie","prime",
        "indemnité","rémunération"
    ],

    conge:[
        "congé","repos","vacances",
        "permission"
    ],

    accident:[
        "accident","sécurité",
        "hygiène","maladie",
        "protection"
    ],

    discipline:[
        "discipline","sanction",
        "avertissement",
        "blâme"
    ]

};

/*=========================================================
 IDENTIFICATION DU DOMAINE
=========================================================*/

function identifierDomaine(question){

    question=nettoyerTexte(question);

    let domaine="général";

    let meilleurScore=0;

    Object.keys(DomainesIA)

    .forEach(cle=>{

        let score=0;

        DomainesIA[cle]

        .forEach(mot=>{

            if(question.includes(

                nettoyerTexte(mot)

            )){

                score++;

            }

        });

        if(score>meilleurScore){

            meilleurScore=score;

            domaine=cle;

        }

    });

    return domaine;

}

/*=========================================================
 GÉNÉRATION DE LA RÉPONSE IA
=========================================================*/

function genererReponseIA(question){

    if(!UI.resume){

        return;

    }

    if(articlesFiltres.length===0){

        UI.resume.innerHTML=`

        <div class="ia-message erreur">

            <h3>

                🤖 InspecteurBot IA

            </h3>

            <p>

                Aucun article pertinent trouvé.

            </p>

        </div>

        `;

        return;

    }

    const domaine=

    identifierDomaine(question);

    const article=

    articlesFiltres[0];

    UI.resume.innerHTML=`

    <div class="ia-message">

        <h2>

            🤖 InspecteurBot IA

        </h2>

        <p>

            <strong>

            Domaine détecté :

            </strong>

            ${domaine}

        </p>

        <p>

            <strong>

            Article conseillé :

            </strong>

            ${article.numero}

        </p>

        <p>

            <strong>

            Titre :

            </strong>

            ${article.titre}

        </p>

        <p>

            Votre recherche semble concerner

            ce domaine du Code du Travail.

            Consultez également les autres

            résultats proposés.

        </p>

    </div>

    `;

}

/*=========================================================
 EXPLICATION IA
=========================================================*/

function expliquerArticle(numero){

    const article=

    articles.find(a=>

        String(a.numero)===

        String(numero)

    );

    if(!article){

        return;

    }

    if(!UI.explication){

        return;

    }

    UI.explication.innerHTML=`

    <div class="explication-ia">

        <h2>

            💡 Explication IA

        </h2>

        <p>

            <strong>

            ${article.titre}

            </strong>

        </p>

        <p>

            Cet article définit les obligations

            des employeurs et des travailleurs.

            Il doit être interprété avec les

            autres dispositions du Code du Travail.

        </p>

    </div>

    `;

}

/*=========================================================
 EXPLIQUER AVEC L'IA
=========================================================*/

async function expliquerIA() {

    if (!dernierArticle) {
        document.getElementById("reponseIA").innerHTML = `
            <h3>🤖 InspecteurBot IA</h3>
            <p>Veuillez d'abord ouvrir un article avant de demander une explication.</p>
        `;
        return;
    }

    document.getElementById("reponseIA").innerHTML = `
        <h3>🤖 InspecteurBot IA</h3>
        <p>⏳ Analyse de l'article avec l'IA...</p>
    `;

    const question = `
Explique en français simple cet article du Code du Travail de la RDC.

Article ${dernierArticle.numero}
Titre : ${dernierArticle.titre}

Texte :
${dernierArticle.contenu}
`;

    const reponse = await demanderIA(question);

    if (!reponse) {
        document.getElementById("reponseIA").innerHTML = `
            <h3>🤖 InspecteurBot IA</h3>
            <p>Aucune réponse reçue de l'IA.</p>
        `;
        return;
    }

    document.getElementById("reponseIA").innerHTML = `
        <h3>🤖 InspecteurBot IA</h3>
        <p>${reponse.replace(/\n/g, "<br>")}</p>
    `;

}

/*=========================================================
 RÉSUMÉ IA
=========================================================*/

function resumeIA(numero){

    const article=

    articles.find(a=>

        String(a.numero)===

        String(numero)

    );

    if(!article){

        return;

    }

    if(!UI.resume){

        return;

    }

    let texte=

    article.contenu;

    if(texte.length>450){

        texte=

        texte.substring(0,450)+"...";

    }

    UI.resume.innerHTML=`

    <div class="resume-ia">

        <h2>

            📑 Résumé IA

        </h2>

        <p>

            ${texte}

        </p>

    </div>

    `;

}

/*=========================================================
 ANALYSE D'UNE SITUATION
=========================================================*/

function analyserSituationIA(situation){

    if(!situation){

        return;

    }

    rechercheIA(situation);

}

/*=========================================================
 QUESTIONS FRÉQUENTES
=========================================================*/

const QuestionsIA=[

"Licenciement abusif",

"Contrat de travail",

"Salaire impayé",

"Congé annuel",

"Heures supplémentaires",

"Faute lourde",

"Accident du travail",

"Inspection du travail",

"Travail des femmes",

"Travail des enfants"

];

/*=========================================================
 AFFICHAGE DES QUESTIONS
=========================================================*/

function afficherQuestionsIA(){

    console.table(

        QuestionsIA

    );

}

console.log("✅ Partie 5 - Assistant juridique IA chargé.");

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 6
 FAVORIS - HISTORIQUE - STATISTIQUES
 Version 3.0 Professionnelle
=========================================================*/

"use strict";

/*=========================================================
 CLÉS DE SAUVEGARDE
=========================================================*/

const STOCKAGE={

    favoris:"IBIA_FAVORIS",

    historique:"IBIA_HISTORIQUE",

    statistiques:"IBIA_STATS"

};

/*=========================================================
 CHARGER FAVORIS
=========================================================*/

function chargerFavoris(){

    try{

        favoris=JSON.parse(

            localStorage.getItem(

                STOCKAGE.favoris

            )

        ) || [];

    }

    catch(e){

        favoris=[];

    }

}

/*=========================================================
 SAUVEGARDER FAVORIS
=========================================================*/

function sauvegarderFavoris(){

    localStorage.setItem(

        STOCKAGE.favoris,

        JSON.stringify(favoris)

    );

}

/*=========================================================
 AJOUTER FAVORI
=========================================================*/

function ajouterFavori(numero){

    numero=String(numero);

    if(favoris.includes(numero)){

        notifier(

            "Article déjà enregistré.",

            "info"

        );

        return;

    }

    favoris.push(numero);

    sauvegarderFavoris();

    notifier(

        "⭐ Favori ajouté.",

        "success"

    );

}

/*=========================================================
 SUPPRIMER FAVORI
=========================================================*/

function supprimerFavori(numero){

    numero=String(numero);

    favoris=favoris.filter(

        item=>item!==numero

    );

    sauvegarderFavoris();

    notifier(

        "Favori supprimé.",

        "success"

    );

}

/*=========================================================
 AFFICHER FAVORIS
=========================================================*/

function afficherFavoris(){

    const liste=

    articles.filter(article=>

        favoris.includes(

            String(article.numero)

        )

    );

    afficherArticles(liste);

}

/*=========================================================
 HISTORIQUE
=========================================================*/

function chargerHistorique(){

    try{

        historiqueRecherche=

        JSON.parse(

            localStorage.getItem(

                STOCKAGE.historique

            )

        ) || [];

    }

    catch(e){

        historiqueRecherche=[];

    }

}

function sauvegarderHistorique(){

    localStorage.setItem(

        STOCKAGE.historique,

        JSON.stringify(

            historiqueRecherche

        )

    );

}

function ajouterHistorique(texte){

    if(!texte){

        return;

    }

    historiqueRecherche.unshift(texte);

    historiqueRecherche=[

        ...new Set(

            historiqueRecherche

        )

    ];

    historiqueRecherche=

    historiqueRecherche.slice(0,30);

    sauvegarderHistorique();

}

/*=========================================================
 AFFICHER HISTORIQUE
=========================================================*/

function afficherHistorique(){

    console.table(

        historiqueRecherche

    );

}

/*=========================================================
 VIDER HISTORIQUE
=========================================================*/

function viderHistorique(){

    historiqueRecherche=[];

    sauvegarderHistorique();

    notifier(

        "Historique supprimé.",

        "success"

    );

}

/*=========================================================
 STATISTIQUES
=========================================================*/

let statistiques={

    recherches:0,

    articlesOuverts:0,

    favoris:0,

    derniereUtilisation:null

};

function chargerStatistiques(){

    try{

        statistiques=

        JSON.parse(

            localStorage.getItem(

                STOCKAGE.statistiques

            )

        ) || statistiques;

    }

    catch(e){

    }

}

function sauvegarderStatistiques(){

    statistiques.favoris=

    favoris.length;

    statistiques.derniereUtilisation=

    new Date().toLocaleString(

        "fr-FR"

    );

    localStorage.setItem(

        STOCKAGE.statistiques,

        JSON.stringify(

            statistiques

        )

    );

}

function incrementerRecherche(){

    statistiques.recherches++;

    sauvegarderStatistiques();

}

function incrementerArticle(){

    statistiques.articlesOuverts++;

    sauvegarderStatistiques();

}

/*=========================================================
 TABLEAU DE BORD
=========================================================*/

function afficherStatistiques(){

    console.table(statistiques);

}

/*=========================================================
 INITIALISATION
=========================================================*/

chargerFavoris();

chargerHistorique();

chargerStatistiques();

console.log(

"✅ Partie 6 - Favoris, Historique et Statistiques chargés."

);

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 7
 MODE INSPECTEUR PRO
 Version 3.0 Professionnelle
=========================================================*/

"use strict";

/*=========================================================
 BASE DES INFRACTIONS
=========================================================*/

const BaseInfractions={

    salaire:{

        gravite:"Élevée",

        couleur:"#e53935",

        documents:[
            "Bulletins de paie",
            "Registre de paie",
            "Contrat de travail"
        ]

    },

    licenciement:{

        gravite:"Très élevée",

        couleur:"#c62828",

        documents:[
            "Lettre de licenciement",
            "Préavis",
            "Contrat"
        ]

    },

    contrat:{

        gravite:"Moyenne",

        couleur:"#fb8c00",

        documents:[
            "Contrat signé",
            "Avenants",
            "Registre du personnel"
        ]

    },

    accident:{

        gravite:"Critique",

        couleur:"#8e24aa",

        documents:[
            "Déclaration d'accident",
            "Rapport médical",
            "Registre sécurité"
        ]

    },

    conge:{

        gravite:"Moyenne",

        couleur:"#43a047",

        documents:[
            "Planning des congés",
            "Registre du personnel"
        ]

    }

};

/*=========================================================
 ANALYSE D'UNE SITUATION
=========================================================*/

function analyserDossier(situation){

    if(!situation){

        return;

    }

    const texte=nettoyerTexte(situation);

    let resultat=[];

    Object.keys(BaseInfractions)

    .forEach(type=>{

        if(texte.includes(type)){

            resultat.push({

                type:type,

                infos:BaseInfractions[type]

            });

        }

    });

    afficherRapportInspecteur(

        situation,

        resultat

    );

}

/*=========================================================
 RAPPORT INSPECTEUR
=========================================================*/

function afficherRapportInspecteur(

    situation,

    infractions

){

    if(!UI.resume){

        return;

    }

    let html=`

    <div class="rapport-inspecteur">

    <h2>

    🕵️ Rapport Inspecteur IA

    </h2>

    <p>

    <strong>Situation :</strong>

    ${situation}

    </p>

    `;

    if(infractions.length===0){

        html+=`

        <p>

        Aucune infraction détectée.

        </p>

        `;

    }

    infractions.forEach(item=>{

        html+=`

        <div class="bloc-infraction">

        <h3>

        ${item.type.toUpperCase()}

        </h3>

        <p>

        Gravité :

        <strong>

        ${item.infos.gravite}

        </strong>

        </p>

        <p>

        Documents à contrôler :

        </p>

        <ul>

        ${item.infos.documents

        .map(doc=>"<li>"+doc+"</li>")

        .join("")}

        </ul>

        </div>

        `;

    });

    html+=`

    </div>

    `;

    UI.resume.innerHTML=html;

}

/*=========================================================
 CHECK-LIST INSPECTION
=========================================================*/

function genererChecklist(){

    return[

        "Contrat de travail",

        "Registre du personnel",

        "Bulletins de paie",

        "Horaires de travail",

        "Congés",

        "Affiliation CNSS",

        "Règlement intérieur",

        "Santé et sécurité",

        "Équipements de protection",

        "Déclarations d'accident"

    ];

}

/*=========================================================
 AFFICHER CHECK-LIST
=========================================================*/

function afficherChecklist(){

    console.table(

        genererChecklist()

    );

}

/*=========================================================
 QUESTIONS À POSER
=========================================================*/

function questionsInspection(){

    return[

        "Depuis quand dure la situation ?",

        "Existe-t-il un contrat écrit ?",

        "Les salaires sont-ils payés ?",

        "Le préavis a-t-il été respecté ?",

        "Les cotisations sociales sont-elles versées ?",

        "Les heures supplémentaires sont-elles rémunérées ?",

        "Les travailleurs disposent-ils d'EPI ?",

        "Le registre du personnel est-il disponible ?"

    ];

}

/*=========================================================
 AFFICHER QUESTIONS
=========================================================*/

function afficherQuestionsInspection(){

    console.table(

        questionsInspection()

    );

}

console.log(

"✅ Partie 7 - Mode Inspecteur Pro chargé."

);

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 8
 ASSISTANT CONVERSATIONNEL IA
 Version 3.0 Professionnelle
=========================================================*/

"use strict";

/*=========================================================
 QUESTIONS FRÉQUENTES
=========================================================*/

const BaseConnaissancesIA=[

{
question:"licenciement",
reponse:"Le licenciement doit respecter les dispositions du Code du Travail. Vérifiez la procédure, le motif, le préavis et les indemnités."
},

{
question:"contrat",
reponse:"Le contrat de travail doit préciser les fonctions, la rémunération, la durée et les obligations des parties."
},

{
question:"salaire",
reponse:"Le salaire doit être payé régulièrement. Vérifiez les bulletins de paie, le registre de paie et les preuves de paiement."
},

{
question:"heures supplémentaires",
reponse:"Les heures supplémentaires doivent être autorisées et rémunérées conformément au Code du Travail."
},

{
question:"congé",
reponse:"Le travailleur bénéficie d'un droit au congé annuel selon les conditions prévues par la loi."
},

{
question:"accident",
reponse:"En cas d'accident du travail, l'employeur doit déclarer l'accident et protéger le travailleur."
}

];

/*=========================================================
 CHERCHER UNE RÉPONSE
=========================================================*/

function rechercherReponseIA(question){

    question=nettoyerTexte(question);

    for(const item of BaseConnaissancesIA){

        if(question.includes(

            nettoyerTexte(item.question)

        )){

            return item.reponse;

        }

    }

    return "Aucune réponse directe trouvée. Consultez les articles proposés ci-dessous.";

}

/*=========================================================
 ASSISTANT IA
=========================================================*/

function discuterAvecIA(question){

    if(!question){

        return;

    }

    rechercheIA(question);

    const reponse=

    rechercherReponseIA(question);

    afficherConversationIA(

        question,

        reponse

    );

}

/*=========================================================
 AFFICHAGE DE LA CONVERSATION
=========================================================*/

function afficherConversationIA(question,reponse){

    if(!UI.resume){

        return;

    }

    UI.resume.innerHTML=`

    <div class="conversation-ia">

        <div class="message-utilisateur">

            <h3>

            👤 Inspecteur

            </h3>

            <p>

            ${question}

            </p>

        </div>

        <div class="message-ia">

            <h3>

            🤖 InspecteurBot IA

            </h3>

            <p>

            ${reponse}

            </p>

        </div>

    </div>

    `;

}

/*=========================================================
 SUGGESTIONS AUTOMATIQUES
=========================================================*/

function obtenirSuggestionsIA(){

    return [

        "Licenciement abusif",

        "Contrat de travail",

        "Salaire impayé",

        "Heures supplémentaires",

        "Congé annuel",

        "Accident du travail",

        "Inspection",

        "Préavis",

        "Faute lourde",

        "Travail des femmes",

        "Travail des enfants",

        "Apprentissage"

    ];

}

/*=========================================================
 AFFICHER LES SUGGESTIONS
=========================================================*/

function afficherSuggestionsIA(){

    console.table(

        obtenirSuggestionsIA()

    );

}

/*=========================================================
 ANALYSE RAPIDE
=========================================================*/

function analyseRapide(question){

    discuterAvecIA(question);

}

console.log(

"✅ Partie 8 - Assistant Conversationnel IA chargé."

);

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 9
 RAPPORT JURIDIQUE IA PROFESSIONNEL
 Version 3.0
=========================================================*/

"use strict";

/*=========================================================
 DATE ET HEURE
=========================================================*/

function obtenirDateRapport(){

    return new Date().toLocaleDateString(

        "fr-FR",

        {

            day:"2-digit",

            month:"2-digit",

            year:"numeric"

        }

    );

}

function obtenirHeureRapport(){

    return new Date().toLocaleTimeString(

        "fr-FR"

    );

}

/*=========================================================
 NIVEAU DE RISQUE
=========================================================*/

function determinerNiveauRisque(){

    if(articlesFiltres.length>=10){

        return{

            niveau:"Très élevé",

            couleur:"#d32f2f",

            etoiles:"★★★★★"

        };

    }

    if(articlesFiltres.length>=5){

        return{

            niveau:"Élevé",

            couleur:"#f57c00",

            etoiles:"★★★★☆"

        };

    }

    if(articlesFiltres.length>=3){

        return{

            niveau:"Moyen",

            couleur:"#fbc02d",

            etoiles:"★★★☆☆"

        };

    }

    return{

        niveau:"Faible",

        couleur:"#43a047",

        etoiles:"★★☆☆☆"

    };

}

/*=========================================================
 RÉSUMÉ DES ARTICLES
=========================================================*/

function genererResumeArticles(){

    let texte="";

    articlesFiltres

    .slice(0,5)

    .forEach(article=>{

        texte+=

        "• Article "

        +article.numero+

        " : "

        +article.titre+

        "\n";

    });

    return texte;

}

/*=========================================================
 RAPPORT COMPLET
=========================================================*/

function genererRapportJuridique(question){

    const risque=

    determinerNiveauRisque();

    const domaine=

    identifierDomaine(question);

    let rapport=`

<div class="rapport-juridique">

<h2>

📑 Rapport Juridique IA

</h2>

<p>

<strong>Date :</strong>

${obtenirDateRapport()}

</p>

<p>

<strong>Heure :</strong>

${obtenirHeureRapport()}

</p>

<p>

<strong>Domaine :</strong>

${domaine}

</p>

<p>

<strong>Niveau de risque :</strong>

<span style="color:${risque.couleur}">

${risque.niveau}

${risque.etoiles}

</span>

</p>

<p>

<strong>Question analysée :</strong>

${question}

</p>

<h3>

Articles recommandés

</h3>

<pre>

${genererResumeArticles()}

</pre>

<h3>

Conclusion IA

</h3>

<p>

Les articles ci-dessus semblent être les plus pertinents.

Une vérification des documents de l'entreprise est recommandée avant toute décision.

</p>

</div>

`;

    if(UI.resume){

        UI.resume.innerHTML=

        rapport;

    }

}

/*=========================================================
 EXPORT TEXTE
=========================================================*/

function exporterRapportTXT(){

    const texte=

    UI.resume

    ?UI.resume.innerText

    :"";

    const blob=new Blob(

        [texte],

        {

            type:"text/plain"

        }

    );

    const lien=

    document.createElement("a");

    lien.href=

    URL.createObjectURL(blob);

    lien.download=

    "Rapport_InspecteurBot.txt";

    lien.click();

}

/*=========================================================
 IMPRESSION
=========================================================*/

function imprimerRapport(){

    window.print();

}

/*=========================================================
 PARTAGE MOBILE
=========================================================*/

async function partagerRapport(){

    if(!navigator.share){

        return;

    }

    await navigator.share({

        title:

        "Rapport InspecteurBot IA",

        text:

        UI.resume.innerText

    });

}

/*=========================================================
 ANALYSE COMPLÈTE
=========================================================*/

function lancerAnalyseComplete(question){

    rechercheIA(question);

    analyserDossier(question);

    genererRapportJuridique(question);

}

console.log(

"✅ Partie 9 - Rapport Juridique IA chargé."

);

/*=========================================================
 INSPECTEURBOT IA RDC
 PARTIE 10
 COPILOTE D'INSPECTION IA
 Version 3.0 Professionnelle
=========================================================*/

"use strict";

/*=========================================================
 GÉNÉRATION D'UN DOSSIER D'INSPECTION
=========================================================*/

function genererDossierInspection(question){

    const dossier={

        numero:"IGT-"+Date.now(),

        date:new Date().toLocaleDateString("fr-FR"),

        heure:new Date().toLocaleTimeString("fr-FR"),

        inspecteur:"InspecteurBot IA",

        situation:question,

        domaine:identifierDomaine(question),

        articles:articlesFiltres.slice(0,10)

    };

    return dossier;

}

/*=========================================================
 PROCÈS-VERBAL IA
=========================================================*/

function genererProcesVerbal(question){

    const dossier=

    genererDossierInspection(question);

    let texte=

`PROCÈS-VERBAL D'INSPECTION

Numéro : ${dossier.numero}

Date : ${dossier.date}

Heure : ${dossier.heure}

Situation constatée :

${question}

Domaine :

${dossier.domaine}

Articles recommandés :

`;

    dossier.articles.forEach(article=>{

        texte+=

        "Article "+

        article.numero+

        " - "+

        article.titre+

        "\n";

    });

    texte+=`

Conclusion :

Une inspection approfondie est recommandée.

Inspecteur :

InspecteurBot IA

`;

    return texte;

}

/*=========================================================
 MISE EN DEMEURE
=========================================================*/

function genererMiseEnDemeure(question){

    return`

MISE EN DEMEURE

Après analyse de la situation :

${question}

Il est demandé à l'employeur de se conformer aux dispositions du Code du Travail dans les meilleurs délais.

InspecteurBot IA.

`;

}

/*=========================================================
 RECOMMANDATIONS IA
=========================================================*/

function recommandationsIA(question){

    return[

        "Vérifier les contrats de travail.",

        "Contrôler les bulletins de paie.",

        "Examiner le registre du personnel.",

        "Contrôler les horaires.",

        "Vérifier les cotisations sociales.",

        "Examiner les congés.",

        "Contrôler les équipements de protection.",

        "Interroger les travailleurs.",

        "Interroger l'employeur.",

        "Consulter les articles proposés."

    ];

}

/*=========================================================
 AFFICHAGE COMPLET
=========================================================*/

function afficherCopiloteIA(question){

    if(!UI.resume){

        return;

    }

    const pv=

    genererProcesVerbal(question);

    const recommandations=

    recommandationsIA(question);

    UI.resume.innerHTML=`

<div class="copilote-ia">

<h2>

🧠 Copilote d'Inspection IA

</h2>

<h3>

📄 Procès-Verbal

</h3>

<pre>

${pv}

</pre>

<h3>

✅ Recommandations

</h3>

<ul>

${recommandations

.map(item=>"<li>"+item+"</li>")

.join("")}

</ul>

</div>

`;

}

/*=========================================================
 EXPORT JSON
=========================================================*/

function exporterDossierJSON(question){

    const dossier=

    genererDossierInspection(question);

    const blob=new Blob(

        [

        JSON.stringify(

            dossier,

            null,

            2

        )

        ],

        {

            type:"application/json"

        }

    );

    const lien=

    document.createElement("a");

    lien.href=

    URL.createObjectURL(blob);

    lien.download=

    "Dossier_Inspection.json";

    lien.click();

}

/*=========================================================
 ANALYSE COMPLÈTE
=========================================================*/

function analyserInspection(question){

    rechercheIA(question);

    analyserDossier(question);

    genererRapportJuridique(question);

    afficherCopiloteIA(question);

}

console.log("✅ Partie 10 - Copilote d'Inspection IA chargé.");

function parlerArticle() {

    const texte =
        document.getElementById("titreArticle").innerText + ". " +
        document.getElementById("contenuArticle").innerText;

    const lecture = new SpeechSynthesisUtterance(texte);

    lecture.lang = "fr-FR";
    lecture.rate = 1;
    lecture.pitch = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(lecture);
}

/*=========================================================
 OUVERTURE DES CATÉGORIES
=========================================================*/

function ouvrirCategorie(categorie) {

    let mot = "";

    switch(categorie){

        case "contrat":
            mot = "contrat";
            break;

        case "salaire":
            mot = "salaire";
            break;

        case "conges":
            mot = "congé";
            break;

        case "temps":
            mot = "durée";
            break;

        case "licenciement":
            mot = "licenciement";
            break;

        case "inspection":
            mot = "inspection";
            break;

        case "securite":
            mot = "sécurité";
            break;

        case "sanctions":
            mot = "sanction";
            break;

        default:
            mot = categorie;
    }

    document.getElementById("rechercheArticle").value = mot;

    rechercheIA(mot);
}

/*=========================================================
 RECHERCHE RAPIDE
=========================================================*/

function rechercheRapide(mot){

    document.getElementById("rechercheArticle").value = mot;

    rechercheIA(mot);

}

/*=========================================================
 COPIER L'ARTICLE
=========================================================*/

function copierArticle() {

    const texte =
        document.getElementById("numeroArticle").innerText + "\n\n" +
        document.getElementById("titreArticle").innerText + "\n\n" +
        document.getElementById("contenuArticle").innerText;

    navigator.clipboard.writeText(texte);

    alert("✅ Article copié dans le presse-papiers.");
}

/*=========================================================
 PARTAGER L'ARTICLE
=========================================================*/

async function partagerArticle() {

    const texte =
        document.getElementById("numeroArticle").innerText + "\n\n" +
        document.getElementById("titreArticle").innerText + "\n\n" +
        document.getElementById("contenuArticle").innerText;

    if (navigator.share) {

        await navigator.share({

            title: "Code du Travail RDC",

            text: texte

        });

    } else {

        copierArticle();

    }

}

/*=========================================================
 IMPRIMER L'ARTICLE
=========================================================*/

function imprimerArticle() {

    window.print();

}

/*=========================================================
 IA JURIDIQUE AVANCÉE
=========================================================*/

const QuestionsIntelligentes = [

{
mots:["licencier","femme","enceinte"],
reponse:"Une travailleuse enceinte bénéficie d'une protection particulière. Vérifiez les dispositions du Code du Travail relatives à la maternité avant toute décision de licenciement."
},

{
mots:["congé","annuel"],
reponse:"Le congé annuel est un droit du travailleur. Consultez les articles relatifs aux congés pour connaître les conditions d'acquisition et la durée."
},

{
mots:["heures","supplémentaires"],
reponse:"Les heures supplémentaires doivent être autorisées et rémunérées conformément au Code du Travail."
},

{
mots:["salaire","impayé"],
reponse:"Le non-paiement du salaire constitue une violation du Code du Travail. Vérifiez les articles concernant la rémunération et les obligations de l'employeur."
},

{
mots:["contrat","travail"],
reponse:"Le contrat de travail fixe les droits et obligations de l'employeur et du travailleur. Vérifiez sa forme et son contenu."
}

];

function reponseIntelligente(question){

    question = nettoyerTexte(question);

    for(const item of QuestionsIntelligentes){

        const trouve = item.mots.every(mot =>
            question.includes(nettoyerTexte(mot))
        );

        if(trouve){

            document.getElementById("reponseIA").innerHTML = `
                <h3>🤖 InspecteurBot IA</h3>
                <p>${item.reponse}</p>
            `;

            return;
        }

    }

    document.getElementById("reponseIA").innerHTML = `
        <h3>🤖 InspecteurBot IA</h3>
        <p>Je n'ai pas trouvé de réponse précise. Consultez les articles affichés ci-dessus.</p>
    `;
}


