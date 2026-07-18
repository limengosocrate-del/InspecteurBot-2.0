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

// =======================================================
// PARTIE 5C : CORRECTION DES RÉPONSES
// RÉCOMPENSES - VIES - PROGRESSION
// =======================================================



// ===============================
// Vérifier une réponse
// ===============================


QuizEngine.verifierReponse = function(reponseChoisie){



    let question = this.questionActuelle;



    let correcte =

    question.bonne;



    let bonneReponse =

    reponseChoisie === correcte;





    this.joueur.questionsRepondues++;





    if(bonneReponse){


        this.joueur.bonnesReponses++;



        this.attribuerRecompense();



        this.afficherResultat(

            true,

            question.explication

        );



    }

    else{


        this.joueur.mauvaisesReponses++;



        this.perdreVie();



        this.afficherResultat(

            false,

            question.explication

        );


    }





    this.sauvegarderJoueur();




};









// ===============================
// Récompense argent
// ===============================


QuizEngine.attribuerRecompense = function(){


    let q = this.questionActuelle;



    let montant =

    q.recompense;



    if(!montant){

        return;

    }





    if(montant.type === "FC"){


        this.joueur.argentFC +=

        montant.montant;


    }





    if(montant.type === "USD"){


        this.joueur.argentUSD +=

        montant.montant;


    }





};









// ===============================
// Perdre une vie
// ===============================


QuizEngine.perdreVie = function(){



    this.joueur.vies--;





    if(this.joueur.vies <=0){



        this.joueur.vies=0;



        setTimeout(()=>{


            this.echecNiveau();


        },1500);



    }



};









// ===============================
// Résultat réponse
// ===============================


QuizEngine.afficherResultat=function(

correct,

explication

){



    let zone =

    document.getElementById(

        "question-zone"

    );





    if(!zone){

        return;

    }





    let message = correct ?

    "✅ Bonne réponse !" :

    "❌ Mauvaise réponse !";





    zone.innerHTML += `


    <div class="resultat">


        <h3>

        ${message}

        </h3>


        <p>

        ${explication}

        </p>


    </div>


    `;





    setTimeout(()=>{


        if(this.joueur.vies>0){


            this.nouvelleQuestion();


        }



    },2500);




};









// ===============================
// Échec niveau
// ===============================


QuizEngine.echecNiveau=function(){



    alert(

    "❌ Toutes vos vies sont perdues. Vous recommencez ce niveau."

    );




    this.joueur.vies =

    this.config.totalVies;





    this.joueur.questionsUtilisees=[];




    this.sauvegarderJoueur();





    this.nouvelleQuestion();




};


// =======================================================
// PARTIE 5D : PROGRESSION - NIVEAUX - GRADES
// =======================================================



// ===============================
// Conditions de réussite
// ===============================


QuizEngine.conditionsNiveaux = {


    1:{
        questions:30,
        score:80
    },


    2:{
        questions:40,
        score:85
    },


    3:{
        questions:50,
        score:85
    },


    4:{
        questions:60,
        score:90
    },


    5:{
        questions:80,
        score:90
    },


    6:{
        questions:50,
        score:90
    },


    7:{
        questions:100,
        score:95
    }


};









// ===============================
// Calcul du score
// ===============================


QuizEngine.calculerScore=function(){


    if(this.joueur.questionsRepondues===0){

        return 0;

    }



    return Math.round(


        (

        this.joueur.bonnesReponses /

        this.joueur.questionsRepondues

        )

        *100


    );



};









// ===============================
// Vérifier réussite niveau
// ===============================


QuizEngine.verifierFinNiveau=function(){



    let niveau =

    this.joueur.niveau;



    let condition =

    this.conditionsNiveaux[niveau];





    if(!condition){

        return false;

    }





    let score =

    this.calculerScore();





    if(

        this.joueur.questionsRepondues >=

        condition.questions

        &&

        score >= condition.score

    ){


        return true;


    }



    return false;



};









// ===============================
// Valider niveau
// ===============================


QuizEngine.validerNiveau=function(){



    let niveauActuel =

    this.joueur.niveau;





    if(

    !this.joueur.niveauxDebloques.includes(

        niveauActuel + 1

    )){


        this.joueur.niveauxDebloques.push(

            niveauActuel + 1

        );


    }







    if(niveauActuel < 7){



        this.joueur.niveau++;



        this.joueur.vies =

        this.config.totalVies;



        this.joueur.questionsUtilisees=[];




        alert(

        "🎓 Félicitations ! Nouveau grade débloqué : "

        +

        this.niveauActuel().grade

        );



    }

    else{


        alert(

        "🏆 Vous avez terminé l'Académie IGT !"

        );


    }





    this.sauvegarderJoueur();



};









// ===============================
// Vérification après série
// ===============================


QuizEngine.controlerProgression=function(){



    if(

    this.verifierFinNiveau()

    ){



        this.validerNiveau();



    }



};









// ===============================
// Vérifier accès niveau
// ===============================


