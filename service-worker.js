/* InspecteurBot — cache économe en données et accès aux pages déjà visitées hors connexion */
'use strict';
const CACHE='inspecteurbot-data-v2';
const SHELL=['./','./index.html'];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>
    Promise.all(SHELL.map(path=>cache.add(path).catch(()=>null)))
  ));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  // Conserve les ressources déjà mises en cache par les versions précédentes.
  event.waitUntil(self.clients.claim());
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
        const cached=await cache.match(request);
        if(cached)return cached;
        throw error;
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
        const cached=await cache.match(request,{ignoreSearch:true});
        if(cached)return cached;
        throw error;
      }
    }

    // Ressources statiques : cache d'abord, y compris si seul le paramètre de version change.
    const cached=await cache.match(request,{ignoreSearch:true});
    if(cached)return cached;

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

    const response=await fetch(request);
    if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
    return response;
  })());
});
