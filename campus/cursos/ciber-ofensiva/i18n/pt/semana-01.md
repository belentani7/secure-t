# Semana 1: Ética, legalidade e escopo do teste

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizagem

- Distinguir hacking ético de atividade criminosa com base legal concreta
- Redigir um documento de escopo (rules of engagement) válido
- Situar PTES, OWASP WSTG e MITRE ATT&CK no fluxo de um pentest
- Identificar as fases de um teste de intrusão profissional

## Regra número um: permissão por escrito

Um teste de intrusão sem autorização por escrito é crime, sem exceções. A Convenção de Budapeste (arts. 2-6) tipifica o acesso ilícito a sistemas; o Código Penal espanhol (arts. 197 bis, 264) pune com prisão a intrusão e o dano informático. No Brasil, a Lei 12.737/2012 (Lei Carolina Dieckmann) penaliza a invasão de dispositivos. Na União Europeia, a Diretiva 2013/40 harmoniza os tipos penais.

O documento de escopo — chamado 'Rules of Engagement' (RoE) — define: **quem** autoriza, **quais** sistemas podem ser tocados, **quando** (janelas de horário), **como** se escala um incidente imprevisto e **onde** as evidências são armazenadas. Sem esse documento assinado, qualquer achado é inadmissível e o pentester fica exposto a responsabilidade penal.

Elementos obrigatórios das RoE:
1. Partes: empresa contratante + equipe de pentest + contato de emergência
2. Escopo: IPs, domínios, redes, aplicações incluídas e excluídas
3. Janelas de execução: horário permitido, datas de início e fim
4. Técnicas autorizadas e proibidas (por exemplo, DoS: sim/não)
5. Protocolo de achado crítico: a quem se comunica, em quanto tempo
6. Armazenamento e destruição das evidências ao final
7. Assinaturas das duas partes com data

**Referências:**
- Convenção de Budapeste, arts. 2-6
- Código Penal ES, arts. 197 bis, 264
- Lei 12.737/2012 (BR)
- Diretiva 2013/40/UE

## As fases de um pentest profissional (PTES)

O Penetration Testing Execution Standard (PTES) define 7 fases que todo teste ético deve seguir. Pular fases produz relatórios incompletos e achados não reproduzíveis.

**Fase 1 — Pre-engagement (acordo prévio):** RoE, escopo, restrições, contatos de emergência. É a fase mais importante: sem ela não existe teste.

**Fase 2 — Intelligence Gathering (coleta):** OSINT passivo (semana 2), footprinting, identificação de tecnologias. MITRE ATT&CK: táticas de Reconnaissance (TA0043).

**Fase 3 — Threat Modeling:** O que o alvo protege? O que importa para um atacante real? Os vetores são priorizados por impacto no negócio.

**Fase 4 — Vulnerability Analysis:** Varredura de vulnerabilidades com ferramentas (Nmap, Nikto, Nuclei) + análise manual. Cada achado é validado: um falso positivo no relatório destrói a credibilidade.

**Fase 5 — Exploitation:** Só se explora o que se pode reproduzir e documentar. O objetivo não é 'quebrar tudo', e sim demonstrar o impacto real de cada vulnerabilidade.

**Fase 6 — Post-Exploitation:** O que um atacante pode fazer depois de entrar? Escalada de privilégios, movimento lateral, exfiltração simulada. MITRE ATT&CK: táticas Persistence (TA0003), Privilege Escalation (TA0004).

**Fase 7 — Reporting:** O relatório é o produto. Tem duas partes: resumo executivo (para a direção) e detalhe técnico (para a equipe). Cada achado: descrição, severidade CVSS, reprodução passo a passo, evidência (capturas), remediação proposta.

**Referências:**
- PTES — pentest-standard.org
- MITRE ATT&CK — TA0043 Reconnaissance
- MITRE ATT&CK — TA0003 Persistence
- MITRE ATT&CK — TA0004 Privilege Escalation

## Metodologias complementares: OWASP WSTG e ATT&CK

O PTES dá a estrutura do teste. Mas para saber **o que testar** você precisa de guias específicas por domínio.

**OWASP Web Security Testing Guide (WSTG):** 91 testes organizados em 11 categorias: Information Gathering (WSTG-INFO), Configuration (WSTG-CONF), Identity (WSTG-IDENT), Authentication (WSTG-ATHN), Authorization (WSTG-ATHZ), Session (WSTG-SESS), Input Validation (WSTG-INPV), Error Handling (WSTG-ERRH), Cryptography (WSTG-CRYP), Business Logic (WSTG-BUSL), Client-Side (WSTG-CLNT). Cada teste tem objetivo, procedimento e ferramentas sugeridas.

**MITRE ATT&CK:** Não é uma metodologia de teste, e sim um catálogo do comportamento real do adversário. 14 táticas, ~200 técnicas e ~400 sub-técnicas documentadas com procedimentos de grupos APT reais. O valor em um pentest é falar a língua do defensor: quando você reporta um achado mapeado no ATT&CK (por exemplo, 'T1190 — Exploit Public-Facing Application'), o SOC sabe exatamente o que detectar.

As três ferramentas se complementam:
- PTES → estrutura do projeto
- WSTG → checklist de testes web
- ATT&CK → linguagem de ameaças e mapeamento de cobertura

**Referências:**
- OWASP WSTG v4.2 — owasp.org/www-project-web-security-testing-guide
- MITRE ATT&CK — attack.mitre.org
- T1190 — Exploit Public-Facing Application

## Caso real: o pentester que foi para a prisão (caso Aaron Swartz)

Aaron Swartz baixou milhões de artigos acadêmicos da JSTOR a partir da rede do MIT em 2011. Embora a JSTOR tenha retirado as acusações, a promotoria federal manteve 13 acusações sob a CFAA (Computer Fraud and Abuse Act). Lição operacional: ter acesso legítimo a uma rede (Swartz era fellow do MIT) **não** equivale a ter autorização para um teste ofensivo. O escopo é definido pelo documento assinado, não pelo acesso técnico.

## Exercício guiado: redija o seu documento de escopo (RoE)

1. Escolha um cenário fictício: uma ONG com site, e-mail e VPN
2. Defina as partes (você como pentester, a ONG como cliente)
3. Liste os ativos no escopo: 2 IPs, 1 domínio, 1 aplicação web
4. Estabeleça a janela: sábados, 02:00-06:00 UTC
5. Defina as técnicas autorizadas (varredura, injeção) e as proibidas (DoS)
6. Escreva o protocolo de achado crítico: e-mail + telefone em menos de 1 h
7. Acrescente a cláusula de destruição das evidências em 30 dias
8. Assine com data (simulada)

## Recursos abertos

- [PTES Standard](https://www.pentest-standard.org/index.php/Main_Page)
- [OWASP WSTG](https://owasp.org/www-project-web-security-testing-guide/)
- [MITRE ATT&CK Navigator](https://mitre-attack.github.io/attack-navigator/)
- [Convenção de Budapeste (texto)](https://www.coe.int/en/web/cybercrime/the-budapest-convention)

---
[Voltar ao programa](../syllabus.md)
