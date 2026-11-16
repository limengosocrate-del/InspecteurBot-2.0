/* InspecteurBot — cache économe en données et accès aux pages déjà visitées hors connexion */
'use strict';
const CACHE='inspecteurbot-data-v36-20261116-single-navy-splash-chat-avatar-normal';
const SHELL=['./','./index.html','./office.html','./office.css?v=20261111-office-local-v5','./office.js?v=20261111-office-local-v6','./office-templates.js?v=20261111-templates-v4'];

self.addEventListener('install',event=>{
  // Installation immédiate : ne bloque jamais l'activation sur le téléchargement
  // de toutes les pages et ressources du shell.
  event.waitUntil(caches.open(CACHE));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  // Supprime les anciens caches de l’application afin que les prochaines connexions
  // ne réutilisent pas les anciens fragments HTML/JS après une mise à jour.
  event.waitUntil((async()=>{
    const names=await caches.keys();
    const target=await caches.open(CACHE);
    // Migre les ressources déjà téléchargées avant de retirer un ancien cache.
    // Les données utilisateur (localStorage / IndexedDB) ne sont jamais touchées.
    for(const name of names.filter(name=>name.startsWith('inspecteurbot-data-')&&name!==CACHE)){
      const oldCache=await caches.open(name);
      for(const request of await oldCache.keys()){
        if(!(await target.match(request))){
          const response=await oldCache.match(request);
          if(response) await target.put(request,response).catch(()=>{});
        }
      }
    }
    await Promise.all(names.filter(name=>name.startsWith('inspecteurbot-data-')&&name!==CACHE).map(name=>caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||request.headers.has('range'))return;
  const url=new URL(request.url);

  // Conserve localement le client Supabase pour permettre son chargement hors connexion
  // après une première visite avec Internet.
  if(url.hostname==='cdn.jsdelivr.net'&&url.pathname.includes('/npm/@supabase/supabase-js@')){
    const cachePromise=caches.open(CACHE);
    const refresh=cachePromise.then(cache=>fetch(request).then(response=>{
      if(response&&response.ok)return cache.put(request,response.clone()).then(()=>response);
      return response;
    }));
    event.waitUntil(refresh.catch(()=>{}));
    event.respondWith(cachePromise.then(async cache=>{
      const cached=(await cache.match(request))||(await cache.match(request,{ignoreSearch:true}));
      return cached||refresh;
    }));
    return;
  }

  // Bibliothèques bureautiques lourdes : chargement à la demande, puis cache local
  // pour réutilisation hors connexion et réduction des téléchargements répétés.
  if(url.hostname==='cdn.jsdelivr.net'&&(
    url.pathname.includes('/npm/docx@')||
    url.pathname.includes('/npm/xlsx@')||
    url.pathname.includes('/npm/mammoth@')
  )){
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      const cached=await cache.match(request);
      if(cached)return cached;
      try{
        const response=await fetch(request);
        if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
        return response;
      }catch(error){
        return cached||Response.error();
      }
    })());
    return;
  }

  // Le manifeste de version ne doit jamais être servi depuis un ancien cache.
  if(url.origin===self.location.origin&&url.pathname.endsWith('/app-version.json')){
    event.respondWith(fetch(new Request(request,{cache:'no-store',headers:{...Object.fromEntries(request.headers.entries()),'Cache-Control':'no-cache'}})));
    return;
  }

  if(url.origin!==self.location.origin)return;
  const isHtml=request.mode==='navigate'||url.pathname.toLowerCase().endsWith('.html');
  if(isHtml){
    // Réseau prioritaire : les anciennes pages migrées depuis un cache précédent
    // ne doivent jamais masquer une nouvelle publication GitHub Pages.
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const fresh=await fetch(new Request(request,{cache:'no-store',credentials:'same-origin'}));
        if(fresh&&fresh.ok){await cache.put(request,fresh.clone()).catch(()=>{});return fresh;}
        throw new Error('Réponse GitHub Pages indisponible');
      }catch(error){
        const cached=(await cache.match(request,{ignoreSearch:true}))||
          (request.mode==='navigate'?await cache.match('./index.html',{ignoreSearch:true}):null);
        if(cached)return cached;
        throw error;
      }
    })());
    return;
  }
  if(url.pathname.toLowerCase().endsWith('/auth-gate.js')){
    // Authentification toujours à jour en ligne; cache seulement en secours hors connexion.
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const fresh=await fetch(new Request(request,{cache:'no-store'}));
        if(fresh&&fresh.ok){await cache.put(request,fresh.clone()).catch(()=>{});return fresh;}
        throw new Error('auth-gate.js indisponible');
      }catch(error){
        const cached=(await cache.match(request))||(await cache.match(request,{ignoreSearch:true}));
        if(cached)return cached;
        throw error;
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);

    // Ressources statiques : réseau d'abord pour recevoir chaque publication GitHub,
    // cache local en secours hors connexion. Les anciennes copies restent disponibles.
    const cached=await cache.match(request);
    const cachedFallback=cached||(await cache.match(request,{ignoreSearch:true}));
    try{
      const response=await fetch(new Request(request,{cache:'no-store'}));
      if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
      return response;
    }catch(error){
      if(cachedFallback)return cachedFallback;
      // Préfère WebP aux JPEG si la variante a déjà été téléchargée.
      if(/\.(jpe?g)$/i.test(url.pathname)){
        const webpUrl=new URL(url.href);
        webpUrl.pathname=webpUrl.pathname.replace(/\.(jpe?g)$/i,'.webp');
        const webpRequest=new Request(webpUrl.href,{method:'GET',credentials:request.credentials,mode:'same-origin'});
        const webpCached=await cache.match(webpRequest,{ignoreSearch:true});
        if(webpCached)return webpCached;
      }
      throw error;
    }
  })());
});
