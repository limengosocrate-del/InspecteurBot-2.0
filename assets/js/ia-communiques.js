/*==========================================================
 INSPECTEURBOT RDC
 IA SPÉCIALISÉE - COMMUNIQUÉS OFFICIELS
 Version : 1.0
 Auteur : InspecteurBot IA
==========================================================*/

"use strict";

/*==========================================================
 OBJET PRINCIPAL
==========================================================*/

const IACommuniques = {

    historique: [],

    dernierResultat: null,

    /*======================================================
     NORMALISATION
    ======================================================*/

    normaliser(texte){

        if(!texte) return "";

        return texte
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g,"")
            .trim();

    },

    /*======================================================
     ENREGISTREMENT HISTORIQUE
    ======================================================*/

    ajouterHistorique(question,resultat){

        this.historique.push({

            date:new Date(),

            question,

            resultat

        });

        if(this.historique.length>50){

            this.historique.shift();

        }

    },

    /*======================================================
     RECHERCHE RAG
    ======================================================*/

    rechercher(question){

        if(!question){

            return null;

        }

        if(typeof RAGCommuniques==="undefined"){

            console.error("RAGCommuniques introuvable.");

            return null;

        }

        const resultat=RAGCommuniques.bestResult(question);

        if(resultat){

            this.dernierResultat=resultat;

            this.ajouterHistorique(question,resultat);

        }

        return resultat;

    },

    /*======================================================
     RÉPONSE IA
    ======================================================*/

    repondre(question){

        const doc=this.rechercher(question);

        if(!doc){

            return{

                succes:false,

                message:"Aucun communiqué correspondant n'a été trouvé."

            };

        }

        return{

            succes:true,

            document:doc,

            message:
`📢 ${doc.titre}

📅 Date : ${doc.date}

👤 Auteur : ${doc.auteur}

📂 Catégorie : ${doc.categorie}

📝 ${doc.description}`

        };

    },

    /*======================================================
     ANALYSE INTELLIGENTE
    ======================================================*/

    analyser(question){

        if(!question){

            return{

                succes:false,

                message:"Veuillez saisir une recherche."

            };

        }

        question=this.normaliser(question);

        /* Dernier communiqué */

        if(
            question.includes("dernier") ||
            question.includes("recent") ||
            question.includes("nouveau")
        ){

            if(
                RAGCommuniques.documents &&
                RAGCommuniques.documents.length
            ){

                return this.repondre(
                    RAGCommuniques.documents[0].titre
                );

            }

        }

        /* Recherche numéro */

        const numero=question.match(/\d+/);

        if(numero){

            return this.repondre(numero[0]);

        }

        /* Recherche générale */

        return this.repondre(question);

    }

};

/*==========================================================
 INSPECTEURBOT RDC
 SYNTHÈSE VOCALE
==========================================================*/

IACommuniques.lireTexte = function(texte){

    if(!("speechSynthesis" in window)){
        console.warn("Synthèse vocale non disponible.");
        return;
    }

    window.speechSynthesis.cancel();

    const voix = new SpeechSynthesisUtterance(texte);

    voix.lang = "fr-FR";
    voix.rate = 1;
    voix.pitch = 1;
    voix.volume = 1;

    window.speechSynthesis.speak(voix);

};


/*==========================================================
 RECONNAISSANCE VOCALE
==========================================================*/

IACommuniques.demarrerMicro = function(){

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if(!SpeechRecognition){

        alert("Votre navigateur ne prend pas en charge la reconnaissance vocale.");

        return;

    }

    const recognition = new SpeechRecognition();

    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.maxAlternatives = 1;

    const btn = document.getElementById("btnVoice");

    if(btn){

        btn.classList.add("listening");

    }

    recognition.onstart = function(){

        console.log("🎤 Microphone actif");

    };

    recognition.onresult = function(event){

        const texte = event.results[0][0].transcript;

        const input = document.getElementById("searchCommunique");

        if(input){

            input.value = texte;

        }

        const resultat = IACommuniques.analyser(texte);

        if(resultat.succes){

            IACommuniques.afficherReponse(resultat.document);

            IACommuniques.lireTexte(resultat.document.description);

        }else{

            alert(resultat.message);

        }

    };

    recognition.onerror = function(e){

        console.error("Erreur microphone :", e.error);

        if(btn){

            btn.classList.remove("listening");

        }

    };

    recognition.onend = function(){

        console.log("🎤 Micro arrêté");

        if(btn){

            btn.classList.remove("listening");

        }

    };

    recognition.start();

};


/*==========================================================
 ARRÊTER LA VOIX
==========================================================*/

IACommuniques.stopVoix = function(){

    if("speechSynthesis" in window){

        window.speechSynthesis.cancel();

    }

};


/*==========================================================
 LECTURE AUTOMATIQUE D'UN COMMUNIQUÉ
==========================================================*/

IACommuniques.ouvrir = function(document){

    if(!document){

        return;

    }

    const lecteur = document.getElementById("mainPlayer");

    if(lecteur){

        lecteur.src = document.audio;

        lecteur.load();

        lecteur.play();

    }

};

