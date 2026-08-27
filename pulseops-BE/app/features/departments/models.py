from app.core.db import Base
from sqlalchemy import Column, Integer, String


class Department(Base):
    __tablename__ = "departments"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    floor = Column(Integer, nullable=False)
    head_doctor_id = Column(String, nullable=True)
    head_doctor_name = Column(String, nullable=True)
    bed_capacity = Column(Integer, nullable=False)
    status = Column(String, nullable=False, default="Active")
