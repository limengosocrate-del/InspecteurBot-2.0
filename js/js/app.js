/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 1/15
    NOYAU DU SYSTÈME
==========================================================*/

"use strict";

/*==========================================================
    CONFIGURATION GLOBALE
==========================================================*/

const APP = {

    NAME: "InspecteurBot IA RDC",

    VERSION: "4.0 Premium",

    AUTHOR: "Inspecteur Limengo (Pmiller)",

    BUILD: "2026.07",

    STORAGE_PREFIX: "inspecteurbot_",

    DEBUG: true

};

/*==========================================================
    OBJET PRINCIPAL
==========================================================*/

window.IB = {

    ready: false,

    online: navigator.onLine,

    language: "fr",

    theme: "dark",

    currentUser: null,

    currentLocation: null,

    weather: null,

    gps: null,

    notifications: [],

    history: [],

    cache: {},

    database: {},

    forms: {},

    stats: {

        opens: 0,

        searches: 0,

        scans: 0,

        exports: 0,

        voice: 0,

        ia: 0

    }

};

/*==========================================================
    RACCOURCIS DOM
==========================================================*/

const $ = (id) => document.getElementById(id);

const $$ = (selector) => document.querySelector(selector);

const $$$ = (selector) => document.querySelectorAll(selector);

/*==========================================================
    LOCAL STORAGE
==========================================================*/

const Storage = {

    save(key, value){

        localStorage.setItem(

            APP.STORAGE_PREFIX + key,

            JSON.stringify(value)

        );

    },

    load(key, def = null){

        try{

            const data = localStorage.getItem(

                APP.STORAGE_PREFIX + key

            );

            if(data===null) return def;

            return JSON.parse(data);

        }

        catch(e){

            return def;

        }

    },

    remove(key){

        localStorage.removeItem(

            APP.STORAGE_PREFIX + key

        );

    },

    clear(){

        Object.keys(localStorage).forEach(k=>{

            if(k.startsWith(APP.STORAGE_PREFIX)){

                localStorage.removeItem(k);

            }

        });

    }

};

/*==========================================================
    JOURNAL
==========================================================*/

function log(message){

    if(APP.DEBUG){

        console.log(

            "[InspecteurBot]",

            message

        );

    }

}

/*==========================================================
    HISTORIQUE
==========================================================*/

function addHistory(action){

    IB.history.push({

        action,

        date:new Date().toISOString()

    });

    if(IB.history.length>300){

        IB.history.shift();

    }

    Storage.save(

        "history",

        IB.history

    );

}

/*==========================================================
    NOTIFICATION
==========================================================*/

function notify(

    text,

    type="success",

    duration=3000

){

    let box = document.createElement("div");

    box.className="ib-toast";

    box.innerHTML=text;

    box.style.position="fixed";

    box.style.right="20px";

    box.style.top="20px";

    box.style.padding="15px";

    box.style.borderRadius="12px";

    box.style.color="#fff";

    box.style.zIndex="999999";

    box.style.background=

        type==="success"

        ?"#00a86b"

        :type==="error"

        ?"#d32f2f"

        :"#1565c0";

    document.body.appendChild(box);

    setTimeout(()=>{

        box.remove();

    },duration);

}

/*==========================================================
    INITIALISATION
==========================================================*/

function initCore(){

    log("Chargement du noyau...");

    IB.history =

        Storage.load(

            "history",

            []

        );

    IB.stats =

        Storage.load(

            "stats",

            IB.stats

        );

    IB.ready = true;

    addHistory(

        "Application démarrée"

    );

    notify(

        "InspecteurBot IA RDC initialisé."

    );

    log("Noyau chargé.");

}

/*==========================================================
    EVENEMENTS RESEAU
==========================================================*/

window.addEventListener(

    "online",

    ()=>{

        IB.online=true;

        notify(

            "Connexion Internet rétablie."

        );

    }

);

window.addEventListener(

    "offline",

    ()=>{

        IB.online=false;

        notify(

            "Mode hors connexion",

            "error"

        );

    }

);

/*==========================================================
    DEMARRAGE
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        initCore();

    }

);

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 2/15
    CONFIGURATION GENERALE
==========================================================*/

"use strict";

/*==========================================================
    CONFIGURATION
==========================================================*/

IB.config = {

    language: "fr",

    theme: "dark",

    notifications: true,

    gps: true,

    weather: true,

    autoSave: true,

    animations: true,

    vibration: true,

    sound: false,

    version: APP.VERSION

};

/*==========================================================
    CHARGER CONFIGURATION
==========================================================*/

function loadConfig(){

    const config = Storage.load(

        "config",

        null

    );

    if(config){

        Object.assign(

            IB.config,

            config

        );

    }

}

/*==========================================================
    SAUVEGARDER CONFIGURATION
==========================================================*/

function saveConfig(){

    Storage.save(

        "config",

        IB.config

    );

}

/*==========================================================
    CACHE APPLICATION
==========================================================*/

IB.cache = {

    weather: null,

    gps: null,

    search: [],

    articles: [],

    exports: [],

    statistics: null,

    lastUpdate: null

};

/*==========================================================
    CACHE
==========================================================*/

function cacheSet(key,value){

    IB.cache[key]=value;

}

function cacheGet(key){

    return IB.cache[key];

}

function clearCache(){

    Object.keys(IB.cache).forEach(key=>{

        if(Array.isArray(IB.cache[key])){

            IB.cache[key]=[];

        }else{

            IB.cache[key]=null;

        }

    });

}

/*==========================================================
    JOURNAL APPLICATION
==========================================================*/

IB.logs=[];

function addLog(type,message){

    const logItem={

        type,

        message,

        date:new Date().toLocaleString("fr-FR")

    };

    IB.logs.unshift(logItem);

    if(IB.logs.length>500){

        IB.logs.pop();

    }

    Storage.save(

        "logs",

        IB.logs

    );

}

/*==========================================================
    CHARGER JOURNAL
==========================================================*/

function loadLogs(){

    IB.logs=Storage.load(

        "logs",

        []

    );

}

/*==========================================================
    SAUVEGARDE AUTOMATIQUE
==========================================================*/

function autoSave(){

    if(!IB.config.autoSave){

        return;

    }

    saveConfig();

    Storage.save(

        "stats",

        IB.stats

    );

    Storage.save(

        "history",

        IB.history

    );

    addLog(

        "SYSTEM",

        "Sauvegarde automatique"

    );

}

/*==========================================================
    TIMER SAUVEGARDE
==========================================================*/

setInterval(

    autoSave,

    60000

);

/*==========================================================
    INITIALISATION
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadConfig();

        loadLogs();

        addLog(

            "SYSTEM",

            "Configuration chargée"

        );

        log(

            "Configuration prête."

        );

    }

);

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 3/15
    TABLEAU DE BORD PREMIUM
==========================================================*/

"use strict";

/*==========================================================
    TABLEAU DE BORD
==========================================================*/

IB.dashboard = {

    time: "--:--:--",

    date: "--",

    weather: "--",

    gps: null,

    battery: "--",

    network: navigator.onLine,

    device: navigator.userAgent

};

/*==========================================================
    HORLOGE
==========================================================*/

function updateClock(){

    if(!$("currentTime")) return;

    const now = new Date();

    IB.dashboard.time = now.toLocaleTimeString(
        "fr-FR",
        {
            hour:"2-digit",
            minute:"2-digit",
            second:"2-digit"
        }
    );

    $("currentTime").textContent =
    IB.dashboard.time;

}

setInterval(updateClock,1000);

/*==========================================================
    DATE
==========================================================*/

