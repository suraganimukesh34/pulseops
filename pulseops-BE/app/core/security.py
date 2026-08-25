from datetime import datetime, timedelta, timezone
from enum import Enum
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pwdlib import PasswordHash
from pydantic import BaseModel

from app.core.config import settings

password_hash = PasswordHash.recommended()
security = HTTPBearer()


class Role(str, Enum):
    ADMIN = "Admin"
    DOCTOR = "Doctor"
    NURSE = "Nurse"
    RECEPTIONIST = "Receptionist"


class CurrentUser(BaseModel):
    id: str
    email: str
    name: str
    role: Role


def hash_password(password: str) -> str:
    """Hash a plain-text password."""
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against its hash."""
    return password_hash.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    """Create a signed JWT access token."""

    payload = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.access_token_expire_minutes
        )

    payload.update({"exp": expire})

    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(security)],
) -> CurrentUser:
    """Validate the JWT token and return the authenticated user's profile."""

    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm],
        )

        user_id = payload.get("sub")
        email = payload.get("email")
        name = payload.get("name")
        role = payload.get("role")

        if not user_id or not email or not role:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Authentication token",
            )

        return CurrentUser(id=user_id, email=email, name=name or email, role=Role(role))

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token has expired",
        )

    except (jwt.InvalidTokenError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authentication token",
        )


def require_role(*roles: Role):
    """Dependency factory that restricts a route to the given roles."""

    def checker(
        current_user: Annotated[CurrentUser, Depends(get_current_user)],
    ) -> CurrentUser:
        if current_user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to perform this action",
            )
        return current_user

    return checker
