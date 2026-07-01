/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js
 MOTEUR INTELLIGENCE JURIDIQUE V4.0
 PARTIE 1/5

 Améliorations :
 - Mémoire intelligente
 - Analyse juridique avancée
 - Compatible :
   rag.js
   vector-search.js
   traduction.js
   speech.js
   code-travail.js
=========================================================*/


"use strict";


/*=========================================================
 CONFIGURATION GÉNÉRALE IA
=========================================================*/


const InspecteurBotIA = {


    version:"4.0",


    nom:"InspecteurBot IA RDC",


    domaine:"Code du Travail RDC",


    createur:"Inspecteur Limengo (Pmiller)",


    pays:"République Démocratique du Congo",


    actif:true,


    mode:"assistant-juridique",


    moteur:"RAG + Vector Search + Analyse Juridique",


    maxResultats:10,


    historique:true,


    multilingue:true,


    vocal:true,


    copiloteInspection:true


};





/*=========================================================
 MÉMOIRE INTELLIGENTE IA
=========================================================*/


let MemoireIA = {


    questions:[],


    recherches:0,


    reponses:0,


    articlesConsultes:0,


    derniersArticles:[],


    favoris:[],


    dernierUtilisateur:null,


    derniereQuestion:null,


    derniereAnalyse:null


};





/*=========================================================
 BASE DES CONCEPTS JURIDIQUES
=========================================================*/


const ConceptsJuridiquesIA = {


    contrat:[

        "contrat",

        "engagement",

        "embauche",

        "travail"

    ],


    salaire:[

        "salaire",

        "paie",

        "remuneration",

        "prime"

    ],


    licenciement:[

        "licenciement",

        "renvoi",

        "rupture",

        "dismissal"

    ],


    conge:[

        "conge",

        "vacance",

        "repos"

    ],


    accident:[

        "accident",

        "blessure",

        "securite",

        "travail"

    ],


    inspection:[

        "inspection",

        "controle",

        "inspecteur",

        "verification"

    ],


    etranger:[

        "etranger",

        "main d oeuvre",

        "travailleur etranger"

    ],


    hygiene:[

        "hygiene",

        "sante",

        "securite",

        "protection"

    ]


};





/*=========================================================
 NETTOYAGE TEXTE IA
=========================================================*/


function nettoyerQuestion(texte){


    if(!texte){

        return "";

    }


    return texte

    .toString()

    .toLowerCase()

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g,"")

    .replace(/[^a-z0-9\s]/g," ")

    .replace(/\s+/g," ")

    .trim();


}





/*=========================================================
 EXTRACTION DES MOTS IMPORTANTS
=========================================================*/


function extraireMotsImportants(question){


    const stopWords=[


        "le",
        "la",
        "les",
        "un",
        "une",
        "des",
        "de",
        "du",
        "dans",
        "pour",
        "avec",
        "est",
        "sont",
        "quel",
        "quelle",
        "quels",
        "comment",
        "que",
        "qui",
        "sur",
        "mon",
        "ma",
        "mes"


    ];



    return nettoyerQuestion(question)

    .split(" ")

    .filter(mot=>{


        return (

            mot.length>2 &&

            !stopWords.includes(mot)

        );


    });


}





/*=========================================================
 IDENTIFICATION DU DOMAINE JURIDIQUE
=========================================================*/


function identifierCategorieJuridique(question){


    const texte =

    nettoyerQuestion(question);



    let resultat=[];



    for(const categorie in ConceptsJuridiquesIA){


        ConceptsJuridiquesIA[categorie]

        .forEach(mot=>{


            if(

                texte.includes(mot)

            ){


                if(!resultat.includes(categorie)){


                    resultat.push(categorie);


                }


            }


        });


    }



    return resultat.length

    ?

    resultat

    :

    ["general"];


}





/*=========================================================
 ANALYSE PROFONDE QUESTION
=========================================================*/


function analyserQuestion(question){



    const mots =

    extraireMotsImportants(question);



    const categories =

    identifierCategorieJuridique(question);



    return {


        questionOriginale:question,


        texteNettoye:

        nettoyerQuestion(question),


        mots:mots,


        categories:categories,


        niveau:

        categories.includes("general")

        ?

        "general"

        :

        "juridique",


        date:new Date()


    };


}





