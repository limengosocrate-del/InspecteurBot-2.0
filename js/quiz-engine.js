/* ==========================================================
   QUIZ ENGINE
   ACADEMIE INSPECTEURBOT IGT RDC

   Moteur professionnel de quiz
   Compatible :
   - Quiz_Academie_IGT.html
   - academie-igt.css
   - question_bank.json

   Développé par Inspecteur Limengo (Pmiller) © 2026
========================================================== */


"use strict";





/* ==========================================================
   VARIABLES GENERALES
========================================================== */


const QuizEngine = {


    version:"2.0",


    initialized:false,


    questions:[],


    currentQuestion:0,


    score:0,


    lives:5,


    rewardFC:0,


    rewardUSD:0,


    level:"Débutant",


    progress:0,


    startTime:null,


    timer:null,


};








/* ==========================================================
   ELEMENTS HTML
========================================================== */


const DOM = {};





function connectDOM(){


    DOM.questionText =
    document.getElementById("questionText");


    DOM.answersContainer =
    document.getElementById("answersContainer");


    DOM.feedback =
    document.getElementById("feedback");


    DOM.timer =
    document.getElementById("timer");


    DOM.numeroQuestion =
    document.getElementById("numeroQuestion");


    DOM.lifeDisplay =
    document.getElementById("lifeDisplay");


    DOM.lifeCount =
    document.getElementById("lifeCount");


    DOM.rewardDisplay =
    document.getElementById("rewardDisplay");


    DOM.quizProgress =
    document.getElementById("quizProgress");


    DOM.progressFill =
    document.getElementById("progressFill");


    DOM.grade =
    document.getElementById("grade");


    DOM.gradeName =
    document.getElementById("gradeName");


    DOM.cdf =
    document.getElementById("cdf");


    DOM.usd =
    document.getElementById("usd");


    DOM.darkModeBtn =
    document.getElementById("darkModeBtn");


}








/* ==========================================================
   DEMARRAGE APPLICATION
========================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    connectDOM();


    QuizEngine.initialized=true;


    console.log(
    "Académie InspecteurBot IGT RDC chargée"
    );


});

/* ==========================================================
   PARTIE 2
   CHARGEMENT QUESTION_BANK.JSON
   DEMARRAGE SECURISE DU QUIZ
========================================================== */





/* ==========================================================
   CHEMIN BANQUE QUESTIONS
========================================================== */


QuizEngine.questionFile = "question_bank.json";








/* ==========================================================
   CHARGEMENT DES QUESTIONS
========================================================== */


async function loadQuestions(){


    try{


        showLoadingMessage(
        "Chargement des questions professionnelles..."
        );



        const response = await fetch(
            QuizEngine.questionFile
        );



        if(!response.ok){


            throw new Error(
            "Impossible de charger question_bank.json"
            );


        }



        const data = await response.json();



        if(!Array.isArray(data)){


            throw new Error(
            "Format question_bank.json incorrect"
            );


        }



        QuizEngine.questions = data;



        console.log(
            "Questions chargées :",
            QuizEngine.questions.length
        );



        hideLoadingMessage();



        startQuiz();



    }

    catch(error){


        console.error(
            "Erreur chargement questions :",
            error
        );



        showLoadingMessage(
        "Erreur de chargement des questions"
        );



        if(DOM.questionText){


            DOM.questionText.innerHTML =
            `
            ⚠️ Impossible de charger les questions.<br>
            Vérifiez le fichier question_bank.json.
            `;


        }


    }


}








/* ==========================================================
   PREMIER LANCEMENT QUIZ
========================================================== */


function startQuiz(){


    if(
        QuizEngine.questions.length===0
    ){


        console.error(
        "Aucune question disponible"
        );


        return;


    }



    QuizEngine.currentQuestion=0;


    QuizEngine.score=0;


    QuizEngine.lives=5;


    QuizEngine.rewardFC=0;


    QuizEngine.rewardUSD=0;


    QuizEngine.startTime =
    new Date();



    updateInterface();



    displayQuestion();



    startTimer();



}








