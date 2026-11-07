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
#ib-auth-chip{position:fixed;z-index:2147482000;top:8px;right:8px;display:flex;align-items:center;gap:8px;max-width:calc(100vw - 20px);padding:7px 10px;border:1px solid #cbd9e7;border-radius:12px;background:#fff;color:#173b5c;box-shadow:0 3px 14px #00152f22;font:12px Arial}
#ib-auth-chip button{border:1px solid #cbd9e7;border-radius:7px;background:#f5f9fc;padding:6px 8px;color:#173b5c;font-weight:700}
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
  user=session.user;profile=data;document.documentElement.classList.add('inspecteur-auth-ready');byId('auth-gate').hidden=true;
  let chip=byId('auth-chip');if(!chip){chip=document.createElement('div');chip.id='ib-auth-chip';document.body.appendChild(chip)}
  chip.replaceChildren();const name=document.createElement('span');name.textContent=(data.display_name||session.user.email||'Utilisateur')+' · '+(data.role==='super_admin'?'Administrateur':'Connecté');chip.appendChild(name);
  const out=document.createElement('button');out.type='button';out.textContent='Déconnexion';out.addEventListener('click',signOut);chip.appendChild(out);
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
 try{await loadLib();client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});setup();const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session)await validate(data.session);else gate();
 validation=setInterval(async()=>{if(user){const {data}=await client.auth.getSession();if(data.session)await validate(data.session)}},30000);
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a');if(a&&(/logout/i.test(a.getAttribute('onclick')||'')||/déconnexion|logout/i.test(a.textContent||''))){e.preventDefault();e.stopImmediatePropagation();signOut()}},true);
 window.inspecteurBotSignOut=signOut;
 }catch(e){console.error(e);gate(e.message||'Service d’authentification indisponible.')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();