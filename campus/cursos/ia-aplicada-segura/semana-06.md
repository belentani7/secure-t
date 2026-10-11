# Semana 6: Robustez adversaria y testing

Curso: [IA Aplicada Segura: Construir con Responsabilidad](../syllabus.md) · Semana 6 de 20

## Objetivos de aprendizaje

- Distinguir robustez, seguridad y fiabilidad: tres propiedades que se miden distinto
- Probar un modelo con entradas disenadas para enganarlo, no solo con datos de test
- Convertir esas pruebas en un conjunto de regresion que corre en cada version

## Un buen rendimiento no es seguridad

Un modelo con 98 % de acierto en test puede fallar sistematicamente ante entradas que un atacante elige. La razon es geometrica: si mover un pixel o cambiar una palabra cruza la frontera de decision, existe una direccion de ataque, aunque la media siga siendo alta.

- **Evasion**: entradas modificadas que el modelo clasifica mal (adversarial examples). Importantes en vision y audio; en texto, equivalentes como homoglifos o espaciado raro.
- **Prompt injection**: instrucciones escondidas dentro de contenido que el modelo lee (paginas, PDF, correos). Convierte al modelo en el ejecutor del atacante.
- **Envenenamiento**: el fallo esta en el entrenamiento, no en la inferencia (semana 7).
- **Filtraciones de privacidad**: el modelo memoriza datos de entrenamiento y los devuelve (semana 8).

**Regla de testing:** cada propiedad se prueba con el **peor caso plausible**, no con el caso promedio. Y toda prueba que descubra un fallo real entra al conjunto de regresion: un fallo arreglado sin prueba vuelve.

**Referencias:**
- OWASP LLM Top 10 — LLM01 Prompt Injection, LLM09 Misinformation
- NIST AI 100-2 (Adversarial Machine Learning Taxonomy)
- MITRE ATLAS — atlas.mitre.org

## Caso real: contenido externo como vector de inyeccion (2023)

En 2023 se demostro repetidamente que contenido de una pagina web o de un PDF podia contener instrucciones que un asistente con acceso a esos datos ejecutaba: exfiltrar la conversacion, llamar a una accion no autorizada o cambiar su propio comportamiento. El fallo no estaba en el modelo, sino en tratarlo como una frontera de confianza: texto de fuera no debe tener el mismo peso que una instruccion del usuario. Contramedidas que si funcionan: separar canales con marcas de origen, exigir confirmacion humana antes de acciones con efecto y no dar al agente credenciales mas amplias de las que necesita la tarea.

## Ejercicio guiado: pruebas de robustez con evidencia

1. Elige un clasificador o un asistente de laboratorio propio
2. Construye 20 entradas de peor caso: ruido, homoglifos, texto escondido, instrucciones inyectadas
3. Mide la caida de rendimiento por tipo de ataque, en tabla
4. Para las 3 peores, escribe la contramedida y vuelve a medir
5. Empaqueta las entradas como conjunto de regresion ejecutable
6. Documenta en una ficha de modelo: que se probo, que fallo, que se acepto como riesgo

## Recursos abiertos

- [OWASP LLM Top 10](https://genai.owasp.org/llm-top-10/)
- [MITRE ATLAS](https://atlas.mitre.org/)
- [NIST AI 100-2](https://csrc.nist.gov/pubs/ai/100/2/e2025/final)

---
[Volver al syllabus](../syllabus.md)
