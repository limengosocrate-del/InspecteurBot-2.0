/* ==================================================================
   DECOMPTE-FINAL.JS — Moteur automatique de décompte final RDC
   Basé sur la formule Me Daniel Buzitu (Expert OIT/BIT)
   + Retenues IPR / CNSS / ONEM / INPP
   ================================================================== */

const DECOMPTE = {

  // Génération d'un numéro unique DF-AAAA-XXXXXX
  genererNumero() {
    const year = new Date().getFullYear();
    let seq = parseInt(localStorage.getItem("igt_decompte_seq") || "0", 10) + 1;
    localStorage.setItem("igt_decompte_seq", seq);
    return `DF-${year}-${String(seq).padStart(6, "0")}`;
  },

  // Déterminer catégorie professionnelle → type de préavis
  categorieToType(categorie) {
    const c = String(categorie).toUpperCase();
    if (["I","II","III"].includes(c)) return "manoeuvre";
    if (c === "IV" || c === "V") return "classifie";
    if (c === "VI") return "maitrise";
    if (c === "VII") return "cadre";
    return "classifie";
  },

  // Calcul du préavis en jours
  calculerPreavis(type, anciennete, motif) {
    const p = SMIG_DATA.preavis[type] || SMIG_DATA.preavis.classifie;
    let base = p.base;
    if (motif === "demission") base = base / 2;
    return Math.ceil(base + (p.parAnnee * anciennete));
  },

  // Calcul IPR (barème progressif RDC — annuel)
  calculerIPR(salaireMensuel) {
    const salaireAnnuel = salaireMensuel * 12;
    let ipr = 0, restant = salaireAnnuel;
    for (const t of SMIG_DATA.ipr_bareme) {
      if (restant <= 0) break;
      const tranche = Math.min(restant, t.max - t.min);
      if (salaireAnnuel > t.min) {
        const imposable = Math.min(salaireAnnuel, t.max) - t.min;
        ipr += imposable * t.taux;
      }
    }
    return Math.round(ipr / 12); // mensualisé
  },

  // Calcul complet du décompte final
  calculer(input) {
    // input = {
    //   nom, postnom, prenom, fonction, categorie, dateEngagement, dateFin,
    //   motif ('licenciement'|'demission'|'fin_contrat'|'faute_lourde'),
    //   salaireBase, ration, joursTravailles, transport,
    //   nbEnfants, avecCNSS, avecONEM, avecINPP, avecIPR,
    //   lieu, employeur
    // }

    const nom = `${input.nom||""} ${input.postnom||""} ${input.prenom||""}`.trim();
    const salaireBase = parseFloat(input.salaireBase) || 0;
    const ration = parseFloat(input.ration) || 0;
    const jours = parseInt(input.joursTravailles || 26, 10);
    const transport = parseFloat(input.transport) || 0;
    const nbEnfants = parseInt(input.nbEnfants || 0, 10);

    // Ancienneté (années)
    const dEng = new Date(input.dateEngagement);
    const dFin = new Date(input.dateFin);
    const anciennete = Math.max(0, (dFin - dEng) / (1000*60*60*24*365.25));
    const ancienneteAnnees = Math.floor(anciennete);
    const ancienneteMois = Math.floor((anciennete - ancienneteAnnees) * 12);

    // Taux salaire journalier (base 26 jours)
    const tauxJour = salaireBase / 26;

    // Type de préavis
    const typePreavis = this.categorieToType(input.categorie);
    const joursPreavis = this.calculerPreavis(typePreavis, ancienneteAnnees, input.motif);

    // ==================== SOUS-TOTAUX ====================

    // S/Total 1 : Prestations du mois
    const rationMois = ration * jours;
    const st1 = salaireBase + rationMois + transport;

    // S/Total 2 : Préavis légal
    const st2 = input.motif === "faute_lourde" ? 0 : Math.round(tauxJour * joursPreavis);

    // S/Total 3 : Congé compensatoire (18 jours/an prorata)
    const joursConge = (joursPreavis * 18) / 365;
    const st3 = Math.round(tauxJour * joursConge);

    // S/Total 4 : Logement (30% salaire de base)
    const st4 = Math.round(salaireBase * 0.30);

    // S/Total 5 : Allocations familiales (si enfants)
    const smigManoeuvre = SMIG_DATA.getSmigActuel(dFin);
    const allocJour = smigManoeuvre * SMIG_DATA.allocationFamilialeRatio;
    const st5 = Math.round(allocJour * jours * nbEnfants);

    // S/Total 6 : Gratification (1/12 du salaire annuel — pratique courante)
    const st6 = ancienneteAnnees >= 1 ? Math.round(salaireBase) : 0;

    // TOTAL BRUT
    const totalBrut = st1 + st2 + st3 + st4 + st5 + st6;

    // ==================== RETENUES ====================
    const retenues = {};
    let totalRetenues = 0;

    if (input.avecCNSS !== false) {
      retenues.cnss = Math.round(salaireBase * SMIG_DATA.retenues.inss);
      totalRetenues += retenues.cnss;
    }
    if (input.avecONEM !== false) {
      retenues.onem = Math.round(salaireBase * SMIG_DATA.retenues.onem);
      totalRetenues += retenues.onem;
    }
    if (input.avecINPP !== false) {
      retenues.inpp = Math.round(salaireBase * SMIG_DATA.retenues.inpp);
      totalRetenues += retenues.inpp;
    }
    if (input.avecIPR !== false) {
      retenues.ipr = this.calculerIPR(salaireBase);
      totalRetenues += retenues.ipr;
    }

    const netAPayer = totalBrut - totalRetenues;

    // ==================== VÉRIFICATION SMIG ====================
    const classeTrouvee = SMIG_DATA.trouverClasse(input.fonction || "");
    let alerteSmig = null;
    if (classeTrouvee && salaireBase < classeTrouvee.smigMois) {
      alerteSmig = `⚠️ ALERTE : Le salaire de base (${salaireBase.toLocaleString("fr-FR")} FC) est INFÉRIEUR au SMIG légal pour "${classeTrouvee.fonctions.split(",")[0]}" (${classeTrouvee.smigMois.toLocaleString("fr-FR")} FC). Recalcul recommandé avec le taux du Décret 25/22.`;
    }

    // ==================== RECOMMANDATIONS IA ====================
    const recommandations = this.genererRecommandations({
      motif: input.motif, anciennete: ancienneteAnnees,
      salaireBase, smigLegal: classeTrouvee ? classeTrouvee.smigMois : null,
      totalBrut, netAPayer
    });

    // ==================== RÉSULTAT ====================
    return {
      numero: input.numero || this.genererNumero(),
      dateEmission: new Date().toISOString(),
      travailleur: {
        nomComplet: nom,
        fonction: input.fonction,
        categorie: input.categorie,
        dateEngagement: input.dateEngagement,
        dateFin: input.dateFin,
        ancienneteAnnees, ancienneteMois,
        motif: input.motif,
        lieu: input.lieu
      },
      employeur: input.employeur || "",
      elementsCalcul: {
        salaireBase, tauxJour: Math.round(tauxJour),
        ration, rationMois, transport, jours,
        typePreavis, joursPreavis,
        joursConge: joursConge.toFixed(2),
        nbEnfants, allocJour: Math.round(allocJour)
      },
      sousTotaux: {
        st1_prestations: st1,
        st2_preavis: st2,
        st3_conge: st3,
        st4_logement: st4,
        st5_allocations: st5,
        st6_gratification: st6
      },
      totalBrut,
      retenues,
      totalRetenues,
      netAPayer,
      alerteSmig,
      recommandations,
      smigReference: classeTrouvee
    };
  },

  // Générer recommandations IA
  genererRecommandations(ctx) {
    const rec = [];
    if (ctx.smigLegal && ctx.salaireBase < ctx.smigLegal) {
      rec.push(`🚨 Salaire inférieur au SMIG légal — l'inspecteur doit exiger le recalcul selon le Décret 25/22 du 30/05/2025.`);
    }
    if (ctx.motif === "licenciement" && ctx.anciennete >= 5) {
      rec.push(`⚖️ Ancienneté ≥ 5 ans : vérifier l'existence d'un motif valable (Art. 62 Code du travail).`);
    }
    if (ctx.motif === "faute_lourde") {
      rec.push(`⚠️ Faute lourde : pas de préavis dû. Vérifier la qualification de la faute et la procédure disciplinaire.`);
    }
    if (ctx.motif === "demission") {
      rec.push(`ℹ️ Démission : le préavis est réduit de moitié pour le travailleur.`);
    }
    if (ctx.netAPayer < ctx.totalBrut * 0.5) {
      rec.push(`💡 Les retenues représentent plus de 50% du brut — vérifier les taux appliqués.`);
    }
    if (ctx.anciennete >= 10) {
      rec.push(`🎖️ Ancienneté ≥ 10 ans : envisager une gratification d'ancienneté conventionnelle.`);
    }
    rec.push(`✅ Décompte conforme à la formule officielle (Guide Me Buzitu / OIT-BIT).`);
    return rec;
  },

  // Sauvegarder dans l'historique
  sauvegarder(resultat) {
    const hist = JSON.parse(localStorage.getItem("igt_decomptes") || "[]");
    hist.unshift(resultat);
    if (hist.length > 500) hist.length = 500;
    localStorage.setItem("igt_decomptes", JSON.stringify(hist));
    return true;
  },

  // Charger historique
  historique() {
    return JSON.parse(localStorage.getItem("igt_decomptes") || "[]");
  },

  // Formatage monétaire
  fmt(n) {
    return Math.round(n).toLocaleString("fr-FR") + " FC";
  }
};

if (typeof window !== 'undefined') window.DECOMPTE = DECOMPTE;
