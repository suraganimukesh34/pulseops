from app.core.security import CurrentUser, Role, get_current_user, require_role
from app.features.settings.schemas import HospitalProfile
from app.features.settings.service import get_hospital_profile, update_hospital_profile
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/hospital-profile", response_model=HospitalProfile)
def get_profile(current_user: CurrentUser = Depends(get_current_user)):
    return get_hospital_profile()


@router.put("/hospital-profile", response_model=HospitalProfile)
def edit_profile(
    profile: HospitalProfile,
    current_user: CurrentUser = Depends(require_role(Role.ADMIN)),
):
    return update_hospital_profile(profile)
