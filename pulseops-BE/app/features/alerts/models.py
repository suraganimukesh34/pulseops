from sqlalchemy import Boolean, Column, String

from app.core.db import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True)
    severity = Column(String, nullable=False)
    category = Column(String, nullable=False)
    message = Column(String, nullable=False)
    source = Column(String, nullable=False)
    department_id = Column(String, nullable=True)
    timestamp = Column(String, nullable=False)
    acknowledged = Column(Boolean, nullable=False, default=False)
    acknowledged_by = Column(String, nullable=True)
