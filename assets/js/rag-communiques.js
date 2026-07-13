/*==================================================
 INSPECTEURBOT RDC
 RAG COMMUNIQUÉS OFFICIELS
 Module intelligent de recherche dans les communiqués
==================================================*/


const RAGCommuniques = {

    documents: [],


    /**
     * Charger les communiqués depuis JSON
     */
    async load(){

        try{

            const response = await fetch(
                "assets/data/communiques.json"
            );


            this.documents = await response.json();


            console.log(
                "✅ Communiqués chargés :",
                this.documents.length
            );


        }catch(error){

            console.error(
                "❌ Erreur chargement communiqués",
                error
            );

        }

    },



    /**
     * Nettoyage du texte
     */
    normalize(text){

        return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g,"");

    },



    /**
     * Recherche intelligente
     */
    search(question){


        if(!question || this.documents.length===0){

            return [];

        }


        let query=this.normalize(question);


        return this.documents.filter(doc=>{


            let contenu=this.normalize(

                doc.titre
                +" "
                +doc.description
                +" "
                +doc.auteur
                +" "
                +doc.categorie

            );


            return contenu.includes(query);


        });


    }

};

/*==================================================
RECHERCHE AVANCÉE PAR SCORE DE PERTINENCE
==================================================*/

RAGCommuniques.searchAdvanced = function(question){

    if(!question || this.documents.length===0){
        return [];
    }

    const mots = this.normalize(question)
        .split(/\s+/)
        .filter(mot => mot.length > 2);

    const resultats = [];

    this.documents.forEach(doc => {

        const texte = this.normalize(
            (doc.titre || "") + " " +
            (doc.description || "") + " " +
            (doc.contenu || "") + " " +
            (doc.auteur || "") + " " +
            (doc.categorie || "") + " " +
            (doc.date || "")
        );

        let score = 0;

        mots.forEach(mot => {

            if(texte.includes(mot)){
                score++;
            }

        });

        if(score > 0){

            resultats.push({
                score: score,
                document: doc
            });

        }

    });

    resultats.sort((a,b)=>b.score-a.score);

    return resultats;

};


/*==================================================
RECHERCHE DU MEILLEUR RÉSULTAT
==================================================*/

RAGCommuniques.bestResult = function(question){

    const resultats = this.searchAdvanced(question);

    if(resultats.length===0){
        return null;
    }

    return resultats[0].document;

};


/*==================================================
INITIALISATION AUTOMATIQUE
==================================================*/

document.addEventListener("DOMContentLoaded", async ()=>{

    await RAGCommuniques.load();

    console.log("✅ Module RAG Communiqués initialisé.");

});
