from pydantic import BaseModel, ConfigDict


class AppointmentCreate(BaseModel):
    patient_id: str
    patient_name: str
    doctor_id: str
    doctor_name: str
    department_id: str
    date: str
    time: str
    status: str = "Scheduled"  # Scheduled | Completed | Cancelled | No-show
    reason: str
    notes: str | None = None


class AppointmentUpdate(AppointmentCreate):
    pass


class AppointmentResponse(AppointmentCreate):
    id: str

    model_config = ConfigDict(from_attributes=True)
