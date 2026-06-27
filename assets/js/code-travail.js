/*=================================================
CODE DU TRAVAIL
PARTIE 1
INITIALISATION
==================================================*/

"use strict";

/*=========================================
HORLOGE
=========================================*/

function updateDateTime(){

    const now = new Date();

    const jours = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
    ];

    const mois = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];

    const clock = document.getElementById("clock");
    const day = document.getElementById("day");
    const date = document.getElementById("date");

    if(clock){
        clock.innerHTML = now.toLocaleTimeString("fr-FR",{
            hour:"2-digit",
            minute:"2-digit"
        });
    }

    if(day){
        day.innerHTML = jours[now.getDay()];
    }

    if(date){
        date.innerHTML =
            now.getDate()+" "+
            mois[now.getMonth()]+" "+
            now.getFullYear();
    }

}

updateDateTime();
setInterval(updateDateTime,1000);

/*=========================================
MÉTÉO
=========================================*/

const temperature = document.getElementById("temperature");
const city = document.getElementById("city");

if(temperature){
    temperature.innerHTML = "26°C";
}

if(city){
    city.innerHTML = "Kinshasa";
}

/*=========================================
BASE DE DONNÉES DES ARTICLES
=========================================*/

let articles = [];

/*=========================================
NOTIFICATION
=========================================*/

function notification(message){

    const box = document.createElement("div");

    box.className = "msg";

    box.innerHTML = message;

    document.body.appendChild(box);

    setTimeout(function(){

        box.remove();

    },3000);

}

/*=========================================
MESSAGE DE DÉMARRAGE
=========================================*/

console.log(
    "InspecteurBot RDC | Code du Travail chargé avec succès."
);

/*=================================================
CODE DU TRAVAIL
PARTIE 2
CHARGEMENT DES ARTICLES
==================================================*/

/*=========================================
CHARGER LE FICHIER JSON
=========================================*/

async function chargerCodeTravail(){

    try{

        const reponse = await fetch("data/code_travail.json");

        if(!reponse.ok){

            throw new Error("Impossible de charger le Code du Travail.");

        }

        articles = await reponse.json();

        afficherStatistiques();

        console.log(
            "Code du Travail chargé : "+
            articles.length+
            " articles."
        );

    }

    catch(erreur){

        console.error(erreur);

        notification(
            "Erreur lors du chargement du Code du Travail."
        );

    }

}

chargerCodeTravail();

/*=========================================
STATISTIQUES
=========================================*/

function afficherStatistiques(){

    const totalArticles =
        document.getElementById("totalArticles");

    if(totalArticles){

        totalArticles.innerHTML = articles.length;

    }

}

/*=========================================
VÉRIFICATION
=========================================*/

function codeCharge(){

    return articles.length > 0;

}

/*=================================================
CODE DU TRAVAIL
PARTIE 3
RECHERCHE DES ARTICLES
==================================================*/

/*=========================================
RECHERCHE
=========================================*/

function rechercherArticles(){

    if(!codeCharge()){

        notification(
            "Le Code du Travail n'est pas encore chargé."
        );

        return;

    }

    const input =
        document.getElementById("searchInput");

    if(!input){

        return;

    }

    const recherche =
        input.value
        .trim()
        .toLowerCase();

    if(recherche === ""){

        afficherArticles(articles);

        return;

    }

    const resultat = articles.filter(function(article){

        const numero =
            String(article.numero || "")
            .toLowerCase();

        const titre =
            String(article.titre || "")
            .toLowerCase();

        const contenu =
            String(article.contenu || "")
            .toLowerCase();

        const motscles =
            Array.isArray(article.motscles)
            ? article.motscles.join(" ").toLowerCase()
            : "";

        return(

            numero.includes(recherche) ||

            titre.includes(recherche) ||

            contenu.includes(recherche) ||

            motscles.includes(recherche)

        );

    });

    afficherArticles(resultat);

}

/*=========================================
ÉVÉNEMENT DU CHAMP DE RECHERCHE
=========================================*/

const champRecherche =
    document.getElementById("searchInput");

if(champRecherche){

    champRecherche.addEventListener(

        "input",

        rechercherArticles

    );

}

/*=================================================
CODE DU TRAVAIL
PARTIE 4
AFFICHAGE DES ARTICLES
==================================================*/

