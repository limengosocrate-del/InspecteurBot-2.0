/* ==========================================================
   InspecteurBot IA RDC
   Module : Sanctions & Infractions
   Fichier : App-sanctions.js
   Partie 1 : Initialisation & Navigation
========================================================== */

class InspecteurBotSanctions {

    constructor() {

        this.currentView = "dashboard";
        this.history = ["dashboard"];

        this.views = [];
        this.backBtn = null;
        this.appTitle = null;

    }

    /* ============================================
       Initialisation
    ============================================ */

    init() {

        console.log("InspecteurBot Sanctions : Initialisation...");

        this.views = document.querySelectorAll(".view");

        this.backBtn = document.getElementById("back-btn");
        this.appTitle = document.getElementById("app-title");

        this.initButtons();

        this.loadTheme();

        this.initInfractions();

       this.initInfractionsEvents();

       this.updateInfractionStats();

        this.loadFavorites();
       
        this.initAIM();

       this.initAIMEvents();

       this.loadAIMHistory();

       this.initBibliotheque();

       this.initBibliothequeEvents();

       this.initArticlesCodeTravail();

       this.initAssistantIA();

       this.loadAIConnection();
       
       this.loadAIHistory();

       this.initArchives();

       this.initStatistics();

        this.showView("dashboard", false);

        console.log("Application prête.");

    }

    /* ============================================
       Boutons principaux
    ============================================ */

    initButtons() {

        const themeBtn = document.getElementById("theme-btn");
        const searchBtn = document.getElementById("search-btn");
        const menuBtn = document.getElementById("menu-btn");
        const notificationBtn = document.getElementById("notification-btn");

        if (themeBtn) {

            themeBtn.addEventListener("click", () => {

                this.toggleTheme();

            });

        }

        if (searchBtn) {

            searchBtn.addEventListener("click", () => {

                this.openSearch();

            });

        }

        if (menuBtn) {

            menuBtn.addEventListener("click", () => {

                this.openMenu();

            });

        }

        if (notificationBtn) {

            notificationBtn.addEventListener("click", () => {

                this.openNotifications();

            });

        }

    }

    /* ============================================
       Navigation
    ============================================ */

    navTo(viewId, title = "") {

        this.showView(viewId, true);

        if (title !== "" && this.appTitle) {

            this.appTitle.textContent = title;

        }

    }

    showView(viewId, saveHistory = true) {

        this.views.forEach(view => {

            view.style.display = "none";
            view.classList.remove("active");

        });

        const selectedView = document.getElementById(viewId);

        if (!selectedView) {

            console.warn("Vue introuvable :", viewId);
            return;

        }

        selectedView.style.display = "block";
        selectedView.classList.add("active");

        this.currentView = viewId;

        if (saveHistory) {

            const last = this.history[this.history.length - 1];

            if (last !== viewId) {

                this.history.push(viewId);

            }

        }

        this.updateBackButton();

        window.scrollTo({

            top: 0,
            behavior: "smooth"

        });

    }

    /* ============================================
       Retour
    ============================================ */

    goBack() {

        if (this.history.length <= 1) {

            this.showView("dashboard", false);

            if (this.appTitle) {

                this.appTitle.textContent =
                    "Sanctions & Infractions";

            }

            return;

        }

        this.history.pop();

        const previous = this.history[this.history.length - 1];

        this.showView(previous, false);

        if (previous === "dashboard") {

            this.appTitle.textContent =
                "Sanctions & Infractions";

        }

    }

    updateBackButton() {

        if (!this.backBtn) return;

        if (this.currentView === "dashboard") {

            this.backBtn.classList.add("hidden");

        } else {

            this.backBtn.classList.remove("hidden");

        }

    }

    /* ============================================
       Placeholders
       (complétés dans les prochaines parties)
    ============================================ */

    toggleTheme() {

        console.log("Thème");

    }

    openSearch() {

        console.log("Recherche");

    }

    openMenu() {

        console.log("Menu");

    }

    openNotifications() {

        console.log("Notifications");

    }

}

/* ============================================
   Instance Globale
============================================ */

const app = new InspecteurBotSanctions();

/* ============================================
   Démarrage
============================================ */

document.addEventListener("DOMContentLoaded", () => {

    app.init();

});


/* ==========================================================
   PARTIE 2
   Thème - Recherche - Notifications - Menu
========================================================== */

/* ===============================
   Mode sombre / clair
=============================== */

toggleTheme() {

    const html = document.documentElement;

    const themeBtn = document.getElementById("theme-btn");

    const icon = themeBtn ? themeBtn.querySelector("i") : null;

    let current = html.getAttribute("data-theme") || "light";

    const next = current === "light" ? "dark" : "light";

    html.setAttribute("data-theme", next);

    localStorage.setItem("inspecteurbot-theme", next);

    if (icon) {

        icon.className = next === "dark"
            ? "fa-regular fa-sun"
            : "fa-regular fa-moon";

    }

}

/* ===============================
   Charger le thème
=============================== */

loadTheme() {

    const saved = localStorage.getItem("inspecteurbot-theme") || "light";

    document.documentElement.setAttribute("data-theme", saved);

    const icon = document.querySelector("#theme-btn i");

    if (icon) {

        icon.className = saved === "dark"
            ? "fa-regular fa-sun"
            : "fa-regular fa-moon";

    }

}

/* ===============================
   Recherche
=============================== */

openSearch() {

    const input = document.querySelector(
        "#recherche #globalSearch"
    );

    if (input) {

        this.navTo(
            "recherche",
            "Recherche Intelligente"
        );

        setTimeout(() => {

            input.focus();

        }, 250);

    }

}

/* ===============================
   Notifications
=============================== */

openNotifications() {

    alert(
`InspecteurBot

Notifications :

• 3 nouvelles mises à jour disponibles.

• Le module AIM 006/127 est disponible.

• La bibliothèque juridique a été actualisée.`
    );

}

/* ===============================
   Menu principal
=============================== */

