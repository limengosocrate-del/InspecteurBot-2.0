/*==================================================
 INSPECTEURBOT IA RDC
 Version 4.0 Premium
 fiche.js
 Partie 1
 Créé par Inspecteur Limengo (Pmiller)
==================================================*/

"use strict";

/*==================================================
CONFIGURATION
==================================================*/

const APP = {

    nom: "InspecteurBot IA RDC",

    version: "4.0 Premium",

    auteur: "Inspecteur Limengo (Pmiller)",

    annee: "2026"

};

/*==================================================
DEMARRAGE
==================================================*/

document.addEventListener(

    "DOMContentLoaded",

    () => {

        console.log(

            APP.nom,

            APP.version

        );

        initialiserApplication();

    }

);

/*==================================================
INITIALISATION
==================================================*/

function initialiserApplication(){

    afficherDateHeure();

    surveillerReseau();

    chargerPreferences();

    detecterLangue();

    detecterAppareil();

}

/*==================================================
DATE ET HEURE
==================================================*/

function afficherDateHeure(){

    actualiserDateHeure();

    setInterval(

        actualiserDateHeure,

        1000

    );

}

function actualiserDateHeure(){

    const maintenant = new Date();

    const heure = document.getElementById("currentTime");

    const date = document.getElementById("currentDate");

    if(heure){

        heure.textContent =

        maintenant.toLocaleTimeString(

            "fr-FR"

        );

    }

    if(date){

        date.textContent =

        maintenant.toLocaleDateString(

            "fr-FR",

            {

                weekday:"long",

                day:"numeric",

                month:"long",

                year:"numeric"

            }

        );

    }

}

/*==================================================
ETAT DU RESEAU
==================================================*/

function surveillerReseau(){

    mettreAJourReseau();

    window.addEventListener(

        "online",

        mettreAJourReseau

    );

    window.addEventListener(

        "offline",

        mettreAJourReseau

    );

}

function mettreAJourReseau(){

    const el =

    document.getElementById(

        "networkStatus"

    );

    if(!el) return;

    if(navigator.onLine){

        el.innerHTML="🟢 En ligne";

    }

    else{

        el.innerHTML="🔴 Hors ligne";

    }

}

/*==================================================
LANGUE
==================================================*/

function detecterLangue(){

    const select =

    document.getElementById(

        "langSwitcher"

    );

    if(!select) return;

    const langue =

    localStorage.getItem(

        "langue"

    );

    if(langue){

        select.value = langue;

    }

    select.addEventListener(

        "change",

        ()=>{

            localStorage.setItem(

                "langue",

                select.value

            );

        }

    );

     }

/*==================================================
 INSPECTEURBOT IA RDC
 Version 4.0 Premium
 fiche.js
 Partie 2
 Géolocalisation - Météo - Thème
 Recherche - Animations
==================================================*/

"use strict";

/*==================================================
INITIALISATION COMPLEMENTAIRE
==================================================*/

const ancienneInitialisation =
initialiserApplication;

initialiserApplication = function(){

    ancienneInitialisation();

    initialiserTheme();

    initialiserRecherche();

    initialiserAnimations();

    obtenirLocalisation();

};

/*==================================================
GEOLOCALISATION
==================================================*/

function obtenirLocalisation(){

    if(!navigator.geolocation){

        afficherMeteo(
            "GPS indisponible"
        );

        return;

    }

    navigator.geolocation.getCurrentPosition(

        position=>{

            chargerMeteo(

                position.coords.latitude,

                position.coords.longitude

            );

        },

        ()=>{

            afficherMeteo(
                "Position refusée"
            );

        },

        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:300000

        }

    );

}

/*==================================================
METEO
==================================================*/

