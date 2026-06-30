/*=========================================================
 INSPECTEURBOT IA RDC
 MODULE : CODE DU TRAVAIL
 Version : 4.1
 Développeur : Inspecteur Limengo (Pmiller)
=========================================================*/

"use strict";

/*=========================================================
 CONFIGURATION
=========================================================*/

const APP = {

    nom: "InspecteurBot IA",

    version: "4.1",

    pays: "République Démocratique du Congo",

    langue: "fr",

    fichierJSON: "assets/data/code-travail.json",

    modeIA: true,

    debug: true

};

/*=========================================================
 BASE DE DONNÉES
=========================================================*/

let articles = [];

let articlesFiltres = [];

let dernierArticle = null;

let indexArticle = -1;

let favoris = [];

let historique = [];

/*=========================================================
 ÉTAT DE L'APPLICATION
=========================================================*/

const Etat = {

    baseChargee: false,

    rechercheEnCours: false

};

/*=========================================================
 ÉLÉMENTS HTML
=========================================================*/

const UI = {

    recherche: null,

    boutonRecherche: null,

    zoneIA: null,

    numeroArticle: null,

    titreArticle: null,

    contenuArticle: null,

    reponseIA: null,

    btnMicro: null,

    btnLecture: null,

    horloge: null,

    theme: null,

    iconTheme: null

};

/*=========================================================
 INITIALISER L'INTERFACE
=========================================================*/

function initialiserInterface(){

    UI.recherche = document.getElementById("rechercheArticle");

    UI.boutonRecherche = document.getElementById("btnRecherche");

    UI.zoneIA = document.getElementById("zoneIA");

    UI.numeroArticle = document.getElementById("numeroArticle");

    UI.titreArticle = document.getElementById("titreArticle");

    UI.contenuArticle = document.getElementById("contenuArticle");

    UI.reponseIA = document.getElementById("reponseIA");

    UI.btnMicro = document.getElementById("btnMicro");

    UI.btnLecture = document.getElementById("btnLecture");

    UI.horloge = document.getElementById("clock");

    UI.theme = document.getElementById("themeToggle");

    UI.iconTheme = document.getElementById("themeIcon");

}

/*=========================================================
 NOTIFICATION
=========================================================*/

function notifier(message,type="info"){

    if(APP.debug){

        console.log("[" + type.toUpperCase() + "] " + message);

    }

}

/*=========================================================
 FONCTIONS UTILES
=========================================================*/

function tronquerTexte(texte,longueur=250){

    texte = String(texte || "");

    if(texte.length <= longueur){

        return texte;

    }

    return texte.substring(0,longueur) + "...";

}

function nettoyerTexte(texte){

    return String(texte || "")

        .toLowerCase()

        .normalize("NFD")

        .replace(/[\u0300-\u036f]/g,"")

        .replace(/[^\w\s]/g," ")

        .replace(/\s+/g," ")

        .trim();

}

/*=========================================================
 DÉMARRAGE
=========================================================*/

document.addEventListener("DOMContentLoaded",async()=>{

    initialiserInterface();

    notifier("Interface initialisée.","success");

});

/*=========================================================
 PARTIE 2
 CHARGEMENT DE LA BASE JURIDIQUE
=========================================================*/

/*=========================================================
 CHARGER LE CODE DU TRAVAIL
=========================================================*/

async function chargerBaseJuridique(){

    try{

        notifier("Chargement du Code du Travail...","info");

        const reponse = await fetch(APP.fichierJSON);

        if(!reponse.ok){

            throw new Error("Impossible de charger le fichier JSON.");

        }

        articles = await reponse.json();

        if(!Array.isArray(articles)){

            throw new Error("Le fichier JSON est invalide.");

        }

        articlesFiltres = [...articles];

        Etat.baseChargee = true;

        notifier(
            articles.length + " articles chargés.",
            "success"
        );

        afficherAccueil();

    }

    catch(erreur){

        console.error(erreur);

        Etat.baseChargee = false;

        afficherErreur(
            "Impossible de charger le fichier Code du Travail."
        );

    }

}

/*=========================================================
 PAGE D'ACCUEIL
=========================================================*/

function afficherAccueil(){

    if(!UI.zoneIA){

        return;

    }

    UI.zoneIA.innerHTML = `

        <div class="accueil-code">

            <h2>⚖️ InspecteurBot IA</h2>

            <p>

                Base juridique chargée avec succès.

            </p>

            <p>

                <strong>${articles.length}</strong>
                articles disponibles.

            </p>

            <p>

                Recherchez un article par numéro,
                mot-clé ou posez directement
                une question juridique.

            </p>

        </div>

    `;

}

/*=========================================================
 MESSAGE D'ERREUR
=========================================================*/

