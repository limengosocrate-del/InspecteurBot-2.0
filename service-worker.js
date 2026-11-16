/* InspecteurBot — cache économe en données et accès hors connexion */
'use strict';
const CACHE='inspecteurbot-data-v49-20261116-offline-page-v1';
const SHELL=['./','./index.html','./office.html','./offline.html','./office.css?v=20261111-office-local-v5','./office.js?v=20261111-office-local-v6','./office-templates.js?v=20261111-templates-v4'];

self.addEventListener('install',event=>{
  // Précharge uniquement la page de secours, sans rendre l'installation dépendante
  // d'un téléchargement réseau réussi. Aucun contenu utilisateur n'est modifié.
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.add(new Request(new URL('./offline.html',self.registration.scope),{cache:'reload'})).catch(()=>{});
  })());
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  // Migre les ressources déjà téléchargées avant de retirer les anciens caches.
  // localStorage, IndexedDB, comptes, messages et notifications ne sont jamais touchés.
  event.waitUntil((async()=>{
    const names=await caches.keys();
    const target=await caches.open(CACHE);
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

  // Client Supabase : mise à jour réseau, copie locale en secours.
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

  // Bibliothèques bureautiques lourdes : téléchargement à la demande puis cache.
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
      }catch(error){return cached||Response.error();}
    })());
    return;
  }

  // La version de l'application doit toujours être vérifiée en ligne.
  if(url.origin===self.location.origin&&url.pathname.endsWith('/app-version.json')){
    event.respondWith(fetch(new Request(request,{cache:'no-store',headers:{...Object.fromEntries(request.headers.entries()),'Cache-Control':'no-cache'}})));
    return;
  }

  if(url.origin!==self.location.origin)return;
  const isHtml=request.mode==='navigate'||url.pathname.toLowerCase().endsWith('.html');
  if(isHtml){
    // Réseau prioritaire : une publication GitHub Pages remplace immédiatement
    // les pages mises en cache. Hors connexion, servir la page demandée si connue,
    // sinon la page offline dédiée, puis l'accueil comme dernier recours.
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const fresh=await fetch(new Request(request,{cache:'no-store',credentials:'same-origin'}));
        if(fresh&&fresh.ok){await cache.put(request,fresh.clone()).catch(()=>{});return fresh;}
        throw new Error('Réponse GitHub Pages indisponible');
      }catch(error){
        const cached=await cache.match(request,{ignoreSearch:true});
        if(cached)return cached;
        if(request.mode==='navigate'){
          const offline=await cache.match(new URL('./offline.html',self.registration.scope).href);
          if(offline)return offline;
          const home=await cache.match(new URL('./index.html',self.registration.scope).href,{ignoreSearch:true});
          if(home)return home;
        }
        throw error;
      }
    })());
    return;
  }

  if(url.pathname.toLowerCase().endsWith('/auth-gate.js')){
    // Authentification à jour en ligne; copie locale uniquement en secours.
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
    const cached=await cache.match(request);
    const cachedFallback=cached||(await cache.match(request,{ignoreSearch:true}));
    try{
      const response=await fetch(new Request(request,{cache:'no-store'}));
      if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
      return response;
    }catch(error){
      if(cachedFallback)return cachedFallback;
      // Variante WebP déjà téléchargée en secours d'une image JPEG.
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
