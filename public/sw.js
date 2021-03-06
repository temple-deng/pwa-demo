const fileCache = 'file-cache-v4';
const dataCache = 'data-cache-v4';

const v2CacheFiles = [
    './',
    './index.html',
    './admin.html',
    './scripts/vconsole.min.js',
    './scripts/admin.js',
    './scripts/app.js',
    './scripts/install.js',
    './scripts/register.js',
    './scripts/luxon-1.11.4.js',
    './styles/style.css',
    './styles/admin.css',
    './images/add.svg',
    './images/clear-day.svg',
    './images/clear-night.svg',
    './images/cloudy.svg',
    './images/fog.svg',
    './images/hail.svg',
    './images/install.svg',
    './images/partly-cloudy-day.svg',
    './images/partly-cloudy-night.svg',
    './images/rain.svg',
    './images/refresh.svg',
    './images/sleet.svg',
    './images/snow.svg',
    './images/thunderstorm.svg',
    './images/tornado.svg',
    './images/wind.svg',
];

self.addEventListener('install', (e) => {
    self.skipWaiting();
    e.waitUntil(
        caches.open(fileCache)
            .then((cache) => {
                console.log('ServiceWorker Pre-caching offline page');
                return cache.addAll(v2CacheFiles);
            })
    )
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== fileCache && key !== dataCache) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => {
            return clients.claim();
        })
    );
});

self.addEventListener('fetch', (e) => {
    if (e.request.url.includes('/forecast')) {
        console.log('[Service Worker] Fetch (data)', e.request.url);
        e.respondWith(
            caches.open(dataCache).then((cache) => {
                return fetch(e.request)
                    .then((response) => {
                        if (response.status === 200) {
                            cache.put(e.request.url, response.clone());
                        }
                        return response;
                    }).catch(() => {
                        return cache.match(e.request);
                    });
            }));
        return;
    }
    e.respondWith(
        caches.open(fileCache).then((cache) => {
            return cache.match(e.request)
                .then((response) => {
                    return response || fetch(e.request);
                });
        })
    );
});

self.addEventListener('push', (evt) => {
    console.log('Receivce a message from server');
    let options = {};
    let title = '';
    let data = evt.data.text();
    try {
        const jsonData = JSON.parse(data);
        title = jsonData.title;
        options = Object.assign(options, jsonData);
    } catch (e) {
        title = data;
    }
    console.log(options);
    evt.waitUntil(
        self.registration.showNotification(title || '消息标题', options)
    );
});

self.addEventListener('notificationclick', (evt) => {
    evt.notification.close();
});