/**
 * Domaines juridiques autonomes du Code du Travail.
 * Chaque domaine correspond au titre légal de la base, puis expose
 * ses articles regroupés et consultables individuellement.
 */
window.CodeTravailCategories = {
  metadata: {
    "Dispositions générales": {icon:"fa-scale-balanced",desc:"Champ d’application et principes généraux."},
    "Formation professionnelle": {icon:"fa-graduation-cap",desc:"Formation et qualification professionnelles."},
    "Contrat d'apprentissage": {icon:"fa-user-graduate",desc:"Apprentissage et formation en entreprise."},
    "Placement et emploi": {icon:"fa-briefcase",desc:"Placement, accès à l’emploi et recrutement."},
    "Contrat de travail": {icon:"fa-file-signature",desc:"Conclusion, exécution, suspension et rupture du contrat."},
    "Contrats particuliers": {icon:"fa-users-gear",desc:"Régimes de contrats particuliers."},
    "Durée du travail": {icon:"fa-clock",desc:"Durée du travail, repos et congés."},
    "Salaire et Avantages": {icon:"fa-money-bill-trend-up",desc:"Rémunération et avantages liés au travail."},
    "Sécurité et santé au travail": {icon:"fa-user-shield",desc:"Hygiène, sécurité et prévention des risques."},
    "Santé et services médicaux": {icon:"fa-briefcase-medical",desc:"Services médicaux et suivi de santé au travail."},
    "Inspection du Travail": {icon:"fa-user-tie",desc:"Organisation et missions de l’Inspection du Travail."},
    "Syndicats et Représentation": {icon:"fa-people-group",desc:"Organisations professionnelles et liberté syndicale."},
    "Représentation des travailleurs": {icon:"fa-users",desc:"Représentation des travailleurs dans l’entreprise."},
    "Différends et Conflits": {icon:"fa-gavel",desc:"Règlement des différends individuels et collectifs."},
    "Sécurité sociale": {icon:"fa-shield-heart",desc:"Protection et prestations de sécurité sociale."},
    "Sanctions et Pénalités": {icon:"fa-triangle-exclamation",desc:"Infractions, pénalités et dispositions finales."}
  },

  render: function() {
    const grid=document.getElementById("categoriesGrid");
    const articles=window.CodeTravailState?.articles||[];
    if(!grid) return;
    grid.innerHTML="";
    const groups=new Map();
    articles.forEach((art,index)=>{
      const key=art.titreSection||art.categorie||"Autres dispositions";
      if(!groups.has(key)) groups.set(key,{title:key,category:art.categorie||"Dispositions générales",articles:[],firstIndex:index,icon:art.icon});
      groups.get(key).articles.push({...art,__index:index});
    });
    [...groups.values()].sort((a,b)=>a.firstIndex-b.firstIndex).forEach((group,i)=>{
      const meta=this.metadata[group.category]||{icon:group.icon||"fa-folder-open",desc:"Articles et dispositions de ce titre du Code du Travail."};
      const card=document.createElement("button");
      card.type="button";
      card.className="category-card domain-card";
      card.setAttribute("aria-expanded","false");
      card.innerHTML=`
        <span class="domain-card-top"><i class="fa-solid ${meta.icon}"></i><span class="domain-count">${group.articles.length} articles</span></span>
        <h3>${window.InspecteurUtils.escapeHtml(group.title)}</h3>
        <p>${window.InspecteurUtils.escapeHtml(meta.desc)}</p>
        <span class="domain-open-label">Ouvrir ce domaine <i class="fa-solid fa-arrow-right"></i></span>`;
      card.addEventListener("click",()=>this.openDomain(group.title,card));
      grid.appendChild(card);
    });
  },

  openDomain: function(title,card) {
    const panel=document.getElementById("domainArticlesPanel");
    const articles=window.CodeTravailState?.articles||[];
    const group=articles.map((art,index)=>({...art,__index:index})).filter(art=>(art.titreSection||art.categorie||"Autres dispositions")===title);
    if(!panel||!group.length) return;
    document.querySelectorAll(".domain-card").forEach(el=>{el.classList.remove("active");el.setAttribute("aria-expanded","false");});
    card?.classList.add("active");
    card?.setAttribute("aria-expanded","true");
    const grouped=new Map();
    group.forEach(art=>{
      const key=art.categorie||"Articles généraux";
      if(!grouped.has(key)) grouped.set(key,[]);
      grouped.get(key).push(art);
    });
    panel.hidden=false;
    panel.innerHTML="";
    const head=document.createElement("div");
    head.className="domain-panel-head";
    const info=document.createElement("div");
    info.innerHTML=`<span class="domain-eyebrow">DOSSIER JURIDIQUE • ${group.length} ARTICLES</span><h3>${window.InspecteurUtils.escapeHtml(title)}</h3><p>Choisissez un article pour ouvrir son contenu et ses dispositions.</p>`;
    const close=document.createElement("button");
    close.type="button";close.className="domain-close";close.innerHTML='<i class="fa-solid fa-xmark"></i> Fermer';
    close.addEventListener("click",()=>{panel.hidden=true;card?.classList.remove("active");card?.setAttribute("aria-expanded","false");});
    head.append(info,close);panel.appendChild(head);
    grouped.forEach((items,label)=>{
      const block=document.createElement("section");block.className="domain-subgroup";
      const subhead=document.createElement("h4");
      subhead.innerHTML=`<span>${window.InspecteurUtils.escapeHtml(label)}</span><small>${items.length} article(s)</small>`;
      const list=document.createElement("div");list.className="domain-article-list";
      items.forEach(art=>{
        const btn=document.createElement("button");btn.type="button";btn.className="domain-article-row";
        btn.innerHTML=`<span class="domain-article-number">Art. ${art.numero}</span><span class="domain-article-title">${window.InspecteurUtils.escapeHtml(art.titre||"Disposition légale")}</span><i class="fa-solid fa-chevron-right"></i>`;
        btn.addEventListener("click",()=>{
          window.CodeTravailState.currentCategory=label;
          window.CodeTravailState.searchResults=items;
          window.CodeTravailConsultation?.showArticle(art.__index);
          document.getElementById("articleCard")?.scrollIntoView({behavior:"smooth",block:"start"});
        });
        list.appendChild(btn);
      });
      block.append(subhead,list);panel.appendChild(block);
    });
    panel.scrollIntoView({behavior:"smooth",block:"start"});
  },

  selectCategory: function(cat) {
    const match=(window.CodeTravailState?.articles||[]).find(a=>a.categorie===cat);
    if(match) this.openDomain(match.titreSection||cat,document.querySelector(".domain-card"));
  }
};
