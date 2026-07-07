/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 scanner.js
 Scanner QR Code
===================================================*/

"use strict";


let qrScanner = null;


/*==================================================
 INITIALISATION SCANNER
===================================================*/

function initScanner(){


    const btnCamera =
        document.getElementById(
            "btnCamera"
        );


    if(!btnCamera) return;



    btnCamera.addEventListener(
        "click",
        openScanner
    );


}



/*==================================================
 OUVRIR SCANNER
===================================================*/

function openScanner(){


    let container =
        document.getElementById(
            "qr-reader"
        );



    if(!container){


        container =
            document.createElement(
                "div"
            );


        container.id =
            "qr-reader";


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
            facingMode:
            "environment"
        },


        {
            fps:10,
            qrbox:250
        },


        qrCodeMessage=>{


            showMessage(
                "QR détecté : "
                + qrCodeMessage,
                "success"
            );


            logAction(
                "QR Code : "
                + qrCodeMessage
            );



            stopScanner();


        },


        errorMessage=>{


            console.log(
                errorMessage
            );


        }


    )
    .catch(error=>{


        console.error(
            error
        );


        showMessage(
            "Caméra inaccessible",
            "error"
        );


    });


}



/*==================================================
 ARRETER SCANNER
===================================================*/

function stopScanner(){


    if(qrScanner){


        qrScanner.stop()

        .then(()=>{


            qrScanner.clear();


        });


    }



    const container =
        document.getElementById(
            "qr-reader"
        );



    if(container){


        container.remove();


    }


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initScanner();


});
