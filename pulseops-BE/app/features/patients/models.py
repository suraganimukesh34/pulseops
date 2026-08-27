from sqlalchemy import Column, Integer, String

from app.core.db import Base


class Patient(Base):
    __tablename__ = "patients"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    department = Column(String, nullable=False)
    ward = Column(String, nullable=False)
    bed = Column(String, nullable=False)
    status = Column(String, nullable=False)
    priority = Column(String, nullable=False)
    admission_date = Column(String, nullable=True)
    expected_discharge_date = Column(String, nullable=True)
    attending_doctor = Column(String, nullable=True)
    diagnosis = Column(String, nullable=True)
    symptoms = Column(String, nullable=True)
    contact_number = Column(String, nullable=True)
    blood_group = Column(String, nullable=True)