function afficherErreur(message){

    if(!UI.zoneIA){

        return;

    }

    UI.zoneIA.innerHTML = `

        <div class="erreur-code">

            <h2>❌ Erreur</h2>

            <p>${message}</p>

        </div>

    `;

}

/*=========================================================
 VÉRIFIER SI LA BASE EST CHARGÉE
=========================================================*/

function baseChargee(){

    return Etat.baseChargee;

}

/*=========================================================
 DÉMARRAGE AUTOMATIQUE
=========================================================*/

document.addEventListener("DOMContentLoaded",async()=>{

    initialiserInterface();

    await chargerBaseJuridique();

    notifier("Application prête.","success");

});

/*=========================================================
 PARTIE 3
 MOTEUR DE RECHERCHE
=========================================================*/

/*=========================================================
 RECHERCHER DES ARTICLES
=========================================================*/

function rechercherArticles(texte){

    if(!Etat.baseChargee){

        afficherErreur("La base juridique n'est pas encore chargée.");

        return;

    }

    texte = nettoyerTexte(texte);

    if(texte===""){

        afficherAccueil();

        return;

    }

    historique.unshift(texte);

    historique=[...new Set(historique)];

    historique=historique.slice(0,20);

    localStorage.setItem(
        "historiqueRecherche",
        JSON.stringify(historique)
    );

    articlesFiltres = articles.filter(article=>{

        const contenu = nettoyerTexte(

            article.numero + " " +

            article.titre + " " +

            article.contenu

        );

        return contenu.includes(texte);

    });

    afficherResultats();

}

/*=========================================================
 AFFICHER LES RÉSULTATS
=========================================================*/

function afficherResultats(){

    if(!UI.zoneIA){

        return;

    }

    if(articlesFiltres.length===0){

        UI.zoneIA.innerHTML=`

            <div class="aucun-resultat">

                <h2>🔍 Aucun résultat</h2>

                <p>

                    Aucun article trouvé.

                </p>

            </div>

        `;

        return;

    }

    UI.zoneIA.innerHTML="";

    articlesFiltres.forEach(article=>{

        const carte=document.createElement("div");

        carte.className="result-card";

        carte.innerHTML=`

            <h3>

                Article ${article.numero}

            </h3>

            <strong>

                ${article.titre}

            </strong>

            <p>

                ${tronquerTexte(article.contenu,220)}

            </p>

            <button
                onclick="ouvrirArticle('${article.numero}')">

                📖 Lire l'article

            </button>

        `;

        UI.zoneIA.appendChild(carte);

    });

}

/*=========================================================
 ÉVÈNEMENTS
=========================================================*/

function initialiserRecherche(){

    if(UI.boutonRecherche){

        UI.boutonRecherche.addEventListener("click",()=>{

            rechercherArticles(

                UI.recherche.value

            );

        });

    }

    if(UI.recherche){

        UI.recherche.addEventListener("keydown",(e)=>{

            if(e.key==="Enter"){

                e.preventDefault();

                rechercherArticles(

                    UI.recherche.value

                );

            }

        });

    }

}

/*=========================================================
 INITIALISATION
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    initialiserRecherche();

});

/*=========================================================
 PARTIE 4
 OUVERTURE ET GESTION DES ARTICLES
 Version 4.1
=========================================================*/

/*=========================================================
 OUVRIR UN ARTICLE
=========================================================*/

function ouvrirArticle(numero){

    const article = articles.find(a =>
        String(a.numero) === String(numero)
    );

    if(!article){

        afficherErreur("Article introuvable.");

        return;

    }

    dernierArticle = article;

    indexArticle = articles.findIndex(a =>
        String(a.numero) === String(numero)
    );

    if(UI.numeroArticle){

        UI.numeroArticle.textContent =
        "Article " + article.numero;

    }

    if(UI.titreArticle){

        UI.titreArticle.textContent =
        article.titre;

    }

    if(UI.contenuArticle){

        UI.contenuArticle.innerHTML =
        article.contenu;

    }

    if(UI.reponseIA){

        UI.reponseIA.innerHTML = `

        <h3>🤖 InspecteurBot IA</h3>

        <p>

        Article chargé avec succès.

        Cliquez sur

        <strong>Expliquer avec l'IA</strong>

        pour obtenir une explication simplifiée.

        </p>

        `;

    }

    const section = document.querySelector(".article-section");

    if(section){

        section.scrollIntoView({

            behavior:"smooth"

        });

    }

}

/*=========================================================
 ARTICLE SUIVANT
=========================================================*/

function articleSuivant(){

    if(indexArticle < 0){

        return;

    }

    if(indexArticle >= articles.length - 1){

        return;

    }

    indexArticle++;

    ouvrirArticle(

        articles[indexArticle].numero

    );

}

