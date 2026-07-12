/* ============================================================================
 * InspecteurBot — MODULE PROCÈS-VERBAUX (PV)
 * Architecture JavaScript centralisée (fichier unique app.js)
 * 100% local / hors ligne — Inspection Générale du Travail (IGT) — RDC
 * ----------------------------------------------------------------------------
 * SOMMAIRE
 *   0. Constantes & état
 *   1. Utilitaires (helpers)
 *   2. Stockage local & sauvegarde automatique (localStorage)
 *   3. Journal d'actions / audit
 *   4. Numérotation (auto/manuelle) + anti-doublon
 *   5. Moteur IA local (droit du travail RDC) + hook API optionnel
 *   6. Génération du document A4 (modèles officiels)
 *   7. QR Code (génération + scan) & authenticité
 *   8. Signature électronique tactile + cachet
 *   9. Commandes & lecture vocales
 *  10. Export PDF / Impression
 *  11. Vues (router)
 *  12. Initialisation
 * ==========================================================================*/

'use strict';

/* ==========================================================================
 * 0. CONSTANTES & ÉTAT GLOBAL
 * ========================================================================*/
const DB = window.LEGAL_DB;               // base juridique
const LS_KEY   = 'inspecteurbot_pv_v1';   // stockage principal
const LS_CFG   = 'inspecteurbot_cfg_v1';  // paramètres
const LS_LOG   = 'inspecteurbot_log_v1';  // journal d'actions

const STATUTS = {
  brouillon:{label:'Brouillon', cls:'st-brouillon'},
  cours:{label:'En cours', cls:'st-cours'},
  signe:{label:'Signé', cls:'st-signe'},
  transmis:{label:'Transmis', cls:'st-transmis'},
  archive:{label:'Archivé', cls:'st-archive'}
};

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août',
              'Septembre','Octobre','Novembre','Décembre'];
const MOIS_LETTRES = ['premier','deuxième','troisième','quatrième','cinquième','sixième',
  'septième','huitième','neuvième','dixième','onzième','douzième','treizième','quatorzième',
  'quinzième','seizième','dix-septième','dix-huitième','dix-neuvième','vingtième','vingt-et-unième',
  'vingt-deuxième','vingt-troisième','vingt-quatrième','vingt-cinquième','vingt-sixième',
  'vingt-septième','vingt-huitième','vingt-neuvième','trentième','trente-et-unième'];

let STATE = {
  view:'accueil',
  pvs:[],          // liste de tous les PV
  cfg:{},          // paramètres
  editing:null,    // PV en cours d'édition
  chat:[]          // historique assistant IA
};

/* ==========================================================================
 * 1. UTILITAIRES
 * ========================================================================*/
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => Array.from(r.querySelectorAll(s));
const el = (tag, attrs={}, html='') => { const e=document.createElement(tag);
  for(const k in attrs){ if(k==='class') e.className=attrs[k]; else if(k==='dataset') Object.assign(e.dataset,attrs[k]); else e.setAttribute(k,attrs[k]); }
  if(html) e.innerHTML=html; return e; };
