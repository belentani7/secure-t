/* Secure T: store the four published courses locally; no account or telemetry. */
(() => {
  'use strict';
  const button = document.getElementById('save-offline-courses');
  const status = document.getElementById('offline-courses-status');
  if (!button || !status) return;
  if (!('serviceWorker' in navigator) || !window.isSecureContext) {
    button.disabled = true;
    status.textContent = 'Disponible solo en HTTPS o localhost con un navegador compatible.';
    return;
  }
  button.addEventListener('click', async () => {
    button.disabled = true;
    status.textContent = 'Preparando descarga de los cuatro cursos…';
    try {
      const registration = await navigator.serviceWorker.ready;
      if (!registration.active) throw new Error('Service worker no disponible');
      const channel = new MessageChannel();
      channel.port1.onmessage = ({ data }) => {
        if (!data || typeof data !== 'object') return;
        if (data.type === 'progress') {
          status.textContent = 'Preparando recursos ' + data.completed + '/' + data.total + ' · ' + data.failed + ' pendientes.';
        } else if (data.type === 'complete') {
          status.textContent = data.failed === 0
            ? 'Listo: ' + data.total + ' recursos de los cuatro cursos disponibles sin conexión en este navegador.'
            : 'Descarga parcial: ' + (data.total - data.failed) + '/' + data.total + ' recursos guardados. Conecta a internet y vuelve a intentarlo.';
          button.disabled = false;
          channel.port1.close();
        } else if (data.type === 'error') {
          status.textContent = 'No se pudo guardar el material. Comprueba la conexión y vuelve a intentarlo.';
          button.disabled = false;
          channel.port1.close();
        }
      };
      registration.active.postMessage({ type: 'SECURE_T_SAVE_COURSES' }, [channel.port2]);
    } catch (_) {
      status.textContent = 'El modo offline no está listo. Recarga la página con conexión e inténtalo otra vez.';
      button.disabled = false;
    }
  });
})();
