# Semana 8: Extração de modelo e proteção de PI

Curso: [Inteligência Artificial Aplicada e Segura](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizagem

- Reconhecer que uma API de modelo é um canal de extração, não apenas de serviço
- Medir o custo de um atacante que quer copiar o seu modelo ou extrair os seus dados
- Defender com limites, ruído e detecção, sem quebrar a utilidade

## A API como canal de vazamento

Cada resposta de um modelo carrega informação: o rótulo, o texto, as probabilidades se você as expõe, a latência, o número de tokens. Com consultas suficientes e bem escolhidas, essa informação permite:

- **Extrair o modelo** (model stealing): treinar um substituto que imita o original sem ter pago pelo seu treinamento.
- **Inferir pertencimento** (membership inference): saber se um registro concreto esteve no treinamento. Com dados sensíveis, isso já é um incidente de privacidade.
- **Reconstruir conteúdo memorizado**: pedir variações até o modelo recitar fragmentos dos seus dados.

Defesas proporcionais, de menor a maior custo: limites por identidade e por janela; não devolver probabilidades cruas; arredondar ou adicionar ruído às pontuações; marcas d'água nas saídas; detecção de padrões de extração (muitas consultas semelhantes, contas novas, vocabulários-sonda). E sobretudo: **não treinar com dados que não possam vazar**. A melhor defesa de privacidade é não ter o dado.

**Referências:**
- NIST AI 100-2 — Privacy
- MITRE ATLAS — AML.T0024 Exfiltration via ML Inference API
- OWASP LLM Top 10 — LLM02 Sensitive Information Disclosure

## Caso real: roubar parte de um modelo em produção (2024)

Uma equipe de pesquisa publicou um ataque que, com acesso a uma API comercial, conseguiu reconstruir informação sobre os parâmetros de saída do modelo explorando um canal lateral de pontuações. O custo foi de milhares de consultas, não de milhões de euros de treinamento. Lição de gestão: se o modelo é o negócio, a API deve ser tratada como uma fronteira com taxa, telemetria e detecção, e a PI deve ser protegida com contratos e marcas d'água, não com otimismo.

## Exercício guiado: meça a sua própria superfície de extração

1. Monte um modelo pequeno atrás de uma API local
2. Defina uma política de cota: por identidade, por minuto e por dia
3. Escreva um cliente que faça 200 consultas direcionadas e anote que informação obtém
4. Repita expondo probabilidades e depois sem expô-las: compare o vazamento
5. Desenhe 3 regras de detecção de extração e teste cada uma com tráfego simulado
6. Adicione uma marca d'água simples e comprove que continua detectável
7. Redija a ficha de riscos: o que se perde se te copiarem e o que você faria nas primeiras 24 horas

## Recursos abertos

- [NIST AI 100-2](https://csrc.nist.gov/pubs/ai/100/2/e2025/final)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/)

---
[Voltar ao programa](../syllabus.md)
