from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user
from app.features.ai.schemas import (
    AIInsightsResponse,
    AIStatusResponse,
    ChatRequest,
    ChatResponse,
)
from app.features.ai.service import (
    ask_copilot,
    ask_copilot_stream,
    get_ai_insights,
    get_ai_status,
)
from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/ai", tags=["AI (Preview)"])


@router.get("/status", response_model=AIStatusResponse)
def status(current_user: CurrentUser = Depends(get_current_user)):
    return get_ai_status()


@router.get("/insights", response_model=AIInsightsResponse)
def insights(current_user: CurrentUser = Depends(get_current_user)):
    return get_ai_insights()


@router.post("/chat", response_model=ChatResponse)
def chat(body: ChatRequest, current_user: CurrentUser = Depends(get_current_user)):
    return ChatResponse(reply=ask_copilot(body.message))


@router.post("/chat/stream")
def stream(
    message: str,
    session_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return StreamingResponse(
        ask_copilot_stream(db, session_id, message), media_type="text/plain"
    )
