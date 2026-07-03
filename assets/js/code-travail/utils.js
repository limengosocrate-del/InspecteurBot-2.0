"use strict";

/*==================================================
OBJET UTILITAIRES
==================================================*/

const Utils = {

    version: "1.0.0",

    debug: true

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.Utils = Utils;

/*==================================================
LOGS SÉCURISÉS
==================================================*/

Utils.log = function (...args) {

    if (!this.debug) return;

    console.log("[InspecteurBot]", ...args);

};

/*==================================================
LOG ERREUR
==================================================*/

Utils.error = function (...args) {

    console.error("[InspecteurBot ERROR]", ...args);

};

/*==================================================
OBTENIR UN ÉLÉMENT
==================================================*/

Utils.el = function (id) {

    return document.getElementById(id) || null;

};

/*==================================================
OBTENIR PLUSIEURS ÉLÉMENTS
==================================================*/

Utils.els = function (selector) {

    return document.querySelectorAll(selector);

};

/*==================================================
CRÉER UN ÉLÉMENT
==================================================*/

Utils.create = function (tag, className, html) {

    const el = document.createElement(tag);

    if (className) el.className = className;

    if (html) el.innerHTML = html;

    return el;

};

/*==================================================
CAPITALISER
==================================================*/

Utils.capitalize = function (text) {

    if (!text) return "";

    return text.charAt(0).toUpperCase() +
           text.slice(1);

};

/*==================================================
NETTOYER TEXTE
==================================================*/

Utils.cleanText = function (text) {

    if (!text) return "";

    return text
        .toString()
        .replace(/\s+/g, " ")
        .trim();

};

/*==================================================
FORMAT DATE
==================================================*/

Utils.formatDate = function (date = new Date()) {

    return date.toLocaleDateString("fr-FR");

};

/*==================================================
FORMAT HEURE
==================================================*/

Utils.formatTime = function (date = new Date()) {

    return date.toLocaleTimeString("fr-FR");

};

/*==================================================
DATE + HEURE COMPLÈTE
==================================================*/

Utils.now = function () {

    const d = new Date();

    return {

        date: this.formatDate(d),

        time: this.formatTime(d)

    };

};

/*==================================================
EST NUMÉRIQUE
==================================================*/

Utils.isNumber = function (value) {

    return !isNaN(value) && value !== null;

};

/*==================================================
EST CHAÎNE NON VIDE
==================================================*/

Utils.isText = function (value) {

    return typeof value === "string" &&
           value.trim().length > 0;

};

/*==================================================
AFFICHER NOTIFICATION
==================================================*/

Utils.notify = function (message, type = "success") {

    const box =
        document.getElementById("notification");

    const text =
        document.getElementById("notificationText");

    if (!box || !text) return;

    text.textContent = message;

    box.className =
        "notification " + type;

    box.style.display = "flex";

    setTimeout(() => {

        box.style.display = "none";

    }, 3000);

};

/*==================================================
SAUVEGARDER
==================================================*/

Utils.save = function (key, value) {

    try {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );

    } catch (e) {

        this.error("Erreur save:", e);

    }

};

/*==================================================
CHARGER
==================================================*/

Utils.load = function (key) {

    try {

        const data =
            localStorage.getItem(key);

        return data ?
            JSON.parse(data) :
            null;

    } catch (e) {

        this.error("Erreur load:", e);

        return null;

    }

};

/*==================================================
SCROLL TOP
==================================================*/

Utils.scrollTop = function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

};

/*==================================================
TOGGLE CLASS
==================================================*/

Utils.toggleClass = function (el, className) {

    if (!el) return;

    el.classList.toggle(className);

};

/*==================================================
ESCAPE HTML
==================================================*/

Utils.escapeHTML = function (str) {

    if (!str) return "";

    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

};

/*==================================================
VERROU GLOBAL (ANTI DOUBLE ACTION)
==================================================*/

Utils.lock = false;

Utils.withLock = function (callback, delay = 300) {

    if (this.lock) return;

    this.lock = true;

    callback();

    setTimeout(() => {

        this.lock = false;

    }, delay);

};

