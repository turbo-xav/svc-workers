if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('Service Worker enregistré avec succès:', registration);
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      console.log('Une nouvelle version du Service Worker est disponible');
      newWorker.addEventListener('statechange', () => {
        console.warn('newWorker.state',newWorker.state);
        if (newWorker.state === 'installed') {
          console.log('Une nouvelle version du Service Worker a été installée');
        }
      });
    });

  }).catch((error) => {
    console.log('Échec de l\'enregistrement du Service Worker:', error);
  });
}
