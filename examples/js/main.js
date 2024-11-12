if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('Service Worker enregistré avec succès:', registration);
  }).catch((error) => {
    console.log('Échec de l\'enregistrement du Service Worker:', error);
  });
}
