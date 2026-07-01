"use strict";

/* ===================================================
   INSPECTEURBOT IA RDC
   MODULE : CODE DU TRAVAIL
   Version 2.0
=================================================== */

const APP = {

    json: "code-travail.json",

    langue: localStorage.getItem("langue") || "fr"

};

let articles = [];
let articleActuel = null;
let statistiques = {
    recherches:0,
    consultations:0,
    ia:0
};

const LANG = {

fr:{
recherche:"Recherche",
favori:"Ajouter aux favoris",
partager:"Partager",
imprimer:"Imprimer",
lecture:"Lecture vocale",
aucun:"Aucun résultat trouvé.",
charger:"Chargement..."
},

ln:{
recherche:"Boluki",
favori:"Bakisa na Favori",
partager:"Kabola",
imprimer:"Bimisa",
lecture:"Kotanga na mongongo",
aucun:"Eloko ezwami te.",
charger:"Kozwa ba données..."
},

kg:{
recherche:"Sosa",
favori:"Bika na Favori",
partager:"Kabula",
imprimer:"Bimisa",
lecture:"Tanga",
aucun:"Kima me monika ko.",
charger:"Kubaka ba données..."
},

lu:{
recherche:"Kusangisha",
favori:"Bika mu Favori",
partager:"Kabanya",
imprimer:"Imprimer",
lecture:"Kubala",
aucun:"Kakuyi bipeta.",
charger:"Kulonda..."
},

sw:{
recherche:"Tafuta",
favori:"Ongeza kwenye Vipendwa",
partager:"Shiriki",
imprimer:"Chapisha",
lecture:"Soma kwa sauti",
aucun:"Hakuna matokeo.",
charger:"Inapakia..."
}

};

function T(cle){

    return LANG[APP.langue][cle] || cle;

}

async function chargerArticles(){

    try{

        const r=await fetch(APP.json);

        articles=await r.json();

        document.getElementById("compteurArticles").textContent=
        articles.length+" articles";

        afficherArticles(articles);

    }catch(e){

        document.getElementById("listeArticles").innerHTML=
        "<h3>Erreur de chargement.</h3>";

    }

}

/* ===================================================
   RECHERCHE INTELLIGENTE
=================================================== */

function rechercherArticles() {

    const mot = document
        .getElementById("rechercheArticle")
        .value
        .toLowerCase()
        .trim();

    statistiques.recherches++;
    document.getElementById("statRecherche").textContent =
        statistiques.recherches;

    if (mot === "") {

        afficherArticles(articles);
        return;

    }

    const resultat = articles.filter(article => {

        const mots = (article.motsCles || [])
            .join(" ")
            .toLowerCase();

        return (

            article.numero.toString().includes(mot) ||

            article.titre.toLowerCase().includes(mot) ||

            article.contenu.toLowerCase().includes(mot) ||

            mots.includes(mot)

        );

    });

    afficherArticles(resultat);

}

/* ==========================================
   EVENEMENTS RECHERCHE
========================================== */

document
.getElementById("btnRecherche")
.addEventListener("click", rechercherArticles);

document
.getElementById("rechercheArticle")
.addEventListener("keyup", function(e){

    if(e.key==="Enter"){

        rechercherArticles();

    }

});

/* ===================================================
   AFFICHAGE DES ARTICLES
=================================================== */

function afficherArticles(liste){

    const zone = document.getElementById("listeArticles");

    zone.innerHTML="";

    if(liste.length===0){

        zone.innerHTML=`
        <p style="padding:25px;text-align:center;">
        ${T("aucun")}
        </p>`;

        return;

    }

    liste.forEach(article=>{

        zone.innerHTML+=`

        <div class="quick-card" style="margin-bottom:15px;">

            <h3>
                Article ${article.numero}
            </h3>

            <h4>${article.titre}</h4>

            <p>

            ${article.contenu.substring(0,120)}...

            </p>

            <button
            onclick="ouvrirArticle('${article.id}')">

            Lire l'article

            </button>

        </div>

        `;

    });

}

/* ===================================================
   OUVRIR UN ARTICLE
=================================================== */

