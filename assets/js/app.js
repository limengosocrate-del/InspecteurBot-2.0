/**
 * app.js
 * Gestionnaire principal de l'application InspecteurBot RDC (Horloge, Météo, Thème, Navigation)
 */

window.InspecteurApp = {
    init: function() {
        this.initClock();
        this.initTheme();
        this.initBackToTop();
        this.initToolbarActions();
        
        console.log("InspecteurBot RDC — Système initialisé [Version 2026.1]");
    },

    // Horloge temps réel de Kinshasa / RDC (UTC+1)
    initClock: function() {
        const update = () => {
            const now = new Date();
            const clockEl = document.getElementById("clock");
            const dayEl = document.getElementById("day");
            const dateEl = document.getElementById("date");
            const tempEl = document.getElementById("temperature");

            if (clockEl) {
                clockEl.textContent = now.toLocaleTimeString("fr-FR", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
            }
            if (dayEl) {
                const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
                dayEl.textContent = days[now.getDay()];
            }
            if (dateEl) {
                dateEl.textContent = now.toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', year: 'numeric' });
            }
            if (tempEl && tempEl.textContent.includes("--")) {
                // Météo simulée Kinshasa / Lubumbashi / Matadi
                const temps = [28, 29, 30, 31, 32];
                const randTemp = temps[Math.floor(Math.random() * temps.length)];
                tempEl.textContent = `${randTemp}°C`;
            }
        };

        update();
        setInterval(update, 1000);
    },

    // Basculement de thème (Dark / Light / Cyber)
    initTheme: function() {
        const btn = document.getElementById("themeToggle");
        const icon = document.getElementById("themeIcon");
        const body = document.body;

        // Charger préférence locale
        const savedTheme = localStorage.getItem("inspecteur_theme") || "dark";
        if (savedTheme === "light") {
            body.classList.add("light-theme");
            if (icon) icon.textContent = "☀️";
        } else {
            body.classList.remove("light-theme");
            if (icon) icon.textContent = "🌙";
        }

        if (btn) {
            btn.addEventListener("click", () => {
                body.classList.toggle("light-theme");
                const isLight = body.classList.contains("light-theme");
                if (icon) icon.textContent = isLight ? "☀️" : "🌙";
                localStorage.setItem("inspecteur_theme", isLight ? "light" : "dark");
                if (window.InspecteurUtils) {
                    window.InspecteurUtils.showNotification(`Thème ${isLight ? "Clair (Jour)" : "Sombre (Nuit)"} activé`, "fa-circle-half-stroke");
                }
            });
        }
    },

    // Bouton retour en haut
    initBackToTop: function() {
        const btn = document.getElementById("btnTop");
        if (!btn) return;

        window.addEventListener("scroll", () => {
            if (window.scrollY > 400) {
                btn.classList.add("show");
            } else {
                btn.classList.remove("show");
            }
        });

        btn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    },

    // Actions rapides de la barre d'outils
    initToolbarActions: function() {
        const btnMicro = document.getElementById("btnMicro");
        const btnLecture = document.getElementById("btnLecture");
        const btnPartager = document.getElementById("btnPartager");
        const btnImprimer = document.getElementById("btnImprimer");
        const btnFavori = document.getElementById("btnFavori");
        const btnParametres = document.getElementById("btnParametres");

        if (btnMicro) {
            btnMicro.addEventListener("click", () => {
                const btnVocale = document.getElementById("btnRechercheVocale");
                if (btnVocale) btnVocale.click();
            });
        }

        if (btnLecture) {
            btnLecture.addEventListener("click", () => {
                const btnSpeak = document.getElementById("btnLectureArticle");
                if (btnSpeak) btnSpeak.click();
            });
        }

        if (btnPartager && window.ShareEngine) {
            btnPartager.addEventListener("click", () => window.ShareEngine.openShareModal());
        }

        if (btnImprimer && window.PrintEngine) {
            btnImprimer.addEventListener("click", () => window.PrintEngine.printCurrentPage());
        }

        if (btnFavori && window.FavorisEngine) {
            btnFavori.addEventListener("click", () => window.FavorisEngine.showFavoritesModal());
        }

        if (btnParametres) {
            btnParametres.addEventListener("click", () => {
                if (window.InspecteurUtils) {
                    window.InspecteurUtils.showNotification("Paramètres : Code du Travail RDC (Loi n° 16/010) - IGT 2026", "fa-gear");
                }
            });
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    window.InspecteurApp.init();
});
