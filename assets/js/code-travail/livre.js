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
        <p>Touchez les coins ou faites glisser la page avec votre doigt.</p>
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
    const page=document.getElementById("livrePage");if(!page||page.dataset.touchBound)return;page.dataset.touchBound="1";
    let sx=0,sy=0,startTime=0,direction=1,tracking=false,dragging=false,targetIndex=-1,sheet=null;
    const clear=()=>{page.classList.remove("ct-page-touching");page.style.removeProperty("min-height");if(sheet)sheet.remove();sheet=null;dragging=false;tracking=false;this.turning=false;};
    const setProgress=p=>{if(!sheet)return;const v=Math.max(0,Math.min(1,p));sheet.style.transform="rotateY("+(direction>0?-180*v:180*v)+"deg)";sheet.style.setProperty("--ct-fold-progress",String(v));};
    const createSheet=()=>{const articles=window.CodeTravailState?.articles||[];targetIndex=this.currentPage+direction;if(targetIndex<0||targetIndex>=articles.length||this.turning)return false;const height=page.getBoundingClientRect().height;sheet=document.createElement("div");sheet.className="ct-page-turn-sheet ct-touch-sheet "+(direction>0?"ct-sheet-next":"ct-sheet-prev");sheet.innerHTML='<div class="ct-page-turn-face ct-page-turn-front"></div><div class="ct-page-turn-face ct-page-turn-back"></div>';sheet.querySelector(".ct-page-turn-front").innerHTML=page.innerHTML;sheet.querySelector(".ct-page-turn-back").innerHTML=this.articleMarkup(articles[targetIndex],targetIndex,articles.length);sheet.style.height=Math.max(height,1)+"px";page.style.minHeight=Math.max(height,1)+"px";page.appendChild(sheet);page.classList.add("ct-page-touching");sheet.style.transition="none";this.turning=true;dragging=true;setProgress(0);return true;};
    page.addEventListener("pointerdown",e=>{if((e.button!==undefined&&e.button!==0)||e.target.closest("button,input,a,select,textarea"))return;const rect=page.getBoundingClientRect(),x=e.clientX-rect.left,edge=Math.max(42,Math.min(72,rect.width*.13));if(x<edge)direction=-1;else if(x>rect.width-edge)direction=1;else return;const articles=window.CodeTravailState?.articles||[];if(this.currentPage+direction<0||this.currentPage+direction>=articles.length||this.turning)return;sx=e.clientX;sy=e.clientY;startTime=performance.now();tracking=true;dragging=false;try{page.setPointerCapture(e.pointerId);}catch(_){}});
    page.addEventListener("pointermove",e=>{if(!tracking)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(!dragging){const intended=direction>0?-dx:dx;if(Math.abs(dy)>Math.abs(dx)*1.15&&Math.abs(dy)>10){tracking=false;return;}if(intended<3)return;if(!createSheet()){tracking=false;return;}}const rect=page.getBoundingClientRect(),distance=direction>0?sx-e.clientX:e.clientX-sx;setProgress(distance/Math.max(1,rect.width));e.preventDefault();});
    const finish=(e,cancelled)=>{if(!tracking)return;tracking=false;if(!dragging)return;const dx=e.clientX-sx,dy=e.clientY-sy,rect=page.getBoundingClientRect(),distance=direction>0?sx-e.clientX:e.clientX-sx,progress=Math.max(0,Math.min(1,distance/Math.max(1,rect.width))),speed=Math.abs(dx)/Math.max(1,performance.now()-startTime),commit=!cancelled&&Math.abs(dx)>Math.abs(dy)*1.12&&(progress>=.34||(progress>=.19&&speed>.5));page.classList.remove("ct-page-touching");sheet.style.transition="transform 430ms cubic-bezier(.2,.72,.2,1)";if(commit){setProgress(1);setTimeout(()=>{clear();this.render(targetIndex);},445);}else{setProgress(0);setTimeout(clear,445);}};
    page.addEventListener("pointerup",e=>finish(e,false));page.addEventListener("pointercancel",e=>finish(e,true));
  },
  turn: function (dir) {
    const articles=window.CodeTravailState?.articles||[],targetIndex=this.currentPage+dir;if(this.turning||targetIndex<0||targetIndex>=articles.length)return;
    const page=document.getElementById("livrePage");if(!page)return;this.turning=true;const height=page.getBoundingClientRect().height,sheet=document.createElement("div");
    sheet.className="ct-page-turn-sheet ct-touch-sheet "+(dir>0?"ct-sheet-next":"ct-sheet-prev");sheet.innerHTML='<div class="ct-page-turn-face ct-page-turn-front"></div><div class="ct-page-turn-face ct-page-turn-back"></div>';
    sheet.querySelector(".ct-page-turn-front").innerHTML=page.innerHTML;sheet.querySelector(".ct-page-turn-back").innerHTML=this.articleMarkup(articles[targetIndex],targetIndex,articles.length);
    sheet.style.height=Math.max(height,1)+"px";page.style.minHeight=Math.max(height,1)+"px";page.appendChild(sheet);
    const setProgress=p=>{sheet.style.transform="rotateY("+(dir>0?-180*p:180*p)+"deg)";sheet.style.setProperty("--ct-fold-progress",String(p));};
    setProgress(0);sheet.style.transition="transform 560ms cubic-bezier(.22,.68,.18,1)";requestAnimationFrame(()=>requestAnimationFrame(()=>setProgress(1)));
    setTimeout(()=>{sheet.remove();page.style.removeProperty("min-height");this.render(targetIndex);this.turning=false;},590);
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
    const rawTitle = String(art.titre || "").trim();
    const duplicateTitle = new RegExp("^article\\s+" + Number(art.numero) + "$", "i").test(rawTitle);
    const heading = "Article " + esc(art.numero) + (rawTitle && !duplicateTitle ? " — " + esc(rawTitle) : "");
    return `
      <div class="ct-book-topline"><span class="livre-titre-section">${esc(art.titreSection || art.categorie || "Code du Travail")}</span><span class="ct-book-count">${index + 1} / ${total}</span></div>
      <h3 class="livre-article-titre">${heading}</h3>
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
