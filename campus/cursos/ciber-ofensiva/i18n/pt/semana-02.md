# Semana 2: Reconhecimento passivo e OSINT

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizagem

- Executar reconhecimento passivo sem enviar um único pacote ao alvo
- Usar Google dorks, crt.sh, Wayback Machine e Shodan para reunir inteligência
- Enumerar subdomínios, tecnologias e e-mails expostos de um domínio autorizado
- Documentar achados de OSINT em formato reproduzível

## Reconhecimento passivo: ver sem tocar

O reconhecimento passivo reúne informação sobre o alvo **sem enviar tráfego direto** à infraestrutura dele. Não toca servidores, não dispara alertas de IDS e não deixa registros no alvo. É legal na maioria das jurisdições porque consulta apenas informação pública.

O MITRE ATT&CK classifica o reconhecimento na tática TA0043, com técnicas específicas:
- **T1593 — Search Open Websites/Domains:** Google, Bing, redes sociais
- **T1596 — Search Open Technical Databases:** Shodan, Censys, crt.sh
- **T1592 — Gather Victim Host Information:** sistema operacional, software, versões
- **T1589 — Gather Victim Identity Information:** e-mails, nomes, funções
- **T1590 — Gather Victim Network Information:** faixas de IP, ASN, DNS

**Regra dos 70%:** em um pentest profissional, cerca de 70% da inteligência útil vem do reconhecimento passivo. A varredura ativa (nmap, nikto) complementa, mas não substitui.

**Referências:**
- MITRE ATT&CK — TA0043 Reconnaissance
- T1593 — Search Open Websites/Domains
- T1596 — Search Open Technical Databases
- T1592 — Gather Victim Host Information
- T1589 — Gather Victim Identity Information
- T1590 — Gather Victim Network Information

## Ferramentas de OSINT: o arsenal passivo

Cada ferramenta de OSINT tem uma finalidade. Não se trata de disparar todas: escolhe-se conforme o que se procura.

**DNS e subdomínios:**
```
# Subdomínios via certificados (Certificate Transparency)
curl -s 'https://crt.sh/?q=%.exemplo.com&output=json' | jq '.[].name_value' | sort -u
# DNS passivo com dnsdumpster.com (web) ou subfinder (CLI)
subfinder -d exemplo.com -silent
```

**Google dorks (busca avançada):**
```
site:exemplo.com filetype:pdf        # documentos PDF indexados
site:exemplo.com inurl:admin          # painéis de administração
site:exemplo.com intitle:"index of"   # diretórios abertos
site:exemplo.com ext:sql | ext:env    # backups e configurações expostas
```

**Certificados e tecnologias:**
- **crt.sh:** logs de Certificate Transparency — mostram todos os certificados emitidos para um domínio e revelam subdomínios internos
- **Wappalyzer / BuiltWith:** identificam a stack tecnológica (CMS, framework, servidor, CDN) sem enviar tráfego suspeito
- **Wayback Machine:** versões antigas do site; podem revelar endpoints removidos ou credenciais em código antigo

**Shodan (buscadores de dispositivos):**
```
# Buscar serviços expostos de uma organização
shodan search 'org:"Exemplo S.A."'
# Filtrar por porta e produto
shodan search 'hostname:exemplo.com port:443 product:Apache'
```

**E-mails e credenciais vazadas:**
- **Hunter.io:** e-mails corporativos associados a um domínio
- **Have I Been Pwned (HIBP):** verifica se um e-mail aparece em vazamentos
- **Dehashed:** busca avançada em vazamentos (requer conta)

**Referências:**
- crt.sh — Certificate Transparency
- Shodan — shodan.io
- HIBP — haveibeenpwned.com
- Google Hacking Database — exploit-db.com/google-hacking-database

## Documentação dos achados de OSINT

Cada dado coletado é documentado de forma reproduzível. Um achado de OSINT sem fonte e sem data é inútil no relatório.

**Formato por achado:**
```
ACHADO:  Subdomínio interno exposto
FONTE:   crt.sh, certificado CN=staging.exemplo.com
DATA:    2026-09-12
DADO:    staging.exemplo.com (IP: 203.0.113.42)
RISCO:   Ambiente de staging acessível pela internet pode conter
         código não auditado e dados reais de teste
EVIDÊNCIA: captura-crtsh-staging.png
ATT&CK:  T1596.003 (Search Open Technical Databases: Digital Certs)
```

**Ferramentas de organização:**
- **Maltego CE (Community Edition):** grafo visual das relações entre entidades (domínios → IPs → e-mails → pessoas)
- **Planilha:** para volume alto; colunas: tipo, dado, fonte, data, risco, técnica ATT&CK
- **Obsidian / CherryTree:** notas ligadas entre si para investigações longas

**Erros comuns a evitar:**
1. Coletar sem documentar — o dado que não se registra não existe
2. Misturar passivo com ativo — uma varredura nmap não é OSINT
3. Não validar — um e-mail do Hunter.io pode estar desatualizado
4. Guardar dados pessoais desnecessários — vale a minimização

**Referências:**
- T1596.003 — Digital Certificates
- Maltego CE — maltego.com
- OSINT Framework — osintframework.com

## Caso real: Capital One 2019, o reconhecimento que revelou um vazamento de 100 milhões de registros

Paige Thompson (apelido 'erratic') encontrou uma configuração errada no WAF da Capital One hospedado na AWS. O serviço de metadados do EC2 (169.254.169.254) estava acessível por SSRF, expondo credenciais IAM temporárias. Com elas, extraiu dados de 100 milhões de clientes. Lição de reconhecimento: os metadados de nuvem são um vetor crítico de OSINT. Técnica ATT&CK: T1552.005 (Cloud Instance Metadata API). CWE: CWE-918 (SSRF). A atacante foi condenada porque **não tinha autorização** — um pentester ético com RoE teria reportado o achado.

## Exercício guiado: perfil de OSINT completo de um domínio próprio

1. Escolha um domínio que você controla (ou use 'scanme.nmap.org', autorizado pela Nmap)
2. Subdomínios: consulte o crt.sh e anote todos os CN encontrados
3. Google dorks: procure site:seudominio filetype:pdf, inurl:admin, intitle:index
4. Tecnologias: visite o site com o Wappalyzer e anote CMS, servidor e framework
5. Wayback Machine: procure versões de 1-2 anos atrás e compare com a atual
6. E-mails: procure no Hunter.io (plano gratuito) e verifique 1 e-mail no HIBP
7. Documente cada achado no formato: dado/fonte/data/risco/ATT&CK
8. Monte um grafo simples (papel ou draw.io): domínio → subdomínios → IPs → tecnologias

## Recursos abertos

- [crt.sh](https://crt.sh/)
- [Shodan](https://www.shodan.io/)
- [Google Hacking DB](https://www.exploit-db.com/google-hacking-database)
- [OSINT Framework](https://osintframework.com/)
- [Have I Been Pwned](https://haveibeenpwned.com/)

---
[Voltar ao programa](../syllabus.md)
