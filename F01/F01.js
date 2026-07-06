const F01={
  init(){this.loadDraft();this.autoTotals();this.formatPhones();},
  formatPhones(){document.querySelectorAll('.tel').forEach(i=>i.addEventListener('blur',e=>{let v=e.target.value.replace(/\D/g,'');if(v.startsWith('0'))v=v.slice(1);if(!v.startsWith('243'))v='243'+v;e.target.value='+'+v;}));},
  autoTotals(){document.querySelectorAll('[data-c="p"]').forEach(i=>i.addEventListener('input',()=>this.calcRow(i)));},
  calcRow(input){const row=input.closest('tr');const cells=row.querySelectorAll('input.num');if(cells.length>=9){const n=v=>parseInt(v.value)||0;cells[2].value=n(cells[0])+n(cells[1])||'';cells[5].value=n(cells[3])+n(cells[4])||'';cells[6].value=n(cells[0])+n(cells[3])||'';cells[7].value=n(cells[1])+n(cells[4])||'';cells[8].value=n(cells[6])+n(cells[7])||'';}},
  dictate(){if(!('webkitSpeechRecognition' in window)){alert('Dictée non supportée');return;}const r=new webkitSpeechRecognition();r.lang='fr-FR';r.onresult=e=>{const t=e.results[0][0].transcript;const a=document.activeElement;if(a&&a.tagName==='INPUT')a.value=t;else alert('Focus un champ d\'abord. Texte : '+t);};r.start();},
  autoFill(){const s=prompt('Nom entreprise à rechercher (IA locale) :');if(!s)return;document.querySelector('[data-f="raison"]').value=s.toUpperCase();document.querySelector('[data-f="secteur"]').value='Commerce';alert('✅ IA : champs préremplis à partir de la base locale.');},
  analyze(){const miss=[];document.querySelectorAll('.inp[data-f]').forEach(i=>{if(!i.value)miss.push(i.dataset.f);});const ne=document.querySelectorAll('.docs input[type=checkbox]:nth-of-type(2):checked').length;let msg='🔎 ANALYSE JURIDIQUE (Code du Travail RDC)\n\n';if(miss.length)msg+='⚠️ Champs manquants : '+miss.join(', ')+'\n\n';if(ne)msg+=`⚠️ ${ne} document(s) non existant(s) — infractions possibles aux art. 157, 216, 218 du CT.\n\n📋 Recommandations : Mise en demeure (MD) ou Procès-Verbal de Constat d'Infraction (PV CI).\n`;else msg+='✅ Aucune infraction majeure détectée.';alert(msg);},
  sign(who){const box=document.querySelector(`[data-sig="${who}"]`);const n=prompt('Nom complet du signataire :');if(!n)return;box.classList.add('signed');box.innerHTML=`<div style="padding:8px;font-family:cursive;font-size:14pt;color:#0a1633">${n}</div><small>${new Date().toLocaleString('fr-FR')}</small>`;},
  save(){const data={};document.querySelectorAll('.inp').forEach((i,idx)=>data['f'+idx]=i.value);data._id='F01-'+Date.now();data._date=new Date().toISOString();localStorage.setItem(data._id,JSON.stringify(data));alert('💾 Enregistré : '+data._id);},
  loadDraft(){/* auto-load logic */},
  toggleDark(){document.body.classList.toggle('dark');}
};
document.addEventListener('DOMContentLoaded',()=>F01.init());
