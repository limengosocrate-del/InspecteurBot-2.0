"use strict";

document.addEventListener("DOMContentLoaded", () => {

    initTheme();

    populateLists();

    initDocsTable();

    if (document.getElementById("signEmployeur")) {
        window.signEmployeur = initCanvas("signEmployeur");
    }

    if (document.getElementById("signInspecteur")) {
        window.signInspecteur = initCanvas("signInspecteur");
    }

    const tel = document.getElementById("tel");

    if (tel) {
        tel.addEventListener("focus", () => {
            if (!tel.value.startsWith("+243")) {
                tel.value = "+243";
            }
        });
    }

});

/* =======================================================
   LISTE DES SECTEURS
======================================================= */

function populateLists() {

    const sec = document.getElementById("secteur");

    if (sec && typeof SECTEURS !== "undefined") {

        SECTEURS.forEach(s => {
            sec.add(new Option(s, s));
        });

    }

}

/* =======================================================
   DOCUMENTS F02
======================================================= */

const DOCS_F02 = [

    {
        key: "autorisation_travail",
        label: "Autorisation de Travail"
    },

    {
        key: "carte_travail",
        label: "Carte de Travail pour Étranger"
    },

    {
        key: "visa_travail",
        label: "Visa de Travail"
    },

    {
        key: "passeport",
        label: "Passeport valide"
    },

    {
        key: "contrat_travail",
        label: "Contrat de Travail visé"
    },

    {
        key: "liste_expatries",
        label: "Liste des Travailleurs Expatriés"
    },

    {
        key: "declaration_embauche",
        label: "Déclaration d'Embauche"
    },

    {
        key: "preuve_cnss",
        label: "Affiliation CNSS"
    },

    {
        key: "registre_personnel",
        label: "Registre du Personnel"
    },

    {
        key: "titre_sejour",
        label: "Titre ou Permis de Séjour"
    },

    {
        key: "quittance_fiscale",
        label: "Quittance Fiscale"
    },

    {
        key: "autorisation_migration",
        label: "Autorisation DGM / Migration"
    }

];

/* =======================================================
   TABLE DES DOCUMENTS
======================================================= */

function initDocsTable() {

    const tb = document.getElementById("docTableBody");

    if (!tb) return;

    DOCS_F02.forEach(doc => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${doc.label}</td>

            <td>
                <input
                type="radio"
                name="${doc.key}"
                onchange="checkDoc('${doc.key}',true)">
            </td>

            <td>
                <input
                type="radio"
                name="${doc.key}"
                onchange="checkDoc('${doc.key}',false)">
            </td>

            <td>
                <input
                type="radio"
                name="${doc.key}"
                onchange="checkDoc('${doc.key}',false)">
            </td>

        `;

        tb.appendChild(tr);

    });

}

/* =======================================================
   ETAT DU FORMULAIRE
======================================================= */

const formState = {};

function checkDoc(key, exists) {

    formState[key] = exists;

      }
/* =======================================================
   ANALYSE IA
======================================================= */

function runAnalysis() {

    const panel = document.getElementById("iaPanel");
    const box = document.getElementById("iaResults");

    if (!panel || !box) return;

    const results = analyseJuridique(formState);

    panel.style.display = "block";

    if (results.length === 0) {

        box.innerHTML =
        "<p style='color:#4caf50;'>✅ Aucune infraction majeure détectée.</p>";

        return;

    }

    box.innerHTML = results.map(r => `

        <div
        style="
        margin-bottom:8px;
        padding:8px;
        background:rgba(255,0,0,.1);
        border-left:4px solid red;">

            <strong>${r.article}</strong><br>

            ${r.infraction}<br>

            <em>${r.sanction}</em>

        </div>

    `).join("");

}

/* =======================================================
   ENREGISTREMENT
======================================================= */

function saveF02() {

    const payload = {

        form: "F02",

        state: formState,

        conclusion:

        document.querySelector(
            "input[name='conclusion']:checked"
        )?.value || "",

        decision:

        document.getElementById(
            "decisionAdmin"
        )?.value || "",

        signatures: {

            employeur:

            window.signEmployeur?.getData(),

            inspecteur:

            window.signInspecteur?.getData()

        },

        refus:

        document.getElementById(
            "refusEmployeur"
        )?.checked || false

    };

    const id = saveForm(

        "F02",

        payload

    );

    alert(

        "Formulaire enregistré.\nID : " + id

    );

}
