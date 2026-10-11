# Semana 1: Fundamentos: a tríade CIA e os controles

Curso: [Cibersegurança Defensiva: Operar como SOC](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizagem

- Explicar a tríade CIA e aplicá-la à classificação de ativos
- Distinguir controles preventivos, detectivos e corretivos
- Classificar ativos por impacto em confidencialidade, integridade e disponibilidade
- Mapear controles às funções do NIST CSF

## A tríade CIA: o fundamento de toda decisão de segurança

Toda medida de segurança protege ao menos uma de três propriedades:

**Confidencialidade (C):** só acessa quem deve. Controles: cifragem (AES-256 em repouso, TLS 1.3 em trânsito), controle de acesso (RBAC, ABAC), classificação de dados (público/interno/confidencial/restrito).

**Integridade (I):** o dado não é alterado sem autorização. Controles: hashing (SHA-256), assinaturas digitais, logs imutáveis, checksums em transferências, controle de versão.

**Disponibilidade (D):** o serviço responde quando é necessário. Controles: redundância (RAID, clustering), backups 3-2-1, CDN, balanceadores, plano de continuidade de negócio (BCP).

**Classificação de ativos por impacto CIA:**

```
ATIVO                C    I    D    CONTROLE PRINCIPAL
─────────────────────────────────────────────────────
Base de RH          ALTO ALTO MÉDIO Cifra + RBAC + backup
Web pública         BAIXO ALTO ALTO WAF + CDN + monitoramento
E-mail corporativo  ALTO MÉDIO ALTO MFA + antispam + backup
Código-fonte        ALTO ALTO MÉDIO Git + code review + assinatura
```

A classificação orienta o orçamento: um ativo com impacto ALTO nas três dimensões recebe mais controles do que um BAIXO/BAIXO/BAIXO. Não se protege tudo igual — protege-se conforme o risco.

**Referências:**
- NIST SP 800-53 — Security and Privacy Controls
- ISO 27001:2022 — Annex A Controls
- NIST CSF — Identify (ID.AM: Asset Management)

## Taxonomia de controles: preventivo, detectivo, corretivo

Os controles se classificam por **quando** atuam em relação ao incidente:

**Preventivos** — impedem que aconteça:
- Firewall (bloqueia tráfego não autorizado)
- MFA (impede o acesso com uma credencial roubada sozinha)
- Patches de segurança (eliminam a vulnerabilidade)
- Formação das pessoas (reduz phishing bem-sucedido)
- Cifra (inutiliza dados roubados)

**Detectivos** — alertam que algo está acontecendo:
- SIEM (correlaciona eventos e alerta)
- IDS/IPS (detecta padrões de ataque na rede)
- Antivírus/EDR (detecta malware no endpoint)
- Auditoria de logs (revisa atividade suspeita)
- Honeypots (iscas que alertam ao serem tocadas)

**Corretivos** — mitigam o dano depois:
- Backup + restauração (recupera dados perdidos)
- Playbook de incidentes (guia a resposta)
- Isolamento de rede (contém a propagação)
- Revogação de credenciais (corta o acesso do atacante)

**Princípio da defesa em profundidade:** nenhum controle sozinho basta. Combinam-se camadas: preventivo (firewall) + detectivo (IDS) + corretivo (backup). Se um falha, o seguinte atua.

**Mapeamento para o NIST CSF:**
- Preventivos → função PROTECT (PR)
- Detectivos → função DETECT (DE)
- Corretivos → funções RESPOND (RS) + RECOVER (RC)

**Referências:**
- NIST CSF 2.0 — Protect, Detect, Respond, Recover
- CIS Controls v8
- ISO 27001:2022 — Control types

## Caso real: Target 2013 — falhou a detecção, não a prevenção

A Target tinha o FireEye (detectivo) instalado e configurado. O sistema alertou sobre o malware de POS que exfiltrava cartões de crédito. Mas a equipe do SOC ignorou os alertas durante semanas. 40 milhões de cartões roubados. Custo: US$ 292 milhões. Lição: um controle detectivo sem processo de resposta é como um alarme sem ninguém para escutá-lo. Os controles técnicos só funcionam com pessoas e processos por trás.

## Exercício guiado: classifique 10 ativos de uma ONG fictícia

1. Imagine uma ONG com: site, CRM de doadores, e-mail, contabilidade, Wi-Fi do escritório
2. Acrescente 5 ativos próprios do contexto (base de beneficiários etc.)
3. Para cada ativo, pontue o impacto C/I/D como ALTO/MÉDIO/BAIXO
4. Proponha 1 controle preventivo + 1 detectivo + 1 corretivo por ativo
5. Estime o custo relativo de cada controle (€/€€/€€€)
6. Priorize: quais 3 controles você implantaria primeiro com orçamento limitado?
7. Defenda a sua decisão em 5 minutos (simulação oral)

## Recursos abertos

- [NIST CSF 2.0](https://www.nist.gov/cyberframework)
- [CIS Controls v8](https://www.cisecurity.org/controls)
- [NIST SP 800-53](https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final)

---
[Voltar ao programa](../syllabus.md)
