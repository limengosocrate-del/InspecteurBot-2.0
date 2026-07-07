/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 fiche.js
 Partie 1
===================================================*/

"use strict";

/*==================================================
 INITIALISATION
===================================================*/

document.addEventListener("DOMContentLoaded", () => {

    updateClock();
    setInterval(updateClock, 1000);

    updateDate();

    greeting();

    initSearch();

    animateCards();

    console.log("✔ InspecteurBot IA Premium chargé.");

});


/*==================================================
 HORLOGE
===================================================*/

function updateClock() {

    const element = document.getElementById("currentTime");

    if (!element) return;

    const now = new Date();

    let h = now.getHours().toString().padStart(2, "0");
    let m = now.getMinutes().toString().padStart(2, "0");
    let s = now.getSeconds().toString().padStart(2, "0");

    element.textContent = `${h}:${m}:${s}`;

}


/*==================================================
 DATE
===================================================*/

function updateDate() {

    const element = document.getElementById("currentDate");

    if (!element) return;

    const jours = [
        "Dimanche",
        "Lundi",
        "Mardi",
        "Mercredi",
        "Jeudi",
        "Vendredi",
        "Samedi"
    ];

    const mois = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre"
    ];

    const now = new Date();

    element.textContent =
        jours[now.getDay()] + " " +
        now.getDate() + " " +
        mois[now.getMonth()] + " " +
        now.getFullYear();

}


/*==================================================
 SALUTATION
===================================================*/

function greeting() {

    const hero = document.querySelector(".hero h2");

    if (!hero) return;

    const hour = new Date().getHours();

    if (hour < 12) {

        hero.textContent =
            "BONJOUR INSPECTEUR";

    }

    else if (hour < 18) {

        hero.textContent =
            "BON APRÈS-MIDI INSPECTEUR";

    }

    else {

        hero.textContent =
            "BONNE SOIRÉE INSPECTEUR";

    }

}


/*==================================================
 RECHERCHE
===================================================*/

function initSearch() {

    const input = document.getElementById("searchInput");

    if (!input) return;

    input.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const cards =
            document.querySelectorAll(".card");

        cards.forEach(card => {

            const txt =
                card.innerText.toLowerCase();

            if (txt.indexOf(value) > -1) {

                card.style.display = "";

            }

            else {

                card.style.display = "none";

            }

        });

    });

}


/*==================================================
 ANIMATION DES CARTES
===================================================*/

function animateCards() {

    const cards =
        document.querySelectorAll(".card");

    cards.forEach((card, index) => {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(30px)";

        setTimeout(() => {

            card.style.transition =
                "0.6s";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, index * 60);

    });

}


/*==================================================
 GESTION DES ERREURS
===================================================*/

window.onerror = function (
    message,
    source,
    line,
    column,
    error
) {

    console.error(
        "Erreur :",
        message
    );

};

/*==================================================
 PARTIE 2
 THEME - IA - VOIX
===================================================*/

/*==================================================
 THEME SOMBRE / CLAIR
===================================================*/

(function () {

    const btnTheme = document.getElementById("btnTheme");

    if (!btnTheme) return;

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-theme");
        btnTheme.textContent = "☀️ Thème";
    }

    btnTheme.addEventListener("click", () => {

        document.body.classList.toggle("dark-theme");

        const dark =
            document.body.classList.contains("dark-theme");

        localStorage.setItem(
            "theme",
            dark ? "dark" : "light"
        );

        btnTheme.textContent =
            dark ? "☀️ Thème" : "🌙 Thème";

    });

})();


/*==================================================
 LOCALISATION GPS
===================================================*/

(function () {

    const weather =
        document.getElementById("weather");

    if (!weather) return;

    if (!navigator.geolocation) {

        weather.textContent =
            "GPS non disponible";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function (position) {

            weather.textContent =
                "📍 Position détectée";

            console.log(position.coords.latitude);
            console.log(position.coords.longitude);

        },

        function () {

            weather.textContent =
                "Position refusée";

        }

    );

})();


/*==================================================
 ASSISTANT IA
===================================================*/

(function () {

    const btn =
        document.getElementById("btnAssistant");

    if (!btn) return;

    btn.addEventListener("click", () => {

        alert(
            "InspecteurBot IA sera disponible dans la prochaine version."
        );

    });

})();


/*==================================================
 SYNTHÈSE VOCALE
===================================================*/

(function () {

    const btn =
        document.getElementById("btnVoice");

    if (!btn) return;

    if (!("speechSynthesis" in window))
        return;

    btn.addEventListener("click", () => {

        const speech =
            new SpeechSynthesisUtterance();

        speech.lang = "fr-FR";

        speech.text =
            "Bienvenue dans InspecteurBot IA RDC Premium.";

        window.speechSynthesis.cancel();

        window.speechSynthesis.speak(speech);

    });

})();

/*==================================================
 PARTIE 3
 VOIX - LANGUES - RACCOURCIS
===================================================*/

/*==================================================
 RECONNAISSANCE VOCALE
===================================================*/

(function () {

    const btnVoice = document.getElementById("btnVoice");
    const searchInput = document.getElementById("searchInput");

    if (!btnVoice || !searchInput) return;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        btnVoice.disabled = true;
        btnVoice.title = "Reconnaissance vocale non disponible";
        return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    btnVoice.addEventListener("dblclick", () => {

        recognition.start();

    });

    recognition.onresult = function (event) {

        const texte = event.results[0][0].transcript;

        searchInput.value = texte;

        searchInput.dispatchEvent(
            new KeyboardEvent("keyup")
        );

    };

})();


