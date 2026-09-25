# Semana 1: Fundamentos de ML sin humo

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 1 de 20

## Objetivos de aprendizaje

- Explicar el ciclo datos → modelo → predicción → error sin tecnicismos vacíos
- Distinguir aprendizaje supervisado, no supervisado y por refuerzo
- Identificar sobreajuste, sesgo y fuga de datos en ejemplos concretos
- Entrenar un clasificador de juguete con scikit-learn y datos abiertos

## El ciclo de vida de un modelo de ML

Machine Learning NO es magia ni 'inteligencia'. Es estadística aplicada a escala: un programa que encuentra patrones en datos pasados para predecir datos futuros.

**El ciclo completo:**
```
DATOS → PREPROCESAMIENTO → ENTRENAMIENTO → EVALUACIÓN → DESPLIEGUE → MONITORIZACIÓN
  ↑                                                                        ↓
  └────────────────── RETROALIMENTACIÓN ──────────────────────────────────────┘
```

**1. Datos:** la calidad del dato gana al algoritmo elegante. Basura entra, basura sale (GIGO). Fuentes abiertas: UCI ML Repository, Kaggle Datasets, datos.gob.es.

**2. Preprocesamiento:** limpieza, normalización, división en train/validation/test (70/15/15 típico). NUNCA uses datos de test para entrenar — eso es fuga de datos (data leakage).

**3. Entrenamiento:** el modelo ajusta parámetros para minimizar el error en los datos de entrenamiento.

**4. Evaluación:** se mide en datos que el modelo NUNCA ha visto (test set). Métricas: accuracy, precision, recall, F1.

**5. Despliegue:** poner el modelo en producción (API, edge, batch).

**6. Monitorización:** el mundo cambia; el modelo se degrada (concept drift). Hay que re-entrenar periódicamente.

**Los 3 tipos de aprendizaje:**
- **Supervisado:** datos etiquetados → predice etiquetas (spam/no spam, precio)
- **No supervisado:** sin etiquetas → descubre estructura (clusters, anomalías)
- **Por refuerzo:** agente aprende por recompensas (juegos, robótica)

**Referencias:**
- UCI ML Repository — archive.ics.uci.edu/ml
- scikit-learn — scikit-learn.org
- Google ML Crash Course — developers.google.com/machine-learning

## Sobreajuste, sesgo y fuga de datos

**Sobreajuste (overfitting):**
El modelo memoriza los datos de entrenamiento en lugar de aprender patrones generalizables. Señal: accuracy 99% en train, 60% en test.
```python
# Ejemplo con scikit-learn
from sklearn.tree import DecisionTreeClassifier
# Sobreajustado: árbol sin límite de profundidad
modelo_malo = DecisionTreeClassifier()  # max_depth=None
# Controlado: límite de profundidad
modelo_ok = DecisionTreeClassifier(max_depth=5)
```
Defensas: validación cruzada, regularización, early stopping, más datos.

**Sesgo (bias):**
El modelo reproduce los sesgos de los datos. Si los datos históricos de contratación discriminan por género, el modelo discriminará igual. Caso real: Amazon 2018 descartó su herramienta de screening de CVs porque penalizaba candidatas mujeres — entrenada con 10 años de contrataciones mayoritariamente masculinas.

**Fuga de datos (data leakage):**
Usar información del futuro o del test set durante el entrenamiento. Ejemplo: predecir si un paciente sobrevive usando datos que solo existen después del desenlace. El modelo parece perfecto en el lab y falla completamente en producción.

**Ejercicio mental:** si tu modelo tiene accuracy >95% a la primera, sospecha de leakage antes de celebrar.

**Referencias:**
- Amazon CV screening bias — Reuters 2018
- scikit-learn: cross_val_score
- NIST AI 100-1 — AI Risk Management Framework

## Caso real: Amazon 2018: el modelo de contratación que discriminaba mujeres

Amazon entrenó un modelo de screening de CVs con 10 años de datos de contratación. Como la industria tech es mayoritariamente masculina, el modelo aprendió que 'women's' (como en 'women's chess club') era un predictor negativo. Amazon lo retiró. Lección: el sesgo no está en el algoritmo sino en los datos; auditar los datos es más importante que elegir el algoritmo correcto.

## Ejercicio guiado: Clasificador de juguete con scikit-learn

1. Instala scikit-learn: pip install scikit-learn
2. Carga el dataset Iris: from sklearn.datasets import load_iris
3. Divide en train/test: train_test_split(X, y, test_size=0.3, random_state=42)
4. Entrena un DecisionTree con max_depth=3 y otro sin límite
5. Compara accuracy en train vs test para ambos modelos
6. Identifica cuál sobreajusta y explica POR QUÉ en una frase
7. Repite con RandomForest: ¿mejora la generalización?
8. Documenta métricas en una tabla: modelo / train_acc / test_acc

## Recursos abiertos

- [scikit-learn Tutorials](https://scikit-learn.org/stable/tutorial/)
- [Google ML Crash Course](https://developers.google.com/machine-learning/crash-course)
- [UCI ML Repository](https://archive.ics.uci.edu/ml/)
- [Kaggle Datasets](https://www.kaggle.com/datasets)

---
[Volver al syllabus](../syllabus.md)