/* ==========================================================
   MESSAGE CHARGEMENT
========================================================== */


function showLoadingMessage(message){


    const loader =
    document.querySelector(
    ".loading-academie"
    );



    if(loader){


        loader.style.display="flex";



        const text =
        loader.querySelector("p");



        if(text){


            text.textContent = message;


        }


    }


}





function hideLoadingMessage(){


    const loader =
    document.querySelector(
    ".loading-academie"
    );



    if(loader){


        loader.style.display="none";


    }


}








/* ==========================================================
   LANCEMENT AUTOMATIQUE
========================================================== */


document.addEventListener(
"DOMContentLoaded",
()=>{


    loadQuestions();


});



/* ==========================================================
   PARTIE 3
   AFFICHAGE QUESTIONS
   GENERATION REPONSES
   VERIFICATION DES REPONSES
========================================================== */






/* ==========================================================
   QUESTION ACTUELLE
========================================================== */


function getCurrentQuestion(){


    return QuizEngine.questions[
        QuizEngine.currentQuestion
    ];


}








/* ==========================================================
   AFFICHAGE QUESTION
========================================================== */


function displayQuestion(){


    const question =
    getCurrentQuestion();



    if(!question){


        finishQuiz();


        return;


    }



    if(DOM.questionText){


        DOM.questionText.textContent =
        question.question
        ||
        question.text
        ||
        "Question indisponible";


    }




    if(DOM.numeroQuestion){


        DOM.numeroQuestion.textContent =

        `${QuizEngine.currentQuestion + 1}
        /
        ${QuizEngine.questions.length}`;


    }



    if(DOM.answersContainer){


        DOM.answersContainer.innerHTML="";


    }



    generateAnswers(question);



    updateProgress();



}








/* ==========================================================
   GENERATION DES REPONSES
========================================================== */


function generateAnswers(question){


    let answers = [];


    if(question.answers){


        answers =
        question.answers;


    }

    else if(question.options){


        answers =
        question.options;


    }



    answers.forEach(
    (answer,index)=>{


        const button =
        document.createElement("button");



        button.className =
        "answer-option";



        button.textContent =
        answer;



        button.dataset.index =
        index;



        button.addEventListener(
        "click",
        ()=>{


            checkAnswer(index);


        });



        DOM.answersContainer.appendChild(
        button
        );


    });



}








/* ==========================================================
   VERIFICATION REPONSE
========================================================== */


function checkAnswer(selectedIndex){


    const question =
    getCurrentQuestion();



    let correct =
    question.correctAnswer;



    if(correct===undefined){


        correct =
        question.correct;


    }



    const buttons =
    document.querySelectorAll(
    ".answer-option"
    );



    buttons.forEach(
    button=>{


        button.disabled=true;


    });



    if(
        selectedIndex ==
        correct
    ){


        correctAnswer();


    }

    else{


        wrongAnswer();


    }



}








/* ==========================================================
   BONNE REPONSE
========================================================== */


function correctAnswer(){


    QuizEngine.score++;



    QuizEngine.rewardFC +=10000;



    if(DOM.feedback){


        DOM.feedback.innerHTML =

        `
        ✅ Bonne réponse !<br>
        +10 000 FC
        `;



        DOM.feedback.className =
        "feedback success-message";


    }



    setTimeout(
    nextQuestion,
    1200
    );


}








/* ==========================================================
   MAUVAISE REPONSE
========================================================== */


function wrongAnswer(){


    QuizEngine.lives--;



    if(DOM.feedback){


        DOM.feedback.innerHTML =

        `
        ❌ Mauvaise réponse.<br>
        Une vie perdue.
        `;



        DOM.feedback.className =
        "feedback error-message";


    }



    updateLives();



    if(
        QuizEngine.lives<=0
    ){


        gameOver();


        return;


    }



    setTimeout(
    nextQuestion,
    1500
    );


}








/* ==========================================================
   QUESTION SUIVANTE
========================================================== */


function nextQuestion(){


    QuizEngine.currentQuestion++;



    if(
        QuizEngine.currentQuestion >=
        QuizEngine.questions.length
    ){


        finishQuiz();


        return;


    }



    displayQuestion();



}


