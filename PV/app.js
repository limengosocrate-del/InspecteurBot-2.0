/* ==========================================================================
   INSPECTEURBOT - DASHBOARD PROCÈS-VERBAUX
   - A4
   - Archives
   - Signature tactile
   - QR Code
   - IA d'assistance
   - Impression
   - Export PDF
   - IndexedDB local + synchronisation serveur optionnelle
   ========================================================================== */

const APP = document.querySelector("#app");
const API = "/api";
const DB_NAME = "inspecteurbot-pv-premium";
const DB_VERSION = 1;
const LOGO = "./assets/logo-igt-rdc.png";

const esc = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const uid = () =>
  crypto.randomUUID
    ? crypto.randomUUID()
    : `pv-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const today = () => new Date().toISOString().slice(0, 10);

const clone = (value) => JSON.parse(JSON.stringify(value));

const debounce = (callback, delay = 700) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args), delay);
  };
};

/* -------------------------------------------------------------------------- */
/*                                  INDEXED DB                                */
/* -------------------------------------------------------------------------- */

const Store = {
  db: null,

  async open() {
    if (this.db) return this.db;

    this.db = await new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = () => {
        const db = request.result;

        if (!db.objectStoreNames.contains("pvs")) {
          const pvs = db.createObjectStore("pvs", { keyPath: "id" });

          pvs.createIndex("status", "status", { unique: false });
          pvs.createIndex("updatedAt", "updatedAt", { unique: false });
          pvs.createIndex("reference", "reference", { unique: false });
          pvs.createIndex("qrToken", "qrToken", { unique: false });
        }

        if (!db.objectStoreNames.contains("sequences")) {
          db.createObjectStore("sequences", { keyPath: "key" });
        }
      };

      request.onsuccess = () => resolve(request.result);
    });

    return this.db;
  },

  async getAll() {
    const db = await this.open();

    return new Promise((resolve, reject) => {
      const tx = db.transaction("pvs", "readonly");
      const request = tx.objectStore("pvs").getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  },

  async get(id) {
    const db = await this.open();

    return new Promise((resolve, reject) => {
      const tx = db.transaction("pvs", "readonly");
      const request = tx.objectStore("pvs").get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  },

  async put(pv) {
    const db = await this.open();

    return new Promise((resolve, reject) => {
      const tx = db.transaction("pvs", "readwrite");

      tx.objectStore("pvs").put(pv);

      tx.oncomplete = () => resolve(pv);
      tx.onerror = () => reject(tx.error);
    });
  },

  async remove(id) {
    const db = await this.open();

    return new Promise((resolve, reject) => {
      const tx = db.transaction("pvs", "readwrite");

      tx.objectStore("pvs").delete(id);

      tx.oncomplete = () => resolve(true);
      tx.onerror = () => reject(tx.error);
    });
  },

  async reserveReference(format, context) {
    const db = await this.open();

    return new Promise((resolve, reject) => {
      const tx = db.transaction("sequences", "readwrite");
      const store = tx.objectStore("sequences");

      const key = `${context.year}-${context.provinceCode}-${format}`;
      const request = store.get(key);

      request.onsuccess = () => {
        const next = Number(request.result?.value || 0) + 1;

        store.put({
          key,
          value: next,
          updatedAt: new Date().toISOString()
        });

        const reference = format
          .replace(/\{sequence(?::(\d+))?\}/g, (_, digits) => {
            return String(next).padStart(Number(digits || 1), "0");
          })
          .replaceAll("{year}", context.year)
          .replaceAll("{provinceCode}", context.provinceCode || "KIN")
          .replaceAll("{serviceCode}", context.serviceCode || "IPT");

        resolve(reference);
      };

      request.onerror = () => reject(request.error);
    });
  }
};

/* -------------------------------------------------------------------------- */
/*                              TEXTES OFFICIELS                              */
/* -------------------------------------------------------------------------- */

const LEGAL_MODERN =
  "Conformément aux dispositions des articles 167-169 du Code du Travail et de l’arrêté ministériel n°12/CAB.MIN/ETPS/043/2008 du 08 Août 2008 fixant les conditions d’organisation et de fonctionnement du Comité de Sécurité, d’Hygiène et d’Embellissement des lieux de travail.";

const LEGAL_OLD =
  "Conformément aux dispositions des articles 167-169 et de l’Arrêté Ministériel n°12/CAB.MIN/ETPS/043/2008/2008 du 08/08 fixant les conditions d’organisation et de fonctionnement des Comités de Sécurité, d’Hygiène et d’Embellissement des lieux de travail.";

const COMMITTEE_TITLE =
  "PROCES-VERBAL D’INSTALLATION DU COMITE DE SECURITE, D’HYGIENE ET D’EMBELLISSEMENT DES LIEUX DE TRAVAIL";

const COMMITTEE_TITLE_OLD =
  "PROCES-VERBAL D’INSTALLATION DU COMITE DE SECURITE D’HYGIENE ET D’EMBELISSEMENT DES LIEUX DE TRAVAIL";

/* -------------------------------------------------------------------------- */
/*                                MODELES PV                                  */
/* -------------------------------------------------------------------------- */

const MODELS = [
  {
    id: "non-conciliation-litige-individuel",
    type: "nonconc",
    category: "Litige individuel",
    name: "PV de non-conciliation de litige individuel du Travail",
    description:
      "Modèle officiel en trois pages : déclaration, constat, conclusion, proposition et désaccord."
  },

  {
    id: "installation-asbl-saint-vincent",
    type: "committee",
    category: "Comité sécurité",
    name: "Installation du Comité — ASBL Saint Vincent de Paul",
    description:
      "Version avec Président, Vice-Président, Secrétaire et cinq membres.",
    title: COMMITTEE_TITLE,
    legalText: LEGAL_MODERN,
    footer: "Visa de l’Inspection du Travail",
    roleStyle: "columns",
    roles: [
      { key: "president", label: "Président", number: 1 },
      {
        key: "vicePresident",
        label: "Vice-Président, chargé de l’Hygiène et Sécurité au travail",
        number: 2
      },
      { key: "secretary", label: "Secrétaire", number: 3 }
    ],
    membersStart: 1,
    defaultMembers: 5,
    inspectorRank:
      "Contrôleur Principal du Travail de 1ère classe et Officier de Police Judiciaire"
  },

  {
    id: "installation-pungwe-courte",
    type: "committee",
    category: "Comité sécurité",
    name: "Installation du Comité — Fondation Maison PUNGWE",
    description:
      "Version PUNGWE courte : Inspecteur Principal du Travail de 2ème classe.",
    title: COMMITTEE_TITLE,
    legalText: LEGAL_MODERN,
    footer: "Visa de l’Inspection du Travail",
    roleStyle: "columns",
    roles: [
      { key: "president", label: "Président", number: 4 },
      {
        key: "vicePresident",
        label: "Vice-Président, chargé de l’Hygiène et Sécurité au travail",
        number: 5
      },
      { key: "secretary", label: "Secrétaire", number: 6 }
    ],
    membersStart: 6,
    defaultMembers: 5,
    inspectorRank:
      "Inspecteur Principal du Travail de 2ème classe et Officier de Police Judiciaire"
  },

  {
    id: "installation-pungwe-complete",
    type: "committee",
    category: "Comité sécurité",
    name: "Installation du Comité — Fondation PUNGWE complète",
    description:
      "Version avec compétence restreinte en matière du Travail.",
    title: COMMITTEE_TITLE,
    legalText: LEGAL_MODERN,
    footer: "Visa de l’Inspection du Travail",
    roleStyle: "columns",
    roles: [
      { key: "president", label: "Président", number: 7 },
      {
        key: "vicePresident",
        label: "Vice-Président, chargé de l’Hygiène et Sécurité au travail",
        number: 8
      },
      { key: "secretary", label: "Secrétaire", number: 9 }
    ],
    membersStart: 11,
    defaultMembers: 5,
    inspectorRank:
      "Inspecteur Principal du Travail de 2ème classe et Officier de Police Judiciaire à compétence restreinte en matière du Travail près l’Inspection Générale du Travail"
  },

  {
    id: "installation-bio-agro-business",
    type: "committee",
    category: "Comité sécurité",
    name: "Installation du Comité — BIO AGRO BUSINESS",
    description:
      "Version BIO AGRO BUSINESS avec Président, Secrétaire et membres.",
    title: COMMITTEE_TITLE_OLD,
    legalText: LEGAL_OLD,
    footer: "Visa de l’Inspection du Travail",
    roleStyle: "inline",
    roles: [
      { key: "president", label: "Président", number: 1 },
      { key: "secretary", label: "Secrétaire", number: 2 }
    ],
    membersStart: 3,
    defaultMembers: 3,
    inspectorRank:
      "Inspecteur Principal du Travail de 2ème classe et Officier de Police Judiciaire à compétence restreinte en matière du Travail près l’Inspection Générale du Travail"
  },

  {
    id: "installation-sainte-catherine-2018",
    type: "committee",
    category: "Comité sécurité",
    name: "Installation du Comité — Sainte Catherine 2018",
    description:
      "Version Groupe scolaire Sainte Catherine, modèle de l’année 2018.",
    title: COMMITTEE_TITLE_OLD,
    legalText: LEGAL_OLD,
    footer: "Inspecteur Principale du Travail de 2ème classe",
    roleStyle: "inline",
    roles: [
      { key: "president", label: "Président", number: 4 },
      { key: "secretary", label: "Secrétaire", number: 5 }
    ],
    membersStart: 6,
    defaultMembers: 3,
    inspectorRank:
      "Inspecteur Principal du Travail de 2ème classe et Officier de Police Judiciaire à compétence restreinte en matière du Travail près l’Inspection Générale du Travail"
  },

  {
    id: "installation-sainte-catherine-2020",
    type: "committee",
    category: "Comité sécurité",
    name: "Installation du Comité — Sainte Catherine 2020",
    description:
      "Version Groupe scolaire Sainte Catherine, modèle de l’année 2020.",
    title: COMMITTEE_TITLE_OLD,
    legalText: LEGAL_OLD,
    footer: "Inspecteur Principale du Travail de 2ème classe",
    roleStyle: "inline",
    roles: [
      { key: "president", label: "Président", number: 7 },
      { key: "secretary", label: "Secrétaire", number: 8 }
    ],
    membersStart: 9,
    defaultMembers: 6,
    inspectorRank:
      "Inspecteur Principal du Travail de 2ème classe et Officier de Police Judiciaire à compétence restreinte en matière du Travail près l’Inspection Générale du Travail"
  },

  {
    id: "composition-comite-marguerite",
    type: "composition",
    category: "Composition comité",
    name: "Composition du Comité — Complexe scolaire Marguerite",
    description:
      "PV de composition du Comité de Sécurité, d’Hygiène et d’Embellissement."
  },

  {
    id: "installation-comite-marguerite",
    type: "committee",
    category: "Comité sécurité",
    name: "Installation du Comité — Complexe scolaire Marguerite",
    description:
      "PV d’installation du Comité pour le Complexe scolaire Marguerite.",
    title: COMMITTEE_TITLE_OLD,
    legalText: LEGAL_OLD,
    footer: "Contrôleur du Travail",
    roleStyle: "inline",
    roles: [
      { key: "president", label: "Président", number: 1 },
      { key: "secretary", label: "Secrétaire", number: 2 }
    ],
    membersStart: 3,
    defaultMembers: 3,
    inspectorRank:
      "Inspecteur Principal du Travail de 2ème classe et Officier de Police Judiciaire à compétence restreinte en matière du Travail près l’Inspection Générale du Travail"
  }
];

const getModel = (id) => MODELS.find((model) => model.id === id);

/* -------------------------------------------------------------------------- */
/*                            CONVERSION DATE FRANCAISE                       */
/* -------------------------------------------------------------------------- */

function frenchNumber(n) {
  const small = [
    "zéro",
    "un",
    "deux",
    "trois",
    "quatre",
    "cinq",
    "six",
    "sept",
    "huit",
    "neuf",
    "dix",
    "onze",
    "douze",
    "treize",
    "quatorze",
    "quinze",
    "seize"
  ];

  if (n <= 16) return small[n];
  if (n < 20) return `dix-${small[n - 10]}`;

  const tens = {
    20: "vingt",
    30: "trente",
    40: "quarante",
    50: "cinquante",
    60: "soixante",
    70: "soixante-dix",
    80: "quatre-vingt",
    90: "quatre-vingt-dix"
  };

  if (n < 100) {
    const ten = Math.floor(n / 10) * 10;
    const rest = n % 10;

    if (n < 70 || n >= 80) {
      if (rest === 0) return tens[ten];
      if (rest === 1 && ten !== 80) return `${tens[ten]} et un`;
      return `${tens[ten]}-${frenchNumber(rest)}`;
    }

    if (n < 80) {
      const rest70 = n - 60;
      return rest70 === 11
        ? "soixante et onze"
        : `soixante-${frenchNumber(rest70)}`;
    }

    return `quatre-vingt-${frenchNumber(n - 80)}`;
  }

  if (n < 1000) {
    const hundred = Math.floor(n / 100);
    const rest = n % 100;
    const prefix = hundred === 1 ? "cent" : `${frenchNumber(hundred)} cent`;

    return rest ? `${prefix} ${frenchNumber(rest)}` : prefix;
  }

  if (n < 10000) {
    const thousand = Math.floor(n / 1000);
    const rest = n % 1000;
    const prefix = thousand === 1 ? "mille" : `${frenchNumber(thousand)} mille`;

    return rest ? `${prefix} ${frenchNumber(rest)}` : prefix;
  }

  return String(n);
}

function legalDate(dateValue) {
  const [year, month, day] = String(dateValue || today())
    .split("-")
    .map(Number);

  const months = [
    "",
    "janvier",
    "février",
    "mars",
    "avril",
    "mai",
    "juin",
    "juillet",
    "août",
    "septembre",
    "octobre",
    "novembre",
    "décembre"
  ];

  const dayWord = day === 1 ? "premier" : `${frenchNumber(day)}ième`;

  return `L’an ${frenchNumber(year)}, le ${dayWord} jour du mois de ${months[month]}`;
}

/* -------------------------------------------------------------------------- */
/*                              ETAT APPLICATION                              */
/* -------------------------------------------------------------------------- */

const state = {
  view: "dashboard",
  documents: [],
  current: null,
  theme: localStorage.getItem("pv-theme") || "light",
  archiveQuery: "",
  archiveStatus: "",
  archiveType: "",
  aiIdeas: [],
  aiTarget: "claimStatement"
};

document.documentElement.dataset.theme = state.theme;

/* -------------------------------------------------------------------------- */
/*                              CREATION D'UN PV                              */
/* -------------------------------------------------------------------------- */

function defaultDocument(modelId) {
  const model = getModel(modelId);
  const now = new Date().toISOString();

  const base = {
    id: uid(),
    uniqueId: uid(),
    qrToken: uid(),
    qrDataUrl: "",
    reference: "",
    modelId: model.id,
    modelName: model.name,
    type: model.type,
    status: "draft",
    favorite: false,
    strictOriginal: false,
    securityLayer: true,
    copies: ["Original", "Copie Employeur", "Copie Travailleur", "Copie Inspection"],
    createdAt: now,
    updatedAt: now,
    finalizedAt: null,
    deletedAt: null,
    integrityHash: "",
    attachments: [],
    signatures: {},
    history: [
      {
        date: now,
        action: "Création du brouillon"
      }
    ],
    data: {
      date: today(),
      location: "Kinshasa",
      provinceCode: "KIN",
      serviceCode: "IPT",
      establishment: "",
      participants: "l’Employeur et les Travailleurs",
      inspectorName: "",
      inspectorRank: model.inspectorRank || "",
      periodicity: "trois mois",
      notes: ""
    }
  };

  if (model.type === "nonconc") {
    base.data = {
      ...base.data,
      inspectorRank:
        "Inspecteur Principal du Travail de 1ère Classe et Officier de Police Judiciaire à compétence restreinte en matière du Travail",
      inspectorReferences: "",
      service: "Inspection Générale du Travail",
      claimantName: "",
      claimantId: "",
      claimantAddress: "",
      claimantCommune: "",
      claimantRepresentative: "",
      employerName: "",
      employerShortName: "",
      employerAddress: "",
      employerCommune: "",
      employerRepresentative: "",
      claimStatement: "",
      constats: ["", "", ""],
      conclusion: "",
      proposal: "",
      disagreement: ""
    };
  }

  if (model.type === "committee") {
    base.data.roles = {};

    model.roles.forEach((role) => {
      base.data.roles[role.key] = "";
    });

    base.data.members = Array(model.defaultMembers).fill("");
  }

  if (model.type === "composition") {
    base.data = {
      ...base.data,
      unionMembers: ["", "", ""],
      employerMembers: [""],
      proposedMembers: ["", "", ""]
    };
  }

  return base;
}

/* -------------------------------------------------------------------------- */
/*                           HASH INTEGRITE DOCUMENT                          */
/* -------------------------------------------------------------------------- */

async function documentHash(doc) {
  const source = JSON.stringify({
    reference: doc.reference,
    uniqueId: doc.uniqueId,
    qrToken: doc.qrToken,
    modelId: doc.modelId,
    data: doc.data,
    signatures: doc.signatures,
    finalizedAt: doc.finalizedAt
  });

  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(source)
  );

  return Array.from(new Uint8Array(digest))
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
}

/* -------------------------------------------------------------------------- */
/*                           QR CODE D'AUTHENTICITE                           */
/* -------------------------------------------------------------------------- */

async function ensureQr(doc) {
  if (doc.qrDataUrl) return doc.qrDataUrl;

  const verifyUrl = `${window.location.origin}/verify.html?token=${encodeURIComponent(
    doc.qrToken
  )}`;

  if (!window.QRCode) return "";

  doc.qrDataUrl = await QRCode.toDataURL(verifyUrl, {
    width: 180,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ffffff"
    }
  });

  return doc.qrDataUrl;
}

/* -------------------------------------------------------------------------- */
/*                        SYNCHRONISATION SERVEUR OPTIONNEL                   */
/* -------------------------------------------------------------------------- */

async function remoteFetch(url, options = {}) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) throw new Error("Serveur indisponible");

    return await response.json();
  } catch {
    return null;
  }
}

async function syncDocument(doc) {
  await remoteFetch(`${API}/pvs/${doc.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(doc)
  });
}

