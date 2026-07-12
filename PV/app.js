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

  syncDocument(d
