/* Secure T University · original study guide, first semester / 24 units. Independent educational project; not an accredited course. */
window.SecureTStudyGuides = {
  "ST-011/0": {
    "read": {
      "pt": "A arquitetura distingue CPU, memória e armazenamento: a CPU executa instruções, a RAM mantém dados temporários e o disco retém informação. Barramentos e periféricos conectam estes componentes. Ao diagnosticar um sistema, é essencial identificar onde o trabalho acontece e onde o estado é preservado.",
      "es": "La arquitectura separa CPU, memoria y almacenamiento: la CPU ejecuta instrucciones, la RAM conserva datos temporales y el disco retiene información. Buses y periféricos conectan los componentes. Para diagnosticar un equipo debemos distinguir dónde se procesa el trabajo y dónde persiste su estado.",
      "en": "Architecture separates CPU, memory and storage: the CPU executes instructions, RAM holds temporary data and disks retain information. Buses and peripherals connect these parts. In troubleshooting, distinguish where computation happens from where state persists."
    },
    "exercise": {
      "pt": "Desenhe um diagrama de CPU, RAM, armazenamento e rede de um computador real ou imaginário. Indique o caminho de um documento desde a abertura até ao salvamento.",
      "es": "Dibuja un esquema de CPU, RAM, almacenamiento y red de un ordenador real o imaginario. Explica qué ocurre al abrir y guardar un documento.",
      "en": "Draw a CPU, RAM, storage and network diagram for a real or hypothetical computer. Trace a document from opening to saving."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-011/1": {
    "read": {
      "pt": "Um sistema operacional coordena processos, memória, dispositivos e permissões. Um processo é um programa em execução, com recursos e isolamento próprios. Distinguir processo de aplicação ajuda a explicar consumo de CPU, falhas e resposta do sistema.",
      "es": "El sistema operativo coordina procesos, memoria, dispositivos y permisos. Un proceso es un programa en ejecución con recursos propios. Distinguir proceso y aplicación ayuda a explicar uso de CPU, fallos y respuesta del sistema.",
      "en": "An operating system manages processes, memory, devices and permissions. A process is a running program with its own resources. Distinguishing process from application helps explain CPU usage, crashes and responsiveness."
    },
    "exercise": {
      "pt": "Observe o monitor de processos do seu dispositivo sem alterar serviços. Identifique três processos, a sua função e que sinais indicariam um problema de desempenho.",
      "es": "Observa el monitor de procesos sin alterar servicios. Identifica tres procesos, su función y señales de un problema de rendimiento.",
      "en": "Inspect your device's process monitor without changing services. Identify three processes, their purpose and signs of a performance issue."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-011/2": {
    "read": {
      "pt": "Arquivos organizam conteúdo; diretórios formam uma hierarquia; permissões decidem quem pode ler, escrever ou executar. Uma pasta pública e uma pasta pessoal não devem ter os mesmos privilégios. O princípio do menor privilégio reduz erros e exposição de dados.",
      "es": "Los archivos organizan contenidos; los directorios crean una jerarquía; los permisos definen lectura, escritura y ejecución. Una carpeta pública no necesita los mismos privilegios que una personal. El mínimo privilegio reduce errores y exposición.",
      "en": "Files hold content; directories form a hierarchy; permissions govern reading, writing and execution. A public folder should not have the same privileges as a private one. Least privilege reduces mistakes and data exposure."
    },
    "exercise": {
      "pt": "Crie uma árvore de três pastas de exemplo, atribua permissões hipotéticas e justifique quem deveria ler e modificar cada uma. Não exponha arquivos pessoais.",
      "es": "Diseña tres carpetas de ejemplo, asigna permisos hipotéticos y justifica quién puede leer y modificar cada una. No publiques archivos personales.",
      "en": "Design three sample folders, assign hypothetical permissions and justify who can read or change each. Do not expose personal files."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-011/3": {
    "read": {
      "pt": "Diagnosticar começa com sintomas observáveis e hipóteses testáveis. Latência, espaço em disco, memória e logs ajudam a separar causa de coincidência. Uma investigação segura documenta o estado inicial antes de qualquer mudança e verifica se o ajuste realmente resolveu o sintoma.",
      "es": "Diagnosticar empieza por síntomas observables e hipótesis comprobables. Latencia, espacio en disco, memoria y registros permiten separar causas y coincidencias. Una investigación segura documenta el estado inicial y comprueba el efecto de cada cambio.",
      "en": "Troubleshooting starts with observable symptoms and testable hypotheses. Latency, disk space, memory and logs help distinguish causes from coincidences. Safe investigations record the initial state and verify the effect of any change."
    },
    "exercise": {
      "pt": "Escreva uma ficha de diagnóstico de «computador lento» com sintoma, três hipóteses, medições não invasivas e critério de sucesso.",
      "es": "Redacta una ficha de diagnóstico de «ordenador lento»: síntoma, tres hipótesis, medidas no invasivas y criterio de éxito.",
      "en": "Write a 'slow computer' troubleshooting report: symptom, three hypotheses, non-invasive measurements and a success criterion."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-012/0": {
    "read": {
      "pt": "TCP/IP agrupa protocolos em camadas para transportar dados entre aplicações. IP trata endereçamento e encaminhamento; TCP fornece entrega ordenada e controlo de ligação; HTTP opera ao nível da aplicação. As camadas permitem localizar falhas sem confundir transporte com conteúdo.",
      "es": "TCP/IP organiza protocolos en capas para transportar datos. IP gestiona direccionamiento y encaminamiento; TCP aporta entrega ordenada y control de conexión; HTTP pertenece a la aplicación. Las capas permiten localizar fallos sin mezclar transporte y contenido.",
      "en": "TCP/IP groups protocols in layers. IP handles addressing and routing; TCP provides ordered delivery and connection management; HTTP belongs to the application layer. Layers help isolate faults without confusing transport and content."
    },
    "exercise": {
      "pt": "Trace o percurso hipotético de um pedido HTTPS: navegador, DNS, IP, TCP ou QUIC, TLS e servidor. Identifique a responsabilidade de cada componente.",
      "es": "Traza una petición HTTPS hipotética: navegador, DNS, IP, TCP o QUIC, TLS y servidor. Explica la responsabilidad de cada elemento.",
      "en": "Trace a hypothetical HTTPS request through browser, DNS, IP, TCP or QUIC, TLS and server, stating each part's responsibility."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-012/1": {
    "read": {
      "pt": "Um endereço IP identifica uma interface na rede; a máscara ou prefixo define que endereços pertencem à mesma sub-rede. IPv4 usa 32 bits, IPv6 usa 128. A divisão em sub-redes facilita organização, segmentação e desenho de políticas de rede.",
      "es": "Una dirección IP identifica una interfaz; la máscara o prefijo establece la subred. IPv4 usa 32 bits e IPv6 128. Dividir en subredes ayuda a organizar, segmentar y diseñar políticas de red.",
      "en": "An IP address identifies a network interface; a mask or prefix defines its subnet. IPv4 uses 32 bits and IPv6 uses 128. Subnetting supports network organization, segmentation and policy design."
    },
    "exercise": {
      "pt": "Sem ligar a nenhuma rede externa, calcule quantos endereços existem em 192.0.2.0/28 e explique o significado do prefixo usando a faixa de documentação RFC 5737.",
      "es": "Sin conectarte a redes ajenas, calcula cuántas direcciones hay en 192.0.2.0/28 y explica el prefijo usando direcciones de documentación RFC 5737.",
      "en": "Without touching external networks, calculate the number of addresses in 192.0.2.0/28 and explain the prefix using RFC 5737 documentation addresses."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-012/2": {
    "read": {
      "pt": "DNS traduz nomes para registros como A, AAAA e CNAME; HTTP define pedidos e respostas com métodos, estados e cabeçalhos. Uma falha de DNS não é igual a um erro HTTP 404: o primeiro impede localizar o destino, o segundo indica que o servidor respondeu.",
      "es": "DNS resuelve nombres mediante registros como A, AAAA y CNAME. HTTP define peticiones y respuestas con métodos, estados y cabeceras. Un fallo DNS no es un HTTP 404: en el segundo caso un servidor sí respondió.",
      "en": "DNS resolves names via records such as A, AAAA and CNAME. HTTP defines requests and responses using methods, status codes and headers. DNS failure differs from HTTP 404: in the latter case a server responded."
    },
    "exercise": {
      "pt": "Desenhe a resolução de example.com e uma resposta HTTP 404 fictícia. Explique como distinguir os dois incidentes por sintomas e registos.",
      "es": "Dibuja la resolución de example.com y una respuesta HTTP 404 ficticia. Diferencia ambos errores por síntomas y registros.",
      "en": "Diagram example.com resolution and a hypothetical HTTP 404. Explain how to distinguish these failures from symptoms and logs."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-012/3": {
    "read": {
      "pt": "Uma captura de pacotes mostra metadados e fluxos de comunicação. Para estudar redes com responsabilidade, use apenas tráfego seu ou conjuntos de dados de demonstração e respeite privacidade. Filtrar por protocolo ou tempo ajuda a formular hipóteses sem recolher dados de terceiros.",
      "es": "Una captura de paquetes muestra metadatos y flujos de comunicación. Estudia solo tráfico propio o datos de muestra y protege la privacidad. Filtrar por protocolo o tiempo facilita crear hipótesis sin recoger comunicaciones ajenas.",
      "en": "Packet captures reveal metadata and communication flows. Study only your own traffic or authorized sample datasets and respect privacy. Filtering by protocol or time helps build hypotheses without collecting others' communications."
    },
    "exercise": {
      "pt": "Descreva um laboratório com PCAP sintético: três pacotes HTTP de exemplo, horários fictícios e o que observaria. Não capture tráfego de redes alheias.",
      "es": "Diseña un laboratorio con PCAP sintético: tres paquetes HTTP ilustrativos, tiempos ficticios y observaciones. No captures tráfico ajeno.",
      "en": "Design a synthetic PCAP lab with three illustrative HTTP packets, fictional timestamps and observations. Do not capture others' traffic."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-013/0": {
    "read": {
      "pt": "Confidencialidade impede acesso indevido, integridade impede alteração não autorizada e disponibilidade garante acesso quando necessário. Estes objetivos podem entrar em tensão: segurança exigente pode aumentar custo ou fricção. A análise de risco procura equilíbrio documentado.",
      "es": "Confidencialidad evita accesos indebidos, integridad impide alteraciones no autorizadas y disponibilidad mantiene el servicio. Estos objetivos a veces compiten: mayores controles pueden añadir fricción. El análisis de riesgos exige equilibrio justificado.",
      "en": "Confidentiality prevents unauthorized access, integrity guards against tampering, and availability keeps services accessible. The goals can compete: stronger controls add cost and friction. Risk analysis makes trade-offs explicit."
    },
    "exercise": {
      "pt": "Analise um portal escolar fictício. Indique uma ameaça para cada objetivo CIA, um controlo defensivo e uma consequência para a experiência do aluno.",
      "es": "Analiza un portal educativo ficticio. Escribe una amenaza para cada principio CIA, un control defensivo y una consecuencia para el alumno.",
      "en": "Analyze a fictional school portal. For each CIA goal, write one threat, a defensive control and a learner experience trade-off."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-013/1": {
    "read": {
      "pt": "Modelar ameaças é identificar ativos, fronteiras de confiança, atores, possibilidades de falha e mitigação. O objetivo não é presumir intrusões: é priorizar riscos plausíveis com base em evidências. Diagrama de fluxo de dados e STRIDE ajudam a organizar a análise.",
      "es": "Modelar amenazas significa identificar activos, límites de confianza, actores, fallos posibles y mitigaciones. No consiste en afirmar intrusiones sin pruebas, sino en priorizar riesgos plausibles. Un diagrama de datos y STRIDE facilitan el análisis.",
      "en": "Threat modeling identifies assets, trust boundaries, actors, likely failure modes and mitigations. It is not about asserting breaches without evidence. Data-flow diagrams and STRIDE organize the analysis."
    },
    "exercise": {
      "pt": "Modele uma aplicação fictícia de notas: login, base de dados e navegador. Marque fronteiras de confiança, dois riscos e como verificaria as mitigação.",
      "es": "Modela una aplicación ficticia de notas: inicio de sesión, base de datos y navegador. Dibuja límites de confianza, dos riesgos y controles verificables.",
      "en": "Model a fictional grades app: login, database and browser. Mark trust boundaries, two risks and verifiable mitigations."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-013/2": {
    "read": {
      "pt": "Segurança ofensiva legítima exige consentimento explícito, escopo definido, tempo autorizado, recolha mínima de dados e divulgação responsável. Uma técnica permitida num laboratório isolado pode ser ilegal num sistema real. Conhecer os limites faz parte da competência profissional.",
      "es": "La seguridad ofensiva legítima exige consentimiento explícito, alcance delimitado, ventana autorizada y divulgación responsable. Una técnica aceptable en un laboratorio aislado puede ser ilegal en sistemas reales. Conocer límites es competencia profesional.",
      "en": "Legitimate offensive security requires explicit permission, a defined scope, approved time window and responsible disclosure. Techniques suitable for isolated labs may be illegal on real systems. Understanding boundaries is a professional skill."
    },
    "exercise": {
      "pt": "Redija regras de engagement para uma aplicação fictícia local: alvos permitidos, técnicas excluídas, horário, contactos e procedimento de parar perante dados pessoais.",
      "es": "Redacta reglas de actuación para una aplicación local ficticia: objetivos permitidos, exclusiones, horario, contactos y procedimiento de parada ante datos personales.",
      "en": "Write rules of engagement for a fictional local app: allowed targets, excluded techniques, timing, contacts and stop procedure for personal data."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-013/3": {
    "read": {
      "pt": "Atualizações, MFA, palavras-passe únicas e backups recuperáveis reduzem ataques comuns. Um gestor de palavras-passe diminui reutilização; MFA complementa mas não substitui proteção contra phishing. É importante verificar restauração de backups, não apenas a existência de cópias.",
      "es": "Actualizar, usar MFA, contraseñas únicas y copias restaurables reduce ataques frecuentes. Un gestor evita reutilización; MFA complementa pero no elimina el phishing. Una copia de seguridad sin prueba de restauración puede fallar justo cuando se necesita.",
      "en": "Updates, MFA, unique passwords and restorable backups reduce common attacks. A password manager reduces reuse; MFA helps but does not eliminate phishing. Backups need restore tests, not just successful creation."
    },
    "exercise": {
      "pt": "Produza uma checklist de cinco controlos para um pequeno centro educativo e uma forma segura de testar cada controlo sem expor informação real.",
      "es": "Prepara una lista de cinco controles para un pequeño centro de formación y una prueba segura de cada uno, sin revelar datos reales.",
      "en": "Create a five-control checklist for a small training center, with one safe verification step per control, using no real private data."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-014/0": {
    "read": {
      "pt": "HTML semântico usa títulos, secções, listas e elementos de interação de acordo com a sua função, não apenas aparência. Leitores de ecrã e motores de pesquisa dependem da estrutura. Use elementos nativos antes de reinventar botões e campos.",
      "es": "HTML semántico usa encabezados, secciones, listas y controles conforme a su función, no solo su apariencia. Lectores de pantalla y buscadores dependen de la estructura. Conviene usar elementos nativos antes que simular botones.",
      "en": "Semantic HTML uses headings, sections, lists and controls according to meaning, not appearance. Screen readers and search engines depend on structure. Prefer native elements instead of simulating buttons and fields."
    },
    "exercise": {
      "pt": "Escreva um esqueleto HTML de uma página de curso com header, nav, main, dois sections e footer; justifique a hierarquia de h1 e h2.",
      "es": "Crea el esqueleto HTML de una página de curso con header, nav, main, dos sections y footer, y justifica los encabezados h1/h2.",
      "en": "Create a course page outline with header, nav, main, two sections and footer. Explain its h1/h2 hierarchy."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-014/1": {
    "read": {
      "pt": "Acessibilidade começa com relações claras entre rótulos e controlos, ordem lógica de leitura, navegação por teclado e alternativas textuais. Atributos ARIA não substituem semântica correta. Testar sem rato identifica bloqueios comuns para muitos alunos.",
      "es": "La accesibilidad comienza por etiquetas asociadas, lectura lógica, navegación con teclado y textos alternativos. ARIA no sustituye a la semántica correcta. Probar sin ratón ayuda a detectar barreras frecuentes.",
      "en": "Accessibility starts with associated labels, logical reading order, keyboard navigation and text alternatives. ARIA does not replace correct semantics. Testing without a mouse reveals common barriers."
    },
    "exercise": {
      "pt": "Projete um formulário de inscrição fictício sem recolha real. Use labels, mensagens de erro descritivas e navegação por Tab; documente três problemas resolvidos.",
      "es": "Diseña un formulario de práctica sin recoger datos reales. Añade etiquetas, errores descriptivos y navegación con Tab. Documenta tres barreras resueltas.",
      "en": "Design a sample form without collecting real data. Use labels, descriptive errors and Tab navigation. Document three accessibility fixes."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-014/2": {
    "read": {
      "pt": "Formulários devem validar formato e restrições, mas validação no navegador é conveniência, não controlo de segurança do servidor. Mensagens específicas permitem corrigir entradas. Dados pessoais devem ser evitados quando a finalidade não os exige.",
      "es": "Los formularios deben validar formatos y restricciones; validar en el navegador facilita la experiencia, pero no sustituye controles de servidor. Los errores deben indicar cómo corregirlos. Solo se deben recoger los datos necesarios.",
      "en": "Forms should validate formats and constraints; browser checks improve experience but do not replace server-side controls. Error messages should explain what to fix. Collect only data that is necessary."
    },
    "exercise": {
      "pt": "Construa um formulário de contacto demonstrativo com type=email, required e aria-describedby, mantendo o submit local sem transmissão de dados.",
      "es": "Crea un formulario de contacto demostrativo con type=email, required y aria-describedby, sin enviar los datos a ningún servidor.",
      "en": "Build a demonstration contact form with type=email, required and aria-describedby; keep submission local with no data sent."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-014/3": {
    "read": {
      "pt": "Uma página institucional reúne proposta, navegação, conteúdo, ação e rodapé de forma compreensível. Desenho responsivo e segurança não são acabamentos: influenciam a arquitetura. Uma revisão útil combina semântica, testes mobile e instruções claras.",
      "es": "Una página institucional integra propuesta, navegación, contenido, acción y pie de página. Adaptabilidad y seguridad deben diseñarse desde el principio. La revisión incluye semántica, móvil e instrucciones claras.",
      "en": "An institutional website combines a proposition, navigation, content, an action and footer. Responsive design and security belong in architecture from the start. Review semantics, mobile behavior and clear instructions."
    },
    "exercise": {
      "pt": "Entregue um protótipo local de página institucional para a própria Secure T: estrutura acessível, CTA honesto e um plano de teste para ecrãs de 390 e 1280 px.",
      "es": "Entrega un prototipo local para Secure T: estructura accesible, llamada a la acción honesta y plan de prueba en 390 y 1280 px.",
      "en": "Deliver a local Secure T institutional page prototype with accessible structure, an honest CTA and a test plan at 390 and 1280 px."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-015/0": {
    "read": {
      "pt": "Design responsivo adapta conteúdo à largura disponível, não a modelos específicos de telemóvel. Flexbox organiza conjuntos unidimensionais e Grid cria grelhas bidimensionais. O conteúdo deve continuar legível com zoom a 200% e orientação diferente.",
      "es": "El diseño adaptable responde al ancho disponible y no a marcas concretas de móvil. Flexbox ordena elementos en una dimensión; Grid distribuye filas y columnas. El contenido debe seguir legible con zoom y cambios de orientación.",
      "en": "Responsive design adapts to available space, not particular phone models. Flexbox handles one-dimensional layout; Grid handles rows and columns. Content should remain legible with zoom and orientation changes."
    },
    "exercise": {
      "pt": "Faça duas variantes da mesma página: 390 px e 1280 px. Escolha Grid ou Flexbox para três elementos e explique por que não há deslocamento horizontal.",
      "es": "Haz dos versiones de una misma página, a 390 y 1280 px. Justifica Grid o Flexbox para tres elementos y evita el desplazamiento horizontal.",
      "en": "Build two versions of a page at 390 and 1280 px. Justify Grid or Flexbox choices for three elements and prevent horizontal overflow."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-015/1": {
    "read": {
      "pt": "Grid define colunas e linhas; Flexbox distribui elementos de acordo com o espaço. Misturá-los é comum: Grid no layout principal, Flexbox numa barra de ferramentas. Critérios de escolha incluem alinhamento, ordem semântica e comportamento em zoom.",
      "es": "Grid define columnas y filas; Flexbox distribuye elementos según el espacio. Pueden combinarse: Grid para la página y Flexbox para la barra. Importan alineación, orden semántico y comportamiento con zoom.",
      "en": "Grid defines columns and rows; Flexbox distributes items along an axis. They work together: Grid for the page and Flexbox for toolbars. Evaluate alignment, semantic order and zoom behavior."
    },
    "exercise": {
      "pt": "Construa um dashboard de três cartões sem frameworks: Grid no desktop e uma coluna no móvel. Explique as media queries e faça testes com teclado.",
      "es": "Crea un panel de tres tarjetas sin frameworks: Grid en escritorio y una columna en móvil. Explica las media queries y prueba el teclado.",
      "en": "Build a three-card dashboard without frameworks: Grid on desktop and one column on mobile. Explain media queries and test keyboard access."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-015/2": {
    "read": {
      "pt": "Tokens de design são variáveis para cor, espaçamento, tipografia e bordas. Usar tokens reduz inconsistência e facilita mudar tema sem reescrever componentes. Um design system deve definir estados de hover, foco, erro e desativado.",
      "es": "Los tokens de diseño son variables de color, espaciado, tipografía y bordes. Reducen inconsistencias y permiten cambiar el tema de forma centralizada. El sistema debe incluir hover, foco, errores y desactivación.",
      "en": "Design tokens are variables for color, spacing, typography and borders. They reduce inconsistency and make theme changes centralized. A system should include hover, focus, error and disabled states."
    },
    "exercise": {
      "pt": "Documente tokens CSS para superfície, texto, foco e separação. Aplique-os a cartão e botão e demonstre uma mudança de tema sem alterar os componentes.",
      "es": "Documenta tokens CSS de superficie, texto, foco y espacio. Aplícalos a una tarjeta y un botón y demuestra un cambio de tema sin editar componentes.",
      "en": "Document CSS tokens for surface, text, focus and spacing. Apply them to a card and button and demonstrate theme switching without rewriting components."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-015/3": {
    "read": {
      "pt": "Contraste não é apenas gosto estético: afeta a leitura de texto pequeno, estados e mensagens. O WCAG define metas verificáveis para várias situações. Não comunique erros apenas por cor; combine ícone, texto e associação acessível.",
      "es": "El contraste afecta a textos pequeños, estados y mensajes. WCAG establece objetivos medibles. No comuniques errores solo mediante colores; combina icono, texto y asociaciones accesibles.",
      "en": "Contrast affects small text, states and messages. WCAG provides testable goals. Never communicate errors only with color; combine icons, text and accessible associations."
    },
    "exercise": {
      "pt": "Faça uma auditoria de contraste e foco de uma tela fictícia. Identifique três correções e descreva como confirmar que funcionam em tema escuro e claro.",
      "es": "Audita contraste y foco en una pantalla ficticia. Identifica tres correcciones y cómo comprobarlas en modo claro y oscuro.",
      "en": "Audit contrast and focus on a sample screen. Identify three fixes and how to verify them in light and dark modes."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-016/0": {
    "read": {
      "pt": "Uma introdução profissional deve situar quem fala, área de estudo, competências em desenvolvimento e objetivo. Em inglês técnico, clareza e vocabulário correto importam mais que sotaque. Praticar apresentações curtas torna reuniões internacionais menos intimidantes.",
      "es": "Una presentación profesional explica quién habla, qué estudia, qué habilidades desarrolla y qué busca. En inglés técnico importa más la claridad que el acento. Las presentaciones breves preparan para reuniones internacionales.",
      "en": "A professional introduction states who you are, what you study, which skills you are developing and your goal. In technical English, clarity matters more than accent. Short practice builds confidence for international meetings."
    },
    "exercise": {
      "pt": "Escreva e diga em voz alta uma apresentação de 45 segundos em inglês com três informações concretas. Grave apenas se desejar e não partilhe dados pessoais.",
      "es": "Escribe y practica una presentación de 45 segundos en inglés con tres datos concretos. Graba solo si quieres, sin compartir información privada.",
      "en": "Write and speak a 45-second English introduction with three concrete facts. Record only if you choose and avoid private details."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-016/1": {
    "read": {
      "pt": "Termos como throughput, latency, packet loss, firewall e endpoint descrevem propriedades diferentes. Traduzir tudo literalmente pode causar erros. Um glossário útil inclui definição, exemplo, contexto e um falso amigo a evitar.",
      "es": "Términos como throughput, latency, packet loss, firewall y endpoint describen conceptos distintos. Traducirlos literalmente puede confundir. Un glosario útil incluye definición, ejemplo, contexto y falsos amigos.",
      "en": "Terms such as throughput, latency, packet loss, firewall and endpoint mean different things. Literal translation can mislead. Useful glossaries include definitions, examples, usage contexts and false friends."
    },
    "exercise": {
      "pt": "Prepare cinco cartões PT–EN de vocabulário de redes, com definição própria e exemplo de frase profissional. Pratique a pronúncia no sintetizador local.",
      "es": "Prepara cinco tarjetas PT–EN de redes con definición y ejemplo de uso profesional. Practica pronunciación con el sintetizador local.",
      "en": "Prepare five PT–EN network vocabulary cards, each with your own definition and professional example sentence. Practise with local speech synthesis."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-016/2": {
    "read": {
      "pt": "Ler documentação em inglês exige identificar propósito, pré-requisitos, avisos e comandos de exemplo. Não copie comandos sem compreender o efeito: leia secções de segurança e valide o ambiente. Um resumo estruturado ajuda a aplicar conhecimento com rigor.",
      "es": "Leer documentación en inglés exige identificar propósito, requisitos, advertencias y ejemplos. No ejecutes comandos sin entender sus efectos: revisa seguridad y entorno. Un resumen estructurado ayuda a aplicar conocimientos con rigor.",
      "en": "Reading English documentation means finding its purpose, prerequisites, warnings and examples. Never run commands without understanding their effects. A structured summary helps apply knowledge responsibly."
    },
    "exercise": {
      "pt": "Escolha uma página pública de documentação HTML ou Python. Registe em inglês objetivo, dois pré-requisitos, um aviso e uma pergunta que faria ao autor.",
      "es": "Elige documentación pública de HTML o Python. Resume en inglés el objetivo, dos requisitos, una advertencia y una pregunta al autor.",
      "en": "Choose a public HTML or Python documentation page. Write an English summary with purpose, two prerequisites, one warning and one question for its author."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  },
  "ST-016/3": {
    "read": {
      "pt": "Uma apresentação oral técnica tem abertura, situação, escolha fundamentada, evidência e encerramento. Vocabulário simples, ritmo controlado e exemplos reduzem ambiguidades. Perguntas devem poder ser respondidas com dados, não apenas confiança.",
      "es": "Una presentación técnica oral necesita apertura, situación, decisión justificada, evidencia y cierre. Lenguaje simple, ritmo controlado y ejemplos reducen ambigüedades. Las preguntas se responden con datos, no solo seguridad verbal.",
      "en": "A technical presentation needs an opening, context, reasoned decision, evidence and conclusion. Simple language, pacing and examples reduce ambiguity. Questions should be answered with evidence, not just confidence."
    },
    "exercise": {
      "pt": "Apresente em inglês durante dois minutos uma melhoria de acessibilidade numa página. Use um esquema de cinco frases e peça a um colega que avalie clareza e evidências.",
      "es": "Expón durante dos minutos en inglés una mejora de accesibilidad. Usa un esquema de cinco frases y pide opinión sobre claridad y evidencia.",
      "en": "Give a two-minute English presentation on a website accessibility improvement. Use a five-sentence outline and ask for feedback on clarity and evidence."
    },
    "status": "authored",
    "estimatedStudyMinutes": 90,
    "scope": "first semester",
    "review": "editorial-review-needed"
  }
};
