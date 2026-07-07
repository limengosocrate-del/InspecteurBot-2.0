/*==================================================
 INSPECTEURBOT IA RDC
 fiche.js
 PARTIE 1
 Créé par Inspecteur Limengo (Pmiller)
 © 2026
==================================================*/

"use strict";

/*==================================================
CONFIGURATION
==================================================*/

const APP = {

    nom: "InspecteurBot IA RDC",

    version: "3.0 Premium",

    auteur: "Inspecteur Limengo (Pmiller)",

    annee: "2026"

};

/*==================================================
DEMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        afficherDateHeure();

        setInterval(

            afficherDateHeure,

            1000

        );

        verifierConnexion();

        chargerMeteo();

        afficherBienvenue();

    }

);

/*==================================================
DATE ET HEURE
==================================================*/

function afficherDateHeure(){

    const maintenant = new Date();

    const date = maintenant.toLocaleDateString(

        "fr-FR",

        {

            weekday:"long",

            year:"numeric",

            month:"long",

            day:"numeric"

        }

    );

    const heure = maintenant.toLocaleTimeString(

        "fr-FR"

    );

    document.getElementById(

        "currentDate"

    ).textContent = date;

    document.getElementById(

        "currentTime"

    ).textContent = heure;

}

/*==================================================
CONNEXION INTERNET
==================================================*/

function verifierConnexion(){

    const reseau = document.getElementById(

        "networkStatus"

    );

    if(!reseau) return;

    if(navigator.onLine){

        reseau.innerHTML =

        "🟢 En ligne";

    }

    else{

        reseau.innerHTML =

        "🔴 Hors ligne";

    }

}

window.addEventListener(

    "online",

    verifierConnexion

);

window.addEventListener(

    "offline",

    verifierConnexion

);

/*==================================================
MESSAGE BIENVENUE
==================================================*/

function afficherBienvenue(){

    notification(

        "Bienvenue sur InspecteurBot IA RDC"

    );

}

/*==================================================
NOTIFICATION
==================================================*/

function notification(message){

    const toast = document.createElement(

        "div"

    );

    toast.className = "toast";

    toast.innerHTML = message;

    document.body.appendChild(

        toast

    );

    setTimeout(

        ()=>{

            toast.classList.add(

                "show"

            );

        },

        100

    );

    setTimeout(

        ()=>{

            toast.classList.remove(

                "show"

            );

            setTimeout(

                ()=>{

                    toast.remove();

                },

                400

            );

        },

        3500

    );

}

/*==================================================
MESSAGE SELON L'HEURE
==================================================*/

const heure = new Date().getHours();

setTimeout(()=>{

if(heure<12){

notification(

"☀️ Bonjour Inspecteur."

);

}

else if(heure<18){

notification(

"👋 Bon après-midi Inspecteur."

);

}

else{

notification(

"🌙 Bonne soirée Inspecteur."

);

}

},1800);

/*==================================================
VERSION
==================================================*/

console.log(

APP.nom,

APP.version

);

console.log(

"Créé par Inspecteur Limengo (Pmiller)"

);

console.log(

"© 2026"

);

/*==================================================
FIN PARTIE 1
==================================================*/

/*==================================================
 INSPECTEURBOT IA RDC
 fiche.js
 PARTIE 2
 Créé par Inspecteur Limengo (Pmiller)
 © 2026
==================================================*/

"use strict";

/*==================================================
MODE SOMBRE / CLAIR
==================================================*/

const btnTheme = document.getElementById("btnTheme");

if(btnTheme){

    btnTheme.addEventListener(

        "click",

        changerTheme

    );

}

function changerTheme(){

    document.body.classList.toggle("light");

    const mode = document.body.classList.contains("light")
        ? "light"
        : "dark";

    localStorage.setItem(

        "theme",

        mode

    );

    notification(

        mode === "light"

        ? "☀️ Mode clair activé"

        : "🌙 Mode sombre activé"

    );

}

(function(){

    const mode = localStorage.getItem("theme");

    if(mode === "light"){

        document.body.classList.add("light");

    }

})();

/*==================================================
CHANGEMENT DE LANGUE
==================================================*/

const langue = document.getElementById("langSwitcher");

if(langue){

    const sauvegarde = localStorage.getItem("langue");

    if(sauvegarde){

        langue.value = sauvegarde;

    }

    langue.addEventListener(

        "change",

        function(){

            localStorage.setItem(

                "langue",

                this.value

            );

            notification(

                "🌍 Langue enregistrée"

            );

        }

    );

}

