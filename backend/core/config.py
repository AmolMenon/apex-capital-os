from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator
from typing import Optional

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_MODE: str = "mock"
    APEX_LLM_MODE: str = "test"  # live or test
    ENABLE_REAL_LLM: bool = False
    
    # Decoupled Provider Configuration
    APEX_EXTRACTION_PROVIDER: str = "gemini"
    APEX_EXTRACTION_MODEL: str = "gemini-2.5-flash"
    
    APEX_REASONING_PROVIDER: str = "gemini"
    APEX_REASONING_MODEL: str = "gemini-2.5-flash"
    
    APEX_SYNTHESIS_PROVIDER: str = "gemini"
    APEX_SYNTHESIS_MODEL: str = "gemini-2.5-flash"
    
    APEX_GRADER_PROVIDER: str = "gemini"
    APEX_GRADER_MODEL: str = "gemini-2.5-flash"

    # Safety Controls
    MAX_TOKENS_EXTRACTION: int = 8000
    MAX_TOKENS_AGENT: int = 16000
    MAX_TOKENS_CHALLENGE: int = 16000
    MAX_TOKENS_SYNTHESIS: int = 32000
    
    MAX_COST_PER_CASE: float = 5.0
    MAX_COST_PER_PILOT: float = 20.0

    DATABASE_URL: str = "sqlite:///./apex_capital.db"
    TEST_DATABASE_URL: str = "sqlite:///./test_apex_capital.db"

    CORS_ORIGINS: str = "*"

    JWT_SECRET_KEY: str = "change_me"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    ENABLE_AUTH: bool = False
    ENABLE_WORKSPACES: bool = False

    FILE_STORAGE_PROVIDER: str = "local"
    LOCAL_UPLOAD_DIR: str = "./data/uploads"
    S3_BUCKET: Optional[str] = None
    S3_REGION: Optional[str] = None
    S3_ACCESS_KEY_ID: Optional[str] = None
    S3_SECRET_ACCESS_KEY: Optional[str] = None

    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-pro"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    ANTHROPIC_API_KEY: Optional[str] = None
    ANTHROPIC_MODEL: str = "claude-3-5-sonnet-latest"

    RATE_LIMIT_ENABLED: bool = True
    RATE_LIMIT_PER_MINUTE: int = 600

    LOG_LEVEL: str = "INFO"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @model_validator(mode='after')
    def fix_postgres_url(self) -> 'Settings':
        if self.DATABASE_URL and self.DATABASE_URL.startswith("postgres://"):
            self.DATABASE_URL = self.DATABASE_URL.replace("postgres://", "postgresql://", 1)
        return self
        
    @model_validator(mode='after')
    def validate_staging_production(self) -> 'Settings':
        if self.APP_ENV in ["staging", "production"]:
            if not self.ENABLE_AUTH:
                raise ValueError("ENABLE_AUTH must be True in staging/production")
            if not self.ENABLE_WORKSPACES:
                raise ValueError("ENABLE_WORKSPACES must be True in staging/production")
            if self.CORS_ORIGINS == "*":
                raise ValueError("CORS_ORIGINS cannot be '*' in staging/production")
            if self.JWT_SECRET_KEY == "change_me":
                raise ValueError("JWT_SECRET_KEY must be changed in staging/production")
        return self

settings = Settings()
