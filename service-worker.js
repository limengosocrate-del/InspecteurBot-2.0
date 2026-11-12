/* InspecteurBot — cache économe en données et accès aux pages déjà visitées hors connexion */
'use strict';
const CACHE='inspecteurbot-data-v11-profile-cert-lock';
const SHELL=['./','./index.html','./office.html','./office.css?v=20261111-office-local-v5','./office.js?v=20261111-office-local-v6','./office-templates.js?v=20261111-templates-v4'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>
    Promise.all(SHELL.map(path=>cache.add(path).catch(()=>null)))
  ));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  // Supprime les anciens caches de l’application afin que les prochaines connexions
  // ne réutilisent pas les anciens fragments HTML/JS après une mise à jour.
  event.waitUntil((async()=>{
    const names=await caches.keys();
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
    event.respondWith((async()=>{
      const cache=await caches.open(CACHE);
      try{
        const fresh=await fetch(request);
        if(fresh&&fresh.ok)await cache.put(request,fresh.clone()).catch(()=>{});
        return fresh;
      }catch(error){
        const cached=(await cache.match(request))||(await cache.match(request,{ignoreSearch:true}));
        if(cached)return cached;
        throw error;
      }
    })());
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

  if(url.origin!==self.location.origin)return;
  const isHtml=request.mode==='navigate'||/\.html$/i.test(url.pathname);
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);

    // Pages HTML : toujours tenter la version récente, puis utiliser la copie locale.
    if(isHtml){
      try{
        const response=await fetch(request);
        if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
        return response;
      }catch(error){
        const cached=await cache.match(request,{ignoreSearch:true});
        if(cached)return cached;
        if(request.mode==='navigate'){
          return (await cache.match('./index.html',{ignoreSearch:true}))||Response.error();
        }
        throw error;
      }
    }

    // Authentification : version récente en priorité, copie locale en secours.
    if(/\/auth-gate\.js$/i.test(url.pathname)){
      try{
        const fresh=await fetch(request);
        if(fresh&&fresh.ok)await cache.put(request,fresh.clone()).catch(()=>{});
        return fresh;
      }catch(error){
        const cached=(await cache.match(request))||(await cache.match(request,{ignoreSearch:true}));
        if(cached)return cached;
        throw error;
      }
    }

    // Ressources statiques : cache d'abord, y compris si seul le paramètre de version change.
    const cached=await cache.match(request);
    if(cached)return cached;
    const cachedFallback=await cache.match(request,{ignoreSearch:true});
    if(cachedFallback&&self.navigator?.onLine===false)return cachedFallback;

    // Préfère WebP aux JPEG si la variante existe sur le serveur.
    if(/\.(jpe?g)$/i.test(url.pathname)){
      const webpUrl=new URL(url.href);
      webpUrl.pathname=webpUrl.pathname.replace(/\.(jpe?g)$/i,'.webp');
      try{
        const webpResponse=await fetch(new Request(webpUrl.href,{method:'GET',credentials:request.credentials,mode:'same-origin'}));
        if(webpResponse&&webpResponse.ok){
          await cache.put(request,webpResponse.clone()).catch(()=>{});
          return webpResponse;
        }
      }catch(_){}
    }

    try{
      const response=await fetch(request);
      if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
      return response;
    }catch(error){
      if(cachedFallback)return cachedFallback;
      throw error;
    }
  })());
});
