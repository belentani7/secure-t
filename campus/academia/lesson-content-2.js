/* Secure T · independently authored second-semester readings and practices.
   These are introductory learning notes, not accredited university lessons. */
(function(){
  "use strict";
  const catalog={
  "ST-021/0": {
    "read": {
      "pt": "A shell interpreta comandos e interage com arquivos, processos e variáveis do sistema. Caminhos relativos dependem do diretório atual e caminhos absolutos não. Antes de modificar um ambiente, identifique onde está e use operações de leitura.",
      "es": "La shell interpreta órdenes y maneja archivos, procesos y variables. Las rutas relativas dependen del directorio actual y las absolutas no. Antes de modificar un entorno, comprueba dónde estás y utiliza operaciones de lectura.",
      "en": "The shell interprets commands and works with files, processes, and environment variables. Relative paths depend on the current folder, while absolute paths do not. Inspect your context with read-only commands before making changes."
    },
    "exercise": {
      "pt": "Crie uma pasta de laboratório pessoal. Registe o caminho atual, liste três arquivos e explique a diferença entre uma rota absoluta e relativa sem alterar dados de terceiros.",
      "es": "Crea una carpeta personal de prácticas. Anota la ruta actual, enumera tres archivos y explica rutas absolutas y relativas sin modificar datos ajenos.",
      "en": "Create a personal lab folder. Record the current path, list three files, and explain absolute versus relative paths without modifying other people's data."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-021/1": {
    "read": {
      "pt": "Contas individuais identificam utilizadores e grupos agregam permissões. Uma conta administrativa aumenta o impacto de erros se for usada sem necessidade. O ciclo de acesso inclui concessão, revisão periódica, suspensão e remoção.",
      "es": "Las cuentas identifican usuarios y los grupos agrupan permisos. Las cuentas administrativas aumentan las consecuencias de un error cuando se usan sin necesidad. El acceso debe concederse, revisarse y revocarse de forma responsable.",
      "en": "Individual accounts identify users and groups organize privileges. Unnecessary administrative access raises the consequences of mistakes. Account lifecycle management requires provisioning, periodic review, suspension, and revocation."
    },
    "exercise": {
      "pt": "Desenhe uma matriz de acesso fictícia para aluno, docente, operador e auditor. Especifique quem lê, altera ou aprova cada recurso e duas operações que devem ser negadas.",
      "es": "Diseña una matriz ficticia para alumno, docente, operador y auditor. Especifica quién lee, cambia o aprueba cada recurso y dos acciones prohibidas.",
      "en": "Design a fictional access matrix for learners, teachers, operators, and auditors. Define who reads, edits, or approves each resource and two denied operations."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-021/2": {
    "read": {
      "pt": "Em sistemas Unix, leitura, escrita e execução podem ser atribuídas separadamente a dono, grupo e outros. Cada processo corre sob uma identidade com direitos específicos. Uma permissão excessiva pode permitir alterações muito além da tarefa prevista.",
      "es": "En sistemas Unix, lectura, escritura y ejecución se asignan a propietario, grupo y otros. Cada proceso actúa con una identidad y permisos concretos. Un permiso excesivo puede permitir cambios fuera de la tarea prevista.",
      "en": "Unix systems assign read, write, and execute permissions to owner, group, and others. Processes run under specific identities. Excessive rights can allow changes beyond the work a service actually needs."
    },
    "exercise": {
      "pt": "Interprete as permissões rwxr-x--- de um arquivo hipotético. Indique o que podem fazer dono, grupo e outros e proponha uma configuração mais restritiva para uma chave privada.",
      "es": "Interpreta los permisos rwxr-x--- de un archivo ficticio. Explica las capacidades de cada grupo y diseña permisos seguros para una clave privada.",
      "en": "Interpret rwxr-x--- on a fictional file. Explain each subject's permissions, then propose more restrictive access for a private key."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-021/3": {
    "read": {
      "pt": "Hardening reduz a superfície de ataque removendo serviços supérfluos e configurando acesso, atualizações e cópias seguras. Cada mudança deve ter uma linha de base, teste de eficácia e forma de reversão. A documentação é parte do controlo.",
      "es": "El endurecimiento reduce la superficie de ataque al quitar servicios innecesarios y configurar accesos, actualizaciones y copias seguras. Cada cambio requiere estado inicial, prueba y reversión documentada.",
      "en": "Hardening reduces attack surface by disabling unnecessary services and improving access, updates, and backups. Every change needs a baseline, an effectiveness test, and a rollback method. Documentation is part of the control."
    },
    "exercise": {
      "pt": "Elabore uma checklist de cinco controlos de hardening para uma máquina virtual sua. Para cada um, indique risco mitigado, evidência de verificação e plano de reversão.",
      "es": "Redacta cinco controles de endurecimiento para una máquina virtual propia. Incluye riesgo, prueba de aplicación y procedimiento de reversión.",
      "en": "Draft five hardening controls for your own virtual machine. State the mitigated risk, verification evidence, and rollback steps for each."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-022/0": {
    "read": {
      "pt": "Um roteador encaminha pacotes entre redes; uma VLAN separa logicamente grupos dentro de uma infraestrutura física. A segmentação limita tráfego desnecessário, mas precisa de regras explícitas de acesso. A tabela de rotas explica o caminho esperado.",
      "es": "Un router reenvía paquetes entre redes; una VLAN separa grupos lógicos en la misma infraestructura. Segmentar limita el tráfico innecesario, pero necesita reglas de acceso explícitas. La tabla de rutas describe el trayecto esperado.",
      "en": "A router forwards packets between networks; VLANs create logical segments over shared physical infrastructure. Segmentation limits unnecessary traffic but still requires access rules. Routing tables explain expected packet paths."
    },
    "exercise": {
      "pt": "Desenhe três VLANs imaginárias: alunos, operação e laboratório. Mostre duas comunicações permitidas e duas bloqueadas, justificando cada decisão sem testar redes alheias.",
      "es": "Dibuja tres VLAN imaginarias: alumnos, operaciones y laboratorio. Indica dos comunicaciones permitidas y dos bloqueadas, justificando la política.",
      "en": "Draw three fictional VLANs for learners, operations, and labs. Specify two permitted and two blocked connections with policy justification."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-022/1": {
    "read": {
      "pt": "TLS cifra o tráfego e procura autenticar o servidor. Certificados associam nomes de domínio a chaves públicas, validados por uma cadeia de confiança e datas. O ícone de cadeado não prova que a empresa ou o conteúdo sejam honestos.",
      "es": "TLS cifra el tráfico y permite autenticar servidores. Un certificado relaciona dominio y clave pública bajo una cadena de confianza y fechas de validez. El candado no garantiza que la información del sitio sea verdadera.",
      "en": "TLS encrypts traffic and helps authenticate the server. Certificates bind domains to public keys, validated by trust chains and expiration dates. A padlock does not establish that a site's content is truthful."
    },
    "exercise": {
      "pt": "Num diagrama HTTPS fictício identifique CA, certificado, chave pública e chave privada. Explique o procedimento seguro quando o certificado está expirado.",
      "es": "En un diagrama HTTPS ficticio señala autoridad, certificado, clave pública y privada. Explica qué hacer si la validez ha caducado.",
      "en": "In a fictional HTTPS diagram, label the CA, certificate, public key, and private key. Explain safe handling of an expired certificate."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-022/2": {
    "read": {
      "pt": "Firewalls aplicam políticas para permitir ou negar fluxos segundo origem, destino, porta e direção. O princípio negar por defeito ajuda a reduzir exposição. Uma regra sem justificação e validação pode bloquear serviços legítimos.",
      "es": "Los cortafuegos aplican políticas basadas en origen, destino, puerto y sentido del tráfico. Denegar por defecto reduce exposición, pero una regla sin justificación ni comprobación puede cortar servicios legítimos.",
      "en": "Firewalls enforce allow or deny policies based on origin, destination, port, and direction. Default deny can reduce exposure, but poorly justified rules may interrupt legitimate services."
    },
    "exercise": {
      "pt": "Escreva três regras para uma rede de laboratório sintética, incluindo uma negação. Identifique o serviço legítimo protegido e como analisaria logs de teste para validar a política.",
      "es": "Propón tres reglas para un laboratorio ficticio, incluida una denegación. Especifica el servicio protegido y cómo comprobarías registros simulados.",
      "en": "Write three rules for a synthetic lab network, including a deny rule. Identify the protected service and how synthetic logs could validate the policy."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-022/3": {
    "read": {
      "pt": "Os logs de rede registam eventos mas podem omitir pacotes e apresentar relógios desalinhados. Um diagnóstico sólido correlaciona fontes, ordena datas no mesmo fuso e distingue hipóteses de conclusões demonstradas. A origem dos dados deve ser documentada.",
      "es": "Los registros de red pueden omitir tráfico y tener relojes desajustados. Un buen diagnóstico correlaciona varias fuentes, normaliza las horas y distingue hipótesis de hechos. Es esencial documentar la procedencia.",
      "en": "Network logs may omit traffic and contain clock drift. Sound troubleshooting correlates sources, normalizes time zones, and separates hypotheses from established facts. The origin of evidence must be documented."
    },
    "exercise": {
      "pt": "Crie quatro entradas de log fictícias em dois fusos horários. Organize uma cronologia, formule duas hipóteses e descreva a prova necessária para cada uma.",
      "es": "Crea cuatro registros ficticios en dos husos horarios. Ordena la cronología, plantea dos hipótesis y señala la evidencia que necesitarías.",
      "en": "Create four fictional log entries in two time zones. Build a timeline, propose two hypotheses, and identify evidence needed to verify each."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-023/0": {
    "read": {
      "pt": "Python possui tipos como inteiros, strings, listas e dicionários. Funções recebem parâmetros e devolvem resultados, evitando repetição. Anotações de tipos melhoram a leitura do código, mas dados externos ainda precisam ser verificados em execução.",
      "es": "Python incorpora enteros, cadenas, listas y diccionarios. Las funciones reciben parámetros y devuelven resultados para evitar duplicación. Las anotaciones ayudan a comprender el código, pero no validan datos externos por sí solas.",
      "en": "Python provides integers, strings, lists, and dictionaries. Functions accept parameters and return results to avoid duplication. Type annotations improve readability but do not themselves validate external inputs at runtime."
    },
    "exercise": {
      "pt": "Escreva uma função que some minutos de estudo e calcule média. Documente o caso de lista vazia e entradas negativas; execute três testes com dados sintéticos.",
      "es": "Escribe una función que calcule el total y la media de minutos de estudio. Define lista vacía y negativos y ejecuta tres pruebas sintéticas.",
      "en": "Write a function calculating total and average study minutes. Define behavior for empty and negative inputs, then run three synthetic tests."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-023/1": {
    "read": {
      "pt": "A leitura de arquivos envolve caminhos, codificação e tratamento de exceções. Um context manager fecha recursos mesmo quando uma operação falha. Capturar todos os erros silenciosamente impede diagnóstico e pode esconder falhas de segurança.",
      "es": "La lectura de archivos depende de rutas, codificación y excepciones. Un administrador de contexto cierra recursos tras fallos. Capturar cualquier error sin informarlo oculta defectos y puede perjudicar la seguridad.",
      "en": "File access depends on paths, encoding, and exception handling. Context managers release resources even after failures. Silently catching every exception can hide defects and security problems."
    },
    "exercise": {
      "pt": "Construa um leitor de CSV sintético que trate arquivo inexistente, linha inválida e Unicode. Registe as mensagens de erro úteis sem mostrar segredos ou caminhos privados.",
      "es": "Crea un lector CSV sintético que maneje archivo ausente, fila inválida y Unicode. Documenta errores útiles sin exponer secretos.",
      "en": "Build a synthetic CSV reader handling missing files, invalid rows, and Unicode. Document useful errors without exposing private paths or secrets."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-023/2": {
    "read": {
      "pt": "APIs HTTP usam métodos, caminhos e códigos de estado para representar operações. Um cliente deve definir timeout, validar JSON recebido e tratar falhas de rede. Mesmo uma resposta de servidor conhecido pode conter dados inesperados.",
      "es": "Las API HTTP usan métodos, rutas y estados para describir operaciones. Los clientes deben establecer límites de espera, validar JSON y tratar fallos de conexión. Un servidor conocido también puede devolver datos inesperados.",
      "en": "HTTP APIs use methods, paths, and status codes to describe operations. Clients should set timeouts, validate JSON responses, and handle network failures. Even a trusted server can return unexpected data."
    },
    "exercise": {
      "pt": "Desenhe uma API de biblioteca escolar com GET público e POST autenticado. Defina três erros, timeout e validação das propriedades recebidas, sem publicar dados reais.",
      "es": "Diseña una API de biblioteca con GET de lectura y POST autenticado. Especifica tres errores, tiempo límite y validación de datos.",
      "en": "Design a school-library API with a public GET and authenticated POST. Specify three errors, a timeout, and data validation requirements."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-023/3": {
    "read": {
      "pt": "Automação defensiva transforma verificações repetitivas em rotinas auditáveis, como conferir a integridade de backups. Scripts devem usar menor privilégio, entradas permitidas e modo de simulação. Qualquer alteração precisa de reversão verificável.",
      "es": "La automatización defensiva convierte comprobaciones frecuentes en rutinas auditables, como revisar copias de seguridad. Los scripts deben limitar privilegios, validar entradas y permitir simulación. Los cambios requieren reversión.",
      "en": "Defensive automation turns repeated verification into auditable routines, such as backup integrity checks. Scripts need least privilege, validated inputs, and dry-run options. Changes require a verified rollback path."
    },
    "exercise": {
      "pt": "Projete um script apenas de leitura que compara cópias fictícias com um inventário esperado. Produza um relatório das diferenças e uma política para não modificar arquivos.",
      "es": "Diseña un script de solo lectura que compare copias ficticias con un inventario y genere un informe sin modificar los datos.",
      "en": "Design a read-only script comparing fictional backups against an inventory, producing a difference report without modifying files."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-024/0": {
    "read": {
      "pt": "O DOM representa a página como uma árvore. Eventos de clique e entrada permitem interações acessíveis se forem usados elementos semânticos. Inserir dados externos com textContent impede que sejam interpretados como HTML ou scripts.",
      "es": "El DOM representa la página como un árbol. Los eventos de clic y entrada conectan interacción y lógica, siempre con elementos semánticos. Mostrar entradas con textContent evita interpretarlas como HTML ejecutable.",
      "en": "The DOM models a page as a tree. Click and input events connect accessible interaction to logic through semantic elements. Rendering untrusted input with textContent prevents it being interpreted as executable HTML."
    },
    "exercise": {
      "pt": "Crie uma página com input etiquetado, botão e região aria-live. Insira o texto com textContent e teste teclado e símbolos que poderiam formar tags.",
      "es": "Crea una página con entrada etiquetada, botón y aria-live. Usa textContent y prueba teclado y símbolos de etiquetas.",
      "en": "Build a page with labeled input, button, and aria-live output. Use textContent and test keyboard use and tag-like characters."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-024/1": {
    "read": {
      "pt": "Módulos JavaScript separam responsabilidades com import e export. Funções async devolvem promessas que podem falhar; duas chamadas concorrentes podem terminar fora de ordem. A interface deve ignorar respostas antigas quando o utilizador inicia outra pesquisa.",
      "es": "Los módulos JavaScript organizan responsabilidades con import y export. Las funciones async retornan promesas que pueden fallar; dos tareas pueden acabar en orden inverso. La interfaz debe descartar resultados antiguos.",
      "en": "JavaScript modules separate concerns with imports and exports. Async functions return promises that can reject; concurrent requests can finish out of order. Interfaces must ignore stale responses after new searches."
    },
    "exercise": {
      "pt": "Simule duas pesquisas de biblioteca com atrasos diferentes. Mostre apenas o resultado da pesquisa mais recente e documente o tratamento de uma rejeição.",
      "es": "Simula dos búsquedas con retardos distintos. Muestra solo el resultado nuevo y documenta el manejo de errores.",
      "en": "Simulate two course-library searches with different delays. Show only the latest result and document rejection handling."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-024/2": {
    "read": {
      "pt": "Erros de interface incluem respostas inválidas, falha de conexão e estado inesperado. A mensagem apresentada deve ajudar o utilizador sem revelar tokens ou detalhes internos. A recuperação precisa de ação acessível, como repetir ou regressar.",
      "es": "Los errores de interfaz incluyen datos incorrectos, conexión fallida y estados inesperados. Los mensajes deben ayudar sin exponer tokens o detalles internos. La recuperación requiere acciones accesibles, como reintentar.",
      "en": "Interface failures include invalid responses, lost connectivity, and unexpected state. User-facing messages should help without revealing secrets or internal details. Recovery requires accessible retry or navigation actions."
    },
    "exercise": {
      "pt": "Desenhe os estados de carregamento, sucesso e erro recuperável de uma aplicação fictícia. Inclua um botão de tentar novamente e mensagens sem dados sensíveis.",
      "es": "Diseña carga, éxito y error recuperable de una aplicación simulada, con botón de reintento y mensajes sin datos privados.",
      "en": "Design loading, success, and recoverable-error states for a fake app, including a retry control and messages without sensitive data."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-024/3": {
    "read": {
      "pt": "Testes de componentes verificam resultados observáveis, como mensagens, validação e comportamento por teclado. Casos vazios e falhas são tão importantes quanto sucesso. Os mocks devem reproduzir os contratos reais ou o teste oferecerá falsa confiança.",
      "es": "Las pruebas de componentes observan mensajes, validaciones y uso del teclado. Los casos vacíos y los fallos importan tanto como el éxito. Las simulaciones deben reflejar contratos reales para evitar falsas garantías.",
      "en": "Component tests check observable outputs, messages, validation, and keyboard behavior. Empty states and failures matter as much as success. Mocks must represent real contracts to avoid false confidence."
    },
    "exercise": {
      "pt": "Escreva quatro testes para um formulário fictício: entrada válida, ausência de campo, falha de serviço e operação por teclado. Defina o resultado observável.",
      "es": "Redacta cuatro pruebas de un formulario ficticio: válido, campo vacío, servicio fallido y teclado, con resultados observables.",
      "en": "Write four tests for a fictional form: valid input, missing field, service failure, and keyboard access, each with observable outcomes."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-025/0": {
    "read": {
      "pt": "Git regista snapshots em commits imutáveis e branches permitem trabalho paralelo. Um commit pequeno torna revisão e reversão mais seguras. A mensagem deve explicar a motivação, não apenas listar arquivos alterados.",
      "es": "Git guarda versiones en commits identificables y permite trabajar en ramas. Los commits pequeños facilitan revisión y reversión. Sus mensajes deben explicar la motivación además de los archivos cambiados.",
      "en": "Git records snapshots in identifiable commits, and branches support parallel work. Small commits simplify review and rollback. Messages should explain the reason for a change, not merely list edited files."
    },
    "exercise": {
      "pt": "Num repositório local, crie três commits de uma página de exemplo e uma branch. Desenhe o histórico e explique como recuperar uma versão sem destruir outras.",
      "es": "En un repositorio local crea tres commits y una rama. Dibuja su historia y explica cómo recuperar versiones sin destruir trabajo.",
      "en": "In a local practice repo create three commits and a branch. Diagram history and explain how to restore a version without destroying work."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-025/1": {
    "read": {
      "pt": "Pull requests reúnem contexto, alterações, testes e discussão antes da integração. Uma descrição útil comunica risco, impacto e plano de reversão. Aprovação humana e testes automáticos têm funções diferentes e complementares.",
      "es": "Los pull requests reúnen cambios, contexto, pruebas y revisión antes de integrarse. Describir riesgo, impacto y reversión permite decisiones informadas. Revisión humana y automatización se complementan.",
      "en": "Pull requests collect changes, context, tests, and discussion before integration. Describing risks, impact, and rollback enables informed decisions. Human review and automated checks complement one another."
    },
    "exercise": {
      "pt": "Redija um PR hipotético com resumo, testes e riscos. Peça uma revisão específica e indique os critérios necessários antes de fazer merge.",
      "es": "Redacta un PR ficticio con resumen, pruebas, riesgos y criterios de fusión. Solicita dos revisiones concretas.",
      "en": "Draft a hypothetical PR with summary, tests, risks, and merge criteria. Request two specific review checks."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-025/2": {
    "read": {
      "pt": "Uma revisão de código examina defeitos, segurança, legibilidade e compatibilidade sem atacar quem escreveu. Observações devem apontar um cenário reproduzível e uma sugestão verificável. Procure também credenciais e alterações fora do escopo.",
      "es": "La revisión de código busca defectos, seguridad, claridad y compatibilidad sin juzgar a la persona. Un comentario útil explica un problema reproducible y cómo verificar la mejora. También examina secretos y alcance.",
      "en": "Code review evaluates defects, security, clarity, and compatibility without judging the author. Useful feedback describes reproducible risks and verifiable improvements. Reviewers also inspect secrets and scope."
    },
    "exercise": {
      "pt": "Revise uma função inventada que mostra mensagens do utilizador. Aponte três riscos e escreva dois comentários claros com formas de testar a correção.",
      "es": "Revisa una función inventada que muestra mensajes. Señala tres riesgos y redacta dos comentarios con pruebas propuestas.",
      "en": "Review a made-up user-message display function. Identify three risks and write two comments with testable fixes."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-025/3": {
    "read": {
      "pt": "Integração contínua automatiza lint, tipos, testes, compilação e análise de segredos. Um pipeline verde confirma apenas os controlos executados; não garante a ausência de vulnerabilidades. As falhas precisam de investigação, nunca de desativação oportunista.",
      "es": "La integración continua automatiza estilo, tipos, pruebas, compilación y detección de secretos. Pasar CI demuestra esas verificaciones, no ausencia absoluta de errores. Los fallos requieren análisis, no desactivación.",
      "en": "Continuous integration automates lint, types, tests, builds, and secret detection. A green result only covers the checks that ran; it cannot prove a system has no defects. Failures require investigation rather than disabling gates."
    },
    "exercise": {
      "pt": "Desenhe um pipeline com cinco fases e uma política de bloqueio de merge. Simule uma falha de teste e documente o diagnóstico sem contornar a regra.",
      "es": "Diseña cinco controles CI y bloqueo de fusión. Simula una prueba fallida e investígala sin omitir el control.",
      "en": "Design five CI stages and merge blocking. Simulate a failed test and explain investigation without bypassing checks."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-026/0": {
    "read": {
      "pt": "Uma apresentação técnica em espanhol deve mencionar função, experiência e objetivo com linguagem clara. Perguntas abertas ajudam a entender o interlocutor e o contexto cultural. Confirme sempre se a mensagem foi compreendida.",
      "es": "Una presentación técnica clara comunica función, experiencia y objetivo. Las preguntas abiertas muestran interés por el contexto y evitan suposiciones. Conviene comprobar que la otra persona ha entendido.",
      "en": "A technical introduction in Spanish should communicate role, experience, and purpose clearly. Open questions clarify the other person's context and prevent assumptions. Confirm mutual understanding."
    },
    "exercise": {
      "pt": "Grave no dispositivo uma apresentação de 60 segundos em espanhol e duas perguntas abertas. Compare com a transcrição, anotando termos e pronúncia.",
      "es": "Graba en privado una presentación de 60 segundos en español y dos preguntas abiertas. Revisa los términos con la transcripción.",
      "en": "Privately record a 60-second Spanish introduction with two open questions. Compare terminology and pronunciation against a transcript."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-026/1": {
    "read": {
      "pt": "Vocabulário de suporte em espanhol inclui incidencia, prioridad, impacto, diagnóstico e seguimiento. Separar sintomas relatados de causas confirmadas evita promessas falsas. Uma boa resposta especifica responsável e próximo passo.",
      "es": "El soporte técnico emplea incidencia, prioridad, impacto, diagnóstico y seguimiento. Hay que diferenciar síntomas de causas confirmadas para evitar promesas. Una respuesta útil define responsable y siguiente paso.",
      "en": "Spanish support vocabulary includes incidencia, prioridad, impacto, diagnóstico, and seguimiento. Separating reported symptoms from verified causes prevents false promises. A good response names an owner and next step."
    },
    "exercise": {
      "pt": "Crie doze termos técnicos com tradução português-espanhol e responda a três tickets fictícios sem assumir causas que não foram confirmadas.",
      "es": "Crea doce términos portugués-español y responde a tres incidencias ficticias sin dar por confirmadas las causas.",
      "en": "Create twelve Portuguese-to-Spanish technical terms and respond to three fictional tickets without inventing root causes."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-026/2": {
    "read": {
      "pt": "Tickets técnicos registam problema, ambiente, impacto, reprodução e evidência. Ao ler espanhol, identifique palavras de urgência sem confundi-las com severidade verificada. Preserve a privacidade e solicite apenas o mínimo necessário.",
      "es": "Un ticket describe problema, entorno, impacto, reproducción y pruebas. Las palabras de urgencia no demuestran gravedad técnica. Preserva privacidad y pide solo los datos imprescindibles.",
      "en": "Technical tickets capture problem, environment, impact, reproduction, and evidence. Urgent wording does not prove technical severity. Protect privacy and request only necessary information."
    },
    "exercise": {
      "pt": "Leia três tickets sintéticos em espanhol. Extraia o problema, contexto, impacto e uma pergunta de esclarecimento; reescreva uma descrição vaga sem inventar factos.",
      "es": "Lee tres tickets ficticios y extrae problema, contexto, impacto y una pregunta, reescribiendo una petición vaga sin inventar hechos.",
      "en": "Read three synthetic Spanish tickets. Extract problem, context, impact, and one follow-up question; rewrite vague information without invented facts."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  },
  "ST-026/3": {
    "read": {
      "pt": "Um relatório oral de incidente deve separar factos, hipóteses e ações autorizadas. Conectores como primero, después e por último estruturam a exposição. Expressões de incerteza como quizá ou aún no confirmado evitam conclusões precipitadas.",
      "es": "Al explicar un incidente oralmente hay que separar hechos, hipótesis y actuaciones autorizadas. Conectores como primero, después y por último ordenan la secuencia. Quizá y aún no confirmado expresan incertidumbre con precisión.",
      "en": "An oral incident briefing should separate facts, hypotheses, and authorized action. Spanish markers primero, después, and por último structure the sequence. Quizá and aún no confirmado convey necessary uncertainty."
    },
    "exercise": {
      "pt": "Apresente por 90 segundos um incidente simulado em espanhol com dois factos, uma hipótese e um próximo passo autorizado. Ouça novamente e melhore três expressões.",
      "es": "Expón durante 90 segundos una incidencia simulada con dos hechos, una hipótesis y una acción autorizada. Escucha y mejora tres expresiones.",
      "en": "Deliver a 90-second Spanish simulated incident briefing with two facts, one hypothesis, and an authorized next step. Listen again and improve three expressions."
    },
    "status": "authored",
    "scope": "second semester",
    "estimatedStudyMinutes": 95,
    "review": "editorial-review-needed"
  }
};
  if(!window.SecureTStudyGuides)return;
  for(const [key,guide] of Object.entries(catalog)){
    if(!key.startsWith("ST-02") || Object.prototype.hasOwnProperty.call(window.SecureTStudyGuides,key))continue;
    window.SecureTStudyGuides[key]=guide;
  }
})();
