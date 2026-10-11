# Semana 7: Envenenamiento de datos y supply chain

Curso: [IA Aplicada Segura: Construir con Responsabilidad](../syllabus.md) · Semana 7 de 20

## Objetivos de aprendizaje

- Entender por que el envenenamiento sobrevive a las pruebas de validacion
- Revisar la cadena de suministro de un modelo como se revisa una dependencia
- Elegir formatos y fuentes que no ejecuten codigo al cargar

## El fallo que viaja en el dataset

Envenenar datos no es «meter ejemplos malos»: es introducir una asociacion que el modelo aprende y que solo se activa cuando el atacante quiere. Un **backdoor** tipico enseña al modelo a comportarse bien salvo ante un disparador (una palabra, un patron). Por eso el modelo pasa las pruebas normales: la puerta solo se abre con la llave.

Dos hechos incomodos hacen esto practico: (1) los conjuntos de datos publicos se rastrean de la web y son envenenables a distancia; (2) los modelos y pesos se comparten en formatos que, historicamente, **ejecutan codigo al cargarse** (Pickle). Cargar un modelo de un repositorio publico es ejecutar codigo de terceros salvo que se elija un formato seguro.

Controles que reducen el riesgo de verdad:

| Control | Que ataca |
|---|---|
| Formato seguro al cargar (safetensors, ONNX) | Ejecucion de codigo |
| Linaje y hash de cada dataset | Trazabilidad de origen |
| Muestreo y auditoria de disparadores | Backdoors conocidos |
| Modelo y pesos firmados | Sustitucion |
| Reproducir el entrenamiento desde cero | Datos contaminados |

**Referencias:**
- NIST AI 100-2 — Poisoning
- MITRE ATLAS — AML.T0020 Poison Training Data
- OWASP ML Top 10 — ML07 Transfer Learning Attack

## Caso real: malware en el hub de modelos (2024)

Investigadores encontraron mas de un centenar de modelos publicos en un gran repositorio comunitario que, al cargarse, ejecutaban codigo malicioso mediante el mecanismo de serializacion clasico. No exploitaban el modelo: exploitaban la **costumbre** de cargar pesos sin comprobar origen ni formato. La leccion se aplica igual a datasets y a plugins de frameworks: la cadena de suministro de IA es tan fuerte como el eslabon que nadie reviso.

## Ejercicio guiado: audita el origen de un modelo

1. Elige un modelo publico pequeno que uses o quieras usar
2. Averigua en que formato se distribuye y si ese formato ejecuta codigo al cargar
3. Localiza la ficha del dataset de entrenamiento: hay linhaje? hay licencia? hay filtrado?
4. Busca quien subio los pesos y si hay versiones previas o firmas
5. Convierte el modelo a un formato seguro y compara rendimiento antes y despues
6. Documenta un plan de respuesta: si se descubre envenenamiento, como se retira y que se sustituye
7. Escribe las 5 preguntas que haras de ahora en adelante antes de cargar cualquier modelo

## Recursos abiertos

- [safetensors](https://github.com/huggingface/safetensors)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [OWASP ML Top 10](https://owasp.org/www-project-machine-learning-security-top-10/)

---
[Volver al syllabus](../syllabus.md)
