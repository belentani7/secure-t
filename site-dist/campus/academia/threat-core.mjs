// Secure T — offline threat-modeling practice. Synthetic systems only.
export const LANGUAGES=['pt','es','en'];
const T=(pt,es,en)=>({pt,es,en});
export const THREATS=[
 {id:'student-records',category:'Spoofing / access control',likelihood:4,impact:5,
 asset:T('Progresso e notas de alunos','Progreso y notas del alumnado','Learner progress and grades'),
 boundary:T('Navegador não confiável → API autenticada','Navegador no fiable → API autenticada','Untrusted browser → authenticated API'),
 observation:T('Um aluno muda um identificador na URL e tenta ver o progresso de outra pessoa.','Un estudiante cambia un identificador de la URL para leer el progreso de otra persona.','A learner alters a URL identifier to read another student’s progress.'),
 question:T('Qual defesa deve ser aplicada ao consultar cada registro?','¿Qué defensa hay que aplicar al consultar cada registro?','What protection belongs on every record lookup?'),
 choices:[T('Verificar sessão, identidade e propriedade do recurso no servidor em cada acesso.','Comprobar sesión, identidad y propiedad del recurso en el servidor en cada acceso.','Enforce session, identity and object authorization on every server request.'),
 T('Esconder o link da navegação, sem validação de servidor.','Esconder el enlace del menú, sin autorización en el servidor.','Hide the link from navigation without server authorization.'),
 T('Confiar em identificadores de URL difíceis de adivinhar.','Confiar en identificadores de URL difíciles de adivinar.','Rely on hard-to-guess URL identifiers.')],correct:0,
 rationale:T('Controles de interface não substituem autorização por recurso no backend.','Los controles de interfaz no sustituyen la autorización por recurso en el backend.','UI controls do not replace object-level authorization in the backend.'),
 evidence:T('Testes de dois usuários fictícios e tentativa de acesso cruzado bloqueada.','Pruebas de dos usuarios ficticios y acceso cruzado bloqueado.','Two synthetic accounts and a blocked cross-user record request.')},
 {id:'untrusted-upload',category:'Tampering / upload',likelihood:3,impact:5,
 asset:T('Arquivos e processador de tarefas','Archivos y procesador de entregas','Submission files and processor'),
 boundary:T('Arquivo externo → ambiente de processamento','Archivo externo → entorno de procesamiento','External file → processing environment'),
 observation:T('Um aluno envia um arquivo para correção e o sistema processa o conteúdo.','Un estudiante entrega un archivo y el sistema procesa su contenido.','A student uploads a file that the system automatically processes.'),
 question:T('Qual desenho protege o processamento de arquivos não confiáveis?','¿Qué diseño protege el procesamiento de archivos no fiables?','Which design protects untrusted-file processing?'),
 choices:[T('Executar o arquivo com privilégios de administrador.','Ejecutar el archivo con privilegios de administrador.','Run the file with administrator privileges.'),
 T('Confiar apenas na extensão informada pelo navegador.','Confiar únicamente en la extensión indicada por el navegador.','Trust only the filename extension sent by the browser.'),
 T('Validar formato/tamanho e processar isolado, sem privilégios, longe da pasta pública.','Validar formato/tamaño y procesar aislado, sin privilegios, fuera de la carpeta pública.','Validate format and size, process without privileges in isolation, outside the public root.')],correct:2,
 rationale:T('Uploads atravessam fronteiras de confiança; validação e isolamento limitam impacto.','Las cargas cruzan límites de confianza; validación y aislamiento reducen daños.','Uploads cross trust boundaries; validation and sandboxing reduce exposure.'),
 evidence:T('Testes com arquivos inválidos, limite de tamanho e ambiente de execução isolado.','Pruebas con archivos inválidos, límite de tamaño y entorno aislado.','Invalid-file tests, file-size limit and sandboxed processing policy.')},
 {id:'retrieved-prompt',category:'Information disclosure / AI',likelihood:4,impact:4,
 asset:T('Material privado usado pelo tutor IA','Material privado usado por el tutor IA','Private material used by the AI tutor'),
 boundary:T('Texto recuperado → contexto do modelo','Texto recuperado → contexto del modelo','Retrieved text → model context'),
 observation:T('Um documento do curso contém instruções que pedem ao tutor divulgar dados privados de outros alunos.','Un documento del curso contiene órdenes al tutor para divulgar datos de otros estudiantes.','A course document contains instructions telling the tutor to reveal other students’ records.'),
 question:T('Como tratar instruções encontradas em documentos de estudo?','¿Cómo tratar instrucciones encontradas dentro de documentos de estudio?','How should instructions embedded in study documents be handled?'),
 choices:[T('Dar acesso irrestrito às ferramentas e dados para facilitar respostas.','Dar acceso ilimitado a herramientas y datos para simplificar respuestas.','Grant unrestricted tool and data access for easier answers.'),
 T('Tratar documentos como dados não confiáveis; autorizar ferramentas fora do modelo e testar injeções.','Tratar documentos como datos no fiables; autorizar herramientas fuera del modelo y probar inyecciones.','Treat documents as untrusted data; enforce tool permissions outside the model and test injections.'),
 T('Pedir ao modelo que nunca erre, sem verificações técnicas.','Pedir al modelo que no se equivoque, sin verificaciones técnicas.','Ask the model never to make mistakes, without technical checks.')],correct:1,
 rationale:T('Conteúdo recuperado não é autoridade e não deve controlar permissões institucionais.','El contenido recuperado no tiene autoridad para controlar permisos institucionales.','Retrieved content is not an authority for access control or tool permissions.'),
 evidence:T('Casos de teste de injeção e bloqueio de leitura de registro alheio.','Casos de prueba de inyección y bloqueo de expedientes ajenos.','Injection regression cases and confirmed blocks on other learners’ records.')},
 {id:'offline-import',category:'Integrity / privacy',likelihood:3,impact:3,
 asset:T('Caderno local de aprendizagem','Cuaderno local de aprendizaje','Offline learning journal'),
 boundary:T('JSON importado → armazenamento local','JSON importado → almacenamiento local','Imported JSON → local storage'),
 observation:T('O aluno importa um JSON de progresso que pode ter sido alterado ou corrompido.','El alumno importa un JSON de progreso que puede estar alterado o corrupto.','The student imports progress JSON that may have been modified or corrupted.'),
 question:T('Como preservar integridade e não inventar certificação acadêmica?','¿Cómo preservar la integridad sin inventar certificaciones académicas?','How do we maintain integrity without inventing academic certification?'),
 choices:[T('Validar esquema, tamanho e IDs; realizar backup e deixar claro que progresso é autodeclarado.','Validar esquema, tamaño e identificadores; permitir respaldo y marcar progreso autodeclarado.','Validate schema, size and IDs; support backup and label progress self-reported.'),
 T('Conceder diplomas oficiais quando houver arquivo com respostas corretas.','Emitir títulos oficiales si el archivo contiene respuestas correctas.','Issue official diplomas whenever the file contains correct answers.'),
 T('Executar scripts do JSON para verificar sua procedência.','Ejecutar scripts incluidos en el JSON para verificar su origen.','Run scripts embedded in the JSON to verify origin.')],correct:0,
 rationale:T('O arquivo pode ser modificado: ele ajuda no estudo, mas não atesta avaliação externa.','El archivo puede modificarse: ayuda al estudio, pero no acredita evaluación externa.','The file can be modified; it supports study but cannot prove external assessment.'),
 evidence:T('Teste de JSON inválido, rollback e mensagem explícita sobre registro não verificado.','Prueba de JSON inválido, reversión y aviso de registro no verificado.','Malformed JSON and rollback tests with explicit unverified-progress notice.')},
 {id:'catalog-outage',category:'Availability / abuse',likelihood:3,impact:4,
 asset:T('Catálogo público de cursos','Catálogo público de cursos','Public course catalog'),
 boundary:T('Cliente anônimo → serviço de catálogo','Cliente anónimo → servicio del catálogo','Anonymous client → catalog endpoint'),
 observation:T('Solicitações automáticas excessivas impedem que outros alunos abram as aulas.','Solicitudes automáticas excesivas impiden que otros estudiantes abran las clases.','Excessive automated requests prevent other learners from loading lessons.'),
 question:T('Qual estratégia protege disponibilidade sem coletar dados desnecessários?','¿Qué estrategia protege la disponibilidad sin recopilar datos innecesarios?','Which strategy protects availability without unnecessary identity collection?'),
 choices:[T('Desativar todos os limites e esperar que o pico termine.','Desactivar todos los límites y esperar a que termine el pico.','Disable all limits and hope demand goes away.'),
 T('Aplicar limites proporcionais, cache, orçamento de recursos e alternativa estática/offline.','Aplicar límites proporcionados, caché, presupuestos de recursos y alternativa estática/offline.','Use proportionate rate limits, caching, resource budgets and a static/offline fallback.'),
 T('Exigir documentos de identidade de todos os leitores do curso.','Exigir documentos de identidad a todos los lectores del curso.','Require government ID from every learner reading courses.')],correct:1,
 rationale:T('Defesa em camadas mantém acesso educativo e reduz risco de indisponibilidade.','La defensa por capas mantiene el acceso educativo y reduce el riesgo de caída.','Layered defenses preserve low-barrier learning and reduce outage risk.'),
 evidence:T('Teste de carga autorizado em laboratório isolado e verificação do fallback offline.','Prueba de carga autorizada en entorno aislado y verificación del modo offline.','Authorized load test in an isolated lab and offline fallback verification.')}
];
export const WORDS={
 pt:{title:'Secure T · Estúdio de Ameaças',subtitle:'Analise ativos, fronteiras de confiança e controles em cinco sistemas fictícios.',case:'Cenário',of:'de',asset:'Ativo protegido',boundary:'Fronteira de confiança',signal:'Risco observado',likelihood:'Probabilidade',impact:'Impacto',priority:'Prioridade',choose:'Escolha o controle mais adequado',check:'Validar controle',next:'Próximo cenário',good:'Defesa adequada.',bad:'Revise o modelo.',evidence:'Evidência de validação',done:'Estudo concluído',score:'Controles adequados',download:'Exportar análise TXT',restart:'Reiniciar',note:'A pontuação de risco é fictícia. Exercício sem conta, sem conexão externa e sem acreditação.'},
 es:{title:'Secure T · Estudio de amenazas',subtitle:'Analiza activos, límites de confianza y controles en cinco sistemas ficticios.',case:'Escenario',of:'de',asset:'Activo protegido',boundary:'Límite de confianza',signal:'Riesgo observado',likelihood:'Probabilidad',impact:'Impacto',priority:'Prioridad',choose:'Elige el control más adecuado',check:'Validar control',next:'Siguiente escenario',good:'Defensa adecuada.',bad:'Revisa el modelo.',evidence:'Evidencia de validación',done:'Estudio completado',score:'Controles adecuados',download:'Exportar análisis TXT',restart:'Reiniciar',note:'La puntuación de riesgo es ficticia. Ejercicio sin cuenta, conexiones externas ni acreditación.'},
 en:{title:'Secure T · Threat Modeling Studio',subtitle:'Explore assets, trust boundaries and controls in five fictional systems.',case:'Scenario',of:'of',asset:'Protected asset',boundary:'Trust boundary',signal:'Observed risk',likelihood:'Likelihood',impact:'Impact',priority:'Priority',choose:'Choose the best safeguard',check:'Assess safeguard',next:'Next scenario',good:'Appropriate safeguard.',bad:'Review the model.',evidence:'Validation evidence',done:'Practice complete',score:'Appropriate safeguards',download:'Export analysis TXT',restart:'Restart',note:'Risk scores are fictional. No account, external connections or academic accreditation.'}
};
export function riskScore(t){if(!Number.isInteger(t?.likelihood)||t.likelihood<1||t.likelihood>5||!Number.isInteger(t?.impact)||t.impact<1||t.impact>5)throw new RangeError('Invalid risk factors');return t.likelihood*t.impact;}
export function riskTier(t){const score=riskScore(t);return score>=16?'high':score>=9?'medium':'low';}
export function isValidThreat(t){return Boolean(t&&typeof t.id==='string'&&typeof t.category==='string'&&Array.isArray(t.choices)&&t.choices.length===3&&Number.isInteger(t.correct)&&t.correct>=0&&t.correct<3&&riskScore(t)>=1&&LANGUAGES.every(lang=>[t.asset,t.boundary].every(s=>typeof s?.[lang]==='string'&&s[lang].length>=15)&&[t.observation,t.question,t.rationale,t.evidence,...t.choices].every(s=>typeof s?.[lang]==='string'&&s[lang].length>=25)));}
export function assessControl(t,answer){if(!isValidThreat(t)||!Number.isInteger(answer)||answer<0||answer>=3)throw new RangeError('Invalid choice');return t.correct===answer;}
export function exportThreatReport(answers,lang='pt'){
 if(!LANGUAGES.includes(lang)||!Array.isArray(answers)||answers.length!==THREATS.length||answers.some(a=>!Number.isInteger(a)||a<0||a>=3))throw new RangeError('Invalid report');
 const w=WORDS[lang];
 const lines=[w.title,w.note,'','SYNTHETIC LEARNING DATA · No personal information',''];
 answers.forEach((a,i)=>{const t=THREATS[i];lines.push(String(i+1)+'. '+t.category+' · '+t.asset[lang],w.boundary+': '+t.boundary[lang],w.signal+': '+t.observation[lang],w.priority+': '+riskScore(t)+'/25 ('+riskTier(t)+')',w.choose+': '+t.choices[a][lang],w.good+': '+String(assessControl(t,a)),t.rationale[lang],w.evidence+': '+t.evidence[lang],'');});
 return lines.join('\n');
}
