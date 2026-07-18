/* =======================================================
   INSPECTEURBOT IGT RDC
   ACADÉMIE QUIZ PROFESSIONNELLE
   PARTIE 5A : INITIALISATION DU MOTEUR
======================================================= */


"use strict";


const QuizEngine = {


    // ===============================
    // Configuration générale
    // ===============================

    config: {

        totalVies: 5,

        niveaux: [

            {
                id:1,
                nom:"Débutant",
                grade:"Agent administratif",
                recompense:"FC"
            },

            {
                id:2,
                nom:"Administratif",
                grade:"Assistant administratif",
                recompense:"FC"
            },

            {
                id:3,
                nom:"Contrôleur du Travail",
                grade:"Contrôleur",
                recompense:"FC"
            },

            {
                id:4,
                nom:"Inspecteur du Travail",
                grade:"Inspecteur",
                recompense:"USD"
            },

            {
                id:5,
                nom:"Expert",
                grade:"Expert IGT",
                recompense:"USD"
            },

            {
                id:6,
                nom:"Inspecteur Général Adjoint",
                grade:"IGT Adjoint",
                recompense:"USD"
            },

            {
                id:7,
                nom:"Inspecteur Général du Travail",
                grade:"IGT",
                recompense:"USD"
            }

        ]

    },



    // ===============================
    // Données du jeu
    // ===============================


    questions: [],

    questionsUtilisees: [],

    questionActuelle:null,

    joueur:null,



    // ===============================
    // Initialisation
    // ===============================


    async init(){


        console.log(
            "🚀 Initialisation Académie IGT..."
        );


        this.chargerJoueur();


        await this.chargerQuestions();


        this.verifierProgression();


        console.log(
            "✅ Moteur Quiz IGT prêt"
        );


    },





    // ===============================
    // Chargement banque questions
    // ===============================


    async chargerQuestions(){


        try{


            const response =
            await fetch(
                "data/question_bank.json"
            );


            this.questions =
            await response.json();


            console.log(
                this.questions.length +
                " questions chargées"
            );


        }


        catch(error){


            console.error(
                "Erreur chargement questions : ",
                error
            );


        }


    },





    // ===============================
    // Création profil joueur
    // ===============================


    nouveauJoueur(){


        return {


            nom:"",

            grade:"Débutant",

            niveau:1,


            vies:this.config.totalVies,


            argentFC:0,


            argentUSD:0,


            questionsRepondues:0,


            bonnesReponses:0,


            mauvaisesReponses:0,


            questionsUtilisees:[],


            niveauxDebloques:[1],


            badges:[],


            dateCreation:
            new Date().toISOString()


        };


    },





    // ===============================
    // Charger sauvegarde
    // ===============================


    chargerJoueur(){


        let sauvegarde =
        localStorage.getItem(
            "IGT_PLAYER"
        );



        if(sauvegarde){


            this.joueur =
            JSON.parse(
                sauvegarde
            );


            console.log(
                "Profil chargé"
            );


        }


        else{


            this.joueur =
            this.nouveauJoueur();



            this.sauvegarderJoueur();



            console.log(
                "Nouveau profil créé"
            );


        }


    },






    // ===============================
    // Sauvegarde joueur
    // ===============================


    sauvegarderJoueur(){


        localStorage.setItem(

            "IGT_PLAYER",

            JSON.stringify(
                this.joueur
            )

        );


    },







    // ===============================
    // Vérification progression
    // ===============================


    verifierProgression(){


        let niveau =
        this.joueur.niveau;



        let disponible =
        this.config.niveaux
        .find(
            n=>n.id===niveau
        );



        if(!disponible){


            this.joueur.niveau=1;


        }



    },






    // ===============================
    // Obtenir niveau actuel
    // ===============================


    niveauActuel(){


        return this.config.niveaux.find(

            n =>
            n.id ===
            this.joueur.niveau

        );


    }





};





// Démarrage automatique

document.addEventListener(

"DOMContentLoaded",

()=>{


    QuizEngine.init();


});


// =======================================================
// PARTIE 5B : AFFICHAGE DU QUIZ
// =======================================================



QuizEngine.questionsNiveau = [];

QuizEngine.reponsesMelangees = [];





// ===============================
// Charger les questions du niveau
// ===============================


QuizEngine.chargerQuestionsNiveau = function(){


    let niveau =
    this.joueur.niveau;



    this.questionsNiveau =

    this.questions.filter(

        q =>

        q.niveau === niveau

    );



    console.log(

        "Questions niveau "+
        niveau+
        " : "+
        this.questionsNiveau.length

    );


};







// ===============================
// Choisir une nouvelle question
// ===============================


QuizEngine.nouvelleQuestion = function(){



    this.chargerQuestionsNiveau();



    let disponibles =


    this.questionsNiveau.filter(


        q =>

        !this.joueur.questionsUtilisees.includes(q.id)


    );





    // Si toutes les questions sont utilisées

    if(disponibles.length===0){


        this.joueur.questionsUtilisees=[];


        disponibles =
        this.questionsNiveau;


    }





    let index =

    Math.floor(

        Math.random() *

        disponibles.length

    );





    this.questionActuelle =

    disponibles[index];





    this.joueur.questionsUtilisees.push(

        this.questionActuelle.id

    );





    this.sauvegarderJoueur();





    this.preparerReponses();





    this.afficherQuestion();




};









// ===============================
// Mélange des réponses
// ===============================


QuizEngine.preparerReponses = function(){



    let question =

    this.questionActuelle;





    this.reponsesMelangees =

    question.choix.map(

        (texte,index)=>{


            return {


                texte:texte,


                index:index


            };


        }


    );





    this.reponsesMelangees.sort(

        ()=>Math.random()-0.5

    );





};









// ===============================
// Affichage écran
// ===============================


QuizEngine.afficherQuestion = function(){



    let q =

    this.questionActuelle;



    let zoneQuestion =

    document.getElementById(

        "question-zone"

    );



    let zoneReponses =

    document.getElementById(

        "reponses-zone"

    );





    if(!zoneQuestion ||

       !zoneReponses){


        console.warn(

        "Zones quiz absentes dans HTML"

        );


        return;


    }





    zoneQuestion.innerHTML = `


    <div class="quiz-card">


        <h2>

        Question ${

        this.joueur.questionsRepondues + 1

        }

        </h2>


        <p>

        ${q.question}

        </p>



    </div>


    `;







    zoneReponses.innerHTML="";





    this.reponsesMelangees.forEach(

    (rep)=>{



        let bouton =

        document.createElement(

            "button"

        );



        bouton.className=

        "btn-reponse";



        bouton.innerHTML=

        rep.texte;





        bouton.onclick=()=>{


            this.verifierReponse(

                rep.index

            );


        };





        zoneReponses.appendChild(

            bouton

        );



    }

    );






    this.actualiserInterface();



};









// ===============================
// Interface joueur
// ===============================


QuizEngine.actualiserInterface=function(){



    let vie =

    document.getElementById(

        "vies"

    );



    if(vie){


        vie.innerHTML =

        "❤️".repeat(

        this.joueur.vies

        );


    }





    let niveau =

    document.getElementById(

        "niveau"

    );



    if(niveau){


        let info =

        this.niveauActuel();



        niveau.innerHTML =

        info.nom+

        " - "+

        info.grade;


    }






    let argent =

    document.getElementById(

        "argent"

    );



    if(argent){



        argent.innerHTML =

        this.joueur.argentFC+

        " FC | "+

        this.joueur.argentUSD+

        " $";


    }



};

         
