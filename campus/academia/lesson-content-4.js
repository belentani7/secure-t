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
  },
  "ST-044/0": {
    "read": {
      "pt": "TypeScript explicita contratos e estados de código durante a compilação, mas os tipos deixam de existir quando JavaScript é executado. Dados recebidos de APIs precisam de verificação em runtime. Uniões discriminadas tornam estados de carregamento, sucesso e erro mais previsíveis.",
      "es": "TypeScript define contratos y estados durante la compilación, pero los tipos desaparecen al ejecutar JavaScript. Las entradas de API deben validarse en tiempo real. Las uniones discriminadas permiten modelar carga, éxito y fallo.",
      "en": "TypeScript expresses compile-time contracts and states, but types vanish at runtime. API responses still require validation. Discriminated unions make loading, success, and failure states easier to model and test."
    },
    "exercise": {
      "pt": "Modele um catálogo de cursos com união discriminada de sucesso, carregamento e falha. Descreva onde validaria uma resposta JSON desconhecida.",
      "es": "Modela un catálogo con estados de carga, éxito y error y explica dónde validarías una respuesta JSON desconocida.",
      "en": "Model a course catalog with loading, success, and failure states; explain where an unknown JSON response is validated."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-044/1": {
    "read": {
      "pt": "React permite construir interfaces a partir de componentes com propriedades e estado. Separação coerente de responsabilidades facilita testes e acessibilidade. O estado partilhado deve ter um proprietário claro e efeitos assíncronos devem impedir que respostas antigas substituam resultados recentes.",
      "es": "React compone interfaces con propiedades y estado. Separar responsabilidades ayuda al mantenimiento y a la accesibilidad. El estado compartido necesita un dueño claro, y los efectos deben evitar que una respuesta antigua sobrescriba información actual.",
      "en": "React composes interfaces from components with props and state. Clear boundaries improve maintainability, testing, and accessibility. Shared state should have an obvious owner and asynchronous effects should prevent stale results from replacing new data."
    },
    "exercise": {
      "pt": "Desenhe quatro componentes para uma biblioteca de aulas. Defina quem guarda filtros, resultados e erro e como impedir uma atualização assíncrona obsoleta.",
      "es": "Dibuja cuatro componentes para una biblioteca. Define dónde viven filtros, resultados y errores y cómo descartar respuestas obsoletas.",
      "en": "Diagram four components for a lecture library. Specify where filters, results, and errors live and how to discard stale asynchronous responses."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-044/2": {
    "read": {
      "pt": "Um servidor Node recebe pedidos e deve verificar identidade, autorização, formatos e limites antes de operar. Erros precisam de respostas claras sem expor detalhes internos. Chaves de serviços externos pertencem ao servidor e nunca ao código entregue ao navegador.",
      "es": "Un servidor Node debe comprobar identidad, autorización, formatos y límites antes de actuar. Los errores necesitan respuestas consistentes sin filtrar detalles internos. Las claves externas solo deben residir en servidor.",
      "en": "A Node server should verify identity, authorization, formats, and limits before performing operations. Errors need consistent responses without leaking internals. External service keys belong on the server, never inside browser bundles."
    },
    "exercise": {
      "pt": "Desenhe o fluxo de um endpoint de tutoria fictício com validação, quota, autorização e timeout. Defina respostas 400, 401 e 429.",
      "es": "Diseña el flujo de una API ficticia de tutor con validación, cuota y timeout, incluyendo 400, 401 y 429.",
      "en": "Diagram a fictional tutor endpoint with validation, quota, authorization, and timeout handling. Specify 400, 401, and 429 responses."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-044/3": {
    "read": {
      "pt": "Um teste end-to-end percorre ações reais do utilizador e verifica o resultado observável. Navegação, idioma, erros, persistência e acessibilidade fazem parte do contrato. Uma captura de ecrã isolada ou a ausência de exceções não prova que uma tarefa foi concluída.",
      "es": "Las pruebas de extremo a extremo recorren acciones reales y comprueban resultados visibles. Navegación, idioma, fallos, persistencia y accesibilidad forman el contrato. Una captura o ausencia de errores no prueba que funcione el flujo.",
      "en": "End-to-end testing follows real user actions and checks observable outcomes. Navigation, language, errors, persistence, and accessibility form part of the contract. A screenshot or absence of exceptions alone does not prove a journey works."
    },
    "exercise": {
      "pt": "Crie uma especificação Playwright para entrar em português, estudar um módulo, guardar evidência, alternar para espanhol e recarregar sem perder dados.",
      "es": "Diseña una prueba Playwright que entre en portugués, guarde evidencia, cambie a español y recargue conservando el progreso.",
      "en": "Specify a Playwright journey: enter in Portuguese, study a module, save evidence, switch to Spanish, and reload without losing progress."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-045/0": {
    "read": {
      "pt": "Nuvem oferece recursos sob procura com responsabilidades divididas entre fornecedor e cliente. Identidade, rede, região de dados, resiliência e custos devem ser definidos antes do lançamento. O serviço estático e a API de tutoria têm perfis de risco e custo distintos.",
      "es": "La nube ofrece recursos bajo demanda con responsabilidades compartidas. Identidad, red, región de datos, resiliencia y costes deben planificarse antes de lanzar. Un sitio estático y una API de tutor tienen riesgos distintos.",
      "en": "Cloud delivers on-demand resources under a shared responsibility model. Identity, networking, data residency, resilience, and costs require planning. A static learning site and a tutor API have distinct risk and cost profiles."
    },
    "exercise": {
      "pt": "Compare um campus estático e um tutor em servidor num cenário imaginário. Indique responsabilidades, custos, residência de dados e como suspender despesas.",
      "es": "Compara campus estático y API de tutor ficticios: responsabilidades, costes, residencia y mecanismos para detener gastos.",
      "en": "Compare a fictional static campus and server-side tutor API: responsibilities, cost drivers, data location, and a shutdown strategy."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-045/1": {
    "read": {
      "pt": "Containers agrupam aplicação e dependências, mas não fornecem isolamento absoluto do host. Imagens mínimas, utilizador não privilegiado, versões fixadas e portas limitadas reduzem a exposição. Os segredos nunca devem ser copiados para as camadas da imagem.",
      "es": "Los contenedores empaquetan aplicaciones y dependencias sin ofrecer aislamiento perfecto del anfitrión. Imágenes mínimas, usuario no privilegiado, versiones fijas y puertos restringidos reducen exposición. Las claves no deben integrarse en las capas.",
      "en": "Containers package applications and dependencies without being perfect host isolation boundaries. Minimal images, non-root users, pinned packages, and restricted ports reduce exposure. Secrets must not be copied into image layers."
    },
    "exercise": {
      "pt": "Esboce um Dockerfile multi-stage fictício com utilizador não root e portas limitadas. Explique como verificaria a presença de segredos antes de publicar.",
      "es": "Dibuja un Dockerfile ficticio multi-etapa con usuario no root y puertos mínimos. Explica cómo detectarías secretos antes de publicarlo.",
      "en": "Sketch a fictional multi-stage Dockerfile with a non-root user and restricted ports. Explain how to scan for secrets before release."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-045/2": {
    "read": {
      "pt": "Configurações públicas e segredos privados precisam de tratamentos distintos. Uma variável incorporada no JavaScript enviado ao navegador deve ser considerada pública. Serviços sensíveis exigem gestor de segredos, controlo de acesso e rotação após qualquer suspeita de exposição.",
      "es": "La configuración pública y los secretos privados requieren controles diferentes. Una variable incluida en JavaScript del navegador es pública. Las claves sensibles necesitan almacén seguro, permisos y rotación cuando se expongan.",
      "en": "Public settings and private secrets require different handling. Variables bundled into browser JavaScript are effectively public. Sensitive keys need secure stores, restricted access, and rotation after suspected exposure."
    },
    "exercise": {
      "pt": "Monte uma matriz de variáveis de ambiente fictícias, identificando valores públicos e privados. Proponha uma rotina de rotação e scan do artefacto publicado.",
      "es": "Haz una matriz de variables de configuración públicas y privadas, con rotación y escaneo del paquete publicado.",
      "en": "Make a fictional environment variable matrix for public and private settings, then propose rotation and output-artifact scanning."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-045/3": {
    "read": {
      "pt": "Infraestrutura como código descreve recursos e regras em arquivos versionados. O plano proposto deve ser revisto antes de aplicar, sobretudo em permissões e custos. Drift, rollback e política de mudanças são essenciais para manter consistência entre a intenção e o ambiente real.",
      "es": "La infraestructura como código describe recursos y políticas en archivos versionados. Antes de ejecutar se revisa el plan, especialmente permisos y costes. Desviaciones, reversión y aprobación son esenciales para mantener coherencia.",
      "en": "Infrastructure as code defines resources and policies in versioned files. Plans should be reviewed before application, especially permissions and cost. Drift detection, rollback, and change approval help align intention with reality."
    },
    "exercise": {
      "pt": "Produza um plano de IaC fictício com rede privada, storage e site estático. Marque dois riscos de custo e dois riscos de permissão antes da aprovação.",
      "es": "Diseña un plan IaC ficticio de red privada, almacenamiento y sitio estático. Señala dos riesgos de coste y dos permisos peligrosos.",
      "en": "Draft fictional IaC for private networking, storage, and a static site. Flag two cost risks and two unsafe permissions before approval."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-046/0": {
    "read": {
      "pt": "Reuniões técnicas internacionais devem começar com objetivo e agenda. Em inglês, pedir esclarecimento é preferível a assumir entendimento, especialmente sobre prazos e responsabilidades. Um resumo escrito de decisões ajuda a reduzir riscos interculturais e operacionais.",
      "es": "Las reuniones técnicas internacionales necesitan objetivo y agenda. En inglés, pedir aclaraciones es mejor que suponer, especialmente para plazos y responsables. Un resumen escrito de decisiones reduce errores operativos e interculturales.",
      "en": "International technical meetings work best with an objective and agenda. Asking for clarification in English is better than assuming, particularly about deadlines and ownership. Written decision summaries reduce operational and cross-cultural confusion."
    },
    "exercise": {
      "pt": "Faça uma simulação trilingue de reunião sobre uma universidade digital. Registe duas decisões em inglês, responsáveis, prazo e perguntas de esclarecimento.",
      "es": "Simula una reunión trilingüe sobre una universidad digital. Anota dos decisiones en inglés, responsables, plazos y preguntas.",
      "en": "Role-play a trilingual digital-university meeting. Record two English decisions, owners, deadlines, and clarifying questions."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-046/1": {
    "read": {
      "pt": "Um relatório técnico distingue objetivo, método, resultado e recomendação. Em inglês, expressões como evidence suggests e not yet confirmed qualificam incertezas sem exagero. Gráficos precisam de unidade, origem e contexto para evitar falsas conclusões.",
      "es": "Un informe técnico separa objetivo, método, resultados y recomendación. En inglés, evidence suggests y not yet confirmed transmiten incertidumbre. Los gráficos necesitan unidades, fuentes y contexto.",
      "en": "Technical reports distinguish objective, method, results, and recommendations. English phrases such as evidence suggests and not yet confirmed express uncertainty. Charts need units, sources, and context to avoid misleading readers."
    },
    "exercise": {
      "pt": "Redija um relatório em inglês de 250 palavras sobre incidente simulado, separando dois factos verificados, uma hipótese e próximos passos autorizados.",
      "es": "Redacta en inglés 250 palabras sobre un incidente ficticio: dos hechos, una hipótesis y pasos autorizados.",
      "en": "Write a 250-word English report about a synthetic incident, separating two verified facts, one hypothesis, and authorized next steps."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-046/2": {
    "read": {
      "pt": "RFCs e padrões descrevem protocolos, interoperabilidade e requisitos. MUST, SHOULD e MAY têm significados normativos específicos quando definidos no documento. Verificar versão, âmbito e linguagem evita interpretar recomendações como obrigações inexistentes.",
      "es": "Las RFC y normas describen protocolos y requisitos. MUST, SHOULD y MAY tienen significados normativos cuando se definen así. Comprobar versión y alcance evita confundir recomendaciones con obligaciones.",
      "en": "RFCs and standards describe protocols and requirements. MUST, SHOULD, and MAY can have defined normative meanings. Checking version, scope, and definitions avoids inventing requirements."
    },
    "exercise": {
      "pt": "Selecione uma RFC pública e prepare um resumo original em português com três termos normativos, contexto, referência e uma limitação.",
      "es": "Selecciona una RFC pública y escribe un resumen original con tres términos normativos, contexto, referencia y una limitación.",
      "en": "Select a public RFC and write an attributed original summary identifying three normative terms, context, and a limitation."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  },
  "ST-046/3": {
    "read": {
      "pt": "A defesa oral de projeto exige explicar problema, método, evidências e limitações com clareza. Em inglês, reconhecer incerteza é mais profissional do que fabricar uma resposta. A apresentação deve terminar com resultados verificáveis e um plano para avaliar questões em aberto.",
      "es": "Defender un proyecto requiere explicar problema, método, pruebas y límites con claridad. En inglés, reconocer dudas es preferible a inventar respuestas. Termina con resultados verificables y un plan para investigar lo pendiente.",
      "en": "An oral project defense explains problem, method, evidence, and limitations clearly. Acknowledging uncertainty in English is more credible than inventing answers. Finish with verifiable results and a plan for unresolved questions."
    },
    "exercise": {
      "pt": "Grave uma apresentação privada em inglês de quatro minutos sobre projeto fictício, antecipando duas perguntas difíceis e respondendo com honestidade.",
      "es": "Graba una presentación privada en inglés de cuatro minutos, anticipando dos preguntas difíciles y respuestas honestas.",
      "en": "Record a private four-minute English presentation of a fictional project, including two difficult questions and honest answers."
    },
    "status": "authored",
    "scope": "fourth semester",
    "estimatedStudyMinutes": 105,
    "review": "editorial-review-needed"
  }
};if(!window.SecureTStudyGuides)return;for(const [key,value] of Object.entries(catalog)){if(!key.startsWith('ST-04')||Object.prototype.hasOwnProperty.call(window.SecureTStudyGuides,key))continue;window.SecureTStudyGuides[key]=value;}})();