openMenu() {

    const choix = prompt(
`MENU INSPECTEURBOT

1 = Accueil
2 = Les 65 Infractions
3 = AIM 006/127
4 = Sanctions
5 = Bibliothèque
6 = Académie
7 = Cas pratiques
8 = Recherche

Entrez un numéro :`
    );

    switch (choix) {

        case "1":

            this.navTo(
                "dashboard",
                "Sanctions & Infractions"
            );

            break;

        case "2":

            this.navTo(
                "infractions65",
                "Les 65 Infractions"
            );

            break;

        case "3":

            this.navTo(
                "aim006",
                "Tableau AIM 006/127"
            );

            break;

        case "4":

            this.navTo(
                "sanctions",
                "Bibliothèque des Sanctions"
            );

            break;

        case "5":

            this.navTo(
                "bibliotheque",
                "Bibliothèque Juridique"
            );

            break;

        case "6":

            this.navTo(
                "academie",
                "Académie InspecteurBot"
            );

            break;

        case "7":

            this.navTo(
                "cas-pratiques",
                "Cas Pratiques"
            );

            break;

        case "8":

            this.navTo(
                "recherche",
                "Recherche Intelligente"
            );

            break;

    }

    }

/* ==========================================================
   PARTIE 3A
   Les 65 Infractions
   Base de données + Génération du tableau
========================================================== */

/* ===============================
   Initialisation du module
=============================== */

initInfractions() {

    this.infractions = [

        {
            id: 1,
            categorie: "Contrat",
            article: "Art. 1",
            infraction: "Infraction exemple",
            montant: "100 000 FC",
            details: "Cette fiche sera remplacée progressivement par les données officielles."
        },

        {
            id: 2,
            categorie: "Salaire",
            article: "Art. 2",
            infraction: "Infraction exemple",
            montant: "150 000 FC",
            details: "Cette fiche sera remplacée progressivement par les données officielles."
        },

        {
            id: 3,
            categorie: "Sécurité",
            article: "Art. 3",
            infraction: "Infraction exemple",
            montant: "250 000 FC",
            details: "Cette fiche sera remplacée progressivement par les données officielles."
        }

    ];

    this.renderInfractions(this.infractions);

}

/* ===============================
   Génération du tableau
=============================== */

