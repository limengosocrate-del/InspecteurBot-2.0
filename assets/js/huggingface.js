/*=========================================
 INSPECTEURBOT IA
 HUGGING FACE API
=========================================*/

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

        if (!response.ok) {
            return "Erreur de connexion au serveur IA.";
        }

        const data = await response.json();

        // Réponse Hugging Face
        if (Array.isArray(data) && data.length > 0 && data[0].generated_text) {
            return data[0].generated_text;
        }

        // Réponse personnalisée
        if (data.reponse) {
            return data.reponse;
        }

        // Erreur
        if (data.error) {
            return "Erreur : " + data.error;
        }

        return "Aucune réponse reçue.";

    } catch (e) {

        console.error(e);
        return "Impossible de contacter InspecteurBot IA.";

    }

}
