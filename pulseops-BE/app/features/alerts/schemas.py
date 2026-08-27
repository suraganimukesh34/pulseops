from pydantic import BaseModel, ConfigDict


class AlertCreate(BaseModel):
    severity: str  # Critical | Warning | Info
    category: str  # Patient | Equipment | Staff | System | Inventory
    message: str
    source: str
    department_id: str | None = None
    timestamp: str
    acknowledged: bool = False
    acknowledged_by: str | None = None


class AlertUpdate(AlertCreate):
    pass


class AlertResponse(AlertCreate):
    id: str

    model_config = ConfigDict(from_attributes=True)
