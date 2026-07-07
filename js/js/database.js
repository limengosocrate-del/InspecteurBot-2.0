/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 database.js
 Base de données locale
===================================================*/

"use strict";


/*==================================================
 STRUCTURE BASE DE DONNEES
===================================================*/

function initDatabase(){


    if(!Storage.get("database")){


        const database = {


            entreprises: [],


            missions: [],


            rapports: [],


            inspecteurs: [],


            created:
            new Date()


        };



        Storage.save(
            "database",
            database
        );


    }



}



/*==================================================
 RECUPERER BASE
===================================================*/

function getDatabase(){


    return Storage.get(
        "database"
    );


}



/*==================================================
 SAUVEGARDER BASE
===================================================*/

function saveDatabase(data){


    Storage.save(
        "database",
        data
    );


}



/*==================================================
 AJOUT ENTREPRISE
===================================================*/

function addEntreprise(
    entreprise
){


    const db =
        getDatabase();



    entreprise.id =
        Date.now();



    entreprise.date =
        new Date();



    db.entreprises.push(
        entreprise
    );



    saveDatabase(
        db
    );



    logAction(
        "Entreprise ajoutée : "
        +
        entreprise.nom
    );



}



/*==================================================
 AJOUT MISSION
===================================================*/

function addMission(
    mission
){


    const db =
        getDatabase();



    mission.id =
        Date.now();



    mission.date =
        new Date();



    db.missions.push(
        mission
    );



    saveDatabase(
        db
    );



    logAction(
        "Mission ajoutée"
    );


}



/*==================================================
 AJOUT RAPPORT
===================================================*/

function addRapport(
    rapport
){


    const db =
        getDatabase();



    rapport.id =
        Date.now();



    rapport.date =
        new Date();



    db.rapports.push(
        rapport
    );



    saveDatabase(
        db
    );



    logAction(
        "Rapport enregistré"
    );


}



/*==================================================
 RECHERCHE DONNEES
===================================================*/

function searchDatabase(
    text
){


    const db =
        getDatabase();



    text =
    text.toLowerCase();



    return {


        entreprises:

        db.entreprises.filter(
            e=>
            JSON.stringify(e)
            .toLowerCase()
            .includes(text)
        ),



        missions:

        db.missions.filter(
            m=>
            JSON.stringify(m)
            .toLowerCase()
            .includes(text)
        ),



        rapports:

        db.rapports.filter(
            r=>
            JSON.stringify(r)
            .toLowerCase()
            .includes(text)
        )


    };


}



/==================================================
 STATISTIQUES BASE
===================================================*/

function databaseStats(){


    const db =
        getDatabase();



    return {


        entreprises:
        db.entreprises.length,


        missions:
        db.missions.length,


        rapports:
        db.rapports.length,


        inspecteurs:
        db.inspecteurs.length


    };


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initDatabase();


});
