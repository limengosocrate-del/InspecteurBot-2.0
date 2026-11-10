/* InspecteurBot — synchronisation automatique sans effacement des données locales */
'use strict';
const CACHE='inspecteurbot-shell-2026-11-10-v110';
const SHELL=['./','./index.html','./espace-interactif.html','./auth-gate.js','./messagerie.html?v=20261110-profile-photos-v4'];

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

  const isHtml=request.mode==='navigate'||/\.html$/i.test(url.pathname);
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    if(isHtml){
      try{
        const response=await fetch(new Request(request,{cache:'no-store'}));
        if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
        return response;
      }catch(error){
        const cached=await cache.match(request);
        if(cached)return cached;
        if(request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
        throw error;
      }
    }

    // Ressources statiques : réponse locale immédiate, mise à jour réseau en arrière-plan.
    const cached=await cache.match(request);
    const refresh=fetch(request).then(response=>{
      if(response&&response.ok)cache.put(request,response.clone()).catch(()=>{});
      return response;
    }).catch(()=>null);
    if(cached){event.waitUntil(refresh);return cached;}
    const fresh=await refresh;
    if(fresh)return fresh;
    throw new Error('Ressource indisponible hors connexion');
  })());
});
