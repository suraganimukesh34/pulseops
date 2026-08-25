from pydantic import BaseModel


class StaffCreate(BaseModel):
    name: str
    role: str  # Doctor | Nurse | Technician | Admin
    department_id: str
    specialization: str | None = None
    shift: str  # Morning | Evening | Night
    status: str  # On Duty | Off Duty | On Leave
    email: str
    phone: str
    joined_date: str


class StaffUpdate(StaffCreate):
    pass


class StaffResponse(StaffCreate):
    id: str
