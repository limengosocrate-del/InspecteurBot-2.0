/**
 * ==========================================================
 * InspecteurBot RDC
 * Module : Inspecteur et Contrôleur du Travail
 * Fichier : app-inspecteur.js
 * Partie 1 : Variables globales et initialisation
 * ==========================================================
 */

"use strict";

/* ==========================================================
   ÉTAT GLOBAL DE L'APPLICATION
========================================================== */

const STATE = {
    currentSection: "accueil",
    currentArticle: 187,
    currentIAOutput: "rapport",
    iaMode: "mission",

    isListening: false,
    recognition: null,
    listeningTimer: null,

    transcriptLog: [],

    currentMission: null,

    archiveData: [],

    docsData: {},

    modelLibrary: [],

    dashboard: {
        missions: 0,
        entreprises: 0,
        conformes: 0,
        nonConformes: 0,
        pv: 0,
        med: 0
    }
};


/* ==========================================================
   CONSTANTES
========================================================== */

const STORAGE_ARCHIVES = "inspecteurbot_archive";
const STORAGE_NOTES = "inspecteurbot_notes";

const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


/* ==========================================================
   RACCOURCIS DOM
========================================================== */

function $(id) {
    return document.getElementById(id);
}

function showElement(element) {

    if (!element) return;

    element.classList.remove("hidden");
}

function hideElement(element) {

    if (!element) return;

    element.classList.add("hidden");
}


/* ==========================================================
   NOTIFICATION
========================================================== */

function showToast(message, type = "info") {

    const container = $("toastContainer");

    if (!container) {

        alert(message);

        return;
    }

    const toast = document.createElement("div");

    toast.className = `toast ${type}`;

    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {

        toast.remove();

    }, 3500);
}


/* ==========================================================
   INITIALISATION
========================================================== */

document.addEventListener("DOMContentLoaded", initApplication);

function initApplication() {

    loadArchives();

    loadQuickNotes();

    checkSpeechRecognition();

    showSection("accueil");

    loadModels();
    loadDifficultes();
}


/* ==========================================================
   COMPATIBILITÉ NAVIGATEUR
========================================================== */

function checkSpeechRecognition() {

    if (!SpeechRecognition) {

        showToast(
            "La reconnaissance vocale n'est pas compatible avec ce navigateur.",
            "error"
        );

        return;
    }

    STATE.recognition = new SpeechRecognition();

}


/* ==========================================================
   PARTIE 2 : NAVIGATION DE L'APPLICATION
========================================================== */

/**
 * Afficher une section
 */
function showSection(sectionId) {

    const sections = document.querySelectorAll(".section");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    const target = document.getElementById(sectionId);

    if (!target) {
        console.warn("Section introuvable :", sectionId);
        return;
    }

    target.classList.add("active");

    STATE.currentSection = sectionId;

    updateNavigation(sectionId);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/**
 * Mettre à jour le menu principal
 */
function updateNavigation(activeSection) {

    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {

        link.classList.remove("active");

        const onclick = link.getAttribute("onclick");

        if (onclick && onclick.includes("'" + activeSection + "'")) {

            link.classList.add("active");

        }

    });

}


/**
 * Menu mobile
 */
function toggleMobileMenu() {

    const menu = document.getElementById("mobileMenu");

    if (!menu) return;

    menu.classList.toggle("open");

}


/**
 * Fermer automatiquement le menu mobile
 * lorsqu'on clique en dehors.
 */
document.addEventListener("click", function (event) {

    const menu = document.getElementById("mobileMenu");

    const button = document.querySelector(".mobile-menu-btn");

    if (!menu || !button) return;

    if (
        !menu.contains(event.target) &&
        !button.contains(event.target)
    ) {

        menu.classList.remove("open");

    }

});


/**
 * Fermer le menu mobile
 * après redimensionnement.
 */
window.addEventListener("resize", function () {

    if (window.innerWidth > 900) {

        const menu = document.getElementById("mobileMenu");

        if (menu) {

            menu.classList.remove("open");

        }

    }

});


