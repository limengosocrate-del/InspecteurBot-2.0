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
