/*=========================================================
 INSPECTEURBOT IA RDC
 MODULE : CODE DU TRAVAIL
 Version : 4.0
 Développeur : Inspecteur Limengo (Pmiller)
=========================================================*/

"use strict";

/*=========================================================
 CONFIGURATION
=========================================================*/

const APP = {

    nom: "InspecteurBot IA",

    version: "4.0",

    pays: "République Démocratique du Congo",

    langue: "fr",

    fichierJSON: "assets/data/code-travail.json",

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
 INITIALISATION DES ÉLÉMENTS
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

function notifier(message){

    if(APP.debug){

        console.log("[InspecteurBot] " + message);

    }

}

/*=========================================================
 DÉMARRAGE
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initialiserInterface();

    notifier("Application démarrée.");

});

/*=========================================================
 PARTIE 2
 CHARGEMENT DU CODE DU TRAVAIL
=========================================================*/

/*=========================================================
 CHARGER LE FICHIER JSON
=========================================================*/

async function chargerBaseJuridique() {

    try {

        notifier("Chargement de la base juridique...");

        const reponse = await fetch(APP.fichierJSON);

        if (!reponse.ok) {

            throw new Error("Impossible de charger le fichier JSON.");

        }

        articles = await reponse.json();

        if (!Array.isArray(articles)) {

            throw new Error("Le fichier JSON est invalide.");

        }

        articlesFiltres = [...articles];

        Etat.baseChargee = true;

        notifier(articles.length + " articles chargés.");

        afficherAccueil();

    }

    catch (erreur) {

        console.error(erreur);

        Etat.baseChargee = false;

        afficherErreur(
            "Impossible de charger le Code du Travail."
        );

    }

}

/*=========================================================
 PAGE D'ACCUEIL
=========================================================*/

function afficherAccueil() {

    if (!UI.zoneIA) return;

    UI.zoneIA.innerHTML = `

        <h3>🤖 InspecteurBot IA</h3>

        <p>

            ✅ Base juridique chargée avec succès.

        </p>

        <p>

            <strong>${articles.length}</strong>

            articles du Code du Travail sont disponibles.

        </p>

        <p>

            Recherchez un article par numéro,

            mot-clé ou posez directement une question.

        </p>

    `;

}

/*=========================================================
 ERREUR
=========================================================*/

function afficherErreur(message) {

    if (!UI.zoneIA) return;

    UI.zoneIA.innerHTML = `

        <h3>❌ Erreur</h3>

        <p>${message}</p>

    `;

}

/*=========================================================
 VÉRIFICATION
=========================================================*/

function baseChargee() {

    return Etat.baseChargee;

}

/*=========================================================
 CHARGEMENT AUTOMATIQUE
=========================================================*/

document.addEventListener("DOMContentLoaded", async () => {

    await chargerBaseJuridique();

});


/*=========================================================
 PARTIE 3
 MOTEUR DE RECHERCHE
=========================================================*/

/*=========================================================
 RECHERCHE D'UN ARTICLE
=========================================================*/

function rechercherArticles(texte) {

    if (!Etat.baseChargee) {

        afficherErreur("La base juridique n'est pas encore chargée.");

        return;

    }

    texte = texte.trim().toLowerCase();

    if (texte === "") {

        afficherAccueil();

        return;

    }

    articlesFiltres = articles.filter(article => {

        return (

            String(article.numero).toLowerCase().includes(texte) ||

            String(article.titre).toLowerCase().includes(texte) ||

            String(article.contenu).toLowerCase().includes(texte)

        );

    });

    afficherResultats();

}

/*=========================================================
 AFFICHER LES RÉSULTATS
=========================================================*/

function afficherResultats() {

    if (!UI.zoneIA) return;

    if (articlesFiltres.length === 0) {

        UI.zoneIA.innerHTML = `

            <h3>🤖 InspecteurBot IA</h3>

            <p>Aucun article trouvé.</p>

        `;

        return;

    }

    let html = `

        <h3>

            ${articlesFiltres.length}

            résultat(s)

        </h3>

    `;

    articlesFiltres.forEach(article => {

        html += `

        <div class="result-card">

            <h4>

                Article ${article.numero}

            </h4>

            <strong>

                ${article.titre}

            </strong>

            <p>

                ${article.contenu.substring(0,200)}...

            </p>

            <button onclick="ouvrirArticle('${article.numero}')">

                📖 Lire l'article

            </button>

        </div>

        `;

    });

    UI.zoneIA.innerHTML = html;

}

/*=========================================================
 BOUTON RECHERCHER
=========================================================*/

if (UI.boutonRecherche) {

    UI.boutonRecherche.addEventListener("click", () => {

        rechercherArticles(UI.recherche.value);

    });

}

/*=========================================================
 TOUCHE ENTRÉE
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    if (UI.recherche) {

        UI.recherche.addEventListener("keydown", e => {

            if (e.key === "Enter") {

                e.preventDefault();

                rechercherArticles(UI.recherche.value);

            }

        });

    }

});

/*=========================================================
 PARTIE 4
 OUVERTURE ET NAVIGATION DES ARTICLES
=========================================================*/

/*=========================================================
 OUVRIR UN ARTICLE
=========================================================*/

function ouvrirArticle(numero) {

    const article = articles.find(a =>
        String(a.numero) === String(numero)
    );

    if (!article) {

        afficherErreur("Article introuvable.");

        return;

    }

    dernierArticle = article;

    indexArticle = articles.findIndex(a =>
        String(a.numero) === String(numero)
    );

    if (UI.numeroArticle)
        UI.numeroArticle.textContent =
            "Article " + article.numero;

    if (UI.titreArticle)
        UI.titreArticle.textContent =
            article.titre;

    if (UI.contenuArticle)
        UI.contenuArticle.innerHTML =
            article.contenu;

    if (UI.reponseIA) {

        UI.reponseIA.innerHTML = `
            Article affiché avec succès.<br><br>
            Cliquez sur <strong>« Expliquer avec l'IA »</strong>
            pour obtenir une explication simplifiée.
        `;

    }

    document.querySelector(".article-section")
        ?.scrollIntoView({
            behavior: "smooth"
        });

}

/*=========================================================
 ARTICLE SUIVANT
=========================================================*/

function articleSuivant() {

    if (indexArticle < 0)
        return;

    if (indexArticle >= articles.length - 1)
        return;

    indexArticle++;

    ouvrirArticle(
        articles[indexArticle].numero
    );

}

/*=========================================================
 ARTICLE PRÉCÉDENT
=========================================================*/

function articlePrecedent() {

    if (indexArticle <= 0)
        return;

    indexArticle--;

    ouvrirArticle(
        articles[indexArticle].numero
    );

}

/*=========================================================
 COPIER L'ARTICLE
=========================================================*/

function copierArticle() {

    if (!dernierArticle)
        return;

    const texte =

        "Article " +
        dernierArticle.numero +

        "\n\n" +

        dernierArticle.titre +

        "\n\n" +

        dernierArticle.contenu;

    navigator.clipboard.writeText(texte);

    if (UI.reponseIA) {

        UI.reponseIA.innerHTML = `
            ✅ Article copié dans le presse-papiers.
        `;

    }

}

/*=========================================================
 IMPRIMER
=========================================================*/

function imprimerArticle() {

    window.print();

}

/*=========================================================
 PARTAGER
=========================================================*/

async function partagerArticle() {

    if (!dernierArticle)
        return;

    const texte =

        "Article " +
        dernierArticle.numero +

        "\n\n" +

        dernierArticle.titre +

        "\n\n" +

        dernierArticle.contenu;

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
 PARTIE 5
 IA - LECTURE VOCALE - FAVORIS
=========================================================*/

/*=========================================================
 EXPLIQUER AVEC L'IA
=========================================================*/

async function expliquerIA() {

    if (!dernierArticle) {

        UI.reponseIA.innerHTML = `
            <h3>🤖 InspecteurBot IA</h3>
            <p>Veuillez d'abord ouvrir un article.</p>
        `;

        return;

    }

    UI.reponseIA.innerHTML = `
        <h3>🤖 InspecteurBot IA</h3>
        <p>⏳ Analyse en cours...</p>
    `;

    const question = `
Explique simplement cet article du Code du Travail de la RDC.

Article ${dernierArticle.numero}

Titre :
${dernierArticle.titre}

Texte :
${dernierArticle.contenu}
`;

    const reponse = await demanderIA(question);

    UI.reponseIA.innerHTML = `
        <h3>🤖 InspecteurBot IA</h3>
        <p>${String(reponse).replace(/\n/g,"<br>")}</p>
    `;

}

/*=========================================================
 LECTURE VOCALE
=========================================================*/

function parlerArticle() {

    if (!dernierArticle)
        return;

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

    speechSynthesis.speak(lecture);

}

/*=========================================================
 FAVORIS
=========================================================*/

function ajouterFavori() {

    if (!dernierArticle)
        return;

    if (favoris.find(a => a.numero == dernierArticle.numero)) {

        UI.reponseIA.innerHTML = `
        ⭐ Cet article est déjà enregistré.
        `;

        return;

    }

    favoris.push(dernierArticle);

    localStorage.setItem(

        "favorisCodeTravail",

        JSON.stringify(favoris)

    );

    UI.reponseIA.innerHTML = `
        ⭐ Article ajouté aux favoris.
    `;

}

/*=========================================================
 CHARGER LES FAVORIS
=========================================================*/

function chargerFavoris() {

    const data = localStorage.getItem("favorisCodeTravail");

    if (data) {

        favoris = JSON.parse(data);

    }

}

/*=========================================================
 MICROPHONE
=========================================================*/

if ("webkitSpeechRecognition" in window ||
    "SpeechRecognition" in window) {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";

    recognition.interimResults = false;

    recognition.continuous = false;

    if (UI.btnMicro) {

        UI.btnMicro.addEventListener("click", () => {

            recognition.start();

        });

    }

    recognition.onresult = (event) => {

        const texte = event.results[0][0].transcript;

        UI.recherche.value = texte;

        rechercherArticles(texte);

    };

}

/*=========================================================
 CHARGEMENT DES FAVORIS
=========================================================*/

chargerFavoris();

console.log("✅ Partie 5 chargée.");

/*=========================================================
 PARTIE 6
 FINALISATION DE L'APPLICATION
=========================================================*/

/*=========================================================
 HORLOGE
=========================================================*/

function mettreAJourHorloge() {

    if (!UI.horloge) return;

    UI.horloge.textContent = new Date().toLocaleTimeString(
        "fr-FR",
        {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        }
    );

}

setInterval(mettreAJourHorloge,1000);

mettreAJourHorloge();

/*=========================================================
 THÈME CLAIR / SOMBRE
=========================================================*/

function changerTheme(){

    document.body.classList.toggle("dark-theme");

    if(document.body.classList.contains("dark-theme")){

        localStorage.setItem("theme","dark");

        if(UI.iconTheme){

            UI.iconTheme.textContent="☀️";

        }

    }else{

        localStorage.setItem("theme","light");

        if(UI.iconTheme){

            UI.iconTheme.textContent="🌙";

        }

    }

}

if(UI.theme){

    UI.theme.addEventListener("click",changerTheme);

}

if(localStorage.getItem("theme")==="dark"){

    document.body.classList.add("dark-theme");

    if(UI.iconTheme){

        UI.iconTheme.textContent="☀️";

    }

}

/*=========================================================
 RECHERCHES RAPIDES
=========================================================*/

function rechercheRapide(texte){

    if(UI.recherche){

        UI.recherche.value=texte;

    }

    rechercherArticles(texte);

}

/*=========================================================
 HISTORIQUE
=========================================================*/

function ajouterHistorique(texte){

    if(!texte) return;

    historique.unshift(texte);

    historique=[...new Set(historique)];

    historique=historique.slice(0,20);

    localStorage.setItem(

        "historiqueRecherche",

        JSON.stringify(historique)

    );

}

const historiqueSauve=

localStorage.getItem("historiqueRecherche");

if(historiqueSauve){

    historique=JSON.parse(historiqueSauve);

}

/*=========================================================
 VERSION
=========================================================*/

console.log(

"========================================"

);

console.log(

APP.nom,

APP.version,

"chargé avec succès"

);

console.log(

"Articles :",articles.length

);

console.log(

"IA :",APP.modeIA

);

console.log(

"========================================"

/*=========================================================
 FIN
=========================================================*/
);

document.addEventListener("DOMContentLoaded",()=>{

    notifier("InspecteurBot IA prêt.");

});
