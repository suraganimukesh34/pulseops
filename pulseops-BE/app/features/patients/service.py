from app.features.patients.schemas import PatientCreate, PatientResponse

patients: list[PatientResponse] = [
    PatientResponse(
        id="P1001",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1002",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1003",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1004",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1005",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1006",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1007",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1008",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1009",
        name="John Doe",
        department="ICU",
        ward="Ward A",
        bed="ICU-12",
        status="Critical",
        priority="High",
    ),
    PatientResponse(
        id="P1010",
        name="James lohg",
        department="Cardiology",
        ward="Ward C",
        bed="C-12",
        status="Stable",
        priority="Low",
    ),
]


def get_patients() -> list[PatientResponse]:
    return patients


def create_patient(patient: PatientCreate) -> PatientResponse:
    patient_id = f"P{1001 + len(patients)}"

    new_patient = PatientResponse(
        id=patient_id,
        name=patient.name,
        department=patient.department,
        ward=patient.ward,
        bed=patient.bed,
        status=patient.status,
        priority=patient.priority,
    )

    patients.append(new_patient)

    return new_patient


def get_patient_id(patient_id: str) -> PatientResponse | None:
    for patient in patients:
        if patient.id == patient_id:
            return patient
    return None
