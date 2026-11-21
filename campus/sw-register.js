/* Secure T campus: opt-in to the existing same-origin offline cache.
   Works from a deep link without first visiting the campus homepage.
   No network calls to third parties and no user telemetry. */
(() => {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return;
  const url = new URL('sw.js', document.currentScript.src);
  navigator.serviceWorker.register(url.href, {scope:new URL('./', url.href).href}).catch(() => {
    // The campus remains usable online without a service worker.
  });
})();