function updateDate(){

    if(!$("currentDate")) return;

    const now = new Date();

    IB.dashboard.date =
    now.toLocaleDateString(
        "fr-FR",
        {
            weekday:"long",
            day:"2-digit",
            month:"long",
            year:"numeric"
        }
    );

    $("currentDate").textContent =
    IB.dashboard.date;

}

updateDate();

/*==========================================================
    GPS
==========================================================*/

function updateGPS(){

    if(!navigator.geolocation){

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function(position){

            IB.dashboard.gps={

                latitude:
                position.coords.latitude,

                longitude:
                position.coords.longitude,

                precision:
                position.coords.accuracy

            };

            cacheSet(
                "gps",
                IB.dashboard.gps
            );

            addLog(
                "GPS",
                "Position actualisée"
            );

        },

        function(){

            addLog(
                "GPS",
                "Position indisponible"
            );

        },

        {

            enableHighAccuracy:true,

            timeout:10000

        }

    );

}

/*==========================================================
    METEO
==========================================================*/

async function updateWeather(){

    if(!$("weather")) return;

    if(!IB.dashboard.gps){

        $("weather").textContent =
        "Localisation...";

        return;

    }

    try{

        const lat =
        IB.dashboard.gps.latitude;

        const lon =
        IB.dashboard.gps.longitude;

        const response =
        await fetch(

`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`

        );

        const data =
        await response.json();

        const temp =
        Math.round(
            data.current.temperature_2m
        );

        $("weather").textContent =
        "🌡 " + temp + "°C";

        cacheSet(
            "weather",
            data
        );

    }

    catch(e){

        $("weather").textContent =
        "Indisponible";

    }

}

/*==========================================================
    RESEAU
==========================================================*/

window.addEventListener(

    "online",

    ()=>{

        IB.dashboard.network=true;

        notify(
            "Connexion Internet"
        );

    }

);

window.addEventListener(

    "offline",

    ()=>{

        IB.dashboard.network=false;

        notify(
            "Mode hors connexion",
            "error"
        );

    }

);

/*==========================================================
    BATTERIE
==========================================================*/

async function updateBattery(){

    if(!navigator.getBattery){

        return;

    }

    const battery =
    await navigator.getBattery();

    IB.dashboard.battery =

        Math.round(

            battery.level*100

        )+"%";

    addLog(

        "SYSTEM",

        "Batterie : "+

        IB.dashboard.battery

    );

}

/*==========================================================
    INFORMATIONS APPAREIL
==========================================================*/

function getDeviceInfo(){

    return{

        plateforme:
        navigator.platform,

        langue:
        navigator.language,

        agent:
        navigator.userAgent,

        largeur:
        window.innerWidth,

        hauteur:
        window.innerHeight

    };

}

/*==========================================================
    ACTUALISATION
==========================================================*/

function refreshDashboard(){

    updateClock();

    updateDate();

    updateGPS();

    updateWeather();

    updateBattery();

}

setInterval(

    refreshDashboard,

    300000

);

/*==========================================================
    INITIALISATION
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        refreshDashboard();

        log(
            "Tableau de bord prêt."
        );

    }

);

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 4/15
    MOTEUR DE RECHERCHE INTELLIGENT
==========================================================*/

"use strict";

/*==========================================================
 BASE DE DONNEES DE RECHERCHE
==========================================================*/

IB.search = {

    data: [],

    index: [],

    results: []

};

/*==========================================================
 AJOUT D'UNE ENTREE
==========================================================*/

function addSearchItem(

    titre,

    categorie,

    url,

    motscles=[]

){

    IB.search.data.push({

        titre,

        categorie,

        url,

        motscles

    });

}

/*==========================================================
 INDEXATION
==========================================================*/

function buildSearchIndex(){

    IB.search.index=[];

    IB.search.data.forEach(item=>{

        IB.search.index.push(

            (

                item.titre+" "+

                item.categorie+" "+

                item.motscles.join(" ")

            ).toLowerCase()

        );

    });

}

/*==========================================================
 FICHES IGT
==========================================================*/

addSearchItem(

"F01 - Contrôle de la Main d'œuvre",

"Inspection",

"F01/F01.html",

["main","oeuvre","inspection","travail"]

);

addSearchItem(

"F02 - Main d'œuvre étrangère",

"Inspection",

"F02/F02.html",

["etrangere","visa","expatrie"]

);

addSearchItem(

"F03 - Hygiène et Santé",

"Inspection",

"F03/F03.html",

["hygiene","sante","medecin"]

);

addSearchItem(

"F04 - Sécurité BTP",

"Inspection",

"F04/F04.html"

);

addSearchItem(

"F05 - Sécurité Mines",

"Inspection",

"F05/F05.html"

);

addSearchItem(

"F06 - Entreprises à risques",

"Inspection",

"F06/F06.html"

);

addSearchItem(

"F07 - Protection Sociale",

"Inspection",

"F07/F07.html"

);

addSearchItem(

"S01 - Visite spéciale",

"Inspection",

"S01/S01.html"

);

addSearchItem(

"S02 - Contre-enquête",

"Inspection",

"S02/S02.html"

);

addSearchItem(

"S03 - Administration",

"Inspection",

"S03/S03.html"

);

/*==========================================================
 BIBLIOTHEQUE JURIDIQUE
==========================================================*/

addSearchItem(

"Code du Travail",

"Juridique",

"code-travail.html"

);

addSearchItem(

"Constitution",

"Juridique",

"juridique/constitution.html"

);

addSearchItem(

"Conventions OIT",

"Juridique",

"juridique/oit.html"

);

addSearchItem(

"Décrets",

"Juridique",

"juridique/decrets.html"

);

addSearchItem(

"Arrêtés Ministériels",

"Juridique",

"juridique/arretes.html"

);

addSearchItem(

"Notes Circulaires",

"Juridique",

"juridique/notes-circulaires.html"

);

addSearchItem(

"Jurisprudence",

"Juridique",

"juridique/jurisprudence.html"

);

/*==========================================================
 ONEM
==========================================================*/

addSearchItem(

"Déclaration Etablissement",

"ONEM",

"ONEM/declaration-etablissement.html"

);

addSearchItem(

"DASMO",

"ONEM",

"ONEM/dasmo.html"

);

addSearchItem(

"Bilan Social",

"ONEM",

"ONEM/bilan-social.html"

);

/*==========================================================
 RECHERCHE
==========================================================*/

function search(query){

    query=query.trim().toLowerCase();

    if(query===""){

        return [];

    }

    let resultat=[];

    IB.search.index.forEach((texte,i)=>{

        if(texte.includes(query)){

            resultat.push(

                IB.search.data[i]

            );

        }

    });

    return resultat;

}

/*==========================================================
 AFFICHAGE
==========================================================*/

function displaySearchResults(results){

    let panel=

    document.getElementById(

    "search-results"

    );

    if(!panel){

        panel=

        document.createElement("div");

        panel.id="search-results";

        panel.className="search-results";

        $("searchInput")

        .parentNode

        .appendChild(panel);

    }

    panel.innerHTML="";

    if(results.length===0){

        panel.style.display="none";

        return;

    }

    panel.style.display="block";

    results.forEach(item=>{

        const ligne=

        document.createElement("div");

        ligne.className=

        "search-item";

        ligne.innerHTML=

        "<strong>"+

        item.titre+

        "</strong><br>"+

        "<small>"+

        item.categorie+

        "</small>";

        ligne.onclick=function(){

            location.href=

            item.url;

        };

        panel.appendChild(ligne);

    });

}