/*=========================================================
 CHARGEMENT MÉMOIRE LOCALE
=========================================================*/


function chargerMemoireIA(){


    try{


        const historique =

        localStorage.getItem(

            "inspecteurbot_questions"

        );



        if(historique){


            MemoireIA.questions =

            JSON.parse(historique);


        }



        const favoris =

        localStorage.getItem(

            "inspecteurbot_favoris"

        );



        if(favoris){


            MemoireIA.favoris =

            JSON.parse(favoris);


        }


    }

    catch(e){


        console.warn(

            "Mémoire IA inaccessible",

            e

        );


    }


}





/*=========================================================
 SAUVEGARDE QUESTION
=========================================================*/


function sauvegarderQuestion(question){


    if(!InspecteurBotIA.historique){

        return;

    }


    MemoireIA.questions.push({


        question:question,


        date:new Date()


    });



    MemoireIA.derniereQuestion = question;



    try{


        localStorage.setItem(

            "inspecteurbot_questions",

            JSON.stringify(

                MemoireIA.questions

            )

        );


    }

    catch(e){}



}





/*=========================================================
 INITIALISATION
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


    chargerMemoireIA();


    console.log(

    "================================="

    );


    console.log(

    "🤖 InspecteurBot IA RDC"

    );


    console.log(

    "Version",

    InspecteurBotIA.version

    );


    console.log(

    "Moteur juridique V4 activé"

    );


    console.log(

    "Mémoire IA chargée :",

    MemoireIA.questions.length

    );


    console.log(

    "================================="

    );


});


console.log(

"ia.js V4.0 Partie 1/5 chargée."

);

/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js V4.0
 PARTIE 2/5

 MOTEUR RAG + VECTOR SEARCH
 Recherche intelligente juridique
=========================================================*/


"use strict";



/*=========================================================
 RECHERCHE PRINCIPALE DANS LA BASE JURIDIQUE
=========================================================*/


async function rechercherBaseJuridique(question){


    let resultats=[];



    /*
    ÉTAPE 1 :
    Recherche vectorielle intelligente
    */


    if(

        typeof vectorSearch === "function"

    ){


        try{


            resultats = await vectorSearch(

                question,

                InspecteurBotIA.maxResultats

            );


        }

        catch(erreur){


            console.warn(

                "Vector Search indisponible",

                erreur

            );


        }


    }





    /*
    ÉTAPE 2 :
    Recherche RAG
    */


    if(

        (!resultats ||

        resultats.length===0)

        &&

        typeof ragSearch === "function"

    ){


        try{


            const rag =

            await ragSearch(

                question

            );



            if(rag){


                return {


                    type:"rag",


                    contenu:rag,


                    articles:[]


                };


            }


        }

        catch(erreur){


            console.warn(

                "Erreur RAG",

                erreur

            );


        }


    }





    /*
    ÉTAPE 3 :
    Recherche directe Code du Travail
    */


    if(

        (!resultats ||

        resultats.length===0)

        &&

        typeof loadCodeTravail==="function"

    ){


        try{


            const articles =

            await loadCodeTravail();



            const mots =

            extraireMotsImportants(

                question

            );



            resultats =

            articles.filter(article=>{


                const texte =


                (

                article.numero+

                " "+

                article.titre+

                " "+

                article.contenu

                )

                .toLowerCase();



                return mots.some(mot=>

                    texte.includes(mot)

                );


            })

            .slice(

                0,

                InspecteurBotIA.maxResultats

            );


        }

        catch(erreur){


            console.warn(

                "Erreur chargement Code du Travail",

                erreur

            );


        }


    }





    return {


        type:"articles",


        contenu:"",


        articles:

        resultats || []


    };


}





/*=========================================================
 CALCUL PERTINENCE ARTICLE
=========================================================*/


function calculerPertinenceArticle(

article,

question

){


    const texte =


    (

        article.numero+

        " "+

        article.titre+

        " "+

        article.contenu

    )

    .toLowerCase();



    const mots =

    extraireMotsImportants(

        question

    );



    let score=0;



    mots.forEach(mot=>{


        if(

            texte.includes(mot)

        ){


            score++;


        }


    });



    return score;


}





