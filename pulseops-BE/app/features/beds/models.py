from sqlalchemy import Column, String

from app.core.db import Base


class Bed(Base):
    __tablename__ = "beds"

    id = Column(String, primary_key=True)
    department_id = Column(String, nullable=False)
    bed_number = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Available")
    patient_id = Column(String, nullable=True)
    admitted_date = Column(String, nullable=True)
