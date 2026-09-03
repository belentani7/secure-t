from pydantic_settings import BaseSettings


class S(BaseSettings):
    LLM_BASE_URL: str = "http://localhost:11434"
    LLM_MODEL: str = "qwen2.5:7b"
    LLM_KEY: str = ""
    TTS_ENGINE: str = "edge"
    PIPER_BIN: str = "piper"
    OUT_DIR: str = "out"
    S3_BUCKET: str = ""
    S3_KEY: str = ""
    S3_SECRET: str = ""
    S3_ENDPOINT: str = ""
    WORKERS: int = 8


S = S()
VOICES = {"es": "es-ES-ElviraNeural", "en": "en-US-JennyNeural", "pt": "pt-BR-FranciscaNeural"}
# Paleta Belentani unificada (ver open-school/shared/BELENTANI-DESIGN-SYSTEM.md)
BRAND = {
    "lime": (168, 255, 62),
    "cyan": (56, 225, 255),
    "coral": (234, 100, 75),
    "bg": (7, 13, 24),
    "ink": (14, 32, 53),
    "paper": (243, 239, 231),
}
