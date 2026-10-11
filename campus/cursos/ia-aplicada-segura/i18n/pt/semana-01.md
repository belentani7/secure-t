# Semana 1: Fundamentos: o que é (e o que não é) aprendizado de máquina

Curso: [Inteligência Artificial Aplicada e Segura](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizagem

- Explicar o ciclo dados → modelo → predição → erro sem jargão vazio
- Distinguir aprendizado supervisionado, não supervisionado e por reforço
- Identificar overfitting, viés e vazamento de dados em exemplos concretos
- Treinar um classificador de brinquedo com scikit-learn e dados abertos

## O ciclo de vida de um modelo de ML

Machine Learning NÃO é magia nem «inteligência». É estatística aplicada em escala: um programa que encontra padrões em dados passados para prever dados futuros.

**O ciclo completo:**

```
DADOS → PRÉ-PROCESSAMENTO → TREINAMENTO → AVALIAÇÃO → IMPLANTAÇÃO → MONITORAMENTO
  ↑                                                                          ↓
  └────────────────── RETROALIMENTAÇÃO ───────────────────────────────────────┘
```

**1. Dados:** a qualidade do dado vence o algoritmo elegante. Lixo entra, lixo sai (GIGO). Fontes abertas: UCI ML Repository, Kaggle Datasets, dados.gov.br.

**2. Pré-processamento:** limpeza, normalização, divisão em train/validation/test (70/15/15 típico). NUNCA use dados de teste para treinar — isso é vazamento de dados (data leakage).

**3. Treinamento:** o modelo ajusta parâmetros para minimizar o erro nos dados de treinamento.

**4. Avaliação:** mede-se em dados que o modelo NUNCA viu (test set). Métricas: acurácia, precisão, recall, F1.

**5. Implantação:** colocar o modelo em produção (API, edge, batch).

**6. Monitoramento:** o mundo muda; o modelo se degrada (concept drift). É preciso retreinar periodicamente.

**Os 3 tipos de aprendizado:**
- **Supervisionado:** dados rotulados → prevê rótulos (spam/não spam, preço)
- **Não supervisionado:** sem rótulos → descobre estrutura (clusters, anomalias)
- **Por reforço:** o agente aprende por recompensas (jogos, robótica)

**Referências:**
- UCI ML Repository — archive.ics.uci.edu/ml
- scikit-learn — scikit-learn.org
- Google ML Crash Course — developers.google.com/machine-learning

## Overfitting, viés e vazamento de dados

**Overfitting (sobreajuste):** o modelo memoriza os dados de treinamento em vez de aprender padrões generalizáveis. Sinal: acurácia de 99 % no treino, 60 % no teste.

```python
# Exemplo com scikit-learn
from sklearn.tree import DecisionTreeClassifier
# Sobreajustado: árvore sem limite de profundidade
modelo_ruim = DecisionTreeClassifier()  # max_depth=None
# Controlado: limite de profundidade
modelo_ok = DecisionTreeClassifier(max_depth=5)
```

Defesas: validação cruzada, regularização, early stopping, mais dados.

**Viés (bias):** o modelo reproduz os vieses dos dados. Se os dados históricos de contratação discriminam por gênero, o modelo discriminará igual.

**Vazamento de dados (data leakage):** usar informação do futuro ou do test set durante o treinamento. Exemplo: prever se um paciente sobrevive usando dados que só existem depois do desfecho. O modelo parece perfeito no laboratório e falha completamente em produção.

**Exercício mental:** se o seu modelo tem acurácia acima de 95 % de primeira, desconfie de vazamento antes de comemorar.

**Referências:**
- scikit-learn: cross_val_score
- NIST AI 100-1 — AI Risk Management Framework

## Caso real: Amazon 2018 — o modelo de contratação que discriminava mulheres

A Amazon treinou um modelo de triagem de currículos com 10 anos de dados de contratação. Como a indústria de tecnologia é majoritariamente masculina, o modelo aprendeu que «women's» (como em «women's chess club») era um preditor negativo. A Amazon o retirou. Lição: o viés não está no algoritmo, mas nos dados; auditar os dados é mais importante do que escolher o algoritmo certo.

## Exercício guiado: classificador de brinquedo com scikit-learn

1. Instale o scikit-learn: `pip install scikit-learn`
2. Carregue o dataset Iris: `from sklearn.datasets import load_iris`
3. Divida em treino/teste: `train_test_split(X, y, test_size=0.3, random_state=42)`
4. Treine um DecisionTree com `max_depth=3` e outro sem limite
5. Compare a acurácia em treino e em teste para os dois modelos
6. Identifique qual sofre overfitting e explique POR QUÊ em uma frase
7. Repita com RandomForest: a generalização melhora?
8. Documente as métricas em uma tabela: modelo / acurácia treino / acurácia teste

## Recursos abertos

- [scikit-learn Tutorials](https://scikit-learn.org/stable/tutorial/)
- [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)
- [UCI ML Repository](https://archive.ics.uci.edu/ml/)
- [Kaggle Datasets](https://www.kaggle.com/datasets)

---
[Voltar ao programa](../syllabus.md)
