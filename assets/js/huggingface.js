/*=========================================
 INSPECTEURBOT IA
 HUGGING FACE API
=========================================*/

const HF_API_KEY =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;;

async function demanderIA(question) {

    try {

        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + HF_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs:
                    "Tu es InspecteurBot RDC. Tu es un spécialiste du Code du Travail de la République Démocratique du Congo. Réponds uniquement en français.\n\n" + question
                })
            }
        );

        const data = await response.json();

        if (data.error) {
            return "❌ " + data.error;
        }

        if (Array.isArray(data)) {

            if (data[0].generated_text) {
                return data[0].generated_text;
            }

            if (data[0].summary_text) {
                return data[0].summary_text;
            }
        }

        return JSON.stringify(data);

    } catch (e) {

        console.error(e);

        return "Impossible de contacter Hugging Face.";

    }

             }
