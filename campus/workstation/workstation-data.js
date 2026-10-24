/* Datos 100 % ficticios. Las IP 192.0.2.0/24, 198.51.100.0/24 y
   203.0.113.0/24 están reservadas para documentación (RFC 5737).
   No representan eventos de usuarios ni permiten acceso externo. */
window.SecureTWorkstationCases = Object.freeze([
  {
    id: "auth", code: "ST-SOC-001", area: "Identidad", level: "Prioridad media",
    name: "Acceso después de fallos",
    description: "Cinco intentos fallidos preceden a una autenticación correcta en una cuenta de pruebas.",
    task: "¿Es un incidente confirmado o una anomalía que requiere contexto?",
    conclusion: "La secuencia merece investigación; por sí sola no demuestra compromiso. Correlaciona identidad, dispositivo y MFA antes de escalar.",
    response: "verify",
    lesson: "Un evento de éxito posterior a errores puede ser un usuario legítimo, una prueba autorizada o un ataque. Comprueba fuente, intervalos y factores de autenticación; no hagas afirmaciones sin correlación.",
    paths: ["/cases/auth.log"],
    indicators: ["5 fallos de acceso", "1 autenticación correcta", "MFA no registrado en el conjunto de datos"],
    logs: [
      "2026-09-18T09:14:01Z auth user=alumno_demo src=198.51.100.24 result=FAILED reason=bad_password",
      "2026-09-18T09:14:05Z auth user=alumno_demo src=198.51.100.24 result=FAILED reason=bad_password",
      "2026-09-18T09:14:08Z auth user=alumno_demo src=198.51.100.24 result=FAILED reason=bad_password",
      "2026-09-18T09:14:12Z auth user=alumno_demo src=198.51.100.24 result=FAILED reason=bad_password",
      "2026-09-18T09:14:16Z auth user=alumno_demo src=198.51.100.24 result=FAILED reason=bad_password",
      "2026-09-18T09:14:22Z auth user=alumno_demo src=198.51.100.24 result=SUCCESS method=password",
      "2026-09-18T09:15:02Z iam user=alumno_demo src=198.51.100.24 event=session_created risk=unverified"
    ]
  },
  {
    id: "mail", code: "ST-SOC-002", area: "Correo", level: "Prioridad media",
    name: "Mensaje con señales de phishing",
    description: "Un correo sintético solicita verificar un pago mediante un enlace que no coincide con el remitente.",
    task: "¿Cómo contener la exposición sin visitar el enlace?",
    conclusion: "Preserva la cabecera, comprueba reputación solo por procesos autorizados y somete el mensaje a cuarentena. El conjunto de datos no demuestra ejecución ni robo de datos.",
    response: "quarantine",
    lesson: "Una incongruencia entre el remitente visible y los encabezados es una señal, no una prueba definitiva. No visites el enlace, no descargues adjuntos y protege la cadena de custodia.",
    paths: ["/cases/mail.log"],
    indicators: ["Fallo de autenticación SPF", "Dominio visible diferente al destino", "No consta clic ni descarga"],
    logs: [
      "2026-09-19T11:30:00Z mail id=sim-204 to=staff-demo@example.org from=invoice@example.org subject=Pago_pendiente",
      "2026-09-19T11:30:00Z mail id=sim-204 reply-to=verify@payments-demo.invalid spf=fail dkim=none",
      "2026-09-19T11:30:00Z mail id=sim-204 link=not-a-real-url.invalid/pago display=example.org/pagos",
      "2026-09-19T11:30:02Z gateway id=sim-204 verdict=suspicious action=delivered_to_training_inbox",
      "2026-09-19T11:31:15Z telemetry id=sim-204 clicked=unknown downloads=unknown"
    ]
  },
  {
    id: "integrity", code: "ST-SOC-003", area: "Integridad", level: "Prioridad alta",
    name: "Cambio de permisos inusual",
    description: "La cuenta de laboratorio ha obtenido un rol privilegiado fuera de una ventana de cambios autorizada.",
    task: "¿Qué evidencias deben conservarse y qué límites tiene la conclusión?",
    conclusion: "Preserva logs de autorización y cambios, valida el ticket de cambio y utiliza el procedimiento autorizado para revertir privilegios si procede.",
    response: "preserve",
    lesson: "Los cambios de privilegios requieren trazabilidad. La ausencia de ticket en estos registros no significa que no exista: valida el sistema de cambios y coordina con el equipo responsable antes de intervenir.",
    paths: ["/cases/integrity.log"],
    indicators: ["Nuevo rol de administración", "Cambio fuera de ventana", "No hay ticket asociado en el dataset"],
    logs: [
      "2026-09-20T22:08:13Z iam actor=svc-demo target=alumno_demo action=grant_role role=admin result=SUCCESS",
      "2026-09-20T22:08:14Z changes actor=svc-demo ticket=NOT_FOUND window=OUTSIDE",
      "2026-09-20T22:09:30Z audit target=alumno_demo privileged_action=NONE_OBSERVED",
      "2026-09-20T22:10:00Z monitor event=role_change status=requires_review"
    ]
  }
]);
window.SecureTWorkstationReadme = [
  "SECURE T WORKSTATION — SIMULADOR PARA ALUMNOS",
  "===========================================",
  "Terminal ficticia con comandos limitados y archivos sintéticos.",
  "NO hay Bash, PowerShell, herramientas ofensivas, internet ni sistemas externos.",
  "",
  "Rutas: /cases/auth.log, /cases/mail.log, /cases/integrity.log",
  "Comandos: help, pwd, ls, cat, grep, head, timeline, case, whoami, clear",
  "Ejemplo: grep FAILED /cases/auth.log",
  "",
  "Método: observar, formular hipótesis, comprobar, recomendar, documentar.",
  "Al acabar, documenta los casos en Cuaderno y exporta la evidencia.",
  "La revisión automática no es un certificado ni una evaluación profesional."
].join("\n");