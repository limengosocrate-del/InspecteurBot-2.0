"use strict";

/*====================================================
 INSPECTEURBOT IA RDC
 F03 - HYGIÈNE ET SANTÉ AU TRAVAIL
 Partie 1
====================================================*/

const F03 = {

    dataKey: "InspecteurBot_F03",

    blocks: [

        [
            "EFFECTIFS DE TRAVAILLEURS PERMANENTS VENTILÉS SELON LE SEXE",
            "NATIONAUX",
            "EXPATRIÉS",
            "TOTAL",
            "RATIO",
            true
        ],

        [
            "EFFECTIFS DES CONTRACTANTS",
            "NATIONAUX",
            "EXPATRIÉS",
            "TOTAL",
            "",
            false
        ],

        [
            "EFFECTIFS DES TRAVAILLEURS SOUS-TRAITÉS (SOUS ENTREPRISES)",
            "NATIONAUX",
            "EXPATRIÉS",
            "TOTAL",
            "",
            false
        ],

        [
            "EFFECTIFS DES TRAVAILLEURS TEMPORAIRES",
            "NATIONAUX",
            "EXPATRIÉS",
            "TOTAL",
            "",
            false
        ]

    ],

    documents: [

        "Assurance maladie",

        "Convention médicale visée",

        "Installation sanitaire",

        "Vestiaire des Travailleurs (Homme et Femme)",

        "Boîte de secours",

        "Comité d'hygiène et d'embellissement des lieux de Travail",

        "• Composition",

        "• PV d'installation",

        "• Attestation de fonctionnement du CHSE",

        "• PV des réunions",

        "• PV de constat d'infraction",

        "• Rapport annuel des activités",

        "Service médical de l'Entreprise",

        "Comité de lutte et de prévention contre le VIH/SIDA"

    ],

    init() {

        this.renderBlocks();

        this.renderDocuments();

        this.load();

        this.autoSave();

    },

    renderBlocks() {

        const container = document.getElementById("blocksContainer");

        if (!container) return;

        container.innerHTML = "";

        this.blocks.forEach(block => {

            const table = document.createElement("table");

            table.className = "tab";

            let html = `
<tr>
<th colspan="9" class="bar">${block[0]}</th>
${block[4] ? `<th colspan="2" class="bar">${block[4]}</th>` : ""}
</tr>

<tr>

<th colspan="3">${block[1]}</th>

<th colspan="3">${block[2]}</th>

<th colspan="3">${block[3]}</th>

${block[5] ? "<th>CONFORME</th><th>NON CONFORME</th>" : ""}

</tr>

<tr>

<th>H</th>
<th>F</th>
<th>T</th>

<th>H</th>
<th>F</th>
<th>T</th>

<th>H</th>
<th>F</th>
<th>T</th>

${block[5]
?
'<th rowspan="2"><input class="inp"></th><th rowspan="2"><input class="inp"></th>'
:
""}

</tr>

<tr>
`;

            for (let i = 0; i < 9; i++) {

                html += `
<td>
<input class="inp" type="number" min="0">
</td>
`;

            }

            html += "</tr>";

            table.innerHTML = html;

            container.appendChild(table);

        });

    },

    renderDocuments() {

        const tbody = document.getElementById("docsContainer");

        if (!tbody) return;

        tbody.innerHTML = "";

        this.documents.forEach(doc => {

            const tr = document.createElement("tr");

            tr.innerHTML = `
<td class="lbl">${doc}</td>

<td>
<input class="inp" type="checkbox">
</td>

<td>
<input class="inp" type="checkbox">
</td>

<td>
<input class="inp" type="checkbox">
</td>
`;

            tbody.appendChild(tr);

        });

    },

      /*====================================================
    DICTÉE VOCALE
    ====================================================*/

    dictate() {

        if (!("webkitSpeechRecognition" in window)) {
            alert("Votre navigateur ne prend pas en charge la dictée vocale.");
            return;
        }

        const recognition = new webkitSpeechRecognition();

        recognition.lang = "fr-FR";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {

            const active = document.activeElement;

            if (
                active &&
                (active.tagName === "INPUT" || active.tagName === "TEXTAREA")
            ) {
                active.value = event.results[0][0].transcript;
                active.dispatchEvent(new Event("input"));
            }

        };

        recognition.start();

    },

    /*====================================================
    ANALYSE IA
    ====================================================*/

    analyze() {

        alert(
`⚖️ F03 – HYGIÈNE ET SANTÉ AU TRAVAIL

Références légales :
• Articles 159 à 176 du Code du Travail
• Comité d'Hygiène, Sécurité et Environnement (CHSE)
• Service de médecine du travail

Points essentiels à contrôler :
✓ Assurance maladie
✓ Convention médicale
✓ Installations sanitaires
✓ Vestiaires H/F
✓ Boîte de secours
✓ CHSE
✓ Service médical
✓ Prévention VIH/SIDA`
        );

    },

    /*====================================================
    SAUVEGARDE
    ====================================================*/

    save() {

        const data = {};

        document.querySelectorAll(".inp").forEach((el, index) => {

            if (el.type === "checkbox") {
                data["f" + index] = el.checked;
            } else {
                data["f" + index] = el.value;
            }

        });

        localStorage.setItem(
            this.dataKey,
            JSON.stringify(data)
        );

        alert("💾 Fiche F03 enregistrée avec succès.");

    },

    /*====================================================
    CHARGEMENT
    ====================================================*/

    load() {

        const saved = localStorage.getItem(this.dataKey);

        if (!saved) return;

        const data = JSON.parse(saved);

        document.querySelectorAll(".inp").forEach((el, index) => {

            const value = data["f" + index];

            if (value === undefined) return;

            if (el.type === "checkbox") {
                el.checked = value;
            } else {
                el.value = value;
            }

        });

    },

    /*====================================================
    SAUVEGARDE AUTOMATIQUE
    ====================================================*/

    autoSave() {

        document.addEventListener("input", () => {

            clearTimeout(this.saveTimer);

            this.saveTimer = setTimeout(() => {

                this.save();

            }, 800);

        });

    },

    /*====================================================
    IMPRESSION
    ====================================================*/

    print() {

        window.print();

    },

      /*====================================================
    SIGNATURE
    ====================================================*/

    sign(btn) {

        const box = btn.parentElement.querySelector(".signature-box");

        if (!box) return;

        const nom = prompt("Nom et prénom du signataire :");

        if (!nom) return;

        box.classList.add("signed");

        box.innerHTML = `
            <div class="signature-name">${nom}</div>
            <small>${new Date().toLocaleString("fr-FR")}</small>
        `;

        this.save();

    },

    /*====================================================
    EFFACER SIGNATURE
    ====================================================*/

    clearSignature(type) {

        let box = null;

        if (type === "employer") {

            box = document.getElementById("signatureEmployer");

        } else {

            box = document.getElementById("signatureInspector");

        }

        if (!box) return;

        box.classList.remove("signed");

        box.innerHTML = "";

        this.save();

    }

};

/*====================================================
INITIALISATION
====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    F03.init();

});
