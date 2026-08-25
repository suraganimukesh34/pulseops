from pydantic import BaseModel


class DepartmentCreate(BaseModel):
    name: str
    floor: int
    head_doctor_id: str | None = None
    head_doctor_name: str | None = None
    bed_capacity: int
    status: str = "Active"


class DepartmentUpdate(DepartmentCreate):
    pass


class DepartmentResponse(DepartmentCreate):
    id: str