const esc = s => String(s??'').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid = () => 'PV-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2,7).toUpperCase();
const nowISO = () => new Date().toISOString();
const fmtDate = iso => { const d=new Date(iso); return d.toLocaleDateString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric'}); };
const fmtDateTime = iso => { const d=new Date(iso); return d.toLocaleString('fr-FR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}); };
const fmtFC = n => (Number(n)||0).toLocaleString('fr-FR') + ' FC';
const clone = o => JSON.parse(JSON.stringify(o));

function toast(msg, type='ok'){
  const t = el('div', {class:'toast '+(type==='ok'?'ok':type==='err'?'err':type==='warn'?'warn':'')});
  t.textContent = msg; $('#toasts').appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .3s'; setTimeout(()=>t.remove(),300); }, 3200);
}

/* Nombre -> lettres (montants en dollars/FC) */
function nombreEnLettres(n){
  n = Math.round(Number(n)||0);
  if(n===0) return 'zéro';
  const u=['','un','deux','trois','quatre','cinq','six','sept','huit','neuf','dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf'];
  const d=['','','vingt','trente','quarante','cinquante','soixante','septante','quatre-vingt','nonante'];
  function sub(x){
    let r='';
    if(x>=1000000){ const m=Math.floor(x/1000000); r+=(m>1?sub(m)+' millions ':'un million '); x%=1000000; }
    if(x>=1000){ const m=Math.floor(x/1000); r+=(m>1?sub(m)+' mille ':'mille '); x%=1000; }
    if(x>=100){ const c=Math.floor(x/100); r+=(c>1?u[c]+' cent ':'cent '); x%=100; }
    if(x>=20){ const t=Math.floor(x/10), rest=x%10; r+=d[t]+(rest?'-'+u[rest]:''); x=0; }
    else if(x>0){ r+=u[x]; }
    return r.trim();
  }
  return sub(n).replace(/\s+/g,' ').trim();
}

/* ==========================================================================
 * 2. STOCKAGE & SAUVEGARDE AUTOMATIQUE
 * ========================================================================*/
function loadAll(){
  try{ STATE.pvs = JSON.parse(localStorage.getItem(LS_KEY)) || []; }catch(e){ STATE.pvs=[]; }
  try{ STATE.cfg = JSON.parse(localStorage.getItem(LS_CFG)) || {}; }catch(e){ STATE.cfg={}; }
  // valeurs par défaut config
  STATE.cfg = Object.assign({
    theme:'light',
    numMode:'auto',              // auto | manuel
    inspecteurs:[{nom:'MITWINSI WANET Hardy', grade:'Inspecteur du Travail', opj:'OPJ', habilitation:'3196/PRO15/021/2025'}],
    signatures:{}, cachets:{}, aiApiUrl:'', aiApiKey:'',
    seqCounters:{}, defaultProvince:'Kinshasa'
  }, STATE.cfg);
  document.documentElement.setAttribute('data-theme', STATE.cfg.theme||'light');
}
function saveAll(){ localStorage.setItem(LS_KEY, JSON.stringify(STATE.pvs)); }
function saveCfg(){ localStorage.setItem(LS_CFG, JSON.stringify(STATE.cfg)); }

function getPV(id){ return STATE.pvs.find(p=>p.id===id); }
function upsertPV(pv, action='Modification'){
  pv.updatedAt = nowISO();
  pv.versions = pv.versions || [];
  const existing = getPV(pv.id);
  if(existing){
    // conserve toutes les versions (archivage)
    existing.versions.push({at:existing.updatedAt, snapshot:clone({...existing, versions:undefined})});
    Object.assign(existing, pv);
    log(action, pv.id, pv.meta?.numero||'—');
  }else{
    pv.createdAt = nowISO();
    STATE.pvs.unshift(pv);
    log('Création', pv.id, pv.meta?.numero||'—');
  }
  saveAll();
}
function deletePV(id){
  const pv=getPV(id); if(!pv) return;
  STATE.pvs = STATE.pvs.filter(p=>p.id!==id);
  saveAll(); log('Suppression', id, pv.meta?.numero||'—');
}

/* Sauvegarde auto (brouillon) toutes les 20s si édition active */
let autosaveTimer=null;
function startAutosave(){
  if(autosaveTimer) clearInterval(autosaveTimer);
  autosaveTimer=setInterval(()=>{
    if(STATE.editing){ collectFormIntoEditing(); STATE.editing.statut = STATE.editing.statut||'brouillon';
      upsertPV(clone(STATE.editing),'Sauvegarde auto'); toast('💾 Brouillon sauvegardé automatiquement','ok'); }
  }, 20000);
}

/* ==========================================================================
 * 3. JOURNAL D'ACTIONS (AUDIT)
 * ========================================================================*/
function log(action, pvId, numero){
  let arr; try{ arr=JSON.parse(localStorage.getItem(LS_LOG))||[]; }catch(e){ arr=[]; }
  arr.unshift({at:nowISO(), action, pvId, numero, user:(STATE.cfg.inspecteurs?.[0]?.nom)||'Système'});
  arr = arr.slice(0,500);
  localStorage.setItem(LS_LOG, JSON.stringify(arr));
}
function getLog(){ try{ return JSON.parse(localStorage.getItem(LS_LOG))||[]; }catch(e){ return []; } }

/* ==========================================================================
 * 4. NUMÉROTATION (auto/manuelle) + ANTI-DOUBLON
 * ========================================================================*/
function genNumero(typeId, entete){
  const d = new Date();
  const seqKey = typeId+'_'+d.getFullYear();
  STATE.cfg.seqCounters[seqKey] = (STATE.cfg.seqCounters[seqKey]||0)+1;
  saveCfg();
  const seq = String(STATE.cfg.seqCounters[seqKey]).padStart(3,'0');
  const insp = STATE.cfg.inspecteurs?.[0] || {};
  const admc = 'ADMC';
  const dep = (entete?.direction||'DEP').replace(/Direction Provinciale (de |du |de la |de l'|d')?/i,'').slice(0,4).toUpperCase();
  // Format officiel : N°.../MET/IGT/ADMC/DEP/IT/OPJ/INITIALES/MOIS/ANNEE
  const initiales = (insp.nom||'HMW').split(/\s+/).map(w=>w[0]).join('').toUpperCase();
  return `${seq}/MET/IGT/${admc}/${dep}/IT/OPJ/${initiales}/${MOIS[d.getMonth()].toUpperCase()}/${d.getFullYear()}`;
}
function numeroExiste(numero, excludeId){
  const target = String(numero||'').trim().toLowerCase();
  if(!target) return false;
  return STATE.pvs.some(p=>{
    const n = (p.meta && p.meta.numero) ? p.meta.numero.trim().toLowerCase() : '';
    return n && n===target && p.id!==excludeId;
  });
}

/* ==========================================================================
 * 5. MOTEUR IA LOCAL — Droit du travail RDC
 *    - analyse de faits -> détection d'infractions (mots-clés + score)
 *    - propose articles, amendes, observations, recommandations
 *    - détecte omissions & incohérences
 *    - hook API externe optionnel (STATE.cfg.aiApiUrl / aiApiKey)
 * ========================================================================*/
const AI = {
  /* Détection d'infractions à partir d'un texte libre */
  detecter(texte){
    const t = (texte||'').toLowerCase();
    const scored = DB.INFRACTIONS_65.map(inf=>{
      let score=0;
      inf.keywords.forEach(k=>{ if(t.includes(k.toLowerCase())) score+= (k.length>3?2:1); });
      // renforts sémantiques
      if(/obstru|refus.*contr|empêch|entrav/.test(t) && inf.num===62) score+=4;
      if(/enfant|mineur/.test(t) && [8,10,36].includes(inf.num)) score+=2;
      if(/salaire|smig|paie|rémunér/.test(t) && [5,31,32,33,65].includes(inf.num)) score+=2;
      if(/sécurit|hygiè|accident/.test(t) && [11,40,41,60].includes(inf.num)) score+=2;
      return {inf, score};
    }).filter(x=>x.score>0).sort((a,b)=>b.score-a.score);
    return scored.slice(0,8).map(x=>x.inf);
  },
  /* Vérifie omissions dans un PV */
  omissions(pv){
    const o=[]; const e=pv.entete||{}, m=pv.meta||{};
    if(!m.numero) o.push("Numéro du PV manquant.");
    if(!m.date) o.push("Date de rédaction manquante.");
    if(!e.province) o.push("Province non renseignée dans l'en-tête.");
    if(!m.inspecteur) o.push("Nom de l'inspecteur/contrôleur manquant.");
    if(!m.entreprise) o.push("Entreprise contrôlée non identifiée.");
    if(!m.adresse) o.push("Adresse de l'entreprise manquante.");
    if(pv.typeId==='constat-infraction' && (!pv.infractions||!pv.infractions.length)) o.push("Aucune infraction relevée dans un PV de constat d'infraction.");
    if(pv.typeId==='constat-infraction' && !m.ordreMission) o.push("Ordre de mission non mentionné.");
    if(!m.habilitation) o.push("Numéro d'habilitation de l'OPJ non renseigné.");
    return o;
  },
  /* Cohérence juridique */
  coherence(pv){
    const c=[];
    (pv.infractions||[]).forEach(i=>{
      if(!i.articles) c.push(`Infraction "${i.libelle}" sans article violé.`);
      if(!i.montant || Number(i.montant)<=0) c.push(`Infraction "${i.libelle}" sans montant d'amende.`);
    });
    const total=(pv.infractions||[]).reduce((s,i)=>s+(Number(i.montant)||0),0);
    if(pv.totalGeneral && Number(pv.totalGeneral)!==total)
      c.push(`Le total général (${fmtFC(pv.totalGeneral)}) ne correspond pas à la somme des amendes (${fmtFC(total)}).`);
    return c;
  },
  /* Suggestions d'observations */
  observations(pv){
    const obs=[];
    const graves=(pv.infractions||[]).filter(i=>i.gravite==='grave');
    if(graves.length) obs.push(`Présence de ${graves.length} infraction(s) grave(s) : mise en conformité impérative et immédiate exigée.`);
    if((pv.infractions||[]).some(i=>/322|obstru/i.test(i.articles+i.libelle))) obs.push("Obstruction constatée : transmission au Parquet recommandée (art. 322 CT).");
    obs.push("L'entreprise est tenue de se soumettre aux prescriptions de la loi dans un bref délai, nonobstant le paiement des amendes.");
    return obs;
  },
  /* Recommandations */
  recommandations(pv){
    return [
      "Établir le PV en plusieurs ampliations conformément aux dispositions légales.",
      "Notifier une copie au contrevenant contre décharge.",
      "Fixer un délai de régularisation et prévoir un contrôle de suivi.",
      "Transmettre copie à la hiérarchie (Direction Provinciale) et au service compétent."
    ];
  },
  /* Réponse conversationnelle (base de connaissances locale) */
  async repondre(question){
    // Hook API externe optionnel
    if(STATE.cfg.aiApiUrl && STATE.cfg.aiApiKey){
      try{
        const r = await fetch(STATE.cfg.aiApiUrl, {method:'POST',
          headers:{'Content-Type':'application/json','Authorization':'Bearer '+STATE.cfg.aiApiKey},
          body:JSON.stringify({messages:[{role:'system',content:'Tu es un assistant juridique spécialisé en droit du travail de la RDC.'},{role:'user',content:question}]})});
        const j=await r.json();
        const txt = j.choices?.[0]?.message?.content || j.reply || j.output;
        if(txt) return txt + "\n\n(via API externe)";
      }catch(e){ /* repli local */ }
    }
    return AI.repondreLocal(question);
  },
  repondreLocal(q){
    const t=q.toLowerCase();
    // recherche d'articles cités
    const artMatch = t.match(/art(?:icle)?\s*\.?\s*(\d+)/);
    if(artMatch){
      const num=artMatch[1];
      const found = DB.INFRACTIONS_65.filter(i=>new RegExp('\\b'+num+'\\b').test(i.articles));
      if(found.length) return `📖 Article ${num} du Code du Travail — infractions liées :\n\n`+found.map(f=>`• ${f.libelle}\n   Sanction : ${f.sanction} (${f.refSanction})`).join('\n\n');
    }
    // détection d'infractions dans la question
    const det = AI.detecter(q);
    if(det.length){
      return `🤖 D'après votre description, les infractions suivantes du Code du Travail RDC pourraient s'appliquer :\n\n`+
        det.slice(0,5).map((f,i)=>`${i+1}. ${f.libelle}\n   • Article violé : ${f.articles}\n   • Sanction : ${f.sanction}\n   • Référence : ${f.refSanction}`).join('\n\n')+
        `\n\n💡 Vous pouvez ajouter ces infractions à un PV depuis le menu « Nouveau PV » ou « Infractions ».`;
    }
    // FAQ
    if(/obstruc|refus.*contr|entrav/.test(t)) return "🚫 En cas d'obstruction au contrôle : art. 322 CT — amende de 30.000 FC + servitude pénale de 30 jours. Établissez un PV de constat d'obstruction et transmettez au Parquet.";
    if(/smig|salaire minim/.test(t)) return "💰 Le défaut de SMIG (art. 87, 94-96 CT) peut entraîner, sur proposition de l'IT, la fermeture de l'entreprise (art. 318 CT) jusqu'à régularisation ; les salaires restent dus.";
    if(/qr|authenti/.test(t)) return "🔳 Chaque PV reçoit un identifiant unique et un QR Code local sécurisé (correction d'erreur niveau M/H). Vérifiez l'authenticité via le menu « Vérifier authenticité » ou « Scanner caméra ».";
    if(/amende|montant|calcul/.test(t)) return "🧮 Le module calcule automatiquement : montant unitaire × quantité = total par infraction, puis le total général. Les montants restent modifiables lorsque la réglementation le permet.";
    if(/bonjour|salut|aide|comment/.test(t)) return "👋 Bonjour, je suis l'Assistant IA juridique d'InspecteurBot (droit du travail RDC). Décrivez-moi les faits constatés et je vous proposerai les infractions, articles applicables et amendes. Je peux aussi rédiger vos observations et recommandations.";
    return "Je n'ai pas trouvé de correspondance précise. Décrivez les faits (ex : « absence de contrat écrit », « refus de contrôle », « pas d'horaire affiché ») ou citez un article (ex : « article 119 »).";
  }
};

/* La suite (sections 6 à 12) est ajoutée dans la partie 2 du fichier. */

/* ==========================================================================
 * 6. GÉNÉRATION DU DOCUMENT A4 (modèles officiels reproduits fidèlement)
 * ========================================================================*/
function enteteHTML(e={}){
  const dir = e.direction ? `<div>${esc(e.direction)}</div>` : '';
  const prov = e.province ? `<div>Province ${esc(e.province)}</div>` : '';
  return `
  <div class="entete">
    <div class="left">
      <div style="font-weight:bold">RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</div>
      <div>Ministère de l'Emploi et Travail</div>
      <div>${esc(e.administration||'Administration Centrale')}</div>
    </div>
    <div class="right">
      <div>${esc(e.structure||'Inspection Générale du Travail')}</div>
      <div class="igt">I.G.T</div>
      ${prov}${dir}
    </div>
  </div>`;
}

function tableauInfractionsHTML(list){
  if(!list||!list.length) return '';
  let rows=''; let total=0;
  list.forEach((i,idx)=>{
    total+=Number(i.montant)||0;
    rows+=`<tr>
      <td class="center">${String(idx+1).padStart(2,'0')}.</td>
      <td>${esc(i.libelle)}</td>
      <td>${esc(i.articles)}</td>
      <td>${fmtFC(i.montant)}</td></tr>`;
  });
  return `<table class="inf">
    <thead><tr><th style="width:7%">N°</th><th style="width:45%">INFRACTIONS</th>
    <th style="width:28%">TEXTE VIOLÉ</th><th style="width:20%">AMENDE TRANSACTIONNELLE</th></tr></thead>
    <tbody>${rows}
    <tr class="totalrow"><td colspan="3" style="text-align:right">Total général</td><td>${fmtFC(total)}</td></tr>
    </tbody></table>
    <p style="font-style:italic">En lettres : ${nombreEnLettres(total)} francs congolais.</p>`;
}

function sigsHTML(pv, roles){
  const sig = pv.signatures||{};
  return `<div class="sigs">`+ roles.map(r=>{
    const s=sig[r];
    const img = s?.data ? `<img class="sigimg" src="${s.data}" alt="signature">` : '';
    const nom = s?.nom ? `<div>${esc(s.nom)}</div>`:'';
    return `<div class="s"><div style="font-weight:bold">${esc(r.toUpperCase())}</div>${img}<div class="l">${nom}</div></div>`;
  }).join('') + `</div>`;
}

function qrStampHTML(pv){
  if(!pv.qr) return '';
  return `<div class="qr-stamp"><img src="${pv.qr}" alt="QR"><div>ID : ${esc(pv.id)}</div><div>${esc(pv.meta?.numero||'')}</div></div>`;
}
function cachetHTML(pv){
  const c = pv.cachet;
  if(!c||!c.data) return '';
  return `<img class="cachet" id="cachetImg" src="${c.data}" style="left:${c.x||60}mm;top:${c.y||210}mm">`;
}

/* Rendu de chaque modèle */
function renderDoc(pv){
  const m=pv.meta||{}, e=pv.entete||{};
  const dateLettre = ()=>{
    const d = m.date? new Date(m.date): new Date();
    return `L'an ${nombreEnLettres(d.getFullYear()).replace('mille','mil')}, le ${MOIS_LETTRES[d.getDate()-1]||d.getDate()+'e'} jour du mois de ${MOIS[d.getMonth()]}`;
  };
  const insp = m.inspecteur||'……………………';
  const ville = m.ville||'Kinshasa';

  let body='';
  switch(pv.typeId){
    /* ---- PROCÈS-VERBAL DE CONSTAT D'INFRACTION ---- */
    case 'constat-infraction':
      body = `
      ${enteteHTML(e)}
      <h2 class="tt">Procès-verbal de constat d'infraction</h2>
      <div class="num">N°${esc(m.numero||'……./MET/IGT/ADMC/DEP/IT/OPJ/…/…/202…')}</div>
      <p>${dateLettre()} ;</p>
      <p>Nous <b>${esc(insp)}</b>, ${esc(m.grade||'Inspecteur du Travail')} en compétence territoriale générale et officier de police judiciaire à compétence matérielle restreinte en matière du travail, dûment assermenté sous le numéro d'habilitation <b>${esc(m.habilitation||'…')}</b> ;</p>
      <p>Agissant en vertu des dispositions légales en la matière, notamment en ses articles 187, 196 et 197 de la loi n°015-2002 du 16 octobre 2002 portant Code du Travail, telle que modifiée et complétée à ce jour ainsi que ses mesures d'application ; En exécution de l'ordre de mission ${esc(m.ordreMission||'n°…')} ; Avons effectué une mission officielle de contrôle au sein de l'entreprise <b>${esc(m.entreprise||'…')}</b> sise au ${esc(m.adresse||'…')}, Commune de ${esc(m.commune||'…')} dans la ville-Province de ${esc(e.province||ville)} ;</p>
      <p>Avons constaté les infractions suivantes à la charge de l'entreprise précitée${m.temoins?`, en présence de ${esc(m.temoins)}`:''} :</p>
      <p style="text-align:center;font-weight:bold;text-decoration:underline">LES CONTRAVENTIONS CI-DESSOUS</p>
      ${tableauInfractionsHTML(pv.infractions)}
      ${m.observations?`<p><b>Observations :</b> ${esc(m.observations)}</p>`:''}
      <p>Ces amendes sont mises à sa charge suite aux infractions constatées au regard des dispositions du Ministère de l'Emploi et du Travail. L'entreprise est obligée de se soumettre aux prescriptions de la loi dans un bref délai.</p>
      <p>En foi de quoi, nous avons établi le présent procès-verbal d'infraction en quatre ampliations dont chacune sera transmise à qui de droit conformément aux dispositions légales susmentionnées.</p>
      <p class="fait">Fait à ${esc(ville)}, le ${m.date?fmtDate(m.date):'…'}. Nous jurons le présent Procès-Verbal sincère.</p>
      ${sigsHTML(pv,['Verbalisateur','Contrevenant'])}
      ${cachetHTML(pv)}${qrStampHTML(pv)}`;
      break;

    /* ---- CONSTAT D'OBSTRUCTION ---- */
    case 'constat-obstruction':
      body = `
      ${enteteHTML(e)}
      <h2 class="tt">Procès-verbal de constat d'obstruction</h2>
      <div class="num">N°${esc(m.numero||'…/MET/IGT/IT/OPJ/…/202…')}</div>
      <p>${dateLettre()} ;</p>
      <p>Par-devant nous, <b>${esc(insp)}</b>, ${esc(m.grade||'Inspecteur du Travail')} et Officier de Police Judiciaire à compétence restreinte en matière du travail près l'Inspection Générale du Travail, dûment assermenté à la Cour d'Appel de ${esc(m.courAppel||ville)} ; avons été en visite d'inspection sous l'ordre de mission ${esc(m.ordreMission||'n°…')} au sein de l'entreprise <b>${esc(m.entreprise||'…')}</b> sise ${esc(m.adresse||'…')}, Commune de ${esc(m.commune||'…')}, en date du ${m.date?fmtDate(m.date):'…'}.</p>
      <p>En effet, nous étions dans l'impossibilité d'accomplir la mission qui nous est dévolue par la loi et nous avons été l'objet d'une obstruction totale par le responsable de la société susmentionnée, ${esc(m.representant||'Sieur …')} ${m.fonction?`(${esc(m.fonction)})`:''} ; nous référant aux dispositions de l'Ordonnance-loi n°16/010 du 15 juillet 2016 modifiant et complétant la loi n°015-2002 portant Code du Travail en son article 322.</p>
      ${m.observations?`<p><b>Observations :</b> ${esc(m.observations)}</p>`:''}
      <p>En foi de quoi, nous avons établi ce procès-verbal de constat d'obstruction en trois ampliations dont chacune sera remise au Ministère ayant en charge l'Emploi et le Travail, au Procureur près le Parquet de Grande Instance de ${esc(ville)} et au contrevenant.</p>
      <p class="fait">Fait à ${esc(ville)}, le ${m.date?fmtDate(m.date):'…'}. Nous jurons que ce procès-verbal est sincère.</p>
      ${sigsHTML(pv,['Inspecteur','Contrevenant'])}
      ${cachetHTML(pv)}${qrStampHTML(pv)}`;
      break;

    /* ---- NON-CONCILIATION ---- */
    case 'non-conciliation':
      body = `
      ${enteteHTML(e)}
      <h2 class="tt">Procès-verbal de non-conciliation de litige individuel du travail</h2>
      <div class="num">N°${esc(m.numero||'…/MET/DPS/IPT/…/202…')}</div>
      <p>${dateLettre()}, Nous, <b>${esc(insp)}</b>, ${esc(m.grade||'Inspecteur Principal du Travail')} et Officier de Police Judiciaire à compétence restreinte en matière du travail, dûment assermenté et identifié sous le numéro ${esc(m.habilitation||'…')}, affecté à l'Inspection Générale du Travail, nous trouvant à ${esc(ville)}.</p>
      <p>Monsieur/Madame <b>${esc(m.demandeur||'…')}</b>, ${esc(m.adresseDemandeur||'résident à …')}, demandeur d'une part ${m.avocatDemandeur?`représenté par ${esc(m.avocatDemandeur)}`:''} ;</p>
      <p>La société <b>${esc(m.entreprise||'…')}</b> sise ${esc(m.adresse||'…')}, Commune de ${esc(m.commune||'…')}, ici représentée par ${esc(m.representant||'…')}, défenderesse d'autre part ;</p>
      <p><b>EXPOSÉ DES FAITS :</b> ${esc(m.faits||'…')}</p>
      <p style="font-weight:bold">CONSTAT DE L'INSPECTEUR DU TRAVAIL</p>
      <p>${esc(m.constat||'…')}</p>
      <p style="font-weight:bold">PROPOSITION</p>
      <p>${esc(m.proposition||'…')}</p>
      <p style="font-weight:bold">DÉSACCORD DES PARTIES</p>
      <p>Après une tentative de conciliation, les deux parties ne sont pas parvenues à concilier leurs désaccords, sur pied des dispositions de l'article 302 du Code du Travail.</p>
      <p>En foi de quoi, le présent procès-verbal est dressé et signé en quatre exemplaires par les parties et nous-mêmes, dont chacune a reçu un original. Nous jurons que le présent Procès-Verbal est sincère.</p>
      ${sigsHTML(pv,['Demandeur','Défendeur','Inspecteur'])}
      ${cachetHTML(pv)}${qrStampHTML(pv)}`;
      break;

    /* ---- MISE EN DEMEURE ---- */
    case 'mise-en-demeure':
      body = `
      ${enteteHTML(e)}
      <div style="margin-top:8mm">
        <div><b>OPJ :</b> ${esc(insp)}</div>
        <div>${esc(m.grade||'Inspecteur du Travail')}</div>
        <div><b>Adresse :</b> ${esc(m.adresseOpj||'…')}</div>
      </div>
      <p style="text-align:right;margin-top:4mm">${esc(ville)}, le ${m.date?fmtDate(m.date):'…'}</p>
      <p style="margin-top:4mm"><b>Concerne :</b> MISE EN DEMEURE ${m.motif?`— ${esc(m.motif)}`:''}<br>
      Réf. mission : ${esc(m.ordreMission||m.numero||'…')}</p>
      <p><b>Au Responsable de ${esc(m.entreprise||'…')}</b></p>
      <p>Monsieur/Madame,</p>
      <p>${esc(m.corps||"Je vous écris suite à notre mission de contrôle. Le refus de nous recevoir constitue une violation des dispositions des articles 186, 187 et 197 du Code du Travail congolais.")}</p>
      <p>Par la présente, je vous mets en demeure de donner libre accès à notre mission et de nous fournir les documents demandés dans un délai de <b>${esc(m.delai||'24h')}</b> à compter de la réception de ce courrier.</p>
      <p>Je vous rappelle qu'en l'absence de réponse ou en cas de maintien de votre refus, je me verrai contraint de saisir la juridiction compétente ou d'appliquer les sanctions prévues par l'arrêté n°CAB/MIN/ETPS/CNM/HMK/JBI/006/09/2023 et n°CAB/MIN/FINANCES/127/09/2023 du 03/10/2023.</p>
      <p>Veuillez considérer cette lettre comme une mise en demeure formelle. Cordialement.</p>
      <p class="fait">Fait à ${esc(ville)}, le ${m.date?fmtDate(m.date):'…'}</p>
      ${sigsHTML(pv,['OPJ'])}
      ${cachetHTML(pv)}${qrStampHTML(pv)}`;
      break;

    default: body = `<p>Modèle inconnu.</p>`;
  }
  return `<div class="a4" id="a4doc">${body}</div>`;
}

/* ==========================================================================
 * 7. QR CODE (génération locale) + AUTHENTICITÉ
 * ========================================================================*/
function buildQR(pv, level='H'){
  const payload = JSON.stringify({
    app:'InspecteurBot', id:pv.id, num:pv.meta?.numero||'',
    type:pv.typeId, date:pv.meta?.date||'', h:pv.meta?.heure||'',
    ent:pv.meta?.entreprise||'', sig:signatureHash(pv)
  });
  const cv=document.createElement('canvas');
  new QRious({element:cv, value:payload, size:260, level:level, background:'#fff', foreground:'#000'});
  return cv.toDataURL('image/png');
}
function signatureHash(pv){
  // empreinte simple pour vérification d'intégrité
  const s = (pv.id||'')+(pv.meta?.numero||'')+(pv.meta?.entreprise||'')+(pv.totalGeneral||'');
  let h=0; for(let i=0;i<s.length;i++){ h=((h<<5)-h+s.charCodeAt(i))|0; }
  return (h>>>0).toString(16).toUpperCase();
}

/* ==========================================================================
 * 8. SIGNATURE ÉLECTRONIQUE TACTILE
 * ========================================================================*/
function initSignaturePad(canvas, onDone){
  const ctx=canvas.getContext('2d'); let drawing=false;
  ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.strokeStyle='#0b2540';
  const pos=e=>{ const r=canvas.getBoundingClientRect();
    const p=e.touches?e.touches[0]:e; return {x:(p.clientX-r.left)*(canvas.width/r.width),y:(p.clientY-r.top)*(canvas.height/r.height)}; };
  const start=e=>{ drawing=true; const {x,y}=pos(e); ctx.beginPath(); ctx.moveTo(x,y); e.preventDefault(); };
  const move=e=>{ if(!drawing)return; const {x,y}=pos(e); ctx.lineTo(x,y); ctx.stroke(); e.preventDefault(); };
  const end=()=>{ if(drawing&&onDone) onDone(); drawing=false; };
  canvas.addEventListener('mousedown',start); canvas.addEventListener('mousemove',move);
  window.addEventListener('mouseup',end);
  canvas.addEventListener('touchstart',start,{passive:false});
  canvas.addEventListener('touchmove',move,{passive:false});
  canvas.addEventListener('touchend',end);
  return {clear:()=>ctx.clearRect(0,0,canvas.width,canvas.height),
          data:()=>canvas.toDataURL('image/png')};
}

/* ==========================================================================
 * 9. COMMANDES & LECTURE VOCALES
 * ========================================================================*/
const Speech = {
  rec:null, target:null,
  supported(){ return ('webkitSpeechRecognition' in window)||('SpeechRecognition' in window); },
  dicter(inputEl){
    if(!this.supported()){ toast('Reconnaissance vocale non supportée par ce navigateur','warn'); return; }
    const R=window.SpeechRecognition||window.webkitSpeechRecognition;
    this.rec=new R(); this.rec.lang='fr-FR'; this.rec.interimResults=false; this.rec.continuous=false;
    const wrap=inputEl.closest('.inp-wrap'); wrap&&wrap.classList.add('rec');
    this.rec.onresult=e=>{ const txt=e.results[0][0].transcript;
      inputEl.value = (inputEl.value?inputEl.value+' ':'')+txt;
      inputEl.dispatchEvent(new Event('input',{bubbles:true})); toast('🎤 Dictée insérée','ok'); };
    this.rec.onerror=()=>toast('Erreur micro','err');
    this.rec.onend=()=>{ wrap&&wrap.classList.remove('rec'); };
    this.rec.start();
  },
  lire(text){
    if(!('speechSynthesis'in window)){ toast('Synthèse vocale non supportée','warn'); return; }
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text); u.lang='fr-FR'; u.rate=0.98;
    speechSynthesis.speak(u); toast('🔊 Lecture en cours…','ok');
  },
  stop(){ if('speechSynthesis'in window) speechSynthesis.cancel(); }
};

/* ==========================================================================
 * 10. EXPORT PDF / IMPRESSION
 * ========================================================================*/
async function exportPDF(pv){
  const node = $('#a4doc'); if(!node){ toast('Ouvrez d\'abord l\'aperçu du PV','warn'); return; }
  toast('⏳ Génération du PDF…','ok');
  try{
    const canvas = await html2canvas(node, {scale:2, backgroundColor:'#ffffff', useCORS:true});
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p','mm','a4');
    const w=210, h=canvas.height*w/canvas.width;
    let pos=0, pageH=297;
    const img=canvas.toDataURL('image/png');
    if(h<=pageH){ pdf.addImage(img,'PNG',0,0,w,h); }
    else{ let left=h; while(left>0){ pdf.addImage(img,'PNG',0,pos,w,h); left-=pageH; pos-=pageH; if(left>0)pdf.addPage(); } }
    pdf.save((pv.meta?.numero||pv.id).replace(/[\/\\]/g,'-')+'.pdf');
    toast('✅ PDF exporté','ok');
  }catch(e){ toast('Erreur PDF : '+e.message,'err'); }
}
function imprimer(){ window.print(); }

/* ==========================================================================
 * 11. VUES (ROUTER)
 * ========================================================================*/
const TITLES = {accueil:'Accueil',nouveau:'Nouveau PV',tous:'Tous les PV',brouillons:'Brouillons',
  modeles:'Modèles officiels',assistant:'Assistant IA juridique',infractions:'Infractions & Sanctions',
  signature:'Signature électronique',qrcode:'QR Code',scanner:'Scanner caméra',verif:'Vérifier authenticité',
  recherche:'Recherche avancée',historique:'Historique',stats:'Statistiques',parametres:'Paramètres',apercu:'Aperçu du PV'};

function go(view, arg){
  STATE.view=view;
  $$('.nav-item').forEach(n=>n.classList.toggle('active', n.dataset.view===view));
  $('#pageTitle').textContent = TITLES[view]||view;
  $('#sidebar').classList.remove('open');
  const v=$('#view'); v.innerHTML='';
  (VIEWS[view]||VIEWS.accueil)(v, arg);
  window.scrollTo(0,0);
}

const VIEWS = {};

/* ---- ACCUEIL / DASHBOARD ---- */
VIEWS.accueil = (root)=>{
  const p=STATE.pvs;
  const by=s=>p.filter(x=>x.statut===s).length;
  const entreprises=new Set(p.map(x=>x.meta?.entreprise).filter(Boolean)).size;
  const totalInfr=p.reduce((s,x)=>s+((x.infractions||[]).length),0);
  const totalAmendes=p.reduce((s,x)=>s+((x.infractions||[]).reduce((a,i)=>a+(Number(i.montant)||0),0)),0);
  const stat=(v,k,cls,ic)=>`<div class="stat ${cls}"><div class="ic">${ic}</div><div class="v">${v}</div><div class="k">${k}</div></div>`;
  root.innerHTML=`
  <div class="grid stats">
    ${stat(p.length,'Total des PV','accent','📄')}
    ${stat(by('cours'),'PV en cours','info','⏳')}
    ${stat(by('brouillon'),'Brouillons','warn','📝')}
    ${stat(by('signe'),'PV signés','ok','✍️')}
    ${stat(by('transmis'),'PV transmis','info','📤')}
    ${stat(by('archive'),'PV archivés','','🗄️')}
    ${stat(entreprises,'Entreprises contrôlées','info','🏢')}
    ${stat(totalInfr,'Total infractions','warn','⚠️')}
    ${stat(fmtFC(totalAmendes),'Total des amendes','accent','💰')}
  </div>
  <div class="grid two-col" style="margin-top:18px">
    <div class="card"><div class="hd"><h3>🕘 Derniers PV créés</h3><span class="spacer"></span>
      <button class="btn sm" data-view="tous">Voir tout</button></div>
      <div class="bd" id="lastPvs"></div></div>
    <div class="card"><div class="hd"><h3>📌 Activité récente</h3></div>
      <div class="bd" id="recentAct"></div></div>
  </div>`;
  $('#quickNew')?.addEventListener('click',()=>go('nouveau'));
  // derniers PV
  const last=p.slice(0,6);
  $('#lastPvs').innerHTML = last.length? `<table class="tbl"><thead><tr><th>Numéro</th><th>Type</th><th>Entreprise</th><th>Statut</th><th></th></tr></thead><tbody>`+
    last.map(x=>`<tr><td>${esc(x.meta?.numero||'—')}</td><td>${esc(typeName(x.typeId))}</td><td>${esc(x.meta?.entreprise||'—')}</td>
      <td><span class="st ${STATUTS[x.statut]?.cls}">${STATUTS[x.statut]?.label||x.statut}</span></td>
      <td><button class="btn sm" data-open="${x.id}">Ouvrir</button></td></tr>`).join('')+`</tbody></table>`
    : `<div class="list-empty">Aucun PV pour le moment. Cliquez sur « Nouveau PV » pour commencer.</div>`;
  // activité
  const lg=getLog().slice(0,10);
  $('#recentAct').innerHTML = lg.length? lg.map(l=>`<div style="padding:7px 0;border-bottom:1px solid var(--line)">
    <div class="small"><b>${esc(l.action)}</b> — ${esc(l.numero)}</div>
    <div class="small muted">${fmtDateTime(l.at)} · ${esc(l.user)}</div></div>`).join('')
    : `<div class="list-empty">Aucune activité.</div>`;
  bindOpen(root);
};

function typeName(id){ return (DB.TYPES_PV.find(t=>t.id===id)||{}).nom||id; }
function bindOpen(root){ $$('[data-open]',root).forEach(b=>b.addEventListener('click',()=>openEditor(b.dataset.open))); }

/* ---- NOUVEAU PV : choix du modèle ---- */
VIEWS.nouveau = (root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>Choisissez un modèle officiel de PV</h3></div>
    <div class="bd"><div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(240px,1fr))">
    ${DB.TYPES_PV.map(t=>`<div class="stat accent" style="cursor:pointer" data-new="${t.id}">
      <div class="ic">${t.icon}</div><div class="v" style="font-size:15px;line-height:1.3">${t.icon}</div>
      <div style="font-weight:700;color:var(--brand);margin:6px 0 4px">${esc(t.nom)}</div>
      <div class="k">${t.hasTableau?'Avec tableau d\'infractions':'Document narratif'} · ${t.hasNumero?'Numéroté':''}</div>
    </div>`).join('')}
    </div></div></div>`;
  $$('[data-new]',root).forEach(c=>c.addEventListener('click',()=>createPV(c.dataset.new)));
};

function createPV(typeId){
  const t = DB.TYPES_PV.find(x=>x.id===typeId);
  const d=new Date();
  const pv={ id:uid(), typeId, statut:'brouillon',
    entete:{administration:'Administration Centrale',structure:'Inspection Générale du Travail',
      province:STATE.cfg.defaultProvince, direction:dirFor(STATE.cfg.defaultProvince)},
    meta:{numero:'', date:d.toISOString().slice(0,10), heure:d.toTimeString().slice(0,5),
      inspecteur:STATE.cfg.inspecteurs?.[0]?.nom||'', grade:STATE.cfg.inspecteurs?.[0]?.grade||'',
      habilitation:STATE.cfg.inspecteurs?.[0]?.habilitation||''},
    infractions:[], signatures:{}, versions:[], totalGeneral:0 };
  if(STATE.cfg.numMode==='auto') pv.meta.numero=genNumero(typeId, pv.entete);
  upsertPV(pv,'Création');
  openEditor(pv.id);
}
function dirFor(prov){ return (DB.RDC_PROVINCES.find(p=>p.province===prov)||{}).direction||''; }

/* ---- ÉDITEUR DE PV ---- */
function openEditor(id){
  const pv=getPV(id); if(!pv){ toast('PV introuvable','err'); return; }
  STATE.editing=clone(pv);
  STATE.view='editor'; $('#pageTitle').textContent='Édition — '+typeName(pv.typeId);
  $$('.nav-item').forEach(n=>n.classList.remove('active'));
  const v=$('#view'); v.innerHTML=editorHTML(STATE.editing);
  bindEditor(STATE.editing);
  startAutosave();
}

function editorHTML(pv){
  const t=DB.TYPES_PV.find(x=>x.id===pv.typeId);
  return `
  <div class="doc-toolbar no-print">
    <button class="btn ghost sm" id="backBtn">← Retour</button>
    <span class="pill">${t.icon} ${esc(t.nom)}</span>
    <span class="st ${STATUTS[pv.statut]?.cls}">${STATUTS[pv.statut]?.label}</span>
    <span class="spacer"></span>
    <button class="btn sm" id="aiAssistBtn">🤖 Assistance IA</button>
    <button class="btn sm" id="readBtn">🔊 Lire</button>
    <button class="btn ok sm" id="saveBtn">💾 Enregistrer</button>
    <button class="btn accent sm" id="previewBtn">👁️ Aperçu / PDF</button>
  </div>
  <div class="tabs no-print">
    <div class="tab active" data-tab="entete">En-tête</div>
    <div class="tab" data-tab="infos">Informations</div>
    ${t.hasTableau?'<div class="tab" data-tab="infr">Infractions</div>':''}
    <div class="tab" data-tab="sign">Signatures & Cachet</div>
    <div class="tab" data-tab="doc">Document A4</div>
  </div>
  <div id="tabEntete" class="tabpane">${paneEntete(pv)}</div>
  <div id="tabInfos" class="tabpane hidden">${paneInfos(pv)}</div>
  ${t.hasTableau?`<div id="tabInfr" class="tabpane hidden">${paneInfr(pv)}</div>`:''}
  <div id="tabSign" class="tabpane hidden">${paneSign(pv)}</div>
  <div id="tabDoc" class="tabpane hidden"><div class="a4-scroll">${renderDoc(pv)}</div></div>`;
}

/* champ avec micro dictée */
function fld(label,name,val,type='text',req=false,mic=true){
  const inp = type==='textarea'
    ? `<textarea name="${name}" data-f="${name}">${esc(val||'')}</textarea>`
    : `<input type="${type}" name="${name}" data-f="${name}" value="${esc(val||'')}">`;
  return `<div class="field"><label>${label}${req?' <span class="req">*</span>':''}</label>
    <div class="inp-wrap">${inp}${mic?`<button type="button" class="mic" data-mic="${name}" title="Dictée vocale">🎤</button>`:''}</div></div>`;
}

function paneEntete(pv){
  const e=pv.entete||{};
  const provOpts=DB.RDC_PROVINCES.map(p=>`<option value="${esc(p.province)}"${p.province===e.province?' selected':''}>${esc(p.province)}</option>`).join('');
  return `<div class="card"><div class="hd"><h3>En-tête administratif dynamique</h3></div><div class="bd">
    <div class="form-grid">
      <div class="field"><label>République</label><input value="République Démocratique du Congo" disabled></div>
      <div class="field"><label>Ministère</label><input value="Ministère de l'Emploi et Travail" disabled></div>
      ${fld('Administration','administration',e.administration,'text',false,false)}
      ${fld('Structure compétente','structure',e.structure,'text',false,false)}
      <div class="field"><label>Province <span class="req">*</span></label>
        <select data-f="province" name="province">${provOpts}</select></div>
      <div class="field"><label>Direction Provinciale</label>
        <input data-f="direction" name="direction" value="${esc(e.direction||'')}" readonly></div>
    </div>
    <p class="small muted">Le changement de province met automatiquement à jour la Direction Provinciale correspondante.</p>
  </div></div>`;
}

function paneInfos(pv){
  const m=pv.meta||{}, t=pv.typeId;
  let extra='';
  if(t==='non-conciliation') extra=`${fld('Demandeur','demandeur',m.demandeur)}${fld('Avocat du demandeur','avocatDemandeur',m.avocatDemandeur)}
    ${fld('Exposé des faits','faits',m.faits,'textarea')}${fld('Constat de l\'inspecteur','constat',m.constat,'textarea')}
    ${fld('Proposition','proposition',m.proposition,'textarea')}`;
  if(t==='mise-en-demeure') extra=`${fld('Motif','motif',m.motif)}${fld('Adresse OPJ','adresseOpj',m.adresseOpj)}
    ${fld('Corps de la lettre','corps',m.corps,'textarea')}${fld('Délai','delai',m.delai||'24h')}`;
  return `<div class="card"><div class="hd"><h3>Informations variables</h3>
    <span class="spacer"></span><button class="btn sm no-print" id="autoNumBtn">🔢 N° automatique</button></div>
    <div class="bd"><div class="form-grid">
      ${fld('Numéro du PV','numero',m.numero,'text',true)}
      ${fld('Date','date',m.date,'date',true,false)}
      ${fld('Heure','heure',m.heure,'time',false,false)}
      ${fld('Inspecteur / Contrôleur','inspecteur',m.inspecteur,'text',true)}
      ${fld('Grade / Fonction','grade',m.grade)}
      ${fld('N° d\'habilitation','habilitation',m.habilitation)}
      ${fld('Ordre de mission','ordreMission',m.ordreMission)}
      ${fld('Entreprise','entreprise',m.entreprise,'text',true)}
      ${fld('RCCM','rccm',m.rccm)}
      ${fld('ID NAT','idnat',m.idnat)}
      ${fld('N° Impôt','impot',m.impot)}
      ${fld('Adresse','adresse',m.adresse,'text',true)}
      ${fld('Commune','commune',m.commune)}
      ${fld('Ville','ville',m.ville||'Kinshasa')}
      ${fld('Téléphone','telephone',m.telephone,'tel')}
      ${fld('Représentant','representant',m.representant)}
      ${fld('Fonction du représentant','fonction',m.fonction)}
      ${fld('Témoins','temoins',m.temoins)}
      ${extra}
      ${fld('Observations','observations',m.observations,'textarea')}
      ${fld('Annexes','annexes',m.annexes,'textarea')}
    </div></div></div>`;
}

function paneInfr(pv){
  return `<div class="card"><div class="hd"><h3>Tableau intelligent des infractions</h3>
    <span class="spacer"></span>
    <button class="btn sm no-print" id="aiDetectBtn">🤖 Détecter via IA</button>
    <button class="btn primary sm no-print" id="addInfrBtn">➕ Ajouter</button></div>
    <div class="bd">
      <table class="tbl" id="infrTable"><thead><tr>
        <th>N°</th><th>Infraction</th><th>Article</th><th>Gravité</th><th>Montant (FC)</th><th>Observation</th><th></th>
      </tr></thead><tbody id="infrBody"></tbody>
      <tfoot><tr><td colspan="4" style="text-align:right;font-weight:700">TOTAL GÉNÉRAL</td>
        <td id="infrTotal" style="font-weight:700">0 FC</td><td colspan="2"></td></tr></tfoot>
      </table>
      <p class="small muted" id="infrLettres"></p>
    </div></div>`;
}

function paneSign(pv){
  const t=DB.TYPES_PV.find(x=>x.id===pv.typeId);
  const roles=t.hasSignatures;
  return `<div class="card"><div class="hd"><h3>Signature électronique (tactile)</h3></div><div class="bd">
    <div class="sig-box">
      ${roles.map(r=>`<div class="sig-card">
        <h4>${esc(r)}</h4>
        <canvas class="sig-pad" data-sig="${r}" width="420" height="160"></canvas>
        <div class="row" style="margin-top:8px">
          <input placeholder="Nom / Fonction" data-signom="${r}" value="${esc(pv.signatures?.[r]?.nom||'')}" style="max-width:200px">
          <button class="btn sm" data-sigclear="${r}">Effacer</button>
          <button class="btn ok sm" data-sigsave="${r}">✔ Valider</button>
        </div>
        <div class="sig-preview" data-sigprev="${r}">${pv.signatures?.[r]?.data?`<img src="${pv.signatures[r].data}">`:''}</div>
      </div>`).join('')}
    </div>
    <hr>
    <h4 style="color:var(--brand)">Cachet numérique officiel</h4>
    <div class="row">
      <input type="file" accept="image/*" id="cachetFile">
      <label class="small">X (mm)</label><input type="number" id="cachetX" value="${pv.cachet?.x||60}" style="max-width:90px">
      <label class="small">Y (mm)</label><input type="number" id="cachetY" value="${pv.cachet?.y||210}" style="max-width:90px">
      <button class="btn sm" id="cachetApply">Appliquer</button>
      <button class="btn ghost sm" id="cachetRemove">Retirer</button>
    </div>
    <p class="small muted">Le cachet est repositionnable via ses coordonnées ou par glisser-déposer dans l'aperçu.</p>
  </div></div>`;
}

/* ---- Collecte du formulaire vers STATE.editing ---- */
function collectFormIntoEditing(){
  const pv=STATE.editing; if(!pv) return;
  $$('[data-f]').forEach(inp=>{
    const f=inp.dataset.f;
    if(['province','direction','administration','structure'].includes(f)) pv.entete[f]=inp.value;
    else pv.meta[f]=inp.value;
  });
  // total
  pv.totalGeneral=(pv.infractions||[]).reduce((s,i)=>s+(Number(i.montant)||0),0);
}

function bindEditor(pv){
  const root=$('#view');
  $('#backBtn').addEventListener('click',()=>{ STATE.editing=null; go('tous'); });
  // tabs
  $$('.tab',root).forEach(tb=>tb.addEventListener('click',()=>{
    $$('.tab',root).forEach(x=>x.classList.remove('active')); tb.classList.add('active');
    $$('.tabpane',root).forEach(p=>p.classList.add('hidden'));
    const map={entete:'tabEntete',infos:'tabInfos',infr:'tabInfr',sign:'tabSign',doc:'tabDoc'};
    const pane=$('#'+map[tb.dataset.tab]);
    if(tb.dataset.tab==='doc'){ collectFormIntoEditing(); pane.querySelector('.a4-scroll').innerHTML=renderDoc(pv); bindCachetDrag(pv); }
    pane.classList.remove('hidden');
  }));
  // province -> direction auto
  const provSel=$('[data-f="province"]',root);
  provSel&&provSel.addEventListener('change',()=>{ const d=dirFor(provSel.value);
    const di=$('[data-f="direction"]',root); if(di) di.value=d; });
  // dictée micro
  $$('[data-mic]',root).forEach(b=>b.addEventListener('click',()=>{
    const inp=$(`[data-f="${b.dataset.mic}"]`,root); if(inp) Speech.dicter(inp);
  }));
  // numéro auto
  $('#autoNumBtn')?.addEventListener('click',()=>{ collectFormIntoEditing();
    const n=genNumero(pv.typeId,pv.entete); $('[data-f="numero"]').value=n; toast('Numéro généré','ok'); });
  // enregistrer
  $('#saveBtn').addEventListener('click',()=>saveEditor());
  // aperçu
  $('#previewBtn').addEventListener('click',()=>{ saveEditor(true); go('apercu',pv.id); });
  // lecture vocale
  $('#readBtn').addEventListener('click',()=>{ collectFormIntoEditing(); Speech.lire(pvToText(pv)); });
  // IA
  $('#aiAssistBtn').addEventListener('click',()=>{ collectFormIntoEditing(); openAIAssist(pv); });

  // infractions
  if($('#infrBody')){ renderInfrRows(pv);
    $('#addInfrBtn').addEventListener('click',()=>openInfrPicker(pv));
    $('#aiDetectBtn').addEventListener('click',()=>{ collectFormIntoEditing(); aiDetectInto(pv); });
  }
  // signatures
  $$('.sig-pad',root).forEach(cv=>{
    const role=cv.dataset.sig; const pad=initSignaturePad(cv);
    cv._pad=pad;
    // recharge existante
    if(pv.signatures?.[role]?.data){ const img=new Image(); img.onload=()=>cv.getContext('2d').drawImage(img,0,0,cv.width,cv.height); img.src=pv.signatures[role].data; }
    $(`[data-sigclear="${role}"]`,root).addEventListener('click',()=>pad.clear());
    $(`[data-sigsave="${role}"]`,root).addEventListener('click',()=>{
      const nom=$(`[data-signom="${role}"]`,root).value;
      pv.signatures[role]={data:pad.data(),nom, at:nowISO()};
      $(`[data-sigprev="${role}"]`,root).innerHTML=`<img src="${pv.signatures[role].data}">`;
      toast('✔ Signature enregistrée : '+role,'ok');
    });
  });
  // cachet
  $('#cachetApply')?.addEventListener('click',()=>{
    const f=$('#cachetFile').files[0];
    const x=Number($('#cachetX').value)||60, y=Number($('#cachetY').value)||210;
    if(f){ const r=new FileReader(); r.onload=()=>{ pv.cachet={data:r.result,x,y}; toast('Cachet appliqué','ok'); }; r.readAsDataURL(f); }
    else if(pv.cachet){ pv.cachet.x=x; pv.cachet.y=y; toast('Position mise à jour','ok'); }
    else toast('Sélectionnez une image de cachet','warn');
  });
  $('#cachetRemove')?.addEventListener('click',()=>{ pv.cachet=null; toast('Cachet retiré','ok'); });
}

function saveEditor(silent){
  collectFormIntoEditing();
  const pv=STATE.editing;
  // validations
  if(!pv.meta.numero && DB.TYPES_PV.find(t=>t.id===pv.typeId).hasNumero){ toast('Le numéro est obligatoire','warn'); }
  if(pv.meta.numero && numeroExiste(pv.meta.numero, pv.id)){ toast('⛔ Doublon : ce numéro existe déjà','err'); return false; }
  // génère QR
  pv.qr=buildQR(pv,'H');
  upsertPV(clone(pv),'Enregistrement');
  if(!silent) toast('✅ PV enregistré','ok');
  return true;
}

function pvToText(pv){
  const m=pv.meta||{};
  let txt=`${typeName(pv.typeId)}. Numéro ${m.numero||'non défini'}. Entreprise ${m.entreprise||'non définie'}. `;
  if(pv.infractions?.length){ txt+=`Infractions relevées : `;
    pv.infractions.forEach((i,x)=>{ txt+=`${x+1}. ${i.libelle}, article ${i.articles}, amende ${i.montant} francs. `; });
    txt+=`Total général ${pv.totalGeneral} francs congolais. `; }
  if(m.observations) txt+=`Observations : ${m.observations}.`;
  return txt;
}

/* ---- Tableau infractions ---- */
function renderInfrRows(pv){
  const body=$('#infrBody'); if(!body) return;
  body.innerHTML=(pv.infractions||[]).map((i,idx)=>`<tr>
    <td>${String(idx+1).padStart(2,'0')}</td>
    <td>${esc(i.libelle)}</td>
    <td>${esc(i.articles)}</td>
    <td><span class="badge b-${i.gravite||'moyenne'}">${i.gravite||'moyenne'}</span></td>
    <td><input type="number" data-infm="${idx}" value="${Number(i.montant)||0}" style="max-width:110px"></td>
    <td><input data-info="${idx}" value="${esc(i.observation||'')}" style="min-width:120px"></td>
    <td><button class="btn danger sm" data-infd="${idx}">✕</button></td></tr>`).join('');
  const total=(pv.infractions||[]).reduce((s,i)=>s+(Number(i.montant)||0),0);
  $('#infrTotal').textContent=fmtFC(total);
  $('#infrLettres').textContent = total? `En lettres : ${nombreEnLettres(total)} francs congolais.`:'';
  $$('[data-infm]',body).forEach(inp=>inp.addEventListener('input',()=>{ pv.infractions[inp.dataset.infm].montant=Number(inp.value)||0; renderInfrRows(pv); }));
  $$('[data-info]',body).forEach(inp=>inp.addEventListener('input',()=>{ pv.infractions[inp.dataset.info].observation=inp.value; }));
  $$('[data-infd]',body).forEach(b=>b.addEventListener('click',()=>{ pv.infractions.splice(Number(b.dataset.infd),1); renderInfrRows(pv); }));
}

function openInfrPicker(pv){
  const items=DB.INFRACTIONS_65.map(i=>`<label style="display:flex;gap:8px;padding:6px;border-bottom:1px solid var(--line);cursor:pointer">
    <input type="checkbox" value="${i.num}" style="width:auto"><div><b>${i.num}.</b> ${esc(i.libelle)}<br>
    <span class="small muted">${esc(i.articles)} · ${esc(i.sanction)}</span></div></label>`).join('');
  showModal('Sélectionner des infractions (65 disponibles)',
    `<input id="infrSearch" placeholder="🔍 Rechercher une infraction ou un article…" style="margin-bottom:10px">
     <div id="infrList" style="max-height:52vh;overflow:auto">${items}</div>`,
    [{label:'Ajouter la sélection',cls:'primary',fn:()=>{
        $$('#infrList input:checked').forEach(ch=>{
          const inf=DB.INFRACTIONS_65.find(x=>x.num==ch.value);
          pv.infractions.push({num:inf.num,libelle:inf.libelle,articles:inf.articles,
            gravite:inf.gravite,sanction:inf.sanction,refSanction:inf.refSanction,
            montant:inf.montantFC,observation:''});
        });
        closeModal(); renderInfrRows(pv); toast('Infractions ajoutées','ok');
     }}]);
  $('#infrSearch').addEventListener('input',e=>{ const q=e.target.value.toLowerCase();
    $$('#infrList label').forEach(l=>l.style.display=l.textContent.toLowerCase().includes(q)?'':'none'); });
}

function aiDetectInto(pv){
  const src=(pv.meta.observations||'')+' '+(pv.meta.faits||'')+' '+(pv.meta.corps||'');
  if(!src.trim()){ toast('Saisissez d\'abord des faits/observations pour l\'analyse IA','warn'); return; }
  const det=AI.detecter(src);
  if(!det.length){ toast('Aucune infraction détectée automatiquement','warn'); return; }
  det.forEach(inf=>{ if(!pv.infractions.some(x=>x.num===inf.num))
    pv.infractions.push({num:inf.num,libelle:inf.libelle,articles:inf.articles,gravite:inf.gravite,
      sanction:inf.sanction,refSanction:inf.refSanction,montant:inf.montantFC,observation:'Détectée par IA'}); });
  renderInfrRows(pv); toast(`🤖 ${det.length} infraction(s) proposée(s) par l'IA`,'ok');
}

/* ---- Assistant IA contextuel dans l'éditeur ---- */
function openAIAssist(pv){
  const om=AI.omissions(pv), co=AI.coherence(pv), obs=AI.observations(pv), rec=AI.recommandations(pv);
  const list=(arr,empty)=>arr.length?`<ul>${arr.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:`<p class="small muted">${empty}</p>`;
  showModal('🤖 Assistance IA — Analyse du PV',
    `<h4 style="color:var(--danger)">⚠️ Omissions détectées</h4>${list(om,'Aucune omission majeure.')}
     <h4 style="color:var(--warn)">🔎 Cohérence juridique</h4>${list(co,'Cohérence vérifiée, aucune anomalie.')}
     <h4 style="color:var(--brand)">💡 Observations suggérées</h4>${list(obs,'')}
     <h4 style="color:var(--ok)">✅ Recommandations</h4>${list(rec,'')}`,
    [{label:'Insérer les observations',cls:'primary',fn:()=>{
        pv.meta.observations=(pv.meta.observations?pv.meta.observations+' ':'')+obs.join(' ');
        const o=$('[data-f="observations"]'); if(o) o.value=pv.meta.observations;
        closeModal(); toast('Observations insérées','ok');
     }}]);
}

function bindCachetDrag(pv){
  const c=$('#cachetImg'); if(!c) return;
  let drag=false,ox,oy;
  const doc=$('#a4doc');
  c.addEventListener('mousedown',e=>{ drag=true; ox=e.offsetX; oy=e.offsetY; e.preventDefault(); });
  window.addEventListener('mousemove',e=>{ if(!drag)return; const r=doc.getBoundingClientRect();
    const xmm=(e.clientX-r.left-ox)/3.78, ymm=(e.clientY-r.top-oy)/3.78;
    c.style.left=xmm+'mm'; c.style.top=ymm+'mm'; pv.cachet.x=Math.round(xmm); pv.cachet.y=Math.round(ymm); });
  window.addEventListener('mouseup',()=>drag=false);
}

/* ---- APERÇU ---- */
VIEWS.apercu=(root,id)=>{
  const pv=getPV(id); if(!pv){ go('tous'); return; }
  if(!pv.qr){ pv.qr=buildQR(pv,'H'); upsertPV(clone(pv),'QR'); }
  root.innerHTML=`
  <div class="doc-toolbar no-print">
    <button class="btn ghost sm" id="back2">← Retour</button>
    <span class="spacer"></span>
    <select id="stChange" class="btn sm" style="max-width:170px">
      ${Object.entries(STATUTS).map(([k,v])=>`<option value="${k}"${pv.statut===k?' selected':''}>${v.label}</option>`).join('')}
    </select>
    <button class="btn sm" id="editBtn">✏️ Modifier</button>
    <button class="btn sm" id="readBtn2">🔊 Lire</button>
    <button class="btn sm" id="printBtn">🖨️ Imprimer</button>
    <button class="btn accent sm" id="pdfBtn">📄 Export PDF</button>
  </div>
  <div class="a4-scroll">${renderDoc(pv)}</div>`;
  $('#back2').addEventListener('click',()=>go('tous'));
  $('#editBtn').addEventListener('click',()=>openEditor(id));
  $('#printBtn').addEventListener('click',imprimer);
  $('#pdfBtn').addEventListener('click',()=>exportPDF(pv));
  $('#readBtn2').addEventListener('click',()=>Speech.lire(pvToText(pv)));
  $('#stChange').addEventListener('change',e=>{ pv.statut=e.target.value; upsertPV(clone(pv),'Changement de statut');
    toast('Statut : '+STATUTS[pv.statut].label,'ok'); });
};

/* ---- LISTES (tous / brouillons) ---- */
function listView(root,filterFn,title){
  const list=STATE.pvs.filter(filterFn);
  root.innerHTML=`<div class="card"><div class="hd"><h3>${title} (${list.length})</h3>
    <span class="spacer"></span><button class="btn primary sm" data-view="nouveau">➕ Nouveau</button></div>
    <div class="bd">${list.length?`<table class="tbl"><thead><tr>
      <th>Numéro</th><th>Type</th><th>Entreprise</th><th>Province</th><th>Date</th><th>Statut</th><th>Actions</th>
    </tr></thead><tbody>${list.map(x=>rowPV(x)).join('')}</tbody></table>`
    :`<div class="list-empty">Aucun PV.</div>`}</div></div>`;
  $('[data-view="nouveau"]',root)?.addEventListener('click',()=>go('nouveau'));
  bindRowActions(root);
}
function rowPV(x){ return `<tr>
  <td>${esc(x.meta?.numero||'—')}</td><td>${esc(typeName(x.typeId))}</td>
  <td>${esc(x.meta?.entreprise||'—')}</td><td>${esc(x.entete?.province||'—')}</td>
  <td>${x.meta?.date?fmtDate(x.meta.date):'—'}</td>
  <td><span class="st ${STATUTS[x.statut]?.cls}">${STATUTS[x.statut]?.label}</span></td>
  <td class="row" style="gap:5px">
    <button class="btn sm" data-open="${x.id}">Ouvrir</button>
    <button class="btn ghost sm" data-edit="${x.id}">✏️</button>
    <button class="btn danger sm" data-del="${x.id}">🗑️</button>
  </td></tr>`; }
function bindRowActions(root){
  $$('[data-open]',root).forEach(b=>b.addEventListener('click',()=>go('apercu',b.dataset.open)));
  $$('[data-edit]',root).forEach(b=>b.addEventListener('click',()=>openEditor(b.dataset.edit)));
  $$('[data-del]',root).forEach(b=>b.addEventListener('click',()=>{
    confirmModal('Supprimer ce PV ?','Cette action déplacera le PV. La suppression est journalisée.',()=>{
      deletePV(b.dataset.del); toast('PV supprimé','ok'); go(STATE.view); }); }));
}
VIEWS.tous=(root)=>listView(root,()=>true,'Tous les PV');
VIEWS.brouillons=(root)=>listView(root,x=>x.statut==='brouillon','Brouillons');

/* ---- MODÈLES OFFICIELS ---- */
VIEWS.modeles=(root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>Bibliothèque de modèles officiels IGT</h3></div>
  <div class="bd"><p class="muted">Modèles conformes aux documents officiels de l'Inspection Générale du Travail. Cliquez pour créer un PV basé sur un modèle.</p>
  <div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(230px,1fr))">
  ${DB.TYPES_PV.map(t=>`<div class="stat accent" style="cursor:pointer" data-new="${t.id}">
    <div class="ic">${t.icon}</div><div style="font-weight:700;color:var(--brand);margin:8px 0">${esc(t.nom)}</div>
    <div class="k">Format A4 · en-tête dynamique</div></div>`).join('')}
  </div></div></div>`;
  $$('[data-new]',root).forEach(c=>c.addEventListener('click',()=>createPV(c.dataset.new)));
};

/* ---- INFRACTIONS & SANCTIONS ---- */
VIEWS.infractions=(root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>Base juridique — 65 infractions du Code du Travail RDC</h3></div>
  <div class="bd"><input id="qInf" placeholder="🔍 Rechercher (infraction, article, mot-clé)…" style="margin-bottom:12px">
  <div style="overflow:auto"><table class="tbl" id="tInf"><thead><tr>
    <th>N°</th><th>Infraction</th><th>Article violé</th><th>Sanction</th><th>Réf.</th><th>Gravité</th><th>Amende</th>
  </tr></thead><tbody>${DB.INFRACTIONS_65.map(i=>`<tr>
    <td>${i.num}</td><td>${esc(i.libelle)}</td><td>${esc(i.articles)}</td><td>${esc(i.sanction)}</td>
    <td>${esc(i.refSanction)}</td><td><span class="badge b-${i.gravite}">${i.gravite}</span></td>
    <td>${fmtFC(i.montantFC)}</td></tr>`).join('')}</tbody></table></div>
  <p class="small muted" style="margin-top:10px">Base évolutive — Loi n°015-2002 portant Code du Travail ; amendes actualisées par l'Arrêté interministériel du 03/10/2023.</p>
  </div></div>`;
  $('#qInf').addEventListener('input',e=>{ const q=e.target.value.toLowerCase();
    $$('#tInf tbody tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none'); });
};

/* ---- ASSISTANT IA (chat) ---- */
VIEWS.assistant=(root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>🤖 Assistant IA juridique — Droit du travail RDC ${STATE.cfg.aiApiUrl?'(API connectée)':'(local / hors ligne)'}</h3></div>
  <div class="bd"><div class="chat">
    <div class="msgs" id="chatMsgs"></div>
    <div class="row" style="margin-top:8px">
      ${['Refus de contrôle','Absence de contrat écrit','Pas d\'horaire affiché','Article 119','Défaut de SMIG'].map(c=>`<span class="chip" data-chip="${esc(c)}">${esc(c)}</span>`).join('')}
    </div>
    <div class="inrow">
      <input id="chatInput" placeholder="Décrivez les faits ou posez une question juridique…">
      <button class="btn ghost" id="chatMic" title="Dictée">🎤</button>
      <button class="btn primary" id="chatSend">Envoyer</button>
    </div>
  </div></div></div>`;
  const msgs=$('#chatMsgs');
  const push=(txt,who)=>{ const d=el('div',{class:'msg '+who}); d.textContent=txt; msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight; };
  if(!STATE.chat.length) STATE.chat.push({who:'bot',txt:AI.repondreLocal('bonjour')});
  STATE.chat.forEach(m=>push(m.txt,m.who));
  const send=async()=>{ const q=$('#chatInput').value.trim(); if(!q)return;
    push(q,'user'); STATE.chat.push({who:'user',txt:q}); $('#chatInput').value='';
    const r=await AI.repondre(q); push(r,'bot'); STATE.chat.push({who:'bot',txt:r}); };
  $('#chatSend').addEventListener('click',send);
  $('#chatInput').addEventListener('keydown',e=>{ if(e.key==='Enter') send(); });
  $('#chatMic').addEventListener('click',()=>Speech.dicter($('#chatInput')));
  $$('[data-chip]',root).forEach(c=>c.addEventListener('click',()=>{ $('#chatInput').value=c.dataset.chip; send(); }));
};

/* ---- SIGNATURE (démo/atelier) ---- */
VIEWS.signature=(root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>Atelier de signature électronique</h3></div>
  <div class="bd"><p class="muted">Signature tactile compatible téléphone, tablette et ordinateur. La signature s'applique à un PV depuis son éditeur (onglet « Signatures & Cachet »).</p>
    <div class="sig-card" style="max-width:460px">
      <h4>Signature de démonstration</h4>
      <canvas class="sig-pad" id="demoPad" width="420" height="160"></canvas>
      <div class="row" style="margin-top:8px"><button class="btn sm" id="demoClear">Effacer</button>
      <button class="btn ok sm" id="demoSave">Télécharger PNG</button></div>
    </div>
    <hr><h4 style="color:var(--brand)">Enregistrer une signature par défaut (inspecteur)</h4>
    <p class="small muted">Réutilisable automatiquement dans vos PV.</p>
    <button class="btn primary sm" id="defSave">💾 Définir comme signature par défaut</button>
  </div></div>`;
  const pad=initSignaturePad($('#demoPad'));
  $('#demoClear').addEventListener('click',()=>pad.clear());
  $('#demoSave').addEventListener('click',()=>{ const a=el('a',{href:pad.data(),download:'signature.png'}); a.click(); });
  $('#defSave').addEventListener('click',()=>{ STATE.cfg.signatures.default=pad.data(); saveCfg(); toast('Signature par défaut enregistrée','ok'); });
};

/* ---- QR CODE ---- */
VIEWS.qrcode=(root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>Générateur de QR Code (100% local)</h3></div>
  <div class="bd"><div class="row" style="align-items:flex-start;gap:24px">
    <div>
      <div class="field"><label>Sélectionner un PV</label><select id="qrPv">
        <option value="">— Contenu libre —</option>
        ${STATE.pvs.map(p=>`<option value="${p.id}">${esc(p.meta?.numero||p.id)}</option>`).join('')}</select></div>
      <div class="field"><label>Contenu / Identifiant</label><input id="qrText" value="${esc(location.href)}"></div>
      <div class="field"><label>Niveau de correction d'erreur</label>
        <select id="qrLevel"><option value="M">M (Moyen)</option><option value="H" selected>H (Élevé)</option></select></div>
      <button class="btn primary" id="qrGen">Générer</button>
      <button class="btn sm" id="qrDl">⬇️ Télécharger</button>
    </div>
    <div><div class="qr-box"><canvas id="qrCv" width="260" height="260"></canvas></div></div>
  </div></div></div>`;
  const gen=()=>{ let val=$('#qrText').value;
    const pv=getPV($('#qrPv').value);
    if(pv){ val=JSON.stringify({app:'InspecteurBot',id:pv.id,num:pv.meta?.numero,date:pv.meta?.date,heure:pv.meta?.heure,sig:signatureHash(pv)}); }
    new QRious({element:$('#qrCv'),value:val||' ',size:260,level:$('#qrLevel').value}); };
  $('#qrGen').addEventListener('click',gen);
  $('#qrLevel').addEventListener('change',gen);
  $('#qrPv').addEventListener('change',()=>{ const pv=getPV($('#qrPv').value); if(pv) $('#qrText').value=pv.meta?.numero||pv.id; gen(); });
  $('#qrDl').addEventListener('click',()=>{ const a=el('a',{href:$('#qrCv').toDataURL('image/png'),download:'qrcode.png'}); a.click(); });
  gen();
};

/* ---- SCANNER CAMÉRA ---- */
VIEWS.scanner=(root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>Scanner de QR Code par caméra (décodeur local hors ligne)</h3></div>
  <div class="bd">
    <div class="row"><button class="btn primary" id="scanStart">📷 Démarrer la caméra</button>
      <button class="btn danger" id="scanStop">⏹️ Arrêter</button>
      <label class="btn sm">🖼️ Importer une image<input type="file" accept="image/*" id="scanFile" hidden></label></div>
    <div class="scan-frame" style="margin-top:14px"><video id="scanVideo" playsinline></video><div class="reticle"></div></div>
    <div id="scanResult" style="margin-top:14px"></div>
    <canvas id="scanCanvas" class="hidden"></canvas>
  </div></div>`;
  let stream=null, raf=null;
  const video=$('#scanVideo'), canvas=$('#scanCanvas'), ctx=canvas.getContext('2d');
  const tick=()=>{ if(video.readyState===video.HAVE_ENOUGH_DATA){
      canvas.width=video.videoWidth; canvas.height=video.videoHeight;
      ctx.drawImage(video,0,0,canvas.width,canvas.height);
      const img=ctx.getImageData(0,0,canvas.width,canvas.height);
      const code=jsQR(img.data,img.width,img.height);
      if(code){ handleScan(code.data); stopCam(); return; } }
    raf=requestAnimationFrame(tick); };
  const stopCam=()=>{ if(raf)cancelAnimationFrame(raf); if(stream){ stream.getTracks().forEach(t=>t.stop()); stream=null; } };
  $('#scanStart').addEventListener('click',async()=>{
    try{ stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:'environment'}});
      video.srcObject=stream; await video.play(); raf=requestAnimationFrame(tick); toast('Caméra active','ok'); }
    catch(e){ toast('Accès caméra refusé/indisponible','err'); } });
  $('#scanStop').addEventListener('click',stopCam);
  $('#scanFile').addEventListener('change',e=>{ const f=e.target.files[0]; if(!f)return;
    const img=new Image(); img.onload=()=>{ canvas.width=img.width; canvas.height=img.height; ctx.drawImage(img,0,0);
      const d=ctx.getImageData(0,0,canvas.width,canvas.height); const c=jsQR(d.data,d.width,d.height);
      handleScan(c?c.data:null); }; img.src=URL.createObjectURL(f); });
  function handleScan(data){
    const box=$('#scanResult');
    if(!data){ box.innerHTML=`<div class="toast err" style="position:static">Aucun QR détecté.</div>`; return; }
    let obj=null; try{ obj=JSON.parse(data); }catch(e){}
    if(obj&&obj.app==='InspecteurBot'){
      const pv=getPV(obj.id);
      const valid = pv && signatureHash(pv)===obj.sig;
      box.innerHTML=`<div class="card"><div class="bd">
        <h3 style="color:${valid?'var(--ok)':'var(--warn)'}">${valid?'✅ PV AUTHENTIQUE':pv?'⚠️ PV modifié après signature':'❓ PV inconnu dans cette base'}</h3>
        <p><b>ID :</b> ${esc(obj.id)}<br><b>N° :</b> ${esc(obj.num||'—')}<br><b>Date :</b> ${esc(obj.date||'—')} ${esc(obj.heure||'')}</p>
        ${pv?`<button class="btn primary sm" data-open="${pv.id}">Ouvrir le PV</button>`:''}
      </div></div>`;
      if(pv) $('[data-open]',box).addEventListener('click',()=>go('apercu',pv.id));
    } else { box.innerHTML=`<div class="card"><div class="bd"><b>Contenu du QR :</b><br>${esc(data)}</div></div>`; }
    toast('QR décodé','ok');
  }
};

/* ---- VÉRIFIER AUTHENTICITÉ (par identifiant) ---- */
VIEWS.verif=(root)=>{
  root.innerHTML=`<div class="card"><div class="hd"><h3>Vérification d'authenticité par identifiant unique</h3></div>
  <div class="bd"><div class="row"><input id="verifId" placeholder="Saisir l'identifiant (ID) ou le numéro du PV" style="max-width:380px">
    <button class="btn primary" id="verifBtn">Vérifier</button></div>
    <div id="verifRes" style="margin-top:16px"></div></div></div>`;
  $('#verifBtn').addEventListener('click',()=>{
    const q=$('#verifId').value.trim().toLowerCase();
    const pv=STATE.pvs.find(p=>p.id.toLowerCase()===q || (p.meta?.numero||'').toLowerCase()===q);
    const res=$('#verifRes');
    if(pv){ res.innerHTML=`<div class="card"><div class="bd"><h3 style="color:var(--ok)">✅ Document authentique</h3>
      <p><b>ID :</b> ${esc(pv.id)}<br><b>N° :</b> ${esc(pv.meta?.numero||'—')}<br><b>Type :</b> ${esc(typeName(pv.typeId))}<br>
      <b>Entreprise :</b> ${esc(pv.meta?.entreprise||'—')}<br><b>Créé le :</b> ${fmtDateTime(pv.createdAt)}<br>
      <b>Empreinte :</b> ${signatureHash(pv)}</p>
      <button class="btn primary sm" data-open="${pv.id}">Ouvrir</button></div></div>`;
      $('[data-open]',res).addEventListener('click',()=>go('apercu',pv.id)); }
    else res.innerHTML=`<div class="card"><div class="bd"><h3 style="color:var(--danger)">❌ Aucun PV correspondant</h3>
      <p class="muted">Cet identifiant n'existe pas dans la base locale.</p></div></div>`;
  });
};

