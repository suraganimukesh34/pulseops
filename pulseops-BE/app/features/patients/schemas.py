from pydantic import BaseModel


class PatientCreate(BaseModel):
    name: str
    department: str
    ward: str
    bed: str
    status: str
    priority: str


class PatientResponse(BaseModel):
    id: str
    name: str
    department: str
    ward: str
    bed: str
    status: str
    priority: str
