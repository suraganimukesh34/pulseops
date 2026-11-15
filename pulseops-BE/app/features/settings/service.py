from app.features.settings.schemas import HospitalProfile

hospital_profile = HospitalProfile(
    hospital_name="PulseOps Multispeciality Hospital",
    address="Indiranagar, Bengaluru, Karnataka 560038, India",
    phone="+91 80 4000 1200",
    email="contact@pulseops.example",
    timezone="Asia/Kolkata",
    app_name="PulseOps AI",
    logo_icon="monitor_heart",
    accent_color="#0d9488",
)


def get_hospital_profile() -> HospitalProfile:
    return hospital_profile


def update_hospital_profile(profile: HospitalProfile) -> HospitalProfile:
    global hospital_profile
    hospital_profile = profile
    return hospital_profile
