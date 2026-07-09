/* ============================================================
   js/onem-engine.js
   ONEM RDC – Déclaration, DASMO, Bilan social
   Calculs automatiques + contrôles + assistance IA
   ============================================================ */

const ONEMEngine = (() => {
  "use strict";

  function uid(prefix) {
    return `${prefix}-ONEM-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  function fmt(n) {
    return new Intl.NumberFormat("fr-CD").format(Math.round(n || 0));
  }

  /** DASMO – agrégation et contrôles */
  function calculerDASMO(data) {
    const {
      raisonSociale, rccm, province, annee,
      effectifH = 0, effectifF = 0,
      nationaux = 0, etrangers = 0,
      cadres = 0, maitrises = 0, agents = 0, manoeuvres = 0,
      embauches = 0, departs = 0, licenciements = 0, demissions = 0,
      cdd = 0, cdi = 0,
      masseSalariale = 0,
      accidentsTravail = 0, joursArret = 0,
      formationHeures = 0, formationBenef = 0
    } = data;

    const effectifTotal = Number(effectifH) + Number(effectifF);
    const parNationalite = Number(nationaux) + Number(etrangers);
    const parCategorie = Number(cadres) + Number(maitrises) + Number(agents) + Number(manoeuvres);
    const parContrat = Number(cdd) + Number(cdi);
    const mouvements = Number(embauches) - Number(departs);

    const alertes = [];
    if (effectifTotal <= 0) alertes.push({ niveau: "error", msg: "Effectif total nul ou invalide." });
    if (parNationalite && parNationalite !== effectifTotal) {
      alertes.push({ niveau: "warn", msg: `Incohérence nationalité (${parNationalite}) vs effectif (${effectifTotal}).` });
    }
    if (parCategorie && parCategorie !== effectifTotal) {
      alertes.push({ niveau: "warn", msg: `Incohérence catégories (${parCategorie}) vs effectif (${effectifTotal}).` });
    }
    if (parContrat && parContrat !== effectifTotal) {
      alertes.push({ niveau: "warn", msg: `Incohérence contrats CDI+CDD (${parContrat}) vs effectif (${effectifTotal}).` });
    }
    if (effectifTotal > 0 && etrangers / effectifTotal > 0.15) {
      alertes.push({ niveau: "warn", msg: "Ratio étrangers > 15 % — contrôler fiche F02 (quotas / cartes de travail)." });
    }
    if (effectifTotal > 0 && Number(effectifF) / effectifTotal < 0.2) {
      alertes.push({ niveau: "info", msg: "Faible part de femmes dans l'effectif — noter pour le bilan social / non-discrimination." });
    }
    if (Number(licenciements) > Number(embauches) && Number(licenciements) > 3) {
      alertes.push({ niveau: "warn", msg: "Licenciements élevés — vérifier procédures (préavis, motifs, décomptes finaux)." });
    }
    if (Number(accidentsTravail) > 0) {
      alertes.push({ niveau: "warn", msg: "Accidents du travail déclarés — croiser F03/F07 et déclarations CNSS." });
    }
    if (masseSalariale > 0 && effectifTotal > 0) {
      const moyenne = masseSalariale / effectifTotal / 12;
      if (window.SMIG_RDC && moyenne < SMIG_RDC.baseManoeuvreJour * 26) {
        alertes.push({
          niveau: "error",
          msg: `Salaire moyen mensuel estimé (${fmt(moyenne)} FC) < SMIG manœuvre 2025 — investigation F01 obligatoire.`
        });
      }
    }

    const tauxRotation = effectifTotal > 0 ? (Number(departs) / effectifTotal) * 100 : 0;
    const tauxAccidents = effectifTotal > 0 ? (Number(accidentsTravail) / effectifTotal) * 1000 : 0;
    const partEtrangers = effectifTotal > 0 ? (Number(etrangers) / effectifTotal) * 100 : 0;
    const partFemmes = effectifTotal > 0 ? (Number(effectifF) / effectifTotal) * 100 : 0;

    const numero = uid("DASMO");
    const recommendations = genererRecoDASMO({ alertes, partEtrangers, tauxRotation, accidentsTravail, formationBenef, effectifTotal });

    return {
      meta: { numero, type: "DASMO", annee: annee || new Date().getFullYear(), date: new Date().toLocaleDateString("fr-CD") },
      etablissement: { raisonSociale, rccm, province },
      effectifs: {
        total: effectifTotal, H: +effectifH, F: +effectifF,
        nationaux: +nationaux, etrangers: +etrangers,
        cadres: +cadres, maitrises: +maitrises, agents: +agents, manoeuvres: +manoeuvres,
        cdd: +cdd, cdi: +cdi
      },
      mouvements: { embauches: +embauches, departs: +departs, licenciements: +licenciements, demissions: +demissions, solde: mouvements },
      social: { masseSalariale: +masseSalariale, accidentsTravail: +accidentsTravail, joursArret: +joursArret, formationHeures: +formationHeures, formationBenef: +formationBenef },
      indicateurs: {
        tauxRotation: round2(tauxRotation),
        tauxAccidentsPour1000: round2(tauxAccidents),
        partEtrangers: round2(partEtrangers),
        partFemmes: round2(partFemmes),
        salaireMoyenMensuel: effectifTotal && masseSalariale ? Math.round(masseSalariale / effectifTotal / 12) : 0
      },
      alertes,
      recommendations,
      qrPayload: JSON.stringify({ t: "DASMO", n: numero, rs: raisonSociale, e: effectifTotal })
    };
  }

  function genererRecoDASMO(ctx) {
    const r = [];
    r.push("Joindre la liste nominative des travailleurs (noms, nationalité, catégorie, salaire).");
    r.push("Vérifier l'immatriculation CNSS et le paiement des cotisations (F07).");
    if (ctx.partEtrangers > 15) r.push("Engager un contrôle F02 — cartes de travail et plan de congolaïsation.");
    if (ctx.tauxRotation > 30) r.push("Taux de rotation élevé — analyser motifs de départ et décomptes finaux.");
    if (ctx.accidentsTravail > 0) r.push("Exiger registres d'accidents et preuves de déclaration CNSS.");
    if (!ctx.formationBenef || ctx.formationBenef === 0) r.push("Aucune formation déclarée — rappeler obligations INPP / formation professionnelle.");
    r.push("Comparer les salaires au tableau SMIG Décret 25/22 (classes 1–17).");
    r.push("Archiver la DASMO avec n° unique et QR pour traçabilité IGT.");
    return r;
  }

  /** Bilan social */
  function calculerBilanSocial(data) {
    const dasmo = data.dasmo || calculerDASMO(data);
    const {
      dialogueSocial = false,
      conventionCollective = false,
      delegues = 0,
      reunionsCE = 0,
      greves = 0,
      hygieneComite = false,
      medecineTravail = false,
      epiFournis = false,
      investissementFormation = 0,
      promotions = 0,
      stagiaires = 0
    } = data;

    const score = {
      emploi: scoreEmploi(dasmo),
      sante: (medecineTravail ? 25 : 0) + (hygieneComite ? 25 : 0) + (epiFournis ? 25 : 0) + (dasmo.social.accidentsTravail === 0 ? 25 : 10),
      formation: dasmo.effectifs.total > 0 ? Math.min(100, (dasmo.social.formationBenef / dasmo.effectifs.total) * 100) : 0,
      dialogue: (dialogueSocial ? 30 : 0) + (conventionCollective ? 30 : 0) + (delegues > 0 ? 20 : 0) + (reunionsCE > 0 ? 20 : 0)
    };
    score.global = Math.round((score.emploi + score.sante + score.formation + score.dialogue) / 4);

    const alertes = [...(dasmo.alertes || [])];
    if (!medecineTravail) alertes.push({ niveau: "warn", msg: "Médecine du travail absente — non-conformité probable F03." });
    if (!epiFournis) alertes.push({ niveau: "warn", msg: "EPI non fournis — F03/F04/F05/F06 selon secteur." });
    if (!conventionCollective && dasmo.effectifs.total >= 20) {
      alertes.push({ niveau: "info", msg: "Établissement ≥ 20 travailleurs sans convention collective déclarée — vérifier dialogue social." });
    }
    if (greves > 0) alertes.push({ niveau: "info", msg: "Conflits collectifs signalés — documenter médiation / inspection." });

    const numero = uid("BILAN");
    return {
      meta: { numero, type: "BILAN_SOCIAL", date: new Date().toLocaleDateString("fr-CD"), annee: data.annee || dasmo.meta.annee },
      etablissement: dasmo.etablissement,
      dasmoRef: dasmo.meta.numero,
      indicateurs: dasmo.indicateurs,
      effectifs: dasmo.effectifs,
      scores: score,
      dialogue: { dialogueSocial, conventionCollective, delegues: +delegues, reunionsCE: +reunionsCE, greves: +greves },
      santeSecurite: { hygieneComite, medecineTravail, epiFournis, accidents: dasmo.social.accidentsTravail },
      formation: { heures: dasmo.social.formationHeures, beneficiaires: dasmo.social.formationBenef, investissement: +investissementFormation, promotions: +promotions, stagiaires: +stagiaires },
      alertes,
      recommendations: [
        ...dasmo.recommendations,
        score.global < 50 ? "Score global faible — plan de mise en conformité sous 30 jours recommandé." : "Maintenir les bonnes pratiques et documenter les preuves.",
        "Produire le bilan social pour le comité d'entreprise / délégués si applicable.",
        "Joindre PV des réunions et preuves de formation."
      ],
      qrPayload: JSON.stringify({ t: "BILAN", n: numero, g: score.global })
    };
  }

  function scoreEmploi(dasmo) {
    let s = 50;
    if (dasmo.mouvements.solde >= 0) s += 15;
    if (dasmo.indicateurs.tauxRotation < 20) s += 15;
    if (dasmo.indicateurs.partFemmes >= 30) s += 10;
    if (dasmo.effectifs.cdi >= dasmo.effectifs.cdd) s += 10;
    return Math.min(100, s);
  }

  function round2(n) { return Math.round(n * 100) / 100; }

  function exporterTexteDASMO(r) {
    return [
      "══════════════════════════════════════",
      " DASMO – OFFICE NATIONAL DE L'EMPLOI",
      " InspecteurBot IA RDC 4.0",
      "══════════════════════════════════════",
      `N° ${r.meta.numero} | Année ${r.meta.annee} | ${r.meta.date}`,
      `Établissement : ${r.etablissement.raisonSociale || "—"}`,
      `RCCM : ${r.etablissement.rccm || "—"} | Province : ${r.etablissement.province || "—"}`,
      "",
      "EFFECTIFS",
      ` Total : ${r.effectifs.total} (H ${r.effectifs.H} / F ${r.effectifs.F})`,
      ` Nationaux : ${r.effectifs.nationaux} | Étrangers : ${r.effectifs.etrangers}`,
      ` Cadres ${r.effectifs.cadres} | Maîtrises ${r.effectifs.maitrises} | Agents ${r.effectifs.agents} | Manœuvres ${r.effectifs.manoeuvres}`,
      ` CDI ${r.effectifs.cdi} | CDD ${r.effectifs.cdd}`,
      "",
      "MOUVEMENTS",
      ` Embauches ${r.mouvements.embauches} | Départs ${r.mouvements.departs} | Solde ${r.mouvements.solde}`,
      ` Licenciements ${r.mouvements.licenciements} | Démissions ${r.mouvements.demissions}`,
      "",
      "INDICATEURS",
      ` Rotation : ${r.indicateurs.tauxRotation} %`,
      ` Part étrangers : ${r.indicateurs.partEtrangers} %`,
      ` Part femmes : ${r.indicateurs.partFemmes} %`,
      ` Salaire moyen mensuel estimé : ${fmt(r.indicateurs.salaireMoyenMensuel)} FC`,
      ` Accidents /1000 : ${r.indicateurs.tauxAccidentsPour1000}`,
      "",
      "ALERTES",
      ...(r.alertes.length ? r.alertes.map(a => ` [${a.niveau}] ${a.msg}`) : [" Aucune"]),
      "",
      "RECOMMANDATIONS IA",
      ...r.recommendations.map((x, i) => ` ${i + 1}. ${x}`),
      "",
      "Document généré par InspecteurBot IA RDC – IGT"
    ].join("\n");
  }

  function exporterTexteBilan(r) {
    return [
      "══════════════════════════════════════",
      " BILAN SOCIAL – ONEM / IGT RDC",
      "══════════════════════════════════════",
      `N° ${r.meta.numero} | ${r.meta.date} | Année ${r.meta.annee}`,
      `Établissement : ${r.etablissement.raisonSociale || "—"}`,
      `Réf. DASMO : ${r.dasmoRef}`,
      "",
      "SCORES IA (0-100)",
      ` Emploi : ${r.scores.emploi}`,
      ` Santé-Sécurité : ${r.scores.sante}`,
      ` Formation : ${Math.round(r.scores.formation)}`,
      ` Dialogue social : ${r.scores.dialogue}`,
      ` ★ GLOBAL : ${r.scores.global}`,
      "",
      "SANTÉ / SÉCURITÉ",
      ` Médecine travail : ${r.santeSecurite.medecineTravail ? "Oui" : "Non"}`,
      ` Comité hygiène : ${r.santeSecurite.hygieneComite ? "Oui" : "Non"}`,
      ` EPI fournis : ${r.santeSecurite.epiFournis ? "Oui" : "Non"}`,
      ` Accidents : ${r.santeSecurite.accidents}`,
      "",
      "DIALOGUE",
      ` Convention collective : ${r.dialogue.conventionCollective ? "Oui" : "Non"}`,
      ` Délégués : ${r.dialogue.delegues} | Réunions : ${r.dialogue.reunionsCE} | Grèves : ${r.dialogue.greves}`,
      "",
      "ALERTES",
      ...(r.alertes.length ? r.alertes.map(a => ` [${a.niveau}] ${a.msg}`) : [" Aucune"]),
      "",
      "RECOMMANDATIONS",
      ...r.recommendations.map((x, i) => ` ${i + 1}. ${x}`)
    ].join("\n");
  }

  return {
    calculerDASMO,
    calculerBilanSocial,
    exporterTexteDASMO,
    exporterTexteBilan,
    uid,
    fmt
  };
})();

if (typeof window !== "undefined") window.ONEMEngine = ONEMEngine;
