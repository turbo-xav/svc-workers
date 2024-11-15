let currentServiceWorker;
// main.js
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
        return navigator.serviceWorker.ready;
      })
      .then((registration) => {

      currentServiceWorker = getCurrentServiceWorker(registration);

      // Écoute des mises à jour du service worker
      registration.addEventListener('updatefound', function() {
        console.log('Update found for Service Worker.');
        currentServiceWorker = getCurrentServiceWorker(registration);
      });

        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('Received message from Service Worker:', event.data);
        });

    }).catch(function(error) {
      console.log('Service Worker registration failed:', error);
    });
  });
}

// Fonction pour suivre l'état d'installation
const trackInstallationState = (worker, str) => {
  //console.warn('trackInstallationState', str);
  worker.addEventListener('statechange', () => {
    switch (worker.state) {
      case 'installing':
        console.log('Service Worker state: installing');
        break;
      case 'installed':
        console.log('Service Worker state: installed');
        break;
      case 'activating':
        console.log('Service Worker state: activating');
        break;
      case 'activated':
        console.log('Service Worker state: activated');
        worker.postMessage('ping juste after activated');
        break;
      case 'redundant':
        console.log('Service Worker state: redundant');
        break;
      default:
        console.log('Service Worker state: unknown');
        break;
    }
  });
}

const getCurrentServiceWorker = (registration) => {
  // Suivi de l'état de l'installation
  let currentServiceWorker;
  if (registration.installing) {
    console.log('Service Worker installing...');
    trackInstallationState(registration.installing,'installing');
    currentServiceWorker =registration.installing;
  } else if (registration.waiting) {
    console.log('Service Worker installed (waiting to activate)...');
    trackInstallationState(registration.waiting,'waiting');
    currentServiceWorker =registration.waiting;
  } else if (registration.active) {
    console.log('Service Worker active');
    trackInstallationState(registration.active,'active');
    currentServiceWorker = registration.active;
    currentServiceWorker.postMessage('ping for already active');
  }
  return currentServiceWorker;

}