QuizEngine.accesNiveau=function(idNiveau){



    return (

    this.joueur.niveauxDebloques

    .includes(idNiveau)

    );



};









// ===============================
// Informations grade
// ===============================


QuizEngine.infoGrade=function(){



    let niveau =

    this.niveauActuel();





    return {


        niveau:niveau.id,


        titre:niveau.nom,


        grade:niveau.grade,


        score:this.calculerScore(),


        vies:this.joueur.vies



    };


};









// ===============================
// Examen final IGT
// ===============================


QuizEngine.demarrerExamenFinal=function(){



    if(this.joueur.niveau !==7){


        alert(

        "🔒 L'examen final est réservé au niveau Inspecteur Général du Travail."

        );


        return;


    }





    this.joueur.questionsUtilisees=[];


    this.joueur.questionsRepondues=0;


    this.joueur.bonnesReponses=0;


    this.joueur.mauvaisesReponses=0;



    this.sauvegarderJoueur();





    this.nouvelleQuestion();



};

// =======================================================
// PARTIE 5E : STATISTIQUES - HISTORIQUE - SAUVEGARDE AVANCÉE
// =======================================================



// ===============================
// Ajouter historique joueur
// ===============================


QuizEngine.ajouterHistorique = function(data){



    if(!this.joueur.historique){

        this.joueur.historique=[];

    }



    this.joueur.historique.push({


        date:new Date().toISOString(),


        ...data


    });




    // Limite pour éviter une sauvegarde trop lourde

    if(this.joueur.historique.length > 1000){


        this.joueur.historique.shift();


    }




};









// ===============================
// Enregistrer réponse
// ===============================


QuizEngine.enregistrerReponse = function(correct){



    let q = this.questionActuelle;



    this.ajouterHistorique({



        questionId:q.id,


        categorie:q.categorie,


        module:q.module,


        niveau:q.niveau,


        correcte:correct,


        difficulte:q.difficulte



    });





    this.mettreAJourCompetences();





};









// ===============================
// Compétences par domaine
// ===============================


QuizEngine.mettreAJourCompetences=function(){



    if(!this.joueur.competences){


        this.joueur.competences={};


    }





    let categorie =

    this.questionActuelle.categorie;





    if(!this.joueur.competences[categorie]){


        this.joueur.competences[categorie]={


            total:0,


            bonnes:0,


            score:0



        };


    }





    let competence =

    this.joueur.competences[categorie];





    competence.total++;





    if(

    this.questionActuelle.bonne ===

    this.derniereReponse

    ){


        competence.bonnes++;


    }





    competence.score = Math.round(


        (

        competence.bonnes /

        competence.total

        )

        *100


    );





};









// ===============================
// Tableau statistiques
// ===============================


QuizEngine.obtenirStatistiques=function(){



    return {



        niveau:this.joueur.niveau,


        grade:this.niveauActuel().grade,



        scoreGlobal:this.calculerScore(),



        questions:

        this.joueur.questionsRepondues,



        bonnes:

        this.joueur.bonnesReponses,



        mauvaises:

        this.joueur.mauvaisesReponses,



        vies:

        this.joueur.vies,



        argentFC:

        this.joueur.argentFC,



        argentUSD:

        this.joueur.argentUSD,



        badges:

        this.joueur.badges || []



    };



};









// ===============================
// Catégories faibles
// ===============================


QuizEngine.domainesAAmeliorer=function(){



    let result=[];



    let comp =

    this.joueur.competences || {};





    Object.keys(comp).forEach(



    domaine=>{


        if(comp[domaine].score < 70){


            result.push(domaine);


        }


    }



    );





    return result;



};









// ===============================
// Export progression
// ===============================


QuizEngine.exporterProgression=function(){



    let fichier =


    JSON.stringify(

        this.joueur,

        null,

        2

    );





    let blob =

    new Blob(

        [fichier],

        {

            type:"application/json"

        }

    );





    let url =

    URL.createObjectURL(blob);





    let lien =

    document.createElement("a");





    lien.href=url;



    lien.download=

    "Progression_IGT.json";





    lien.click();





};









// ===============================
// Import progression
// ===============================


QuizEngine.importerProgression=function(fichier){



    let lecteur =

    new FileReader();





    lecteur.onload=function(e){



        try{



            QuizEngine.joueur =

            JSON.parse(

                e.target.result

            );





            QuizEngine.sauvegarderJoueur();





            alert(

            "✅ Progression restaurée"

            );





        }

        catch(error){



            alert(

            "❌ Fichier invalide"

            );


        }



    };





    lecteur.readAsText(fichier);



};









// ===============================
// Réinitialiser progression
// ===============================


QuizEngine.resetProgression=function(){



    let confirmation =

    confirm(

    "Voulez-vous recommencer toute l'Académie IGT ?"

    );





    if(confirmation){



        this.joueur=

        this.nouveauJoueur();



        this.sauvegarderJoueur();



        location.reload();



    }



};


