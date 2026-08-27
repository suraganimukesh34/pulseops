from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user
from app.features.patients.schemas import (
    AIPatientSummaryResponse,
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)
from app.features.patients.service import (
    create_patient,
    generate_ai_patient_summary,
    get_patient_id,
    get_patients,
    update_patient_service,
)
from app.features.patients.service import delete_patient as delete_patient_service
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
)


@router.get("", response_model=list[PatientResponse])
def get_all_patients(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_patients(db)


@router.post("", response_model=PatientResponse, status_code=201)
def add_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return create_patient(db, patient)


@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    patient = get_patient_id(db, patient_id)

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return patient


@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: str,
    patient: PatientUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated_patient = update_patient_service(db, patient_id, patient)

    if updated_patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return updated_patient


@router.delete("/{patient_id}", response_model=PatientResponse)
def delete_patient(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    deleted_patient = delete_patient_service(db, patient_id)

    if deleted_patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return deleted_patient


@router.post("/{patient_id}/ai-summary", response_model=AIPatientSummaryResponse)
def get_patient_ai_summary(
    patient_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    try:
        return generate_ai_patient_summary(db, patient_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
