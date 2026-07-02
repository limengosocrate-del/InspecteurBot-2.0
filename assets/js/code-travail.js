"use strict";

/*=========================================================
 INSPECTEURBOT IA RDC
 MODULE : CODE DU TRAVAIL
 Version 3.0
=========================================================*/

/*=========================================================
 CONFIGURATION
=========================================================*/

const APP = {

    version: "3.0",

    langue: localStorage.getItem("langue") || "fr",

    fichier: "assets/data/code-travail.json",

    lectureAuto: false

};

/*=========================================================
 VARIABLES GLOBALES
=========================================================*/

let articles = [];

let articleActuel = null;

let indexActuel = 0;

let historique = [];

let favoris = JSON.parse(

    localStorage.getItem("favoris") || "[]"

);

let statistiques = {

    recherches: 0,

    consultations: 0,

    favoris: favoris.length,

    ia: 0

};

/*=========================================================
 INITIALISATION
=========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    chargerArticles();

    chargerLangue();

    mettreAJourStatistiques();

    console.log("✅ InspecteurBot IA RDC chargé.");

});

/*=========================================================
 GESTION DES LANGUES
=========================================================*/

const LANGUES = {

fr:{

nom:"Français",

rechercher:"Rechercher",

micro:"Micro",

ecouter:"Écouter",

precedent:"Précédent",

suivant:"Suivant",

copier:"Copier",

favori:"Favori",

partager:"Partager",

imprimer:"Imprimer",

assistant:"Assistant IA",

aucun:"Aucun résultat trouvé.",

chargement:"Chargement..."

},

en:{

nom:"English",

rechercher:"Search",

micro:"Microphone",

ecouter:"Listen",

precedent:"Previous",

suivant:"Next",

copier:"Copy",

favori:"Favorite",

partager:"Share",

imprimer:"Print",

assistant:"AI Assistant",

aucun:"No result found.",

chargement:"Loading..."

},

ln:{

nom:"Lingála",

rechercher:"Boluki",

micro:"Micro",

ecouter:"Yoka",

precedent:"Liboso",

suivant:"Nsima",

copier:"Kopi",

favori:"Favori",

partager:"Kabola",

imprimer:"Bimisa",

assistant:"Asista IA",

aucun:"Eloko ezwami te.",

chargement:"Kozwa ba données..."

},

sw:{

nom:"Kiswahili",

rechercher:"Tafuta",

micro:"Maikrofoni",

ecouter:"Sikiliza",

precedent:"Nyuma",

suivant:"Mbele",

copier:"Nakili",

favori:"Pendwa",

partager:"Shiriki",

imprimer:"Chapisha",

assistant:"Msaidizi AI",

aucun:"Hakuna matokeo.",

chargement:"Inapakia..."

},

lu:{

nom:"Tshiluba",

rechercher:"Sangisha",

micro:"Mikolo",

ecouter:"Teeleja",

precedent:"Kunyima",

suivant:"Kumpala",

copier:"Kopila",

favori:"Favori",

partager:"Kabanya",

imprimer:"Imprimer",

assistant:"Mulongeshi IA",

aucun:"Kakuyi bipeta.",

chargement:"Kulonda..."

},

kg:{

nom:"Kikongo",

rechercher:"Sosa",

micro:"Mikro",

ecouter:"Wa",

precedent:"Na nima",

suivant:"Na ntwala",

copier:"Kopia",

favori:"Favori",

partager:"Kabula",

imprimer:"Imprimer",

assistant:"Asista IA",

aucun:"Kima me monika ko.",

chargement:"Kubaka..."

}

};

/*=========================================================
 TRADUCTION
=========================================================*/

function T(cle){

    const langue = LANGUES[APP.langue];

    if(!langue){

        return cle;

    }

    return langue[cle] || cle;

}

function changerLangue(langue){

    if(!LANGUES[langue]){

        return;

    }

    APP.langue = langue;

    localStorage.setItem("langue", langue);

    console.log("🌍 Langue :", LANGUES[langue].nom);

   }

/*=========================================================
 CHARGEMENT DU CODE DU TRAVAIL
=========================================================*/