// =======================================================
// PARTIE 5G : CLASSEMENT - SCORE - PERFORMANCE
// =======================================================



// ===============================
// Initialiser classement
// ===============================


QuizEngine.initialiserClassement=function(){



    if(!localStorage.getItem("IGT_CLASSEMENT")){


        localStorage.setItem(

            "IGT_CLASSEMENT",

            JSON.stringify([])

        );


    }



};









// ===============================
// Calcul score professionnel
// ===============================


QuizEngine.calculerScoreProfessionnel=function(){



    let scoreBase =

    this.calculerScore();





    let bonusNiveau =

    this.joueur.niveau * 5;





    let bonusArgent =

    Math.floor(

    (

    this.joueur.argentFC / 100000

    )

    );





    let scoreFinal =


    scoreBase +

    bonusNiveau +

    bonusArgent;





    if(scoreFinal > 100){


        scoreFinal = 100;


    }





    return scoreFinal;



};









// ===============================
// Série de bonnes réponses
// ===============================


QuizEngine.combo = 0;


QuizEngine.meilleurCombo = 0;









QuizEngine.actualiserCombo=function(correct){



    if(correct){


        this.combo++;


    }

    else{


        this.combo=0;


    }






    if(

    this.combo >

    this.meilleurCombo

    ){


        this.meilleurCombo =

        this.combo;


    }




};









// ===============================
// Niveau de performance
// ===============================


QuizEngine.obtenirPerformance=function(){



    let score =

    this.calculerScoreProfessionnel();





    if(score >=95){


        return "👑 Excellence IGT";


    }



    if(score >=85){


        return "🏆 Très performant";


    }



    if(score >=70){


        return "🥇 Bon niveau professionnel";


    }



    if(score >=50){


        return "🥈 Niveau moyen - formation nécessaire";


    }




    return "🔴 Niveau insuffisant";



};









// ===============================
// Enregistrer dans classement
// ===============================


QuizEngine.enregistrerClassement=function(){



    let classement =

    JSON.parse(

    localStorage.getItem(

        "IGT_CLASSEMENT"

    )

    || "[]"

    );





    let joueurClassement={


        nom:this.joueur.nom || "Agent IGT",


        grade:this.niveauActuel().grade,


        niveau:this.joueur.niveau,


        score:this.calculerScoreProfessionnel(),


        argentFC:this.joueur.argentFC,


        argentUSD:this.joueur.argentUSD,


        combo:this.meilleurCombo,


        date:new Date().toISOString()



    };






    classement.push(

        joueurClassement

    );





    classement.sort(

        (a,b)=>


        b.score-a.score


    );





    // garder les 100 meilleurs

    classement =

    classement.slice(0,100);






    localStorage.setItem(

        "IGT_CLASSEMENT",

        JSON.stringify(

            classement

        )

    );




};









// ===============================
// Afficher classement
// ===============================


QuizEngine.afficherClassement=function(){



    let classement =

    JSON.parse(

    localStorage.getItem(

    "IGT_CLASSEMENT"

    )

    || "[]"

    );





    return classement;



};









// ===============================
// Position du joueur
// ===============================


QuizEngine.positionClassement=function(){



    let classement =

    this.afficherClassement();





    let position =

    classement.findIndex(



    j =>


    j.nom === this.joueur.nom


    );





    if(position === -1){


        return null;


    }





    return position + 1;



};









// ===============================
// Rapport de performance
// ===============================


QuizEngine.rapportPerformance=function(){



    return {


        grade:

        this.niveauActuel().grade,



        niveau:

        this.joueur.niveau,



        score:

        this.calculerScoreProfessionnel(),



        performance:

        this.obtenirPerformance(),



        combo:

        this.meilleurCombo,



        classement:

        this.positionClassement()



    };



};


// =======================================================
// PARTIE 5H : MODE EXAMEN OFFICIEL IGT
// =======================================================



QuizEngine.modeExamen = false;


QuizEngine.examen = {

    actif:false,

    questions:[],

    index:0,

    bonnes:0,

    duree:0,

    timer:null,

    niveau:null

};








// ===============================
// Configuration examens
// ===============================


QuizEngine.configExamens = {


    1:{
        questions:30,
        temps:20,
        reussite:80
    },


    2:{
        questions:40,
        temps:30,
        reussite:85
    },


    3:{
        questions:50,
        temps:45,
        reussite:85
    },


    4:{
        questions:60,
        temps:60,
        reussite:90
    },


    5:{
        questions:80,
        temps:90,
        reussite:90
    },


    6:{
        questions:80,
        temps:90,
        reussite:90
    },


    7:{
        questions:100,
        temps:120,
        reussite:95
    }

};









// ===============================
// Démarrer examen
// ===============================


