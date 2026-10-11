# Semana 2: Proteção de dados: RGPD e LGPD

Curso: [Governança e Conformidade Digital](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizagem

- Aplicar os princípios do RGPD: base legal, finalidade, minimização
- Desenhar um sistema sem PII (usuário como token anônimo)
- Avaliar quando é necessária uma DPIA (avaliação de impacto)
- Conhecer os direitos dos titulares e o papel do DPO

## RGPD e LGPD: os princípios e a sua aplicação prática

O Regulamento Geral de Proteção de Dados (UE 2016/679) e a LGPD brasileira (Lei 13.709/2018) não são apenas obrigações legais — são marcos de projeto. Se o seu sistema não precisa de um dado, não o colete.

**Princípios do RGPD (art. 5) e da LGPD (art. 6):**
1. **Licitude, lealdade e transparência:** base legal clara (consentimento, contrato, interesse legítimo...) e informar o titular
2. **Limitação de finalidade:** só para o que foi declarado na coleta
3. **Minimização:** apenas os dados necessários. O máximo de minimização é NÃO ter o dado
4. **Exatidão:** dados atualizados e corrigíveis
5. **Limitação de conservação:** prazo definido, apagar ao cumprir
6. **Integridade e confidencialidade:** segurança adequada ao risco
7. **Responsabilização proativa:** demonstrar conformidade (não apenas cumprir)

**Bases legais (art. 6 do RGPD; art. 7 da LGPD):** consentimento (livre, informado, específico, revogável); execução de contrato; obrigação legal; interesses vitais; interesse público; interesse legítimo (exige teste de ponderação).

**O padrão do ecossistema Secure T — usuário como token anônimo:**

```
DADO TÍPICO            SECURE T            POR QUÊ
──────────────────────────────────────────────────────
E-mail                 NÃO                 Desnecessário
Nome                   NÃO                 Desnecessário
Senha                  NÃO                 Sem conta
Progresso              UUID local (LS)     Funciona sem servidor
Credencial             Hash SHA-256        Verificável sem PII
Cookies de rastreamento NÃO                Sem analytics invasivo
```

Se o serviço funciona sem o dado, o dado não deve existir.

**Referências:**
- RGPD — Regulamento UE 2016/679
- LGPD Brasil — Lei 13.709/2018
- AEPD — aepd.es · ANPD — gov.br/anpd

## DPIA, direitos do titular e DPO

**DPIA / RIPD (Avaliação de Impacto) — art. 35 do RGPD; art. 38 da LGPD:** obrigatória quando o tratamento implica «alto risco»: perfilamento automatizado, dados sensíveis em larga escala, monitoramento sistemático de zonas públicas.

```
PROCESSO DA AVALIAÇÃO DE IMPACTO:
1. Descrição do tratamento (que dados, para quê, como)
2. Avaliação de necessidade e proporcionalidade
3. Avaliação de riscos para os direitos das pessoas
4. Medidas para mitigar esses riscos
5. Documentação + consulta ao DPO
→ Se o risco residual for alto: consulta prévia à autoridade (AEPD / ANPD)
```

**Direitos do titular (arts. 15-22 do RGPD; art. 18 da LGPD):** acesso (saber que dados você tem sobre mim); retificação (corrigir dados inexatos); eliminação/supressão (apagar os meus dados); oposição (deixar de tratar os meus dados); portabilidade (entregar os dados em formato interoperável); não sujeição a decisões automatizadas; limitação do tratamento. Prazo de resposta: 1 mês (prorrogável por mais 2 em casos complexos).

**DPO (Encarregado de Proteção de Dados):** obrigatório para a administração pública, tratamento em larga escala de dados sensíveis e monitoramento sistemático. Funções: informar, supervisionar, cooperar com a autoridade e assessorar nas avaliações de impacto. É independente (não recebe instruções sobre a sua função) e não pode ser sancionado por exercê-la.

**No Secure T:** como não há PII, não há DPIA obrigatória, não há direitos a exercer (não existem dados pessoais) e não é necessário DPO. Essa é a vantagem da minimização extrema — e o motivo pelo qual a plataforma guarda só um token anônimo no navegador.

**Referências:**
- RGPD arts. 15-22, 35-36, 37-39
- LGPD arts. 6, 7, 18, 38
- AEPD — Guia de avaliações de impacto
- WP29 Guidelines on DPIA

## Caso real: AEPD contra CaixaBank 2021 — €6 milhões por perfilamento sem base legal

A AEPD multou o CaixaBank em €6 milhões por tratar dados de clientes para perfilamento comercial sem base legal adequada (usavam «interesse legítimo» quando o teste de ponderação não o justificava) e sem informar suficientemente os titulares. Lição: o «interesse legítimo» não é um curinga; exige um teste documentado que pondere os direitos do titular. E transparência não é um aviso legal ininteligível — deve ser clara e acessível.

## Exercício guiado: redesenhe um formulário eliminando toda PII desnecessária

1. Pegue um formulário real de inscrição em um curso on-line típico
2. Liste todos os campos: nome, e-mail, telefone, endereço, documento etc.
3. Para CADA campo pergunte: o serviço funciona sem este dado?
4. Elimine tudo o que não seja estritamente necessário para a finalidade
5. Desenhe a alternativa: como você identifica o usuário sem e-mail/nome?
6. Documente: o que permaneceu, o que se perdeu, como o serviço continua
7. Compare com o padrão Secure T: você chegaria a zero PII?

## Recursos abertos

- [RGPD texto completo](https://eur-lex.europa.eu/eli/reg/2016/679/oj)
- [LGPD Brasil](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)
- [AEPD Guias](https://www.aepd.es/guias)
- [ANPD](https://www.gov.br/anpd/pt-br)

---
[Voltar ao programa](../syllabus.md)
