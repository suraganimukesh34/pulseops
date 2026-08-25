from pydantic import BaseModel


class HospitalProfile(BaseModel):
    hospital_name: str
    address: str
    phone: str
    email: str
    timezone: str
