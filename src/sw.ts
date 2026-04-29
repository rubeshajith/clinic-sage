/// <reference lib="webworker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';

declare const self: ServiceWorkerGlobalScope;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title ?? 'Clinic Sage';
  const options: NotificationOptions = {
    body: data.body ?? 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: data.url ?? '/',

  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'view') {
    event.waitUntil(self.clients.openWindow(event.notification.data));
  }
});

// Handle local notifications triggered from the app
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_NOTIFICATION') {
    const { title, body, url } = event.data.payload;
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      data: url ?? '/',
    });
  }
});
