
self.addEventListener('install', (event) => {
  console.warn('svc worker install1');
  // Mise en cache des ressources lors de l'installation
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        '/styles.css',
        '/script.js',
        '/images/angular.png'
      ]);
    })
  );
 console.warn('svc worker install2');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.warn('svc worker activated');
});

self.addEventListener('fetch', (event) => {

  event.respondWith(
    caches.match(event.request).then((response) => {
      if(response){
        console.warn('svc worker fetch a cache for: ',event.request.url, response.body)
        return response
      }else{
        return fetch(event.request);
      }
    })
  );
});
