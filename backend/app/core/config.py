from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./ecommerce.db"
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # bKash Configuration
    BKASH_PERSONAL_NUMBER: str = "+88018888888888"
    DELIVERY_FEE_INSIDE_DHAKA: float = 80.0
    DELIVERY_FEE_OUTSIDE_DHAKA: float = 150.0
    
    # Upload Configuration
    UPLOAD_DIR: str = "uploads"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()