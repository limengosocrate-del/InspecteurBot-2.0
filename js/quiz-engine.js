/* ==========================================================
   QUIZ ENGINE
   ACADEMIE PROFESSIONNELLE INSPECTEURBOT IGT RDC
   VERSION COMPATIBLE QUESTION_BANK V3.0

   Développé par
   Inspecteur Limengo (Pmiller) © 2026
========================================================== */



"use strict";





/* ==========================================================
   CONFIGURATION GENERALE
========================================================== */


const QuizEngine = {


    version:"3.0",


    initialized:false,


    questionFile:"question_bank.json",


    questions:[],


    currentQuestion:0,


    score:0,


    lives:5,


    rewardFC:0,


    rewardUSD:0,


    level:"Débutant",


    progress:0,


    answered:false,


    timer:null,


    time:0



};








/* ==========================================================
   ELEMENTS HTML
========================================================== */


const DOM = {


    questionText:null,


    answersContainer:null,


    categorieQuiz:null,


    timer:null,


    numeroQuestion:null,


    lifeDisplay:null,


    rewardDisplay:null,


    quizProgress:null,


    feedback:null,


    darkModeBtn:null,


    notificationBtn:null


};








/* ==========================================================
   CONNEXION ELEMENTS HTML
========================================================== */


function connectDOM(){



    DOM.questionText =

    document.getElementById(
    "questionText"
    );



    DOM.answersContainer =

    document.getElementById(
    "answersContainer"
    );



    DOM.categorieQuiz =

    document.getElementById(
    "categorieQuiz"
    );



    DOM.timer =

    document.getElementById(
    "timer"
    );



    DOM.numeroQuestion =

    document.getElementById(
    "numeroQuestion"
    );



    DOM.lifeDisplay =

    document.getElementById(
    "lifeDisplay"
    );



    DOM.rewardDisplay =

    document.getElementById(
    "rewardDisplay"
    );



    DOM.quizProgress =

    document.getElementById(
    "quizProgress"
    );



    DOM.feedback =

    document.getElementById(
    "feedback"
    );



    DOM.darkModeBtn =

    document.getElementById(
    "darkModeBtn"
    );



    DOM.notificationBtn =

    document.getElementById(
    "notificationBtn"
    );



}


/* ==========================================================
   PARTIE 2
   CHARGEMENT QUESTION_BANK V3.0
   FORMAT:
   {
      version:"3.0",
      questions:[]
   }
========================================================== */






/* ==========================================================
   CHARGEMENT BANQUE QUESTIONS
========================================================== */


async function loadQuestions(){


    try{


        const response = await fetch(

            QuizEngine.questionFile

        );



        if(!response.ok){


            throw new Error(

            "Fichier question_bank.json introuvable"

            );


        }



        const data = await response.json();



        if(
            !data.questions
            ||
            !Array.isArray(data.questions)
        ){


            throw new Error(

            "Format question_bank.json invalide"

            );


        }



        QuizEngine.questions =

        data.questions;



        console.log(

        "Questions chargées :",

        QuizEngine.questions.length

        );



        if(
            QuizEngine.questions.length===0
        ){


            throw new Error(

            "Aucune question disponible"

            );


        }



        showQuestion();



    }


    catch(error){


        console.error(

        "Erreur chargement questions :",

        error

        );



        showLoadingError();


    }


}








/* ==========================================================
   MESSAGE ERREUR CHARGEMENT
========================================================== */


function showLoadingError(){


    if(
        DOM.questionText
    ){


        DOM.questionText.innerHTML =

        `
        ⚠️ Erreur de chargement des questions
        `;


    }



    if(
        DOM.answersContainer
    ){


        DOM.answersContainer.innerHTML =

        `
        <p>
        Vérifiez la présence de question_bank.json
        </p>
        `;


    }


}








/* ==========================================================
   NETTOYAGE QUESTIONS INVALIDES
========================================================== */


