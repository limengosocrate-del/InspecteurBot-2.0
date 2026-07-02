/*=================================================
 INSPECTEURBOT RDC
 CODE DU TRAVAIL
 utils.js
 VERSION 1.0
==================================================*/

"use strict";

/*=================================================
 ESPACE DE NOMS
==================================================*/

window.CodeTravail = window.CodeTravail || {};
window.CodeTravail.Utils = {};

/*=================================================
 RACCOURCIS DOM
==================================================*/

const $ = (selector) => document.querySelector(selector);

const $$ = (selector) => document.querySelectorAll(selector);

/*=================================================
 NOTIFICATION
==================================================*/

function afficherNotification(message, type = "success") {

    const notification = $("#notification");
    const texte = $("#notificationText");

    if (!notification || !texte) return;

    texte.textContent = message;

    notification.classList.remove(
        "success",
        "error",
        "warning",
        "show"
    );

    notification.classList.add(type);

    setTimeout(() => {

        notification.classList.add("show");

    }, 50);

    setTimeout(() => {

        notification.classList.remove("show");

    }, 3000);

}

/*=================================================
 COPIER TEXTE
==================================================*/

async function copierTexte(texte) {

    try {

        await navigator.clipboard.writeText(texte);

        afficherNotification(
            "Texte copié avec succès."
        );

        return true;

    } catch (e) {

        console.error(e);

        afficherNotification(
            "Impossible de copier.",
            "error"
        );

        return false;

    }

}

/*=================================================
 COPIER ARTICLE ACTUEL
==================================================*/

function copierArticle() {

    const numero =
        $("#numeroArticle")?.textContent || "";

    const titre =
        $("#titreArticle")?.textContent || "";

    const contenu =
        $("#contenuArticle")?.textContent || "";

    const sanction =
        $("#sanctionArticle")?.textContent || "";

    const texte =
`${numero}

${titre}

${contenu}

${sanction}`;

    copierTexte(texte);

}

/*=================================================
 LOCAL STORAGE
==================================================*/

function sauvegarder(cle, valeur) {

    try {

        localStorage.setItem(
            cle,
            JSON.stringify(valeur)
        );

    } catch (e) {

        console.error(e);

    }

}

function charger(cle, defaut = null) {

    try {

        const valeur =
            localStorage.getItem(cle);

        if (!valeur)
            return defaut;

        return JSON.parse(valeur);

    } catch {

        return defaut;

    }

}

