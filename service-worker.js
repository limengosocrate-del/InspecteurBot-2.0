/**
 * service-worker.js
 * PWA — InspecteurBot RDC : fonctionnement 100% HORS-CONNEXION
 */
const CACHE = "inspecteurbot-rdc-v3";

const ASSETS = [
  "./",
  "./code-travail.html",
  "./manifest.json",
  "./assets/css/reset.css",
  "./assets/css/header.css",
  "./assets/css/toolbar.css",
  "./assets/css/search.css",
  "./assets/css/categories.css",
  "./assets/css/article.css",
  "./assets/css/assistant.css",
  "./assets/css/outils.css",
  "./assets/css/footer.css",
  "./assets/css/responsive.css",
  "./assets/css/animations.css",
  "./assets/css/livre.css",
  "./assets/js/app.js",
  "./assets/js/search.js",
  "./assets/js/vectorSearch.js",
  "./assets/js/ai-offline.js",
  "./assets/js/ia.js",
  "./assets/js/rag.js",
  "./assets/js/speech.js",
  "./assets/js/traduction.js",
  "./assets/js/favoris.js",
  "./assets/js/share.js",
  "./assets/js/print.js",
  "./assets/js/statistiques.js",
  "./assets/js/code-travail/database.js",
  "./assets/js/code-travail/index.js",
  "./assets/js/code-travail/navigation.js",
  "./assets/js/code-travail/recherche.js",
  "./assets/js/code-travail/categories.js",
  "./assets/js/code-travail/consultation.js",
  "./assets/js/code-travail/livre.js",
  "./assets/js/code-travail/utils.js"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {}))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Stratégie Cache-First (offline d'abord)
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
        return resp;
      }).catch(() => cached);
    })
  );
});

/*==================================================
 INSPECTEURBOT IA RDC 4.0 PREMIUM
 Service Worker
===================================================*/


const CACHE_NAME =
"inspecteurbot-v4";


const FILES = [


    "/",

    "fiche.html",

    "fiche.css",

    "fiche.js",

    "js/utils.js",

    "js/theme.js",

    "js/search.js",

    "js/weather.js",

    "js/voice.js",

    "js/scanner.js",

    "js/assistant.js",

    "js/notification.js",

    "js/offline.js"


];



self.addEventListener(
"install",
event=>{


    event.waitUntil(

        caches.open(
            CACHE_NAME
        )
        .then(cache=>{

            return cache.addAll(
                FILES
            );

        })

    );


});



self.addEventListener(
"fetch",
event=>{


    event.respondWith(

        caches.match(
            event.request
        )
        .then(response=>{


            return response ||
            fetch(event.request);


        })

    );


});
