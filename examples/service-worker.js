const svcWorkerVersion = 'v1';

const putAllRequestIntoCache = async () => {

    await caches.open(svcWorkerVersion).then((cache) => {
      return cache.addAll([
        'styles/styles.css',
        'js/script.js',
        'images/angular.png'
      ]);
    });
}

const  listCachedUrls = async () => {
  const cache = await caches.open(svcWorkerVersion);
  const requests = await cache.keys();
  for(request of requests) {
    console.warn('svc worker has this url into cache : ',request.url)
  }

}

const deleteImagesCachedURL = async () => {
  const cache = await caches.open(svcWorkerVersion);
  const requests = await cache.keys();
  for(request of requests) {
    if(request.url.includes('images')) {
      console.warn('svc worker delete cache for: ',request.url)
      await cache.delete(request);
    }
  }
}


self.addEventListener('install', (event) => {
  console.warn('svc worker install 1 ');
 event.waitUntil(putAllRequestIntoCache());

 console.warn('svc worker install 2');
  self.skipWaiting();
});

self.addEventListener('activate', async (event) => {
  console.warn('svc worker activated',event);
  event.waitUntil(
    Promise.all( listCachedUrls(), deleteImagesCachedURL(), listCachedUrls())
  );
});

self.addEventListener('fetch', async (event) => {

  event.respondWith(
    caches.match(event.request).then((response) => {


      if(response){
        console.warn('svc worker cache for: ',event.request.url);
        return response;

      }else{
        console.warn('svc worker fetch for: ',event.request.url);
        return fetch(event.request);
      }
    })
  );
});
