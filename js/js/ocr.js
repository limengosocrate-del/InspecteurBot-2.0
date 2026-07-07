/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 ocr.js
 Reconnaissance de texte OCR
===================================================*/

"use strict";


let ocrResult = "";



/*==================================================
 INITIALISATION OCR
===================================================*/

function initOCR(){


    createOCRInterface();


}



/*==================================================
 CREATION INTERFACE OCR
===================================================*/

function createOCRInterface(){


    const btnCamera =
        document.getElementById(
            "btnCamera"
        );


    if(!btnCamera) return;



    const input =
        document.createElement(
            "input"
        );


    input.type =
        "file";


    input.accept =
        "image/*";


    input.capture =
        "environment";


    input.id =
        "ocrInput";


    input.style.display =
        "none";


    document.body.appendChild(
        input
    );



    btnCamera.addEventListener(
        "click",
        ()=>{


            input.click();


        }
    );



    input.addEventListener(
        "change",
        event=>{


            const file =
                event.target.files[0];


            if(file){

                readDocument(file);

            }


        }
    );


}



/*==================================================
 LECTURE DOCUMENT
===================================================*/

async function readDocument(file){


    showMessage(
        "Analyse du document en cours..."
    );


    try{


        const result =
            await Tesseract.recognize(

                file,

                "fra",

                {

                    logger:
                    data=>{


                        console.log(
                            data
                        );


                    }

                }

            );



        ocrResult =
            result.data.text;



        Storage.save(
            "lastOCR",
            ocrResult
        );



        showOCRResult(
            ocrResult
        );



        logAction(
            "Document analysé par OCR"
        );


    }

    catch(error){


        console.error(
            error
        );


        showMessage(
            "Erreur OCR",
            "error"
        );


    }


}



/*==================================================
 AFFICHER RESULTAT
===================================================*/

function showOCRResult(text){


    const box =
        document.createElement(
            "div"
        );


    box.className =
        "ocr-result";


    box.innerHTML = `


    <h3>
    📄 Texte détecté
    </h3>


    <textarea>

${text}

    </textarea>


    <button id="analyzeOCR">

    🤖 Analyser avec IA

    </button>


    `;



    document.body.appendChild(
        box
    );



    document
    .getElementById(
        "analyzeOCR"
    )
    .onclick =
    ()=>{


        if(
            typeof generateAnswer
            === "function"
        ){


            const response =
                generateAnswer(
                    text
                );


            alert(
                response
            );


        }


    };


}



/*==================================================
 RECUPERER DERNIER OCR
===================================================*/

function getLastOCR(){


    return Storage.get(
        "lastOCR"
    );


}



/*==================================================
 DEMARRAGE
===================================================*/

document.addEventListener(
"DOMContentLoaded",
()=>{


    initOCR();


});
