/*==================================================
 INSPECTEURBOT RDC
 IA SPÉCIALISÉE - COMMUNIQUÉS OFFICIELS
==================================================*/

const IACommuniques = {

    repondre(question){

        if(!question){

            return "Veuillez saisir une question.";

        }

        const resultat = RAGCommuniques.bestResult(question);

        if(!resultat){

            return "Aucun communiqué correspondant n'a été trouvé.";

        }

        return `
📢 ${resultat.titre}

📅 Date : ${resultat.date}

👤 Auteur : ${resultat.auteur}

📂 Catégorie : ${resultat.categorie}

📝 ${resultat.description}
`;

    },

    ouvrir(question){

        const resultat = RAGCommuniques.bestResult(question);

        if(!resultat){

            alert("Aucun communiqué trouvé.");

            return;

        }

        const lecteur = document.getElementById("mainPlayer");

        if(lecteur){

            lecteur.src = resultat.audio;
            lecteur.load();
            lecteur.play();

        }

        return resultat;

    }

};

/*==================================================
 ANALYSE INTELLIGENTE DES QUESTIONS
==================================================*/

IACommuniques.analyser = function(question){

    if(!question){
        return;
    }

    question = question.toLowerCase().trim();

    /* Dernier communiqué */

    if(question.includes("dernier") ||
       question.includes("récent") ||
       question.includes("nouveau")){

        const dernier = RAGCommuniques.documents[0];

        if(dernier){

            this.ouvrir(dernier.titre);

            return this.repondre(dernier.titre);

        }

    }

    /* Recherche par numéro */

    const numero = question.match(/\d+/);

    if(numero){

        const recherche = "N°" + numero[0];

        this.ouvrir(recherche);

        return this.repondre(recherche);

    }

    /* Recherche générale */

    this.ouvrir(question);

    return this.repondre(question);

};


/*==================================================
 BOUTON DE RECHERCHE
==================================================*/

document.addEventListener("DOMContentLoaded", ()=>{

    const input = document.getElementById("searchCommunique");
    const bouton = document.getElementById("btnSearch");

    if(!input || !bouton){
        return;
    }

    bouton.addEventListener("click", ()=>{

        const reponse = IACommuniques.analyser(input.value);

        if(reponse){

            alert(reponse);

        }

    });

    input.addEventListener("keypress", e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            const reponse = IACommuniques.analyser(input.value);

            if(reponse){

                alert(reponse);

            }

        }

    });

});
