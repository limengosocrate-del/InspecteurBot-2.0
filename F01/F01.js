const F01 = (() => {
  const DOCS = [
    "Déclaration d'Etablissement (article 216 du CT)",
    "Règlement d'entreprise (article 157 du CT)",
    "Convention collective (n°199 du Code du Travail)",
    "Horaire du Travail (article 119 du CT et Arrêté n°040/CAB/MINETPS/2013)",
    "Classification Générale des Emplois (article 90 du CT)",
    "Feuille de paie des trois derniers mois",
    "Bilan social (Article n°218 du Code du Travail)",
    "Preuve de paiement de cotisation CNSS, ONEM, INPP et IPR",
    "Déclaration annuelle de la situation de la main d'œuvre de 3 dernières années",
    "Registre de Travailleurs non permanents (article 40 alinea2)",
    "Contrat de Travail visé (articles 36 à 49 du code du Travail)",
    "Déclaration de mouvement de Travailleur visé (article 217 du Code du Travail)",
    "Certificat d'aptitude au Travail",
    "Décompte de rémunération de chaque mois",
    "Titre de congé de trois dernières années",
    "Application du SMIG",
    "Autres"
  ];
  const COMMUNES = ["Gombe","Kinshasa","Lingwala","Kalamu","Kasa-Vubu","Ngaliema","Limete","Barumbu","Lemba","Matete","Mont-Ngafula","Bandalungwa","Bumbu","Kimbanseke","Kisenso","Makala","Maluku","Masina","N'djili","N'sele","Ngiri-Ngiri","Selembao"];

  function initDocs(){
    const tb = document.getElementById('docs-list');
    DOCS.forEach((d,i)=>{
      const tr=document.createElement('tr');
      tr.innerHTML=`<td colspan="2">${d}</td>
        <td><input type="checkbox" data-doc="${i}-E"></td>
        <td><input type="checkbox" data-doc="${i}-NE"></td>
        <td><input type="checkbox" data-doc="${i}-ENC"></td>`;
      tb.appendChild(tr);
    });
  }
  function initCommunes(){
    const s=document.querySelector('[data-f="commune"]');
    COMMUNES.forEach(c=>{const o=document.createElement('option');o.textContent=c;s.appendChild(o);});
  }
  function initCases(){
    document.querySelectorAll('.c').forEach(c=>c.addEventListener('click',()=>c.classList.toggle('active')));
  }
  function initTotaux(){
    document.querySelectorAll('[data-calc]').forEach(i=>i.addEventListener('input',calcTotaux));
  }
  function calcTotaux(){
    document.querySelectorAll('[data-total]').forEach(t=>{
      const keys=t.dataset.total.split(',');
      let s=0; keys.forEach(k=>{const el=document.querySelector(`[data-calc="${k}"]`);s+=parseInt(el?.value||0);});
      t.value=s||'';
    });
  }
  function initPhone(){
    document.querySelectorAll('[data-f="contact"]').forEach(i=>{
      i.addEventListener('blur',()=>{
        let v=i.value.replace(/\D/g,'');
        if(v && !v.startsWith('243')) v='243'+v.replace(/^0/,'');
        if(v) i.value='+'+v.replace(/(\d{3})(\d{3})(\d{3})(\d{3}).*/,'$1 $2 $3 $4');
      });
    });
  }
  function initSig(id){
    const c=document.getElementById(id);if(!c)return;
    const ctx=c.getContext('2d');let d=false;
    const pos=e=>{const r=c.getBoundingClientRect();const t=e.touches?e.touches[0]:e;return{x:t.clientX-r.left,y:t.clientY-r.top};};
    const start=e=>{d=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);e.preventDefault();};
    const move=e=>{if(!d)return;const p=pos(e);ctx.lineTo(p.x,p.y);ctx.strokeStyle='#0a1128';ctx.lineWidth=1.5;ctx.stroke();};
    const end=()=>d=false;
    ['mousedown','touchstart'].forEach(ev=>c.addEventListener(ev,start));
    ['mousemove','touchmove'].forEach(ev=>c.addEventListener(ev,move));
    ['mouseup','mouseleave','touchend'].forEach(ev=>c.addEventListener(ev,end));
  }
  function panel(html){
    let p=document.getElementById('ai-panel');
    p.innerHTML=html+`<br><button onclick="document.getElementById('ai-panel').classList.remove('show')" style="margin-top:8px;background:#d4af37;border:none;padding:4px 10px;border-radius:4px;cursor:pointer;">Fermer</button>`;
    p.classList.add('show');
  }
  return {
    init(){initDocs();initCommunes();initCases();initTotaux();initPhone();initSig('sigEmp');initSig('sigInsp');this.charger();},
    dicter(){
      if(!('webkitSpeechRecognition' in window)){alert('Dictée non supportée');return;}
      const r=new webkitSpeechRecognition();r.lang='fr-FR';r.continuous=false;
      r.onresult=e=>{const t=e.results[0][0].transcript;const a=document.activeElement;if(a&&a.tagName==='INPUT')a.value=t;else panel('<h4>🎙️ Dictée:</h4>'+t);};
      r.start();panel('<h4>🎙️ Parlez maintenant...</h4>');
    },
    autoRemplir(){
      const now=new Date();
      const setV=(k,v)=>{const el=document.querySelector(`[data-f="${k}"]`);if(el&&!el.value)el.value=v;};
      setV('numero',String(Math.floor(Math.random()*9000)+1000));
      setV('annee',String(now.getFullYear()).slice(2));
      setV('faitlieu','Kinshasa');
      panel('<h4>⚡ Auto-remplissage effectué</h4>Numéro et date générés.');
    },
    analyser(){
      const infr=[];
      const check=(k,art,msg)=>{if(!document.querySelector(`[data-f="${k}"]`)?.value)infr.push(`⚠️ ${msg} (${art})`);};
      check('cnss','Art.190 CT','Numéro CNSS manquant');
      check('inpp','Loi INPP','Numéro INPP manquant');
      const en1=+document.querySelector('[data-calc="en1"]')?.value||0;
      const en2=+document.querySelector('[data-calc="en2"]')?.value||0;
      if(en1+en2>0)infr.push('🚫 Enfants employés (Art.133 CT - INFRACTION GRAVE)');
      document.querySelectorAll('[data-doc$="-NE"]').forEach((c,i)=>{if(c.checked)infr.push(`📄 Doc manquant: ${DOCS[+c.dataset.doc.split('-')[0]]}`);});
      const html=infr.length?'<h4>⚖️ Analyse juridique</h4>'+infr.join('<br>')+'<br><br><b>Recommandation:</b> Mise en demeure sous 15 jours.':'<h4>✅ Conforme</h4>Aucune infraction majeure détectée.';
      panel(html);
      document.querySelector('[data-f="analyse"]').value=infr.join('\n');
    },
    signer(who){
      const id=who==='emp'?'sigEmp':'sigInsp';
      const c=document.getElementById(id);const ctx=c.getContext('2d');
      ctx.font='italic 14px cursive';ctx.fillStyle='#0a1128';
      ctx.fillText('Signé électroniquement - '+new Date().toLocaleString('fr-FR'),10,40);
      panel('<h4>✍️ Signature enregistrée</h4>Horodatage: '+new Date().toISOString());
    },
    archiver(){
      const data={};document.querySelectorAll('[data-f]').forEach(i=>data[i.dataset.f]=i.type==='checkbox'?i.checked:i.value);
      data._id='F01-'+Date.now();data._date=new Date().toISOString();
      const arr=JSON.parse(localStorage.getItem('F01_archives')||'[]');arr.push(data);
      localStorage.setItem('F01_archives',JSON.stringify(arr));
      localStorage.setItem('F01_current',JSON.stringify(data));
      panel('<h4>💾 Archivé</h4>ID: '+data._id+'<br>Total: '+arr.length+' fiches');
    },
    charger(){
      const d=JSON.parse(localStorage.getItem('F01_current')||'null');if(!d)return;
      Object.keys(d).forEach(k=>{const el=document.querySelector(`[data-f="${k}"]`);if(el){if(el.type==='checkbox')el.checked=d[k];else el.value=d[k];}});
    },
    toggleTheme(){document.body.classList.toggle('dark');}
  };
})();
document.addEventListener('DOMContentLoaded',()=>F01.init());
