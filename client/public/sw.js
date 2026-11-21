self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
self.addEventListener('message', event => {
  if (event.data?.type === 'TASK_COMPLETED' && self.registration.showNotification) {
    self.registration.showNotification(event.data.title || 'Secure T', { body: event.data.body || 'Tarea completada', tag: event.data.taskId || 'secure-t-task' });
  }
});