/* ==========================================================
   PARTIE 4
   SYSTEME VIES
   CHRONOMETRE
   PROGRESSION
   MISE A JOUR INTERFACE
========================================================== */






/* ==========================================================
   AFFICHAGE DES VIES
========================================================== */


function updateLives(){


    let hearts="";


    for(
        let i=0;
        i<QuizEngine.lives;
        i++
    ){


        hearts += "❤️";


    }



    if(DOM.lifeDisplay){


        DOM.lifeDisplay.textContent =
        hearts || "💔";


    }



    if(DOM.lifeCount){


        DOM.lifeCount.textContent =
        QuizEngine.lives;


    }


}








/* ==========================================================
   MISE A JOUR GENERALE INTERFACE
========================================================== */


function updateInterface(){


    updateLives();



    if(DOM.cdf){


        DOM.cdf.textContent =

        `${QuizEngine.rewardFC.toLocaleString()}
        FC`;


    }



    if(DOM.usd){


        DOM.usd.textContent =

        `${QuizEngine.rewardUSD}
        $`;


    }



    if(DOM.grade){


        DOM.grade.textContent =
        QuizEngine.level;


    }



    if(DOM.gradeName){


        DOM.gradeName.textContent =

        "Grade : "
        +
        QuizEngine.level;


    }



}








/* ==========================================================
   PROGRESSION QUIZ
========================================================== */


function updateProgress(){


    if(
        QuizEngine.questions.length===0
    ){

        return;

    }



    QuizEngine.progress =

    Math.round(

        (
        QuizEngine.currentQuestion
        /
        QuizEngine.questions.length
        )
        *
        100

    );



    if(DOM.quizProgress){


        DOM.quizProgress.textContent =

        QuizEngine.progress
        +
        " %";


    }



    if(DOM.progressFill){


        DOM.progressFill.style.width =

        QuizEngine.progress
        +
        "%";


    }



}








/* ==========================================================
   CHRONOMETRE
========================================================== */


function startTimer(){


    let seconds=0;



    clearInterval(
    QuizEngine.timer
    );



    QuizEngine.timer =

    setInterval(
    ()=>{


        seconds++;



        let minutes =

        Math.floor(
        seconds / 60
        );



        let sec =

        seconds % 60;



        if(DOM.timer){


            DOM.timer.textContent =


            String(minutes)
            .padStart(2,"0")
            +
            ":"
            +
            String(sec)
            .padStart(2,"0");



        }



    },
    1000
    );


}








/* ==========================================================
   ARRET CHRONOMETRE
========================================================== */


function stopTimer(){


    clearInterval(
    QuizEngine.timer
    );


}








/* ==========================================================
   FIN DE NIVEAU
========================================================== */


function finishQuiz(){


    stopTimer();



    if(DOM.questionText){


        DOM.questionText.innerHTML =

        `
        🎉 Félicitations !<br>
        Niveau terminé.
        `;


    }



    if(DOM.answersContainer){


        DOM.answersContainer.innerHTML="";


    }



    if(DOM.feedback){


        DOM.feedback.innerHTML =

        `
        Score :
        ${QuizEngine.score}
        /
        ${QuizEngine.questions.length}
        `;



        DOM.feedback.className =
        "feedback success-message";


    }



           }

/* ==========================================================
   PARTIE 5
   SYSTEME GRADES
   NIVEAUX ACADEMIE
   DEBLOCAGE PROGRESSIF
========================================================== */






/* ==========================================================
   LISTE DES GRADES
========================================================== */


const ACADEMIE_LEVELS = [


    {


        id:1,


        name:"Débutant",


        requiredScore:60,


        unlocked:true


    },


    {


        id:2,


        name:"Administratif",


        requiredScore:65,


        unlocked:false


    },


    {


        id:3,


        name:"Contrôleur",


        requiredScore:70,


        unlocked:false


    },


    {


        id:4,


        name:"Inspecteur",


        requiredScore:75,


        unlocked:false


    },


    {


        id:5,


        name:"Directeur",


        requiredScore:80,


        unlocked:false


    },


    {


        id:6,


        name:"Inspecteur Général Adjoint",


        requiredScore:85,


        unlocked:false


    },


    {


        id:7,


        name:"Inspecteur Général du Travail",


        requiredScore:90,


        unlocked:false


    }


];








