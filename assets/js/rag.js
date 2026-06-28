/*==================================================
 INSPECTEURBOT IA RDC
 RAG OFFLINE V3.0
 Fonctionne sans Internet
==================================================*/

"use strict";

/*=========================================
RÉPONSE IA
=========================================*/

function generateAnswer(question){

    if(!question || question.trim()===""){

        return{
            success:false,
            message:"Veuillez saisir une question."
        };

    }

    const resultats=vectorSearch(question,5);

    if(resultats.length===0){

        return{

            success:false,

            message:
            "Aucun article du Code du Travail ne correspond à votre recherche."

        };

    }

    const meilleur=resultats[0].article;

    return{

        success:true,

        article:meilleur,

        autres:resultats.slice(1)

    };

}

/*=========================================
HTML
=========================================*/

function createAnswerHTML(data){

    if(!data.success){

        return`

        <div class="ai-error">

        ❌ ${data.message}

        </div>

        `;

    }

    let html=`

    <div class="ia-card">

        <h2>🤖 InspecteurBot IA</h2>

        <div class="article-number">

            ${data.article.numero}

        </div>

        <h3>

            ${data.article.titre}

        </h3>

        <p>

            ${data.article.contenu}

        </p>

    `;

    if(data.autres.length){

        html+=`

        <hr>

        <h4>

        Articles également pertinents

        </h4>

        <ul>

        `;

        data.autres.forEach(r=>{

            html+=`

            <li>

            <strong>

            ${r.article.numero}

            </strong>

            — ${r.article.titre}

            </li>

            `;

        });

        html+="</ul>";

    }

    html+="</div>";

    return html;

}

/*=========================================
QUESTION IA
=========================================*/

function askIA(question){

    return createAnswerHTML(

        generateAnswer(question)

    );

}

window.askIA=askIA;