async function chargerArticles(){

    try{

        const reponse = await fetch(APP.fichier);

        if(!reponse.ok){

            throw new Error("Impossible de charger le Code du Travail.");

        }

        articles = await reponse.json();

        console.log("📚", articles.length, "articles chargés.");

        const compteur = document.getElementById("compteurArticles");

        if(compteur){

            compteur.textContent = articles.length + " articles";

        }

        if(articles.length > 0){

            indexActuel = 0;

            ouvrirArticle(indexActuel);

        }

    }catch(erreur){

        console.error(erreur);

        const contenu = document.getElementById("contenuArticle");

        if(contenu){

            contenu.innerHTML = `

                <div class="article-erreur">

                    <h2>⚠ Erreur</h2>

                    <p>

                    Impossible de charger le fichier
                    <strong>code-travail.json</strong>

                    </p>

                </div>

            `;

        }

    }

}

/*=========================================================
 OUVRIR UN ARTICLE
=========================================================*/

function ouvrirArticle(index){

    if(index < 0 || index >= articles.length){

        return;

    }

    indexActuel = index;

    articleActuel = articles[index];

    statistiques.consultations++;

    const numero = document.getElementById("numeroArticle");

    const titre = document.getElementById("titreArticle");

    const contenu = document.getElementById("contenuArticle");

    if(numero){

        numero.textContent =
        "Article " + articleActuel.numero;

    }

    if(titre){

        titre.textContent =
        articleActuel.titre || "Code du Travail";

    }

    if(contenu){

        contenu.innerHTML = `

            <div class="page-juridique">

                <h2>

                    Article ${articleActuel.numero}

                </h2>

                <h3>

                    ${articleActuel.titre}

                </h3>

                <hr>

                <p>

                    ${articleActuel.contenu}

                </p>

            </div>

        `;

    }

    mettreAJourStatistiques();

    sauvegarderDerniereLecture();

}

/*=========================================================
 NAVIGATION DU LIVRE
=========================================================*/

function articleSuivant(){

    if(articles.length===0){

        return;

    }

    if(indexActuel < articles.length-1){

        ouvrirArticle(indexActuel+1);

    }

}

function articlePrecedent(){

    if(articles.length===0){

        return;

    }

    if(indexActuel>0){

        ouvrirArticle(indexActuel-1);

    }

}

/*=========================================================
 BOUTONS PRECEDENT / SUIVANT
=========================================================*/

document
.getElementById("precedent")
?.addEventListener("click",articlePrecedent);

document
.getElementById("suivant")
?.addEventListener("click",articleSuivant);

/*=========================================================
 CLAVIER
=========================================================*/

document.addEventListener("keydown",(e)=>{

    switch(e.key){

        case "ArrowLeft":

            articlePrecedent();

        break;

        case "ArrowRight":

            articleSuivant();

        break;

    }

});

/*=========================================================
 SAUVEGARDE DE LA DERNIERE LECTURE
=========================================================*/

function sauvegarderDerniereLecture(){

    if(!articleActuel){

        return;

    }

    localStorage.setItem(

        "dernierArticle",

        indexActuel

    );

}

/*=========================================================
 RESTAURATION
=========================================================*/

function restaurerDerniereLecture(){

    const dernier = Number(

        localStorage.getItem("dernierArticle")

    );

    if(

        !isNaN(dernier)

        &&

        dernier>=0

        &&

        dernier<articles.length

    ){

        ouvrirArticle(dernier);

    }

}

/*=========================================================
 OUVERTURE AUTOMATIQUE
=========================================================*/

window.addEventListener("load",()=>{

    setTimeout(()=>{

        if(articles.length){

            restaurerDerniereLecture();

        }

    },500);

});

/*=========================================================
 RECHERCHE INTELLIGENTE
=========================================================*/

function rechercherArticles(){

    const champ = document.getElementById("rechercheArticle");

    if(!champ){

        return;

    }

    const texte = champ.value
        .toLowerCase()
        .trim();

    statistiques.recherches++;

    mettreAJourStatistiques();

    if(texte===""){

        if(articles.length){

            ouvrirArticle(indexActuel);

        }

        return;

    }

    const resultat = articles.filter(article=>{

        const numero = String(article.numero);

        const titre = (article.titre || "").toLowerCase();

        const contenu = (article.contenu || "").toLowerCase();

        const chapitre = (article.chapitre || "").toLowerCase();

        const section = (article.section || "").toLowerCase();

        const mots = (article.motsCles || [])
            .join(" ")
            .toLowerCase();

        return (

            numero.includes(texte) ||

            titre.includes(texte) ||

            contenu.includes(texte) ||

            chapitre.includes(texte) ||

            section.includes(texte) ||

            mots.includes(texte)

        );

    });

    afficherResultatsRecherche(resultat);

}

