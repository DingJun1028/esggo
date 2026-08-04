from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# out_root 預設: hlpf-poc-pipeline/out (parent.parent = hlpf-poc-pipeline)
DEFAULT_OUT_ROOT = Path(__file__).resolve().parent.parent / "out"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")
    app_env: str = "dev"
    out_root: Path = DEFAULT_OUT_ROOT
    tts_provider: str = "edge"
    elevenlabs_api_key: str | None = None
    atlascloud_api_key: str | None = None
    # B-roll provider: "poster" (default, no key) | "runway" | "heygen"
    broll_provider: str = "poster"
    runway_api_key: str | None = None
    runway_model: str = "gen4_turbo"
    heygen_api_key: str | None = None
    heygen_avatar_id: str = ""
    heygen_voice_id: str = ""
    host: str = "127.0.0.1"
    port: int = 8082


settings = Settings()
settings.out_root.mkdir(parents=True, exist_ok=True)


def feature_summary() -> dict:
    return {
        "tts": settings.tts_provider,
        "out_root": str(settings.out_root),
        "app_env": settings.app_env,
    }
