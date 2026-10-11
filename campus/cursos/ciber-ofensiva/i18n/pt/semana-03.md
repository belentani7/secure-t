# Semana 3: Os 10 riscos web (OWASP Top 10)

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 3 de 20

## Objetivos de aprendizagem

- Explicar os 10 riscos web do OWASP Top 10 (2021) com exemplos reais
- Reproduzir uma injeção SQL e um XSS em ambiente de laboratório legal
- Mapear vulnerabilidades web em CWE e técnicas ATT&CK
- Propor remediações concretas para cada risco demonstrado

## OWASP Top 10 (2021): os riscos que mais vazamentos causam

O OWASP Top 10 é um consenso da comunidade sobre os 10 riscos web mais críticos. É atualizado a cada 3-4 anos com dados reais de incidentes.

**A01:2021 — Broken Access Control** (CWE-284, CWE-639)
O servidor confia no cliente para controlar o acesso. Exemplo: trocar `?user_id=123` por `?user_id=124` e acessar dados de outra pessoa (IDOR — Insecure Direct Object Reference). ATT&CK: T1078.

**A02:2021 — Cryptographic Failures** (CWE-327, CWE-328)
Dados sensíveis sem criptografia ou com algoritmos quebrados (MD5, SHA1 sem sal). Senhas em texto puro, cookies sem Secure/HttpOnly.

**A03:2021 — Injection** (CWE-89 SQLi, CWE-79 XSS, CWE-77 Command)
Entrada do usuário que é executada como código. A defesa universal: **nunca concatenar entrada em consultas/comandos**; usar prepared statements, parametrização e codificação na saída.

```sql
-- VULNERÁVEL (concatenação):
SELECT * FROM users WHERE name = '' + input + ''
-- SEGURO (prepared statement):
SELECT * FROM users WHERE name = ?   -- o driver escapa automaticamente
```

**A04:2021 — Insecure Design** (CWE-209, CWE-256)
Falhas de arquitetura que não se resolvem com patch: falta de rate limiting, perguntas de segurança previsíveis, ausência de modelo de ameaças.

**Referências:**
- OWASP Top 10 — owasp.org/Top10/
- CWE-89 — SQL Injection
- CWE-79 — Cross-site Scripting
- CWE-284 — Improper Access Control
- T1078 — Valid Accounts

## OWASP Top 10: riscos de A05 a A10

**A05:2021 — Security Misconfiguration** (CWE-16)
Permissões padrão, cabeçalhos ausentes, stack traces em produção, serviços desnecessários ativos. Inclui XML External Entities (XXE).

**A06:2021 — Vulnerable & Outdated Components** (CWE-1104)
Dependências com CVEs conhecidos e sem patch. `npm audit`, `pip-audit` e `trivy` detectam automaticamente. É a maior fonte de vazamentos massivos.

**A07:2021 — Identification & Authentication Failures** (CWE-287)
Credenciais fracas, sessões que não expiram, falta de MFA em contas privilegiadas, força bruta sem rate limit.

**A08:2021 — Software & Data Integrity Failures** (CWE-502)
Desserialização insegura, pipelines de CI/CD sem verificação de assinatura, atualizações sem validação de integridade. ATT&CK: T1195 (Supply Chain).

**A09:2021 — Security Logging & Monitoring Failures** (CWE-778)
Sem registros de eventos de segurança, sem alertas, sem capacidade de detectar um vazamento. Em média, um vazamento leva 287 dias para ser detectado (IBM, 2023).

**A10:2021 — Server-Side Request Forgery (SSRF)** (CWE-918)
O servidor faz requisições a URLs controladas pelo atacante. Vetor crítico em ambientes de nuvem: acesso ao serviço de metadados (169.254.169.254). ATT&CK: T1090.

**Referências:**
- CWE-918 — SSRF
- CWE-502 — Deserialization
- T1195 — Supply Chain Compromise
- IBM Cost of a Data Breach Report 2023

## Laboratório prático: SQLi e XSS no Juice Shop

O OWASP Juice Shop é uma aplicação web deliberadamente vulnerável, mantida pelo OWASP como ferramenta educativa. Roda em local (Docker ou Node.js) — nunca em um servidor público.

**Instalação:**
```bash
# Opção 1: Docker (recomendada)
docker run --rm -p 3000:3000 bkimminich/juice-shop
# Opção 2: Node.js
git clone https://github.com/juice-shop/juice-shop.git
cd juice-shop && npm install && npm start
# Abrir http://localhost:3000
```

**Exercício 1 — SQL Injection (A03, CWE-89):**
1. Vá ao login do Juice Shop
2. No campo de e-mail, insira: `' OR 1=1--`
3. Senha: qualquer coisa
4. Observe: você entra como admin sem saber as credenciais
5. Por que funciona? O backend concatena a entrada na consulta SQL
6. Remediação: prepared statements + validação de entrada

**Exercício 2 — Reflected XSS (A03, CWE-79):**
1. Vá à barra de busca do Juice Shop
2. Busque: `<iframe src="javascript:alert('XSS')">`
3. Observe: o script é executado no seu navegador
4. Por que funciona? A entrada é refletida sem codificação no HTML
5. Remediação: codificação na saída (entidades HTML) + Content-Security-Policy

**Documentação do achado:**
```
ACHADO:    SQL Injection no endpoint de login
SEVERIDADE: CVSS 9.8 (Crítica)
CWE:       CWE-89
ATT&CK:    T1190 (Exploit Public-Facing Application)
REPRO:     E-mail: ' OR 1=1-- / Senha: x → acesso admin
IMPACTO:   Bypass completo da autenticação
REMEDIAÇÃO: Usar ORM com prepared statements
```

**Referências:**
- OWASP Juice Shop — owasp.org/www-project-juice-shop/
- T1190 — Exploit Public-Facing Application
- CWE-89 — SQL Injection
- CWE-79 — Cross-site Scripting

## Caso real: Equifax 2017 — CVE-2017-5638 (Apache Struts), 147 milhões de registros

A Equifax não aplicou o patch da CVE-2017-5638 (RCE no Apache Struts, CVSS 10.0) durante 2 meses após a publicação da correção. Um atacante explorou a vulnerabilidade A06 (Componentes Vulneráveis) para acessar dados de 147 milhões de pessoas: números de previdência, datas de nascimento, endereços. Custo: 700 milhões de dólares em acordos. Lição: `A06 — Vulnerable & Outdated Components` mata. Um `npm audit` / `pip-audit` semanal teria evitado o vazamento.

## Exercício guiado: encontre e documente 3 vulnerabilidades no Juice Shop

1. Instale o Juice Shop com Docker: docker run --rm -p 3000:3000 bkimminich/juice-shop
2. Abra http://localhost:3000 e explore a aplicação como usuário comum
3. Tente o SQLi do login: ' OR 1=1--
4. Procure um XSS refletido na barra de busca
5. Explore o painel /administration (IDOR — A01)
6. Para cada achado, documente: descrição, CWE, CVSS estimado, reprodução e remediação
7. Opcional: consulte o Score Board do Juice Shop (/score-board) para mais desafios

## Recursos abertos

- [OWASP Top 10](https://owasp.org/Top10/)
- [Juice Shop](https://owasp.org/www-project-juice-shop/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)

---
[Voltar ao programa](../syllabus.md)