/*=========================================
AFFICHAGE
=========================================*/

function afficherArticles(liste){

    const container =
        document.getElementById("articlesContainer");

    if(!container){

        return;

    }

    container.innerHTML = "";

    if(liste.length === 0){

        container.innerHTML =

        `
        <div class="empty">

            <h3>Aucun article trouvé</h3>

            <p>
                Essayez un autre mot-clé.
            </p>

        </div>
        `;

        return;

    }

    liste.forEach(function(article){

        const carte =
            document.createElement("div");

        carte.className = "article-card";

        carte.innerHTML =

        `
        <div class="article-header">

            <span class="article-number">

                Article ${article.numero}

            </span>

        </div>

        <h3 class="article-title">

            ${article.titre}

        </h3>

        <p class="article-content">

            ${article.contenu}

        </p>
        `;

        container.appendChild(carte);

    });

}

/*=========================================
AFFICHAGE INITIAL
=========================================*/

setTimeout(function(){

    if(codeCharge()){

        afficherArticles(articles);

    }

},500);

/*=================================================
CODE DU TRAVAIL
PARTIE 5
TRI ET NAVIGATION
==================================================*/

/*=========================================
TRIER PAR NUMÉRO
=========================================*/

function trierArticles(){

    articles.sort(function(a,b){

        return Number(a.numero) - Number(b.numero);

    });

}

/*=========================================
AFFICHER TOUS LES ARTICLES
=========================================*/

function afficherTousLesArticles(){

    if(!codeCharge()){

        return;

    }

    trierArticles();

    afficherArticles(articles);

}

/*=========================================
RECHERCHER UN ARTICLE PAR NUMÉRO
=========================================*/

function rechercherNumero(numero){

    if(!codeCharge()){

        return;

    }

    const resultat = articles.filter(function(article){

        return String(article.numero) === String(numero);

    });

    afficherArticles(resultat);

}

/*=========================================
RETOUR À LA LISTE COMPLÈTE
=========================================*/

function reinitialiserRecherche(){

    const input = document.getElementById("searchInput");

    if(input){

        input.value = "";

    }

    afficherTousLesArticles();

}

/*=========================================
INITIALISATION
=========================================*/

window.addEventListener(

    "load",

    function(){

        setTimeout(function(){

            afficherTousLesArticles();

        },300);

    }

);

/*=================================================
CODE DU TRAVAIL
PARTIE 6
FINITIONS
==================================================*/

/*=========================================
COMPTEUR DES RÉSULTATS
=========================================*/

function afficherNombreResultats(nombre){

    const compteur =
        document.getElementById("resultCount");

    if(compteur){

        compteur.innerHTML =
            nombre+" article(s) trouvé(s)";

    }

}

/*=========================================
SURCHARGER L'AFFICHAGE
=========================================*/

const ancienAfficherArticles =
    afficherArticles;

afficherArticles = function(liste){

    ancienAfficherArticles(liste);

    afficherNombreResultats(liste.length);

    const zone =
        document.getElementById("articlesContainer");

    if(zone){

        zone.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    }

};

/*=========================================
TOUCHE ENTRÉE
=========================================*/

const recherche =
    document.getElementById("searchInput");

if(recherche){

    recherche.addEventListener(

        "keydown",

        function(event){

            if(event.key === "Enter"){

                rechercherArticles();

            }

        }

    );

}

/*=========================================
MISE EN ÉVIDENCE
=========================================*/

function surlignerMot(){

    const input =
        document.getElementById("searchInput");

    const zone =
        document.getElementById("articlesContainer");

    if(!input || !zone){

        return;

    }

    const mot =
        input.value.trim();

    if(mot === ""){

        return;

    }

    zone.querySelectorAll(".article-content")
    .forEach(function(element){

        element.innerHTML =
        element.innerHTML.replace(

            new RegExp(mot,"gi"),

            '<mark>$&</mark>'

        );

    });

}

/*=========================================
SURBRILLANCE APRÈS RECHERCHE
=========================================*/

const ancienneRecherche =
    rechercherArticles;

rechercherArticles = function(){

    ancienneRecherche();

    setTimeout(function(){

        surlignerMot();

    },50);

};

/*=========================================
MESSAGE FINAL
=========================================*/

console.log(

"Module Code du Travail prêt."

);