/*=========================================================
 TRI INTELLIGENT DES ARTICLES
=========================================================*/


function classerArticlesPertinence(

articles,

question

){


    if(!articles){

        return [];

    }



    return articles.sort(

        (a,b)=>{


            return (

                calculerPertinenceArticle(

                    b,

                    question

                )

                -

                calculerPertinenceArticle(

                    a,

                    question

                )

            );


        }

    );


}





/*=========================================================
 EXTRACTION INFORMATIONS ARTICLE
=========================================================*/


function extraireInformationsArticles(

articles

){



    if(

        !articles ||

        articles.length===0

    ){


        return [];

    }



    return articles.map(article=>{


        return {


            numero:

            article.numero || "",



            livre:

            article.livre || "",



            titre:

            article.titre || "",



            chapitre:

            article.chapitre || "",



            section:

            article.section || "",



            contenu:

            article.contenu || "",



            categorie:

            article.categorie || ""



        };


    });


}





/*=========================================================
 CONSTRUCTION RÉPONSE JURIDIQUE
=========================================================*/


function construireReponseJuridique(

data,

question

){



    if(

        !data

    ){


        return {


            trouve:false,


            message:

            "Aucune donnée juridique disponible."

        };


    }





    /*
    Résultat RAG
    */


    if(

        data.type==="rag"

    ){


        return {


            trouve:true,


            message:data.contenu,


            articles:[]


        };


    }





    let articles =

    classerArticlesPertinence(

        data.articles,

        question

    );





    articles =

    extraireInformationsArticles(

        articles

    );





    if(

        articles.length===0

    ){


        return {


            trouve:false,


            message:

            "Aucun article du Code du Travail RDC ne correspond à votre recherche."


        };


    }





    let texte =


    "🤖 Analyse InspecteurBot IA RDC\n\n"+

    "Références juridiques trouvées :\n\n";





    articles.forEach(article=>{


        texte +=


        "📌 Article "

        +

        article.numero

        +

        "\n";



        if(article.titre){


            texte +=

            "Titre : "

            +

            article.titre

            +

            "\n";


        }



        if(article.chapitre){


            texte +=

            "Chapitre : "

            +

            article.chapitre

            +

            "\n";


        }



        texte +=


        article.contenu

        +

        "\n\n";



    });





    MemoireIA.derniersArticles =

    articles;



    MemoireIA.articlesConsultes +=

    articles.length;





    return {


        trouve:true,


        message:texte,


        articles:articles


    };



}





/*=========================================================
 ANALYSE JURIDIQUE COMPLÈTE
=========================================================*/


async function analyserJuridiquement(

question

){



    MemoireIA.recherches++;



    sauvegarderQuestion(

        question

    );



    const analyse =

    analyserQuestion(

        question

    );



    const recherche =

    await rechercherBaseJuridique(

        question

    );



    const reponse =

    construireReponseJuridique(

        recherche,

        question

    );



    MemoireIA.reponses++;



    MemoireIA.derniereAnalyse =

    analyse;



    return {


        question:question,


        analyse:analyse,


        resultat:reponse,


        date:new Date()


    };



}





/*=========================================================
 EXPORT
=========================================================*/


window.rechercherBaseJuridique =

rechercherBaseJuridique;


window.analyserJuridiquement =

analyserJuridiquement;


window.construireReponseJuridique =

construireReponseJuridique;



console.log(

"ia.js V4.0 Partie 2/5 chargée."

);


/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js V4.0
 PARTIE 3/5

 INTERFACE ASSISTANT IA
=========================================================*/


"use strict";



/*=========================================================
 AFFICHAGE RÉPONSE IA DANS L'INTERFACE
=========================================================*/


async function afficherReponseIA(question){


    const zone =

    document.getElementById(

        "reponseIA"

    );



    if(!zone){

        return;

    }





    zone.innerHTML = `

    <div class="result-card">

        <h3>

        🤖 InspecteurBot IA RDC

        </h3>


        <p>

        Analyse du Code du Travail RDC en cours...

        </p>


        <p>

        Recherche des dispositions applicables...

        </p>


    </div>

    `;





    try{


        const resultat =

        await analyserJuridiquement(

            question

        );



        zone.innerHTML =

        formaterReponseIA(

            resultat

        );



    }

    catch(erreur){


        console.error(

            erreur

        );



        zone.innerHTML = `

        <div class="result-card">


        <h3>

        ❌ Erreur Assistant IA

        </h3>


        <p>

        Une erreur est survenue pendant l'analyse.

        </p>


        </div>

        `;


    }



}





