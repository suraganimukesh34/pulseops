from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user
from app.features.staff.schemas import StaffCreate, StaffResponse, StaffUpdate
from app.features.staff.service import (
    create_staff,
    delete_staff,
    get_staff,
    get_staff_by_id,
    update_staff,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/staff", tags=["Staff"])


@router.get("", response_model=list[StaffResponse])
def list_staff(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_staff(db)


@router.post("", response_model=StaffResponse, status_code=201)
def add_staff(
    member: StaffCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return create_staff(db, member)


@router.get("/{staff_id}", response_model=StaffResponse)
def get_one_staff(
    staff_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    member = get_staff_by_id(db, staff_id)

    if member is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Staff member not found")

    return member


@router.put("/{staff_id}", response_model=StaffResponse)
def edit_staff(
    staff_id: str,
    member: StaffUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = update_staff(db, staff_id, member)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Staff member not found")

    return updated


@router.delete("/{staff_id}", response_model=StaffResponse)
def remove_staff(
    staff_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    deleted = delete_staff(db, staff_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Staff member not found")

    return deleted
