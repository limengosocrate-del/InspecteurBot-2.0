/* InspecteurBot — gestionnaire commun des deux thèmes Quiz Académie IGT */
(function(){
 'use strict';
 const PREFIX='InspecteurBot_Global_Theme_v1_';
 const PUBLIC_KEY='InspecteurBot_Global_Theme_Public_v1';
 let userId=null,current='light',ready=false;
 const normalize=value=>value==='dark'?'dark':'light';
 function updateControls(){
  const icon=current==='dark'?'☀️':'🌙';
  ['themeIcon','btn-theme-toggle','themeToggle'].forEach(id=>{const el=document.getElementById(id);if(!el)return;if(id==='themeIcon')el.textContent=icon;else if(el.tagName==='BUTTON'&&!el.querySelector('i,span'))el.textContent=icon;});
  const select=document.getElementById('select-theme');if(select)select.value=current;
  const global=document.getElementById('ib-global-theme-toggle');if(global){global.textContent=icon;global.title=current==='dark'?'Passer au thème clair':'Passer au thème sombre';global.setAttribute('aria-label',global.title);}
 }
 function setTheme(value,persist=true){
  current=normalize(value);
  const body=document.body;
  body.classList.remove('light-theme','dark-theme','dark');
  body.classList.add(current==='dark'?'dark-theme':'light-theme');
  if(current==='dark')body.classList.add('dark');
  document.documentElement.dataset.ibTheme=current;
  document.documentElement.style.colorScheme=current;
  if(persist){try{if(userId)localStorage.setItem(PREFIX+userId,current);else if(body.dataset.publicTheme==='true')localStorage.setItem(PUBLIC_KEY,current)}catch(_){}}
  const engine=window.persistenceEngine;
  if(persist&&engine&&engine.storageReady&&engine.userId===userId){
   const profile=engine.getProfile();profile.settings=profile.settings||{};profile.settings.theme=current;engine.saveProfile(profile);
  }
  updateControls();
  if(persist)window.dispatchEvent(new CustomEvent('inspecteurbot:themechange',{detail:{theme:current}}));
  return current;
 }
 function ensureControl(){
  const existing=document.querySelector('#themeToggle,#btn-theme-toggle,.theme-btn,[data-theme-toggle],[onclick*="toggleTheme"]');
  if(existing||document.getElementById('ib-global-theme-toggle'))return;
  const button=document.createElement('button');button.id='ib-global-theme-toggle';button.type='button';button.textContent=current==='dark'?'☀️':'🌙';button.title=current==='dark'?'Passer au thème clair':'Passer au thème sombre';button.setAttribute('aria-label',button.title);
  button.addEventListener('click',()=>setTheme(current==='dark'?'light':'dark',true));
  document.body.appendChild(button);
 }
 function initPublic(){
  if(!document.body||document.body.dataset.publicTheme!=='true')return false;
  userId=null;let saved=null;try{saved=localStorage.getItem(PUBLIC_KEY)}catch(_){}
  setTheme(saved||'light',false);ready=true;ensureControl();updateControls();return true;
 }
 function init(detail){
  const user=detail&&detail.user||window.inspecteurBotAuthUser||window.igtCurrentUser;
  if(!user||!user.id||!document.body)return false;
  userId=user.id;
  let saved=null;try{saved=localStorage.getItem(PREFIX+userId)}catch(_){}
  const engine=window.persistenceEngine;
  const profileTheme=detail&&detail.profile&&detail.profile.settings&&detail.profile.settings.theme||engine&&engine.storageReady&&engine.getProfile().settings&&engine.getProfile().settings.theme;
  setTheme(saved||profileTheme||'light',false);
  if(!saved){try{localStorage.setItem(PREFIX+userId,current)}catch(_){}}
  if(engine&&engine.storageReady&&engine.userId===userId){const profile=engine.getProfile();profile.settings=profile.settings||{};profile.settings.theme=current;engine.saveProfile(profile);}
  ready=true;ensureControl();updateControls();return true;
 }
 document.addEventListener('inspecteurbot:authenticated',event=>init(event.detail));
 document.addEventListener('click',event=>{
  const target=event.target&&event.target.closest&&event.target.closest('#themeToggle,#btn-theme-toggle,.theme-btn,[data-theme-toggle],[onclick*="toggleTheme"]');
  if(!target)return;
  event.preventDefault();event.stopImmediatePropagation();setTheme(current==='dark'?'light':'dark',true);
 },true);
 document.addEventListener('change',event=>{
  if(event.target&&event.target.id==='select-theme'){event.stopImmediatePropagation();setTheme(event.target.value,true);}
 },true);
 document.addEventListener('DOMContentLoaded',()=>{
  if(document.body&&document.body.dataset.publicTheme==='true'){initPublic();return;}
  if(window.inspecteurBotAuthUser)init({user:window.inspecteurBotAuthUser,profile:window.inspecteurBotAuthProfile});
  else if(window.igtCurrentUser)init({user:window.igtCurrentUser,profile:window.igtCurrentProfile});
  else if(window.igtSupabase&&window.igtSupabase.auth)window.igtSupabase.auth.getSession().then(({data})=>{if(data&&data.session){window.igtCurrentUser=data.session.user;init({user:data.session.user,profile:window.igtCurrentProfile})}}).catch(()=>{});
 });
 window.InspecteurBotTheme={setTheme,getTheme:()=>current,init,initPublic};
})();