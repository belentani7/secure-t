# Semana 2: LLMs y prompt engineering responsable

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 2 de 20

## Objetivos de aprendizaje

- Explicar cómo funciona un LLM (predicción de token, no comprensión)
- Diseñar prompts estructurados (ROL + TAREA + CONTEXTO + FORMATO)
- Identificar alucinaciones y aplicar verificación humana sistemática
- Conocer los riesgos del OWASP LLM Top 10

## Cómo funciona un LLM (y qué NO hace)

Un Large Language Model predice el siguiente token (fragmento de palabra) basándose en los tokens anteriores. No 'entiende', no 'sabe', no 'razona' — genera la continuación estadísticamente más plausible del texto que tiene delante.

**Arquitectura simplificada:**
```
INPUT: "La capital de Francia es"
                                 ↓
  [ Transformer: atención sobre TODOS los tokens anteriores ]
                                 ↓
OUTPUT probabilístico: "París" (p=0.92) | "Lyon" (p=0.03) | ...
```

**Parámetros clave que controlas:**
- **Temperatura:** 0.0 = determinista (siempre la misma respuesta), 1.0+ = creativo (más variación). Para código/datos: temp baja. Para escritura creativa: temp alta.
- **Contexto (context window):** cuánto texto 'recuerda'. Fuera de la ventana, el modelo olvida.
- **System prompt:** instrucciones que definen el comportamiento.

**Alucinación (hallucination):**
El modelo genera texto plausible pero falso. No es un bug — es una propiedad de la generación estadística. Ejemplos:
- Citar un paper que no existe (título plausible, autores inventados)
- Dar código que compila pero tiene un bug lógico sutil
- Afirmar hechos con confianza que son incorrectos

**Regla de oro:** la IA propone, la persona verifica. Cada afirmación factual de un LLM debe contrastarse con una fuente primaria antes de usarse.

**Referencias:**
- Attention Is All You Need — Vaswani et al. 2017
- NIST AI 100-1 — AI Risk Management Framework
- OWASP LLM Top 10 — owasp.org/www-project-top-10-for-large-language-model-applications

## Prompt engineering responsable y OWASP LLM Top 10

**Estructura ROL + TAREA + CONTEXTO + FORMATO:**
```
ROL:      Actúa como analista de seguridad con 5 años de experiencia
TAREA:    Analiza este log de autenticación y lista eventos sospechosos
CONTEXTO: Servidor web Apache, 10.000 usuarios, horario laboral 08-18h
FORMATO:  Tabla con columnas: timestamp, evento, severidad, justificación
```

**OWASP LLM Top 10 (2025):**
- **LLM01 — Prompt Injection:** instrucciones ocultas en input que cambian el comportamiento del modelo
- **LLM02 — Insecure Output Handling:** confiar en la salida del LLM sin sanitizar (XSS, SQLi vía LLM)
- **LLM03 — Training Data Poisoning:** datos contaminados en el corpus
- **LLM04 — Model Denial of Service:** prompts que consumen recursos excesivos
- **LLM05 — Supply Chain Vulnerabilities:** modelos/plugins de terceros comprometidos
- **LLM06 — Sensitive Information Disclosure:** el modelo revela datos del entrenamiento o del contexto
- **LLM07 — Insecure Plugin Design:** plugins con permisos excesivos
- **LLM08 — Excessive Agency:** el LLM actúa sin verificación humana
- **LLM09 — Overreliance:** usuarios que confían ciegamente en las respuestas
- **LLM10 — Model Theft:** extracción del modelo o sus pesos

**Principios de uso responsable:**
1. Verificar toda salida factual contra fuentes primarias
2. No enviar datos sensibles/PII al modelo sin necesidad
3. Tratar la salida como input no confiable (sanitizar antes de renderizar)
4. Documentar las limitaciones del modelo en el producto
5. Mantener el humano en el loop para decisiones con impacto

**Referencias:**
- OWASP LLM Top 10 2025
- NIST AI 600-1 — AI and Cybersecurity
- EU AI Act — Regulation 2024/1689

## Caso real: Air Canada chatbot 2024: alucinación con consecuencias legales

El chatbot de Air Canada inventó una 'política de duelo' que no existía, prometiendo a un pasajero un descuento retroactivo. Cuando la aerolínea se negó a honrar la promesa, el tribunal de British Columbia falló a favor del pasajero: Air Canada es responsable de lo que dice su agente de IA. Lección: LLM09 (Overreliance) + LLM02 (la salida del LLM se presentó como autorizada sin verificación). Si despliegas un LLM, eres responsable de lo que produce.

## Ejercicio guiado: Diseña 5 prompts educativos y compara respuestas

1. Escribe un prompt SIN estructura: 'explícame SQL injection'
2. Reescríbelo con ROL+TAREA+CONTEXTO+FORMATO
3. Compara ambas respuestas: ¿cuál es más útil y por qué?
4. Repite para 4 temas más del curso (OSINT, CIA, hardening, NIST)
5. Para cada respuesta, verifica 2 afirmaciones contra fuentes primarias
6. Documenta: qué era correcto, qué era impreciso, qué era inventado
7. Clasifica cada imprecisión según OWASP LLM Top 10 (LLM06? LLM09?)
8. Conclusión: escribe tu regla personal de uso de LLMs en 3 frases

## Recursos abiertos

- [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/)
- [NIST AI RMF](https://www.nist.gov/artificial-intelligence/ai-risk-management-framework)
- [EU AI Act text](https://eur-lex.europa.eu/eli/reg/2024/1689/oj)
- [Prompt Engineering Guide](https://www.promptingguide.ai/)

---
[Volver al syllabus](../syllabus.md)
