var cacheName = 'sAsCompanionCache_v1';
var contentToCache = [
    'index.html',
    'manifest.webmanifest',
    'offline-worker.js',
    'src.19864527.js',
    'RobotoLight.f5f866fd.ttf',
    'apple-touch-icon.eed28663.png',
    'favicon-16x16.ec8e0dab.png',
    'favicon-32x32.02526716.png',
    'mstile-150x150.788703c1.png',
    'safari-pinned-tab.302050d3.svg'

];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
    console.log('[Service Worker] Installed');
});

self.addEventListener('fetch',() => console.log("[Service Worker] Fetch mocked"));

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheName) {
                    return caches.delete(key);
                }
            }));
        })
    );
});