QuizEngine.demarrerExamen=function(){



    let niveau =

    this.joueur.niveau;



    let config =

    this.configExamens[niveau];





    if(!config){

        return;

    }





    let banque =

    this.questions.filter(

        q=>q.niveau===niveau

    );





    banque.sort(

        ()=>Math.random()-0.5

    );





    this.examen.questions =

    banque.slice(

        0,

        config.questions

    );





    this.examen.index=0;


    this.examen.bonnes=0;


    this.examen.duree=

    config.temps * 60;


    this.examen.niveau=niveau;


    this.examen.actif=true;


    this.modeExamen=true;





    this.demarrerChronometre();





    this.afficherQuestionExamen();



};









// ===============================
// Chronomètre examen
// ===============================


QuizEngine.demarrerChronometre=function(){



    clearInterval(

        this.examen.timer

    );





    this.examen.timer =

    setInterval(()=>{



        this.examen.duree--;





        if(this.examen.duree<=0){



            this.terminerExamen();



        }



    },1000);



};









// ===============================
// Affichage question examen
// ===============================


QuizEngine.afficherQuestionExamen=function(){



    let question =

    this.examen.questions[

        this.examen.index

    ];





    if(!question){



        this.terminerExamen();


        return;


    }





    this.questionActuelle = question;





    this.preparerReponses();





    this.afficherQuestion();



};









// ===============================
// Réponse examen
// ===============================


QuizEngine.reponseExamen=function(index){



    let q =

    this.questionActuelle;





    if(index===q.bonne){



        this.examen.bonnes++;


    }






    this.examen.index++;





    this.afficherQuestionExamen();



};









// ===============================
// Fin examen
// ===============================


QuizEngine.terminerExamen=function(){



    clearInterval(

        this.examen.timer

    );





    let total =

    this.examen.questions.length;





    let note = Math.round(


        (

        this.examen.bonnes /

        total

        )

        *100


    );





    let condition =

    this.configExamens[

        this.examen.niveau

    ];





    let reussi =

    note >= condition.reussite;





    this.enregistrerExamen({


        niveau:this.examen.niveau,


        note:note,


        resultat:

        reussi ?

        "Réussi" :

        "Échec"


    });






    this.modeExamen=false;


    this.examen.actif=false;






    if(reussi){



        alert(

        "🎓 Examen réussi ! Note : "

        +note+"%"

        );



    }

    else{



        alert(

        "❌ Examen échoué. Note : "

        +note+"%"

        );



    }





};









// ===============================
// Historique examens
// ===============================


QuizEngine.enregistrerExamen=function(data){



    if(!this.joueur.examens){


        this.joueur.examens=[];


    }





    this.joueur.examens.push({


        date:new Date().toISOString(),


        ...data


    });





    this.sauvegarderJoueur();



};









// ===============================
// Dernier résultat examen
// ===============================


QuizEngine.dernierExamen=function(){



    if(!this.joueur.examens ||

       this.joueur.examens.length===0){


        return null;


    }





    return this.joueur.examens[

        this.joueur.examens.length-1

    ];



};


// =======================================================
// PARTIE 5I : MODE MISSION TERRAIN
// SIMULATEUR PROFESSIONNEL INSPECTEURBOT IGT
// =======================================================



QuizEngine.modeMission = false;


QuizEngine.mission = {

    active:false,

    scenario:null,

    decisions:[],

    score:0

};






// ===============================
// Banque scénarios terrain
// ===============================


QuizEngine.scenariosTerrain = [


{

id:1,

titre:"Contrôle inopiné en entreprise",

niveau:3,

situation:

"Vous arrivez dans une entreprise pour un contrôle. Le responsable refuse de présenter les registres du personnel.",


choix:[


{

texte:"Quitter immédiatement les lieux",

points:0

},


{

texte:"Rappeler les obligations, constater le refus et appliquer la procédure",

points:10

},


{

texte:"Menacer personnellement le responsable",

points:0

},


{

texte:"Demander un avantage pour régler la situation",

points:-20

}


],


explication:

"Un contrôleur doit rester professionnel et utiliser les procédures prévues."

},



{


id:2,

titre:"Tentative de corruption",

niveau:4,

situation:

"Pendant une inspection, un employeur propose de l'argent pour éviter une sanction.",


choix:[


{

texte:"Accepter discrètement",

points:-50

},


{

texte:"Refuser et signaler conformément aux règles",

points:15

},


{

texte:"Négocier le montant",

points:-30

},


{

texte:"Ignorer sans aucune trace",

points:-10

}


],


explication:

"L'intégrité est une obligation fondamentale de l'inspecteur."

},



{


id:3,

titre:"Travail interdit des mineurs",

niveau:4,

situation:

"Vous constatez la présence d'un mineur effectuant un travail dangereux.",


choix:[


{

texte:"Ne rien faire",

points:-20

},


{

texte:"Analyser la situation, protéger le mineur et appliquer le droit",

points:15

},


{

texte:"Punir immédiatement sans procédure",

points:0

},


{

texte:"Demander un paiement à l'employeur",

points:-50

}


],


explication:

"La protection des mineurs fait partie des missions essentielles."

},



{


id:4,

titre:"Conflit collectif",

niveau:5,

situation:

"Une grève provoque une tension importante entre travailleurs et employeur.",


choix:[


{

texte:"Choisir automatiquement le camp de l'employeur",

points:0

},


{

texte:"Favoriser le dialogue et analyser le respect du droit",

points:15

},


{

texte:"Ignorer la situation",

points:-10

},


{

texte:"Publier l'affaire sur les réseaux sociaux",

points:-20

}


],


explication:

"L'inspecteur doit favoriser la paix sociale et rester impartial."

}


];