/*=========================================================
 ARTICLE PRÉCÉDENT
=========================================================*/

function articlePrecedent(){

    if(indexArticle <= 0){

        return;

    }

    indexArticle--;

    ouvrirArticle(

        articles[indexArticle].numero

    );

}

/*=========================================================
 COPIER L'ARTICLE
=========================================================*/

async function copierArticle(){

    if(!dernierArticle){

        return;

    }

    const texte =

        "Article " +

        dernierArticle.numero +

        "\n\n" +

        dernierArticle.titre +

        "\n\n" +

        dernierArticle.contenu;

    try{

        await navigator.clipboard.writeText(texte);

        if(UI.reponseIA){

            UI.reponseIA.innerHTML =

            "✅ Article copié dans le presse-papiers.";

        }

    }

    catch{

        alert(texte);

    }

}

/*=========================================================
 IMPRIMER
=========================================================*/

function imprimerArticle(){

    if(!dernierArticle){

        return;

    }

    window.print();

}

/*=========================================================
 PARTAGER
=========================================================*/

async function partagerArticle(){

    if(!dernierArticle){

        return;

    }

    const texte =

        "Article " +

        dernierArticle.numero +

        "\n\n" +

        dernierArticle.titre +

        "\n\n" +

        dernierArticle.contenu;

    if(navigator.share){

        try{

            await navigator.share({

                title:"Code du Travail RDC",

                text:texte

            });

        }

        catch(e){

            console.log(e);

        }

    }

    else{

        copierArticle();

    }

}

/*=========================================================
 ALLER AU PREMIER ARTICLE
=========================================================*/

function premierArticle(){

    if(articles.length===0){

        return;

    }

    ouvrirArticle(

        articles[0].numero

    );

}

/*=========================================================
 ALLER AU DERNIER ARTICLE
=========================================================*/

function dernierArticleListe(){

    if(articles.length===0){

        return;

    }

    ouvrirArticle(

        articles[articles.length-1].numero

    );

}

console.log("✅ Partie 4 chargée.");

/*=========================================================
 PARTIE 5
 IA • MICROPHONE • LECTURE • FAVORIS
 Version 4.1
=========================================================*/

/*=========================================================
 EXPLIQUER L'ARTICLE AVEC L'IA
=========================================================*/

async function expliquerIA(){

    if(!dernierArticle){

        if(UI.reponseIA){

            UI.reponseIA.innerHTML=`
                <h3>🤖 InspecteurBot IA</h3>
                <p>Veuillez ouvrir un article.</p>
            `;
        }

        return;

    }

    if(UI.reponseIA){

        UI.reponseIA.innerHTML=`
            <h3>🤖 InspecteurBot IA</h3>
            <p>⏳ Analyse de l'article...</p>
        `;
    }

    try{

        if(typeof demanderIA==="function"){

            const question=`

Explique simplement cet article du Code du Travail de la RDC.

Article ${dernierArticle.numero}

Titre :
${dernierArticle.titre}

Texte :
${dernierArticle.contenu}

`;

            const reponse=await demanderIA(question);

            UI.reponseIA.innerHTML=`
                <h3>🤖 InspecteurBot IA</h3>
                <p>${String(reponse).replace(/\n/g,"<br>")}</p>
            `;

        }else{

            UI.reponseIA.innerHTML=`
                <h3>🤖 InspecteurBot IA</h3>

                <p>

                L'article <strong>${dernierArticle.numero}</strong>
                est correctement chargé.

                Le module IA externe n'est pas encore connecté.

                </p>
            `;

        }

    }

    catch(e){

        console.error(e);

        UI.reponseIA.innerHTML=`
            <h3>❌ Erreur IA</h3>
            <p>Impossible d'obtenir une réponse.</p>
        `;

    }

}

/*=========================================================
 RÉSUMÉ RAPIDE
=========================================================*/

function resumeArticle(){

    if(!dernierArticle){

        return;

    }

    UI.reponseIA.innerHTML=`

    <h3>📝 Résumé</h3>

    <p>

    ${tronquerTexte(dernierArticle.contenu,500)}

    </p>

    `;

}

/*=========================================================
 LECTURE VOCALE
=========================================================*/

function parlerArticle(){

    if(!dernierArticle){

        return;

    }

    speechSynthesis.cancel();

    const texte=

        "Article "+

        dernierArticle.numero+

        ". "+

        dernierArticle.titre+

        ". "+

        dernierArticle.contenu;

    const lecture=new SpeechSynthesisUtterance(texte);

    lecture.lang="fr-FR";

    lecture.rate=1;

    lecture.pitch=1;

    speechSynthesis.speak(lecture);

}

/*=========================================================
 ARRÊTER LA LECTURE
=========================================================*/

function arreterLecture(){

    speechSynthesis.cancel();

}

