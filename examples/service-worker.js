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

self.addEventListener('activate', async (event) => {
  console.warn('svc worker is activated');
  /*self.clients.claim().then(() => {
    sendMessageToClients('Service Worker is activated and ready.');
  });*/
  event.waitUntil(self.clients.claim());
  sendMessageToClients('Service Worker is activated and ready.');
  //event.waitUntil(listAllUrlFromCacheThenDeleteImageFromCacheAndListAllUrlFromCache());
});




/*self.addEventListener('fetch', async (event) => {
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
});*/

// Dans votre fichier service-worker.js

self.addEventListener('fetch', event => {
  if (event.request.method === 'POST' && event.request.url.includes('3000')) {
    console.warn('POST detecté sur le port 3000')
    event.respondWith(
      (async () => {
        try {
          const clonedRequest = event.request.clone();
          const requestBody = await clonedRequest.json();

          // Vous pouvez manipuler les données de la requête ici
          console.log('Payload POST reçu:', requestBody);

          const modifiedRequest = new Request(event.request.url, {
            method: 'POST',
            headers: event.request.headers,
            body: JSON.stringify({
              ...requestBody,
              additionalData: 'added by service worker' // Exemple de modification de requête
            })
          });

          const response = await fetch(modifiedRequest);

          if (!response.ok) {
            throw new Error('Erreur réseau');
          }

          const responseBody = await response.json();

          // Vous pouvez manipuler les données de la réponse ici
          console.log('Réponse POST reçue:', responseBody);

          return new Response(JSON.stringify(responseBody), {
            headers: response.headers
          });

        } catch (error) {
          console.error('Erreur durant la requête POST:', error);
          return new Response('{"error": "Quelque chose a mal tourné"}', {
            headers: { 'Content-Type': 'application/json' },
            status: 500
          });
        }
      })()
    );
  } else {
    // Pour les autres requêtes, procéder normalement
    event.respondWith(fetch(event.request));
  }
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