/*==================================================
RECHERCHE INTELLIGENTE
==================================================*/

const recherche = document.getElementById("searchInput");

if(recherche){

    recherche.addEventListener(

        "input",

        function(){

            const texte = this.value.toLowerCase();

            document.querySelectorAll(".card").forEach(

                carte=>{

                    const contenu = carte.textContent.toLowerCase();

                    carte.style.display =

                        contenu.includes(texte)

                        ? ""

                        : "none";

                }

            );

        }

    );

}

/*==================================================
BOUTON ASSISTANT IA
==================================================*/

const assistant = document.getElementById("btnAssistant");

if(assistant){

    assistant.addEventListener(

        "click",

        ()=>{

            notification(

                "🤖 Assistant IA en cours de développement."

            );

        }

    );

}

/*==================================================
RACCOURCIS CLAVIER
==================================================*/

document.addEventListener(

    "keydown",

    function(e){

        if(e.key === "/"){

            e.preventDefault();

            recherche.focus();

        }

        if(e.key.toLowerCase() === "t"){

            changerTheme();

        }

    }

);

/*==================================================
ANIMATION DES CARTES
==================================================*/

document.querySelectorAll(".card").forEach(

    carte=>{

        carte.addEventListener(

            "mouseenter",

            ()=>{

                carte.style.transform =

                "translateY(-10px) scale(1.03)";

            }

        );

        carte.addEventListener(

            "mouseleave",

            ()=>{

                carte.style.transform =

                "";

            }

        );

    }

);

/*==================================================
ANIMATION AU DEFILEMENT
==================================================*/

const apparition = new IntersectionObserver(

    elements=>{

        elements.forEach(

            element=>{

                if(element.isIntersecting){

                    element.target.classList.add(

                        "show"

                    );

                }

            }

        );

    },

    {

        threshold:0.15

    }

);

document.querySelectorAll(

    ".dashboard-section"

).forEach(

    section=>{

        section.classList.add("fade-up");

        apparition.observe(section);

    }

);

/*==================================================
FIN PARTIE 2
==================================================*/

/*==================================================
 INSPECTEURBOT IA RDC
 fiche.js
 PARTIE 3
 Créé par Inspecteur Limengo (Pmiller)
 © 2026
==================================================*/

"use strict";

/*==================================================
METEO (Open-Meteo)
==================================================*/

async function chargerMeteo(){

    const meteo = document.getElementById("weather");

    if(!meteo) return;

    if(!navigator.geolocation){

        meteo.innerHTML = "GPS indisponible";

        return;

    }

    navigator.geolocation.getCurrentPosition(

        async(position)=>{

            try{

                const latitude = position.coords.latitude;

                const longitude = position.coords.longitude;

                const url =

                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;

                const reponse = await fetch(url);

                const data = await reponse.json();

                meteo.innerHTML =

                "🌡 " +

                data.current.temperature_2m +

                " °C";

            }

            catch{

                meteo.innerHTML =

                "Météo indisponible";

            }

        },

        ()=>{

            meteo.innerHTML =

            "Localisation refusée";

        }

    );

}

/*==================================================
STATISTIQUES
==================================================*/

function afficherStatistiques(){

    const cartes =

    document.querySelectorAll(".card").length;

    console.log(

        "Nombre de modules :",cartes

    );

}

afficherStatistiques();

/*==================================================
PARTICULES
==================================================*/

function creerParticules(){

    const fond =

    document.querySelector(".particles");

    if(!fond) return;

    for(let i=0;i<60;i++){

        const p =

        document.createElement("span");

        p.className="particle";

        p.style.left=

        Math.random()*100+"%";

        p.style.top=

        Math.random()*100+"%";

        p.style.animationDuration=

        (6+Math.random()*12)+"s";

        p.style.animationDelay=

        Math.random()*6+"s";

        fond.appendChild(p);

    }

}

creerParticules();

/*==================================================
RACCOURCIS
==================================================*/

document.addEventListener(

    "keydown",

    e=>{

        if(e.key==="Home"){

            window.scrollTo({

                top:0,

                behavior:"smooth"

            });

        }

    }

);

/*==================================================
GPS
==================================================*/

