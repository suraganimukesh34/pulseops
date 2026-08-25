from dataclasses import dataclass

from app.core.config import settings
from app.core.security import Role, hash_password
from app.features.users.schemas import UserResponse


@dataclass
class UserRecord:
    id: str
    name: str
    email: str
    hashed_password: str
    role: Role
    staff_id: str | None = None
    active: bool = True


USERS: list[UserRecord] = [
    UserRecord(
        id="U1",
        name="System Administrator",
        email=settings.dev_admin_email,
        hashed_password=hash_password(settings.dev_admin_password),
        role=Role.ADMIN,
    ),
    UserRecord(
        id="U2",
        name="Dr. Sarah Smith",
        email="doctor1@pulseops.ai",
        hashed_password=hash_password("Doctor@123"),
        role=Role.DOCTOR,
        staff_id="S101",
    ),
    UserRecord(
        id="U3",
        name="Dr. Daniel Thomas",
        email="doctor2@pulseops.ai",
        hashed_password=hash_password("Doctor@123"),
        role=Role.DOCTOR,
        staff_id="S106",
    ),
    UserRecord(
        id="U4",
        name="Karen White",
        email="nurse1@pulseops.ai",
        hashed_password=hash_password("Nurse@123"),
        role=Role.NURSE,
        staff_id="S111",
    ),
    UserRecord(
        id="U5",
        name="Front Desk",
        email="frontdesk@pulseops.ai",
        hashed_password=hash_password("Reception@123"),
        role=Role.RECEPTIONIST,
    ),
]


def get_users() -> list[UserResponse]:
    return [
        UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            role=user.role,
            staff_id=user.staff_id,
            active=user.active,
        )
        for user in USERS
    ]


def find_user_by_email(email: str) -> UserRecord | None:
    return next((user for user in USERS if user.email == email), None)