function prepareQuestions(){



    QuizEngine.questions =

    QuizEngine.questions.filter(

        question =>{


            return (

                question.question
                &&
                question.choix
                &&
                Array.isArray(question.choix)

            );


        }

    );



    console.log(

    "Questions prêtes :",

    QuizEngine.questions.length

    );


}


/* ==========================================================
   PARTIE 3
   AFFICHAGE QUESTION
   CHOIX DE REPONSES
   VALIDATION REPONSE "bonne"
========================================================== */






/* ==========================================================
   AFFICHER QUESTION ACTUELLE
========================================================== */


function showQuestion(){



    if(
        QuizEngine.currentQuestion >=
        QuizEngine.questions.length
    ){


        finishQuiz();


        return;


    }




    QuizEngine.answered = false;



    const question =

    QuizEngine.questions[

        QuizEngine.currentQuestion

    ];





    if(!question){


        handleError(

        "Question inexistante"

        );


        return;


    }







    /* CATEGORIE */


    if(DOM.categorieQuiz){


        DOM.categorieQuiz.textContent =

        question.categorie

        ||
        "Académie IGT";


    }







    /* TEXTE QUESTION */


    if(DOM.questionText){


        DOM.questionText.textContent =

        question.question;


    }







    /* NUMERO QUESTION */


    if(DOM.numeroQuestion){


        DOM.numeroQuestion.textContent =


        (

            QuizEngine.currentQuestion + 1

        )

        +

        " / "

        +

        QuizEngine.questions.length;



    }







    displayAnswers(question);



    updateInterface();



}








/* ==========================================================
   AFFICHAGE DES CHOIX
========================================================== */


function displayAnswers(question){



    if(!DOM.answersContainer){


        return;


    }



    DOM.answersContainer.innerHTML = "";





    question.choix.forEach(

        (choice,index)=>{


            const button =

            document.createElement(

            "button"

            );



            button.className =

            "answer-option";



            button.innerHTML =


            `

            <span>

            ${String.fromCharCode(65+index)}

            .

            </span>

            ${choice}

            `;



            button.addEventListener(

            "click",

            ()=>{


                checkAnswer(

                    index,

                    question,

                    button

                );


            }

            );



            DOM.answersContainer.appendChild(

            button

            );


        }

    );



}








/* ==========================================================
   VERIFICATION REPONSE
========================================================== */


function checkAnswer(

selected,

question,

button

){



    if(
        QuizEngine.answered
    ){


        return;


    }



    QuizEngine.answered = true;





    const correct =

    question.bonne;







    if(
        selected === correct
    ){



        button.classList.add(

        "correct"

        );



        QuizEngine.score++;



        addReward(

        question.recompense

        );



        showFeedback(

        true,

        question.explication

        );



        sendNotification(

        "Bonne réponse ! Progression validée.",

        "success"

        );



    }

    else{



        button.classList.add(

        "wrong"

        );



        QuizEngine.lives--;



        showFeedback(

        false,

        question.explication

        );



        sendNotification(

        "Mauvaise réponse. Une vie a été perdue.",

        "error"

        );



    }





    saveProgress();



    updateInterface();



    setTimeout(

    ()=>{


        QuizEngine.currentQuestion++;


        showQuestion();


    },

    2500

    );


           }


/* ==========================================================
   PARTIE 4
   RECOMPENSES
   FC / USD
   VIES
   PROGRESSION
   INTERFACE
========================================================== */






/* ==========================================================
   AJOUT RECOMPENSE
========================================================== */


function addReward(reward){



    if(!reward){


        return;


    }





    if(
        reward.type === "CDF"
    ){


        QuizEngine.rewardFC +=

        Number(

            reward.montant

        )
        ||
        0;



    }




    if(
        reward.type === "USD"
    ){


        QuizEngine.rewardUSD +=

        Number(

            reward.montant

        )
        ||
        0;



    }



}








