/* InspecteurBot — synchronisation automatique sans effacement des données locales */
'use strict';
const CACHE='inspecteurbot-shell-2026-11-10-v88';
const SHELL=['./','./index.html','./auth-gate.js','./messagerie.html?v=20261110-messenger-inbox-v2'];

self.addEventListener('install',event=>{
  // Réutilise le cache existant : aucune suppression des caches ou données du navigateur.
  event.waitUntil(caches.open(CACHE).then(cache=>
    Promise.all(SHELL.map(path=>cache.add(path).catch(()=>null)))
  ));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  // Ne jamais supprimer les anciens caches, IndexedDB, localStorage ou données hors ligne.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||request.headers.has('range'))return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      // Priorité au réseau pour les pages et les ressources applicatives :
      // les publications GitHub Pages sont ainsi récupérées dès la prochaine requête.
      const isHtml=request.mode==='navigate'||/\.html$/i.test(url.pathname);
      const response=await fetch(isHtml?new Request(request,{cache:'no-store'}):request);
      if(response&&response.ok){
        await cache.put(request,response.clone()).catch(()=>{});
      }
      return response;
    }catch(error){
      // Hors connexion : conserver le fonctionnement avec les ressources déjà en cache.
      const cached=await cache.match(request);
      if(cached)return cached;
      if(request.mode==='navigate'){
        return (await cache.match('./index.html'))||Response.error();
      }
      throw error;
    }
  })());
});
