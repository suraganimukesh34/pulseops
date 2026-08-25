from app.features.patients.schemas import (
    AIPatientSummaryResponse,
    PatientCreate,
    PatientResponse,
    PatientUpdate,
)

patients: list[PatientResponse] = [
    PatientResponse(
        id="P1001",
        name="John Doe",
        age=64,
        gender="Male",
        department="Cardiology",
        ward="Ward A",
        bed="A-12",
        status="Critical",
        priority="High",
        admission_date="2026-08-15",
        expected_discharge_date="2026-08-22",
        attending_doctor="Dr. Sarah Smith",
        diagnosis="Chest pain",
        symptoms="Chest discomfort and shortness of breath",
    ),
    PatientResponse(
        id="P1002",
        name="Emily Johnson",
        age=42,
        gender="Female",
        department="Neurology",
        ward="Ward B",
        bed="B-08",
        status="Stable",
        priority="Medium",
        admission_date="2026-08-18",
        expected_discharge_date="2026-08-24",
        attending_doctor="Dr. Michael Brown",
        diagnosis="Migraine",
        symptoms="Severe headache and sensitivity to light",
    ),
    PatientResponse(
        id="P1003",
        name="Robert Williams",
        age=71,
        gender="Male",
        department="Pulmonology",
        ward="Ward A",
        bed="A-15",
        status="Critical",
        priority="High",
        admission_date="2026-08-14",
        expected_discharge_date="2026-08-25",
        attending_doctor="Dr. David Wilson",
        diagnosis="Pneumonia",
        symptoms="Difficulty breathing and persistent cough",
    ),
    PatientResponse(
        id="P1004",
        name="Sophia Martinez",
        age=35,
        gender="Female",
        department="Orthopedics",
        ward="Ward C",
        bed="C-04",
        status="Stable",
        priority="Low",
        admission_date="2026-08-19",
        expected_discharge_date="2026-08-23",
        attending_doctor="Dr. James Anderson",
        diagnosis="Fractured wrist",
        symptoms="Wrist pain and swelling",
    ),
    PatientResponse(
        id="P1005",
        name="David Miller",
        age=58,
        gender="Male",
        department="General Medicine",
        ward="Ward B",
        bed="B-14",
        status="Waiting",
        priority="Medium",
        admission_date="2026-08-16",
        expected_discharge_date="2026-08-21",
        attending_doctor="Dr. Emily Davis",
        diagnosis="Viral infection",
        symptoms="Fever, fatigue and body aches",
    ),
    PatientResponse(
        id="P1006",
        name="Olivia Taylor",
        age=29,
        gender="Female",
        department="Emergency",
        ward="Emergency",
        bed="ER-03",
        status="Critical",
        priority="High",
        admission_date="2026-08-20",
        expected_discharge_date="2026-08-23",
        attending_doctor="Dr. Daniel Thomas",
        diagnosis="Acute abdominal pain",
        symptoms="Severe abdominal pain and nausea",
    ),
    PatientResponse(
        id="P1007",
        name="William Anderson",
        age=67,
        gender="Male",
        department="Cardiology",
        ward="Ward A",
        bed="A-18",
        status="Waiting",
        priority="Medium",
        admission_date="2026-08-12",
        expected_discharge_date="2026-08-21",
        attending_doctor="Dr. Sarah Smith",
        diagnosis="Hypertension",
        symptoms="Dizziness and elevated blood pressure",
    ),
    PatientResponse(
        id="P1008",
        name="Ava Thomas",
        age=51,
        gender="Female",
        department="Oncology",
        ward="Ward D",
        bed="D-07",
        status="Stable",
        priority="High",
        admission_date="2026-08-10",
        expected_discharge_date="2026-08-27",
        attending_doctor="Dr. Christopher Lee",
        diagnosis="Lymphoma",
        symptoms="Fatigue and reduced appetite",
    ),
    PatientResponse(
        id="P1009",
        name="James Wilson",
        age=76,
        gender="Male",
        department="Geriatrics",
        ward="Ward C",
        bed="C-11",
        status="Stable",
        priority="Medium",
        admission_date="2026-08-17",
        expected_discharge_date="2026-08-26",
        attending_doctor="Dr. Lisa Martin",
        diagnosis="Dehydration",
        symptoms="Weakness and dizziness",
    ),
    PatientResponse(
        id="P1010",
        name="Mia Garcia",
        age=46,
        gender="Female",
        department="Emergency",
        ward="Emergency",
        bed="ER-07",
        status="Critical",
        priority="High",
        admission_date="2026-08-20",
        expected_discharge_date="2026-08-23",
        attending_doctor="Dr. Robert Clark",
        diagnosis="Severe asthma",
        symptoms="Breathing difficulty and wheezing",
    ),
]


_next_patient_seq = len(patients) + 1


def _next_patient_id() -> str:
    global _next_patient_seq
    patient_id = f"P{1000 + _next_patient_seq}"
    _next_patient_seq += 1
    return patient_id


def get_patients() -> list[PatientResponse]:
    return patients


def create_patient(patient: PatientCreate) -> PatientResponse:
    patient_id = _next_patient_id()

    new_patient = PatientResponse(
        id=patient_id,
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
    )

    patients.append(new_patient)

    return new_patient


def get_patient_id(patient_id: str) -> PatientResponse | None:
    for patient in patients:
        if patient.id == patient_id:
            return patient
    return None


def update_patient_service(
    patient_id: str, patient: PatientUpdate
) -> PatientResponse | None:
    existing_patient = get_patient_id(patient_id)

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

    return existing_patient


def delete_patient(patient_id: str) -> PatientResponse | None:
    patient = get_patient_id(patient_id)

    if patient is None:
        return

    patients.remove(patient)

    return patient


def generate_ai_patient_summary(patient_id: str) -> AIPatientSummaryResponse:
    """Return a preview of the AI patient summary feature.

    This is a deterministic placeholder built from the patient's own record —
    no model call is made. Real AI-generated summaries are a future milestone.
    """

    patient = next((patient for patient in patients if patient.id == patient_id), None)

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