/* ==========================================================
   CALCUL PROGRESSION
========================================================== */


function calculateProgress(){



    if(
        QuizEngine.questions.length===0
    ){


        return 0;


    }



    return Math.round(

        (

        QuizEngine.currentQuestion

        /

        QuizEngine.questions.length

        )

        *

        100

    );



}








/* ==========================================================
   MISE A JOUR INTERFACE COMPLETE
========================================================== */


function updateInterface(){



    const progress =

    calculateProgress();



    QuizEngine.progress =

    progress;







    /* VIES */


    if(
        DOM.lifeDisplay
    ){


        let hearts="";



        for(
            let i=0;
            i<5;
            i++
        ){


            hearts +=

            i < QuizEngine.lives

            ?

            "❤️"

            :

            "🖤";


        }



        DOM.lifeDisplay.textContent =

        hearts;


    }







    /* RECOMPENSE */


    if(
        DOM.rewardDisplay
    ){


        DOM.rewardDisplay.textContent =


        QuizEngine.rewardFC.toLocaleString()

        +

        " FC | "

        +

        QuizEngine.rewardUSD

        +

        " $";


    }







    /* PROGRESSION */


    if(
        DOM.quizProgress
    ){


        DOM.quizProgress.textContent =

        progress

        +

        " %";


    }







    const fill =

    document.getElementById(

    "progressFill"

    );



    if(fill){


        fill.style.width =

        progress

        +

        "%";


    }







    /* COMPTEUR VIES DASHBOARD */


    const lifeCount =

    document.getElementById(

    "lifeCount"

    );



    if(lifeCount){


        lifeCount.textContent =

        QuizEngine.lives;


    }







    /* PORTE-MONNAIE */


    const cdf =

    document.getElementById(

    "cdf"

    );



    const usd =

    document.getElementById(

    "usd"

    );



    if(cdf){


        cdf.textContent =

        QuizEngine.rewardFC.toLocaleString()

        +

        " FC";


    }



    if(usd){


        usd.textContent =

        QuizEngine.rewardUSD

        +

        " $";


    }



}








/* ==========================================================
   VERIFICATION FIN DE QUIZ
========================================================== */


function checkLives(){



    if(
        QuizEngine.lives <=0
    ){


        QuizEngine.lives = 0;



        showFeedback(

        false,

        "Toutes vos vies sont épuisées. Révision du niveau obligatoire."

        );



        saveProgress();



        setTimeout(

        ()=>{


            location.reload();


        },

        3000

        );



    }



}








/* ==========================================================
   INITIALISATION QUESTIONS
========================================================== */


function startQuiz(){



    prepareQuestions();



    QuizEngine.currentQuestion = 0;



    QuizEngine.score = 0;



    QuizEngine.answered = false;



    updateInterface();



    showQuestion();



           }


/* ==========================================================
   PARTIE 5
   SYSTEME DE NIVEAUX
   GRADES IGT
   DEBLOCAGE CARRIERE
========================================================== */






/* ==========================================================
   PARCOURS PROFESSIONNEL IGT
========================================================== */


const ACADEMIE_LEVELS = [


    {

        niveau:1,

        grade:"Débutant",

        scoreMinimum:70


    },


    {

        niveau:2,

        grade:"Administratif",

        scoreMinimum:70


    },


    {

        niveau:3,

        grade:"Contrôleur du Travail",

        scoreMinimum:75


    },


    {

        niveau:4,

        grade:"Inspecteur du Travail",

        scoreMinimum:80


    },


    {

        niveau:5,

        grade:"Directeur",

        scoreMinimum:85


    },


    {

        niveau:6,

        grade:"Inspecteur Général Adjoint",

        scoreMinimum:90


    },


    {

        niveau:7,

        grade:"Inspecteur Général du Travail",

        scoreMinimum:95


    }


];








