# Semana 11: Supply chain de LLM y model cards

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 11 de 20

## Objetivo de la semana
Comprender cómo la seguridad de los modelos de lenguaje (LLM) depende críticamente de su cadena de suministro: desde los datos de preentrenamiento hasta los pesos publicados en repositorios. El estudiante aprenderá a auditar dependencias, evaluar riesgos de procedencia y documentar modelos mediante *model cards* alineadas con estándares como NIST AI RMF, OWASP LLM Top 10 y MITRE ATLAS.

## LECTURA

La **cadena de suministro de LLM** abarca todo el ciclo de vida del modelo: recolección y curación de datos, tokenización, arquitectura, entrenamiento, ajuste fino (fine-tuning), alineación (RLHF/DPO), empaquetado de pesos, publicación en hubs (Hugging Face, Ollama, AWS Bedrock, Azure AI) y despliegue en inferencia. Cada eslabón introduce vectores de ataque reales. El **OWASP Top 10 for LLM Applications (2025)** sitúa *LLM05: Supply Chain Vulnerabilities* como riesgo crítico, señalando que modelos, adaptadores LoRA, datasets y plugins pueden estar comprometidos. **MITRE ATLAS** documenta tácticas como *AML.T0010 (ML Supply Chain Compromise)* y *AML.T0058 (Publish Poisoned Models)*, usadas en ataques reales contra repositorios públicos.

Un riesgo central es el **envenenamiento de datos y pesos**: un atacante puede publicar un modelo con backdoors que se activan ante triggers específicos (p. ej. una frase clave genera código malicioso). Investigaciones como *"Poisoning Language Models During Instruction Tuning"* (Wan et al., 2023) demostraron que basta envenenar el 0.1% del dataset de instrucciones para comprometer el comportamiento. Otro vector es la **serialización insegura**: formatos como pickle (`.bin`, `.pt`) permiten ejecución arbitraria al cargar el modelo. Hugging Face migró a `safetensors` precisamente para mitigar esto, pero aún circulan权重 en formatos peligrosos.

Los **estándares aplicables** son varios. **NIST AI RMF 1.0** (AI 100-1) exige gobernanza, mapeo, medición y gestión de riesgos en toda la cadena. **ISO/IEC 42001:2023** establece un sistema de gestión de IA con controles de procedencia y trazabilidad. **ISO/IEC 27001:2022** aporta controles A.5.19–A.5.22 sobre seguridad en la cadena de suministro TIC. **CIS Controls v8** (Control 16: Application Software Security) y **NIST SP 800-218 (SSDF)** guían la verificación de artefactos. **SLSA** (Supply-chain Levels for Software Artifacts) propone niveles de procedencia verificable que la industria está adaptando a modelos (ML-BOM, CycloneDX ML).

Las **model cards** (Mitchell et al., 2019) son documentación estructurada que describe uso previsto, datos de entrenamiento, métricas de evaluación desagregadas, limitaciones y consideraciones éticas. Se complementan con **datasheets for datasets** (Gebru et al.) y **system cards**. Herramientas como `model-card-toolkit` de Google y los campos de Hugging Face (`model-index`, `eval-results`) permiten su publicación automatizada. Un model card robusto debe incluir: huella del modelo (hash SHA-256), procedencia de datos, licencias, dependencias, resultados de red-teaming y política de divulgación de vulnerabilidades.

La defensa práctica requiere: (1) **SBOM/ML-BOM** con CycloneDX o SPDX; (2) verificación de firmas con Sigstore/cosign; (3) escaneo con herramientas como `modelscan`, `picklescan` y `garak`; (4) aislamiento en sandboxes al cargar pesos no confiables; (5) pinning de revisiones (commit hash) en lugar de `main`; (6) monitorización de deriva y comportamiento anómalo en producción. La cadena de suministro de LLM no es solo un problema de software: es un problema de **confianza verificable** en artefactos opacos.

## EJERCICIO

**Objetivo:** Auditar la cadena de suministro de un modelo open-source y producir una model card de seguridad.

**Pasos:**

