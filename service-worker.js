/* InspecteurBot — cache économe en données, sans toucher aux données utilisateur */
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
  // Les anciens caches et toutes les données utilisateur restent intacts.
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET'||request.headers.has('range'))return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;

  const isHtml=request.mode==='navigate'||/\\.html$/i.test(url.pathname);
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);

    // Les pages HTML restent à jour : réseau d'abord, cache seulement en cas de panne.
    if(isHtml){
      try{
        const response=await fetch(request);
        if(response&&response.ok)await cache.put(request,response.clone()).catch(()=>{});
        return response;
      }catch(error){
        const cached=await cache.match(request);
        if(cached)return cached;
        if(request.mode==='navigate')return (await cache.match('./index.html'))||Response.error();
        throw error;
      }
    }

    // Ressources statiques et images : cache d'abord, aucun téléchargement répété
    // tant que le fichier est déjà présent dans le cache local.
    const cached=await cache.match(request);
    if(cached)return cached;

    // Favorise WebP pour les images JPEG si une variante existe sur le serveur.
    if(/\\.(jpe?g)$/i.test(url.pathname)){
      const webpUrl=new URL(url.href);
      webpUrl.pathname=webpUrl.pathname.replace(/\\.(jpe?g)$/i,'.webp');
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
