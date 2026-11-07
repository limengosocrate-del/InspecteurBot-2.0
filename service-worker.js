/* InspecteurBot — service worker unique, sans interception double des requêtes */
'use strict';
const CACHE='inspecteurbot-shell-2026-11-07-v5';
const SHELL=['./','./index.html','./profil.html','./notifications.html','./admin.html','./auth-gate.js'];
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
 const isPage=request.mode==='navigate'||/\\.(html|js)$/.test(url.pathname);
 if(isPage){
  event.respondWith(fetch(request).then(response=>{
   if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
   return response;
  }).catch(async()=>{
   const cached=await caches.match(request);
   return cached||caches.match('./index.html');
  }));
  return;
 }
 event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
  if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy)).catch(()=>{});}
  return response;
 })));
});
