from pydantic import BaseModel


class HospitalProfile(BaseModel):
    hospital_name: str
    address: str
    phone: str
    email: str
    timezone: str

    # Branding / appearance — admin-configurable, consumed by the frontend
    # to theme the sidenav, login page, and browser tab without a redeploy.
    app_name: str = "PulseOps AI"
    logo_icon: str = "monitor_heart"
    accent_color: str = "#0d9488"
