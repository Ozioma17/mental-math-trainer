'use strict';
const CACHE='kotoba-garden-offline-v1';
const ASSETS=['./','index.html','styles.css','app.js','content.json'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('kotoba-garden-offline-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const u=new URL(event.request.url),scope=new URL(self.registration.scope);
 if(event.request.method!=='GET'||u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;
 const canonical=new Request(u.origin+u.pathname);
 event.respondWith(fetch(event.request).then(response=>{
  if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(canonical,copy)));}
  return response;
 }).catch(async()=>{const cache=await caches.open(CACHE),hit=await cache.match(canonical);if(hit)return hit;if(event.request.mode==='navigate')return cache.match(new URL('index.html',scope).href);return Response.error();}));
});