/*=========================================================
 FORMATAGE PROFESSIONNEL RÉPONSE
=========================================================*/


function formaterReponseIA(

resultat

){


    if(

        !resultat ||

        !resultat.resultat

    ){


        return "";

    }





    const data =

    resultat.resultat;





    if(!data.trouve){



        return `

        <div class="result-card">


        <h3>

        🤖 InspecteurBot IA

        </h3>


        <p>

        ${data.message}

        </p>


        </div>

        `;


    }







    let html = `


    <div class="result-card">


    <h3>

    ⚖️ Analyse juridique IA

    </h3>


    <div class="ia-response">


    ${

    data.message

    .replace(/\n/g,"<br>")

    }


    </div>


    `;





    if(

        data.articles &&

        data.articles.length

    ){


        html += `


        <hr>


        <h4>

        📚 Articles utilisés :

        </h4>


        <ul>

        `;



        data.articles.forEach(article=>{


            html += `


            <li>

            Article ${article.numero}

            </li>


            `;


        });



        html += `

        </ul>

        `;


    }




    html += `

    </div>

    `;



    return html;


}





/*=========================================================
 INITIALISATION BOUTON QUESTION IA
=========================================================*/


function initialiserAssistantIA(){



    const bouton =

    document.getElementById(

        "btnQuestionIA"

    );



    const champ =

    document.getElementById(

        "questionIA"

    );



    if(

        !bouton ||

        !champ

    ){

        return;

    }





    bouton.addEventListener(

    "click",

    async()=>{


        const question =

        champ.value.trim();





        if(!question){


            alert(

            "Veuillez saisir une question juridique."

            );


            return;


        }





        bouton.disabled=true;


        bouton.innerHTML=

        "⏳ Analyse IA...";





        await afficherReponseIA(

            question

        );





        bouton.disabled=false;


        bouton.innerHTML=

        `

        <i class="fas fa-paper-plane"></i>

        Analyser la question

        `;





        mettreAJourStatIA();



    });



}





/*=========================================================
 STATISTIQUES IA
=========================================================*/


function mettreAJourStatIA(){



    const ia =

    document.getElementById(

        "statIA"

    );



    if(ia){


        ia.innerHTML =

        MemoireIA.reponses;


    }





    const recherche =

    document.getElementById(

        "statRecherche"

    );



    if(recherche){


        recherche.innerHTML =

        MemoireIA.recherches;


    }





    const articles =

    document.getElementById(

        "statArticles"

    );



    if(articles){


        articles.innerHTML =

        MemoireIA.articlesConsultes;


    }



}





/*=========================================================
 QUESTION MULTILINGUE
=========================================================*/


async function questionMultilingueIA(

question,

langue="fr"

){



    let questionFinale =

    question;





    if(

        typeof traduireQuestionComplete ===

        "function"

    ){



        const traduction =

        traduireQuestionComplete(

            question,

            langue

        );



        if(traduction){


            questionFinale=

            traduction;


        }



    }





    return await analyserJuridiquement(

        questionFinale

    );


}





/*=========================================================
 TRADUCTION RÉPONSE IA
=========================================================*/


function traduireResultatIA(

texte,

langue="fr"

){



    if(

        typeof traduireReponseComplete ===

        "function"

    ){



        return traduireReponseComplete(

            texte,

            langue

        );


    }





    return {


        original:texte,


        traduction:texte,


        langue:langue


    };


}





/*=========================================================
 LECTURE VOCALE IA
=========================================================*/


function lireReponseIA(

texte

){



    if(

        typeof parlerIA ===

        "function"

    ){



        parlerIA(

            texte

        );


        return true;


    }





    if(

        "speechSynthesis" in window

    ){



        const voix =

        new SpeechSynthesisUtterance(

            texte

        );



        voix.lang=

        "fr-FR";



        speechSynthesis.speak(

            voix

        );



        return true;


    }



    return false;


}





