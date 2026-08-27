from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user
from app.features.alerts.schemas import AlertCreate, AlertResponse, AlertUpdate
from app.features.alerts.service import (
    acknowledge_alert,
    create_alert,
    delete_alert,
    get_alert_by_id,
    get_alerts,
    update_alert,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=list[AlertResponse])
def list_alerts(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_alerts(db)


@router.post("", response_model=AlertResponse, status_code=201)
def add_alert(
    alert: AlertCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return create_alert(db, alert)


@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    alert = get_alert_by_id(db, alert_id)

    if alert is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return alert


@router.put("/{alert_id}", response_model=AlertResponse)
def edit_alert(
    alert_id: str,
    alert: AlertUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = update_alert(db, alert_id, alert)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return updated


@router.post("/{alert_id}/acknowledge", response_model=AlertResponse)
def acknowledge(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = acknowledge_alert(db, alert_id, current_user.name)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return updated


@router.delete("/{alert_id}", response_model=AlertResponse)
def remove_alert(
    alert_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    deleted = delete_alert(db, alert_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return deleted
