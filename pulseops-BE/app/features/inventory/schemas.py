from pydantic import BaseModel


class InventoryItemCreate(BaseModel):
    name: str
    category: str  # Medicine | Equipment | Supply
    quantity: int
    unit: str
    reorder_level: int
    expiry_date: str | None = None
    supplier: str


class InventoryItemUpdate(InventoryItemCreate):
    pass


class InventoryItemResponse(InventoryItemCreate):
    id: str


class RestockRequest(BaseModel):
    quantity: int