/*=========================================================
 AFFICHAGE DES RESULTATS
=========================================================*/

function afficherResultatsRecherche(resultats){

    const zone = document.getElementById("listeArticles");

    if(!zone){

        return;

    }

    zone.innerHTML = "";

    if(resultats.length===0){

        zone.innerHTML = `

            <div class="aucun-resultat">

                Aucun article trouvé.

            </div>

        `;

        return;

    }

    resultats.forEach(article=>{

        const index = articles.findIndex(

            a=>a.id===article.id

        );

        zone.innerHTML += `

            <button
                class="resultat-article"
                onclick="ouvrirArticle(${index})">

                <strong>

                    Article ${article.numero}

                </strong>

                <br>

                ${article.titre}

            </button>

        `;

    });

}

/*=========================================================
 EVENEMENTS
=========================================================*/

document
.getElementById("btnRecherche")
?.addEventListener("click",rechercherArticles);

document
.getElementById("rechercheArticle")
?.addEventListener("keyup",function(e){

    if(e.key==="Enter"){

        rechercherArticles();

    }

});

/*=========================================================
 MICROPHONE + LECTURE VOCALE + LANGUES
=========================================================*/

const LANGUES = {

    fr:"fr-FR",

    en:"en-US",

    ln:"fr-FR",

    sw:"sw-KE",

    lu:"fr-FR",

    kg:"fr-FR"

};

let langueCourante =

localStorage.getItem("langue") || "fr";

/*=========================================================
 CHANGER LA LANGUE
=========================================================*/

function changerLangue(code){

    langueCourante = code;

    localStorage.setItem(

        "langue",

        code

    );

}

/*=========================================================
 LECTURE VOCALE
=========================================================*/

function lireArticle(){

    if(!articleActuel){

        alert("Aucun article sélectionné.");

        return;

    }

    speechSynthesis.cancel();

    const lecture = new SpeechSynthesisUtterance(

        "Article " +

        articleActuel.numero +

        ". " +

        articleActuel.titre +

        ". " +

        articleActuel.contenu

    );

    lecture.lang =

    LANGUES[langueCourante] ||

    "fr-FR";

    lecture.rate = 1;

    lecture.pitch = 1;

    speechSynthesis.speak(lecture);

}

document

.getElementById("btnLecture")

?.addEventListener(

"click",

lireArticle

);

/*=========================================================
 MICROPHONE
=========================================================*/

function activerMicro(){

    const SpeechRecognition =

    window.SpeechRecognition ||

    window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert("Microphone non disponible.");

        return;

    }

    const recognition =

    new SpeechRecognition();

    recognition.lang =

    LANGUES[langueCourante] ||

    "fr-FR";

    recognition.interimResults = false;

    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(e){

        const texte =

        e.results[0][0].transcript;

        document.getElementById(

        "rechercheArticle"

        ).value = texte;

        rechercherArticles();

    };

    recognition.onerror = function(){

        alert("Impossible d'utiliser le microphone.");

    };

}

document

.getElementById("btnMicro")

?.addEventListener(

"click",

activerMicro

);

/*=========================================================
 TRADUCTION MULTILINGUE
 Français - Anglais - Lingala
 Swahili - Tshiluba - Kikongo
=========================================================*/

const TEXTES = {

fr:{
recherche:"Rechercher un article...",
precedent:"⬅ Précédent",
suivant:"Suivant ➡",
ecouter:"Écouter",
micro:"Micro",
aucun:"Aucun article trouvé.",
livre:"Code du Travail RDC"
},

en:{
recherche:"Search an article...",
precedent:"⬅ Previous",
suivant:"Next ➡",
ecouter:"Listen",
micro:"Microphone",
aucun:"No article found.",
livre:"Labour Code"
},

ln:{
recherche:"Luka mobeko...",
precedent:"⬅ Liboso",
suivant:"Nsima ➡",
ecouter:"Yoka",
micro:"Micro",
aucun:"Article ezwami te.",
livre:"Mobeko ya Mosala"
},

sw:{
recherche:"Tafuta kifungu...",
precedent:"⬅ Nyuma",
suivant:"Mbele ➡",
ecouter:"Sikiliza",
micro:"Kipaza sauti",
aucun:"Hakuna kifungu.",
livre:"Sheria ya Kazi"
},

lu:{
recherche:"Sangisha mukanda...",
precedent:"⬅ Kunyima",
suivant:"Kumpala ➡",
ecouter:"Teeleka",
micro:"Mikro",
aucun:"Kakwena article.",
livre:"Mikenji ya Mudimu"
},

kg:{
recherche:"Sosa article...",
precedent:"⬅ Vutuka",
suivant:"Landila ➡",
ecouter:"Wa",
micro:"Mikro",
aucun:"Article kele ve.",
livre:"Nsiku ya Kisalu"
}

};

