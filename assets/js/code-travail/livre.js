/**
 * livre.js
 * MODE LIVRE — Lecture des articles page par page avec effet de tournage
 * Fonctionne 100% hors-ligne
 */

window.LivreEngine = {
  currentPage: 0,

  init: function () {
    // Injecter la structure du livre dans la page si l'ancre existe
    this.mount();
  },

  mount: function () {
    // Section livre insérée juste après la section de consultation classique
    let host = document.getElementById("livreHost");
    if (!host) {
      // Créer la section livre dynamiquement avant le footer
      const footer = document.querySelector(".footer");
      const section = document.createElement("section");
      section.className = "livre-section";
      section.id = "livreHost";
      section.innerHTML = this.template();
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(section, footer);
      } else {
        document.querySelector(".container")?.appendChild(section);
      }
    }
    this.bind();
    // Attendre le chargement des articles
    const tryRender = () => {
      if (window.CodeTravailState && window.CodeTravailState.articles.length) {
        this.render(0);
      } else {
        setTimeout(tryRender, 300);
      }
    };
    tryRender();
  },

  template: function () {
    return `
      <div class="section-title">
        <h2><i class="fa-solid fa-book-bookmark"></i> Lecture du Code — Mode Livre</h2>
        <p>Tournez les pages, article par article, comme un véritable ouvrage juridique.</p>
      </div>

      <div class="voice-selector" style="justify-content:center; max-width:320px; margin:0 auto 20px;">
        <span style="color:#FFD700;font-weight:600;font-size:13px;"><i class="fa-solid fa-microphone-lines"></i> Voix :</span>
        <button id="voiceFemale" class="active">👩 Féminine</button>
        <button id="voiceMale">👨 Masculine</button>
      </div>

      <div class="livre-wrapper">
        <div class="livre">
          <div id="livrePage" class="livre-page">
            <!-- contenu injecté -->
          </div>
          <div id="livrePagination" class="livre-pagination"></div>
        </div>
      </div>

      <div class="livre-progress"><div id="livreProgressBar" class="livre-progress-bar" style="width:0%"></div></div>

      <div class="livre-controls">
        <button id="livrePrev" class="livre-btn"><i class="fa-solid fa-chevron-left"></i> Page précédente</button>
        <button id="livreAudio" class="livre-btn audio"><i class="fa-solid fa-volume-high"></i> Écouter</button>
        <div class="livre-goto">
          <label for="livreGotoInput">Aller à l'art.</label>
          <input type="number" id="livreGotoInput" min="1" max="334" placeholder="N°">
          <button id="livreGotoBtn" class="livre-btn" style="padding:8px 14px;"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
        <button id="livreNext" class="livre-btn">Page suivante <i class="fa-solid fa-chevron-right"></i></button>
      </div>
    `;
  },

  bind: function () {
    document.getElementById("livrePrev")?.addEventListener("click", () => this.turn(-1));
    document.getElementById("livreNext")?.addEventListener("click", () => this.turn(1));
    document.getElementById("livreAudio")?.addEventListener("click", () => this.listen());
    document.getElementById("livreGotoBtn")?.addEventListener("click", () => {
      const val = parseInt(document.getElementById("livreGotoInput").value, 10);
      if (val) this.gotoArticle(val);
    });
    document.getElementById("livreGotoInput")?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const val = parseInt(e.target.value, 10);
        if (val) this.gotoArticle(val);
      }
    });

    // Sélecteur de voix
    document.getElementById("voiceFemale")?.addEventListener("click", () => {
      window.SpeechEngine && window.SpeechEngine.setVoiceGender("female");
      document.getElementById("voiceFemale").classList.add("active");
      document.getElementById("voiceMale").classList.remove("active");
    });
    document.getElementById("voiceMale")?.addEventListener("click", () => {
      window.SpeechEngine && window.SpeechEngine.setVoiceGender("male");
      document.getElementById("voiceMale").classList.add("active");
      document.getElementById("voiceFemale").classList.remove("active");
    });

    // Navigation clavier (flèches)
    document.addEventListener("keydown", (e) => {
      const host = document.getElementById("livreHost");
      if (!host) return;
      const rect = host.getBoundingClientRect();
      const visible = rect.top < window.innerHeight && rect.bottom > 0;
      if (!visible) return;
      if (e.key === "ArrowRight") this.turn(1);
      if (e.key === "ArrowLeft") this.turn(-1);
    });
  },

  turn: function (dir) {
    const arts = window.CodeTravailState.articles;
    let next = this.currentPage + dir;
    if (next < 0) next = arts.length - 1;
    if (next >= arts.length) next = 0;

    const page = document.getElementById("livrePage");
    if (page) {
      page.classList.remove("flip-next", "flip-prev");
      void page.offsetWidth; // reflow
      page.classList.add(dir > 0 ? "flip-next" : "flip-prev");
    }
    setTimeout(() => this.render(next), 200);
  },

  gotoArticle: function (num) {
    const arts = window.CodeTravailState.articles;
    const idx = arts.findIndex(a => a.numero === num);
    if (idx === -1) {
      window.InspecteurUtils && window.InspecteurUtils.showNotification(`Article ${num} introuvable`, "fa-triangle-exclamation");
      return;
    }
    this.render(idx);
    document.getElementById("livreHost")?.scrollIntoView({ behavior: "smooth" });
  },

  render: function (index) {
    const arts = window.CodeTravailState.articles;
    if (!arts.length) return;
    this.currentPage = index;
    const art = arts[index];

    const page = document.getElementById("livrePage");
    if (!page) return;

    let html = `<div class="livre-titre-section">${art.titreSection || art.categorie || "Code du Travail RDC"}</div>`;
    html += `<div class="livre-numero">Article <span>${art.numero}</span></div>`;
    html += `<h3 class="livre-article-titre">${window.InspecteurUtils ? window.InspecteurUtils.escapeHtml(art.titre) : art.titre}</h3>`;
    html += `<div class="livre-contenu">${window.InspecteurUtils ? window.InspecteurUtils.escapeHtml(art.contenu) : art.contenu}</div>`;
    if (art.sanction) {
      html += `<div class="livre-sanction"><i class="fa-solid fa-gavel"></i> Sanction : ${window.InspecteurUtils ? window.InspecteurUtils.escapeHtml(art.sanction) : art.sanction}</div>`;
    }
    page.innerHTML = html;

    // Pagination + progression
    document.getElementById("livrePagination").textContent = `— Page ${index + 1} sur ${arts.length} —`;
    const pct = ((index + 1) / arts.length) * 100;
    document.getElementById("livreProgressBar").style.width = pct + "%";

    // Synchroniser avec la consultation classique
    if (window.CodeTravailConsultation) {
      window.CodeTravailState.currentArticleIndex = index;
    }
  },

  listen: function () {
    const art = window.CodeTravailState.articles[this.currentPage];
    if (!art) return;
    if (window.SpeechEngine) {
      window.SpeechEngine.speak(`Article ${art.numero}. ${art.titre}. ${art.contenu}`, window.currentLang || "fr");
    }
  }
};

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => window.LivreEngine.init(), 800);
});
