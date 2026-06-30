/*=========================================================
 INSPECTEURBOT IA RDC
 MODULE : CODE DU TRAVAIL
 Version : 4.2
 Développeur : Inspecteur Limengo (Pmiller)
=========================================================*/

"use strict";

/*=========================================================
 CONFIGURATION
=========================================================*/

const APP = {

    nom: "InspecteurBot IA",

    version: "4.2",

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
    rechercheEnCours: false,
    initialisee: false

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

function notifier(message, type = "info"){

    if(APP.debug){

        console.log(
            "[" + type.toUpperCase() + "]",
            message
        );

    }

     }

/*=========================================================
 PARTIE 2
 CHARGEMENT DE LA BASE JURIDIQUE
 Version 4.2
=========================================================*/

/*=========================================================
 OUTILS
=========================================================*/

function tronquerTexte(texte, longueur = 250){

    texte = String(texte || "");

    if(texte.length <= longueur){

        return texte;

    }

    return texte.substring(0, longueur) + "...";

}

function nettoyerTexte(texte){

    return String(texte || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

}

/*=========================================================
 CHARGER LE CODE DU TRAVAIL
=========================================================*/

async function chargerBaseJuridique(){

    try{

        notifier("Chargement de la base juridique...","info");

        const reponse = await fetch(APP.fichierJSON);

        if(!reponse.ok){

            throw new Error("Erreur de chargement du fichier JSON.");

        }

        const donnees = await reponse.json();

        if(!Array.isArray(donnees)){

            throw new Error("Le fichier JSON est invalide.");

        }

        articles = donnees;

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
            "Impossible de charger la base juridique."
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

            <h2>⚖️ InspecteurBot IA RDC</h2>

            <p>

                Bienvenue dans le Code du Travail
                de la République Démocratique du Congo.

            </p>

            <p>

                <strong>${articles.length}</strong>
                articles sont disponibles.

            </p>

            <p>

                Utilisez la barre de recherche
                pour rechercher un article,
                un mot-clé ou un numéro.

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

console.log("✅ Partie 2 chargée.");

/*=========================================================
 PARTIE 3
 MOTEUR DE RECHERCHE
 Version 4.2
=========================================================*/

/*=========================================================
 RECHERCHER DES ARTICLES
=========================================================*/

function rechercherArticles(texte){

    if(!Etat.baseChargee){

        afficherErreur(
            "La base juridique n'est pas encore chargée."
        );

        return;

    }

    texte = nettoyerTexte(texte);

    if(texte === ""){

        articlesFiltres = [...articles];

        afficherAccueil();

        return;

    }

    historique.unshift(texte);

    historique = [...new Set(historique)];

    historique = historique.slice(0,20);

    localStorage.setItem(
        "historiqueRecherche",
        JSON.stringify(historique)
    );

    articlesFiltres = articles.filter(article=>{

        const numero = nettoyerTexte(article.numero);

        const titre = nettoyerTexte(article.titre);

        const contenu = nettoyerTexte(article.contenu);

        return (
            numero.includes(texte) ||
            titre.includes(texte) ||
            contenu.includes(texte)
        );

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

    UI.zoneIA.innerHTML = "";

    if(articlesFiltres.length === 0){

        UI.zoneIA.innerHTML = `

        <div class="aucun-resultat">

            <h2>🔍 Aucun résultat</h2>

            <p>

                Aucun article ne correspond
                à votre recherche.

            </p>

        </div>

        `;

        return;

    }

    articlesFiltres.forEach(article=>{

        const carte = document.createElement("div");

        carte.className = "result-card";

        carte.innerHTML = `

            <h3>Article ${article.numero}</h3>

            <strong>${article.titre}</strong>

            <p>

                ${tronquerTexte(article.contenu,220)}

            </p>

            <button class="btn-lire">

                📖 Lire l'article

            </button>

        `;

        carte
            .querySelector(".btn-lire")
            .addEventListener(
                "click",
                ()=>ouvrirArticle(article.numero)
            );

        UI.zoneIA.appendChild(carte);

    });

}

/*=========================================================
 ÉVÉNEMENTS DE RECHERCHE
=========================================================*/

function initialiserRecherche(){

    if(UI.boutonRecherche){

        UI.boutonRecherche.onclick = ()=>{

            rechercherArticles(
                UI.recherche.value
            );

        };

    }

    if(UI.recherche){

        UI.recherche.addEventListener(
            "keydown",
            function(e){

                if(e.key==="Enter"){

                    e.preventDefault();

                    rechercherArticles(
                        UI.recherche.value
                    );

                }

            }
        );

        UI.recherche.addEventListener(
            "input",
            function(){

                if(
                    this.value.trim()===""
                ){

                    afficherAccueil();

                }

            }
        );

    }

}

console.log("✅ Partie 3 chargée.");

/*=========================================================
 PARTIE 4A
 OUVERTURE ET NAVIGATION DES ARTICLES
 Version 4.2
=========================================================*/

/*=========================================================
 OUVRIR UN ARTICLE
=========================================================*/

function ouvrirArticle(numero){

    const article = articles.find(function(a){
        return String(a.numero) === String(numero);
    });

    if(!article){

        afficherErreur("Article introuvable.");

        return;

    }

    dernierArticle = article;

    indexArticle = articles.findIndex(function(a){
        return String(a.numero) === String(numero);
    });

    if(UI.numeroArticle){
        UI.numeroArticle.textContent =
            "Article " + article.numero;
    }

    if(UI.titreArticle){
        UI.titreArticle.textContent =
            article.titre || "";
    }

    if(UI.contenuArticle){
        UI.contenuArticle.innerHTML =
            article.contenu || "";
    }

    if(UI.reponseIA){

        UI.reponseIA.innerHTML = `

            <h3>🤖 InspecteurBot IA</h3>

            <p>

                L'article a été chargé avec succès.

            </p>

            <p>

                Cliquez sur
                <strong>Expliquer avec l'IA</strong>
                pour obtenir une explication.

            </p>

        `;

    }

    const section = document.querySelector(".article-section");

    if(section){

        section.scrollIntoView({

            behavior: "smooth",
            block: "start"

        });

    }

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
 PREMIER ARTICLE
=========================================================*/

function premierArticle(){

    if(articles.length === 0){

        return;

    }

    ouvrirArticle(

        articles[0].numero

    );

}

/*=========================================================
 DERNIER ARTICLE
=========================================================*/

function dernierArticleListe(){

    if(articles.length === 0){

        return;

    }

    ouvrirArticle(

        articles[
            articles.length - 1
        ].numero

    );

}

console.log("✅ Partie 4A chargée.");

/*=========================================================
 PARTIE 4B
 COPIER • IMPRIMER • PARTAGER
 Version 4.2
=========================================================*/

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

            UI.reponseIA.innerHTML = `

                <h3>✅ Copie réussie</h3>

                <p>

                    L'article a été copié
                    dans le presse-papiers.

                </p>

            `;

        }

    }

    catch(e){

        console.error(e);

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

                title:
                "Code du Travail RDC",

                text: texte

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
 EXPORTER LE TEXTE DE L'ARTICLE
=========================================================*/

function texteArticleActuel(){

    if(!dernierArticle){

        return "";

    }

    return (

        "Article " +

        dernierArticle.numero +

        "\n\n" +

        dernierArticle.titre +

        "\n\n" +

        dernierArticle.contenu

    );

}

console.log("✅ Partie 4B chargée.");

/*=========================================================
 PARTIE 5A
 IA • EXPLICATION • RÉSUMÉ
 Version 4.2
=========================================================*/

/*=========================================================
 EXPLIQUER L'ARTICLE AVEC L'IA
=========================================================*/

async function expliquerIA(){

    if(!dernierArticle){

        if(UI.reponseIA){

            UI.reponseIA.innerHTML = `

                <h3>🤖 InspecteurBot IA</h3>

                <p>

                    Veuillez d'abord ouvrir un article.

                </p>

            `;

        }

        return;

    }

    if(UI.reponseIA){

        UI.reponseIA.innerHTML = `

            <h3>🤖 InspecteurBot IA</h3>

            <p>

                ⏳ Analyse de l'article en cours...

            </p>

        `;

    }

    try{

        if(typeof demanderIA === "function"){

            const question = `

Tu es un expert en droit du travail de la République Démocratique du Congo.

Explique simplement l'article suivant.

Article : ${dernierArticle.numero}

Titre :
${dernierArticle.titre}

Texte :
${dernierArticle.contenu}

Donne une explication claire, avec des exemples simples lorsque c'est utile.

`;

            const reponse = await demanderIA(question);

            if(UI.reponseIA){

                UI.reponseIA.innerHTML = `

                    <h3>🤖 Explication de l'IA</h3>

                    <p>

                        ${String(reponse).replace(/\n/g,"<br>")}

                    </p>

                `;

            }

        }

        else{

            if(UI.reponseIA){

                UI.reponseIA.innerHTML = `

                    <h3>🤖 InspecteurBot IA</h3>

                    <p>

                        Le module d'intelligence artificielle
                        n'est pas encore connecté.

                    </p>

                `;

            }

        }

    }

    catch(erreur){

        console.error(erreur);

        if(UI.reponseIA){

            UI.reponseIA.innerHTML = `

                <h3>❌ Erreur</h3>

                <p>

                    Impossible d'obtenir une réponse de l'IA.

                </p>

            `;

        }

    }

}

/*=========================================================
 RÉSUMÉ RAPIDE
=========================================================*/

function resumeArticle(){

    if(!dernierArticle){

        return;

    }

    let contenu = dernierArticle.contenu || "";

    contenu = contenu.replace(/\s+/g," ").trim();

    if(UI.reponseIA){

        UI.reponseIA.innerHTML = `

            <h3>📝 Résumé rapide</h3>

            <p>

                ${tronquerTexte(contenu,500)}

            </p>

        `;

    }

}

console.log("✅ Partie 5A chargée.");

/*=========================================================
 PARTIE 5B
 LECTURE VOCALE
 Version 4.2
=========================================================*/

/*=========================================================
 LIRE L'ARTICLE
=========================================================*/

function parlerArticle(){

    if(!dernierArticle){

        if(UI.reponseIA){

            UI.reponseIA.innerHTML = `

                <h3>🔊 Lecture vocale</h3>

                <p>

                    Veuillez ouvrir un article.

                </p>

            `;

        }

        return;

    }

    if(!("speechSynthesis" in window)){

        if(UI.reponseIA){

            UI.reponseIA.innerHTML = `

                <h3>❌ Lecture vocale</h3>

                <p>

                    Votre navigateur ne prend pas
                    en charge la lecture vocale.

                </p>

            `;

        }

        return;

    }

    speechSynthesis.cancel();

    const texte =

        "Article " +

        dernierArticle.numero +

        ". " +

        dernierArticle.titre +

        ". " +

        dernierArticle.contenu;

    const lecture = new SpeechSynthesisUtterance(texte);

    lecture.lang = "fr-FR";

    lecture.rate = 1;

    lecture.pitch = 1;

    lecture.volume = 1;

    lecture.onstart = function(){

        notifier("Lecture démarrée.","info");

    };

    lecture.onend = function(){

        notifier("Lecture terminée.","success");

    };

    lecture.onerror = function(){

        notifier("Erreur de lecture.","error");

    };

    speechSynthesis.speak(lecture);

}

/*=========================================================
 METTRE EN PAUSE
=========================================================*/

function pauseLecture(){

    if("speechSynthesis" in window){

        speechSynthesis.pause();

    }

}

/*=========================================================
 REPRENDRE LA LECTURE
=========================================================*/

function reprendreLecture(){

    if("speechSynthesis" in window){

        speechSynthesis.resume();

    }

}

/*=========================================================
 ARRÊTER LA LECTURE
=========================================================*/

function arreterLecture(){

    if("speechSynthesis" in window){

        speechSynthesis.cancel();

        notifier("Lecture arrêtée.","info");

    }

}

console.log("✅ Partie 5B chargée.");

/*=========================================================
 PARTIE 5C
 FAVORIS • MICROPHONE • INITIALISATION
 Version 4.2
=========================================================*/

/*=========================================================
 AJOUTER AUX FAVORIS
=========================================================*/

function ajouterFavori(){

    if(!dernierArticle){

        return;

    }

    const existe = favoris.find(function(article){

        return String(article.numero) ===
               String(dernierArticle.numero);

    });

    if(existe){

        if(UI.reponseIA){

            UI.reponseIA.innerHTML = `

                <h3>⭐ Favoris</h3>

                <p>

                    Cet article est déjà enregistré.

                </p>

            `;

        }

        return;

    }

    favoris.push(dernierArticle);

    localStorage.setItem(
        "favorisCodeTravail",
        JSON.stringify(favoris)
    );

    if(UI.reponseIA){

        UI.reponseIA.innerHTML = `

            <h3>⭐ Favoris</h3>

            <p>

                Article ajouté avec succès.

            </p>

        `;

    }

}

/*=========================================================
 CHARGER LES FAVORIS
=========================================================*/

function chargerFavoris(){

    try{

        const data = localStorage.getItem(
            "favorisCodeTravail"
        );

        favoris = data
            ? JSON.parse(data)
            : [];

    }

    catch(e){

        favoris = [];

    }

}

/*=========================================================
 MICROPHONE
=========================================================*/

function initialiserMicrophone(){

    const API =

        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!API){

        notifier(
            "Reconnaissance vocale indisponible.",
            "info"
        );

        return;

    }

    const reconnaissance = new API();

    reconnaissance.lang = "fr-FR";

    reconnaissance.continuous = false;

    reconnaissance.interimResults = false;

    reconnaissance.onresult = function(event){

        const texte =
            event.results[0][0].transcript;

        if(UI.recherche){

            UI.recherche.value = texte;

        }

        rechercherArticles(texte);

    };

    reconnaissance.onerror = function(e){

        console.error(e);

    };

    if(UI.btnMicro){

        UI.btnMicro.addEventListener(

            "click",

            function(){

                reconnaissance.start();

            }

        );

    }

}

/*=========================================================
 INITIALISATION DES MODULES
=========================================================*/

function initialiserModules(){

    chargerFavoris();

    initialiserMicrophone();

}

console.log("✅ Partie 5C chargée.");

/*=========================================================
 PARTIE 6A
 HORLOGE • THÈME • HISTORIQUE • RETOUR EN HAUT
 Version 4.2
=========================================================*/

/*=========================================================
 HORLOGE
=========================================================*/

function mettreAJourHorloge(){

    if(!UI.horloge){

        return;

    }

    const maintenant = new Date();

    UI.horloge.textContent =
        maintenant.toLocaleTimeString(
            "fr-FR",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );

}

/*=========================================================
 THÈME CLAIR / SOMBRE
=========================================================*/

function appliquerTheme(){

    const theme =
        localStorage.getItem("theme") || "light";

    if(theme === "dark"){

        document.body.classList.add("dark-theme");

        if(UI.iconTheme){

            UI.iconTheme.textContent = "☀️";

        }

    }else{

        document.body.classList.remove("dark-theme");

        if(UI.iconTheme){

            UI.iconTheme.textContent = "🌙";

        }

    }

}

function changerTheme(){

    document.body.classList.toggle("dark-theme");

    localStorage.setItem(

        "theme",

        document.body.classList.contains("dark-theme")
            ? "dark"
            : "light"

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

    try{

        const data = localStorage.getItem(
            "historiqueRecherche"
        );

        historique = data
            ? JSON.parse(data)
            : [];

    }

    catch(e){

        historique = [];

    }

}

function viderHistorique(){

    historique = [];

    localStorage.removeItem(
        "historiqueRecherche"
    );

}

/*=========================================================
 RECHERCHE RAPIDE
=========================================================*/

function rechercheRapide(texte){

    if(UI.recherche){

        UI.recherche.value = texte;

    }

    rechercherArticles(texte);

}

/*=========================================================
 RETOUR EN HAUT
=========================================================*/

function retourHaut(){

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

function initialiserBoutonTop(){

    const bouton = document.getElementById("btnTop");

    if(!bouton){

        return;

    }

    bouton.addEventListener(

        "click",

        retourHaut

    );

}

console.log("✅ Partie 6A chargée.");

/*=========================================================
 PARTIE 6B
 DÉMARRAGE UNIQUE ET FINALISATION
 Version 4.2
=========================================================*/

/*=========================================================
 DÉMARRAGE UNIQUE DE L'APPLICATION
=========================================================*/

document.addEventListener("DOMContentLoaded", async function(){

    try{

        notifier("Initialisation de l'application...","info");

        initialiserInterface();

        initialiserRecherche();

        initialiserTheme();

        initialiserMicrophone();

        initialiserBoutonTop();

        chargerFavoris();

        chargerHistorique();

        mettreAJourHorloge();

        setInterval(mettreAJourHorloge,1000);

        await chargerBaseJuridique();

        Etat.initialisee = true;

        notifier(
            "InspecteurBot IA prêt.",
            "success"
        );

    }

    catch(erreur){

        console.error(erreur);

        afficherErreur(
            "Erreur lors du démarrage de l'application."
        );

    }

});

/*=========================================================
 INFORMATIONS DE VERSION
=========================================================*/

console.log("======================================");

console.log(APP.nom);

console.log("Version :", APP.version);

console.log("Pays :", APP.pays);

console.log("Langue :", APP.langue);

console.log("Mode IA :", APP.modeIA ? "Activé" : "Désactivé");

console.log("======================================");

console.log("✅ InspecteurBot IA RDC - Code du Travail 4.2 chargé avec succès.");
