import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    jwt_secret_key: str = os.getenv("JWT_SECRET_KEY", "")
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    dev_admin_email: str = os.getenv("DEV_ADMIN_EMAIL", "admin@pulseops.ai")
    dev_admin_password: str = os.getenv("DEV_ADMIN_PASSWORD", "Admin@123")

    cors_allow_origins: list[str] = ["http://localhost:4200"]


settings = Settings()

if not settings.jwt_secret_key:
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")
