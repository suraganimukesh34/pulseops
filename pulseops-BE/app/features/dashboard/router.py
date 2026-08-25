from app.core.security import CurrentUser, get_current_user
from app.features.dashboard.schemas import DashboardSummary
from app.features.dashboard.service import get_dashboard_summary
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary", response_model=DashboardSummary)
def summary(current_user: CurrentUser = Depends(get_current_user)):
    return get_dashboard_summary()