async function saveDocument(doc, action = "", saveHistory = false) {
  doc.updatedAt = new Date().toISOString();

  if (action && saveHistory) {
    doc.history.push({
      date: doc.updatedAt,
      action
    });
  }

await Store.put(doc);

  const index = state.documents.findIndex((item) => item.id === doc.id);

  if (index >= 0) state.documents[index] = doc;
  else state.documents.unshift(doc);

  syncDocument(doc);
       }



/* -------------------------------------------------------------------------- */
/*                               REFERENCE PV                                 */
/* -------------------------------------------------------------------------- */

async function reserveReference(doc) {
  const year = String(doc.data.date || today()).slice(0, 4);

  const payload = {
    format: "N°{sequence:3}/IPT/{provinceCode}/{year}",
    year,
    provinceCode: doc.data.provinceCode || "KIN",
    serviceCode: doc.data.serviceCode || "IPT"
  };

  const remote = await remoteFetch(`${API}/references/reserve`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (remote?.reference) return remote.reference;

  return Store.reserveReference(payload.format, payload);
}

/* -------------------------------------------------------------------------- */
/*                              RENDU A4 DOCUMENT                             */
/* -------------------------------------------------------------------------- */

function blank(value, placeholder = "................................") {
  return esc(value || placeholder);
}

function securityLayer(doc) {
  if (doc.strictOriginal || !doc.securityLayer || !doc.qrDataUrl) return "";

  return `
    <div class="doc-security">
      <img src="${doc.qrDataUrl}" alt="QR Code d’authenticité">
      <span>
        ID : ${esc(doc.uniqueId.slice(0, 12))}<br>
        Réf. : ${esc(doc.reference || "Brouillon")}
      </span>
    </div>
  `;
}

function officialHeader(data) {
  return `
    <header class="doc-header">
      <div class="doc-header-left">
        REPUBLIQUE DEMOCRATIQUE DU CONGO<br>
        MINISTERE DE L’EMPLOI, TRAVAIL ET<br>
        PREVOYANCE SOCIALE
      </div>

      <div>
        <img class="doc-logo" src="${LOGO}" alt="Logo IGT">
        <div class="doc-service">
          INSPECTION GENERALE DU TRAVAIL<br>
          ET DE LA PREVOYANCE SOCIALE
        </div>
      </div>

  <div class="doc-header-right">
        ${esc(data.location || "Kinshasa")}, le
      </div>
    </header>
  `;
}

function ncHeader() {
  return `
    <header class="nc-header">
      <img src="${LOGO}" alt="Logo IGT">

      <div class="nc-header-title">
        REPUBLIQUE DEMOCRATIQUE DU CONGO<br>
        Ministère de l’Emploi et Travail<br>
        <span class="blue">Inspection Générale du Travail</span><br>
        <span class="red">Administration Centrale</span>
      </div>
    </header>
  `;
}

function signatureBox(title, signature) {
  return `
    <div class="doc-signature">
      <div>${esc(title)}</div>
      ${
        signature?.dataUrl
          ? `<img src="${signature.dataUrl}" alt="Signature">`
          : "<div></div>"
      }
      ${signature?.signedBy ? `<div>${esc(signature.signedBy)}</div>` : ""}
    </div>
  `;
}

function renderNonConciliation(doc) {
  const d = doc.data;

  const constats = d.constats
    .filter((item) => item.trim())
    .map((item) => `<li>${esc(item)}</li>`)
    .join("");

return `
    <section class="paper">
      ${ncHeader()}

      <div class="doc-title">
        PROCES-VERBAL DE NON CONCILIATION DE LITIGE INDIVIDUEL<br>
        DU TRAVAIL
      </div>

      <div class="doc-reference">
        ${blank(doc.reference, "N°..............................................")}
      </div>

      <p class="doc-p indent">
        ${legalDate(d.date)}, Nous, ${blank(d.inspectorName)},
        ${blank(d.inspectorRank)}, dûment assermenté et identifié sous les
        numéros ${blank(d.inspectorReferences)},
        affecté à ${blank(d.service, "l’Inspection Générale du Travail")},
        nous trouvant à ${blank(d.location, "Kinshasa")}.
      </p>

      <p class="doc-p indent">
        Monsieur/Madame ${blank(d.claimantName)},
        titulaire de la pièce d’identité n°${blank(d.claimantId)},
        résidant à ${blank(d.claimantAddress)},
        Commune de ${blank(d.claimantCommune)},
        demandeur(euse) d’une part
        ${
          d.claimantRepresentative
            ? ` représenté(e) par ${esc(d.claimantRepresentative)}.`
            : "."
        }
      </p>

      <p class="doc-p indent">
        La Société ${blank(d.employerName)}
        ${
          d.employerShortName
            ? ` « ${esc(d.employerShortName)} »`
            : ""
        },
        sise à ${blank(d.employerAddress)},
        Commune de ${blank(d.employerCommune)},
        défenderesse d’autre part
        ${
        d.claimantRepresentative
            ? ` représenté(e) par ${esc(d.claimantRepresentative)}.`
            : "."
        }
      </p>

      <p class="doc-p indent">
        La Société ${blank(d.employerName)}
        ${
          d.employerShortName
            ? ` « ${esc(d.employerShortName)} »`
            : ""
        },
        sise à ${blank(d.employerAddress)},
        Commune de ${blank(d.employerCommune)},
        défenderesse d’autre part
        ${
          d.employerRepresentative
            ? ` représentée par ${esc(d.employerRepresentative)}.`
            : "."
        }
      </p>

      <p class="doc-p indent">
        Entendons le demandeur qui déclare :
        ${blank(d.claimStatement)}
      </p>

      ${securityLayer(doc)}
    </section>

    <section class="paper">
      <div class="doc-section-title">
        I. CONSTAT DE L’INSPECTEUR DU TRAVAIL
      </div>

      <p class="doc-p">
        Il découle des déclarations des parties, de l’épluchage des pièces
        versées au dossier, toutes considérations faites ce qui suit :
      </p>

      <ul class="doc-list">
        ${
          constats ||
          "<li>Les constats de l’Inspecteur du Travail seront renseignés ici.</li>"
       }
      </ul>

      <div class="doc-section-title">II. CONCLUSION</div>

      <p class="doc-p indent">
        ${blank(
          d.conclusion,
          "La conclusion de l’Inspecteur du Travail sera renseignée ici."
        )}
      </p>

      ${securityLayer(doc)}
    </section>

    <section class="paper">
      <div class="doc-section-title">III. PROPOSITION</div>

      <p class="doc-p indent">
        ${blank(
          d.proposal,
          "La proposition de l’Inspecteur du Travail sera renseignée ici."
        )}
      </p>

      <div class="doc-section-title">IV. DESACCORD DES PARTIES</div>

      <p class="doc-p indent">
        ${blank(
          d.disagreement,
          "Après une tentative de conciliation, les parties ne sont pas parvenues à concilier leurs désaccords."
        )}
      </p>

      <p class="doc-p">
        En foi de quoi, le présent procès-verbal est dressé et signé en
        quatre exemplaires par les parties et nous-mêmes dont chacune a reçu
        un original.
      </p>

      <p class="doc-p">
        Jurons que le présent Procès-Verbal est sincère.
      </p>

      <div class="doc-signatures">
        ${signatureBox(
          "Pour la partie Demanderesse",
          doc.signatures.claimant
        )}

        ${signatureBox(
          "Pour la partie Défenderesse",
          doc.signatures.employer
        )}

        ${signatureBox(
          "L’Inspecteur Principal du Travail",
          doc.signatures.inspector
        )}
      </div>

      ${securityLayer(doc)}
    </section>
  `;
}

function renderCommittee(doc) {
  const model = getModel(doc.modelId);
  const d = doc.data;

  const roles = model.roles
    .map((role) => {
      const value = d.roles?.[role.key] || "";

      if (model.roleStyle === "inline") {
        return `
          <div class="role-line inline">
            ${role.number}. ${esc(role.label)} :
            ${blank(value)}
          </div>
        `;
      }

      return `
        <div class="role-line">
          <span>${role.number}.</span>
          <span>${blank(value)}</span>
          <span>: ${esc(role.label)}</span>
        </div>
      `;
           })
    .join("");

  const members = d.members
    .filter((item) => item.trim())
    .map((item, index) => {
      const number = model.membersStart + index;

      return `<li value="${number}">${esc(item)}</li>`;
    })
    .join("");

  return `
    <section class="paper">
      ${officialHeader(d)}

      <div class="doc-title underlined">
        ${esc(model.title)}
      </div>

      <p class="doc-p indent">
        ${legalDate(d.date)}, il s’est tenu au sein de
        ${blank(d.establishment)}, une réunion paritaire entre
        ${blank(d.participants, "l’Employeur et les Travailleurs")}.
      </p>

      <p class="doc-p indent">
        ${esc(model.legalText)}
      </p>

      <p class="doc-p indent">
        Nous soussigné, ${blank(d.inspectorName)},
        ${blank(d.inspectorRank, model.inspectorRank)},
        avons procédé ce jour à la cérémonie d’installation dudit Comité.
        Il s’agit de :
      </p>

      <div class="roles">
        ${roles}
      </div>

      <div class="members-label">Membres :</div>

      <ol class="members-list" start="${model.membersStart}">
        ${members || "<li>................................</li>"}
      </ol>

      <p class="doc-p indent" style="margin-top: 15px">
        Les parties acceptent de se réunir après chaque
        ${blank(d.periodicity, "trois mois")} pour évaluation.
      </p>

      <p class="doc-p indent">
        En foi de quoi le présent procès-verbal d’installation est délivré
        pour servir et valoir ce que de droit.
      </p>

      ${
        !doc.strictOriginal
          ? `
          <div class="doc-signatures">
            ${signatureBox("Pour l’Employeur", doc.signatures.employer)}
            ${signatureBox("Représentants des Travailleurs", doc.signatures.workers)}
            ${signatureBox("Inspecteur / Contrôleur", doc.signatures.inspector)}
          </div>
        `
          : ""
      }

      <div class="doc-visa">${esc(model.footer)}</div>

      ${securityLayer(doc)}
    </section>
  `;
}

function listItems(items) {
  return items
    .filter((item) => item.trim())
    .map((item, index) => `<li>${index + 1}. ${esc(item)}</li>`)
    .join("");
}

function renderComposition(doc) {
  const d = doc.data;

  return `
    <section class="paper">
      <div style="font-size: 11pt; font-weight: 700; margin-bottom: 15px">
        ${blank(d.inspectorName)}
      </div>

      <div class="doc-title">
        PROCES-VERBAL DE LA COMPOSITION D’UN COMITE DE SECURITE D’HYGIENE<br>
        ET D’EMBELLISSEMENT DES LIEUX DE TRAVAIL
      </div>

      <p class="doc-p indent">
        ${legalDate(d.date)}, il s’est tenu au sein de
        ${blank(d.establishment)}, une réunion paritaire entre l’employeur et
        les représentants des travailleurs.
      </p>

      <div class="doc-section-title">I. ETAIENT PRESENTS</div>

      <p class="doc-p"><strong>A. Pour le banc syndical</strong></p>

      <ol class="doc-list">
        ${listItems(d.unionMembers) || "<li>................................</li>"}
      </ol>

      <p class="doc-p"><strong>B. Pour le banc employeur</strong></p>

      <ol class="doc-list">
        ${listItems(d.employerMembers) || "<li>................................</li>"}
      </ol>

      <div class="doc-section-title">II. DE L’ORDRE DU JOUR</div>

      <p class="doc-p indent">
        Un seul point était inscrit à l’ordre du jour à savoir : la composition
        d’un Comité de Sécurité, d’Hygiène et d’Embellissement des lieux de
        travail et des maladies professionnelles au sein du complexe.
      </p>

      <p class="doc-p indent">
        Au cours de ces échanges, il a été décidé de la composition d’un
        comité sus évoqué, et ce, conformément aux articles 167 et 168 de la
        loi n°16/010 du 15 Juillet 2016 modifiant et complétant la loi
        n°015/2002 du 16 Octobre 2002 portant Code du Travail.
      </p>

      <ol class="doc-list">
        ${
          listItems(d.proposedMembers) ||
          "<li>................................</li>"
        }
      </ol>

      <p class="doc-p indent">
        Les parties acceptent de se réunir après chaque trois mois pour évaluation.
      </p>

      <p class="doc-p" style="text-align:center; margin-top: 18px">
        Fait à ${blank(d.location, "Kinshasa")}, le ${esc(d.date)}
      </p>

      <div class="doc-signatures two">
        ${signatureBox(
          "Pour la Délégation Syndicale",
          doc.signatures.union
        )}

        ${signatureBox("Pour l’Employeur", doc.signatures.employer)}
      </div>

      ${securityLayer(doc)}
    </section>
  `;
}

function renderDocument(doc) {
  if (doc.type === "nonconc") return renderNonConciliation(doc);
  if (doc.type === "committee") return renderCommittee(doc);
  return renderComposition(doc);
}

/* -------------------------------------------------------------------------- */
/*                           FORMULAIRES DYNAMIQUES                           */
/* -------------------------------------------------------------------------- */

function field(label, path, value = "", type = "text", full = false) {
  return `
    <div class="field ${full ? "full" : ""}">
    <label>${esc(label)}</label>
      <input
        type="${type}"
        data-bind="${esc(path)}"
        value="${esc(value)}"
      >
    </div>
  `;
}

function textArea(label, path, value = "", full = true) {
  return `
    <div class="field ${full ? "full" : ""}">
      <label>${esc(label)}</label>
      <textarea data-bind="${esc(path)}">${esc(value)}</textarea>
    </div>
  `;
}

function listEditor(title, key, values) {
  return `
    <section class="form-section">
      <div class="toolbar" style="justify-content:space-between">
        <h3>${esc(title)}</h3>

        <button
          class="btn small"
          type="button"
          data-action="list-add"
          data-list="${esc(key)}"
        >
          + Ajouter
        </button>
      </div>

      ${(values || [])
        .map(
          (value, index) => `
          <div class="list-line">
            <input
              type="text"
              data-list="${esc(key)}"
              data-index="${index}"
              value="${esc(value)}"
              placeholder="Saisir une information"
            >

            <button
              class="btn small danger"
              type="button"
              data-action="list-delete"
              data-list="${esc(key)}"
              data-index="${index}"
            >
              ×
            </button>
          </div>
        `
        )
        .join("")}
    </section>
  `;
}

function renderSignatures(doc) {
  let roles = [];

  if (doc.type === "nonconc") {
    roles = [
      ["claimant", "Partie demanderesse"],
      ["employer", "Partie défenderesse"],
      ["inspector", "Inspecteur"]
    ];
  }

  if (doc.type === "committee") {
    roles = [
      ["employer", "Employeur"],
      ["workers", "Travailleurs"],
      ["inspector", "Inspecteur"]
    ];
  }

  if (doc.type === "composition") {
    roles = [
      ["union", "Délégation syndicale"],
      ["employer", "Employeur"]
    ];
  }

  return `
    <section class="form-section">
      <h3>Signatures électroniques</h3>

      <div class="signature-grid">
        ${roles
          .map(([role, label]) => {
            const signature = doc.signatures[role];

            return `
              <div class="signature-card">
                <strong>${esc(label)}</strong>

                ${
                  signature?.dataUrl
                    ? `<img src="${signature.dataUrl}" alt="Signature">`
                    : `<p style="color:var(--muted);font-size:11px">Aucune signature.</p>`
                }

                <button
                  class="btn small primary"
                  type="button"
                  data-action="signature"
                  data-role="${role}"
                >
                  ${signature ? "Modifier" : "Signer"}
                </button>
              </div>
            `;
          })
          .join("")}
      </div>
    </section>
  `;
}

function renderAttachments(doc) {
  return `
    <section class="form-section">
      <h3>Pièces jointes</h3>

       <input
        id="attachment-input"
        type="file"
        multiple
        accept=".pdf,image/*"
      >

      <div style="margin-top:10px">
        ${
          doc.attachments.length
            ? doc.attachments
                .map(
                  (file) => `
                  <div class="attachment-line">
                    <span>${esc(file.name)}</span>

                    <button
                      class="btn small"
                      type="button"
                      data-action="attachment-download"
                      data-file-id="${file.id}"
                    >
                      Télécharger
                    </button>

                    <button
                      class="btn small danger"
                      type="button"
                      data-action="attachment-delete"
                      data-file-id="${file.id}"
                    >
                      ×
                    </button>
                  </div>
                `
                )
                .join("")
            : `<small style="color:var(--muted)">Aucune pièce jointe.</small>`
        }
      </div>
    </section>
  `;
}

function renderNonConciliationForm(doc) {
  const d = doc.data;

  return `
    <section class="form-section">
      <h3>Référence et localisation</h3>

      <div class="fields">
        ${field("Date", "data.date", d.date, "date")}
        ${field("Lieu", "data.location", d.location)}
        ${field("Code province", "data.provinceCode", d.provinceCode)}
        ${field("Référence PV", "reference", doc.reference)}
      </div>
    </section>

    <section class="form-section">
      <h3>Inspecteur / Contrôleur</h3>

      <div class="fields">
        ${field("Nom complet", "data.inspectorName", d.inspectorName, "text", true)}
        ${textArea("Grade et qualité", "data.inspectorRank", d.inspectorRank)}
        ${textArea("Références judiciaires / assermentation", "data.inspectorReferences", d.inspectorReferences)}
        ${field("Service", "data.service", d.service, "text", true)}
      </div>
    </section>

    <section class="form-section">
      <h3>Partie demanderesse</h3>

      <div class="fields">
        ${field("Nom complet", "data.claimantName", d.claimantName, "text", true)}
        ${field("Pièce d’identité", "data.claimantId", d.claimantId)}
        ${field("Commune", "data.claimantCommune", d.claimantCommune)}
        ${field("Adresse", "data.claimantAddress", d.claimantAddress, "text", true)}
        ${field("Avocat / représentant", "data.claimantRepresentative", d.claimantRepresentative, "text", true)}
      </div>
    </section>

     <section class="form-section">
      <h3>Partie défenderesse</h3>

      <div class="fields">
        ${field("Employeur / Société", "data.employerName", d.employerName, "text", true)}
        ${field("Sigle", "data.employerShortName", d.employerShortName)}
        ${field("Commune", "data.employerCommune", d.employerCommune)}
        ${field("Adresse / siège", "data.employerAddress", d.employerAddress, "text", true)}
        ${field("Avocat / représentant", "data.employerRepresentative", d.employerRepresentative, "text", true)}
      </div>
    </section>

    <section class="form-section">
      <h3>Déclaration et décision</h3>

      <div class="fields">
        ${textArea("Exposé du demandeur", "data.claimStatement", d.claimStatement)}
        ${textArea("Conclusion", "data.conclusion", d.conclusion)}
        ${textArea("Proposition", "data.proposal", d.proposal)}
        ${textArea("Désaccord des parties", "data.disagreement", d.disagreement)}
      </div>
    </section>

    ${listEditor("Constats de l’Inspecteur", "constats", d.constats)}
  `;
}

function renderCommitteeForm(doc) {
  const d = doc.data;
  const model = getModel(doc.modelId);

  const roleFields = model.roles
    .map((role) =>
      field(
        role.label,
        `data.roles.${role.key}`,
        d.roles?.[role.key] || "",
        "text",
        true
      )
    )
        .join("");

  return `
    <section class="form-section">
      <h3>Informations générales</h3>

      <div class="fields">
        ${field("Date", "data.date", d.date, "date")}
        ${field("Lieu", "data.location", d.location)}
        ${field("Code province", "data.provinceCode", d.provinceCode)}
        ${field("Établissement / ASBL / Société", "data.establishment", d.establishment, "text", true)}
        ${field("Participants", "data.participants", d.participants, "text", true)}
      </div>
    </section>

    <section class="form-section">
      <h3>Inspecteur / Contrôleur</h3>

      <div class="fields">
        ${field("Nom complet", "data.inspectorName", d.inspectorName, "text", true)}
        ${textArea("Grade et qualité", "data.inspectorRank", d.inspectorRank)}
        ${field("Périodicité", "data.periodicity", d.periodicity)}
      </div>
    </section>

    <section class="form-section">
      <h3>Composition du Comité</h3>
      <div class="fields">${roleFields}</div>
    </section>

    ${listEditor("Membres du Comité", "members", d.members)}
  `;
}

function renderCompositionForm(doc) {
  const d = doc.data;

return `
    <section class="form-section">
      <h3>Informations générales</h3>

      <div class="fields">
        ${field("Date", "data.date", d.date, "date")}
        ${field("Lieu", "data.location", d.location)}
        ${field("Établissement", "data.establishment", d.establishment, "text", true)}
        ${field("Inspecteur / Contrôleur", "data.inspectorName", d.inspectorName, "text", true)}
      </div>
    </section>

    ${listEditor("Membres du banc syndical", "unionMembers", d.unionMembers)}
    ${listEditor("Membres du banc employeur", "employerMembers", d.employerMembers)}
    ${listEditor("Membres proposés du Comité", "proposedMembers", d.proposedMembers)}
  `;
}

function renderAI(doc) {
  if (doc.type !== "nonconc") {
    return `
      <section class="form-section">
        <h3>Assistant IA</h3>
        <small style="color:var(--muted)">
          Ce modèle contient surtout des textes administratifs verrouillés.
          L’IA ne modifie pas les textes fixes officiels.
        </small>
      </section>
    `;
  }

  return `
    <section class="form-section">
      <h3>Assistant IA de rédaction</h3>

      <small style="color:var(--muted);display:block;margin-bottom:9px">
        L’IA ne modifie jamais les textes légaux, les titres, les articles,
        les en-têtes ni les mentions officielles. Elle produit uniquement des
        propositions pour les zones variables.
      </small>

      <div class="field">
        <label>Zone à assister</label>

        <select id="ai-target">
          <option value="claimStatement">Exposé du demandeur</option>
          <option value="constats">Constats de l’Inspecteur</option>
          <option value="conclusion">Conclusion</option>
          <option value="proposal">Proposition</option>
          <option value="disagreement">Désaccord des parties</option>
        </select>
      </div>

      <div class="field" style="margin-top:9px">
        <label>Faits à analyser</label>
        <textarea
          id="ai-facts"
          placeholder="Décrivez les faits du dossier..."
        ></textarea>
      </div>

      <div class="toolbar" style="margin-top:9px">
        <button class="btn primary" type="button" data-action="ai-generate">
          Générer 30 idées
        </button>
      </div>

      <div id="ai-results">
        ${state.aiIdeas
          .map(
            (idea, index) => `
              <div class="ai-result">
                <p>${esc(idea)}</p>

                <button
                  class="btn small"
                  type="button"
                  data-action="ai-apply"
                  data-index="${index}"
                >
                  Utiliser cette proposition
                </button>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function renderEditorForm(doc) {
  const primaryForm =
    doc.type === "nonconc"
      ? renderNonConciliationForm(doc)
      : doc.type === "committee"
        ? renderCommitteeForm(doc)
        : renderCompositionForm(doc);

  return `
    <form id="pv-form">
      ${primaryForm}

      <section class="form-section">
        <h3>Authentification et impression</h3>

        <label style="display:flex;gap:8px;font-size:12px;margin-bottom:8px">
          <input
            type="checkbox"
            data-bind="securityLayer"
            ${doc.securityLayer ? "checked" : ""}
          >
          Ajouter QR Code et identifiant unique
        </label>

         <label style="display:flex;gap:8px;font-size:12px">
          <input
            type="checkbox"
            data-bind="strictOriginal"
            ${doc.strictOriginal ? "checked" : ""}
          >
          Mode original strict : cacher QR Code et signatures ajoutées
        </label>
      </section>

      ${renderAI(doc)}
      ${renderSignatures(doc)}
      ${renderAttachments(doc)}
    </form>
  `;
}

/* -------------------------------------------------------------------------- */
/*                                 DASHBOARD                                  */
/* -------------------------------------------------------------------------- */

function navButton(id, label, icon = "•") {
  return `
    <button
      class="nav-btn ${state.view === id ? "active" : ""}"
      type="button"
      data-view="${id}"
    >
      <span>${icon}</span>
      <span>${label}</span>
    </button>
  `;
}

function layout(content, title, subtitle) {
  APP.innerHTML = `
    <div class="app-layout">
      <aside class="sidebar">
        <div class="brand">
          <img class="brand-logo" src="${LOGO}" alt="IGT">
          <div>
            <h1>InspecteurBot</h1>
            <small>Gestion des Procès-Verbaux</small>
          </div>
        </div>

        <div class="menu-title">Navigation</div>

        ${navButton("dashboard", "Tableau de bord", "⌂")}
        ${navButton("models", "Nouveau Procès-Verbal", "+")}
        ${navButton("archives", "Archives", "▣")}
        ${navButton("favorites", "Favoris", "★")}
        ${navButton("trash", "Corbeille", "⌫")}

        <div class="sidebar-bottom">
          <button class="nav-btn" type="button" data-action="theme">
            ${state.theme === "dark" ? "☀ Mode clair" : "◐ Mode sombre"}
          </button>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <div class="page-title">
            <h2>${esc(title)}</h2>
            <p>${esc(subtitle)}</p>
          </div>

          <div class="top-actions">
            <button class="btn primary" type="button" data-view="models">
              + Nouveau PV
            </button>
           </div>
        </header>

        ${content}
      </main>
    </div>
  `;
}

function showDashboard() {
  state.view = "dashboard";

  const active = state.documents.filter((doc) => doc.status !== "trash");
  const drafts = active.filter((doc) => doc.status === "draft").length;
  const final = active.filter((doc) => doc.status === "final").length;
  const archived = active.filter((doc) => doc.status === "archived").length;
  const recent = [...active]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 7);

  layout(
    `
      <section class="stats-grid">
        <article class="card stat-card">
          <span>Brouillons</span>
          <strong>${drafts}</strong>
        </article>

        <article class="card stat-card">
          <span>PV finalisés</span>
          <strong>${final}</strong>
        </article>

        <article class="card stat-card">
          <span>Archives</span>
          <strong>${archived}</strong>
        </article>

        <article class="card stat-card">
          <span>Total</span>
          <strong>${active.length}</strong>
        </article>
      </section>

      <section class="card card-pad">
        <div class="toolbar" style="justify-content:space-between;margin-bottom:14px">
          <strong>Procès-Verbaux récents</strong>

          <button class="btn small" type="button" data-view="archives">
            Ouvrir les archives
          </button>
        </div>

        ${
          recent.length
            ? `
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Référence</th>
                      <th>Type</th>
                      <th>État</th>
                      <th>Dernière modification</th>
                      <th>Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    ${recent
                      .map(
                        (doc) => `
                        <tr>
                          <td>
                            <strong>${esc(doc.reference || "Brouillon")}</strong><br>
                            <small style="color:var(--muted)">${esc(doc.uniqueId.slice(0, 12))}</small>
                          </td>

                          <td>${esc(doc.modelName)}</td>

                          <td>
                            <span class="status ${doc.status}">
                              ${esc(doc.status)}
                            </span>
                          </td>

                          <td>${new Date(doc.updatedAt).toLocaleString("fr-FR")}</td>

                          <td>
                            <button
                              class="btn small"
                              type="button"
                              data-action="open"
                              data-id="${doc.id}"
                            >
                              Ouvrir
                            </button>
                          </td>
                        </tr>
                      `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>
            `
            : `<div class="empty">Aucun Procès-Verbal enregistré.</div>`
        }
      </section>
    `,
    "Tableau de bord PV",
    "Création, archivage, signatures et authentification des Procès-Verbaux."
  );
}

function showModels() {
  state.view = "models";

  layout(
    `
      <section class="template-grid">
        ${MODELS.map(
          (model) => `
          <article class="card template-card">
            <div>
              <span class="badge">${esc(model.category)}</span>
              <h3>${esc(model.name)}</h3>
              <p>${esc(model.description)}</p>
            </div>

            <button
              class="btn primary"
              type="button"
              data-action="create"
              data-model-id="${model.id}"
            >
              Utiliser ce modèle
            </button>
          </article>
        `
        ).join("")}
      </section>
    `,
    "Nouveau Procès-Verbal",
    "Choisissez le modèle officiel à utiliser."
  );
}

function archiveRows(documents, mode) {
  if (!documents.length) {
    return `<div class="empty">Aucun document trouvé.</div>`;
  }

  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Référence</th>
            <th>Type de PV</th>
            <th>Employeur / Établissement</th>
            <th>Date</th>
            <th>État</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          ${documents
            .map((doc) => {
              const subject =
                doc.data.employerName ||
                doc.data.establishment ||
                doc.data.claimantName ||
                "—";

              return `
                <tr>
                  <td>
                    <strong>${esc(doc.reference || "Brouillon")}</strong><br>
                    <small style="color:var(--muted)">
                      ${esc(doc.uniqueId.slice(0, 12))}
                    </small>
                  </td>

                  <td>${esc(doc.modelName)}</td>
                  <td>${esc(subject)}</td>
                  <td>${esc(doc.data.date || "")}</td>

                  <td>
                    <span class="status ${doc.status}">
                      ${esc(doc.status)}
                    </span>
                  </td>

                  <td>
                    <div class="row-actions">
                      ${
                        mode !== "trash"
                          ? `
                            <button class="btn small" type="button" data-action="open" data-id="${doc.id}">
                              Ouvrir
                            </button>

                            <button class="btn small" type="button" data-action="duplicate" data-id="${doc.id}">
                              Dupliquer
                            </button>

                            <button class="btn small" type="button" data-action="favorite" data-id="${doc.id}">
                              ${doc.favorite ? "★" : "☆"}
                            </button>

                            <button class="btn small danger" type="button" data-action="trash" data-id="${doc.id}">
                              Supprimer
                            </button>
                          `
                          : `
                            <button class="btn small success" type="button" data-action="restore" data-id="${doc.id}">
                              Restaurer
                            </button>

                            <button class="btn small danger" type="button" data-action="destroy" data-id="${doc.id}">
                              Définitif
                            </button>
                          `
                      }
                    </div>
                  </td>
                </tr>
              `;
            })
            .join("")}
        </tbody>
      </table>
    </div>
  `;
}

function filteredDocuments(mode) {
  const query = state.archiveQuery.trim().toLowerCase();

  return state.documents
    .filter((doc) => {
      if (mode === "trash") return doc.status === "trash";
      if (mode === "favorites" && !doc.favorite) return false;
      if (mode !== "trash" && doc.status === "trash") return false;
      if (state.archiveStatus && doc.status !== state.archiveStatus) return false;
      if (state.archiveType && doc.modelId !== state.archiveType) return false;

      if (query) {
        const search = [
          doc.reference,
          doc.modelName,
          doc.data.claimantName,
          doc.data.employerName,
          doc.data.establishment,
          doc.data.inspectorName,
          doc.data.location,
          doc.data.date
        ]
          .join(" ")
          .toLowerCase();

        if (!search.includes(query)) return false;
      }

      return true;
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function showArchives(mode = "archives") {
  state.view = mode;

  const documents = filteredDocuments(mode);

  layout(
    `
      <section class="card card-pad">
        <div class="toolbar" style="justify-content:space-between;margin-bottom:15px">
          <strong>
            ${
              mode === "trash"
                ? "Corbeille"
                : mode === "favorites"
                  ? "Mes favoris"
                  : "Archives des Procès-Verbaux"
            }
          </strong>

          <span class="badge">${documents.length} document(s)</span>
        </div>

        <div class="filter-bar">
          <input
            id="archive-query"
            placeholder="Référence, employeur, travailleur, inspecteur..."
            value="${esc(state.archiveQuery)}"
          >

          <select id="archive-status">
            <option value="">Tous les états</option>
            <option value="draft" ${state.archiveStatus === "draft" ? "selected" : ""}>Brouillons</option>
            <option value="final" ${state.archiveStatus === "final" ? "selected" : ""}>Finalisés</option>
            <option value="archived" ${state.archiveStatus === "archived" ? "selected" : ""}>Archivés</option>
          </select>

          <select id="archive-type">
            <option value="">Tous les modèles</option>
            ${MODELS.map(
              (model) => `
                <option value="${model.id}" ${state.archiveType === model.id ? "selected" : ""}>
                  ${esc(model.name)}
                </option>
              `
            ).join("")}
          </select>

          <button class="btn" type="button" data-action="clear-filters">
            Réinitialiser
          </button>
        </div>

        <div id="archive-table">
          ${archiveRows(documents, mode)}
        </div>
      </section>
    `,
    mode === "trash"
      ? "Corbeille"
      : mode === "favorites"
        ? "Favoris"
        : "Archives",
    "Recherche instantanée, filtres, restauration, suppression et duplication."
  );

  bindArchiveFilters(mode);
}

function bindArchiveFilters(mode) {
  const query = document.querySelector("#archive-query");
  const status = document.querySelector("#archive-status");
  const type = document.querySelector("#archive-type");

  const update = debounce(() => {
    state.archiveQuery = query.value;
    state.archiveStatus = status.value;
    state.archiveType = type.value;

    const table = document.querySelector("#archive-table");

    if (table) {
      table.innerHTML = archiveRows(filteredDocuments(mode), mode);
    }
  }, 200);

  query?.addEventListener("input", update);
  status?.addEventListener("change", update);
  type?.addEventListener("change", update);
}

/* -------------------------------------------------------------------------- */
/*                                  EDITEUR                                   */
/* -------------------------------------------------------------------------- */

function showEditor(doc) {
  state.view = "editor";
  state.current = doc;
  state.aiIdeas = [];

  layout(
    `
      <div class="toolbar" style="justify-content:space-between;margin-bottom:15px">
        <div>
          <strong>${esc(doc.modelName)}</strong><br>
          <small style="color:var(--muted)">
            ${esc(doc.reference || "Brouillon sans référence")}
          </small>
        </div>

        <div class="row-actions">
          <button class="btn" type="button" data-action="history">Historique</button>
          <button class="btn" type="button" data-action="save">Enregistrer</button>
          <button class="btn" type="button" data-action="print">Imprimer</button>
          <button class="btn warning" type="button" data-action="pdf">Export PDF</button>
          <button class="btn success" type="button" data-action="finalize">Finaliser</button>
          <button class="btn danger" type="button" data-action="trash" data-id="${doc.id}">Supprimer</button>
        </div>
      </div>

      <section class="editor-layout">
        <aside class="card form-panel">
          ${renderEditorForm(doc)}
        </aside>

        <section class="preview-panel">
          <main id="document-preview" class="pv-document">
            ${renderDocument(doc)}
          </main>
        </section>
      </section>
    `,
    "Édition du Procès-Verbal",
    "Les textes fixes administratifs sont verrouillés. Seules les données variables sont modifiables."
  );

  bindEditor();
}

function updatePreview() {
  const preview = document.querySelector("#document-preview");

  if (preview && state.current) {
    preview.innerHTML = renderDocument(state.current);
  }
}

const autoSave = debounce(async () => {
  if (!state.current) return;

  await saveDocument(state.current);
  toast("Brouillon enregistré automatiquement.");
}, 900);

function setPath(object, path, value) {
  const keys = path.split(".");
  let cursor = object;

  keys.slice(0, -1).forEach((key) => {
    cursor[key] ||= {};
    cursor = cursor[key];
  });

  cursor[keys[keys.length - 1]] = value;
}

function bindEditor() {
  const form = document.querySelector("#pv-form");

  form?.addEventListener("input", (event) => {
    const element = event.target;

    if (element.dataset.bind) {
      const value =
        element.type === "checkbox" ? element.checked : element.value;

      setPath(state.current, element.dataset.bind, value);
      updatePreview();
      autoSave();
    }

    if (element.dataset.list) {
      const list = element.dataset.list;
      const index = Number(element.dataset.index);

      state.current.data[list][index] = element.value;
      updatePreview();
      autoSave();
    }
  });

  form?.addEventListener("change", (event) => {
    if (event.target.id === "attachment-input") {
      uploadFiles(event.target.files);
    }
  });
}

/* -------------------------------------------------------------------------- */
/*                              PIECES JOINTES                                */
/* -------------------------------------------------------------------------- */

function fileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

async function uploadFiles(fileList) {
  const files = Array.from(fileList || []);

  for (const file of files) {
    const dataUrl = await fileAsDataUrl(file);

    state.current.attachments.push({
      id: uid(),
      name: file.name,
      type: file.type,
      size: file.size,
      dataUrl,
      createdAt: new Date().toISOString()
    });
  }

  await saveDocument(state.current, "Ajout de pièce jointe", true);
  showEditor(state.current);
}

/* -------------------------------------------------------------------------- */
/*                            SIGNATURE TACTILE                               */
/* -------------------------------------------------------------------------- */

function openSignature(role) {
  const modal = document.createElement("div");
  modal.className = "modal";

  const savedSignatures = JSON.parse(
    localStorage.getItem("inspecteurbot-saved-signatures") || "[]"
  );

  modal.innerHTML = `
    <div class="modal-card">
      <div class="toolbar" style="justify-content:space-between;margin-bottom:12px">
        <div>
          <strong>Signature électronique</strong><br>
          <small style="color:var(--muted)">
            Utilisez le doigt, le stylet ou la souris.
          </small>
        </div>

        <button class="btn small danger" type="button" data-modal="close">
          Fermer
        </button>
      </div>

      ${
        savedSignatures.length
          ? `
            <div class="toolbar" style="margin-bottom:10px">
              <select id="saved-signature">
                <option value="">Réutiliser une signature enregistrée</option>
                ${savedSignatures
                  .map(
                    (signature, index) => `
                    <option value="${index}">
                      ${esc(signature.signedBy || "Signature enregistrée")}
                    </option>
                  `
                  )
                  .join("")}
              </select>

              <button class="btn small" type="button" data-modal="use-saved">
                Utiliser
              </button>
            </div>
          `
          : ""
      }

      <canvas id="signature-canvas" class="signature-canvas"></canvas>

      <div class="fields" style="margin-top:12px">
        <div class="field full">
          <label>Nom du signataire</label>
          <input id="signature-name" placeholder="Nom complet">
        </div>

        <label style="font-size:12px;grid-column:1/-1">
          <input id="save-signature" type="checkbox">
          Enregistrer cette signature pour réutilisation locale
        </label>
      </div>

      <div class="toolbar" style="justify-content:flex-end;margin-top:14px">
        <button class="btn" type="button" data-modal="clear">Effacer</button>
        <button class="btn success" type="button" data-modal="save">
          Enregistrer la signature
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  const canvas = modal.querySelector("#signature-canvas");
  const ctx = canvas.getContext("2d");
  const ratio = Math.max(window.devicePixelRatio || 1, 1);

  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;

  ctx.scale(ratio, ratio);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = 2.1;
  ctx.strokeStyle = "#000";

  let drawing = false;
  let hasSignature = false;

  const getPoint = (event) => {
    const rect = canvas.getBoundingClientRect();

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  };

  const drawImage = (dataUrl) => {
    const image = new Image();

    image.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(
        image,
        0,
        0,
        canvas.offsetWidth,
        canvas.offsetHeight
      );

      hasSignature = true;
    };

    image.src = dataUrl;
  };

  canvas.addEventListener("pointerdown", (event) => {
    drawing = true;
    hasSignature = true;

    const point = getPoint(event);

    ctx.beginPath();
    ctx.moveTo(point.x, point.y);

    canvas.setPointerCapture?.(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return;

    const point = getPoint(event);

    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  });

  canvas.addEventListener("pointerup", () => {
    drawing = false;
  });

  canvas.addEventListener("pointercancel", () => {
    drawing = false;
  });

  modal.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-modal]");
    if (!button) return;

    const action = button.dataset.modal;

    if (action === "close") {
      modal.remove();
      return;
    }

    if (action === "clear") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      hasSignature = false;
      return;
    }

    if (action === "use-saved") {
      const selected = modal.querySelector("#saved-signature")?.value;

      if (selected === "" || !savedSignatures[selected]) return;

      const signature = savedSignatures[selected];

      modal.querySelector("#signature-name").value = signature.signedBy || "";
      drawImage(signature.dataUrl);

      return;
    }

    if (action === "save") {
      if (!hasSignature) {
        alert("Veuillez signer avant l’enregistrement.");
        return;
      }

      const signedBy = modal.querySelector("#signature-name").value.trim();

      state.current.signatures[role] = {
        dataUrl: canvas.toDataURL("image/png"),
        signedBy,
        signedAt: new Date().toISOString()
      };

      if (modal.querySelector("#save-signature").checked) {
        savedSignatures.push({
          id: uid(),
          signedBy,
          dataUrl: state.current.signatures[role].dataUrl,
          createdAt: new Date().toISOString()
        });

        localStorage.setItem(
          "inspecteurbot-saved-signatures",
          JSON.stringify(savedSignatures.slice(-15))
        );
      }

      await saveDocument(
        state.current,
        `Signature électronique ajoutée : ${role}`,
        true
      );

      modal.remove();
      showEditor(state.current);
    }
  });
}

