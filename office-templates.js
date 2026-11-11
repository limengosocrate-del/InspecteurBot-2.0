(()=>{'use strict';
const routes={
 F01:{title:'F01 — Main-d’œuvre',url:'F01/F01.html'},
 F02:{title:'F02 — Main-d’œuvre étrangère',url:'F02/F02.html'},
 F03:{title:'F03 — Hygiène et santé',url:'F03/F03.html'},
 F04:{title:'F04 — Sécurité BTP',url:'F04/F04.html'},
 F05:{title:'F05 — Sécurité dans les mines',url:'F05/F05.html'},
 F06:{title:'F06 — Entreprises à hauts risques',url:'F06/F06.html'},
 F07:{title:'F07 — Protection sociale',url:'F07/F07.html'},
 S01:{title:'S01 — Visite spéciale',url:'S01/S01.html'},
 S02:{title:'S02 — Contre-enquête',url:'S02/S02.html'},
 S03:{title:'S03 — Administration et finance',url:'S03/S03.html'},
 PV:{title:'Procès-verbal',url:'pv.html?v=20261110-pv-redesign-v2'},
 RAPPORT:{title:'Rapport professionnel',url:'rapport-ia.html'},
 DECOMPTE:{title:'Décompte final',url:'autres/decompte-final.html?v=20261110-decompte-redesign-v2'},
 ENTREPRISE:{title:'Registre des entreprises',url:'entreprises.html?v=20261109-enterprise-pdf-a4-fix6'}
};
function init(){
 const select=document.getElementById('templateType');
 const viewer=document.getElementById('existingOfficeDocument');
 const frame=document.getElementById('existingDocumentFrame');
 const title=document.getElementById('existingDocumentTitle');
 const close=document.getElementById('closeExistingDocument');
 if(!select||!viewer||!frame||!close)return;
 select.addEventListener('change',()=>{
  const item=routes[select.value];
  if(!item){viewer.hidden=true;frame.removeAttribute('src');return}
  title.textContent=item.title;
  frame.src=item.url;
  viewer.hidden=false;
 });
 close.addEventListener('click',()=>{
  frame.removeAttribute('src');viewer.hidden=true;select.value='';select.focus();
 });
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();