/* ---- RECHERCHE AVANCÉE ---- */
VIEWS.recherche=(root)=>{
  const provs=DB.RDC_PROVINCES.map(p=>`<option>${esc(p.province)}</option>`).join('');
  root.innerHTML=`<div class="card"><div class="hd"><h3>Recherche avancée</h3></div><div class="bd">
    <div class="form-grid">
      <div class="field"><label>Mot-clé (numéro, entreprise, inspecteur…)</label><input id="fKw"></div>
      <div class="field"><label>Province</label><select id="fProv"><option value="">Toutes</option>${provs}</select></div>
      <div class="field"><label>Commune</label><input id="fCom"></div>
      <div class="field"><label>Type de PV</label><select id="fType"><option value="">Tous</option>${DB.TYPES_PV.map(t=>`<option value="${t.id}">${esc(t.nom)}</option>`).join('')}</select></div>
      <div class="field"><label>Statut</label><select id="fStat"><option value="">Tous</option>${Object.entries(STATUTS).map(([k,v])=>`<option value="${k}">${v.label}</option>`).join('')}</select></div>
      <div class="field"><label>Infraction (article/mot)</label><input id="fInf"></div>
      <div class="field"><label>Du</label><input type="date" id="fD1"></div>
      <div class="field"><label>Au</label><input type="date" id="fD2"></div>
    </div>
    <button class="btn primary" id="doSearch">🔍 Rechercher</button>
    <div id="searchRes" style="margin-top:16px"></div>
  </div></div>`;
  $('#doSearch').addEventListener('click',()=>{
    const kw=$('#fKw').value.toLowerCase(),prov=$('#fProv').value,com=$('#fCom').value.toLowerCase(),
      ty=$('#fType').value,st=$('#fStat').value,inf=$('#fInf').value.toLowerCase(),d1=$('#fD1').value,d2=$('#fD2').value;
    const r=STATE.pvs.filter(p=>{
      const blob=JSON.stringify(p).toLowerCase();
      if(kw&&!blob.includes(kw))return false;
      if(prov&&p.entete?.province!==prov)return false;
      if(com&&!(p.meta?.commune||'').toLowerCase().includes(com))return false;
      if(ty&&p.typeId!==ty)return false;
      if(st&&p.statut!==st)return false;
      if(inf&&!(p.infractions||[]).some(i=>(i.libelle+i.articles).toLowerCase().includes(inf)))return false;
      if(d1&&(p.meta?.date||'')<d1)return false;
      if(d2&&(p.meta?.date||'')>d2)return false;
      return true; });
    const box=$('#searchRes');
    box.innerHTML=r.length?`<table class="tbl"><thead><tr><th>Numéro</th><th>Type</th><th>Entreprise</th><th>Province</th><th>Statut</th><th></th></tr></thead>
      <tbody>${r.map(rowPV).join('')}</tbody></table>`:`<div class="list-empty">Aucun résultat (${r.length}).</div>`;
    bindRowActions(box);
  });
};