/* -------------------------------------------------------------------------- */
/*                                IA ASSISTANT                                */
/* -------------------------------------------------------------------------- */

function offlineIdeas(facts, target) {
  const prefixes = [
    "Il ressort des éléments déclarés que",
    "Selon les informations disponibles au dossier,",
    "Sous réserve de vérification contradictoire,",
    "Le demandeur soutient que",
    "L’employeur est invité à préciser que",
    "Les pièces communiquées paraissent indiquer que",
    "Il y a lieu de relever que",
    "Les parties ont été entendues sur le fait que",
    "L’examen préliminaire du dossier laisse apparaître que",
    "Le principe du contradictoire commande de vérifier que",
    "Il convient de consigner que",
    "La chronologie des faits doit permettre d’établir que",
    "Les déclarations reçues font état de ce que",
    "La partie concernée affirme que",
    "Une attention particulière doit être accordée au fait que",
    "Le dossier mentionne que",
    "La vérification des pièces devra confirmer que",
    "Les éléments recueillis suggèrent que",
    "Il est recommandé de préciser si",
    "La situation décrite porte notamment sur le fait que",
    "Les parties doivent être invitées à documenter que",
    "Le constat provisoire peut mentionner que",
    "La déclaration doit rester limitée aux faits selon lesquels",
    "L’analyse administrative peut relever que",
    "Sans préjuger de la décision finale, il peut être indiqué que",
    "Les documents soumis à l’Inspection font ressortir que",
    "Le procès-verbal peut préciser que",
    "La partie demanderesse expose que",
    "La partie défenderesse est appelée à répondre sur le fait que",
    "La rédaction proposée, à adapter après vérification, est que"
  ];

  return prefixes.map(
    (prefix, index) =>
      `${prefix} ${facts.trim()} ${
        index % 2 === 0
          ? "Cette formulation doit être vérifiée avant validation et signature."
          : "Aucune qualification juridique nouvelle ne doit être ajoutée sans contrôle de l’Inspecteur."
      }`
  );
}