async function chargerMeteo(

    latitude,

    longitude

){

    try{

        const url=

        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m`;

        const reponse=

        await fetch(url);

        const donnees=

        await reponse.json();

        if(

            donnees.current

        ){

            afficherMeteo(

                `${donnees.current.temperature_2m}°C`

            );

        }

        else{

            afficherMeteo(

                "Indisponible"

            );

        }

    }

    catch(e){

        afficherMeteo(

            "Erreur météo"

        );

    }

}

function afficherMeteo(

    texte

){

    const meteo=

    document.getElementById(

        "weather"

    );

    if(meteo){

        meteo.textContent=

        texte;

    }

}

/*==================================================
THEME SOMBRE / CLAIR
==================================================*/

function initialiserTheme(){

    const bouton=

    document.getElementById(

        "btnTheme"

    );

    if(!bouton) return;

    const theme=

    localStorage.getItem(

        "theme"

    ) || "clair";

    appliquerTheme(

        theme

    );

    bouton.addEventListener(

        "click",

        ()=>{

            const nouveau=

            document.body.classList.contains(

                "dark"

            )

            ?

            "clair"

            :

            "dark";

            appliquerTheme(

                nouveau

            );

        }

    );

}

function appliquerTheme(

    theme

){

    if(theme==="dark"){

        document.body.classList.add(

            "dark"

        );

    }

    else{

        document.body.classList.remove(

            "dark"

        );

    }

    localStorage.setItem(

        "theme",

        theme

    );

}

/*==================================================
RECHERCHE INSTANTANEE
==================================================*/

function initialiserRecherche(){

    const recherche=

    document.getElementById(

        "searchInput"

    );

    if(!recherche) return;

    recherche.addEventListener(

        "input",

        ()=>{

            const texte=

            recherche.value

            .toLowerCase()

            .trim();

            document

            .querySelectorAll(

                ".card"

            )

            .forEach(

                carte=>{

                    const contenu=

                    carte.textContent

                    .toLowerCase();

                    carte.style.display=

                    contenu.includes(

                        texte

                    )

                    ?

                    ""

                    :

                    "none";

                }

            );

        }

    );

}

/*==================================================
ANIMATIONS
==================================================*/

function initialiserAnimations(){

    const cartes=

    document.querySelectorAll(

        ".card"

    );

    cartes.forEach(

        (

            carte,

            index

        )=>{

            carte.style.opacity="0";

            carte.style.transform=

            "translateY(40px)";

            setTimeout(

                ()=>{

                    carte.style.transition=

                    "0.6s";

                    carte.style.opacity="1";

                    carte.style.transform=

                    "translateY(0)";

                },

                index*70

            );

        }

    );

    document

    .querySelectorAll(

        "button"

    )

    .forEach(

        bouton=>{

            bouton.addEventListener(

                "click",

                ()=>{

                    bouton.animate(

                        [

                            {

                                transform:

                                "scale(1)"

                            },

                            {

                                transform:

                                "scale(.92)"

                            },

                            {

                                transform:

                                "scale(1)"

                            }

                        ],

                        {

                            duration:200

                        }

                    );

                }

            );

        }

    );

    }

/*==================================================
 INSPECTEURBOT IA RDC
 Version 4.0 Premium
 fiche.js
 Partie 3
 Assistant IA - Voix - Caméra
==================================================*/

"use strict";

/*==================================================
INITIALISATION DES OUTILS
==================================================*/

const ancienneInitialisationPartie2 =
initialiserApplication;

initialiserApplication = function(){

    ancienneInitialisationPartie2();

    initialiserAssistant();

    initialiserCommandeVocale();

    initialiserCamera();

    initialiserRaccourcis();

};

/*==================================================
ASSISTANT IA
==================================================*/

function initialiserAssistant(){

    const bouton =
    document.getElementById(
        "btnAssistant"
    );

    if(!bouton) return;

    bouton.addEventListener(
        "click",
        ouvrirAssistant
    );

}

function ouvrirAssistant(){

    vibration();

    window.location.href =
    "ia/assistant.html";

}

/*==================================================
COMMANDE VOCALE
==================================================*/

function initialiserCommandeVocale(){

    const bouton =
    document.getElementById(
        "btnVoice"
    );

    if(!bouton) return;

    const SpeechRecognition =

    window.SpeechRecognition ||

    window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        bouton.disabled = true;

        bouton.title =
        "Reconnaissance vocale indisponible";

        return;

    }

    const reconnaissance =
    new SpeechRecognition();

    reconnaissance.lang = "fr-FR";

    reconnaissance.interimResults = false;

    reconnaissance.maxAlternatives = 1;

    bouton.addEventListener(

        "click",

        ()=>{

            vibration();

            reconnaissance.start();

        }

    );

    reconnaissance.onresult =

    evenement=>{

        const texte =

        evenement.results[0][0].transcript;

        const recherche =

        document.getElementById(
            "searchInput"
        );

        if(recherche){

            recherche.value = texte;

            recherche.dispatchEvent(
                new Event("input")
            );

        }

    };

    reconnaissance.onerror =

    erreur=>{

        console.error(

            "Erreur vocale",

            erreur

        );

    };

}

/*==================================================
CAMERA
==================================================*/

function initialiserCamera(){

    const bouton =
    document.getElementById(
        "btnCamera"
    );

    if(!bouton) return;

    bouton.addEventListener(

        "click",

        lancerCamera

    );

}

async function lancerCamera(){

    vibration();

    if(

        !navigator.mediaDevices ||

        !navigator.mediaDevices.getUserMedia

    ){

        alert(

            "Caméra non disponible."

        );

        return;

    }

    try{

        const flux =

        await navigator

        .mediaDevices

        .getUserMedia({

            video:true

        });

        flux.getTracks()

        .forEach(

            piste=>{

                piste.stop();

            }

        );

        alert(

            "Caméra détectée avec succès."

        );

    }

    catch(e){

        alert(

            "Impossible d'accéder à la caméra."

        );

    }

}

/*==================================================
RACCOURCIS CLAVIER
==================================================*/

function initialiserRaccourcis(){

    document.addEventListener(

        "keydown",

        evenement=>{

            if(

                evenement.key==="/"

            ){

                evenement.preventDefault();

                document

                .getElementById(

                    "searchInput"

                )

                ?.focus();

            }

            if(

                evenement.key==="Escape"

            ){

                document

                .getElementById(

                    "searchInput"

                )

                ?.blur();

            }

        }

    );

}

/*==================================================
VIBRATION MOBILE
==================================================*/

function vibration(){

    if(

        "vibrate" in navigator

    ){

        navigator.vibrate(

            40

        );

    }

}

/*==================================================
 INSPECTEURBOT IA RDC
 Version 4.0 Premium
 fiche.js
 Partie 4A
 Notifications + Historique
==================================================*/

"use strict";

/*==================================================
INITIALISATION
==================================================*/

const ancienneInitialisationPartie3 =
initialiserApplication;

initialiserApplication = function(){

    ancienneInitialisationPartie3();

    initialiserNotifications();

    initialiserHistorique();

};

/*==================================================
NOTIFICATIONS PREMIUM
==================================================*/

function initialiserNotifications(){

    creerZoneNotifications();

    notifier(

        "Bienvenue sur InspecteurBot IA RDC 4.0 Premium",

        "success"

    );

}

function creerZoneNotifications(){

    if(document.getElementById("notificationContainer")){

        return;

    }

    const zone = document.createElement("div");

    zone.id = "notificationContainer";

    zone.style.position = "fixed";
    zone.style.top = "20px";
    zone.style.right = "20px";
    zone.style.zIndex = "99999";
    zone.style.display = "flex";
    zone.style.flexDirection = "column";
    zone.style.gap = "10px";
    zone.style.pointerEvents = "none";

    document.body.appendChild(zone);

}

function notifier(

    message,

    type = "info"

){

    const zone =

    document.getElementById(

        "notificationContainer"

    );

    if(!zone){

        return;

    }

    const notification =

    document.createElement("div");

    notification.textContent = message;

    notification.style.padding = "14px 18px";

    notification.style.borderRadius = "12px";

    notification.style.fontWeight = "600";

    notification.style.color = "#ffffff";

    notification.style.pointerEvents = "auto";

    notification.style.transform = "translateX(120%)";

    notification.style.transition = "0.35s";

    notification.style.boxShadow =
    "0 10px 25px rgba(0,0,0,.25)";

    switch(type){

        case "success":

            notification.style.background =
            "#1f8f43";

            break;

        case "error":

            notification.style.background =
            "#c62828";

            break;

        case "warning":

            notification.style.background =
            "#d97706";

            break;

        default:

            notification.style.background =
            "#0d47a1";

    }

    zone.appendChild(notification);

    requestAnimationFrame(()=>{

        notification.style.transform =
        "translateX(0)";

    });

    setTimeout(()=>{

        notification.style.transform =
        "translateX(120%)";

        setTimeout(()=>{

            notification.remove();

        },400);

    },3500);

}

/*==================================================
HISTORIQUE DES FORMULAIRES
==================================================*/

function initialiserHistorique(){

    document

    .querySelectorAll(".card")

    .forEach(

        carte=>{

            carte.addEventListener(

                "click",

                enregistrerHistorique

            );

        }

    );

}

function enregistrerHistorique(

    evenement

){

    const carte =

    evenement.currentTarget;

    const titre =

    carte.querySelector(

        ".card-title"

    )?.innerText.trim() ||

    "Document";

    const lien =

    carte.getAttribute("href");

    let historique =

    JSON.parse(

        localStorage.getItem(

            "historiqueInspecteurBot"

        ) || "[]"

    );

    historique =

    historique.filter(

        element =>

        element.lien !== lien

    );

    historique.unshift({

        titre,

        lien,

        date:

        new Date()

        .toLocaleString(

            "fr-FR"

        )

    });

    if(historique.length > 30){

        historique.length = 30;

    }

    localStorage.setItem(

        "historiqueInspecteurBot",

        JSON.stringify(

            historique

        )

    );

}

/*==================================================
CONSULTATION DE L'HISTORIQUE
==================================================*/

function obtenirHistorique(){

    return JSON.parse(

        localStorage.getItem(

            "historiqueInspecteurBot"

        ) || "[]"

    );

}

function viderHistorique(){

    localStorage.removeItem(

        "historiqueInspecteurBot"

    );

    notifier(

        "Historique supprimé",

        "success"

    );

}

/*==================================================
 INSPECTEURBOT IA RDC
 Version 4.0 Premium
 fiche.js
 Partie 4B
 Favoris + Documents récents
==================================================*/

"use strict";

/*==================================================
INITIALISATION
==================================================*/

const ancienneInitialisationPartie4A =
initialiserApplication;

initialiserApplication = function(){

    ancienneInitialisationPartie4A();

    initialiserFavoris();

    chargerDocumentsRecents();

};

/*==================================================
FAVORIS
==================================================*/

function initialiserFavoris(){

    document
    .querySelectorAll(".card")
    .forEach(

        carte=>{

            carte.addEventListener(

                "dblclick",

                ajouterFavori

            );

        }

    );

}

function ajouterFavori(e){

    e.preventDefault();

    e.stopPropagation();

    const carte =

    e.currentTarget;

    const titre =

    carte.querySelector(

        ".card-title"

    )?.textContent.trim() ||

    "Document";

    const lien =

    carte.getAttribute(

        "href"

    );

    let favoris =

    JSON.parse(

        localStorage.getItem(

            "favorisInspecteurBot"

        ) || "[]"

    );

    const existe =

    favoris.find(

        item =>

        item.lien === lien

    );

    if(existe){

        notifier(

            "Déjà dans les favoris.",

            "warning"

        );

        return;

    }

    favoris.push({

        titre,

        lien,

        date:

        new Date()

        .toLocaleString(

            "fr-FR"

        )

    });

    localStorage.setItem(

        "favorisInspecteurBot",

        JSON.stringify(

            favoris

        )

    );

    notifier(

        "Ajouté aux favoris ⭐",

        "success"

    );

}

/*==================================================
LECTURE DES FAVORIS
==================================================*/

function obtenirFavoris(){

    return JSON.parse(

        localStorage.getItem(

            "favorisInspecteurBot"

        ) || "[]"

    );

}

function supprimerFavori(lien){

    let favoris =

    obtenirFavoris();

    favoris =

    favoris.filter(

        item =>

        item.lien !== lien

    );

    localStorage.setItem(

        "favorisInspecteurBot",

        JSON.stringify(

            favoris

        )

    );

}

/*==================================================
DOCUMENTS RECENTS
==================================================*/

function chargerDocumentsRecents(){

    const cartes =

    document.querySelectorAll(

        ".card"

    );

    const historique =

    obtenirHistorique();

    if(

        historique.length===0

    ){

        return;

    }

    cartes.forEach(

        carte=>{

            const lien =

            carte.getAttribute(

                "href"

            );

            const trouve =

            historique.find(

                item =>

                item.lien===lien

            );

            if(trouve){

                carte.classList.add(

                    "recent"

                );

            }

        }

    );

}

/*==================================================
COMPTEURS
==================================================*/

function nombreFavoris(){

    return obtenirFavoris().length;

}

function nombreDocumentsRecents(){

    return obtenirHistorique().length;

}

/*==================================================
EXPORT LOCAL
==================================================*/

function exporterDonnees(){

    const donnees={

        favoris:

        obtenirFavoris(),

        historique:

        obtenirHistorique(),

        date:

        new Date()

        .toLocaleString(

            "fr-FR"

        )

    };

    return JSON.stringify(

        donnees,

        null,

        2

    );

}

/*==================================================
IMPORT LOCAL
==================================================*/

function importerDonnees(

    json

){

    try{

        const donnees =

        JSON.parse(json);

        if(

            donnees.favoris

        ){

            localStorage.setItem(

                "favorisInspecteurBot",

                JSON.stringify(

                    donnees.favoris

                )

            );

        }

        if(

            donnees.historique

        ){

            localStorage.setItem(

                "historiqueInspecteurBot",

                JSON.stringify(

                    donnees.historique

                )

            );

        }

        notifier(

            "Données restaurées.",

            "success"

        );

    }

    catch{

        notifier(

            "Fichier invalide.",

            "error"

        );

    }

}

/*==================================================
 INSPECTEURBOT IA RDC
 Version 4.0 Premium
 fiche.js
 Partie 4C
 Optimisation - Hors ligne - Préchargement
==================================================*/

"use strict";

/*==================================================
INITIALISATION
==================================================*/

const ancienneInitialisationPartie4B =
initialiserApplication;

initialiserApplication = function(){

    ancienneInitialisationPartie4B();

    initialiserModeHorsLigne();

    initialiserPrechargement();

    initialiserOptimisation();

    initialiserGestionErreurs();

};

/*==================================================
MODE HORS LIGNE
==================================================*/

function initialiserModeHorsLigne(){

    mettreAJourEtatConnexion();

    window.addEventListener(

        "online",

        mettreAJourEtatConnexion

    );

    window.addEventListener(

        "offline",

        mettreAJourEtatConnexion

    );

}

function mettreAJourEtatConnexion(){

    if(navigator.onLine){

        notifier(

            "Connexion Internet disponible.",

            "success"

        );

    }

    else{

        notifier(

            "Mode hors ligne activé.",

            "warning"

        );

    }

}

/*==================================================
PRECHARGEMENT DES PAGES
==================================================*/

function initialiserPrechargement(){

    document

    .querySelectorAll(".card")

    .forEach(

        carte=>{

            carte.addEventListener(

                "mouseenter",

                ()=>{

                    prechargerPage(

                        carte.href

                    );

                }

            );

            carte.addEventListener(

                "touchstart",

                ()=>{

                    prechargerPage(

                        carte.href

                    );

                },

                {

                    passive:true

                }

            );

        }

    );

}

function prechargerPage(url){

    if(

        document.querySelector(

            'link[href="' +

            url +

            '"]'

        )

    ){

        return;

    }

    const lien =

    document.createElement(

        "link"

    );

    lien.rel = "prefetch";

    lien.href = url;

    document.head.appendChild(

        lien

    );

}

/*==================================================
OPTIMISATION
==================================================*/

function initialiserOptimisation(){

    if(

        "requestIdleCallback"

        in window

    ){

        requestIdleCallback(

            nettoyerApplication

        );

    }

    else{

        setTimeout(

            nettoyerApplication,

            1000

        );

    }

}

function nettoyerApplication(){

    console.log(

        "Optimisation terminée."

    );

}

/*==================================================
GESTION DES ERREURS
==================================================*/

function initialiserGestionErreurs(){

    window.addEventListener(

        "error",

        evenement=>{

            console.error(

                evenement.message

            );

        }

    );

    window.addEventListener(

        "unhandledrejection",

        evenement=>{

            console.error(

                evenement.reason

            );

        }

    );

}

/*==================================================
INFORMATIONS APPLICATION
==================================================*/

function informationsApplication(){

    return{

        nom:APP.nom,

        version:APP.version,

        auteur:APP.auteur,

        annee:APP.annee,

        langue:

        localStorage.getItem(

            "langue"

        ) || "fr",

        theme:

        localStorage.getItem(

            "theme"

        ) || "clair",

        favoris:

        nombreFavoris(),

        historique:

        nombreDocumentsRecents(),

        connexion:

        navigator.onLine

    };

}

/*==================================================
API GLOBALE
==================================================*/

window.InspecteurBot={

    informations:

    informationsApplication,

    favoris:

    obtenirFavoris,

    historique:

    obtenirHistorique,

    exporter:

    exporterDonnees,

    importer:

    importerDonnees,

    notifier:

    notifier

};
