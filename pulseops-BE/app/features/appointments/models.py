from sqlalchemy import Column, String

from app.core.db import Base


class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(String, primary_key=True)
    patient_id = Column(String, nullable=False)
    patient_name = Column(String, nullable=False)
    doctor_id = Column(String, nullable=False)
    doctor_name = Column(String, nullable=False)
    department_id = Column(String, nullable=False)
    date = Column(String, nullable=False)
    time = Column(String, nullable=False)
    status = Column(String, nullable=False, default="Scheduled")
    reason = Column(String, nullable=False)
    notes = Column(String, nullable=True)
