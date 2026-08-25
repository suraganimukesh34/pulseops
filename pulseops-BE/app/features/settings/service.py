from app.features.settings.schemas import HospitalProfile

hospital_profile = HospitalProfile(
    hospital_name="PulseOps General Hospital",
    address="1200 Wellness Avenue, Springfield",
    phone="+1 555-010-2000",
    email="contact@pulseops.ai",
    timezone="America/Chicago",
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