/* ==========================================================
   OBTENIR NIVEAU ACTUEL
========================================================== */


function getCurrentLevel(){



    return ACADEMIE_LEVELS.find(

        level =>

        level.grade === QuizEngine.level

    )

    ||

    ACADEMIE_LEVELS[0];



}








/* ==========================================================
   VERIFICATION DEBLOCAGE NIVEAU
========================================================== */


function checkLevelCompletion(){



    const score =

    calculateFinalScore();




    const current =

    getCurrentLevel();




    if(
        score >= current.scoreMinimum
    ){



        unlockNextLevel();



    }

    else{



        sendNotification(

        "Niveau non validé. Vous devez réviser avant de continuer.",

        "error"

        );



    }



}








/* ==========================================================
   DEBLOQUER NIVEAU SUIVANT
========================================================== */


function unlockNextLevel(){



    const index =

    ACADEMIE_LEVELS.findIndex(

        level =>

        level.grade === QuizEngine.level

    );



    const next =

    ACADEMIE_LEVELS[index + 1];





    if(!next){



        sendNotification(

        "Félicitations ! Vous avez atteint le grade maximum IGT.",

        "success"

        );


        return;


    }







    QuizEngine.level =

    next.grade;





    sendNotification(

    "Nouveau grade débloqué : "

    +

    next.grade,

    "success"

    );



    saveProgress();



    updateCareerDisplay();



}








/* ==========================================================
   AFFICHAGE CARRIERE
========================================================== */


function updateCareerDisplay(){



    const items =

    document.querySelectorAll(

    ".career-item"

    );



    if(
        !items.length
    ){


        return;


    }



    const currentIndex =

    ACADEMIE_LEVELS.findIndex(

        level =>

        level.grade === QuizEngine.level

    );





    items.forEach(

        (item,index)=>{



            item.classList.remove(

            "active"

            );



            item.classList.remove(

            "locked"

            );



            if(
                index <= currentIndex
            ){


                item.classList.add(

                "active"

                );


            }

            else{


                item.classList.add(

                "locked"

                );


            }



        }

    );



}








/* ==========================================================
   CONTROLE ACCES FORMATION
========================================================== */


function canAccessModule(requiredLevel){



    const current =

    getCurrentLevel().niveau;



    return current >= requiredLevel;



}








/* ==========================================================
   VERROUILLAGE FORMATIONS
========================================================== */


function updateFormationAccess(){



    const modules =

    document.querySelectorAll(

    ".formation-card"

    );



    modules.forEach(

    (module,index)=>{



        const required =

        index + 1;



        if(
            canAccessModule(required)
        ){


            module.classList.remove(

            "locked"

            );



            module.classList.add(

            "unlocked"

            );


        }

        else{


            module.classList.add(

            "locked"

            );


        }



    }

    );



       }


/* ==========================================================
   PARTIE 6
   SAUVEGARDE LOCALSTORAGE
   RESTAURATION PROGRESSION
   PROFIL APPRENANT IGT
========================================================== */






/* ==========================================================
   CLE DE SAUVEGARDE
========================================================== */


const STORAGE_KEY =

"inspecteurbot_academie_progression";








/* ==========================================================
   SAUVEGARDE COMPLETE
========================================================== */


function saveProgress(){



    const data = {



        version:

        QuizEngine.version,



        level:

        QuizEngine.level,



        score:

        QuizEngine.score,



        currentQuestion:

        QuizEngine.currentQuestion,



        lives:

        QuizEngine.lives,



        rewardFC:

        QuizEngine.rewardFC,



        rewardUSD:

        QuizEngine.rewardUSD,



        progress:

        QuizEngine.progress,



        badges:

        JSON.parse(

        localStorage.getItem(

        "igt_badges"

        )

        )

        ||

        [],



        date:

        new Date().toISOString()



    };





    localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(data)

    );



}








