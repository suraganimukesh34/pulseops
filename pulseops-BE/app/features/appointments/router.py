from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user
from app.features.appointments.schemas import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)
from app.features.appointments.service import (
    create_appointment,
    delete_appointment,
    get_appointment_by_id,
    get_appointments,
    update_appointment,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/appointments", tags=["Appointments"])


@router.get("", response_model=list[AppointmentResponse])
def list_appointments(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_appointments(db)


@router.post("", response_model=AppointmentResponse, status_code=201)
def add_appointment(
    appointment: AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return create_appointment(db, appointment)


@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    appointment = get_appointment_by_id(db, appointment_id)

    if appointment is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Appointment not found")

    return appointment


@router.put("/{appointment_id}", response_model=AppointmentResponse)
def edit_appointment(
    appointment_id: str,
    appointment: AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = update_appointment(db, appointment_id, appointment)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Appointment not found")

    return updated


@router.delete("/{appointment_id}", response_model=AppointmentResponse)
def remove_appointment(
    appointment_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    deleted = delete_appointment(db, appointment_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Appointment not found")

    return deleted
