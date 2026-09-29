from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    commerce_api_url: str
    internal_api_key: str

    openai_api_key: str
    openai_model: str
    openai_embedding_model: str

    redis_url: str = "redis://redis:6379/0"
    celery_broker_url: str = "redis://redis:6379/1"
    celery_result_backend: str = "redis://redis:6379/2"

    class Config:
        env_file = ".env"


settings = Settings()
