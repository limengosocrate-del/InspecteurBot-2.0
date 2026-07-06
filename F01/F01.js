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
   DOCUMENTS F01
======================================================= */

const DOCS_F01 = [

    { key:"declaration_etablissement", label:"Déclaration d'Établissement (article 216 du CT)" },

    { key:"reglement_entreprise", label:"Règlement d'entreprise (article 157 du CT)" },

    { key:"convention_collective", label:"Convention collective (n°199 du Code du Travail)" },

    { key:"horaire", label:"Horaire du Travail (article 119 du CT)" },

    { key:"classification", label:"Classification Générale des Emplois (article 90 du CT)" },

    { key:"bulletin_paie", label:"Feuille de paie de trois derniers mois" },

    { key:"bilan_social", label:"Bilan social (article 218 du Code du Travail)" },

    { key:"preuve_cnss", label:"Preuve de paiement CNSS, ONEM, INPP et IPR" },

    { key:"declaration_annuelle", label:"Déclaration annuelle de la main d'œuvre" },

    { key:"registre_non_perm", label:"Registre des travailleurs non permanents" },

    { key:"contrat_travail", label:"Contrat de travail visé" },

    { key:"mouvement", label:"Déclaration de mouvement des travailleurs" },

    { key:"aptitude", label:"Certificat d'aptitude au travail" },

    { key:"decompte", label:"Décompte de rémunération" },

    { key:"conge", label:"Titre de congé" },

    { key:"smig", label:"Application du SMIG" }

];

/* =======================================================
   TABLE DES DOCUMENTS
======================================================= */

function initDocsTable() {

    const tb = document.getElementById("docTableBody");

    if (!tb) return;

    DOCS_F01.forEach(doc => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${doc.label}</td>

            <td><input type="radio" name="${doc.key}" onchange="checkDoc('${doc.key}',true)"></td>

            <td><input type="radio" name="${doc.key}" onchange="checkDoc('${doc.key}',false)"></td>

            <td><input type="radio" name="${doc.key}" onchange="checkDoc('${doc.key}',false)"></td>
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
   CALCUL
======================================================= */

function calcF01() {

    const row = document.querySelector(".data-table tbody tr");

    if (!row) return;

    const cells = row.cells;

    const v = i => parseInt(cells[i].querySelector("input")?.value || 0);

    const nh = v(0);
    const nf = v(1);
    const eh = v(3);
    const ef = v(4);

    const nt = nh + nf;
    const et = eh + ef;
    const th = nh + eh;
    const tf = nf + ef;
    const tg = nt + et;

    if (document.getElementById("nat-total")) document.getElementById("nat-total").textContent = nt;
    if (document.getElementById("exp-total")) document.getElementById("exp-total").textContent = et;
    if (document.getElementById("tot-h")) document.getElementById("tot-h").textContent = th;
    if (document.getElementById("tot-f")) document.getElementById("tot-f").textContent = tf;
    if (document.getElementById("tot-global")) document.getElementById("tot-global").textContent = tg;

}

/* =======================================================
   SIGNATURE
======================================================= */

function clearSign(id) {

    if (window[id]) {
        window[id].clear();
    }

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

        box.innerHTML = "<p style='color:#4caf50;'>✅ Aucune infraction majeure détectée.</p>";

        return;

    }

    box.innerHTML = results.map(r => `
        <div style="margin-bottom:8px;padding:8px;background:rgba(255,0,0,.1);border-left:4px solid red;">
            <strong>${r.article}</strong><br>
            ${r.infraction}<br>
            <em>${r.sanction}</em>
        </div>
    `).join("");

}

/* =======================================================
   ENREGISTREMENT
======================================================= */

function saveF01() {

    const payload = {

        form: "F01",

        state: formState,

        conclusion: document.querySelector("input[name='conclusion']:checked")?.value || "",

        decision: document.getElementById("decisionAdmin")?.value || "",

        signatures: {

            employeur: window.signEmployeur?.getData(),

            inspecteur: window.signInspecteur?.getData()

        },

        refus: document.getElementById("refusEmployeur")?.checked || false

    };

    const id = saveForm("F01", payload);

    alert("Formulaire enregistré.\nID : " + id);

}
