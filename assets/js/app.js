"use strict";

/*===========================
CONFIGURATION
===========================*/

const APP = {

    fichierJSON: "code-travail.json"

};


/*===========================
VARIABLES
===========================*/

let articles = [];

let articleActuel = null;


/*===========================
CHARGER LE JSON
===========================*/

async function chargerArticles(){

    try{

        const reponse = await fetch(APP.fichierJSON);


        if(!reponse.ok){

            throw new Error(
                "Impossible de charger le fichier JSON"
            );

        }


        articles = await reponse.json();


        console.log(
            "Articles chargés :",
            articles.length
        );


        afficher(articles);


    }

    catch(e){

        console.error(e);


        document.getElementById("resultats").innerHTML =

        "<p>Erreur de chargement du Code du Travail.</p>";

    }

}



/*===========================
RECHERCHE INTELLIGENTE
Compatible JSON 2.0
===========================*/


function rechercher(mot){


    mot = mot.toLowerCase().trim();


    if(mot===""){

        afficher(articles);

        return;

    }



    const resultat = articles.filter(article=>{


        const texte = (

            article.numeroArticle +

            " " +

            article.titreCode +

            " " +

            article.chapitre +

            " " +

            article.section +

            " " +

            article.intitule +

            " " +

            article.contenu +

            " " +

            (article.motsCles || []).join(" ")

        ).toLowerCase();



        return texte.includes(mot);



    });



    afficher(resultat);



}



/*===========================
AFFICHAGE DES ARTICLES
===========================*/


function afficher(liste){


    const zone = document.getElementById("resultats");


    zone.innerHTML="";



    if(liste.length===0){


        zone.innerHTML=

        "<h3>Aucun article trouvé.</h3>";


        return;


    }



    liste.forEach(article=>{


        let extrait = article.contenu;


        if(extrait.length > 250){

            extrait =

            extrait.substring(0,250)

            +

            "...";

        }



        zone.innerHTML += `


        <div class="article">


            <h3>

            Article ${article.numeroArticle}

            </h3>


            <h4>

            ${article.intitule}

            </h4>


            <small>

            ${article.titreCode}

            <br>

            ${article.chapitre}

            </small>


            <p>

            ${extrait}

            </p>



            <button onclick="ouvrirArticle('${article.id}')">

            📖 Lire l'article

            </button>


        </div>


        `;


    });



}



/*===========================
OUVRIR UN ARTICLE COMPLET
===========================*/


function ouvrirArticle(id){


    articleActuel = articles.find(

        a=>a.id===id

    );


    if(!articleActuel){

        return;

    }



    document.getElementById("resultats").innerHTML = `



    <div class="article-complet">


        <h2>

        Article ${articleActuel.numeroArticle}

        </h2>



        <h3>

        ${articleActuel.intitule}

        </h3>



        <p>

        <b>${articleActuel.titreCode}</b>

        </p>



        <p>

        <b>${articleActuel.chapitre}</b>

        </p>



        <hr>



        <p>

        ${articleActuel.contenu}

        </p>



        <h4>

        Mots clés

        </h4>


        <p>

        ${(articleActuel.motsCles || []).join(", ")}

        </p>



        <h4>

        Infractions possibles

        </h4>


        <p>

        ${(articleActuel.infractions || []).join(", ")}

        </p>



        <button onclick="afficher(articles)">

        ⬅ Retour

        </button>


    </div>



    `;


}



/*===========================
BOUTON RECHERCHE
===========================*/


document

.getElementById("btnRecherche")

.addEventListener("click",()=>{


    rechercher(

        document.getElementById("recherche").value

    );


});



/*===========================
ENTRÉE CLAVIER
===========================*/


document

.getElementById("recherche")

.addEventListener("keyup",e=>{


    if(e.key==="Enter"){


        rechercher(e.target.value);


    }


});



/*===========================
DÉMARRAGE
===========================*/


chargerArticles();