/* ---- HISTORIQUE ---- */
VIEWS.historique=(root)=>{
  const lg=getLog();
  root.innerHTML=`<div class="card"><div class="hd"><h3>Journal d'actions / Historique (${lg.length})</h3>
    <span class="spacer"></span><button class="btn ghost sm" id="clrLog">Vider le journal</button></div>
    <div class="bd">${lg.length?`<table class="tbl"><thead><tr><th>Date/Heure</th><th>Action</th><th>Numéro</th><th>Utilisateur</th></tr></thead>
    <tbody>${lg.map(l=>`<tr><td>${fmtDateTime(l.at)}</td><td>${esc(l.action)}</td><td>${esc(l.numero)}</td><td>${esc(l.user)}</td></tr>`).join('')}</tbody></table>`
    :`<div class="list-empty">Aucune action journalisée.</div>`}</div></div>`;
  $('#clrLog').addEventListener('click',()=>confirmModal('Vider le journal ?','Cette action est irréversible.',()=>{ localStorage.removeItem(LS_LOG); go('historique'); }));
};

/* ---- STATISTIQUES ---- */
VIEWS.stats=(root)=>{
  const p=STATE.pvs;
  const byType={},byProv={},byInsp={},byStat={};
  let infrCount={},totAmende=0;
  p.forEach(x=>{ byType[typeName(x.typeId)]=(byType[typeName(x.typeId)]||0)+1;
    byProv[x.entete?.province||'—']=(byProv[x.entete?.province||'—']||0)+1;
    byInsp[x.meta?.inspecteur||'—']=(byInsp[x.meta?.inspecteur||'—']||0)+1;
    byStat[STATUTS[x.statut]?.label||x.statut]=(byStat[STATUTS[x.statut]?.label||x.statut]||0)+1;
    (x.infractions||[]).forEach(i=>{ infrCount[i.libelle]=(infrCount[i.libelle]||0)+1; totAmende+=Number(i.montant)||0; }); });
  const bar=(obj,title)=>{ const max=Math.max(1,...Object.values(obj));
    const rows=Object.entries(obj).sort((a,b)=>b[1]-a[1]).slice(0,10).map(([k,v])=>`
      <div style="margin:6px 0"><div class="small">${esc(k)} — <b>${v}</b></div>
      <div style="background:var(--panel-2);border-radius:6px;overflow:hidden"><div style="height:12px;width:${v/max*100}%;background:var(--brand-2)"></div></div></div>`).join('');
    return `<div class="card"><div class="hd"><h3>${title}</h3></div><div class="bd">${rows||'<span class="muted">Aucune donnée</span>'}</div></div>`; };
  root.innerHTML=`<div class="grid stats">
    <div class="stat accent"><div class="v">${p.length}</div><div class="k">PV total</div></div>
    <div class="stat info"><div class="v">${new Set(p.map(x=>x.meta?.entreprise).filter(Boolean)).size}</div><div class="k">Entreprises</div></div>
    <div class="stat warn"><div class="v">${p.reduce((s,x)=>s+(x.infractions||[]).length,0)}</div><div class="k">Infractions</div></div>
    <div class="stat ok"><div class="v">${fmtFC(totAmende)}</div><div class="k">Total amendes</div></div>
  </div>
  <div class="grid two-col" style="margin-top:16px">${bar(byType,'PV par type')}${bar(byStat,'PV par statut')}</div>
  <div class="grid two-col">${bar(byProv,'PV par province')}${bar(byInsp,'PV par inspecteur')}</div>
  ${bar(infrCount,'Infractions les plus fréquentes')}`;
};

