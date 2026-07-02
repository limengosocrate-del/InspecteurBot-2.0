"use strict";

/*=====================================================
      INSPECTEURBOT RDC
      CODE DU TRAVAIL
      VERSION 2026
=====================================================*/

/*=====================================================
INITIALISATION
=====================================================*/

console.clear();

console.log("======================================");
console.log("InspecteurBot RDC");
console.log("Code du Travail");
console.log("Version 2026");
console.log("======================================");

/*=====================================================
VARIABLES GLOBALES
=====================================================*/

let articles = [];
let categorieActive = "";
let articleActuel = 0;

let totalRecherches = 0;
let totalArticles = 0;
let totalFavoris = 0;
let totalAnalysesIA = 0;

/*=====================================================
RÉCUPÉRATION DES ÉLÉMENTS HTML
=====================================================*/

const numeroArticle = document.getElementById("numeroArticle");
const titreArticle = document.getElementById("titreArticle");
const contenuArticle = document.getElementById("contenuArticle");

const reponseIA = document.getElementById("reponseIA");

const champRecherche = document.getElementById("rechercheArticle");

const btnRecherche = document.getElementById("btnRecherche");

const btnTop = document.getElementById("btnTop");

const themeToggle = document.getElementById("themeToggle");

const themeIcon = document.getElementById("themeIcon");

/*=====================================================
ANIMATION D'APPARITION
=====================================================*/

function apparition(element){

    if(!element) return;

    element.animate([

        {
            opacity:0,
            transform:"translateY(30px)"
        },

        {
            opacity:1,
            transform:"translateY(0)"
        }

    ],{

        duration:500,

        easing:"ease-out"

    });

}

/*=====================================================
EFFET FUTURISTE SUR LES BOUTONS
=====================================================*/

function effetBoutons(){

    const boutons=document.querySelectorAll("button");

    boutons.forEach((btn)=>{

        btn.addEventListener("mouseenter",()=>{

            btn.style.transform="translateY(-3px) scale(1.03)";

        });

        btn.addEventListener("mouseleave",()=>{

            btn.style.transform="";

        });

        btn.addEventListener("mousedown",()=>{

            btn.style.transform="scale(.96)";

        });

        btn.addEventListener("mouseup",()=>{

            btn.style.transform="translateY(-3px) scale(1.03)";

        });

    });

}

/*=====================================================
INITIALISATION
=====================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    effetBoutons();

    apparition(document.querySelector(".search-section"));

    apparition(document.querySelector(".categories"));

    apparition(document.querySelector(".article-section"));

    apparition(document.querySelector(".ai-result"));

    console.log("Application initialisée.");

});

/*=====================================================
HORLOGE - DATE - JOUR
=====================================================*/

function mettreAJourHorloge() {

    const maintenant = new Date();

    const heure = maintenant.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

    const jour = maintenant.toLocaleDateString("fr-FR", {
        weekday: "long"
    });

    const date = maintenant.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

    const clock = document.getElementById("clock");
    const day = document.getElementById("day");
    const dateBox = document.getElementById("date");

    if (clock) clock.textContent = heure;

    if (day) {
        day.textContent =
            jour.charAt(0).toUpperCase() +
            jour.slice(1);
    }

    if (dateBox) dateBox.textContent = date;

}

setInterval(mettreAJourHorloge,1000);

mettreAJourHorloge();

/*=====================================================
MÉTÉO (TEMPORAIRE)
=====================================================*/

const temperature = document.getElementById("temperature");
const ville = document.getElementById("city");

if (temperature) {

    temperature.textContent = "26°C";

}

if (ville) {

    ville.textContent = "Kinshasa";

}

/*=====================================================
THÈME CLAIR / SOMBRE
=====================================================*/

function appliquerTheme(theme){

    document.body.classList.remove(
        "light-theme",
        "dark-theme"
    );

    document.body.classList.add(theme);

    if(themeIcon){

        themeIcon.textContent =
        theme==="dark-theme"
        ? "☀️"
        : "🌙";

    }

    localStorage.setItem("theme",theme);

}

const themeSauvegarde =
localStorage.getItem("theme");

if(themeSauvegarde){

    appliquerTheme(themeSauvegarde);

}else{

    appliquerTheme("light-theme");

}

themeToggle?.addEventListener("click",()=>{

    if(document.body.classList.contains("dark-theme")){

        appliquerTheme("light-theme");

    }else{

        appliquerTheme("dark-theme");

    }

});

/*=====================================================
BOUTON RETOUR EN HAUT
=====================================================*/

window.addEventListener("scroll",()=>{

    if(!btnTop) return;

    if(window.scrollY>300){

        btnTop.style.display="flex";

    }else{

        btnTop.style.display="none";

    }

});

