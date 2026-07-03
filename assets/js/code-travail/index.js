"use strict";

/*==================================================
CORE GLOBAL — CODE DU TRAVAIL V3
==================================================*/

const CodeTravail = {

    articles: [],

    articleActuel: null,

    indexActuel: -1,

    categories: [],

    charge: false,

    pret: false,

    statistiques: {

        consultations: 0,
        recherches: 0,
        favoris: 0,
        ia: 0

    },

    events: new EventTarget()

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.CodeTravail = CodeTravail;


async function chargerCodeTravail() {

    try {

        const response = await fetch("assets/data/code-travail.json", {
            cache: "no-cache"
        });

        if (!response.ok) {
            throw new Error("Impossible de charger code-travail.json");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
            throw new Error("Format JSON invalide");
        }

        CodeTravail.articles = data;
        CodeTravail.charge = true;

        console.log("📚 Articles chargés :", data.length);

        CodeTravail.events.dispatchEvent(
            new CustomEvent("codeTravailCharge", {
                detail: { total: data.length }
            })
        );

    } catch (err) {

        console.error("❌ Erreur chargement :", err);

        CodeTravail.charge = false;

        CodeTravail.events.dispatchEvent(
            new CustomEvent("codeTravailErreur", {
                detail: err
            })
        );

    }

     }


CodeTravail.getTous = () => CodeTravail.articles;

CodeTravail.getParNumero = (num) =>
    CodeTravail.articles.find(a => a.numero === Number(num)) || null;

CodeTravail.getParId = (id) =>
    CodeTravail.articles.find(a => a.id === id) || null;

CodeTravail.getParIndex = (i) =>
    (i >= 0 && i < CodeTravail.articles.length)
        ? CodeTravail.articles[i]
        : null;

CodeTravail.selectionner = function (numero) {

    const index = CodeTravail.articles.findIndex(
        a => a.numero === Number(numero)
    );

    if (index === -1) return null;

    CodeTravail.indexActuel = index;
    CodeTravail.articleActuel = CodeTravail.articles[index];

    return CodeTravail.articleActuel;

};

CodeTravail.getArticleActuel = () => CodeTravail.articleActuel;

CodeTravail.estCharge = () => CodeTravail.charge;


CodeTravail.initialiserCategories = function () {

    const set = new Set();

    CodeTravail.articles.forEach(a => {
        if (a.categorie) set.add(a.categorie.trim());
    });

    CodeTravail.categories = [...set].sort();

};

CodeTravail.getCategories = () => CodeTravail.categories;

CodeTravail.getArticlesCategorie = (cat) =>
    CodeTravail.articles.filter(a => a.categorie === cat);

CodeTravail.compterCategorie = (cat) =>
    CodeTravail.getArticlesCategorie(cat).length;


CodeTravail.mettreAJourStatistiques = function () {

    const el = document.getElementById("statArticles");
    if (el) el.textContent = CodeTravail.articles.length;

};

CodeTravail.mettreAJourBadges = function () {

    const map = {
        "Dispositions générales": "badgeDispositions",
        "Contrat de travail": "badgeContrat",
        "Salaire": "badgeSalaire",
        "Temps de travail": "badgeTemps",
        "Congés": "badgeConges",
        "Santé et sécurité": "badgeSecurite",
        "Inspection du Travail": "badgeInspection",
        "Infractions et sanctions": "badgeSanctions"
    };

    Object.entries(map).forEach(([cat, id]) => {

        const el = document.getElementById(id);
        if (!el) return;

        el.textContent =
            CodeTravail.compterCategorie(cat) +
            " article(s)";

    });

};


async function initialiserCodeTravail() {

    await chargerCodeTravail();

    if (!CodeTravail.estCharge()) return;

    CodeTravail.initialiserCategories();
    CodeTravail.mettreAJourBadges();

    if (CodeTravail.articles.length > 0) {

        CodeTravail.indexActuel = 0;
        CodeTravail.articleActuel = CodeTravail.articles[0];

    }

    CodeTravail.pret = true;

    CodeTravail.events.dispatchEvent(
        new CustomEvent("codeTravailPret", {
            detail: {
                total: CodeTravail.articles.length,
                categories: CodeTravail.categories.length
            }
        })
    );

}


CodeTravail.articlePrecedent = function () {

    if (this.indexActuel <= 0) return null;

    this.indexActuel--;
    this.articleActuel = this.articles[this.indexActuel];

    return this.articleActuel;

};

CodeTravail.articleSuivant = function () {

    if (this.indexActuel >= this.articles.length - 1) return null;

    this.indexActuel++;
    this.articleActuel = this.articles[this.indexActuel];

    return this.articleActuel;

};

CodeTravail.rechercher = function (text) {

    if (!text) return [];

    text = text.toLowerCase();

    return this.articles.filter(a => {

        return (
            String(a.numero).includes(text) ||
            (a.titre || "").toLowerCase().includes(text) ||
            (a.contenu || "").toLowerCase().includes(text) ||
            (a.categorie || "").toLowerCase().includes(text)
        );

    });

};

CodeTravail.existe = (num) =>
    CodeTravail.articles.some(a => a.numero === Number(num));

CodeTravail.totalArticles = () => CodeTravail.articles.length;


function masquerChargement() {

    const el = document.getElementById("loadingScreen");
    if (!el) return;

    el.style.opacity = "0";

    setTimeout(() => {
        el.style.display = "none";
    }, 400);

}

function afficherErreur() {

    const el = document.getElementById("contenuArticle");
    if (!el) return;

    el.innerHTML = `
        <h3>❌ Erreur de chargement</h3>
        <p>Impossible de charger le Code du Travail.</p>
    `;

}


function initialiserModules() {

    if (window.Consultation) Consultation.initialiser?.();
    if (window.Recherche) Recherche.initialiser?.();
    if (window.Navigation) Navigation.initialiser?.();
    if (window.Categories) Categories.initialiser?.();
    if (window.AssistantIA) AssistantIA.initialiser?.();

}

function afficherPremierArticle() {

    if (!CodeTravail.articles.length) return;

    CodeTravail.indexActuel = 0;
    CodeTravail.articleActuel = CodeTravail.articles[0];

    if (window.Consultation) {
        Consultation.afficherArticle(CodeTravail.articleActuel, 0);
    }

}

async function demarrerApplication() {

    console.log("🚀 Démarrage V3...");

    await initialiserCodeTravail();

    if (!CodeTravail.estCharge()) return;

    initialiserModules();
    afficherPremierArticle();

    console.log("✅ Application prête");

}


document.addEventListener("DOMContentLoaded", async () => {

    await demarrerApplication();

});

CodeTravail.recharger = async function () {

    this.articles = [];
    this.articleActuel = null;
    this.indexActuel = -1;
    this.charge = false;

    await demarrerApplication();

};

/* EXPORT */
window.demarrerApplication = demarrerApplication;
window.initialiserCodeTravail = initialiserCodeTravail;

/* FREEZE SAFE */
Object.freeze(CodeTravail);
