from pydantic import BaseModel


class BedCreate(BaseModel):
    department_id: str
    bed_number: str
    status: str = "Available"  # Available | Occupied | Cleaning | Maintenance
    patient_id: str | None = None
    admitted_date: str | None = None


class BedUpdate(BedCreate):
    pass


class BedResponse(BedCreate):
    id: str


class BedAdmitRequest(BaseModel):
    patient_id: str
    admitted_date: str