function ouvrirArticle(id){

    articleActuel = articles.find(a => a.id === id);

    if(!articleActuel) return;

    statistiques.consultations++;

    document.getElementById("statArticles").textContent =
    statistiques.consultations;

    document.getElementById("contenuArticle").innerHTML = `

        <div class="article-complet">

            <h2>
                Article ${articleActuel.numero}
            </h2>

            <h3>
                ${articleActuel.titre}
            </h3>

            <hr>

            <p style="
                line-height:1.8;
                text-align:justify;
                font-size:16px;
            ">
                ${articleActuel.contenu}
            </p>

            <div style="
                margin-top:25px;
                display:flex;
                gap:10px;
                flex-wrap:wrap;
            ">

                <button onclick="articlePrecedent()">
                    ⬅ Article précédent
                </button>

                <button onclick="articleSuivant()">
                    Article suivant ➡
                </button>

            </div>

        </div>

    `;

}

/* ===================================================
   ARTICLE PRECEDENT
=================================================== */

function articlePrecedent(){

    if(!articleActuel) return;

    let index = articles.findIndex(a => a.id===articleActuel.id);

    if(index>0){

        ouvrirArticle(
            articles[index-1].id
        );

    }

}

/* ===================================================
   ARTICLE SUIVANT
=================================================== */

function articleSuivant(){

    if(!articleActuel) return;

    let index = articles.findIndex(a => a.id===articleActuel.id);

    if(index<articles.length-1){

        ouvrirArticle(
            articles[index+1].id
        );

    }

}

/* ===================================================
   LECTURE VOCALE
=================================================== */

document
.getElementById("btnLecture")
.addEventListener("click",()=>{

    if(!articleActuel){

        alert("Choisissez un article.");

        return;

    }

    speechSynthesis.cancel();

    let lecture = new SpeechSynthesisUtterance(
        articleActuel.contenu
    );

    lecture.lang="fr-FR";

    speechSynthesis.speak(lecture);

});

/* ===================================================
   IMPRIMER
=================================================== */

document
.getElementById("btnImprimer")
.addEventListener("click",()=>{

    window.print();

});

/* ===================================================
   PARTAGER
=================================================== */

document
.getElementById("btnPartager")
.addEventListener("click",async()=>{

    if(!articleActuel) return;

    if(navigator.share){

        await navigator.share({

            title:
            "Article "+articleActuel.numero,

            text:
            articleActuel.titre+"\n\n"+
            articleActuel.contenu

        });

    }else{

        alert("Le partage n'est pas disponible sur cet appareil.");

    }

});

/* ===================================================
   FAVORIS
=================================================== */

document
.getElementById("btnFavori")
.addEventListener("click",()=>{

    if(!articleActuel) return;

    let favoris =
    JSON.parse(
        localStorage.getItem("favoris")||"[]"
    );

    if(!favoris.includes(articleActuel.id)){

        favoris.push(articleActuel.id);

        localStorage.setItem(
            "favoris",
            JSON.stringify(favoris)
        );

        alert("Article ajouté aux favoris.");

    }else{

        alert("Cet article est déjà enregistré.");

    }

});

/* =====================================================
   CATEGORIES JURIDIQUES
===================================================== */

const CATEGORIES = {

    contrat:[
        "contrat",
        "engagement",
        "embauche",
        "travail"
    ],

    salaire:[
        "salaire",
        "rémunération",
        "paie",
        "prime"
    ],

    conges:[
        "congé",
        "vacances",
        "repos"
    ],

    licenciement:[
        "licenciement",
        "préavis",
        "rupture",
        "faute"
    ],

    discipline:[
        "discipline",
        "sanction"
    ],

    securite:[
        "hygiène",
        "sécurité",
        "accident"
    ],

    enfant:[
        "enfant",
        "mineur"
    ],

    femme:[
        "femme",
        "grossesse",
        "maternité"
    ]

};

/* =====================================================
   OUVRIR UNE CATEGORIE
===================================================== */

function ouvrirCategorie(nom){

    if(!CATEGORIES[nom]){

        return;

    }

    const resultat = articles.filter(article=>{

        const texte = (

            article.titre+" "+article.contenu+" "+(article.motsCles||[]).join(" ")

        ).toLowerCase();

        return CATEGORIES[nom].some(mot=>

            texte.includes(mot.toLowerCase())

        );

    });

    afficherArticles(resultat);

}

/* =====================================================
   FILTRE AVANCE
===================================================== */

function filtrer(type,valeur){

    let resultat=[];

    switch(type){

        case "numero":

            resultat=articles.filter(a=>

                a.numero==valeur

            );

        break;

        case "mot":

            resultat=articles.filter(a=>

                a.contenu.toLowerCase()

                .includes(valeur.toLowerCase())

            );

        break;

        case "titre":

            resultat=articles.filter(a=>

                a.titre.toLowerCase()

                .includes(valeur.toLowerCase())

            );

        break;

    }

    afficherArticles(resultat);

}

