"use strict";

/*==================================================
 UTILS.JS
 InspecteurBot RDC
==================================================*/

const Utils = {};

window.Utils = Utils;

/*=========================================
 Notification
=========================================*/

Utils.notification = function (message) {

    const box = document.getElementById("notification");
    const texte = document.getElementById("notificationText");

    if (!box || !texte) return;

    texte.textContent = message;

    box.classList.add("show");

    setTimeout(() => {

        box.classList.remove("show");

    }, 3000);

};

/*=========================================
 Copier le texte
=========================================*/

Utils.copierArticle = function () {

    const numero =
        document.getElementById("numeroArticle").textContent;

    const titre =
        document.getElementById("titreArticle").textContent;

    const contenu =
        document.getElementById("contenuArticle").textContent;

    const texte =

        numero + "\n\n" +

        titre + "\n\n" +

        contenu;

    navigator.clipboard.writeText(texte);

    Utils.notification("Article copié.");

};

/*=========================================
 Partager
=========================================*/

Utils.partagerArticle = function () {

    const numero =
        document.getElementById("numeroArticle").textContent;

    const titre =
        document.getElementById("titreArticle").textContent;

    const contenu =
        document.getElementById("contenuArticle").textContent;

    const texte =

        numero + "\n\n" +

        titre + "\n\n" +

        contenu;

    if (navigator.share) {

        navigator.share({

            title: titre,

            text: texte

        });

    } else {

        navigator.clipboard.writeText(texte);

        Utils.notification("Article copié.");

    }

};

/*=========================================
 Impression
=========================================*/

Utils.imprimerArticle = function () {

    window.print();

};

/*=========================================
 Lecture vocale
=========================================*/

Utils.lireArticle = function () {

    if (!window.speechSynthesis) return;

    speechSynthesis.cancel();

    const texte =

        document.getElementById("titreArticle").textContent +

        ". " +

        document.getElementById("contenuArticle").textContent;

    const lecture = new SpeechSynthesisUtterance(texte);

    lecture.lang = "fr-FR";

    speechSynthesis.speak(lecture);

};

/*=========================================
 Favoris
=========================================*/

Utils.favori = function () {

    const numero =
        document.getElementById("numeroArticle").textContent;

    let favoris =

        JSON.parse(localStorage.getItem("favoris") || "[]");

    if (!favoris.includes(numero)) {

        favoris.push(numero);

        localStorage.setItem(

            "favoris",

            JSON.stringify(favoris)

        );

        Utils.notification("Ajouté aux favoris.");

    } else {

        Utils.notification("Déjà enregistré.");

    }

};

/*=========================================
 Bouton retour en haut
=========================================*/

Utils.retourHaut = function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};

/*=========================================
 Écran de chargement
=========================================*/

Utils.loading = function () {

    const ecran =
        document.getElementById("loadingScreen");

    if (!ecran) return;

    setTimeout(() => {

        ecran.style.display = "none";

    }, 1200);

};

/*=========================================
 Initialisation
=========================================*/

Utils.initialiser = function () {

    const copier =
        document.getElementById("btnCopierArticle");

    const partager =
        document.getElementById("btnPartagerArticle");

    const imprimer =
        document.getElementById("btnImprimerArticle");

    const lecture =
        document.getElementById("btnLectureArticle");

    const favori =
        document.getElementById("btnFavoriArticle");

    const top =
        document.getElementById("btnTop");

    if (copier)
        copier.onclick = Utils.copierArticle;

    if (partager)
        partager.onclick = Utils.partagerArticle;

    if (imprimer)
        imprimer.onclick = Utils.imprimerArticle;

    if (lecture)
        lecture.onclick = Utils.lireArticle;

    if (favori)
        favori.onclick = Utils.favori;

    if (top)
        top.onclick = Utils.retourHaut;

    Utils.loading();

};

/*=========================================
 Chargement
=========================================*/

document.addEventListener(

    "DOMContentLoaded",

    function () {

        Utils.initialiser();

    }

);
