/* ==================================================================
   ANALYSE.JS — Analyse intelligente de documents
   ================================================================== */

const ANALYSE = {

  // Analyser un texte brut et générer un rapport
  analyser(texte) {
    const t = texte || "";
    const stats = {
      caracteres: t.length,
      mots: t.split(/\s+/).filter(Boolean).length,
      phrases: (t.match(/[.!?]+/g) || []).length,
      paragraphes: t.split(/\n\s*\n/).filter(Boolean).length
    };

    const entites = NLP.extractEntities(t);

    // Détection type de document
    const type = this.detecterType(t);

    // Extraction concepts clés (mots les plus fréquents)
    const tokens = NLP.tokenize(t);
    const freq = {};
    tokens.forEach(tok => freq[tok] = (freq[tok]||0) + 1);
    const motsCles = Object.entries(freq)
      .sort((a,b) => b[1] - a[1])
      .slice(0, 15)
      .map(([m,n]) => ({mot:m, count:n}));

    // Recherche références juridiques
    const refs = this.chercherReferencesLegales(t);

    // Résumé automatique (extraction des phrases clés)
    const resume = this.resumer(t);

    // Anomalies / points d'attention
    const alertes = this.detecterAlertes(t);

    // Recommandations
    const recos = this.genererRecommandations(type, entites, refs);

    return {
      stats, type, entites, motsCles, refs, resume, alertes, recos,
      timestamp: new Date().toISOString()
    };
  },

  // Détection du type de document
  detecterType(t) {
    const low = t.toLowerCase();
    if (/contrat\s+de\s+travail/i.test(t)) return "Contrat de travail";
    if (/bulletin\s+de\s+paie|fiche\s+de\s+paie/i.test(t)) return "Bulletin de paie";
    if (/proc[eè]s[- ]verbal|pv/i.test(t)) return "Procès-verbal";
    if (/mise\s+en\s+demeure/i.test(t)) return "Mise en demeure";
    if (/convocation/i.test(t)) return "Convocation";
    if (/d[eé]compte\s+final/i.test(t)) return "Décompte final";
    if (/d[eé]cret|arr[eê]t[eé]|loi/i.test(t)) return "Texte réglementaire";
    if (/convention\s+collective/i.test(t)) return "Convention collective";
    if (/certificat\s+de\s+travail/i.test(t)) return "Certificat de travail";
    if (/lettre\s+de\s+licenciement/i.test(t)) return "Lettre de licenciement";
    if (/attestation/i.test(t)) return "Attestation";
    return "Document général";
  },

  // Chercher références juridiques (articles, décrets, lois)
  chercherReferencesLegales(t) {
    const refs = { articles: [], decrets: [], lois: [], arretes: [] };
    (t.match(/article\s+\d+/gi) || []).forEach(a => refs.articles.push(a));
    (t.match(/d[eé]cret\s+n[°º]?\s*[\d\/\-\.]+/gi) || []).forEach(a => refs.decrets.push(a));
    (t.match(/loi\s+n[°º]?\s*[\d\/\-\.]+/gi) || []).forEach(a => refs.lois.push(a));
    (t.match(/arr[eê]t[eé]\s+n[°º]?\s*[\d\/\-\.]+/gi) || []).forEach(a => refs.arretes.push(a));
    // Unicité
    Object.keys(refs).forEach(k => refs[k] = [...new Set(refs[k])]);
    return refs;
  },

  // Résumé automatique (5 phrases les plus pertinentes)
  resumer(t) {
    const phrases = t.split(/(?<=[.!?])\s+/).filter(p => p.length > 20);
    if (!phrases.length) return "";
    // Scorer par présence de mots-clés importants
    const kwImportants = ["travailleur","employeur","salaire","contrat","licenciement","demission","preavis","conge","smig","indemnite","cnss","onem","inpp","inspecteur"];
    const scores = phrases.map(p => {
      const low = NLP.normalize(p);
      let s = 0;
      kwImportants.forEach(k => { if (low.includes(k)) s++; });
      return { p, s };
    });
    const top = scores.sort((a,b) => b.s - a.s).slice(0, 5);
    // Réordonner dans l'ordre du texte
    return top
      .sort((a,b) => phrases.indexOf(a.p) - phrases.indexOf(b.p))
      .map(x => x.p).join(" ");
  },

  // Détection d'alertes / non-conformités
  detecterAlertes(t) {
    const alertes = [];
    const low = t.toLowerCase();

    // Montants suspects
    const montants = (t.match(/(\d[\d\s.]{3,})\s*(?:fc|francs?)/gi) || [])
      .map(m => parseInt(m.replace(/[^\d]/g,""), 10))
      .filter(n => n > 0);
    const smigMin = SMIG_DATA.smigManoeuvre.palier1.montant * 26;
    if (montants.length) {
      const min = Math.min(...montants);
      if (min < smigMin && min > 10000) {
        alertes.push(`⚠️ Montant suspect détecté (${min.toLocaleString("fr-FR")} FC) — inférieur au SMIG mensuel légal (${smigMin.toLocaleString("fr-FR")} FC).`);
      }
    }

    // Absence d'éléments clés dans un contrat
    if (/contrat/i.test(t)) {
      if (!/dur[eé]e/i.test(t)) alertes.push("⚠️ Durée du contrat non mentionnée.");
      if (!/salaire|r[eé]mun[eé]ration/i.test(t)) alertes.push("⚠️ Rémunération non mentionnée.");
      if (!/lieu\s+de\s+travail|lieu\s+de\s+prestation/i.test(t)) alertes.push("⚠️ Lieu de prestation non précisé.");
      if (!/date\s+d.engagement|entr[eé]e\s+en\s+service/i.test(t)) alertes.push("⚠️ Date d'engagement non trouvée.");
    }

    // Faute lourde sans procédure
    if (/faute\s+lourde/i.test(t) && !/audition|proc[eé]dure/i.test(t)) {
      alertes.push("⚠️ Faute lourde évoquée sans mention de procédure disciplinaire (audition, PV).");
    }

    // Licenciement sans motif
    if (/licenciement/i.test(t) && !/motif/i.test(t)) {
      alertes.push("⚠️ Licenciement sans motif clairement énoncé — risque de nullité (Art. 62 CT).");
    }

    if (!alertes.length) alertes.push("✅ Aucune anomalie majeure détectée dans le document.");
    return alertes;
  },

  // Recommandations selon le type
  genererRecommandations(type, entites, refs) {
    const recos = [];
    switch(type) {
      case "Contrat de travail":
        recos.push("📋 Vérifier la présence des mentions obligatoires (Art. 7 & 39 CT).");
        recos.push("📋 S'assurer que le salaire respecte le SMIG (Décret 25/22).");
        recos.push("📋 Contrôler la déclaration d'embauche à l'ONEM (15 jours).");
        break;
      case "Bulletin de paie":
        recos.push("💰 Vérifier les retenues CNSS (5%), ONEM (0.2%), INPP (1%), IPR.");
        recos.push("💰 Contrôler les allocations familiales et l'indemnité de logement.");
        break;
      case "Décompte final":
        recos.push("🧮 Recalculer avec le module Décompte Final automatique pour validation.");
        recos.push("🧮 Vérifier la conformité du préavis selon la catégorie.");
        break;
      case "Lettre de licenciement":
        recos.push("⚖️ Vérifier la présence du motif valable (Art. 62 CT).");
        recos.push("⚖️ Contrôler le respect de la procédure (préavis, audition).");
        break;
      case "Procès-verbal":
        recos.push("📝 Vérifier les mentions obligatoires (date, lieu, parties, faits, signatures).");
        break;
      default:
        recos.push("📄 Document général — vérifier la conformité au Code du travail RDC.");
    }
    if (refs.articles.length) recos.push(`🔎 ${refs.articles.length} article(s) du CT cité(s) — vérifier leur application.`);
    return recos;
  },

  // Comparer deux textes
  comparer(texteA, texteB) {
    const tokensA = new Set(NLP.tokenize(texteA));
    const tokensB = new Set(NLP.tokenize(texteB));
    const communs = [...tokensA].filter(t => tokensB.has(t));
    const uniqueA = [...tokensA].filter(t => !tokensB.has(t));
    const uniqueB = [...tokensB].filter(t => !tokensA.has(t));
    const similarite = communs.length / Math.max(tokensA.size, tokensB.size, 1);
    return {
      similarite: (similarite * 100).toFixed(1) + "%",
      motsCommuns: communs.length,
      uniqueA: uniqueA.slice(0, 30),
      uniqueB: uniqueB.slice(0, 30),
      tailleA: tokensA.size,
      tailleB: tokensB.size,
      verdict: similarite > 0.8 ? "Textes très similaires" 
             : similarite > 0.5 ? "Textes similaires"
             : similarite > 0.2 ? "Similitudes partielles" 
             : "Textes très différents"
    };
  }
};

if (typeof window !== 'undefined') window.ANALYSE = ANALYSE;
