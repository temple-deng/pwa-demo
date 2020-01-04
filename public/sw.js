const cacheName = 'cache-v1';

const v1CacheFiles = [
    '/offline.html'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName)
            .then((cache) => {
                console.log('ServiceWorker Pre-caching offline page');
                return cache.addAll(v1CacheFiles);
            })
    )
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.mode !== 'navigate') {
        // Not a page navigation, bail.
        return;
    }
    e.respondWith(
        fetch(e.request)
            .catch(() => {
                return caches.open(cacheName)
                    .then((cache) => {
                        return cache.match('offline.html');
                    });
            })
    );
})