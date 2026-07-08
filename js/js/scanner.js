"use strict";

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 scanner.js
 Scanner QR Code
===================================================*/

let qrScanner = null;

/*==================================================
 INITIALISATION
===================================================*/

function initScanner() {

    if (typeof Html5Qrcode === "undefined") {

        console.warn(
            "Bibliothèque Html5Qrcode absente."
        );

        return;

    }

}

/*==================================================
 OUVRIR SCANNER
===================================================*/

function openScanner() {

    if (typeof Html5Qrcode === "undefined") {

        if (typeof showNotification === "function") {

            showNotification(
                "Scanner",
                "Bibliothèque du scanner non chargée."
            );

        }

        return;

    }

    let container =
        document.getElementById(
            "qr-reader"
        );

    if (!container) {

        container =
            document.createElement("div");

        container.id = "qr-reader";

        container.style.width = "320px";
        container.style.margin = "20px auto";

        document.body.appendChild(
            container
        );

    }

    qrScanner =
        new Html5Qrcode(
            "qr-reader"
        );

    qrScanner.start(

        {
            facingMode: "environment"
        },

        {
            fps: 10,
            qrbox: 250
        },

        (decodedText) => {

            if (typeof showNotification === "function") {

                showNotification(
                    "Scanner",
                    "QR détecté : " + decodedText
                );

            }

            stopScanner();

        },

        () => {
            /* aucune action */
        }

    ).catch(error => {

        console.error(error);

        if (typeof showNotification === "function") {

            showNotification(
                "Scanner",
                "Impossible d'accéder à la caméra."
            );

        }

    });

}

/*==================================================
 FERMER SCANNER
===================================================*/

function stopScanner() {

    if (qrScanner) {

        qrScanner.stop()

            .then(() => {

                qrScanner.clear();

                qrScanner = null;

            })

            .catch(console.error);

    }

    const container =
        document.getElementById(
            "qr-reader"
        );

    if (container) {

        container.remove();

    }

}

/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initScanner();

    }
);

/*==================================================
 EXPORT GLOBAL
===================================================*/

window.openScanner = openScanner;
window.stopScanner = stopScanner;
