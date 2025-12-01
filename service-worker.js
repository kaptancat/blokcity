
const CACHE_NAME = 'grand-city-v7-cache-v1';
const urlsToCache = [
  '/',
  'index.html',
  'index.tsx',
  'App.tsx',
  'types.ts',
  'hooks/useCityState.ts',
  'services/audioService.ts',
  'components/CityBackground.tsx',
  'components/Dashboard.tsx',
  'components/DemolitionView.tsx',
  'components/GameCanvas.tsx',
  'components/MarketModal.tsx',
  'components/MarsBackground.tsx',
  'components/MarsJourney.tsx',
  'metadata.json',
  'icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});
