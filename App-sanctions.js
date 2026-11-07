(() => {
'use strict';
const $ = (s,root=document)=>root.querySelector(s);
const $$ = (s,root=document)=>Array.from(root.querySelectorAll(s));
const esc = v => String(v ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const infractions = Array.isArray(window.IGT_INFRACTIONS65)?window.IGT_INFRACTIONS65:[];
const aim = Array.isArray(window.IGT_AIM_DATA)?window.IGT_AIM_DATA:[];
const app = {
 init(){
  this.userKey='local'; this.setAccountKey();
  $('#countInfractions').textContent=infractions.length; $('#countAim').textContent=aim.length;
  this.bindNavigation(); this.bindSearch(); this.renderInfractions(infractions); this.renderAim(aim); this.bindCalculator(); this.initTheme();
  if(!infractions.length)$('#infractionsList').innerHTML='<div class="notice warning">La base des 65 infractions n’a pas pu être chargée. Vérifiez la connexion et actualisez.</div>';
  if(!aim.length)$('#aimTableBody').innerHTML='<tr><td colspan="6">Le barème AIM n’a pas pu être chargé.</td></tr>';
 },
 async setAccountKey(){try{const c=window.inspecteurBotAuthClient;if(c?.auth){const {data}=await c.auth.getSession();const id=data?.session?.user?.id;if(id)this.userKey=id;}}catch(e){console.warn('Compte local du module',e);}},
 initTheme(){const saved=localStorage.getItem('inspecteur_sanctions_theme')||'light';document.documentElement.dataset.theme=saved;this.updateThemeIcon();$('#themeToggle').addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('inspecteur_sanctions_theme',next);this.updateThemeIcon();});},
 updateThemeIcon(){const dark=document.documentElement.dataset.theme==='dark';$('#themeToggle').innerHTML=dark?'<i class="fa-solid fa-sun"></i>':'<i class="fa-solid fa-moon"></i>';},
 bindNavigation(){$$('.tab').forEach(b=>b.addEventListener('click',()=>this.showView(b.dataset.view)));$$('[data-open]').forEach(b=>b.addEventListener('click',()=>this.showView(b.dataset.open)));},
 showView(name){$$('.view-panel').forEach(p=>p.classList.toggle('active',p.id==='view-'+name));$$('.tab').forEach(b=>b.classList.toggle('active',b.dataset.view===name));$('#infractionDetail').hidden=true;window.scrollTo({top:0,behavior:'smooth'});},
 bindSearch(){$('#infractionSearch').addEventListener('input',()=>this.filterInfractions());$('#severityFilter').addEventListener('change',()=>this.filterInfractions());$('#clearInfractionSearch').addEventListener('click',()=>{$('#infractionSearch').value='';this.filterInfractions();});$('#aimSearch').addEventListener('input',()=>this.renderAim(aim.filter(x=>JSON.stringify(x).toLowerCase().includes($('#aimSearch').value.toLowerCase()))));},
 filterInfractions(){const q=$('#infractionSearch').value.trim().toLowerCase(),g=$('#severityFilter').value;const list=infractions.filter(x=>(!g||x.gravite===g)&&(!q||[x.libelle,x.articles,x.sanction,x.refSanction].join(' ').toLowerCase().includes(q)));this.renderInfractions(list);},
 renderInfractions(items){$('#infractionsResultCount').textContent=items.length+' résultat'+(items.length>1?'s':'');$('#infractionsList').innerHTML=items.length?items.map(x=>'<button class="record-row" data-id="'+esc(x.id)+'"><span class="record-number">'+esc(x.id)+'</span><span><b>'+esc(x.libelle)+'</b><small>'+esc(x.articles||'Référence à vérifier')+' · '+esc(x.sanction||'Sanction à vérifier')+'</small></span><span class="severity '+esc(x.gravite)+'">'+esc((x.gravite||'non précisée').replace('_',' '))+'</span></button>').join(''):'<div class="loading-state">Aucune infraction ne correspond à votre recherche.</div>';$$('.record-row',$('#infractionsList')).forEach(b=>b.addEventListener('click',()=>this.showInfraction(b.dataset.id)));},
 showInfraction(id){const x=infractions.find(v=>String(v.id)===String(id));if(!x)return;const box=$('#infractionDetail');box.hidden=false;box.innerHTML='<h3>Infraction n°'+esc(x.id)+' — '+esc(x.libelle)+'</h3><div class="detail-grid"><div class="detail-cell"><small>Base légale</small><b>'+esc(x.articles||'À vérifier')+'</b></div><div class="detail-cell"><small>Sanction indiquée</small><b>'+esc(x.sanction||'À vérifier dans le texte officiel')+'</b></div><div class="detail-cell"><small>Référence de sanction</small><b>'+esc(x.refSanction||'Non précisée')+'</b></div><div class="detail-cell"><small>Gravité indicative</small><b>'+esc(x.gravite||'Non précisée')+'</b></div></div><p>Vérifier la disposition officielle applicable, les éléments constitutifs et les circonstances du dossier avant toute verbalisation.</p>';box.scrollIntoView({behavior:'smooth',block:'nearest'});},
 renderAim(items){
  const body=$('#aimTableBody');
  if(!body)return;
  body.innerHTML=items.length?items.map(x=>'<tr><td>'+esc(x.id)+'</td><td><b>'+esc(x.sanction)+'</b></td><td>'+esc(x.categorieA||'—')+'</td><td>'+esc(x.categorieB||'—')+'</td><td>'+esc(x.categorieC||'—')+'</td><td><button type="button" class="aim-detail-btn" data-aim-id="'+esc(x.id)+'" aria-expanded="false">Détails <i class="fa-solid fa-chevron-down"></i></button></td></tr>').join(''):'<tr><td colspan="6">Aucun résultat.</td></tr>';
  body.querySelectorAll('.aim-detail-btn').forEach(btn=>btn.addEventListener('click',()=>{
   const item=items.find(v=>String(v.id)===String(btn.dataset.aimId));
   if(!item)return;
   const next=btn.closest('tr').nextElementSibling;
   if(next&&next.classList.contains('aim-detail-row')){next.remove();btn.setAttribute('aria-expanded','false');btn.innerHTML='Détails <i class="fa-solid fa-chevron-down"></i>';return;}
   body.querySelectorAll('.aim-detail-row').forEach(row=>row.remove());
   body.querySelectorAll('.aim-detail-btn').forEach(b=>{b.setAttribute('aria-expanded','false');b.innerHTML='Détails <i class="fa-solid fa-chevron-down"></i>';});
   const detail=document.createElement('tr');detail.className='aim-detail-row';
   const cell=document.createElement('td');cell.colSpan=6;cell.textContent=item.details||'Aucun détail complémentaire fourni.';
   detail.appendChild(cell);btn.closest('tr').after(detail);
   btn.setAttribute('aria-expanded','true');btn.innerHTML='Fermer <i class="fa-solid fa-chevron-up"></i>';
  }));
 },
 bindCalculator(){$('#calculateCdf').addEventListener('click',()=>{const usd=Number($('#usdAmount').value),rate=Number($('#exchangeRate').value);const out=$('#cdfResult');if(!Number.isFinite(usd)||!Number.isFinite(rate)||usd<0||rate<=0){out.textContent='Saisissez un montant USD et un taux de change valide.';return;}out.textContent=new Intl.NumberFormat('fr-FR',{maximumFractionDigits:2}).format(usd*rate)+' CDF';});}
};
window.InspecteurBotSanctions=app;app.init();
})();