# Semana 3: Gestão de risco

Curso: [Governança e Conformidade Digital](../syllabus.md) · Semana 3 de 20

## Objetivos de aprendizagem

- Construir uma matriz de risco com probabilidade, impacto e tratamento
- Atribuir dono e data de revisão a cada risco
- Aplicar os 4 tratamentos: mitigar, transferir, aceitar, eliminar
- Distinguir risco inerente de risco residual

## Gestão de risco: a base de toda decisão de segurança

Não se protege tudo igual. Protege-se conforme o risco. Sem análise de risco, o orçamento de segurança é gasto no que é visível (um firewall caro) em vez do que é necessário (formação anti-phishing).

**Fórmula conceitual:**

```
RISCO = PROBABILIDADE × IMPACTO × VALOR DO ATIVO
```

**Matriz de risco 5×5:**

```
                 IMPACTO
            Muito baixo  Baixo  Médio  Alto  Muito alto
Muito alta      M          A       A     MA      MA
Alta            B          M       A     A       MA
Média           B          B       M     A       A
Baixa           MB         B       B     M       A
Muito baixa     MB         MB      B     B       M

MB=Muito Baixo  B=Baixo  M=Médio  A=Alto  MA=Muito Alto
```

**Os 4 tratamentos:**
1. **Mitigar:** reduzir probabilidade ou impacto (patches, MFA, formação)
2. **Transferir:** passar o risco a outro (seguro cibernético, SLA do provedor de nuvem)
3. **Aceitar:** o custo de mitigar supera o impacto (documentar e assinar)
4. **Eliminar:** remover o ativo ou a atividade que gera o risco

**Risco inerente vs. residual:**
- Inerente: risco ANTES de aplicar controles
- Residual: risco DEPOIS de aplicar controles
- O residual NUNCA é zero — sempre resta risco aceito

**Cada risco tem:** descrição clara e cenário concreto; probabilidade e impacto avaliados; tratamento escolhido com justificativa; **dono** (pessoa com nome, não «a equipe»); **data de revisão** (não «periodicamente»).

**Referências:**
- ISO 27005 — Information Security Risk Management
- NIST SP 800-30 — Guide for Risk Assessments
- NIST CSF — ID.RA (Risk Assessment)

## Registro de riscos: formato e exemplo prático

**Formato do registro de riscos:**

```
ID:           R-001
RISCO:        Vazamento de material didático por API sem autenticação
ATIVO:        API de conteúdo do campus
PROBABILIDADE: Alta (3/5) — API pública, sem rate-limit
IMPACTO:      Médio (3/5) — o material é aberto por projeto,
              mas o scraping massivo consome recursos
NÍVEL:        Alto (3×3=9/25)
TRATAMENTO:   Mitigar — rate-limit + cache em CDN
DONO:         [nome do responsável técnico]
REVISÃO:      2027-01-15
ESTADO:       Em tratamento
```

**8 riscos reais de uma plataforma educacional:**

```
R-001  Scraping massivo do conteúdo          Mitigar (CDN + rate-limit)
R-002  Queda de CDN/hospedagem               Mitigar (multi-CDN) + Aceitar
R-003  Abuso da API do tutor de IA           Mitigar (allowlist + truncamento)
R-004  Token de progresso manipulado          Aceitar (localStorage, sem PII)
R-005  Dependência de provedor de nuvem       Mitigar (exportável, multi-cloud)
R-006  Phishing contra administradores        Mitigar (MFA + formação)
R-007  Injeção no quiz interativo             Mitigar (sanitização + CSP)
R-008  Mudança regulatória (IA, dados)        Transferir (assessoria jurídica)
```

**Erros comuns:**
- Risco sem dono → ninguém age
- «Revisão: periódica» → nunca é revisado (coloque data concreta)
- Confundir ameaça com risco (ameaça: phishing; risco: credenciais administrativas roubadas por phishing que permitem alterar conteúdo)
- Aceitar sem documentar → responsabilidade não assumida

**Referências:**
- ISO 27005:2022
- NIST SP 800-30 Rev.1
- FAIR — Factor Analysis of Information Risk

## Caso real: Log4Shell 2021 (CVE-2021-44228) — o risco que ninguém tinha no registro

O Log4j, uma biblioteca de logging Java onipresente, tinha uma vulnerabilidade de RCE (CVSS 10.0) explorável com uma única linha de texto. Afetou milhões de aplicações. A maioria das organizações não sabia que usava Log4j (dependência transitiva). Lição: o risco «componentes desconhecidos na cadeia de suprimentos» deveria estar em todo registro de riscos. Sem inventário de dependências (SBOM), você não consegue avaliar riscos que não sabe que existem.

## Exercício guiado: construa a matriz de risco da plataforma

1. Liste 8 riscos reais do campus Secure T (use os do material como base)
2. Para cada um: descreva o cenário concreto (o que acontece se se materializar)
3. Avalie probabilidade (1-5) e impacto (1-5) com justificativa
4. Calcule o nível e localize-o na matriz 5×5
5. Escolha o tratamento e justifique por que esse e não outro
6. Atribua dono (nome) e data de revisão (data concreta)
7. Calcule o risco residual após o tratamento
8. Apresente a matriz completa em formato de tabela

## Recursos abertos

- [NIST SP 800-30](https://csrc.nist.gov/publications/detail/sp/800-30/rev-1/final)
- [FAIR Institute](https://www.fairinstitute.org/)
- [SBOM — NTIA](https://www.ntia.gov/sbom)

---
[Voltar ao programa](../syllabus.md)
