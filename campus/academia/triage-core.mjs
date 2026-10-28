/* Secure T · SOC Decision Lab. Fictional events only, no network calls or third-party data. */
export const LANGUAGES=['pt','es','en'];
const L=(pt,es,en)=>({pt,es,en});
export const INCIDENTS=[
{id:'login-anomalo',level:'medium',time:'02:11Z',category:L('Identidade','Identidad','Identity'),
 evidence:'2026-10-22T02:11:03Z idp.login failed user=learner-017 ip=198.51.100.24\n2026-10-22T02:11:12Z idp.login failed user=learner-017 ip=198.51.100.24\n2026-10-22T02:11:19Z idp.login success user=learner-017 ip=198.51.100.24 mfa=verified',
 question:L('Falhas de login seguidas de sucesso. Qual é o primeiro passo defensivo?','Varios fallos de acceso seguidos de un éxito. ¿Cuál es el primer paso defensivo?','Failed logins followed by a success. What should an analyst do first?'),
 choices:[L('Apagar a conta sem consultar o procedimento.','Eliminar la cuenta sin consultar el procedimiento.','Delete the account immediately without a runbook.'),
          L('Correlacionar sessão, MFA e contexto do dispositivo; escalar pelo processo autorizado.','Correlacionar sesión, MFA y contexto del dispositivo; escalar por el procedimiento autorizado.','Correlate session, MFA and device context; escalate via the approved process.'),
          L('Declarar invasão confirmada e publicar dados.','Declarar intrusión confirmada y publicar datos.','Declare a confirmed breach and publish user details.')],
 correct:1,
 rationale:L('Sucesso após falhas é sinal de investigação, não prova de comprometimento. Os logs são fictícios e IP reservado para documentação.','Un éxito tras varios fallos exige investigación, no prueba por sí solo una intrusión. Los registros son ficticios y la IP es de documentación.','A success after failures calls for investigation, not an automatic breach finding. Logs are synthetic and the IP is reserved for documentation.'),
 next:L('Verificar proprietário, geolocalização confiável, agente do dispositivo e política de sessão.','Verificar propietario, contexto del dispositivo y políticas de sesión.','Check account owner, trusted device context and session policy.')},
{id:'viaje-imposible',level:'low',time:'07:43Z',category:L('Acesso remoto','Acceso remoto','Remote access'),
 evidence:'07:40Z sso session=Q204 region=ES device=managed-4\n07:43Z sso session=Q205 region=NL device=managed-4\n07:43Z vpn egress=NL gateway=corp-vpn-simulated',
 question:L('Alerta de viagem impossível, mas há VPN corporativa. O que decidir?','Alerta de viaje imposible, pero consta una VPN corporativa. ¿Qué haces?','An impossible-travel alert also shows a corporate VPN. What next?'),
 choices:[L('Validar gateway, proprietário e histórico antes de classificar o evento.','Validar gateway, propietario e historial antes de clasificar el evento.','Verify gateway, account owner and history before classifying.'),
          L('Bloquear toda a rede em todas as regiões.','Bloquear toda la red en todas las regiones.','Block the entire network in all regions.'),
          L('Ignorar o sinal para sempre porque há VPN.','Ignorar siempre la alerta porque hay VPN.','Always ignore this type of alert when a VPN appears.')],
 correct:0,
 rationale:L('Uma VPN pode explicar a diferença de região; a conta ainda precisa ser verificada.','Una VPN puede explicar el cambio de región, pero sigue siendo necesario verificar la sesión.','A VPN can explain region mismatch, but the session still requires validation.'),
 next:L('Documentar o contexto e ajustar regras somente após confirmação.','Documentar el contexto y ajustar las reglas solo tras verificar.','Document context and tune rules only after verification.')},
{id:'phishing-caixa',level:'medium',time:'09:03Z',category:L('Correio','Correo','Email'),
 evidence:'09:03Z mail.report msg=SIM-4004 display="Support Desk" link="hxxps://portal.invalid/auth"\n09:04Z user.report action="did not click" attachment="none"',
 question:L('Um colaborador reporta mensagem suspeita. Qual resposta preserva provas?','Una persona comunica un correo sospechoso. ¿Qué respuesta preserva las pruebas?','An employee reports a suspicious email. Which response preserves evidence?'),
 choices:[L('Clicar no endereço externo para verificar por curiosidade.','Abrir el enlace externo por curiosidad.','Click the external link to see what happens.'),
          L('Apagar todos os emails sem manter indicadores.','Borrar todos los correos sin conservar indicadores.','Delete all messages without preserving indicators.'),
          L('Capturar indicadores autorizados, conter pela ferramenta de e-mail e alertar o time.','Conservar indicadores autorizados, contener con la herramienta de correo y avisar al equipo.','Preserve authorized indicators, contain using mail tools and notify the team.')],
 correct:2,
 rationale:L('Contenção proporcional, cadeia de evidências e aviso seguro evitam espalhar a ameaça. O endereço .invalid é fictício.','La contención proporcionada y preservar evidencia evitan difundir la amenaza. El dominio .invalid es ficticio.','Proportionate containment and evidence preservation prevent spread. The .invalid domain is fictional.'),
 next:L('Procurar mensagens semelhantes de forma autorizada, sem abrir links.','Buscar mensajes semejantes mediante herramientas autorizadas, sin abrir enlaces.','Search for related messages via authorized tools without opening links.')},
{id:'credencial-exposta',level:'high',time:'10:26Z',category:L('Credenciais','Credenciales','Credentials'),
 evidence:'10:26Z scanner alert="potential secret pattern" repository=training-fixture path=fixtures/sample.txt\n10:27Z commit label="SIMULATED-CREDENTIAL-NOT-A-SECRET"',
 question:L('Uma varredura marca uma credencial potencialmente exposta. Qual plano?','Un escáner señala una posible credencial expuesta. ¿Qué plan sigues?','A scanner flags a possible leaked credential. What is the safe plan?'),
 choices:[L('Validar sem expor o valor e, se real, revogar/rotacionar no provedor; revisar logs.','Validar sin mostrar el valor y, si es real, revocar/rotar en el proveedor; revisar registros.','Validate without revealing its value; if real, revoke/rotate at the provider and review logs.'),
          L('Editar o histórico e anunciar que a chave antiga está segura.','Editar el historial y afirmar que la clave antigua ya está segura.','Edit history and claim the old key is now safe.'),
          L('Copiar o segredo no relatório para prova.','Copiar el secreto en el informe como prueba.','Paste the secret into the incident report as evidence.')],
 correct:0,
 rationale:L('Remover um valor do código não invalida uma credencial existente. A revogação real ocorre no provedor; aqui o sinal é sintético.','Quitar un valor del código no revoca una credencial existente. La revocación real se realiza en el proveedor; esta alerta es sintética.','Deleting code does not revoke a live credential. Revocation happens with the provider; this alert is synthetic.'),
 next:L('Registrar somente identificadores não sensíveis, responsáveis e confirmação de rotação.','Registrar solo identificadores no sensibles, responsables y confirmación de rotación.','Record non-sensitive identifiers, owners and rotation confirmation.')},
{id:'transferencia-grande',level:'medium',time:'12:14Z',category:L('Dados','Datos','Data'),
 evidence:'12:14Z proxy transfer 9.1GB dst=backup-approved-sim user=svc-backup\n12:16Z scheduler job=nightly-test status=executed owner=infra-training',
 question:L('Há grande transferência de dados e tarefa de backup registrada. O que fazer?','Hay una transferencia grande y una tarea de copia de seguridad registrada. ¿Qué haces?','Large data transfer coincides with a backup job. What is the right decision?'),
 choices:[L('Publicar acusação sem investigação.','Publicar una acusación sin investigar.','Publish an accusation without investigating.'),
          L('Confirmar origem, janela aprovada, destino e integridade antes de encerrar ou escalar.','Comprobar origen, ventana autorizada, destino e integridad antes de cerrar o escalar.','Verify source, approved window, destination and integrity before closing or escalating.'),
          L('Desligar os backups da empresa permanentemente.','Desactivar permanentemente todas las copias de seguridad.','Permanently disable company backups.')],
 correct:1,
 rationale:L('Volume isolado não é prova de exfiltração; nem tarefa programada justifica dispensar a verificação.','El volumen aislado no prueba exfiltración; tampoco basta con confiar ciegamente en un backup programado.','Volume alone does not prove exfiltration; a scheduled backup still needs validation.'),
 next:L('Conservar logs aprovados e registrar a justificativa da classificação.','Conservar registros autorizados y justificar la clasificación.','Preserve permitted logs and document classification reasoning.')},
{id:'finalizar-incidente',level:'low',time:'15:59Z',category:L('Governança','Gobernanza','Governance'),
 evidence:'15:59Z case=SIM-INC-42 status=triage-complete\nowner=training-soc impact=unconfirmed remediation=not-applicable',
 question:L('A triagem terminou. Qual documento permite revisão e aprendizado?','Terminó el análisis inicial. ¿Qué documento permite revisar y aprender?','Triage is complete. What record best supports review and learning?'),
 choices:[L('Um certificado oficial gerado automaticamente.','Un certificado oficial generado automáticamente.','An automatically generated official certificate.'),
          L('Uma nota dizendo apenas "resolvido".','Una nota que solo diga «resuelto».','A note saying only “resolved.”'),
          L('Linha do tempo, evidências sintéticas, decisões, incertezas, responsável e próximas ações.','Cronología, evidencias sintéticas, decisiones, incertidumbres, responsable y siguientes pasos.','Timeline, synthetic evidence, decisions, uncertainties, owner and next steps.')],
 correct:2,
 rationale:L('Registros reproduzíveis permitem revisão por pares; a prática não confirma resposta operacional nem certifica competência.','Un expediente reproducible permite revisión; la práctica no acredita intervención real ni competencias profesionales.','A reproducible case record supports review; practice is not operational incident response or a professional credential.'),
 next:L('Compartilhar o resumo somente dentro do exercício e revisar com mentor ou colega.','Compartir el resumen solo en el contexto del ejercicio y revisarlo con tutor o colega.','Use the report only as a learning artifact and review with a tutor or peer.')}
];
export const LABELS={
pt:{title:'SOC · Laboratório de Decisões',subtitle:'Seis casos fictícios. Analise sinais, escolha uma ação e registre seu raciocínio — sem acessar redes reais.',start:'Caso',of:'de',prompt:'Qual é sua decisão?',submit:'Validar decisão',next:'Próximo caso',again:'Reiniciar',download:'Baixar relatório de estudo',evidence:'REGISTROS SINTÉTICOS',right:'Boa triagem.',wrong:'Reveja o procedimento.',nextstep:'Próximo passo',complete:'Exercício concluído',score:'Decisões adequadas',note:'Somente prática formativa. Sem conta, telemetria, nota oficial ou acreditação.'},
es:{title:'SOC · Laboratorio de decisiones',subtitle:'Seis casos ficticios. Analiza señales, elige una acción y justifica tu decisión, sin acceder a redes reales.',start:'Caso',of:'de',prompt:'¿Cuál es tu decisión?',submit:'Validar decisión',next:'Siguiente caso',again:'Reiniciar',download:'Descargar informe de práctica',evidence:'REGISTROS SINTÉTICOS',right:'Buena clasificación.',wrong:'Revisa el procedimiento.',nextstep:'Siguiente paso',complete:'Ejercicio completado',score:'Decisiones adecuadas',note:'Práctica formativa, sin cuenta, telemetría, nota oficial ni acreditación.'},
en:{title:'SOC · Decision Lab',subtitle:'Six fictional cases. Investigate signals, choose an action and record your reasoning without touching live networks.',start:'Case',of:'of',prompt:'What is your decision?',submit:'Review decision',next:'Next case',again:'Restart',download:'Download learning report',evidence:'SYNTHETIC LOGS',right:'Good triage.',wrong:'Review the runbook.',nextstep:'Next step',complete:'Practice complete',score:'Appropriate decisions',note:'Formative practice only. No account, telemetry, formal grade or accreditation.'}
};
export function validateIncident(s){return Boolean(s&&typeof s.id==='string'&&Array.isArray(s.choices)&&s.choices.length===3&&Number.isInteger(s.correct)&&s.correct>=0&&s.correct<3&&typeof s.evidence==='string'&&s.evidence.length>30&&LANGUAGES.every(l=>typeof s.category[l]==='string'&&s.category[l].trim().length>0&&[s.question,s.rationale,s.next,...s.choices].every(o=>typeof o?.[l]==='string'&&o[l].length>15)));}
export function assess(s,option){if(!validateIncident(s)||!Number.isInteger(option)||option<0||option>=3)throw new RangeError('Invalid decision');return option===s.correct;}
export function learningReport(answers,lang='pt'){
 if(!LANGUAGES.includes(lang)||!Array.isArray(answers)||answers.length>INCIDENTS.length||answers.some((x,i)=>!Number.isInteger(x)||x<0||x>=3))throw new RangeError('Invalid learning report');
 const text=[LABELS[lang].title,LABELS[lang].note,'','Training fixture — no live incident, no personal data',''];
 answers.forEach((answer,i)=>{const s=INCIDENTS[i];text.push((i+1)+'. '+s.category[lang]+' ['+s.id+']',s.question[lang],'Choice: '+s.choices[answer][lang],'Outcome: '+(assess(s,answer)?'correct':'review'),s.rationale[lang],s.next[lang],'');});
 return text.join('\n');
}
