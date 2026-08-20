import os
from datetime import datetime, timedelta, timezone

import jwt
from app.features.auth.schemas import LoginRequest
from dotenv import load_dotenv
from pwdlib import PasswordHash

load_dotenv()

password_hash = PasswordHash.recommended()

SECRET_KEY = os.getenv("JWT_SECRET_KEY")

if not SECRET_KEY:
    raise RuntimeError("JWT_SECRET_KEY environment variable is not set")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def hash_password(password: str) -> str:
    """Hash a plain-text password."""
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    """Verify a plain-text password against its hash."""
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(
    data: dict,
    expires_delta: timedelta | None = None,
) -> str:
    """Create a signed JWT access token."""

    payload = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    payload.update({"exp": expire})

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )


# Temporary development user.
# This will later be replaced by PostgreSQL.
TEMP_USER = {
    "email": os.getenv(
        "DEV_ADMIN_EMAIL",
        "admin@pulseops.ai",
    ),
    "hashed_password": hash_password(
        os.getenv(
            "DEV_ADMIN_PASSWORD",
            "Admin@123",
        )
    ),
}


def authenticate_user(login: LoginRequest) -> str | None:
    """Authenticate the user and return their email."""

    if login.email != TEMP_USER["email"]:
        return None

    if not verify_password(
        login.password,
        TEMP_USER["hashed_password"],
    ):
        return None

    return TEMP_USER["email"]


def login_user(login: LoginRequest) -> str:
    """Authenticate the user and create an access token."""

    user_email = authenticate_user(login)

    if user_email is None:
        raise ValueError("Invalid email or password")

    return create_access_token(
        {
            "sub": user_email,
        }
    )