/* ==========================================================
   RECUPERATION NIVEAU ACTUEL
========================================================== */


function getCurrentLevel(){


    return ACADEMIE_LEVELS.find(
    level=>

        level.name === QuizEngine.level

    );


}








/* ==========================================================
   VERIFICATION REUSSITE NIVEAU
========================================================== */


function checkLevelCompletion(){



    const percentage =


    Math.round(

        (
        QuizEngine.score
        /
        QuizEngine.questions.length
        )
        *
        100

    );



    const current =
    getCurrentLevel();



    if(!current){


        return;


    }



    if(
        percentage >=
        current.requiredScore
    ){


        unlockNextLevel();


    }

    else{


        showLevelFailed(
        percentage,
        current.requiredScore
        );


    }



}








/* ==========================================================
   DEBLOQUER NIVEAU SUIVANT
========================================================== */


function unlockNextLevel(){


    const index =

    ACADEMIE_LEVELS.findIndex(

        level=>

        level.name === QuizEngine.level

    );



    const next =

    ACADEMIE_LEVELS[
        index + 1
    ];



    if(next){


        next.unlocked=true;



        QuizEngine.level =
        next.name;



        showLevelSuccess(
        next.name
        );



    }

    else{


        showLevelSuccess(
        "Inspecteur Général du Travail"
        );


    }



    saveProgress();



    updateInterface();


}








/* ==========================================================
   MESSAGE REUSSITE
========================================================== */


function showLevelSuccess(level){


    if(DOM.feedback){


        DOM.feedback.innerHTML =


        `
        🏆 Niveau validé !<br>
        Nouveau grade :
        <strong>${level}</strong>
        `;



        DOM.feedback.className =

        "feedback success-message";


    }


}








/* ==========================================================
   MESSAGE ECHEC
========================================================== */


function showLevelFailed(score,required){


    if(DOM.feedback){


        DOM.feedback.innerHTML =


        `
        ❌ Niveau non validé.<br>
        Score obtenu :
        ${score}%<br>
        Minimum requis :
        ${required}%
        `;



        DOM.feedback.className =

        "feedback error-message";


    }


}








/* ==========================================================
   AFFICHAGE PARCOURS CARRIERE
========================================================== */


function updateCareerDisplay(){


    const items =

    document.querySelectorAll(
    ".career-item"
    );



    items.forEach(
    (item,index)=>{


        item.classList.remove(
        "active",
        "locked"
        );



        const level =
        ACADEMIE_LEVELS[index];



        if(
            level.name === QuizEngine.level
        ){


            item.classList.add(
            "active"
            );


        }

        else if(
            !level.unlocked
        ){


            item.classList.add(
            "locked"
            );


        }



    });


}


/* ==========================================================
   PARTIE 6
   LOCALSTORAGE
   SAUVEGARDE PROFIL
   RESTAURATION AUTOMATIQUE
========================================================== */






/* ==========================================================
   CLE DE SAUVEGARDE
========================================================== */


const STORAGE_KEY =

"inspecteurbot_igt_academie";








/* ==========================================================
   SAUVEGARDER LA PROGRESSION
========================================================== */


function saveProgress(){


    const saveData = {


        score:
        QuizEngine.score,


        lives:
        QuizEngine.lives,


        rewardFC:
        QuizEngine.rewardFC,


        rewardUSD:
        QuizEngine.rewardUSD,


        level:
        QuizEngine.level,


        currentQuestion:
        QuizEngine.currentQuestion,


        progress:
        QuizEngine.progress,


        date:
        new Date().toISOString()


    };



    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(saveData)

    );



    showSaveStatus(
    "Progression sauvegardée"
    );


}








/* ==========================================================
   RESTAURER LA PROGRESSION
========================================================== */


