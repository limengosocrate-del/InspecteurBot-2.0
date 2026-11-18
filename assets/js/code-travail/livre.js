/**
 * livre.js
 * MODE LIVRE — lecteur harmonisé avec la lecture issue des résultats de recherche.
 * Navigation tactile, boutons, clavier, synthèse vocale et accès direct par numéro.
 */
window.LivreEngine = {
  currentPage: 0,
  turning: false,

  init: function () { this.mount(); },

  mount: function () {
    let host = document.getElementById("livreHost");
    if (!host) {
      const section = document.createElement("section");
      section.className = "livre-section";
      section.id = "livreHost";
      document.querySelector(".container")?.appendChild(section);
      host = section;
    }
    if (!host.innerHTML.trim()) host.innerHTML = this.template();
    this.bind();
    const tryRender = () => {
      const articles = window.CodeTravailState?.articles || [];
      if (articles.length) this.render(Math.min(this.currentPage, articles.length - 1));
      else setTimeout(tryRender, 300);
    };
    tryRender();
  },

  template: function () {
    return `
      <div class="section-title livre-section-heading">
        <h2><i class="fa-solid fa-book-bookmark"></i> Lecture du Code — Mode Livre</h2>
        <p>Tournez les pages, article par article, comme un véritable ouvrage juridique.</p>
      </div>
      <div class="voice-selector livre-voice-selector" role="group" aria-label="Choisir la voix de lecture">
        <span><i class="fa-solid fa-microphone-lines"></i> Voix :</span>
        <button type="button" id="voiceFemale">👩 Féminine</button>
        <button type="button" id="voiceMale">👨 Masculine</button>
      </div>
      <div class="livre-wrapper">
        <div class="livre">
          <div id="livrePage" class="livre-page ct-book-page" role="region" aria-label="Page du Code du travail" tabindex="0"></div>
          <div id="livrePagination" class="livre-pagination"></div>
        </div>
      </div>
      <div class="livre-progress" aria-label="Progression dans le Code"><div id="livreProgressBar" class="livre-progress-bar"></div></div>
      <div class="livre-controls">
        <div class="livre-page-nav">
          <button type="button" id="livrePrev" class="livre-btn"><i class="fa-solid fa-chevron-left"></i> Page précédente</button>
          <button type="button" id="livreNext" class="livre-btn">Page suivante <i class="fa-solid fa-chevron-right"></i></button>
        </div>
        <button type="button" id="livreAudio" class="livre-btn audio"><i class="fa-solid fa-volume-high"></i> Écouter</button>
        <div class="livre-goto">
          <label for="livreGotoInput">Aller à l'article</label>
          <input type="number" id="livreGotoInput" min="1" max="334" placeholder="N°" inputmode="numeric">
          <button type="button" id="livreGotoBtn" class="livre-btn" aria-label="Ouvrir l'article"><i class="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>`;
  },

  bind: function () {
    if (this.bound) return;
    this.bound = true;
    document.getElementById("livrePrev")?.addEventListener("click", () => this.turn(-1));
    document.getElementById("livreNext")?.addEventListener("click", () => this.turn(1));
    document.getElementById("livreAudio")?.addEventListener("click", () => this.listen());
    const go = () => {
      const val = parseInt(document.getElementById("livreGotoInput")?.value, 10);
      if (Number.isFinite(val)) this.gotoArticle(val);
    };
    document.getElementById("livreGotoBtn")?.addEventListener("click", go);
    document.getElementById("livreGotoInput")?.addEventListener("keydown", e => {
      if (e.key === "Enter") go();
    });
    document.getElementById("voiceFemale")?.addEventListener("click", () => this.setVoice("female"));
    document.getElementById("voiceMale")?.addEventListener("click", () => this.setVoice("male"));
    const saved = window.SpeechEngine?.currentVoiceGender || localStorage.getItem("inspecteur_voice_gender") || "female";
    this.setVoiceUI(saved);
    this.bindTouch();
    document.addEventListener("keydown", e => {
      const host = document.getElementById("livreHost");
      if (!host || !["ArrowRight", "ArrowLeft"].includes(e.key)) return;
      const rect = host.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0 && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) {
        e.preventDefault();
        this.turn(e.key === "ArrowRight" ? 1 : -1);
      }
    });
  },

  setVoiceUI: function (gender) {
    document.getElementById("voiceFemale")?.classList.toggle("active", gender !== "male");
    document.getElementById("voiceMale")?.classList.toggle("active", gender === "male");
  },

  setVoice: function (gender) {
    window.SpeechEngine?.setVoiceGender(gender);
    this.setVoiceUI(gender);
  },

  bindTouch: function () {
    const page = document.getElementById("livrePage");
    if (!page || page.dataset.touchBound) return;
    page.dataset.touchBound = "1";
    let sx = 0, sy = 0, dragging = false, direction = 1, startTime = 0, originalHTML = "", originalMinHeight = "";
    const clearGesture = () => {
      dragging = false;
      page.classList.remove("ct-page-touching");
      page.querySelector(".ct-page-turn-sheet")?.remove();
    };
    page.addEventListener("pointerdown", e => {
      if (e.button !== undefined && e.button !== 0) return;
      if (e.target.closest("button, input, a, select, textarea")) return;
      const rect = page.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const edge = Math.max(46, Math.min(90, rect.width * .16));
      // Le geste commence sur un coin/bord : cela évite de gêner la sélection du texte.
      if (localX < edge) direction = -1;
      else if (localX > rect.width - edge) direction = 1;
      else return;
      const targetIndex = this.currentPage + direction;
      const articles = window.CodeTravailState?.articles || [];
      if (targetIndex < 0 || targetIndex >= articles.length || this.turning) return;
      sx = e.clientX; sy = e.clientY; startTime = performance.now();
      dragging = true; originalHTML = page.innerHTML;
      const targetHTML = this.articleMarkup(articles[targetIndex], targetIndex, articles.length);
      // La page suivante/précédente est déjà dessous : aucun fond vide pendant le pli.
      page.innerHTML = targetHTML;
      const sheet = document.createElement("div");
      sheet.className = "ct-page-turn-sheet " + (direction > 0 ? "ct-sheet-next" : "ct-sheet-prev");
      sheet.innerHTML = '<div class="ct-page-turn-face ct-page-turn-front"></div><div class="ct-page-turn-face ct-page-turn-back"></div>';
      sheet.querySelector(".ct-page-turn-front").innerHTML = originalHTML;
      sheet.querySelector(".ct-page-turn-back").innerHTML = targetHTML;
      page.appendChild(sheet);
      page.classList.add("ct-page-touching");
      sheet.style.transform = "rotateY(0deg)";
      try { page.setPointerCapture(e.pointerId); } catch (_) {}
      e.preventDefault();
    });
    page.addEventListener("pointermove", e => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dy) > Math.abs(dx) * 1.25 && Math.abs(dy) > 14) return;
      const width = Math.max(1, page.clientWidth);
      const distance = direction > 0 ? sx - e.clientX : e.clientX - sx;
      const progress = Math.max(0, Math.min(1, distance / width));
      const angle = direction > 0 ? -180 * progress : 180 * progress;
      const sheet = page.querySelector(".ct-page-turn-sheet");
      if (sheet) {
        sheet.style.transform = "rotateY(" + angle + "deg)";
        sheet.style.setProperty("--ct-fold-progress", progress.toFixed(3));
      }
      page.style.setProperty("--ct-page-shadow", progress.toFixed(3));
    });
    const finish = (e, cancelled) => {
      if (!dragging) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      const distance = direction > 0 ? sx - e.clientX : e.clientX - sx;
      const progress = Math.max(0, Math.min(1, distance / Math.max(1, page.clientWidth)));
      const elapsed = Math.max(1, performance.now() - startTime);
      const velocity = Math.abs(dx) / elapsed;
      const commit = !cancelled && Math.abs(dx) > Math.abs(dy) * 1.1 && (progress >= .36 || (progress >= .18 && velocity > .55));
      const sheet = page.querySelector(".ct-page-turn-sheet");
      dragging = false;
      page.classList.remove("ct-page-touching");
      page.style.removeProperty("--ct-page-shadow");
      if (!sheet) { page.innerHTML = originalHTML; return; }
      sheet.classList.add(commit ? "ct-sheet-commit" : "ct-sheet-revert");
      sheet.style.transform = "rotateY(" + (commit ? (direction > 0 ? -180 : 180) : 0) + "deg)";
      sheet.style.transition = "transform 360ms cubic-bezier(.2,.72,.2,1)";
      setTimeout(() => {
        sheet.remove();
        if (commit) {
          const target = this.currentPage + direction;
          this.render(target);
        } else {
          page.innerHTML = originalHTML;
        }
      }, 370);
    };
    page.addEventListener("pointerup", e => finish(e, false));
    page.addEventListener("pointercancel", e => finish(e, true));
  },

  turn: function (dir) {
    const articles = window.CodeTravailState?.articles || [];
    const next = this.currentPage + dir;
    if (this.turning || next < 0 || next >= articles.length) return;
    const page = document.getElementById("livrePage");
    this.turning = true;
    page?.classList.remove("flip-next", "flip-prev");
    void page?.offsetWidth;
    page?.classList.add(dir > 0 ? "flip-next" : "flip-prev");
    setTimeout(() => {
      this.render(next);
      this.turning = false;
    }, 520);
  },

  gotoArticle: function (num) {
    const articles = window.CodeTravailState?.articles || [];
    const index = articles.findIndex(a => Number(a.numero) === Number(num));
    if (index === -1) {
      window.InspecteurUtils?.showNotification(`Article ${num} introuvable`, "fa-triangle-exclamation");
      return;
    }
    this.turning = false;
    this.render(index);
    document.getElementById("livreHost")?.scrollIntoView({ behavior: "smooth", block: "start" });
  },

  articleMarkup: function (art, index, total) {
    const esc = value => window.InspecteurUtils?.escapeHtml ? window.InspecteurUtils.escapeHtml(String(value ?? "")) : String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
    return `
      <div class="ct-book-topline"><span class="livre-titre-section">${esc(art.titreSection || art.categorie || "Code du Travail RDC")}</span><span class="ct-book-count">${index + 1} / ${total}</span></div>
      <div class="livre-numero">Article <span>${esc(art.numero)}</span></div>
      <h3 class="livre-article-titre">${esc(art.titre || "Disposition légale")}</h3>
      <div class="livre-contenu ct-book-text">${esc(art.contenu || "Contenu non disponible.")}</div>
      ${art.sanction ? `<div class="livre-sanction"><i class="fa-solid fa-gavel"></i> Sanction : ${esc(art.sanction)}</div>` : ""}
      <p class="ct-book-hint"><i class="fa-solid fa-hand-pointer"></i> Faites glisser le coin de la feuille pour la tourner</p>`;
  },

  render: function (index) {
    const articles = window.CodeTravailState?.articles || [];
    if (!articles.length) return;
    index = Math.max(0, Math.min(index, articles.length - 1));
    this.currentPage = index;
    const art = articles[index];
    const page = document.getElementById("livrePage");
    if (!page) return;
    page.innerHTML = this.articleMarkup(art, index, articles.length);
    const pagination = document.getElementById("livrePagination");
    if (pagination) pagination.textContent = `— Article ${art.numero} · Page ${index + 1} sur ${articles.length} —`;
    const progress = document.getElementById("livreProgressBar");
    if (progress) progress.style.width = (((index + 1) / articles.length) * 100) + "%";
    const prev = document.getElementById("livrePrev"), next = document.getElementById("livreNext");
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === articles.length - 1;
    const input = document.getElementById("livreGotoInput");
    if (input) { input.max = articles.length; input.value = art.numero; }
    if (window.CodeTravailState) window.CodeTravailState.currentArticleIndex = index;
  },

  listen: function () {
    const art = window.CodeTravailState?.articles?.[this.currentPage];
    if (!art) return;
    if (window.SpeechEngine) window.SpeechEngine.speak(`Article ${art.numero}. ${art.titre || ""}. ${art.contenu || ""}`, window.currentLang || "fr");
  }
};

document.addEventListener("DOMContentLoaded", () => setTimeout(() => window.LivreEngine.init(), 800));