/* ==========================================================
   CHARGEMENT PROGRESSION
========================================================== */


function loadProgress(){



    const saved =

    localStorage.getItem(

    STORAGE_KEY

    );



    if(
        !saved
    ){



        return;


    }



    try{



        const data =

        JSON.parse(saved);





        QuizEngine.level =

        data.level

        ||

        "Débutant";





        QuizEngine.score =

        data.score

        ||

        0;





        QuizEngine.currentQuestion =

        data.currentQuestion

        ||

        0;





        QuizEngine.lives =

        data.lives

        ||

        5;





        QuizEngine.rewardFC =

        data.rewardFC

        ||

        0;





        QuizEngine.rewardUSD =

        data.rewardUSD

        ||

        0;





        QuizEngine.progress =

        data.progress

        ||

        0;





        console.log(

        "Progression restaurée",

        data

        );



    }


    catch(error){



        console.error(

        "Erreur restauration progression",

        error

        );



        resetProgress();



    }



}








/* ==========================================================
   SUPPRESSION PROGRESSION
========================================================== */


function resetProgress(){



    localStorage.removeItem(

    STORAGE_KEY

    );



    localStorage.removeItem(

    "igt_badges"

    );



    location.reload();



}








/* ==========================================================
   PROFIL UTILISATEUR
========================================================== */


function updatePlayerProfile(){



    const gradeName =

    document.getElementById(

    "gradeName"

    );



    const grade =

    document.getElementById(

    "grade"

    );



    const niveau =

    document.getElementById(

    "niveauName"

    );





    if(gradeName){


        gradeName.textContent =

        "Grade : "

        +

        QuizEngine.level;


    }





    if(grade){


        grade.textContent =

        QuizEngine.level;


    }





    if(niveau){


        const current =

        getCurrentLevel();



        niveau.textContent =

        "Niveau "

        +

        current.niveau;


    }



}








/* ==========================================================
   SYNCHRONISATION PROFIL
========================================================== */


function syncUserData(){



    updatePlayerProfile();



    updateInterface();



    updateCareerDisplay();



    updateFormationAccess();



    }


/* ==========================================================
   PARTIE 7
   TIMER
   FEEDBACK
   NOTIFICATIONS
   MESSAGES ACADEMIE
========================================================== */






/* ==========================================================
   DEMARRER TIMER
========================================================== */


function startTimer(){



    stopTimer();



    QuizEngine.time = 0;



    QuizEngine.timer = setInterval(



        ()=>{



            QuizEngine.time++;



            updateTimerDisplay();



        },

        1000



    );



}








/* ==========================================================
   ARRETER TIMER
========================================================== */


function stopTimer(){



    if(
        QuizEngine.timer
    ){


        clearInterval(

        QuizEngine.timer

        );


        QuizEngine.timer = null;


    }



}








/* ==========================================================
   AFFICHAGE TIMER
========================================================== */


function updateTimerDisplay(){



    if(
        !DOM.timer
    ){


        return;


    }





    const minutes =

    Math.floor(

        QuizEngine.time / 60

    );





    const seconds =

    QuizEngine.time % 60;





    DOM.timer.textContent =



    String(minutes)

    .padStart(

    2,

    "0"

    )

    +

    ":"

    +

    String(seconds)

    .padStart(

    2,

    "0"

    );



}








/* ==========================================================
   FEEDBACK REPONSE
========================================================== */


function showFeedback(

success,

message

){



    if(
        !DOM.feedback
    ){


        return;


    }





    if(success){



        DOM.feedback.className =

        "feedback success";



        DOM.feedback.innerHTML =



        `

        ✅ Bonne réponse !

        <br>

        ${message || ""}

        `;



    }

    else{



        DOM.feedback.className =

        "feedback error";



        DOM.feedback.innerHTML =



        `

        ❌ Réponse incorrecte

        <br>

        ${message || ""}

        `;



    }





}








