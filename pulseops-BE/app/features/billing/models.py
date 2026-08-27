from sqlalchemy import JSON, Column, Float, String

from app.core.db import Base


class Invoice(Base):
    __tablename__ = "invoices"

    id = Column(String, primary_key=True)
    patient_id = Column(String, nullable=False)
    patient_name = Column(String, nullable=False)
    items = Column(JSON, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, nullable=False, default="Pending")
    issued_date = Column(String, nullable=False)
    due_date = Column(String, nullable=False)