/*==========================================================
 BARRE RECHERCHE
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    buildSearchIndex();

    if(!$("searchInput")) return;

    $("searchInput")

    .addEventListener(

    "input",

    function(){

        const r=

        search(this.value);

        displaySearchResults(r);

        IB.stats.searches++;

    });

});

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 5/15
    MOTEUR IA JURIDIQUE
==========================================================*/

"use strict";

/*==========================================================
 BASE IA
==========================================================*/

IB.ai = {

    articles: [],

    loaded: false,

    history: [],

    lastQuestion: "",

    lastAnswer: ""

};

/*==========================================================
 CHARGEMENT DU CODE DU TRAVAIL
==========================================================*/

async function loadCodeTravail(){

    try{

        const response = await fetch(

            "data/code-travail.json"

        );

        if(!response.ok){

            throw new Error(

                "Impossible de charger le Code du Travail."

            );

        }

        IB.ai.articles =

        await response.json();

        IB.ai.loaded = true;

        addLog(

            "IA",

            "Code du Travail chargé"

        );

        log(

            "Articles chargés : " +

            IB.ai.articles.length

        );

    }

    catch(error){

        console.error(error);

        addLog(

            "ERREUR",

            "Chargement Code Travail"

        );

    }

}

/*==========================================================
 RECHERCHE D'ARTICLE
==========================================================*/

function findArticle(numero){

    numero = Number(numero);

    return IB.ai.articles.find(article=>{

        return Number(article.numero)===numero;

    });

}

/*==========================================================
 RECHERCHE PAR TEXTE
==========================================================*/

function findArticles(keyword){

    keyword = keyword.toLowerCase();

    return IB.ai.articles.filter(article=>{

        const texte = (

            article.titre + " " +

            article.contenu + " " +

            article.categorie

        ).toLowerCase();

        return texte.includes(keyword);

    });

}

/*==========================================================
 EXTRACTION NUMERO ARTICLE
==========================================================*/

function extractArticle(question){

    const match =

    question.match(

        /\d+/

    );

    if(match){

        return parseInt(match[0]);

    }

    return null;

}

/*==========================================================
 QUESTION IA
==========================================================*/

function askIA(question){

    question = question.trim();

    if(question===""){

        return{

            success:false,

            answer:"Veuillez saisir une question."

        };

    }

    IB.stats.ia++;

    IB.ai.lastQuestion = question;

    addHistory(

        "IA : " + question

    );

    /*----------------------------------
      ARTICLE
    -----------------------------------*/

    const numero =

    extractArticle(question);

    if(numero){

        const article =

        findArticle(numero);

        if(article){

            IB.ai.lastAnswer =

            article.contenu;

            return{

                success:true,

                answer:

                "ARTICLE " +

                article.numero +

                "\n\n" +

                article.titre +

                "\n\n" +

                article.contenu

            };

        }

    }

    /*----------------------------------
      RECHERCHE PAR MOT CLE
    -----------------------------------*/

    const mots =

    question

    .toLowerCase()

    .split(" ");

    let resultat=[];

    mots.forEach(mot=>{

        if(mot.length>2){

            resultat =

            resultat.concat(

                findArticles(mot)

            );

        }

    });

    resultat =

    [...new Map(

        resultat.map(

            item=>[item.numero,item]

        )

    ).values()];

    if(resultat.length>0){

        let texte =

        "Articles trouvés :\n\n";

        resultat

        .slice(0,10)

        .forEach(article=>{

            texte +=

            "Article " +

            article.numero +

            " - " +

            article.titre +

            "\n";

        });

        IB.ai.lastAnswer = texte;

        return{

            success:true,

            answer:texte

        };

    }

    return{

        success:false,

        answer:

        "Aucun résultat trouvé."

    };

}

/*==========================================================
 HISTORIQUE IA
==========================================================*/

function saveIAHistory(

question,

answer

){

    IB.ai.history.unshift({

        date:

        new Date()

        .toLocaleString("fr-FR"),

        question,

        answer

    });

    if(

        IB.ai.history.length>100

    ){

        IB.ai.history.pop();

    }

    Storage.save(

        "ia_history",

        IB.ai.history

    );

}

/*==========================================================
 BOUTON IA
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadCodeTravail();

    if(!$("btnAssistant")) return;

    $("btnAssistant")

    .addEventListener(

    "click",

    ()=>{

        const question=

        prompt(

        "Posez votre question juridique"

        );

        if(!question) return;

        const reponse=

        askIA(question);

        saveIAHistory(

        question,

        reponse.answer

        );

        alert(

        reponse.answer

        );

    });

});

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 6/15
    IA JURIDIQUE AVANCEE
==========================================================*/

"use strict";

/*==========================================================
 SOURCES DOCUMENTAIRES
==========================================================*/

IB.ai.sources = {

    codeTravail: [],

    conventions: [],

    arretes: [],

    decrets: [],

    constitution: [],

    jurisprudence: [],

    notes: []

};

/*==========================================================
 CHARGEMENT D'UN FICHIER JSON
==========================================================*/

async function loadJson(url){

    try{

        const response = await fetch(url);

        if(!response.ok){

            throw new Error(url);

        }

        return await response.json();

    }

    catch(error){

        console.error(error);

        addLog(
            "ERREUR",
            "Impossible de charger : " + url
        );

        return [];

    }

}

/*==========================================================
 CHARGEMENT DES SOURCES
==========================================================*/

async function loadAISources(){

    IB.ai.sources.codeTravail =
        await loadJson("data/code-travail.json");

    IB.ai.sources.conventions =
        await loadJson("data/conventions.json");

    IB.ai.sources.arretes =
        await loadJson("data/arretes.json");

    IB.ai.sources.decrets =
        await loadJson("data/decrets.json");

    IB.ai.sources.constitution =
        await loadJson("data/constitution.json");

    IB.ai.sources.jurisprudence =
        await loadJson("data/jurisprudence.json");

    IB.ai.sources.notes =
        await loadJson("data/notes-circulaires.json");

    addLog(
        "IA",
        "Sources documentaires chargées"
    );

}

/*==========================================================
 RECHERCHE GENERALE
==========================================================*/

function searchSource(source,mot){

    mot = mot.toLowerCase();

    return source.filter(item=>{

        const texte = JSON.stringify(item)
            .toLowerCase();

        return texte.includes(mot);

    });

}

/*==========================================================
 RECHERCHE MULTI-SOURCES
==========================================================*/

function searchAllSources(question){

    let resultat = {

        codeTravail: [],

        conventions: [],

        arretes: [],

        decrets: [],

        constitution: [],

        jurisprudence: [],

        notes: []

    };

    const mots = question
        .toLowerCase()
        .split(/\s+/);

    mots.forEach(mot=>{

        if(mot.length<3){

            return;

        }

        resultat.codeTravail.push(

            ...searchSource(
                IB.ai.sources.codeTravail,
                mot
            )

        );

        resultat.conventions.push(

            ...searchSource(
                IB.ai.sources.conventions,
                mot
            )

        );

        resultat.arretes.push(

            ...searchSource(
                IB.ai.sources.arretes,
                mot
            )

        );

        resultat.decrets.push(

            ...searchSource(
                IB.ai.sources.decrets,
                mot
            )

        );

        resultat.constitution.push(

            ...searchSource(
                IB.ai.sources.constitution,
                mot
            )

        );

        resultat.jurisprudence.push(

            ...searchSource(
                IB.ai.sources.jurisprudence,
                mot
            )

        );

        resultat.notes.push(

            ...searchSource(
                IB.ai.sources.notes,
                mot
            )

        );

    });

    return resultat;

}

