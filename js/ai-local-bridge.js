/* InspecteurBot IA locale — relais hors-ligne pour les modules de l'application.
   Ne remplace pas une validation juridique humaine et ne fabrique pas de faits. */
(function () {
  "use strict";

  const DEV_NOTICE = "ℹ️ **Mode local — application en développement :** certaines informations ne sont pas encore intégralement prises en compte dans la base locale. Vérifiez les textes officiels et faites valider tout document juridique par un agent habilité.";

  const MENU_KNOWLEDGE = [
    {name:"IGT RDC / Annuaire numérique", keys:["igt","annuaire","agent","matricule","inspecteur","controleur","organisation territoriale","direction provinciale","carte professionnelle","carte interactive"], info:"Le menu IGT regroupe l'organisation de l'Inspection Générale du Travail, le tableau national, la carte de la RDC, le registre des agents, les cartes professionnelles, les informations administratives et les outils de communication. Les recherches nominatives d'agents exigent la connexion sécurisée à l'annuaire Supabase ; aucune fiche personnelle n'est inventée hors connexion."},
    {name:"Code du Travail", keys:["code du travail","article","loi","licenciement","contrat","préavis","salaire","congé","durée du travail","inspection du travail"], info:"La bibliothèque juridique présente les dispositions du Code du travail RDC (Loi n°015/2002, modifiée par la Loi n°016/010), les catégories, les recherches d'articles, les explications IA, les favoris et les outils d'inspection. La base embarquée contient 334 entrées, mais seules les dispositions marquées comme texte authentique sont citées comme texte intégral vérifié ; les autres entrées de démonstration ne doivent pas servir de fondement juridique."},
    {name:"Fiches de contrôle et ONEM", keys:["fiche","f01","f02","f03","f04","f05","f06","f07","s01","s02","s03","onem","dasmo","bilan social"], info:"F01 contrôle de la main-d'œuvre ; F02 main-d'œuvre étrangère ; F03 hygiène et santé ; F04 sécurité technique BTP ; F05 sécurité dans les mines ; F06 entreprises à hauts risques ; F07 protection sociale ; S01 visite spéciale ; S02 contre-enquête ; S03 administration et finance. Le module comprend aussi déclaration d'établissement, DASMO et bilan social ONEM."},
    {name:"Procès-verbaux et documents", keys:["pv","procès-verbal","proces verbal","mise en demeure","obstruction","non-conciliation","non conciliation","cshe","audition","constat","rapport"], info:"Le module PV prévoit le procès-verbal de constat d'infraction, le PV d'obstruction, le PV de non-conciliation, la mise en demeure et le PV d'installation du Comité de Sécurité, d'Hygiène et d'Embellissement (CSHE). Il permet l'identification de l'auteur, de l'entreprise, des faits, des pièces, des infractions, des signatures, de la validation, de l'archivage et de l'export A4/PDF. Les faits, témoins, dates et infractions doivent être fournis et vérifiés, jamais inventés."},
    {name:"Sanctions et infractions", keys:["sanction","amende","infraction","aim","récidive","peine","pénalité"], info:"Le module Sanctions présente un répertoire de 65 infractions, le barème AIM 006/127, les sanctions administratives, pénales et financières, les mises en demeure, le recouvrement, les cas pratiques et un guide de qualification. Toujours vérifier l'article, le barème applicable, la catégorie de l'entreprise, la récidive et la procédure contradictoire avant de conclure."},
    {name:"Inspecteur / Contrôleur du Travail", keys:["rapport de mission","mission","rapport de formation","rapport de réunion","rapport de conversation","inspection","conciliation","articles 187","articles 188","articles 189"], info:"Le module IT/CT aide à préparer les rapports de mission, de formation, de réunion et de conversation, à consulter les articles 187 à 198 et à utiliser des modèles de rédaction administrative. Un rapport doit distinguer les faits constatés, les déclarations, les pièces examinées et les suites proposées."},
    {name:"Gestion des entreprises", keys:["entreprise","employeur","travailleurs","rccm","id nat","secteur","industrie","commerce"], info:"Le menu Entreprises sert à enregistrer et retrouver les entreprises, leur province, leur secteur d'activité, leur statut, les travailleurs et les informations administratives, avec impression, PDF, Excel et QR code."},
    {name:"Communiqués officiels", keys:["communiqué","communique","note de service","urgent","administratif","juridique","audio"], info:"Le menu Communiqués permet de consulter les communications officielles par catégorie (urgentes, administratives, juridiques, missions, formations et notes de service), de lire, écouter, rechercher, télécharger et partager les publications."},
    {name:"GPS et missions terrain", keys:["gps","géolocalisation","geolocalisation","position","coordonnées","mission terrain","sos"], info:"Le module GPS permet de démarrer, suspendre et terminer une mission terrain, d'enregistrer les points GPS, de consulter le parcours, de partager une position et de transmettre une alerte SOS à la hiérarchie."},
    {name:"Archives et profil", keys:["archive","historique","profil","photo","compte","utilisateur","paramètre"], info:"Les espaces Archives et Profil servent à retrouver les dossiers ou historiques disponibles et à gérer les informations du compte et la photo de profil. Les données personnelles d'un autre compte ne sont pas exposées à l'assistant local."}
  ];

  const PV_TYPES = [
    "Procès-verbal de constat d'infraction",
    "Procès-verbal d'obstruction",
    "Procès-verbal de non-conciliation",
    "Mise en demeure",
    "Procès-verbal d'installation du CSHE"
  ];

  function norm(s) {
    return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  function menuAnswer(question) {
    const q = norm(question);
    const ranked = MENU_KNOWLEDGE.map(item => ({
      item,
      score: item.keys.reduce((n, key) => n + (q.includes(norm(key)) ? 1 : 0), 0)
    })).filter(x => x.score > 0).sort((a,b) => b.score - a.score);
    if (!ranked.length) return null;
    const chosen = ranked.slice(0, Math.min(2, ranked.length));
    return chosen.map(x => "**" + x.item.name + "**\n" + x.item.info).join("\n\n");
  }

  function documentAnswer(question, documentText, fileName) {
    const text = String(documentText || "").slice(0, 20000);
    const words = text.split(/\s+/).filter(Boolean);
    const sentences = text.split(/(?<=[.!?])\s+/).filter(s => s.length > 35);
    const refs = [...new Set((text.match(/(?:article|art\.?|loi|décret|decret)\s*(?:n°\s*)?\d+[\/-]?\d*/gi) || []))].slice(0, 12);
    const amounts = [...new Set((text.match(/\b\d[\d .]*\s*(?:FC|CDF|USD|\$)\b/gi) || []))].slice(0, 12);
    const keywords = ["salaire","smig","contrat","licenciement","préavis","congé","sécurité","accident","infraction","sanction","cnss","onem","inpp","travailleur","employeur","procès-verbal","pv"];
    const found = keywords.filter(k => norm(text).includes(norm(k)));
    const excerpt = sentences.slice(0, 6).map(s => "• " + s.trim()).join("\n");
    return "📎 **Analyse locale du document : " + (fileName || "document joint") + "**\n\n" +
      "• Taille analysée : " + words.length.toLocaleString("fr-FR") + " mots.\n" +
      "• Références repérées : " + (refs.join(", ") || "aucune référence détectée") + ".\n" +
      "• Montants repérés : " + (amounts.join(", ") || "aucun montant détecté") + ".\n" +
      "• Thèmes repérés : " + (found.join(", ") || "à préciser") + ".\n\n" +
      "**Extraits du document**\n" + (excerpt || text.slice(0, 1200)) +
      "\n\nCette analyse est extractive : elle résume les éléments visibles sans vérifier l'authenticité du document ni remplacer une analyse juridique complète.";
  }

  function pvAnswer(question) {
    const q = norm(question);
    let type = PV_TYPES[0];
    if (q.includes("obstruction")) type = PV_TYPES[1];
    else if (q.includes("non conciliation") || q.includes("non-conciliation")) type = PV_TYPES[2];
    else if (q.includes("mise en demeure")) type = PV_TYPES[3];
    else if (q.includes("cshe") || q.includes("comite de securite") || q.includes("comité de sécurité")) type = PV_TYPES[4];

    const details = {
      "Procès-verbal de constat d'infraction": "Décrire chaque manquement matériel, la disposition à vérifier, les pièces consultées et les observations de l'employeur.",
      "Procès-verbal d'obstruction": "Décrire précisément l'acte ou le refus ayant empêché le contrôle, les demandes formulées, les réponses et les témoins éventuels.",
      "Procès-verbal de non-conciliation": "Identifier les parties, leurs prétentions respectives, les démarches de conciliation, les points d'accord et de désaccord.",
      "Mise en demeure": "Préciser les manquements, les mesures de régularisation demandées, le fondement juridique à confirmer et le délai légal applicable.",
      "Procès-verbal d'installation du CSHE": "Indiquer le lieu, la date, les participants, les représentants désignés, les résolutions et les signatures."
    };

    return "📝 **" + type + " — trame de rédaction**\n\n" +
      "**1. Identification**\nNuméro : [à attribuer] · Date/heure : [à compléter] · Lieu : [à compléter]\n\n" +
      "**2. Autorité et mission**\nInspection/Direction : [à compléter] · Inspecteur/Contrôleur : [nom, grade, qualité, habilitation] · Ordre de mission : [référence]\n\n" +
      "**3. Entreprise / parties**\nRaison sociale : [à compléter] · Adresse : [à compléter] · Représentant : [nom et qualité] · Travailleurs concernés : [identités ou effectif utile]\n\n" +
      "**4. Objet et faits matériellement constatés**\n" + details[type] + "\nDécrire les faits dans l'ordre chronologique, sans supposition : [faits, dates, lieux, personnes présentes].\n\n" +
      "**5. Pièces et déclarations**\nPièces examinées : [liste] · Déclarations de l'employeur : [texte] · Déclarations des travailleurs/témoins : [texte].\n\n" +
      "**6. Qualification et suites**\nInfraction et article : [à vérifier dans le texte applicable] · Observations contradictoires : [à consigner] · Mesures/délai/suites : [à déterminer selon compétence et procédure].\n\n" +
      "**7. Clôture**\nLecture, observations, refus éventuel de signer, nombre de pages/annexes, signatures et remise d'une copie : [à compléter].\n\n" +
      "Je peux adapter cette trame dès que vous fournissez le type de PV, les faits constatés, la date, le lieu, l'entreprise et les pièces. Aucun fait ni article ne sera inventé.";
  }

  function localAnswer(question, options) {
    options = options || {};
    const q = String(question || "").trim();
    if (!q) return { text: "Posez une question sur le Code du travail, le SMIG, le décompte final, les PV ou les autres menus de l'application.", confidence: 0.2 };

    if (options.documentText) {
      return { text: documentAnswer(q, options.documentText, options.fileName) + "\n\n" + DEV_NOTICE, confidence: 0.55, source: "analyse locale extractive" };
    }

    const nq = norm(q);
    if (/\b(pv|proces verbal|procès verbal|redige|rediger|elabore|elaborer|modele de pv|mise en demeure)\b/.test(nq)) {
      return { text: pvAnswer(q) + "\n\n" + DEV_NOTICE, confidence: 0.65, source: "modèles locaux PV" };
    }

    if (/\b(annuaire|matricule|nom complet|recherche.*agent|agent.*igt)\b/.test(nq)) {
      return { text: "L'annuaire professionnel IGT contient des fiches d'agents et des informations d'affectation. Pour retrouver une personne précise, la connexion sécurisée à l'annuaire Supabase est nécessaire. En mode hors connexion, je ne peux ni consulter ni inventer une fiche individuelle.\n\n" + DEV_NOTICE, confidence: 0.4, source: "annuaire local limité" };
    }

    if (window.AI_CORE && typeof window.AI_CORE.ask === "function") {
      try {
        const result = window.AI_CORE.ask(q, { conversation: options.history || [] });
        let answer = result && result.text ? result.text : "";
        if (/smig|salaire minimum/.test(nq) && /chauffeur|cadre|catégorie|categorie|échelon|echelon/.test(nq)) {
          answer += "\n\n⚠️ Le barème détaillé par fonction embarqué correspond au palier 1 de 2025. Le taux général du manœuvre ordinaire est de 21 500 FC/jour depuis janvier 2026 ; je ne déduis pas automatiquement un nouveau barème complet par fonction sans texte actualisé.";
        }
        if (/decompte|décompte|solde de tout compte/.test(nq)) {
          answer += "\n\nPour un calcul chiffré fiable, il faut notamment le salaire de base, la catégorie, l'ancienneté exacte, le motif et la date de rupture, le préavis presté ou non, les congés non pris, les sommes restant dues et les éléments de rémunération. Le module Décompte Final de l'application permet de saisir ces éléments.";
        }
        return { text: answer + "\n\n" + DEV_NOTICE, confidence: 0.6, source: "AI_CORE local" };
      } catch (e) {
        console.warn("AI_CORE local indisponible", e);
      }
    }

    if (window.CODE_TRAVAIL_DB && window.CODE_TRAVAIL_DB.length) {
      const matchArticle = nq.match(/(?:article|art)\s*(\d{1,3})/);
      if (matchArticle) {
        const article = window.CODE_TRAVAIL_DB.find(a => a.numero === Number(matchArticle[1]));
        if (article && article.authentique) {
          return { text: "**Article " + article.numero + " — " + article.titre + "**\n\n" + article.contenu + (article.sanction ? "\n\n**Sanction :** " + article.sanction : "") + "\n\nSource : base juridique locale InspecteurBot.\n\n" + DEV_NOTICE, confidence: 0.8, source: "Code du travail local" };
        }
        if (article) {
          return { text: "L'entrée de l'article " + article.numero + " existe dans la structure locale, mais son texte complet authentique n'est pas disponible dans cette base. Je préfère ne pas présenter le texte de démonstration comme une loi.\n\n" + DEV_NOTICE, confidence: 0.3, source: "base locale partielle" };
        }
      }
    }

    const menu = menuAnswer(q);
    if (menu) return { text: menu + "\n\n" + DEV_NOTICE, confidence: 0.55, source: "connaissances des menus" };

    if (window.NeuroJuris && window.NeuroJuris.ready) {
      try {
        const articles = window.NeuroJuris.retrieve(q, 4).filter(a => a.authentique);
        if (articles.length) {
          const first = articles[0];
          return { text: "⚖️ **Analyse juridique locale**\n\n**Article " + first.numero + " — " + first.titre + "**\n\n" + first.contenu + (first.sanction ? "\n\n**Sanction enregistrée :** " + first.sanction : "") + "\n\n" + DEV_NOTICE, confidence: 0.65, source: "NeuroJuris local" };
        }
      } catch (e) { console.warn("Recherche juridique locale indisponible", e); }
    }

    return {
      text: "Je peux vous aider à partir des connaissances déjà embarquées dans InspecteurBot : SMIG, préavis, congés, décompte final, articles authentifiés disponibles, fiches F01 à F07 et S01 à S03, ONEM, OIT, procédures d'inspection, sanctions, rapports et trames de PV.\n\nPrécisez le sujet, la situation et les données utiles.\n\n" + DEV_NOTICE,
      confidence: 0.2,
      source: "assistant local de secours"
    };
  }

  window.InspecteurBotLocalAI = {
    version: "1.0.0",
    answer: localAnswer,
    menus: MENU_KNOWLEDGE.map(x => x.name),
    pvTypes: PV_TYPES.slice(),
    ready: true
  };
})();