from sqlalchemy.orm import Session

from app.features.patients.models import Patient
from app.features.patients.schemas import (
    AIPatientSummaryResponse,
    PatientCreate,
    PatientUpdate,
)


def _next_patient_id(db: Session) -> str:
    existing_ids = [p.id for p in db.query(Patient.id).all()]
    max_num = max((int(id_.lstrip("P")) for id_ in existing_ids), default=1000)
    return f"P{max_num + 1}"


def get_patients(db: Session) -> list[Patient]:
    return db.query(Patient).all()


def create_patient(db: Session, patient: PatientCreate) -> Patient:
    new_patient = Patient(
        id=_next_patient_id(db),
        name=patient.name,
        age=patient.age,
        gender=patient.gender,
        department=patient.department,
        ward=patient.ward,
        bed=patient.bed,
        status=patient.status,
        priority=patient.priority,
        admission_date=patient.admission_date,
        expected_discharge_date=patient.expected_discharge_date,
        attending_doctor=patient.attending_doctor,
        diagnosis=patient.diagnosis,
        symptoms=patient.symptoms,
        contact_number=patient.contact_number or "",
        blood_group=patient.blood_group or "",
    )

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


def get_patient_id(db: Session, patient_id: str) -> Patient | None:
    return db.query(Patient).filter(Patient.id == patient_id).first()


def update_patient_service(
    db: Session, patient_id: str, patient: PatientUpdate
) -> Patient | None:
    existing_patient = get_patient_id(db, patient_id)

    if existing_patient is None:
        return None

    existing_patient.name = patient.name
    existing_patient.age = patient.age
    existing_patient.gender = patient.gender
    existing_patient.department = patient.department
    existing_patient.ward = patient.ward
    existing_patient.bed = patient.bed
    existing_patient.status = patient.status
    existing_patient.priority = patient.priority
    existing_patient.admission_date = patient.admission_date
    existing_patient.expected_discharge_date = patient.expected_discharge_date
    existing_patient.attending_doctor = patient.attending_doctor
    existing_patient.diagnosis = patient.diagnosis
    existing_patient.symptoms = patient.symptoms
    existing_patient.contact_number = patient.contact_number or ""
    existing_patient.blood_group = patient.blood_group or ""

    db.commit()
    db.refresh(existing_patient)

    return existing_patient


def delete_patient(db: Session, patient_id: str) -> Patient | None:
    patient = get_patient_id(db, patient_id)

    if patient is None:
        return None

    db.delete(patient)
    db.commit()

    return patient


def generate_ai_patient_summary(db: Session, patient_id: str) -> AIPatientSummaryResponse:
    """Return a preview of the AI patient summary feature.

    This is a deterministic placeholder built from the patient's own record —
    no model call is made. Real AI-generated summaries are a future milestone.
    """

    patient = get_patient_id(db, patient_id)

    if patient is None:
        raise ValueError("Patient not found")

    summary = (
        f"[AI Preview] {patient.name}, {patient.age}, is currently {patient.status.lower()} "
        f"in {patient.department} ({patient.ward}, bed {patient.bed}) under {patient.attending_doctor}. "
        f"Admitted {patient.admission_date} for {patient.diagnosis.lower()}, "
        f"expected discharge {patient.expected_discharge_date}. "
        "Full AI-generated clinical summaries are coming in a future release."
    )

    return AIPatientSummaryResponse(patient_id=patient.id, patient_summary=summary)
