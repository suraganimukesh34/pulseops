from app.core.security import CurrentUser, get_current_user
from app.features.ai.schemas import AIInsightsResponse, AIStatusResponse
from app.features.ai.service import get_ai_insights, get_ai_status
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/ai", tags=["AI (Preview)"])


@router.get("/status", response_model=AIStatusResponse)
def status(current_user: CurrentUser = Depends(get_current_user)):
    return get_ai_status()


@router.get("/insights", response_model=AIInsightsResponse)
def insights(current_user: CurrentUser = Depends(get_current_user)):
    return get_ai_insights()
