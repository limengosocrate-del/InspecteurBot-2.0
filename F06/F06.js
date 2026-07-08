(() => {
  "use strict";

  const app = document.getElementById("app");
  const CURRENT_CODE =
    app?.dataset.formCode ||
    (location.pathname.match(/(F0[1-7]|S0[1-3])/i)?.[1] || "F01").toUpperCase();

  const PROVINCES = [
    "Bas-Uele","Équateur","Haut-Katanga","Haut-Lomami","Haut-Uele","Ituri",
    "Kasaï","Kasaï-Central","Kasaï-Oriental","Kinshasa","Kongo-Central",
    "Kwango","Kwilu","Lomami","Lualaba","Mai-Ndombe","Maniema","Mongala",
    "Nord-Kivu","Nord-Ubangi","Sankuru","Sud-Kivu","Sud-Ubangi","Tanganyika",
    "Tshopo","Tshuapa"
  ];

  const VILLES = [
    "Kinshasa","Lubumbashi","Goma","Bukavu","Kisangani","Mbuji-Mayi","Kananga",
    "Matadi","Kolwezi","Likasi","Boma","Butembo","Bunia","Kikwit","Mbandaka",
    "Gemena","Kalemie","Kindu","Bandundu","Isiro","Uvira","Tshikapa"
  ];

  const COMMUNES = [
    "Gombe","Lingwala","Barumbu","Kinshasa","Kasa-Vubu","Ngaliema","Bandalungwa",
    "Lemba","Limete","Matete","Ndjili","Masina","Kimbanseke","Mont-Ngafula",
    "Kintambo","Ngaba","Selembao","Kalamu","Makala","Bumbu","Ngiri-Ngiri",
    "Lubumbashi","Kampemba","Kenya","Katuba","Ruashi","Annexe","Goma","Karisimbi",
    "Ibanda","Kadutu","Bagira"
  ];

  const SECTEURS = [
    "Administration publique","Agriculture","Agro-industrie","Banque et finance",
    "BTP / Construction","Commerce général","Éducation","Énergie",
    "Industrie manufacturière","Mines et carrières","Pétrole et gaz",
    "Santé","Sécurité privée","Télécommunications","Transport et logistique",
    "Tourisme et hôtellerie","ONG / ASBL","Services","Autres"
  ];

  const FORMES = [
    "Entreprise individuelle","SARL","SA","SAS","SCS","SNC","ASBL","ONG",
    "Établissement public","Succursale","Coopérative","Autre"
  ];

  const CATEGORIES = [
    "Classifiés","Maîtrises","Cadres","Journalier","Temporaire","Apprenti",
    "Contractant","Sous-traité","Expatrié"
  ];

  const DOCS = {
    F01: [
      "Déclaration d’Etablissement (article 216 du CT)",
      "Règlement d’entreprise (article 157 du CT)",
      "Convention collective (n°199 du Code du Travail)",
      "Horaire du Travail (article 119 du CT et Arrêté n°040/CAB/MINETPS/2013)",
      "Classification Générale des Emplois (article 90 du CT)",
      "Feuille de paie de trois derniers mois",
      "Bilan sociale (Article n°218 du Code du Travail)",
      "Preuve de paiement de cotisation CNSS, ONEM, INPP et IPR",
      "Déclaration annuelle de la situation de la main d’œuvre de 3 dernières années",
      "Registre de Travailleurs non permanents (article 40 alinéa 2)",
      "Contrat de Travail visé (articles 36 à 49 du code du Travail)",
      "Déclaration de mouvement de Travailleur visé (article 217 du Code du Travail)",
      "Certificat d’aptitude au Travail",
      "Décompte de rémunération de chaque mois",
      "Titre de congé de trois dernières années",
      "Application du SMIG",
      "Autres"
    ],
    F02: [
      "Contrat du Travail pour expatriés visé par l’ONEM",
      "Procès-verbal de la CNEE",
      "Note de perception de la DGRAD",
      "Preuve de paiement de la carte pour expatriés",
      "Preuve de paiement de cotisation CNSS, ONEM, INPP et IPR",
      "Preuve d’immatriculation à la CNSS",
      "Feuille de paie de trois derniers mois",
      "Décompte de rémunération de chaque mois",
      "Titre de congé de trois dernières Année"
    ],
    F03: [
      "Assurance maladie",
      "Convention médicale visée",
      "Installation sanitaire",
      "Vestiaire des Travailleurs (Homme et Femme)",
      "Boite de secours",
      "Comité d’hygiène et d’embellissement de lieux de Travail",
      "• Composition",
      "• PV d’installation",
      "• Attestation de fonctionnement de CHSE",
      "• PV des réunions",
      "• PV de constat d’Infraction",
      "• Rapport annuel des activités",
      "Service médicale de l’Entreprise",
      "Comité de lutte et de prévention contre le VIH/SIDA"
    ],
    F04: [
      "Déclaration d’Etablissement (article 216 du CT)"
    ],
    F05: [
      "1. REGLEMENTS GENERALES DE SECURITE art 157 CDT",
      "2. INSTALLATION ET EXPLOITATION :",
      "3. MATERIEL",
      "4. ESSOREUSE",
      "5. FOUR",
      "6. COMPRESSEUR",
      "7. POSTE A SOUDER",
      "8. PANNEAUX DE SIGNALISATIONS",
      "9. TABLEAU D’EVALUATIONS DES RISQUES PROBABLES",
      "10. CONTROLE ET HOMOLOGATIONS DES MACHINES",
      "11. INSTALLATIONS ELECTRIQUES",
      "12. FORMATION APPROPRIEE DES AGENTS AUX RISQUES",
      "13. PROTECTION COLLECTIVE",
      "14. ENDROIT CONFINE ET POINT DE RASSEMBLEMENT",
      "14. LIVRET D’ACCUEIL DE SECURITE",
      "15. REGISTRE DES MACHINES ET ENGINS",
      "16. PROCEDURES DE SECOURS",
      "17 PROTECTION ET PROGRAMME D’ENTRETIEN DES MACHINES ET ENGINS",
      "18. Protection de l’environnement"
    ],
    F06: [
      "1 REGLES GENERALES DE SECURITE",
      "2. PANNEAUX DE SIGNALISATIONS",
      "3. TABLEAU D’EVALUATIONS DES RISQUES PROBABLES",
      "4. CONTROLE ET HOMOLOGATIONS DES MACHINES",
      "5. INSTALLATIONS ELECTRIQUES",
      "6. FORMATION APPROPRIEE DES AGENTS AUX RISQUES",
      "7. MANIPULATIONS TECHNIQUES ET TRAVAIL MANUEL",
      "8. PROTECTION INDIVIDUELLE",
      "9. PROTECTION COLLECTIVE",
      "10. ENDROIT CONFINE ET POINT DE RASSEMBLEMENT",
      "11. LIVRET D’ACCUEIL DE SECURITE",
      "12. REGISTRE DES MACHINES ET ENGINS",
      "13. PROCEDURES DE SECOURS",
      "14 PROTECTION ET PROGRAMME D’ENTRETIEN DES MACHINES ET ENGINS",
      "15. DEPOT DE CARBURE DE CALCIUM",
      "Récipients",
      "- Entreposage",
      "- Conditionnement de dépôt",
      "- Installation électrique",
      "16. Règlement d’installation et d’exploitation de :",
      "- Compresseur",
      "- Poste à souder",
      "- Essoreuse",
      "- Four",
      "- Matériel anti incendie",
      "- Chalumeau",
      "- Alcotest",
      "16. Récipient pour contenir :",
      "- Gaz liquéfié (Anhydride carbonique, Chlore, Propane, etc)",
      "- Gaz Comprimé (Air, Argon, Hélium, Oxygène, Azote etc)",
      "- Gaz Dissous (Acétylène)",
      "17. Protection de l’environnement"
    ],
    F07: [
      "Numéro d’affiliation de la société à la CNSS",
      "Preuve de paiement de cotisation CNSS",
      "La Convention Médicale",
      "Déclaration des accidents de travail",
      "Apres la retraite, Vérifier si l’employer fait le suivi à la CNSS",
      "Allocation famille (1/27 ieme du salaire de base journalier).",
      "Indemnité de logement",
      "Assurance maladie",
      "Soin Médicaux pour les apprentis et les journaliers."
    ],
    S01: [
      "1.",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "2."
    ],
    S02: [
      "1. Pour l’Employeur",
      "Déclaration d’Etablissement (article 216 du CT)",
      "Règlement d’entreprise (article 157 du CT)",
      "Convention collective",
      "",
      "",
      "",
      "",
      "2."
    ],
    S03: []
  };

  const FORMS = {
    F01: {
      code: "F01",
      ministry: true,
      title: "CONTROLE DE LA<br>MAIN D’OEUVRE",
      infoTitle: "RENSEIGNEMENTS DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f01",
      effectifs: ["sex", "categories", "nonperm"],
      docsTitle: "DOCUMENTS A PRESENTER",
      docRows: 18,
      admin: "full",
      employerLabel: "Signature de l’Employeur ou son préposé",
      inspectorLabel: "Nom et signature de l’Inspecteur ou Contrôleur du Travail"
    },
    F02: {
      code: "F02",
      ministry: true,
      title: "CONTROLE DE LA MAIN<br>D’ŒUVRE ETRANGERE",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f02",
      effectifs: ["expatList", "expatCategories", "exemptes"],
      docsTitle: "DOCUMENTS A PRESENTER",
      docRows: 11,
      admin: "full",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail",
      foot: "Igt 202"
    },
    F03: {
      code: "F03",
      ministry: true,
      title: "HYGIENE ET SANTE<br>AU TRAVAIL",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f03",
      effectifs: ["sex", "contractants", "soustraites", "temporaires"],
      docsTitle: "DOCUMENTS A PRESENTER",
      docRows: 15,
      admin: "fullSimple",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail",
      foot: "IGT 2024"
    },
    F04: {
      code: "F04",
      title: "SECURITE<br>TECHNIQUE DANS LE<br>BTP",
      officeLabel: "Antenne de",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f04",
      effectifs: ["sex", "categories", "nonperm"],
      docsTitle: "DOCUMENTS A PRESENTER",
      docRows: 22,
      admin: "visa",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail"
    },
    F05: {
      code: "F05",
      title: "SECURITE TECHNIQUE<br>DANS LES MINES",
      rightSub: "RESSORT DE",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f05",
      effectifs: ["sex", "categories", "nonperm"],
      docsTitle: "DOCUMENTS SOCIAUX DE LA MAIN D’OEUVRE",
      docRows: 20,
      admin: "none",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail"
    },
    F06: {
      code: "F06",
      title: "SECURITE TECHNIQUE<br>DANS LES ENTREPRISES A<br>HAUT RISQUES",
      rightSub: "RESSORT DE",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f06",
      effectifs: ["sex", "categories", "nonperm"],
      docsTitle: "DOCUMENTS SOCIAUX DE LA MAIN D’OEUVRE",
      docRows: 34,
      admin: "none",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail"
    },
    F07: {
      code: "F07",
      title: "PROTECTION<br>SOCIALE",
      officeLabel: "Antenne de",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f07",
      effectifs: ["sex", "categories", "nonperm"],
      docsTitle: "DOCUMENTS A PRESENTER",
      docRows: 22,
      admin: "none",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail"
    },
    S01: {
      code: "S01",
      title: "VISITE<br>D’INSPECTION<br>SPECIALE",
      officeLabel: "Direction",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f07",
      effectifs: ["sex", "categories", "nonperm"],
      docsTitle: "DOCUMENTS SOCIAUX DE LA MAIN D’OEUVRE",
      docRows: 22,
      admin: "none",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail"
    },
    S02: {
      code: "S02",
      title: "CONTRE -<br>ENQUETE",
      officeLabel: "Direction",
      infoTitle: "RENSEIGNEMENT DE L’ENTREPRISE OU ETABLISSEMENT VISITE",
      info: "f07",
      effectifs: ["sex", "categories", "nonperm"],
      docsTitle: "DOCUMENTS SOCIAUX DE LA MAIN D’OEUVRE",
      docRows: 22,
      admin: "none",
      employerLabel: "Signature de l’Employeur ou son Représentant",
      inspectorLabel: "Signature de l’Inspecteur ou Contrôleur du Travail"
    },
    S03: {
      code: "S03",
      title: "ADMINISTRATION<br>ET FINANCE",
      officeLabel: "Direction",
      infoTitle: "RENSEIGNEMENT DE L’ENTITE VISITE",
      info: "s03",
      effectifs: [],
      docsTitle: "",
      docRows: 0,
      admin: "short",
      employerLabel: "",
      inspectorLabel: ""
    }
  };

  const def = FORMS[CURRENT_CODE] || FORMS.F01;

  const esc = (s = "") =>
    String(s).replace(/[&<>"']/g, c => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[c]));

  function fieldRows(type) {
    if (type === "s03") {
      return [
        [{ label: "PROVINCE DE", key: "province_entite", list: "provinces" }],
        [{ label: "RESSORT DE", key: "ressort", list: "villes" }],
        [
          { label: "Nom du Responsable", key: "responsable" },
          { label: "Fonction", key: "fonction_resp" },
          { label: "Matricule", key: "matricule_resp", small: true }
        ],
        [
          { label: "Personne rencontrée", key: "personne" },
          { label: "Fonction", key: "fonction_personne" },
          { label: "Matricule", key: "matricule_personne", small: true }
        ]
      ];
    }

    const rows = [
      [{
        label: type === "f01" ? "Nom ou Raison Sociale/Adresse Physique" : "Nom ou Raison Sociale",
        key: "raison",
        required: true
      }],
      [{ label: "Secteur d’activité", key: "secteur", list: "secteurs", required: true }],
      [
        { label: "Siège social : av", key: "avenue" },
        { label: "n°", key: "numero", tiny: true },
        { label: "Q/", key: "quartier" },
        { label: "C/", key: "commune", list: "communes" }
      ]
    ];

    if (type === "f01") {
      rows.push(
        [
          { label: "Nom du Responsable", key: "responsable", required: true },
          { label: "Qualité", key: "qualite_resp" }
        ],
        [
          { label: "Contact", key: "contact", phone: true },
          { label: "E-mail", key: "email", email: true }
        ],
        [
          { label: "Personne rencontrée", key: "personne", required: true },
          { label: "Qualité", key: "qualite_personne" }
        ],
        [
          { label: "CNSS", key: "cnss", small: true },
          { label: "ONM", key: "onm", small: true },
          { label: "I NPP", key: "inpp", small: true }
        ]
      );
    } else if (type === "f02") {
      rows.push(
        [
          { label: "Nom du Responsable", key: "responsable", required: true },
          { label: "Contact", key: "contact", phone: true }
        ],
        [
          { label: "Personne rencontrée", key: "personne", required: true },
          { label: "Qualité", key: "qualite_personne" }
        ],
        [
          { label: "CNSS", key: "cnss", small: true },
          { label: "ONM", key: "onm", small: true },
          { label: "I NPP", key: "inpp", small: true }
        ]
      );
    } else if (type === "f03") {
      rows.push(
        [
          { label: "Nom du Responsable", key: "responsable", required: true },
          { label: "Contact", key: "contact", phone: true }
        ],
        [
          { label: "Personne rencontrée", key: "personne", required: true },
          { label: "Qualité", key: "qualite_personne" }
        ]
      );
    } else if (type === "f04") {
      rows.push(
        [
          { label: "Nom du Responsable", key: "responsable", required: true },
          { label: "Contact", key: "contact", phone: true }
        ],
        [
          { label: "Personne rencontrée", key: "personne", required: true },
          { label: "Qualité", key: "qualite_personne" }
        ],
        [{ label: "Maitre d’œuvre", key: "maitre_oeuvre" }],
        [{ label: "Maitre d’Ouvrage", key: "maitre_ouvrage" }]
      );
    } else if (type === "f05") {
      rows.push(
        [
          { label: "Nom du Responsable", key: "responsable", required: true },
          { label: "Contact", key: "contact", phone: true }
        ],
        [
          { label: "Personne rencontrée", key: "personne", required: true },
          { label: "Qualité", key: "qualite_personne" }
        ],
        [{ label: "Nombre des sous entreprises", key: "nombre_sous_entreprises" }]
      );
    } else {
      rows.push(
        [
          { label: "Nom du Responsable", key: "responsable", required: true },
          { label: "Contact", key: "contact", phone: true }
        ],
        [
          { label: "Personne rencontrée", key: "personne", required: true },
          { label: "Qualité", key: "qualite_personne" }
        ]
      );
    }

    rows.push([
      { label: "Précédente visite effectué par", key: "precedente_visite_par" },
      { label: "le", key: "precedente_visite_date", small: true }
    ]);

    return rows;
  }

  function datalists() {
    const opt = arr => arr.map(v => `<option value="${esc(v)}"></option>`).join("");
    return `
      <datalist id="dl-provinces">${opt(PROVINCES)}</datalist>
      <datalist id="dl-villes">${opt(VILLES)}</datalist>
      <datalist id="dl-communes">${opt(COMMUNES)}</datalist>
      <datalist id="dl-secteurs">${opt(SECTEURS)}</datalist>
      <datalist id="dl-formes">${opt(FORMES)}</datalist>
      <datalist id="dl-categories">${opt(CATEGORIES)}</datalist>
      <datalist id="dl-nationalites">
        <option value="Congolaise"></option>
        <option value="Française"></option>
        <option value="Belge"></option>
        <option value="Chinoise"></option>
        <option value="Indienne"></option>
        <option value="Sud-africaine"></option>
        <option value="Zambienne"></option>
        <option value="Angolaise"></option>
        <option value="Rwandaise"></option>
        <option value="Burundaise"></option>
        <option value="Ougandaise"></option>
        <option value="Autre"></option>
      </datalist>
    `;
  }

  function lineInput(f) {
    const list = f.list ? `list="dl-${f.list}"` : "";
    const type = f.email ? "email" : "text";
    const req = f.required ? "data-required='1'" : "";
    const phone = f.phone ? "data-phone='1'" : "";
    const cls = f.tiny ? "tiny" : f.small ? "small" : "";
    return `
      <label class="seg ${cls}">
        <span>${esc(f.label)} :</span>
        <input class="line-input" type="${type}" name="${esc(f.key)}" ${list} ${req} ${phone}>
      </label>
    `;
  }

  function renderHeader(d) {
    const left = d.ministry
      ? `
        <div class="logo-line">
          <img src="images/logo-igt.png" alt="IGT RDC" onerror="this.onerror=null;this.src='../images/logo-igt.png'">
          <div class="org-small">
            REPUBLIQUE DEMOCRATIQUE DU CONGO<br>
            Ministère de l’Emploi et Travail<br>
            <span class="blue">Inspection Générale du Travail</span><br>
            <span class="red">Administration Centrale</span><br>
            I.G.T
          </div>
        </div>
      `
      : `
        <div class="rep-small">République Démocratique du Congo</div>
        <div class="igt-left">
          <img src="images/logo-igt.png" alt="IGT RDC" onerror="this.onerror=null;this.src='../images/logo-igt.png'">
          <div class="igt-text">INSPECTION<br>GENERALE DU<br>TRAVAIL</div>
        </div>
        ${d.officeLabel ? `
          <label class="office-line">
            <span>${esc(d.officeLabel)}</span>
            <input class="line-input" name="office_${esc(d.code)}">
          </label>` : ""}
      `;

    return `
      <table class="official header">
        <tr>
          <td class="header-left">${left}</td>
          <td class="header-title">${d.title}</td>
          <td class="header-code">
            <div class="form-code">${esc(d.code)}</div>
            ${d.rightSub ? `<div style="font-size:7pt;font-weight:900;margin-top:2mm;">${esc(d.rightSub)}</div><input class="line-input" name="right_sub_${esc(d.code)}">` : ""}
            <label class="form-number">N° <input class="line-input" name="numero_formulaire" placeholder="…………/20……"></label>
          </td>
        </tr>
      </table>
    `;
  }

  function renderReserve() {
    return `
      <div class="reserve-title">RESERVE A L’IT OU CT</div>
      <div class="rate-grid" data-rate-group="reserve_it_ct">
        ${["0","1/2","3","4","5","6","7","8"].map(v => `<div class="rate-box ${v==="8" ? "r8" : ""}" data-rate="${v}">${v}</div>`).join("")}
      </div>
    `;
  }

  
  function renderInfo(d) {
    const rows = fieldRows(d.info);
    return `
      <table class="official">
        <tr>
          <th class="section-title" colspan="2">${esc(d.infoTitle)}</th>
        </tr>
        <tr>
          <td class="info-left">
            <table class="info-lines">
              ${rows.map(r => `
                <tr><td>
                  <div class="line-flex">${r.map(lineInput).join("")}</div>
                </td></tr>
              `).join("")}
            </table>
          </td>
          <td class="reserve-cell">${renderReserve()}</td>
        </tr>
      </table>
    `;
  }

function renderEffectifBlock(kind, idx) {
    const configs = {
      sex: {
        title: "EFFECTIFS DE TRAVAILLEURS PERMANENTS VENTILLES SELON LE SEXE",
        groups: ["NATIONAUX","EXPATRIES","TOTAL"],
        right: "RATIO",
        labels: ["CONFORME","NON CONFORME"]
      },
      categories: {
        title: "EFFECTIFS DE TRAVAILLEURS PERMANENTS VENTILLES SELON LES CATEGORIES PROFESSIONNELS",
        groups: ["CLASSIFIES","MAITRISES","CADRES"],
        right: "CONFORMITE",
        labels: ["C","NC"]
      },
      nonperm: {
        title: "EFFECTIFS DE TRVAILLEURS NON PERMENANTS ET DES ENFANTS EMPLOYES",
        groups: ["ENFANTS","NON PERMANENTS","TOTAL"],
        right: "CONFORMITE",
        labels: ["C","NC"]
      },
      contractants: {
        title: "EFFECTIFS DES CONTRACTANTS",
        groups: ["NATIONAUX","EXPATRIES","TOTAL"],
        right: "",
        labels: ["",""],
        red: true,
        plural: true
      },
      soustraites: {
        title: "EFFECTIFS DES TRAVAILLEURS SOUS TRAITES (SOUS ENTREPRISES)",
        groups: ["NATIONAUX","EXPATRIES","TOTAL"],
        right: "",
        labels: ["",""],
        red: true,
        plural: true
      },
      temporaires: {
        title: "EFFECTIFS DES TRAVAILLEURS TEMPORAIRES",
        groups: ["NATIONAUX","EXPATRIES","TOTAL"],
        right: "",
        labels: ["",""],
        red: true,
        plural: true
      },
      expatCategories: {
        title: "EFFECTIFS DE TRAVAILLEURS EXPATRIES VENTILLES SELON LES CATEGORIES PROFESSIONNELS",
        groups: ["CLASSIFIES","MAITRISES","CADRES"],
        right: "CONFORMITE",
        labels: ["C","NC"]
      },
      exemptes: {
        title: "EFFECTIFS DE TRVAILLEURS EXPATRIES EXEMPTE DE LA CARTE DU TRAVAIL",
        groups: ["ASSOCIES PASSIFS","PERSONNEL TOURISTIQUE","AUTRES"],
        right: "CONFORMITE",
        labels: ["C","NC"]
      }
    };

    const c = configs[kind];
    if (!c) return "";

    const gender = c.plural ? ["HOMMES","FEMMES","TOTAL"] : ["HOMME","FEMME","TOTAL"];
    const red = c.red ? "red-line" : "";

    return `
      <table class="official effectif">
        <tr>
          <th class="section-title" colspan="9">${esc(c.title)}</th>
          <th colspan="2">${esc(c.right || "")}</th>
        </tr>
        <tr>
          ${c.groups.map(g => `<th class="subhead ${red}" colspan="3">${esc(g)}</th>`).join("")}
          <th>${esc(c.labels[0] || "")}</th>
          <th>${esc(c.labels[1] || "")}</th>
        </tr>
        <tr>
          ${c.groups.map(() => gender.map(x => `<th class="${red}">${esc(x)}</th>`).join("")).join("")}
          <td class="decision-cell" data-decision="eff_${idx}" data-value="${esc(c.labels[0] || "C")}"></td>
          <td class="decision-cell" data-decision="eff_${idx}" data-value="${esc(c.labels[1] || "NC")}"></td>
        </tr>
        <tr class="effectif-inputs">
          ${c.groups.map((g, gi) => `
            <td><input type="number" min="0" name="eff_${idx}_${gi}_h"></td>
            <td><input type="number" min="0" name="eff_${idx}_${gi}_f"></td>
            <td><input class="readonly" readonly name="eff_${idx}_${gi}_t"></td>
          `).join("")}
          <td></td><td></td>
        </tr>
      </table>
    `;
  }

  function renderExpatList() {
    const rows = Array.from({ length: 12 }, (_, i) => i + 1);
    return `
      <table class="official docs">
        <tr>
          <th class="section-title" colspan="8">EFFECTIFS DE TRAVAILLEURS EXPATRIES VENTILLES SELON LE SEXE</th>
        </tr>
        <tr>
          <th style="width:8%;">N°</th>
          <th>NOMS</th>
          <th style="width:8%;">SEXE</th>
          <th style="width:15%;">NATIONALITE</th>
          <th style="width:12%;" class="red-line">NATURE DE VISA</th>
          <th style="width:8%;">E</th>
          <th style="width:8%;">NE</th>
          <th style="width:8%;">ENC</th>
        </tr>
        ${rows.map(n => `
          <tr>
            <td style="text-align:center;">${String(n).padStart(2,"0")}</td>
            <td><input class="line-input" name="expat_${n}_nom"></td>
            <td><input class="line-input" name="expat_${n}_sexe" list="dl-sexes"></td>
            <td><input class="line-input" name="expat_${n}_nationalite" list="dl-nationalites"></td>
            <td><input class="line-input red-line" name="expat_${n}_visa"></td>
            <td class="status-cell" data-group="carte_${n}" data-value="E"></td>
            <td class="status-cell" data-group="carte_${n}" data-value="NE"></td>
            <td class="status-cell" data-group="carte_${n}" data-value="ENC"></td>
          </tr>
        `).join("")}
      </table>
      <datalist id="dl-sexes"><option value="H"></option><option value="F"></option></datalist>
    `;
  }

  function renderDocs(d) {
    const docs = DOCS[d.code] || [];
    const total = Math.max(d.docRows || docs.length, docs.length);
    const rows = Array.from({ length: total }, (_, i) => docs[i] ?? "");

    return `
      <table class="official docs">
        <tr>
          <th class="section-title ${["F04"].includes(d.code) ? "red-text" : ""}" colspan="5">${esc(d.docsTitle)}</th>
        </tr>
        <tr>
          <th style="width:58%;"></th>
          <th style="width:9%;">E</th>
          <th style="width:9%;">N E</th>
          <th style="width:9%;">ENC</th>
          <th style="width:15%;">SUITE RESERVE</th>
        </tr>
        ${rows.map((txt, i) => {
          const red = /INSTALLATION|MATERIEL|ESSOREUSE|FOUR|COMPRESSEUR|POSTE A SOUDER|DEPOT|Récipients|Règlement|Récipient|Numéro|Preuve|Convention|Déclaration|Apres|Allocation|Indemnité|Assurance|Soin/.test(txt) ? "red-line" : "";
          const blue = /Gaz/.test(txt) ? "blue-line" : "";
          return `
            <tr>
              <td class="doc-label ${red} ${blue}">
                ${txt ? esc(txt) : `<input name="doc_libre_${i}" aria-label="Document libre ${i + 1}">`}
              </td>
              <td class="status-cell" data-group="doc_${i}" data-value="E"></td>
              <td class="status-cell" data-group="doc_${i}" data-value="NE"></td>
              <td class="status-cell" data-group="doc_${i}" data-value="ENC"></td>
              <td><input class="line-input" name="suite_reserve_${i}"></td>
            </tr>
          `;
        }).join("")}
        <tr>
          <td colspan="4"></td>
          <td class="conclusion-head">Conclusion de la visite</td>
        </tr>
        <tr>
          <td colspan="4"><textarea class="line-area" name="conclusion_visite"></textarea></td>
          <td>
            <table class="official" style="height:100%;">
              <tr>
                <th>LO</th><th>MD</th><th>PV CI</th>
              </tr>
              <tr>
                <td class="decision-cell" data-decision="conclusion" data-value="LO"></td>
                <td class="decision-cell" data-decision="conclusion" data-value="MD"></td>
                <td class="decision-cell" data-decision="conclusion" data-value="PV CI"></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `;
  }

  function renderSignatures(d) {
    return `
      <table class="official sign-table">
        <tr>
          <td>
            <div>${esc(d.employerLabel)}</div>
            <canvas class="signature-pad" data-signature="employeur"></canvas>
            <div class="sig-actions no-print">
              <button type="button" data-clear-signature="employeur">Effacer</button>
              <select name="signature_employeur_statut">
                <option value="acceptée">Signature acceptée</option>
                <option value="refusée">Refus de signature</option>
                <option value="absent">Absent</option>
              </select>
            </div>
          </td>
          <td>
            <div>
              Fait à <input class="line-input" name="fait_a" style="width:30mm;">
              le <input class="line-input" name="date_signature" style="width:28mm;">
            </div>
            <div>${esc(d.inspectorLabel)}</div>
            <canvas class="signature-pad" data-signature="inspecteur/contrôleur"></canvas>
            <div class="sig-actions no-print">
              <button type="button" data-clear-signature="inspecteur/contrôleur">Effacer</button>
              <input class="line-input" name="horodatage_signature" readonly>
            </div>
          </td>
        </tr>
      </table>
    `;
  }
          
  function renderAdmin(d) {
    if (d.admin === "full") {
      return `
        <table class="official admin">
          <tr><th class="section-title" colspan="2">RESERVE A L’ADMINISTRATION DE l’INSPECTION DU TRAVAIL</th></tr>
          <tr>
            <th class="subadmin">OBSERVATIONS DU CHEF D’ANTENNE</th>
            <th class="subadmin">OBSERVATIONS DU DIRECTEUR PROVINCIAL</th>
          </tr>
          <tr>
            <td><textarea name="observations_chef_antenne"></textarea></td>
            <td><textarea name="observations_directeur_provincial"></textarea></td>
          </tr>
          <tr><th class="section-title" colspan="2">RESERVE A L’INSPECTEUR GENERAL DU TRAVAIL</th></tr>
          <tr>
            <td>
              <strong>${d.code === "F01" ? "ANALYSE ET SYNTHESE" : "OBSERVATIONS"}</strong>
              <textarea name="analyse_synthese"></textarea>
            </td>
            <td>
              <strong>DECISION</strong>
              <table class="official">
                <tr>
                  ${["VS","CE", d.code === "F02" ? "IT" : "IT/CT","MD","S"].map(x => `<th>${x}</th>`).join("")}
                </tr>
                <tr>
                  ${["VS","CE","ITCT","MD","S"].map(x => `<td class="decision-cell" data-decision="decision_igt" data-value="${x}"></td>`).join("")}
                </tr>
              </table>
            </td>
          </tr>
        </table>
      `;
    }

    if (d.admin === "fullSimple") {
      return `
        <table class="official admin">
          <tr><th class="section-title" colspan="2">RESERVE A L’ADMINISTRATION DE L’INSPECTION DU TRAVAIL</th></tr>
          <tr>
            <td><textarea name="observations_administration"></textarea></td>
            <td><textarea name="observations_direction"></textarea></td>
          </tr>
          <tr><th class="section-title" colspan="2">RESERVE A L’INSPECTEUR GENERAL DU TRAVAIL</th></tr>
          <tr>
            <td>
              <strong>OBSERVATIONS</strong>
              <textarea name="observations_igt"></textarea>
            </td>
            <td>
              <table class="official">
                <tr>${["VS","CE","IT","MD","S"].map(x => `<th>${x}</th>`).join("")}</tr>
                <tr>${["VS","CE","IT","MD","S"].map(x => `<td class="decision-cell" data-decision="decision_igt" data-value="${x}"></td>`).join("")}</tr>
              </table>
            </td>
          </tr>
        </table>
      `;
      }

       if (d.admin === "visa") {
      return `
        <table class="official admin">
          <tr>
            <th>Visa du directeur Provincial</th>
            <th>Reserve à l’IGT</th>
          </tr>
          <tr>
            <td><textarea name="visa_directeur_provincial"></textarea></td>
            <td><textarea name="reserve_igt"></textarea></td>
          </tr>
        </table>
      `;
    }

    return "";
  }

  function renderToolbar(d) {
    return `
      <div class="screen-toolbar">
        <strong>InspecteurBot IA RDC — ${esc(d.code)}</strong>
        <button type="button" data-action="save">Enregistrer</button>
        <button type="button" data-action="load">Charger dernier</button>
        <button type="button" data-action="ai">Analyse IA</button>
        <button type="button" data-action="dictation">Dictée vocale</button>
        <button type="button" data-action="report">Rapport</button>
        <button type="button" data-action="json">Exporter JSON</button>
        <button type="button" data-action="print">Imprimer / PDF</button>
      </div>
    `;
  }

  function renderMeta() {
    return `
      <div class="meta-panel no-print">
        <label>N° unique dossier<input name="record_id" readonly></label>
        <label>Inspecteur / Contrôleur<input name="inspecteur_nom"></label>
        <label>Province<input name="province" list="dl-provinces"></label>
        <label>Antenne / Direction<input name="antenne"></label>
        <label>Statut
          <select name="statut_dossier">
            <option>En cours</option>
            <option>Conforme</option>
            <option>Non conforme</option>
            <option>Observation</option>
            <option>Avertissement</option>
            <option>Mise en demeure</option>
            <option>PV CI</option>
            <option>Transmission hiérarchie</option>
          </select>
        </label>
      </div>
    `;
  }

  function renderQR() {
    return `
      <div class="qr-box">
        <img id="qrImg" alt="QR Code formulaire">
        <canvas id="qrFallback" width="140" height="140"></canvas>
        <div id="qrLabel">QR</div>
      </div>
    `;
  }
  
   
  function renderAIDrawer() {
    return `
      <section class="ai-drawer" id="aiDrawer">
        <button type="button" class="close-ai" data-action="close-ai">Fermer</button>
        <h2>IA embarquée — analyse, conformité et rapport</h2>
        <textarea name="observations_ai" id="aiText"></textarea>
      </section>
    `;
  }

  function renderForm(d) {
    const effectifs = d.effectifs.map((k, i) => k === "expatList" ? renderExpatList() : renderEffectifBlock(k, i)).join("");

    const body = d.code === "S03"
      ? `
        ${renderHeader(d)}
        ${renderInfo(d)}
        <div class="short-spacer"></div>
      `
      : `
        ${renderHeader(d)}
        ${renderInfo(d)}
        ${effectifs}
        ${renderDocs(d)}
        ${renderSignatures(d)}
        ${renderAdmin(d)}
      `;

    app.innerHTML = `
      ${renderToolbar(d)}
      ${datalists()}
      <div class="sheet-wrap">
        <section class="sheet ${d.code === "S03" ? "short-sheet" : ""}" id="officialSheet">
          <form id="inspectionForm" autocomplete="off">
            ${renderMeta()}
            ${body}
          </form>
          ${renderQR()}
        </section>
      </div>
      ${renderAIDrawer()}
    `;
  }

  function formatPhone243(value) {
    let d = String(value || "").replace(/\D/g, "");
    if (d.startsWith("243")) d = d.slice(3);
    if (d.startsWith("0")) d = d.slice(1);
    d = d.slice(0, 9);
    if (!d) return "";
    return "+243 " + d.replace(/(\d{3})(\d{3})(\d{0,3})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(" "));
  }

  function bindStatusCells() {
    document.addEventListener("click", e => {
      const status = e.target.closest(".status-cell");
      if (status) {
        const group = status.dataset.group;
        document.querySelectorAll(`.status-cell[data-group="${CSS.escape(group)}"]`).forEach(c => {
          c.classList.remove("selected");
          c.textContent = "";
        });
        status.classList.add("selected");
        status.textContent = "✓";
 }

  const dec = e.target.closest(".decision-cell");
      if (dec) {
        const group = dec.dataset.decision;
        document.querySelectorAll(`.decision-cell[data-decision="${CSS.escape(group)}"]`).forEach(c => {
          c.classList.remove("selected");
          c.textContent = "";
        });
        dec.classList.add("selected");
        dec.textContent = "✓";
      }

      const rate = e.target.closest(".rate-box");
      if (rate) {
        document.querySelectorAll(".rate-box").forEach(b => b.classList.remove("selected"));
        rate.classList.add("selected");
      }
    });
  }

  function bindTotals() {
    document.addEventListener("input", e => {
      if (!e.target.closest(".effectif-inputs")) return;
      document.querySelectorAll(".effectif-inputs").forEach(row => {
        for (let i = 0; i < 3; i++) {
          const h = row.querySelector(`[name$="_${i}_h"]`);
          const f = row.querySelector(`[name$="_${i}_f"]`);
          const t = row.querySelector(`[name$="_${i}_t"]`);
          if (h && f && t) {
            t.value = (Number(h.value || 0) + Number(f.value || 0)) || "";
          }
        }
      });
    });
  }

  function initSignaturePad(canvas) {
    const ctx = canvas.getContext("2d");
    let drawing = false;
    let last = null;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const old = canvas.toDataURL();
      canvas.width = Math.max(1, Math.floor(rect.width * ratio));
      canvas.height = Math.max(1, Math.floor(rect.height * ratio));
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.lineWidth = 1.6;
      ctx.strokeStyle = "#000";
      if (old && old.length > 100) {
        const img = new Image();
        img.onload = () => ctx.drawImage(img, 0, 0, rect.width, rect.height);
        img.src = old;
      }
    }

    function point(ev) {
      const r = canvas.getBoundingClientRect();
      return { x: ev.clientX - r.left, y: ev.clientY - r.top };
    }

    canvas.addEventListener("pointerdown", ev => {
      ev.preventDefault();
      canvas.setPointerCapture(ev.pointerId);
      drawing = true;
      last = point(ev);
    });

    canvas.addEventListener("pointermove", ev => {
      if (!drawing) return;
      ev.preventDefault();
      const p = point(ev);
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      last = p;
      stampTime();
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach(type => {
      canvas.addEventListener(type, () => {
        drawing = false;
        last = null;
      });
    });

    resize();
    window.addEventListener("resize", resize);
  }

  function bindSignatures() {
    document.querySelectorAll(".signature-pad").forEach(initSignaturePad);

    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-clear-signature]");
      if (!btn) return;
      const who = btn.dataset.clearSignature;
      const canvas = document.querySelector(`canvas[data-signature="${CSS.escape(who)}"]`);
      if (!canvas) return;
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      stampTime();
    });
  }

  function stampTime() {
    const el = document.querySelector('[name="horodatage_signature"]');
    if (el) el.value = new Date().toLocaleString("fr-CD");
  }

  function initDefaults() {
    const id = document.querySelector('[name="record_id"]');
    if (id && !id.value) id.value = uniqueId();

    const d = document.querySelector('[name="date_signature"]');
    if (d && !d.value) d.value = new Date().toLocaleDateString("fr-CD");

    stampTime();
    updateQR();
  }

  function uniqueId() {
    const now = new Date();
    const pad = n => String(n).padStart(2, "0");
    return `${CURRENT_CODE}-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  function bindInputs() {
    document.addEventListener("blur", e => {
      if (e.target.matches("[data-phone='1']")) {
        e.target.value = formatPhone243(e.target.value);
      }
    }, true);

    document.addEventListener("input", e => {
      if (e.target.name === "record_id" || e.target.name === "numero_formulaire" || e.target.name === "raison") {
        updateQR();
      }
    });
  }

  function collectData() {
    const form = document.getElementById("inspectionForm");
    const fields = Object.fromEntries(new FormData(form).entries());

    const statuses = {};
    document.querySelectorAll(".status-cell.selected").forEach(c => {
      statuses[c.dataset.group] = c.dataset.value;
    });

    const decisions = {};
    document.querySelectorAll(".decision-cell.selected").forEach(c => {
      decisions[c.dataset.decision] = c.dataset.value;
    });

    const rates = {};
    document.querySelectorAll(".rate-box.selected").forEach(c => {
      rates[c.parentElement.dataset.rateGroup || "reserve_it_ct"] = c.dataset.rate;
    });

    const signatures = {};
    document.querySelectorAll(".signature-pad").forEach(c => {
      signatures[c.dataset.signature] = c.toDataURL("image/png");
    });

    return {
      id: fields.record_id || uniqueId(),
      code: CURRENT_CODE,
      savedAt: new Date().toISOString(),
      fields,
      statuses,
      decisions,
      rates,
      signatures
    };
  }

  function applyData(data) {
    if (!data) return;

    Object.entries(data.fields || {}).forEach(([k, v]) => {
      const el = document.querySelector(`[name="${CSS.escape(k)}"]`);
      if (el) el.value = v;
    });

    document.querySelectorAll(".status-cell").forEach(c => {
      c.classList.remove("selected");
      c.textContent = "";
      if ((data.statuses || {})[c.dataset.group] === c.dataset.value) {
        c.classList.add("selected");
        c.textContent = "✓";
      }
    });

    document.querySelectorAll(".decision-cell").forEach(c => {
      c.classList.remove("selected");
      c.textContent = "";
      if ((data.decisions || {})[c.dataset.decision] === c.dataset.value) {
        c.classList.add("selected");
        c.textContent = "✓";
      }
    });

    document.querySelectorAll(".rate-box").forEach(c => {
      c.classList.remove("selected");
      if ((data.rates || {}).reserve_it_ct === c.dataset.rate) c.classList.add("selected");
    });

    Object.entries(data.signatures || {}).forEach(([who, src]) => {
      const canvas = document.querySelector(`canvas[data-signature="${CSS.escape(who)}"]`);
      if (!canvas || !src) return;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1));
      };
      img.src = src;
    });

    updateQR();
  }

  function storageKey() {
    return "InspecteurBotRDC:archives";
  }

  function readArchives() {
    try {
      return JSON.parse(localStorage.getItem(storageKey()) || "[]");
    } catch {
      return [];
    }
  }

  function writeArchives(arr) {
    localStorage.setItem(storageKey(), JSON.stringify(arr));
  }

  function saveData() {
    const data = collectData();
    const archives = readArchives();
    const existing = archives.find(x => x.id === data.id);

    const historyEntry = {
      at: new Date().toISOString(),
      by: data.fields.inspecteur_nom || "",
      province: data.fields.province || "",
      antenne: data.fields.antenne || "",
      statut: data.fields.statut_dossier || ""
    };

    if (existing) {
      Object.assign(existing, data);
      existing.history = [...(existing.history || []), historyEntry];
    } else {
      data.history = [historyEntry];
      archives.push(data);
    }

    writeArchives(archives);
    updateQR();

    window.parent?.postMessage({
      type: "InspecteurBot:formSaved",
      payload: {
        id: data.id,
        code: data.code,
        province: data.fields.province,
        antenne: data.fields.antenne,
        statut: data.fields.statut_dossier,
        savedAt: data.savedAt
      }
    }, "*");

    alert(`Formulaire ${CURRENT_CODE} enregistré : ${data.id}`);
  }

  function loadLatest() {
    const latest = readArchives()
      .filter(x => x.code === CURRENT_CODE)
      .sort((a, b) => String(b.savedAt).localeCompare(String(a.savedAt)))[0];

    if (!latest) {
      alert("Aucune archive trouvée pour cette fiche.");
      return;
    }

    applyData(latest);
    alert(`Archive chargée : ${latest.id}`);
  }

  function exportJSON() {
    const data = collectData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${data.id}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function updateQR() {
    const data = collectDataSafe();
    const id = data?.fields?.record_id || uniqueId();
    const payload = JSON.stringify({
      id,
      code: CURRENT_CODE,
      n: data?.fields?.numero_formulaire || "",
      entreprise: data?.fields?.raison || "",
      date: new Date().toISOString()
    });

    const img = document.getElementById("qrImg");
    const label = document.getElementById("qrLabel");
    const canvas = document.getElementById("qrFallback");

    if (label) label.textContent = id;

    if (img) {
      img.onerror = () => {
        img.style.display = "none";
        drawPseudoQR(canvas, payload);
      };
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=1&data=${encodeURIComponent(payload)}`;
    }
  }

  function collectDataSafe() {
    try {
      return collectData();
    } catch {
      return null;
    }
  }

  function drawPseudoQR(canvas, text) {
    if (!canvas) return;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    const n = 21;
    const cell = canvas.width / n;
    let hash = 0;
    for (const ch of text) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        const finder =
          (x < 7 && y < 7) ||
          (x > n - 8 && y < 7) ||
          (x < 7 && y > n - 8);
        const bit = finder || (((x * 31 + y * 17 + hash) & 7) < 3);
        if (bit) ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }

  function legalArticle(text) {
    const t = String(text || "");
    const m = t.match(/article[s]?\s*([0-9]+(?:\s*à\s*[0-9]+)?)/i);
    if (m) return `Article ${m[1]} du Code du Travail`;
    if (/SMIG/i.test(t)) return "SMIG — dispositions réglementaires applicables";
    if (/CNSS/i.test(t)) return "Législation de sécurité sociale / CNSS";
    if (/ONEM|carte pour expatriés|CNEE/i.test(t)) return "Réglementation emploi des expatriés / ONEM / CNEE";
    if (/hygiène|sanitaire|secours|CHSE|VIH/i.test(t)) return "Dispositions relatives à l’hygiène, santé et sécurité au travail";
    if (/sécurité|risques|machines|électriques|gaz|compresseur|souder/i.test(t)) return "Dispositions relatives à la sécurité technique";
    return "";
  }

  function runAI() {
    const data = collectData();
    const f = data.fields || {};
    const missing = [];

    document.querySelectorAll("[data-required='1']").forEach(input => {
      if (!input.value.trim()) missing.push(input.closest(".seg")?.querySelector("span")?.textContent.replace(":", "") || input.name);
    });

    const infractions = [];
    document.querySelectorAll(".docs tr").forEach((tr, i) => {
      const label = tr.querySelector(".doc-label")?.innerText?.trim();
      if (!label) return;
      const selected = [...tr.querySelectorAll(".status-cell")].find(c => c.classList.contains("selected"));
      if (selected && selected.dataset.value !== "E") {
        infractions.push({
          document: label,
          statut: selected.dataset.value,
          article: legalArticle(label)
        });
      }
    });

    const decision = infractions.length
      ? "Non conforme — recommander mise en demeure et/ou PV de constat d’infraction selon gravité."
      : "Aucune non-conformité documentaire détectée dans les cases cochées.";

       const obs = [
      `FORMULAIRE : ${CURRENT_CODE}`,
      `DOSSIER : ${f.record_id || ""}`,
      `ENTREPRISE / ENTITE : ${f.raison || f.province_entite || ""}`,
      `Inspecteur / Contrôleur : ${f.inspecteur_nom || ""}`,
      "",
      "1. Informations manquantes détectées :",
      missing.length ? missing.map(x => `- ${x}`).join("\n") : "- Néant",
      "",
      "2. Non-conformités / infractions probables :",
      infractions.length
        ? infractions.map(x => `- ${x.document} : statut ${x.statut}${x.article ? " — " + x.article : ""}`).join("\n")
        : "- Néant",
      "",
      "3. Articles / bases légales à vérifier :",
      infractions.length
        ? [...new Set(infractions.map(x => x.article).filter(Boolean))].map(x => `- ${x}`).join("\n")
        : "- Néant",
      "",
      "4. Mesures correctives recommandées :",
      infractions.length
        ? "- Exiger la présentation ou la régularisation des pièces manquantes/non conformes.\n- Fixer un délai administratif.\n- Prévoir une contre-visite.\n- En cas de persistance, dresser PV CI et transmettre à la hiérarchie."
        : "- Maintenir la conformité et archiver la fiche.",
      "",
      "5. Suite administrative suggérée :",
      `- ${decision}`,
      "",
      "6. Observation proposée de l’inspecteur :",
      infractions.length
        ? "L’employeur est invité à régulariser les manquements relevés et à présenter les justificatifs requis dans le délai imparti, faute de quoi les suites prévues par la législation du travail pourront être engagées."
        : "La visite n’a pas révélé de manquement documentaire majeur sur les éléments cochés comme examinés."
    ].join("\n");

    const aiText = document.getElementById("aiText");
    if (aiText) aiText.value = obs;

    const conclusion = document.querySelector('[name="conclusion_visite"]');
    if (conclusion && !conclusion.value.trim()) {
      conclusion.value = infractions.length ? "Non conforme — régularisation requise." : "Conforme sous réserve des observations.";
    }

    document.getElementById("aiDrawer")?.classList.add("open");
  }

  function startDictation() {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      alert("Dictée vocale non disponible sur ce navigateur. Utilisez Chrome/Edge ou Safari compatible.");
      return;
    }

    const target =
      document.activeElement?.matches?.("input, textarea")
        ? document.activeElement
        : document.querySelector('[name="conclusion_visite"], textarea, input');

    if (!target) return;

    const rec = new Recognition();
    rec.lang = "fr-FR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    
    rec.onresult = ev => {
      const text = ev.results[0][0].transcript;
      target.value = `${target.value ? target.value + " " : ""}${text}`;
      target.dispatchEvent(new Event("input", { bubbles: true }));
    };

    rec.onerror = () => alert("Erreur dictée vocale.");
    rec.start();
  }

  function generateReport() {
    runAI();
    const data = collectData();
    const ai = document.getElementById("aiText")?.value || "";
    const report = `
RAPPORT DE VISITE - INSPECTION DU TRAVAIL RDC

Fiche : ${CURRENT_CODE}
N° dossier : ${data.fields.record_id || ""}
Entreprise / Entité : ${data.fields.raison || data.fields.province_entite || ""}
Province : ${data.fields.province || ""}
Antenne / Direction : ${data.fields.antenne || ""}
Inspecteur / Contrôleur : ${data.fields.inspecteur_nom || ""}
Statut : ${data.fields.statut_dossier || ""}

${ai}
    `.trim();

    const w = window.open("", "_blank");
    if (!w) return;
    w.document.write(`
      <html lang="fr">
      <head>
        <title>Rapport ${esc(data.fields.record_id || CURRENT_CODE)}</title>
        <style>
          body{font-family:Arial, sans-serif; padding:30px; line-height:1.45;}
          h1{color:#004e82;}
          pre{white-space:pre-wrap; font-family:Arial, sans-serif;}
          @page{size:A4; margin:15mm;}
        </style>
      </head>
      <body>
        <h1>Rapport automatique - InspecteurBot IA RDC</h1>
        <pre>${esc(report)}</pre>
        <script>window.print();<\/script>
      </body>
      </html>
    `);
    w.document.close();
  }

  function bindToolbar() {
    document.addEventListener("click", e => {
      const btn = e.target.closest("[data-action]");
      if (!btn) return;

      const action = btn.dataset.action;

      if (action === "save") saveData();
      if (action === "load") loadLatest();
      if (action === "ai") runAI();
      if (action === "dictation") startDictation();
      if (action === "report") generateReport();
      if (action === "json") exportJSON();
      if (action === "print") window.print();
      if (action === "close-ai") document.getElementById("aiDrawer")?.classList.remove("open");
    });
      }

     function exposeDashboardAPI() {
    window.InspecteurBotForm = {
      code: CURRENT_CODE,
      save: saveData,
      loadLatest,
      exportJSON,
      runAI,
      collectData,
      applyData
    };
  }

  renderForm(def);
  bindStatusCells();
  bindTotals();
  bindSignatures();
  bindInputs();
  bindToolbar();
  initDefaults();
  exposeDashboardAPI();

})();



    
    
 
