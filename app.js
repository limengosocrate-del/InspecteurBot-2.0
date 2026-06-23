/*=========================================
      INSPECTEURBOT RDC
      dashboard.js v2.0
==========================================*/

/*=========================================
      DATE ET HEURE EN TEMPS RÉEL
==========================================*/

function updateDateTime() {

    const dateElement =
        document.getElementById("dateActuelle");

    if (!dateElement) return;

    const now = new Date();

    dateElement.innerHTML =
        now.toLocaleString("fr-FR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });
}

updateDateTime();
setInterval(updateDateTime, 1000);

/*=========================================
      ANIMATION DES CHIFFRES
==========================================*/

function animateNumbers() {

    const numbers =
        document.querySelectorAll(".card h1");

    numbers.forEach(number => {

        const finalValue =
            parseInt(number.textContent);

        let current = 0;

        const increment =
            finalValue / 100;

        const timer =
            setInterval(() => {

                current += increment;

                if (current >= finalValue) {

                    current = finalValue;
                    clearInterval(timer);

                }

                number.textContent =
                    Math.floor(current);

            }, 15);

    });

}

window.addEventListener(
    "load",
    animateNumbers
);

/*=========================================
      ANIMATION DES CARTES
==========================================*/

function initCards() {

    const cards =
        document.querySelectorAll(
            ".card,.quick-card,.chart-box"
        );

    cards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.style.transform =
                    "translateY(-10px)";

            }
        );

        card.addEventListener(
            "mouseleave",
            () => {

                card.style.transform =
                    "translateY(0)";

            }
        );

    });

}

window.addEventListener(
    "load",
    initCards
);

/*=========================================
      MESSAGES MOTIVATION
==========================================*/

const messages = [

    "Bienvenue Inspecteur 👋",

    "La loi protège le travailleur.",

    "L'intégrité est la force de l'Inspecteur.",

    "Chaque inspection améliore le monde du travail.",

    "Le respect du Code du Travail protège tous les citoyens.",

    "La sécurité des travailleurs reste une priorité.",

    "Bonne mission Inspecteur."

];

function showMessage() {

    const element =
        document.getElementById(
            "notificationMessage"
        );

    if (!element) return;

    const random =
        Math.floor(
            Math.random() *
            messages.length
        );

    element.innerText =
        messages[random];

}

showMessage();
setInterval(showMessage, 7000);

/*=========================================
      GRAPHIQUE INSPECTIONS
==========================================*/

window.addEventListener(
    "load",
    () => {

        if (
            typeof Chart ===
            "undefined"
        ) {
            return;
        }

        const inspection =
            document.getElementById(
                "inspectionChart"
            );

        if (inspection) {

            new Chart(
                inspection,
                {

                    type: "line",

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

                            label:
                                "Inspections",

                            data: [
                                180,
                                300,
                                240,
                                450,
                                300,
                                680
                            ],

                            fill: true,

                            borderColor:
                                "#005baa",

                            backgroundColor:
                                "rgba(0,91,170,0.2)",

                            tension: 0.4

                        }]

                    },

                    options: {
                        responsive: true
                    }

                }
            );
        }

        const infraction =
            document.getElementById(
                "infractionChart"
            );

        if (infraction) {

            new Chart(
                infraction,
                {

                    type:
                        "doughnut",

                    data: {

                        labels: [

                            "Travail dissimulé",

                            "SMIG",

                            "Conditions",

                            "Sécurité",

                            "Autres"

                        ],

                        datasets: [{

                            data: [
                                38,
                                24,
                                18,
                                12,
                                8
                            ],

                            backgroundColor: [

                                "#005baa",
                                "#2e7d32",
                                "#ff9800",
                                "#c62828",
                                "#6a1b9a"

                            ]

                        }]

                    },

                    options: {
                        responsive: true
                    }

                }
            );
        }

    }
);

console.log(
    "InspecteurBot RDC démarré."
);
          
