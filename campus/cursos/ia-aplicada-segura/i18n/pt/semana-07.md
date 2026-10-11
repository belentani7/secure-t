# Semana 7: Envenenamento de dados e cadeia de suprimentos

Curso: [Inteligência Artificial Aplicada e Segura](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizagem

- Entender por que o envenenamento sobrevive aos testes de validação
- Revisar a cadeia de suprimentos de um modelo como se revisa uma dependência
- Escolher formatos e fontes que não executem código ao carregar

## A falha que viaja no dataset

Envenenar dados não é «colocar exemplos ruins»: é introduzir uma associação que o modelo aprende e que só se ativa quando o atacante quer. Um **backdoor** típico ensina o modelo a se comportar bem exceto diante de um gatilho (uma palavra, um padrão). Por isso o modelo passa nos testes normais: a porta só se abre com a chave.

Dois fatos incômodos tornam isso prático: (1) os conjuntos de dados públicos são coletados da web e são envenenáveis à distância; (2) os modelos e pesos são compartilhados em formatos que, historicamente, **executam código ao serem carregados** (Pickle). Carregar um modelo de um repositório público é executar código de terceiros, a menos que se escolha um formato seguro.

Controles que reduzem o risco de verdade:

| Controle | O que combate |
|---|---|
| Formato seguro ao carregar (safetensors, ONNX) | Execução de código |
| Linhagem e hash de cada dataset | Rastreabilidade de origem |
| Amostragem e auditoria de gatilhos | Backdoors conhecidos |
| Modelo e pesos assinados | Substituição |
| Reproduzir o treinamento do zero | Dados contaminados |

**Referências:**
- NIST AI 100-2 — Poisoning
- MITRE ATLAS — AML.T0020 Poison Training Data
- OWASP ML Top 10 — ML07 Transfer Learning Attack

## Caso real: malware no hub de modelos (2024)

Pesquisadores encontraram mais de uma centena de modelos públicos em um grande repositório comunitário que, ao serem carregados, executavam código malicioso pelo mecanismo clássico de serialização. Não exploravam o modelo: exploravam o **costume** de carregar pesos sem verificar origem nem formato. A lição vale igual para datasets e plugins de frameworks: a cadeia de suprimentos de IA é tão forte quanto o elo que ninguém revisou.

## Exercício guiado: audite a origem de um modelo

1. Escolha um modelo público pequeno que use ou queira usar
2. Descubra em que formato ele é distribuído e se esse formato executa código ao carregar
3. Localize a ficha do dataset de treinamento: há linhagem? há licença? houve filtragem?
4. Verifique quem subiu os pesos e se há versões anteriores ou assinaturas
5. Converta o modelo para um formato seguro e compare o desempenho antes e depois
6. Documente um plano de resposta: se for descoberto envenenamento, como se retira e o que se substitui
7. Escreva as 5 perguntas que você fará de agora em diante antes de carregar qualquer modelo

## Recursos abertos

- [safetensors](https://github.com/huggingface/safetensors)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [OWASP ML Top 10](https://owasp.org/www-project-machine-learning-security-top-10/)

---
[Voltar ao programa](../syllabus.md)
