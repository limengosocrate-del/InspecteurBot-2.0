/*=========================================
 INSPECTEURBOT IA
 HUGGING FACE API
=========================================*/

const HF_API_KEY = "";

async function demanderIA(question) {

    try {

        const response = await fetch(
            "https://inspecteurb-ia.limengosocrate.workers.dev",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question: question
                })
            }
        );

        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
            return data[0].generated_text;
        }

        if (data.error) {
            return "Erreur : " + data.error;
        }

        return "Aucune réponse reçue.";

    } catch (e) {

        console.error(e);
        return "Impossible de contacter l'IA.";

    }

         }