/*==========================================================
 ANALYSE IA
==========================================================*/

function analyseQuestion(question){

    const resultat =
        searchAllSources(question);

    let rapport = [];

    if(resultat.codeTravail.length){

        rapport.push(

            "📘 Code du Travail : " +

            resultat.codeTravail.length +

            " résultat(s)"

        );

    }

    if(resultat.conventions.length){

        rapport.push(

            "🌍 Conventions OIT : " +

            resultat.conventions.length +

            " résultat(s)"

        );

    }

    if(resultat.arretes.length){

        rapport.push(

            "⚖️ Arrêtés : " +

            resultat.arretes.length +

            " résultat(s)"

        );

    }

    if(resultat.decrets.length){

        rapport.push(

            "📜 Décrets : " +

            resultat.decrets.length +

            " résultat(s)"

        );

    }

    if(resultat.constitution.length){

        rapport.push(

            "📖 Constitution : " +

            resultat.constitution.length +

            " résultat(s)"

        );

    }

    if(resultat.jurisprudence.length){

        rapport.push(

            "🏛️ Jurisprudence : " +

            resultat.jurisprudence.length +

            " résultat(s)"

        );

    }

    if(resultat.notes.length){

        rapport.push(

            "📑 Notes circulaires : " +

            resultat.notes.length +

            " résultat(s)"

        );

    }

    if(rapport.length===0){

        return {

            success:false,

            answer:"Aucun document juridique correspondant."

        };

    }

    return{

        success:true,

        answer:rapport.join("\n"),

        data:resultat

    };

}

/*==========================================================
 INITIALISATION
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        loadAISources();

    }

);

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 7/15
    ANALYSE DES FORMULAIRES
==========================================================*/

"use strict";

/*==========================================================
 BASE DES FORMULAIRES
==========================================================*/

IB.forms = {

    current: null,

    data: {},

    history: []

};

/*==========================================================
 ENREGISTRER UNE FICHE
==========================================================*/

function saveForm(formId){

    const form = document.querySelector("form");

    if(!form){

        return false;

    }

    const data = {};

    form.querySelectorAll(

        "input,select,textarea"

    ).forEach(field=>{

        if(field.type==="checkbox"){

            data[field.name || field.id] =

                field.checked;

        }

        else{

            data[field.name || field.id] =

                field.value;

        }

    });

    Storage.save(

        "form_"+formId,

        data

    );

    IB.forms.data[formId]=data;

    addHistory(

        "Sauvegarde "+formId

    );

    addLog(

        "FORM",

        formId+" sauvegardé"

    );

    return true;

}

/*==========================================================
 CHARGER UNE FICHE
==========================================================*/

function loadForm(formId){

    const data = Storage.load(

        "form_"+formId,

        null

    );

    if(!data){

        return false;

    }

    const form = document.querySelector("form");

    if(!form){

        return false;

    }

    Object.keys(data).forEach(key=>{

        const field =

        form.querySelector(

            "[name='"+key+"'],#"+key

        );

        if(!field){

            return;

        }

        if(field.type==="checkbox"){

            field.checked=data[key];

        }

        else{

            field.value=data[key];

        }

    });

    addLog(

        "FORM",

        formId+" chargé"

    );

    return true;

}

/*==========================================================
 ANALYSE DES CHAMPS
==========================================================*/

function analyseForm(){

    const form=document.querySelector("form");

    if(!form){

        return [];

    }

    const erreurs=[];

    form.querySelectorAll(

        "[required]"

    ).forEach(field=>{

        if(

            field.value.trim()===""

        ){

            erreurs.push({

                champ:

                field.name||

                field.id,

                message:

                "Champ obligatoire"

            });

        }

    });

    return erreurs;

}

/*==========================================================
 SCORE DE COMPLETUDE
==========================================================*/

function formScore(){

    const form=document.querySelector("form");

    if(!form){

        return 0;

    }

    const fields=

    form.querySelectorAll(

        "input,textarea,select"

    );

    let remplis=0;

    fields.forEach(field=>{

        if(field.type==="checkbox"){

            if(field.checked){

                remplis++;

            }

        }

        else if(

            field.value.trim()!==""

        ){

            remplis++;

        }

    });

    return Math.round(

        (remplis/

        fields.length)*100

    );

}

/*==========================================================
 RAPPORT
==========================================================*/

function generateFormReport(){

    const erreurs=

    analyseForm();

    const score=

    formScore();

    let rapport="";

    rapport +=

    "=== RAPPORT ===\n\n";

    rapport +=

    "Complétude : "

    +score+" %\n\n";

    if(erreurs.length===0){

        rapport +=

        "Aucune erreur détectée.";

    }

    else{

        rapport +=

        "Erreurs :\n\n";

        erreurs.forEach(e=>{

            rapport +=

            "- "+e.champ+

            " : "+e.message+

            "\n";

        });

    }

    return rapport;

}

/*==========================================================
 HISTORIQUE DES FICHES
==========================================================*/

function addFormHistory(formId){

    IB.forms.history.unshift({

        form:formId,

        date:new Date()

        .toLocaleString("fr-FR")

    });

    if(

        IB.forms.history.length>100

    ){

        IB.forms.history.pop();

    }

    Storage.save(

        "forms_history",

        IB.forms.history

    );

}

/*==========================================================
 EXPORT PUBLIC
==========================================================*/

window.saveForm = saveForm;

window.loadForm = loadForm;

window.formScore = formScore;

window.analyseForm = analyseForm;

window.generateFormReport = generateFormReport;

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 8/15
    GENERATEUR DE RAPPORTS
==========================================================*/

"use strict";

/*==========================================================
 RAPPORT
==========================================================*/

IB.report = {

    title: "",

    form: "",

    inspector: "",

    company: "",

    created: "",

    data: {}

};

/*==========================================================
 CREER RAPPORT
==========================================================*/

function createReport(formId){

    const form = document.querySelector("form");

    if(!form){

        showMessage(

            "Aucun formulaire trouvé.",

            "error"

        );

        return null;

    }

    const rapport = {

        id: Date.now(),

        form: formId,

        created:

        new Date().toLocaleString("fr-FR"),

        data:{}

    };

    form.querySelectorAll(

        "input,select,textarea"

    ).forEach(field=>{

        let valeur="";

        if(field.type==="checkbox"){

            valeur=field.checked;

        }

        else{

            valeur=field.value;

        }

        rapport.data[

            field.name ||

            field.id

        ] = valeur;

    });

    IB.report = rapport;

    addHistory(

        "Rapport créé : " +

        formId

    );

    return rapport;

}

/*==========================================================
 EXPORT JSON
==========================================================*/

function exportJSON(report){

    const blob = new Blob(

        [

            JSON.stringify(

                report,

                null,

                4

            )

        ],

        {

            type:

            "application/json"

        }

    );

    const lien =

    document.createElement("a");

    lien.href =

    URL.createObjectURL(blob);

    lien.download =

    report.form +

    "_" +

    Date.now() +

    ".json";

    lien.click();

    IB.stats.exports++;

}

/*==========================================================
 EXPORT TEXTE
==========================================================*/

function exportTXT(report){

    let texte="";

    texte +=

    "INSPECTEURBOT IA RDC\n";

    texte +=

    "=========================\n\n";

    texte +=

    "Formulaire : "+

    report.form+"\n";

    texte +=

    "Date : "+

    report.created+"\n\n";

    Object.keys(

        report.data

    ).forEach(key=>{

        texte +=

        key+

        " : "+

        report.data[key]+

        "\n";

    });

    const blob =

    new Blob(

        [texte],

        {

            type:"text/plain"

        }

    );

    const lien=

    document.createElement("a");

    lien.href=

    URL.createObjectURL(blob);

    lien.download=

    report.form+

    ".txt";

    lien.click();

    IB.stats.exports++;

}

