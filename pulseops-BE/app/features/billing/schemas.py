from pydantic import BaseModel


class InvoiceItem(BaseModel):
    description: str
    amount: float


class InvoiceCreate(BaseModel):
    patient_id: str
    patient_name: str
    items: list[InvoiceItem]
    status: str = "Pending"  # Paid | Pending | Overdue
    issued_date: str
    due_date: str


class InvoiceUpdate(InvoiceCreate):
    pass


class InvoiceResponse(InvoiceCreate):
    id: str
    total_amount: float
