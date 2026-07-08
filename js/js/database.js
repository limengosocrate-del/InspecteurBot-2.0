"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 database.js
 Gestion du stockage local
===================================================*/

const Storage = {

    /*==============================================
     ENREGISTRER
    ==============================================*/

    save(key, value) {

        try {

            localStorage.setItem(

                key,

                JSON.stringify(value)

            );

        }

        catch (e) {

            console.error(e);

        }

    },

    /*==============================================
     LIRE
    ==============================================*/

    get(key) {

        try {

            const value =

                localStorage.getItem(key);

            return value ?

                JSON.parse(value)

                : null;

        }

        catch (e) {

            console.error(e);

            return null;

        }

    },

    /*==============================================
     SUPPRIMER
    ==============================================*/

    remove(key) {

        localStorage.removeItem(key);

    },

    /*==============================================
     TOUT EFFACER
    ==============================================*/

    clear() {

        localStorage.clear();

    }

};

/*==================================================
 BASE DE DONNÉES SIMPLE
===================================================*/

const Database = {

    missions: [],

    historiques: [],

    statistiques: {}

};

/*==================================================
 ACCÈS GLOBAL
===================================================*/

window.Storage = Storage;
window.Database = Database;
