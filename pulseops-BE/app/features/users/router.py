from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.security import CurrentUser, Role, require_role
from app.features.users.schemas import UserResponse
from app.features.users.service import get_users

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("", response_model=list[UserResponse])
def list_users(
    current_user: Annotated[CurrentUser, Depends(require_role(Role.ADMIN))],
):
    return get_users()
