from pydantic import BaseModel, ConfigDict


class AIPatientSummaryResponse(BaseModel):
    patient_id: str
    patient_summary: str


class PatientCreate(BaseModel):
    name: str
    age: int
    gender: str

    department: str
    ward: str
    bed: str

    status: str
    priority: str

    admission_date: str | None = None
    expected_discharge_date: str | None = None
    attending_doctor: str | None = None
    diagnosis: str | None = None
    symptoms: str | None = None
    contact_number: str | None = None
    blood_group: str | None = None


class PatientUpdate(BaseModel):
    name: str
    age: int
    gender: str

    department: str
    ward: str
    bed: str

    status: str
    priority: str

    admission_date: str | None = None
    expected_discharge_date: str | None = None
    attending_doctor: str | None = None
    diagnosis: str | None = None
    symptoms: str | None = None
    contact_number: str | None = None
    blood_group: str | None = None


class PatientResponse(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    department: str
    ward: str
    bed: str
    status: str
    priority: str
    admission_date: str
    expected_discharge_date: str
    attending_doctor: str
    diagnosis: str
    symptoms: str
    contact_number: str
    blood_group: str

    model_config = ConfigDict(from_attributes=True)
