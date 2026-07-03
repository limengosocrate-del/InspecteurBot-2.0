/*=================================================
 INSPECTEURBOT RDC
 search.js
 VERSION 1.0
 MOTEUR DE RECHERCHE PRINCIPAL
==================================================*/

"use strict";

/*==================================================
OBJET RECHERCHE
==================================================*/

const Recherche = {

    initialisee: false,

    dernierTexte: "",

    resultats: [],

    debounceTimer: null

};

/*==================================================
EXPORT GLOBAL
==================================================*/

window.Recherche = Recherche; 

/*==================================================
INITIALISATION
==================================================*/

Recherche.initialiser = function () {

    if (this.initialisee) return;

    this.initialisee = true;

    console.log("Module Recherche initialisé.");

    this.initialiserEvenements();
};

/*==================================================
INITIALISER LES ÉVÉNEMENTS
==================================================*/

Recherche.initialiserEvenements = function () {

    const input =
        document.getElementById("rechercheArticle");

    const btn =
        document.getElementById("btnRecherche");

    const btnEffacer =
        document.getElementById("btnEffacerRecherche");

    const btnVocal =
        document.getElementById("btnRechercheVocale");

    const suggestions =
        document.getElementById("suggestionsRapides");

    /*------------------------------
    SAISIE TEXTE (DEBOUNCE)
    ------------------------------*/

    if (input) {

        input.addEventListener("input", (e) => {

            const texte = e.target.value;

            clearTimeout(this.debounceTimer);

            this.debounceTimer = setTimeout(() => {

                this.effectuerRecherche(texte);

            }, 300);

        });

        /* ENTER = RECHERCHE DIRECTE */
        input.addEventListener("keydown", (e) => {

            if (e.key === "Enter") {

                this.effectuerRecherche(input.value);

            }

        });
    }

    /*------------------------------
    BOUTON RECHERCHE
    ------------------------------*/

    if (btn) {

        btn.addEventListener("click", () => {

            if (input) {
                this.effectuerRecherche(input.value);
            }

        });

    }

    /*------------------------------
    BOUTON EFFACER
    ------------------------------*/

    if (btnEffacer) {

        btnEffacer.addEventListener("click", () => {

            if (input) input.value = "";

            this.afficherResultats([]);

        });

    }

    /*------------------------------
    RECHERCHE VOCALE (HOOK)
    ------------------------------*/

    if (btnVocal) {

        btnVocal.addEventListener("click", () => {

            if (window.Speech && Speech.ecouter) {

                Speech.ecouter((texte) => {

                    if (input) input.value = texte;

                    this.effectuerRecherche(texte);

                });

            }

        });

    }

    /*------------------------------
    SUGGESTIONS RAPIDES
    ------------------------------*/

    if (suggestions) {

        suggestions.addEventListener("click", (e) => {

            const btn = e.target.closest("button");

            if (!btn) return;

            const query =
                btn.getAttribute("data-search") ||
                btn.getAttribute("data-article");

            if (!query) return;

            if (input) input.value = query;

            this.effectuerRecherche(query);

        });

    }

};

/*==================================================
RECHERCHE PRINCIPALE
==================================================*/

Recherche.effectuerRecherche = function (texte) {

    if (!texte || !window.CodeTravail) return;

    texte = texte.trim();

    if (texte === this.dernierTexte) return;

    this.dernierTexte = texte;

    // Mise à jour stats
    if (CodeTravail.statistiques) {
        CodeTravail.statistiques.recherches++;
    }

    const resultats =
        CodeTravail.rechercher(texte);

    this.resultats = resultats;

    this.afficherResultats(resultats);

    this.mettreAJourInfo(resultats, texte);

    return resultats;
};

/*==================================================
AFFICHER LES RÉSULTATS
==================================================*/

Recherche.afficherResultats = function (resultats) {

    const container =
        document.getElementById("resultatsRecherche");

    if (!container) return;

    container.innerHTML = "";

    if (!resultats || resultats.length === 0) {

        container.innerHTML = `
            <div class="no-results">
                Aucun résultat trouvé.
            </div>
        `;

        return;
    }

    resultats.forEach(article => {

        const div =
            document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `
            <h3>Article ${article.numero}</h3>
            <p>${article.titre || ""}</p>
            <span>${article.categorie || ""}</span>
        `;

        div.addEventListener("click", () => {

            if (window.Consultation) {

                Consultation.afficherArticle(article);

            }

        });

        container.appendChild(div);

    });

};

/*==================================================
METTRE À JOUR INFOS
==================================================*/

Recherche.mettreAJourInfo = function (resultats, texte) {

    const infoRecherche =
        document.getElementById("infoRecherche");

    const infoResultats =
        document.getElementById("infoResultats");

    if (infoRecherche) {
        infoRecherche.textContent = texte;
    }

    if (infoResultats) {
        infoResultats.textContent = resultats.length;
    }

};

/*==================================================
VIDER RECHERCHE
==================================================*/

Recherche.vider = function () {

    this.resultats = [];
    this.dernierTexte = "";

    const input =
        document.getElementById("rechercheArticle");

    if (input) input.value = "";

    this.afficherResultats([]);

};

/*==================================================
OBTENIR DERNIERS RÉSULTATS
==================================================*/

Recherche.getResultats = function () {
    return this.resultats;
};

/*==================================================
AUTO INIT
==================================================*/

document.addEventListener("codeTravailCharge", () => {

    Recherche.initialiser();

});

 
