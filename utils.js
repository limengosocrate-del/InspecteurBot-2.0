/* ========== UTILITAIRES INSPECTEURBOT IA RDC ========== */

const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => el.querySelectorAll(sel);

/* Thème */
function toggleTheme(){
  document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', document.body.classList.contains('light-mode')?'light':'dark');
}
function initTheme(){
  if(localStorage.getItem('theme')==='light') document.body.classList.add('light-mode');
}

/* Traduction */
function setLang(code){
  localStorage.setItem('lang', code);
  document.documentElement.lang = code;
  document.dispatchEvent(new CustomEvent('langChanged',{detail:code}));
}

/* Signature Canvas */
function initCanvas(id){
  const cvs = document.getElementById(id);
  if(!cvs) return;
  const ctx = cvs.getContext('2d');
  let draw=false;
  cvs.width = cvs.offsetWidth;
  cvs.height = cvs.offsetHeight;
  ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5;
  const getPos = e => {
    const r = cvs.getBoundingClientRect();
    const x = (e.touches?e.touches[0].clientX:e.clientX) - r.left;
    const y = (e.touches?e.touches[0].clientY:e.clientY) - r.top;
    return {x,y};
  };
  const start = e => { draw=true; const p=getPos(e); ctx.beginPath(); ctx.moveTo(p.x,p.y); };
  const move = e => { if(!draw)return; const p=getPos(e); ctx.lineTo(p.x,p.y); ctx.stroke(); };
  const end = () => { draw=false; ctx.beginPath(); };
  cvs.addEventListener('mousedown',start); cvs.addEventListener('mousemove',move); window.addEventListener('mouseup',end);
  cvs.addEventListener('touchstart',start,{passive:false}); cvs.addEventListener('touchmove',move,{passive:false}); window.addEventListener('touchend',end);
  return {clear:()=>ctx.clearRect(0,0,cvs.width,cvs.height), getData:()=>cvs.toDataURL()};
}

/* Reconnaissance vocale */
function startDictation(targetSelector){
  if(!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)){
    alert("Dictée vocale non supportée sur ce navigateur. Utilisez Chrome/Edge.");
    return;
  }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SR();
  rec.lang = document.documentElement.lang==='fr'?'fr-FR':'en-US'; // simplifié
  rec.continuous = false; rec.interimResults = false;
  rec.onresult = e => {
    const txt = e.results[0][0].transcript;
    const el = document.querySelector(targetSelector);
    if(el) el.value += (el.value?' ':'') + txt;
  };
  rec.start();
}

/* Export PDF */
async function exportPDF(filename, elementSelector){
  const el = document.querySelector(elementSelector);
  if(!el) return;
  if(window.html2pdf){
    await html2pdf().set({
      margin:0.5, filename:`${filename}.pdf`, image:{type:'jpeg', quality:0.98},
      html2canvas:{scale:2, useCORS:true},
      jsPDF:{unit:'mm', format:'a4', orientation:'portrait'}
    }).from(el).save();
  }else{
    window.print();
  }
}

/* Horodatage */
function stamp(){ return {date:new Date().toLocaleDateString(), time:new Date().toLocaleTimeString()}; }

/* Base de connaissances juridique RDC (moteur de règles) */
const JURISPRUDENCE_RDC = [
  {doc:"declaration_etablissement", article:"Art. 216 du CT", infraction:"Déclaration d'établissement non présentée ou non conforme", sanction:"Mise en demeure + amende administrative"},
  {doc:"reglement_entreprise", article:"Art. 157 du CT", infraction:"Absence de règlement d'entreprise", sanction:"Mise en demeure de régularisation"},
  {doc:"contrat_travail", article:"Art. 36 à 49 du CT", infraction:"Contrats de travail non conformes ou non visés", sanction:"Procès-verbal de constat + amende"},
  {doc:"horaire", article:"Art. 119 du CT", infraction:"Horaire non affiché ou non conforme", sanction:"Observation écrite"},
  {doc:"cnss", article:"Art. Loi CNSS", infraction:"Non affiliation ou non paiement CNSS", sanction:"Mise en demeure + pénalités de retard"},
  {doc:"smig", article:"Arrêté SMIG", infraction:"Rémunération inférieure au SMIG", sanction:"PV d'infraction + régularisation salariale"},
  {doc:"enfant", article:"Art. 40 al.2 CT", infraction:"Emploi d'enfants non autorisé", sanction:"PV d'infraction + fermeture temporaire possible"},
  {doc:"hygiene", article:"Art. Code du Travail Hygiène", infraction:"Défaut d'installation sanitaire", sanction:"Mise en demeure"},
  {doc:"securite", article:"Art. 157 CDT", infraction:"Absence de règlement général de sécurité", sanction:"Mise en demeure / Arrêt d'exploitation"}
];

function analyseJuridique(formData){
  const resultats = [];
  JURISPRUDENCE_RDC.forEach(regle=>{
    const val = formData[regle.doc];
    if(val===false || val==='NE' || val==='non' || val===''){
      resultats.push({...regle, gravite: "Élevée"});
    }
  });
  return resultats;
}

/* Sauvegarde locale */
function saveForm(key, payload){
  const db = JSON.parse(localStorage.getItem('inspecteurBotDB')||'[]');
  payload.id = key + '_' + Date.now();
  payload.stamp = stamp();
  db.push(payload);
  localStorage.setItem('inspecteurBotDB', JSON.stringify(db));
  return payload.id;
    }
