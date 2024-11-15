const svcWorkerVersion = 'v1';
const token = 'Mon-super-token'


self.addEventListener('message', function(event) {
  console.warn('Service Worker Received Message: ', event.data);
});

self.addEventListener('install', (event) => {
  //console.warn('svc worker install 1 ');
  event.waitUntil(putAllRequestIntoCache());
  //console.warn('svc worker install 2');
  self.skipWaiting();
  //console.warn('svc worker install 3');
});

self.addEventListener('activate', async () => {
  console.warn('svc worker is activated');
  self.clients.claim().then(() => {
    sendMessageToClients('Service Worker is activated and ready.');
  });

  //event.waitUntil(listAllUrlFromCacheThenDeleteImageFromCacheAndListAllUrlFromCache());
});




self.addEventListener('fetch', async (event) => {
  sendMessageToClients('Service Worker is trying to fetch :'+ event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if(response){
        //console.warn('Cache for: ',event.request.url);
        return response;

      }else{
        //console.warn('Fetch for: ',event.request.url);
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
      return await fetch(event.request);
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

const sendMessageToClients = (message) => {
   clients.matchAll().then(myClients => {
     myClients.forEach(client => {
       console.warn('svc worker send message to client : ', message)
       client.postMessage(message);
     });
   });
}