// ===============================
// Démarrer mission
// ===============================


QuizEngine.demarrerMission=function(){



let niveau = this.joueur.niveau;



let missions =

this.scenariosTerrain.filter(

m=>m.niveau<=niveau

);





let choix =

missions[

Math.floor(

Math.random()*missions.length

)

];





this.mission.scenario=choix;


this.mission.active=true;


this.modeMission=true;


this.mission.score=0;




this.afficherMission();



};









// ===============================
// Affichage mission
// ===============================


QuizEngine.afficherMission=function(){



let m =

this.mission.scenario;



let zone =

document.getElementById(

"question-zone"

);



let reponses =

document.getElementById(

"reponses-zone"

);





if(!zone || !reponses){

return;

}





zone.innerHTML = `


<div class="mission-card">


<h2>

🏢 ${m.titre}

</h2>


<p>

${m.situation}

</p>


</div>


`;





reponses.innerHTML="";





m.choix.forEach(

(decision)=>{



let bouton =

document.createElement("button");



bouton.className=

"btn-reponse";



bouton.innerHTML=

decision.texte;



bouton.onclick=()=>{


this.validerDecisionMission(

decision

);


};





reponses.appendChild(bouton);



}

);


};









// ===============================
// Valider décision terrain
// ===============================


QuizEngine.validerDecisionMission=function(decision){



this.mission.score +=

decision.points;





this.ajouterReputation(

decision.points

);





alert(

"Décision enregistrée : "

+

(decision.points>0?

"Bonne pratique professionnelle":

"Décision problématique")

);





this.terminerMission();



};









// ===============================
// Réputation professionnelle
// ===============================


QuizEngine.ajouterReputation=function(points){



if(!this.joueur.reputation){


this.joueur.reputation=100;


}



this.joueur.reputation += points;





if(this.joueur.reputation>100){

this.joueur.reputation=100;

}



if(this.joueur.reputation<0){

this.joueur.reputation=0;

}



this.sauvegarderJoueur();



};









// ===============================
// Fin mission
// ===============================


QuizEngine.terminerMission=function(){



this.joueur.missionsTerminees =

(this.joueur.missionsTerminees||0)+1;




this.sauvegarderJoueur();



this.modeMission=false;


this.mission.active=false;





setTimeout(()=>{


this.nouvelleQuestion();


},1500);



};


// =======================================================
// PARTIE 5J : RÉPUTATION - ANTI-TRICHE
// SANCTIONS PROFESSIONNELLES
// =======================================================



// ===============================
// Initialisation sécurité joueur
// ===============================


QuizEngine.initialiserSecurite=function(){


    if(!this.joueur.securite){


        this.joueur.securite={


            alertes:0,


            sanctions:[],


            tentativeTriche:0,


            statut:"Normal"



        };


    }



    if(!this.joueur.reputation){


        this.joueur.reputation=100;


    }



};









// ===============================
// Vérifier intégrité progression
// ===============================


QuizEngine.verifierIntegrite=function(){



    let anomalie=false;





    // Vérification niveau

    if(

    this.joueur.niveau > 7 ||

    this.joueur.niveau < 1

    ){


        anomalie=true;


    }





    // Vérification argent

    if(

    this.joueur.argentFC < 0 ||

    this.joueur.argentUSD < 0

    ){


        anomalie=true;


    }





    // Vérification score impossible

    if(

    this.joueur.bonnesReponses >

    this.joueur.questionsRepondues

    ){


        anomalie=true;


    }





    if(anomalie){


        this.enregistrerIncident(

        "Modification suspecte de progression"

        );


        return false;


    }





    return true;



};









// ===============================
// Enregistrer incident
// ===============================


QuizEngine.enregistrerIncident=function(motif){



    this.initialiserSecurite();





    this.joueur.securite.alertes++;


    this.joueur.securite.tentativeTriche++;





    this.joueur.securite.sanctions.push({



        date:new Date().toISOString(),


        motif:motif



    });






    this.joueur.reputation -= 20;





    if(this.joueur.reputation < 0){


        this.joueur.reputation=0;


    }





    this.mettreAJourStatut();





    this.sauvegarderJoueur();



};









// ===============================
// Statut professionnel
// ===============================


