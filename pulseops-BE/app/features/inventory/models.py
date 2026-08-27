from sqlalchemy import Column, Integer, String

from app.core.db import Base


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=False)
    quantity = Column(Integer, nullable=False)
    unit = Column(String, nullable=False)
    reorder_level = Column(Integer, nullable=False)
    expiry_date = Column(String, nullable=True)
    supplier = Column(String, nullable=False)
