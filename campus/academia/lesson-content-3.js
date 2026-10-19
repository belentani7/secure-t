/* Secure T · original third-semester explanatory notes and guided activities.
   These are authored introductory readings, not accredited degree units. */
(function(){
  "use strict";
  const catalog={
  "ST-031/0": {
    "read": {
      "pt": "Uma função hash criptográfica produz uma impressão digital de dados. Resistência a colisões é essencial para integridade, mas a presença de um hash não prova quem produziu o arquivo. Para autenticar a origem são necessárias assinaturas, chaves e confiança.",
      "es": "Una función hash criptográfica produce una huella de datos. La resistencia a colisiones respalda la integridad, pero una huella no demuestra quién creó el archivo. La autenticidad de origen requiere firmas y claves verificables.",
      "en": "A cryptographic hash creates a data fingerprint. Collision resistance supports integrity checking, but a hash cannot prove who authored a file. Authenticity requires signatures, key management, and established trust."
    },
    "exercise": {
      "pt": "Calcule a impressão digital de dois arquivos fictícios e altere uma letra. Compare os resultados e explique por que o hash sozinho não cria uma credencial institucional.",
      "es": "Calcula las huellas de dos archivos ficticios y cambia una letra. Compara resultados y explica por qué un hash no firma títulos universitarios.",
      "en": "Hash two fictional files and alter one character. Compare results and explain why a hash alone cannot sign academic credentials."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-031/1": {
    "read": {
      "pt": "Criptografia simétrica usa a mesma chave secreta para cifrar e decifrar dados. O algoritmo, o modo de operação e o nonce devem ser adequados; reutilizar nonces em alguns modos compromete a segurança. Guardar a chave junto ao texto cifrado destrói a proteção.",
      "es": "El cifrado simétrico usa una clave compartida para cifrar y descifrar. Algoritmo, modo y nonce deben ser seguros; reutilizar nonces puede destruir garantías importantes. Guardar la clave junto al mensaje facilita su exposición.",
      "en": "Symmetric encryption uses a shared secret for encryption and decryption. Algorithm, mode, and nonce handling matter; nonce reuse can undermine security. Storing the key with ciphertext defeats the confidentiality goal."
    },
    "exercise": {
      "pt": "Desenhe um esquema de armazenamento de documentos fictícios com chaves separadas e rotação. Explique como restaurar os arquivos sem divulgar segredos reais.",
      "es": "Dibuja un almacenamiento de documentos ficticios con claves separadas y rotación. Describe restauración sin usar secretos verdaderos.",
      "en": "Diagram fictional document encryption with separated keys and rotation. Describe recovery without using real secrets."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-031/2": {
    "read": {
      "pt": "Criptografia assimétrica usa um par de chaves: a pública pode ser distribuída e a privada deve ser protegida. Assinaturas digitais associam mensagens a quem controla a chave privada, se a identidade for validada. Criptografia e assinatura respondem a problemas distintos.",
      "es": "La criptografía asimétrica usa una clave pública distribuible y otra privada protegida. Las firmas vinculan mensajes a la clave privada si la identidad se verifica. Cifrar y firmar resuelven problemas de seguridad diferentes.",
      "en": "Asymmetric cryptography uses a shareable public key and protected private key. Digital signatures connect a message to the private-key holder when identity is verified. Encryption and signing serve different security purposes."
    },
    "exercise": {
      "pt": "Compare dois cenários fictícios: enviar uma mensagem privada e assinar um relatório. Indique que chaves são usadas, o que se verifica e quais ataques permanecem possíveis.",
      "es": "Compara enviar un mensaje confidencial y firmar un informe. Identifica las claves usadas, las comprobaciones y las amenazas restantes.",
      "en": "Compare confidential messaging and signing a report. Identify keys used, verification steps, and remaining risks."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-031/3": {
    "read": {
      "pt": "Uma infraestrutura de chave pública combina certificados, autoridades, políticas e revogação. A cadeia de confiança liga o certificado de servidor a uma raiz aceite pelo cliente. Validade temporal, hostname e estado de revogação precisam de análise, não apenas a aparência do cadeado.",
      "es": "Una infraestructura PKI reúne certificados, autoridades, políticas y revocación. La cadena de confianza conecta un certificado con raíces aceptadas. Fechas, nombre de dominio y revocación importan tanto como la presencia del candado.",
      "en": "Public key infrastructure combines certificates, authorities, policies, and revocation. Trust chains link server certificates to accepted roots. Time validity, hostnames, and revocation matter beyond the mere padlock icon."
    },
    "exercise": {
      "pt": "Desenhe uma cadeia de certificados fictícia de raiz, intermediário e servidor. Registe três causas de erro de validação e como comunicaria o problema com prudência.",
      "es": "Dibuja raíz, autoridad intermedia y certificado ficticio. Describe tres fallos de validación y cómo informarlos de forma segura.",
      "en": "Diagram fictional root, intermediate, and server certificates. Describe three validation failures and how to report them safely."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-032/0": {
    "read": {
      "pt": "OWASP Top 10 resume classes recorrentes de risco em aplicações web, mas não é uma lista exaustiva de testes. Contexto, superfície exposta e impacto definem a prioridade real. Cada risco precisa de mitigação verificável, não apenas de uma etiqueta de conformidade.",
      "es": "OWASP Top 10 agrupa riesgos frecuentes de aplicaciones web, pero no sustituye el análisis del sistema. Contexto, exposición e impacto determinan la prioridad. Las mitigaciones deben verificarse y no limitarse a etiquetas.",
      "en": "OWASP Top 10 summarizes frequent web application risk categories without covering every threat. Context, exposure, and impact determine priorities. Controls must be verified rather than treated as compliance labels."
    },
    "exercise": {
      "pt": "Construa uma matriz de riscos para uma plataforma educativa imaginária com três riscos OWASP, severidade argumentada, controlo de mitigação e teste defensivo.",
      "es": "Elabora una matriz de tres riesgos OWASP de una plataforma educativa ficticia con impacto, mitigación y prueba defensiva.",
      "en": "Build a three-risk OWASP matrix for a fictional school platform, with impact, mitigation, and defensive verification."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-032/1": {
    "read": {
      "pt": "Entradas externas são dados não confiáveis, mesmo quando chegam de um formulário aparentemente conhecido. A aplicação deve validar tipos, comprimentos e formatos no servidor. Escapar saída segundo o contexto ajuda a impedir que texto se transforme em código no navegador.",
      "es": "Los datos de entrada no son fiables aunque provengan de formularios conocidos. El servidor debe validar tipos, límites y formatos. Escapar la salida según su contexto evita interpretar texto externo como instrucciones.",
      "en": "External input is untrusted even from familiar forms. Validate types, length, and formats on the server. Context-specific output encoding prevents external text from becoming executable browser code."
    },
    "exercise": {
      "pt": "Defina um esquema de validação para inscrições fictícias com nome, idioma e curso. Teste campos vazios, excessivos e HTML literal; nunca armazene dados pessoais reais.",
      "es": "Define reglas para una inscripción ficticia con nombre, idioma y curso. Prueba vacíos, datos extensos y HTML literal sin almacenar datos reales.",
      "en": "Design a schema for fictional learner registration with name, language, and course. Test empty, oversized, and HTML-like input without storing real identities."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-032/2": {
    "read": {
      "pt": "Sessões web associam pedidos ao contexto de um utilizador autenticado. Cookies HttpOnly, Secure e SameSite ajudam a reduzir riscos, mas exigem HTTPS, expiração e gestão de revogação. Uma sessão não substitui controlo de acesso por recurso.",
      "es": "Las sesiones vinculan peticiones a usuarios autenticados. Cookies HttpOnly, Secure y SameSite ayudan, pero siguen siendo necesarios HTTPS, caducidad y revocación. Tener sesión no da acceso a recursos ajenos.",
      "en": "Web sessions associate requests with an authenticated user's context. HttpOnly, Secure, and SameSite cookies help, but HTTPS, expiry, and revocation still matter. Being logged in does not grant access to another user's resources."
    },
    "exercise": {
      "pt": "Desenhe o ciclo de login, renovação e logout de uma aplicação fictícia. Explique três situações em que a autorização deve negar acesso mesmo com sessão válida.",
      "es": "Dibuja inicio de sesión, renovación y salida de una app ficticia. Explica tres rechazos de acceso con una sesión válida.",
      "en": "Diagram fictional login, renewal, and logout. Explain three authorization denials that must apply even to a valid session."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-032/3": {
    "read": {
      "pt": "STRIDE é uma forma estruturada de questionar falsificação, adulteração, repúdio, divulgação, negação de serviço e elevação de privilégios. O modelo começa com ativos, limites de confiança e fluxos de dados. A utilidade depende de hipóteses explícitas e revisões.",
      "es": "STRIDE organiza riesgos de suplantación, alteración, repudio, divulgación, denegación de servicio y elevación de privilegios. Parte de activos, límites de confianza y flujos. El modelo exige hipótesis comprobables.",
      "en": "STRIDE structures analysis of spoofing, tampering, repudiation, information disclosure, denial of service, and elevation of privilege. It starts with assets, trust boundaries, and data flows. Assumptions require review."
    },
    "exercise": {
      "pt": "Desenhe o fluxo navegador → API → base de dados de um campus fictício. Aplique STRIDE a duas fronteiras de confiança e proponha controlos verificáveis.",
      "es": "Dibuja navegador, API y base de datos de un campus imaginario. Aplica STRIDE a dos límites y propone controles comprobables.",
      "en": "Diagram a fictional browser-to-API-to-database flow. Apply STRIDE at two trust boundaries and propose verifiable controls."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-033/0": {
    "read": {
      "pt": "O modelo relacional organiza dados em tabelas, chaves e relações. Normalização reduz duplicação e inconsistência, embora consultas reais exijam decisões de desempenho. A modelação de alunos deve minimizar a informação recolhida para respeitar privacidade.",
      "es": "El modelo relacional organiza datos en tablas, claves y relaciones. Normalizar reduce duplicación, pero las consultas también requieren análisis de rendimiento. Modelar alumnos exige minimizar la información personal recogida.",
      "en": "Relational databases organize information through tables, keys, and relationships. Normalization limits duplication but must be balanced with query performance. Learner schemas should minimize personal data collection."
    },
    "exercise": {
      "pt": "Modele cursos, módulos e progresso anónimo com três tabelas fictícias. Defina chaves primárias, estrangeiras e um índice sem incluir emails ou nomes verdadeiros.",
      "es": "Modela tres tablas ficticias de cursos, módulos y progreso anónimo con claves e índices, evitando correos o nombres reales.",
      "en": "Model fictional courses, modules, and anonymous progress in three tables, including primary keys, relationships, and an index without real names."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-033/1": {
    "read": {
      "pt": "SQL parametrizado separa instruções de valores, impedindo que a entrada seja executada como parte da consulta. Validação de esquema e permissões mínimas completam a defesa. Montar comandos SQL concatenando campos livres é uma prática insegura.",
      "es": "Las consultas parametrizadas separan instrucciones de valores y evitan interpretar entradas como SQL. La validación y los permisos mínimos son defensas adicionales. Concatenar texto libre en consultas resulta peligroso.",
      "en": "Parameterized SQL separates query instructions from values so that input is treated as data. Schema validation and least privilege complement this defense. Concatenating arbitrary input into SQL is unsafe."
    },
    "exercise": {
      "pt": "Escreva pseudocódigo de uma consulta parametrizada por código de curso. Indique parâmetros válidos e inválidos e como o serviço devolve erro sem expor SQL interno.",
      "es": "Redacta pseudocódigo de una consulta parametrizada por código de curso, con validaciones y errores que no revelen SQL.",
      "en": "Write pseudocode for a parameterized lookup by course code, including input validation and errors that conceal internal SQL."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-033/2": {
    "read": {
      "pt": "Uma transação agrupa alterações relacionadas e assegura propriedades como atomicidade e isolamento conforme o sistema. Falhas devem fazer rollback para preservar consistência. Sistemas concorrentes precisam de analisar bloqueios e atualizações perdidas.",
      "es": "Una transacción agrupa cambios relacionados y protege atomicidad y aislamiento según la base de datos. Los fallos requieren reversión. La concurrencia debe contemplar bloqueos y cambios perdidos.",
      "en": "A transaction groups related changes with guarantees such as atomicity and isolation depending on the database. Failures require rollback. Concurrent workloads must consider locks and lost updates."
    },
    "exercise": {
      "pt": "Simule uma reserva de vaga fictícia que atualiza duas tabelas. Descreva o resultado se a segunda operação falhar e um teste para garantir rollback.",
      "es": "Simula una reserva de plaza ficticia en dos tablas y explica qué ocurre si falla el segundo cambio y cómo probar la reversión.",
      "en": "Simulate a fictional seat reservation changing two tables. Describe second-step failure and a test for atomic rollback."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-033/3": {
    "read": {
      "pt": "Backups são cópias de recuperação, mas a existência de um arquivo não prova que ele possa ser restaurado. Defina objetivos de perda de dados e tempo de recuperação, proteja as cópias e execute testes periódicos. Nunca restaure sobre produção sem plano autorizado.",
      "es": "Las copias de seguridad necesitan pruebas de restauración: tener un archivo no demuestra que funcione. Define pérdida y tiempo de recuperación, protege las copias y ensaya con datos ficticios. No sobrescribas producción sin autorización.",
      "en": "Backups support recovery, but possessing a file does not prove it can be restored. Set recovery time and recovery point goals, protect backups, and run periodic restore tests. Avoid overwriting production without an approved plan."
    },
    "exercise": {
      "pt": "Desenhe um calendário de backup para uma biblioteca fictícia e um teste de restauração isolado. Registe métricas de tempo e integridade dos dados simulados.",
      "es": "Diseña un calendario de copias y una restauración aislada de una biblioteca ficticia, con métricas de tiempo e integridad.",
      "en": "Design a fictional school-library backup schedule and isolated restore test, recording recovery time and data integrity checks."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-034/0": {
    "read": {
      "pt": "Um componente acessível permite interação por teclado, identificações claras e estados anunciados corretamente. Elementos semânticos facilitam tecnologias de apoio. Contraste, foco visível e mensagens de erro compreensíveis devem ser incluídos desde o primeiro protótipo.",
      "es": "Un componente accesible necesita teclado, etiquetas claras y estados anunciados. El HTML semántico ayuda a tecnologías de apoyo. Contraste, foco visible y errores comprensibles deben incorporarse desde el prototipo.",
      "en": "Accessible components require keyboard operation, clear labels, and properly announced states. Semantic HTML supports assistive technology. Contrast, visible focus, and understandable errors belong in the first prototype."
    },
    "exercise": {
      "pt": "Crie um botão e formulário acessíveis com label, foco visível e mensagem aria-live. Teste uso sem rato e documente duas barreiras encontradas.",
      "es": "Crea botón y formulario con etiqueta, foco y aria-live. Pruébalos sin ratón y documenta dos obstáculos.",
      "en": "Build an accessible button and form with label, focus, and aria-live feedback. Test without a mouse and document two obstacles."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-034/1": {
    "read": {
      "pt": "O roteamento liga URLs a vistas e o estado descreve o que a interface apresenta. Guardar informação de navegação na URL melhora partilha e histórico, mas dados privados não devem aparecer em parâmetros. Estados transitórios precisam de decisões claras de persistência.",
      "es": "El enrutamiento conecta URL y vistas; el estado determina la interfaz mostrada. Las URL facilitan compartir navegación, pero nunca deben exponer datos privados. Hay que decidir qué estado persiste y cuál es temporal.",
      "en": "Routing maps URLs to views, while state describes the visible interface. URLs improve sharing and browser history but should not expose private information. Decide explicitly what state should persist."
    },
    "exercise": {
      "pt": "Planeie três rotas para uma biblioteca de cursos e indique onde guardaria filtros, token local e rascunho privado. Justifique por que certos valores não vão na URL.",
      "es": "Planea tres rutas de una biblioteca y dónde guardar filtros, token local y borrador, justificando la privacidad.",
      "en": "Plan three course-library routes and choose storage for filters, a local token, and a private draft. Explain what must never enter the URL."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-034/2": {
    "read": {
      "pt": "Formulários exigem validação, instruções claras e recuperação de erros. A verificação no navegador melhora a experiência, mas não substitui a validação do servidor. Mensagens devem identificar o campo e permitir corrigir sem perder entradas legítimas.",
      "es": "Los formularios necesitan validación, instrucciones claras y recuperación de fallos. La comprobación del navegador ayuda, pero no sustituye el servidor. Los mensajes deben señalar el campo sin borrar respuestas correctas.",
      "en": "Forms need validation, clear instructions, and error recovery. Browser validation supports usability but does not replace server validation. Error messages should identify fields and preserve valid user input."
    },
    "exercise": {
      "pt": "Construa um formulário de pesquisa de curso com campo obrigatório, limite de caracteres e erro recuperável. Teste ecrã pequeno e teclado.",
      "es": "Crea un formulario de búsqueda de cursos con campo obligatorio, límite y error recuperable. Prueba móvil y teclado.",
      "en": "Build a course-search form with required field, character limit, and recoverable error. Test small screens and keyboard access."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-034/3": {
    "read": {
      "pt": "A qualidade de interface envolve tempo de carregamento, legibilidade, consistência, acessibilidade e ausência de surpresas. Métricas quantitativas precisam de observação humana. Evite indicadores fictícios de estudantes ou certificados que possam induzir os visitantes em erro.",
      "es": "La calidad de interfaz incluye rendimiento, claridad, coherencia y accesibilidad. Las métricas técnicas deben combinarse con pruebas humanas. Nunca muestres alumnos o certificados inventados como cifras reales.",
      "en": "UI quality combines performance, legibility, consistency, accessibility, and predictable behavior. Metrics require human validation. Avoid fabricated learner counts or certificates that could mislead visitors."
    },
    "exercise": {
      "pt": "Defina cinco critérios mensuráveis para uma página de curso: acessibilidade, legibilidade, carga, mobile e honestidade de conteúdo. Documente uma melhoria real.",
      "es": "Define cinco criterios para una página de curso: accesibilidad, legibilidad, carga, móvil y veracidad. Documenta un cambio.",
      "en": "Define five measurable course-page criteria covering accessibility, readability, load time, mobile usability, and truthful content."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-035/0": {
    "read": {
      "pt": "REST define recursos e contratos de métodos, estados e representações. Um contrato claro torna os clientes previsíveis e facilita testes de compatibilidade. Versionamento e mensagens de erro consistentes reduzem quebras quando a API evolui.",
      "es": "REST define recursos y contratos mediante métodos, estados y representaciones. Un contrato claro hace previsibles los clientes y permite comprobar compatibilidad. Versiones y errores consistentes reducen las roturas.",
      "en": "REST describes resources through methods, status codes, and representations. Clear contracts make client behavior predictable and simplify compatibility testing. Versioning and consistent errors reduce breaking changes."
    },
    "exercise": {
      "pt": "Desenhe um contrato fictício para GET /courses e POST /progress. Indique esquema de resposta, estados 400/401/500 e uma política de versão.",
      "es": "Diseña contratos para GET /courses y POST /progress con esquemas, errores 400/401/500 y estrategia de versiones.",
      "en": "Design fictional GET /courses and POST /progress contracts, including schemas, 400/401/500 responses, and versioning."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-035/1": {
    "read": {
      "pt": "Autenticação determina quem pede acesso; autorização decide se essa identidade pode realizar uma ação específica sobre um recurso. Um utilizador autenticado não pode automaticamente consultar o progresso de outro. Verificações pertencem ao servidor e devem falhar de modo fechado.",
      "es": "Autenticación identifica al solicitante; autorización decide si puede actuar sobre un recurso. Iniciar sesión no permite acceder a datos ajenos. La comprobación debe ejecutarse en servidor y denegar ante identidad ausente.",
      "en": "Authentication establishes identity; authorization decides whether that identity may access a particular resource. Logging in does not grant access to another learner's records. Enforce checks server-side and fail closed."
    },
    "exercise": {
      "pt": "Prepare cinco casos de teste de RBAC para progresso fictício: próprio, alheio, sem identidade, administrador e sessão expirada. Registe resultados esperados.",
      "es": "Prepara cinco pruebas RBAC con expediente propio, ajeno, sin identidad, administrador y sesión caducada.",
      "en": "Prepare five fictional RBAC tests for own record, another's record, missing identity, administrator, and expired session."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-035/2": {
    "read": {
      "pt": "Rate limiting limita a frequência de pedidos para reduzir abuso e sobrecarga. As políticas dependem da identidade, capacidade e criticidade da operação. Limites só funcionam quando persistem corretamente; apagar contadores sob saturação pode permitir contornar a proteção.",
      "es": "La limitación de peticiones reduce abuso y carga según identidad, capacidad y riesgo. La política necesita gestión fiable de los contadores. Reiniciarlos cuando hay saturación puede permitir eludir el control.",
      "en": "Rate limiting bounds request frequency to reduce abuse and overload. Limits depend on identity, capacity, and operation risk. Counter handling must be robust: resetting counters under pressure may bypass the safeguard."
    },
    "exercise": {
      "pt": "Projete um limite fictício de dez perguntas por minuto e resposta HTTP 429. Descreva o caso de mil identidades e como testaria rejeição sem apagar contadores.",
      "es": "Diseña diez solicitudes por minuto y respuesta 429. Analiza mil identidades y prueba que no se reseteen contadores.",
      "en": "Design a fictional ten-per-minute policy returning 429. Analyze a thousand identities and verify counters are not flushed under pressure."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-035/3": {
    "read": {
      "pt": "Observabilidade combina logs, métricas e rastreamentos para explicar saúde e falhas do serviço. Dados pessoais e segredos não devem entrar nos eventos de auditoria. Sinais úteis incluem taxa de erro, latência e saturação com objetivos e alertas proporcionais.",
      "es": "Observabilidad combina registros, métricas y trazas para comprender salud y fallos del servicio. Nunca registres secretos ni datos personales. Errores, latencia y saturación permiten definir objetivos y alertas adecuados.",
      "en": "Observability combines logs, metrics, and traces to explain service health and failures. Sensitive data and secrets must not enter audit events. Error rate, latency, and saturation support operational objectives and alerts."
    },
    "exercise": {
      "pt": "Desenhe um painel fictício com erro, latência e saturação. Especifique limites de alerta e uma função de redação de tokens em logs simulados.",
      "es": "Diseña un panel con errores, latencia y saturación, alertas y redacción de tokens ficticios.",
      "en": "Design a fake dashboard for errors, latency, and saturation, with alert thresholds and secret-redaction rules."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-036/0": {
    "read": {
      "pt": "Escrita técnica formal em português deve indicar propósito, contexto, método e resultado de forma inequívoca. Expressões imprecisas e dados sem fonte enfraquecem a confiança. A revisão verifica terminologia, ortografia, estrutura e limites das conclusões.",
      "es": "La redacción técnica en portugués requiere propósito, contexto, método y resultados claros. Frases imprecisas y afirmaciones sin fuente reducen confianza. La revisión examina términos, estructura y límites de cada conclusión.",
      "en": "Formal technical writing in Portuguese should state purpose, context, method, and results clearly. Vague language and unsourced claims undermine trust. Review terminology, organization, and limitations."
    },
    "exercise": {
      "pt": "Redija em português uma nota de 250 palavras sobre um projeto fictício. Inclua objetivo, metodologia, evidências e limites e revise duas afirmações vagas.",
      "es": "Redacta en portugués 250 palabras sobre un proyecto ficticio con objetivo, método, evidencias y límites, revisando frases ambiguas.",
      "en": "Write a 250-word Portuguese note on a fictional project with objective, method, evidence, and limitations, revising vague claims."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-036/1": {
    "read": {
      "pt": "Um resumo crítico distingue a tese do autor das evidências e dos pressupostos. Parafrasear exige respeito à autoria e interpretação fiel, não reprodução de grandes excertos. Um bom resumo inclui questões em aberto e incertezas relevantes.",
      "es": "Un resumen crítico distingue tesis, pruebas y supuestos del autor. Parafrasear exige atribución y fidelidad sin copiar extensos fragmentos. El texto debe mencionar dudas y limitaciones relevantes.",
      "en": "A critical summary distinguishes an author's thesis, evidence, and assumptions. Paraphrasing requires attribution and faithful interpretation rather than copying long excerpts. A useful summary highlights uncertainties."
    },
    "exercise": {
      "pt": "Escolha um artigo aberto de tecnologia e escreva um resumo original em português com referência, tese, duas evidências e uma limitação. Não copie parágrafos.",
      "es": "Elige un artículo abierto y escribe un resumen original en portugués con fuente, tesis, dos evidencias y una limitación, sin copiar párrafos.",
      "en": "Choose an open technology article and write an original Portuguese summary with attribution, thesis, two supporting points, and a limitation."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-036/2": {
    "read": {
      "pt": "Argumentar de forma clara requer separar premissas, dados e conclusões. Uma objeção bem formulada considera evidências contrárias e evita ataques pessoais. Em comunicação técnica, admitir incerteza fortalece a credibilidade da proposta.",
      "es": "Argumentar claramente implica separar premisas, datos y conclusiones. Una objeción útil considera pruebas contrarias sin ataques personales. Reconocer incertidumbre mejora la credibilidad técnica.",
      "en": "Clear argumentation separates premises, data, and conclusions. Responsible objections consider contrary evidence rather than attacking people. Acknowledging uncertainty improves a technical proposal's credibility."
    },
    "exercise": {
      "pt": "Defenda em português uma decisão fictícia de arquitetura e escreva uma objeção razoável. Indique duas evidências e o que mudaria sua opinião.",
      "es": "Defiende en portugués una decisión técnica ficticia y formula una objeción razonable con evidencias y condiciones de revisión.",
      "en": "Defend a fictional architecture decision in Portuguese, include a fair counterargument, two supporting facts, and a condition that would change your view."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  },
  "ST-036/3": {
    "read": {
      "pt": "Uma apresentação de projeto comunica o problema, a solução, os riscos, os testes e o resultado. Slides devem apoiar a fala sem excesso de texto, com gráficos acessíveis e fontes citadas. Perguntas do público são oportunidade de esclarecer limites e próximos passos.",
      "es": "Presentar proyectos exige explicar problema, solución, riesgos, pruebas y resultados. Las diapositivas deben ser accesibles, legibles y con fuentes. Las preguntas permiten aclarar límites y próximas acciones.",
      "en": "Project presentations explain a problem, solution, risks, tests, and outcomes. Slides should support clear speech, use accessible visuals, and cite sources. Questions help surface limitations and next steps."
    },
    "exercise": {
      "pt": "Prepare cinco slides e uma apresentação de três minutos em português para um projeto imaginário. Inclua risco, evidência de teste e uma resposta honesta à pergunta difícil.",
      "es": "Prepara cinco diapositivas y una presentación de tres minutos en portugués sobre un proyecto ficticio con riesgos y pruebas.",
      "en": "Prepare five slides and a three-minute Portuguese presentation for a fictional project, including risks, evidence, and a candid response to a tough question."
    },
    "status": "authored",
    "scope": "third semester",
    "estimatedStudyMinutes": 100,
    "review": "editorial-review-needed"
  }
};
  if(!window.SecureTStudyGuides)return;
  for(const [id,item] of Object.entries(catalog)){
    if(!id.startsWith("ST-03") || Object.prototype.hasOwnProperty.call(window.SecureTStudyGuides,id))continue;
    window.SecureTStudyGuides[id]=item;
  }
})();
