/* InspecteurBot — cache économe en données, partage et accès hors connexion */
'use strict';
const CACHE='inspecteurbot-data-v50-20261116-pwa-capabilities-v1';
const SHELL=['./','./index.html','./offline.html','./share.html','./file-handler.html','./protocol-handler.html','./office.html','./office.css?v=20261111-office-local-v5','./office.js?v=20261111-office-local-v6','./office-templates.js?v=20261111-templates-v4'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(['./offline.html','./share.html','./file-handler.html','./protocol-handler.html'].map(path=>cache.add(new Request(new URL(path,self.registration.scope),{cache:'reload'})).catch(()=>{})));})());
 self.skipWaiting();
});
self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{const names=await caches.keys(),target=await caches.open(CACHE);
  for(const name of names.filter(n=>n.startsWith('inspecteurbot-data-')&&n!==CACHE)){const old=await caches.open(name);for(const req of await old.keys()){if(!(await target.match(req))){const res=await old.match(req);if(res)await target.put(req,res).catch(()=>{})}}}
  await Promise.all(names.filter(n=>n.startsWith('inspecteurbot-data-')&&n!==CACHE).map(n=>caches.delete(n)));
  await self.clients.claim();
 })());
});
self.addEventListener('fetch',event=>{
 const request=event.request;if(request.method!=='GET'||request.headers.has('range'))return;
 const url=new URL(request.url);
 if(url.hostname==='cdn.jsdelivr.net'&&url.pathname.includes('/npm/@supabase/supabase-js@')){const cp=caches.open(CACHE);const refresh=cp.then(c=>fetch(request).then(r=>{if(r&&r.ok)return c.put(request,r.clone()).then(()=>r);return r}));event.waitUntil(refresh.catch(()=>{}));event.respondWith(cp.then(async c=>(await c.match(request))||(await c.match(request,{ignoreSearch:true}))||refresh));return}
 if(url.hostname==='cdn.jsdelivr.net'&&(['/npm/docx@','/npm/xlsx@','/npm/mammoth@'].some(x=>url.pathname.includes(x)))){event.respondWith((async()=>{const c=await caches.open(CACHE),hit=await c.match(request);if(hit)return hit;try{const r=await fetch(request);if(r&&r.ok)await c.put(request,r.clone()).catch(()=>{});return r}catch(e){return hit||Response.error()}})());return}
 if(url.origin===self.location.origin&&url.pathname.endsWith('/app-version.json')){event.respondWith(fetch(new Request(request,{cache:'no-store',headers:{...Object.fromEntries(request.headers.entries()),'Cache-Control':'no-cache'}})));return}
 if(url.origin!==self.location.origin)return;
 const html=request.mode==='navigate'||url.pathname.toLowerCase().endsWith('.html');
 if(html){event.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(new Request(request,{cache:'no-store',credentials:'same-origin'}));if(r&&r.ok){await c.put(request,r.clone()).catch(()=>{});return r}throw Error('Pages indisponible')}catch(e){const hit=await c.match(request,{ignoreSearch:true});if(hit)return hit;if(request.mode==='navigate'){const off=await c.match(new URL('./offline.html',self.registration.scope).href);if(off)return off;const home=await c.match(new URL('./index.html',self.registration.scope).href,{ignoreSearch:true});if(home)return home}throw e}})());return}
 if(url.pathname.toLowerCase().endsWith('/auth-gate.js')){event.respondWith((async()=>{const c=await caches.open(CACHE);try{const r=await fetch(new Request(request,{cache:'no-store'}));if(r&&r.ok){await c.put(request,r.clone()).catch(()=>{});return r}throw Error('auth-gate indisponible')}catch(e){const hit=(await c.match(request))||(await c.match(request,{ignoreSearch:true}));if(hit)return hit;throw e}})());return}
 event.respondWith((async()=>{const c=await caches.open(CACHE),hit=await c.match(request),fallback=hit||(await c.match(request,{ignoreSearch:true}));try{const r=await fetch(new Request(request,{cache:'no-store'}));if(r&&r.ok)await c.put(request,r.clone()).catch(()=>{});return r}catch(e){if(fallback)return fallback;if(/\.(jpe?g)$/i.test(url.pathname)){const alt=new URL(url.href);alt.pathname=alt.pathname.replace(/\.(jpe?g)$/i,'.webp');const webp=await c.match(new Request(alt.href),{ignoreSearch:true});if(webp)return webp}throw e}})());
});