/*==========================================================
 IMPRESSION
==========================================================*/

function printReport(report){

    let html="";

    html+="<html>";

    html+="<head>";

    html+="<title>";

    html+=report.form;

    html+="</title>";

    html+="</head>";

    html+="<body>";

    html+="<h1>";

    html+="InspecteurBot IA RDC";

    html+="</h1>";

    html+="<hr>";

    html+="<h2>";

    html+=report.form;

    html+="</h2>";

    html+="<p>";

    html+=report.created;

    html+="</p>";

    html+="<table border='1'";

    html+=" cellspacing='0'";

    html+=" cellpadding='5'>";

    Object.keys(

        report.data

    ).forEach(key=>{

        html+="<tr>";

        html+="<td>";

        html+=key;

        html+="</td>";

        html+="<td>";

        html+=report.data[key];

        html+="</td>";

        html+="</tr>";

    });

    html+="</table>";

    html+="</body>";

    html+="</html>";

    const fenetre =

    window.open(

        "",

        "_blank"

    );

    fenetre.document.write(html);

    fenetre.document.close();

    fenetre.print();

}

/*==========================================================
 EXPORT GLOBAL
==========================================================*/

function exportReport(formId){

    const rapport=

    createReport(formId);

    if(!rapport){

        return;

    }

    const choix=

    prompt(

`Choisissez le format :

1 = JSON

2 = TXT

3 = Imprimer`

    );

    switch(choix){

        case "1":

            exportJSON(

                rapport

            );

        break;

        case "2":

            exportTXT(

                rapport

            );

        break;

        case "3":

            printReport(

                rapport

            );

        break;

        default:

            showMessage(

                "Export annulé.",

                "warning"

            );

    }

}

/*==========================================================
 RACCOURCI EXPORT
==========================================================*/

if($("btnExport")){

    $("btnExport")

    .addEventListener(

        "click",

        ()=>{

            exportReport(

                "InspecteurBot"

            );

        }

    );

}

/*==========================================================
 API
==========================================================*/

window.createReport = createReport;

window.exportReport = exportReport;

window.exportJSON = exportJSON;

window.exportTXT = exportTXT;

window.printReport = printReport;

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 9/15
    GESTION DES MISSIONS
==========================================================*/

"use strict";

/*==========================================================
 MISSION ACTIVE
==========================================================*/

IB.mission = {

    id: null,

    numero: "",

    inspecteur: "",

    entreprise: "",

    adresse: "",

    province: "",

    territoire: "",

    commune: "",

    dateDebut: "",

    dateFin: "",

    statut: "En cours",

    observations: "",

    formulaires: [],

    gps: null

};

/*==========================================================
 CREER UNE MISSION
==========================================================*/

function createMission(){

    IB.mission.id = Date.now();

    IB.mission.numero =

        "MIS-" +

        new Date()

        .getFullYear() +

        "-" +

        IB.mission.id;

    IB.mission.dateDebut =

        new Date()

        .toLocaleString("fr-FR");

    addHistory(

        "Mission créée"

    );

    addLog(

        "MISSION",

        IB.mission.numero

    );

    return IB.mission;

}

/*==========================================================
 ENREGISTRER
==========================================================*/

function saveMission(){

    Storage.save(

        "currentMission",

        IB.mission

    );

}

/*==========================================================
 CHARGER
==========================================================*/

function loadMission(){

    const mission =

    Storage.load(

        "currentMission",

        null

    );

    if(mission){

        IB.mission = mission;

    }

}

/*==========================================================
 TERMINER
==========================================================*/

function finishMission(){

    IB.mission.dateFin =

        new Date()

        .toLocaleString("fr-FR");

    IB.mission.statut =

        "Terminée";

    saveMission();

    addHistory(

        "Mission terminée"

    );

}

/*==========================================================
 AJOUTER UNE FICHE
==========================================================*/

function addFormToMission(

    formId

){

    if(

        !IB.mission.formulaires.includes(

            formId

        )

    ){

        IB.mission.formulaires.push(

            formId

        );

    }

    saveMission();

}

/*==========================================================
 OBSERVATIONS
==========================================================*/

function addObservation(

    texte

){

    if(

        IB.mission.observations===""

    ){

        IB.mission.observations =

        texte;

    }

    else{

        IB.mission.observations +=

        "\n\n"+texte;

    }

    saveMission();

}

/*==========================================================
 GPS
==========================================================*/

function saveMissionGPS(){

    if(

        IB.dashboard.gps

    ){

        IB.mission.gps =

        IB.dashboard.gps;

        saveMission();

    }

}

/*==========================================================
 RESUME
==========================================================*/

function missionSummary(){

    return{

        numero:

        IB.mission.numero,

        entreprise:

        IB.mission.entreprise,

        statut:

        IB.mission.statut,

        formulaires:

        IB.mission.formulaires.length,

        debut:

        IB.mission.dateDebut,

        fin:

        IB.mission.dateFin

    };

}

/*==========================================================
 ARCHIVAGE
==========================================================*/

function archiveMission(){

    let archives =

    Storage.load(

        "missions",

        []

    );

    archives.unshift(

        structuredClone(

            IB.mission

        )

    );

    Storage.save(

        "missions",

        archives

    );

}

/*==========================================================
 LISTE DES MISSIONS
==========================================================*/

function listMissions(){

    return Storage.load(

        "missions",

        []

    );

}

/*==========================================================
 RECHERCHE
==========================================================*/

function searchMission(

numero

){

    const missions =

    listMissions();

    return missions.find(

        m=>m.numero===numero

    );

}

/*==========================================================
 SUPPRESSION
==========================================================*/

function deleteMission(

numero

){

    let missions=

    listMissions();

    missions =

    missions.filter(

        m=>m.numero!==numero

    );

    Storage.save(

        "missions",

        missions

    );

}

/*==========================================================
 INITIALISATION
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadMission();

    if(

        !IB.mission.id

    ){

        createMission();

    }

});

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 10/15
    ASSISTANT IA D'INSPECTION
==========================================================*/

"use strict";

/*==========================================================
 ASSISTANT IA
==========================================================*/

IB.assistant = {

    recommandations: [],

    anomalies: [],

    score: 100,

    rapport: ""

};

/*==========================================================
 AJOUTER UNE RECOMMANDATION
==========================================================*/

function addRecommendation(message){

    IB.assistant.recommandations.push(message);

}

/*==========================================================
 AJOUTER UNE ANOMALIE
==========================================================*/

function addAnomaly(message){

    IB.assistant.anomalies.push(message);

    IB.assistant.score = Math.max(0, IB.assistant.score - 5);

}

/*==========================================================
 ANALYSE DES CHAMPS
==========================================================*/

function analyseInspection(){

    IB.assistant.recommandations = [];

    IB.assistant.anomalies = [];

    IB.assistant.score = 100;

    const form = document.querySelector("form");

    if(!form){

        return;

    }

    form.querySelectorAll(

        "input,select,textarea"

    ).forEach(field=>{

        const value =

            field.type==="checkbox"

            ? field.checked

            : field.value.trim();

        if(field.required){

            if(

                value===false ||

                value===""

            ){

                addAnomaly(

                    "Le champ '" +

                    (field.name||field.id) +

                    "' est obligatoire."

                );

            }

        }

    });

}

/*==========================================================
 REGLES D'INSPECTION
==========================================================*/