/*=========================================================
 FAVORIS
=========================================================*/

function ajouterFavori(){

    if(!dernierArticle){

        return;

    }

    const existe=favoris.find(a=>

        String(a.numero)===

        String(dernierArticle.numero)

    );

    if(existe){

        UI.reponseIA.innerHTML=

        "⭐ Article déjà enregistré.";

        return;

    }

    favoris.push(dernierArticle);

    localStorage.setItem(

        "favorisCodeTravail",

        JSON.stringify(favoris)

    );

    UI.reponseIA.innerHTML=

    "⭐ Article ajouté aux favoris.";

}

/*=========================================================
 CHARGER FAVORIS
=========================================================*/

function chargerFavoris(){

    const data=

    localStorage.getItem(

        "favorisCodeTravail"

    );

    if(data){

        favoris=JSON.parse(data);

    }

}

/*=========================================================
 MICROPHONE
=========================================================*/

function initialiserMicrophone(){

    if(

        !("webkitSpeechRecognition" in window) &&

        !("SpeechRecognition" in window)

    ){

        return;

    }

    const SpeechRecognition=

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;

    const recognition=

        new SpeechRecognition();

    recognition.lang="fr-FR";

    recognition.continuous=false;

    recognition.interimResults=false;

    recognition.onresult=(event)=>{

        const texte=

        event.results[0][0].transcript;

        if(UI.recherche){

            UI.recherche.value=texte;

        }

        rechercherArticles(texte);

    };

    recognition.onerror=(e)=>{

        console.log(e);

    };

    if(UI.btnMicro){

        UI.btnMicro.addEventListener(

            "click",

            ()=>{

                recognition.start();

            }

        );

    }

}

/*=========================================================
 INITIALISATION
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        chargerFavoris();

        initialiserMicrophone();

    }

);

console.log("✅ Partie 5 chargée.");

/*=========================================================
 PARTIE 6
 FINALISATION DE L'APPLICATION
 Version 4.1
=========================================================*/

/*=========================================================
 HORLOGE
=========================================================*/

function mettreAJourHorloge(){

    if(!UI.horloge){

        return;

    }

    UI.horloge.textContent=

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
 THÈME CLAIR / SOMBRE
=========================================================*/

function appliquerTheme(){

    const theme=

    localStorage.getItem("theme")||

    "light";

    if(theme==="dark"){

        document.body.classList.add("dark-theme");

        if(UI.iconTheme){

            UI.iconTheme.textContent="☀️";

        }

    }else{

        document.body.classList.remove("dark-theme");

        if(UI.iconTheme){

            UI.iconTheme.textContent="🌙";

        }

    }

}

function changerTheme(){

    document.body.classList.toggle("dark-theme");

    const sombre=

    document.body.classList.contains("dark-theme");

    localStorage.setItem(

        "theme",

        sombre ? "dark" : "light"

    );

    appliquerTheme();

}

function initialiserTheme(){

    appliquerTheme();

    if(UI.theme){

        UI.theme.addEventListener(

            "click",

            changerTheme

        );

    }

}

/*=========================================================
 HISTORIQUE DES RECHERCHES
=========================================================*/

function chargerHistorique(){

    const data=

    localStorage.getItem(

        "historiqueRecherche"

    );

    if(data){

        historique=

        JSON.parse(data);

    }

}

function viderHistorique(){

    historique=[];

    localStorage.removeItem(

        "historiqueRecherche"

    );

}

/*=========================================================
 RECHERCHE RAPIDE
=========================================================*/

function rechercheRapide(texte){

    if(UI.recherche){

        UI.recherche.value=texte;

    }

    rechercherArticles(texte);

}

/*=========================================================
 BOUTON RETOUR EN HAUT
=========================================================*/

function retourHaut(){

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

}

const btnTop=

document.getElementById("btnTop");

if(btnTop){

    btnTop.addEventListener(

        "click",

        retourHaut

    );

}

/*=========================================================
 VERSION
=========================================================*/

console.log(

"===================================="

);

console.log(

APP.nom

);

console.log(

"Version :",APP.version

);

console.log(

"Pays :",APP.pays

);

console.log(

"Mode IA :",APP.modeIA

);

console.log(

"===================================="

);

/*=========================================================
 DÉMARRAGE COMPLET
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    async()=>{

        initialiserInterface();

        initialiserRecherche();

        initialiserMicrophone();

        initialiserTheme();

        chargerFavoris();

        chargerHistorique();

        await chargerBaseJuridique();

        notifier(

            "InspecteurBot IA prêt.",

            "success"

        );

    }

);

/*=========================================================
 FIN DU MODULE
=========================================================*/

console.log(

"✅ InspecteurBot IA RDC - Code du Travail 4.1 chargé avec succès."

);