function afficherGPS(){

    if(!navigator.geolocation){

        return;

    }

    navigator.geolocation.getCurrentPosition(

        position=>{

            console.log(

                "Latitude :",position.coords.latitude

            );

            console.log(

                "Longitude :",position.coords.longitude

            );

        }

    );

}

afficherGPS();

/*==================================================
MESSAGE VERSION
==================================================*/

console.log(

"======================================"

);

console.log(

APP.nom

);

console.log(

"Version :",APP.version

);

console.log(

"Créé par Inspecteur Limengo (Pmiller)"

);

console.log(

"© 2026"

);

console.log(

"======================================"

);

/*==================================================
CHARGEMENT
==================================================*/

window.addEventListener(

    "load",

    ()=>{

        notification(

            "✅ InspecteurBot IA RDC prêt."

        );

    }

);

/*==================================================
PREPARATION FUTURE IA
==================================================*/

const IA = {

    actif : false,

    analyser(){

        console.log(

            "Module IA prêt."

        );

    },

    recommander(){

        console.log(

            "Recommandations IA."

        );

    },

    verifier(){

        console.log(

            "Vérification documentaire."

        );

    }

};

/*==================================================
PREPARATION FUTURE SMIG
==================================================*/

const SMIG = {

    calculer(){

        console.log(

            "Calculateur SMIG prêt."

        );

    }

};

/*==================================================
PREPARATION FUTURE QR CODE
==================================================*/

const QRCodeModule = {

    scanner(){

        console.log(

            "Scanner QR prêt."

        );

    },

    generer(){

        console.log(

            "Générateur QR prêt."

        );

    }

};

/*==================================================
FIN
InspecteurBot IA RDC
Créé par Inspecteur Limengo (Pmiller)
© 2026
==================================================*/

/*==================================================
 INSPECTEURBOT IA RDC
 fiche.js
 PARTIE 4
 Créé par Inspecteur Limengo (Pmiller)
 © 2026
==================================================*/

"use strict";

/*==================================================
COMPTEUR DES FORMULAIRES
==================================================*/

function compterFormulaires(){

    const total = document.querySelectorAll(".card").length;

    const titre = document.querySelector(".hero p");

    if(titre){

        titre.innerHTML +=
        " • " + total + " modules disponibles";

    }

}

compterFormulaires();

/*==================================================
RACCOURCIS CLAVIER
==================================================*/

document.addEventListener("keydown",(e)=>{

    switch(e.key.toLowerCase()){

        case "/":

            e.preventDefault();

            document
            .getElementById("searchInput")
            ?.focus();

        break;

        case "t":

            changerTheme();

        break;

        case "f":

            document.documentElement.requestFullscreen?.();

            notification("🖥️ Mode plein écran");

        break;

        case "escape":

            document.exitFullscreen?.();

        break;

    }

});

/*==================================================
HORLOGE VOCALE
==================================================*/

function annoncerHeure(){

    if(!("speechSynthesis" in window)) return;

    const maintenant = new Date();

    const texte =
    "Il est " +
    maintenant.toLocaleTimeString("fr-FR");

    speechSynthesis.cancel();

    speechSynthesis.speak(

        new SpeechSynthesisUtterance(texte)

    );

}

/*==================================================
DOUBLE CLIC SUR L'HEURE
==================================================*/

document
.getElementById("currentTime")
?.addEventListener(

"dblclick",

annoncerHeure

);

/*==================================================
CHANGEMENT TITRE
==================================================*/

let clignoter = true;

setInterval(()=>{

    document.title = clignoter ?

    "🤖 InspecteurBot IA RDC"

    :

    "📋 Tableau de Bord";

    clignoter = !clignoter;

},5000);

/*==================================================
ANIMATION DES CARTES
==================================================*/

document.querySelectorAll(".card")

.forEach((carte,index)=>{

    carte.style.animationDelay =

    (index*0.08)+"s";

});

/*==================================================
EFFET SONORE
==================================================*/

function jouerSon(){

    const audio = new Audio(

    "assets/click.mp3"

    );

    audio.volume = .30;

    audio.play().catch(()=>{});

}

document.querySelectorAll(".card")

.forEach(carte=>{

    carte.addEventListener(

    "click",

    jouerSon

    );

});

/*==================================================
AFFICHAGE VERSION
==================================================*/

const version = document.createElement("div");

version.className="version-app";

version.innerHTML=

APP.nom+

"<br>"+

"Version "+APP.version;

document.body.appendChild(version);

/*==================================================
VERIFICATION MISE A JOUR
==================================================*/

