# Semana 4: Projeto: expediente de compliance

Curso: [Governança e Conformidade Digital](../syllabus.md) · Semana 4 de 20

## Objetivos de aprendizagem

- Produzir um expediente de compliance com evidência verificável por artefato
- Construir a cadeia afirmação → artefato → verificação
- Preparar uma auditoria interna com checklist e achados documentados
- Apresentar e defender o expediente como avaliação final do curso

## O expediente de compliance: sem evidência não há conformidade

Um expediente de compliance NÃO é um PDF bonito. É uma cadeia de afirmações em que cada uma está respaldada por um artefato verificável.

**Estrutura do expediente:**

```
1. ESCOPO
   - Que sistemas, dados e processos cobre
   - Que marcos se aplicam (ISO, NIST, ENS, RGPD/LGPD)

2. INVENTÁRIO DE ATIVOS
   - Lista completa: servidores, aplicações, dados, pessoas
   - Classificação CIA por ativo
   → Artefato: planilha de inventário assinada e datada

3. MATRIZ DE RISCO
   - Riscos avaliados com tratamento e dono
   → Artefato: registro de riscos (semana 3)

4. POLÍTICAS VIGENTES
   - Política de segurança, uso aceitável, gestão de incidentes
   → Artefato: documentos com versão, data e aprovação

5. CONTROLES IMPLANTADOS
   - Por controle: descrição e evidência de implantação
   → Artefato: configurações, capturas, logs de mudança

6. REGISTRO DE FORMAÇÃO
   - Quem recebeu que formação e quando
   → Artefato: lista de presença, avaliações

7. REGISTRO DE INCIDENTES
   - Histórico com cronologia e lições aprendidas
   → Artefato: relatórios pós-incidente

8. REVISÕES E AUDITORIAS
   - Auditoria interna anual, revisão pela direção
   → Artefato: ata de revisão com decisões
```

**A cadeia de evidência:**

```
AFIRMAÇÃO:    'Temos MFA em todas as contas administrativas'
ARTEFATO:     Configuração do IdP mostrando MFA obrigatório (captura)
VERIFICAÇÃO:  Tentativa de login sem MFA → recusado (captura)
DATA:         2026-09-12
REVISOR:      [nome]
```

Se a cadeia se rompe em qualquer ponto, a afirmação não tem valor.

**Referências:**
- ISO 27001 — Clause 9 (Performance Evaluation)
- ISO 27001 — Clause 10 (Improvement)
- NIST CSF — GV.OV (Oversight)

## Auditoria interna e defesa do expediente

**Auditoria interna — processo:**
1. **Planejamento:** escopo, critérios (qual marco), calendário
2. **Execução:** revisar a documentação + verificar a implantação
3. **Achados:** conformidade / não conformidade maior / menor / observação
4. **Relatório:** achados + evidência + recomendações
5. **Acompanhamento:** plano de ações corretivas com dono e data

**Formato de achado de auditoria:**

```
ID:              NC-001
TIPO:            Não conformidade menor
REQUISITO:       ISO 27001 A.5.15 — Controle de acesso
ACHADO:          2 contas administrativas sem MFA habilitado
EVIDÊNCIA:       Captura do painel do IdP mostrando MFA=off
RISCO:           Acesso não autorizado com credenciais roubadas
AÇÃO:            Habilitar MFA + verificar todas as contas
RESPONSÁVEL:     [nome]
PRAZO:           2026-09-30
ESTADO:          Aberto
```

**Avaliação final — defesa do expediente (30 min):**
1. Apresente o expediente completo (10 min)
2. O avaliador escolhe 3 afirmações ao acaso e pede a evidência
3. Para cada uma: mostre o artefato e a verificação
4. Se falta evidência, a afirmação não conta
5. Avalia-se: completude, coerência e honestidade (declara o que falta?)

**Avaliação 30/30/40:** 30 % participação (laboratórios semanais com evidência); 30 % quizzes (≥70 %); 40 % expediente de compliance defendido.

**Referências:**
- ISO 19011 — Guidelines for Auditing Management Systems
- ISO 27001 — Clause 9.2 (Internal Audit)
- ISACA COBIT — Audit Guidelines

## Caso real: British Airways 2018 — multa de £20 milhões por evidência insuficiente

A British Airways sofreu uma brecha de 500.000 cartões via JavaScript injetado na página de pagamento (Magecart). A ICO (autoridade britânica) impôs £20 milhões (reduzidos de £183 milhões) por falhas em monitoramento de logs (não detectaram a injeção em 2 meses), segmentação de rede, cifra dos dados de pagamento e auditoria de terceiros. Lição: o expediente da BA não conseguiu demonstrar que os controles existiam e funcionavam — cada afirmação sem artefato foi um agravante na sanção.

## Exercício guiado: construa o expediente de compliance do caso prático

1. Defina o escopo: plataforma educacional Secure T University
2. Complete o inventário de ativos com classificação CIA (semana 1)
3. Inclua a matriz de riscos com tratamento e dono (semana 3)
4. Redija 2 políticas: segurança da informação + gestão de incidentes
5. Documente 3 controles com a cadeia afirmação → artefato → verificação
6. Inclua o registro de formação (as 4 semanas do curso)
7. Simule 1 achado de auditoria interna com o formato completo
8. Defenda: para cada afirmação, onde está a evidência?

## Recursos abertos

- [ISO 19011](https://www.iso.org/standard/70017.html)
- [ICO — BA enforcement](https://ico.org.uk/action-weve-taken/enforcement/british-airways/)
- [ISACA COBIT](https://www.isaca.org/resources/cobit)

---
[Voltar ao programa](../syllabus.md)
