# Semana 2: LLMs e uso responsável

Curso: [Inteligência Artificial Aplicada e Segura](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizagem

- Explicar como funciona um LLM (predição de token, não compreensão)
- Desenhar prompts estruturados (PAPEL + TAREFA + CONTEXTO + FORMATO)
- Identificar alucinações e aplicar verificação humana sistemática
- Conhecer os riscos do OWASP LLM Top 10

## Como funciona um LLM (e o que ele NÃO faz)

Um Large Language Model prevê o próximo token (fragmento de palavra) com base nos tokens anteriores. Ele não «entende», não «sabe», não «raciocina» — gera a continuação estatisticamente mais plausível do texto que tem à frente.

**Arquitetura simplificada:**

```
ENTRADA: "A capital da França é"
                                   ↓
  [ Transformer: atenção sobre TODOS os tokens anteriores ]
                                   ↓
SAÍDA probabilística: "Paris" (p=0,92) | "Lyon" (p=0,03) | ...
```

**Parâmetros-chave que você controla:**
- **Temperatura:** 0,0 = determinístico (sempre a mesma resposta), 1,0+ = criativo (mais variação). Para código/dados: temperatura baixa. Para escrita criativa: temperatura alta.
- **Contexto (context window):** quanto texto ele «lembra». Fora da janela, o modelo esquece.
- **System prompt:** instruções que definem o comportamento.

**Alucinação (hallucination):** o modelo gera texto plausível, mas falso. Não é um bug — é uma propriedade da geração estatística. Exemplos: citar um artigo que não existe (título plausível, autores inventados); fornecer código que compila mas tem um bug lógico sutil; afirmar fatos com confiança que estão errados.

**Regra de ouro:** a IA propõe, a pessoa verifica. Toda afirmação factual de um LLM deve ser confrontada com uma fonte primária antes de ser usada.

**Referências:**
- Attention Is All You Need — Vaswani et al. 2017
- NIST AI 100-1 — AI Risk Management Framework
- OWASP LLM Top 10 — owasp.org/www-project-top-10-for-large-language-model-applications

## Prompt engineering responsável e OWASP LLM Top 10

**Estrutura PAPEL + TAREFA + CONTEXTO + FORMATO:**

```
PAPEL:    Atue como analista de segurança com 5 anos de experiência
TAREFA:   Analise este log de autenticação e liste eventos suspeitos
CONTEXTO: Servidor web Apache, 10.000 usuários, horário comercial 08-18h
FORMATO:  Tabela com colunas: timestamp, evento, severidade, justificativa
```

**OWASP LLM Top 10 (2025):**
- **LLM01 — Prompt Injection:** instruções ocultas na entrada que mudam o comportamento do modelo
- **LLM02 — Insecure Output Handling:** confiar na saída do LLM sem sanitizar (XSS, SQLi via LLM)
- **LLM03 — Training Data Poisoning:** dados contaminados no corpus
- **LLM04 — Model Denial of Service:** prompts que consomem recursos excessivos
- **LLM05 — Supply Chain Vulnerabilities:** modelos/plugins de terceiros comprometidos
- **LLM06 — Sensitive Information Disclosure:** o modelo revela dados do treinamento ou do contexto
- **LLM07 — Insecure Plugin Design:** plugins com permissões excessivas
- **LLM08 — Excessive Agency:** o LLM age sem verificação humana
- **LLM09 — Overreliance:** usuários que confiam cegamente nas respostas
- **LLM10 — Model Theft:** extração do modelo ou dos seus pesos

**Princípios de uso responsável:**
1. Verificar toda saída factual contra fontes primárias
2. Não enviar dados sensíveis/PII ao modelo sem necessidade
3. Tratar a saída como entrada não confiável (sanitizar antes de renderizar)
4. Documentar as limitações do modelo no produto
5. Manter o humano no loop para decisões com impacto

**Referências:**
- OWASP LLM Top 10 2025
- NIST AI 600-1 — AI and Cybersecurity
- EU AI Act — Regulation 2024/1689

## Caso real: chatbot da Air Canada 2024 — alucinação com consequências legais

O chatbot da Air Canada inventou uma «política de luto» que não existia, prometendo a um passageiro um desconto retroativo. Quando a companhia aérea se recusou a honrar a promessa, o tribunal da Colúmbia Britânica decidiu a favor do passageiro: a Air Canada é responsável pelo que diz o seu agente de IA. Lição: LLM09 (Overreliance) + LLM02 (a saída do LLM foi apresentada como autorizada, sem verificação). Se você implanta um LLM, você é responsável pelo que ele produz.

## Exercício guiado: desenhe 5 prompts educativos e compare respostas

1. Escreva um prompt SEM estrutura: «explique SQL injection»
2. Reescreva-o com PAPEL+TAREFA+CONTEXTO+FORMATO
3. Compare as duas respostas: qual é mais útil e por quê?
4. Repita para 4 temas mais do curso (OSINT, CIA, hardening, NIST)
5. Para cada resposta, verifique 2 afirmações contra fontes primárias
6. Documente: o que estava correto, o que era impreciso, o que era inventado
7. Classifique cada imprecisão segundo o OWASP LLM Top 10 (LLM06? LLM09?)
8. Conclusão: escreva a sua regra pessoal de uso de LLMs em 3 frases

## Recursos abertos

- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [NIST AI RMF](https://www.nist.gov/artificial-intelligence/ai-risk-management-framework)
- [EU AI Act text](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

---
[Voltar ao programa](../syllabus.md)
