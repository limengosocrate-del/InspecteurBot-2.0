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
    const page=document.getElementById("livrePage");
    if(!page||page.dataset.touchBound)return;
    page.dataset.touchBound="1";
    let sx=0,sy=0,startTime=0,dragging=false,direction=1,originalHTML="",targetIndex=-1,overlay=null;
    const clear=()=>{dragging=false;page.classList.remove("ct-page-touching");page.style.removeProperty("--ct-fold-x-top");page.style.removeProperty("--ct-fold-x-bottom");page.style.removeProperty("--ct-fold-mid");overlay?.remove();overlay=null;};
    const setFold=(progress,yRatio)=>{const p=Math.max(0,Math.min(1,progress)),base=(1-p)*100,tilt=(yRatio-.5)*Math.min(18,p*24),top=Math.max(0,Math.min(100,base+tilt)),bottom=Math.max(0,Math.min(100,base-tilt));page.style.setProperty("--ct-fold-x-top",direction>0?top+"%":(100-top)+"%");page.style.setProperty("--ct-fold-x-bottom",direction>0?bottom+"%":(100-bottom)+"%");page.style.setProperty("--ct-fold-mid",(direction>0?(top+bottom)/2:100-(top+bottom)/2)+"%");overlay?.style.setProperty("--ct-fold-progress",p.toFixed(3));};
    page.addEventListener("pointerdown",e=>{
      if((e.button!==undefined&&e.button!==0)||e.target.closest("button,input,a,select,textarea"))return;
      const rect=page.getBoundingClientRect(),x=e.clientX-rect.left,edge=Math.max(48,Math.min(104,rect.width*.19));
      if(x<edge)direction=-1;else if(x>rect.width-edge)direction=1;else return;
      const articles=window.CodeTravailState?.articles||[];targetIndex=this.currentPage+direction;
      if(targetIndex<0||targetIndex>=articles.length||this.turning)return;
      sx=e.clientX;sy=e.clientY;startTime=performance.now();originalHTML=page.innerHTML;dragging=true;
      const targetHTML=this.articleMarkup(articles[targetIndex],targetIndex,articles.length);
      page.innerHTML=targetHTML;overlay=document.createElement("div");overlay.className="ct-finger-curl "+(direction>0?"ct-curl-forward":"ct-curl-backward");
      overlay.innerHTML='<div class="ct-curl-original"></div><div class="ct-curl-fold-shadow"></div>';overlay.querySelector(".ct-curl-original").innerHTML=originalHTML;page.appendChild(overlay);
      page.classList.add("ct-page-touching");setFold(0,(e.clientY-rect.top)/Math.max(1,rect.height));
      try{page.setPointerCapture(e.pointerId);}catch(_){}e.preventDefault();
    });
    page.addEventListener("pointermove",e=>{
      if(!dragging)return;const dx=e.clientX-sx,dy=e.clientY-sy;if(Math.abs(dy)>Math.abs(dx)*1.35&&Math.abs(dy)>14)return;
      const rect=page.getBoundingClientRect(),distance=direction>0?sx-e.clientX:e.clientX-sx;
      setFold(Math.max(0,distance/Math.max(1,rect.width)),(e.clientY-rect.top)/Math.max(1,rect.height));e.preventDefault();
    });
    const finish=(e,cancelled)=>{
      if(!dragging)return;const dx=e.clientX-sx,dy=e.clientY-sy,rect=page.getBoundingClientRect(),distance=direction>0?sx-e.clientX:e.clientX-sx;
      const progress=Math.max(0,Math.min(1,distance/Math.max(1,rect.width))),speed=Math.abs(dx)/Math.max(1,performance.now()-startTime);
      const commit=!cancelled&&Math.abs(dx)>Math.abs(dy)*1.12&&(progress>=.34||(progress>=.19&&speed>.5));dragging=false;page.classList.remove("ct-page-touching");
      if(!overlay){page.innerHTML=originalHTML;return;}
      overlay.style.transition="clip-path 430ms cubic-bezier(.2,.72,.2,1)";
      if(commit){setFold(1,.5);setTimeout(()=>{clear();this.render(targetIndex);},445);}
      else{setFold(0,.5);setTimeout(()=>{clear();page.innerHTML=originalHTML;},445);}
    };
    page.addEventListener("pointerup",e=>finish(e,false));page.addEventListener("pointercancel",e=>finish(e,true));
  },

  turn: function (dir) {
    const articles=window.CodeTravailState?.articles||[];
    const targetIndex=this.currentPage+dir;
    if(this.turning||targetIndex<0||targetIndex>=articles.length)return;
    const page=document.getElementById("livrePage");
    if(!page)return;
    const originalHTML=page.innerHTML;
    const oldHeight=page.getBoundingClientRect().height;
    const targetHTML=this.articleMarkup(articles[targetIndex],targetIndex,articles.length);
    this.turning=true;
    page.innerHTML=targetHTML;
    page.style.minHeight=Math.max(oldHeight,page.scrollHeight)+"px";
    const overlay=document.createElement("div");
    overlay.className="ct-finger-curl "+(dir>0?"ct-curl-forward":"ct-curl-backward");
    overlay.innerHTML='<div class="ct-curl-original"></div><div class="ct-curl-fold-shadow"></div>';
    overlay.querySelector(".ct-curl-original").innerHTML=originalHTML;
    page.appendChild(overlay);
    const setProgress=p=>{
      const base=(1-p)*100;
      page.style.setProperty("--ct-fold-x-top",dir>0?base+"%":(100-base)+"%");
      page.style.setProperty("--ct-fold-x-bottom",dir>0?base+"%":(100-base)+"%");
      page.style.setProperty("--ct-fold-mid",(dir>0?base:100-base)+"%");
      overlay.style.setProperty("--ct-fold-progress",String(p));
    };
    setProgress(0);
    overlay.style.transition="clip-path 560ms cubic-bezier(.22,.68,.18,1)";
    requestAnimationFrame(()=>requestAnimationFrame(()=>setProgress(1)));
    setTimeout(()=>{
      overlay.remove();
      page.style.removeProperty("min-height");
      page.style.removeProperty("--ct-fold-x-top");
      page.style.removeProperty("--ct-fold-x-bottom");
      page.style.removeProperty("--ct-fold-mid");
      this.render(targetIndex);
      this.turning=false;
    },590);
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
