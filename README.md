# Exemples

## static de service worker 

### Répertoire examples
`cd examples`
`npm i -g  http-server`
`http-server`

Lancer l'url : http://localhost:8080

## Les différentes étapes

### Installation : install
Le service worker est téléchargé, puis son événement install est déclenché. À cette étape, vous pouvez pré-cacher des ressources critiques pour votre application.
### Waiting (En attente)
Si un service worker plus ancien est déjà actif et en contrôle des pages, le nouveau service worker reste en état "waiting" jusqu'à ce que l'ancien soit arrêté
### Activation : activate

#### Prise de contrôle 
Une fois qu'aucun ancien service worker n'est actif, le nouveau service worker passe à l'état d'activation.

#### Purge des caches obsolètes
Il est commun d'utiliser cet événement pour supprimer des caches obsolètes.

#### Migration de données
Si nécessaire, vous pouvez migrer ou mettre à jour des données.

### Activated (Activé)
Le service worker est maintenant activé et en contrôle des pages. Il peut maintenant intercepter les requêtes réseau et gérer la mise en cache.


## Utilisation 

Dans la console

### Cas 1 :
- Réseau -> "Désactiver le cache"
- Application -> Service Worker -> Cocher "Mettre à jour lors du chargement" 
  => si on veut que le Svc worker soit misà jour à chaque reload
  => A chaque reload les étapes suivantes sont réexécutées 
    - install
    - activate
    - fetch


### Cas 2 :
- Application -> Service Worker -> Décocher "Mettre à jour lors du chargement"
  => Le service worker ne sera mis à jour que si
    - Il change et qu'aucun onglet ne l'utilise encore.
    ou
    - On lui demande de forcer avec "self.skipWaiting();" durant la phase d'install


