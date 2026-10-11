# Semana 2: Telemetria: logs e detecção

Curso: [Cibersegurança Defensiva: Operar como SOC](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizagem

- Configurar coleta de logs de múltiplas fontes em um SIEM
- Escrever regras de detecção básicas (Sigma/Wazuh)
- Correlacionar eventos para identificar atividade suspeita
- Manter integridade temporal com NTP e retenção legal dos logs

## O log é a testemunha: fontes e formatos

Sem logs não há detecção, não há investigação, não há evidência. Um SOC sem telemetria é um posto vazio.

**Fontes de log críticas:**
- **Sistema operacional:** autenticações (Event ID 4624/4625 no Windows, `auth.log` no Linux), mudanças de privilégio, instalação de software
- **Aplicações:** acessos, erros, transações (`access.log`, `error.log`)
- **Rede:** fluxos NetFlow, consultas DNS, conexões do firewall
- **Identidade:** logins MFA, trocas de senha, criação de contas
- **Nuvem:** CloudTrail (AWS), Activity Log (Azure), Audit Log (GCP)

**Formato estruturado (JSON structured logging):**

```json
{"timestamp": "2026-09-12T10:23:45Z",
 "source": "auth",
 "event": "login_failed",
 "user": "admin",
 "src_ip": "203.0.113.42",
 "attempts": 5,
 "geo": "RU"}
```

O formato estruturado permite busca, filtragem e correlação automática. Logs em texto livre são muito mais difíceis de processar.

**Sincronização temporal (NTP):** se dois servidores têm relógios dessincronizados em 5 minutos, a correlação de eventos se rompe. Configure NTP em TODOS os sistemas:

```bash
# Linux: verificar sincronização
timedatectl status
# Configurar NTP
sudo systemctl enable --now systemd-timesyncd
```

**Retenção:** a LGPD (e o RGPD) exigem finalidade e prazo definidos. O NIST recomenda no mínimo 90 dias online + 1 ano arquivado. PCI-DSS: 1 ano, 3 meses online.

**Referências:**
- NIST SP 800-92 — Guide to Computer Security Log Management
- Windows Event IDs — 4624 (logon), 4625 (failed logon)
- MITRE ATT&CK — T1070 (Indicator Removal: Clear Logs)

## SIEM e regras de detecção (Wazuh / Sigma)

Um SIEM (Security Information and Event Management) centraliza logs, correlaciona eventos e gera alertas. O Wazuh é um SIEM open source completo e gratuito.

**Instalação mínima do Wazuh:**

```bash
# Wazuh all-in-one (laboratório, não produção)
curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh
sudo bash wazuh-install.sh -a
# Dashboard: https://localhost:443 (admin/admin)
# Instalar agente na máquina monitorada:
sudo apt install wazuh-agent
```

**Regras Sigma (formato universal de detecção):** o Sigma é um formato aberto para escrever regras de detecção independentes do SIEM. Compila para Wazuh, Splunk, Elastic etc.

```yaml
title: Brute Force Login Attempt
status: stable
logsource:
  category: authentication
  product: windows
detection:
  selection:
    EventID: 4625
  condition: selection | count(src_ip) > 10
  timeframe: 5m
level: high
tags:
  - attack.credential_access
  - attack.t1110  # Brute Force
```

**Correlação de eventos — detecção por contexto:** um login falho é ruído; 50 logins falhos do mesmo IP em 5 minutos seguidos de um login bem-sucedido é um brute force que funcionou. O SIEM correlaciona: evento A + evento B + condição temporal = alerta.

**ATT&CK e detecção:**
- T1110 (Brute Force) → regra: >N falhas + sucesso desde o mesmo IP
- T1078 (Valid Accounts) → regra: login desde geolocalização incomum
- T1070.001 (Clear Windows Event Logs) → regra: Event ID 1102
- T1059 (Command and Scripting) → regra: comando PowerShell codificado

**Referências:**
- Wazuh — wazuh.com
- Sigma Rules — github.com/SigmaHQ/sigma
- T1110 — Brute Force
- T1070.001 — Clear Windows Event Logs

## Caso real: NotPetya 2017 — sem logs, sem cronologia, sem recuperação

O NotPetya (atribuído ao GRU russo, dirigido contra a Ucrânia) se propagou pelo M.E.Doc (software fiscal ucraniano) usando EternalBlue (MS17-010). A Maersk perdeu 49.000 endpoints em 7 minutos. A sua recuperação dependeu de um único controlador de domínio em Gana que estava desligado durante o ataque. Lição de telemetria: sem logs centralizados fora da rede afetada, a reconstrução do incidente é impossível. Custo total estimado: US$ 10 bilhões no mundo.

## Exercício guiado: mini-SOC com Wazuh — detecte 3 eventos de segurança

1. Instale o Wazuh all-in-one em uma VM (Ubuntu 22.04, 4 GB de RAM no mínimo)
2. Conecte 1-2 agentes (outra VM Linux + a sua máquina Windows, se tiver)
3. Gere o evento 1: 10 logins falhos por SSH (usuário incorreto)
4. Gere o evento 2: escalada de privilégio com `sudo su`
5. Gere o evento 3: download do arquivo de teste EICAR (antimalware test file)
6. Verifique os 3 alertas no dashboard do Wazuh
7. Exporte os alertas como evidência (JSON ou captura de tela)
8. Escreva 1 regra Sigma personalizada para o seu ambiente

## Recursos abertos

- [Wazuh Documentation](https://documentation.wazuh.com/)
- [Sigma Rules Repo](https://github.com/SigmaHQ/sigma)
- [NIST SP 800-92](https://csrc.nist.gov/publications/detail/sp/800-92/final)
- [EICAR Test File](https://www.eicar.org/download-anti-malware-testfile/)

---
[Voltar ao programa](../syllabus.md)