/* ==========================================================
   SYSTEME NOTIFICATION
========================================================== */


function sendNotification(

message,

type="info"

){



    const list =

    document.getElementById(

    "notificationList"

    );





    if(list){



        const li =

        document.createElement(

        "li"

        );



        li.className =

        "notification-"

        +

        type;



        li.textContent =

        message;



        list.prepend(

        li

        );



    }





    console.log(

    "[Notification]",

    message

    );



}








/* ==========================================================
   INITIALISATION NOTIFICATIONS
========================================================== */


function initNotifications(){



    const button =

    DOM.notificationBtn;



    if(!button){


        return;


    }





    button.addEventListener(

    "click",

    ()=>{



        const list =

        document.getElementById(

        "notificationList"

        );



        if(list){



            list.scrollIntoView({

                behavior:"smooth"

            });



        }



    }

    );



}








/* ==========================================================
   FIN DE SESSION QUIZ
========================================================== */


function completeExam(){



    stopTimer();



    const score =

    calculateFinalScore();





    sendNotification(



    "Examen terminé avec un score de "

    +

    score

    +

    "%.",



    "success"



    );





    checkLevelCompletion();



    saveProgress();



       }



/* ==========================================================
   PARTIE 8
   SCORE FINAL
   BADGES
   CERTIFICATION
   RECOMPENSE EXAMEN
========================================================== */






/* ==========================================================
   CALCUL SCORE FINAL
========================================================== */


function calculateFinalScore(){



    if(
        QuizEngine.questions.length === 0
    ){


        return 0;


    }





    return Math.round(



        (

            QuizEngine.score

            /

            QuizEngine.questions.length

        )

        *

        100



    );



}








/* ==========================================================
   AJOUT BADGE
========================================================== */


function addBadge(badgeName){



    let badges =



    JSON.parse(

        localStorage.getItem(

        "igt_badges"

        )

    )

    ||

    [];





    if(

        !badges.includes(

        badgeName

        )

    ){



        badges.push(

        badgeName

        );



        localStorage.setItem(

        "igt_badges",

        JSON.stringify(

        badges

        )

        );



        sendNotification(

        "Nouveau badge obtenu : "

        +

        badgeName,

        "success"

        );


    }



}








/* ==========================================================
   VERIFICATION BADGES
========================================================== */


function checkBadges(){



    const score =

    calculateFinalScore();





    if(

        score >= 70

    ){



        addBadge(

        "📜 Juriste Débutant"

        );


    }





    if(

        score >= 80

    ){



        addBadge(

        "⚖️ Contrôleur Certifié"

        );


    }





    if(

        score >= 90

    ){



        addBadge(

        "🛡️ Inspecteur Professionnel"

        );


    }





    if(

        QuizEngine.level ===

        "Inspecteur Général du Travail"

    ){



        addBadge(

        "👑 Inspecteur Général"

        );


    }



}








/* ==========================================================
   AFFICHAGE BADGES
========================================================== */


function displayBadges(){



    const container =

    document.querySelector(

    ".badge-grid"

    );





    if(!container){


        return;


    }





    const badges =



    JSON.parse(

        localStorage.getItem(

        "igt_badges"

        )

    )

    ||

    [];





    const cards =

    container.querySelectorAll(

    ".badge"

    );





    cards.forEach(

        card=>{



            const text =

            card.textContent.trim();





            const unlocked =

            badges.some(

                badge =>

                text.includes(

                badge.replace(

                /[^\p{L}\s]/gu,

                ""

                )

                )

            );





            if(unlocked){



                card.classList.remove(

                "locked"

                );



                card.classList.add(

                "unlocked"

                );


            }



        }

    );



}








/* ==========================================================
   CERTIFICATION
========================================================== */


