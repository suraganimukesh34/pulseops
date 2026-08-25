from pydantic import BaseModel

from app.core.security import Role


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: Role
    staff_id: str | None = None
    active: bool = True
