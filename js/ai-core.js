/* ==================================================================
   AI-CORE.JS — Cœur de l'IA locale InspecteurBot RDC
   Assistant intelligent multi-domaines (juridique, calcul, analyse)
   ================================================================== */

const AI_CORE = {

  version: "4.0-premium",
  name: "InspecteurBot IA",

  // Historique conversationnel (persistance localStorage)
  memory: JSON.parse(localStorage.getItem("igt_ai_memory") || "[]"),

  // Sauvegarde mémoire
  saveMemory() {
    if (this.memory.length > 200) this.memory = this.memory.slice(-200);
    localStorage.setItem("igt_ai_memory", JSON.stringify(this.memory));
  },

  // Détection d'intention
  detectIntent(query) {
    const q = NLP.normalize(query);
    const intents = [
      { name:"calcul_decompte",   kw:["decompte","final","kanzala","preavis","indemnite","depart","licenciement","demission"] },
      { name:"calcul_smig",       kw:["smig","salaire","minimum","baremе","categorie","tension","echelon"] },
      { name:"calcul_conge",      kw:["conge","vacances","permission"] },
      { name:"calcul_heures_sup", kw:["heure","supplementaire","majoration","overtime"] },
      { name:"recherche_article", kw:["article","code","travail","loi","texte","juridique"] },
      { name:"recherche_fiche",   kw:["fiche","f01","f02","f03","f04","f05","f06","f07","s01","s02","s03","controle"] },
      { name:"onem",              kw:["onem","dasmo","declaration","etablissement","bilan","social"] },
      { name:"oit",               kw:["oit","convention","internationale","bit"] },
      { name:"aide",              kw:["aide","comment","expliquer","qu est","c est quoi"] },
      { name:"salutation",        kw:["bonjour","salut","hello","hi","bonsoir"] }
    ];
    let best = { name:"general", score:0 };
    intents.forEach(intent => {
      let score = 0;
      intent.kw.forEach(k => { if (q.includes(k)) score++; });
      if (score > best.score) best = { name: intent.name, score };
    });
    return best;
  },

  // Réponse principale
  ask(query, context = {}) {
    const timestamp = new Date().toISOString();
    const intent = this.detectIntent(query);
    const entities = NLP.extractEntities(query);
    let response = "";
    let data = null;

    switch(intent.name) {
      case "salutation":
        response = this.greet();
        break;

      case "calcul_smig":
        data = this.answerSmig(query, entities);
        response = data.text;
        break;

      case "calcul_decompte":
        data = this.answerDecompte(query, entities);
        response = data.text;
        break;

      case "calcul_conge":
        data = this.answerConge(query, entities);
        response = data.text;
        break;

      case "calcul_heures_sup":
        data = this.answerHeuresSup(query, entities);
        response = data.text;
        break;

      case "recherche_article":
        data = this.searchArticle(query);
        response = data.text;
        break;

      case "recherche_fiche":
        data = this.searchFiche(query);
        response = data.text;
        break;

      case "onem":
        data = this.answerOnem(query);
        response = data.text;
        break;

      case "oit":
        data = this.answerOit(query);
        response = data.text;
        break;

      case "aide":
        response = this.help();
        break;

      default:
        data = this.smartSearch(query);
        response = data.text;
    }

    // Mémorisation
    this.memory.push({ ts:timestamp, q:query, r:response, intent:intent.name });
    this.saveMemory();

    return { text:response, intent:intent.name, entities, data, timestamp };
  },

  // Salutation contextuelle
  greet() {
    const h = new Date().getHours();
    const salut = h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir";
    return `${salut} Inspecteur 👋 Je suis **InspecteurBot IA**, votre assistant intelligent local.\n\nJe maîtrise :\n• Le Code du Travail RDC (Loi 015/2002)\n• Le SMIG 2025 (Décret 25/22)\n• Les fiches F01→F07 et S01→S03\n• Les calculs de décompte final, préavis, congés, heures sup\n• Les conventions OIT ratifiées\n• Les procédures ONEM (DASMO, Bilan social)\n\nPosez-moi votre question !`;
  },

  // Aide
  help() {
    return `📚 **Exemples de questions :**\n\n💰 « Calcule le SMIG d'un chauffeur »\n💰 « Décompte final d'un cadre licencié après 5 ans à 500000 FC »\n📖 « Article 71 du code du travail »\n🔍 « Que contient la fiche F03 ? »\n⚖️ « Convention OIT 138 »\n🏢 « Comment déposer une DASMO ? »\n📊 « Combien de jours de congé après 10 ans ? »`;
  },

  // SMIG
  answerSmig(query, entities) {
    let matched = null;
    if (entities.fonctions.length) matched = entities.fonctions[0].classe;
    else {
      const cats = ["cc4","cc3","cc2","cc1","m4","m3","m2","m1","hq","q2","q1","sq3","sq2","sq1","ms","ml","mo"];
      const q = NLP.normalize(query);
      for (const c of cats) {
        const row = SMIG_DATA.bareme.find(r => NLP.normalize(r.ech) === c);
        if (row && q.includes(c)) { matched = row; break; }
      }
    }
    if (matched) {
      const txt = `💰 **SMIG — ${matched.fonctions.split(",")[0]}**\n\n` +
        `• Catégorie : **${matched.cat}** / Échelon : **${matched.ech}** / Classe : **${matched.classe}**\n` +
        `• Tension salariale : **${matched.tension}**\n` +
        `• SMIG journalier : **${matched.smigJour.toLocaleString("fr-FR")} FC**\n` +
        `• SMIG mensuel : **${matched.smigMois.toLocaleString("fr-FR")} FC**\n` +
        `• Logement (30% SB) : **${matched.logement.toLocaleString("fr-FR")} FC**\n\n` +
        `📄 Source : Décret n° 25/22 du 30 mai 2025 (Palier 1)`;
      return { text: txt, row: matched };
    }
    // Vue générale
    return { text: 
      `💰 **SMIG RDC — Décret 25/22 du 30 mai 2025**\n\n` +
      `Le SMIG du manœuvre ordinaire est :\n` +
      `• **14 500 FC/jour** dès la paie de mai 2025\n` +
      `• **21 500 FC/jour** dès janvier 2026\n\n` +
      `Le SMIG mensuel = SMIG jour × 26.\n` +
      `Allocations familiales = 1/27 du SMIG manœuvre par enfant.\n` +
      `Contre-valeur logement = 1/5 des allocations familiales.\n\n` +
      `👉 Précisez la fonction ou la catégorie (ex : "chauffeur", "cadre CC1") pour un calcul détaillé.` };
  },

  // Décompte final (résumé — le module complet arrive au LOT 2)
  answerDecompte(query, entities) {
    return { text:
      `🧮 **Décompte final — Formule officielle**\n\n` +
      `1️⃣ **Prestations du mois** = Salaire + (Ration × jours) + Transport\n` +
      `2️⃣ **Préavis légal** = (Base + rang×ancienneté) × taux journalier\n` +
      `   • Manœuvre/classifié : 14j + 7j/an\n` +
      `   • Maîtrise : 26j + 9j/an\n` +
      `   • Cadre : 78j + 16j/an\n` +
      `   • Démission : base ÷ 2\n\n` +
      `3️⃣ **Congé compensatoire** = (préavis × 18) / 365 × taux journalier\n` +
      `4️⃣ **Logement** = 30% du salaire de base\n\n` +
      `**TOTAL BRUT** = 1 + 2 + 3 + 4\n` +
      `**NET À PAYER** = Brut − (IPR + CNSS 5% + ONEM 0,2% + INPP 1%)\n\n` +
      `👉 Utilisez le module **Décompte Final automatique** dans la page dédiée pour un calcul instantané avec QR code et export PDF.` };
  },

  // Congés
  answerConge(query, entities) {
    let annees = entities.nombres.find(n => n > 0 && n < 50) || 0;
    let jours = SMIG_DATA.getSmigActuel ? 18 : 18;
    let supplement = Math.floor(annees / 3);
    let total = jours + supplement;
    return { text:
      `📅 **Congés annuels RDC (Art. 140 Code du travail)**\n\n` +
      `• Base : **18 jours** ouvrables par an (adulte)\n` +
      `• Moins de 18 ans : **26 jours**\n` +
      `• Bonus : **+1 jour par tranche de 3 années** d'ancienneté\n\n` +
      (annees ? `Pour **${annees} ans d'ancienneté** :\n➡️ ${jours} + ${supplement} = **${total} jours**` : 
      `Indiquez l'ancienneté en années pour un calcul précis.`) };
  },

  // Heures supplémentaires
  answerHeuresSup(query, entities) {
    return { text:
      `⏰ **Heures supplémentaires (Art. 119 Code du travail)**\n\n` +
      `Durée légale : **45h/semaine** — **9h/jour**\n\n` +
      `Majorations :\n` +
      `• 6 premières heures sup./semaine : **+30%**\n` +
      `• Au-delà : **+60%**\n` +
      `• Dimanche & jours fériés : **+100%**\n` +
      `• Travail de nuit : **+50%**\n\n` +
      `Formule : Salaire horaire × heures × (1 + majoration)` };
  },

  // Recherche article du Code du travail
  searchArticle(query) {
    // Extraction du numéro d'article
    const m = query.match(/article\s*(\d+)/i) || query.match(/\bart\.?\s*(\d+)/i);
    if (m) {
      const num = parseInt(m[1], 10);
      const art = KNOWLEDGE_BASE.codeTravail.find(a => a.art === num);
      if (art) return { text: `📖 **Article ${art.art} — ${art.titre}**\n\n${art.texte}` };
      return { text: `❌ Article ${num} non trouvé dans la base locale. La base contient les articles clés : ${KNOWLEDGE_BASE.codeTravail.map(a=>a.art).join(", ")}.` };
    }
    // Recherche sémantique
    const results = NLP.search(query, KNOWLEDGE_BASE.codeTravail, a => `${a.titre} ${a.texte}`);
    if (results.length) {
      const top = results.slice(0,3);
      return { text: `🔎 **Résultats juridiques :**\n\n` + top.map(r => 
        `📖 **Article ${r.item.art} — ${r.item.titre}**\n${r.item.texte.substring(0,220)}...\n_(pertinence: ${(r.score*100).toFixed(0)}%)_`
      ).join("\n\n") };
    }
    return { text: "❌ Aucun article trouvé. Précisez votre recherche." };
  },

  // Recherche fiche
  searchFiche(query) {
    const q = query.toUpperCase();
    const codes = Object.keys(KNOWLEDGE_BASE.fiches);
    const found = codes.find(c => q.includes(c));
    if (found) {
      const f = KNOWLEDGE_BASE.fiches[found];
      return { text: 
        `📋 **Fiche ${f.code} — ${f.nom}**\n\n` +
        `🎯 **Objectif :** ${f.objectif}\n\n` +
        `✅ **Points de contrôle :**\n${f.pointsCles.map(p=>"• "+p).join("\n")}` };
    }
    return { text: "📋 Fiches disponibles : " + codes.join(", ") + "\nExemple : « Que contient F03 ? »" };
  },

  // ONEM
  answerOnem(query) {
    const q = NLP.normalize(query);
    if (q.includes("dasmo")) 
      return { text: `🏢 **DASMO** — ${KNOWLEDGE_BASE.onem.dasmo}` };
    if (q.includes("bilan"))
      return { text: `📊 **Bilan Social** — ${KNOWLEDGE_BASE.onem.bilanSocial}` };
    if (q.includes("declaration") || q.includes("etablissement"))
      return { text: `🏭 **Déclaration d'établissement** — ${KNOWLEDGE_BASE.onem.declaration}` };
    return { text: 
      `🏢 **Office National de l'Emploi (ONEM)**\n\n` +
      `• Déclaration d'établissement (obligatoire dans 15 j)\n` +
      `• DASMO — avant le 31 mars chaque année\n` +
      `• Bilan Social annuel\n\n` +
      `Utilisez les modules ONEM du tableau de bord.` };
  },

  // OIT
  answerOit(query) {
    const m = query.match(/c\s*[-\s]?(\d{2,3})/i);
    if (m) {
      const num = "C" + m[1];
      const conv = KNOWLEDGE_BASE.oit.find(c => c.num === num);
      if (conv) return { text: `⚖️ **${conv.num} — ${conv.nom}**\nRatifiée par la RDC en ${conv.ratif}.` };
    }
    return { text: 
      `🌍 **Conventions OIT ratifiées par la RDC :**\n\n` +
      KNOWLEDGE_BASE.oit.map(c => `• **${c.num}** — ${c.nom} (ratif. ${c.ratif})`).join("\n") };
  },

  // Recherche générale (fallback intelligent)
  smartSearch(query) {
    // Cherche dans FAQ, articles, fiches
    const faqR = NLP.search(query, KNOWLEDGE_BASE.faq, x => `${x.q} ${x.r}`);
    if (faqR.length && faqR[0].score > 0.15) {
      return { text: `💡 ${faqR[0].item.r}` };
    }
    const artR = NLP.search(query, KNOWLEDGE_BASE.codeTravail, a => `${a.titre} ${a.texte}`);
    if (artR.length && artR[0].score > 0.1) {
      const a = artR[0].item;
      return { text: `📖 **Article ${a.art} — ${a.titre}**\n\n${a.texte}` };
    }
    return { text: 
      `🤔 Je n'ai pas trouvé de réponse directe. Voici ce que je peux faire :\n\n` +
      `• Répondre sur le SMIG et calculer les décomptes finaux\n` +
      `• Retrouver un article du Code du Travail\n` +
      `• Expliquer les fiches F01-F07 et S01-S03\n` +
      `• Renseigner sur ONEM, OIT, congés, heures sup\n\n` +
      `Reformulez ou tapez **"aide"** pour des exemples.` };
  },

  // Réinitialiser la mémoire
  clearMemory() {
    this.memory = [];
    localStorage.removeItem("igt_ai_memory");
  }
};

if (typeof window !== 'undefined') window.AI_CORE = AI_CORE;
if (typeof module !== 'undefined') module.exports = AI_CORE;
