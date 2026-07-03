/*==================================================
STATISTIQUES.JS
PARTIE 1
INITIALISATION
InspecteurBot RDC 2026
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initialiserStatistiques();

});

/*==================================================
INITIALISER LES STATISTIQUES
==================================================*/

function initialiserStatistiques() {

    verifierStockage();

    mettreAJourAffichage();

}

/*==================================================
CRÉER LE STOCKAGE SI INEXISTANT
==================================================*/

function verifierStockage() {

    if (localStorage.getItem("statArticles") === null) {

        localStorage.setItem("statArticles", "0");

    }

    if (localStorage.getItem("statRecherche") === null) {

        localStorage.setItem("statRecherche", "0");

    }

    if (localStorage.getItem("statFavoris") === null) {

        localStorage.setItem("statFavoris", "0");

    }

    if (localStorage.getItem("statIA") === null) {

        localStorage.setItem("statIA", "0");

    }

}

/*==================================================
AFFICHER LES STATISTIQUES
==================================================*/

function mettreAJourAffichage() {

    const article = document.getElementById("statArticles");
    const recherche = document.getElementById("statRecherche");
    const favoris = document.getElementById("statFavoris");
    const ia = document.getElementById("statIA");

    if (article) {

        article.textContent = localStorage.getItem("statArticles");

    }

    if (recherche) {

        recherche.textContent = localStorage.getItem("statRecherche");

    }

    if (favoris) {

        favoris.textContent = localStorage.getItem("statFavoris");

    }

    if (ia) {

        ia.textContent = localStorage.getItem("statIA");

    }

}

/*==================================================
STATISTIQUES.JS
PARTIE 2
INCRÉMENTATION DES COMPTEURS
InspecteurBot RDC 2026
==================================================*/

/*==================================================
UTILITAIRE : INCRÉMENTER UNE STATISTIQUE
==================================================*/

function incrementerStat(cle) {

    let valeur = parseInt(localStorage.getItem(cle) || "0");

    valeur++;

    localStorage.setItem(cle, valeur.toString());

    mettreAJourAffichage();

}

/*==================================================
ARTICLES CONSULTÉS
==================================================*/

function incrementerArticles() {

    incrementerStat("statArticles");

}

/*==================================================
RECHERCHES EFFECTUÉES
==================================================*/

function incrementerRecherche() {

    incrementerStat("statRecherche");

}

/*==================================================
FAVORIS AJOUTÉS
==================================================*/

function incrementerFavoris() {

    incrementerStat("statFavoris");

}

/*==================================================
UTILISATION IA
==================================================*/

function incrementerIA() {

    incrementerStat("statIA");

}

/*==================================================
RESET DES STATISTIQUES (OPTION ADMIN)
==================================================*/

function resetStatistiques() {

    localStorage.setItem("statArticles", "0");
    localStorage.setItem("statRecherche", "0");
    localStorage.setItem("statFavoris", "0");
    localStorage.setItem("statIA", "0");

    mettreAJourAffichage();

}

/*==================================================
EXPOSER LES FONCTIONS GLOBAL (IMPORTANT)
==================================================*/

window.incrementerArticles = incrementerArticles;
window.incrementerRecherche = incrementerRecherche;
window.incrementerFavoris = incrementerFavoris;
window.incrementerIA = incrementerIA;
window.resetStatistiques = resetStatistiques;

/*==================================================
STATISTIQUES.JS
PARTIE 3
LIAISON AUTOMATIQUE AVEC L'APPLICATION
InspecteurBot RDC 2026
==================================================*/

/*==================================================
AUTO : CONSULTATION D’ARTICLE
==================================================*/

function trackerArticleConsultation() {

    const btnLire = document.getElementById("btnArticleSuivant");
    const btnLirePrec = document.getElementById("btnArticlePrecedent");

    if (btnLire) {

        btnLire.addEventListener("click", () => {

            incrementerArticles();

        });

    }

    if (btnLirePrec) {

        btnLirePrec.addEventListener("click", () => {

            incrementerArticles();

        });

    }

}

/*==================================================
AUTO : RECHERCHE
==================================================*/

function trackerRecherche() {

    const btnRecherche = document.getElementById("btnRecherche");

    const input = document.getElementById("rechercheArticle");

    if (btnRecherche && input) {

        btnRecherche.addEventListener("click", () => {

            if (input.value.trim() !== "") {

                incrementerRecherche();

            }

        });

    }

    // Recherche vocale
    const btnMicro = document.getElementById("btnRechercheVocale");

    if (btnMicro) {

        btnMicro.addEventListener("click", () => {

            incrementerRecherche();

        });

    }

}

/*==================================================
AUTO : IA
==================================================*/

function trackerIA() {

    const btnIA = document.getElementById("btnQuestionIA");

    if (btnIA) {

        btnIA.addEventListener("click", () => {

            const textarea = document.getElementById("questionIA");

            if (textarea && textarea.value.trim() !== "") {

                incrementerIA();

            }

        });

    }

}

/*==================================================
AUTO : FAVORIS
==================================================*/

function trackerFavoris() {

    const btnFavArticle = document.getElementById("btnFavoriArticle");
    const btnFavGlobal = document.getElementById("btnFavori");

    if (btnFavArticle) {

        btnFavArticle.addEventListener("click", () => {

            incrementerFavoris();

        });

    }

    if (btnFavGlobal) {

        btnFavGlobal.addEventListener("click", () => {

            incrementerFavoris();

        });

    }

}

/*==================================================
INITIALISER LES TRACKERS
==================================================*/

function initialiserTrackers() {

    trackerArticleConsultation();
    trackerRecherche();
    trackerIA();
    trackerFavoris();

}

/*==================================================
DÉMARRAGE AUTOMATIQUE
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initialiserTrackers();

});

/*==================================================
STATISTIQUES.JS
PARTIE 4
OPTIMISATION FINALE + INTÉGRATION APP.JS
InspecteurBot RDC 2026
==================================================*/

/*==================================================
ÉVITER LES DOUBLES INITIALISATIONS
==================================================*/

let STAT_INIT = false;

/*==================================================
INITIALISATION UNIQUE SÉCURISÉE
==================================================*/

function initialiserStatApp() {

    if (STAT_INIT) return; // empêche double chargement
    STAT_INIT = true;

    console.log("Statistiques module actif ✔");

    verifierStockage();
    mettreAJourAffichage();
    initialiserTrackers();

}

/*==================================================
SYNC AVEC APP.JS (POINT CENTRAL)
==================================================*/

window.initStats = function () {

    initialiserStatApp();

};

/*==================================================
MISE À JOUR AUTOMATIQUE (OPTION LIVE)
==================================================*/

function activerSyncTempsReel() {

    setInterval(() => {

        mettreAJourAffichage();

    }, 5000); // refresh toutes les 5 secondes

}

/*==================================================
CACHE PROTECTION (évite lag mobile)
==================================================*/

function optimiserPerformanceStats() {

    // évite recalcul inutile sur DOM lourd

    const stats = [
        "statArticles",
        "statRecherche",
        "statFavoris",
        "statIA"
    ];

    stats.forEach(key => {

        const el = document.getElementById(key);

        if (el) {

            el.style.willChange = "auto";

        }

    });

}

/*==================================================
HOOK GLOBAL APP (INTÉGRATION PROPRE)
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initialiserStatApp();
    activerSyncTempsReel();
    optimiserPerformanceStats();

});