QuizEngine.mettreAJourStatut=function(){



    let rep =

    this.joueur.reputation;





    if(rep>=90){


        this.joueur.securite.statut=

        "Agent exemplaire";


    }


    else if(rep>=70){


        this.joueur.securite.statut=

        "Agent surveillé";


    }


    else if(rep>=40){


        this.joueur.securite.statut=

        "Formation obligatoire";


    }


    else{


        this.joueur.securite.statut=

        "Sanction académique";


    }



};









// ===============================
// Surveillance temps réponse
// ===============================


QuizEngine.demarrerChronoQuestion=function(){



    this.debutQuestion=

    Date.now();



};









QuizEngine.verifierTempsReponse=function(){



    let temps =

    (

    Date.now()

    -

    this.debutQuestion

    )

    /1000;





    // Réponse trop rapide suspecte

    if(temps < 2){



        this.enregistrerIncident(

        "Temps de réponse anormal"

        );



    }





};









// ===============================
// Sanction académique
// ===============================


QuizEngine.appliquerSanction=function(type){



    let sanction={


        date:new Date().toISOString(),


        type:type



    };





    this.joueur.securite.sanctions.push(

        sanction

    );





    if(type==="NIVEAU_RETIRE"){



        if(this.joueur.niveau>1){



            this.joueur.niveau--;



        }



    }







    if(type==="REPUTATION"){



        this.joueur.reputation-=30;



    }







    this.mettreAJourStatut();


    this.sauvegarderJoueur();



};









// ===============================
// Rapport disciplinaire
// ===============================


QuizEngine.rapportDiscipline=function(){



    this.initialiserSecurite();





    return {



        reputation:

        this.joueur.reputation,



        statut:

        this.joueur.securite.statut,



        alertes:

        this.joueur.securite.alertes,



        sanctions:

        this.joueur.securite.sanctions



    };



};


// =======================================================
// PARTIE 5K : INTELLIGENCE PÉDAGOGIQUE
// FORMATION PERSONNALISÉE INSPECTEURBOT IGT
// =======================================================



QuizEngine.analysePedagogique = function(){


    let analyse = {


        pointsForts:[],


        pointsFaibles:[],


        recommandations:[]


    };



    let competences =

    this.joueur.competences || {};





    Object.keys(competences).forEach(

    domaine=>{


        let score =

        competences[domaine].score || 0;





        if(score >=85){



            analyse.pointsForts.push(

                domaine

            );


        }



        else if(score <70){



            analyse.pointsFaibles.push(

                domaine

            );


        }



    });





    analyse.recommandations =

    this.genererRecommandations(

        analyse.pointsFaibles

    );





    return analyse;



};









// ===============================
// Recommandations automatiques
// ===============================


QuizEngine.genererRecommandations=function(domaines){



    let recommandations=[];





    domaines.forEach(

    domaine=>{



        switch(domaine){



            case "Code du Travail":


            recommandations.push(

            "Réviser les articles du Code du Travail RDC"

            );


            break;





            case "PV":


            recommandations.push(

            "Revoir l'élaboration des procès-verbaux et constats d'infraction"

            );


            break;





            case "SMIG":


            recommandations.push(

            "Réviser les calculs SMIG, salaires et décomptes finaux"

            );


            break;





            case "Corruption":


            recommandations.push(

            "Renforcer l'éthique et la déontologie professionnelle"

            );


            break;





            case "Mission terrain":


            recommandations.push(

            "S'entraîner avec les simulations d'inspection"

            );


            break;





            default:


            recommandations.push(

            "Effectuer une révision générale"

            );



        }



    });



    return recommandations;



};









// ===============================
// Questions difficiles personnalisées
// ===============================


QuizEngine.trouverQuestionsFaibles=function(){



    let erreurs =

    this.joueur.historique || [];





    let questionsDifficiles=[];





    erreurs.forEach(

    item=>{



        if(item.correcte===false){



            let q =

            this.questions.find(

                question =>

                question.id===item.questionId

            );





            if(q){


                questionsDifficiles.push(q);


            }



        }



    });





    return questionsDifficiles;



};









// ===============================
// Mode révision ciblée
// ===============================


QuizEngine.demarrerRevision=function(){



    let questions =

    this.trouverQuestionsFaibles();





    if(questions.length===0){



        alert(

        "✅ Aucune faiblesse détectée. Continuez votre progression."

        );



        return;


    }





    this.questionsNiveau = questions;





    this.questionActuelle =

    questions[

        Math.floor(

        Math.random()*questions.length

        )

    ];





    this.preparerReponses();



    this.afficherQuestion();



};









// ===============================
// Niveau de maîtrise
// ===============================


QuizEngine.niveauMaitrise=function(domaine){



    let competence =

    this.joueur.competences?.[domaine];





    if(!competence){



        return "Non évalué";


    }





    let score =

    competence.score;





    if(score>=90){


        return "Expert";


    }


    if(score>=75){


        return "Maîtrisé";


    }


    if(score>=50){


        return "En progression";


    }





    return "À renforcer";



};









// ===============================
// Rapport pédagogique complet
// ===============================