function applyInspectionRules(){

    const form = document.querySelector("form");

    if(!form){

        return;

    }

    if(formScore() < 80){

        addRecommendation(

            "Compléter tous les champs du formulaire."

        );

    }

    if(formScore()===100){

        addRecommendation(

            "Le formulaire semble complet."

        );

    }

    if(

        IB.dashboard.network===false

    ){

        addRecommendation(

            "Vous êtes actuellement en mode hors connexion."

        );

    }

}

/*==========================================================
 RAPPORT IA
==========================================================*/

function generateAIRapport(){

    let texte = "";

    texte +=

    "===== ANALYSE IA =====\n\n";

    texte +=

    "Score : " +

    IB.assistant.score +

    "/100\n\n";

    texte +=

    "ANOMALIES\n";

    texte +=

    "------------------\n";

    if(

        IB.assistant.anomalies.length===0

    ){

        texte +=

        "Aucune anomalie détectée.\n";

    }

    else{

        IB.assistant.anomalies.forEach(a=>{

            texte +=

            "- " +

            a +

            "\n";

        });

    }

    texte +=

    "\nRECOMMANDATIONS\n";

    texte +=

    "------------------\n";

    if(

        IB.assistant.recommandations.length===0

    ){

        texte +=

        "Aucune recommandation.\n";

    }

    else{

        IB.assistant.recommandations.forEach(r=>{

            texte +=

            "- " +

            r +

            "\n";

        });

    }

    IB.assistant.rapport = texte;

    return texte;

}

/*==========================================================
 ANALYSE COMPLETE
==========================================================*/

function runInspectionAI(){

    analyseInspection();

    applyInspectionRules();

    const rapport =

    generateAIRapport();

    addHistory(

        "Analyse IA"

    );

    addLog(

        "IA",

        "Inspection analysée"

    );

    return rapport;

}

/*==========================================================
 BOUTON IA
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    ()=>{

        if(!$("btnAssistant")){

            return;

        }

        $("btnAssistant")

        .addEventListener(

            "click",

            ()=>{

                alert(

                    runInspectionAI()

                );

            }

        );

    }

);

/*==========================================================
 API
==========================================================*/

window.runInspectionAI = runInspectionAI;

window.generateAIRapport = generateAIRapport;

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 11/15
    FENETRES MODALES PREMIUM
==========================================================*/

"use strict";

/*==========================================================
 MODALE
==========================================================*/

IB.modal = {

    opened:false,

    element:null

};

/*==========================================================
 CREATION
==========================================================*/

function createModal(){

    if(document.getElementById("ib-modal")){

        return;

    }

    const modal=document.createElement("div");

    modal.id="ib-modal";

    modal.innerHTML=`

<div class="ib-modal-overlay">

    <div class="ib-modal">

        <div class="ib-modal-header">

            <h2 id="ib-modal-title">

                InspecteurBot IA

            </h2>

            <button id="ib-close-modal">

                ✕

            </button>

        </div>

        <div id="ib-modal-body"

        class="ib-modal-body">

        </div>

        <div class="ib-modal-footer">

            <button id="ib-ok">

                Fermer

            </button>

        </div>

    </div>

</div>

`;

    document.body.appendChild(modal);

    IB.modal.element=modal;

    document

    .getElementById(

        "ib-close-modal"

    )

    .onclick=closeModal;

    document

    .getElementById(

        "ib-ok"

    )

    .onclick=closeModal;

}

/*==========================================================
 OUVRIR
==========================================================*/

function openModal(

title,

content

){

    createModal();

    document

    .getElementById(

        "ib-modal-title"

    )

    .textContent=title;

    document

    .getElementById(

        "ib-modal-body"

    )

    .innerHTML=content;

    IB.modal.element.style.display=

    "flex";

    IB.modal.opened=true;

}

/*==========================================================
 FERMER
==========================================================*/

function closeModal(){

    if(!IB.modal.element){

        return;

    }

    IB.modal.element.style.display=

    "none";

    IB.modal.opened=false;

}

/*==========================================================
 MESSAGE
==========================================================*/

function showMessage(

title,

message

){

    openModal(

        title,

        "<p>"+message+"</p>"

    );

}

/*==========================================================
 RAPPORT IA
==========================================================*/

function showAIReport(){

    const rapport=

    runInspectionAI();

    openModal(

        "Rapport IA",

        "<pre>"+rapport+"</pre>"

    );

}

/*==========================================================
 HISTORIQUE
==========================================================*/

function showHistory(){

    let html="<ul>";

    IB.history.forEach(item=>{

        html+=

        "<li>"+

        item+

        "</li>";

    });

    html+="</ul>";

    openModal(

        "Historique",

        html

    );

}

/*==========================================================
 STATISTIQUES
==========================================================*/

function showStats(){

    let html="";

    html+="<p>";

    html+="Recherches : "+

    IB.stats.searches;

    html+="</p>";

    html+="<p>";

    html+="Exports : "+

    IB.stats.exports;

    html+="</p>";

    html+="<p>";

    html+="IA : "+

    IB.stats.ia;

    html+="</p>";

    openModal(

        "Statistiques",

        html

    );

}

/*==========================================================
 EVENEMENTS
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    createModal();

    if($("btnAssistant")){

        $("btnAssistant")

        .addEventListener(

        "click",

        showAIReport

        );

    }

    if($("btnStats")){

        $("btnStats")

        .addEventListener(

        "click",

        showStats

        );

    }

    if($("btnHistory")){

        $("btnHistory")

        .addEventListener(

        "click",

        showHistory

        );

    }

});

/*==========================================================
 API
==========================================================*/

window.openModal=openModal;

window.closeModal=closeModal;

window.showMessage=showMessage;

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 12/15
    NOTIFICATIONS INTELLIGENTES
==========================================================*/

"use strict";

/*==========================================================
 NOTIFICATIONS
==========================================================*/

IB.notifications = [];

IB.system = {

    online: navigator.onLine,

    lastUpdate: null,

    version: APP.VERSION,

    maintenance: false

};

/*==========================================================
 AJOUTER NOTIFICATION
==========================================================*/

function notify(

title,

message="",

type="info"

){

    const notification={

        id:Date.now(),

        title,

        message,

        type,

        date:new Date()

        .toLocaleString("fr-FR")

    };

    IB.notifications.unshift(

        notification

    );

    if(

        IB.notifications.length>100

    ){

        IB.notifications.pop();

    }

    Storage.save(

        "notifications",

        IB.notifications

    );

    showMessage(

        title,

        message

    );

}

/*==========================================================
 CHARGER NOTIFICATIONS
==========================================================*/

function loadNotifications(){

    IB.notifications=

    Storage.load(

        "notifications",

        []

    );

}

/*==========================================================
 SUPPRIMER
==========================================================*/

function clearNotifications(){

    IB.notifications=[];

    Storage.save(

        "notifications",

        []

    );

}

/*==========================================================
 RESEAU
==========================================================*/

window.addEventListener(

"online",

()=>{

    IB.system.online=true;

    notify(

    "Connexion Internet",

    "Connexion rétablie.",

    "success"

    );

});

window.addEventListener(

"offline",

()=>{

    IB.system.online=false;

    notify(

    "Mode Hors Connexion",

    "Les données seront enregistrées localement.",

    "warning"

    );

});

/*==========================================================
 MISE A JOUR
==========================================================*/