/* ---- PARAMÈTRES ---- */
VIEWS.parametres=(root)=>{
  const c=STATE.cfg;
  root.innerHTML=`
  <div class="card"><div class="hd"><h3>Numérotation</h3></div><div class="bd">
    <div class="field"><label>Mode</label><select id="pNum">
      <option value="auto"${c.numMode==='auto'?' selected':''}>Automatique</option>
      <option value="manuel"${c.numMode==='manuel'?' selected':''}>Manuelle</option></select></div>
    <div class="field"><label>Province par défaut</label><select id="pProv">
      ${DB.RDC_PROVINCES.map(p=>`<option${p.province===c.defaultProvince?' selected':''}>${esc(p.province)}</option>`).join('')}</select></div>
  </div></div>
  <div class="card"><div class="hd"><h3>Inspecteurs / Contrôleurs</h3><span class="spacer"></span>
    <button class="btn sm" id="addInsp">➕ Ajouter</button></div>
    <div class="bd" id="inspList"></div></div>
  <div class="card"><div class="hd"><h3>Assistant IA — API externe (optionnel)</h3></div><div class="bd">
    <p class="small muted">Laissez vide pour utiliser l'IA locale hors ligne. Renseignez une API compatible OpenAI pour un mode connecté.</p>
    <div class="field"><label>URL de l'API</label><input id="pAiUrl" value="${esc(c.aiApiUrl||'')}" placeholder="https://…/chat/completions"></div>
    <div class="field"><label>Clé API</label><input id="pAiKey" type="password" value="${esc(c.aiApiKey||'')}"></div>
  </div></div>
  <div class="card"><div class="hd"><h3>Données</h3></div><div class="bd row">
    <button class="btn sm" id="expData">⬇️ Exporter (sauvegarde)</button>
    <label class="btn sm">⬆️ Importer<input type="file" id="impData" accept=".json" hidden></label>
    <button class="btn danger sm" id="wipeData">🗑️ Réinitialiser</button>
  </div></div>
  <button class="btn primary" id="saveParams">💾 Enregistrer les paramètres</button>`;
  const renderInsp=()=>{ $('#inspList').innerHTML=(c.inspecteurs||[]).map((i,x)=>`
    <div class="form-grid" style="border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:10px">
      <input data-ins="${x}" data-k="nom" value="${esc(i.nom||'')}" placeholder="Nom">
      <input data-ins="${x}" data-k="grade" value="${esc(i.grade||'')}" placeholder="Grade">
      <input data-ins="${x}" data-k="habilitation" value="${esc(i.habilitation||'')}" placeholder="N° habilitation">
      <button class="btn danger sm" data-insdel="${x}">Supprimer</button></div>`).join('');
    $$('[data-ins]').forEach(inp=>inp.addEventListener('input',()=>{ c.inspecteurs[inp.dataset.ins][inp.dataset.k]=inp.value; }));
    $$('[data-insdel]').forEach(b=>b.addEventListener('click',()=>{ c.inspecteurs.splice(Number(b.dataset.insdel),1); renderInsp(); }));
  };
  renderInsp();
  $('#addInsp').addEventListener('click',()=>{ c.inspecteurs.push({nom:'',grade:'Inspecteur du Travail',habilitation:''}); renderInsp(); });
  $('#saveParams').addEventListener('click',()=>{ c.numMode=$('#pNum').value; c.defaultProvince=$('#pProv').value;
    c.aiApiUrl=$('#pAiUrl').value.trim(); c.aiApiKey=$('#pAiKey').value.trim(); saveCfg(); toast('Paramètres enregistrés','ok'); });
  $('#expData').addEventListener('click',()=>{ const blob=new Blob([JSON.stringify({pvs:STATE.pvs,cfg:c,log:getLog()},null,2)],{type:'application/json'});
    const a=el('a',{href:URL.createObjectURL(blob),download:'inspecteurbot-sauvegarde.json'}); a.click(); toast('Sauvegarde exportée','ok'); });
  $('#impData').addEventListener('change',e=>{ const f=e.target.files[0]; if(!f)return; const r=new FileReader();
    r.onload=()=>{ try{ const d=JSON.parse(r.result); if(d.pvs){STATE.pvs=d.pvs;saveAll();} if(d.cfg){STATE.cfg=d.cfg;saveCfg();} if(d.log)localStorage.setItem(LS_LOG,JSON.stringify(d.log)); toast('Sauvegarde restaurée','ok'); go('parametres'); }catch(err){ toast('Fichier invalide','err'); } };
    r.readAsText(f); });
  $('#wipeData').addEventListener('click',()=>confirmModal('Réinitialiser toutes les données ?','Tous les PV, brouillons et journaux seront supprimés.',()=>{
    localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_LOG); STATE.pvs=[]; toast('Données réinitialisées','ok'); go('accueil'); }));
};

