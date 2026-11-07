/* InspecteurBot — service worker unique, sans interception double des requêtes */
'use strict';
const CACHE='inspecteurbot-shell-2026-11-07-v31';
const SHELL=['./','./index.html','./profil.html','./notifications.html','./admin.html','./ia/assistant.html','./auth-gate.js','./js/assistant.js','./js/ai-core.js','./js/ai-knowledge.js','./js/ai-nlp.js','./js/smig-data.js','./js/ai-local-bridge.js','./assets/js/code-travail/database.js','./assets/js/ai-offline.js','./code-travail.html','./assets/css/igt-professional.css','./assets/css/entreprises.css','./assets/js/entreprises.js','./entreprises.html','./app-pv.js','./pv.html','./sanctions.html','./aim-006-data.js','./App-sanctions.js','./assets/js/code-travail/livre.js','./formation.html','./quiz-sanctions.js','./js/quiz-engine.js','./frontend/assets/js/data/infractions65.js','./pages/Quiz_Academie_IGT/js/quiz-engine.js','./pages/Quiz_Academie_IGT/js/persistence.js','./juridique/conventions.html','./autres/historique.html','./js/history.js','./auth-gate.js','./js/App-decompte.js','./js/ai-local-bridge.js','./app-inspecteur.js','./inspecteurs.html'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL).catch(()=>{})));
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const request=event.request;
 if(request.method!=='GET')return;
 const url=new URL(request.url);
 if(url.origin!==self.location.origin)return;
 const isPage=request.mode==='navigate'||/\.(html|js)$/.test(url.pathname);
 if(isPage){
  const refresh=fetch(request).then(response=>{
   if(response&&response.ok)caches.open(CACHE).then(cache=>cache.put(request,response.clone())).catch(()=>{});
   return response;
  }).catch(()=>null);
  event.waitUntil(refresh.then(()=>undefined));
  event.respondWith((async()=>{
   const cache=await caches.open(CACHE);
   const cached=await cache.match(request,{ignoreSearch:true});
   return cached||(await refresh)||await cache.match('./index.html')||Response.error();
  })());
  return;
 }
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  const cached=await cache.match(request);
  if(cached)return cached;
  const response=await fetch(request);
  if(response&&response.ok)cache.put(request,response.clone()).catch(()=>{});
  return response;
 })());
});
