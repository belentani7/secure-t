# Semana 4: Laboratório final: máquina vulnerável + relatório

Curso: [Cibersegurança Ofensiva: Pensar como Atacante](../syllabus.md) · Semana 4 de 20

## Objetivos de aprendizagem

- Executar um pentest completo, do reconhecimento ao relatório, em uma máquina vulnerável
- Usar nmap, nikto e ferramentas de exploração em ambiente local autorizado
- Pontuar achados com CVSS 3.1 e mapeá-los no ATT&CK
- Escrever um relatório com resumo executivo e detalhe técnico reproduzível

## O laboratório: máquina vulnerável na rede local

Para a prática final usamos máquinas deliberadamente vulneráveis em rede local isolada. Nunca pela internet, nunca contra terceiros.

**Opções de laboratório (todas gratuitas):**
- **Metasploitable 2:** VM clássica com serviços vulneráveis (FTP, SSH, Samba, Apache, MySQL). Download: sourceforge.net/projects/metasploitable
- **VulnHub:** centenas de VMs para baixar por dificuldade (vulnhub.com)
- **HackTheBox (Starting Point):** máquinas guiadas online com VPN
- **TryHackMe:** laboratórios guiados com teoria integrada

**Configuração segura do laboratório:**
```bash
# Rede host-only no VirtualBox (isolada da internet)
# 1. VirtualBox → File → Host Network Manager → Create
# 2. VM atacante (Kali): Adapter 1 → Host-only
# 3. VM alvo (Metasploitable): Adapter 1 → Host-only
# 4. Verificar: do Kali, ping ao Metasploitable → OK
#    do Metasploitable, ping a 8.8.8.8 → DEVE falhar
```

A rede host-only garante que o tráfego de exploração nunca saia para a internet. É um controle de segurança, não uma conveniência.

**Referências:**
- Metasploitable — sourceforge.net/projects/metasploitable
- VulnHub — vulnhub.com
- HackTheBox — hackthebox.com
- TryHackMe — tryhackme.com

## Do reconhecimento à exploração: o fluxo completo com ferramentas

**Passo 1 — Descoberta de hosts:**
```bash
nmap -sn 192.168.56.0/24    # ping sweep: quais hosts existem na rede
```

**Passo 2 — Varredura de portas e serviços:**
```bash
nmap -sV -sC -p- 192.168.56.101 -oN scan.txt
# -sV: versão dos serviços
# -sC: scripts padrão (NSE)
# -p-: todas as 65535 portas
# -oN: salvar a saída (evidência)
```

**Passo 3 — Identificação de vulnerabilidades:**
```bash
# Web: varredura com nikto
nikto -h http://192.168.56.101 -output nikto.txt
# Procurar CVEs por versão: searchsploit apache 2.2
searchsploit apache 2.2.8
```

**Passo 4 — Exploração controlada:**
Cada exploração deve ser (a) autorizada, (b) documentada passo a passo e (c) com evidência capturada (captura de tela + saída). O objetivo é demonstrar o impacto, não causar dano.

**Passo 5 — Pós-exploração:**
O que um atacante pode fazer depois de entrar?
- Ler `/etc/shadow` → credenciais
- Escalar privilégios (exploits de kernel, binários SUID)
- Pivotar para outros hosts da rede interna
ATT&CK: T1003 (OS Credential Dumping), T1068 (Exploitation for Privilege Escalation), T1021 (Remote Services para movimento lateral)

**Referências:**
- Nmap — nmap.org
- Nikto — github.com/sullo/nikto
- SearchSploit — exploit-db.com/searchsploit
- T1003 — OS Credential Dumping
- T1068 — Exploitation for Privilege Escalation

## O relatório: o produto real do pentester

O relatório ético tem dois públicos: a direção (resumo executivo) e a equipe técnica (detalhe reproduzível). Sem um bom relatório, todo o trabalho técnico não serve para nada.

**Estrutura do relatório:**

**1. Capa:** cliente, equipe, data, classificação (CONFIDENCIAL)

**2. Resumo executivo (1-2 páginas):**
- Escopo e objetivos do teste
- Resumo dos achados por severidade (tabela: Crítica/Alta/Média/Baixa)
- Conclusão: postura de segurança e recomendações prioritárias
- Escrito para quem **não** é técnico

**3. Detalhe técnico (por achado):**
```
ID:          VULN-001
TÍTULO:      SQL Injection no endpoint de login
SEVERIDADE:  Crítica (CVSS 9.8)
Vetor CVSS:  AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
CWE:         CWE-89
ATT&CK:      T1190
DESCRIÇÃO:   O parâmetro 'email' do endpoint POST /rest/user/login
             não sanitiza a entrada, permitindo injeção SQL.
REPRODUÇÃO:
  1. POST /rest/user/login
  2. Body: {"email": "' OR 1=1--", "password": "x"}
  3. Resposta: 200 OK com token de sessão de admin
EVIDÊNCIA:   [captura em anexo]
IMPACTO:     Bypass completo da autenticação; acesso a todos os dados
REMEDIAÇÃO:  Usar ORM com prepared statements; validar o formato do e-mail
```

**4. Apêndices:** configuração do laboratório, ferramentas usadas, registro de tempos, lista de portas e serviços encontrados.

**CVSS 3.1 — como pontuar:**
8 métricas: Attack Vector, Complexity, Privileges Required, User Interaction, Scope, Confidentiality/Integrity/Availability Impact. Use a calculadora oficial da FIRST (first.org/cvss/calculator/3.1).

**Referências:**
- CVSS 3.1 — first.org/cvss/
- PTES Reporting — pentest-standard.org
- OWASP Reporting Guidelines

## Caso real: SolarWinds 2020, a pós-exploração mais sofisticada já documentada

O grupo UNC2452 (atribuído ao SVR russo) comprometeu o pipeline de build do SolarWinds Orion (ATT&CK: T1195.002 — Supply Chain: Software Supply Chain). O backdoor SUNBURST foi distribuído como atualização legítima para 18.000 organizações. Pós-exploração: movimento lateral com tokens SAML forjados (T1606.002) e persistência com tarefas agendadas (T1053.005). Lição para o relatório: é a pós-exploração que define o impacto real — sem ela, um achado parece menor do que é.

## Exercício guiado: pentest completo do Metasploitable 2 com relatório

1. Configure o laboratório: Kali + Metasploitable 2 em rede host-only
2. Execute o ping sweep: nmap -sn 192.168.56.0/24
3. Varra a máquina: nmap -sV -sC -p- [IP] -oN scan.txt
4. Identifique ao menos 5 serviços vulneráveis na saída
5. Escolha 2 vetores e explore-os (documente cada passo com capturas)
6. Tente escalada de privilégios em pelo menos 1 vetor
7. Pontue cada achado com CVSS 3.1 (use a calculadora da FIRST)
8. Escreva o relatório completo: executivo + técnico + apêndices

## Recursos abertos

- [Metasploitable 2](https://sourceforge.net/projects/metasploitable/)
- [CVSS Calculator](https://www.first.org/cvss/calculator/3.1)
- [VulnHub](https://www.vulnhub.com/)
- [Nmap Reference Guide](https://nmap.org/book/man.html)

---
[Voltar ao programa](../syllabus.md)
