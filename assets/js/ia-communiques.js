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
