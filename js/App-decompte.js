/**
 * =========================================================
 *  InspecteurBot — App.js
 *  Application professionnelle de calcul des décomptes finaux
 *  Inspection Générale du Travail · République Démocratique du Congo
 *  Tout le JavaScript de l'application est centralisé ici.
 * =========================================================
 */
(function () {
  'use strict';

  /* -------------------------------------------------------
   *  CONSTANTS & CONFIG
   * ----------------------------------------------------- */
  const APP_KEY = 'inspecteurbot_v1';
  const YEAR = new Date().getFullYear();

  /** Paramètres de préavis selon catégorie (jours de base + jours/an d'ancienneté) */
  const PREAVIS_RULES = {
    manoeuvre:            { base: 14, perYear: 7,  label: 'Manœuvre / Agent classifié' },
    manoeuvre_specialise: { base: 14, perYear: 7,  label: 'Manœuvre spécialisé' },
    semi_qualifie:        { base: 14, perYear: 7,  label: 'Agent semi-qualifié' },
    qualifie:             { base: 14, perYear: 7,  label: 'Agent qualifié' },
    hautement_qualifie:   { base: 14, perYear: 7,  label: 'Agent hautement qualifié' },
    maitrise:             { base: 26, perYear: 9,  label: 'Agent de maîtrise' },
    cadre:                { base: 78, perYear: 16, label: 'Cadre de collaboration' }
  };

  const CATEGORIE_LABELS = {
    manoeuvre: 'I — Manœuvres',
    manoeuvre_specialise: 'II — Manœuvres spécialisés',
    semi_qualifie: 'III — Agents semi-qualifiés',
    qualifie: 'IV — Agents qualifiés',
    hautement_qualifie: 'V — Agents hautement qualifiés',
    maitrise: 'VI — Maîtrises',
    cadre: 'VII — Cadres de collaboration'
  };

  const MOTIF_LABELS = {
    licenciement: 'Licenciement',
    demission: 'Démission volontaire',
    fin_contrat: 'Fin de contrat à durée déterminée',
    retraite: 'Mise à la retraite',
    deces: 'Décès',
    force_majeure: 'Force majeure',
    incapacite: 'Licenciement pour incapacité professionnelle',
    faute_lourde: 'Licenciement pour faute lourde'
  };

  /** SMIG par catégorie (tension relative × SMIG manœuvre) — palier 2025 */
  const SMIG_TENSION = {
    manoeuvre: 1.00,
    manoeuvre_specialise: 1.33,
    semi_qualifie: 1.54,
    qualifie: 2.37,
    hautement_qualifie: 3.17,
    maitrise: 3.65,
    cadre: 6.51
  };

  const LEGAL_REFS = [
    {
      art: 'Art. 61–78',
      titre: 'Rupture du contrat de travail',
      texte: 'Conditions de rupture, préavis et indemnités dues au travailleur en cas de licenciement ou de démission (Code du Travail Loi n°015/2002 modifiée).'
    },
    {
      art: 'Art. 63',
      titre: 'Préavis de rupture',
      texte: 'Le préavis est obligatoire sauf faute lourde. Sa durée varie selon la catégorie professionnelle et l\'ancienneté du travailleur.'
    },
    {
      art: 'Art. 71',
      titre: 'Indemnité de préavis',
      texte: 'En cas de rupture sans préavis ou avec préavis insuffisant, l\'employeur doit verser une indemnité compensatrice égale à la rémunération correspondant à la durée du préavis.'
    },
    {
      art: 'Art. 141–150',
      titre: 'Congés payés',
      texte: 'Tout travailleur a droit à un congé annuel payé. Les jours non pris donnent lieu à une indemnité compensatrice de congé.'
    },
    {
      art: 'Art. 87',
      titre: 'Salaire minimum (SMIG)',
      texte: 'Aucun travailleur ne peut être rémunéré en-dessous du Salaire Minimum Interprofessionnel Garanti fixé par voie réglementaire.'
    },
    {
      art: 'Décret 25/22',
      titre: 'Fixation du SMIG 2025',
      texte: 'Décret n°25/22 du 30 mai 2025 : SMIG journalier manœuvre ordinaire à 14 500 FC (mai–déc. 2025) puis 21 500 FC à partir de janvier 2026. Logement = 30 % du salaire de base.'
    },
    {
      art: 'Décret 25/21',
      titre: 'Modalités d\'ajustement SMIG',
      texte: 'Décret n°25/21 du 30 mai 2025 déterminant les modalités de fixation et d\'ajustement du SMIG, des allocations familiales minima et de la contre-valeur du logement.'
    },
    {
      art: 'Art. 148',
      titre: 'Indemnité de congé compensatoire',
      texte: 'En cas de rupture, le travailleur a droit à l\'indemnité compensatrice des congés acquis et non pris, calculée au prorata du temps de service.'
    },
    {
      art: 'CNSS / IPR',
      titre: 'Retenues légales',
      texte: 'Cotisations CNSS (part travailleur), Impôt Professionnel sur les Rémunérations (IPR), et le cas échéant ONEM et INPP, sont retenues selon les barèmes en vigueur.'
    },
    {
      art: 'Art. 91',
      titre: 'Secteurs spéciaux',
      texte: 'Dispositions spécifiques possibles pour les secteurs agro-industriels et pastoraux concernant l\'application du SMIG.'
    }
  ];

  const CHECKLIST_ITEMS = [
    { id: 'c1', label: 'Identité du travailleur complète', desc: 'Nom, fonction, catégorie renseignés' },
    { id: 'c2', label: 'Dates d\'engagement et de fin valides', desc: 'Ancienneté calculée correctement' },
    { id: 'c3', label: 'Motif de départ précisé', desc: 'Licenciement, démission, etc.' },
    { id: 'c4', label: 'Salaire de base vérifié vs SMIG', desc: 'Conformité Décret 25/22' },
    { id: 'c5', label: 'Préavis calculé selon catégorie', desc: 'Base + ancienneté, demi-préavis si démission' },
    { id: 'c6', label: 'Congé compensatoire inclus', desc: '18 jrs/an au prorata' },
    { id: 'c7', label: 'Logement (30 %) et transport', desc: 'Indemnités légales prises en compte' },
    { id: 'c8', label: 'Retenues CNSS / IPR appliquées', desc: 'Ou justifiées si non applicables' },
    { id: 'c9', label: 'Net à payer cohérent', desc: 'Brut − retenues = net' },
    { id: 'c10', label: 'Signature de l\'inspecteur', desc: 'Signature numérique ou manuscrite' },
    { id: 'c11', label: 'Direction provinciale correcte', desc: 'En-tête officiel IGT' },
    { id: 'c12', label: 'Document prêt à imprimer (A4)', desc: 'Aperçu vérifié avant archivage' }
  ];

  /* -------------------------------------------------------
   *  STATE
   * ----------------------------------------------------- */
  const state = {
    numero: null,
    lastResult: null,
    photos: { travailleur: null, entreprise: null },
    signatureData: null,
    geo: null,
    charts: { retenues: null, salaire: null, jours: null },
    checklist: {}
  };

  /* -------------------------------------------------------
   *  STORAGE HELPERS
   * ----------------------------------------------------- */
  function loadStore() {
    try {
      return JSON.parse(localStorage.getItem(APP_KEY)) || defaultStore();
    } catch {
      return defaultStore();
    }
  }

  function defaultStore() {
    return {
      counter: 0,
      archives: [],
      favorites: [],
      settings: {
        smigJour: 14500,
        smigJour2026: 21500,
        tauxChange: 2850,
        joursCongesAn: 18,
        defaultInspecteur: '',
        defaultGrade: 'Officier de Police Judiciaire · Chef de Bureau',
        autoCalc: true
      }
    };
  }

  function saveStore(store) {
    localStorage.setItem(APP_KEY, JSON.stringify(store));
  }

  function getSettings() {
    return loadStore().settings;
  }

  /* -------------------------------------------------------
   *  UTILITIES
   * ----------------------------------------------------- */
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function toast(msg, type = 'info') {
    const el = $('#toast');
    el.textContent = msg;
    el.className = 'toast show ' + (type === 'success' || type === 'error' ? type : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 3200);
  }

  function formatNumber(n, decimals = 2) {
    if (n == null || isNaN(n)) return '—';
    const parts = Number(n).toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return parts.join(',');
  }

  function formatMoney(n, devise) {
    const sym = devise === 'USD' ? '$US' : 'FC';
    return formatNumber(n, 2) + ' ' + sym;
  }

  function parseDate(v) {
    if (!v) return null;
    const d = new Date(v + 'T00:00:00');
    return isNaN(d) ? null : d;
  }

  function formatDateFR(d) {
    if (!d) return '—';
    const dt = d instanceof Date ? d : parseDate(d);
    if (!dt) return '—';
    const dd = String(dt.getDate()).padStart(2, '0');
    const mm = String(dt.getMonth() + 1).padStart(2, '0');
    const yyyy = dt.getFullYear();
    return `Le ${dd}/${mm}/${yyyy}`;
  }

  function formatDateLong(d) {
    if (!d) return '…';
    const dt = d instanceof Date ? d : parseDate(d);
    if (!dt) return '…';
    return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function daysBetween(a, b) {
    const ms = b - a;
    return Math.max(0, Math.floor(ms / 86400000));
  }

  function computeAnciennete(dateEng, dateFin) {
    if (!dateEng || !dateFin || dateFin < dateEng) {
      return { years: 0, months: 0, days: 0, totalDays: 0, label: '—', yearsExact: 0 };
    }
    let y = dateFin.getFullYear() - dateEng.getFullYear();
    let m = dateFin.getMonth() - dateEng.getMonth();
    let d = dateFin.getDate() - dateEng.getDate();
    if (d < 0) {
      m -= 1;
      const prev = new Date(dateFin.getFullYear(), dateFin.getMonth(), 0);
      d += prev.getDate();
    }
    if (m < 0) {
      y -= 1;
      m += 12;
    }
    const totalDays = daysBetween(dateEng, dateFin);
    const yearsExact = totalDays / 365.25;
    const parts = [];
    if (y > 0) parts.push(y + (y > 1 ? ' ans' : ' an'));
    if (m > 0) parts.push(m + (m > 1 ? ' mois' : ' mois'));
    if (y === 0 && m === 0) parts.push(d + (d > 1 ? ' jours' : ' jour'));
    return {
      years: y,
      months: m,
      days: d,
      totalDays,
      yearsExact,
      label: parts.join(' ') || '0 jour'
    };
  }

  function nextNumero() {
    const store = loadStore();
    store.counter = (store.counter || 0) + 1;
    saveStore(store);
    const n = String(store.counter).padStart(6, '0');
    return `DF-${YEAR}-${n}`;
  }

  function currentNumero() {
    if (!state.numero) state.numero = nextNumero();
    return state.numero;
  }

  function deviseSymbol() {
    return $('#devise').value === 'USD' ? '$US' : 'FC';
  }

  /* -------------------------------------------------------
   *  CORE CALCULATION ENGINE
   * ----------------------------------------------------- */
  /**
   * Formules basées sur le modèle officiel IGT et les exemples fournis :
   *
   * Préavis (agent classifié) :
   *   Licenciement : base + (perYear × années)
   *   Démission    : (base + perYear × années) / 2
   *   (maîtrise base=26/an=9 ; cadres base=78/an=16)
   *
   * Congé sur préavis : preavisJours × 18 / 312  (ou 365 selon usage)
   * Congé compensatoire : 18 jrs × (mois d'ancienneté) / 12
   *   (ou 18 × années exactes)
   *
   * Jours totaux = préavis + congé préavis + congé comp. + jours prestés
   *
   * Salaire = (salaireBase / joursOuvrables) × totalJours
   * Logement = (logementMensuel / joursOuvrables) × totalJours
   * Transport = (transportMensuel / joursOuvrables) × joursPrestés
   *            (sur le modèle scanné, le transport est calculé sur jours prestés)
   *
   * Retenues :
   *   CNSS = brut × taux
   *   IPR  = (brut − CNSS) × taux   (comme sur le modèle scanné)
   *   ONEM / INPP selon activation
   */
  function calculate() {
    const settings = getSettings();
    const devise = $('#devise').value;
    const salaireBase = num($('#salaireBase').value);
    const joursOuv = num($('#joursOuvrables').value) || 26;
    const joursPrestes = num($('#joursPrestes').value) || 0;
    const categorie = $('#categorie').value;
    const motif = $('#motif').value;
    const preavisMode = $('#preavisMode').value;
    const congesPris = num($('#congeAcquis').value) || 0;

    const dateEng = parseDate($('#dateEngagement').value);
    const dateFin = parseDate($('#dateFin').value);
    const anc = computeAnciennete(dateEng, dateFin);

    // Logement auto 30%
    let logement = num($('#logement').value);
    if ($('#logementAuto').checked) {
      logement = salaireBase * 0.3;
      $('#logement').value = logement ? logement.toFixed(2) : '';
    }
    const transport = num($('#transport').value) || 0;

    // --- Préavis ---
    const rule = PREAVIS_RULES[categorie] || PREAVIS_RULES.manoeuvre;
    const anneesEntieres = anc.years + (anc.months >= 6 ? 1 : 0); // arrondi courant inspecteurs
    // Utiliser années exactes pour le coefficient d'ancienneté (ex: 6 mois = 0 an dans l'exemple scanné)
    const anneesPourPreavis = anc.years; // comme sur le modèle : 6 mois → 0 an

    let preavisJours = 0;
    let preavisFormule = '—';

    if (preavisMode === 'sans') {
      preavisJours = 0;
      preavisFormule = 'Sans préavis';
    } else if (preavisMode === 'manuel') {
      preavisJours = num($('#preavisManuel').value) || 0;
      preavisFormule = `${preavisJours} jrs (manuel)`;
    } else {
      // Automatique
      const brutPreavis = rule.base + (rule.perYear * anneesPourPreavis);
      const isDemission = motif === 'demission';
      const isFauteLourde = motif === 'faute_lourde';
      if (isFauteLourde) {
        preavisJours = 0;
        preavisFormule = 'Faute lourde — préavis non dû';
      } else if (isDemission) {
        // Démission : moitié du préavis
        preavisJours = brutPreavis / 2;
        preavisFormule = `(${rule.base}Jrs+(${rule.perYear}Jrs×${anneesPourPreavis}ans))/2`;
      } else if (motif === 'fin_contrat' || motif === 'deces' || motif === 'retraite') {
        // Fin CDD / décès / retraite : souvent pas de préavis d'indemnité classique
        // mais on calcule le préavis légal pour info si licenciement-like
        if (motif === 'fin_contrat') {
          preavisJours = 0;
          preavisFormule = 'Fin de contrat CDD — préavis non applicable';
        } else {
          preavisJours = brutPreavis;
          preavisFormule = `${rule.base}Jrs+(${rule.perYear}Jrs×${anneesPourPreavis}ans)`;
        }
      } else {
        // Licenciement (y compris incapacité)
        preavisJours = brutPreavis;
        preavisFormule = `${rule.base}Jrs+(${rule.perYear}Jrs×${anneesPourPreavis}ans)`;
      }
    }
    preavisJours = round2(preavisJours);

    // --- Congé sur préavis : preavis × 18 / 312 ---
    // Pratique IGT : arrondi à l'entier le plus proche (ex. 14×18/312 = 0,81 → 1 jr)
    const congePreavisRaw = preavisJours * (settings.joursCongesAn || 18) / 312;
    const congePreavisJours = Math.round(congePreavisRaw);
    const congePreavisFormule = `${preavisJours}Jrs × ${settings.joursCongesAn || 18}jrs/312`;

    // --- Congé compensatoire : 18 jrs × mois / 12 ---
    // Ex. modèle scanné : 18 × 6 mois / 12 = 9 jrs
    const moisAnciennete = anc.years * 12 + anc.months;
    let congeCompJours = round2((settings.joursCongesAn || 18) * moisAnciennete / 12);
    congeCompJours = Math.max(0, round2(congeCompJours - congesPris));
    const congeCompFormule = `${settings.joursCongesAn || 18}Jrs × ${moisAnciennete}Mois/12` +
      (congesPris ? ` − ${congesPris} pris` : '');

    // --- Total jours ---
    const totalJours = round2(preavisJours + congePreavisJours + congeCompJours + joursPrestes);

    // --- Taux journaliers ---
    const tauxSalaire = joursOuv > 0 ? salaireBase / joursOuv : 0;
    const tauxLogement = joursOuv > 0 ? logement / joursOuv : 0;
    const tauxTransport = joursOuv > 0 ? transport / joursOuv : 0;

    // --- Montants ---
    // Sur le modèle scanné : salaire & logement sur total jours ; transport sur jours prestés
    const montSalaire = round2(tauxSalaire * totalJours);
    const montLogement = round2(tauxLogement * totalJours);
    const montTransport = round2(tauxTransport * joursPrestes);
    const totalBrut = round2(montSalaire + montLogement + montTransport);

    // --- Retenues ---
    const retenues = [];
    let totalRetenues = 0;
    let baseIPR = totalBrut;

    if ($('#retenueCNSS').checked) {
      const t = num($('#tauxCNSS').value) || 0;
      const m = round2(totalBrut * t / 100);
      retenues.push({ code: 'CNSS', label: `C.N.S.S (${t}%)`, taux: t, montant: m, formule: `(${formatNumber(totalBrut)})×${t}/100` });
      totalRetenues += m;
      baseIPR = totalBrut - m;
    }
    if ($('#retenueIPR').checked) {
      const t = num($('#tauxIPR').value) || 0;
      const m = round2(baseIPR * t / 100);
      const cnssPart = retenues.find(r => r.code === 'CNSS');
      const formule = cnssPart
        ? `(${formatNumber(totalBrut)}−${formatNumber(cnssPart.montant)})×${t}/100`
        : `(${formatNumber(totalBrut)})×${t}/100`;
      retenues.push({ code: 'IPR', label: `I.P.R. (${t}%)`, taux: t, montant: m, formule });
      totalRetenues += m;
    }
    if ($('#retenueONEM').checked) {
      const t = num($('#tauxONEM').value) || 0;
      const m = round2(totalBrut * t / 100);
      retenues.push({ code: 'ONEM', label: `ONEM (${t}%)`, taux: t, montant: m, formule: `(${formatNumber(totalBrut)})×${t}/100` });
      totalRetenues += m;
    }
    if ($('#retenueINPP').checked) {
      const t = num($('#tauxINPP').value) || 0;
      const m = round2(totalBrut * t / 100);
      retenues.push({ code: 'INPP', label: `INPP (${t}%)`, taux: t, montant: m, formule: `(${formatNumber(totalBrut)})×${t}/100` });
      totalRetenues += m;
    }
    const autres = num($('#autresRetenues').value) || 0;
    if (autres > 0) {
      const lib = $('#autresRetenuesLibelle').value || 'Autres retenues';
      retenues.push({ code: 'AUTRE', label: lib, taux: 0, montant: round2(autres), formule: formatNumber(autres) });
      totalRetenues += autres;
    }
    totalRetenues = round2(totalRetenues);
    const net = round2(totalBrut - totalRetenues);

    // SMIG check
    const smigJour = getSmigApplicable(dateFin || new Date());
    const tension = SMIG_TENSION[categorie] || 1;
    const smigMensuelCat = smigJour * tension * joursOuv;
    const smigOk = salaireBase >= smigMensuelCat * 0.98; // tolérance 2%

    const result = {
      numero: currentNumero(),
      devise,
      symbole: devise === 'USD' ? '$US' : 'FC',
      dateEng, dateFin, anc,
      categorie, motif,
      salaireBase, logement, transport,
      joursOuv, joursPrestes,
      preavisJours, preavisFormule,
      congePreavisJours, congePreavisFormule,
      congeCompJours, congeCompFormule,
      totalJours,
      tauxSalaire, tauxLogement, tauxTransport,
      montSalaire, montLogement, montTransport,
      totalBrut, retenues, totalRetenues, net,
      smigJour, smigMensuelCat, smigOk, tension,
      rule,
      anneesPourPreavis, moisAnciennete,
      inputs: collectInputs()
    };

    state.lastResult = result;
    renderResult(result);
    renderPreview(result);
    renderPV(result);
    updateCharts(result);
    runAI(result, true);
    updateChecklistAuto(result);
    return result;
  }

  function num(v) {
    const n = parseFloat(String(v).replace(/\s/g, '').replace(',', '.'));
    return isNaN(n) ? 0 : n;
  }

  function round2(n) {
    return Math.round((n + Number.EPSILON) * 100) / 100;
  }

  function getSmigApplicable(dateRef) {
    const s = getSettings();
    // Décret : 14 500 jusqu'au 31/12/2025, 21 500 à partir de janv. 2026
    if (dateRef && dateRef.getFullYear() >= 2026) return s.smigJour2026 || 21500;
    return s.smigJour || 14500;
  }

  function collectInputs() {
    const ids = [
      'direction', 'adresseBureau', 'lieuDocument', 'dateDocument', 'devise',
      'inspecteurNom', 'qualiteAgent', 'inspecteurGrade', 'entrepriseNom', 'entrepriseAdresse',
      'nom', 'fonction', 'categorie', 'dateEngagement', 'dateFin', 'motif', 'motifDetail',
      'lieuPrestation', 'salaireBase', 'logement', 'transport', 'joursPrestes',
      'joursOuvrables', 'preavisMode', 'preavisManuel', 'congeAcquis',
      'retenueCNSS', 'tauxCNSS', 'retenueIPR', 'tauxIPR', 'retenueONEM', 'tauxONEM',
      'retenueINPP', 'tauxINPP', 'autresRetenues', 'autresRetenuesLibelle',
      'observations', 'logementAuto'
    ];
    const data = {};
    ids.forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      if (el.type === 'checkbox') data[id] = el.checked;
      else data[id] = el.value;
    });
    data.photos = state.photos;
    data.signatureData = state.signatureData;
    data.geo = state.geo;
    data.numero = state.numero;
    return data;
  }

  /* -------------------------------------------------------
   *  RENDER RESULT PANEL
   * ----------------------------------------------------- */
  function renderResult(r) {
    $('#kpiJours').textContent = formatNumber(r.totalJours, 2) + ' jrs';
    $('#kpiBrut').textContent = formatMoney(r.totalBrut, r.devise);
    $('#kpiRetenues').textContent = formatMoney(r.totalRetenues, r.devise);
    $('#kpiNet').textContent = formatMoney(r.net, r.devise);
    $('#displayNumero').textContent = r.numero;

    const rows = [
      ['Préavis', r.preavisFormule, formatNumber(r.preavisJours, 2) + ' jrs'],
      ['Congé sur préavis', r.congePreavisFormule, formatNumber(r.congePreavisJours, 2) + ' jrs'],
      ['Congé compensatoire', r.congeCompFormule, formatNumber(r.congeCompJours, 2) + ' jrs'],
      ['Jours prestés', '—', formatNumber(r.joursPrestes, 0) + ' jrs'],
      ['Total jours', '', formatNumber(r.totalJours, 2) + ' jrs'],
      ['Salaire', `${formatNumber(r.salaireBase)} × ${formatNumber(r.totalJours, 2)}/${r.joursOuv}`, formatMoney(r.montSalaire, r.devise)],
      ['Logement', `${formatNumber(r.logement)} × ${formatNumber(r.totalJours, 2)}/${r.joursOuv}`, formatMoney(r.montLogement, r.devise)],
      ['Transport', `${formatNumber(r.transport)} × ${formatNumber(r.joursPrestes, 0)}/${r.joursOuv}`, formatMoney(r.montTransport, r.devise)]
    ];

    let html = `<table class="detail-table">
      <thead><tr><th>Élément</th><th>Formule</th><th>Montant</th></tr></thead><tbody>`;
    rows.forEach((row, i) => {
      const cls = i === 4 ? ' class="total"' : '';
      html += `<tr${cls}><td>${row[0]}</td><td>${row[1]}</td><td class="num">${row[2]}</td></tr>`;
    });
    html += `<tr class="total"><td>TOTAL BRUT</td><td></td><td class="num">${formatMoney(r.totalBrut, r.devise)}</td></tr>`;
    r.retenues.forEach(ret => {
      html += `<tr><td>− ${ret.label}</td><td>${ret.formule}</td><td class="num">${formatMoney(ret.montant, r.devise)}</td></tr>`;
    });
    html += `<tr class="total"><td>Total retenues</td><td></td><td class="num">${formatMoney(r.totalRetenues, r.devise)}</td></tr>`;
    html += `<tr class="net"><td>NET À PAYER</td><td></td><td class="num">${formatMoney(r.net, r.devise)}</td></tr>`;
    html += `</tbody></table>`;

    if (!r.smigOk) {
      html += `<div class="ai-item err" style="margin-top:12px">
        <i class="fa-solid fa-triangle-exclamation"></i>
        <div><strong>Alerte SMIG</strong>
        <p>Salaire de base (${formatMoney(r.salaireBase, r.devise)}) inférieur au SMIG de catégorie
        (~ ${formatNumber(r.smigMensuelCat, 0)} FC/mois · ${formatNumber(r.smigJour, 0)} FC/j × tension ${r.tension}).
        Appliquer le Décret n°25/22 du 30 mai 2025.</p></div></div>`;
    } else {
      html += `<div class="ai-item ok" style="margin-top:12px">
        <i class="fa-solid fa-circle-check"></i>
        <div><strong>SMIG respecté</strong>
        <p>Salaire conforme au palier en vigueur (${formatNumber(r.smigJour, 0)} FC/j manœuvre · cat. ×${r.tension}).</p></div></div>`;
    }

    $('#resultDetails').innerHTML = html;
  }

  /* -------------------------------------------------------
   *  RENDER OFFICIAL PREVIEW (A4)
   * ----------------------------------------------------- */
  function renderPreview(r) {
    const inp = r.inputs || collectInputs();
    const sym = r.symbole;

    $('#pvDirection').textContent = inp.direction || '—';
    $('#pvAdresse').textContent = inp.adresseBureau || '';
    const lieu = inp.lieuDocument || 'Kinshasa';
    const ddoc = inp.dateDocument ? formatDateLong(inp.dateDocument) : formatDateLong(new Date());
    $('#pvLieuDate').textContent = `${lieu}, le ${ddoc}`;
    $('#pvNumero').textContent = 'N° ' + r.numero;

    $('#pvNom').textContent = (inp.nom || '—').toUpperCase();
    $('#pvFonction').textContent = inp.fonction || '—';
    $('#pvCategorie').textContent = CATEGORIE_LABELS[r.categorie] || r.categorie;
    $('#pvDateEng').textContent = formatDateFR(r.dateEng);
    $('#pvDateFin').textContent = formatDateFR(r.dateFin);
    $('#pvAnciennete').textContent = r.anc.label;
    let motifTxt = MOTIF_LABELS[r.motif] || r.motif;
    if (inp.motifDetail) motifTxt += ' — ' + inp.motifDetail;
    $('#pvMotif').textContent = motifTxt;
    $('#pvEntreprise').textContent = inp.entrepriseNom || '—';
    $('#pvSalaireBase').textContent = formatMoney(r.salaireBase, r.devise);
    $('#pvLogement').textContent = formatMoney(r.logement, r.devise);
    $('#pvTransport').textContent = formatMoney(r.transport, r.devise);

    $('#pvPreavisFormule').textContent = ': ' + r.preavisFormule;
    $('#pvPreavisJours').textContent = '= ' + formatNumber(r.preavisJours, 2) + ' Jrs';
    $('#pvCongePreavisFormule').textContent = ': ' + r.congePreavisFormule;
    $('#pvCongePreavisJours').textContent = '= ' + formatNumber(r.congePreavisJours, 2) + ' Jr';
    $('#pvCongeCompFormule').textContent = ': ' + r.congeCompFormule;
    $('#pvCongeCompJours').textContent = '= ' + formatNumber(r.congeCompJours, 2) + ' Jrs';
    $('#pvJoursPrestes').textContent = '= ' + formatNumber(r.joursPrestes, 0) + ' jrs';
    $('#pvTotalJours').textContent = formatNumber(r.totalJours, 2) + ' Jrs';

    $('#pvCalcSalaireFormule').textContent = `: ${formatNumber(r.salaireBase)}${sym}×${formatNumber(r.totalJours, 2)}Jrs/${r.joursOuv}=`;
    $('#pvCalcSalaire').textContent = formatMoney(r.montSalaire, r.devise);
    $('#pvCalcLogFormule').textContent = `: ${formatNumber(r.logement)}${sym}×${formatNumber(r.totalJours, 2)}Jrs/${r.joursOuv}=`;
    $('#pvCalcLog').textContent = formatMoney(r.montLogement, r.devise);
    $('#pvCalcTransFormule').textContent = `: ${formatNumber(r.transport)}${sym}×${formatNumber(r.joursPrestes, 0)}Jrs/${r.joursOuv}=`;
    $('#pvCalcTrans').textContent = formatMoney(r.montTransport, r.devise);
    $('#pvTotalBrut').textContent = formatMoney(r.totalBrut, r.devise);

    const tbody = $('#pvRetenuesTable');
    tbody.innerHTML = '';
    r.retenues.forEach(ret => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="lab">- ${ret.label}</td>
        <td class="formula">${ret.formule}=</td>
        <td class="amount">${formatMoney(ret.montant, r.devise)}</td>`;
      tbody.appendChild(tr);
    });
    if (!r.retenues.length) {
      tbody.innerHTML = '<tr><td class="lab" colspan="3">Aucune retenue appliquée</td></tr>';
    }
    $('#pvTotalDeduction').textContent = formatMoney(r.totalRetenues, r.devise);
    $('#pvNet').textContent = `${formatMoney(r.totalBrut, r.devise)} − ${formatMoney(r.totalRetenues, r.devise)} = ${formatMoney(r.net, r.devise)}`;

    // Observations
    if (inp.observations) {
      $('#pvObsBlock').classList.remove('hidden');
      $('#pvObservations').textContent = inp.observations;
    } else {
      $('#pvObsBlock').classList.add('hidden');
    }

    // Geo
    if (state.geo) {
      $('#pvGeoBlock').classList.remove('hidden');
      $('#pvGeo').textContent = state.geo.label;
    } else {
      $('#pvGeoBlock').classList.add('hidden');
    }

    $('#pvInspecteur').textContent = (inp.inspecteurNom || '—').toUpperCase();
    $('#pvGrade').textContent = inp.inspecteurGrade || '';
    const titreAgent = inp.qualiteAgent || "INSPECTEUR DU TRAVAIL";

$('#pvQualiteAgent').textContent =
  titreAgent === "CONTRÔLEUR DU TRAVAIL"
    ? "LE CONTRÔLEUR DU TRAVAIL"
    : "L'INSPECTEUR DU TRAVAIL";

    // Signature
    const sig = $('#pvSignature');
    if (state.signatureData) {
      sig.src = state.signatureData;
      sig.classList.remove('hidden');
    } else {
      sig.classList.add('hidden');
    }

    // Photos
    if (state.photos.travailleur) {
      $('#dfPhotoTrav').classList.remove('hidden');
      $('#dfImgTrav').src = state.photos.travailleur;
    } else $('#dfPhotoTrav').classList.add('hidden');
    if (state.photos.entreprise) {
      $('#dfPhotoEnt').classList.remove('hidden');
      $('#dfImgEnt').src = state.photos.entreprise;
    } else $('#dfPhotoEnt').classList.add('hidden');

    $('#pvLegalRefs').textContent =
      'Réf. : Code du Travail Loi n°015/2002 modifiée par Loi n°016/010 · Décret n°25/22 du 30 mai 2025 (SMIG) · Art. 63, 71, 87, 141-150';
  }

  /* -------------------------------------------------------
   *  PROCÈS-VERBAL
   * ----------------------------------------------------- */
  function renderPV(r) {
    const inp = r.inputs || collectInputs();
    const lieu = inp.lieuDocument || 'Kinshasa';
    const ddoc = inp.dateDocument ? formatDateLong(inp.dateDocument) : formatDateLong(new Date());
    $('#pv2Direction').textContent = inp.direction || '—';
    $('#pv2LieuDate').textContent = `${lieu}, le ${ddoc}`;
    const pvNum = r.numero.replace('DF-', 'PV-');
    $('#pv2Numero').textContent = pvNum;
    $('#pv2Inspecteur').textContent = (inp.inspecteurNom || '—').toUpperCase();
    $('#pv2Grade').textContent = inp.inspecteurGrade || '';
    $('#pv2QualiteAgent').textContent =
    inp.qualiteAgent || "INSPECTEUR DU TRAVAIL";
    if (state.signatureData) {
      $('#pv2Signature').src = state.signatureData;
      $('#pv2Signature').classList.remove('hidden');
    }

    const motif = MOTIF_LABELS[r.motif] || r.motif;
    const html = `
      <p>L'an deux mille ${numberToFrench(new Date().getFullYear() % 1000 || new Date().getFullYear())},
      le ${ddoc}, nous, <strong>${inp.inspecteurNom || '………………'}</strong>,
      ${inp.inspecteurGrade || 'Inspecteur du Travail'},
      agissant en vertu des pouvoirs qui nous sont conférés par le Code du Travail
      (Loi n°015/2002 du 16 octobre 2002, telle que modifiée et complétée par la Loi n°016/010 du 15 juillet 2016),</p>

      <h3>I. Objet</h3>
      <p>Avons procédé au calcul et à l'établissement du <strong>Décompte Final n° ${r.numero}</strong>
      en faveur de :</p>
      <p>
        <strong>Nom :</strong> ${(inp.nom || '—').toUpperCase()}<br/>
        <strong>Fonction :</strong> ${inp.fonction || '—'}<br/>
        <strong>Catégorie :</strong> ${CATEGORIE_LABELS[r.categorie] || ''}<br/>
        <strong>Employeur :</strong> ${inp.entrepriseNom || '—'} — ${inp.entrepriseAdresse || ''}<br/>
        <strong>Lieu de prestation :</strong> ${inp.lieuPrestation || lieu}
      </p>

      <h3>II. Constats</h3>
      <p>Il ressort des éléments du dossier et des déclarations recueillies que le travailleur a été engagé
      le <strong>${formatDateFR(r.dateEng)}</strong> et que la relation de travail a pris fin le
      <strong>${formatDateFR(r.dateFin)}</strong>, soit une ancienneté de <strong>${r.anc.label}</strong>,
      pour motif de <strong>${motif}${inp.motifDetail ? ' (' + inp.motifDetail + ')' : ''}</strong>.</p>
      <p>Le salaire de base déclaré s'élève à <strong>${formatMoney(r.salaireBase, r.devise)}</strong>
      ${r.smigOk
        ? ', conforme au Salaire Minimum Interprofessionnel Garanti en vigueur (Décret n°25/22 du 30 mai 2025).'
        : ', <strong style="color:#a11">inférieur au SMIG applicable</strong> — le calcul tient compte de cette non-conformité pour information de l\'autorité compétente.'}</p>

      <h3>III. Éléments du décompte</h3>
      <p>
        Préavis : <strong>${formatNumber(r.preavisJours, 2)} jours</strong> (${r.preavisFormule})<br/>
        Congé sur préavis : <strong>${formatNumber(r.congePreavisJours, 2)} jours</strong><br/>
        Congé compensatoire : <strong>${formatNumber(r.congeCompJours, 2)} jours</strong><br/>
        Jours prestés : <strong>${formatNumber(r.joursPrestes, 0)} jours</strong><br/>
        <strong>Total jours indemnisés : ${formatNumber(r.totalJours, 2)} jours</strong>
      </p>
      <p>
        Total Brut : <strong>${formatMoney(r.totalBrut, r.devise)}</strong><br/>
        Total Retenues : <strong>${formatMoney(r.totalRetenues, r.devise)}</strong><br/>
        <strong>Net à payer : ${formatMoney(r.net, r.devise)}</strong>
      </p>

      <h3>IV. Fondement juridique</h3>
      <p>Le présent décompte est établi conformément aux articles 61 à 78 (rupture), 63 et 71 (préavis),
      87 (SMIG), 141 à 150 (congés) du Code du Travail, ainsi qu'au Décret n°25/22 du 30 mai 2025
      portant fixation du SMIG, des allocations familiales minima et de la contre-valeur du logement.</p>

      ${inp.observations ? `<h3>V. Observations</h3><p>${escapeHtml(inp.observations)}</p>` : ''}

      ${state.geo ? `<p><em>Géolocalisation de l'inspection : ${escapeHtml(state.geo.label)}</em></p>` : ''}

      <p>Dont procès-verbal dressé les jour, mois et an que dessus pour servir et valoir ce que de droit.</p>
    `;
    $('#pvContent').innerHTML = html;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function numberToFrench(n) {
    // simple helper for year wording — returns the year number as-is for clarity
    return String(new Date().getFullYear()).replace(/^20/, 'vingt ');
  }

  /* -------------------------------------------------------
   *  AI ASSISTANT
   * ----------------------------------------------------- */
  function runAI(r, silent) {
    if (!r) {
      if (!silent) toast('Calculez d\'abord un décompte.', 'error');
      return;
    }
    const alerts = [];
    const recos = [];
    const report = [];

    // 1. Calcul cohérence
    const checkNet = round2(r.totalBrut - r.totalRetenues);
    if (Math.abs(checkNet - r.net) < 0.02) {
      report.push({ type: 'ok', title: 'Cohérence des calculs', text: 'Brut − Retenues = Net vérifié avec succès.' });
    } else {
      alerts.push({ type: 'err', title: 'Erreur de calcul', text: 'Incohérence détectée entre brut, retenues et net.' });
    }

    // 2. SMIG
    if (!r.smigOk) {
      alerts.push({
        type: 'err',
        title: 'Salaire inférieur au SMIG',
        text: `Le salaire (${formatMoney(r.salaireBase, r.devise)}) est sous le SMIG de catégorie (~${formatNumber(r.smigMensuelCat, 0)} FC/mois). Exiger la régularisation (Décret 25/22).`
      });
      recos.push('Recalculer le décompte en relevant le salaire au SMIG applicable avant validation.');
    } else {
      report.push({ type: 'ok', title: 'SMIG conforme', text: `Salaire ≥ SMIG catégorie (tension ×${r.tension}, base ${formatNumber(r.smigJour, 0)} FC/j).` });
    }

    // 3. Préavis
    if (r.motif === 'licenciement' || r.motif === 'incapacite') {
      if (r.preavisJours <= 0) {
        alerts.push({ type: 'err', title: 'Préavis manquant', text: 'Licenciement sans indemnité de préavis — le décompte sera très défavorable au travailleur (art. 71).' });
        recos.push('Vérifier si un préavis a été effectué ; à défaut, l\'indemnité compensatrice est due.');
      } else {
        report.push({ type: 'ok', title: 'Préavis calculé', text: `${formatNumber(r.preavisJours, 2)} jours selon catégorie « ${r.rule.label} ».` });
      }
    }
    if (r.motif === 'demission') {
      report.push({ type: 'info', title: 'Démission — demi-préavis', text: 'En cas de démission volontaire, le préavis est réduit de moitié.' });
    }
    if (r.motif === 'faute_lourde') {
      alerts.push({ type: 'warn', title: 'Faute lourde invoquée', text: 'Le préavis n\'est pas dû, mais la faute lourde doit être prouvée et notifiée conformément au Code du Travail.' });
      recos.push('Joindre la notification de licenciement et les preuves de la faute lourde au dossier.');
    }

    // 4. Ancienneté
    if (r.anc.totalDays < 1) {
      alerts.push({ type: 'warn', title: 'Ancienneté nulle ou invalide', text: 'Vérifier les dates d\'engagement et de fin de service.' });
    } else {
      report.push({ type: 'ok', title: 'Ancienneté', text: r.anc.label + ` (${r.anc.totalDays} jours calendaires).` });
    }

    // 5. Congés
    if (r.congeCompJours <= 0 && r.moisAnciennete >= 1) {
      alerts.push({ type: 'warn', title: 'Congé compensatoire absent', text: 'Aucun jour de congé compensatoire alors que l\'ancienneté le justifie.' });
      recos.push('Vérifier les congés déjà pris et recalculer l\'indemnité compensatrice (art. 148).');
    } else if (r.congeCompJours > 0) {
      report.push({ type: 'ok', title: 'Congé compensatoire', text: `${formatNumber(r.congeCompJours, 2)} jours inclus.` });
    }

    // 6. Logement
    if (r.logement < r.salaireBase * 0.29 && r.salaireBase > 0) {
      alerts.push({ type: 'warn', title: 'Logement < 30 %', text: 'L\'indemnité de logement est inférieure à 30 % du salaire de base (contre-valeur légale).' });
      recos.push('Activer le calcul automatique du logement à 30 % sauf justification contraire.');
    } else {
      report.push({ type: 'ok', title: 'Logement', text: 'Indemnité de logement prise en compte.' });
    }

    // 7. Transport
    if (r.transport <= 0) {
      recos.push('Le transport est fixé par édit provincial — vérifier le barème local et l\'ajouter si dû.');
    }

    // 8. Retenues
    if (!$('#retenueCNSS').checked && !$('#retenueIPR').checked) {
      report.push({ type: 'info', title: 'Sans retenues CNSS/IPR', text: 'Aucune retenue sociale/fiscale activée — à confirmer selon le statut du travailleur.' });
    }

    // 9. Net faible
    if (r.net < r.salaireBase * 0.5 && r.totalJours > 10) {
      alerts.push({ type: 'warn', title: 'Net à payer faible', text: 'Le net est nettement inférieur à un demi-salaire mensuel malgré un volume de jours significatif.' });
    }

    // 10. Signature
    if (!state.signatureData) {
      recos.push('Apposer la signature numérique tactile avant impression et archivage.');
    }

    // 11. Direction
    recos.push('Mentionner les articles 63, 71, 87 et 141-150 du Code du Travail sur le document remis aux parties.');

    // Render
    $('#aiReport').innerHTML = report.length
      ? report.map(renderAIItem).join('')
      : '<p class="muted">Aucun point de rapport.</p>';
    $('#aiReco').innerHTML = recos.length
      ? recos.map(t => `<div class="ai-item info"><i class="fa-solid fa-lightbulb"></i><div><p>${t}</p></div></div>`).join('')
      : '<p class="muted">Aucune recommandation.</p>';
    $('#aiAlerts').innerHTML = alerts.length
      ? alerts.map(renderAIItem).join('')
      : '<div class="ai-item ok"><i class="fa-solid fa-shield-halved"></i><div><strong>Aucune alerte critique</strong><p>Le dossier semble régulier.</p></div></div>';

    // Inline AI on calculator
    const inline = alerts.slice(0, 2).map(renderAIItem).join('') +
      (recos[0] ? `<div class="ai-item info"><i class="fa-solid fa-robot"></i><div><strong>IA</strong><p>${recos[0]}</p></div></div>` : '');
    $('#aiInline').innerHTML = inline;

    if (!silent) toast('Analyse IA terminée — ' + alerts.length + ' alerte(s), ' + recos.length + ' recommandation(s).', 'success');
  }

  function renderAIItem(item) {
    const icons = { ok: 'fa-circle-check', warn: 'fa-triangle-exclamation', err: 'fa-circle-xmark', info: 'fa-circle-info' };
    return `<div class="ai-item ${item.type}">
      <i class="fa-solid ${icons[item.type] || icons.info}"></i>
      <div><strong>${item.title}</strong><p>${item.text}</p></div>
    </div>`;
  }

  /* -------------------------------------------------------
   *  CHARTS
   * ----------------------------------------------------- */
  function updateCharts(r) {
    if (typeof Chart === 'undefined') return;

    const gold = '#C9A227';
    const blue = '#0B3D91';
    const blueL = '#1a5fd4';
    const colors = [blue, gold, '#059669', '#d97706', '#7c3aed', '#dc2626'];

    // Retenues pie
    destroyChart('retenues');
    const retLabels = r.retenues.map(x => x.label);
    const retData = r.retenues.map(x => x.montant);
    if (!retData.length) { retLabels.push('Aucune'); retData.push(1); }
    state.charts.retenues = new Chart($('#chartRetenues'), {
      type: 'doughnut',
      data: {
        labels: retLabels,
        datasets: [{
          data: retData,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { font: { family: 'Inter', size: 11 } } },
          title: { display: true, text: 'Retenues (' + formatMoney(r.totalRetenues, r.devise) + ')', color: blue }
        }
      }
    });

    // Salaire composition bar
    destroyChart('salaire');
    state.charts.salaire = new Chart($('#chartSalaire'), {
      type: 'bar',
      data: {
        labels: ['Salaire', 'Logement', 'Transport', 'Brut', 'Retenues', 'Net'],
        datasets: [{
          label: r.symbole,
          data: [r.montSalaire, r.montLogement, r.montTransport, r.totalBrut, r.totalRetenues, r.net],
          backgroundColor: [blue, blueL, gold, '#334155', '#dc2626', '#059669'],
          borderRadius: 8
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Composition du salaire', color: blue }
        },
        scales: {
          y: { beginAtZero: true, ticks: { callback: v => formatNumber(v, 0) } }
        }
      }
    });

    // Jours
    destroyChart('jours');
    state.charts.jours = new Chart($('#chartJours'), {
      type: 'bar',
      data: {
        labels: ['Préavis', 'Congé/préavis', 'Congé compensatoire', 'Jours prestés'],
        datasets: [{
          label: 'Jours',
          data: [r.preavisJours, r.congePreavisJours, r.congeCompJours, r.joursPrestes],
          backgroundColor: [blue, blueL, gold, '#059669'],
          borderRadius: 8
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          title: { display: true, text: 'Répartition des jours indemnisés (total ' + formatNumber(r.totalJours, 2) + ')', color: blue }
        },
        scales: { x: { beginAtZero: true } }
      }
    });
  }

  function destroyChart(key) {
    if (state.charts[key]) {
      state.charts[key].destroy();
      state.charts[key] = null;
    }
  }

  /* -------------------------------------------------------
   *  LEGAL + CHECKLIST
   * ----------------------------------------------------- */
  function renderLegal() {
    $('#legalGrid').innerHTML = LEGAL_REFS.map(ref => `
      <article class="legal-card">
        <span class="art">${ref.art}</span>
        <h4>${ref.titre}</h4>
        <p>${ref.texte}</p>
      </article>
    `).join('');
  }

  function renderChecklist() {
    const body = $('#checklistBody');
    body.innerHTML = CHECKLIST_ITEMS.map(item => {
      const checked = state.checklist[item.id] ? 'checked' : '';
      const done = state.checklist[item.id] ? 'done' : '';
      return `<div class="check-item ${done}">
        <input type="checkbox" id="${item.id}" ${checked} data-check="${item.id}" />
        <label for="${item.id}"><strong>${item.label}</strong><span>${item.desc}</span></label>
      </div>`;
    }).join('');
    body.querySelectorAll('[data-check]').forEach(cb => {
      cb.addEventListener('change', () => {
        state.checklist[cb.dataset.check] = cb.checked;
        cb.closest('.check-item').classList.toggle('done', cb.checked);
        updateChecklistScore();
      });
    });
    updateChecklistScore();
  }

  function updateChecklistScore() {
    const total = CHECKLIST_ITEMS.length;
    const done = CHECKLIST_ITEMS.filter(i => state.checklist[i.id]).length;
    $('#checklistScore').textContent = `${done} / ${total}`;
  }

  function updateChecklistAuto(r) {
    const auto = {
      c1: !!(r.inputs.nom && r.inputs.fonction && r.inputs.categorie),
      c2: !!(r.dateEng && r.dateFin && r.dateFin >= r.dateEng),
      c3: !!r.motif,
      c4: r.smigOk,
      c5: r.preavisJours > 0 || r.motif === 'faute_lourde' || r.motif === 'fin_contrat' || r.motif === 'demission',
      c6: r.congeCompJours > 0 || r.moisAnciennete < 1,
      c7: r.logement > 0,
      c8: true,
      c9: Math.abs(r.totalBrut - r.totalRetenues - r.net) < 0.05,
      c10: !!state.signatureData,
      c11: !!r.inputs.direction,
      c12: r.net > 0
    };
    Object.assign(state.checklist, auto);
    renderChecklist();
  }

  /* -------------------------------------------------------
   *  ARCHIVE / FAVORITES / HISTORY
   * ----------------------------------------------------- */
  function saveToArchive(favorite) {
    if (!state.lastResult) {
      toast('Calculez d\'abord le décompte.', 'error');
      return;
    }
    const store = loadStore();
    const entry = {
      id: state.lastResult.numero,
      savedAt: new Date().toISOString(),
      favorite: !!favorite,
      result: {
        numero: state.lastResult.numero,
        net: state.lastResult.net,
        brut: state.lastResult.totalBrut,
        devise: state.lastResult.devise,
        nom: state.lastResult.inputs.nom,
        fonction: state.lastResult.inputs.fonction,
        entreprise: state.lastResult.inputs.entrepriseNom,
        direction: state.lastResult.inputs.direction,
        motif: state.lastResult.motif,
        totalJours: state.lastResult.totalJours
      },
      snapshot: collectInputs(),
      calc: {
        preavisJours: state.lastResult.preavisJours,
        congeCompJours: state.lastResult.congeCompJours,
        totalJours: state.lastResult.totalJours,
        montSalaire: state.lastResult.montSalaire,
        montLogement: state.lastResult.montLogement,
        montTransport: state.lastResult.montTransport,
        totalBrut: state.lastResult.totalBrut,
        totalRetenues: state.lastResult.totalRetenues,
        net: state.lastResult.net,
        retenues: state.lastResult.retenues
      }
    };
    // upsert
    const idx = store.archives.findIndex(a => a.id === entry.id);
    if (idx >= 0) store.archives[idx] = entry;
    else store.archives.unshift(entry);
    if (favorite) {
      if (!store.favorites.includes(entry.id)) store.favorites.push(entry.id);
      entry.favorite = true;
    }
    saveStore(store);
    toast(favorite ? 'Ajouté aux favoris & archives' : 'Décompte archivé avec succès', 'success');
    renderArchive();
  }

  function renderArchive(filter = '') {
    const store = loadStore();
    const q = (filter || '').toLowerCase();
    let list = store.archives || [];
    if (q) {
      list = list.filter(a =>
        (a.result.nom || '').toLowerCase().includes(q) ||
        (a.id || '').toLowerCase().includes(q) ||
        (a.result.entreprise || '').toLowerCase().includes(q)
      );
    }
    const el = $('#archiveList');
    if (!list.length) {
      el.innerHTML = '<p class="muted center" style="padding:40px">Aucun décompte archivé pour le moment.</p>';
      return;
    }
    el.innerHTML = list.map(a => {
      const d = new Date(a.savedAt).toLocaleString('fr-FR');
      const star = a.favorite || (store.favorites || []).includes(a.id)
        ? '<i class="fa-solid fa-star fav-star"></i>' : '';
      return `<div class="archive-item" data-id="${a.id}">
        <div>
          <h4>${star} ${a.result.nom || 'Sans nom'} <small style="color:var(--gray-500);font-weight:500">· ${a.id}</small></h4>
          <div class="meta">
            <span><i class="fa-solid fa-briefcase"></i> ${a.result.fonction || '—'}</span>
            <span><i class="fa-solid fa-building"></i> ${a.result.entreprise || '—'}</span>
            <span><i class="fa-solid fa-coins"></i> ${formatMoney(a.result.net, a.result.devise)}</span>
            <span><i class="fa-solid fa-clock"></i> ${d}</span>
          </div>
        </div>
        <div class="archive-actions">
          <button class="icon-btn" data-load="${a.id}" title="Recharger"><i class="fa-solid fa-folder-open"></i></button>
          <button class="icon-btn" data-fav="${a.id}" title="Favori"><i class="fa-solid fa-star"></i></button>
          <button class="icon-btn" data-del="${a.id}" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>`;
    }).join('');

    el.querySelectorAll('[data-load]').forEach(btn => btn.addEventListener('click', () => loadArchive(btn.dataset.load)));
    el.querySelectorAll('[data-fav]').forEach(btn => btn.addEventListener('click', () => toggleFavorite(btn.dataset.fav)));
    el.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => deleteArchive(btn.dataset.del)));
  }

  function loadArchive(id) {
    const store = loadStore();
    const entry = store.archives.find(a => a.id === id);
    if (!entry) return;
    const snap = entry.snapshot || {};
    Object.keys(snap).forEach(k => {
      if (k === 'photos' || k === 'signatureData' || k === 'geo' || k === 'numero') return;
      const el = $('#' + k);
      if (!el) return;
      if (el.type === 'checkbox') el.checked = !!snap[k];
      else el.value = snap[k] ?? '';
    });
    state.numero = snap.numero || entry.id;
    state.photos = snap.photos || { travailleur: null, entreprise: null };
    state.signatureData = snap.signatureData || null;
    state.geo = snap.geo || null;
    if (state.photos.travailleur) {
      $('#photoTravailleurPreview').src = state.photos.travailleur;
      $('#photoTravailleurPreview').classList.remove('hidden');
    }
    if (state.photos.entreprise) {
      $('#photoEntreprisePreview').src = state.photos.entreprise;
      $('#photoEntreprisePreview').classList.remove('hidden');
    }
    if (state.signatureData) {
      // restore signature image on canvas
      const canvas = $('#signaturePad');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); };
      img.src = state.signatureData;
    }
    if (state.geo) $('#geoDisplay').value = state.geo.label;
    $('#displayNumero').textContent = state.numero;
    updateAnciennete();
    updateDeviseAffixes();
    calculate();
    switchView('calculator');
    toast('Décompte ' + id + ' rechargé', 'success');
  }

  function toggleFavorite(id) {
    const store = loadStore();
    const i = store.favorites.indexOf(id);
    if (i >= 0) store.favorites.splice(i, 1);
    else store.favorites.push(id);
    store.archives.forEach(a => { if (a.id === id) a.favorite = store.favorites.includes(id); });
    saveStore(store);
    renderArchive($('#archiveSearch').value);
    toast('Favoris mis à jour', 'success');
  }

  function deleteArchive(id) {
    if (!confirm('Supprimer ce décompte des archives ?')) return;
    const store = loadStore();
    store.archives = store.archives.filter(a => a.id !== id);
    store.favorites = (store.favorites || []).filter(f => f !== id);
    saveStore(store);
    renderArchive($('#archiveSearch').value);
    toast('Supprimé', 'success');
  }

  function showFavoritesModal() {
    const store = loadStore();
    const favs = store.archives.filter(a => a.favorite || (store.favorites || []).includes(a.id));
    $('#modalTitle').textContent = '⭐ Favoris';
    if (!favs.length) {
      $('#modalBody').innerHTML = '<p class="muted">Aucun favori pour le moment. Archivez un décompte en favori depuis le panneau résultat.</p>';
    } else {
      $('#modalBody').innerHTML = favs.map(a => `
        <div class="archive-item" style="margin-bottom:8px">
          <div>
            <h4>${a.result.nom} · ${a.id}</h4>
            <div class="meta"><span>${formatMoney(a.result.net, a.result.devise)}</span></div>
          </div>
          <button class="btn-primary btn-sm" data-load-fav="${a.id}">Ouvrir</button>
        </div>
      `).join('');
      $$('[data-load-fav]').forEach(b => b.addEventListener('click', () => {
        closeModal(); loadArchive(b.dataset.loadFav);
      }));
    }
    openModal();
  }

  function showHistoryModal() {
    const store = loadStore();
    const list = (store.archives || []).slice(0, 20);
    $('#modalTitle').textContent = '📚 Historique récent';
    if (!list.length) {
      $('#modalBody').innerHTML = '<p class="muted">Aucun historique.</p>';
    } else {
      $('#modalBody').innerHTML = list.map(a => `
        <div class="archive-item" style="margin-bottom:8px">
          <div>
            <h4>${a.result.nom || '—'} · ${a.id}</h4>
            <div class="meta">
              <span>${new Date(a.savedAt).toLocaleString('fr-FR')}</span>
              <span>${formatMoney(a.result.net, a.result.devise)}</span>
            </div>
          </div>
          <button class="btn-ghost btn-sm" data-load-hist="${a.id}">Ouvrir</button>
        </div>
      `).join('');
      $$('[data-load-hist]').forEach(b => b.addEventListener('click', () => {
        closeModal(); loadArchive(b.dataset.loadHist);
      }));
    }
    openModal();
  }

  function openModal() { $('#modal').classList.remove('hidden'); }
  function closeModal() { $('#modal').classList.add('hidden'); }

  /* -------------------------------------------------------
   *  PDF / PRINT / SHARE
   * ----------------------------------------------------- */
  function downloadPDF(elementId, filename) {
    const el = $('#' + elementId);
    if (!el) return;
    if (typeof html2pdf === 'undefined') {
      toast('Module PDF non chargé — utilisez Imprimer > PDF', 'error');
      window.print();
      return;
    }
    toast('Génération du PDF…');
    const opt = {
      margin: [8, 8, 8, 8],
      filename: filename || (state.numero || 'decompte') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };
    // ensure preview is rendered
    if (state.lastResult) {
      if (elementId === 'decompteSheet') renderPreview(state.lastResult);
      if (elementId === 'pvSheet') renderPV(state.lastResult);
    }
    html2pdf().set(opt).from(el).save().then(() => {
      toast('PDF téléchargé', 'success');
    }).catch(() => {
      toast('Erreur PDF — essayez Imprimer', 'error');
    });
  }

  function printSheet(viewName) {
    if (viewName) switchView(viewName);
    setTimeout(() => window.print(), 200);
  }

  function shareWhatsApp() {
    if (!state.lastResult) { toast('Calculez d\'abord.', 'error'); return; }
    const r = state.lastResult;
    const text = encodeURIComponent(
      `*Décompte Final ${r.numero}*\n` +
      `Travailleur : ${(r.inputs.nom || '').toUpperCase()}\n` +
      `Fonction : ${r.inputs.fonction || ''}\n` +
      `Total Brut : ${formatMoney(r.totalBrut, r.devise)}\n` +
      `Retenues : ${formatMoney(r.totalRetenues, r.devise)}\n` +
      `*Net à payer : ${formatMoney(r.net, r.devise)}*\n` +
      `IGT — ${r.inputs.direction || ''}`
    );
    window.open('https://wa.me/?text=' + text, '_blank');
  }

  function shareEmail() {
    if (!state.lastResult) { toast('Calculez d\'abord.', 'error'); return; }
    const r = state.lastResult;
    const subject = encodeURIComponent(`Décompte Final ${r.numero} — ${(r.inputs.nom || '').toUpperCase()}`);
    const body = encodeURIComponent(
      `Bonjour,\n\nVeuillez trouver les éléments du décompte final ${r.numero} :\n\n` +
      `Travailleur : ${(r.inputs.nom || '').toUpperCase()}\n` +
      `Fonction : ${r.inputs.fonction || ''}\n` +
      `Entreprise : ${r.inputs.entrepriseNom || ''}\n` +
      `Total Brut : ${formatMoney(r.totalBrut, r.devise)}\n` +
      `Total Retenues : ${formatMoney(r.totalRetenues, r.devise)}\n` +
      `Net à payer : ${formatMoney(r.net, r.devise)}\n\n` +
      `Direction : ${r.inputs.direction || ''}\n` +
      `Inspecteur : ${r.inputs.inspecteurNom || ''}\n\n` +
      `— InspecteurBot / Inspection Générale du Travail`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  /* -------------------------------------------------------
   *  SIGNATURE PAD
   * ----------------------------------------------------- */
  function initSignature() {
    const canvas = $('#signaturePad');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let last = null;

    function pos(e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const src = e.touches ? e.touches[0] : e;
      return {
        x: (src.clientX - rect.left) * scaleX,
        y: (src.clientY - rect.top) * scaleY
      };
    }

    function start(e) {
      e.preventDefault();
      drawing = true;
      last = pos(e);
    }
    function move(e) {
      if (!drawing) return;
      e.preventDefault();
      const p = pos(e);
      ctx.strokeStyle = '#0B3D91';
      ctx.lineWidth = 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
    }
    function end() {
      if (!drawing) return;
      drawing = false;
      state.signatureData = canvas.toDataURL('image/png');
    }

    canvas.addEventListener('mousedown', start);
    canvas.addEventListener('mousemove', move);
    window.addEventListener('mouseup', end);
    canvas.addEventListener('touchstart', start, { passive: false });
    canvas.addEventListener('touchmove', move, { passive: false });
    canvas.addEventListener('touchend', end);

    $('#btnClearSig').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      state.signatureData = null;
    });
  }

  /* -------------------------------------------------------
   *  GEOLOCATION
   * ----------------------------------------------------- */
  function captureGeo() {
    if (!navigator.geolocation) {
      toast('Géolocalisation non supportée', 'error');
      return;
    }
    $('#btnGeo').disabled = true;
    toast('Capture de la position…');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        state.geo = {
          lat: latitude,
          lng: longitude,
          accuracy,
          label: `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (±${Math.round(accuracy)} m)`
        };
        $('#geoDisplay').value = state.geo.label;
        $('#btnGeo').disabled = false;
        toast('Position capturée', 'success');
      },
      (err) => {
        $('#btnGeo').disabled = false;
        toast('Géo refusée ou indisponible : ' + err.message, 'error');
      },
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }

  /* -------------------------------------------------------
   *  PHOTOS
   * ----------------------------------------------------- */
  function bindPhoto(inputId, previewId, key) {
    $('#' + inputId).addEventListener('change', (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        state.photos[key] = reader.result;
        const img = $('#' + previewId);
        img.src = reader.result;
        img.classList.remove('hidden');
      };
      reader.readAsDataURL(file);
    });
  }

  /* -------------------------------------------------------
   *  UI HELPERS
   * ----------------------------------------------------- */
  function switchView(name) {
    $$('.view').forEach(v => v.classList.remove('active'));
    $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.view === name));
    const view = $('#view-' + name);
    if (view) view.classList.add('active');
    $('#sidebar').classList.remove('open');
    if (name === 'charts' && state.lastResult) updateCharts(state.lastResult);
    if (name === 'ai' && state.lastResult) runAI(state.lastResult, true);
    if (name === 'archive') renderArchive();
    if (name === 'preview' && state.lastResult) renderPreview(state.lastResult);
    if (name === 'pv' && state.lastResult) renderPV(state.lastResult);
  }

  function updateAnciennete() {
    const a = parseDate($('#dateEngagement').value);
    const b = parseDate($('#dateFin').value);
    const anc = computeAnciennete(a, b);
    $('#ancienneteDisplay').textContent = anc.label;
  }

  function updateDeviseAffixes() {
    const sym = deviseSymbol();
    ['affixDevise', 'affixLogement', 'affixTransport', 'affixAutres'].forEach(id => {
      const el = $('#' + id);
      if (el) el.textContent = sym;
    });
  }

  function fillExample() {
    // Exemple du modèle scanné (KONGO SPINCER) adapté
    $('#nom').value = 'KONGO SPINCER';
    $('#fonction').value = 'Chauffeur';
    $('#categorie').value = 'manoeuvre';
    $('#dateEngagement').value = '2025-12-09';
    $('#dateFin').value = '2026-06-09';
    $('#motif').value = 'incapacite';
    $('#motifDetail').value = 'Pour Incapacité Professionnelle';
    $('#salaireBase').value = '140';
    $('#devise').value = 'USD';
    $('#logementAuto').checked = false;
    $('#logement').value = '42';
    $('#transport').value = '75';
    $('#joursPrestes').value = '7';
    $('#joursOuvrables').value = '26';
    $('#preavisMode').value = 'auto';
    $('#retenueCNSS').checked = true;
    $('#tauxCNSS').value = '5';
    $('#retenueIPR').checked = true;
    $('#tauxIPR').value = '10';
    $('#retenueONEM').checked = false;
    $('#retenueINPP').checked = false;
    $('#inspecteurNom').value = 'SENDA PADINGANI Elisha';
    $('#qualiteAgent').value = 'INSPECTEUR DU TRAVAIL';
    $('#inspecteurGrade').value = 'Officier de Police Judiciaire · Chef de Bureau';
    $('#entrepriseNom').value = 'Entreprise Exemple SARL';
    $('#entrepriseAdresse').value = 'Kinshasa / Limete';
    $('#lieuPrestation').value = 'Kinshasa';
    $('#direction').value = 'Direction Provinciale de Kinshasa';
    $('#observations').value = 'Décompte établi suite à inspection sur place. Documents consultés : contrat, fiche de paie, lettre de licenciement.';
    updateAnciennete();
    updateDeviseAffixes();
    calculate();
    toast('Exemple chargé (modèle officiel)', 'success');
  }

  function newDocument() {
    if (state.lastResult && !confirm('Créer un nouveau décompte ? Les données non archivées seront perdues.')) return;
    state.numero = nextNumero();
    state.lastResult = null;
    state.photos = { travailleur: null, entreprise: null };
    state.signatureData = null;
    state.geo = null;
    state.checklist = {};
    // reset form fields (keep settings-related)
    ['nom', 'fonction', 'motifDetail', 'lieuPrestation', 'salaireBase', 'logement', 'transport',
      'entrepriseNom', 'entrepriseAdresse', 'observations', 'autresRetenuesLibelle', 'geoDisplay'].forEach(id => {
      const el = $('#' + id); if (el) el.value = '';
    });
    $('#joursPrestes').value = '0';
    $('#preavisManuel').value = '0';
    $('#congeAcquis').value = '0';
    $('#autresRetenues').value = '0';
    $('#dateEngagement').value = '';
    $('#dateFin').value = '';
    $('#logementAuto').checked = true;
    $('#photoTravailleurPreview').classList.add('hidden');
    $('#photoEntreprisePreview').classList.add('hidden');
    const canvas = $('#signaturePad');
    if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    $('#displayNumero').textContent = state.numero;
    $('#ancienneteDisplay').textContent = '—';
    $('#resultDetails').innerHTML = '<p class="muted center">Saisissez les données et cliquez sur <strong>Calculer</strong>.</p>';
    $('#kpiJours').textContent = '0';
    $('#kpiBrut').textContent = '0';
    $('#kpiRetenues').textContent = '0';
    $('#kpiNet').textContent = '0';
    $('#aiInline').innerHTML = '';
    renderChecklist();
    switchView('calculator');
    toast('Nouveau décompte ' + state.numero, 'success');
  }

  function loadSettingsUI() {
    const s = getSettings();
    $('#smigJour').value = s.smigJour;
    $('#smigJour2026').value = s.smigJour2026;
    $('#tauxChange').value = s.tauxChange;
    $('#joursCongesAn').value = s.joursCongesAn;
    $('#defaultInspecteur').value = s.defaultInspecteur || '';
    $('#defaultGrade').value = s.defaultGrade || '';
    $('#autoCalc').checked = s.autoCalc !== false;
    $('#smigDisplay').textContent = formatNumber(s.smigJour, 0) + ' FC/j';
    if (s.defaultInspecteur && !$('#inspecteurNom').value) $('#inspecteurNom').value = s.defaultInspecteur;
    if (s.defaultGrade && !$('#inspecteurGrade').value) $('#inspecteurGrade').value = s.defaultGrade;
  }

  function saveSettings() {
    const store = loadStore();
    store.settings = {
      smigJour: num($('#smigJour').value) || 14500,
      smigJour2026: num($('#smigJour2026').value) || 21500,
      tauxChange: num($('#tauxChange').value) || 2850,
      joursCongesAn: num($('#joursCongesAn').value) || 18,
      defaultInspecteur: $('#defaultInspecteur').value,
      defaultGrade: $('#defaultGrade').value,
      autoCalc: $('#autoCalc').checked
    };
    saveStore(store);
    $('#smigDisplay').textContent = formatNumber(store.settings.smigJour, 0) + ' FC/j';
    toast('Paramètres enregistrés', 'success');
  }

  /* -------------------------------------------------------
   *  LIVE AUTO-CALC
   * ----------------------------------------------------- */
  function bindLiveCalc() {
    const fields = [
      'salaireBase', 'logement', 'transport', 'joursPrestes', 'joursOuvrables',
      'categorie', 'motif', 'preavisMode', 'preavisManuel', 'congeAcquis',
      'dateEngagement', 'dateFin', 'devise',
      'retenueCNSS', 'tauxCNSS', 'retenueIPR', 'tauxIPR',
      'retenueONEM', 'tauxONEM', 'retenueINPP', 'tauxINPP',
      'autresRetenues', 'logementAuto'
    ];
    fields.forEach(id => {
      const el = $('#' + id);
      if (!el) return;
      const evt = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
      el.addEventListener(evt, () => {
        if (id === 'dateEngagement' || id === 'dateFin') updateAnciennete();
        if (id === 'devise') updateDeviseAffixes();
        if (id === 'preavisMode') {
          $('#preavisManuel').disabled = $('#preavisMode').value !== 'manuel';
        }
        if (id === 'logementAuto' && $('#logementAuto').checked) {
          const s = num($('#salaireBase').value);
          if (s) $('#logement').value = (s * 0.3).toFixed(2);
        }
        if (getSettings().autoCalc && $('#salaireBase').value && $('#dateEngagement').value && $('#dateFin').value) {
          clearTimeout(bindLiveCalc._t);
          bindLiveCalc._t = setTimeout(() => calculate(), 350);
        }
      });
    });
  }

  /* -------------------------------------------------------
   *  INIT
   * ----------------------------------------------------- */
  function init() {
    // Splash
    setTimeout(() => {
      $('#splash').classList.add('hidden');
      $('#app').classList.remove('hidden');
    }, 1800);

    // Default date
    const today = new Date().toISOString().slice(0, 10);
    $('#dateDocument').value = today;

    // Numero
    state.numero = (() => {
      const store = loadStore();
      const n = String((store.counter || 0) + 1).padStart(6, '0');
      return `DF-${YEAR}-${n}`;
    })();
    $('#displayNumero').textContent = state.numero;

    loadSettingsUI();
    renderLegal();
    renderChecklist();
    initSignature();
    bindPhoto('photoTravailleur', 'photoTravailleurPreview', 'travailleur');
    bindPhoto('photoEntreprise', 'photoEntreprisePreview', 'entreprise');
    bindLiveCalc();
    updateDeviseAffixes();

    // Navigation
    $$('.nav-item').forEach(btn => {
      btn.addEventListener('click', () => switchView(btn.dataset.view));
    });
    $('#btnSidebar').addEventListener('click', () => $('#sidebar').classList.toggle('open'));

    // Actions
    $('#btnCalculate').addEventListener('click', () => {
      if (!$('#nom').value || !$('#salaireBase').value || !$('#dateEngagement').value || !$('#dateFin').value) {
        toast('Veuillez renseigner au minimum : Nom, Salaire, Dates', 'error');
        return;
      }
      // Persist counter when first calculating a new numero
      const store = loadStore();
      const expected = `DF-${YEAR}-${String((store.counter || 0) + 1).padStart(6, '0')}`;
      if (state.numero === expected) {
        store.counter = (store.counter || 0) + 1;
        saveStore(store);
      }
      calculate();
      toast('Décompte calculé — Net : ' + $('#kpiNet').textContent, 'success');
      document.getElementById('resultPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    $('#btnFillExample').addEventListener('click', fillExample);
    $('#btnNew').addEventListener('click', newDocument);
    $('#btnToPreview').addEventListener('click', () => {
      if (!state.lastResult) calculate();
      switchView('preview');
    });
    $('#btnSaveArchive').addEventListener('click', () => saveToArchive(false));
    $('#btnExportPdf').addEventListener('click', () => {
      if (!state.lastResult) calculate();
      switchView('preview');
      setTimeout(() => downloadPDF('decompteSheet', (state.numero || 'DF') + '.pdf'), 300);
    });
    $('#btnDownloadPdf').addEventListener('click', () => downloadPDF('decompteSheet', (state.numero || 'DF') + '.pdf'));
    $('#btnPrint').addEventListener('click', () => printSheet('preview'));
    $('#btnShareWA').addEventListener('click', shareWhatsApp);
    $('#btnEmail').addEventListener('click', shareEmail);
    $('#btnPrintPV').addEventListener('click', () => printSheet('pv'));
    $('#btnDownloadPV').addEventListener('click', () => downloadPDF('pvSheet', (state.numero || 'DF').replace('DF', 'PV') + '.pdf'));
    $('#btnRunAI').addEventListener('click', () => runAI(state.lastResult || calculate()));
    $('#btnGeo').addEventListener('click', captureGeo);
    $('#btnSaveSettings').addEventListener('click', saveSettings);
    $('#btnFavorites').addEventListener('click', showFavoritesModal);
    $('#btnHistory').addEventListener('click', showHistoryModal);
    $('#btnTheme').addEventListener('click', () => {
      document.body.classList.toggle('dark-theme');
      toast('Thème basculé (aperçu)', 'success');
    });

    // Archive tools
    $('#archiveSearch').addEventListener('input', (e) => renderArchive(e.target.value));
    $('#btnExportAll').addEventListener('click', () => {
      const store = loadStore();
      const blob = new Blob([JSON.stringify(store.archives, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `InspecteurBot_archives_${YEAR}.json`;
      a.click();
      toast('Export JSON téléchargé', 'success');
    });
    $('#btnClearArchive').addEventListener('click', () => {
      if (!confirm('Vider toutes les archives ?')) return;
      const store = loadStore();
      store.archives = [];
      store.favorites = [];
      saveStore(store);
      renderArchive();
      toast('Archives vidées', 'success');
    });

    // Modal close
    $$('[data-close]').forEach(el => el.addEventListener('click', closeModal));

    // Preavis mode
    $('#preavisMode').addEventListener('change', () => {
      $('#preavisManuel').disabled = $('#preavisMode').value !== 'manuel';
    });

    // Close sidebar on outside click (mobile)
    document.addEventListener('click', (e) => {
      const sb = $('#sidebar');
      const btn = $('#btnSidebar');
      if (window.innerWidth <= 900 && sb.classList.contains('open')) {
        if (!sb.contains(e.target) && !btn.contains(e.target)) sb.classList.remove('open');
      }
    });
  }

  // Boot
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
