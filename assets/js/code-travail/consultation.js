/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 consultation.js
 PARTIE 1/10
 CONFIGURATION GÉNÉRALE
==================================================*/

"use strict";

/*==================================================
OBJET CONSULTATION
==================================================*/

const Consultation = {

    article:null,

    index:-1,

    historique:[],

    initialise:false

};

/*==================================================
INITIALISATION
==================================================*/

Consultation.initialiser=function(){

    if(this.initialise){

        return;

    }

    this.initialise=true;

    console.log(

        "Module Consultation initialisé."

    );

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.Consultation=Consultation;

/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 consultation.js
 PARTIE 2/10
 ÉCOUTE DU CHARGEMENT
==================================================*/

"use strict";

/*==================================================
ÉVÉNEMENT CODE CHARGÉ
==================================================*/

document.addEventListener(

    "codeTravailCharge",

    ()=>{

        Consultation.initialiser();

        Consultation.afficherAccueil();

    }

);

/*==================================================
AFFICHAGE DE L'ACCUEIL
==================================================*/

Consultation.afficherAccueil=function(){

    const numero=

        document.getElementById(

            "numeroArticle"

        );

    const titre=

        document.getElementById(

            "titreArticle"

        );

    const contenu=

        document.getElementById(

            "contenuArticle"

        );

    if(numero){

        numero.textContent=

        "Code du Travail";

    }

    if(titre){

        titre.textContent=

        "Bibliothèque juridique intelligente";

    }

    if(contenu){

        contenu.textContent=

        "Bienvenue dans le Code du Travail de la République Démocratique du Congo. Utilisez la recherche intelligente, les catégories ou la navigation pour consulter les articles.";

    }

};

/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 consultation.js
 PARTIE 3/10
 AFFICHAGE D'UN ARTICLE
==================================================*/

"use strict";

/*==================================================
AFFICHER UN ARTICLE
==================================================*/

Consultation.afficherArticle=function(article){

    if(!article){

        return;

    }

    this.article=article;

    this.index=

    CodeTravail.articles.findIndex(

        item=>item.id===article.id

    );

    const numero=

    document.getElementById(

        "numeroArticle"

    );

    const titre=

    document.getElementById(

        "titreArticle"

    );

    const contenu=

    document.getElementById(

        "contenuArticle"

    );

    if(numero){

        numero.textContent=

        "Article "+article.numero;

    }

    if(titre){

        titre.textContent=

        article.titre;

    }

    if(contenu){

        contenu.textContent=

        article.contenu;

    }

    this.ajouterHistorique(article);

    this.mettreAJourInformations(article);

};

/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 consultation.js
 PARTIE 4/10
 MISE À JOUR DES INFORMATIONS
==================================================*/

"use strict";

/*==================================================
METTRE À JOUR LES INFORMATIONS
==================================================*/

Consultation.mettreAJourInformations=function(article){

    const infoArticle=

    document.getElementById(

        "infoArticle"

    );

    const infoCategorie=

    document.getElementById(

        "infoCategorie"

    );

    const infoTitre=

    document.getElementById(

        "infoTitre"

    );

    if(infoArticle){

        infoArticle.textContent=

        "Article "+article.numero;

    }

    if(infoCategorie){

        infoCategorie.textContent=

        article.categorie||"-";

    }

    if(infoTitre){

        infoTitre.textContent=

        article.titre||"-";

    }

    const infoSanction=

    document.getElementById(

        "infoSanction"

    );

    if(infoSanction){

        infoSanction.textContent=

        article.sanction?

        "Oui":

        "Non";

    }

};

/*==================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 consultation.js
 PARTIE 5/10
 HISTORIQUE DES CONSULTATIONS
==================================================*/

"use strict";

/*==================================================
AJOUTER À L'HISTORIQUE
==================================================*/

Consultation.ajouterHistorique=function(article){

    if(!article){

        return;

    }

    this.historique=

    this.historique.filter(

        item=>item.id!==article.id

    );

    this.historique.unshift(article);

    if(this.historique.length>20){

        this.historique.pop();

    }

    console.log(

        "Historique :",

        this.historique.length,

        "article(s)"

    );

};

/*==================================================
OBTENIR L'HISTORIQUE
==================================================*/

Consultation.getHistorique=function(){

    return [...this.historique];

};

/*==================================================
VIDER L'HISTORIQUE
==================================================*/

Consultation.viderHistorique=function(){

    this.historique=[];

    console.log(

        "Historique vidé."

    );

};

"use strict";

/*==================================================
ARTICLE PRÉCÉDENT
==================================================*/

Consultation.articlePrecedent = function () {

    if (!CodeTravail.articlePrecedent) {
        return null;
    }

    const article = CodeTravail.articlePrecedent();

    if (article) {
        this.afficherArticle(article);
    }

    return article;
};

/*==================================================
ARTICLE SUIVANT
==================================================*/

Consultation.articleSuivant = function () {

    if (!CodeTravail.articleSuivant) {
        return null;
    }

    const article = CodeTravail.articleSuivant();

    if (article) {
        this.afficherArticle(article);
    }

    return article;
};

"use strict";

/*==================================================
INITIALISER LES ÉVÉNEMENTS UI
==================================================*/

Consultation.initialiserEvenements = function () {

    const btnPrecedent =
        document.getElementById("btnArticlePrecedent");

    const btnSuivant =
        document.getElementById("btnArticleSuivant");

    const btnCopier =
        document.getElementById("btnCopierArticle");

    const btnLecture =
        document.getElementById("btnLectureArticle");

    const btnFavori =
        document.getElementById("btnFavoriArticle");

    const btnPartager =
        document.getElementById("btnPartagerArticle");

    const btnImprimer =
        document.getElementById("btnImprimerArticle");

    const btnIA =
        document.getElementById("btnExpliquerIA");

    if (btnPrecedent) {
        btnPrecedent.addEventListener("click", () => {
            this.articlePrecedent();
        });
    }

    if (btnSuivant) {
        btnSuivant.addEventListener("click", () => {
            this.articleSuivant();
        });
    }

    if (btnCopier && navigator.clipboard) {
        btnCopier.addEventListener("click", () => {
            if (this.article) {
                navigator.clipboard.writeText(this.article.contenu || "");
            }
        });
    }

    if (btnLecture) {
        btnLecture.addEventListener("click", () => {
            if (window.Speech && this.article) {
                Speech.lire(this.article.contenu || "");
            }
        });
    }

    if (btnFavori) {
        btnFavori.addEventListener("click", () => {
            if (window.Favoris && this.article) {
                Favoris.ajouter(this.article);
            }
        });
    }

    if (btnPartager) {
        btnPartager.addEventListener("click", () => {
            if (window.Share && this.article) {
                Share.partagerArticle(this.article);
            }
        });
    }

    if (btnImprimer) {
        btnImprimer.addEventListener("click", () => {
            window.print();
        });
    }

    if (btnIA) {
        btnIA.addEventListener("click", () => {
            const zone = document.getElementById("questionIA");
            if (window.AssistantIA && zone && this.article) {
                AssistantIA.analyser(this.article, zone.value);
            }
        });
    }
};

"use strict";

/*==================================================
INITIALISER QUESTIONS RAPIDES
==================================================*/

Consultation.initialiserQuestionsRapides = function () {

    const boutons =
        document.querySelectorAll("#questionsRapides button");

    boutons.forEach(btn => {

        btn.addEventListener("click", () => {

            const question =
                btn.getAttribute("data-question");

            if (!question) return;

            const zone =
                document.getElementById("questionIA");

            if (zone) {
                zone.value = question;
            }

            if (window.AssistantIA) {
                AssistantIA.analyser(null, question);
            }

        });

    });
};

"use strict";

/*==================================================
OBTENIR ARTICLE COURANT
==================================================*/

Consultation.getArticleCourant = function () {
    return this.article;
};

/*==================================================
RECHERCHER ET AFFICHER
==================================================*/

Consultation.rechercherEtAfficher = function (texte) {

    if (!window.CodeTravail) {
        return;
    }

    const resultats =
        CodeTravail.rechercher(texte);

    if (resultats.length > 0) {
        this.afficherArticle(resultats[0]);
    }

    return resultats;
};

/*==================================================
RÉINITIALISER AFFICHAGE
==================================================*/

Consultation.reinitialiser = function () {

    this.article = null;
    this.index = -1;

    const numero =
        document.getElementById("numeroArticle");

    const titre =
        document.getElementById("titreArticle");

    const contenu =
        document.getElementById("contenuArticle");

    if (numero) numero.textContent = "Aucun article";
    if (titre) titre.textContent = "Sélectionnez un article";
    if (contenu) contenu.textContent = "Utilisez la recherche ou les catégories.";

};

"use strict";

/*==================================================
FINALISATION INIT MODULE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    Consultation.initialiser();

    Consultation.initialiserEvenements();

    Consultation.initialiserQuestionsRapides();

    console.log("Consultation prête.");

});

