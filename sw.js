/* Service worker mínimo de Economía del Hogar.
   Solo sirve para que la app (el código, nunca tus datos) se abra sin conexión:
   red primero; si no hay red, la última copia guardada. No cachea nada de otros sitios (p. ej. la API de GitHub). */
const CACHE = "economia-hogar-app";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    // «no-cache»: siempre se pregunta al servidor si hay versión nueva (GitHub Pages pide guardar 10 minutos)
    fetch(r.url, { cache: "no-cache", credentials: "same-origin" })
      .then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(r, copy)); } return res; })
      .catch(() => caches.match(r).then(m => m || caches.match("./")))
  );
});
