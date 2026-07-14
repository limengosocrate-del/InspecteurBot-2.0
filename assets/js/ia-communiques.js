/*==================================================
 INSPECTEURBOT RDC
 IA SPÉCIALISÉE - COMMUNIQUÉS OFFICIELS
==================================================*/

const IACommuniques = {

    repondre(question){

        if(!question){

            return "Veuillez saisir une question.";

        }

        const resultat = RAGCommuniques.bestResult(question);

        if(!resultat){

            return "Aucun communiqué correspondant n'a été trouvé.";

        }

        return `
📢 ${resultat.titre}

📅 Date : ${resultat.date}

👤 Auteur : ${resultat.auteur}

📂 Catégorie : ${resultat.categorie}

📝 ${resultat.description}
`;

    },

    ouvrir(question){

        const resultat = RAGCommuniques.bestResult(question);

        if(!resultat){

            alert("Aucun communiqué trouvé.");

            return;

        }

        const lecteur = document.getElementById("mainPlayer");

        if(lecteur){

            lecteur.src = resultat.audio;
            lecteur.load();
            lecteur.play();

        }

        return resultat;

    }

 /*==================================================
 INSPECTEURBOT RDC
 ASSISTANT VOCAL - COMMUNIQUÉS
==================================================*/

IACommuniques.lireTexte = function(texte){

    if(!("speechSynthesis" in window)){
        console.warn("Synthèse vocale non supportée.");
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


/*==================================================
 MICROPHONE
==================================================*/

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
    recognition.maxAlternatives = 1;

    recognition.onresult = function(event){

        const texte = event.results[0][0].transcript;

        const input = document.getElementById("searchCommunique");

        if(input){
            input.value = texte;
        }

        const doc = RAGCommuniques.bestResult(texte);

        if(doc){

            IACommuniques.afficherReponse(doc);

            IACommuniques.lireTexte(doc.description);

        }

    };

 if(btn){

btn.classList.remove("listening");

 }
 
    recognition.onerror = function(){

        console.log("Erreur reconnaissance vocale.");

    };

    recognition.start();

};

};

/*==================================================
 ANALYSE INTELLIGENTE DES QUESTIONS
==================================================*/

IACommuniques.analyser = function(question){

    if(!question){
        return;
    }

    question = question.toLowerCase().trim();

    /* Dernier communiqué */

    if(question.includes("dernier") ||
       question.includes("récent") ||
       question.includes("nouveau")){

        const dernier = RAGCommuniques.documents[0];

        if(dernier){

            this.ouvrir(dernier.titre);

            return this.repondre(dernier.titre);

        }

    }

    /* Recherche par numéro */

    const numero = question.match(/\d+/);

    if(numero){

        const recherche = "N°" + numero[0];

        this.ouvrir(recherche);

        return this.repondre(recherche);

    }

    /* Recherche générale */

    this.ouvrir(question);

    return this.repondre(question);

};


/*==================================================
 BOUTON DE RECHERCHE
==================================================*/

document.addEventListener("DOMContentLoaded", ()=>{

    const input = document.getElementById("searchCommunique");
    const bouton = document.getElementById("btnSearch");

    if(!input || !bouton){
        return;
    }

    bouton.addEventListener("click", ()=>{

        const reponse = IACommuniques.analyser(input.value);

        if(reponse){

         const doc = RAGCommuniques.bestResult(input.value);

        if(doc){

        IACommuniques.afficherReponse(doc);

        }

       });

    input.addEventListener("keypress", e=>{

        if(e.key==="Enter"){

            e.preventDefault();

            const reponse = IACommuniques.analyser(input.value);

            if(reponse){

                alert(reponse);

            }

        }

    });

});

/*==================================================
 INSPECTEURBOT RDC
 FENÊTRE IA PROFESSIONNELLE
==================================================*/
const btn=document.getElementById("btnVoice");

if(btn){

btn.classList.add("listening");

}


IACommuniques.afficherReponse = function(document){

    let ancienneFenetre = document.getElementById("iaCommuniqueModal");

    if(ancienneFenetre){
        ancienneFenetre.remove();
    }

    const modal = document.createElement("div");

    modal.id = "iaCommuniqueModal";

    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100%";
    modal.style.height = "100%";
    modal.style.background = "rgba(0,0,0,.65)";
    modal.style.zIndex = "999999";
    modal.style.display = "flex";
    modal.style.alignItems = "center";
    modal.style.justifyContent = "center";
    modal.style.padding = "20px";

    modal.innerHTML = `
        <div style="
            background:#062A73;
            width:100%;
            max-width:650px;
            border-radius:20px;
            padding:25px;
            color:white;
            box-shadow:0 0 30px rgba(0,0,0,.45);
            ">

            <h2 style="color:#FFD700;margin-bottom:15px;">
                🤖 InspecteurBot IA
            </h2>

            <h3>${document.titre}</h3>

            <p style="margin-top:15px;">
                📅 <b>Date :</b> ${document.date}
            </p>

            <p>
                👤 <b>Auteur :</b> ${document.auteur}
            </p>

            <p>
                📂 <b>Catégorie :</b> ${document.categorie}
            </p>

            <hr style="
                margin:20px 0;
                border:.5px solid rgba(255,255,255,.20);
            ">

            <p style="
                line-height:1.8;
                color:#e7f1ff;
            ">
                ${document.description}
            </p>

            <div style="
                display:flex;
                gap:10px;
                margin-top:25px;
                flex-wrap:wrap;
            ">

                <button
                    id="btnPlayIA"
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
                    id="btnCloseIA"
                    style="
                    flex:1;
                    padding:14px;
                    border:none;
                    border-radius:40px;
                    background:#ffffff;
                    cursor:pointer;
                    ">

                    Fermer

                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document
    .getElementById("btnCloseIA")
    .onclick = ()=>{

        modal.remove();

    };

    document
    .getElementById("btnPlayIA")
    .onclick = ()=>{

        chargerCommunique(document.audio);

    };

};

document.addEventListener("DOMContentLoaded", ()=>{

    const btnVoice = document.getElementById("btnVoice");

    if(btnVoice){

        btnVoice.addEventListener("click", ()=>{

            IACommuniques.demarrerMicro();

        });

    }

});
