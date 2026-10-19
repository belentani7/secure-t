/* Authored semester 4, part 1. */
(function(){'use strict';const catalog={
  "ST-041/0": {
    "read": {
      "pt": "Segmentar uma rede significa separar ativos segundo função e risco. VLANs, sub-redes e firewalls criam fronteiras técnicas, mas a segurança real depende de políticas entre segmentos. Os fluxos autorizados devem ser documentados e verificados.",
      "es": "Segmentar una red separa activos según función y riesgo. VLAN, subredes y cortafuegos crean límites, pero la seguridad real depende de las políticas entre zonas. Los flujos autorizados deben documentarse y comprobarse.",
      "en": "Network segmentation separates assets by function and risk. VLANs, subnets, and firewalls create boundaries, but real security depends on policies between zones. Permitted flows must be documented and verified."
    },
    "exercise": {
      "pt": "Desenhe segmentos fictícios de alunos, secretaria e laboratórios. Liste três conexões permitidas e duas bloqueadas e como validaria a política num simulador.",
      "es": "Dibuja segmentos ficticios de estudiantes, administración y laboratorios. Indica conexiones permitidas y bloqueadas y cómo probarías la política.",
      "en": "Draw fictional learner, administration, and lab network segments. Identify permitted and blocked connections and a simulation-based validation procedure."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-041/1": {
    "read": {
      "pt": "Zero Trust é uma abordagem que verifica identidade, contexto, dispositivo e direitos de acesso antes de operações relevantes. A localização numa rede interna não concede confiança automática. A política deve negar ações sem evidência de autorização.",
      "es": "Confianza cero verifica identidad, contexto, dispositivo y permisos antes de cada operación relevante. Estar dentro de la red no concede confianza automática. Las solicitudes sin autorización deben rechazarse.",
      "en": "Zero Trust evaluates identity, context, device posture, and permissions for relevant actions. Internal network location grants no automatic trust. Operations without evidence of authorization must be denied."
    },
    "exercise": {
      "pt": "Elabore uma matriz de permissões para aluno, professor e auditor sobre notas e módulos. Defina casos de acesso negado sem identidade ou com dados alheios.",
      "es": "Construye una matriz de alumno, profesor y auditor para notas y módulos. Define rechazos cuando falta identidad o el registro pertenece a otra persona.",
      "en": "Build a learner, faculty, and auditor access matrix for grades and lessons. Include denial tests for missing identity and other people's records."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-041/2": {
    "read": {
      "pt": "Uma VPN cria um túnel protegido entre pontos para atravessar redes menos confiáveis. Algoritmos, gestão de chaves, autenticação e rotas influenciam o resultado. Uma VPN não torna seguro um dispositivo comprometido nem valida todo o conteúdo transmitido.",
      "es": "Una VPN crea un túnel protegido entre extremos sobre redes menos fiables. Los algoritmos, las claves, la autenticación y las rutas determinan la seguridad. No protege por sí sola un dispositivo comprometido ni valida el contenido.",
      "en": "A VPN establishes a protected tunnel between endpoints over less-trusted networks. Algorithms, key management, authentication, and routing matter. A tunnel does not repair a compromised endpoint or validate application content."
    },
    "exercise": {
      "pt": "Compare num desenho uma VPN corporativa e um proxy com controlo de identidade. Documente requisitos de registo, revogação, privacidade e limitações.",
      "es": "Compara una VPN corporativa y un proxy de identidad. Documenta registros, revocación, privacidad y límites de cada opción.",
      "en": "Compare a corporate VPN with an identity-aware proxy. Document logging, revocation, privacy implications, and design limitations."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-041/3": {
    "read": {
      "pt": "Projetar controlos de segurança começa com os ativos a proteger e as ameaças plausíveis. Cada controlo precisa de responsável, finalidade, forma de verificação e plano de recuperação. Defesa em profundidade combina prevenção, deteção e resposta.",
      "es": "El diseño de controles comienza identificando activos y amenazas. Cada control necesita propietario, propósito, verificación y plan de recuperación. La defensa en profundidad combina prevención, detección y respuesta.",
      "en": "Security control design begins with valuable assets and plausible threats. Every control needs an owner, objective, verification plan, and recovery path. Defense in depth combines prevention, detection, and response."
    },
    "exercise": {
      "pt": "Crie um catálogo de quatro controlos para biblioteca universitária simulada, especificando risco, proprietário, evidência de teste e reversão.",
      "es": "Crea cuatro controles para una biblioteca universitaria simulada con riesgos, responsables, pruebas y reversión.",
      "en": "Create four controls for a fictional university library, naming risk, owner, test evidence, and rollback."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-042/0": {
    "read": {
      "pt": "Logs estruturados representam eventos com campos como instante UTC, origem, ação e resultado. Facilitam correlação, mas só são seguros com minimização de dados. Senhas, tokens e informação pessoal nunca devem ser registados diretamente.",
      "es": "Los registros estructurados representan eventos mediante hora UTC, origen, acción y resultado. Facilitan correlación, pero exigen minimizar datos. Nunca deben incluir contraseñas, tokens o información personal sin protección.",
      "en": "Structured logs represent events through fields such as UTC timestamp, origin, action, and outcome. They support correlation but require data minimization. Passwords, tokens, and sensitive identities do not belong in cleartext logs."
    },
    "exercise": {
      "pt": "Crie quatro eventos JSON sintéticos com campos coerentes. Demonstre uma rotina de ocultação de Bearer tokens e um teste que prove a ausência deles.",
      "es": "Crea cuatro eventos JSON ficticios. Demuestra cómo ocultar un token Bearer y comprobar que no aparezca en los registros.",
      "en": "Create four synthetic JSON events. Show Bearer-token redaction and a test that verifies the token is not emitted."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-042/1": {
    "read": {
      "pt": "Um SIEM agrega telemetria para pesquisa, correlação e alertas de segurança. Qualidade de dados, regras, contexto e procedimentos humanos determinam a eficácia. Uma grande quantidade de alertas sem triagem não é sinónimo de proteção.",
      "es": "Un SIEM reúne telemetría para búsquedas, correlación y alertas. La calidad de los datos, reglas, contexto y respuesta humana determina su utilidad. Tener muchas alertas no garantiza una buena protección.",
      "en": "A SIEM aggregates telemetry for search, correlation, and alerting. Data quality, rules, context, and human response procedures determine effectiveness. A flood of untriaged alerts does not equal sound protection."
    },
    "exercise": {
      "pt": "Construa uma regra fictícia para falhas de login seguidas de sucesso. Defina tempo, limiar, evidência auxiliar e procedimento de triagem autorizado.",
      "es": "Diseña una regla ficticia para fallos de inicio seguidos de éxito. Define ventana, umbral, evidencia y triaje autorizado.",
      "en": "Design a fictional alert for failed logins followed by success. Define time window, threshold, contextual evidence, and authorized triage."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-042/2": {
    "read": {
      "pt": "Uma regra excessivamente ampla produz falsos positivos, fadiga e perda de confiança nos alertas. Ajustar exige dados representativos e medir também falsos negativos. Melhorar uma métrica não pode significar esconder eventos importantes.",
      "es": "Las reglas muy amplias producen falsos positivos y fatiga. El ajuste exige datos representativos y análisis de falsos negativos. Mejorar cifras nunca debe significar ocultar amenazas importantes.",
      "en": "Overly broad rules create false positives and alert fatigue. Tuning needs representative data and false-negative analysis. Improving one metric must not mean hiding significant threats."
    },
    "exercise": {
      "pt": "Analise dez alertas sintéticos identificados como verdadeiros ou falsos. Calcule precisão e proponha uma alteração com teste de regressão.",
      "es": "Evalúa diez alertas sintéticas etiquetadas, calcula precisión y propone un cambio con prueba de regresión.",
      "en": "Evaluate ten labeled synthetic alerts, calculate precision, and propose one change plus a regression test."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-042/3": {
    "read": {
      "pt": "A triagem identifica factos, ativos afetados, possível impacto e incertezas antes de escalar um incidente. É necessário preservar provas e respeitar processos autorizados. Uma hipótese plausível não deve ser relatada como invasão confirmada.",
      "es": "El triaje establece hechos, activos afectados, impacto e incertidumbres antes de escalar. Hay que preservar evidencias y seguir procesos autorizados. Una hipótesis no equivale a una intrusión confirmada.",
      "en": "Incident triage establishes facts, affected assets, possible impact, and uncertainties before escalation. Evidence preservation and authorized procedures matter. A plausible hypothesis is not confirmed compromise."
    },
    "exercise": {
      "pt": "Com quatro eventos sintéticos, escreva uma ficha de triagem com duas hipóteses, evidências em falta, prioridade e próximo responsável.",
      "es": "Con cuatro sucesos ficticios crea una ficha con hipótesis, evidencia faltante, prioridad y responsable.",
      "en": "Using four fictional events, create a triage sheet with hypotheses, missing evidence, priority, and next owner."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-043/0": {
    "read": {
      "pt": "Autorização decide se um sujeito pode executar ação num recurso específico. Um utilizador autenticado não adquire acesso automático ao progresso de outros alunos. Validação de propriedade no servidor e negação por defeito impedem classes de falhas IDOR.",
      "es": "La autorización decide si una identidad puede actuar sobre un recurso concreto. Una sesión válida no permite leer datos de otros alumnos. Comprobación de propiedad en servidor y denegación por defecto reducen fallos IDOR.",
      "en": "Authorization decides whether a subject can perform an action on a specific resource. Authentication does not grant access to another learner's progress. Server-side ownership checks and default deny prevent IDOR-class failures."
    },
    "exercise": {
      "pt": "Desenhe seis testes de RBAC numa API fictícia: registo próprio, alheio, identidade ausente, sessão expirada e privilégios reduzidos.",
      "es": "Diseña seis casos RBAC de API ficticia, incluidos registro propio, ajeno, identidad ausente y sesión caducada.",
      "en": "Design six fictional RBAC API cases, including own and foreign records, missing identity, and expired session."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-043/1": {
    "read": {
      "pt": "Abuso de API inclui pedidos em excesso, acesso indevido e uso inesperado de funções. Autenticação, validação, quotas e observabilidade complementam-se. Um limitador que elimina contadores ao atingir capacidade abre uma oportunidade de contorno.",
      "es": "El abuso de API incluye exceso de tráfico, recursos no autorizados y funciones imprevistas. Identidad, validación, cuotas y observabilidad se complementan. Vaciar todos los contadores por saturación puede anular la defensa.",
      "en": "API abuse includes excessive traffic, unauthorized resource access, and unexpected feature use. Identity, validation, quotas, and monitoring work together. Clearing the quota table when full can create an attacker-friendly reset."
    },
    "exercise": {
      "pt": "Especifique limite de dez perguntas por minuto num tutor simulado e testes de HTTP 429, diferentes identidades e rejeição segura com armazenamento cheio.",
      "es": "Define diez preguntas por minuto en un tutor ficticio y pruebas de 429, múltiples identidades y rechazo seguro bajo saturación.",
      "en": "Specify a ten-per-minute tutor quota and test HTTP 429, multiple identities, and safe handling of full quota storage."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-043/2": {
    "read": {
      "pt": "Dependências externas podem introduzir riscos sem alterações diretas no código. Versões fixadas, lockfiles, inventário SBOM e revisão de manutenção ajudam a identificar e corrigir problemas. Atualizações devem atravessar testes e revisão de licenças.",
      "es": "Las dependencias externas introducen riesgos incluso sin cambios propios. Versiones fijadas, lockfiles, SBOM y revisión de mantenimiento ayudan a controlarlos. Actualizar requiere pruebas y licencias revisadas.",
      "en": "External dependencies create risks even when first-party code is unchanged. Pinned versions, lockfiles, SBOMs, and maintenance reviews help manage exposure. Upgrades need testing and license review."
    },
    "exercise": {
      "pt": "Monte um SBOM inventado de cinco pacotes com versões e licenças. Explique critérios para decidir qual vulnerabilidade corrigiria primeiro.",
      "es": "Prepara un SBOM inventado con cinco paquetes, versiones y licencias y justifica prioridades de mitigación.",
      "en": "Create a fictional SBOM of five packages with versions and licenses, explaining how to prioritize a vulnerability fix."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-043/3": {
    "read": {
      "pt": "Testes automatizados de segurança verificam contratos observáveis: validação de entradas, negação de acesso, ocultação de segredos e recuperação. Mocks não cobrem todos os riscos, exigindo testes de integração e navegador. CI verde não elimina revisão humana.",
      "es": "Las pruebas de seguridad automatizadas comprueban validación, autorizaciones, secretos y errores. Los mocks no cubren todas las situaciones; integración y navegador son necesarios. CI verde no sustituye revisión humana.",
      "en": "Automated security tests check observable contracts: validation, access denial, secret redaction, and recovery. Mocks cannot cover every risk, so integration and browser tests matter. Green CI does not replace human review."
    },
    "exercise": {
      "pt": "Prepare uma matriz de testes para um campus fictício cobrindo entradas inválidas, objetos de outras pessoas, quotas e falhas de rede.",
      "es": "Prepara pruebas de un campus ficticio con datos inválidos, registros ajenos, cuotas y fallos de red.",
      "en": "Prepare a fictional campus test matrix covering invalid inputs, other users' records, quotas, and network failures."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  }
};if(!window.SecureTStudyGuides)return;for(const [key,value] of Object.entries(catalog)){if(!key.startsWith('ST-04')||Object.prototype.hasOwnProperty.call(window.SecureTStudyGuides,key))continue;window.SecureTStudyGuides[key]=value;}})();
