"use strict";

/*==================================================
 IA.JS
 INSPECTEURBOT RDC 2026
 ASSISTANT JURIDIQUE INTELLIGENT
==================================================*/

const AssistantIA = {};

window.AssistantIA = AssistantIA;

/*==================================================
 ÉTAT
==================================================*/

AssistantIA.initialisee = false;

AssistantIA.synthese = window.speechSynthesis;

AssistantIA.voix = {

    femme: null,

    homme: null

};

AssistantIA.articleActuel = null;

AssistantIA.question = "";

AssistantIA.reponse = "";

AssistantIA.enCours = false;

/*==================================================
 INITIALISATION
==================================================*/

AssistantIA.initialiser = function () {

    if (this.initialisee) return;

    this.initialisee = true;

    console.log("🤖 Assistant IA démarré");

    this.chargerVoix();

    this.initialiserBoutons();

};

/*==================================================
 CHARGEMENT DES VOIX
==================================================*/

AssistantIA.chargerVoix = function () {

    const voix = speechSynthesis.getVoices();

    if (!voix.length) {

        setTimeout(() => {

            AssistantIA.chargerVoix();

        }, 300);

        return;

    }

    this.voix.femme =

        voix.find(v =>
            v.lang.startsWith("fr") &&
            v.name.toLowerCase().includes("female")
        ) ||

        voix.find(v =>
            v.lang.startsWith("fr")
        ) ||

        voix[0];

    this.voix.homme =

        voix.find(v =>
            v.lang.startsWith("fr") &&
            v.name.toLowerCase().includes("male")
        ) ||

        voix.find(v =>
            v.lang.startsWith("fr")
        ) ||

        voix[0];

};

/*==================================================
 PARLER
==================================================*/

AssistantIA.parler = function (

    texte,

    genre = "femme"

) {

    if (!texte) return;

    if (!this.synthese) return;

    this.stop();

    const lecture =
        new SpeechSynthesisUtterance(texte);

    lecture.lang = "fr-FR";

    lecture.rate = 1;

    lecture.pitch =
        genre === "homme"
        ? 0.9
        : 1.1;

    lecture.voice =
        genre === "homme"
        ? this.voix.homme
        : this.voix.femme;

    this.synthese.speak(lecture);

};

/*==================================================
 ARRÊTER LA LECTURE
==================================================*/

AssistantIA.stop = function () {

    if (this.synthese) {

        this.synthese.cancel();

    }

};

/*==================================================
 AFFICHER UNE RÉPONSE
==================================================*/

AssistantIA.afficher = function (texte) {

    this.reponse = texte;

    const zone =
        document.getElementById("reponseIA");

    if (!zone) return;

    zone.textContent = texte;

};

/*==================================================
 RÉCUPÉRER LA QUESTION
==================================================*/

AssistantIA.getQuestion = function () {

    const input =
        document.getElementById("questionIA");

    if (!input) return "";

    return input.value.trim();

};

/*==================================================
 MÉMORISER L'ARTICLE COURANT
==================================================*/

AssistantIA.setArticle = function (article) {

    this.articleActuel = article;

};

/*==================================================
 OBTENIR L'ARTICLE COURANT
==================================================*/

AssistantIA.getArticle = function () {

    return this.articleActuel;

};

/*==================================================
 ANALYSE D'UNE QUESTION
==================================================*/

AssistantIA.analyser = function () {

    if (this.enCours) return;

    this.enCours = true;

    const question =
        this.getQuestion();

    const article =
        this.getArticle();

    if (!question && !article) {

        this.afficher(

            "Veuillez sélectionner un article ou poser une question."

        );

        this.enCours = false;

        return;

    }

    const reponse =
        this.genererReponse(

            question,

            article

        );

    this.afficher(reponse);

    this.enCours = false;

};

/*==================================================
 GÉNÉRER UNE RÉPONSE
==================================================*/

AssistantIA.genererReponse = function (

    question,

    article

) {

    if (question) {

        return this.rechercherQuestion(question);

    }

    if (article) {

        return this.expliquerArticle(article);

    }

    return "Aucune réponse disponible.";

};

/*==================================================
 RECHERCHE DANS LE CODE DU TRAVAIL
==================================================*/