async function generateAI() {
  const facts = document.querySelector("#ai-facts")?.value.trim();
  const target = document.querySelector("#ai-target")?.value;

  if (!facts) {
    alert("Veuillez saisir les faits à analyser.");
    return;
  }

  state.aiTarget = target;

  const result = await remoteFetch(`${API}/ai/pv-suggestions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: state.current.type,
      target,
      facts,
      limit: 30
    })
  });

  state.aiIdeas =
    Array.isArray(result?.ideas) && result.ideas.length
      ? result.ideas.slice(0, 30)
      : offlineIdeas(facts, target);

  const container = document.querySelector("#ai-results");

  if (container) {
    container.innerHTML = state.aiIdeas
      .map(
        (idea, index) => `
          <div class="ai-result">
            <p>${esc(idea)}</p>

            <button
              class="btn small"
              type="button"
              data-action="ai-apply"
              data-index="${index}"
            >
              Utiliser cette proposition
            </button>
          </div>
        `
      )
      .join("");
  }
}

async function applyAI(index) {
  const idea = state.aiIdeas[index];
  const target = state.aiTarget;

if (!idea) return;

  if (target === "constats") {
    state.current.data.constats.push(idea);
  } else {
    state.current.data[target] = idea;
  }

  await saveDocument(
    state.current,
    "Proposition IA appliquée dans une zone dynamique",
    true
  );

  showEditor(state.current);
}

/* -------------------------------------------------------------------------- */
/*                           FINALISATION / VALIDATION                        */
/* -------------------------------------------------------------------------- */

async function finalizeDocument() {
  const doc = state.current;
  const d = doc.data;

  const missing = [];

  if (!d.date) missing.push("Date");
  if (!d.location) missing.push("Lieu");
  if (!d.inspectorName) missing.push("Inspecteur / Contrôleur");

  if (doc.type === "nonconc") {
    if (!d.claimantName) missing.push("Demandeur");
    if (!d.employerName) missing.push("Employeur");
    if (!d.claimStatement) missing.push("Exposé du demandeur");
  }

  if (doc.type === "committee" && !d.establishment) {
    missing.push("Établissement");
  }

  if (doc.type === "composition" && !d.establishment) {
    missing.push("Établissement");
  }

  if (missing.length) {
    alert(
      `Veuillez compléter les champs obligatoires suivants :\n\n- ${missing.join(
        "\n- "
      )}`
    );
    return;
  }

  if (!doc.reference) {
    doc.reference = await reserveReference(doc);
  }

  await ensureQr(doc);

  doc.status = "final";
  doc.finalizedAt = new Date().toISOString();
  doc.integrityHash = await documentHash(doc);

  await saveDocument(
    doc,
    `PV finalisé sous la référence ${doc.reference}`,
    true
  );

  showEditor(doc);
  toast("Procès-Verbal finalisé avec succès.");
}

/* -------------------------------------------------------------------------- */
/*                              IMPRESSION ET PDF                             */
/* -------------------------------------------------------------------------- */

async function printDocument(doc) {
  await ensureQr(doc);

  const popup = window.open("", "_blank");

  if (!popup) {
    alert("Veuillez autoriser les fenêtres contextuelles pour imprimer.");
    return;
  }

  popup.document.write(`
    <!DOCTYPE html>
    <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>${esc(doc.reference || "Procès-Verbal")}</title>
        <link rel="stylesheet" href="${window.location.origin}/styles.css">
      </head>

      <body>
        <main class="pv-document">
          ${renderDocument(doc)}
        </main>
      </body>
    </html>
  `);

  popup.document.close();

  setTimeout(() => {
    popup.focus();
    popup.print();
  }, 700);
}

async function exportPdf(doc) {
  await ensureQr(doc);

  const response = await fetch(`${API}/pdf`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      title: doc.reference || "proces-verbal",
      html: `<main class="pv-document">${renderDocument(doc)}</main>`
    })
  });

  if (!response.ok) {
    alert(
      "Le serveur PDF est indisponible. Utilisez Imprimer puis Enregistrer au format PDF."
    );

    printDocument(doc);
    return;
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${(doc.reference || "proces-verbal").replace(
    /[^\w.-]+/g,
    "_"
  )}.pdf`;

  link.click();

  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* -------------------------------------------------------------------------- */
/*                               HISTORIQUE                                   */
/* -------------------------------------------------------------------------- */

function openHistory() {
  const modal = document.createElement("div");
  modal.className = "modal";

  modal.innerHTML = `
    <div class="modal-card">
      <div class="toolbar" style="justify-content:space-between">
        <strong>Historique du Procès-Verbal</strong>

        <button class="btn small danger" type="button" data-history-close>
          Fermer
        </button>
      </div>

      <div style="max-height:60vh;overflow:auto;margin-top:14px">
        ${[...state.current.history]
          .reverse()
          .map(
            (entry) => `
              <div style="border-bottom:1px solid var(--line);padding:10px 0">
                <strong style="font-size:12px">${esc(entry.action)}</strong><br>
                <small style="color:var(--muted)">
                  ${new Date(entry.date).toLocaleString("fr-FR")}
                </small>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  modal
    .querySelector("[data-history-close]")
    .addEventListener("click", () => modal.remove());
}

/* -------------------------------------------------------------------------- */
/*                              ACTIONS DOCUMENT                              */
/* -------------------------------------------------------------------------- */

async function duplicateDocument(id) {
  const original = state.documents.find((doc) => doc.id === id);
  if (!original) return;

  const duplicated = clone(original);
  const now = new Date().toISOString();

  duplicated.id = uid();
  duplicated.uniqueId = uid();
  duplicated.qrToken = uid();
  duplicated.qrDataUrl = "";
  duplicated.reference = "";
  duplicated.status = "draft";
  duplicated.favorite = false;
  duplicated.createdAt = now;
  duplicated.updatedAt = now;
  duplicated.finalizedAt = null;
  duplicated.integrityHash = "";
  duplicated.history = [
    {
      date: now,
      action: `Duplication du PV ${original.reference || original.id}`
    }
  ];

  await saveDocument(duplicated);
  showEditor(duplicated);
}

async function moveToTrash(id) {
  const doc = state.documents.find((item) => item.id === id);
  if (!doc) return;

  const approved = confirm(
    "Voulez-vous placer ce Procès-Verbal dans la corbeille ? Il restera restaurable."
  );

  if (!approved) return;

  doc.status = "trash";
  doc.deletedAt = new Date().toISOString();

  await saveDocument(doc, "Déplacement dans la corbeille", true);

  if (state.current?.id === doc.id) {
    state.current = null;
    showArchives("archives");
  } else {
    showArchives(state.view === "favorites" ? "favorites" : "archives");
  }

  toast("PV placé dans la corbeille.");
}

async function restoreDocument(id) {
  const doc = state.documents.find((item) => item.id === id);
  if (!doc) return;

  doc.status = "archived";
  doc.deletedAt = null;

  await saveDocument(doc, "Restauration depuis la corbeille", true);

  showArchives("trash");
  toast("PV restauré.");
}

async function destroyDocument(id) {
  const approved = confirm(
    "Suppression définitive irréversible. Voulez-vous continuer ?"
  );

  if (!approved) return;

  await Store.remove(id);

  state.documents = state.documents.filter((doc) => doc.id !== id);

  showArchives("trash");
  toast("PV supprimé définitivement.");
}

function downloadAttachment(fileId) {
  const attachment = state.current.attachments.find(
    (item) => item.id === fileId
  );

  if (!attachment) return;

  const link = document.createElement("a");
  link.href = attachment.dataUrl;
  link.download = attachment.name;
  link.click();
}

/* -------------------------------------------------------------------------- */
/*                             TOAST NOTIFICATION                             */
/* -------------------------------------------------------------------------- */

function toast(message) {
  document.querySelector(".toast")?.remove();

  const node = document.createElement("div");
  node.className = "toast";

  node.style.cssText = `
    position:fixed;
    bottom:20px;
    right:20px;
    z-index:99999;
    background:#15243b;
    color:white;
    padding:12px 14px;
    border-radius:10px;
    font-size:12px;
    box-shadow:0 12px 32px rgba(0,0,0,.25);
  `;

  node.textContent = message;

  document.body.appendChild(node);

  setTimeout(() => node.remove(), 2800);
}

/* -------------------------------------------------------------------------- */
/*                           GESTION EVENEMENTS UI                            */
/* -------------------------------------------------------------------------- */

APP.addEventListener("click", async (event) => {
  const viewButton = event.target.closest("[data-view]");

  if (viewButton) {
    const view = viewButton.dataset.view;

    if (view === "dashboard") showDashboard();
    if (view === "models") showModels();
    if (view === "archives") showArchives("archives");
    if (view === "favorites") showArchives("favorites");
    if (view === "trash") showArchives("trash");

    return;
  }

  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const id = button.dataset.id;

  if (action === "theme") {
    state.theme = state.theme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem("pv-theme", state.theme);

    if (state.view === "dashboard") showDashboard();
    if (state.view === "models") showModels();
    if (state.view === "archives") showArchives("archives");
    if (state.view === "favorites") showArchives("favorites");
    if (state.view === "trash") showArchives("trash");
    if (state.view === "editor") showEditor(state.current);

    return;
  }

  if (action === "create") {
    const doc = defaultDocument(button.dataset.modelId);

    await ensureQr(doc);
    await saveDocument(doc);

    showEditor(doc);
    return;
  }

  if (action === "open") {
    const doc = state.documents.find((item) => item.id === id);

    if (doc) showEditor(doc);

    return;
  }

  if (action === "save") {
    await saveDocument(state.current, "Enregistrement manuel", true);
    toast("PV enregistré.");
    return;
  }

  if (action === "finalize") {
    await finalizeDocument();
    return;
  }

  if (action === "print") {
    printDocument(state.current);
    return;
  }

  if (action === "pdf") {
    exportPdf(state.current);
    return;
  }

  if (action === "history") {
    openHistory();
    return;
  }

  if (action === "signature") {
    openSignature(button.dataset.role);
    return;
  }

    if (action === "list-add") {
    const key = button.dataset.list;

    state.current.data[key].push("");

    showEditor(state.current);
    return;
  }

  if (action === "list-delete") {
    const key = button.dataset.list;
    const index = Number(button.dataset.index);

    state.current.data[key].splice(index, 1);

    showEditor(state.current);
    return;
  }

  if (action === "attachment-download") {
    downloadAttachment(button.dataset.fileId);
    return;
  }

  if (action === "attachment-delete") {
    state.current.attachments = state.current.attachments.filter(
      (file) => file.id !== button.dataset.fileId
    );

    await saveDocument(
      state.current,
      "Suppression de pièce jointe",
      true
    );

    showEditor(state.current);
    return;
  }

  if (action === "ai-generate") {
    generateAI();
    return;
  }

  if (action === "ai-apply") {
    applyAI(Number(button.dataset.index));
    return;
  }

  if (action === "duplicate") {
    duplicateDocument(id);
    return;
  }

  if (action === "favorite") {
    const doc = state.documents.find((item) => item.id === id);

    if (!doc) return;

    doc.favorite = !doc.favorite;

    await saveDocument(
      doc,
      doc.favorite ? "Ajout aux favoris" : "Retrait des favoris",
      true
    );

    showArchives(state.view === "favorites" ? "favorites" : "archives");
    return;
  }

  if (action === "trash") {
    moveToTrash(id || state.current?.id);
    return;
  }

  if (action === "restore") {
    restoreDocument(id);
    return;
  }

  if (action === "destroy") {
    destroyDocument(id);
    return;
  }

  if (action === "clear-filters") {
    state.archiveQuery = "";
    state.archiveStatus = "";
    state.archiveType = "";

    showArchives(
      state.view === "favorites"
        ? "favorites"
        : state.view === "trash"
          ? "trash"
          : "archives"
    );
  }
});

/* -------------------------------------------------------------------------- */
/*                              INITIALISATION                                */
/* -------------------------------------------------------------------------- */

async function bootstrap() {
  await Store.open();

  state.documents = await Store.getAll();

  const remoteDocuments = await remoteFetch(`${API}/pvs`);

  if (Array.isArray(remoteDocuments)) {
    for (const doc of remoteDocuments) {
      const exists = state.documents.some((local) => local.id === doc.id);

      if (!exists) {
        state.documents.push(doc);
        await Store.put(doc);
      }
    }
  }

  state.documents.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));

  showDashboard();
}

bootstrap();
   
     
   

   

            

   
  


          

                  

   

