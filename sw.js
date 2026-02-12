const CACHE_NAME = 'directorio-v1';
const ASSETS = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fuse.js/6.6.2/fuse.min.js'
];

// 1. Instalación: Guardar la carcasa de la app
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 2. Interceptación de peticiones
self.addEventListener('fetch', (e) => {
  e.respondWith(
    (async () => {
      try {
        // Intentar red primero (para tener datos frescos)
        const response = await fetch(e.request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(e.request, response.clone()); // Actualizar caché
        return response;
      } catch (error) {
        // Si no hay red, devolver caché
        const cachedResponse = await caches.match(e.request);
        if (cachedResponse) return cachedResponse;
        throw error;
      }
    })()
  );
});