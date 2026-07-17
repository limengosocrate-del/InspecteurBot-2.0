/* ==========================================================
   INSPECTEURBOT IA RDC
   MODULE : SANCTIONS & INFRACTIONS

   App-sanctions.js

   Créé par Inspecteur Limengo (Pmiller)
   © 2026
========================================================== */



"use strict";





/* ==========================================================
   APPLICATION PRINCIPALE
========================================================== */


const app = {


    version : "3.0.2026",


    author : "Inspecteur Limengo (Pmiller)",



    /* Page actuelle */

    currentView : "dashboard",



    /* Historique navigation */

    history : [],



    /* Données globales */

    data : {


        infractions : [],


        sanctionsAIM : [],


        academy : [],


        cases : [],


        archives : [],


        statistics : {},


        settings : {}

    },






    /* ======================================================
       DEMARRAGE COMPLET APPLICATION
    ====================================================== */


    init(){


        console.log(
            "🚀 InspecteurBot IA RDC - Module Sanctions démarré"
        );



        this.loadSettings();



        this.loadStorage();



        /*
            Chargement de toutes les bases
            Chaque module sera ajouté ici
        */


        this.loadAllModules();



        this.bindEvents();



        this.showView("dashboard");



    },







    /* ======================================================
       CHARGEMENT DES MODULES
       (TOUT EST CENTRALISÉ ICI)
    ====================================================== */


    loadAllModules(){
loadAllModules(){


    console.log(
        "Chargement des bases juridiques..."
    );



    /*
    =====================================
    MODULE SANCTIONS & INFRACTIONS
    =====================================
    */



    // Partie 2
    this.initializeInfractions();


    this.loadInfractionsTable();



    // Partie 3
    this.initializeAIM();


    this.loadAIMTable();



    // Partie 4
    this.initializeAcademy();



    // Partie 5
    this.initializeCases();



    // Partie 6
    this.initializeArchives();



    // Partie 7
    this.initializeStatistics();



    // Partie 8
    this.initializeTools();



    // Partie 9
    this.initializePVAssistant();



    // Partie 10
    this.initializeCalculator();



    // Partie 11
    this.initializeLibrary();



    // Partie 12
    this.initializeLegalAI();


    this.initializeAdvancedQuestions();



    // Base système
    this.initializeBase();



},






    /* ======================================================
       BASE DE DÉMARRAGE
    ====================================================== */


    initializeBase(){



        console.log(

            "Structure InspecteurBot prête"

        );


    },









    /* ======================================================
       OUTILS DOM
    ====================================================== */


    $(selector){


        return document.querySelector(selector);


    },




    $$(selector){


        return document.querySelectorAll(selector);


    },









    /* ======================================================
       SYSTEME DE NAVIGATION
    ====================================================== */


    showView(id){



        const views = this.$$(".view");



        views.forEach(view=>{


            view.style.display="none";


            view.classList.remove(
                "active"
            );


        });





        const target =
            this.$("#"+id);





        if(target){


            target.style.display="block";


            target.classList.add(
                "active"
            );


            this.currentView=id;


        }



        window.scrollTo({

            top:0,

            behavior:"smooth"

        });



    },









    navTo(id,title=""){



        if(
            this.currentView !== id
        ){


            this.history.push(
                this.currentView
            );


        }



        this.showView(id);




        const titleBox =
            this.$("#app-title");



        if(titleBox && title){


            titleBox.textContent =
                title;


        }





        const back =
            this.$("#back-btn");



        if(back){


            back.classList.remove(
                "hidden"
            );


        }



    },









    navToTab(id,title=""){



        this.history=[];



        this.showView(id);




        const titleBox =
            this.$("#app-title");



        if(titleBox && title){


            titleBox.textContent =
                title;


        }



    },









    goBack(){



        const previous =
            this.history.pop();




        if(previous){


            this.showView(previous);


        }

        else{


            this.showView(
                "dashboard"
            );


        }



    },









    /* ======================================================
       THEME
    ====================================================== */


    toggleTheme(){



        document.body.classList.toggle(
            "dark-mode"
        );



        const mode =
        document.body.classList.contains(
            "dark-mode"
        );



        localStorage.setItem(

            "inspecteurbot-theme",

            mode ? "dark":"light"

        );



    },







    loadTheme(){



        const theme =
            localStorage.getItem(
                "inspecteurbot-theme"
            );



        if(theme==="dark"){


            document.body.classList.add(
                "dark-mode"
            );


        }



    },









    /* ======================================================
       STOCKAGE LOCAL
    ====================================================== */


    loadStorage(){



        const archives =
            localStorage.getItem(
                "inspecteurbot-archives"
            );



        if(archives){


            this.data.archives =
                JSON.parse(
                    archives
                );


        }



    },





    saveStorage(){



        localStorage.setItem(

            "inspecteurbot-archives",

            JSON.stringify(
                this.data.archives
            )

        );



    },









    /* ======================================================
       EVENEMENTS
    ====================================================== */


    bindEvents(){



        const theme =
            this.$("#theme-btn");



        if(theme){



            theme.onclick = ()=>{


                this.toggleTheme();


            };


        }



    },





    /* ======================================================
       PARAMETRES
    ====================================================== */


    loadSettings(){



        this.loadTheme();



        this.data.settings = {


            language:"fr",


            role:"inspecteur",


            notifications:true


        };



    }




};









/* ==========================================================
   LANCEMENT AUTOMATIQUE
========================================================== */


document.addEventListener(

    "DOMContentLoaded",

    ()=>{


        app.init();


    }

);


/* ==========================================================
   PARTIE 2
   BASE DES INFRACTIONS CODE DU TRAVAIL RDC
========================================================== */



/* ==========================================================
   INITIALISATION DES INFRACTIONS
========================================================== */


initializeInfractions(){



this.data.infractions = [



{
id:1,

numero:"001",

titre:"Absence de contrat de travail",

categorie:"Contrat de travail",

article:"Dispositions relatives au contrat de travail",

montantFC:50000,


description:
"L'employeur ne formalise pas la relation de travail conformément aux exigences légales.",


importance:
"Le contrat permet de protéger les droits du travailleur et de prouver la relation professionnelle.",


controle:
"Vérifier les contrats individuels, registres du personnel et pièces administratives.",


sanction:
"Constat d'infraction, régularisation et application de la sanction prévue."

},




{
id:2,

numero:"002",

titre:"Non tenue des documents obligatoires",

categorie:"Documents sociaux",

article:"Obligations administratives de l'employeur",

montantFC:50000,


description:
"L'employeur ne présente pas les documents nécessaires lors d'une mission d'inspection.",


importance:
"Les documents permettent de contrôler la conformité de l'entreprise.",


controle:
"Contrôler les registres, listes du personnel, fiches et documents sociaux.",


sanction:
"Procès-verbal et mesures correctives."

},






{
id:3,

numero:"003",

titre:"Violation du salaire minimum légal",

categorie:"Salaire",

article:"Salaire minimum légal",

montantFC:100000,


description:
"L'employeur verse une rémunération inférieure aux obligations légales.",


importance:
"Protège le droit fondamental du travailleur à une rémunération conforme.",


controle:
"Comparer les fiches de paie avec les normes salariales applicables.",


sanction:
"Régularisation des salaires et sanction financière."

},






{
id:4,

numero:"004",

titre:"Travail des enfants",

categorie:"Protection des mineurs",

article:"Protection du travail des enfants",

montantFC:200000,


description:
"Emploi d'un enfant dans une situation interdite par la réglementation du travail.",


importance:
"Protège les enfants contre l'exploitation professionnelle.",


controle:
"Vérifier l'âge, les documents d'identité et les conditions de travail.",


sanction:
"Sanction aggravée selon la gravité des faits."

},






{
id:5,

numero:"005",

titre:"Manquement aux règles de santé et sécurité",

categorie:"Hygiène et sécurité",

article:"Sécurité au travail",

montantFC:150000,


description:
"L'entreprise ne garantit pas des conditions de travail sûres.",


importance:
"Permet de prévenir les accidents et protéger la vie des travailleurs.",


controle:
"Inspecter les équipements, protections individuelles et environnement de travail.",


sanction:
"Mise en conformité et sanction applicable."

}




];





console.log(

this.data.infractions.length +

" infractions chargées"

);



},







/* ==========================================================
   AFFICHAGE TABLEAU INFRACTIONS
========================================================== */


loadInfractionsTable(){



const table =
this.$("#tbody-code");



if(!table){

return;

}




table.innerHTML="";





this.data.infractions.forEach(
(infraction)=>{



const ligne =
document.createElement("tr");



ligne.innerHTML = `



<td>

${infraction.numero}

</td>



<td>


<button

class="link-btn"

onclick="app.showInfraction(${infraction.id})">


${infraction.titre}


</button>


</td>



<td>

${infraction.article}

</td>



<td>

${infraction.montantFC.toLocaleString()}

 FC

</td>


`;



table.appendChild(ligne);



});



},







/* ==========================================================
   DETAIL INFRACTION
========================================================== */


showInfraction(id){



const infraction =

this.data.infractions.find(

item=>item.id===id

);



if(!infraction){

return;

}




alert(`


⚖️ INFRACTION


N° :

${infraction.numero}



Nature :

${infraction.titre}



Catégorie :

${infraction.categorie}



Article :

${infraction.article}



Montant prévu :

${infraction.montantFC.toLocaleString()} FC




UTILITÉ :

${infraction.importance}




APPLICATION INSPECTION :

${infraction.controle}




SANCTION :

${infraction.sanction}



`);




},







/* ==========================================================
   RECHERCHE INFRACTIONS
========================================================== */


searchInfractions(mot){



if(!mot){

return this.data.infractions;

}



mot =
mot.toLowerCase();





return this.data.infractions.filter(

(item)=>{


return (

item.titre +

item.categorie +

item.description +

item.article


)

.toLowerCase()

.includes(mot);



}


);



},


/* ==========================================================
   PARTIE 3
   TABLEAU AIM 006 / 127
   SANCTIONS ET AMENDES EN USD
========================================================== */





/* ==========================================================
   INITIALISATION DES SANCTIONS AIM
========================================================== */


initializeAIM(){



this.data.sanctionsAIM = [



{
id:1,

nature:
"Absence ou irrégularité du contrat de travail",


categorieA:
"500 USD",


categorieB:
"300 USD",


categorieC:
"200 USD",



explication:
"L'employeur doit respecter les obligations liées à la formalisation du travail.",



application:
"À utiliser après constatation de l'absence de contrat ou d'une irrégularité."


},







{
id:2,

nature:
"Non présentation des documents obligatoires",


categorieA:
"400 USD",


categorieB:
"250 USD",


categorieC:
"150 USD",



explication:
"L'entreprise doit conserver les documents nécessaires au contrôle de l'inspection.",



application:
"Applicable lors d'un refus ou d'une absence de documents sociaux."


},







{
id:3,

nature:
"Violation des règles de santé et sécurité au travail",


categorieA:
"1000 USD",


categorieB:
"700 USD",


categorieC:
"400 USD",



explication:
"Concerne les situations dangereuses mettant en risque les travailleurs.",



application:
"Utilisé lors des contrôles de sécurité, accidents ou risques professionnels."


},







{
id:4,

nature:
"Emploi irrégulier des enfants",


categorieA:
"1500 USD",


categorieB:
"1000 USD",


categorieC:
"750 USD",



explication:
"Infraction grave concernant la protection des mineurs.",



application:
"Ajouter les preuves et observations détaillées dans le PV."


},







{
id:5,

nature:
"Non respect du salaire minimum légal",


categorieA:
"800 USD",


categorieB:
"500 USD",


categorieC:
"300 USD",



explication:
"L'employeur doit respecter les obligations salariales légales.",



application:
"Comparer les rémunérations avec les normes applicables."


},







{
id:6,

nature:
"Défaut d'affiliation aux organismes sociaux",


categorieA:
"700 USD",


categorieB:
"450 USD",


categorieC:
"250 USD",



explication:
"L'employeur doit déclarer ses travailleurs conformément aux règles sociales.",



application:
"Vérifier les preuves d'affiliation et déclarations."


}



];





console.log(

this.data.sanctionsAIM.length +

" sanctions AIM chargées"

);



},









/* ==========================================================
   AFFICHAGE TABLEAU AIM
========================================================== */


loadAIMTable(){



const table =

this.$("#tbody-aim");



if(!table){

return;

}




table.innerHTML="";





this.data.sanctionsAIM.forEach(

(sanction)=>{



const ligne =
document.createElement("tr");



ligne.innerHTML = `



<td>


<button

class="link-btn"

onclick="app.showAIM(${sanction.id})">


${sanction.nature}


</button>


</td>



<td>

${sanction.categorieA}

</td>



<td>

${sanction.categorieB}

</td>



<td>

${sanction.categorieC}

</td>



`;



table.appendChild(ligne);



});



},










/* ==========================================================
   DETAIL SANCTION AIM
========================================================== */


showAIM(id){



const sanction =

this.data.sanctionsAIM.find(

item=>item.id===id

);



if(!sanction){

return;

}




alert(`


💵 SANCTION AIM 006/127



Nature :

${sanction.nature}




CATÉGORIE A :

${sanction.categorieA}




CATÉGORIE B :

${sanction.categorieB}




CATÉGORIE C :

${sanction.categorieC}




UTILITÉ :

${sanction.explication}




APPLICATION :

${sanction.application}



`);




},











/* ==========================================================
   CALCULATEUR SIMPLE AIM
========================================================== */


calculateSanction(id,categorie){



const sanction =

this.data.sanctionsAIM.find(

item=>item.id===id

);



if(!sanction){

return 0;

}





let montant = "0";





if(categorie==="A"){


montant =
sanction.categorieA;


}



if(categorie==="B"){


montant =
sanction.categorieB;


}



if(categorie==="C"){


montant =
sanction.categorieC;


}





return montant;



},










/* ==========================================================
   RECHERCHE AIM
========================================================== */


searchAIM(text){



if(!text){


return this.data.sanctionsAIM;


}





text =
text.toLowerCase();





return this.data.sanctionsAIM.filter(

(item)=>{


return (

item.nature +

item.explication +

item.application


)

.toLowerCase()

.includes(text);



}


);



},


/* ==========================================================
   PARTIE 4
   ACADEMIE INSPECTEURBOT IA RDC

   Formation des Inspecteurs
   et Contrôleurs du Travail
========================================================== */







/* ==========================================================
   INITIALISATION ACADEMIE
========================================================== */


initializeAcademy(){



this.data.academy = [




/* ======================================================
   NIVEAU 1
====================================================== */


{


level:1,


title:
"Débutant - Fondamentaux de l'inspection",



questions:[


{

id:101,


question:

"Quel est le rôle principal d'un Inspecteur du Travail ?",



choices:[


"Contrôler l'application de la législation du travail",


"Gérer l'entreprise à la place de l'employeur",


"Fixer librement les salaires",


"Remplacer les travailleurs"

],



answer:0,



explanation:

"L'Inspecteur vérifie le respect des règles du travail et contribue à la protection des travailleurs."

}



]

},







/* ======================================================
   NIVEAU 2
====================================================== */


{


level:2,


title:
"Agent terrain - Méthodes de contrôle",



questions:[



{


id:201,


question:

"Lors d'une inspection, l'employeur refuse de présenter les documents demandés. Quelle est la meilleure démarche ?",



choices:[


"Quitter immédiatement les lieux",


"Constater le refus et l'intégrer dans le rapport",


"Supprimer le dossier",


"Autoriser l'entreprise"

],



answer:1,



explanation:

"Le refus doit être constaté objectivement et documenté."

}



]

},







/* ======================================================
   NIVEAU 3
====================================================== */


{


level:3,


title:
"Inspecteur confirmé - Qualification juridique",



questions:[



{


id:301,


question:

"Avant d'appliquer une sanction, l'inspecteur doit d'abord :",

choices:[


"Déterminer le chiffre d'affaires de l'entreprise",


"Qualifier précisément l'infraction constatée",


"Choisir une sanction au hasard",


"Fermer automatiquement l'entreprise"

],



answer:1,



explanation:

"La qualification juridique des faits est indispensable avant toute sanction."

}



]

},







/* ======================================================
   NIVEAU 4
====================================================== */


{


level:4,


title:
"Expert inspection - Analyse des situations complexes",



questions:[



{


id:401,


question:

"Une entreprise régularise une infraction après le contrôle. Quelle attitude professionnelle adopter ?",



choices:[


"Effacer toute trace du contrôle",


"Constater la régularisation et conserver l'historique",


"Ne plus jamais contrôler l'entreprise",


"Annuler tous les documents"

],



answer:1,



explanation:

"La régularisation corrige la situation mais ne supprime pas le constat initial."

}



]

},








/* ======================================================
   NIVEAU 5
====================================================== */


{


level:5,


title:
"Expert senior - Stratégie d'inspection",



questions:[



{


id:501,


question:

"Pourquoi analyser les infractions répétées d'une entreprise ?",



choices:[


"Pour identifier les risques et améliorer les contrôles",


"Pour éviter toute inspection future",


"Pour supprimer les sanctions",


"Pour remplacer la loi"

],



answer:0,



explanation:

"L'analyse historique permet de cibler les actions de prévention."

}



]

},







/* ======================================================
   NIVEAU 6
====================================================== */


{


level:6,


title:
"Maître InspecteurBot - Niveau avancé",



questions:[



{


id:601,


question:

"Une entreprise commet plusieurs infractions : salaire, sécurité et documents sociaux. Quelle approche est la plus professionnelle ?",



choices:[


"Choisir uniquement l'infraction la plus simple",


"Analyser chaque infraction avec ses preuves et sanctions propres",


"Ignorer les infractions secondaires",


"Fermer automatiquement l'entreprise"

],



answer:1,



explanation:

"Chaque infraction doit être constatée, prouvée et traitée séparément selon le droit applicable."

}



]

}



];





console.log(

"Académie chargée : "

+

this.data.academy.length

+

" niveaux"

);



},










/* ==========================================================
   OUVRIR UN NIVEAU
========================================================== */


openAcademy(level){



const niveau =

this.data.academy.find(

item=>item.level===level

);



if(!niveau){

return;

}





let contenu = `



<h2>

${niveau.title}

</h2>



`;





niveau.questions.forEach((q,index)=>{



contenu += `



<div class="academy-question">


<h3>

Question ${index+1}

</h3>



<p>

${q.question}

</p>



`;






q.choices.forEach((choice,i)=>{



contenu += `



<label>


<input

type="radio"

name="academy-${q.id}"

value="${i}">


${choice}


</label>


<br>


`;



});





contenu += `


</div>


`;



});







const zone =

this.$("#academyContent");



if(zone){


zone.innerHTML = contenu;


}





},











/* ==========================================================
   CORRECTION D'UN NIVEAU
========================================================== */


checkAcademy(level){



const niveau =

this.data.academy.find(

item=>item.level===level

);



if(!niveau){

return;

}




let score=0;





niveau.questions.forEach(q=>{



const choix =

document.querySelector(

`input[name="academy-${q.id}"]:checked`

);



if(

choix &&

Number(choix.value)===q.answer

){


score++;


}



});







alert(

"Résultat : "

+

score

+

" / "

+

niveau.questions.length

);



},


/* ==========================================================
   PARTIE 5
   CAS PRATIQUES D'INSPECTION TERRAIN

   Formation professionnelle
   Inspecteurs & Contrôleurs
========================================================== */






/* ==========================================================
   INITIALISATION DES CAS PRATIQUES
========================================================== */


initializeCases(){



this.data.cases = [





/* ======================================================
   CAS 1
====================================================== */


{


id:1,


level:"Débutant",


title:
"Absence de documents du personnel",



situation:

"Lors d'une visite dans une entreprise, l'équipe d'inspection demande les contrats et documents du personnel. L'employeur affirme qu'il n'a aucun document disponible.",



question:

"Quelle est la première démarche professionnelle ?",



choices:[


"Quitter immédiatement l'entreprise",


"Constater l'absence des documents et recueillir les informations nécessaires",


"Détruire le dossier de l'entreprise",


"Autoriser l'entreprise sans contrôle"

],



answer:1,



analysis:

"L'inspecteur doit constater objectivement les faits avant toute décision."

},







/* ======================================================
   CAS 2
====================================================== */


{


id:2,


level:"Contrôleur confirmé",



title:
"Travailleur sans contrat écrit",



situation:

"Un travailleur affirme exercer depuis plusieurs mois sans contrat formel. L'employeur reconnaît la présence du travailleur mais refuse de fournir un document.",



question:

"Quelle analyse doit faire le contrôleur ?",



choices:[


"Ignorer la situation",


"Vérifier les éléments prouvant la relation de travail et constater les manquements",


"Licencier le travailleur",


"Fermer automatiquement l'entreprise"

],



answer:1,



analysis:

"La relation de travail doit être analysée à partir des faits constatés."

},







/* ======================================================
   CAS 3
====================================================== */


{


id:3,


level:"Inspecteur confirmé",



title:
"Non-respect des règles de sécurité",



situation:

"Dans une entreprise industrielle, plusieurs travailleurs utilisent des équipements dangereux sans protection adaptée.",



question:

"Quelle doit être la priorité de l'inspecteur ?",



choices:[


"Analyser le risque et exiger les mesures de protection nécessaires",


"Ignorer la situation",


"Attendre un accident avant d'agir",


"Donner uniquement un conseil verbal"

],



answer:0,



analysis:

"La prévention des risques professionnels fait partie des missions essentielles de l'inspection."

},







/* ======================================================
   CAS 4
====================================================== */


{


id:4,


level:"Expert",



title:
"Infractions multiples",



situation:

"Une entreprise présente simultanément des problèmes de salaire, de sécurité et d'absence de documents sociaux.",



question:

"Quelle méthode appliquer ?",



choices:[


"Choisir une seule infraction",


"Analyser chaque infraction séparément avec ses preuves",


"Annuler le contrôle",


"Sanctionner sans constat"

],



answer:1,



analysis:

"Chaque infraction doit être individualisée pour garantir un traitement juridique correct."

},







/* ======================================================
   CAS 5
====================================================== */


{


id:5,


level:"Maître InspecteurBot",



title:
"Entreprise étrangère opérant en RDC",



situation:

"Une entreprise employant des travailleurs étrangers exerce une activité en RDC. Certains documents administratifs concernant les travailleurs étrangers ne sont pas disponibles.",



question:

"Quelle approche doit adopter l'inspecteur ?",



choices:[


"Ne jamais contrôler les travailleurs étrangers",


"Vérifier le respect des obligations liées à l'emploi des étrangers et constater les irrégularités",


"Expulser immédiatement tous les travailleurs",


"Ignorer les documents"

],



answer:1,



analysis:

"Les travailleurs étrangers et leurs employeurs restent soumis aux obligations applicables en matière de travail."

}



];






console.log(

"Cas pratiques chargés : "

+

this.data.cases.length

);



},







/* ==========================================================
   AFFICHER LES CAS
========================================================== */


openCases(){



const zone =

this.$("#casesContent");



if(!zone){

return;

}





let html="";





this.data.cases.forEach(cas=>{



html += `



<div class="case-card">



<h3>

${cas.title}

</h3>



<p>

<strong>Niveau :</strong>

${cas.level}

</p>



<p>

${cas.situation}

</p>



<button

onclick="app.startCase(${cas.id})">


Analyser ce cas


</button>



</div>



`;



});





zone.innerHTML=html;



},







/* ==========================================================
   DEMARRER UN CAS
========================================================== */


startCase(id){



const cas =

this.data.cases.find(

item=>item.id===id

);



if(!cas){

return;

}




let texte = `



${cas.title}



Situation :

${cas.situation}



Question :

${cas.question}



`;





cas.choices.forEach(

(choice,index)=>{


texte += `


${index+1} - ${choice}


`;


});




const reponse =

prompt(texte);



if(reponse===null){

return;

}




if(

Number(reponse)-1

===

cas.answer

){



alert(

"✅ Bonne réponse\n\n"

+

cas.analysis

);



}

else{



alert(

"❌ Réponse incorrecte\n\n"

+

cas.analysis

);



}



},


/* ==========================================================
   PARTIE 6
   ARCHIVAGE INTELLIGENT DES DOSSIERS

   Gestion des missions d'inspection
   Inspecteurs & Contrôleurs
========================================================== */






/* ==========================================================
   INITIALISATION ARCHIVES
========================================================== */


initializeArchives(){



const saved =

localStorage.getItem(
"inspecteurbot-dossiers"
);



if(saved){


this.data.archives =
JSON.parse(saved);



}

else{


this.data.archives=[];


}




console.log(

"Archives chargées : "

+

this.data.archives.length

);



},







/* ==========================================================
   SAUVEGARDE ARCHIVES
========================================================== */


saveArchives(){



localStorage.setItem(


"inspecteurbot-dossiers",


JSON.stringify(
this.data.archives
)


);



},







/* ==========================================================
   CREER UN DOSSIER
========================================================== */


createArchive(dossier){



const nouveau = {



id:

Date.now(),



date:

new Date()
.toLocaleDateString("fr-FR"),



entreprise:

dossier.entreprise || 
"Entreprise non renseignée",



secteur:

dossier.secteur || 
"",



inspecteur:

dossier.inspecteur ||
"Non renseigné",



controleur:

dossier.controleur ||
"Non renseigné",



infractions:

dossier.infractions ||
[],



sanctions:

dossier.sanctions ||
[],



statut:

"Ouvert",



observations:

dossier.observations ||
""



};






this.data.archives.push(

nouveau

);



this.saveArchives();



this.renderArchives();



return nouveau;



},







/* ==========================================================
   AFFICHAGE ARCHIVES
========================================================== */


renderArchives(){



const zone =

this.$("#archives-list");



if(!zone){

return;

}





zone.innerHTML="";





if(

this.data.archives.length===0

){



zone.innerHTML=`

<div class="empty-state">


<i class="fa-solid fa-folder-open"></i>


<p>

Aucun dossier enregistré

</p>


</div>

`;



return;

}







this.data.archives.forEach(

(dossier)=>{



const card =

document.createElement(
"div"
);



card.className="archive-card";



card.innerHTML=`



<h3>

${dossier.entreprise}

</h3>



<p>

📅 Date :

${dossier.date}

</p>



<p>

👮 Inspecteur :

${dossier.inspecteur}

</p>



<p>

📌 Statut :

${dossier.statut}

</p>



<p>

⚖️ Infractions :

${dossier.infractions.length}

</p>




<button

onclick="app.openArchive(${dossier.id})">


Consulter


</button>



`;



zone.appendChild(card);



});



},







/* ==========================================================
   OUVRIR DOSSIER
========================================================== */


openArchive(id){



const dossier =

this.data.archives.find(

item=>item.id===id

);



if(!dossier){

return;

}





alert(`


📁 DOSSIER INSPECTION



Entreprise :

${dossier.entreprise}



Secteur :

${dossier.secteur}



Inspecteur :

${dossier.inspecteur}



Contrôleur :

${dossier.controleur}



Statut :

${dossier.statut}



Infractions :

${dossier.infractions.join(", ")}



Sanctions :

${dossier.sanctions.join(", ")}



Observations :

${dossier.observations}



`);




},







/* ==========================================================
   MODIFIER STATUT DOSSIER
========================================================== */


updateArchiveStatus(id,status){



const dossier =

this.data.archives.find(

item=>item.id===id

);



if(!dossier){

return;

}




dossier.statut=status;



this.saveArchives();



this.renderArchives();



},







/* ==========================================================
   SUPPRIMER DOSSIER
========================================================== */


deleteArchive(id){



const confirmation =

confirm(

"Supprimer définitivement ce dossier ?"

);



if(!confirmation){

return;

}




this.data.archives =

this.data.archives.filter(

item=>item.id!==id

);





this.saveArchives();



this.renderArchives();



},







/* ==========================================================
   RECHERCHE DOSSIERS
========================================================== */


searchArchives(text){



if(!text){


return this.data.archives;


}



text=

text.toLowerCase();





return this.data.archives.filter(

(dossier)=>{


return (

dossier.entreprise +

dossier.secteur +

dossier.inspecteur +

dossier.observations


)

.toLowerCase()

.includes(text);



}


);



},


/* ==========================================================
   PARTIE 7
   STATISTIQUES INTELLIGENTES

   Analyse des activités d'inspection
   Inspecteurs & Contrôleurs
========================================================== */






/* ==========================================================
   INITIALISATION STATISTIQUES
========================================================== */


initializeStatistics(){



this.data.statistics = {


totalDossiers:0,


totalInfractions:0,


totalSanctions:0,


totalEntreprises:0,


niveauFormation:0,


infractionsFrequences:{}



};



this.calculateStatistics();



console.log(

"Statistiques initialisées"

);



},







/* ==========================================================
   CALCUL DES STATISTIQUES
========================================================== */


calculateStatistics(){



const dossiers =

this.data.archives || [];





let infractions = 0;


let sanctions = 0;


let entreprises = [];



let frequences={};






dossiers.forEach(

(dossier)=>{



infractions +=

dossier.infractions.length;



sanctions +=

dossier.sanctions.length;





if(

!entreprises.includes(

dossier.entreprise

)

){



entreprises.push(

dossier.entreprise

);



}





dossier.infractions.forEach(

(inf)=>{



if(!frequences[inf]){


frequences[inf]=0;


}



frequences[inf]++;



});



});






this.data.statistics.totalDossiers =

dossiers.length;



this.data.statistics.totalInfractions =

infractions;



this.data.statistics.totalSanctions =

sanctions;



this.data.statistics.totalEntreprises =

entreprises.length;



this.data.statistics.infractionsFrequences =

frequences;



},







/* ==========================================================
   AFFICHAGE STATISTIQUES
========================================================== */


renderStatistics(){



this.calculateStatistics();




const zone =

this.$("#statistics-content");



if(!zone){

return;

}





const stats =

this.data.statistics;






zone.innerHTML = `



<div class="stat-card">


<i class="fa-solid fa-folder-open"></i>


<h2>

${stats.totalDossiers}

</h2>


<p>

Dossiers d'inspection

</p>


</div>





<div class="stat-card">


<i class="fa-solid fa-building"></i>


<h2>

${stats.totalEntreprises}

</h2>


<p>

Entreprises contrôlées

</p>


</div>





<div class="stat-card">


<i class="fa-solid fa-scale-balanced"></i>


<h2>

${stats.totalInfractions}

</h2>


<p>

Infractions constatées

</p>


</div>





<div class="stat-card">


<i class="fa-solid fa-file-invoice-dollar"></i>


<h2>

${stats.totalSanctions}

</h2>


<p>

Sanctions appliquées

</p>


</div>



`;



},







/* ==========================================================
   INFRACTIONS LES PLUS FREQUENTES
========================================================== */


getTopInfractions(){



const liste =

this.data.statistics.infractionsFrequences;



return Object.entries(liste)

.sort(

(a,b)=>

b[1]-a[1]

)

.slice(0,10);



},







/* ==========================================================
   RAPPORT STATISTIQUE
========================================================== */


generateStatisticsReport(){



this.calculateStatistics();




const stats =

this.data.statistics;




return `



RAPPORT INSPECTEURBOT IA RDC



===========================



Nombre de dossiers :

${stats.totalDossiers}



Entreprises contrôlées :

${stats.totalEntreprises}



Infractions constatées :

${stats.totalInfractions}



Sanctions appliquées :

${stats.totalSanctions}



===========================



Infractions fréquentes :



${

this.getTopInfractions()

.map(

(item)=>

"- "

+

item[0]

+

" : "

+

item[1]

+

" fois"

)

.join("\n")

}



`;



},







/* ==========================================================
   EXPORT SIMPLE RAPPORT
========================================================== */


exportStatistics(){



const rapport =

this.generateStatisticsReport();



console.log(

rapport

);



alert(

"Rapport généré. Consultez la console."

);



return rapport;



},


/* ==========================================================
   PARTIE 8
   OUTILS D'APPUI INSPECTION

   Recherche juridique
   Analyse terrain
   Aide PV
========================================================== */







/* ==========================================================
   CATEGORIES JURIDIQUES
========================================================== */


initializeTools(){



this.data.categories = [



"Contrat de travail",


"Salaires",


"Temps de travail",


"Congés",


"Santé et sécurité",


"Travail des enfants",


"Travailleurs étrangers",


"Documents sociaux",


"Relations professionnelles",


"Protection sociale"



];





console.log(

"Outils inspection chargés"

);



},










/* ==========================================================
   RECHERCHE GENERALE
========================================================== */


globalSearch(text){



if(!text){

return {

infractions:[],

sanctions:[]

};

}





text =
text.toLowerCase();






const infractions =

this.data.infractions.filter(

(item)=>{


return (

item.titre +

item.categorie +

item.article +

item.description

)

.toLowerCase()

.includes(text);



}

);






const sanctions =

this.data.sanctionsAIM.filter(

(item)=>{


return (

item.nature +

item.explication

)

.toLowerCase()

.includes(text);



}

);






return {

infractions,

sanctions

};



},







/* ==========================================================
   FILTRER PAR CATEGORIE
========================================================== */


filterByCategory(category){



return this.data.infractions.filter(

(item)=>{


return item.categorie===category;


}

);



},







/* ==========================================================
   FICHE D'ANALYSE INSPECTION
========================================================== */


generateInspectionGuide(id){



const infraction =

this.data.infractions.find(

(item)=>item.id===id

);



if(!infraction){

return "";

}






return `



================================

GUIDE INSPECTION INSPECTEURBOT


================================



INFRACTION :

${infraction.titre}




CATEGORIE :

${infraction.categorie}




BASE JURIDIQUE :

${infraction.article}




MONTANT INDICATIF :

${infraction.montantFC} FC





1 - ELEMENTS A VERIFIER SUR TERRAIN


${infraction.controle}





2 - IMPORTANCE JURIDIQUE


${infraction.importance}





3 - SANCTION POSSIBLE


${infraction.sanction}





4 - ELEMENTS A METTRE DANS LE PV


- Date du constat

- Identité de l'entreprise

- Faits observés

- Documents vérifiés

- Témoignages éventuels

- Référence juridique

- Mesures demandées





================================


`;



},







/* ==========================================================
   COMPARATEUR INFRACTION / SANCTION
========================================================== */


compareInfractionSanction(id){



const infraction =

this.data.infractions.find(

(item)=>item.id===id

);



if(!infraction){

return null;

}






const sanction =

this.data.sanctionsAIM.find(

(item)=>

item.nature

.toLowerCase()

.includes(

infraction.titre

.toLowerCase()

)

);






return {


infraction:

infraction,


sanction:

sanction || null



};



},







/* ==========================================================
   CONSEILS TERRAIN
========================================================== */


fieldAdvice(category){



const conseils={



"Contrat de travail":

"Vérifier les contrats, l'identité des travailleurs et la relation réelle de travail.",




"Salaires":

"Contrôler les fiches de paie, paiements et conformité avec les normes salariales.",




"Temps de travail":

"Vérifier horaires, repos, heures supplémentaires et registres.",




"Santé et sécurité":

"Examiner les équipements, risques professionnels et mesures de prévention.",




"Travailleurs étrangers":

"Contrôler les documents administratifs et le respect des obligations applicables.",




"Travail des enfants":

"Vérifier l'âge, l'identité et les conditions d'emploi.",




"Documents sociaux":

"Contrôler les registres et documents obligatoires."



};




return conseils[category] ||

"Effectuer un contrôle complet selon la réglementation applicable.";



},


/* ==========================================================
   PARTIE 9
   ASSISTANT PREPARATION PROCES-VERBAL

   Aide juridique avant rédaction PV
   Inspecteurs & Contrôleurs
========================================================== */








/* ==========================================================
   INITIALISATION GENERATEUR PV
========================================================== */


initializePVAssistant(){



this.data.pvAssistant = {


entreprise:"",


lieu:"",


date:"",


inspecteur:"",


controleur:"",


infraction:null,


observations:"",


mesures:""



};




console.log(

"Assistant PV chargé"

);



},







/* ==========================================================
   SELECTIONNER UNE INFRACTION POUR PV
========================================================== */


selectPVInfraction(id){



const infraction =

this.data.infractions.find(

(item)=>item.id===id

);



if(!infraction){

return null;

}




this.data.pvAssistant.infraction =

infraction;



return infraction;



},







/* ==========================================================
   GENERATION TEXTE PV
========================================================== */


generatePVHelp(){



const pv =

this.data.pvAssistant;




if(!pv.infraction){



return "Veuillez sélectionner une infraction.";

}



const infraction =

pv.infraction;






return `



================================


AIDE A LA REDACTION DU PROCES-VERBAL


INSPECTEURBOT IA RDC


================================




IDENTIFICATION ENTREPRISE


Entreprise :

${pv.entreprise || "À compléter"}



Lieu du contrôle :

${pv.lieu || "À compléter"}



Date :

${pv.date || "À compléter"}





PERSONNES PRESENTES


Inspecteur :

${pv.inspecteur || "À compléter"}



Contrôleur :

${pv.controleur || "À compléter"}







OBJET DU CONSTAT



Infraction constatée :


${infraction.titre}




Catégorie :


${infraction.categorie}




Référence juridique :


${infraction.article}





DESCRIPTION DES FAITS



L'inspection a constaté les éléments suivants :



${pv.observations || 
"Décrire précisément les faits observés."}







ELEMENTS DE VERIFICATION



${infraction.controle}







IMPORTANCE JURIDIQUE



${infraction.importance}







SANCTION APPLICABLE



${infraction.sanction}







MESURES CORRECTIVES DEMANDEES



${pv.mesures || 
"Indiquer les mesures de régularisation demandées."}







OBSERVATION DE L'INSPECTEUR



Les faits constatés doivent être appuyés par les documents,
preuves et éléments recueillis pendant la mission de contrôle.





================================


Créé avec InspecteurBot IA RDC


================================


`;



},







/* ==========================================================
   ENREGISTRER INFORMATIONS PV
========================================================== */


savePVInformation(data){



this.data.pvAssistant = {


...this.data.pvAssistant,


...data



};





localStorage.setItem(

"inspecteurbot-pv-assistant",


JSON.stringify(

this.data.pvAssistant

)


);



},







/* ==========================================================
   CHARGER PV PRECEDENT
========================================================== */


loadPVInformation(){



const data =

localStorage.getItem(

"inspecteurbot-pv-assistant"

);



if(data){



this.data.pvAssistant =

JSON.parse(data);



}



return this.data.pvAssistant;



},







/* ==========================================================
   LISTE INFRACTIONS POUR PV
========================================================== */


getPVInfractionList(){



return this.data.infractions.map(

(item)=>{


return {


id:item.id,


nom:item.titre,


categorie:item.categorie


};



}

);



},


/* ==========================================================
   PARTIE 10
   CALCULATEUR INTELLIGENT DES SANCTIONS AIM

   Aide à l'application des amendes
   Inspecteurs & Contrôleurs
========================================================== */







/* ==========================================================
   INITIALISATION CALCULATEUR
========================================================== */


initializeCalculator(){



this.data.calculator = {


infraction:null,


categorie:"C",


multiplicateur:1,


resultat:null



};



console.log(

"Calculateur sanctions chargé"

);



},







/* ==========================================================
   SELECTIONNER INFRACTION
========================================================== */


selectCalculationInfraction(id){



const sanction =

this.data.sanctionsAIM.find(

(item)=>item.id===id

);



if(!sanction){

return null;

}





this.data.calculator.infraction =

sanction;



return sanction;



},







/* ==========================================================
   DEFINIR CATEGORIE ENTREPRISE
========================================================== */


setEnterpriseCategory(categorie){



if(

["A","B","C"]

.includes(categorie)

){



this.data.calculator.categorie =

categorie;



}



},







/* ==========================================================
   DEFINIR MULTIPLICATEUR
========================================================== */


setMultiplier(value){



let nombre =

Number(value);



if(

isNaN(nombre)

||

nombre<=0

){



nombre=1;


}



this.data.calculator.multiplicateur =

nombre;



},







/* ==========================================================
   CALCUL FINAL
========================================================== */


calculateAIM(){



const calcul =

this.data.calculator;




if(!calcul.infraction){



return {


success:false,


message:

"Aucune sanction sélectionnée."

};



}






let montantBase="0";





switch(

calcul.categorie

){



case "A":

montantBase =

calcul.infraction.categorieA;

break;



case "B":

montantBase =

calcul.infraction.categorieB;

break;



case "C":

montantBase =

calcul.infraction.categorieC;

break;



}





/*
 Suppression du texte USD
 pour calcul numérique
*/


let montant =

Number(

String(montantBase)

.replace(

"USD",

""

)

.trim()

);






const total =

montant *

calcul.multiplicateur;





const resultat = {


categorie:

calcul.categorie,


base:

montant,


multiplicateur:

calcul.multiplicateur,


total:

total,


devise:

"USD"



};





this.data.calculator.resultat =

resultat;






return {


success:true,


resultat:resultat



};



},







/* ==========================================================
   AFFICHAGE RESULTAT CALCUL
========================================================== */


showCalculationResult(){



const resultat =

this.calculateAIM();





if(

!resultat.success

){



alert(

resultat.message

);



return;

}





const r =

resultat.resultat;





alert(`



CALCUL SANCTION AIM 006/127



Catégorie entreprise :

${r.categorie}



Montant de base :

${r.base} USD



Multiplicateur :

x${r.multiplicateur}



--------------------



TOTAL :

${r.total} USD



--------------------



InspecteurBot IA RDC


`);




},







/* ==========================================================
   HISTORIQUE DES CALCULS
========================================================== */


saveCalculationHistory(){



const historique =

JSON.parse(

localStorage.getItem(

"inspecteurbot-calculs"

)

|| "[]"

);






historique.push({



date:

new Date()

.toLocaleString("fr-FR"),



resultat:

this.data.calculator.resultat



});






localStorage.setItem(

"inspecteurbot-calculs",


JSON.stringify(

historique

)



);



},







/* ==========================================================
   AFFICHER HISTORIQUE
========================================================== */


getCalculationHistory(){



return JSON.parse(

localStorage.getItem(

"inspecteurbot-calculs"

)

|| "[]"

);



},


/* ==========================================================
   PARTIE 11
   BIBLIOTHEQUE JURIDIQUE INTELLIGENTE

   Classement des infractions par domaine
   Formation Inspecteurs & Contrôleurs
========================================================== */







/* ==========================================================
   INITIALISATION BIBLIOTHEQUE
========================================================== */


initializeLibrary(){



this.data.library = [




{


id:1,


categorie:"Contrat de travail",



titre:

"Absence de contrat ou irrégularité contractuelle",



explication:

"Le contrat de travail permet d'établir clairement les droits et obligations des parties.",



constat:

"Vérifier l'existence des contrats, les mentions obligatoires et les conditions réelles d'exécution du travail.",



importance:

"Permet de protéger le travailleur et garantir la transparence de la relation professionnelle.",



sanction:

"Application des sanctions prévues selon la gravité du manquement."



},






{


id:2,


categorie:"Salaires",



titre:

"Non-paiement ou retard de salaire",



explication:

"Le salaire constitue une obligation essentielle de l'employeur.",



constat:

"Contrôler les fiches de paie, preuves de paiement et registres.",



importance:

"Le non-respect du paiement porte atteinte aux droits fondamentaux du travailleur.",



sanction:

"Sanctions financières et mesures de régularisation."



},






{


id:3,


categorie:"Santé et sécurité",



titre:

"Absence de mesures de protection des travailleurs",



explication:

"L'employeur doit prévenir les risques professionnels.",



constat:

"Examiner les équipements de protection, les postes dangereux et les mesures préventives.",



importance:

"La sécurité protège la vie et l'intégrité physique des travailleurs.",



sanction:

"Mesures correctives et sanctions applicables."



},






{


id:4,


categorie:"Travail des enfants",



titre:

"Emploi irrégulier d'un enfant",



explication:

"Le travail des enfants est soumis à des conditions strictes de protection.",



constat:

"Vérifier l'âge, l'identité et les conditions d'activité.",



importance:

"Protection de l'enfant contre l'exploitation et les travaux dangereux.",



sanction:

"Sanctions renforcées selon les dispositions applicables."



},






{


id:5,


categorie:"Travailleurs étrangers",



titre:

"Non-respect des obligations liées aux travailleurs étrangers",



explication:

"Les travailleurs étrangers doivent respecter les conditions administratives et professionnelles applicables.",



constat:

"Vérifier les documents autorisant l'activité professionnelle et les obligations de l'employeur.",



importance:

"Assure la conformité de l'emploi des travailleurs étrangers sur le territoire national.",



sanction:

"Application des mesures prévues par la réglementation."



},






{


id:6,


categorie:"Documents obligatoires",



titre:

"Absence de registres et documents sociaux",



explication:

"Les documents permettent le contrôle et la traçabilité de la relation de travail.",



constat:

"Examiner les registres, déclarations et documents exigés.",



importance:

"Facilite la mission de contrôle et la preuve des faits.",



sanction:

"Sanctions administratives ou financières selon le cas."



}





];





console.log(

"Bibliothèque juridique chargée : "

+

this.data.library.length

);



},







/* ==========================================================
   RECHERCHE BIBLIOTHEQUE
========================================================== */


searchLibrary(text){



if(!text){

return this.data.library;

}





text =

text.toLowerCase();






return this.data.library.filter(

(item)=>{



return (



item.categorie

+

item.titre

+

item.explication

+

item.constat



)

.toLowerCase()

.includes(text);



}



);



},







/* ==========================================================
   FILTRAGE PAR DOMAINE
========================================================== */


getLibraryByCategory(category){



return this.data.library.filter(

(item)=>{


return item.categorie===category;


}

);



},







/* ==========================================================
   FICHE PEDAGOGIQUE
========================================================== */


getLibrarySheet(id){



const item =

this.data.library.find(

(element)=>

element.id===id

);





if(!item){

return "";

}







return `



📚 FICHE JURIDIQUE INSPECTEURBOT



DOMAINE :

${item.categorie}



INFRACTION :

${item.titre}




EXPLICATION :



${item.explication}




COMMENT CONSTATER :



${item.constat}




IMPORTANCE :



${item.importance}




SANCTION :



${item.sanction}



`;



},



/* ==========================================================
   PARTIE 12
   ASSISTANT IA SPECIALISE

   Sanctions & Infractions
   Formation Inspecteurs & Contrôleurs
========================================================== */







/* ==========================================================
   INITIALISATION IA JURIDIQUE
========================================================== */


initializeLegalAI(){



this.data.aiKnowledge = [



{


keywords:[

"salaire",
"paiement",
"retard"

],


response:

"Le salaire est une obligation essentielle de l'employeur. L'Inspecteur doit vérifier les preuves de paiement, fiches de paie, registres et éléments démontrant la situation réelle."

},






{


keywords:[

"contrat",
"travail",
"engagement"

],


response:

"Pour une question de contrat, il faut vérifier l'existence du lien de travail, les documents contractuels et les conditions réelles d'exécution."

},






{


keywords:[

"sécurité",
"danger",
"protection"

],


response:

"La sécurité au travail nécessite l'analyse des risques, des équipements de protection et des mesures préventives mises en place par l'employeur."

},






{


keywords:[

"étranger",
"étrangers",
"main d'oeuvre étrangère"

],


response:

"Pour les travailleurs étrangers, il faut contrôler les documents administratifs et les obligations applicables à leur emploi."

},






{


keywords:[

"enfant",
"mineur"

],


response:

"Le contrôle du travail des enfants nécessite une vérification de l'âge, de l'activité exercée et des conditions de protection."

},






{


keywords:[

"pv",
"procès-verbal",
"constat"

],


response:

"Un PV doit présenter des faits précis, objectifs et vérifiables : identité de l'entreprise, date, lieu, constatations, preuves et références juridiques."

}



];





console.log(

"Assistant IA juridique chargé"

);



},







/* ==========================================================
   POSER UNE QUESTION A L'IA
========================================================== */


askLegalAI(question){



if(!question){

return "Veuillez saisir une question.";

}




let q =

question.toLowerCase();







for(

const knowledge of this.data.aiKnowledge

){



for(

const word of knowledge.keywords

){



if(

q.includes(word)

){



return knowledge.response;



}



}



}






return `



Analyse InspecteurBot IA :



Votre question nécessite une analyse juridique complète.



Méthode recommandée :



1 - Identifier les faits constatés.



2 - Vérifier les documents disponibles.



3 - Identifier l'obligation légale concernée.



4 - Déterminer l'infraction éventuelle.



5 - Vérifier la sanction applicable.



`;



},







/* ==========================================================
   ANALYSE SITUATION TERRAIN
========================================================== */


analyzeFieldSituation(situation){



if(!situation){


return "Décrivez la situation terrain.";


}






return `



ANALYSE INSPECTEURBOT IA RDC



Situation analysée :



${situation}





Méthode d'analyse :



✓ Identifier les faits matériels.



✓ Rechercher les preuves disponibles.



✓ Identifier les obligations de l'employeur.



✓ Qualifier l'infraction éventuelle.



✓ Vérifier la sanction correspondante.



✓ Déterminer les mesures correctives.






Conseil :

Toujours séparer les faits constatés de l'interprétation juridique.



`;



},







/* ==========================================================
   QUESTIONS DE FORMATION DIFFICILES
========================================================== */


initializeAdvancedQuestions(){



this.data.examQuestions=[



{


level:"Niveau Expert",


question:

"Une entreprise respecte le paiement des salaires mais refuse de présenter ses registres obligatoires. Quelle approche doit adopter l'Inspecteur ?",



answer:

"L'Inspecteur doit constater l'absence des documents obligatoires et analyser cette situation comme un manquement distinct."

},






{


level:"Niveau Maître Inspecteur",


question:

"Une entreprise possède des travailleurs étrangers mais affirme que seuls les documents internes suffisent. Que doit vérifier le contrôleur ?",



answer:

"Le contrôleur doit vérifier l'ensemble des obligations administratives et professionnelles applicables."

},






{


level:"Niveau Expert Terrain",


question:

"Plusieurs infractions sont découvertes lors d'une même visite. Peut-on établir une seule observation générale ?",



answer:

"Chaque infraction doit être individualisée avec ses faits, preuves et références."

}



];





},







/* ==========================================================
   AFFICHER QUESTION FORMATION
========================================================== */


getTrainingQuestions(){



return this.data.examQuestions;



},


/* ==========================================================
   PARTIE 13
   FINALISATION GENERALE DU MODULE

   InspecteurBot IA RDC
   Module Sanctions & Infractions

   Créé par Inspecteur Limengo (Pmiller) 2026
========================================================== */







/* ==========================================================
   INITIALISATION GENERALE DU MODULE
========================================================== */


initializeModule(){



console.log(

"===================================="

);



console.log(

"InspecteurBot IA RDC"

);



console.log(

"Module Sanctions & Infractions"

);



console.log(

"Chargement complet..."

);





try{



this.data = this.data || {};





this.initializeInfractions();



this.initializeAIM();



this.initializeAcademy();



this.initializeCases();



this.initializeArchives();



this.initializeStatistics();



this.initializeTools();



this.initializePVAssistant();



this.initializeCalculator();



this.initializeLibrary();



this.initializeLegalAI();



this.initializeAdvancedQuestions();






console.log(

"✅ Module chargé avec succès"

);



}

catch(error){



console.error(

"Erreur chargement module :",

error

);



}



},







/* ==========================================================
   VERIFICATION ETAT MODULE
========================================================== */


checkModuleStatus(){



return {



infractions:

this.data.infractions ?

this.data.infractions.length :

0,



sanctions:

this.data.sanctionsAIM ?

this.data.sanctionsAIM.length :

0,



archives:

this.data.archives ?

this.data.archives.length :

0,



bibliotheque:

this.data.library ?

this.data.library.length :

0,



questions:

this.data.examQuestions ?

this.data.examQuestions.length :

0



};



},







/* ==========================================================
   INFORMATIONS MODULE
========================================================== */


getModuleInformation(){



return `



INSPECTEURBOT IA RDC



MODULE :

SANCTIONS & INFRACTIONS



Objectif :



Former et accompagner les Inspecteurs et Contrôleurs du Travail dans la maîtrise des infractions, sanctions et méthodes de contrôle.



Fonctions disponibles :



✓ Tableau des infractions du Code du Travail



✓ Tableau AIM des sanctions



✓ Académie de formation



✓ Cas pratiques terrain



✓ Bibliothèque juridique



✓ Assistant IA juridique



✓ Aide préparation PV



✓ Calculateur sanctions



✓ Statistiques inspection





Créé par :

Inspecteur Limengo (Pmiller)



Année :

2026



`;



},







/* ==========================================================
   EXPORT DONNEES MODULE
========================================================== */


exportModuleData(){



const exportData={



date:

new Date()

.toISOString(),



module:

"Sanctions & Infractions",



data:

this.data



};





return JSON.stringify(

exportData,

null,

2

);



},







/* ==========================================================
   RESET DONNEES LOCALES
========================================================== */


resetModuleStorage(){



const confirmation=

confirm(

"Supprimer les données locales du module ?"

);





if(!confirmation){

return;

}




localStorage.removeItem(

"inspecteurbot-dossiers"

);



localStorage.removeItem(

"inspecteurbot-calculs"

);



localStorage.removeItem(

"inspecteurbot-pv-assistant"

);





alert(

"Données locales supprimées."

);



},







/* ==========================================================
   FOOTER MODULE
========================================================== */


renderModuleFooter(){



const footer =

document.querySelector(

"#module-footer"

);





if(!footer){

return;

}





footer.innerHTML = `



<div class="module-footer">



<p>

⚖️ InspecteurBot IA RDC

</p>



<p>

Module Sanctions & Infractions

</p>



<p>

Créé par Inspecteur Limengo (Pmiller) 2026

</p>



</div>



`;



},







/* ==========================================================
   DEMARRAGE AUTOMATIQUE
========================================================== */


start(){



this.initializeModule();



this.renderModuleFooter();



console.log(

this.getModuleInformation()

);



}



document.addEventListener(

"DOMContentLoaded",

()=>{


if(window.app){


app.start();


}


}

);





/* ==========================================================
   FIN MODULE SANCTIONS & INFRACTIONS

   InspecteurBot IA RDC

   Créé par Inspecteur Limengo (Pmiller) 2026
========================================================== */





