// Service Worker de secure-t.
//
// Este archivo hace tres cosas concretas y ninguna mas. Es corto a proposito:
// un service worker es codigo que se ejecuta en segundo plano y sobrevive a la
// pestana, asi que cuanto menos haga, menos puede fallar en silencio.

// INSTALL: activa la version nueva sin esperar a que el usuario cierre todas
// las pestanas. En un curso online, pedir "cierra el navegador para actualizar"
// es pedirle a alguien que abandone una leccion a medias.
self.addEventListener("install", () => self.skipWaiting());

// ACTIVATE: toma el control de las pestanas ya abiertas.
// Va junto con skipWaiting(): sin clients.claim(), la pestana actual seguiria
// usando el service worker viejo hasta recargar, y el usuario veria una version
// distinta segun la pestana. Eso genera dudas de "por que aqui sale otra cosa".
self.addEventListener("activate", event => event.waitUntil(self.clients.claim()));

// MENSAJES DESDE LA PAGINA: notificaciones de tarea completada.
//
// POR QUE AQUI Y NO EN LA PAGINA: una leccion puede tardar, y el alumno cambia
// de pestana mientras espera. Si la notificacion se lanzara desde el hilo de la
// pagina, dejaria de avisar en cuanto la pestana pasa a segundo plano.
// El service worker sigue vivo y puede avisar igual.
//
// La guarda "self.registration.showNotification" comprueba que el navegador
// soporta notificaciones antes de usarlas: si no, este bloque no hace nada
// en vez de lanzar un error.
//
// "tag" agrupa las notificaciones por tarea: si se completan varias veces, se
// reemplaza la anterior en lugar de llenar la pantalla de avisos repetidos.
self.addEventListener("message", event => {
  if (event.data?.type === "TASK_COMPLETED" && self.registration.showNotification) {
    self.registration.showNotification(event.data.title || "Secure T", { body: event.data.body || "Tarea completada", tag: event.data.taskId || "secure-t-task" });
  }
});