function supprimer(cle) {

    localStorage.removeItem(cle);

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Utils.afficherNotification =
    afficherNotification;

window.CodeTravail.Utils.copierTexte =
    copierTexte;

window.CodeTravail.Utils.copierArticle =
    copierArticle;

window.CodeTravail.Utils.sauvegarder =
    sauvegarder;

window.CodeTravail.Utils.charger =
    charger;

window.CodeTravail.Utils.supprimer =
    supprimer;

/*=================================================
 PARTIE 2
 PARTAGE - IMPRESSION - LECTURE
==================================================*/

/*=================================================
 PARTAGER UN TEXTE
==================================================*/

async function partagerTexte(titre, texte) {

    try {

        if (navigator.share) {

            await navigator.share({
                title: titre,
                text: texte
            });

            afficherNotification(
                "Article partagé avec succès."
            );

            return;

        }

        await copierTexte(texte);

        afficherNotification(
            "Le partage n'est pas disponible.\nLe texte a été copié."
        );

    }

    catch (e) {

        console.error(e);

        afficherNotification(
            "Le partage a échoué.",
            "error"
        );

    }

}

/*=================================================
 PARTAGER L'ARTICLE ACTUEL
==================================================*/

function partagerArticle() {

    const numero =
        $("#numeroArticle")?.textContent || "";

    const titre =
        $("#titreArticle")?.textContent || "";

    const contenu =
        $("#contenuArticle")?.textContent || "";

    partagerTexte(

        numero,

`${numero}

${titre}

${contenu}`

    );

}

/*=================================================
 IMPRESSION
==================================================*/

function imprimerArticle() {

    window.print();

}

/*=================================================
 SCROLL AUTOMATIQUE
==================================================*/

function allerVers(element) {

    if (!element) return;

    element.scrollIntoView({

        behavior: "smooth",

        block: "start"

    });

}

/*=================================================
 LECTURE VOCALE
==================================================*/

function lireTexte(texte) {

    if (!("speechSynthesis" in window))
        return;

    speechSynthesis.cancel();

    const voix =
        new SpeechSynthesisUtterance(texte);

    voix.lang = "fr-FR";

    voix.rate = 1;

    voix.pitch = 1;

    speechSynthesis.speak(voix);

}

function lireArticle() {

    const texte =

        $("#numeroArticle")?.textContent + ". " +

        $("#titreArticle")?.textContent + ". " +

        $("#contenuArticle")?.textContent;

    lireTexte(texte);

}

/*=================================================
 FORMATAGE TEXTE
==================================================*/

function nettoyerTexte(texte = "") {

    return texte

        .replace(/\s+/g, " ")

        .replace(/\n{2,}/g, "\n")

        .trim();

}

function mettreEnMajusculePremiereLettre(texte = "") {

    if (!texte.length)
        return texte;

    return texte.charAt(0).toUpperCase() +
           texte.slice(1);

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Utils.partagerTexte =
    partagerTexte;

window.CodeTravail.Utils.partagerArticle =
    partagerArticle;

window.CodeTravail.Utils.imprimerArticle =
    imprimerArticle;

window.CodeTravail.Utils.allerVers =
    allerVers;

window.CodeTravail.Utils.lireTexte =
    lireTexte;

window.CodeTravail.Utils.lireArticle =
    lireArticle;

window.CodeTravail.Utils.nettoyerTexte =
    nettoyerTexte;

window.CodeTravail.Utils.mettreEnMajusculePremiereLettre =
    mettreEnMajusculePremiereLettre;

/*=================================================
 PARTIE 3
 UTILITAIRES AVANCÉS
==================================================*/

/*=================================================
 FORMATAGE DE DATE
==================================================*/

function formaterDate(date = new Date()) {

    return date.toLocaleDateString("fr-FR", {

        day: "2-digit",
        month: "2-digit",
        year: "numeric"

    });

}

function formaterHeure(date = new Date()) {

    return date.toLocaleTimeString("fr-FR");

}

/*=================================================
 IDENTIFIANT UNIQUE
==================================================*/

function genererID(prefixe = "id") {

    return `${prefixe}_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

}

/*=================================================
 DÉLAI (DEBOUNCE)
==================================================*/

function debounce(callback, delai = 300) {

    let timer;

    return function (...args) {

        clearTimeout(timer);

        timer = setTimeout(() => {

            callback.apply(this, args);

        }, delai);

    };

}

/*=================================================
 LIMITATION (THROTTLE)
==================================================*/

function throttle(callback, delai = 300) {

    let attente = false;

    return function (...args) {

        if (attente) return;

        callback.apply(this, args);

        attente = true;

        setTimeout(() => {

            attente = false;

        }, delai);

    };

}

/*=================================================
 VÉRIFICATION D'ÉLÉMENT
==================================================*/

function existe(selecteur) {

    return document.querySelector(selecteur) !== null;

}

/*=================================================
 RACCOURCI AJOUT D'ÉVÉNEMENT
==================================================*/

function evenement(selecteur, type, callback) {

    const element = document.querySelector(selecteur);

    if (!element) return;

    element.addEventListener(type, callback);

}

/*=================================================
 TÉLÉCHARGER UN FICHIER TEXTE
==================================================*/

function telechargerTexte(nom, contenu) {

    const blob = new Blob(

        [contenu],

        { type: "text/plain;charset=utf-8" }

    );

    const url = URL.createObjectURL(blob);

    const lien = document.createElement("a");

    lien.href = url;

    lien.download = nom;

    document.body.appendChild(lien);

    lien.click();

    document.body.removeChild(lien);

    URL.revokeObjectURL(url);

}

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Utils.formaterDate =
    formaterDate;

window.CodeTravail.Utils.formaterHeure =
    formaterHeure;

window.CodeTravail.Utils.genererID =
    genererID;

window.CodeTravail.Utils.debounce =
    debounce;

window.CodeTravail.Utils.throttle =
    throttle;

window.CodeTravail.Utils.existe =
    existe;

window.CodeTravail.Utils.evenement =
    evenement;

window.CodeTravail.Utils.telechargerTexte =
    telechargerTexte;

/*=================================================
 PARTIE 4
 INITIALISATION ET ÉVÉNEMENTS
 VERSION FINALE
==================================================*/

/*=================================================
 INITIALISER LES UTILITAIRES
==================================================*/

function initialiserUtils() {

    /*==============================
      Copier l'article
    ==============================*/

    evenement(
        "#btnCopierArticle",
        "click",
        copierArticle
    );

    /*==============================
      Partager
    ==============================*/

    evenement(
        "#btnPartagerArticle",
        "click",
        partagerArticle
    );

    /*==============================
      Imprimer
    ==============================*/

    evenement(
        "#btnImprimerArticle",
        "click",
        imprimerArticle
    );

    /*==============================
      Lecture vocale
    ==============================*/

    evenement(
        "#btnLectureArticle",
        "click",
        lireArticle
    );

}

/*=================================================
 OBTENIR L'ARTICLE ACTUEL
==================================================*/

function articleActuel() {

    return {

        numero:
            $("#numeroArticle")?.textContent || "",

        titre:
            $("#titreArticle")?.textContent || "",

        categorie:
            $("#categorieArticle")?.textContent || "",

        contenu:
            $("#contenuArticle")?.textContent || "",

        sanction:
            $("#sanctionArticle")?.textContent || ""

    };

}

/*=================================================
 VIDER LA CONSULTATION
==================================================*/

function viderConsultation() {

    $("#numeroArticle").textContent =
        "Article —";

    $("#titreArticle").textContent =
        "Aucun article sélectionné";

    $("#categorieArticle").textContent =
        "Catégorie";

    $("#contenuArticle").textContent =
        "Sélectionnez un article pour commencer.";

    $("#sanctionArticle").textContent = "";

    $("#questionsIA").innerHTML = "";

}

/*=================================================
 VERSION
==================================================*/

window.CodeTravail.Utils.version =
    "1.0.0";

/*=================================================
 EXPORT
==================================================*/

window.CodeTravail.Utils.initialiser =
    initialiserUtils;

window.CodeTravail.Utils.articleActuel =
    articleActuel;

window.CodeTravail.Utils.viderConsultation =
    viderConsultation;

/*=================================================
 DÉMARRAGE AUTOMATIQUE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        initialiserUtils();

        console.log(

            "✅ utils.js chargé avec succès."

        );

    }

);

/*=================================================
 FIN DU FICHIER
==================================================*/