/*==========================================================
 INSPECTEURBOT RDC
 FENÊTRE IA PROFESSIONNELLE
==========================================================*/

IACommuniques.afficherReponse = function(doc){

    if(!doc){
        return;
    }

    /* Fermer une ancienne fenêtre */

    const ancienne = document.getElementById("iaCommuniqueModal");

    if(ancienne){

        ancienne.remove();

    }

    /* Création du fond */

    const overlay = document.createElement("div");

    overlay.id = "iaCommuniqueModal";

    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,.65)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.padding = "20px";
    overlay.style.zIndex = "999999";

    overlay.innerHTML = `

<div style="
background:#062A73;
width:100%;
max-width:720px;
border-radius:22px;
padding:28px;
color:#ffffff;
box-shadow:0 15px 45px rgba(0,0,0,.45);
">

<h2 style="
color:#FFD700;
margin-bottom:18px;
">

🤖 InspecteurBot IA

</h2>

<h3 style="margin-bottom:15px;">

${doc.titre}

</h3>

<p>

📅 <strong>Date :</strong>

${doc.date}

</p>

<p>

👤 <strong>Auteur :</strong>

${doc.auteur}

</p>

<p>

📂 <strong>Catégorie :</strong>

${doc.categorie}

</p>

<hr style="
margin:20px 0;
border:.5px solid rgba(255,255,255,.18);
">

<p style="
line-height:1.9;
color:#eaf2ff;
">

${doc.description}

</p>

<div style="
display:flex;
gap:12px;
flex-wrap:wrap;
margin-top:28px;
">

<button
id="btnLireIA"
style="
flex:1;
padding:14px;
border:none;
border-radius:40px;
background:#FFD700;
color:#04215f;
font-weight:bold;
cursor:pointer;
">

🎧 Écouter

</button>

<button
id="btnVoixIA"
style="
flex:1;
padding:14px;
border:none;
border-radius:40px;
background:#0d6efd;
color:white;
font-weight:bold;
cursor:pointer;
">

🔊 Lire

</button>

<button
id="btnFermerIA"
style="
flex:1;
padding:14px;
border:none;
border-radius:40px;
background:#ffffff;
color:#04215f;
font-weight:bold;
cursor:pointer;
">

Fermer

</button>

</div>

</div>

`;

    document.body.appendChild(overlay);

    /* Lecture audio */

    document
    .getElementById("btnLireIA")
    .onclick = function(){

        IACommuniques.ouvrir(doc);

    };

    /* Lecture vocale */

    document
    .getElementById("btnVoixIA")
    .onclick = function(){

        IACommuniques.lireTexte(doc.description);

    };

    /* Fermeture */

    document
    .getElementById("btnFermerIA")
    .onclick = function(){

        IACommuniques.stopVoix();

        overlay.remove();

    };

    /* Fermer en cliquant hors de la fenêtre */

    overlay.onclick = function(e){

        if(e.target===overlay){

            IACommuniques.stopVoix();

            overlay.remove();

        }

    };

};

/*==========================================================
 INSPECTEURBOT RDC
 INITIALISATION DU MODULE IA COMMUNIQUÉS
 Version : 1.0
==========================================================*/

document.addEventListener("DOMContentLoaded", () => {

    const input = document.getElementById("searchCommunique");
    const btnSearch = document.getElementById("btnSearch");
    const btnVoice = document.getElementById("btnVoice");

    /*==============================================
      RECHERCHE PAR BOUTON
    ==============================================*/

    if(btnSearch){

        btnSearch.addEventListener("click", () => {

            executerRecherche();

        });

    }

    /*==============================================
      RECHERCHE PAR TOUCHE ENTRÉE
    ==============================================*/

    if(input){

        input.addEventListener("keypress", function(e){

            if(e.key === "Enter"){

                e.preventDefault();

                executerRecherche();

            }

        });

    }

    /*==============================================
      MICROPHONE
    ==============================================*/

    if(btnVoice){

        btnVoice.addEventListener("click", () => {

            IACommuniques.demarrerMicro();

        });

    }

    /*==============================================
      FONCTION DE RECHERCHE
    ==============================================*/

    function executerRecherche(){

        if(!input){

            return;

        }

        const question = input.value.trim();

        if(question === ""){

            alert("Veuillez saisir votre recherche.");

            input.focus();

            return;

        }

        const resultat = IACommuniques.analyser(question);

        if(resultat.succes){

            IACommuniques.afficherReponse(resultat.document);

        }

        else{

            alert(resultat.message);

        }

    }

    console.log("======================================");
    console.log(" InspecteurBot RDC");
    console.log(" IA Communiqués initialisée");
    console.log("======================================");

});


/*==========================================================
 FONCTIONS PUBLIQUES
==========================================================*/

window.IACommuniques = IACommuniques;


/*==========================================================
 FIN DU MODULE
==========================================================*/