/*=========================================================
 BOUTON LECTURE VOCALE
=========================================================*/


function initialiserLectureIA(){



    const bouton =

    document.getElementById(

        "btnLecture"

    );



    if(!bouton){

        return;

    }





    bouton.addEventListener(

    "click",

    ()=>{


        const zone =

        document.getElementById(

            "reponseIA"

        );



        if(zone){


            lireReponseIA(

                zone.innerText

            );


        }



    });



}





/*=========================================================
 DÉMARRAGE MODULE
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


    initialiserAssistantIA();


    initialiserLectureIA();


    mettreAJourStatIA();


});





console.log(

"ia.js V4.0 Partie 3/5 chargée."

);


/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js V4.0
 PARTIE 4/5

 COPILOTE INSPECTION
 F01 - F02 - F03
 PV - RAPPORT - OPJ
=========================================================*/


"use strict";



/*=========================================================
 CONFIGURATION COPILOTE
=========================================================*/


const CopiloteInspection = {


    actif:true,


    version:"2.0",


    modules:[


        "F01 - Contrôle de la main-d'œuvre",


        "F02 - Contrôle de la main-d'œuvre étrangère",


        "F03 - Hygiène et santé au travail",


        "Code du Travail RDC",


        "Procès-verbal",


        "Rapport inspection"


    ]


};





/*=========================================================
 ANALYSE SITUATION INSPECTION
=========================================================*/


function analyserInspection(description){


    const texte =

    nettoyerQuestion(

        description

    );



    let pointsControle=[];


    let risques=[];





    /*
    F01
    */


    if(

        texte.includes("travailleur")

        ||

        texte.includes("contrat")

        ||

        texte.includes("registre")

        ||

        texte.includes("salari")

    ){


        pointsControle.push(

        "F01 : Vérifier les documents de la main-d'œuvre."

        );


        risques.push(

        "Absence ou irrégularité des documents des travailleurs."

        );


    }





    /*
    F02
    */


    if(

        texte.includes("etranger")

        ||

        texte.includes("expatrie")

        ||

        texte.includes("nationalite")

    ){


        pointsControle.push(

        "F02 : Contrôler la conformité de la main-d'œuvre étrangère."

        );


        risques.push(

        "Vérifier autorisation et documents des travailleurs étrangers."

        );


    }





    /*
    F03
    */


    if(

        texte.includes("accident")

        ||

        texte.includes("securite")

        ||

        texte.includes("hygiene")

        ||

        texte.includes("danger")

    ){


        pointsControle.push(

        "F03 : Contrôle hygiène, sécurité et santé au travail."

        );


        risques.push(

        "Présence possible d'un risque professionnel."

        );


    }





    if(pointsControle.length===0){


        pointsControle.push(

        "Contrôle général selon le Code du Travail RDC."

        );


    }





    return {


        situation:description,


        pointsControle:pointsControle,


        risques:risques,


        date:new Date()


    };


}





/*=========================================================
 PLANIFICATION MISSION INSPECTION
=========================================================*/


function genererPlanInspection(

entreprise

){


    return {


        entreprise:

        entreprise || "Entreprise non renseignée",


        étapes:[


            "Identification de l'entreprise",


            "Présentation de la mission",


            "Contrôle des documents légaux",


            "Vérification des travailleurs",


            "Contrôle conditions de travail",


            "Recherche des infractions",


            "Constatations",


            "Rédaction du rapport"


        ],


        date:new Date()


    };


}





/*=========================================================
 DÉTECTION INFRACTIONS
=========================================================*/


function detecterInfractions(

description

){


    const texte =

    nettoyerQuestion(

        description

    );



    let infractions=[];





    if(

        texte.includes("sans contrat")

        ||

        texte.includes("contrat absent")

    ){


        infractions.push({

            type:"Contrat de travail",

            gravite:"Moyenne",

            action:"Vérifier les obligations de l'employeur."


        });


    }





    if(

        texte.includes("salaire")

        &&

        texte.includes("impaye")

    ){


        infractions.push({


            type:"Non paiement salaire",


            gravite:"Élevée",


            action:"Contrôle des rémunérations."


        });


    }





    if(

        texte.includes("securite")

        &&

        texte.includes("absence")

    ){


        infractions.push({


            type:"Hygiène et sécurité",


            gravite:"Élevée",


            action:"Appliquer contrôle F03."


        });


    }





    return infractions;


}





