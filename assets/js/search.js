"use strict";

/*===========================
 InspecteurBot RDC
 search.js
 Compatible Code du Travail JSON 2.0
===========================*/


let articles = [];


/*===========================
 CHARGER LE JSON
===========================*/

async function chargerArticles(){


    try{


        const reponse = await fetch(
            "assets/data/code-travail.json"
        );


        if(!reponse.ok){

            throw new Error(
                "Fichier JSON introuvable"
            );

        }



        articles = await reponse.json();



        afficher(articles);



    }


    catch(e){


        document.getElementById("searchResults").innerHTML =

        "<h3>❌ Impossible de charger le Code du travail.</h3>";



        console.error(e);


    }



}



/*===========================
 RECHERCHE INTELLIGENTE
===========================*/


function rechercher(){


    const mot = document

    .getElementById("searchInput")

    .value

    .toLowerCase()

    .trim();



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

            (article.motsCles || []).join(" ") +

            " " +

            (article.infractions || []).join(" ")


        ).toLowerCase();



        return texte.includes(mot);



    });



    afficher(resultat);



}



/*===========================
 AFFICHAGE
===========================*/


function afficher(liste){


    const zone = document.getElementById(
        "searchResults"
    );


    zone.innerHTML="";



    if(liste.length===0){


        zone.innerHTML =

        "<h3>Aucun article trouvé.</h3>";


        return;


    }



    liste.forEach(article=>{


        let extrait = article.contenu || "";



        if(extrait.length > 200){


            extrait =

            extrait.substring(0,200)

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



<p>

<b>${article.titreCode}</b>

<br>

${article.chapitre}

</p>



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
 OUVRIR ARTICLE
===========================*/


function ouvrirArticle(id){



    const article = articles.find(

        a=>a.id===id

    );



    if(!article) return;




    document.getElementById("searchResults").innerHTML = `



<div class="article-complet">



<h2>

Article ${article.numeroArticle}

</h2>



<h3>

${article.intitule}

</h3>



<p>

<b>${article.titreCode}</b>

</p>



<p>

<b>${article.chapitre}</b>

</p>



<hr>



<p>

${article.contenu}

</p>



<h4>

Mots clés :

</h4>


<p>

${(article.motsCles || []).join(", ")}

</p>



<h4>

Infractions :

</h4>


<p>

${(article.infractions || []).join(", ")}

</p>



<button onclick="afficher(articles)">

⬅ Retour recherche

</button>



</div>



`;



}



/*===========================
 DÉMARRAGE
===========================*/


document.addEventListener(
"DOMContentLoaded",
()=>{


    chargerArticles();



    document

    .getElementById("searchBtn")

    .addEventListener(
        "click",
        rechercher
    );



    document

    .getElementById("searchInput")

    .addEventListener(
        "keyup",
        function(e){


            if(e.key==="Enter"){


                rechercher();


            }


        }

    );



});
