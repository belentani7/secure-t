/* Secure T Mission Control: 100% synthetic educational data. */
window.SecureTMissionControl = Object.freeze({
  "schema": "secure-t.mission-control.v1",
  "cases": [
    {
      "id": "auth",
      "code": "ST-SOC-001",
      "title": "Inicio de sesión tras cinco fallos",
      "topic": "Identidad · SOC",
      "priority": "Media",
      "source": "nist",
      "signals": [
        "5 intentos con resultado FAILED desde 198.51.100.24",
        "1 inicio con resultado SUCCESS desde el mismo origen",
        "No consta verificación MFA en esta muestra"
      ],
      "goal": "Distinguir anomalía de intrusión confirmada y proponer correlación autorizada.",
      "steps": [
        [
          "¿Cuál es la observación verificable?",
          [
            "Cinco fallos y una autenticación exitosa",
            "Robo confirmado de credenciales",
            "Exfiltración de 17 cuentas"
          ],
          0,
          "El registro solo demuestra una secuencia de seis eventos; no prueba autoría ni daño."
        ],
        [
          "¿Qué incertidumbre debes explicitar?",
          [
            "Sabemos que MFA fue omitido",
            "No consta aquí si MFA intervino",
            "Todos los accesos posteriores son maliciosos"
          ],
          1,
          "La falta de telemetría MFA impide concluir cómo se verificó la sesión."
        ],
        [
          "¿Qué actuación proporcional recomendarías?",
          [
            "Atacar el origen remoto",
            "Publicar la contraseña",
            "Correlacionar MFA, dispositivo e identidad mediante canal autorizado"
          ],
          2,
          "Triar con contexto preserva seguridad y reduce falsos positivos."
        ],
        [
          "¿Qué comunicación sería responsable?",
          [
            "Intrusión demostrada",
            "Anomalía observada, investigación abierta sin compromiso confirmado",
            "Cuenta totalmente segura"
          ],
          1,
          "Un parte debe separar hechos, hipótesis y acciones pendientes."
        ]
      ]
    },
    {
      "id": "mail",
      "code": "ST-SOC-002",
      "title": "Correo sospechoso de pago",
      "topic": "Correo · Phishing",
      "priority": "Media",
      "source": "nist",
      "signals": [
        "spf=fail, dkim=none",
        "El dominio visible difiere del enlace",
        "click=UNKNOWN; no consta interacción"
      ],
      "goal": "Preservar cabeceras, contener sin abrir el enlace y evitar inferencias.",
      "steps": [
        [
          "¿Qué hallazgo es verificable?",
          [
            "SPF no pasó y no consta DKIM",
            "El destinatario descargó malware",
            "Se pagó la factura"
          ],
          0,
          "Las cabeceras señalan fallos de autenticación; otros daños no constan."
        ],
        [
          "¿Qué NO sabemos?",
          [
            "Si hubo un clic",
            "Si la cabecera tiene texto",
            "Si el mensaje fue recibido"
          ],
          0,
          "El registro no confirma interacción. Unknown no es false."
        ],
        [
          "¿Qué haces primero?",
          [
            "Abrir el enlace con tu sesión personal",
            "Preservar mensaje y aplicar cuarentena autorizada",
            "Reenviar a toda la clase"
          ],
          1,
          "Una cuarentena coordinada previene exposición y conserva evidencia."
        ],
        [
          "¿Cómo redactarías el aviso?",
          [
            "Peligro confirmado de malware instalado",
            "Mensaje con señales sospechosas; enlace no verificado; seguir protocolo",
            "Todas las cuentas están comprometidas"
          ],
          1,
          "La comunicación debe incluir indicadores y limitaciones."
        ]
      ]
    },
    {
      "id": "integrity",
      "code": "ST-SOC-003",
      "title": "Privilegios fuera de ventana",
      "topic": "IAM · Integridad",
      "priority": "Alta",
      "source": "nist",
      "signals": [
        "grant_role admin result=SUCCESS",
        "window=OUTSIDE; ticket=NOT_FOUND en esta muestra",
        "privileged_action=NONE_OBSERVED"
      ],
      "goal": "Investigar cambios de privilegios manteniendo la cadena de evidencia.",
      "steps": [
        [
          "¿Qué cambió?",
          [
            "Se concedió un rol administrador",
            "La cuenta se borró",
            "Se copiaron expedientes"
          ],
          0,
          "La concesión se observa; no hay uso privilegiado en esta muestra."
        ],
        [
          "¿Qué significa ticket=NOT_FOUND?",
          [
            "Fraude probado",
            "No consta ticket en el registro consultado",
            "No existe ningún sistema de cambios"
          ],
          1,
          "No deduzcas el estado de otros repositorios de tickets."
        ],
        [
          "¿Qué actuación respeta la cadena de custodia?",
          [
            "Eliminar registros para limpiar",
            "Modificar permisos sin registro",
            "Preservar auditoría y coordinar una contención autorizada"
          ],
          2,
          "Mantener trazabilidad permite reconstrucción y revisión."
        ],
        [
          "¿Qué conclusión cabe?",
          [
            "Concesión fuera de ventana que requiere validación",
            "Compromiso confirmado con uso de privilegios",
            "No existe riesgo"
          ],
          0,
          "Anomalía y resultado observado no bastan para una atribución."
        ]
      ]
    },
    {
      "id": "cloud",
      "code": "ST-CLOUD-004",
      "title": "Objeto accesible públicamente",
      "topic": "Cloud · Acceso",
      "priority": "Alta",
      "source": "nist",
      "signals": [
        "policy=public-read",
        "classification=synthetic",
        "external_reads=UNKNOWN"
      ],
      "goal": "Separar configuración insegura, acceso real y respuesta de mínimo privilegio.",
      "steps": [
        [
          "¿Qué riesgo se observa?",
          [
            "Un permiso demasiado amplio",
            "Exfiltración probada de usuarios",
            "El servidor no tiene DNS"
          ],
          0,
          "Una política pública es exposición potencial, no prueba de lectura."
        ],
        [
          "¿Qué evidencia falta?",
          [
            "La existencia del recurso",
            "Si hubo lectura externa",
            "Si la política es public-read"
          ],
          1,
          "La telemetría de lecturas no está disponible en esta muestra."
        ],
        [
          "¿Cómo reducirías el riesgo?",
          [
            "Difundir la URL y credenciales",
            "Ignorar el hallazgo",
            "Contactar con el titular y restringir de forma autorizada"
          ],
          2,
          "Mínimo privilegio, verificación y registro de cambios."
        ],
        [
          "¿Cómo informarías?",
          [
            "Exposición potencial; lecturas no verificadas",
            "Robo masivo confirmado",
            "Los permisos públicos son siempre obligatorios"
          ],
          0,
          "Reconocer incertidumbre evita conclusiones incorrectas."
        ]
      ]
    },
    {
      "id": "ai",
      "code": "ST-AI-005",
      "title": "Instrucción externa en el tutor",
      "topic": "IA · RAG",
      "priority": "Alta",
      "source": "owasp",
      "signals": [
        "trust=unverified en documento recuperado",
        "Texto imperativo para cambiar prioridades",
        "tools_allowed=none; external_actions=0"
      ],
      "goal": "Reconocer prompt injection indirecto y reforzar barreras de autorización.",
      "steps": [
        [
          "¿Cuál es el límite de confianza?",
          [
            "El documento controla el sistema",
            "El contenido recuperado es dato no privilegiado",
            "El usuario externo tiene acceso administrador"
          ],
          1,
          "El material RAG no debe elevarse a instrucciones con autoridad."
        ],
        [
          "¿Qué implica external_actions=0?",
          [
            "La simulación no ejecutó acciones externas",
            "Todos los modelos son invulnerables",
            "El origen es fiable"
          ],
          0,
          "Un resultado puntual no equivale a seguridad universal."
        ],
        [
          "¿Qué mitigación es más robusta?",
          [
            "Dar acceso total a todas las herramientas",
            "Confiar solo en un aviso de prompt",
            "Autorización fuera del modelo, permisos mínimos y aprobación humana"
          ],
          2,
          "Los controles de permisos limitan consecuencias incluso ante manipulación."
        ],
        [
          "¿Qué conclusión documentarías?",
          [
            "El ensayo bloqueó esta instrucción; revisar cobertura y casos límite",
            "El problema ya no existe en ningún sistema",
            "La inyección siempre necesita acceso a red"
          ],
          0,
          "La evaluación debe representar el alcance exacto de la prueba."
        ]
      ]
    },
    {
      "id": "privacy",
      "code": "ST-GRC-006",
      "title": "Retención de eventos excesiva",
      "topic": "Privacidad · RGPD",
      "priority": "Media",
      "source": "gdpr",
      "signals": [
        "retention_defined=30d",
        "retention_observed=120d",
        "review_owner=UNASSIGNED"
      ],
      "goal": "Proponer medidas responsables de conservación limitada sin borrar indebidamente.",
      "steps": [
        [
          "¿Qué incumplimiento del criterio interno aparece?",
          [
            "120 días observados frente a 30 definidos",
            "No hay ninguna cuenta",
            "Se confirmó una filtración"
          ],
          0,
          "La conservación supera el plazo documentado para el caso ficticio."
        ],
        [
          "¿Qué evaluación falta?",
          [
            "El nombre del fichero",
            "Titularidad, finalidad y obligación legal de retención",
            "La hora del evento"
          ],
          1,
          "La licitud y los posibles requisitos de conservación requieren revisión responsable."
        ],
        [
          "¿Qué medida propondrías?",
          [
            "Destruir registros en secreto",
            "Copiar datos a una cuenta personal",
            "Escalar al responsable, revisar plazo y ejecutar una política autorizada"
          ],
          2,
          "Una decisión de minimización debe ser trazable y legalmente fundada."
        ],
        [
          "¿Qué anotación es correcta?",
          [
            "Exceso respecto a política interna; revisión pendiente",
            "Datos filtrados a terceros",
            "Borrado ya completado"
          ],
          0,
          "Distingue la discrepancia observada de su eventual remedio."
        ]
      ]
    }
  ],
  "flashcards": [
    {
      "id": "auth-01",
      "caseId": "auth",
      "front": "Autenticación",
      "back": "Comprobación de que una identidad afirmada corresponde al sujeto."
    },
    {
      "id": "auth-02",
      "caseId": "auth",
      "front": "MFA",
      "back": "Uso de al menos dos factores de categorías distintas para verificar el acceso."
    },
    {
      "id": "auth-03",
      "caseId": "auth",
      "front": "Correlación",
      "back": "Relación de señales de múltiples fuentes antes de concluir."
    },
    {
      "id": "auth-04",
      "caseId": "auth",
      "front": "Falso positivo",
      "back": "Alerta que no representa el evento de riesgo sugerido."
    },
    {
      "id": "auth-05",
      "caseId": "auth",
      "front": "Telemetría ausente",
      "back": "Dato no observado; no equivale a resultado negativo."
    },
    {
      "id": "auth-06",
      "caseId": "auth",
      "front": "Contención",
      "back": "Medida autorizada para limitar el impacto de un incidente."
    },
    {
      "id": "auth-07",
      "caseId": "auth",
      "front": "Registro de acceso",
      "back": "Evidencia temporal de intentos y resultados de autenticación."
    },
    {
      "id": "auth-08",
      "caseId": "auth",
      "front": "Atribución",
      "back": "Asociación de actividad a un actor; exige evidencia adicional."
    },
    {
      "id": "mail-01",
      "caseId": "mail",
      "front": "SPF",
      "back": "Política DNS que autoriza servidores a enviar correo por un dominio."
    },
    {
      "id": "mail-02",
      "caseId": "mail",
      "front": "DKIM",
      "back": "Firma criptográfica que ayuda a validar integridad y dominio firmante."
    },
    {
      "id": "mail-03",
      "caseId": "mail",
      "front": "Phishing",
      "back": "Engaño para obtener información o inducir acciones mediante mensajes."
    },
    {
      "id": "mail-04",
      "caseId": "mail",
      "front": "Cabeceras",
      "back": "Metadatos técnicos del tránsito del correo útiles para triage."
    },
    {
      "id": "mail-05",
      "caseId": "mail",
      "front": "Cuarentena",
      "back": "Separación controlada de mensajes potencialmente dañinos."
    },
    {
      "id": "mail-06",
      "caseId": "mail",
      "front": "Dominio visible",
      "back": "Texto que ve la persona; puede diferir del destino real."
    },
    {
      "id": "mail-07",
      "caseId": "mail",
      "front": "Cadena de custodia",
      "back": "Registro de recopilación, acceso y transferencia de evidencia."
    },
    {
      "id": "mail-08",
      "caseId": "mail",
      "front": "Clic desconocido",
      "back": "Ausencia de prueba sobre interacción; no confirma ni descarta."
    },
    {
      "id": "integrity-01",
      "caseId": "integrity",
      "front": "IAM",
      "back": "Gestión de identidades, accesos y derechos."
    },
    {
      "id": "integrity-02",
      "caseId": "integrity",
      "front": "Mínimo privilegio",
      "back": "Conceder solo permisos indispensables para la tarea."
    },
    {
      "id": "integrity-03",
      "caseId": "integrity",
      "front": "Cambio autorizado",
      "back": "Modificación aprobada, registrada y contextualizada."
    },
    {
      "id": "integrity-04",
      "caseId": "integrity",
      "front": "Ventana de mantenimiento",
      "back": "Periodo previsto para operaciones técnicas autorizadas."
    },
    {
      "id": "integrity-05",
      "caseId": "integrity",
      "front": "Rol administrador",
      "back": "Conjunto de permisos elevados que requiere vigilancia."
    },
    {
      "id": "integrity-06",
      "caseId": "integrity",
      "front": "Integridad de registros",
      "back": "Confianza en que la evidencia no fue alterada indebidamente."
    },
    {
      "id": "integrity-07",
      "caseId": "integrity",
      "front": "Trazabilidad",
      "back": "Capacidad de reconstruir quién hizo qué y cuándo."
    },
    {
      "id": "integrity-08",
      "caseId": "integrity",
      "front": "Preservación",
      "back": "Custodia de artefactos antes de cambios de contención."
    },
    {
      "id": "cloud-01",
      "caseId": "cloud",
      "front": "public-read",
      "back": "Configuración que permite lectura pública de un recurso."
    },
    {
      "id": "cloud-02",
      "caseId": "cloud",
      "front": "Objeto cloud",
      "back": "Unidad de datos almacenada con políticas de acceso."
    },
    {
      "id": "cloud-03",
      "caseId": "cloud",
      "front": "Exposición potencial",
      "back": "Configuración de riesgo sin prueba necesaria de acceso efectivo."
    },
    {
      "id": "cloud-04",
      "caseId": "cloud",
      "front": "Telemetría de lectura",
      "back": "Eventos que ayudan a reconstruir accesos a recursos."
    },
    {
      "id": "cloud-05",
      "caseId": "cloud",
      "front": "Clasificación",
      "back": "Valoración del nivel de sensibilidad de un activo."
    },
    {
      "id": "cloud-06",
      "caseId": "cloud",
      "front": "Titular de recurso",
      "back": "Responsable autorizado para aprobar cambios de acceso."
    },
    {
      "id": "cloud-07",
      "caseId": "cloud",
      "front": "Política de acceso",
      "back": "Reglas que controlan permisos de lectura, escritura y uso."
    },
    {
      "id": "cloud-08",
      "caseId": "cloud",
      "front": "Revocación",
      "back": "Retirada trazable de permisos concedidos."
    },
    {
      "id": "ai-01",
      "caseId": "ai",
      "front": "Prompt injection",
      "back": "Intento de modificar el comportamiento del modelo mediante texto no confiable."
    },
    {
      "id": "ai-02",
      "caseId": "ai",
      "front": "RAG",
      "back": "Generación apoyada en contenido recuperado de fuentes externas."
    },
    {
      "id": "ai-03",
      "caseId": "ai",
      "front": "Límite de confianza",
      "back": "Separación entre datos y órdenes con autoridad."
    },
    {
      "id": "ai-04",
      "caseId": "ai",
      "front": "Excesiva agencia",
      "back": "Permisos o capacidades más amplios que los necesarios."
    },
    {
      "id": "ai-05",
      "caseId": "ai",
      "front": "Salida insegura",
      "back": "Salida de modelo usada sin validar en procesos sensibles."
    },
    {
      "id": "ai-06",
      "caseId": "ai",
      "front": "Herramienta privilegiada",
      "back": "Función con efectos externos que debe autorizarse fuera del modelo."
    },
    {
      "id": "ai-07",
      "caseId": "ai",
      "front": "Aprobación humana",
      "back": "Validación explícita previa a acciones de alto impacto."
    },
    {
      "id": "ai-08",
      "caseId": "ai",
      "front": "Prueba adversarial",
      "back": "Ensayo controlado para detectar fallos con entradas manipuladas."
    },
    {
      "id": "privacy-01",
      "caseId": "privacy",
      "front": "Finalidad",
      "back": "Objetivo legítimo y definido del tratamiento de datos."
    },
    {
      "id": "privacy-02",
      "caseId": "privacy",
      "front": "Minimización",
      "back": "Uso de datos adecuados, pertinentes y limitados a lo necesario."
    },
    {
      "id": "privacy-03",
      "caseId": "privacy",
      "front": "Limitación de conservación",
      "back": "Retener datos solo el tiempo necesario o legalmente requerido."
    },
    {
      "id": "privacy-04",
      "caseId": "privacy",
      "front": "Responsable del tratamiento",
      "back": "Entidad que determina fines y medios del tratamiento."
    },
    {
      "id": "privacy-05",
      "caseId": "privacy",
      "front": "Base jurídica",
      "back": "Condición legal que habilita un tratamiento de datos."
    },
    {
      "id": "privacy-06",
      "caseId": "privacy",
      "front": "Registro de actividades",
      "back": "Documentación del uso de datos y controles pertinentes."
    },
    {
      "id": "privacy-07",
      "caseId": "privacy",
      "front": "Supresión",
      "back": "Eliminación cuando corresponde conforme a la ley aplicable."
    },
    {
      "id": "privacy-08",
      "caseId": "privacy",
      "front": "Dato sintético",
      "back": "Información creada para pruebas, no extraída de personas reales."
    }
  ],
  "references": {
    "nist": {
      "name": "NIST SP 800-61 Rev. 3 · respuesta a incidentes (2025)",
      "url": "https://csrc.nist.gov/pubs/sp/800/61/r3/final"
    },
    "owasp": {
      "name": "OWASP GenAI Top 10 · LLM01:2025",
      "url": "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
    },
    "gdpr": {
      "name": "Reglamento (UE) 2016/679 · art. 5",
      "url": "https://eur-lex.europa.eu/eli/reg/2016/679/oj"
    }
  }
});
