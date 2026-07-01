/*=========================================
 INSPECTEURBOT IA RDC
 RAG ENGINE V2.0
 Compatible Code du Travail JSON 2.0
==========================================*/


let ARTICLES = [];



/*=========================================
 CHARGEMENT DES DONNÉES JURIDIQUES
==========================================*/


async function chargerArticles(){


    if(ARTICLES.length > 0){

        return ARTICLES;

    }



    const chemins = [

        "assets/data/code-travail.json"

    ];



    for(const chemin of chemins){


        try{


            const response = await fetch(chemin);



            if(response.ok){


                ARTICLES = await response.json();



                console.log(
                    "✅ Articles chargés :",
                    ARTICLES.length
                );



                return ARTICLES;



            }



        }


        catch(e){


            console.log(
                "Chemin non trouvé :",
                chemin
            );


        }



    }




    console.error(
        "❌ Impossible de charger la base juridique"
    );



    ARTICLES=[];



    return ARTICLES;



}





/*=========================================
 NORMALISATION TEXTE
==========================================*/


function normaliser(texte){


    return String(texte || "")

    .toLowerCase()

    .normalize("NFD")

    .replace(
        /[\u0300-\u036f]/g,
        ""
    )

    .trim();



}






/*=========================================
 RAG SEARCH
 Recherche augmentée juridique
==========================================*/


async function ragSearch(question){



    await chargerArticles();




    if(ARTICLES.length===0){


        return `


        <div class="result-card">

            <h3>Aucune donnée</h3>

            <p>

            La base juridique est vide.

            </p>

        </div>


        `;


    }





    const recherche = normaliser(question);



    let resultat=[];





    ARTICLES.forEach(article=>{


        const numero = normaliser(

            article.numeroArticle

        );


        const titreCode = normaliser(

            article.titreCode

        );


        const chapitre = normaliser(

            article.chapitre

        );


        const section = normaliser(

            article.section

        );


        const intitule = normaliser(

            article.intitule

        );


        const contenu = normaliser(

            article.contenu

        );


        const motsCles = normaliser(

            (article.motsCles || []).join(" ")

        );


        const infractions = normaliser(

            (article.infractions || []).join(" ")

        );


        const questionsIA = normaliser(

            (article.questionsIA || []).join(" ")

        );




        const texteComplet =

            titreCode +

            " " +

            chapitre +

            " " +

            section +

            " " +

            intitule +

            " " +

            contenu +

            " " +

            motsCles +

            " " +

            infractions +

            " " +

            questionsIA;





        let score=0;




        if(numero.includes(recherche))

            score +=100;




        if(intitule.includes(recherche))

            score +=80;




        if(infractions.includes(recherche))

            score +=70;




        if(titreCode.includes(recherche))

            score +=50;




        if(contenu.includes(recherche))

            score +=40;





        recherche.split(" ")

        .forEach(mot=>{


            if(mot.length>2){



                if(texteComplet.includes(mot))

                    score +=10;



            }


        });





        if(score>0){



            resultat.push({

                score,

                article

            });



        }





    });





    resultat.sort(

        (a,b)=>b.score-a.score

    );







    if(resultat.length===0){


        return `


        <div class="result-card">


            <h3>Aucun résultat</h3>


            <p>

            Aucun article trouvé pour :

            <strong>${question}</strong>


            </p>


        </div>


        `;


    }






    let html="";






    resultat.slice(0,5)

    .forEach(item=>{



        html += `



<div class="article-card">



<div class="article-number">

Article ${item.article.numeroArticle}

</div>




<h3 class="article-title">

${item.article.intitule}

</h3>





<p>

<b>${item.article.titreCode}</b>

</p>




<div class="article-content">

${item.article.contenu}

</div>



</div>



`;



    });





    return html;



         }
