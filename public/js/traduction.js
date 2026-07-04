/**
 * traduction.js
 * Traduction HORS-LIGNE de l'interface en 6 langues
 * Français, Anglais, Lingala, Kikongo, Tshiluba, Swahili
 */

window.currentLang = "fr";

window.TraductionEngine = {
  init: function () {
    const select = document.getElementById("langue");
    if (select) {
      const saved = localStorage.getItem("inspecteur_lang");
      if (saved) { select.value = saved; }
      select.addEventListener("change", (e) => this.changeLanguage(e.target.value));
      if (saved) this.changeLanguage(saved);
    }
  },

  // Dictionnaire complet de l'interface (6 langues)
  ui: {
    fr: {
      searchTitle: "Recherche Intelligente", searchDesc: "Recherchez un article par numéro, mot-clé, catégorie ou posez votre question.",
      searchPlaceholder: "Exemple : Article 15, licenciement, salaire, congé annuel...",
      catTitle: "Catégories du Code du Travail", catDesc: "Parcourez les articles par domaine juridique.",
      consultTitle: "Consultation des Articles", assistTitle: "Assistant Juridique IA",
      assistDesc: "Posez directement votre question sur le Code du Travail de la RDC.",
      analyser: "Analyser", effacer: "Effacer", lire: "Lire", copier: "Copier",
      precedent: "Précédent", suivant: "Suivant", ecouter: "Écouter", favori: "Favori"
    },
    en: {
      searchTitle: "Smart Search", searchDesc: "Search an article by number, keyword, category or ask your question.",
      searchPlaceholder: "Example: Article 15, dismissal, salary, annual leave...",
      catTitle: "Labor Code Categories", catDesc: "Browse articles by legal field.",
      consultTitle: "Article Consultation", assistTitle: "AI Legal Assistant",
      assistDesc: "Ask your question directly about the DRC Labor Code.",
      analyser: "Analyze", effacer: "Clear", lire: "Read", copier: "Copy",
      precedent: "Previous", suivant: "Next", ecouter: "Listen", favori: "Bookmark"
    },
    ln: {
      searchTitle: "Boluki ya Mayele", searchDesc: "Luka mobeko na nimero, liloba, to tuna motuna na yo.",
      searchPlaceholder: "Ndakisa: Mobeko 15, kolongolama, lifuta, konje...",
      catTitle: "Biteni ya Mibeko ya Mosala", catDesc: "Tala mibeko na ndenge ya mosala.",
      consultTitle: "Kotala Mibeko", assistTitle: "Mosungi ya Mibeko (IA)",
      assistDesc: "Tuna motuna na yo mpo na Mibeko ya Mosala ya RDC.",
      analyser: "Kotala", effacer: "Kolongola", lire: "Kotanga", copier: "Kokopi",
      precedent: "Oyo eleki", suivant: "Oyo elandi", ecouter: "Koyoka", favori: "Bolingo"
    },
    kg: {
      searchTitle: "Sosa ya Ngangu", searchDesc: "Sosa nsiku na nimero, mvovo, to yuvula ngiufula.",
      searchPlaceholder: "Mbandu: Nsiku 15, kukatula, mfutu, vundu...",
      catTitle: "Bindambu bya Nsiku a Kisalu", catDesc: "Tala nsiku na mpila kisalu.",
      consultTitle: "Kutala Nsiku", assistTitle: "Nsadisi a Nsiku (IA)",
      assistDesc: "Yuvula ngiufula aku mu Nsiku a Kisalu ya RDC.",
      analyser: "Fimpa", effacer: "Katula", lire: "Tanga", copier: "Kopi",
      precedent: "Kina kiviokidi", suivant: "Kina kilanda", ecouter: "Wa", favori: "Zola"
    },
    lu: {
      searchTitle: "Dikeba dia Meji", searchDesc: "Keba mukatshia ku nimelo, muaku, anyi ebeja lukonko luebe.",
      searchPlaceholder: "Tshilejilu: Mukatshia 15, dikumbusha, difutu, dikisha...",
      catTitle: "Bitupa bia Mukenji wa Midimu", catDesc: "Tangila mikatshia ku mushindu wa midimu.",
      consultTitle: "Kutangila Mikatshia", assistTitle: "Muambuluishi wa Mukenji (IA)",
      assistDesc: "Ebeja lukonko luebe bua Mukenji wa Midimu wa RDC.",
      analyser: "Konkonona", effacer: "Umbusha", lire: "Bala", copier: "Kopi",
      precedent: "Wa kumpala", suivant: "Wa panyima", ecouter: "Teleja", favori: "Disanka"
    },
    sw: {
      searchTitle: "Utafutaji wa Akili", searchDesc: "Tafuta kifungu kwa nambari, neno kuu, au uliza swali lako.",
      searchPlaceholder: "Mfano: Kifungu 15, kufukuzwa, mshahara, likizo...",
      catTitle: "Aina za Sheria ya Kazi", catDesc: "Vinjari vifungu kwa nyanja ya kisheria.",
      consultTitle: "Kusoma Vifungu", assistTitle: "Msaidizi wa Sheria (IA)",
      assistDesc: "Uliza swali lako moja kwa moja kuhusu Sheria ya Kazi ya RDC.",
      analyser: "Chambua", effacer: "Futa", lire: "Soma", copier: "Nakili",
      precedent: "Iliyopita", suivant: "Inayofuata", ecouter: "Sikiliza", favori: "Vipendwa"
    }
  },

  changeLanguage: function (lang) {
    window.currentLang = lang;
    localStorage.setItem("inspecteur_lang", lang);
    const d = this.ui[lang] || this.ui.fr;

    // Appliquer aux éléments-clés
    const set = (sel, txt) => { const el = document.querySelector(sel); if (el && txt) el.textContent = txt; };
    set(".search-header h2", null); // conserve l'icône, on ne remplace que le texte via nœud
    this.setKeepIcon(".search-header h2", d.searchTitle);
    set(".search-header p", d.searchDesc);
    const input = document.getElementById("rechercheArticle");
    if (input) input.placeholder = d.searchPlaceholder;

    this.setKeepIcon(".categories-section .section-title h2", d.catTitle);
    set(".categories-section .section-title p", d.catDesc);
    this.setKeepIcon(".article-section .section-title h2", d.consultTitle);
    this.setKeepIcon(".assistant-card .section-title h2", d.assistTitle);
    set(".assistant-card .section-title p", d.assistDesc);

    // Boutons IA
    this.setKeepIcon("#btnQuestionIA", d.analyser);
    this.setKeepIcon("#btnEffacerIA", d.effacer);
    this.setKeepIcon("#btnLectureIA", d.lire);
    this.setKeepIcon("#btnCopierIA", d.copier);

    const langNames = { fr: "Français 🇫🇷", en: "English 🇬🇧", ln: "Lingala 🇨🇩", kg: "Kikongo 🇨🇩", lu: "Tshiluba 🇨🇩", sw: "Kiswahili 🇨🇩" };
    if (window.InspecteurUtils) {
      window.InspecteurUtils.showNotification(`Langue : ${langNames[lang] || lang}`, "fa-language");
    }
  },

  // Remplace le texte d'un élément en conservant l'icône <i>
  setKeepIcon: function (selector, text) {
    const el = document.querySelector(selector);
    if (!el || !text) return;
    const icon = el.querySelector("i");
    el.innerHTML = "";
    if (icon) { el.appendChild(icon); el.appendChild(document.createTextNode(" ")); }
    el.appendChild(document.createTextNode(text));
  }
};

document.addEventListener("DOMContentLoaded", () => window.TraductionEngine.init());
