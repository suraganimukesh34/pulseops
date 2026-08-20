from app.core.security import get_current_user
from app.features.patients.schemas import PatientCreate, PatientResponse
from app.features.patients.service import create_patient, get_patient_id, get_patients
from fastapi import APIRouter, Depends, HTTPException, status

router = APIRouter(
    prefix="/patients",
    tags=["Patients"],
)


@router.get("", response_model=list[PatientResponse])
def get_all_patients(current_user: str = Depends(get_current_user)):
    return get_patients()


@router.post("", response_model=PatientResponse, status_code=201)
def add_patient(patient: PatientCreate, current_user: str = Depends(get_current_user)):
    return create_patient(patient)


@router.get("/{patients_id}", response_model=PatientResponse)
def get_patient(patient_id: str, current_user: str = Depends(get_current_user)):
    patient = get_patient_id(patient_id)

    if patient is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Patient not found",
        )

    return patient