function generateCertificate(){



    const score =

    calculateFinalScore();





    if(

        score < 70

    ){



        sendNotification(

        "Certification impossible. Score minimum requis : 70%.",

        "error"

        );


        return;


    }







    const certificate = {



        nom:

        document.getElementById(

        "playerName"

        )?.textContent

        ||

        "Inspecteur en Formation",



        grade:

        QuizEngine.level,



        score:

        score + "%",



        date:

        new Date().toLocaleDateString(

        "fr-FR"

        )



    };





    localStorage.setItem(

    "igt_certificate",

    JSON.stringify(

    certificate

    )

    );





    sendNotification(

    "Votre certificat Académie InspecteurBot IGT est disponible.",

    "success"

    );



}








/* ==========================================================
   RECOMPENSE FIN EXAMEN
========================================================== */


function examReward(){



    const score =

    calculateFinalScore();





    if(

        score >= 90

    ){



        QuizEngine.rewardFC += 50000;



    }

    else if(

        score >= 70

    ){



        QuizEngine.rewardFC += 25000;



    }





    updateInterface();



    saveProgress();



}


/* ==========================================================
   PARTIE 9
   INITIALISATION GENERALE
   CONNEXION HTML
   DEMARRAGE APPLICATION
========================================================== */






/* ==========================================================
   MODE SOMBRE
========================================================== */


function initDarkMode(){



    if(
        !DOM.darkModeBtn
    ){


        return;


    }





    const savedMode =

    localStorage.getItem(

    "igt_dark_mode"

    );





    if(
        savedMode === "true"
    ){


        document.body.classList.add(

        "dark-mode"

        );


    }





    DOM.darkModeBtn.addEventListener(

    "click",

    ()=>{



        document.body.classList.toggle(

        "dark-mode"

        );



        const active =

        document.body.classList.contains(

        "dark-mode"

        );



        localStorage.setItem(

        "igt_dark_mode",

        active

        );



    }

    );



}








/* ==========================================================
   BOUTON MENU LATERAL
========================================================== */


function initMenu(){



    const menuBtn =

    document.getElementById(

    "menuBtn"

    );



    const sidebar =

    document.getElementById(

    "sidebar"

    );





    if(

        menuBtn

        &&

        sidebar

    ){



        menuBtn.addEventListener(

        "click",

        ()=>{



            sidebar.classList.toggle(

            "open"

            );



        }

        );



    }



}








/* ==========================================================
   INITIALISATION COMPLETE
========================================================== */


async function initQuizAcademie(){



    console.log(

    "Initialisation Académie InspecteurBot IGT RDC..."

    );





    connectDOM();



    initDarkMode();



    initMenu();



    loadProgress();



    await loadQuestions();



    prepareQuestions();



    syncUserData();



    startTimer();



    initNotifications();



    QuizEngine.initialized = true;





    console.log(

    "Académie prête."

    );



}








/* ==========================================================
   LANCEMENT AUTOMATIQUE
========================================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{



    initQuizAcademie();



}

);


/* ==========================================================
   PARTIE 10
   GESTION ERREURS
   DIAGNOSTIC
   COMPATIBILITE MOBILE
========================================================== */






/* ==========================================================
   GESTION ERREUR GLOBALE
========================================================== */


window.addEventListener(

"error",

(event)=>{



    console.error(

    "Erreur Académie IGT :",

    event.message

    );



});








/* ==========================================================
   MESSAGE ERREUR APPLICATION
========================================================== */


function handleError(message){



    console.error(

    message

    );





    if(DOM.questionText){



        DOM.questionText.textContent =

        "Erreur : "

        +

        message;



    }





    sendNotification(

    message,

    "error"

    );



}








/* ==========================================================
   VERIFICATION STRUCTURE QUESTIONS
========================================================== */


