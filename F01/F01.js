/* ═══════════════════════════════════════════════════════════
   F01.js — Contrôle de la Main d'Œuvre — Module autonome
   IA embarquée (hors connexion) : dictée, analyse juridique CT-RDC,
   cohérence, archivage local, signatures, horodatage.
   ═══════════════════════════════════════════════════════════ */
"use strict";
(() => {

/* ── 1. DONNÉES ADMINISTRATIVES RDC ─────────────────────── */
const PROVINCES = ["Kinshasa","Kongo-Central","Kwango","Kwilu","Mai-Ndombe","Équateur",
 "Mongala","Nord-Ubangi","Sud-Ubangi","Tshuapa","Tshopo","Bas-Uélé","Haut-Uélé","Ituri",
 "Nord-Kivu","Sud-Kivu","Maniema","Lualaba","Haut-Katanga","Haut-Lomami","Tanganyika",
 "Lomami","Kasaï","Kasaï-Central","Kasaï-Oriental","Sankuru"];
const SECTEURS = ["Agriculture, élevage et pêche","Mines et carrières","Industrie manufacturière",
 "Bâtiment et Travaux Publics (BTP)","Énergie, eau et électricité","Commerce et distribution",
 "Transports et logistique","Banques et finances","Télécommunications","Hôtellerie et restauration",
 "Santé","Éducation","Services aux entreprises","ONG et organismes internationaux","Autres"];

/* ── 2. LISTE OFFICIELLE DES DOCUMENTS (inchangée) ──────── */
const DOCS = [
 ["Déclaration d'Etablissement <small>(article 216 du CT)</small>","art216","Art. 216 CT : défaut de déclaration d'établissement"],
 ["Règlement d'entreprise (article 157 du CT)","art157","Art. 157 CT : absence de règlement d'entreprise"],
 ["Convention collective (n°199 du Code du Travail)","art199","Art. 199 CT : absence de convention collective applicable"],
 ["Horaire du Travail (article 119 du CT et Arrêté n°040/CAB/MINETPS/2013)","art119","Art. 119 CT & Arrêté 040/2013 : horaire de travail non affiché/visé"],
 ["Classification Générale des Emplois ( article 90 du CT)","art90","Art. 90 CT : classification des emplois non appliquée"],
 ["Feuille de paie  de trois derniers mois","paie","Arts. 99–100 CT : feuilles de paie non présentées"],
 ["Bilan sociale (Article n°218 du Code du Travail)","art218","Art. 218 CT : bilan social non produit"],
 ["Preuve de paiement de cotisation CNSS, ONEM, INPP et IPR","cotis","Loi 16/009 & textes : cotisations sociales/parafiscales impayées"],
 ["Déclaration annuelle de la situation de la main d'œuvre de 3 derniers années","dann","Art. 217 CT : déclaration annuelle main-d'œuvre manquante"],
 ["Registre de Travailleurs non permanents <small>(article 40 alinea2)</small>","art40","Art. 40 al.2 CT : registre travailleurs non permanents absent"],
 ["Contrat de Travail visé <small>(articles 36 à 49 du code du Travail)</small>","art36","Arts. 36–49 CT : contrats de travail non visés"],
 ["Déclaration de mouvement de Travailleur visé <small>( article 217 du Code du Travail)</small>","art217","Art. 217 CT : mouvements de travailleurs non déclarés"],
 ["Certificat d'aptitude au Travail","apt","Art. 38 CT : certificats d'aptitude au travail manquants"],
 ["Décompte de rémunération de chaque mois","dec","Art. 100 CT : décomptes de rémunération non remis"],
 ["Titre de congé de trois dernières années","conge","Arts. 140 et s. CT : titres de congé non justifiés"],
 ["Application du SMIG","smig","Décret SMIG en vigueur : non-application du salaire minimum"],
 ["Autres","autres",""]
];

const $ = id => document.getElementById(id);

/* ── 3. INITIALISATION LISTES ───────────────────────────── */
function peupler(sel, arr, prompt){ sel.innerHTML = `<option value=""></option>` +
  arr.map(v=>`<option>${v}</option>`).join(""); sel.title = prompt||""; }
peupler($("secteur"), SECTEURS);
peupler($("quartierProv"), PROVINCES); // Q/ : sélection administrative

/* Génération des lignes DOCUMENTS (fidèle au modèle) */
const tabDocs = $("tabDocs");
DOCS.forEach((d,i)=>{
  const tr = document.createElement("tr");
  tr.innerHTML = `<td class="lib">${d[0]}</td>` +
    ["E","NE","ENC"].map(c=>`<td class="c-ene"><input type="checkbox" class="coche"
     data-doc="${d[1]}" data-etat="${c}" name="doc${i}"></td>`).join("");
  tabDocs.appendChild(tr);
});
/* Exclusivité E / NE / ENC par ligne */
tabDocs.addEventListener("change", e=>{
  if(!e.target.matches(".coche")) return;
  document.getElementsByName(e.target.name).forEach(c=>{ if(c!==e.target) c.checked=false; });
  sauverBrouillon();
});

/* ── 4. FORMAT TÉLÉPHONE +243 ───────────────────────────── */
$("contact").addEventListener("input", e=>{
  let v = e.target.value.replace(/[^\d]/g,"");
  if(v.startsWith("243")) v = v.slice(3);
  if(v.startsWith("0"))   v = v.slice(1);
  v = v.slice(0,9);
  e.target.value = "+243 " + (v.replace(/(\d{3})(\d{0,3})(\d{0,3})/, (_,a,b,c)=>
    [a,b,c].filter(Boolean).join(" ")));
});

/* ── 5. CALCULS AUTOMATIQUES DES TOTAUX ─────────────────── */
const N = id => parseInt($(id).value)||0;
function recalculer(){
  $("natT").value = N("natH")+N("natF")||""; $("expT").value = N("expH")+N("expF")||"";
  $("totH").value = N("natH")+N("expH")||""; $("totF").value = N("natF")+N("expF")||"";
  $("totT").value = N("totH")+N("totF")||"";
  $("claT").value = N("claH")+N("claF")||""; $("maiT").value = N("maiH")+N("maiF")||"";
  $("cadT").value = N("cadH")+N("cadF")||"";
  $("enfT").value = N("enfH")+N("enfF")||""; $("npT").value = N("npH")+N("npF")||"";
  $("np2H").value = N("enfH")+N("npH")||""; $("np2F").value = N("enfF")+N("npF")||"";
  $("np2T").value = N("np2H")+N("np2F")||"";
  /* Ratio national/expatrié automatique */
  const tot=N("natT")+N("expT");
  if(tot){ const r=(N("expT")/tot*100).toFixed(1);
    if(N("expT")/tot<=0.15){$("ratioC").value=r+"%";$("ratioNC").value="";}
    else {$("ratioNC").value=r+"%";$("ratioC").value="";} }
}
document.querySelectorAll(".cel.n").forEach(i=>i.addEventListener("input",()=>{recalculer();sauverBrouillon();}));

/* Cases vertes 0..8 (codage IT/CT) */
document.querySelectorAll(".cases-vertes span").forEach(s=>
  s.addEventListener("click",()=>{s.classList.toggle("actif");sauverBrouillon();}));

/* ── 6. SIGNATURES ÉLECTRONIQUES + HORODATAGE ───────────── */
function padSignature(canvasId, horoId){
  const cv=$(canvasId),ctx=cv.getContext("2d");let dessin=false;
  ctx.lineWidth=2;ctx.lineCap="round";ctx.strokeStyle="#001a66";
  const pos=e=>{const r=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;
    return {x:(p.clientX-r.left)*cv.width/r.width,y:(p.clientY-r.top)*cv.height/r.height};};
  const debut=e=>{dessin=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault();};
  const trace=e=>{if(!dessin)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();e.preventDefault();};
  const fin=()=>{if(dessin&&horoId)$(horoId).textContent="Signé le "+new Date().toLocaleString("fr-CD");dessin=false;};
  cv.addEventListener("mousedown",debut);cv.addEventListener("mousemove",trace);
  window.addEventListener("mouseup",fin);
  cv.addEventListener("touchstart",debut);cv.addEventListener("touchmove",trace);
  cv.addEventListener("touchend",fin);
}
padSignature("sigEmployeur","hEmployeur");
padSignature("sigInspecteur","hInspecteur");
document.querySelectorAll("[data-clear]").forEach(b=>b.addEventListener("click",()=>{
  const cv=$(b.dataset.clear);cv.getContext("2d").clearRect(0,0,cv.width,cv.height);}));
$("refusSig").addEventListener("change",e=>{
  $("hEmployeur").textContent = e.target.checked ?
   "⚠ REFUS DE SIGNATURE constaté le "+new Date().toLocaleString("fr-CD") : "";});

/* ── 7. IA EMBARQUÉE : ANALYSE JURIDIQUE ────────────────── */
function analyser(){
  const res=[], infractions=[];
  /* 7a. Documents NE/ENC → infractions avec articles */
  DOCS.forEach(d=>{
    const ne=document.querySelector(`.coche[data-doc="${d[1]}"][data-etat="NE"]`);
    if(ne&&ne.checked&&d[2]) infractions.push(d[2]);
  });
  /* 7b. Travail des enfants (arts. 6, 133 CT) */
  if(N("enfT")>0) infractions.push("Arts. 6 & 133 CT : emploi d'enfants constaté — vérifier âge minimum (16 ans, dérogation 15 ans) et travaux interdits. Sanction : arts. 321 et s. CT.");
  /* 7c. Cohérence des effectifs */
  if(N("totT") && N("claT")+N("maiT")+N("cadT") && N("totT")!==N("claT")+N("maiT")+N("cadT"))
    res.push({t:"⚠ Incohérence : total par sexe ("+N("totT")+") ≠ total par catégories ("+(N("claT")+N("maiT")+N("cadT"))+").",cls:"infraction"});
  /* 7d. Ratio main-d'œuvre étrangère */
  const tot=N("natT")+N("expT");
  if(tot&&N("expT")/tot>0.15) infractions.push("Ordonnance 74/098 & arrêtés : dépassement du pourcentage autorisé de main-d'œuvre étrangère ("+(N("expT")/tot*100).toFixed(1)+"%).");
  /* 7e. Verdict + suites recommandées */
  infractions.forEach(i=>res.push({t:"⚖ INFRACTION — "+i,cls:"infraction"}));
  if(!infractions.length) res.push({t:"✔ Aucune infraction détectée sur base des rubriques cochées. Décision suggérée : CONFORME / Lettre d'observations simple.",cls:"conforme-ia"});
  else {
    const suite = infractions.length>=4 ? "PV de constat d'infraction (PV CI) + transmission à la hiérarchie"
      : infractions.length>=2 ? "Mise en demeure (MD) avec délai de régularisation de 30 jours"
      : "Lettre d'observations (LO) avec rappel à la loi";
    res.push({t:"📋 SUITE RECOMMANDÉE : "+suite+".",cls:"infraction"});
    /* Cochage automatique de la conclusion */
    $("cLO").checked = infractions.length===1;
    $("cMD").checked = infractions.length>=2 && infractions.length<4;
    $("cPVCI").checked = infractions.length>=4;
  }
  /* 7f. Champs manquants */
  ["raisonSociale","secteur","responsable","contact","rencontree"].forEach(id=>{
    if(!$(id).value) res.push({t:"✎ Champ manquant : "+id,cls:"infraction"});});
  /* Affichage */
  $("resultatIA").innerHTML = res.map(r=>`<div class="${r.cls}">${r.t}</div>`).join("");
  $("panneauIA").hidden=false;
  window._observationsIA = infractions.length ?
    "Après contrôle, il a été relevé :\n- "+infractions.join(";\n- ")+
    ".\nL'employeur est invité à régulariser dans les délais légaux." :
    "Contrôle effectué. L'établissement est en règle sur les points vérifiés.";
}
$("btnIA").addEventListener("click",analyser);
$("btnRemplir").addEventListener("click",analyser);
$("btnInjecter").addEventListener("click",()=>{ $("reserveIT").value=window._observationsIA||""; });
$("btnFermerIA").addEventListener("click",()=>$("panneauIA").hidden=true);

/* ── 8. DICTÉE VOCALE (Web Speech API, fr-FR) ───────────── */
let champActif=null;
document.addEventListener("focusin",e=>{
  if(e.target.matches("input.pt,textarea")) champActif=e.target;});
$("btnDicter").addEventListener("click",()=>{
  const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(!SR) return alert("Dictée non supportée par ce navigateur (mode hors connexion : saisie manuelle).");
  if(!champActif) return alert("Cliquez d'abord dans le champ à dicter.");
  const rec=new SR();rec.lang="fr-FR";rec.interimResults=false;
  rec.onresult=ev=>{champActif.value+=(champActif.value?" ":"")+ev.results[0][0].transcript;sauverBrouillon();};
  rec.start();
});

/* ── 9. ARCHIVAGE (localStorage — hors connexion) ───────── */
const CLE="IGT_F01_archives", BRO="IGT_F01_brouillon";
function collecter(){
  const o={};document.querySelectorAll("input,select,textarea").forEach(el=>{
    if(!el.id&&!el.name)return;
    o[el.id||el.name+"_"+el.dataset.etat+"_"+el.dataset.doc] =
      el.type==="checkbox"?el.checked:el.value;});
  o._cases=[...document.querySelectorAll(".cases-vertes .actif")].map(s=>s.dataset.code);
  return o;
}
function restaurer(o){ if(!o) return;
  document.querySelectorAll("input,select,textarea").forEach(el=>{
    const k=el.id||el.name+"_"+el.dataset.etat+"_"+el.dataset.doc;
    if(k in o){ if(el.type==="checkbox") el.checked=o[k]; else el.value=o[k]; }});
  (o._cases||[]).forEach(c=>{const s=document.querySelector(`.cases-vertes [data-code="${c}"]`);
    if(s)s.classList.add("actif");});
  recalculer();
}
function sauverBrouillon(){ localStorage.setItem(BRO,JSON.stringify(collecter())); }
document.addEventListener("input",sauverBrouillon);

$("btnEnregistrer").addEventListener("click",()=>{
  const arch=JSON.parse(localStorage.getItem(CLE)||"[]");
  const num="F01-"+new Date().getFullYear()+"-"+String(arch.length+1).padStart(4,"0");
  if(!$("numFiche").value) $("numFiche").value=String(arch.length+1).padStart(4,"0");
  arch.push({numero:num,date:new Date().toISOString(),
    inspecteur:$("nomInspecteur").value,province:$("quartierProv").value,
    entreprise:$("raisonSociale").value,statut:$("cPVCI").checked?"PV CI":$("cMD").checked?"MD":"LO/Conforme",
    donnees:collecter(),historique:[{action:"Création",quand:new Date().toISOString()}]});
  localStorage.setItem(CLE,JSON.stringify(arch));
  $("numeroArchive").textContent="✔ Archivé : "+num;
});
$("btnArchives").addEventListener("click",()=>{
  const arch=JSON.parse(localStorage.getItem(CLE)||"[]");
  $("listeArchives").innerHTML=arch.length? arch.map((a,i)=>
   `<div class="arch-item" data-i="${i}"><b>${a.numero}</b> — ${a.entreprise||"(sans nom)"}<br>
    ${new Date(a.date).toLocaleString("fr-CD")} — ${a.statut} — ${a.province||""}</div>`).join("")
   : "<p>Aucune fiche archivée.</p>";
  $("panneauArchives").hidden=false;
});
$("listeArchives").addEventListener("click",e=>{
  const el=e.target.closest(".arch-item"); if(!el)return;
  const arch=JSON.parse(localStorage.getItem(CLE)||"[]");
  restaurer(arch[+el.dataset.i].donnees); $("panneauArchives").hidden=true;
});
$("btnFermerArch").addEventListener("click",()=>$("panneauArchives").hidden=true);

/* ── 10. IMPRESSION / PDF ───────────────────────────────── */
$("btnImprimer").addEventListener("click",()=>window.print());

/* ── 11. DÉMARRAGE : restauration + date du jour ────────── */
restaurer(JSON.parse(localStorage.getItem(BRO)||"null"));
const d=new Date();
if(!$("fa").value){ $("fj").value=String(d.getDate()).padStart(2,"0");
  $("fm").value=String(d.getMonth()+1).padStart(2,"0");
  $("fa").value=String(d.getFullYear()).slice(2);
  $("anFiche").value=String(d.getFullYear()).slice(2); }
recalculer();
})();