function loadProgress(){


    const saved =

    localStorage.getItem(
    STORAGE_KEY
    );



    if(!saved){


        return;


    }



    try{


        const data =

        JSON.parse(saved);



        QuizEngine.score =
        data.score || 0;



        QuizEngine.lives =
        data.lives || 5;



        QuizEngine.rewardFC =
        data.rewardFC || 0;



        QuizEngine.rewardUSD =
        data.rewardUSD || 0;



        QuizEngine.level =
        data.level || "Débutant";



        QuizEngine.currentQuestion =
        data.currentQuestion || 0;



        QuizEngine.progress =
        data.progress || 0;



        console.log(
        "Progression restaurée"
        );


        updateInterface();


    }

    catch(error){


        console.error(

        "Erreur restauration :",

        error

        );


    }


}








/* ==========================================================
   EFFACER PROGRESSION
========================================================== */


function resetProgress(){


    const confirmation =

    confirm(

    "Voulez-vous recommencer toute l'académie ?"

    );



    if(
        confirmation
    ){


        localStorage.removeItem(
        STORAGE_KEY
        );



        location.reload();


    }


}








/* ==========================================================
   STATUT SAUVEGARDE
========================================================== */


function showSaveStatus(message){


    const status =

    document.querySelector(
    ".storage-status"
    );



    if(status){


        status.textContent =
        message;



        status.className =

        "storage-status storage-online";



        setTimeout(
        ()=>{


            status.textContent =
            "";

        },
        3000
        );


    }


}








/* ==========================================================
   SAUVEGARDE AUTOMATIQUE
========================================================== */


setInterval(
()=>{


    if(
        QuizEngine.initialized
    ){


        saveProgress();


    }


},
60000
);








/* ==========================================================
   RESTAURATION AU DEMARRAGE
========================================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


    loadProgress();


}

);



/* ==========================================================
   PARTIE 7
   MODE SOMBRE
   NOTIFICATIONS
   INTERACTIONS INTERFACE
========================================================== */






/* ==========================================================
   MODE SOMBRE FACEBOOK / WHATSAPP
========================================================== */


function initDarkMode(){


    const savedTheme =

    localStorage.getItem(
    "igt_dark_mode"
    );



    if(
        savedTheme === "active"
    ){


        document.body.classList.add(
        "dark-mode"
        );


    }



    if(DOM.darkModeBtn){


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

            active ? "active" : "normal"

            );



            updateDarkIcon(
            active
            );


        }

        );


    }


}








/* ==========================================================
   ICONE MODE SOMBRE
========================================================== */


function updateDarkIcon(active){


    if(!DOM.darkModeBtn){

        return;

    }



    const icon =

    DOM.darkModeBtn.querySelector(
    "i"
    );



    if(!icon){

        return;

    }



    if(active){


        icon.className =
        "fa-solid fa-sun";


    }

    else{


        icon.className =
        "fa-solid fa-moon";


    }


}








/* ==========================================================
   SYSTEME NOTIFICATIONS
========================================================== */


function sendNotification(message,type="info"){


    const list =

    document.getElementById(
    "notificationList"
    );



    if(!list){

        return;

    }



    const li =

    document.createElement(
    "li"
    );



    let icon = "🔔";



    if(type==="success"){


        icon="✅";


    }


    if(type==="error"){


        icon="❌";


    }



    li.innerHTML =

    `
    ${icon}
    ${message}
    `;



    list.prepend(li);



    updateNotificationBadge();


}








/* ==========================================================
   BADGE NOTIFICATION
========================================================== */


function updateNotificationBadge(){


    const badge =

    document.querySelector(
    ".badge"
    );



    const list =

    document.querySelectorAll(
    "#notificationList li"
    );



    if(
        badge
    ){


        badge.textContent =
        list.length;


    }


}








/* ==========================================================
   BOUTON NOTIFICATION
========================================================== */


function initNotifications(){


    const btn =

    document.getElementById(
    "notificationBtn"
    );



    if(btn){


        btn.addEventListener(

        "click",

        ()=>{


            sendNotification(

            "Votre progression académique est enregistrée.",

            "success"

            );


        }

        );


    }


}








