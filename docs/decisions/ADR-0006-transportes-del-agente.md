# ADR-0006 · Agente local por defecto, proveedor opcional con allowlist

- **Estado:** aceptado (2026-10-11)
- **Contexto:** el encargo pide «agente de IA integrado» y máximo anonimato; un LLM remoto envía la pregunta a un
  tercero.
- **Decisión:** el motor corre en el dispositivo (recuperación + composición extractiva). El transporte a un LLM
  (`Ollama` local o compatible con OpenAI) es **opcional**, se activa por variables de entorno y sólo se permite
  contra `localhost` o hosts declarados en `SECURE_T_LLM_ALLOW_HOSTS`.
- **Por qué:** la privacidad por diseño es una promesa del repositorio; además, sin red el campus sigue
  funcionando. La allowlist cierra el riesgo de SSRF si alguien configura mal la URL.
- **Alternativas descartadas:** llamar a una API pública por defecto (rompe P6 y el funcionamiento sin conexión);
  embeddings externos (mismo problema y coste).
- **Consecuencias:** si el proveedor falla, se responde con el motor local y se avisa (`provider:fallback:<motivo>`);
  la auditoría no registra la clave ni la pregunta.
