# Semana 8: Extraccion de modelo y proteccion de PI

Curso: [IA Aplicada Segura: Construir con Responsabilidad](../syllabus.md) · Semana 8 de 20

## Objetivos de aprendizaje

- Reconocer que una API de modelo es un canal de extraccion, no solo de servicio
- Medir el coste de un atacante que quiere copiar tu modelo o sacar tus datos
- Defender con limites, ruido y deteccion, sin romper la utilidad

## La API como canal de fuga

Cada respuesta de un modelo lleva informacion: la etiqueta, el texto, las probabilidades si las expones, la latencia, el numero de tokens. Con suficientes consultas bien elegidas, esa informacion permite:

- **Extraer el modelo** (model stealing): entrenar un sustituto que imite al original sin haber pagado su entrenamiento.
- **Inferir pertenencia** (membership inference): saber si un registro concreto estuvo en el entrenamiento. Con datos sensibles, eso ya es un incidente de privacidad.
- **Reconstruir contenido memorizado**: pedir variaciones hasta que el modelo recite fragmentos de sus datos.

Defensas proporcionales, de menos a mas coste: limites por identidad y por ventana; no devolver probabilidades crudas; redondear o anadir ruido a puntuaciones; marcas de agua en las salidas; deteccion de patrones de extraccion (muchas consultas similes, cuentas nuevas, vocabularios sonda). Y sobre todo: **no entrenar con datos que no puedan filtrarse**. La mejor defensa de privacidad es no tener el dato.

**Referencias:**
- NIST AI 100-2 — Privacy
- MITRE ATLAS — AML.T0024 Exfiltration via ML Inference API
- OWASP LLM Top 10 — LLM02 Sensitive Information Disclosure

## Caso real: robar parte de un modelo en produccion (2024)

Un equipo de investigacion publico un ataque que, con acceso a una API comercial, logro reconstruir informacion sobre los parametros de salida del modelo explotando un canal lateral de puntuaciones. El coste fue de miles de consultas, no de millones de euros de entrenamiento. Leccion de gestion: si el modelo es el negocio, la API debe tratarse como una frontera con tasa, telemetria y deteccion, y la PI debe protegerse con contratos y marcas de agua, no con optimismo.

## Ejercicio guiado: mide tu propia superficie de extraccion

1. Monta un modelo pequeno detras de una API local
2. Define una politica de cuota: por identidad, por minuto y por dia
3. Escribe un cliente que haga 200 consultas dirigidas y anota que informacion obtiene
4. Repite exponiendo probabilidades y despues sin exponerlas: compara la fuga
5. Disena 3 reglas de deteccion de extraccion y prueba cada una con trafico simulado
6. Anade una marca de agua simple y comprueba que sigue siendo detectable
7. Redacta la ficha de riesgos: que se pierde si te copian, y que harias en las primeras 24 horas

## Recursos abiertos

- [NIST AI 100-2](https://csrc.nist.gov/pubs/ai/100/2/e2025/final)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/)

---
[Volver al syllabus](../syllabus.md)
