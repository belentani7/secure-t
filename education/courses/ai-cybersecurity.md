# Inteligencia Artificial en Ciberseguridad

## Módulo 2: Fundamentos de IA

### Redes Neuronales Artificiales
- Perceptron y multi-capas
- Funciones de activación
- Propagación hacia atrás (backpropagation)

### Aprendizaje Automático
- Regresión lineal y logística
- K-Nearest Neighbors
- Random Forest y Gradient Boosting

### Laboratorio Práctico 2.1
**Clasificación de amenazas con scikit-learn**
```python
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

# Cargar datos de entrenamiento
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Entrenar modelo
clf = RandomForestClassifier(n_estimators=100)
clf.fit(X_train, y_train)

# Evaluar modelo
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))
```

### Laboratorio Práctico 2.2
**Detección de anomalías con Isolation Forest**
```python
from sklearn.isolation import IsolationForest

# Identificar outliers en tráfico de red
clf = IsolationForest(contamination=0.1, random_state=42)
outliers = clf.fit_predict(features)
```

## Módulo 3: Deep Learning para Ciberseguridad

### Redes Neuronales Recurrentes
- LSTM y GRU para secuencias temporales
- Detección de patrones en tiempo series

### Redes Neuronales Convolucionales
- Procesamiento de imágenes de seguridad
- Clasificación de malware mediante imágenes

### Laboratorio Práctico 2.3
**Detección de malware con CNN**
```python
import tensorflow as tf
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Conv2D(32, (3, 3), activation='relu', input_shape=(64, 64, 3)),
    keras.layers.MaxPooling2D((2, 2)),
    keras.layers.Flatten(),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dense(1, activation='sigmoid')
])

model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
model.fit(x_train, y_train, epochs=10, batch_size=32)
```