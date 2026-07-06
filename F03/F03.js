const F03={
  dictate(){if(!('webkitSpeechRecognition' in window))return alert('Non supporté');const r=new webkitSpeechRecognition();r.lang='fr-FR';r.onresult=e=>{const a=document.activeElement;if(a)a.value=e.results[0][0].transcript;};r.start();},
  analyze(){alert('⚖️ F03 – Hygiène/Santé\n\nRéf. art. 159-176 CT (Hygiène), art. 175 (Comité H&S), Décret sur médecine du travail.\n\nRecommandations : Vérifier CHSE, service médical, assurance maladie obligatoire.');},
  sign(btn){const box=btn.previousElementSibling;const n=prompt('Nom :');if(!n)return;box.classList.add('signed');box.innerHTML=`<div style="padding:6px;font-family:cursive">${n}</div><small>${new Date().toLocaleString('fr-FR')}</small>`;},
  save(){const d={_id:'F03-'+Date.now()};document.querySelectorAll('.inp').forEach((i,x)=>d['f'+x]=i.value);localStorage.setItem(d._id,JSON.stringify(d));alert('💾 '+d._id);}
};