/*=========================================================
 APPLIQUER LA LANGUE
=========================================================*/

function appliquerLangue(){

    const t =

    TEXTES[langueCourante] ||

    TEXTES.fr;

    document.getElementById("rechercheArticle")
    ?.setAttribute(
        "placeholder",
        t.recherche
    );

    document.getElementById("precedent")
    ?.innerHTML = t.precedent;

    document.getElementById("suivant")
    ?.innerHTML = t.suivant;

    document.getElementById("btnLecture")
    ?.innerHTML =
    '<i class="fa-solid fa-volume-high"></i> '+
    t.ecouter;

    document.getElementById("btnMicro")
    ?.innerHTML =
    '<i class="fa-solid fa-microphone"></i> '+
    t.micro;

    const titre = document.getElementById("titreLivre");

    if(titre){

        titre.textContent = t.livre;

    }

}

/*=========================================================
 SELECTEUR DE LANGUE
=========================================================*/

document
.getElementById("langue")
?.addEventListener("change",function(){

    changerLangue(this.value);

    appliquerLangue();

});

/*=========================================================
 INITIALISATION
=========================================================*/

document.addEventListener("DOMContentLoaded",()=>{

    appliquerLangue();

});

/*=========================================================
 ASSISTANT JURIDIQUE IA
=========================================================*/

function analyserQuestionIA(){

    const champ = document.getElementById("questionIA");

    const reponse = document.getElementById("reponseIA");

    if(!champ || !reponse){

        return;

    }

    const question = champ.value
        .trim()
        .toLowerCase();

    if(question===""){

        reponse.innerHTML =
        "<p>Veuillez saisir une question.</p>";

        return;

    }

    statistiques.ia++;

    mettreAJourStatistiques();

    let resultat = articles.filter(article=>{

        const texte = (

            (article.titre || "") + " " +

            (article.contenu || "") + " " +

            (article.motsCles || []).join(" ")

        ).toLowerCase();

        return texte.includes(question);

    });

    if(resultat.length){

        reponse.innerHTML = `

            <h3>

                🤖 Assistant Juridique

            </h3>

            <p>

                ${resultat[0].contenu}

            </p>

            <br>

            <button
            onclick="ouvrirArticle(

            ${articles.findIndex(

            a=>a.id===resultat[0].id

            )}

            )">

            Ouvrir l'article

            </button>

        `;

    }

    else{

        reponse.innerHTML = `

        <h3>

        🤖 Assistant Juridique

        </h3>

        <p>

        Aucun article correspondant n'a été trouvé.

        Essayez un autre mot-clé.

        </p>

        `;

    }

}

/*=========================================================
 BOUTON IA
=========================================================*/

document

.getElementById("btnQuestionIA")

?.addEventListener(

"click",

analyserQuestionIA

);

/*=========================================================
 HISTORIQUE
=========================================================*/

const historique = [];

function ajouterHistorique(texte){

    if(!texte){

        return;

    }

    historique.unshift(texte);

    if(historique.length>10){

        historique.pop();

    }

    const zone =

    document.getElementById("historiqueRecherche");

    if(!zone){

        return;

    }

    zone.innerHTML = historique

    .map(item=>`

        <div class="historique-item">

            ${item}

        </div>

    `)

    .join("");

}

/*=========================================================
 FAVORIS
=========================================================*/

function ajouterFavori(){

    if(!articleActuel){

        return;

    }

    let favoris = JSON.parse(

        localStorage.getItem("favoris")

        ||

        "[]"

    );

    if(!favoris.includes(articleActuel.id)){

        favoris.push(articleActuel.id);

        localStorage.setItem(

            "favoris",

            JSON.stringify(favoris)

        );

        alert("Article ajouté aux favoris.");

    }

}

document

.getElementById("btnFavori")

?.addEventListener(

"click",

ajouterFavori

);

/*=========================================================
 OUTILS DU LECTEUR
 Copier - Partager - Imprimer
=========================================================*/

