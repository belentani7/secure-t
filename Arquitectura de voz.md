# Arquitectura de voz

La voz es un servicio independiente del chat. Se define `VoiceProvider` con `synthesize(text, language, voice, settings)` y proveedores intercambiables para Kokoro, Chatterbox y futuros motores.

Los idiomas iniciales son español, portugués e inglés. La producción debe soportar streaming cuando sea viable, caché de audio, cola asíncrona, ajustes de voz, consentimiento explícito, indicador de voz sintética y alternativa escrita.

Kokoro es atractivo por tamaño y eficiencia. Chatterbox se evaluará por expresividad, idiomas y licencia del modelo concreto. No se decide proveedor definitivo sin pruebas de latencia, calidad, coste, licencia y hardware.

[1]: https://github.com/resemble-ai/chatterbox "Chatterbox"
[2]: https://huggingface.co/hexgrad/Kokoro-82M "Kokoro-82M"
