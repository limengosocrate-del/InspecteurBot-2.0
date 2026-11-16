/* InspecteurBot — cache économe en données, partage et accès hors connexion */
'use strict';
const CACHE='inspecteurbot-data-v52-20261117-pwa-capabilities-v1';
const SHELL=['./','./index.html','./offline.html','./share.html','./file-handler.html','./protocol-handler.html','./office.html','./office.css?v=20261111-office-local-v5','./office.js?v=20261111-office-local-v6','./office-templates.js?v=20261111-templates-v4','./notes.html','./widgets/inspecteurbot-widget-template.json','./widgets/inspecteurbot-widget-data.json','./widgets/inspecteurbot-widget-preview.svg'];
self.addEventListener('install',event=>{
 event.waitUntil((async()=>{const cache=await caches.open(CACHE);await Promise.all(['./offline.html','./share.html','./file-handler.html','./protocol-handler.html','./notes.html','./widgets/inspecteurbot-widget-template.json','./widgets/inspecteurbot-widget-data.json','./widgets/inspecteurbot-widget-preview.svg'].map(path=>cache.add(new Request(new URL(path,self.registration.scope),{cache:'reload'})).catch(()=>{})));})());
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


// Synchronisation différée : signale aux pages ouvertes qu'une reprise réseau est possible.
// Les opérations métier ne sont jamais rejouées sans avoir été explicitement mises en file par l'application.
async function ibNotifyClients(payload){
 const clientsList=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 for(const client of clientsList){try{client.postMessage(payload)}catch(_){}}
}
async function ibCheckBuild(){
 try{
  const response=await fetch(new URL('./app-version.json?sw-check='+Date.now(),self.registration.scope),{cache:'no-store',headers:{'Cache-Control':'no-cache'}});
  if(response.ok){const version=await response.json();await ibNotifyClients({type:'IB_BACKGROUND_REFRESH',build:version.build||null});}
 }catch(_){}
}
self.addEventListener('sync',event=>{
 if(event.tag==='inspecteurbot-background-sync'){
  event.waitUntil((async()=>{await ibCheckBuild();await ibNotifyClients({type:'IB_BACKGROUND_SYNC'});})());
 }
});
self.addEventListener('periodicsync',event=>{
 if(event.tag==='inspecteurbot-periodic-refresh'){
  event.waitUntil((async()=>{await ibCheckBuild();await ibNotifyClients({type:'IB_PERIODIC_REFRESH'});})());
 }
});
self.addEventListener('push',event=>{
 let data={};
 try{data=event.data?event.data.json():{}}catch(_){try{data={body:event.data?.text()||''}}catch(__){}}
 const title=String(data.title||'InspecteurBot');
 const options={
  body:String(data.body||'Vous avez une nouvelle notification.'),
  icon:new URL('./images/inspecteurbot-icon-512.png',self.registration.scope).href,
  badge:new URL('./images/inspecteurbot-icon-512.png',self.registration.scope).href,
  tag:String(data.tag||'inspecteurbot-notification'),
  data:{url:String(data.url||'./index.html')},
  renotify:false
 };
 event.waitUntil(self.registration.showNotification(title,options));
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const raw=event.notification.data?.url||'./index.html';
 let target=new URL('./index.html',self.registration.scope);
 try{const candidate=new URL(raw,self.registration.scope);if(candidate.origin===self.location.origin)target=candidate}catch(_){}
 event.waitUntil((async()=>{
  const windows=await self.clients.matchAll({type:'window',includeUncontrolled:true});
  for(const client of windows){if('focus'in client){await client.focus();client.postMessage({type:'IB_OPEN_NOTIFICATION',url:target.href});return;}}
  if(self.clients.openWindow)await self.clients.openWindow(target.href);
 })());
});

// Widgets Windows 11 : contenu public et raccourcis sans données de compte.
async function ibRenderQuickWidget(widget){
 try{
  if(!self.widgets||!widget||!widget.definition)return;
  const definition=widget.definition;
  const templatePath=definition.msAcTemplate||definition.ms_ac_template;
  if(!templatePath||!definition.data||!definition.tag)return;
  const templateUrl=new URL(templatePath,self.registration.scope),dataUrl=new URL(definition.data,self.registration.scope);
  const responses=await Promise.all([fetch(templateUrl),fetch(dataUrl)]);
  if(!responses[0].ok||!responses[1].ok)return;
  const template=await responses[0].text(),data=await responses[1].text();
  await self.widgets.updateByTag(definition.tag,{template,data});
 }catch(error){/* Les navigateurs sans API Widgets ignorent cette capacité. */}
}
self.addEventListener('widgetinstall',event=>{if(event.widget)event.waitUntil(ibRenderQuickWidget(event.widget))});
self.addEventListener('widgetresume',event=>{if(event.widget)event.waitUntil(ibRenderQuickWidget(event.widget))});
self.addEventListener('widgetclick',event=>{
 const destination=event.action==='new-note'?'./notes.html?new=1':'./index.html';
 event.waitUntil(self.clients.openWindow(new URL(destination,self.registration.scope).href));
});
