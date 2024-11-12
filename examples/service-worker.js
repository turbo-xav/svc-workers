const svcWorkerVersion = 'v1';
const token = 'Mon-super-token'

const listAllUrlFromCacheThenDeleteImageFromCacheAndListAllUrlFromCache = async () => {
  console.warn('svc worker event handler');
  await listCachedUrls();
  await deleteImagesCachedURL();
  await listCachedUrls();
}


self.addEventListener('install', (event) => {
  console.warn('svc worker install 1 ');
  event.waitUntil(putAllRequestIntoCache());
  console.warn('svc worker install 2');
  self.skipWaiting();
  console.warn('svc worker install 3');
});

self.addEventListener('activate', async (event) => {
  console.warn('svc worker is activated',event);
  //event.waitUntil(listAllUrlFromCacheThenDeleteImageFromCacheAndListAllUrlFromCache());
});

self.addEventListener('fetch', async (event) => {

  event.respondWith(
    caches.match(event.request).then((response) => {
      if(response){
        console.warn('svc worker cache for: ',event.request.url);
        return response;

      }else{
        console.warn('svc worker fetch for: ',event.request.url);
        return sendRequestWithBearerAndModifyUsersJson(event);
      }
    })
  );
});

sendRequestWithBearerAndModifyUsersJson = async (event) => {
  try {
    if(event.request.url.includes('users.json')){
      const modifiedRequest = new Request(event.request, {
        headers: new Headers({
          ...event.request.headers,
          mode: 'cors', // Activer CORS pour cette requête
          credentials: 'include', // Inclure les cookies et les informations d'authentification
          'Authorization': 'Bearer '+token // Ajouter un en-tête personnalisé
        })
      });
      //Lancement requête
      const response = await fetch(modifiedRequest);
      // Cloner la réponse pour y travailler sans affecter l'original
      const responseClone = response.clone();
      // Lire le corps de la réponse en tant que texte
      const text = await responseClone.text();
      // Modifier le texte de la réponse
      const modifiedText = text.replace(/John/g, 'Billy'); // Exemple de modification

      // Renvoyer la nouvelle réponse modifiée
      return new Response(modifiedText, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
    } else {
      // Si ce n'est pas du HTML, retourner la réponse originale
      return await fetch(event.request);;
    }
  } catch (error) {
    console.error('Échec de la récupération:', error);
    // Retourner une réponse de secours en cas d'échec de requête
    return caches.match('/fallback.html');
  }
}

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