function checkUpdate(){

    const actuelle=

    APP.VERSION;

    const derniere=

    Storage.load(

        "lastVersion",

        actuelle

    );

    if(

        actuelle!==derniere

    ){

        notify(

        "Nouvelle Version",

        "InspecteurBot "+actuelle+

        " est installé.",

        "success"

        );

        Storage.save(

        "lastVersion",

        actuelle

        );

    }

    IB.system.lastUpdate=

    new Date()

    .toLocaleString("fr-FR");

}

/*==========================================================
 SURVEILLANCE MEMOIRE
==========================================================*/

function memoryStatus(){

    if(

        performance &&

        performance.memory

    ){

        return{

            used:

            Math.round(

            performance.memory.usedJSHeapSize/

            1048576

            ),

            total:

            Math.round(

            performance.memory.totalJSHeapSize/

            1048576

            )

        };

    }

    return null;

}

/*==========================================================
 SURVEILLANCE STOCKAGE
==========================================================*/

function storageStatus(){

    let total=0;

    for(

        let key in localStorage

    ){

        if(

            localStorage.hasOwnProperty(key)

        ){

            total+=

            localStorage[key]

            .length;

        }

    }

    return Math.round(

        total/1024

    );

}

/*==========================================================
 RAPPORT SYSTEME
==========================================================*/

function systemReport(){

    const mem=

    memoryStatus();

    return{

        version:

        APP.VERSION,

        connexion:

        IB.system.online,

        stockage:

        storageStatus()+" Ko",

        memoire:

        mem,

        notifications:

        IB.notifications.length,

        date:

        new Date()

        .toLocaleString("fr-FR")

    };

}

/*==========================================================
 AFFICHAGE SYSTEME
==========================================================*/

function showSystemReport(){

    const r=

    systemReport();

    let html="";

    html+="<h3>";

    html+="Etat du système";

    html+="</h3>";

    html+="<p>Version : ";

    html+=r.version;

    html+="</p>";

    html+="<p>Connexion : ";

    html+=

    r.connexion?

    "En ligne":

    "Hors ligne";

    html+="</p>";

    html+="<p>Stockage : ";

    html+=r.stockage;

    html+="</p>";

    html+="<p>Notifications : ";

    html+=r.notifications;

    html+="</p>";

    html+="<p>Date : ";

    html+=r.date;

    html+="</p>";

    openModal(

        "Rapport Système",

        html

    );

}

/*==========================================================
 EVENEMENTS
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    loadNotifications();

    checkUpdate();

    if(

        $("btnUpdate")

    ){

        $("btnUpdate")

        .addEventListener(

        "click",

        showSystemReport

        );

    }

});

/*==========================================================
 API
==========================================================*/

window.notify=notify;

window.systemReport=systemReport;

window.showSystemReport=showSystemReport;

window.clearNotifications=clearNotifications;

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 13/15
    OUTILS DE TERRAIN
==========================================================*/

"use strict";

/*==========================================================
 OUTILS
==========================================================*/

IB.tools = {

    recognition: null,

    synthesis: window.speechSynthesis,

    scanner: null,

    camera: null,

    ocrText: ""

};

/*==========================================================
 COMMANDE VOCALE
==========================================================*/

function startVoiceRecognition(){

    const SpeechRecognition =

        window.SpeechRecognition ||

        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        showMessage(

            "Voix",

            "Reconnaissance vocale non disponible."

        );

        return;

    }

    IB.tools.recognition =

        new SpeechRecognition();

    IB.tools.recognition.lang="fr-FR";

    IB.tools.recognition.interimResults=false;

    IB.tools.recognition.start();

    IB.tools.recognition.onresult=(event)=>{

        const texte=

        event.results[0][0].transcript;

        if($("searchInput")){

            $("searchInput").value=texte;

            $("searchInput").dispatchEvent(

                new Event("input")

            );

        }

        notify(

            "Commande vocale",

            texte,

            "success"

        );

    };

}

/*==========================================================
 LECTURE VOCALE
==========================================================*/

function speak(text){

    if(!window.speechSynthesis){

        return;

    }

    const message=

    new SpeechSynthesisUtterance(text);

    message.lang="fr-FR";

    speechSynthesis.speak(message);

}

/*==========================================================
 OCR
==========================================================*/

async function runOCR(file){

    if(typeof Tesseract==="undefined"){

        showMessage(

            "OCR",

            "Bibliothèque OCR absente."

        );

        return;

    }

    notify(

        "OCR",

        "Analyse en cours..."

    );

    const result=

    await Tesseract.recognize(

        file,

        "fra"

    );

    IB.tools.ocrText=

    result.data.text;

    openModal(

        "Texte reconnu",

        "<pre>"+

        IB.tools.ocrText+

        "</pre>"

    );

}

/*==========================================================
 QR CODE
==========================================================*/

function startQRCodeScanner(){

    if(typeof Html5Qrcode==="undefined"){

        showMessage(

            "QR Code",

            "Scanner indisponible."

        );

        return;

    }

    const zone=document.createElement("div");

    zone.id="reader";

    document.body.appendChild(zone);

    IB.tools.scanner=

    new Html5Qrcode("reader");

    IB.tools.scanner.start(

        {

            facingMode:"environment"

        },

        {

            fps:10,

            qrbox:250

        },

        (text)=>{

            notify(

                "QR Code",

                text,

                "success"

            );

            IB.tools.scanner.stop();

            zone.remove();

        }

    );

}

/*==========================================================
 PHOTO
==========================================================*/

function capturePhoto(){

    const input=

    document.createElement("input");

    input.type="file";

    input.accept="image/*";

    input.capture="environment";

    input.onchange=(e)=>{

        const file=

        e.target.files[0];

        if(file){

            notify(

                "Photo",

                file.name,

                "success"

            );

        }

    };

    input.click();

}

/*==========================================================
 EVENEMENTS
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    if($("btnVoice")){

        $("btnVoice")

        .addEventListener(

            "click",

            startVoiceRecognition

        );

    }

    if($("btnCamera")){

        $("btnCamera")

        .addEventListener(

            "click",

            capturePhoto

        );

    }

});

/*==========================================================
 API
==========================================================*/

window.startVoiceRecognition=

startVoiceRecognition;

window.speak=speak;

window.runOCR=runOCR;

window.startQRCodeScanner=

startQRCodeScanner;

window.capturePhoto=capturePhoto;

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 14/15
    OUTILS AVANCES
==========================================================*/

"use strict";

/*==========================================================
 THEME
==========================================================*/

IB.theme = Storage.load(

    "theme",

    "dark"

);

function applyTheme(){

    document.body.setAttribute(

        "data-theme",

        IB.theme

    );

    Storage.save(

        "theme",

        IB.theme

    );

}

function toggleTheme(){

    IB.theme =

    IB.theme==="dark"

    ? "light"

    : "dark";

    applyTheme();

    notify(

        "Thème",

        "Mode "+IB.theme

    );

}

/*==========================================================
 TRADUCTION
==========================================================*/

IB.language = Storage.load(

    "language",

    "fr"

);

function changeLanguage(lang){

    IB.language = lang;

    Storage.save(

        "language",

        lang

    );

    notify(

        "Langue",

        "Langue : "+lang

    );

}

/*==========================================================
 AGENDA
==========================================================*/

IB.calendar = Storage.load(

    "calendar",

    []

);

function addEvent(

    title,

    date

){

    IB.calendar.push({

        id:Date.now(),

        title,

        date

    });

    Storage.save(

        "calendar",

        IB.calendar

    );

}

function removeEvent(id){

    IB.calendar=

    IB.calendar.filter(

        e=>e.id!==id

    );

    Storage.save(

        "calendar",

        IB.calendar

    );

}

