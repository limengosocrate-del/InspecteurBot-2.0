/* InspecteurBot — garde d'accès Supabase. Comptes existants uniquement. */
(function () {
'use strict';
if (window.__inspecteurBotAuthLoaded) return;
window.__inspecteurBotAuthLoaded = true;
const URL='https://icymfsvbuandgvrhwmaw.supabase.co';
const KEY='sb_publishable_ehMQbO5ac2-9RSdiOmxKJw_yPw2ES7z';
let client=null,user=null,profile=null,busy=false,expiry=null,validation=null,recovery=false,sessionDeadline=0,presenceTimer=null;
const css=document.createElement('style');
css.textContent=`\nhtml,body{max-width:100%;overflow-x:hidden;overscroll-behavior:contain}\nbody{position:relative}\nimg,video,canvas,iframe{max-width:100%}\n
html:not(.inspecteur-auth-ready) body>*:not(#ib-auth-gate):not(#ib-startup-splash){visibility:hidden!important}\n#ib-auth-gate[data-loading="true"]{visibility:hidden!important}\n#ib-startup-splash{position:fixed;inset:0;z-index:2147482999;display:flex;visibility:visible!important;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:24px;background:radial-gradient(circle at 50% 35%,#123f70 0%,#071b34 58%,#031126 100%);color:#fff;text-align:center;font-family:Arial,sans-serif;opacity:1;transition:opacity .22s ease}\n#ib-startup-splash .ib-splash-title{font-size:clamp(32px,8vw,48px);font-weight:800;letter-spacing:.3px}\n#ib-startup-splash .ib-splash-subtitle{font-size:clamp(15px,4vw,19px);color:#d8eaff}\n#ib-startup-splash .ib-splash-spinner{width:30px;height:30px;margin-top:16px;border:3px solid #ffffff40;border-top-color:#ffd700;border-radius:50%;animation:ib-spin .8s linear infinite}\n#ib-startup-splash.ib-splash-hide{opacity:0;pointer-events:none}
#ib-auth-gate{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background-image:linear-gradient(135deg,#061a30 0%,#0b2d4d 55%,#071b34 100%);background-size:cover;background-position:center;background-repeat:no-repeat;font-family:Arial,sans-serif;visibility:visible!important}
#ib-auth-gate[hidden]{display:none!important}
#ib-auth-card{box-sizing:border-box;width:min(430px,100%);padding:30px 26px;border-radius:18px;background:rgba(255,255,255,.84);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.58);color:#18314d;box-shadow:0 20px 65px #00152f80}
#ib-auth-card h2{margin:0 0 8px;color:#073b70;text-align:center}
#ib-auth-card p{color:#586b80;line-height:1.5;text-align:center}
#ib-auth-loading{width:30px;height:30px;margin:18px auto;border:3px solid #dce8f2;border-top-color:#087eb5;border-radius:50%;animation:ib-spin .8s linear infinite}
@keyframes ib-spin{to{transform:rotate(360deg)}}
#ib-auth-card label{display:block;margin:14px 0 6px;font-weight:700;font-size:14px}
#ib-auth-card input{box-sizing:border-box;width:100%;padding:13px;border:1px solid #cbd5e1;border-radius:9px;font-size:16px}
#ib-auth-submit{width:100%;margin-top:18px;padding:13px;border:0;border-radius:9px;background:#07518a;color:white;font-size:16px;font-weight:700}
#ib-auth-message{min-height:22px;margin-top:12px;color:#b42318;font-size:14px}#ib-auth-loading:not([hidden]){display:flex!important;align-items:center;justify-content:center;gap:11px;margin:22px auto 8px;color:#07518a;font-size:14px;font-weight:700}#ib-auth-loading:before{content:'';width:24px;height:24px;border:3px solid #d9e8f2;border-top-color:#0786b3;border-radius:50%;animation:ibAuthSpin .75s linear infinite}@keyframes ibAuthSpin{to{transform:rotate(360deg)}}
#ib-auth-forgot{margin-top:12px;padding:0;border:0;background:transparent;color:#07518a;text-decoration:underline}#ib-auth-register-open{width:100%;margin-top:10px;padding:12px;border:1px solid #0d4772;border-radius:9px;background:rgba(255,255,255,.8);color:#0d4772;font-weight:700;font-size:14px}#ib-auth-register-panel[hidden]{display:none!important}#ib-auth-register-panel{position:absolute;inset:0;z-index:5;overflow:auto;padding:16px;background:rgba(6,26,48,.58);-webkit-backdrop-filter:blur(4px)}#ib-auth-register-form{box-sizing:border-box;width:min(480px,100%);margin:18px auto;padding:24px;border:1px solid rgba(255,255,255,.65);border-radius:18px;background:rgba(255,255,255,.86);-webkit-color:#172334;box-shadow:0 20px 70px #0006}#ib-auth-register-form label{display:block;margin:12px 0 5px;font-weight:700;font-size:14px;color:#193b59}#ib-auth-register-form input,#ib-auth-register-form select{box-sizing:border-box;width:100%;padding:12px;border:1px solid #ccd4df;border-radius:9px;font-size:16px;background:#fff}#ib-auth-register-submit,#ib-auth-register-close{width:100%;margin-top:12px;padding:13px;border:0;border-radius:9px;font-weight:700;font-size:15px}#ib-auth-register-submit{background:#0d4772;color:#fff}#ib-auth-register-close{border:1px solid #ccd4df;background:#fff;color:#334155}#ib-auth-register-message{margin-top:12px;min-height:22px;font-size:14px}

#ib-app-header{position:relative;z-index:1200;display:flex;align-items:center;gap:14px;min-height:88px;padding:10px clamp(14px,4vw,42px);background:#fff;color:#173b5c;border-bottom:1px solid #e3ebf2;box-shadow:0 2px 12px #102e4a0a}
#ib-app-header .ib-brand{display:flex;align-items:center;gap:10px;min-width:0;flex:1;font-weight:800;color:#073b70;letter-spacing:.2px}
#ib-app-header .ib-brand-mark{display:grid;place-items:center;width:42px;height:42px;flex:0 0 42px;border-radius:50%;background:#0799bd;color:#fff;font-size:19px}
#ib-header-messages{display:grid;place-items:center;width:42px;height:46px;color:#0866ff;text-decoration:none;font-size:29px;flex:0 0 42px}#ib-header-messages:focus-visible{outline:3px solid #0b9ac0;outline-offset:2px;border-radius:10px}@media(max-width:520px){#ib-header-messages{width:38px;height:40px;flex-basis:38px;font-size:27px}}
.ib-header-action{position:relative;display:grid;place-items:center;flex:0 0 42px;height:46px;color:#0866ff;text-decoration:none;font-size:28px}
.ib-header-action:focus-visible{outline:3px solid #0b9ac0;outline-offset:2px;border-radius:10px}
.ib-header-action .ib-header-count[hidden]{display:none!important}
.ib-header-action .ib-header-count{position:absolute;top:0;right:-2px;display:grid;place-items:center;min-width:19px;height:19px;padding:0 5px;border:2px solid #fff;border-radius:30px;background:#dc2638;color:#fff;font:700 10px Arial,sans-serif}
#ib-header-presence{color:#16834b}
#ib-header-messages{color:#0866ff}
@media(max-width:520px){.ib-header-action{flex-basis:38px;height:40px;font-size:24px}.ib-header-action .ib-header-count{min-width:17px;height:17px;font-size:9px}}

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

#ib-auth-gate{background-color:#071b34!important}
#ib-auth-card{width:min(440px,100%);max-height:calc(100dvh - 24px);overflow:auto}
#ib-auth-register-panel{background:rgba(6,26,48,.92)!important}
#ib-auth-register-form{background:#f7fafc!important}
#ib-auth-gate .ib-password-wrap{position:relative;display:block;width:100%;min-width:0}
#ib-auth-gate .ib-password-wrap>input{width:100%;padding-right:54px!important}
#ib-auth-gate .ib-password-toggle{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:38px;height:38px;display:grid;place-items:center;border:0;border-radius:8px;background:transparent;color:#173b5c;font-size:21px;line-height:1;cursor:pointer;z-index:2}
#ib-auth-gate .ib-password-toggle:focus-visible{outline:2px solid #087eb5;outline-offset:1px}
@media(max-width:520px){#ib-auth-gate{padding:12px}#ib-auth-card{padding:20px!important;max-height:calc(100dvh - 24px)}#ib-auth-register-panel{padding:10px}#ib-auth-register-form{margin:8px auto;padding:18px}}
`;
document.head.appendChild(css);
if(!document.getElementById('ib-startup-splash')){
 const splash=document.createElement('div');splash.id='ib-startup-splash';splash.setAttribute('role','status');splash.setAttribute('aria-live','polite');
 splash.innerHTML='<div class="ib-splash-title">InspecteurBot</div><div class="ib-splash-subtitle">Votre assistant numérique</div><div class="ib-splash-spinner" aria-hidden="true"></div>';
 document.body.appendChild(splash);
}
function byId(id){return document.getElementById('ib-'+id)}
function hideSplash(){const splash=document.getElementById('ib-startup-splash');if(!splash)return;splash.classList.add('ib-splash-hide');setTimeout(()=>splash.remove(),260)}
function armSessionExpiry(payload){
 clearTimeout(expiry);expiry=null;
 // Pas de durée de session personnalisée : déconnexion ou révocation uniquement.
 sessionDeadline=Number.POSITIVE_INFINITY;
}
function readSessionId(token){
 try{const part=String(token||'').split('.')[1];if(!part)return null;const base64=part.replace(/-/g,'+').replace(/_/g,'/');const payload=JSON.parse(atob(base64.padEnd(Math.ceil(base64.length/4)*4,'=')));return typeof payload.session_id==='string'?payload.session_id:null}catch(_){return null}
}
async function updatePresence(){
 if(!client||!user||!sessionDeadline||Date.now()>=sessionDeadline)return;
 const now=new Date().toISOString();
 const {error}=await client.from('user_presence').upsert({user_id:user.id,last_seen:now,updated_at:now},{onConflict:'user_id'});
 if(error)console.warn('Mise à jour de présence indisponible',error);
}
function startPresenceTracking(){
 clearInterval(presenceTimer);
 void updatePresence();
 presenceTimer=setInterval(()=>{if(document.visibilityState==='visible')void updatePresence()},45000);
}
function stopPresenceTracking(){clearInterval(presenceTimer);presenceTimer=null}

// Notifications instantanées des messages envoyés par l'administration.
// Le contrôle est global : il fonctionne quel que soit le menu actuellement ouvert.
const IB_ADMIN_ID='ed2f76c7-4867-4689-8500-b45d6e9b14b2';
let adminMessagePoll=null,adminMessageCursor=null,adminMessageToastTimer=null,adminMessageBusy=false;
function adminMessageCursorKey(){return user?.id?'inspecteurbot_admin_message_cursor_v1_'+user.id:null}
function hideAdminMessageToast(){clearTimeout(adminMessageToastTimer);adminMessageToastTimer=null;document.getElementById('ib-admin-message-toast')?.remove()}
function ensureAdminMessageToastStyle(){
 if(document.getElementById('ib-admin-message-toast-style'))return;
 const style=document.createElement('style');style.id='ib-admin-message-toast-style';
 style.textContent=`#ib-admin-message-toast{position:fixed;top:max(12px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2147483647;width:min(460px,calc(100% - 24px));padding:16px;border:1px solid #d7e4ef;border-radius:16px;background:#fff;color:#173b5c;box-shadow:0 14px 42px #00152f40;font:14px/1.45 Arial,sans-serif;animation:ib-admin-toast-in .2s ease-out}#ib-admin-message-toast .ib-toast-title{display:flex;align-items:center;gap:9px;margin:0 0 7px;font-size:15px;font-weight:800;color:#073b70}#ib-admin-message-toast .ib-toast-title i{color:#0786b3}#ib-admin-message-toast .ib-toast-preview{margin:0 0 12px;color:#52677a;overflow-wrap:anywhere}#ib-admin-message-toast .ib-toast-actions{display:flex;gap:9px}#ib-admin-message-toast button{min-height:38px;padding:8px 14px;border:0;border-radius:9px;font-weight:700;font-size:13px;cursor:pointer}#ib-admin-message-toast .ib-toast-reply{background:#07518a;color:#fff;flex:1}#ib-admin-message-toast .ib-toast-ignore{background:#edf2f6;color:#36566e}#ib-admin-message-toast textarea{display:block;width:100%;min-height:76px;margin:10px 0;padding:10px;border:1px solid #cbd8e3;border-radius:9px;resize:vertical;font:14px/1.4 Arial,sans-serif;color:#18314d}#ib-admin-message-toast .ib-toast-send{width:100%;background:#138a65;color:#fff}#ib-admin-message-toast .ib-toast-status{min-height:17px;margin-top:7px;color:#b42318;font-size:12px}#ib-admin-message-toast button:disabled{opacity:.6;cursor:wait}@keyframes ib-admin-toast-in{from{opacity:0;transform:translate(-50%,-8px)}to{opacity:1;transform:translate(-50%,0)}}@media(prefers-reduced-motion:reduce){#ib-admin-message-toast{animation:none}}`;
 document.head.appendChild(style);
}
async function markAdminMessageRead(messageId){
 if(!client||!user||!messageId)return;
 const {error}=await client.from('messages').update({read_at:new Date().toISOString()}).eq('id',messageId).eq('recipient_id',user.id);
 if(error)console.warn('Marquage du message administratif indisponible',error);
}
function showAdminMessageToast(message){
 ensureAdminMessageToastStyle();hideAdminMessageToast();
 const toast=document.createElement('section');toast.id='ib-admin-message-toast';toast.setAttribute('role','alert');toast.setAttribute('aria-live','assertive');
 const title=document.createElement('div');title.className='ib-toast-title';
 const icon=document.createElement('i');icon.className='fa-solid fa-envelope';icon.setAttribute('aria-hidden','true');
 const titleText=document.createElement('span');titleText.textContent='L’administration vous a envoyé un message';
 title.append(icon,titleText);
 const preview=document.createElement('p');preview.className='ib-toast-preview';preview.textContent=String(message.content||'Vous avez reçu un nouveau message.').slice(0,180);
 const actions=document.createElement('div');actions.className='ib-toast-actions';
 const reply=document.createElement('button');reply.type='button';reply.className='ib-toast-reply';reply.textContent='Répondre';
 const ignore=document.createElement('button');ignore.type='button';ignore.className='ib-toast-ignore';ignore.textContent='Ignorer';
 actions.append(reply,ignore);toast.append(title,preview,actions);document.body.appendChild(toast);
 ignore.addEventListener('click',()=>{void markAdminMessageRead(message.id);hideAdminMessageToast();void refreshNotificationBadge()});
 reply.addEventListener('click',()=>{
  clearTimeout(adminMessageToastTimer);adminMessageToastTimer=null;
  preview.textContent='Votre réponse sera envoyée directement à l’administration.';
  const area=document.createElement('textarea');area.maxLength=2500;area.placeholder='Écrivez votre réponse…';area.setAttribute('aria-label','Votre réponse à l’administration');
  const send=document.createElement('button');send.type='button';send.className='ib-toast-send';send.textContent='Envoyer la réponse';
  const status=document.createElement('div');status.className='ib-toast-status';status.setAttribute('aria-live','polite');
  actions.replaceChildren();toast.append(area,send,status);area.focus();
  send.addEventListener('click',async()=>{
   const content=area.value.trim();if(!content){status.textContent='Écrivez votre réponse avant de l’envoyer.';return}
   send.disabled=true;status.style.color='#52677a';status.textContent='Envoi en cours…';
   try{
    const {error}=await client.from('messages').insert({sender_id:user.id,recipient_id:IB_ADMIN_ID,content});
    if(error)throw error;
    await markAdminMessageRead(message.id);status.style.color='#138a65';status.textContent='Votre réponse a été envoyée à l’administration.';
    await refreshNotificationBadge();window.setTimeout(hideAdminMessageToast,900);
   }catch(e){status.style.color='#b42318';status.textContent='Envoi impossible : '+(e.message||'réessayez.');send.disabled=false}
  });
 });
 adminMessageToastTimer=window.setTimeout(hideAdminMessageToast,4000);
}
async function pollAdminMessages(){
 if(adminMessageBusy||!client||!user||document.visibilityState==='hidden')return;
 adminMessageBusy=true;
 try{
  const key=adminMessageCursorKey();
  if(adminMessageCursor===null){
   let stored=null;try{stored=localStorage.getItem(key)}catch(_){}
   if(stored!==null&&/^\d+$/.test(stored))adminMessageCursor=Number(stored);
   else{
    const [latest,unread]=await Promise.all([
     client.from('messages').select('id').eq('sender_id',IB_ADMIN_ID).eq('recipient_id',user.id).order('id',{ascending:false}).limit(1),
     client.from('messages').select('id,sender_id,recipient_id,content,created_at').eq('sender_id',IB_ADMIN_ID).eq('recipient_id',user.id).is('read_at',null).order('id',{ascending:false}).limit(1)
    ]);
    if(latest.error)throw latest.error;if(unread.error)throw unread.error;
    adminMessageCursor=Number(latest.data?.[0]?.id||0);
    if(unread.data?.[0])showAdminMessageToast(unread.data[0]);
    try{localStorage.setItem(key,String(adminMessageCursor))}catch(_){}
    return;
   }
  }
  const {data,error}=await client.from('messages').select('id,sender_id,recipient_id,content,created_at').eq('sender_id',IB_ADMIN_ID).eq('recipient_id',user.id).gt('id',adminMessageCursor).order('id',{ascending:true}).limit(20);
  if(error)throw error;
  for(const message of data||[]){adminMessageCursor=Math.max(adminMessageCursor,Number(message.id));showAdminMessageToast(message)}
  try{localStorage.setItem(key,String(adminMessageCursor))}catch(_){}
 }catch(e){console.warn('Surveillance des messages administratifs indisponible',e)}
 finally{adminMessageBusy=false}
}
function startAdminMessageNotifications(){
 clearInterval(adminMessagePoll);adminMessageCursor=null;
 void pollAdminMessages();
 adminMessagePoll=setInterval(()=>void pollAdminMessages(),20000);
}
function stopAdminMessageNotifications(){
 clearInterval(adminMessagePoll);adminMessagePoll=null;adminMessageCursor=null;hideAdminMessageToast();
}
async function expireSession(){
 clearTimeout(expiry);expiry=null;sessionDeadline=0;stopPresenceTracking();stopAdminMessageNotifications();stopHeaderBadgeTracking();
 try{if(client)await client.auth.signOut({scope:'local'})}catch(_){}
 user=null;profile=null;window.inspecteurBotAuthUser=null;window.inspecteurBotAuthProfile=null;
 gate('Votre session a été interrompue. Veuillez vous reconnecter.');
}
let headerBadgeTimer=null,headerBadgeChannel=null,headerBadgeBusy=false;
async function refreshHeaderBadges(){
 if(headerBadgeBusy||!client||!user)return;
 const presence=document.querySelector('#ib-header-presence .ib-header-count');
 const messages=document.querySelector('#ib-header-messages .ib-header-count');
 const notifications=document.querySelector('#ib-notification-link .ib-notification-count');
 if(!presence&&!messages&&!notifications)return;
 headerBadgeBusy=true;
 try{
  const tasks=await Promise.allSettled([
   client.rpc('get_agent_directory',{search_text:'',online_only:true}),
   client.from('messages').select('id',{count:'exact',head:true}).eq('recipient_id',user.id).is('read_at',null),
   client.from('announcements').select('id,created_by').or('target_user_id.is.null,target_user_id.eq.'+user.id).limit(200),
   client.from('announcement_reads').select('announcement_id').eq('user_id',user.id).limit(500),
   client.from('training_resources').select('id,created_by').eq('published',true).limit(200)
  ]);
  const val=i=>tasks[i].status==='fulfilled'?tasks[i].value:null;
  if(presence){const r=val(0);if(r&&!r.error){const n=Array.isArray(r.data)?r.data.filter(p=>p.id!==user.id).length:0;presence.textContent=n>99?'99+':String(n);presence.hidden=n===0;presence.parentElement.title=n+' agent(s) en ligne';}}
  if(messages){const r=val(1);if(r&&!r.error){const n=r.count||0;messages.textContent=n>99?'99+':String(n);messages.hidden=n===0;messages.parentElement.setAttribute('aria-label',n+' message(s) non lu(s)');}}
  if(notifications){
   const a=val(2),rr=val(3),tr=val(4);
   if(a&&!a.error&&rr&&!rr.error&&tr&&!tr.error){
    const readAnnouncements=new Set((rr.data||[]).map(x=>String(x.announcement_id)));
    const unreadAnnouncements=(a.data||[]).filter(x=>x.created_by!==user.id&&!readAnnouncements.has(String(x.id))).length;
    let readTraining=[];try{readTraining=JSON.parse(localStorage.getItem('inspecteurbot_training_reads_v1_'+user.id)||'[]')}catch(_){}
    const readTrainingSet=new Set(readTraining.map(String));
    const unreadTraining=(tr.data||[]).filter(x=>x.created_by!==user.id&&!readTrainingSet.has(String(x.id))).length;
    const n=unreadAnnouncements+unreadTraining;
    notifications.textContent=n>99?'99+':String(n);notifications.hidden=n===0;
    notifications.parentElement.setAttribute('aria-label',n+' annonce(s) ou formation(s) non lue(s)');
    notifications.parentElement.title=unreadAnnouncements+' annonce(s) et '+unreadTraining+' formation(s) non lue(s)';
   }
  }
 }catch(e){console.warn('Actualisation des compteurs indisponible',e)}
 finally{headerBadgeBusy=false}
}
function startHeaderBadgeTracking(){
 clearInterval(headerBadgeTimer);void refreshHeaderBadges();
 headerBadgeTimer=setInterval(()=>{if(document.visibilityState==='visible')void refreshHeaderBadges()},20000);
 if(headerBadgeChannel){try{client.removeChannel(headerBadgeChannel)}catch(_){}}
 try{
  headerBadgeChannel=client.channel('ib-header-badges-'+user.id)
   .on('postgres_changes',{event:'*',schema:'public',table:'messages',filter:'recipient_id=eq.'+user.id},()=>void refreshHeaderBadges())
   .on('postgres_changes',{event:'*',schema:'public',table:'announcements'},()=>void refreshHeaderBadges())
   .on('postgres_changes',{event:'*',schema:'public',table:'training_resources'},()=>void refreshHeaderBadges())
   .on('postgres_changes',{event:'*',schema:'public',table:'user_presence'},()=>void refreshHeaderBadges())
   .subscribe();
 }catch(e){console.warn('Compteurs temps réel non disponibles',e)}
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void refreshHeaderBadges()});
}
async function refreshNotificationBadge(){return refreshHeaderBadges();}
function stopHeaderBadgeTracking(){
 clearInterval(headerBadgeTimer);headerBadgeTimer=null;
 if(headerBadgeChannel){try{client?.removeChannel(headerBadgeChannel)}catch(_){}headerBadgeChannel=null;}
}
function msg(t,ok){const n=byId('auth-message');if(!n)return;n.textContent=t||'';n.classList.remove('ib-message-success','ib-message-error');n.style.cssText='';if(!t)return;n.classList.add(ok?'ib-message-success':'ib-message-error');if(ok){n.style.cssText='display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;color:#000!important;-webkit-text-fill-color:#000!important;background:#fff!important;border:2px solid #000!important;border-left:6px solid #000!important;border-radius:10px!important;padding:14px 16px!important;margin:14px 0!important;font-size:15px!important;font-weight:800!important;line-height:1.65!important;text-align:left!important;white-space:normal!important;overflow-wrap:anywhere!important;box-shadow:0 4px 16px rgba(0,0,0,.18)!important'}else{n.style.cssText='display:block!important;color:#b42318!important;font-weight:700!important'}}
function showDuplicateAccountToast(){const old=document.getElementById('ib-register-toast');if(old)old.remove();const toast=document.createElement('div');toast.id='ib-register-toast';toast.setAttribute('role','status');toast.setAttribute('aria-live','polite');toast.textContent='Vous avez déjà un compte InspecteurBot / Annuaire numérique IGT. Veuillez vous connecter avec votre adresse e-mail et votre mot de passe habituels.';document.body.appendChild(toast);window.setTimeout(()=>{if(toast.isConnected)toast.remove()},3000)}
function gate(t,mode){
 document.documentElement.classList.remove('inspecteur-auth-ready');makeGate();
 const g=byId('auth-gate'),form=byId('auth-form'),forgot=byId('auth-forgot'),retry=byId('auth-retry'),intro=byId('auth-intro');
 g.hidden=false;g.dataset.loading=mode==='loading'?'true':'false';if(mode!=='loading')hideSplash();form.hidden=mode==='loading'||mode==='retry';forgot.hidden=mode==='loading'||mode==='retry';retry.hidden=mode!=='retry';byId('auth-loading').hidden=mode!=='loading';byId('auth-message').style.color=mode==='loading'?'#07518a':'#b42318';
 intro.textContent=mode==='loading'?'Préparation de votre espace sécurisé…':'Connectez-vous avec votre compte existant pour accéder à l’application.';
 if(t&&mode!=='loading')msg(t,mode==='loading');const regOpen=byId('auth-register-open');if(regOpen)regOpen.hidden=mode==='loading'||mode==='retry';
}
function makeGate(){
 if(byId('auth-gate'))return;
 const g=document.createElement('div');g.id='ib-auth-gate';
 g.innerHTML='<section id="ib-auth-card" role="dialog" aria-modal="true"><h2>InspecteurBot</h2><p style="margin:0 0 14px;color:#087eb5;font-weight:700;font-size:13px">Assistant numérique pour les agents de l’IGT</p><p id="ib-auth-intro">Connectez-vous avec votre compte existant pour accéder à l’application.</p><div id="ib-auth-loading" hidden role="status" aria-label="Chargement"></div><form id="ib-auth-form"><label for="ib-auth-email">Adresse e-mail du compte</label><input id="ib-auth-email" type="email" autocomplete="username" required placeholder="Adresse e-mail enregistrée"><label for="ib-auth-password">Mot de passe</label><input id="ib-auth-password" type="password" autocomplete="current-password" required placeholder="Votre mot de passe"><div id="ib-auth-confirm-wrap" hidden><label for="ib-auth-confirm">Confirmer le nouveau mot de passe</label><input id="ib-auth-confirm" type="password" autocomplete="new-password"></div><button id="ib-auth-submit" type="submit">Se connecter</button></form><button id="ib-auth-forgot" type="button">Mot de passe oublié ?</button><button id="ib-auth-retry" type="button" hidden style="width:100%;margin-top:16px;padding:13px;border:0;border-radius:9px;background:#07518a;color:#fff;font-weight:700">Réessayer</button><div id="ib-auth-message" role="status" aria-live="polite"></div><p style="font-size:12px">Accès réservé aux agents autorisés de l’Inspection Générale du Travail.</p><button id="ib-auth-register-open" type="button">Créer un compte agent</button></section><div id="ib-auth-register-panel" hidden><form id="ib-auth-register-form" role="dialog" aria-modal="true"><h2 style="margin:0;color:#0b3762">Créer un compte agent</h2><p style="margin:6px 0 14px">Inscription vérifiée à partir du registre officiel de l’IGT.</p><div id="ib-auth-register-help" role="note" style="display:block!important;visibility:visible!important;opacity:1!important;position:relative!important;color:#000!important;-webkit-text-fill-color:#000!important;background:#fff!important;border:2px solid #000!important;border-left:6px solid #000!important;border-radius:10px!important;padding:14px 16px!important;margin:12px 0 18px!important;font-size:15px!important;font-weight:800!important;line-height:1.6!important;text-align:left!important;box-shadow:0 4px 16px rgba(0,0,0,.18)!important"><strong style="display:block!important;margin:0 0 7px!important;color:#000!important;-webkit-text-fill-color:#000!important;font-weight:900!important">Vous avez déjà un compte sur l’Annuaire numérique IGT ?</strong><span style="display:block!important;color:#000!important;-webkit-text-fill-color:#000!important">Ne créez pas un nouveau compte. Revenez à la page de connexion et utilisez la même adresse e-mail et le même mot de passe que ceux de votre compte existant.</span></div><label for="ib-auth-register-name">Nom complet</label><input id="ib-auth-register-name" required maxlength="180" autocomplete="name"><label for="ib-auth-register-category">Catégorie</label><select id="ib-auth-register-category" required><option value="">Sélectionner votre catégorie</option><option value="inspecteur">Inspecteur du travail</option><option value="controleur">Contrôleur du travail</option><option value="agent_administratif">Agent administratif</option></select><label for="ib-auth-register-matricule">Numéro matricule officiel</label><input id="ib-auth-register-matricule" required maxlength="80"><label for="ib-auth-register-phone">Numéro de téléphone</label><input id="ib-auth-register-phone" type="tel" required maxlength="30" autocomplete="tel"><label for="ib-auth-register-address">Adresse physique complète</label><input id="ib-auth-register-address" required maxlength="240" autocomplete="street-address"><label for="ib-auth-register-email">Adresse e-mail personnelle</label><input id="ib-auth-register-email" type="email" required maxlength="254" autocomplete="email"><label for="ib-auth-register-password">Mot de passe (8 caractères minimum)</label><input id="ib-auth-register-password" type="password" required minlength="8" autocomplete="new-password"><label for="ib-auth-register-password2">Confirmer le mot de passe</label><input id="ib-auth-register-password2" type="password" required minlength="8" autocomplete="new-password"><div style="position:absolute;left:-10000px" aria-hidden="true"><label for="ib-auth-register-website">Ne pas remplir</label><input id="ib-auth-register-website" tabindex="-1" autocomplete="off"></div><div id="ib-auth-register-message" role="status" aria-live="polite"></div><button id="ib-auth-register-submit" type="submit">Créer mon compte</button><button id="ib-auth-register-close" type="button">Retour à la connexion</button></form></div>';
 document.body.appendChild(g);
}
async function loadLib(){
 if(window.supabase?.createClient)return;
 if(!document.querySelector('link[data-ib-supabase-preconnect]')){const p=document.createElement('link');p.rel='preconnect';p.href='https://cdn.jsdelivr.net';p.crossOrigin='anonymous';p.dataset.ibSupabasePreconnect='1';document.head.appendChild(p)}
 await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js';s.async=true;s.crossOrigin='anonymous';s.onload=ok;s.onerror=()=>no(Error('Vous êtes déconnecté. Vérifiez votre connexion internet.'));document.head.appendChild(s)});
}
async function serverCheck(session){
 const sessionId=readSessionId(session?.access_token);
 const cacheKey=session?.user?.id?'inspecteurbot_server_check_v1_'+session.user.id:null;
 if(cacheKey&&sessionId){try{const cached=JSON.parse(sessionStorage.getItem(cacheKey)||'null');if(cached&&cached.session_id===sessionId&&cached.profile?.is_active===true&&Date.now()-cached.validated_at<600000){armSessionExpiry(cached);return {success:true,profile:cached.profile,cached:true}}}catch(_){}}
 for(let attempt=0;attempt<2;attempt++){
  const {data,error}=await client.functions.invoke('igt-session-start',{body:{}});
  let payload=data||null;
  if(error&&error.context&&typeof error.context.clone==='function'){try{payload=await error.context.clone().json()}catch(_){}}
  if(!error&&payload?.success){
   if(cacheKey&&sessionId&&payload.profile){try{sessionStorage.setItem(cacheKey,JSON.stringify({session_id:sessionId,validated_at:Date.now(),profile:payload.profile}))}catch(_){}}
   armSessionExpiry(payload);
   return payload;
  }
  const code=payload?.code||'';
  if(code==='SESSION_ALREADY_INITIALIZED'&&attempt===0){await new Promise(resolve=>setTimeout(resolve,150));continue}
  const fatal=['LOGIN_REQUIRED','INVALID_SESSION','INVALID_SESSION_ID','SESSION_REVOKED','PROFILE_INACTIVE','ACCOUNT_SUSPENDED','ROLE_NOT_ALLOWED'].includes(code);
  const err=new Error(payload?.message||error?.message||'Vérification de sécurité momentanément indisponible.');err.authFatal=fatal;err.authTransient=!fatal;throw err;
 }
 throw Object.assign(new Error('Vérification de sécurité momentanément indisponible.'),{authTransient:true});
}
async function validate(session){
 if(!session){user=null;profile=null;clearTimeout(expiry);sessionDeadline=0;stopPresenceTracking();stopAdminMessageNotifications();stopHeaderBadgeTracking();gate();return}
 if(busy)return;busy=true;
 try{
  const cacheKey='inspecteurbot_profile_cache_v2_'+session.user.id;
  const sessionResult=await serverCheck(session);
  const data=sessionResult?.profile;
  if(!data)throw Object.assign(new Error('Profil utilisateur indisponible. Réessayez.'),{authTransient:true});
  if(data.is_active!==true)throw Object.assign(new Error('Ce compte est suspendu ou ne dispose pas d’un profil actif. Contactez l’administrateur.'),{authFatal:true});
  try{localStorage.setItem(cacheKey,JSON.stringify({profile:data,savedAt:Date.now()}))}catch(_){}
  user=session.user;profile=data;startPresenceTracking();startAdminMessageNotifications();startHeaderBadgeTracking();
  hideSplash();document.documentElement.classList.add('inspecteur-auth-ready');byId('auth-gate').hidden=true;
  const path=location.pathname;
  if(path.endsWith('/admin.html')&&data.role!=='super_admin'){gate('Accès réservé au super-administrateur.');return;}
  window.inspecteurBotAuthUser=user;window.inspecteurBotAuthProfile=profile;
  window.dispatchEvent(new CustomEvent('inspecteurbot:authenticated',{detail:{client,user,profile}}));
  const isHome=path==='/'||path.endsWith('/index.html')||path.endsWith('/InspecteurBot-2.0/');
  if(isHome){
   // Accueil personnalisé : une seule apparition par nouvelle session authentifiée.
   try{
    const sessionId=readSessionId(session.access_token)||'';
    const welcomeKey='inspecteurbot_welcome_session_v1_'+session.user.id;
    const previous=localStorage.getItem(welcomeKey)||'';
    if(sessionId&&previous!==sessionId){
     const now=new Date(),hour=now.getHours(),salutation=(hour>=5&&hour<18)?'Bonjour':'Bonsoir';
     const displayName=String(data.display_name||session.user.user_metadata?.nom_complet||session.user.user_metadata?.full_name||session.user.email?.split('@')[0]||'Inspecteur').trim();
     const firstName=displayName.split(/\s+/)[0]||'Inspecteur';
     const choices=[
      {label:'Annuaire IGT',href:'igt/index.html',note:'Retrouvez rapidement un agent'},
      {label:'Code du Travail',href:'code-travail.html',note:'Consultez les textes juridiques'},
      {label:'Fiche de contrôle',href:'fiche.html',note:'Préparez votre prochaine mission'},
      {label:'Rapport',href:'inspecteurs.html',note:'Rédigez un rapport professionnel'},
      {label:'Quiz Académie IGT',href:'pages/Quiz_Academie_IGT/index.html',note:'Renforcez vos connaissances'},
      {label:'InspecteurBot IA',href:'ia/assistant.html',note:'Posez votre question à l’assistant'},
      {label:'Application SMIG',href:'autres/smig.html',note:'Vérifiez les dispositions du SMIG'},
      {label:'PV',href:'pv.html',note:'Préparez un procès-verbal'},
      {label:'Décompte final',href:'autres/decompte-final.html',note:'Calculez les droits de fin de contrat'}
     ];
     let last='';try{last=localStorage.getItem('inspecteurbot_welcome_recommendation_v1_'+session.user.id)||''}catch(_){}
     const available=choices.filter(item=>item.label!==last);
     const selected=available[Math.floor(Math.random()*available.length)]||choices[0];
     localStorage.setItem(welcomeKey,sessionId);
     localStorage.setItem('inspecteurbot_welcome_recommendation_v1_'+session.user.id,selected.label);
     if(!document.getElementById('ib-personal-welcome-style')){
      const style=document.createElement('style');style.id='ib-personal-welcome-style';
      style.textContent='#ib-personal-welcome{position:fixed;top:max(10px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:2147483001;width:min(620px,calc(100% - 24px));padding:13px 16px;border:1px solid #f3d77a;border-radius:15px;background:linear-gradient(135deg,#08264b,#0c4777);color:#fff;box-shadow:0 12px 35px #00142d55;font:14px/1.4 Arial,sans-serif;opacity:0;animation:ib-welcome-in .25s ease forwards}#ib-personal-welcome strong{display:block;font-size:16px;color:#ffe08a;margin-bottom:3px}#ib-personal-welcome p{margin:0;color:#e5f1ff}#ib-personal-welcome a{display:inline-block;margin-top:7px;color:#ffe08a;font-weight:700;text-decoration:underline}#ib-personal-welcome.ib-out{opacity:0;transition:opacity .25s ease}@keyframes ib-welcome-in{to{opacity:1}}';
      document.head.appendChild(style);
     }
     const banner=document.createElement('aside');banner.id='ib-personal-welcome';banner.setAttribute('role','status');banner.setAttribute('aria-live','polite');
     const title=document.createElement('strong');title.textContent=salutation+' '+firstName+' 👋';
     const detail=document.createElement('p');detail.textContent='Bienvenue sur InspecteurBot. '+selected.note+'.';
     const link=document.createElement('a');link.href=selected.href;link.textContent='Découvrir : '+selected.label+' →';
     banner.append(title,detail,link);document.body.appendChild(banner);
     setTimeout(()=>{banner.classList.add('ib-out');setTimeout(()=>banner.remove(),280)},5000);
    }
   }catch(welcomeError){console.info('Accueil personnalisé indisponible',welcomeError)}
   let chip=byId('auth-chip');
   if(!chip){
    const appHeader=document.createElement('header');appHeader.id='ib-app-header';
    appHeader.innerHTML='<div id="ib-auth-slot"></div><div class="ib-brand"><span class="ib-brand-copy">InspecteurBot<small>Votre assistant numérique</small></span></div><div class="ib-header-actions"><a class="ib-header-action" id="ib-header-presence" href="/InspecteurBot-2.0/messagerie.html?view=presence" aria-label="Agents en ligne" title="Agents en ligne"><i class="fa-solid fa-user-group"></i><span class="ib-header-count" hidden></span></a><a class="ib-header-action" id="ib-header-messages" href="/InspecteurBot-2.0/messagerie.html?v=20261110-messenger-profile-v1" aria-label="Messages" title="Messages"><i class="fa-brands fa-facebook-messenger"></i><span class="ib-header-count" hidden></span></a><a class="ib-header-action" id="ib-notification-link" href="/InspecteurBot-2.0/notifications.html" aria-label="Annonces et formations" title="Annonces et formations"><i class="fa-regular fa-bell"></i><span class="ib-notification-count" hidden></span></a><button type="button" id="ib-header-menu" aria-label="Ouvrir le menu principal" aria-expanded="false"><i class="fa-solid fa-bars"></i></button></div>';
    document.body.insertBefore(appHeader,document.body.firstChild);
    setTimeout(()=>void refreshHeaderBadges(),0);
    chip=document.createElement('div');chip.id='ib-auth-chip';
    chip.innerHTML='<button type="button" id="ib-auth-account" aria-label="Ouvrir le menu de votre profil" aria-expanded="false" aria-controls="ib-auth-menu"><span class="ib-avatar"><i class="fa-solid fa-user"></i><img class="ib-avatar-image" alt="" hidden></span><span class="ib-account-label"></span><i class="fa-solid fa-chevron-down"></i></button><div id="ib-auth-menu" hidden><a href="profil.html"><i class="fa-solid fa-user"></i> Mon profil</a><a href="profil.html#parametres"><i class="fa-solid fa-gear"></i> Paramètres</a><a href="profil.html#mes-informations"><i class="fa-solid fa-address-card"></i> Mes informations</a><button type="button" id="ib-auth-logout"><i class="fa-solid fa-right-from-bracket"></i> Déconnexion</button></div>';
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
   let localAvatar='';
   try{const localProfile=JSON.parse(localStorage.getItem('inspecteurbot_local_profile_v1_'+session.user.id)||'null');if(localProfile&&typeof localProfile.avatar==='string')localAvatar=localProfile.avatar}catch(_){}
   const initialAvatar=localAvatar||data.avatar_url||'';
   if(initialAvatar){avatarImg.src=initialAvatar;avatarImg.hidden=false;avatarIcon.hidden=true}
   else{avatarImg.hidden=true;avatarImg.removeAttribute('src');avatarIcon.hidden=false}
   window.inspecteurBotSetAvatar=function(url){
    if(url){avatarImg.src=url;avatarImg.hidden=false;avatarIcon.hidden=true}
    else{avatarImg.hidden=true;avatarImg.removeAttribute('src');avatarIcon.hidden=false}
   };
   refreshNotificationBadge();
   if(!window.__ibNotificationRefreshTimer)window.__ibNotificationRefreshTimer=setInterval(refreshNotificationBadge,120000);
   window.addEventListener('focus',refreshNotificationBadge);
  }
 }catch(e){console.warn('Authentification InspecteurBot',e);if(e.authTransient){gate(e.message||'Vérification momentanément indisponible. Réessayez.','retry');return}await client.auth.signOut({scope:'local'}).catch(()=>{});user=null;profile=null;gate(e.message||'Connexion requise.')}
 finally{busy=false}
}
async function signOut(){clearTimeout(expiry);sessionDeadline=0;stopPresenceTracking();stopAdminMessageNotifications();clearInterval(validation);if(client)await client.auth.signOut().catch(()=>{});user=null;profile=null;gate('Vous êtes déconnecté.')}
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&sessionDeadline&&Date.now()>=sessionDeadline)void expireSession();else if(!document.hidden)void updatePresence()});
window.addEventListener('focus',()=>{if(sessionDeadline&&Date.now()>=sessionDeadline)void expireSession()});
function installPasswordEye(id){
 const input=byId(id);if(!input||input.parentElement?.classList.contains('ib-password-wrap'))return;
 const wrap=document.createElement('div');wrap.className='ib-password-wrap';
 input.parentNode.insertBefore(wrap,input);wrap.appendChild(input);
 const button=document.createElement('button');button.type='button';button.className='ib-password-toggle';button.textContent='👁';button.setAttribute('aria-label','Afficher le mot de passe');button.title='Afficher le mot de passe';
 button.addEventListener('click',()=>{const show=input.type==='password';input.type=show?'text':'password';button.setAttribute('aria-label',show?'Masquer le mot de passe':'Afficher le mot de passe');button.title=show?'Masquer le mot de passe':'Afficher le mot de passe';button.textContent=show?'🙈':'👁';input.focus()});
 wrap.appendChild(button);
}
function setup(){
 const form=byId('auth-form'),email=byId('auth-email'),pw=byId('auth-password'),confirm=byId('auth-confirm'),wrap=byId('auth-confirm-wrap'),submit=byId('auth-submit'),forgot=byId('auth-forgot');
 const retry=byId('auth-retry');
 ['auth-password','auth-confirm','auth-register-password','auth-register-password2'].forEach(installPasswordEye);
 retry.addEventListener('click',async()=>{retry.disabled=true;gate('Nouvelle vérification de votre session…','loading');try{const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session)await validate(data.session);else gate()}catch(e){gate(e.message||'Vérification impossible. Réessayez.','retry')}finally{retry.disabled=false}});
 form.addEventListener('submit',async e=>{
  e.preventDefault();submit.disabled=true;msg('');
  try{
   if(recovery){if(pw.value.length<8)throw Error('Le mot de passe doit contenir au moins 8 caractères.');if(pw.value!==confirm.value)throw Error('Les deux mots de passe ne correspondent pas.');const {error}=await client.auth.updateUser({password:pw.value});if(error)throw error;recovery=false;wrap.hidden=true;email.parentElement.hidden=false;email.required=true;pw.value='';confirm.value='';await client.auth.signOut();submit.textContent='Se connecter';msg('Mot de passe mis à jour. Connectez-vous avec votre compte existant.',true);return}
   submit.textContent='Connexion…';const {data,error}=await client.auth.signInWithPassword({email:email.value.trim(),password:pw.value});if(error)throw Error('Connexion impossible. Vérifiez votre adresse e-mail et votre mot de passe.');await validate(data.session);
  }catch(e){msg(e.message||'Une erreur est survenue.')}finally{submit.disabled=false;if(!recovery)submit.textContent='Se connecter'}
 });
 forgot.addEventListener('click',async()=>{const v=email.value.trim();if(!v){msg('Saisissez d’abord l’adresse e-mail de votre compte.');return}try{const {error}=await client.auth.resetPasswordForEmail(v,{redirectTo:location.href.split('#')[0]});if(error)throw error;msg('Si cette adresse e-mail est associée à un compte, un lien de réinitialisation vient d’être envoyé. Consultez votre boîte de réception ainsi que vos courriers indésirables, puis cliquez sur « Réinitialiser mon mot de passe » pour choisir un nouveau mot de passe.',true)}catch(e){msg(e.message||'Impossible d’envoyer le lien.')}});
 const regOpen=byId('auth-register-open'),regPanel=byId('auth-register-panel'),regForm=byId('auth-register-form'),regMessage=byId('auth-register-message'),regSubmit=byId('auth-register-submit');
 regOpen.addEventListener('click',()=>{regPanel.hidden=false;regMessage.textContent='';});
 byId('auth-register-close').addEventListener('click',()=>{regPanel.hidden=true;});
 regForm.addEventListener('submit',async e=>{
  e.preventDefault();const value=id=>byId('auth-register-'+id).value.trim();
  const password=byId('auth-register-password').value,password2=byId('auth-register-password2').value;
  if(password.length<8){regMessage.textContent='Le mot de passe doit contenir au moins 8 caractères.';return}
  if(password!==password2){regMessage.textContent='Les deux mots de passe ne correspondent pas.';return}
  regSubmit.disabled=true;regSubmit.textContent='Création du compte…';regMessage.style.color='#334155';regMessage.textContent='Vérification de votre identité dans le registre officiel…';
  const payload={nom_complet:value('name'),categorie:({'inspecteur':'inspecteur_travail','controleur':'controleur_travail','agent_administratif':'agent_administratif'}[value('category')]||value('category')),matricule:value('matricule'),telephone:value('phone'),adresse_physique:value('address'),email:value('email').toLowerCase(),password,website:value('website')};
  try{
   const {data,error}=await client.functions.invoke('igt-registration',{body:payload});
   if(error){let detail='';try{const response=error.context;if(response&&typeof response.clone==='function'){const body=await response.clone().json();detail=body?.message||body?.error||body?.details||''}}catch(_){}if(!detail&&data)detail=data.message||data.error||'';if(!detail)detail=String(error.message||'Le service de création de compte est momentanément indisponible.');throw new Error(detail)}
   if(!data?.success)throw new Error(data?.message||'Vos informations n’ont pas été validées dans le registre officiel.');
   const {data:login,error:loginError}=await client.auth.signInWithPassword({email:payload.email,password});
   if(loginError)throw new Error('Compte créé. Connectez-vous depuis cet écran : '+loginError.message);
   regPanel.hidden=true;regForm.reset();await validate(login.session);msg('Votre compte est créé et activé.',true);
  }catch(err){console.error('Inscription InspecteurBot',err);const detail=String(err&&err.message||'');if(/already registered|already exists|user already|email_exists|user_already_exists|déjà inscrit|déjà un compte|compte existe|duplicate key|unique constraint/i.test(detail)){regPanel.hidden=true;regMessage.textContent='';showDuplicateAccountToast()}else{regMessage.style.color='#b42318';regMessage.textContent=detail||'Impossible de créer le compte. Vérifiez les informations.'}}
  finally{regSubmit.disabled=false;regSubmit.textContent='Créer mon compte'}
 });

 client.auth.onAuthStateChange((event,session)=>{
  if(event==='PASSWORD_RECOVERY'){recovery=true;gate('Choisissez un nouveau mot de passe.');wrap.hidden=false;email.parentElement.hidden=true;email.required=false;pw.autocomplete='new-password';forgot.hidden=true;submit.textContent='Enregistrer le mot de passe'}
  else if(event==='SIGNED_OUT'){user=null;profile=null;stopAdminMessageNotifications();stopHeaderBadgeTracking();gate()}
  else if(event==='SIGNED_IN'||event==='TOKEN_REFRESHED'||event==='INITIAL_SESSION')setTimeout(()=>validate(session),0)
 });
}
async function loadGlobalTheme(){
 const authScript=Array.from(document.scripts).find(s=>s.src.includes('auth-gate.js'));
 const base=authScript?new URL('./',authScript.src):new URL('./',location.href);
 if(!document.querySelector('link[data-ib-auth-background]')){const authBg=document.createElement('link');authBg.rel='stylesheet';authBg.href=new URL('auth-background.css?v=20261109-auth-final-5',base).href;authBg.dataset.ibAuthBackground='1';document.head.appendChild(authBg);}
 if(!document.querySelector('link[data-ib-global-theme]')){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('global-theme.css?v=20261108-theme-5',base).href;link.dataset.ibGlobalTheme='1';document.head.appendChild(link);}
 if(window.InspecteurBotTheme)return;
 await new Promise((resolve,reject)=>{const script=document.createElement('script');script.src=new URL('global-theme.js?v=20261108-theme-5',base).href;script.onload=resolve;script.onerror=()=>reject(new Error('Thèmes globaux indisponibles'));document.head.appendChild(script);});
}
async function start(){
 try{await loadGlobalTheme()}catch(themeError){console.warn('Thèmes globaux non chargés',themeError)}
 makeGate();gate('Préparation de votre espace sécurisé…','loading');
 try{await loadLib();client=window.supabase.createClient(URL,KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});window.inspecteurBotAuthClient=client;setup();const {data,error}=await client.auth.getSession();if(error)throw error;if(data.session)await validate(data.session);else gate();
 // La session reste active jusqu'à la déconnexion ou à sa révocation. Supabase renouvelle automatiquement les jetons.
 document.addEventListener('click',e=>{const a=e.target.closest&&e.target.closest('a');if(a&&(/logout/i.test(a.getAttribute('onclick')||'')||/déconnexion|logout/i.test(a.textContent||''))){e.preventDefault();e.stopImmediatePropagation();signOut()}},true);
 window.inspecteurBotSignOut=signOut;
 }catch(e){console.error(e);gate(e.message||'Service d’authentification indisponible.')}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();