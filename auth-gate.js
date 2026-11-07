/* InspecteurBot — garde d'accès Supabase. Comptes existants uniquement. */
(function () {
'use strict';
if (window.__inspecteurBotAuthLoaded) return;
window.__inspecteurBotAuthLoaded = true;
const URL='https://icymfsvbuandgvrhwmaw.supabase.co';
const KEY='sb_publishable_ehMQbO5ac2-9RSdiOmxKJw_yPw2ES7z';
let client=null,user=null,profile=null,busy=false,expiry=null,validation=null,recovery=false;
const css=document.createElement('style');
css.textContent=`
html:not(.inspecteur-auth-ready) body>*:not(#ib-auth-gate){visibility:hidden!important}
#ib-auth-gate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:linear-gradient(135deg,#04183d,#07518a);font-family:Arial,sans-serif;visibility:visible!important}
#ib-auth-gate[hidden]{display:none!important}
#ib-auth-card{box-sizing:border-box;width:min(430px,100%);padding:30px 26px;border-radius:18px;background:#fff;color:#18314d;box-shadow:0 20px 65px #00152f80}
#ib-auth-card h2{margin:0 0 8px;color:#073b70;text-align:center}
#ib-auth-card p{color:#586b80;line-height:1.5;text-align:center}
#ib-auth-loading{width:30px;height:30px;margin:18px auto;border:3px solid #dce8f2;border-top-color:#087eb5;border-radius:50%;animation:ib-spin .8s linear infinite}
@keyframes ib-spin{to{transform:rotate(360deg)}}
#ib-auth-card label{display:block;margin:14px 0 6px;font-weight:700;font-size:14px}
#ib-auth-card input{box-sizing:border-box;width:100%;padding:13px;border:1px solid #cbd5e1;border-radius:9px;font-size:16px}
#ib-auth-submit{width:100%;margin-top:18px;padding:13px;border:0;border-radius:9px;background:#07518a;color:white;font-size:16px;font-weight:700}
#ib-auth-message{min-height:22px;margin-top:12px;color:#b42318;font-size:14px}#ib-auth-loading:not([hidden]){display:flex!important;align-items:center;justify-content:center;gap:11px;margin:22px auto 8px;color:#07518a;font-size:14px;font-weight:700}#ib-auth-loading:before{content:'';width:24px;height:24px;border:3px solid #d9e8f2;border-top-color:#0786b3;border-radius:50%;animation:ibAuthSpin .75s linear infinite}@keyframes ibAuthSpin{to{transform:rotate(360deg)}}
#ib-auth-forgot{margin-top:12px;padding:0;border:0;background:transparent;color:#07518a;text-decoration:underline}

#ib-app-header{position:relative;z-index:1200;display:flex;align-items:center;gap:14px;min-height:88px;padding:10px clamp(14px,4vw,42px);background:#fff;color:#173b5c;border-bottom:1px solid #e3ebf2;box-shadow:0 2px 12px #102e4a0a}
#ib-app-header .ib-brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1;font-weight:800;color:#073b70;letter-spacing:.2px}
#ib-app-header .ib-brand-mark{display:grid;place-items:center;width:42px;height:42px;flex:0 0 42px;border-radius:50%;background:#0799bd;color:#fff;font-size:19px}
#ib-app-header .ib-brand-copy{font-size:clamp(18px,3vw,25px);line-height:1.15;font-weight:800;letter-spacing:-.4px}#ib-app-header .ib-brand-copy small{display:block;margin-top:4px;color:#0754a0;font-size:clamp(11px,2vw,15px);font-style:italic;letter-spacing:0;font-weight:500}#ib-app-header .ib-header-actions{display:flex;align-items:center;gap:14px;order:3;margin-left:auto}#ib-auth-chip{position:relative;z-index:1201;flex:0 0 auto;max-width:76px}#ib-auth-account{width:76px;height:76px;justify-content:center;padding:0;border:0;border-radius:50%;box-shadow:none;background:#0799bd}#ib-auth-account .ib-avatar{width:68px;height:68px;flex-basis:68px;background:#0799bd;font-size:27px}#ib-auth-account .ib-account-label,#ib-auth-account>i:last-child{display:none}#ib-auth-menu{left:0;right:auto;top:calc(100% + 10px)}#ib-notification-link{position:relative;display:grid;place-items:center;width:42px;height:46px;color:#073b70;text-decoration:none;font-size:28px}#ib-notification-link .ib-notification-count[hidden]{display:none!important}#ib-notification-link .ib-notification-count{position:absolute;top:0;right:-1px;display:grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:50px;background:#dc2638;color:#fff;font:700 11px Arial,sans-serif;border:2px solid #fff}#ib-header-menu{width:46px;height:46px;border:0;border-radius:0;background:transparent;color:#073b70;font-size:30px}
#ib-app-header .ib-brand-copy small{display:block;margin-top:3px;color:#71869a;font-size:9px;letter-spacing:1.1px;font-weight:700}
#ib-app-header .ib-header-actions{display:flex;align-items:center;gap:12px}
#ib-auth-chip{position:relative;z-index:1201;top:auto;right:auto;max-width:min(350px,calc(100vw - 120px));font:13px Arial,sans-serif}
#ib-auth-account{display:flex;align-items:center;gap:9px;max-width:100%;padding:7px 10px;border:1px solid #e0e8ef;border-radius:40px;background:#fff;color:#173b5c;box-shadow:0 2px 8px #00152f0d;font-weight:700;cursor:pointer}
#ib-auth-account .ib-avatar{display:grid;place-items:center;position:relative;overflow:hidden;width:38px;height:38px;flex:0 0 38px;border-radius:50%;background:#0799bd;color:#fff;font-size:17px}#ib-auth-account .ib-avatar-image{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%}
#ib-auth-account .ib-account-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px;font-size:12px}
#ib-auth-account>i:last-child{margin:0 5px;color:#36566e}
#ib-auth-menu{position:absolute;left:0;right:auto;top:calc(100% + 9px);width:min(285px,calc(100vw - 24px));padding:8px;border:1px solid #dce7f1;border-radius:14px;background:#fff;box-shadow:0 15px 40px #00152f25}
#ib-auth-menu[hidden]{display:none!important}
#ib-auth-menu a,#ib-auth-menu button{display:flex;align-items:center;gap:12px;width:100%;padding:15px;border:0;border-radius:9px;background:transparent;color:#173b5c;text-decoration:none;text-align:left;font-weight:700;font-size:15px;cursor:pointer}
#ib-auth-menu a:hover,#ib-auth-menu button:hover{background:#edf5fb}
#ib-auth-menu button{color:#b42318}
#ib-header-menu{display:grid;place-items:center;width:46px;height:46px;flex:0 0 46px;border:0;border-radius:50%;background:#f1f5f8;color:#173b5c;font-size:23px;cursor:pointer}
#ib-header-menu:focus-visible,#ib-auth-account:focus-visible{outline:3px solid #0b9ac0;outline-offset:2px}
@media(max-width:520px){#ib-app-header{min-height:78px;padding:8px 12px;gap:9px}#ib-app-header .ib-brand{gap:6px;order:0;text-align:left}#ib-app-header .ib-brand-copy{font-size:19px}#ib-app-header .ib-brand-copy small{font-size:11px}#ib-app-header .ib-header-actions{gap:8px;order:3;flex-direction:row}#ib-auth-chip{max-width:60px}#ib-auth-account{width:58px;height:58px;padding:0}#ib-auth-account .ib-avatar{width:54px;height:54px;flex-basis:54px;font-size:25px}#ib-notification-link{width:34px;height:40px;font-size:24px}#ib-notification-link .ib-notification-count{min-width:18px;height:18px;font-size:10px}#ib-header-menu{width:36px;height:40px;flex-basis:36px;font-size:27px}}
`;
document.head.appendChild(css);
function byId(id){return document.getElementById('ib-'+id)}
async function refreshNotificationBadge(){
 const link=document.getElementById('ib-notification-link');if(!link||!client||!user)return;
 const badge=link.querySelector('.ib-notification-count');
 try{const cached=JSON.parse(localStorage.getItem('inspecteurbot_notifications_cache_v2_'+user.id)||'null');if(cached){const anns=cached.announcements||[],msgs=cached.messages||[];const seen=new Set((JSON.parse(localStorage.getItem('inspecteurbot_announcement_reads_'+user.id)||'[]')).map(String));const count=anns.filter(x=>x.created_by!==user.id&&!seen.has(String(x.id))).length+msgs.filter(x=>x.recipient_id===user.id&&!x.read_at).length;badge.textContent=count>99?'99+':String(count);badge.hidden=count===0}}
 catch(_){}
 try{
  const [ar,rr,mr]=await Promise.all([
   client.from('announcements').select('id,created_by,target_user_id').or('target_user_id.is.null,target_user_id.eq.'+user.id).limit(100),
   client.from('announcement_reads').select('announcement_id').eq('user_id',user.id).limit(100),
   client.from('messages').select('id').eq('recipient_id',user.id).is('read_at',null).limit(100)
  ]);
  if(ar.error)throw ar.error;if(rr.error)throw rr.error;if(mr.error)throw mr.error;
  const seen=new Set((rr.data||[]).map(x=>String(x.announcement_id)));
  const count=(ar.data||[]).filter(x=>x.created_by!==user.id&&!seen.has(String(x.id))).length+(mr.data||[]).length;
  badge.textContent=count>99?'99+':String(count);badge.hidden=count===0;
  link.setAttribute('aria-label',count?('Notifications, '+count+' non lue(s)'):'Notifications');
  link.title=count?count+' notification(s) non lue(s)':'Aucune nouvelle notification';
 }catch(e){console.warn('Compteur de notifications indisponible',e);badge.hidden=true;link.setAttribute('aria-label','Notifications')}
}
function msg(t,ok){const n=byId('auth-message');if(n){n.textContent=t||'';n.style.color=ok?'#138a65':'#b42318'}}
function gate(t,mode){
 document.documentElement.classList.remove('inspecteur-auth-ready');makeGate();
 const g=byId('auth-gate'),form=byId('auth-form'),forgot=byId('auth-forgot'),retry=byId('auth-retry'),intro=byId('auth-intro');
 g.hidden=false;form.hidden=mode==='loading'||mode==='retry';forgot.hidden=mode==='loading'||mode==='retry';retry.hidden=mode!=='retry';byId('auth-loading').hidden=mode!=='loading';byId('auth-message').style.color=mode==='loading'?'#07518a':'#b42318';
 intro.textContent=mode==='loading'?'Préparation de votre espace sécurisé…':'Connectez-vous avec votre compte existant pour accéder à l’application.';
 if(t&&mode!=='loading')msg(t,mode==='loading');
}
function makeGate(){
 if(byId('auth-gate'))return;
 const g=document.createElement('div');g.id='ib-auth-gate';
 g.innerHTML='<section id="ib-auth-card" role="dialog" aria-modal="true"><div style="text-align:center;font-size:34px">🔐</div><h2>InspecteurBot</h2><p style="margin:0 0 14px;color:#087eb5;font-weight:700;font-size:13px">Assistant numérique pour les agents de l’IGT</p><p id="ib-auth-intro">Connectez-vous avec votre compte existant pour accéder à l’application.</p><div id="ib-auth-loading" hidden role="status" aria-label="Chargement"></div><form id="ib-auth-form"><label for="ib-auth-email">Adresse e-mail du compte</label><input id="ib-auth-email" type="email" autocomplete="username" required placeholder="Adresse e-mail enregistrée"><label for="ib-auth-password">Mot de passe</label><input id="ib-auth-password" type="password" autocomplete="current-password" required placeholder="Votre mot de passe"><div id="ib-auth-confirm-wrap" hidden><label for="ib-auth-confirm">Confirmer le nouveau mot de passe</label><input id="ib-auth-confirm" type="password" autocomplete="new-password"></div><button id="ib-auth-submit" type="submit">Se connecter</button></form><button id="ib-auth-forgot" type="button">Mot de passe oublié ?</button><button id="ib-auth-retry" type="button" hidden style="width:100%;margin-top:16px;padding:13px;border:0;border-radius:9px;background:#07518a;color:#fff;font-weight:700">Réessayer</button><div id="ib-auth-message" role="status" aria-live="polite"></div><p style="font-size:12px">Accès réservé aux comptes autorisés de l’Inspection Générale du Travail.</p></section>';
 document.body.appendChild(g);
}
async function loadLib(){
 if(window.supabase?.createClient)return;
 if(!document.querySelector('link[data-ib-supabase-preconnect]')){const p=document.createElement('link');p.rel='preconnect';p.href='https://cdn.jsdelivr.net';p.crossOrigin='anonymous';p.dataset.ibSupabasePreconnect='1';document.head.appendChild(p)}
 await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';s.async=true;s.crossOrigin='anonymous';s.onload=ok;s.onerror=()=>no(Error('Bibliothèque Supabase indisponible. Vérifiez votre connexion internet.'));document.head.appendChild(s)});
}
async function serverCheck(){
 for(let attempt=0;attempt<2;attempt++){
  const {data,error}=await client.functions.invoke('igt-session-start',{body:{}});
  let payload=data||null;
  if(error&&error.context&&typeof error.context.clone==='function'){try{payload=await error.context.clone().json()}catch(_){}}
  if(!error&&payload?.success){clearTimeout(expiry);expiry=null;return payload}
  const code=payload?.code||'';
  if(code==='SESSION_ALREADY_INITIALIZED'&&attempt===0){await new Promise(resolve=>setTimeout(resolve,250));continue}
  const fatal=['LOGIN_REQUIRED','INVALID_SESSION','INVALID_SESSION_ID','SESSION_REVOKED','PROFILE_INACTIVE','ACCOUNT_SUSPENDED','ROLE_NOT_ALLOWED'].includes(code);
  const err=new Error(payload?.message||error?.message||'Vérification de sécurité momentanément indisponible.');
  err.authFatal=fatal;err.authTransient=!fatal;throw err;
 }
 throw Object.assign(new Error('Vérification de sécurité momentanément indisponible.'),{authTransient:true});
}
async function validate(session){
 if(!session){user=null;profile=null;clearTimeout(expiry);gate();return}
 if(busy)return;busy=true;
 try{
  const routeIsAdmin=location.pathname.endsWith('/admin.html');
  const cacheKey='inspecteurbot_profile_cache_v2_'+session.user.id;
  let cached=null;
  if(!routeIsAdmin){try{const saved=JSON.parse(localStorage.getItem(cacheKey)||'null');if(saved&&saved.profile?.id===session.user.id&&saved.profile.is_active===true)cached=saved.profile}catch(_){}}
  let data;
  if(cached){
   data=cached;
   Promise.resolve().then(()=>serverCheck()).then(fresh=>{
    const updated=fresh?.profile;if(!updated||updated.is_active!==true)throw Object.assign(new Error('Compte suspendu ou profil indisponible.'),{authFatal:true});
    localStorage.setItem(cacheKey,JSON.stringify({profile:updated,savedAt:Date.now()}));
    profile=updated;window.inspecteurBotAuthProfile=updated;
    window.dispatchEvent(new CustomEvent('inspecteurbot:profile-updated',{detail:{client,user,profile:updated}}));
   }).catch(async err=>{if(err.authFatal){await client.auth.signOut().catch(()=>{});user=null;profile=null;gate(err.message||'Accès révoqué.')}else console.warn('Validation serveur différée :',err.message)});
  }else{
   const sessionResult=await serverCheck();data=sessionResult?.profile;
   if(!data)throw Object.assign(new Error('Profil utilisateur indisponible. Réessayez.'),{authTransient:true});
   if(data.is_active!==true)throw Error('Ce compte est suspendu ou ne dispose pas d’un profil actif. Contactez l’administrateur.');
   try{localStorage.setItem(cacheKey,JSON.stringify({profile:data,savedAt:Date.now()}))}catch(_){}
  }
  if(data.is_active!==true)throw Error('Ce compte est suspendu ou ne dispose pas d’un profil actif. Contactez l’administrateur.');
  user=session.user;profile=data;
  document.documentElement.classList.add('inspecteur-auth-ready');byId('auth-gate').hidden=true;
  const path=location.pathname;
  if(path.endsWith('/admin.html')&&data.role!=='super_admin'){gate('Accès réservé au super-administrateur.');return;}
  window.inspecteurBotAuthUser=user;window.inspecteurBotAuthProfile=profile;
  window.dispatchEvent(new CustomEvent('inspecteurbot:authenticated',{detail:{client,user,profile}}));
  const isHome=path==='/'||path.endsWith('/index.html')||path.endsWith('/InspecteurBot-2.0/');
  if(isHome){
   let chip=byId('auth-chip');
   if(!chip){
    const appHeader=document.createElement('header');appHeader.id='ib-app-header';
    appHeader.innerHTML='<div id="ib-auth-slot"></div><div class="ib-brand"><span class="ib-brand-copy">InspecteurBot<small>Votre assistant numérique</small></span></div><div class="ib-header-actions"><a id="ib-notification-link" href="/InspecteurBot-2.0/notifications.html" aria-label="Notifications"><i class="fa-regular fa-bell"></i><span class="ib-notification-count" hidden></span></a><button type="button" id="ib-header-menu" aria-label="Ouvrir le menu principal" aria-expanded="false"><i class="fa-solid fa-bars"></i></button></div>';
    document.body.insertBefore(appHeader,document.body.firstChild);
    chip=document.createElement('div');chip.id='ib-auth-chip';
    chip.innerHTML='<button type="button" id="ib-auth-account" aria-label="Ouvrir le menu de votre profil" aria-expanded="false" aria-controls="ib-auth-menu"><span class="ib-avatar"><i class="fa-solid fa-user"></i><img class="ib-avatar-image" alt="" hidden></span><span class="ib-account-label"></span><i class="fa-solid fa-chevron-down"></i></button><div id="ib-auth-menu" hidden><a href="profil.html"><i class="fa-solid fa-user"></i> Mon profil</a><a href="profil.html#parametres"><i class="fa-solid fa-gear"></i> Paramètres</a><a href="profil.html"><i class="fa-solid fa-address-card"></i> Mes informations</a><button type="button" id="ib-auth-logout"><i class="fa-solid fa-right-from-bracket"></i> Déconnexion</button></div>';
    appHeader.querySelector('#ib-auth-slot').appendChild(chip);
    const toggle=chip.querySelector('#ib-auth-account'),menu=chip.querySelector('#ib-auth-menu'),hamb=appHeader.querySelector('#ib-header-menu');
    function setMenu(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));hamb.setAttribute('aria-expanded',String(open));hamb.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'}
    toggle.addEventListener('click',()=>setMenu(menu.hidden));
    hamb.addEventListener('click',()=>setMenu(menu.hidden));
    chip.querySelector('#ib-auth-logout').addEventListener('click',signOut);
    document.addEventListener('click',e=>{if(!chip.contains(e.target)&&!hamb.contains(e.target))setMenu(false)});
   }
   const label=chip.querySelector('.ib-account-label');label.textContent=data.display_name||session.user.email||'Utilisateur';
   const menu=chip.querySelector('#ib-auth-menu');if(data.role==='super_admin'){if(menu&&!menu.querySelector('#ib-admin-link')){const link=document.createElement('a');link.id='ib-admin-link';link.href='admin.html';link.innerHTML='<i class="fa-solid fa-gauge-high"></i> Tableau de bord administrateur';const logout=menu.querySelector('#ib-auth-logout');menu.insertBefore(link,logout||null);}}else if(menu){menu.querySelectorAll('#ib-admin-link,a').forEach(link=>{if(/administrateur|admin\.html|se connecter comme/i.test(link.textContent+' '+link.getAttribute('href')))link.remove()})}
   const avatarBox=chip.querySelector('.ib-avatar'),avatarImg=chip.querySelector('.ib-avatar-image'),avatarIcon=avatarBox.querySelector('i');
   if(data.avatar_url){avatarImg.src=data.avatar_url;avatarImg.hidden=false;avatarIcon.hidden=true}
   else{avatarImg.hidden=true;avatarImg.removeAttribute('src');avatarIcon.hidden=false}
   window.inspecteurBotSetAvatar=function(url){if(url){avatarImg.src=url;avatarImg.hidden=false;avatarIcon.hidden=true}else{avatarImg.hidden=true;avatarImg.removeAttribute('src');avatarIcon.hidden=false}};
   refreshNotificationBadge();
   if(!window.__ibNotificationRefreshTimer)window.__ibNotificationRefreshTimer=setInterval(refreshNotificationBadge,45000);
   window.addEventListener('focus',refreshNotificationBadge);
  }
 }catch(e){console.warn('Authentification InspecteurBot',e);if(e.authTransient){gate(e.message||'Vérification momentanément indisponible. Réessayez.','retry');return}await client.auth.signOut().catch(()=>{});user=null;profile=null;gate(e.message||'Connexion requise.')}
 finally{busy=false}
}
async function signOut(){clearTimeout(expiry);clearInterval(validation);if(client)await client.auth.signOut().catch(()=>{});user=null;profile=null;gate('Vous êtes déconnecté.')}
function setup(){
 const form=byId('auth-form'),email=byId('auth-email'),pw=byId('auth-password'),confirm=byId('auth-confirm'),wrap=byId('auth-confirm-wrap'),submit=byId('auth-submit'),forgot=byId('auth-forgot');
 const retry=byId('auth-retry');
 retry.addEventListener('click',async()=>{retry.disabled=true;gate('Nouvelle vérification de votre session…','loading');try{const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session)await validate(data.session);else gate()}catch(e){gate(e.message||'Vérification impossible. Réessayez.','retry')}finally{retry.disabled=false}});
 form.addEventListener('submit',async e=>{
  e.preventDefault();submit.disabled=true;msg('');
  try{
   if(recovery){if(pw.value.length<8)throw Error('Le mot de passe doit contenir au moins 8 caractères.');if(pw.value!==confirm.value)throw Error('Les deux mots de passe ne correspondent pas.');const {error}=await client.auth.updateUser({password:pw.value});if(error)throw error;recovery=false;wrap.hidden=true;email.parentElement.hidden=false;email.required=true;pw.value='';confirm.value='';await client.auth.signOut();submit.textContent='Se connecter';msg('Mot de passe mis à jour. Connectez-vous avec votre compte existant.',true);return}
   submit.textContent='Connexion…';const {data,error}=await client.auth.signInWithPassword({email:email.value.trim(),password:pw.value});if(error)throw Error('Connexion impossible. Vérifiez votre adresse e-mail et votre mot de passe.');await validate(data.session);
  }catch(e){msg(e.message||'Une erreur est survenue.')}finally{submit.disabled=false;if(!recovery)submit.textContent='Se connecter'}
 });
 forgot.addEventListener('click',async()=>{const v=email.value.trim();if(!v){msg('Saisissez d’abord l’adresse e-mail de votre compte.');return}try{const {error}=await client.auth.resetPasswordForEmail(v,{redirectTo:location.href.split('#')[0]});if(error)throw error;msg('Si cette adresse correspond à un compte, un lien de réinitialisation a été envoyé.',true)}catch(e){msg(e.message||'Impossible d’envoyer le lien.')}});
 client.auth.onAuthStateChange((event,session)=>{
  if(event==='PASSWORD_RECOVERY'){recovery=true;gate('Choisissez un nouveau mot de passe.');wrap.hidden=false;email.parentElement.hidden=true;email.required=false;pw.autocomplete='new-password';forgot.hidden=true;submit.textContent='Enregistrer le mot de passe'}
  else if(event==='SIGNED_OUT'){user=null;profile=null;gate()}
  else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='INITIAL_SESSION')setTimeout(()=>validate(session),0)
 });
}
async function start(){
 makeGate();gate('Préparation de votre espace sécurisé…','loading');
 try{await loadLib();client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});window.inspecteurBotAuthClient=client;setup();const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session)await validate(data.session);else gate();
 // La session est contrôlée à la connexion et lors des événements Supabase TOKEN_REFRESHED. Le serveur impose aussi son délai d'expiration.
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a');if(a&&(/logout/i.test(a.getAttribute('onclick')||'')||/déconnexion|logout/i.test(a.textContent||''))){e.preventDefault();e.stopImmediatePropagation();signOut()}},true);
 window.inspecteurBotSignOut=signOut;
 }catch(e){console.error(e);gate(e.message||'Service d’authentification indisponible.')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();