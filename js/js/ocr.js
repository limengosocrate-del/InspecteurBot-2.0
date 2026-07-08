"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 ocr.js
 Reconnaissance OCR
===================================================*/

let ocrInput;

/*==================================================
 INITIALISATION
===================================================*/

function initOCR() {

    ocrInput =
        document.createElement("input");

    ocrInput.type = "file";
    ocrInput.accept = "image/*";
    ocrInput.capture = "environment";
    ocrInput.style.display = "none";

    document.body.appendChild(ocrInput);

    ocrInput.addEventListener(
        "change",
        handleOCR
    );

}

/*==================================================
 OUVRIR OCR
===================================================*/

function openOCR() {

    if (ocrInput) {

        ocrInput.click();

    }

}

/*==================================================
 LECTURE OCR
===================================================*/

async function handleOCR(event) {

    const file =
        event.target.files[0];

    if (!file) return;

    showNotification(
        "OCR",
        "Analyse du document..."
    );

    try {

        const result =
            await Tesseract.recognize(
                file,
                "fra"
            );

        const text =
            result.data.text;

        Storage.save(
            "lastOCR",
            text
        );

        showOCRResult(text);

    }

    catch (error) {

        console.error(error);

        showNotification(
            "OCR",
            "Erreur pendant l'analyse."
        );

    }

}

/*==================================================
 AFFICHER RESULTAT
===================================================*/

function showOCRResult(text) {

    const old =
        document.querySelector(
            ".ocr-result"
        );

    if (old) {

        old.remove();

    }

    const box =
        document.createElement("div");

    box.className =
        "ocr-result";

    box.innerHTML = `

        <h3>📄 Texte détecté</h3>

        <textarea rows="12">${text}</textarea>

        <br><br>

        <button id="closeOCR">

        Fermer

        </button>

    `;

    document.body.appendChild(box);

    document
        .getElementById("closeOCR")
        .addEventListener(
            "click",
            () => {

                box.remove();

            }
        );

}

/*==================================================
 DERNIER OCR
===================================================*/

function getLastOCR() {

    return Storage.get(
        "lastOCR"
    );

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    initOCR
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.openOCR = openOCR;
window.getLastOCR = getLastOCR;