/* ==========================================================================
 * MODALES
 * ========================================================================*/
function showModal(title,bodyHTML,buttons=[]){
  $('#mTitle').textContent=title; $('#mBody').innerHTML=bodyHTML;
  const ft=$('#mFoot'); ft.innerHTML='';
  buttons.forEach(b=>{ const btn=el('button',{class:'btn '+(b.cls||'')}); btn.textContent=b.label; btn.addEventListener('click',b.fn); ft.appendChild(btn); });
  const cancel=el('button',{class:'btn ghost'}); cancel.textContent='Fermer'; cancel.addEventListener('click',closeModal); ft.appendChild(cancel);
  $('#overlay').classList.add('open');
}
function closeModal(){ $('#overlay').classList.remove('open'); }
function confirmModal(title,msg,onYes){
  showModal(title,`<p>${esc(msg)}</p>`,[{label:'Confirmer',cls:'danger',fn:()=>{ closeModal(); onYes(); }}]);
}

/* ==========================================================================
 * 12. INITIALISATION
 * ========================================================================*/
function init(){
  loadAll();
  // navigation
  document.addEventListener('click',e=>{ const nv=e.target.closest('[data-view]');
    if(nv){ go(nv.dataset.view); } });
  $('#hamb').addEventListener('click',()=>$('#sidebar').classList.toggle('open'));
  $('#themeToggle').addEventListener('click',()=>{ const cur=document.documentElement.getAttribute('data-theme');
    const nx=cur==='dark'?'light':'dark'; document.documentElement.setAttribute('data-theme',nx);
    STATE.cfg.theme=nx; saveCfg(); $('#themeToggle').textContent=nx==='dark'?'☀️':'🌙'; });
  $('#themeToggle').textContent=(STATE.cfg.theme==='dark')?'☀️':'🌙';
  $('#voiceReadTop').addEventListener('click',()=>{
    if(STATE.view==='apercu'||STATE.view==='editor'){ const pv=STATE.editing||getPV(STATE.pvs[0]?.id); if(pv)Speech.lire(pvToText(pv)); }
    else Speech.lire('Module Procès-Verbaux d\'InspecteurBot. '+TITLES[STATE.view]); });
  $('#mClose').addEventListener('click',closeModal);
  $('#overlay').addEventListener('click',e=>{ if(e.target===$('#overlay')) closeModal(); });
  go('accueil');
  console.log('%cInspecteurBot — Module PV chargé','color:#0b3d5c;font-weight:bold');
}
document.addEventListener('DOMContentLoaded',init);