btnTop?.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/*=====================================================
EFFET FUTURISTE D'APPARITION
=====================================================*/

const cartes = document.querySelectorAll(

".category-card,.article-card,.ai-result"

);

const observateur = new IntersectionObserver(

(entrees)=>{

    entrees.forEach((entree)=>{

        if(entree.isIntersecting){

            entree.target.classList.add("show");

        }

    });

},

{

    threshold:0.15

}

);

cartes.forEach((carte)=>{

    observateur.observe(carte);

});

console.log("Horloge, thème et animations chargés.");

/*=====================================================
BASE DES CATÉGORIES
=====================================================*/

const categories = {

    contrat: [],

    salaire: [],

    conges: [],

    temps: [],

    licenciement: [],

    inspection: [],

    securite: [],

    sanctions: []

};

/*=====================================================
OUVRIR UNE CATÉGORIE
=====================================================*/

function ouvrirCategorie(nomCategorie){

    if(!categories[nomCategorie]){

        afficherNotification(
            "Catégorie introuvable.",
            "error"
        );

        return;

    }

    categorieActive = nomCategorie;

    articles = categories[nomCategorie];

    articleActuel = 0;

    if(articles.length===0){

        numeroArticle.textContent="Aucun article";

        titreArticle.textContent="Base de données en préparation";

        contenuArticle.innerHTML=

        "Les articles de cette catégorie seront automatiquement affichés dès que la base complète du Code du Travail sera chargée.";

        return;

    }

    afficherArticle(articleActuel);

}

/*=====================================================
AFFICHER UN ARTICLE
=====================================================*/

function afficherArticle(index){

    if(index<0) return;

    if(index>=articles.length) return;

    articleActuel=index;

    const article=articles[index];

    numeroArticle.textContent=

    article.numero || "";

    titreArticle.textContent=

    article.titre || "";

    contenuArticle.innerHTML=

    article.contenu || "";

    totalArticles++;

    apparition(document.querySelector(".article-card"));

    mettreAJourStatistiques();

}

/*=====================================================
ARTICLE SUIVANT
=====================================================*/

function articleSuivant(){

    if(articleActuel<articles.length-1){

        afficherArticle(articleActuel+1);

    }else{

        afficherNotification(

        "Dernier article.",

        "info"

        );

    }

}

/*=====================================================
ARTICLE PRÉCÉDENT
=====================================================*/

function articlePrecedent(){

    if(articleActuel>0){

        afficherArticle(articleActuel-1);

    }else{

        afficherNotification(

        "Premier article.",

        "info"

        );

    }

}

/*=====================================================
BOUTONS CLAVIER
=====================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.key==="ArrowRight"){

        articleSuivant();

    }

    if(e.key==="ArrowLeft"){

        articlePrecedent();

    }

});

/*=====================================================
MISE À JOUR DES STATISTIQUES
=====================================================*/

function mettreAJourStatistiques(){

    const a=document.getElementById("statArticles");

    const r=document.getElementById("statRecherche");

    const f=document.getElementById("statFavoris");

    const ia=document.getElementById("statIA");

    if(a) a.textContent=totalArticles;

    if(r) r.textContent=totalRecherches;

    if(f) f.textContent=totalFavoris;

    if(ia) ia.textContent=totalAnalysesIA;

}

console.log("Navigation des articles chargée.");

/*=====================================================
BASE DE DONNÉES DES ARTICLES
PARTIE 1
=====================================================*/

categories.contrat = [

{
    numero: "Article 1",
    titre: "Objet du Code du Travail",
    contenu: `
    Le présent Code fixe les règles applicables aux relations
    individuelles et collectives de travail en République
    Démocratique du Congo.
    `
},

{
    numero: "Article 2",
    titre: "Champ d'application",
    contenu: `
    Les dispositions du Code du Travail s'appliquent aux
    travailleurs et employeurs soumis à la législation
    congolaise, sauf exceptions prévues par la loi.
    `
},

{
    numero: "Article 3",
    titre: "Liberté du travail",
    contenu: `
    Toute personne est libre d'exercer une activité
    professionnelle dans les conditions prévues par la loi.
    `
},

{
    numero: "Article 4",
    titre: "Égalité de traitement",
    contenu: `
    Toute discrimination en matière d'emploi ou de profession
    est interdite conformément aux lois de la République.
    `
},

{
    numero: "Article 5",
    titre: "Protection du travailleur",
    contenu: `
    Le travailleur bénéficie de la protection prévue par le
    Code du Travail concernant la sécurité, la santé,
    la rémunération et les droits sociaux.
    `
},

 

