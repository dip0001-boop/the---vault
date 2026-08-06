importScripts('/uv/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts(__uv$config.sw);

const uv = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
    // If the request is trying to use the proxy, route it through Ultraviolet
    if (event.request.url.startsWith(location.origin + __uv$config.prefix)) {
        event.respondWith(uv.fetch(event));
    } else {
        // Otherwise, just load the normal site files
        event.respondWith(
            caches.match(event.request).then((cached) => cached || fetch(event.request))
        );
    }
});
