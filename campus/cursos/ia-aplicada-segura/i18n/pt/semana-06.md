# Semana 6: Robustez adversária e testes

Curso: [Inteligência Artificial Aplicada e Segura](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizagem

- Distinguir robustez, segurança e confiabilidade: três propriedades medidas de forma diferente
- Testar um modelo com entradas desenhadas para enganá-lo, não só com dados de teste
- Converter esses testes em um conjunto de regressão que roda a cada versão

## Um bom desempenho não é segurança

Um modelo com 98 % de acerto em teste pode falhar sistematicamente diante de entradas escolhidas por um atacante. A razão é geométrica: se mover um pixel ou trocar uma palavra cruza a fronteira de decisão, existe uma direção de ataque, mesmo que a média continue alta.

- **Evasão**: entradas modificadas que o modelo classifica mal (exemplos adversariais). Importantes em visão e áudio; em texto, equivalentes como homoglifos ou espaçamento estranho.
- **Prompt injection**: instruções escondidas dentro de conteúdo que o modelo lê (páginas, PDF, e-mails). Transforma o modelo no executor do atacante.
- **Envenenamento**: a falha está no treinamento, não na inferência (semana 7).
- **Vazamentos de privacidade**: o modelo memoriza dados de treinamento e os devolve (semana 8).

**Regra de teste:** cada propriedade é testada com o **pior caso plausível**, não com o caso médio. E todo teste que descobre uma falha real entra no conjunto de regressão: uma falha corrigida sem teste volta.

**Referências:**
- OWASP LLM Top 10 — LLM01 Prompt Injection, LLM09 Misinformation
- NIST AI 100-2 (Adversarial Machine Learning Taxonomy)
- MITRE ATLAS — atlas.mitre.org

## Caso real: conteúdo externo como vetor de injeção (2023)

Em 2023 demonstrou-se repetidamente que conteúdo de uma página web ou de um PDF podia conter instruções que um assistente com acesso a esses dados executava: exfiltrar a conversa, chamar uma ação não autorizada ou mudar o próprio comportamento. A falha não estava no modelo, mas em tratá-lo como uma fronteira de confiança: texto de fora não deve ter o mesmo peso que uma instrução do usuário. Contramedidas que funcionam: separar canais com marcas de origem, exigir confirmação humana antes de ações com efeito e não dar ao agente credenciais mais amplas do que a tarefa exige.

## Exercício guiado: testes de robustez com evidência

1. Escolha um classificador ou um assistente de laboratório seu
2. Construa 20 entradas de pior caso: ruído, homoglifos, texto escondido, instruções injetadas
3. Meça a queda de desempenho por tipo de ataque, em tabela
4. Para as 3 piores, escreva a contramedida e meça de novo
5. Empacote as entradas como conjunto de regressão executável
6. Documente em uma ficha de modelo: o que se testou, o que falhou, o que se aceitou como risco

## Recursos abertos

- [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [NIST AI 100-2](https://csrc.nist.gov/pubs/ai/100/2/e2025/final)

---
[Voltar ao programa](../syllabus.md)
