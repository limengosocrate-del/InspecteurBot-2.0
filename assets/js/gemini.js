/*=========================================
 INSPECTEURBOT IA
 GEMINI API
=========================================*/

const GEMINI_API_KEY = "VOTRE_CLE_API_GEMINI";

async function demanderGemini(question) {

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text:
                            "Tu es InspecteurBot RDC, spécialiste du Code du Travail de la République Démocratique du Congo. Réponds en français de manière claire.\n\nQuestion : " + question
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        if (data.candidates &&
            data.candidates.length > 0) {

            return data.candidates[0]
                .content.parts[0].text;

        }

        return "Aucune réponse de Gemini.";

    } catch (e) {

        console.error(e);

        return "Impossible de contacter Gemini.";

    }

}
