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

router = APIRouter(prefix="/alerts", tags=["Alerts"])


@router.get("", response_model=list[AlertResponse])
def list_alerts(current_user: CurrentUser = Depends(get_current_user)):
    return get_alerts()


@router.post("", response_model=AlertResponse, status_code=201)
def add_alert(alert: AlertCreate, current_user: CurrentUser = Depends(get_current_user)):
    return create_alert(alert)


@router.get("/{alert_id}", response_model=AlertResponse)
def get_alert(alert_id: str, current_user: CurrentUser = Depends(get_current_user)):
    alert = get_alert_by_id(alert_id)

    if alert is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return alert


@router.put("/{alert_id}", response_model=AlertResponse)
def edit_alert(
    alert_id: str, alert: AlertUpdate, current_user: CurrentUser = Depends(get_current_user)
):
    updated = update_alert(alert_id, alert)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return updated


@router.post("/{alert_id}/acknowledge", response_model=AlertResponse)
def acknowledge(alert_id: str, current_user: CurrentUser = Depends(get_current_user)):
    updated = acknowledge_alert(alert_id, current_user.name)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return updated


@router.delete("/{alert_id}", response_model=AlertResponse)
def remove_alert(alert_id: str, current_user: CurrentUser = Depends(get_current_user)):
    deleted = delete_alert(alert_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alert not found")

    return deleted
