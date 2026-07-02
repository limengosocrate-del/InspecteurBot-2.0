"use strict";

/* =====================================================
   INSPECTEURBOT RDC
   MODULE : RECHERCHE
   ===================================================== */

const Recherche = {

    initialiser(){

        this.initialiserChamp();

        this.initialiserBouton();

    }

};

window.Recherche = Recherche;

/* =====================================================
   BOUTON RECHERCHER
   ===================================================== */

Recherche.initialiserBouton = function(){

    const bouton =

        document.getElementById(

            "btnRecherche"

        );

    if(!bouton){

        return;

    }

    bouton.addEventListener(

        "click",

        ()=>{

            this.rechercher();

        }

    );

};

/* =====================================================
   CHAMP DE RECHERCHE
   ===================================================== */

Recherche.initialiserChamp = function(){

    const champ =

        document.getElementById(

            "rechercheArticle"

        );

    if(!champ){

        return;

    }

    champ.addEventListener(

        "keydown",

        (event)=>{

            if(event.key==="Enter"){

                this.rechercher();

            }

        }

    );

};

/* =====================================================
   RECHERCHE D'UN ARTICLE
   ===================================================== */

Recherche.rechercher = function(){

    const champ =

        document.getElementById(
            "rechercheArticle"
        );

    if(!champ){

        return;

    }

    const texte =

        champ.value
        .trim()
        .toLowerCase();

    if(texte===""){

        return;

    }

    const numero =

    Number(texte);

    let resultat = null;

  /* -------------------------
   Détection "Article XX"
-------------------------- */

const correspondance =

    texte.match(

        /(?:article|art\.?|art)\s*(?:n°|no)?\s*(\d+)/i

    );

if(correspondance){

    const numero =

        parseInt(

            correspondance[1]

        );

    const article =

        CodeTravail.getParNumero(

            numero

        );

    if(article){

        Consultation.afficherArticle(

            article

        );

        CodeTravail.selectionner(

            numero

        );

        return;

    }

}

    /* -------------------------
       Recherche par numéro
    -------------------------- */

    if(!isNaN(numero)){

        resultat =

            CodeTravail.getParNumero(numero);

    }

    /* -------------------------
       Recherche textuelle
    -------------------------- */

    if(!resultat){

        resultat =

            CodeTravail.articles.find(

                article =>

                    article.titre
                    .toLowerCase()
                    .includes(texte)

                    ||

                    article.categorie
                    .toLowerCase()
                    .includes(texte)

                    ||

                    article.contenu
                    .toLowerCase()
                    .includes(texte)

                    ||

                    article.motsCles.some(

                        mot=>

                        mot.toLowerCase()
                        .includes(texte)

                    )

            );

    }

    /* -------------------------
       Résultat
    -------------------------- */

    if(resultat){

        Consultation.afficherArticle(

            resultat

        );

        CodeTravail.selectionner(

            resultat.numero

        );

        return;

    }

    alert(

        "Aucun article trouvé."

    );

};