QuizEngine.rapportPedagogique=function(){



    let analyse =

    this.analysePedagogique();





    return {



        joueur:

        this.joueur.nom,



        grade:

        this.niveauActuel().grade,



        niveau:

        this.joueur.niveau,



        forces:

        analyse.pointsForts,



        faiblesses:

        analyse.pointsFaibles,



        recommandations:

        analyse.recommandations



    };



};


// =======================================================
// PARTIE 5L : MODE SOMBRE + PARTAGE WHATSAPP
// =======================================================



// ===============================
// Gestion thème sombre
// ===============================


QuizEngine.theme = {


    sombre:false


};









// ===============================
// Charger préférence thème
// ===============================


QuizEngine.chargerTheme=function(){



    let theme =

    localStorage.getItem(

        "IGT_THEME"

    );





    if(theme==="dark"){


        this.activerModeSombre(false);


    }


};









// ===============================
// Activer mode sombre
// ===============================


QuizEngine.activerModeSombre=function(sauvegarder=true){



    document.body.classList.add(

        "dark-mode"

    );



    this.theme.sombre=true;





    if(sauvegarder){



        localStorage.setItem(

            "IGT_THEME",

            "dark"

        );


    }





};









// ===============================
// Désactiver mode sombre
// ===============================


QuizEngine.desactiverModeSombre=function(){



    document.body.classList.remove(

        "dark-mode"

    );



    this.theme.sombre=false;





    localStorage.setItem(

        "IGT_THEME",

        "light"

    );



};









// ===============================
// Changer thème
// ===============================


QuizEngine.changerTheme=function(){



    if(this.theme.sombre){


        this.desactiverModeSombre();


    }

    else{


        this.activerModeSombre();


    }



};









// ===============================
// Détection thème système
// ===============================


QuizEngine.themeAutomatique=function(){



    if(

    window.matchMedia

    &&

    window.matchMedia(

    "(prefers-color-scheme: dark)"

    ).matches

    ){



        this.activerModeSombre(false);



    }



};









// =======================================================
// PARTAGE QUESTION WHATSAPP
// =======================================================





QuizEngine.partagerQuestionWhatsApp=function(){



    let q =

    this.questionActuelle;





    if(!q){



        alert(

        "Aucune question disponible"

        );


        return;


    }







    let message =



`📚 *Académie InspecteurBot IGT RDC*

📝 Question d'entraînement :

${q.question}


`;






    q.choix.forEach(

    (choix,index)=>{



        message +=

        "\n"+

        String.fromCharCode(65+index)

        +

        ". "

        +

        choix;



    });






    message +=



`

\n\n🎯 Répondez avant de consulter la correction.

#InspecteurBotIGT

`;







    let url =


    "https://wa.me/?text="

    +

    encodeURIComponent(

        message

    );






    window.open(

        url,

        "_blank"

    );



};









// ===============================
// Partage résultat (optionnel)
// ===============================


QuizEngine.partagerPerformanceWhatsApp=function(){



    let rapport =

    this.rapportPerformance();





    let message =



`🏆 Résultat Académie InspecteurBot IGT RDC


👮 Grade :
${rapport.grade}


📊 Score :
${rapport.score}%


⭐ Performance :
${rapport.performance}


#InspecteurBotIGT`;







    let url =

    "https://wa.me/?text="

    +

    encodeURIComponent(

        message

    );





    window.open(

        url,

        "_blank"

    );



};

// =======================================================
// PARTIE 5M : SÉCURITÉ FINALE
// SAUVEGARDE - RESTAURATION - VALIDATION
// =======================================================



// ===============================
// Vérifier banque questions
// ===============================


QuizEngine.verifierQuestionBank=function(){



    if(!Array.isArray(this.questions)){



        console.error(

        "Banque questions invalide"

        );


        return false;


    }







    let valide =

    this.questions.every(

    q=>



        q.id &&

        q.question &&

        q.choix &&

        q.choix.length>=2 &&

        q.bonne!==undefined



    );






    if(!valide){



        console.error(

        "Certaines questions sont incorrectes"

        );


    }






    return valide;



};









// ===============================
// Sauvegarde principale sécurisée
// ===============================


QuizEngine.sauvegardeSecurisee=function(){



    try{



        let donnees =

        JSON.stringify(

            this.joueur

        );





        localStorage.setItem(

            "IGT_PLAYER_BACKUP",

            donnees

        );





        localStorage.setItem(

            "IGT_PLAYER",

            donnees

        );





        return true;



    }

    catch(error){



        console.error(

        "Erreur sauvegarde",

        error

        );



        return false;


    }



};









// ===============================
// Restaurer sauvegarde secours
// ===============================


QuizEngine.restaurerSauvegarde=function(){



    let backup =

    localStorage.getItem(

        "IGT_PLAYER_BACKUP"

    );





    if(!backup){



        return false;


    }







    try{



        this.joueur =

        JSON.parse(

            backup

        );





        this.sauvegarderJoueur();





        return true;



    }

    catch(error){



        return false;


    }



};









