// Serves the "Add shifts to my calendar" file at a real address (…/calendar/<name>.ics).
// iPhone Safari only offers "Add All" for a calendar file that arrives as a normal page load,
// not for one built inside the page, so the page stores the file here and then opens that address.
// Every other request goes straight to the network, untouched.
const CACHE = 'rota-calendar';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin || !url.pathname.includes('/calendar/') || !url.pathname.endsWith('.ics')) return;
  e.respondWith(
    caches.open(CACHE)
      .then(c => c.match(url.pathname))
      .then(r => r || new Response('This calendar file has expired. Go back to the rota and tap “Add shifts to my calendar” again.',
        {status: 404, headers: {'Content-Type': 'text/plain; charset=utf-8'}}))
  );
});