function copierArticle(){

    if(!articleActuel){

        return;

    }

    navigator.clipboard.writeText(

        "Article " +

        articleActuel.numero +

        "\n\n" +

        articleActuel.titre +

        "\n\n" +

        articleActuel.contenu

    );

    alert("Article copié.");

}

document
.getElementById("btnCopier")
?.addEventListener("click",copierArticle);

/*=========================================================
 PARTAGE
=========================================================*/

async function partagerArticle(){

    if(!articleActuel){

        return;

    }

    const texte =

        "Article " +

        articleActuel.numero +

        "\n\n" +

        articleActuel.titre +

        "\n\n" +

        articleActuel.contenu;

    if(navigator.share){

        await navigator.share({

            title:"Code du Travail RDC",

            text:texte

        });

    }

    else{

        copierArticle();

    }

}

document
.getElementById("btnPartager")
?.addEventListener("click",partagerArticle);

/*=========================================================
 IMPRESSION
=========================================================*/

document
.getElementById("btnImprimer")
?.addEventListener("click",()=>{

    window.print();

});

/*=========================================================
 SIGNET
=========================================================*/

function enregistrerSignet(){

    if(!articleActuel){

        return;

    }

    localStorage.setItem(

        "signetArticle",

        articleActuel.id

    );

}

function ouvrirSignet(){

    const id =

    localStorage.getItem("signetArticle");

    if(!id){

        return;

    }

    const index =

    articles.findIndex(

        a=>a.id===id

    );

    if(index>=0){

        ouvrirArticle(index);

    }

}

/*=========================================================
 SAUVEGARDE AUTOMATIQUE
=========================================================*/

window.addEventListener(

"beforeunload",

()=>{

    enregistrerSignet();

}

/*=========================================================
 DEMARRAGE
=========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    chargerArticles();

    ouvrirSignet();

    appliquerLangue();

    mettreAJourStatistiques();

    console.log(

        "InspecteurBot IA - Code du Travail prêt."

    );

});

/*=========================================================
 PARTIE 10
 FINITIONS ET OPTIMISATIONS
=========================================================*/

/*=========================================================
 MODE LIVRE
=========================================================*/

function tournerPage(direction){

    const livre = document.getElementById("livre");

    if(!livre){

        return;

    }

    livre.classList.remove(

        "page-gauche",

        "page-droite"

    );

    void livre.offsetWidth;

    if(direction==="suivant"){

        livre.classList.add("page-droite");

    }else{

        livre.classList.add("page-gauche");

    }

}

/*=========================================================
 NAVIGATION
=========================================================*/

const ancienSuivant = articleSuivant;

articleSuivant = function(){

    tournerPage("suivant");

    ancienSuivant();

};

const ancienPrecedent = articlePrecedent;

articlePrecedent = function(){

    tournerPage("precedent");

    ancienPrecedent();

};

/*=========================================================
 ZOOM DU TEXTE
=========================================================*/

let taillePolice = 18;

function zoomPlus(){

    taillePolice++;

    document.documentElement.style.setProperty(

        "--taille-article",

        taillePolice+"px"

    );

}

function zoomMoins(){

    if(taillePolice>12){

        taillePolice--;

    }

    document.documentElement.style.setProperty(

        "--taille-article",

        taillePolice+"px"

    );

}

document
.getElementById("zoomPlus")
?.addEventListener("click",zoomPlus);

document
.getElementById("zoomMoins")
?.addEventListener("click",zoomMoins);

/*=========================================================
 DEFILEMENT
=========================================================*/

function allerDebut(){

    document.getElementById("contenuArticle")
    ?.scrollIntoView({

        behavior:"smooth"

    });

}

/*=========================================================
 RACCOURCIS CLAVIER
=========================================================*/

document.addEventListener("keydown",(e)=>{

    if(e.ctrlKey && e.key==="f"){

        e.preventDefault();

        document
        .getElementById("rechercheArticle")
        ?.focus();

    }

    if(e.ctrlKey && e.key==="+"){

        e.preventDefault();

        zoomPlus();

    }

    if(e.ctrlKey && e.key==="−"){

        e.preventDefault();

        zoomMoins();

    }

});

/*=========================================================
 INITIALISATION
=========================================================*/

window.addEventListener("load",()=>{

    allerDebut();

    console.log(

        "InspecteurBot IA RDC - Code du Travail Version 3.0"

    );

});
