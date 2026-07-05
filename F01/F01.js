document.addEventListener('DOMContentLoaded', ()=>{
  initTheme();
  populateLists();
  initDocsTable();
  window.signEmployeur = initCanvas('signEmployeur');
  window.signInspecteur = initCanvas('signInspecteur');
  document.getElementById('tel').addEventListener('focus', ()=>{
    if(!document.getElementById('tel').value.startsWith('+243')) document.getElementById('tel').value = '+243';
  });
});

function populateLists(){
  const sec = document.getElementById('secteur');
  SECTEURS.forEach(s=> sec.add(new Option(s,s)));
}

const DOCS_F01 = [
  {key:"declaration_etablissement", label:"Déclaration d'Établissement (article 216 du CT)"},
  {key:"reglement_entreprise", label:"Règlement d'entreprise (article 157 du CT)"},
  {key:"convention_collective", label:"Convention collective (n°199 du Code du Travail)"},
  {key:"horaire", label:"Horaire du Travail (article 119 du CT et Arrêté n°040/CAB/MINETPS/2013)"},
  {key:"classification", label:"Classification Générale des Emplois (article 90 du CT)"},
  {key:"bulletin_paie", label:"Feuille de paie de trois derniers mois"},
  {key:"bilan_social", label:"Bilan social (Article n°218 du Code du Travail)"},
  {key:"preuve_cnss", label:"Preuve de paiement de cotisation CNSS, ONEM, INPP et IPR"},
  {key:"declaration_annuelle", label:"Déclaration annuelle de la situation de la main d'œuvre de 3 dernières années"},
  {key:"registre_non_perm", label:"Registre de Travailleurs non permanents (article 40 alinéa2)"},
  {key:"contrat_travail", label:"Contrat de Travail visé (articles 36 à 49 du code du Travail)"},
  {key:"mouvement", label:"Déclaration de mouvement de Travailleur visé (article 217 du Code du Travail)"},
  {key:"aptitude", label:"Certificat d'aptitude au Travail"},
  {key:"decompte", label:"Décompte de rémunération de chaque mois"},
  {key:"conge", label:"Titre de congé de trois dernières années"},
  {key:"smig", label:"Application du SMIG"}
];

function initDocsTable(){
  const tb = document.getElementById('docTableBody');
  DOCS_F01.forEach(d=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.label}</td>
      <td><input type="radio" name="${d.key}" value="E" onchange="checkDoc('${d.key}',true)"></td>
      <td><input type="radio" name="${d.key}" value="NE" onchange="checkDoc('${d.key}',false)"></td>
      <td><input type="radio" name="${d.key}" value="ENC" onchange="checkDoc('${d.key}',false)"></td>
    `;
    tb.appendChild(tr);
  });
}

const formState = {};
function checkDoc(key, exists){ formState[key] = exists; }

function calcF01(){
  const n = document.querySelectorAll('.data-table tbody tr')[0];
  const v = (i)=>parseInt(n.cells[i].querySelector('input')?.value||0);
  const nh=v(0), nf=v(1), eh=v(3), ef=v(4);
  const nt=nh+nf, et=eh+ef, th=nh+eh, tf=nf+ef, tg=nt+et;
  document.getElementById('nat-total').textContent=nt;
  document.getElementById('exp-total').textContent=et;
  document.getElementById('tot-h').textContent=th;
  document.getElementById('tot-f').textContent=tf;
  document.getElementById('tot-global').textContent=tg;
}

function clearSign(id){ if(window[id]) window[id].clear(); }

function runAnalysis(){
  const results = analyseJuridique(formState);
  const panel = document.getElementById('iaPanel');
  const box = document.getElementById('iaResults');
  panel.style.display='block';
  if(!results.length){ box.innerHTML='<p style="color:#4caf50;">✅ Aucune infraction majeure détectée sur les documents vérifiés.</p>'; return; }
  box.innerHTML = results.map(r=>`
    <div style="margin-bottom:8px;padding:8px;background:rgba(255,0,0,.1);border-left:4px solid #ff5252;">
      <strong>${r.article}</strong> — ${r.infraction}<br>
      <em>Sanction prévue :</em> ${r.sanction}
    </div>
  `).join('');
}

function saveF01(){
  const payload = {
    form:'F01', state:formState,
    conclusion: document.querySelector('input[name="conclusion"]:checked')?.value || '',
    decision: document.getElementById('decisionAdmin')?.value || '',
    signatures:{employeur:window.signEmployeur?.getData(), inspecteur:window.signInspecteur?.getData()},
    refus: document.getElementById('refusEmployeur').checked
  };
  const id = saveForm('F01', payload);
  alert(`Formulaire F01 enregistré localement sous l'ID : ${id}`);
}
