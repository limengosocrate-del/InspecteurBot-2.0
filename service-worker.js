/* InspecteurBot — service worker unique, sans interception double des requêtes */
'use strict';
const CACHE='inspecteurbot-shell-2026-11-09-v65';
const SHELL=['./','./index.html','./auth-gate.js'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(CACHE).then(cache=>Promise.all(SHELL.map(path=>cache.add(path).catch(()=>null)))));
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
   const cached=await cache.match(request);
   if(cached)return cached;
   return (await refresh)||await cache.match('./index.html')||Response.error();
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