/*==================================================
 CHANGEMENT DE LANGUE
===================================================*/

(function () {

    const lang = document.getElementById("langSwitcher");

    if (!lang) return;

    lang.addEventListener("change", function () {

        localStorage.setItem(
            "langue",
            this.value
        );

        alert(
            "La langue " +
            this.options[this.selectedIndex].text +
            " sera appliquée dans les prochaines mises à jour."
        );

    });

})();


/*==================================================
 RACCOURCIS CLAVIER
===================================================*/

document.addEventListener("keydown", function (e) {

    if (e.ctrlKey && e.key === "f") {

        e.preventDefault();

        document.getElementById("searchInput").focus();

    }

});


/*==================================================
 NOTIFICATION
===================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        console.log(
            "Bienvenue dans InspecteurBot IA RDC Premium."
        );

    }, 1000);

});


/*==================================================
 EFFET SUR LES BOUTONS
===================================================*/

document.querySelectorAll("button").forEach(btn => {

    btn.addEventListener("mouseenter", () => {

        btn.style.transform = "scale(1.05)";

    });

    btn.addEventListener("mouseleave", () => {

        btn.style.transform = "scale(1)";

    });

});

/*==================================================
 PARTIE 4
 HISTORIQUE - PREFERENCES - EFFETS
===================================================*/

/*==================================================
 SAUVEGARDE DE LA RECHERCHE
===================================================*/

(function () {

    const input = document.getElementById("searchInput");

    if (!input) return;

    const lastSearch = localStorage.getItem("lastSearch");

    if (lastSearch) {
        input.value = lastSearch;
        input.dispatchEvent(new KeyboardEvent("keyup"));
    }

    input.addEventListener("input", () => {

        localStorage.setItem(
            "lastSearch",
            input.value
        );

    });

})();


/*==================================================
 COMPTEUR DES CARTES
===================================================*/

function updateVisibleCards() {

    const cards = document.querySelectorAll(".card");

    let total = 0;

    cards.forEach(card => {

        if (card.style.display !== "none") {
            total++;
        }

    });

    console.log(
        "Cartes visibles : " + total
    );

}

setInterval(updateVisibleCards, 1000);


/*==================================================
 EFFET PREMIUM SUR LES CARTES
===================================================*/

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform =
            "translateY(-8px) scale(1.03)";

        card.style.boxShadow =
            "0 15px 35px rgba(0,170,255,.35)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform =
            "translateY(0) scale(1)";

        card.style.boxShadow = "";

    });

});


/*==================================================
 SAUVEGARDE DE LA LANGUE
===================================================*/

(function(){

    const langue = localStorage.getItem("langue");

    const select = document.getElementById("langSwitcher");

    if(!select) return;

    if(langue){

        select.value = langue;

    }

})();


/*==================================================
 MESSAGE DE BIENVENUE
===================================================*/

window.addEventListener("load",()=>{

    setTimeout(()=>{

        console.log(
            "Bienvenue sur InspecteurBot IA RDC Premium 4.0"
        );

    },500);

});


/*==================================================
 ANIMATION DES BOUTONS
===================================================*/

document.querySelectorAll("button").forEach(btn=>{

    btn.addEventListener("mousedown",()=>{

        btn.style.transform="scale(.95)";

    });

    btn.addEventListener("mouseup",()=>{

        btn.style.transform="scale(1)";

    });

});

/*==================================================
 PARTIE 5
 OUTILS PROFESSIONNELS
===================================================*/

/*==================================================
 ETAT DE LA CONNEXION
===================================================*/

(function () {

    function updateConnection() {

        if (navigator.onLine) {

            console.log("Connexion Internet disponible.");

        } else {

            console.warn("Aucune connexion Internet.");

        }

    }

    updateConnection();

    window.addEventListener("online", updateConnection);
    window.addEventListener("offline", updateConnection);

})();


/*==================================================
 BATTERIE
===================================================*/

(function () {

    if (!navigator.getBattery) return;

    navigator.getBattery().then(function (battery) {

        console.log(
            "Batterie : " +
            Math.round(battery.level * 100) + "%"
        );

    });

})();


/*==================================================
 MODE PLEIN ECRAN
===================================================*/

(function () {

    document.addEventListener("keydown", function (e) {

        if (e.key === "F11") {

            e.preventDefault();

            if (!document.fullscreenElement) {

                document.documentElement.requestFullscreen();

            } else {

                document.exitFullscreen();

            }

        }

    });

})();


/*==================================================
 COPIER LE TEXTE D'UNE CARTE
===================================================*/

document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("contextmenu", function (e) {

        e.preventDefault();

        navigator.clipboard.writeText(card.innerText);

        alert("Texte copié.");

    });

});


/*==================================================
 BOUTON RETOUR EN HAUT
===================================================*/

const topButton = document.createElement("button");

topButton.innerHTML = "⬆";

topButton.id = "backTop";

document.body.appendChild(topButton);

topButton.style.position = "fixed";
topButton.style.right = "20px";
topButton.style.bottom = "20px";
topButton.style.width = "50px";
topButton.style.height = "50px";
topButton.style.borderRadius = "50%";
topButton.style.display = "none";
topButton.style.cursor = "pointer";
topButton.style.zIndex = "9999";

window.addEventListener("scroll", () => {

    topButton.style.display =
        window.scrollY > 300 ? "block" : "none";

});

topButton.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


