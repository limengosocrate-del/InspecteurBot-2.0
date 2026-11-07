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
#ib-auth-card label{display:block;margin:14px 0 6px;font-weight:700;font-size:14px}
#ib-auth-card input{box-sizing:border-box;width:100%;padding:13px;border:1px solid #cbd5e1;border-radius:9px;font-size:16px}
#ib-auth-submit{width:100%;margin-top:18px;padding:13px;border:0;border-radius:9px;background:#07518a;color:white;font-size:16px;font-weight:700}
#ib-auth-message{min-height:22px;margin-top:12px;color:#b42318;font-size:14px}
#ib-auth-forgot{margin-top:12px;padding:0;border:0;background:transparent;color:#07518a;text-decoration:underline}

#ib-app-header{position:relative;z-index:1200;display:flex;align-items:center;justify-content:space-between;gap:14px;min-height:76px;padding:10px clamp(14px,4vw,42px);background:#fff;color:#173b5c;border-bottom:1px solid #e3ebf2;box-shadow:0 2px 12px #102e4a0a}
#ib-app-header .ib-brand{display:flex;align-items:center;gap:10px;min-width:0;font-weight:800;color:#073b70;letter-spacing:.2px}
#ib-app-header .ib-brand-mark{display:grid;place-items:center;width:42px;height:42px;flex:0 0 42px;border-radius:50%;background:#0799bd;color:#fff;font-size:19px}
#ib-app-header .ib-brand-copy{font-size:14px;line-height:1.25}
#ib-app-header .ib-brand-copy small{display:block;margin-top:3px;color:#71869a;font-size:9px;letter-spacing:1.1px;font-weight:700}
#ib-app-header .ib-header-actions{display:flex;align-items:center;gap:12px}
#ib-auth-chip{position:relative;z-index:1201;top:auto;right:auto;max-width:min(350px,calc(100vw - 120px));font:13px Arial,sans-serif}
#ib-auth-account{display:flex;align-items:center;gap:9px;max-width:100%;padding:7px 10px;border:1px solid #e0e8ef;border-radius:40px;background:#fff;color:#173b5c;box-shadow:0 2px 8px #00152f0d;font-weight:700;cursor:pointer}
#ib-auth-account .ib-avatar{display:grid;place-items:center;width:38px;height:38px;flex:0 0 38px;border-radius:50%;background:#0799bd;color:#fff;font-size:17px}
#ib-auth-account .ib-account-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:210px;font-size:12px}
#ib-auth-account>i:last-child{margin:0 5px;color:#36566e}
#ib-auth-menu{position:absolute;right:0;top:calc(100% + 9px);width:min(285px,calc(100vw - 24px));padding:8px;border:1px solid #dce7f1;border-radius:14px;background:#fff;box-shadow:0 15px 40px #00152f25}
#ib-auth-menu[hidden]{display:none!important}
#ib-auth-menu a,#ib-auth-menu button{display:flex;align-items:center;gap:10px;width:100%;padding:12px;border:0;border-radius:9px;background:transparent;color:#173b5c;text-decoration:none;text-align:left;font-weight:700;font-size:13px;cursor:pointer}
#ib-auth-menu a:hover,#ib-auth-menu button:hover{background:#edf5fb}
#ib-auth-menu button{color:#b42318}
#ib-header-menu{display:grid;place-items:center;width:46px;height:46px;flex:0 0 46px;border:0;border-radius:50%;background:#f1f5f8;color:#173b5c;font-size:23px;cursor:pointer}
#ib-header-menu:focus-visible,#ib-auth-account:focus-visible{outline:3px solid #0b9ac0;outline-offset:2px}
@media(max-width:520px){#ib-app-header{min-height:66px;padding:8px 12px;gap:7px}#ib-app-header .ib-brand{gap:7px}#ib-app-header .ib-brand-mark{width:36px;height:36px;flex-basis:36px;font-size:16px}#ib-app-header .ib-brand-copy{font-size:12px}#ib-app-header .ib-brand-copy small{font-size:8px}#ib-app-header .ib-header-actions{gap:7px}#ib-auth-chip{max-width:calc(100vw - 145px)}#ib-auth-account{gap:6px;padding:5px 7px}#ib-auth-account .ib-avatar{width:34px;height:34px;flex-basis:34px}#ib-auth-account .ib-account-label{max-width:120px;font-size:11px}#ib-header-menu{width:40px;height:40px;flex-basis:40px;font-size:20px}}
`;
document.head.appendChild(css);
function byId(id){return document.getElementById('ib-'+id)}
function msg(t,ok){const n=byId('auth-message');if(n){n.textContent=t||'';n.style.color=ok?'#138a65':'#b42318'}}
function gate(t){document.documentElement.classList.remove('inspecteur-auth-ready');makeGate();byId('auth-gate').hidden=false;if(t)msg(t)}
function makeGate(){
 if(byId('auth-gate'))return;
 const g=document.createElement('div');g.id='ib-auth-gate';
 g.innerHTML='<section id="ib-auth-card" role="dialog" aria-modal="true"><div style="text-align:center;font-size:34px">🔐</div><h2>InspecteurBot RDC</h2><p id="ib-auth-intro">Connectez-vous avec votre compte existant pour accéder à l’application.</p><form id="ib-auth-form"><label for="ib-auth-email">Adresse e-mail du compte</label><input id="ib-auth-email" type="email" autocomplete="username" required placeholder="Adresse e-mail enregistrée"><label for="ib-auth-password">Mot de passe</label><input id="ib-auth-password" type="password" autocomplete="current-password" required placeholder="Votre mot de passe"><div id="ib-auth-confirm-wrap" hidden><label for="ib-auth-confirm">Confirmer le nouveau mot de passe</label><input id="ib-auth-confirm" type="password" autocomplete="new-password"></div><button id="ib-auth-submit" type="submit">Se connecter</button></form><button id="ib-auth-forgot" type="button">Mot de passe oublié ?</button><div id="ib-auth-message" role="status" aria-live="polite"></div><p style="font-size:12px">Accès réservé aux comptes autorisés de l’Inspection Générale du Travail.</p></section>';
 document.body.appendChild(g);
}
async function loadLib(){
 if(window.supabase?.createClient)return;
 await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';s.onload=ok;s.onerror=()=>no(Error('Bibliothèque Supabase indisponible. Vérifiez votre connexion internet.'));document.head.appendChild(s)});
}
async function serverCheck(){
 const {data,error}=await client.functions.invoke('igt-session-start',{body:{}});
 if(error||!data?.success)throw Error(data?.message||error?.message||'Session refusée ou expirée.');
 const seconds=Number(data.expires_in_seconds)||0;if(seconds<=0)throw Error('Votre session de 20 minutes est terminée.');
 clearTimeout(expiry);expiry=setTimeout(signOut,seconds*1000);
}
async function validate(session){
 if(!session){user=null;profile=null;clearTimeout(expiry);gate();return}
 if(busy)return;busy=true;
 try{
  await serverCheck();
  const {data,error}=await client.from('profiles').select('display_name,role,is_active').eq('id',session.user.id).maybeSingle();
  if(error)throw error;if(!data||data.is_active!==true)throw Error('Ce compte est suspendu ou ne dispose pas d’un profil actif. Contactez l’administrateur.');
  user=session.user;profile=data;document.documentElement.classList.add('inspecteur-auth-ready');byId('auth-gate').hidden=true;window.inspecteurBotAuthUser=user;window.dispatchEvent(new CustomEvent('inspecteurbot:authenticated',{detail:{client,user,profile}}));
  let chip=byId('auth-chip');
  if(!chip){
   const appHeader=document.createElement('header');appHeader.id='ib-app-header';
   appHeader.innerHTML='<div class="ib-brand"><span class="ib-brand-mark"><i class="fa-solid fa-landmark"></i></span><span class="ib-brand-copy">InspecteurBot RDC<small>INSPECTION GÉNÉRALE DU TRAVAIL</small></span></div><div class="ib-header-actions"><div id="ib-auth-slot"></div><button type="button" id="ib-header-menu" aria-label="Ouvrir le menu du compte" aria-expanded="false"><i class="fa-solid fa-bars"></i></button></div>';
   document.body.insertBefore(appHeader,document.body.firstChild);
   chip=document.createElement('div');chip.id='ib-auth-chip';
   chip.innerHTML='<button type="button" id="ib-auth-account" aria-expanded="false" aria-controls="ib-auth-menu"><span class="ib-avatar"><i class="fa-solid fa-user"></i></span><span class="ib-account-label"></span><i class="fa-solid fa-chevron-down"></i></button><div id="ib-auth-menu" hidden><a id="ib-auth-profile-link" href="https://limengosocrate-del.github.io/InspecteurBot-2.0/profil.html"><i class="fa-solid fa-id-card"></i> Mon profil et mes informations</a><button type="button" id="ib-auth-logout"><i class="fa-solid fa-right-from-bracket"></i> Déconnexion</button></div>';
   appHeader.querySelector('#ib-auth-slot').appendChild(chip);
   const toggle=chip.querySelector('#ib-auth-account'),menu=chip.querySelector('#ib-auth-menu'),hamb=appHeader.querySelector('#ib-header-menu');
   function setMenu(open){menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));hamb.setAttribute('aria-expanded',String(open));hamb.innerHTML=open?'<i class="fa-solid fa-xmark"></i>':'<i class="fa-solid fa-bars"></i>'}
   toggle.addEventListener('click',()=>setMenu(menu.hidden));
   hamb.addEventListener('click',()=>setMenu(menu.hidden));
   chip.querySelector('#ib-auth-logout').addEventListener('click',signOut);
   document.addEventListener('click',e=>{if(!chip.contains(e.target)&&!hamb.contains(e.target))setMenu(false)});
  }
  const label=chip.querySelector('.ib-account-label');
  label.textContent=(data.display_name||session.user.email||'Utilisateur')+' · '+(data.role==='super_admin'?'Administrateur':data.role==='admin'?'Administrateur':'Connecté');
 }catch(e){console.warn('Authentification InspecteurBot',e);await client.auth.signOut().catch(()=>{});user=null;profile=null;gate(e.message||'Connexion requise.')}
 finally{busy=false}
}
async function signOut(){clearTimeout(expiry);clearInterval(validation);if(client)await client.auth.signOut().catch(()=>{});user=null;profile=null;gate('Vous êtes déconnecté.')}
function setup(){
 const form=byId('auth-form'),email=byId('auth-email'),pw=byId('auth-password'),confirm=byId('auth-confirm'),wrap=byId('auth-confirm-wrap'),submit=byId('auth-submit'),forgot=byId('auth-forgot');
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
 makeGate();gate('Vérification de votre session…');
 try{await loadLib();client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});window.inspecteurBotAuthClient=client;setup();const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session)await validate(data.session);else gate();
 // La session est contrôlée à la connexion et lors des événements Supabase TOKEN_REFRESHED. Le serveur impose aussi son délai d'expiration.
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a');if(a&&(/logout/i.test(a.getAttribute('onclick')||'')||/déconnexion|logout/i.test(a.textContent||''))){e.preventDefault();e.stopImmediatePropagation();signOut()}},true);
 window.inspecteurBotSignOut=signOut;
 }catch(e){console.error(e);gate(e.message||'Service d’authentification indisponible.')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();