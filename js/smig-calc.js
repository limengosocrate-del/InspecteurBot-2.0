/* Calculateur SMIG RDC — moteur autonome léger */
(function(){
 'use strict';
 const data=window.SMIG_DATA;
 if(!data)throw new Error('La base SMIG_DATA est introuvable.');
 const money=n=>Math.round(Number(n)||0).toLocaleString('fr-FR');
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const base=Number(data.smigManoeuvre?.palier1?.montant)||14500;
 const current=()=>Number(data.getSmigActuel());
 const scaled=(value)=>Math.round((Number(value)||0)*current()/base);
 function normalize(s){return String(s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();}
 function getRows(){return (data.bareme||[]).map(r=>({...r,smigJour:scaled(r.smigJour),smigMois:scaled(r.smigJour)*data.multiplicateurs.mensuel,logement:Math.round(scaled(r.smigJour)*data.multiplicateurs.mensuel*.30)}));}
 function genererTableau(filter=''){
  const q=normalize(filter),rows=getRows().filter(r=>!q||normalize([r.cat,r.ech,r.classe,r.fonctions].join(' ')).includes(q));
  if(!rows.length)return '<div class="smig-empty">Aucune fonction ou classe ne correspond à votre recherche.</div>';
  return '<div class="smig-table-wrap"><table class="smig-table"><thead><tr><th>Catégorie</th><th>Échelon</th><th>Classe</th><th>Fonctions / emplois</th><th>SMIG / jour</th><th>SMIG / mois</th><th>Logement estimé (30 %)</th></tr></thead><tbody>'+
   rows.map(r=>'<tr><td>'+esc(r.cat)+'</td><td>'+esc(r.ech)+'</td><td>'+r.classe+'</td><td class="smig-function">'+esc(r.fonctions)+'</td><td class="num">'+money(r.smigJour)+' FC</td><td class="num">'+money(r.smigMois)+' FC</td><td class="num">'+money(r.logement)+' FC</td></tr>').join('')+
   '</tbody></table></div><p class="smig-result-count">'+rows.length+' classe(s) affichée(s) sur '+data.bareme.length+'.</p>';
 }
 function trouver(fonction){
  const q=normalize(fonction);
  if(!q)return null;
  return getRows().find(r=>normalize(r.fonctions).includes(q)||normalize(r.ech)===q||String(r.classe)===q||normalize(r.cat)===q)||null;
 }
 function calculer(fonction,enfants=0){
  const row=trouver(fonction);if(!row)return null;
  const n=Math.max(0,Math.min(30,Math.floor(Number(enfants)||0)));
  const allocJour=Math.round(current()*data.allocationFamilialeRatio);
  const allocMois=allocJour*n*data.multiplicateurs.mensuel;
  const logementJour=Math.round(allocJour*data.contreValeurLogementRatio);
  const logementMois=logementJour*data.multiplicateurs.mensuel;
  const housing=row.logement;
  return {classe:row,logement30pct:housing,allocationsFamilialesJour:allocJour,allocationsFamilialesMois:allocMois,contreValeurLogementJour:logementJour,salaireTotal:row.smigMois+housing+allocMois+logementMois,enfants:n};
 }
 window.SMIGCALC={genererTableau,calculer,trouverClasse:trouver};
})();