1. **Selección:** Elige un modelo de Hugging Face con >1M descargas (p. ej. `mistralai/Mistral-7B-Instruct-v0.2` o `meta-llama/Llama-3-8B-Instruct`).
2. **Reconocimiento de artefactos:** Lista todos los archivos del repo (`git lfs ls-files`). Identifica formatos: `.safetensors`, `.bin`, `.gguf`, `.onnx`. Marca cualquier `.bin`/`.pt` como riesgo potencial.
3. **Escaneo de seguridad:**
   - Instala `pip install modelscan picklescan`.
   - Ejecuta `modelscan -p ./model_dir` y `picklescan -p ./model_dir`.
   - Documenta hallazgos (códigos de ejecución, imports sospechosos).
4. **Verificación de procedencia:** Comprueba si el repo tiene firma Sigstore o commit firmado (`git log --show-signature`). Registra el hash SHA-256 de los pesos con `sha256sum`.
5. **Análisis de dependencias:** Genera un ML-BOM con `cyclonedx-py` o manualmente en formato CycloneDX JSON incluyendo: modelo, datasets referenciados, librerías (`transformers`, `torch`), licencias.
6. **Model card de seguridad:** Redacta un documento Markdown con secciones: Uso previsto, Fuera de alcance, Datos de entrenamiento (fuente y licencia), Evaluaciones de seguridad (jailbreaks probados con `garak`), Limitaciones conocidas, Procedencia (hash + commit), Contacto de seguridad.
7. **Prueba adversarial básica:** Ejecuta `garak --model_type huggingface --model_name <modelo> --probes promptinject,dan` y adjunta resultados resumidos.
8. **Entrega:** Repositorio Git con `model_card.md`, `ml-bom.json`, `scan-report.txt` y `README.md` explicando decisiones.

**Criterios de éxito:** Identificar al menos 2 riesgos de cadena de suministro, proponer mitigaciones concretas y publicar una model card que cumpla los campos de Mitchell et al. + NIST AI RMF.

## CASO

**Caso: modelos envenenados en Hugging Face (2024) — "PoisonGPT" y variantes.**

En 2024, investigadores de HiddenLayer demostraron **PoisonGPT**: publicaron en Hugging Face un modelo basado en GPT-J modificado quirúrgicamente para insertar desinformación (afirmar que el presidente de EE. UU. era alguien fallecido) sin degradar métricas de benchmark estándar. El modelo pasó desapercibido porque las evaluaciones convencionales no detectan backdoors semánticos. El ataque explota el eslabón de **publicación de pesos**: cualquiera puede subir un modelo con nombre atractivo y los pipelines de terceros lo consumen sin verificación.

Paralelamente, el equipo de JFrog detectó en 2024 más de 100 modelos en Hugging Face con **payloads de ejecución remota** embebidos en archivos pickle, aprovechando que muchos usuarios cargan `.bin` con `torch.load()` sin `weights_only=True`. Estos ataques encajan en **MITRE ATLAS AML.T0010.001 (ML Supply Chain Compromise: ML Artifacts)** y **AML.T0058 (Publish Poisoned Models)**. También se han documentado typosquatting en nombres de modelos (`meta-llama` vs `meta-llamaa`) y datasets envenenados en repositorios de instrucciones.

**Lecciones:** (1) la popularidad no equivale a seguridad; (2) los benchmarks no detectan backdoors; (3) el formato importa (pickle = RCE); (4) la verificación de firmas y hashes es obligatoria; (5) las model cards deben declarar procedencia y limitaciones. Empresas como Microsoft y Google ya exigen ML-BOM y firma de artefactos en sus pipelines internos, alineándose con **NIST SSDF** y **SLSA nivel 3**. El caso demuestra que la cadena de suministro de LLM es hoy tan crítica como la de software tradicional, pero con menor madurez en controles.

## Recursos abiertos
- OWASP Top 10 for LLM Applications: https://genai.owasp.org/llm-top-10/
- MITRE ATLAS (Adversarial Threat Landscape for AI Systems): https://atlas.mitre.org/
- NIST AI Risk Management Framework (AI 100-1): https://www.nist.gov/itl/ai-risk-management-framework
- Model Cards for Model Reporting (Mitchell et al., 2019): https://arxiv.org/abs/1810.03993
- CycloneDX ML-BOM: https://cyclonedx.org/capabilities/mlbom/
- Herramienta ModelScan (Protect AI): https://github.com/protectai/modelscan
- Hugging Face Safetensors: https://github.com/huggingface/safetensors

--- [Volver al syllabus](../syllabus.md)
