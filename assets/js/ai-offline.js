/**
 * ai-offline.js
 * MOTEUR IA HORS-CONNEXION — InspecteurBot RDC "Neuro-Juris 200"
 *
 * Une IA juridique 100% locale (aucune connexion requise) qui combine :
 *  - Analyse d'intention (NLU léger multilingue)
 *  - Recherche vectorielle TF-IDF sur les 334 articles
 *  - Raisonnement RAG (Retrieval-Augmented Generation) local
 *  - Génération de réponses structurées (obligations, droits, sanctions)
 */

window.NeuroJuris = {
  index: [],
  ready: false,

  // ------- Normalisation du texte -------
  normalize(str) {
    return (str || "")
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  },

  tokenize(str) {
    const stop = new Set(["le","la","les","un","une","des","de","du","et","a","au","aux","en","dans","pour","par","sur","que","qui","quoi","est","sont","il","elle","je","tu","mon","ma","mes","ce","cette","ces","the","of","to","and","is","are","what","how","na","ya","ku","mu","bu"]);
    return this.normalize(str).split(" ").filter(w => w.length > 1 && !stop.has(w));
  },

  // ------- Construction de l'index TF-IDF (hors ligne) -------
  build(articles) {
    if (!articles || !articles.length) return;
    const df = {};
    this.index = articles.map(a => {
      const text = `${a.titre} ${a.categorie} ${(a.motsCles||[]).join(" ")} ${a.contenu} ${(a.sanction||"")}`;
      const tokens = this.tokenize(text);
      const tf = {};
      tokens.forEach(t => { tf[t] = (tf[t]||0)+1; });
      Object.keys(tf).forEach(t => { df[t] = (df[t]||0)+1; });
      return { article: a, tf, tokens, len: tokens.length };
    });
    const N = this.index.length;
    this.idf = {};
    Object.keys(df).forEach(t => { this.idf[t] = Math.log(1 + N/df[t]); });
    this.ready = true;
  },

  // ------- Recherche des articles pertinents (RAG retrieve) -------
  retrieve(query, topK = 4) {
    if (!this.ready) return [];
    const qTokens = this.tokenize(query);
    // Boost par synonymes juridiques
    const boosted = [...qTokens];
    const syn = {
      "renvoi":"licenciement","virer":"licenciement","chasser":"licenciement","renvoyer":"licenciement",
      "paie":"salaire","argent":"salaire","paye":"salaire","remuneration":"salaire",
      "vacances":"conge","repos":"conge",
      "enceinte":"maternite","grossesse":"maternite","accouchement":"maternite",
      "blessure":"securite","accident":"securite","danger":"securite",
      "greve":"conflit","syndicat":"syndicat","delegue":"syndicat",
      "prison":"sanction","amende":"sanction","peine":"sanction"
    };
    qTokens.forEach(t => { if (syn[t]) boosted.push(syn[t]); });

    const scored = this.index.map(doc => {
      let score = 0;
      boosted.forEach(t => {
        if (doc.tf[t]) {
          score += (doc.tf[t]/doc.len) * (this.idf[t]||1);
        }
      });
      // Bonus si numéro d'article mentionné
      const numMatch = query.match(/\b(\d{1,3})\b/);
      if (numMatch && doc.article.numero === parseInt(numMatch[1],10)) score += 100;
      // Bonus articles authentiques (texte riche)
      if (doc.article.authentique) score *= 1.15;
      return { article: doc.article, score };
    });

    return scored.filter(s => s.score > 0).sort((a,b) => b.score - a.score).slice(0, topK).map(s => s.article);
  },

  // ------- Détection d'intention -------
  detectIntent(query) {
    const q = this.normalize(query);
    if (/\b(explique|expliquer|explication|c est quoi|qu est ce|nini|maana)\b/.test(q)) return "explication";
    if (/\b(calcul|combien|montant|duree|jours|heures)\b/.test(q)) return "calcul";
    if (/\b(sanction|amende|peine|prison|punition|risque)\b/.test(q)) return "sanction";
    if (/\b(droit|droits|puis je|ai je le droit)\b/.test(q)) return "droits";
    if (/\b(obligation|doit|devoir|responsable|employeur)\b/.test(q)) return "obligations";
    if (/\b(resume|resumer|synthese)\b/.test(q)) return "resume";
    return "general";
  },

  // ------- Génération de la réponse (RAG generate, local) -------
  answer(query, lang = "fr") {
    const arts = this.retrieve(query, 4);
    const intent = this.detectIntent(query);

    const L = this.LABELS[lang] || this.LABELS.fr;

    if (!arts.length) {
      return {
        text: `${L.noResult}`,
        articles: [],
        confidence: 0.2
      };
    }

    const main = arts[0];
    const others = arts.slice(1, 3);
    let out = "";

    out += `${L.diagnostic}\n\n`;
    out += `📌 ${L.reference} : Article ${main.numero} — ${main.titre}\n`;
    out += `🏷️ ${L.domaine} : ${main.categorie}\n\n`;

    out += `📖 ${L.texte} :\n"${main.contenu.substring(0, 320)}${main.contenu.length > 320 ? "..." : ""}"\n\n`;

    out += `💡 ${L.analyse} :\n${this.reason(main, intent, query, lang)}\n\n`;

    if (intent !== "sanction") {
      out += `👔 ${L.obligations} :\n${L.oblText.replace("{n}", main.numero)}\n\n`;
      out += `👷 ${L.droitsT} :\n${L.droitText}\n`;
    }

    if (main.sanction) {
      out += `\n🚨 ${L.sanction} :\n${main.sanction}`;
    }

    if (others.length) {
      out += `\n\n📚 ${L.complementaires} :\n` + others.map(a => `• Article ${a.numero} — ${a.titre}`).join("\n");
    }

    // Confiance estimée
    const confidence = Math.min(0.98, 0.55 + arts.length * 0.1 + (main.authentique ? 0.15 : 0));

    return { text: out, articles: arts, confidence };
  },

  reason(art, intent, query, lang) {
    const q = this.normalize(query);
    // Raisonnement contextuel spécialisé
    if (/licenciement|renvoi|prevais|preavis|rupture/.test(q)) {
      return this.T(lang,
        "En RDC, aucun licenciement ne peut être arbitraire. L'employeur doit respecter le préavis légal (14 jours ouvrables minimum, +7 jours par année d'ancienneté) ou prouver une faute lourde notifiée par écrit sous 15 jours. À défaut, le licenciement est jugé abusif et donne droit à des dommages-intérêts.",
        "In DRC, no dismissal may be arbitrary. The employer must respect the legal notice period (min. 14 working days, +7 days per year of seniority) or prove serious misconduct notified in writing within 15 days. Otherwise, the dismissal is deemed abusive and entitles the worker to damages.");
    }
    if (/salaire|smig|paie|remuneration|argent/.test(q)) {
      return this.T(lang,
        "Le salaire est protégé par la loi : à travail égal, salaire égal. Il ne peut jamais être inférieur au SMIG, doit être payé en Francs Congolais à intervalles réguliers (au maximum chaque mois) et accompagné d'un bulletin de paie détaillé.",
        "Wages are legally protected: equal pay for equal work. They may never fall below the SMIG, must be paid in Congolese Francs at regular intervals (monthly at most), with a detailed payslip.");
    }
    if (/conge|vacances|repos/.test(q)) {
      return this.T(lang,
        "Le droit au congé est d'ordre public : le travailleur acquiert au moins 1 jour ouvrable de congé payé par mois de service (soit 12 jours/an), majoré selon l'ancienneté, avec pécule intégral. Le repos hebdomadaire de 24h est obligatoire.",
        "The right to leave is public policy: the worker earns at least 1 paid leave day per month of service (12 days/year), increased with seniority, with full pay. A 24h weekly rest is mandatory.");
    }
    if (/maternite|enceinte|femme/.test(q)) {
      return this.T(lang,
        "La femme enceinte bénéficie d'un congé de maternité de 14 semaines avec maintien des 2/3 de la rémunération. Le licenciement pendant la grossesse et le congé de maternité est strictement interdit et frappé de nullité.",
        "Pregnant women receive 14 weeks maternity leave with 2/3 of pay maintained. Dismissal during pregnancy and maternity leave is strictly prohibited and null and void.");
    }
    if (/securite|accident|epi|hygiene/.test(q)) {
      return this.T(lang,
        "L'employeur doit garantir un environnement sûr, fournir gratuitement les EPI et déclarer tout accident du travail à l'Inspection et à la CNSS sous 48h. Sa responsabilité pénale et civile est engagée en cas de manquement.",
        "The employer must ensure a safe workplace, provide free PPE, and report any workplace accident to the Inspectorate and CNSS within 48h. Criminal and civil liability applies in case of default.");
    }
    if (/inspecteur|inspection|controle|pv/.test(q)) {
      return this.T(lang,
        "L'Inspecteur du Travail peut visiter tout établissement sans préavis, à toute heure, exiger les registres, dresser des PV faisant foi et ordonner l'arrêt des travaux dangereux. Toute entrave constitue un délit puni pénalement.",
        "Labour Inspectors may enter any establishment without notice, at any time, require registers, issue binding reports and order the stoppage of dangerous work. Any obstruction is a criminal offence.");
    }
    // Défaut selon intention
    if (intent === "sanction") {
      return this.T(lang,
        `Les manquements à l'article ${art.numero} exposent le contrevenant aux sanctions prévues par le Code du travail (amendes administratives, versements rétroactifs et, dans les cas graves, servitude pénale).`,
        `Breaches of article ${art.numero} expose the offender to sanctions under the Labour Code (administrative fines, retroactive payments and, in serious cases, penal servitude).`);
    }
    return this.T(lang,
      `Les dispositions de l'article ${art.numero} sont impératives et s'imposent à tout employeur exerçant en RDC. Toute clause moins favorable au travailleur est nulle. En cas de litige, la conciliation devant l'Inspecteur du Travail est un préalable obligatoire.`,
      `The provisions of article ${art.numero} are mandatory for every employer in DRC. Any clause less favourable to the worker is void. In case of dispute, conciliation before the Labour Inspector is a mandatory prerequisite.`);
  },

  T(lang, fr, en) {
    if (lang === "en") return en;
    if (lang === "ln") return "🌍 " + fr;   // langues nationales : base FR + marqueur
    if (lang === "sw") return "🌍 " + fr;
    if (lang === "lu") return "🌍 " + fr;
    if (lang === "kg") return "🌍 " + fr;
    return fr;
  },

  LABELS: {
    fr: {
      diagnostic: "⚖️ DIAGNOSTIC JURIDIQUE — InspecteurBot RDC (Hors-ligne)",
      reference: "Article de référence", domaine: "Domaine juridique", texte: "Texte de loi",
      analyse: "Analyse & explication", obligations: "Obligations de l'employeur",
      droitsT: "Droits du travailleur", sanction: "Sanctions encourues",
      complementaires: "Articles complémentaires",
      oblText: "• Se conformer strictement à l'article {n}.\n• Éviter toute violation susceptible d'entraîner l'intervention de l'Inspection du Travail.",
      droitText: "• Exiger l'application immédiate de cette garantie légale.\n• Saisir l'Inspecteur du Travail pour conciliation préalable en cas de litige.",
      noResult: "Je n'ai pas trouvé d'article précis, mais en droit du travail RDC, tout litige s'apprécie à la lumière de l'ordre public social et de la protection du travailleur. Reformulez votre question avec un mot-clé (contrat, salaire, congé, licenciement...)."
    },
    en: {
      diagnostic: "⚖️ LEGAL DIAGNOSIS — InspecteurBot DRC (Offline)",
      reference: "Reference article", domaine: "Legal field", texte: "Legal text",
      analyse: "Analysis & explanation", obligations: "Employer's obligations",
      droitsT: "Worker's rights", sanction: "Applicable penalties",
      complementaires: "Related articles",
      oblText: "• Strictly comply with article {n}.\n• Avoid any breach that may trigger Labour Inspection.",
      droitText: "• Demand immediate application of this legal guarantee.\n• Refer to the Labour Inspector for prior conciliation in case of dispute.",
      noResult: "No specific article found, but in DRC labour law every dispute is assessed under social public policy and worker protection. Rephrase with a keyword (contract, wage, leave, dismissal...)."
    }
  }
};