/* ==========================================================
   PARTIE 3 : DOCUMENTATION (Articles 187 à 198)
========================================================== */

/**
 * Affichage d'un article
 */
function navigateToArticle(article) {

    STATE.currentArticle = article;

    document.querySelectorAll(".article-tab").forEach(button => {
        button.classList.remove("active");
    });

    const activeButton = document.querySelector(`[data-art="${article}"]`);

    if (activeButton) {
        activeButton.classList.add("active");
    }

    document.querySelectorAll(".doc-article").forEach(item => {
        item.classList.remove("active");
    });

    const activeArticle = document.getElementById("doc-article-" + article);

    if (activeArticle) {
        activeArticle.classList.add("active");

        activeArticle.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

}


/**
 * Recherche dans les articles
 */
function filterArticles(query) {

    const keyword = query.trim().toLowerCase();

    document.querySelectorAll(".doc-article").forEach(article => {

        const contenu = article.innerText.toLowerCase();

        if (keyword === "") {

            article.classList.remove("hidden");

        } else {

            article.classList.toggle(
                "hidden",
                !contenu.includes(keyword)
            );

        }

    });

    if (keyword === "") {
        navigateToArticle(STATE.currentArticle);
    }

}


/**
 * Impression
 */
function printDoc() {

    showToast(
        "Impression de la documentation...",
        "info"
    );

    window.print();

}


/**
 * Export PDF
 */
function exportDocPDF() {

    const contenu = document.getElementById("docContent");

    if (!contenu) return;

    const options = {

        margin: [10, 10, 10, 10],

        filename: "base_juridique_articles_187_198.pdf",

        image: {
            type: "jpeg",
            quality: 0.98
        },

        html2canvas: {
            scale: 2,
            useCORS: true
        },

        jsPDF: {
            unit: "mm",
            format: "a4",
            orientation: "portrait"
        }

    };

    html2pdf()
        .set(options)
        .from(contenu)
        .save()
        .then(() => {

            showToast(
                "Export PDF terminé.",
                "success"
            );

        });

}


/* ==========================================================
   PARTIE 4 : RAPPORT DE MISSION
========================================================== */


/**
 * Récupérer les données du formulaire mission
 */
function getMissionFormData() {

    return {

        date: $("mDate")?.value || "",
        order: $("mOrder")?.value || "",
        group: $("mGroup")?.value || "",

        role: $("mRole")?.value || "",

        participants: $("mParticipants")?.value || "",

        objective: $("mObjective")?.value || "",

        matter: $("mMatter")?.value || "",

        companies: $("mCompanies")?.value || "",

        addresses: $("mAddresses")?.value || "",

        phone: $("mPhone")?.value || "",

        direction: $("mDirection")?.value || "",

        difficulties: $("mDifficultes")?.value || "",

        observations: $("mObservations")?.value || "",

        findings: $("mConstats")?.value || "",

        recommendations: $("mRecommandations")?.value || "",

        conclusion: $("mConclusion")?.value || ""

    };

}


/**
 * Création du rapport de mission
 */
function createMission(event) {

    if (event) {
        event.preventDefault();
    }


    const data = getMissionFormData();


    if (!data.date || !data.role || !data.objective || !data.matter) {

        showToast(
            "Veuillez remplir les champs obligatoires.",
            "error"
        );

        return;
    }


    STATE.currentMission = data;


    previewMission();


    showToast(
        "Rapport de mission généré.",
        "success"
    );

}


/**
 * Aperçu du rapport A4
 */
function previewMission() {


    const data = STATE.currentMission || getMissionFormData();


    const previewArea = $("reportPreviewArea");


    if (previewArea) {

        previewArea.classList.remove("hidden");

    }


    if ($("previewMeta")) {

        $("previewMeta").innerHTML = `

        <p><strong>Date :</strong> ${data.date}</p>

        <p><strong>Ordre de service :</strong> ${data.order}</p>

        <p><strong>Groupe :</strong> ${data.group}</p>

        <p><strong>Direction :</strong> ${data.direction}</p>

        `;

    }



    if ($("previewDate")) {

        $("previewDate").textContent = data.date;

    }



    if ($("previewSignRole")) {

        $("previewSignRole").textContent = data.role;

    }



    if ($("previewSignPhone")) {

        $("previewSignPhone").textContent = data.phone;

    }



    if ($("previewBody")) {


        $("previewBody").innerHTML = `


        <h3>1. Objet de la mission</h3>
        <p>${data.objective}</p>


        <h3>2. Matière contrôlée</h3>
        <p>${data.matter}</p>


        <h3>3. Entreprise(s) visitée(s)</h3>
        <p>${data.companies}</p>


        <h3>4. Adresse(s)</h3>
        <p>${data.addresses}</p>


        <h3>5. Difficultés rencontrées</h3>
        <p>${data.difficulties}</p>


        <h3>6. Constats effectués</h3>
        <p>${data.findings}</p>


        <h3>7. Recommandations</h3>
        <p>${data.recommendations}</p>


        <h3>8. Conclusion</h3>
        <p>${data.conclusion}</p>


        `;

    }


}


/**
 * Réinitialiser le formulaire mission
 */
function resetMissionForm() {


    const form = $("missionForm");


    if (form) {

        form.reset();

    }


    STATE.currentMission = null;


    const preview = $("reportPreviewArea");


    if (preview) {

        preview.classList.add("hidden");

    }


    showToast(
        "Formulaire réinitialisé.",
        "info"
    );

      }


/* ==========================================================
   PARTIE 5 : IA AIDE À LA RÉDACTION
========================================================== */


/**
 * Bibliothèque des modèles
 */
STATE.modelLibrary = [

    {
        category: "introduction",
        title: "Introduction de rapport de mission",
        text: "La présente mission d'inspection a été effectuée conformément aux dispositions du Code du travail de la République Démocratique du Congo."
    },

    {
        category: "constat",
        title: "Constat général",
        text: "Après vérification des documents et des conditions de travail, les constatations suivantes ont été relevées par l'équipe de contrôle."
    },

    {
        category: "infraction",
        title: "Constat d'infraction",
        text: "Il a été constaté une violation des dispositions légales relatives aux obligations de l'employeur."
    },

    {
        category: "recommandation",
        title: "Recommandation administrative",
        text: "Il est recommandé à l'employeur de prendre les mesures nécessaires afin de se conformer aux prescriptions légales en vigueur."
    },

    {
        category: "conclusion",
        title: "Conclusion de mission",
        text: "La mission a été clôturée après examen des éléments disponibles et formulation des recommandations appropriées."
    }

];



/**
 * Charger les modèles dans la page
 */
function loadModels(category = "all") {


    const container = $("modelsGrid");


    if (!container) return;


    container.innerHTML = "";


    const models = STATE.modelLibrary.filter(model => {

        return category === "all" ||
            model.category === category;

    });



    models.forEach(model => {


        const card = document.createElement("article");


        card.className = "model-card";


        card.innerHTML = `

            <h4>${model.title}</h4>

            <p>${model.text}</p>

            <button class="btn-outline"
            onclick="copyModelText('${escapeQuotes(model.text)}')">

            Copier

            </button>

        `;


        container.appendChild(card);


    });


}



/**
 * Filtrer les modèles
 */
function filterModels(category) {

    loadModels(category);

}



/**
 * Copier un modèle
 */
function copyModelText(text) {


    navigator.clipboard.writeText(text)
    .then(() => {

        showToast(
            "Texte copié.",
            "success"
        );

    })
    .catch(() => {

        showToast(
            "Impossible de copier le texte.",
            "error"
        );

    });


}


/**
 * Protection des caractères
 */
function escapeQuotes(text) {

    return text
        .replace(/'/g, "\\'")
        .replace(/"/g, '\\"');

}



/* ==========================================================
   DIFFICULTÉS RENCONTRÉES
========================================================== */


const difficultesList = [

    "Absence de certains documents obligatoires.",
    "Retard dans la présentation des registres.",
    "Difficulté d'accès aux installations.",
    "Manque de collaboration de certains responsables.",
    "Insuffisance des mesures de sécurité.",
    "Non-présentation des pièces administratives demandées."

];



function loadDifficultes() {


    const container = $("difficultesGrid");


    if (!container) return;


    container.innerHTML = "";


    difficultesList.forEach(item => {


        const div = document.createElement("div");


        div.className = "difficulte-item";


        div.textContent = item;


        container.appendChild(div);


    });


}


/* ==========================================================
   PARTIE 6 : RAPPORT DE FORMATION ET RAPPORT DE RÉUNION
========================================================== */


/**
 * Création rapport de formation
 */
function createFormationReport(event) {

    if (event) {
        event.preventDefault();
    }


    const date = $("fDate")?.value || "";
    const title = $("fTitle")?.value || "";
    const participants = $("fParticipants")?.value || "";
    const content = $("fContent")?.value || "";


    if (!date || !content) {

        showToast(
            "Veuillez compléter les informations obligatoires.",
            "error"
        );

        return;
    }


    const report = {

        type: "formation",
        date,
        title,
        participants,
        content

    };


    STATE.currentReport = report;


    showToast(
        "Rapport de formation généré.",
        "success"
    );


}



/**
 * Création rapport de réunion
 */
function createReunionReport(event) {

    if (event) {

        event.preventDefault();

    }


    const date = $("rDate")?.value || "";
    const subject = $("rSubject")?.value || "";
    const participants = $("rParticipants")?.value || "";
    const content = $("rContent")?.value || "";



    if (!date || !content) {

        showToast(
            "Veuillez compléter les informations obligatoires.",
            "error"
        );

        return;
    }



    const report = {

        type: "reunion",

        date,

        subject,

        participants,

        content

    };


    STATE.currentReport = report;



    showToast(
        "Rapport de réunion généré.",
        "success"
    );


}



/**
 * Aperçu général d'un rapport simple
 */
function generateSimpleReportPreview(data) {


    const body = document.createElement("div");


    body.className = "simple-report-preview";


    body.innerHTML = `

        <h3>${data.type}</h3>

        <p><strong>Date :</strong> ${data.date}</p>

        <p><strong>Titre :</strong> ${data.title || data.subject || ""}</p>

        <p><strong>Participants :</strong><br>
        ${data.participants || ""}</p>

        <p>${data.content || ""}</p>

    `;


    return body;

}



/**
 * Copier un rapport simple
 */
function copyCurrentReport() {


    if (!STATE.currentReport) {

        showToast(
            "Aucun rapport disponible.",
            "error"
        );

        return;

    }



    const text = JSON.stringify(
        STATE.currentReport,
        null,
        2
    );


    navigator.clipboard.writeText(text)
    .then(() => {

        showToast(
            "Rapport copié.",
            "success"
        );

    });


}


/* ==========================================================
   PARTIE 7 : RAPPORT DE CONVERSATION
========================================================== */


/**
 * Création du rapport de conversation
 */
function createConversationReport(event) {

    if (event) {
        event.preventDefault();
    }


    const date = $("cDate")?.value || "";

    const transcription =
        $("cTranscription")?.value || "";



    if (!date || !transcription) {

        showToast(
            "Veuillez compléter la date et la transcription.",
            "error"
        );

        return;

    }



    const report = {

        type: "conversation",

        date: date,

        transcription: transcription

    };


    STATE.currentReport = report;



    const preview =
        $("previewConversation");


    const paper =
        $("a4PaperConversation");



    if (preview) {

        preview.classList.remove("hidden");

    }



    if (paper) {

        paper.innerHTML = `

        <div class="report-header">

            <h1>
            RAPPORT DE CONVERSATION
            </h1>

            <p>
            Date : ${date}
            </p>

        </div>


        <div class="report-body">

            <h3>Transcription</h3>

            <p>
            ${transcription.replace(/\n/g,"<br>")}
            </p>


        </div>

        `;

    }



    showToast(
        "Rapport de conversation généré.",
        "success"
    );


}



/**
 * Impression du rapport conversation
 */
function printConversationReport() {


    const contenu =
        $("a4PaperConversation");


    if (!contenu) return;



    const anciennePage =
        document.body.innerHTML;



    document.body.innerHTML =
        contenu.outerHTML;



    window.print();



    document.body.innerHTML =
        anciennePage;



    window.location.reload();


}



/**
 * Export PDF conversation
 */
function exportConversationReportPDF() {


    const contenu =
        $("a4PaperConversation");



    if (!contenu) {

        showToast(
            "Aucun rapport à exporter.",
            "error"
        );

        return;

    }



    const options = {

        margin: 10,

        filename:
        "rapport_conversation.pdf",

        image: {

            type: "jpeg",

            quality: 0.98

        },


        html2canvas: {

            scale: 2

        },


        jsPDF: {

            unit: "mm",

            format: "a4",

            orientation: "portrait"

        }

    };



    html2pdf()

    .set(options)

    .from(contenu)

    .save();


}



/* ==========================================================
   PRÉPARATION TRANSCRIPTION IA
========================================================== */


/**
 * Ajouter une transcription
 */
function addTranscript(text) {


    if (!text) return;



    STATE.transcriptLog.push({

        time: new Date().toISOString(),

        text: text

    });



    const zone =
        $("iaTranscript");



    if (!zone) return;



    const placeholder =
        zone.querySelector(
            ".transcript-placeholder"
        );



    if (placeholder) {

        placeholder.remove();

    }



    const p =
        document.createElement("p");



    p.textContent = text;



    zone.appendChild(p);



    zone.scrollTop =
        zone.scrollHeight;


          }


/* ==========================================================
   PARTIE 8 : IT/CT IA - RECONNAISSANCE VOCALE
========================================================== */


/**
 * Initialisation reconnaissance vocale
 */
function initSpeechRecognition() {


    if (!SpeechRecognition) {

        showToast(
            "Reconnaissance vocale non disponible sur ce navigateur.",
            "error"
        );

        return false;

    }



    if (STATE.recognition) {

        return true;

    }



    STATE.recognition = new SpeechRecognition();



    STATE.recognition.lang = "fr-FR";


    STATE.recognition.continuous = true;


    STATE.recognition.interimResults = true;



    STATE.recognition.maxAlternatives = 1;



    /**
     * Résultats en temps réel
     */
    STATE.recognition.onresult = function(event) {


        let texteFinal = "";


        let texteTemporaire = "";



        for (
            let i = event.resultIndex;
            i < event.results.length;
            i++
        ) {


            const resultat =
                event.results[i];



            if (resultat.isFinal) {


                texteFinal +=
                resultat[0].transcript;



            } else {


                texteTemporaire +=
                resultat[0].transcript;


            }


        }



        if (texteFinal.trim()) {


            addTranscript(
                texteFinal.trim()
            );


        }


    };



    /**
     * Gestion erreur
     */
    STATE.recognition.onerror = function(event) {


        console.warn(
            "Speech error:",
            event.error
        );



        if (event.error === "not-allowed") {


            showToast(
                "Autorisation microphone refusée.",
                "error"
            );


            stopListening();


        }



    };



    /**
     * Fin automatique de reconnaissance
     */
    STATE.recognition.onend = function() {



        if (STATE.isListening) {


            setTimeout(() => {


                try {

                    STATE.recognition.start();

                }

                catch(error){}


            },500);


        }


    };



    return true;

}





/**
 * Démarrer écoute IA
 */
function startListening() {


    if (STATE.isListening) {

        return;

    }



    const ready =
        initSpeechRecognition();



    if (!ready) {

        return;

    }



    navigator.mediaDevices
    .getUserMedia({

        audio:true

    })

    .then(() => {



        try {


            STATE.recognition.start();


            STATE.isListening = true;



            $("btnStart")
            ?.classList.add("hidden");



            $("btnStop")
            ?.classList.remove("hidden");



            $("iaStatusText")
            && (
                $("iaStatusText").textContent =
                "Écoute active — transcription en cours..."
            );



            showToast(
                "Microphone activé.",
                "success"
            );



        }

        catch(error){


            console.error(error);


        }



    })

    .catch(() => {


        showToast(

            "Veuillez autoriser l'accès au microphone.",

            "error"

        );


    });


}




/**
 * Arrêter écoute IA
 */
function stopListening() {



    STATE.isListening = false;



    if (STATE.recognition) {


        try {


            STATE.recognition.stop();


        }

        catch(error){}



    }



    $("btnStart")
    ?.classList.remove("hidden");



    $("btnStop")
    ?.classList.add("hidden");



    if ($("iaStatusText")) {


        $("iaStatusText").textContent =
        "Prêt — Appuyez sur Démarrer";


    }



    showToast(
        "Écoute arrêtée.",
        "info"
    );


      }


/* ==========================================================
   PARTIE 9 : GESTION IT/CT IA
========================================================== */


/**
 * Changer le mode IA
 */
function setIAMode(mode) {


    STATE.iaMode = mode;



    document.querySelectorAll(".mode-btn")
    .forEach(btn => {

        btn.classList.remove("active");

    });



    const active =
        document.getElementById(
            "mode" +
            mode.charAt(0).toUpperCase() +
            mode.slice(1)
        );



    if (active) {

        active.classList.add("active");

    }



    showToast(
        "Mode IA : " + mode,
        "info"
    );

}



/**
 * Afficher un onglet de sortie IA
 */
function showIAOutput(type) {


    STATE.currentIAOutput = type;



    document.querySelectorAll(".tab-btn")
    .forEach(btn => {

        btn.classList.remove("active");

    });



    const tab =
        document.getElementById(
            "tab" +
            type.charAt(0).toUpperCase() +
            type.slice(1)
        );



    if (tab) {

        tab.classList.add("active");

    }



    generateIAOutput(type);

}




/**
 * Génération du contenu IA
 */
function generateIAOutput(type) {


    const body =
        $("iaOutputBody");



    if (!body) return;



    const transcription =
        STATE.transcriptLog
        .map(item => item.text)
        .join(" ");



    let contenu = "";



    switch(type){


        case "rapport":

            contenu = `
            RAPPORT AUTOMATIQUE

            Mode :
            ${STATE.iaMode}

            Transcription :
            ${transcription}
            `;

        break;



        case "resume":

            contenu = `
            RÉSUMÉ

            ${transcription}
            `;

        break;



        case "constats":

            contenu = `
            CONSTATS

            Analyse des éléments relevés :
            ${transcription}
            `;

        break;



        case "irregularites":

            contenu = `
            IRRÉGULARITÉS

            Éléments nécessitant une vérification :
            ${transcription}
            `;

        break;



        case "recommandations":

            contenu = `
            RECOMMANDATIONS

            Mesures proposées :
            ${transcription}
            `;

        break;



        case "decisions":

            contenu = `
            DÉCISIONS

            Décisions à prendre :
            ${transcription}
            `;

        break;



        case "suivi":

            contenu = `
            SUIVI

            Actions de suivi :
            ${transcription}
            `;

        break;


    }



    body.textContent = contenu;



    $("iaOutput")
    ?.classList.remove("hidden");


}





/**
 * Copier sortie IA
 */
function copyIAOutput() {


    const body =
        $("iaOutputBody");



    if (!body) return;



    navigator.clipboard
    .writeText(body.innerText)

    .then(() => {


        showToast(
            "Document copié.",
            "success"
        );


    });

}





/**
 * Partager sortie IA
 */
function shareIAOutput() {


    const body =
        $("iaOutputBody");



    if (!body) return;



    if (navigator.share) {


        navigator.share({

            title:"InspecteurBot IA",

            text:body.innerText

        });


    }

    else {


        copyIAOutput();


    }


}





/**
 * Impression sortie IA
 */
function printIAOutput() {


    const body =
        $("iaOutputBody");



    if (!body) return;



    window.print();


}





/**
 * Export PDF sortie IA
 */
function exportIAOutputPDF() {


    const body =
        $("iaOutputBody");



    if (!body) return;



    html2pdf()

    .from(body)

    .set({

        filename:
        "rapport_IT_CT_IA.pdf",

        margin:10,

        html2canvas:{
            scale:2
        }

    })

    .save();


}





/**
 * Modification manuelle
 */
function toggleManualEdit() {


    const body =
        $("iaOutputBody");



    if (!body) return;



    body.contentEditable =
        body.contentEditable !== "true";



    showToast(
        body.contentEditable === "true"
        ?
        "Modification activée."
        :
        "Modification désactivée.",
        "info"
    );


    }


/* ==========================================================
   PARTIE 10 : ARCHIVES INTELLIGENTES
========================================================== */


/**
 * Charger les archives depuis localStorage
 */
function loadArchives() {


    const data =
        localStorage.getItem(
            STORAGE_ARCHIVES
        );



    if (data) {


        try {

            STATE.archiveData =
                JSON.parse(data);

        }

        catch(error) {

            STATE.archiveData = [];

        }


    }



    renderArchives();


}



/**
 * Sauvegarder une mission dans l'archive
 */
function saveReportToArchive() {


    if (!STATE.currentMission) {


        showToast(
            "Aucun rapport disponible.",
            "error"
        );

        return;

    }



    const archive = {


        id:
        Date.now(),


        date:
        STATE.currentMission.date,


        order:
        STATE.currentMission.order,


        group:
        STATE.currentMission.group,


        role:
        STATE.currentMission.role,


        company:
        STATE.currentMission.companies,


        direction:
        STATE.currentMission.direction,


        data:
        STATE.currentMission



    };



    STATE.archiveData.push(archive);



    localStorage.setItem(

        STORAGE_ARCHIVES,

        JSON.stringify(
            STATE.archiveData
        )

    );



    renderArchives();



    showToast(
        "Rapport enregistré dans les archives.",
        "success"
    );


}




/**
 * Affichage tableau archives
 */
function renderArchives(list = STATE.archiveData) {


    const tbody =
        $("archiveTbody");



    if (!tbody) return;



    tbody.innerHTML = "";



    list.forEach(item => {


        const tr =
            document.createElement("tr");



        tr.innerHTML = `

        <td>${item.date || ""}</td>

        <td>${item.order || ""}</td>

        <td>${item.group || ""}</td>

        <td>${item.role || ""}</td>

        <td>${item.company || ""}</td>

        <td>${item.direction || ""}</td>

        <td>
        Archivé
        </td>

        <td>

        <button 
        class="btn-outline"
        onclick="openArchive(${item.id})">

        Ouvrir

        </button>


        </td>

        `;



        tbody.appendChild(tr);


    });


}





/**
 * Recherche archives
 */
function searchArchives(value) {


    const query =
        value.toLowerCase()
        .trim();



    if (!query) {


        renderArchives();

        return;

    }



    const result =
        STATE.archiveData.filter(item => {


            return JSON.stringify(item)

            .toLowerCase()

            .includes(query);


        });



    renderArchives(result);


}





/**
 * Ouvrir une archive
 */
function openArchive(id) {


    const item =
        STATE.archiveData.find(

            archive =>
            archive.id === id

        );



    if (!item) return;



    STATE.currentMission =
        item.data;



    showSection("mission");



    previewMission();



    showToast(
        "Archive ouverte.",
        "success"
    );


      }


/* ==========================================================
   PARTIE 11 : TABLEAU DE BORD + INITIALISATION FINALE
========================================================== */


/**
 * Mise à jour des statistiques
 */
function updateDashboard() {


    const missions =
        STATE.archiveData.length;



    const entreprises =
        STATE.archiveData.filter(item =>

            item.company

        ).length;



    if ($("statMissions")) {

        $("statMissions").textContent =
            missions;

    }



    if ($("statEntreprises")) {

        $("statEntreprises").textContent =
            entreprises;

    }



    if ($("statConformes")) {

        $("statConformes").textContent =
            STATE.dashboard.conformes;

    }



    if ($("statNonConformes")) {

        $("statNonConformes").textContent =
            STATE.dashboard.nonConformes;

    }



    if ($("statPV")) {

        $("statPV").textContent =
            STATE.dashboard.pv;

    }



    if ($("statMED")) {

        $("statMED").textContent =
            STATE.dashboard.med;

    }


}



/**
 * Initialisation carte
 */
function initMapDashboard() {


    const mapElement =
        $("mapDashboard");



    if (!mapElement) return;



    if (mapElement.dataset.loaded) {

        return;

    }



    mapElement.dataset.loaded = "true";



    if (typeof L === "undefined") {

        return;

    }



    const map =
        L.map("mapDashboard")
        .setView(
            [-4.325,15.322],
            12
        );



    L.tileLayer(

        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

        {

            attribution:
            "OpenStreetMap"

        }

    ).addTo(map);



}





/**
 * Initialisation graphiques
 */
function initCharts() {


    if (
        typeof Chart === "undefined"
    ) {

        return;

    }



    const sector =
        $("sectorChart");



    if (sector) {


        new Chart(
            sector,
            {

                type:"bar",

                data:{

                    labels:[
                        "Industrie",
                        "Commerce",
                        "Services"
                    ],

                    datasets:[{

                        label:
                        "Missions",

                        data:[
                            0,
                            0,
                            0
                        ]

                    }]

                }

            }

        );


    }





    const monthly =
        $("monthlyChart");



    if (monthly) {


        new Chart(
            monthly,
            {

                type:"line",

                data:{

                    labels:[

                        "Jan",
                        "Fév",
                        "Mar",
                        "Avr",
                        "Mai",
                        "Juin"

                    ],

                    datasets:[{

                        label:
                        "Missions",

                        data:[
                            0,
                            0,
                            0,
                            0,
                            0,
                            0
                        ]

                    }]

                }

            }

        );


    }


}




/**
 * Chargement notes rapides
 */
function loadQuickNotes() {


    const notes =
        localStorage.getItem(
            STORAGE_NOTES
        );



    if ($("quickNotes") && notes) {

        $("quickNotes").value =
            notes;

    }


}



/**
 * Sauvegarde notes rapides
 */
function saveQuickNotes() {


    const notes =
        $("quickNotes");



    if (!notes) return;



    localStorage.setItem(

        STORAGE_NOTES,

        notes.value

    );



    showToast(
        "Notes sauvegardées.",
        "success"
    );

}



/**
 * Effacer notes
 */
function clearQuickNotes() {


    if ($("quickNotes")) {

        $("quickNotes").value = "";

    }


    localStorage.removeItem(
        STORAGE_NOTES
    );


}



/**
 * Copier notes
 */
function copyQuickNotes() {


    const notes =
        $("quickNotes");



    if (!notes) return;



    navigator.clipboard.writeText(

        notes.value

    );


    showToast(
        "Notes copiées.",
        "success"
    );

}





/* ==========================================================
   INITIALISATION COMPLÈTE
========================================================== */


document.addEventListener(
"DOMContentLoaded",
function(){


    loadArchives();

    loadModels();

    loadDifficultes();

    updateDashboard();

    initMapDashboard();

    initCharts();


});

      
