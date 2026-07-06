const F02={
  init(){document.querySelectorAll('.tel').forEach(i=>i.addEventListener('blur',e=>{let v=e.target.value.replace(/\D/g,'');if(v.startsWith('0'))v=v.slice(1);if(v&&!v.startsWith('243'))v='243'+v;e.target.value=v?'+'+v:'';}));},
  dictate(){if(!('webkitSpeechRecognition' in window))return alert('Non supporté');const r=new webkitSpeechRecognition();r.lang='fr-FR';r.onresult=e=>{const a=document.activeElement;if(a&&a.tagName==='INPUT')a.value=e.results[0][0].transcript;};r.start();},
  analyze(){const missing=[];document.querySelectorAll('.docs input[type=checkbox]').forEach((c,i)=>{if(i%3===1&&c.checked)missing.push(i);});alert('⚖️ Analyse F02\n\nRèfèrences : art. 6 CT (contrat expatriés), Arrêté ONEM.\n'+(missing.length?`⚠️ ${missing.length} document(s) NE → Infraction. MD recommandée.`:'✅ Conforme.'));},
  sign(btn){const box=btn.previousElementSibling;const n=prompt('Nom :');if(!n)return;box.classList.add('signed');box.innerHTML=`<div style="padding:8px;font-family:cursive">${n}</div><small>${new Date().toLocaleString('fr-FR')}</small>`;},
  save(){const d={_id:'F02-'+Date.now()};document.querySelectorAll('.inp').forEach((i,x)=>d['f'+x]=i.value);localStorage.setItem(d._id,JSON.stringify(d));alert('💾 '+d._id);}
};
document.addEventListener('DOMContentLoaded',()=>F02.init());