function validateQuestions(){



    if(

        !Array.isArray(

        QuizEngine.questions

        )

    ){



        handleError(

        "La banque de questions est invalide."

        );



        return false;


    }





    QuizEngine.questions =

    QuizEngine.questions.filter(

        question =>



        question.question

        &&

        Array.isArray(

        question.choix

        )

        &&

        typeof question.bonne === "number"



    );







    console.log(

    QuizEngine.questions.length

    +

    " questions valides chargées."

    );





    return true;



}








/* ==========================================================
   MODE MOBILE
========================================================== */


function initMobileMode(){



    const isMobile =

    window.innerWidth <= 768;





    if(

        isMobile

    ){



        document.body.classList.add(

        "mobile-device"

        );



    }





    window.addEventListener(

    "resize",

    ()=>{



        if(

        window.innerWidth <= 768

        ){



            document.body.classList.add(

            "mobile-device"

            );



        }

        else{



            document.body.classList.remove(

            "mobile-device"

            );



        }



    });



}








/* ==========================================================
   PROTECTION DOUBLE DEMARRAGE
========================================================== */


function preventMultipleStart(){



    if(

    QuizEngine.initialized

    ){



        console.warn(

        "Académie déjà initialisée."

        );


        return true;


    }



    return false;



}








/* ==========================================================
   INFORMATIONS APPLICATION
========================================================== */


function showAppInfo(){



    console.log(

    `

    ==================================

    Académie Professionnelle

    InspecteurBot IGT RDC


    Version :

    ${QuizEngine.version}


    Développé par :

    Inspecteur Limengo (Pmiller)

    © 2026


    ==================================

    `

    );



}








/* ==========================================================
   ACTIVATION MODULES SYSTEME
========================================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{



    initMobileMode();



    showAppInfo();



});


/* ==========================================================
   PARTIE 11
   FINALISATION MOTEUR QUIZ
   EXPORT FONCTIONS
   CONTROLE FINAL
========================================================== */






/* ==========================================================
   CONTROLE ELEMENTS HTML OBLIGATOIRES
========================================================== */


function checkHTMLCompatibility(){



    const requiredElements = [



        "questionText",

        "answersContainer",

        "feedback",

        "timer",

        "numeroQuestion",

        "lifeDisplay",

        "rewardDisplay",

        "quizProgress",

        "progressFill"



    ];





    let missing = [];





    requiredElements.forEach(

        id=>{



            if(

                !document.getElementById(id)

            ){



                missing.push(id);



            }



        }

    );







    if(

        missing.length > 0

    ){



        console.warn(

        "Éléments HTML manquants :",

        missing

        );



    }

    else{



        console.log(

        "Compatibilité HTML : OK"

        );


    }



}








/* ==========================================================
   CONTROLE CSS
========================================================== */


function checkCSSCompatibility(){



    const classes = [



        ".dark-mode",

        ".feedback",

        ".answers-container",

        ".career-item",

        ".formation-card"



    ];





    classes.forEach(

        selector=>{



            const element =

            document.querySelector(

            selector

            );



            if(

                !element

            ){



                console.warn(

                "Classe CSS non détectée : "

                +

                selector

                );



            }



        }

    );



}








/* ==========================================================
   NETTOYAGE AVANT FERMETURE
========================================================== */


window.addEventListener(

"beforeunload",

()=>{



    saveProgress();



});








/* ==========================================================
   RACCOURCIS ADMINISTRATION
========================================================== */


window.InspecteurBotAcademie = {



    reset:

    resetProgress,



    save:

    saveProgress,



    load:

    loadProgress,



    start:

    startQuiz,



    info:

    showAppInfo,



    badges:

    displayBadges



};








/* ==========================================================
   CONTROLE FINAL APPLICATION
========================================================== */


setTimeout(

()=>{



    checkHTMLCompatibility();



    checkCSSCompatibility();



},

2000);



/* ==========================================================
   FIN DU MOTEUR QUIZ
   Académie Professionnelle InspecteurBot IGT RDC

   Développé par :
   Inspecteur Limengo (Pmiller)

   © 2026
========================================================== */



