from app.core.security import CurrentUser, Role, require_role
from app.features.settings.schemas import HospitalProfile
from app.features.settings.service import get_hospital_profile, update_hospital_profile
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/hospital-profile", response_model=HospitalProfile)
def get_profile():
    # Public on purpose: the login page needs app_name/logo_icon/accent_color
    # before a user is authenticated. Nothing in this payload is sensitive.
    return get_hospital_profile()


@router.put("/hospital-profile", response_model=HospitalProfile)
def edit_profile(
    profile: HospitalProfile,
    current_user: CurrentUser = Depends(require_role(Role.ADMIN)),
):
    return update_hospital_profile(profile)
