from typing import Annotated

from app.core.security import CurrentUser, get_current_user
from app.features.auth.schemas import LoginRequest, TokenResponse
from app.features.auth.service import login_user
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(prefix="/auth", tags=["Authenticated"])


@router.get("/me", response_model=CurrentUser)
def get_me(current_user: Annotated[CurrentUser, Depends(get_current_user)]):
    return current_user


@router.post(
    "/login",
    response_model=TokenResponse,
)
def login(login_request: LoginRequest) -> TokenResponse:
    """Authenticate a user and return a JWT access token."""

    try:
        access_token = login_user(login_request)

        return TokenResponse(access_token=access_token)

    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
