// Service Worker
self.addEventListener('push', e => {
  self.registration.showNotification(e.data.text())
})
