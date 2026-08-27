from sqlalchemy import Boolean, Column, Enum as SQLEnum, String

from app.core.db import Base
from app.core.security import Role


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=False)
    role = Column(SQLEnum(Role), nullable=False)
    staff_id = Column(String, nullable=True)
    active = Column(Boolean, nullable=False, default=True)
