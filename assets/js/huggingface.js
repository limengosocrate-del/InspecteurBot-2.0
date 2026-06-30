/*=========================================
 INSPECTEURBOT IA
 HUGGING FACE API
=========================================*/

const HF_API_KEY = "VOTRE_TOKEN_HUGGINGFACE";

async function demanderIA(question) {

    try {

        const response = await fetch(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + HF_API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    inputs:
                        "Tu es InspecteurBot RDC, spécialiste du Code du Travail de la République Démocratique du Congo. Réponds uniquement en français.\n\nQuestion : " + question
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