AssistantIA.rechercherQuestion = function (

    question

) {

    if (!window.CodeTravail)

        return "Le Code du Travail n'est pas chargé.";

    const texte =
        question.toLowerCase();

    const articles =
        CodeTravail.getTousArticles();

    const resultat = [];

    articles.forEach(article => {

        let trouve = false;

        if (

            article.titre &&
            article.titre.toLowerCase().includes(texte)

        ) {

            trouve = true;

        }

        if (

            article.categorie &&
            article.categorie.toLowerCase().includes(texte)

        ) {

            trouve = true;

        }

        if (

            article.contenu &&
            article.contenu.toLowerCase().includes(texte)

        ) {

            trouve = true;

        }

        if (

            article.motsCles

        ) {

            article.motsCles.forEach(mot => {

                if (

                    mot.toLowerCase().includes(texte)

                ) {

                    trouve = true;

                }

            });

        }

        if (trouve) {

            resultat.push(article);

        }

    });

    if (resultat.length === 0) {

        return

            "Je n'ai trouvé aucun article correspondant à votre question.";

    }

    return this.formaterResultats(

        resultat,

        question

    );

};

/*==================================================
 EXPLIQUER L'ARTICLE SÉLECTIONNÉ
==================================================*/

AssistantIA.expliquerArticle = function (

    article

) {

    let texte = "";

    texte +=

        "Article " +

        article.numero +

        " : " +

        article.titre +

        "\n\n";

    texte +=

        "Résumé :\n";

    texte +=

        this.resumer(

            article.contenu

        );

    if (

        article.sanction

    ) {

        texte +=

            "\n\nSanction prévue :\n";

        texte +=

            article.sanction;

    }

    return texte;

};

/*==================================================
GÉNÉRER UNE RÉPONSE INTELLIGENTE
==================================================*/

AssistantIA.genererReponse = function (question) {

    if (!question) {

        return "Veuillez saisir une question.";

    }

    question = question.toLowerCase().trim();

    const articles = CodeTravail.getTousArticles();

    let resultat = null;

    /*==============================
    Recherche par mots-clés
    ==============================*/

    for (const article of articles) {

        if (article.titre &&
            article.titre.toLowerCase().includes(question)) {

            resultat = article;
            break;

        }

        if (article.motsCles) {

            const trouve = article.motsCles.some(mot =>

                question.includes(mot.toLowerCase())

            );

            if (trouve) {

                resultat = article;
                break;

            }

        }

    }

    /*==============================
    Si aucun résultat
    ==============================*/

    if (!resultat) {

        return `
Je n'ai trouvé aucun article correspondant à votre question.

Essayez par exemple :

• licenciement

• salaire

• contrat

• congé

• sécurité

• apprentissage

• article 10
`;

    }

    /*==============================
    Construire la réponse
    ==============================*/

    let texte = "";

    texte += "📖 ARTICLE " + resultat.numero + "\n\n";

    texte += resultat.titre + "\n\n";

    texte += resultat.contenu + "\n\n";

    if (resultat.sanction) {

        texte += "⚖ Sanction :\n";

        texte += resultat.sanction + "\n\n";

    }

    if (resultat.questionsIA &&
        resultat.questionsIA.length > 0) {

        texte += "❓ Questions liées :\n";

        resultat.questionsIA.forEach(q => {

            texte += "• " + q + "\n";

        });

    }

    return texte;

};

/*==================================================
ÉVÈNEMENTS DE L'INTERFACE IA
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    AssistantIA.initialiser();

    const questionIA =
        document.getElementById("questionIA");

    const reponseIA =
        document.getElementById("reponseIA");

    const btnAnalyser =
        document.getElementById("btnQuestionIA");

    const btnLecture =
        document.getElementById("btnLectureIA");

    const btnCopier =
        document.getElementById("btnCopierIA");

    const btnEffacer =
        document.getElementById("btnEffacerIA");

    /*=====================================
    ANALYSER
    =====================================*/

    if (btnAnalyser) {

        btnAnalyser.addEventListener("click", () => {

            const question = questionIA.value.trim();

            if (!question) {

                reponseIA.innerHTML =
                    "Veuillez saisir une question.";

                return;

            }

            const reponse =
                AssistantIA.genererReponse(question);

            AssistantIA.afficherReponse(reponse);

        });

    }

    /*=====================================
    COPIER
    =====================================*/

    if (btnCopier) {

        btnCopier.addEventListener("click", async () => {

            try {

                await navigator.clipboard.writeText(
                    reponseIA.innerText
                );

                alert("Réponse copiée.");

            } catch {

                alert("Impossible de copier.");

            }

        });

    }

    /*=====================================
    EFFACER
    =====================================*/

    if (btnEffacer) {

        btnEffacer.addEventListener("click", () => {

            questionIA.value = "";

            reponseIA.innerHTML = `
Bonjour 👋

Je suis votre assistant juridique intelligent.

Posez simplement votre question concernant
le Code du Travail de la RDC.
`;

            AssistantIA.stop();

        });

    }

    /*=====================================
    LECTURE VOCALE
    =====================================*/

    if (btnLecture) {

        btnLecture.addEventListener("click", () => {

            AssistantIA.parler(

                reponseIA.innerText,

                "femme"

            );

        });

    }

});
