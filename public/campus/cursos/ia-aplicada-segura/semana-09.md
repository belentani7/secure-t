# Semana 9: ML que preserva privacidad

Curso: [Inteligencia Artificial Aplicada y Segura](../syllabus.md) · Semana 9 de 20

## Objetivo de la semana
Comprender los fundamentos y técnicas del aprendizaje automático que preserva la privacidad (Privacy-Preserving Machine Learning, PPML), incluyendo entrenamiento federado, privacidad diferencial, cifrado homomórfico y aprendizaje seguro multi-parte. El estudiante será capaz de identificar amenazas de fuga de información en pipelines de ML y aplicar contramedidas alineadas con marcos como NIST Privacy Framework y OWASP Top 10 for LLM Applications.

## LECTURA
El ML que preserva privacidad aborda un problema crítico: los modelos entrenados con datos sensibles pueden memorizar y filtrar información personal, propiedad intelectual o secretos corporativos. Ataques como *membership inference*, *model inversion* y *gradient leakage* (documentados en MITRE ATLAS como AML.T0024 y AML.T0045) demuestran que incluso exponer solo las predicciones o gradientes de un modelo puede comprometer la privacidad del conjunto de entrenamiento. La defensa moderna se articula en varias capas. Primero, el **entrenamiento federado** (Federated Learning) permite que múltiples clientes entrenen un modelo global sin compartir datos crudos, agregando actualizaciones localmente; sin embargo, los gradientes pueden filtrar información, por lo que se combinan con **privacidad diferencial (DP)**, formalizada por Dwork et al., que añade ruido calibrado (mecanismos Laplace o Gaussian) garantizando (ε, δ)-diferencial privacy. Frameworks como **Opacus** (PyTorch) y **TensorFlow Privacy** implementan DP-SGD, mientras que **PySyft** y **Flower** habilitan federación segura. Otra técnica es el **cifrado homomórfico** (HE), que permite cómputo sobre datos cifrados, y el **aprendizaje seguro multi-parte** (SMPC), usado en proyectos como **OpenMined**. A nivel de estándares, el **NIST Privacy Framework** (NIST PF 1.0) guía la gestión de riesgos de privacidad, y el **NIST AI RMF** (AI 100-1) integra controles de privacidad en el ciclo de vida del modelo. **ISO/IEC 27001** y **27701** exigen controles de minimización y anonimización, mientras que **CIS Controls v8** (Control 3: Data Protection) recomienda clasificar y cifrar datos sensibles. En el contexto de LLMs, **OWASP Top 10 for LLM Applications** (LLM02: Insecure Output Handling, LLM06: Sensitive Information Disclosure) subraya la necesidad de filtrado y sanitización. Además, **MITRE ATLAS** documenta tácticas como *Exfiltration via ML Inference API* (AML.T0024) y *Backdoor ML Model* (AML.T0018), lo que obliga a implementar auditorías de privacidad, pruebas de fuga (membership inference attacks) y mecanismos de *unlearning* (derecho al olvido, GDPR Art. 17). La combinación de DP, federación, cifrado y gobernanza convierte al PPML en un pilar de la IA confiable y segura.

## EJERCICIO
**Objetivo:** Implementar un pipeline de entrenamiento federado con privacidad diferencial y evaluar la resistencia a un ataque de inferencia de membresía.

**Pasos:**
1. Instala dependencias: `pip install torch torchvision opacus flwr scikit-learn numpy`.
2. Descarga el dataset MNIST o CIFAR-10 (simulando datos distribuidos entre 5 clientes con `flwr.dataset.utils` o partición manual con `numpy.array_split`).
3. Implementa un modelo CNN simple en PyTorch y envuélvelo con **Opacus** (`PrivacyEngine`) usando DP-SGD con `noise_multiplier=1.0`, `max_grad_norm=1.0`, `target_epsilon=3.0`, `target_delta=1e-5`.
4. Configura un servidor federado con **Flower** (`fl.server.start_server`) y 5 clientes (`fl.client.NumPyClient`) que entrenen localmente 2 épocas por ronda durante 10 rondas.
5. Registra la pérdida y precisión global por ronda. Guarda el modelo final.
6. Implementa un ataque de *membership inference* básico: entrena un clasificador de sombra (shadow model) sobre datos auxiliares y mide la ventaja de ataque (attack advantage) sobre el modelo federado con y sin DP.
7. Compara resultados: sin DP (ε=∞) vs. con DP (ε=3). Documenta la caída de precisión y la reducción de la ventaja de ataque.
8. Entrega un notebook con gráficas de precisión vs. ε y un informe de 1 página explicando el *trade-off* privacidad-utilidad, citando NIST AI RMF y OWASP LLM06.

## CASO
**Caso real: fuga de datos en modelos de lenguaje médico (2023).** Investigadores demostraron que un LLM fine-tuneado con registros clínicos podía regurgitar nombres, fechas de nacimiento y diagnósticos de pacientes cuando se le solicitaban mediante *prompt injection* específicos. El incidente se alinea con **MITRE ATLAS AML.T0024** (Exfiltration via ML Inference API) y con **OWASP LLM06** (Sensitive Information Disclosure). El modelo había sido entrenado sin DP ni filtrado de salida, y los datos no estaban anonimizados correctamente según **ISO/IEC 27701**. Un atacante con acceso a la API pudo extraer información protegida por HIPAA y GDPR. La respuesta incluyó: (1) reentrenamiento con DP-SGD (ε=8), (2) implementación de un clasificador de salida para bloquear PII, (3) auditoría con *membership inference* para cuantificar el riesgo residual, y (4) adopción del **NIST AI RMF** para gobernanza continua. El caso subraya que la privacidad no es opcional en ML y que controles técnicos (DP, federación, cifrado) deben acompañarse de controles organizativos (CIS Control 3, ISO 27001 A.8.2.3).

## Recursos abiertos
- https://opacus.ai/ (documentación oficial de Opacus para DP-SGD en PyTorch)
- https://flower.dev/ (framework de aprendizaje federado, guías y ejemplos)
- https://atlas.mitre.org/ (MITRE ATLAS: tácticas y técnicas de ataques a ML)
- https://owasp.org/www-project-top-10-for-large-language-model-applications/ (OWASP Top 10 for LLM Applications)
- https://www.nist.gov/privacy-framework (NIST Privacy Framework 1.0)

--- [Volver al syllabus](../syllabus.md)