function showAgenda(){

    let html="<ul>";

    if(

        IB.calendar.length===0

    ){

        html+="<li>Aucun rendez-vous.</li>";

    }

    else{

        IB.calendar.forEach(event=>{

            html+="<li>";

            html+=event.date;

            html+=" - ";

            html+=event.title;

            html+="</li>";

        });

    }

    html+="</ul>";

    openModal(

        "Agenda",

        html

    );

}

/*==========================================================
 STATISTIQUES
==========================================================*/

function updateStatistics(){

    IB.stats.lastAccess=

    new Date()

    .toLocaleString(

        "fr-FR"

    );

    Storage.save(

        "stats",

        IB.stats

    );

}

function resetStatistics(){

    IB.stats={

        searches:0,

        exports:0,

        ia:0,

        consultations:0,

        favoris:0,

        lastAccess:null

    };

    updateStatistics();

}

/*==========================================================
 HISTORIQUE
==========================================================*/

function clearHistory(){

    IB.history=[];

    Storage.save(

        "history",

        []

    );

}

function exportHistory(){

    const blob=

    new Blob(

        [

            JSON.stringify(

                IB.history,

                null,

                4

            )

        ],

        {

            type:

            "application/json"

        }

    );

    const link=

    document.createElement(

        "a"

    );

    link.href=

    URL.createObjectURL(blob);

    link.download=

    "historique.json";

    link.click();

}

/*==========================================================
 RACCOURCIS
==========================================================*/

document.addEventListener(

"DOMContentLoaded",

()=>{

    applyTheme();

    updateStatistics();

    if($("btnTheme")){

        $("btnTheme")

        .addEventListener(

            "click",

            toggleTheme

        );

    }

    if($("langSwitcher")){

        $("langSwitcher").value=

        IB.language;

        $("langSwitcher")

        .addEventListener(

            "change",

            e=>{

                changeLanguage(

                    e.target.value

                );

            }

        );

    }

    if($("btnCalendar")){

        $("btnCalendar")

        .addEventListener(

            "click",

            showAgenda

        );

    }

});

/*==========================================================
 API
==========================================================*/

window.toggleTheme=

toggleTheme;

window.changeLanguage=

changeLanguage;

window.addEvent=

addEvent;

window.removeEvent=

removeEvent;

window.showAgenda=

showAgenda;

window.updateStatistics=

updateStatistics;

window.resetStatistics=

resetStatistics;

window.clearHistory=

clearHistory;

window.exportHistory=

exportHistory;

/* ==================================================================
   APP.JS — Contrôleur principal (extrait — LOT 1)
   ================================================================== */

// Horloge & date
function updateClock() {
  const now = new Date();
  const tEl = document.getElementById("currentTime");
  const dEl = document.getElementById("currentDate");
  if (tEl) tEl.textContent = now.toLocaleTimeString("fr-FR");
  if (dEl) dEl.textContent = now.toLocaleDateString("fr-FR", {weekday:"long", day:"numeric", month:"long", year:"numeric"});
}
setInterval(updateClock, 1000); updateClock();

// Recherche globale (barre top)
const searchInput = document.getElementById("searchInput");
if (searchInput) {
  searchInput.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const q = searchInput.value.trim();
      if (!q) return;
      const r = AI_CORE.ask(q);
      alert(r.text); // temporaire — sera remplacé par un panneau dans LOT 3
    }
  });
}

// Bouton IA → ouvrir assistant (LOT 3)
const btnAssistant = document.getElementById("btnAssistant");
if (btnAssistant) btnAssistant.addEventListener("click", () => {
  window.location.href = "ia/assistant.html";
});

// Bouton Thème
const btnTheme = document.getElementById("btnTheme");
if (btnTheme) btnTheme.addEventListener("click", () => {
  document.body.classList.toggle("light-theme");
  localStorage.setItem("igt_theme", document.body.classList.contains("light-theme") ? "light" : "dark");
});
if (localStorage.getItem("igt_theme") === "light") document.body.classList.add("light-theme");

console.log("✅ InspecteurBot IA RDC 4.0 — LOT 1 chargé");
console.log("🧠 IA prête :", AI_CORE.name, "v" + AI_CORE.version);

/*==========================================================
    INSPECTEURBOT IA RDC 4.0 PREMIUM
    APP.JS
    PARTIE 15/15
    BOOTSTRAP FINAL
==========================================================*/

"use strict";

/*==========================================================
 DEMARRAGE
==========================================================*/

IB.ready = false;

/*==========================================================
 INITIALISATION
==========================================================*/

async function initializeApp(){

    try{

        log("Initialisation...");

        /* Configuration */

        if(typeof loadConfig==="function"){

            loadConfig();

        }

        /* Journal */

        if(typeof loadLogs==="function"){

            loadLogs();

        }

        /* Notifications */

        if(typeof loadNotifications==="function"){

            loadNotifications();

        }

        /* Historique */

        if(!IB.history){

            IB.history=[];

        }

        /* Statistiques */

        if(!IB.stats){

            IB.stats={

                searches:0,

                exports:0,

                ia:0,

                consultations:0,

                favoris:0

            };

        }

        /* Tableau de bord */

        if(typeof refreshDashboard==="function"){

            refreshDashboard();

        }

        /* Recherche */

        if(typeof buildSearchIndex==="function"){

            buildSearchIndex();

        }

        /* IA */

        if(typeof loadCodeTravail==="function"){

            await loadCodeTravail();

        }

        if(typeof loadAISources==="function"){

            await loadAISources();

        }

        /* Mission */

        if(typeof loadMission==="function"){

            loadMission();

        }

        if(!IB.mission.id){

            createMission();

        }

        /* Thème */

        if(typeof applyTheme==="function"){

            applyTheme();

        }

        /* Statistiques */

        if(typeof updateStatistics==="function"){

            updateStatistics();

        }

        /* Version */

        if(typeof checkUpdate==="function"){

            checkUpdate();

        }

        IB.ready=true;

        addLog(

            "SYSTEM",

            "Application démarrée"

        );

        notify(

            "InspecteurBot IA RDC",

            "Application prête.",

            "success"

        );

    }

    catch(error){

        console.error(error);

        showMessage(

            "Erreur",

            error.message

        );

    }

}

/*==========================================================
 RACCOURCIS CLAVIER
==========================================================*/

document.addEventListener(

    "keydown",

    function(event){

        if(

            event.ctrlKey &&

            event.key==="f"

        ){

            event.preventDefault();

            if($("searchInput")){

                $("searchInput").focus();

            }

        }

        if(

            event.key==="Escape"

        ){

            closeModal();

        }

    }

);

/*==========================================================
 VISIBILITE
==========================================================*/

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            addLog(

                "SYSTEM",

                "Application en arrière-plan"

            );

        }

        else{

            addLog(

                "SYSTEM",

                "Application active"

            );

        }

    }

);

/*==========================================================
 REDIMENSIONNEMENT
==========================================================*/

window.addEventListener(

    "resize",

    ()=>{

        IB.screen={

            width:window.innerWidth,

            height:window.innerHeight

        };

    }

);

/*==========================================================
 GESTION DES ERREURS
==========================================================*/

window.addEventListener(

    "error",

    function(event){

        addLog(

            "ERREUR",

            event.message

        );

    }

);

/*==========================================================
 DEMARRAGE
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeApp

);

/*==========================================================
 API PUBLIQUE
==========================================================*/

window.IB = IB;

window.initializeApp = initializeApp;

window.APP = APP;

console.log(

    "%cInspecteurBot IA RDC 4.0 Premium",

    "color:#00c853;font-size:16px;font-weight:bold"

);

console.log(

    "Application initialisée."

);