/*=========================================================
 GÉNÉRATION PROCÈS-VERBAL IA
=========================================================*/


function genererPVInspection(

donnees={}

){



    return `


========================================

INSPECTION GÉNÉRALE DU TRAVAIL RDC


PROCÈS-VERBAL D'INSPECTION


========================================



Entreprise :

${donnees.entreprise || "Non renseignée"}



Objet :

${donnees.objet || "Contrôle du respect du Code du Travail"}



Constatations :

${donnees.constatations || "Aucune constatation renseignée"}



Infractions constatées :

${donnees.infractions || "Aucune infraction renseignée"}



Articles applicables :

${donnees.articles || "Recherche dans le Code du Travail RDC"}



Inspecteur :

${donnees.inspecteur || "Inspecteur du Travail"}



Date :

${new Date().toLocaleDateString("fr-FR")}



Signature :

________________________



`;

}





/*=========================================================
 RAPPORT INSPECTION AUTOMATIQUE
=========================================================*/


function genererRapportInspection(

donnees={}

){



    return {


        titre:

        "Rapport d'inspection du Travail",


        entreprise:

        donnees.entreprise || "",


        analyse:

        analyserInspection(

            donnees.description || ""

        ),


        infractions:

        detecterInfractions(

            donnees.description || ""

        ),


        date:new Date()


    };


}





/*=========================================================
 ASSISTANT INSPECTEUR COMPLET
=========================================================*/


async function assistantInspecteur(

question

){



    const inspection =

    analyserInspection(

        question

    );



    const juridique =

    await analyserJuridiquement(

        question

    );



    const infractions =

    detecterInfractions(

        question

    );



    return {


        inspection:inspection,


        juridique:juridique,


        infractions:infractions,


        date:new Date()


    };


}





/*=========================================================
 COMPTEUR ARTICLES
=========================================================*/


async function compterArticles(){


    try{


        if(

        typeof loadCodeTravail==="function"

        ){



            const articles =

            await loadCodeTravail();



            const compteur =

            document.getElementById(

                "compteurArticles"

            );



            if(compteur){


                compteur.innerHTML=

                articles.length+

                " articles";


            }



            return articles.length;


        }



    }

    catch(e){


        console.warn(e);


    }



    return 0;


}





/*=========================================================
 EXPORT COPILOTE
=========================================================*/


window.CopiloteInspection =

CopiloteInspection;


window.analyserInspection =

analyserInspection;


window.detecterInfractions =

detecterInfractions;


window.genererPlanInspection =

genererPlanInspection;


window.genererPVInspection =

genererPVInspection;


window.genererRapportInspection =

genererRapportInspection;


window.assistantInspecteur =

assistantInspecteur;



document.addEventListener(

"DOMContentLoaded",

()=>{


    compterArticles();



    console.log(

    "🤖 Copilote Inspection V4 activé"

    );


});



console.log(

"ia.js V4.0 Partie 4/5 chargée."

);


/*=========================================================
 INSPECTEURBOT IA RDC
 ia.js V4.0
 PARTIE 5/5

 FINALISATION MOTEUR IA
=========================================================*/


"use strict";



/*=========================================================
 SÉCURITÉ TEXTE IA
 Protection affichage HTML
=========================================================*/


