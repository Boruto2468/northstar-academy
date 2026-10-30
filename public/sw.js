/* Network-first for HTML so new lessons and bug fixes reach installed PWA users.
   Hashed static assets remain cached for offline use. */
const CACHE = 'northstar-learning-v4';
self.addEventListener('install', () => { self.skipWaiting(); });
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key!==CACHE&&key.startsWith('northstar-')).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET'||new URL(request.url).origin!==self.location.origin)return;
  const navigation=request.mode==='navigate'||request.destination==='document';
  if(navigation){
    event.respondWith((async()=>{
      const store=await caches.open(CACHE);
      try{const response=await fetch(request);if(response.ok)await store.put(request,response.clone());return response;}
      catch{const cached=await store.match(request);if(cached)return cached;throw Error('Offline: page has not been cached yet');}
    })());
  } else {
    event.respondWith((async()=>{
      const store=await caches.open(CACHE);
      const cached=await store.match(request);
      if(cached)return cached;
      const response=await fetch(request);
      if(response.ok)event.waitUntil(store.put(request,response.clone()));
      return response;
    })());
  }
});