/* ==========================================================
   INITIALISATION INTERFACE
========================================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


    initDarkMode();


    initNotifications();


    updateNotificationBadge();


});


/* ==========================================================
   PARTIE 8
   SECURITE MOTEUR QUIZ
   VALIDATION DONNEES
   GESTION ERREURS
========================================================== */






/* ==========================================================
   VALIDATION STRUCTURE QUESTION
========================================================== */


function validateQuestion(question){


    if(!question){


        return false;


    }



    const hasText =

    question.question
    ||
    question.text;



    const hasAnswers =

    question.answers
    ||
    question.options;



    if(
        !hasText
        ||
        !hasAnswers
    ){


        console.warn(

        "Question invalide détectée",

        question

        );


        return false;


    }



    return true;


}








/* ==========================================================
   NETTOYAGE BANQUE QUESTIONS
========================================================== */


function cleanQuestionBank(){


    QuizEngine.questions =

    QuizEngine.questions.filter(

        question =>

        validateQuestion(question)

    );



    console.log(

    "Questions valides :",

    QuizEngine.questions.length

    );


}








/* ==========================================================
   PROTECTION REPONSES MULTIPLES
========================================================== */


function preventDoubleAnswer(){


    const buttons =

    document.querySelectorAll(

    ".answer-option"

    );



    buttons.forEach(

    button=>{


        button.addEventListener(

        "click",

        ()=>{


            buttons.forEach(

            btn=>{


                btn.style.pointerEvents =
                "none";


            });


        },

        {

            once:true

        }

        );


    });


}








/* ==========================================================
   CONTROLE SCORE
========================================================== */


function secureScore(){


    if(
        QuizEngine.score < 0
    ){


        QuizEngine.score=0;


    }



    if(
        QuizEngine.score >
        QuizEngine.questions.length
    ){


        QuizEngine.score =
        QuizEngine.questions.length;


    }


}








/* ==========================================================
   CONTROLE VIES
========================================================== */


function secureLives(){


    if(
        QuizEngine.lives < 0
    ){


        QuizEngine.lives=0;


    }



    if(
        QuizEngine.lives > 5
    ){


        QuizEngine.lives=5;


    }


}








/* ==========================================================
   PROTECTION LOCALSTORAGE
========================================================== */


function secureStorage(){


    try{


        JSON.parse(

        localStorage.getItem(
        STORAGE_KEY
        )

        );


    }

    catch(error){


        localStorage.removeItem(
        STORAGE_KEY
        );



        console.warn(

        "Sauvegarde corrompue supprimée"

        );


    }


}








/* ==========================================================
   GESTION ERREURS GENERALE
========================================================== */


function handleError(error){


    console.error(

    "InspecteurBot Quiz Error:",

    error

    );



    if(DOM.feedback){


        DOM.feedback.innerHTML =

        `
        ⚠️ Une erreur est survenue.<br>
        Veuillez réessayer.
        `;



        DOM.feedback.className =

        "feedback error-message";


    }


}








/* ==========================================================
   VERIFICATION AVANT CHAQUE QUESTION
========================================================== */


function securityCheck(){


    secureScore();


    secureLives();


    preventDoubleAnswer();


}








/* ==========================================================
   APPLICATION DES CONTROLES
========================================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


    cleanQuestionBank();


    secureStorage();


});


/* ==========================================================
   PARTIE 9
   RESULTATS EXAMEN
   SCORE FINAL
   BADGES
   RECOMPENSES
========================================================== */






/* ==========================================================
   CALCUL SCORE FINAL
========================================================== */


