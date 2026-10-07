// Ao mudar qualquer arquivo do app, aumente a versão para os celulares baixarem a atualização.
const VERSION = "gastos-v1";
const FILES = [
  "./", "index.html", "manifest.webmanifest",
  "fonts/sg-400.woff2", "fonts/sg-600.woff2", "fonts/sg-700.woff2", "fonts/sg-800.woff2",
  "icons/icon-192.png", "icons/icon-512.png", "icons/maskable-512.png", "icons/apple-touch-icon.png"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (e.request.mode === "navigate") {
    // Página: tenta a rede (para pegar atualizações) e cai no cache sem internet.
    e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put("index.html", c)); return r; })
      .catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