renderInfractions(data) {

    const tbody = document.getElementById("infractionsTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `

        <tr>

            <td>${item.id}</td>

            <td>${item.infraction}</td>

            <td>${item.article}</td>

            <td>${item.montant}</td>

            <td>

                <button
                    class="btn btn-outline"
                    onclick="app.showInfraction(${item.id})">

                    Voir

                </button>

            </td>

        </tr>

        `;

    });

}

/* ===============================
   Détails
=============================== */

showInfraction(id) {

    const infraction = this.infractions.find(i => i.id === id);

    if (!infraction) return;

    const zone = document.getElementById("infractionDetails");

    if (!zone) return;

    zone.innerHTML = `

    <div class="card">

        <h3>${infraction.infraction}</h3>

        <p><strong>Article :</strong> ${infraction.article}</p>

        <p><strong>Catégorie :</strong> ${infraction.categorie}</p>

        <p><strong>Montant :</strong> ${infraction.montant}</p>

        <hr>

        <p>${infraction.details}</p>

    </div>

    `;

    zone.scrollIntoView({

        behavior: "smooth"

    });

    }

/* ==========================================================
   PARTIE 3B
   Recherche + Filtres des 65 Infractions
========================================================== */

/* ===============================
   Initialisation des événements
=============================== */

initInfractionsEvents() {

    const search = document.getElementById("searchInfraction");

    if (search) {

        search.addEventListener("input", (e) => {

            this.searchInfractions(e.target.value);

        });

    }

    document.querySelectorAll(".filter-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            document
                .querySelectorAll(".filter-btn")
                .forEach(b => b.classList.remove("active"));

            btn.classList.add("active");

            this.filterInfractions(btn.textContent.trim());

        });

    });

}

/* ===============================
   Recherche
=============================== */

searchInfractions(keyword) {

    keyword = keyword.toLowerCase().trim();

    const resultat = this.infractions.filter(item => {

        return (

            item.infraction.toLowerCase().includes(keyword) ||

            item.article.toLowerCase().includes(keyword) ||

            item.categorie.toLowerCase().includes(keyword) ||

            item.details.toLowerCase().includes(keyword)

        );

    });

    this.renderInfractions(resultat);

}

/* ===============================
   Filtre
=============================== */

filterInfractions(categorie) {

    if (

        categorie === "Toutes" ||

        categorie === ""

    ) {

        this.renderInfractions(this.infractions);

        return;

    }

    const resultat = this.infractions.filter(item =>

        item.categorie.toLowerCase() === categorie.toLowerCase()

    );

    this.renderInfractions(resultat);

}

/* ===============================
   Actualiser les statistiques
=============================== */

updateInfractionStats() {

    const compteur = document.getElementById("statInfractions");

    if (compteur) {

        compteur.textContent = this.infractions.length;

    }

}

/* ==========================================================
   PARTIE 3C
   Fiche détaillée - Favoris - Impression
========================================================== */

/* ===============================
   Affichage détaillé
=============================== */

showInfraction(id) {

    const item = this.infractions.find(i => i.id === id);

    if (!item) return;

    const container = document.getElementById("infractionDetails");

    if (!container) return;

    container.innerHTML = `

    <div class="card">

        <h2>${item.infraction}</h2>

        <hr>

        <p><strong>N° :</strong> ${item.id}</p>

        <p><strong>Catégorie :</strong> ${item.categorie}</p>

        <p><strong>Article :</strong> ${item.article}</p>

        <p><strong>Montant :</strong> ${item.montant}</p>

        <hr>

        <h3>Description</h3>

        <p>${item.details}</p>

        <hr>

        <h3>Conseil professionnel</h3>

        <p>

        Vérifiez toujours les éléments matériels de
        l'infraction avant toute verbalisation.

        </p>

        <div class="action-buttons">

            <button
                class="btn"
                onclick="app.addFavorite(${item.id})">

                <i class="fa-solid fa-star"></i>

                Ajouter aux favoris

            </button>

            <button
                class="btn btn-outline"
                onclick="app.printInfraction(${item.id})">

                <i class="fa-solid fa-print"></i>

                Imprimer

            </button>

        </div>

    </div>

    `;

    container.scrollIntoView({

        behavior: "smooth"

    });

}

/* ===============================
   Favoris
=============================== */

addFavorite(id) {

    let favoris = JSON.parse(

        localStorage.getItem("inspecteurbot-favoris") || "[]"

    );

    if (!favoris.includes(id)) {

        favoris.push(id);

        localStorage.setItem(

            "inspecteurbot-favoris",

            JSON.stringify(favoris)

        );

        alert("Infraction ajoutée aux favoris.");

    } else {

        alert("Cette infraction est déjà enregistrée.");

    }

}

/* ===============================
   Impression
=============================== */

printInfraction(id) {

    const item = this.infractions.find(i => i.id === id);

    if (!item) return;

    const w = window.open("", "_blank");

    w.document.write(`

    <html>

    <head>

        <title>${item.infraction}</title>

        <style>

            body{

                font-family:Arial;

                padding:30px;

                line-height:1.7;

            }

            h1{

                color:#0b4f75;

            }

        </style>

    </head>

    <body>

        <h1>${item.infraction}</h1>

        <hr>

        <p><b>Article :</b> ${item.article}</p>

        <p><b>Catégorie :</b> ${item.categorie}</p>

        <p><b>Montant :</b> ${item.montant}</p>

        <hr>

        <p>${item.details}</p>

    </body>

    </html>

    `);

    w.document.close();

    w.focus();

    w.print();

}

/* ===============================
   Charger les favoris
=============================== */

loadFavorites() {

    this.favoris = JSON.parse(

        localStorage.getItem("inspecteurbot-favoris") || "[]"

    );

}

/* ==========================================================
   PARTIE 4A
   Tableau AIM 006/127
   Base de données + Génération du tableau
========================================================== */

/* ===============================
   Initialisation AIM
=============================== */

initAIM() {

    this.aimData = [

        {
            id: 1,
            sanction: "Absence de contrat de travail",
            categorieA: "50 USD",
            categorieB: "100 USD",
            categorieC: "150 USD",
            details: "Montant applicable selon la catégorie de l'entreprise."
        },

        {
            id: 2,
            sanction: "Non-paiement du salaire",
            categorieA: "100 USD",
            categorieB: "200 USD",
            categorieC: "300 USD",
            details: "Sanction administrative prévue par le barème AIM."
        },

        {
            id: 3,
            sanction: "Non-respect des règles de sécurité",
            categorieA: "150 USD",
            categorieB: "300 USD",
            categorieC: "500 USD",
            details: "Applicable lorsqu'un danger est constaté."
        }

    ];

    this.renderAIMTable(this.aimData);

}

/* ===============================
   Génération du tableau AIM
=============================== */

renderAIMTable(data) {

    const tbody = document.getElementById("aimTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    data.forEach(item => {

        tbody.innerHTML += `

        <tr>

            <td>${item.sanction}</td>

            <td>${item.categorieA}</td>

            <td>${item.categorieB}</td>

            <td>${item.categorieC}</td>

            <td>

                <button
                    class="btn btn-outline"
                    onclick="app.showAIMDetails(${item.id})">

                    Voir

                </button>

            </td>

        </tr>

        `;

    });

}

/* ===============================
   Détails AIM
=============================== */

showAIMDetails(id) {

    const item = this.aimData.find(a => a.id === id);

    if (!item) return;

    const zone = document.getElementById("aimDetails");

    if (!zone) return;

    zone.innerHTML = `

    <div class="card">

        <h2>${item.sanction}</h2>

        <hr>

        <p><strong>Catégorie A :</strong> ${item.categorieA}</p>

        <p><strong>Catégorie B :</strong> ${item.categorieB}</p>

        <p><strong>Catégorie C :</strong> ${item.categorieC}</p>

        <hr>

        <p>${item.details}</p>

    </div>

    `;

    zone.scrollIntoView({

        behavior: "smooth"

    });

}

/* ==========================================================
   PARTIE 4B
   AIM 006/127
   Recherche + Calculateur automatique
========================================================== */


/* ===============================
   Initialisation événements AIM
=============================== */

initAIMEvents(){

    const search = document.getElementById("searchAim");


    if(search){

        search.addEventListener("input",(e)=>{

            this.searchAIM(e.target.value);

        });

    }


    const select = document.getElementById("calcInfraction");


    if(select){

        this.loadAIMOptions();

    }

}



/* ===============================
   Recherche AIM
=============================== */

searchAIM(keyword){

    keyword = keyword
        .toLowerCase()
        .trim();


    const result = this.aimData.filter(item=>{


        return (

            item.sanction
            .toLowerCase()
            .includes(keyword)

            ||

            item.details
            .toLowerCase()
            .includes(keyword)

        );


    });


    this.renderAIMTable(result);

}



/* ===============================
   Charger les infractions
   dans le calculateur
=============================== */

loadAIMOptions(){


    const select =
        document.getElementById("calcInfraction");


    if(!select) return;


    select.innerHTML = `

        <option value="">
            Sélectionner une infraction
        </option>

    `;


    this.aimData.forEach(item=>{


        select.innerHTML += `

        <option value="${item.id}">

            ${item.sanction}

        </option>

        `;


    });


}



/* ===============================
   Ouvrir calculateur AIM
=============================== */

openAimCalculator(){


    const zone =
        document.getElementById("calculateur");


    if(zone){

        this.navTo(
            "calculateur",
            "Calculateur Intelligent des Sanctions"
        );

    }


}



/* ===============================
   Calcul sanction AIM
=============================== */

calculateSanction(){


    const id =
        document.getElementById(
            "calcInfraction"
        )?.value;



    const categorie =
        document.getElementById(
            "calcCategorie"
        )?.value;



    if(!id){

        alert(
            "Veuillez sélectionner une infraction."
        );

        return;

    }



    const item =
        this.aimData.find(
            a=>a.id == id
        );



    if(!item) return;



    let montant;



    if(categorie==="A"){

        montant=item.categorieA;

    }

    else if(categorie==="B"){

        montant=item.categorieB;

    }

    else{

        montant=item.categorieC;

    }



    let majoration = 0;



    if(
        document.getElementById("recidive")
        ?.checked
    ){

        majoration += 50;

    }



    if(
        document.getElementById("danger")
        ?.checked
    ){

        majoration += 100;

    }



    if(
        document.getElementById("enfant")
        ?.checked
    ){

        majoration += 200;

    }



    if(
        document.getElementById("non-conformite")
        ?.checked
    ){

        majoration += 50;

    }



    const montantFinal =
        montant.replace(
            " USD",
            ""
        );



    const total =
        Number(montantFinal)
        +
        majoration;



    const resultat =
        document.getElementById(
            "calculationResult"
        );



    if(resultat){


        resultat.innerHTML = `


        <div class="card">


            <h3>

            Résultat du calcul

            </h3>


            <p>

            <strong>Infraction :</strong>
            ${item.sanction}

            </p>


            <p>

            <strong>Catégorie :</strong>
            ${categorie}

            </p>


            <p>

            <strong>Montant de base :</strong>
            ${montant}

            </p>


            <p>

            <strong>Majoration :</strong>
            ${majoration} USD

            </p>


            <hr>


            <h2>

            Total :
            ${total} USD

            </h2>


        </div>


        `;


    }



    this.saveCalculation({

        infraction:item.sanction,

        categorie:categorie,

        montant:total,

        date:new Date()
        .toLocaleString()

    });


}



/* ===============================
   Historique calculs
=============================== */

saveCalculation(data){


    let history =
        JSON.parse(
            localStorage.getItem(
                "aim-history"
            )
            ||
            "[]"
        );


    history.unshift(data);



    localStorage.setItem(

        "aim-history",

        JSON.stringify(history)

    );


   }

/* ==========================================================
   PARTIE 4C
   AIM 006/127
   Historique + Analyse + Gestion
========================================================== */


/* ===============================
   Charger historique AIM
=============================== */

loadAIMHistory(){

    const container =
        document.getElementById(
            "calculatorHistory"
        );


    if(!container) return;


    const history =
        JSON.parse(

            localStorage.getItem(
                "aim-history"
            )
            ||
            "[]"

        );


    if(history.length === 0){


        container.innerHTML = `

        <p class="empty">

        Aucun calcul enregistré.

        </p>

        `;

        return;

    }



    container.innerHTML = "";



    history.forEach((item,index)=>{


        container.innerHTML += `


        <div class="history-item">


            <h4>

            ${item.infraction}

            </h4>


            <p>

            Catégorie :
            ${item.categorie}

            </p>


            <p>

            Montant :
            ${item.montant} USD

            </p>


            <small>

            ${item.date}

            </small>



            <button

            class="btn btn-danger"

            onclick="app.deleteAIMHistory(${index})">

            Supprimer

            </button>


        </div>


        `;


    });


}



/* ===============================
   Supprimer un calcul
=============================== */

deleteAIMHistory(index){


    let history =
        JSON.parse(

            localStorage.getItem(
                "aim-history"
            )
            ||
            "[]"

        );


    history.splice(index,1);



    localStorage.setItem(

        "aim-history",

        JSON.stringify(history)

    );



    this.loadAIMHistory();


}



/* ===============================
   Effacer tout historique
=============================== */

clearAIMHistory(){


    if(
        confirm(
            "Supprimer tout l'historique AIM ?"
        )
    ){


        localStorage.removeItem(
            "aim-history"
        );


        this.loadAIMHistory();


    }


}



/* ===============================
   Analyse intelligente
=============================== */

analyseSanction(montant){


    montant =
        Number(montant);



    if(montant >= 500){


        return {

            niveau:"Très grave",

            message:
            "Une action immédiate et un suivi renforcé sont recommandés."

        };


    }



    if(montant >= 200){


        return {

            niveau:"Grave",

            message:
            "Une mise en demeure et un contrôle de régularisation sont recommandés."

        };


    }



    return {


        niveau:"Modérée",


        message:
        "Une correction administrative doit être suivie."


    };


}



/* ===============================
   Export préparation
=============================== */

prepareAIMExport(){


    const history =
        JSON.parse(

            localStorage.getItem(
                "aim-history"
            )
            ||
            "[]"

        );



    return JSON.stringify(

        history,

        null,

        2

    );


}



/* ===============================
   Lien futur PV
=============================== */

sendToPV(data){


    localStorage.setItem(

        "pv-from-sanction",

        JSON.stringify(data)

    );


    console.log(

        "Données envoyées au module PV"

    );


}

/* ==========================================================
   PARTIE 5A
   BIBLIOTHÈQUE JURIDIQUE
   Base juridique + Affichage
========================================================== */


/* ===============================
   Initialisation bibliothèque
=============================== */

initBibliotheque(){


    this.documentsJuridiques = [


        {
            id:1,

            type:"Code du Travail",

            titre:
            "Code du Travail de la RDC",

            reference:
            "Loi n°015/2002",

            description:
            "Texte principal régissant les relations de travail en République Démocratique du Congo.",

            contenu:
            "Articles du Code du Travail applicables aux travailleurs et employeurs."
        },


        {
            id:2,

            type:"Arrêté",

            titre:
            "Arrêté sur les sanctions administratives",

            reference:
            "AIM 006/127",

            description:
            "Barème des amendes et sanctions applicables par l'Inspection du Travail.",

            contenu:
            "Tableau des infractions et montants correspondants."
        },


        {
            id:3,

            type:"Convention",

            titre:
            "Conventions internationales OIT",

            reference:
            "Organisation Internationale du Travail",

            description:
            "Normes internationales relatives au travail.",

            contenu:
            "Principes fondamentaux du droit du travail."
        }


    ];


    this.renderBibliotheque(
        this.documentsJuridiques
    );


}



/* ===============================
   Affichage bibliothèque
=============================== */

renderBibliotheque(data){


    const container =
        document.getElementById(
            "bibliothequeList"
        );


    if(!container) return;



    container.innerHTML="";



    data.forEach(doc=>{


        container.innerHTML += `


        <div class="document-card">


            <div>


                <h3>

                ${doc.titre}

                </h3>


                <p>

                <strong>
                Type :
                </strong>

                ${doc.type}

                </p>


                <p>

                <strong>
                Référence :
                </strong>

                ${doc.reference}

                </p>


            </div>



            <button

            class="btn"

            onclick="app.openDocument(${doc.id})">


            Consulter


            </button>


        </div>


        `;


    });


}



/* ===============================
   Ouvrir document
=============================== */

openDocument(id){


    const doc =
        this.documentsJuridiques.find(

            d=>d.id===id

        );



    if(!doc) return;



    const zone =
        document.getElementById(
            "documentDetails"
        );



    if(!zone) return;



    zone.innerHTML = `


    <div class="card">


        <h2>

        ${doc.titre}

        </h2>


        <hr>


        <p>

        <strong>
        Type :
        </strong>

        ${doc.type}

        </p>


        <p>

        <strong>
        Référence :
        </strong>

        ${doc.reference}

        </p>



        <h3>

        Description

        </h3>


        <p>

        ${doc.description}

        </p>



        <h3>

        Contenu

        </h3>


        <p>

        ${doc.contenu}

        </p>



    </div>


    `;



    zone.scrollIntoView({

        behavior:"smooth"

    });


}

/* ==========================================================
   PARTIE 5B
   BIBLIOTHÈQUE JURIDIQUE
   Recherche + Filtres + Favoris + Historique
========================================================== */


/* ===============================
   Initialisation événements
=============================== */

initBibliothequeEvents(){


    const search =
        document.getElementById(
            "searchBibliotheque"
        );


    if(search){


        search.addEventListener(
            "input",
            (e)=>{


                this.searchDocuments(
                    e.target.value
                );


            }
        );


    }



    document
    .querySelectorAll(
        ".filter-document"
    )
    .forEach(btn=>{


        btn.addEventListener(
            "click",
            ()=>{


                document
                .querySelectorAll(
                    ".filter-document"
                )
                .forEach(b=>

                    b.classList.remove(
                        "active"
                    )

                );


                btn.classList.add(
                    "active"
                );


                this.filterDocuments(
                    btn.dataset.type
                );


            }
        );


    });



}



/* ===============================
   Recherche documents
=============================== */

searchDocuments(keyword){


    keyword =
        keyword
        .toLowerCase()
        .trim();



    const resultat =

    this.documentsJuridiques.filter(
        doc=>{


            return (

                doc.titre
                .toLowerCase()
                .includes(keyword)


                ||


                doc.reference
                .toLowerCase()
                .includes(keyword)


                ||


                doc.type
                .toLowerCase()
                .includes(keyword)


                ||


                doc.description
                .toLowerCase()
                .includes(keyword)

            );


        }
    );



    this.renderBibliotheque(
        resultat
    );


}



/* ===============================
   Filtrer documents
=============================== */

filterDocuments(type){


    if(
        !type
        ||
        type==="Tous"
    ){


        this.renderBibliotheque(
            this.documentsJuridiques
        );


        return;


    }



    const resultat =

    this.documentsJuridiques.filter(
        doc=>

            doc.type
            .toLowerCase()
            ===
            type.toLowerCase()

    );



    this.renderBibliotheque(
        resultat
    );


}



/* ===============================
   Ajouter favori juridique
=============================== */

addDocumentFavorite(id){


    let favoris =

    JSON.parse(

        localStorage.getItem(
            "documents-favoris"
        )
        ||
        "[]"

    );



    if(
        !favoris.includes(id)
    ){


        favoris.push(id);



        localStorage.setItem(

            "documents-favoris",

            JSON.stringify(
                favoris
            )

        );



        alert(
            "Document ajouté aux favoris."
        );


    }

    else{


        alert(
            "Document déjà enregistré."
        );


    }


}



/* ===============================
   Historique consultation
=============================== */

saveDocumentHistory(id){


    let history =

    JSON.parse(

        localStorage.getItem(
            "documents-history"
        )
        ||
        "[]"

    );



    history =

    history.filter(
        item=>item!==id
    );



    history.unshift(id);



    localStorage.setItem(

        "documents-history",

        JSON.stringify(
            history
        )

    );


}



/* ===============================
   Remplacer ouverture document
=============================== */

openDocument(id){


    const doc =

    this.documentsJuridiques.find(

        d=>d.id===id

    );



    if(!doc) return;



    this.saveDocumentHistory(id);



    const zone =

    document.getElementById(
        "documentDetails"
    );



    if(!zone) return;



    zone.innerHTML = `


    <div class="card">


        <h2>

        ${doc.titre}

        </h2>


        <button

        class="btn"

        onclick="app.addDocumentFavorite(${id})">


        ⭐ Ajouter aux favoris


        </button>



        <hr>


        <p>

        <strong>
        Type :
        </strong>

        ${doc.type}

        </p>


        <p>

        <strong>
        Référence :
        </strong>

        ${doc.reference}

        </p>



        <h3>

        Description

        </h3>


        <p>

        ${doc.description}

        </p>



        <h3>

        Texte juridique

        </h3>


        <p>

        ${doc.contenu}

        </p>



    </div>


    `;


    zone.scrollIntoView({

        behavior:"smooth"

    });


                   }

/* ==========================================================
   PARTIE 5C
   BIBLIOTHÈQUE JURIDIQUE
   Articles du Code du Travail RDC
   Structure + Recherche + Affichage
========================================================== */


/* ===============================
   Initialisation des articles
=============================== */

initArticlesCodeTravail(){


    this.articlesCodeTravail = [


        {

            id:1,

            titre:
            "Titre I - Dispositions générales",

            chapitre:
            "Chapitre I - Principes fondamentaux",

            article:
            "Article 1",

            contenu:
            "Le présent Code régit les relations individuelles et collectives de travail entre employeurs et travailleurs."

        },


        {

            id:2,

            titre:
            "Titre II - Du contrat de travail",

            chapitre:
            "Chapitre I - Formation du contrat",

            article:
            "Article 2",

            contenu:
            "Le contrat de travail est une convention par laquelle une personne s'engage à fournir un travail sous l'autorité d'un employeur."

        },


        {

            id:3,

            titre:
            "Titre III - Conditions de travail",

            chapitre:
            "Chapitre I - Protection du travailleur",

            article:
            "Article 3",

            contenu:
            "Les conditions de travail doivent garantir la sécurité, l'hygiène et la dignité du travailleur."

        }


    ];



    this.renderArticles(
        this.articlesCodeTravail
    );


}



/* ===============================
   Affichage articles
=============================== */

renderArticles(data){


    const container =
        document.getElementById(
            "articlesList"
        );



    if(!container) return;



    container.innerHTML="";



    data.forEach(article=>{


        container.innerHTML += `


        <div class="article-card">


            <h3>

            ${article.article}

            </h3>


            <p>

            ${article.titre}

            </p>


            <p>

            ${article.chapitre}

            </p>



            <button

            class="btn"

            onclick="app.openArticle(${article.id})">


            Consulter


            </button>


        </div>


        `;


    });


}



/* ===============================
   Recherche articles
=============================== */

searchArticles(keyword){


    keyword =

    keyword
    .toLowerCase()
    .trim();



    const result =

    this.articlesCodeTravail.filter(

        article=>{


            return (

                article.article
                .toLowerCase()
                .includes(keyword)


                ||


                article.titre
                .toLowerCase()
                .includes(keyword)


                ||


                article.chapitre
                .toLowerCase()
                .includes(keyword)


                ||


                article.contenu
                .toLowerCase()
                .includes(keyword)

            );


        }

    );



    this.renderArticles(
        result
    );


}



/* ===============================
   Ouvrir article
=============================== */

openArticle(id){


    const article =

    this.articlesCodeTravail.find(

        a=>a.id===id

    );



    if(!article) return;



    const zone =

    document.getElementById(
        "articleDetails"
    );



    if(!zone) return;



    zone.innerHTML = `


    <div class="card juridique">


        <h2>

        ${article.article}

        </h2>



        <hr>



        <h3>

        ${article.titre}

        </h3>



        <h4>

        ${article.chapitre}

        </h4>



        <p>

        ${article.contenu}

        </p>



        <button

        class="btn"

        onclick="app.addArticleFavorite(${id})">


        ⭐ Ajouter aux favoris


        </button>



    </div>


    `;



    zone.scrollIntoView({

        behavior:"smooth"

    });


}



/* ===============================
   Favoris articles
=============================== */

addArticleFavorite(id){


    let favoris =

    JSON.parse(

        localStorage.getItem(
            "articles-favoris"
        )
        ||
        "[]"

    );



    if(
        !favoris.includes(id)
    ){


        favoris.push(id);



        localStorage.setItem(

            "articles-favoris",

            JSON.stringify(
                favoris
            )

        );



        alert(
            "Article ajouté aux favoris."
        );


    }


}



/* ===============================
   Recherche par numéro article
=============================== */

findArticle(numero){


    const resultat =

    this.articlesCodeTravail.find(

        a=>

        a.article
        .toLowerCase()
        ===

        numero
        .toLowerCase()

    );



    if(resultat){


        this.openArticle(
            resultat.id
        );


    }

    else{


        alert(
            "Article introuvable."
        );


    }


           }

/* ==========================================================
   PARTIE 6A
   ASSISTANT IA JURIDIQUE
   Analyse situation + Recherche juridique
========================================================== */


/* ===============================
   Initialisation Assistant IA
=============================== */

initAssistantIA(){


    this.aiKnowledge = [


        {

            mots:[
                "salaire",
                "paiement",
                "rémunération",
                "retard"
            ],

            infraction:
            "Non-paiement ou retard de paiement du salaire",

            article:
            "Code du Travail - Dispositions relatives au salaire",

            conseil:
            "Vérifier les bulletins de paie, contrats et preuves de paiement."

        },


        {

            mots:[
                "contrat",
                "engagement",
                "embauche",
                "travailleur"
            ],

            infraction:
            "Absence ou irrégularité du contrat de travail",

            article:
            "Code du Travail - Contrat de travail",

            conseil:
            "Contrôler l'existence d'un contrat écrit et les mentions obligatoires."

        },


        {

            mots:[
                "sécurité",
                "danger",
                "accident",
                "protection"
            ],

            infraction:
            "Manquement aux règles de sécurité et d'hygiène",

            article:
            "Code du Travail - Santé et sécurité au travail",

            conseil:
            "Effectuer une inspection des conditions de travail et relever les risques."

        },


        {

            mots:[
                "enfant",
                "mineur",
                "jeune"
            ],

            infraction:
            "Emploi irrégulier d'un enfant",

            article:
            "Code du Travail - Protection des jeunes travailleurs",

            conseil:
            "Vérifier l'âge, les autorisations et les conditions d'emploi."

        }


    ];


}



/* ===============================
   Analyser une situation
=============================== */

analyserSituation(){


    const input =

    document.getElementById(
        "aiQuestion"
    );



    if(!input) return;



    const texte =

    input.value
    .toLowerCase()
    .trim();



    if(!texte){


        alert(
            "Veuillez décrire la situation."
        );


        return;

    }



    let resultats=[];



    this.aiKnowledge.forEach(regle=>{


        let trouve=false;



        regle.mots.forEach(mot=>{


            if(
                texte.includes(mot)
            ){

                trouve=true;

            }


        });



        if(trouve){

            resultats.push(regle);

        }



    });



    this.displayAIResult(
        resultats,
        texte
    );


}



/* ===============================
   Affichage résultat IA
=============================== */

displayAIResult(resultats, question){


    const zone =

    document.getElementById(
        "aiResult"
    );



    if(!zone) return;



    if(resultats.length===0){


        zone.innerHTML=`


        <div class="card">


        <h3>

        Analyse terminée

        </h3>


        <p>

        Aucun élément juridique précis
        détecté automatiquement.

        </p>


        <p>

        Une vérification humaine de
        l'Inspecteur reste nécessaire.

        </p>


        </div>


        `;


        return;

    }



    let html=`


    <div class="card">


    <h2>

    Analyse juridique IA

    </h2>


    <p>

    Situation analysée :

    <br>

    ${question}

    </p>


    <hr>


    `;



    resultats.forEach(r=>{


        html += `


        <div class="ai-item">


            <h3>

            ⚖️ ${r.infraction}

            </h3>


            <p>

            <strong>
            Base juridique :
            </strong>

            ${r.article}

            </p>


            <p>

            <strong>
            Conseil Inspecteur :
            </strong>

            ${r.conseil}

            </p>


        </div>


        `;


    });



    html +=`


    </div>


    `;



    zone.innerHTML=html;


       }

/* ==========================================================
   PARTIE 6B
   ASSISTANT IA JURIDIQUE AVANCÉ
   Liaison Infractions + AIM + Rapport
========================================================== */


/* ===============================
   Analyse complète IA
=============================== */

analyseCompleteIA(texte){


    texte = texte
    .toLowerCase()
    .trim();



    let resultat = {


        situation: texte,

        infractions: [],

        sanctions: [],

        gravite: "À déterminer",

        recommandations: []

    };



    /* Recherche dans les 65 infractions */

    if(this.infractions){


        this.infractions.forEach(item=>{


            let mots =

            item.infraction
            .toLowerCase()
            .split(" ");



            let correspondance = mots.some(
                mot =>

                mot.length > 4
                &&
                texte.includes(mot)

            );



            if(correspondance){


                resultat.infractions.push(item);


            }



        });


    }



    /* Recherche dans AIM */

    if(this.aimData){


        resultat.infractions.forEach(inf=>{


            const sanction =

            this.aimData.find(a=>


                a.sanction
                .toLowerCase()
                .includes(

                    inf.infraction
                    .toLowerCase()

                )

            );



            if(sanction){


                resultat.sanctions.push(
                    sanction
                );


            }



        });


    }



    /* Détermination gravité */

    let nombre =

    resultat.infractions.length;



    if(nombre >= 3){


        resultat.gravite =
        "Très grave";


    }

    else if(nombre >= 1){


        resultat.gravite =
        "Grave";


    }

    else{


        resultat.gravite =
        "Non déterminée";


    }



    /* Conseils */

    resultat.recommandations.push(

        "Vérifier les documents administratifs."

    );


    resultat.recommandations.push(

        "Auditionner les parties concernées."

    );


    resultat.recommandations.push(

        "Conserver les preuves avant verbalisation."

    );



    return resultat;


}



/* ===============================
   Bouton Analyse IA avancée
=============================== */

runAdvancedAI(){


    const input =

    document.getElementById(
        "aiQuestion"
    );



    if(!input) return;



    const analyse =

    this.analyseCompleteIA(
        input.value
    );

    this.saveAIAnalysis(analyse);


    this.displayAdvancedAI(
        analyse
    );


}



/* ===============================
   Affichage analyse avancée
=============================== */

displayAdvancedAI(data){


    const zone =

    document.getElementById(
        "aiResult"
    );



    if(!zone) return;



    let infractions =

    data.infractions.length

    ?

    data.infractions.map(i=>

        `<li>${i.infraction}</li>`

    ).join("")

    :

    "<li>Aucune infraction détectée</li>";





    let sanctions =

    data.sanctions.length

    ?

    data.sanctions.map(s=>

        `<li>${s.sanction}</li>`

    ).join("")

    :

    "<li>Aucune sanction AIM associée</li>";





    zone.innerHTML = `


    <div class="card">


        <h2>
        Rapport IA Juridique
        </h2>


        <hr>


        <p>

        <strong>
        Situation :
        </strong>

        ${data.situation}

        </p>



        <h3>
        Infractions détectées
        </h3>


        <ul>

        ${infractions}

        </ul>



        <h3>
        Sanctions possibles
        </h3>


        <ul>

        ${sanctions}

        </ul>



        <h3>
        Niveau de gravité
        </h3>


        <p>

        ${data.gravite}

        </p>



        <h3>
        Recommandations Inspecteur
        </h3>


        <ul>


        ${data.recommandations
        .map(r=>`<li>${r}</li>`)
        .join("")}


        </ul>



        <button

        class="btn"

        onclick='app.sendAIToPV(${JSON.stringify(data)})'>


        Envoyer vers PV


        </button>



    </div>


    `;


}



/* ===============================
   Envoyer analyse vers PV
=============================== */

sendAIToPV(data){


    localStorage.setItem(

        "pv-ai-analysis",

        JSON.stringify(data)

    );



    alert(

        "Analyse IA transférée vers le module PV."

    );


}

/* ==========================================================
   PARTIE 6C
   ASSISTANT IA JURIDIQUE
   Historique + Mémoire + Export
========================================================== */


/* ===============================
   Sauvegarder analyse IA
=============================== */

saveAIAnalysis(data){

    let history = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-ai-history"
        )
        ||
        "[]"

    );


    data.date =
        new Date()
        .toLocaleString();



    history.unshift(data);



    localStorage.setItem(

        "inspecteurbot-ai-history",

        JSON.stringify(history)

    );


}



/* ===============================
   Charger historique IA
=============================== */

loadAIHistory(){


    const zone =
        document.getElementById(
            "aiHistory"
        );


    if(!zone) return;



    const history = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-ai-history"
        )
        ||
        "[]"

    );



    if(history.length === 0){


        zone.innerHTML = `

        <p>
        Aucun historique d'analyse IA.
        </p>

        `;


        return;

    }



    zone.innerHTML = "";



    history.forEach((item,index)=>{


        zone.innerHTML += `


        <div class="history-item">


            <h4>
            Analyse du ${item.date}
            </h4>


            <p>

            ${item.situation}

            </p>


            <p>

            Gravité :
            ${item.gravite}

            </p>



            <button

            class="btn"

            onclick="app.viewAIHistory(${index})">


            Consulter


            </button>


        </div>


        `;


    });


}



/* ===============================
   Consulter analyse historique
=============================== */

viewAIHistory(index){


    const history = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-ai-history"
        )
        ||
        "[]"

    );



    const data =
        history[index];



    if(!data) return;



    this.displayAdvancedAI(data);


}



/* ===============================
   Effacer historique IA
=============================== */

clearAIHistory(){


    if(
        confirm(
        "Supprimer tout l'historique IA ?"
        )
    ){


        localStorage.removeItem(

            "inspecteurbot-ai-history"

        );


        this.loadAIHistory();


    }


}



/* ===============================
   Export rapport IA
=============================== */

exportAIReport(data){


    const contenu = `


RAPPORT D'ANALYSE IA - INSPECTEURBOT


Situation :

${data.situation}



Infractions détectées :

${data.infractions
.map(i=>i.infraction)
.join("\n")}



Sanctions proposées :

${data.sanctions
.map(s=>s.sanction)
.join("\n")}



Niveau de gravité :

${data.gravite}



Recommandations :

${data.recommandations
.join("\n")}



Date :

${new Date()
.toLocaleString()}


`;



    const blob = new Blob(

        [contenu],

        {
            type:"text/plain"
        }

    );



    const url =
        URL.createObjectURL(blob);



    const link =
        document.createElement("a");



    link.href=url;


    link.download =
        "rapport-analyse-IA.txt";



    link.click();



    URL.revokeObjectURL(url);


}



/* ===============================
   Connexion IA
=============================== */

loadAIConnection(){


    console.log(

        "Connexion Assistant IA juridique active."

    );


}


/* ==========================================================
   PARTIE 7A
   ARCHIVES + STATISTIQUES
   Tableau de bord intelligent
========================================================== */


/* ===============================
   Initialisation Archives
=============================== */

initArchives(){


    this.archives = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-archives"
        )
        ||
        "[]"

    );


    this.renderArchives();


}



/* ===============================
   Ajouter une archive
=============================== */

saveArchive(data){


    let archives = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-archives"
        )
        ||
        "[]"

    );



    data.id =
        Date.now();



    data.date =
        new Date()
        .toLocaleString();



    archives.unshift(data);



    localStorage.setItem(

        "inspecteurbot-archives",

        JSON.stringify(archives)

    );



    this.renderArchives();


}



/* ===============================
   Afficher archives
=============================== */

renderArchives(){


    const zone =
        document.getElementById(
            "archivesList"
        );



    if(!zone) return;



    const archives = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-archives"
        )
        ||
        "[]"

    );



    if(archives.length===0){


        zone.innerHTML = `

        <p>
        Aucun dossier archivé.
        </p>

        `;


        return;

    }



    zone.innerHTML="";



    archives.forEach(item=>{


        zone.innerHTML += `


        <div class="archive-card">


            <h3>

            ${item.titre || "Dossier"}

            </h3>


            <p>

            Type :
            ${item.type || "Non défini"}

            </p>


            <p>

            Date :
            ${item.date}

            </p>



            <button

            class="btn"

            onclick="app.openArchive(${item.id})">


            Ouvrir


            </button>



        </div>


        `;


    });


}



/* ===============================
   Ouvrir archive
=============================== */

openArchive(id){


    const archives = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-archives"
        )
        ||
        "[]"

    );



    const dossier =

    archives.find(

        a=>a.id===id

    );



    if(!dossier) return;



    const zone =

    document.getElementById(
        "archiveDetails"
    );



    if(!zone) return;



    zone.innerHTML = `


    <div class="card">


        <h2>

        ${dossier.titre}

        </h2>


        <hr>


        <pre>

${JSON.stringify(

    dossier,

    null,

    2

)}

        </pre>


    </div>


    `;


}



/* ===============================
   Supprimer archive
=============================== */

deleteArchive(id){


    let archives = JSON.parse(

        localStorage.getItem(
            "inspecteurbot-archives"
        )
        ||
        "[]"

    );



    archives = archives.filter(

        a=>a.id!==id

    );



    localStorage.setItem(

        "inspecteurbot-archives",

        JSON.stringify(archives)

    );



    this.renderArchives();


}



/* ===============================
   Statistiques générales
=============================== */

updateDashboardStats(){


    const stats = {


        infractions:

        this.infractions
        ?
        this.infractions.length
        :
        0,


        sanctions:

        this.aimData
        ?
        this.aimData.length
        :
        0,


        documents:

        this.documentsJuridiques
        ?
        this.documentsJuridiques.length
        :
        0,


        archives:

        JSON.parse(

            localStorage.getItem(
                "inspecteurbot-archives"
            )
            ||
            "[]"

        ).length


    };



    const elements = {


        infractions:
        "statInfractions",


        sanctions:
        "statSanctions",


        documents:
        "statDocuments",


        archives:
        "statArchives"


    };



    Object.keys(elements)
    .forEach(key=>{


        const el =

        document.getElementById(
            elements[key]
        );



        if(el){

            el.textContent =
            stats[key];

        }


    });



}



/* ===============================
   Initialisation statistiques
=============================== */

initStatistics(){

 this.updateDashboardStats();


}


/* ==========================================================
   PARTIE 7C
   FINALISATION MODULE SANCTIONS & INFRACTIONS
   Nettoyage - Vérification - Maintenance
========================================================== */


/* ===============================
   Initialisation finale module
=============================== */

finalizeModule(){


    console.log(
        "Module Sanctions & Infractions chargé."
    );


    this.checkModules();


}



/* ===============================
   Vérification modules
=============================== */

checkModules(){


    const modules = {


        infractions:
        !!this.infractions,


        aim:
        !!this.aimData,


        bibliotheque:
        !!this.documentsJuridiques,


        articles:
        !!this.articlesCodeTravail,


        assistantIA:
        !!this.aiKnowledge,


        archives:
        true


    };



    console.table(modules);



    return modules;


}



/* ===============================
   Informations module
=============================== */

getModuleInfo(){


    return {


        nom:

        "Sanctions & Infractions",



        application:

        "InspecteurBot RDC",



        version:

        "1.0.0",



        modules:


        [

            "65 Infractions",

            "AIM 006/127",

            "Bibliothèque juridique",

            "Assistant IA",

            "Archives"

        ],



        statut:

        "Actif"


    };


}



/* ===============================
   Nettoyage données module
=============================== */

clearModuleData(){


    if(

        confirm(

        "Supprimer uniquement les données du module Sanctions ?"

        )

    ){


        localStorage.removeItem(

            "inspecteurbot-favoris"

        );


        localStorage.removeItem(

            "aim-history"

        );


        localStorage.removeItem(

            "documents-favoris"

        );


        localStorage.removeItem(

            "documents-history"

        );


        localStorage.removeItem(

            "articles-favoris"

        );


        localStorage.removeItem(

            "inspecteurbot-ai-history"

        );


        localStorage.removeItem(

            "inspecteurbot-archives"

        );



        alert(

        "Données du module supprimées."

        );



        location.reload();


    }


}



/* ===============================
   Préparation intégration Dashboard
=============================== */

connectToInspectorDashboard(){


    window.InspecteurBot =

    window.InspecteurBot || {};



    window.InspecteurBot.Sanctions = {


        open:()=>{


            this.showView(
                "dashboard",
                false
            );


        },


        instance:this


    };



    console.log(

    "Module connecté au Dashboard InspecteurBot."

    );


}



/* ===============================
   Démarrage final
=============================== */

startModule(){


    this.loadTheme();


    this.initInfractions();


    this.initAIM();


    this.initBibliotheque();


    this.initArticlesCodeTravail();


    this.initAssistantIA();


    this.initArchives();


    this.loadFavorites();


    this.loadAIMHistory();


    this.loadAIHistory();


    this.initStatistics();


    this.connectToInspectorDashboard();


    this.finalizeModule();


}

document.addEventListener(
"DOMContentLoaded",
()=>{

    app.init();

    app.startModule();

});
