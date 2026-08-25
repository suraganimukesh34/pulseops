from app.core.security import create_access_token, verify_password
from app.features.auth.schemas import LoginRequest
from app.features.users.service import UserRecord, find_user_by_email


def authenticate_user(login: LoginRequest) -> UserRecord | None:
    """Authenticate the user and return their user record."""

    user = find_user_by_email(login.email)

    if user is None or not user.active:
        return None

    if not verify_password(login.password, user.hashed_password):
        return None

    return user


def login_user(login: LoginRequest) -> str:
    """Authenticate the user and create an access token."""

    user = authenticate_user(login)

    if user is None:
        raise ValueError("Invalid email or password")

    return create_access_token(
        {
            "sub": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role.value,
        }
    )
