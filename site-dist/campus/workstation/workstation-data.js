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
  },
  {
    id: "cloud", code: "ST-CLOUD-004", area: "Cloud", level: "Prioridad alta",
    name: "Almacenamiento excesivamente público",
    description: "Un recurso de laboratorio fue etiquetado como público durante una prueba de configuración. No se ha observado descarga de datos.",
    task: "¿Cómo reducir la exposición de forma trazable y confirmar su alcance?",
    conclusion: "Valida la titularidad y el cambio autorizado, aplica mínimo privilegio, preserva el estado previo y revisa accesos registrados. Evita afirmar una filtración sin pruebas.",
    response: "restrict",
    lesson: "La política de acceso es una condición de riesgo; para demostrar exposición efectiva se necesitan evidencias adicionales. Primero coordina con la persona responsable del recurso y aplica el procedimiento de contención.",
    paths: ["/cases/cloud.log"],
    indicators: ["Permiso público detectado", "Objeto de demostración sin datos reales", "No hay evidencia de lectura externa"],
    logs: [
      "2026-09-21T07:10:00Z cloud asset=training-bucket-01 policy=public-read actor=svc-demo",
      "2026-09-21T07:10:03Z inventory asset=training-bucket-01 classification=synthetic",
      "2026-09-21T07:12:06Z policy-check asset=training-bucket-01 result=EXCESSIVE_PERMISSION",
      "2026-09-21T07:14:08Z access-audit asset=training-bucket-01 external_reads=UNKNOWN"
    ]
  },
  {
    id: "ai", code: "ST-AI-005", area: "IA segura", level: "Prioridad media",
    name: "Instrucción no confiable en documento",
    description: "Un documento externo de entrenamiento contiene texto que intenta cambiar las prioridades del asistente de estudio.",
    task: "¿Por qué el contenido recuperado no debe convertirse en una instrucción para la IA?",
    conclusion: "Trata el documento como datos de baja confianza, delimita sus instrucciones, comprueba procedencia y valida que el tutor conserva sus restricciones.",
    response: "review",
    lesson: "La inyección de instrucciones aparece cuando datos externos intentan dirigir el comportamiento del sistema. Separa las instrucciones privilegiadas de la información recuperada, prueba la resistencia y limita el acceso a herramientas.",
    paths: ["/cases/ai.log"],
    indicators: ["Texto imperativo en una fuente recuperada", "El asistente no ejecutó acciones", "Origen del documento no verificado"],
    logs: [
      "2026-09-22T10:00:00Z rag source=training-note-02 trust=unverified",
      "2026-09-22T10:00:02Z rag snippet=NOTICE_training_only_revise_assistant_priorities risk=PROMPT_INJECTION_INDICATOR",
      "2026-09-22T10:00:03Z tutor input_type=retrieved_data tools_allowed=none",
      "2026-09-22T10:00:04Z tutor result=BLOCKED_UNTRUSTED_INSTRUCTION external_actions=0"
    ]
  },
  {
    id: "privacy", code: "ST-GRC-006", area: "Privacidad", level: "Prioridad media",
    name: "Conservación de datos sin justificar",
    description: "Una tabla de actividad ficticia conserva identificadores de alumnos más tiempo del definido en la política interna.",
    task: "¿Qué evidencias y responsabilidades requiere una corrección con privacidad por diseño?",
    conclusion: "Identifica finalidad y base aplicable, confirma periodos de retención con la política vigente, reduce lo innecesario y documenta la revisión con responsables autorizados.",
    response: "minimize",
    lesson: "No borres datos indiscriminadamente: puede haber obligaciones de conservación. Documenta la finalidad, minimiza lo no necesario, respeta las solicitudes de derechos y conserva evidencia de gobernanza sin revelar datos personales.",
    paths: ["/cases/privacy.log"],
    indicators: ["Retención supera periodo interno", "IDs completamente ficticios", "Sin evaluación del responsable de datos"],
    logs: [
      "2026-09-23T13:00:00Z privacy dataset=activity_demo records=17 classification=synthetic",
      "2026-09-23T13:00:02Z privacy retention_defined=30d retention_observed=120d",
      "2026-09-23T13:00:04Z privacy review_owner=UNASSIGNED action=REVIEW_REQUIRED",
      "2026-09-23T13:00:05Z privacy disclosure=NONE_OBSERVED"
    ]
  }
]);
window.SecureTWorkstationReadme = [
  "SECURE T WORKSTATION — SIMULADOR PARA ALUMNOS",
  "===========================================",
  "Terminal ficticia con comandos limitados y archivos sintéticos.",
  "NO hay Bash, PowerShell, herramientas ofensivas, internet ni sistemas externos.",
  "",
  "Rutas: /cases/{auth,mail,integrity,cloud,ai,privacy}.log",
  "Comandos: help, pwd, ls, cat, grep, head, timeline, case, whoami, clear",
  "Ejemplo: grep FAILED /cases/auth.log",
  "",
  "Método: observar, formular hipótesis, comprobar, recomendar, documentar.",
  "Al acabar, documenta los casos en Cuaderno y exporta la evidencia.",
  "La revisión automática no es un certificado ni una evaluación profesional."
].join("\n");