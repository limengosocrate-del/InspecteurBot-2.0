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



