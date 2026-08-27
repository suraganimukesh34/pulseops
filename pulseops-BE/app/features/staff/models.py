from sqlalchemy import Column, String

from app.core.db import Base


class Staff(Base):
    __tablename__ = "staff"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    department_id = Column(String, nullable=False)
    specialization = Column(String, nullable=True)
    shift = Column(String, nullable=False)
    status = Column(String, nullable=False)
    email = Column(String, nullable=False)
    phone = Column(String, nullable=False)
    joined_date = Column(String, nullable=False)
