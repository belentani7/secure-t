# Semana 1: Marcos de segurança: ISO 27001, NIST CSF e o ENS

Curso: [Governança e Conformidade Digital](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizagem

- Situar a ISO 27001, o NIST CSF e o ENS no seu papel real (linguagem comum, não checklist)
- Mapear um mesmo controle nos três marcos simultaneamente
- Distinguir certificação de conformidade da implantação real
- Explicar as 5 funções do NIST CSF 2.0 com exemplos

## ISO 27001, NIST CSF e ENS: para que serve cada marco

Um marco de segurança NÃO é uma checklist que se preenche e se arquiva. É uma **linguagem comum** para que técnicos, direção, auditores e reguladores falem da mesma coisa.

**ISO 27001:2022 — Sistema de Gestão de Segurança da Informação (SGSI):**
- Certificável por auditor externo acreditado
- Estrutura: contexto → liderança → planejamento → apoio → operação → avaliação → melhoria
- Anexo A: 93 controles organizados em 4 temas (Organizacionais, Pessoas, Físicos, Tecnológicos)
- Certificar-se ≠ estar seguro. A certificação diz que você TEM um sistema de gestão; não diz que os seus controles são perfeitos.

**NIST Cybersecurity Framework 2.0 (CSF):**
- Não certificável (é um guia, não uma norma)
- 6 funções: **GOVERN** (novo na versão 2.0), **IDENTIFY**, **PROTECT**, **DETECT**, **RESPOND**, **RECOVER**
- Perfis: estado atual vs. estado desejado
- Tiers: 1 (Partial) → 4 (Adaptive)
- Livre, gratuito, amplamente adotado inclusive fora dos EUA

**ENS (Esquema Nacional de Seguridad, Espanha):** obrigatório para a administração pública espanhola e os seus fornecedores; 3 categorias (BÁSICA/MEDIA/ALTA) e princípios como função de segurança diferenciada, prevenção, detecção, resposta e conservação; mapeável para a ISO 27001 pelas guias CCN-STIC.

**Os três marcos se complementam:**

| Necessidade | Marco |
|---|---|
| Certificação perante clientes | ISO 27001 |
| Guia prática de melhoria | NIST CSF |
| Obrigação legal (Espanha) | ENS |

**Referências:**
- ISO 27001:2022 — iso.org
- NIST CSF 2.0 — nist.gov/cyberframework
- ENS — ens.ccn.cni.es
- CCN-STIC 825 — Mapeamento ENS-ISO 27001

## NIST CSF 2.0: as 6 funções em detalhe

**GV — GOVERN (novo no CSF 2.0):** a segurança como decisão de governança, não apenas técnica. Inclui estratégia de cibersegurança, papéis e responsabilidades, gestão do risco da cadeia de suprimentos e políticas.

**ID — IDENTIFY:** o que temos? Quanto vale? Que riscos? Inventário de ativos, ambiente de negócio, avaliação de riscos, estratégia de gestão.
Exemplo: «Temos 3 servidores web, 1 banco de dados com dados de alunos, 2 APIs públicas. O maior risco é vazamento de dados pela API.»

**PR — PROTECT:** controles preventivos. IAM, formação, segurança de dados, processos e procedimentos, manutenção, tecnologia de proteção.
Exemplo: «MFA em todas as contas administrativas, cifra AES-256 no banco de dados, patches mensais.»

**DE — DETECT:** monitoramento contínuo. Anomalias e eventos, monitoramento de segurança, processos de detecção.
Exemplo: «SIEM Wazuh com regras Sigma, alertas no Slack, revisão semanal dos painéis.»

**RS — RESPOND:** quando algo acontece. Planejamento de resposta, comunicações, análise, mitigação, melhorias.
Exemplo: «Playbook de ransomware ensaiado, contato jurídico, canal de comunicação de crise.»

**RC — RECOVER:** voltar à normalidade. Planejamento de recuperação, melhorias, comunicações pós-incidente.
Exemplo: «Backup 3-2-1-1-0, RTO 4 h, RPO 1 h, simulação trimestral.»

**Referências:**
- NIST CSF 2.0 — csf.tools (interativo)
- NIST CSF Quick Start Guide
- GV.OC — Organizational Context

## Caso real: Marriott 2018 — certificação ISO não evitou a brecha

A Marriott adquiriu a Starwood em 2016. A Starwood tinha ISO 27001 certificada, mas a brecha de 500 milhões de registros (desde 2014) só foi descoberta em 2018. A certificação cobria o SGSI da Starwood, mas não detectou que um atacante estava dentro havia 4 anos. Lição: a certificação verifica que o sistema de gestão existe e funciona como processo; não garante que cada controle seja eficaz nem que não haja brechas ativas. O marco é necessário, mas não suficiente.

## Exercício guiado: mapeie um controle nos três marcos

1. Escolha o controle: «Gestão de acessos e identidades»
2. Procure-o na ISO 27001:2022 Anexo A → A.5.15 (Access control)
3. Procure-o no NIST CSF → PR.AC (Identity Management and Access Control)
4. Procure-o no ENS → op.acc (Controle de acesso)
5. Documente as diferenças: o que cada marco pede exatamente?
6. Repita com «Gestão de incidentes» (ISO A.5.24, RS.*, op.mon no ENS)
7. Conclusão: um controle implantado atende aos três marcos?

## Recursos abertos

- [NIST CSF 2.0](https://www.nist.gov/cyberframework)
- [ISO 27001 overview](https://www.iso.org/standard/27001)
- [ENS — CCN](https://ens.ccn.cni.es/)
- [CSF Tools (interactive)](https://csf.tools/)

---
[Voltar ao programa](../syllabus.md)