function verifierVersion(){

    console.log(

    "Version actuelle :",

    APP.version

    );

}

verifierVersion();

/*==================================================
PREPARATION FUTURE
==================================================*/

const Modules={

    IA:true,

    SMIG:true,

    QRCode:true,

    GPS:true,

    Juridique:true,

    Verification:true,

    Statistiques:true,

    PDF:true,

    Signature:true,

    HorsLigne:true

};

console.table(Modules);

/*==================================================
FIN PARTIE 4
Créé par Inspecteur Limengo (Pmiller)
© 2026
==================================================*/

/*==================================================
 INSPECTEURBOT IA RDC
 fiche.js
 PARTIE 5
 Créé par Inspecteur Limengo (Pmiller)
 © 2026
==================================================*/

"use strict";

/*==================================================
INFORMATIONS SUR L'APPAREIL
==================================================*/

function detecterAppareil(){

    const agent = navigator.userAgent;

    let appareil = "Ordinateur";

    if(/Android/i.test(agent)){

        appareil = "Android";

    }

    else if(/iPhone|iPad|iPod/i.test(agent)){

        appareil = "iPhone / iPad";

    }

    console.log(

        "Appareil :",appareil

    );

}

detecterAppareil();

/*==================================================
NIVEAU DE BATTERIE
==================================================*/

async function batterie(){

    if(!navigator.getBattery) return;

    const b = await navigator.getBattery();

    console.log(

        "Batterie :",

        Math.round(b.level*100)+"%"

    );

    b.addEventListener(

        "levelchange",

        ()=>{

            notification(

                "🔋 Batterie : "+

                Math.round(b.level*100)+"%"

            );

        }

    );

}

batterie();

/*==================================================
SAUVEGARDE AUTOMATIQUE
==================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        localStorage.setItem(

            "derniereVisite",

            new Date().toLocaleString("fr-FR")

        );

    }

);

/*==================================================
AFFICHER DERNIERE VISITE
==================================================*/

const visite = localStorage.getItem(

    "derniereVisite"

);

if(visite){

    console.log(

        "Dernière visite :",

        visite

    );

}

/*==================================================
PLEIN ECRAN
==================================================*/

function pleinEcran(){

    if(document.documentElement.requestFullscreen){

        document.documentElement.requestFullscreen();

    }

}

const btnPlein = document.getElementById(

    "btnFullscreen"

);

if(btnPlein){

    btnPlein.addEventListener(

        "click",

        pleinEcran

    );

}

/*==================================================
INFORMATIONS NAVIGATEUR
==================================================*/

console.log(

    "Navigateur :",

    navigator.appName

);

console.log(

    "Langue :",

    navigator.language

);

console.log(

    "Plateforme :",

    navigator.platform

);

/*==================================================
COPIER LE TEXTE
==================================================*/

function copierTexte(texte){

    navigator.clipboard.writeText(texte)

    .then(()=>{

        notification(

            "📋 Texte copié"

        );

    });

}

/*==================================================
BOUTON RETOUR HAUT
==================================================*/

const retour = document.createElement("button");

retour.className="btn-top";

retour.innerHTML="⬆";

document.body.appendChild(retour);

retour.onclick=()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

};

/*==================================================
AFFICHAGE / MASQUAGE
==================================================*/

window.addEventListener(

    "scroll",

    ()=>{

        if(window.scrollY>300){

            retour.classList.add("show");

        }

        else{

            retour.classList.remove("show");

        }

    }

);

/*==================================================
HEURE DE DERNIERE MISE A JOUR
==================================================*/

console.log(

    "Application chargée le :",

    new Date().toLocaleString("fr-FR")

);

/*==================================================
MODULES FUTURS
==================================================*/

const FutursModules={

    ControleSMIG:true,

    ControleONEM:true,

    ControleCNSS:true,

    ControleINPP:true,

    AnalyseIA:true,

    VerificationDocuments:true,

    GPS:true,

    QRCode:true,

    SignatureNumerique:true,

    ExportPDF:true,

    Notifications:true,

    HorsLigne:true

};

console.table(

    FutursModules

);

/*==================================================
MESSAGE FINAL
==================================================*/

notification(

    "🚀 InspecteurBot IA RDC Premium prêt."

);

/*==================================================
FIN PARTIE 5
Créé par Inspecteur Limengo (Pmiller)
© 2026
==================================================*/
