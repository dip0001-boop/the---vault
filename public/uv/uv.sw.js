importScripts('https://unpkg.com/@titaniumnetwork-dev/ultraviolet@3.2.7/dist/uv.bundle.js');
importScripts('/uv/uv.config.js');
importScripts('https://unpkg.com/@titaniumnetwork-dev/ultraviolet@3.2.7/dist/uv.sw.js');

const uv = new UVServiceWorker();

self.addEventListener('fetch', event => {
  event.respondWith(
    uv.fetch(event)
  );
});