function calculateFinalScore(){


    if(
        QuizEngine.questions.length===0
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
   AFFICHAGE RESULTAT FINAL
========================================================== */


function displayFinalResult(){


    const finalScore =

    calculateFinalScore();



    let resultClass =
    "failed";


    let message =
    "Formation non validée";



    if(
        finalScore >= 70
    ){


        resultClass =
        "success";


        message =
        "Formation validée avec succès";


    }



    if(DOM.questionText){


        DOM.questionText.innerHTML =

        `
        🎓 Résultat Académie<br><br>

        <strong>
        ${message}
        </strong>
        `;


    }



    if(DOM.answersContainer){


        DOM.answersContainer.innerHTML="";


    }



    if(DOM.feedback){


        DOM.feedback.innerHTML =

        `
        Score final :
        <strong>
        ${finalScore}%
        </strong>
        `;



        DOM.feedback.className =

        "quiz-result "
        +
        resultClass;


    }



    if(
        finalScore >=70
    ){


        checkLevelCompletion();


    }


    saveProgress();


}








/* ==========================================================
   SYSTEME BADGES
========================================================== */


const BADGES_IGT = [


    {


        name:
        "Juriste Débutant",


        condition:
        score => score>=50


    },


    {


        name:
        "Contrôleur Certifié",


        condition:
        score => score>=70


    },


    {


        name:
        "Inspecteur Professionnel",


        condition:
        score => score>=85


    },


    {


        name:
        "Expert IGT",


        condition:
        score => score>=95


    }


];








/* ==========================================================
   VERIFICATION BADGES
========================================================== */


function checkBadges(){


    const score =

    calculateFinalScore();



    BADGES_IGT.forEach(

    badge=>{


        if(
            badge.condition(score)
        ){


            unlockBadge(
            badge.name
            );


        }


    });


}








/* ==========================================================
   DEBLOCAGE BADGE
========================================================== */


function unlockBadge(name){


    let badges =

    JSON.parse(

    localStorage.getItem(
    "igt_badges"
    )

    )
    ||
    [];



    if(
        !badges.includes(name)
    ){


        badges.push(name);



        localStorage.setItem(

        "igt_badges",

        JSON.stringify(badges)

        );



        sendNotification(

        "Nouveau badge obtenu : "
        +
        name,

        "success"

        );


    }


}








/* ==========================================================
   RECOMPENSE FIN EXAMEN
========================================================== */


function giveExamReward(){


    const score =

    calculateFinalScore();



    if(
        score>=70
    ){


        QuizEngine.rewardFC +=50000;



        sendNotification(

        "Récompense examen : +50 000 FC",

        "success"

        );


    }



    updateInterface();


}








/* ==========================================================
   FIN QUIZ COMPLETE
========================================================== */


function completeExam(){


    displayFinalResult();


    checkBadges();


    giveExamReward();


    updateCareerDisplay();


}


/* ==========================================================
   PARTIE 10 - DERNIERE PARTIE
   FINALISATION MOTEUR QUIZ
   INITIALISATION COMPLETE
   EXPORT GLOBAL
========================================================== */






/* ==========================================================
   REMPLACEMENT FIN QUIZ
========================================================== */


function finishQuiz(){


    stopTimer();


    completeExam();


}








/* ==========================================================
   INITIALISATION COMPLETE APPLICATION
========================================================== */


function initializeAcademie(){


    try{


        connectDOM();



        loadProgress();



        initDarkMode();



        initNotifications();



        loadQuestions();



        QuizEngine.initialized = true;



        console.log(

        "InspecteurBot Académie IGT RDC prête"

        );


    }


    catch(error){


        handleError(error);


    }


}








/* ==========================================================
   EVENEMENT DEMARRAGE UNIQUE
========================================================== */


document.addEventListener(

"DOMContentLoaded",

()=>{


    initializeAcademie();


}

);








/* ==========================================================
   RACCOURCIS UTILITAIRES
========================================================== */


window.resetAcademie =

resetProgress;



window.saveAcademie =

saveProgress;



window.QuizEngine =

QuizEngine;



window.ACADEMIE_LEVELS =

ACADEMIE_LEVELS;








/* ==========================================================
   MESSAGE CONSOLE FINAL
========================================================== */


console.log(

`
====================================

 Académie Professionnelle
 InspecteurBot IGT RDC

 Moteur Quiz chargé

 Version : ${QuizEngine.version}

 Développé par
 Inspecteur Limengo (Pmiller) © 2026

====================================
`

);

