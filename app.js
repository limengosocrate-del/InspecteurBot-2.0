/*====================================================
            INSPECTEURBOT IA
                 APP.JS v1.1
====================================================*/

/*=====================================
      LOADER
=====================================*/
function hideLoader() {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.transition = "opacity 0.8s";
        loader.style.opacity = "0";

        setTimeout(() => {
            loader.style.display = "none";
        }, 800);

    }, 1800);
}

/*=====================================
      COMPTEURS ANIMÉS
=====================================*/
function animateCounter(id, endValue) {

    const element = document.getElementById(id);

    if (!element) return;

    let start = 0;
    const duration = 2000;
    const increment = endValue / 100;

    const timer = setInterval(() => {

        start += increment;

        if (start >= endValue) {

            start = endValue;
            clearInterval(timer);

        }

        element.textContent = Math.floor(start);

    }, duration / 100);
}

/*=====================================
      MESSAGES MOTIVATION
=====================================*/
const motivationMessages = [

    "Bienvenue Inspecteur 👋",
    "La loi protège le travailleur.",
    "Chaque inspection améliore le monde du travail.",
    "L'intégrité est la force de l'Inspecteur.",
    "Votre mission contribue à une société plus juste.",
    "Soyez rigoureux, juste et impartial.",
    "Le respect du Code du Travail protège tous les citoyens.",
    "Chaque contrôle est une opportunité d'amélioration.",
    "La sécurité des travailleurs est une priorité.",
    "Bonne mission Inspecteur."

];

function changeNotification() {

    const notification =
        document.getElementById("notification-text");

    if (!notification) return;

    const index =
        Math.floor(Math.random() * motivationMessages.length);

    notification.textContent =
        motivationMessages[index];
}

/*=====================================
      HORLOGE
=====================================*/
function updateClock() {

    const clock =
        document.getElementById("clock");

    if (!clock) return;

    clock.textContent =
        new Date().toLocaleTimeString("fr-FR");
}

/*=====================================
      CHART.JS
=====================================*/
function initCharts() {

    if (typeof Chart === "undefined") {
        console.warn("Chart.js non chargé");
        return;
    }

    const inspectionCanvas =
        document.getElementById("inspectionChart");

    if (inspectionCanvas) {

        new Chart(inspectionCanvas, {

            type: "bar",

            data: {

                labels: [
                    "Jan",
                    "Fév",
                    "Mar",
                    "Avr",
                    "Mai",
                    "Juin"
                ],

                datasets: [{

                    label: "Inspections",

                    data: [
                        21,
                        34,
                        27,
                        48,
                        39,
                        52
                    ],

                    backgroundColor: "#005baa"

                }]

            },

            options: {

                responsive: true,

                plugins: {
                    legend: {
                        display: false
                    }
                }

            }

        });
    }

    const pvCanvas =
        document.getElementById("pvChart");

    if (pvCanvas) {

        new Chart(pvCanvas, {

            type: "doughnut",

            data: {

                labels: [
                    "PV établis",
                    "Dossiers ouverts",
                    "En attente"
                ],

                datasets: [{

                    data: [91, 38, 17],

                    backgroundColor: [
                        "#005baa",
                        "#2e7d32",
                        "#ff9800"
                    ]

                }]

            },

            options: {
                responsive: true
            }

        });
    }
}

/*=====================================
      IA FLOTTANTE
=====================================*/
function initFloatingAI() {

    const floatingAI =
        document.getElementById("floatingAI");

    if (!floatingAI) return;

    floatingAI.addEventListener("click", () => {

        alert(
            "🤖 InspecteurBot IA\n\nCette fonctionnalité sera reliée au Code du Travail et à l'IA."
        );

    });
}

/*=====================================
      MESSAGE IA
=====================================*/
const smartMessages = [

    "💡 Pensez à vérifier les contrats de travail.",
    "📚 Consultez toujours les articles du Code du Travail.",
    "⚖️ Une bonne inspection repose sur des preuves.",
    "👷 La sécurité des travailleurs reste prioritaire.",
    "📄 Vérifiez les registres obligatoires.",
    "🛡️ Respectez la procédure avant toute sanction.",
    "🤖 InspecteurBot IA est prêt à vous assister."

];

function rotateSmartMessage() {

    const element =
        document.getElementById("smartMessage");

    if (!element) return;

    const random =
        Math.floor(Math.random() * smartMessages.length);

    element.textContent =
        smartMessages[random];
}

/*=====================================
      ANIMATION CARTES
=====================================*/
function initCards() {

    const cards = document.querySelectorAll(
        ".card,.menu-card,.news-card,.inf-card,.stat-card"
    );

    cards.forEach(card => {

        card.style.transition = "0.3s";

        card.addEventListener("mouseenter", () => {

            card.style.transform =
                "translateY(-8px)";

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform =
                "translateY(0)";

        });

    });
}

/*=====================================
      CODE DU TRAVAIL
=====================================*/
let codeTravail = [];
let articlesCode = [];

async function chargerCodeTravail() {

    console.log(
        "Chargement du Code du Travail..."
    );

}

function rechercherArticle(motCle) {

    if (!motCle) return [];

    motCle = motCle.toLowerCase();

    return articlesCode.filter(article =>
        article.texte.toLowerCase().includes(motCle)
    );
}

function rechercherNumero(numero) {

    return articlesCode.find(article =>
        article.numero == numero
    );
}

async function poserQuestionIA(question) {

    if (!question) return [];

    const resultat =
        rechercherArticle(question);

    if (resultat.length > 0) {

        console.log(resultat);
        return resultat;

    }

    console.log("Aucun article trouvé.");
    return [];
}

/*=====================================
      BOUTONS
=====================================*/
function initButtons() {

    document
        .querySelectorAll("button")
        .forEach(btn => {

            btn.addEventListener("click", () => {

                console.log(
                    "Bouton :",
                    btn.innerText
                );

            });

        });

}

/*=====================================
      MODE SOMBRE
=====================================*/
function changerTheme() {

    document.body.classList.toggle("dark");

}

/*=====================================
      INITIALISATION
=====================================*/
window.addEventListener("load", () => {

    hideLoader();

    animateCounter("inspectionCount", 248);
    animateCounter("pvCount", 91);
    animateCounter("companyCount", 164);
    animateCounter("infractionCount", 56);

    changeNotification();
    setInterval(changeNotification, 7000);

    updateClock();
    setInterval(updateClock, 1000);

    rotateSmartMessage();
    setInterval(rotateSmartMessage, 6000);

    initCharts();
    initFloatingAI();
    initCards();
    initButtons();

    console.log("InspecteurBot IA démarré.");
    console.log("Application prête.");
    console.log("En attente du Code du Travail PDF.");

});