// ===============================
// Vérification profil joueur
// ===============================


QuizEngine.verifierProfil=function(){



    let obligatoire = [


        "niveau",

        "vies",

        "argentFC",

        "argentUSD",

        "bonnesReponses",

        "mauvaisesReponses"


    ];





    obligatoire.forEach(

    element=>{



        if(

        this.joueur[element]===undefined

        ){



            this.joueur[element]=0;



        }



    });






    if(this.joueur.niveau===0){


        this.joueur.niveau=1;


    }





    if(this.joueur.vies===0){


        this.joueur.vies=

        this.config.totalVies;


    }






};









// ===============================
// Nettoyage sauvegardes anciennes
// ===============================


QuizEngine.nettoyerSauvegardes=function(){



    let historique =

    localStorage.getItem(

        "IGT_HISTORY"

    );





    if(!historique){



        return;


    }







    try{



        let liste =

        JSON.parse(

            historique

        );





        if(liste.length>500){



            liste =

            liste.slice(

            -500

            );



            localStorage.setItem(

            "IGT_HISTORY",

            JSON.stringify(liste)

            );



        }





    }

    catch(error){



        localStorage.removeItem(

        "IGT_HISTORY"

        );


    }



};









// ===============================
// Mode hors connexion préparation
// ===============================


QuizEngine.verifierConnexion=function(){



    if(navigator.onLine){



        return "En ligne";


    }

    else{



        return "Mode hors connexion";


    }



};









// ===============================
// Sécurité générale au démarrage
// ===============================


QuizEngine.securiteDemarrage=function(){



    this.verifierProfil();



    this.verifierQuestionBank();



    this.nettoyerSauvegardes();



    this.sauvegardeSecurisee();



};


// =======================================================
// PARTIE 5N : OPTIMISATION MOBILE & PERFORMANCE
// MODE HORS LIGNE
// =======================================================



// ===============================
// Détection appareil mobile
// ===============================


QuizEngine.estMobile=function(){



    return /Android|iPhone|iPad|iPod/i

    .test(

        navigator.userAgent

    );



};









// ===============================
// Cache banque questions
// ===============================


QuizEngine.mettreQuestionsEnCache=function(){



    try{



        localStorage.setItem(


            "IGT_QUESTIONS_CACHE",


            JSON.stringify(

                this.questions

            )


        );



        console.log(

        "Questions sauvegardées hors ligne"

        );



    }

    catch(error){



        console.warn(

        "Cache impossible",

        error

        );



    }



};









// ===============================
// Charger questions depuis cache
// ===============================


QuizEngine.chargerQuestionsCache=function(){



    let cache =

    localStorage.getItem(

        "IGT_QUESTIONS_CACHE"

    );





    if(cache){



        try{



            this.questions =

            JSON.parse(

                cache

            );





            console.log(

            "Questions chargées depuis cache"

            );





            return true;



        }

        catch(error){



            console.warn(

            "Cache invalide"

            );



        }



    }





    return false;



};









// ===============================
// Chargement intelligent questions
// ===============================


QuizEngine.chargementIntelligent=async function(){



    if(

    navigator.onLine

    ){



        await this.chargerQuestions();



        this.mettreQuestionsEnCache();



    }

    else{



        let disponible =

        this.chargerQuestionsCache();





        if(!disponible){



            console.error(

            "Aucune banque disponible hors ligne"

            );



        }



    }



};









// ===============================
// Nettoyage mémoire
// ===============================


QuizEngine.optimiserMemoire=function(){



    // Limiter historique

    if(

    this.joueur.historique &&

    this.joueur.historique.length > 1000

    ){



        this.joueur.historique =

        this.joueur.historique.slice(

        -1000

        );



    }





    // Limiter questions utilisées

    if(

    this.joueur.questionsUtilisees &&

    this.joueur.questionsUtilisees.length > 500

    ){



        this.joueur.questionsUtilisees =

        this.joueur.questionsUtilisees.slice(

        -500

        );



    }





};









// ===============================
// Préchargement application
// ===============================


QuizEngine.prechargerApplication=function(){



    this.optimiserMemoire();



    if(

    this.estMobile()

    ){



        console.log(

        "📱 Optimisation Android activée"

        );



    }

    else{



        console.log(

        "💻 Mode ordinateur"

        );



    }



};









// ===============================
// Performance chargement
// ===============================


QuizEngine.performance=function(){



    return {



        mobile:

        this.estMobile(),



        connexion:

        navigator.onLine,


        questions:

        this.questions.length,


        memoire:

        this.joueur.historique ?

        this.joueur.historique.length :

        0



    };



};









// ===============================
// Initialisation finale optimisée
// ===============================


QuizEngine.demarrageOptimise=async function(){



    this.chargerJoueur();



    await this.chargementIntelligent();



    this.verifierProfil();



    this.securiteDemarrage();



    this.prechargerApplication();



    this.actualiserInterface();



};









         