/* =====================================================
   COPILOTE INSPECTION
===================================================== */

function inspection(type){

    switch(type){

        case "F01":

            ouvrirCategorie("contrat");

        break;

        case "F02":

            ouvrirCategorie("enfant");

        break;

        case "F03":

            ouvrirCategorie("securite");

        break;

    }

}

/* =====================================================
   STATISTIQUES
===================================================== */

function mettreAJourStatistiques(){

    document.getElementById("statArticles").textContent=
    statistiques.consultations;

    document.getElementById("statRecherche").textContent=
    statistiques.recherches;

    document.getElementById("statIA").textContent=
    statistiques.ia;

}

/* =====================================================
   RECHERCHE PAR TITRE
===================================================== */

function rechercherTitre(titre){

    const resultat = articles.filter(a=>

        a.titreCode &&
        a.titreCode===titre

    );

    afficherArticles(resultat);

}

/* =====================================================
   RECHERCHE PAR CHAPITRE
===================================================== */

function rechercherChapitre(chapitre){

    const resultat = articles.filter(a=>

        a.chapitre &&
        a.chapitre===chapitre

    );

    afficherArticles(resultat);

}

/* =====================================================
   RECHERCHE PAR SECTION
===================================================== */

function rechercherSection(section){

    const resultat = articles.filter(a=>

        a.section &&
        a.section===section

    );

    afficherArticles(resultat);

}

/* =====================================================
   RECHERCHE PAR ARTICLE
===================================================== */

function rechercherNumero(numero){

    const resultat = articles.filter(a=>

        a.numero==numero

    );

    afficherArticles(resultat);

}

/* =====================================================
   GENERER LE SOMMAIRE
===================================================== */

function genererSommaire(){

    const titres={};

    articles.forEach(article=>{

        const titre=article.titreCode || "Autres";

        if(!titres[titre]){

            titres[titre]=[];

        }

        titres[titre].push(article);

    });

    let html="";

    Object.keys(titres).forEach(titre=>{

        html+=`

        <div class="quick-card">

            <h3>${titre}</h3>

            <button onclick="rechercherTitre('${titre}')">

                Ouvrir

            </button>

        </div>

        `;

    });

    document.getElementById("listeArticles").innerHTML=html;

}

/* =====================================================
   MENU PRINCIPAL
===================================================== */

function accueilCodeTravail(){

    genererSommaire();

}

/* =====================================================
   ACTUALISER LES STATISTIQUES
===================================================== */

function actualiserAccueil(){

    document.getElementById("compteurArticles").textContent=

    articles.length+" Articles";

    mettreAJourStatistiques();

}

chargerArticles().then(()=>{

    accueilCodeTravail();

    actualiserAccueil();

});

/* =====================================================
   COPILOTE D'INSPECTION INTELLIGENT
===================================================== */

function analyserSituation(situation){

    situation = situation.toLowerCase();

    const resultat = articles.filter(article=>{

        const texte = (

            article.intitule + " " +

            article.contenu + " " +

            (article.motsCles || []).join(" ") + " " +

            (article.infractions || []).join(" ")

        ).toLowerCase();

        return texte.includes(situation);

    });

    afficherArticles(resultat);

}

/* =====================================================
   SITUATIONS D'INSPECTION
===================================================== */

const SITUATIONS = {

"absence contrat":"contrat",

"travail enfant":"mineur",

"travail forcé":"travail forcé",

"salaire":"salaire",

"licenciement":"licenciement",

"accident":"sécurité",

"hygiène":"hygiène",

"repos":"repos",

"congé":"congé",

"temps de travail":"horaire"

};

/* =====================================================
   DEMARRER UNE INSPECTION
===================================================== */

function demarrerInspection(cle){

    if(SITUATIONS[cle]){

        analyserSituation(

            SITUATIONS[cle]

        );

    }

}

/* =====================================================
   SUGGESTIONS AUTOMATIQUES
===================================================== */

function suggestionsInspection(){

    return [

        "Absence de contrat",

        "Travail d'un mineur",

        "Licenciement",

        "Salaire impayé",

        "Travail forcé",

        "Repos hebdomadaire",

        "Congé annuel",

        "Accident du travail",

        "Hygiène",

        "Sécurité"

    ];

}