function securiserTexteIA(texte){


    if(!texte){

        return "";

    }



    return texte

    .toString()

    .replace(/</g,"&lt;")

    .replace(/>/g,"&gt;")

    .replace(/"/g,"&quot;")

    .replace(/'/g,"&#039;");


}





/*=========================================================
 AJOUT FAVORI ARTICLE
=========================================================*/


function ajouterArticleFavori(article){



    if(!article){

        return false;

    }



    const existe =

    MemoireIA.favoris.some(

        item =>

        item.numero === article.numero

    );



    if(!existe){


        MemoireIA.favoris.push(article);



        try{


            localStorage.setItem(

                "inspecteurbot_favoris",

                JSON.stringify(

                    MemoireIA.favoris

                )

            );


        }

        catch(e){}



        return true;


    }



    return false;


}





/*=========================================================
 SUPPRIMER FAVORI
=========================================================*/


function supprimerFavoriArticle(numero){



    MemoireIA.favoris =

    MemoireIA.favoris.filter(

        article =>

        article.numero !== numero

    );



    localStorage.setItem(

        "inspecteurbot_favoris",

        JSON.stringify(

            MemoireIA.favoris

        )

    );



}





/*=========================================================
 OBTENIR FAVORIS
=========================================================*/


function obtenirFavorisIA(){


    return MemoireIA.favoris;


}





/*=========================================================
 RÉSUMÉ ACTIVITÉ IA
=========================================================*/


function statistiquesIA(){


    return {


        questions:

        MemoireIA.questions.length,


        recherches:

        MemoireIA.recherches,


        reponses:

        MemoireIA.reponses,


        articles:

        MemoireIA.articlesConsultes,


        favoris:

        MemoireIA.favoris.length,


        version:

        InspecteurBotIA.version


    };


}





/*=========================================================
 CONNEXION TRADUCTION
=========================================================*/


function analyserQuestionMultilingue(

question,

langue="fr"

){



    if(

        typeof questionMultilingueIA ===

        "function"

    ){


        return questionMultilingueIA(

            question,

            langue

        );


    }



    return analyserJuridiquement(

        question

    );


}





/*=========================================================
 CONNEXION RECHERCHE RAPIDE
=========================================================*/


async function rechercheRapideIA(

texte

){



    MemoireIA.recherches++;



    const resultat =

    await rechercherBaseJuridique(

        texte

    );



    return construireReponseJuridique(

        resultat,

        texte

    );


}





/*=========================================================
 ASSISTANT VOCAL
=========================================================*/


function activerAssistantVocalIA(){



    if(

        typeof activerMicro ===

        "function"

    ){


        return activerMicro();


    }



    console.log(

    "Assistant vocal non disponible."

    );



    return false;


}





/*=========================================================
 RÉSUMÉ JURIDIQUE IA
=========================================================*/


function resumerAnalyseIA(

resultat

){



    if(

        !resultat ||

        !resultat.resultat

    ){

        return "";

    }



    if(

        resultat.resultat.articles

        &&

        resultat.resultat.articles.length

    ){



        return (

        resultat.resultat.articles.length

        +

        " article(s) du Code du Travail RDC trouvé(s)."

        );


    }



    return resultat.resultat.message || "";


}





/*=========================================================
 INITIALISATION FINALE IA
=========================================================*/


document.addEventListener(

"DOMContentLoaded",

()=>{


    console.log(

    "=========================================="

    );


    console.log(

    "🤖 INSPECTEURBOT IA RDC"

    );


    console.log(

    "Moteur Intelligence Juridique V4.0"

    );


    console.log(

    "Code du Travail RDC connecté"

    );


    console.log(

    "RAG : actif"

    );


    console.log(

    "Vector Search : actif"

    );


    console.log(

    "Traduction multilingue : active"

    );


    console.log(

    "Copilote Inspection : actif"

    );


    console.log(

    "=========================================="

    );


});





/*=========================================================
 EXPORT GLOBAL COMPLET
=========================================================*/


window.InspecteurBotIA =

InspecteurBotIA;


window.MemoireIA =

MemoireIA;


window.securiserTexteIA =

securiserTexteIA;


window.ajouterArticleFavori =

ajouterArticleFavori;


window.supprimerFavoriArticle =

supprimerFavoriArticle;


window.obtenirFavorisIA =

obtenirFavorisIA;


window.statistiquesIA =

statistiquesIA;


window.rechercheRapideIA =

rechercheRapideIA;


window.analyserQuestionMultilingue =

analyserQuestionMultilingue;


window.resumerAnalyseIA =

resumerAnalyseIA;


window.activerAssistantVocalIA =

activerAssistantVocalIA;



console.log(

"================================================"

);


console.log(

"✅ InspecteurBot IA RDC - ia.js V4.0 chargé avec succès"

);


console.log(

"Assistant juridique prêt."

);


console.log(

"================================================"

);
