from app.features.appointments.schemas import (
    AppointmentCreate,
    AppointmentResponse,
    AppointmentUpdate,
)


def _appt(id, patient_id, patient_name, doctor_id, doctor_name, department_id, date, time, status, reason):
    return AppointmentResponse(
        id=id, patient_id=patient_id, patient_name=patient_name, doctor_id=doctor_id,
        doctor_name=doctor_name, department_id=department_id, date=date, time=time,
        status=status, reason=reason,
    )


appointments: list[AppointmentResponse] = [
    _appt("AP1", "P1001", "John Doe", "S101", "Dr. Sarah Smith", "D1", "2026-08-25", "09:00", "Scheduled", "Follow-up for chest pain"),
    _appt("AP2", "P1002", "Emily Johnson", "S102", "Dr. Michael Brown", "D2", "2026-08-25", "10:30", "Scheduled", "Migraine review"),
    _appt("AP3", "P1003", "Robert Williams", "S103", "Dr. David Wilson", "D3", "2026-08-24", "14:00", "Completed", "Pneumonia follow-up"),
    _appt("AP4", "P1004", "Sophia Martinez", "S104", "Dr. James Anderson", "D4", "2026-08-23", "11:00", "Completed", "Wrist cast check"),
    _appt("AP5", "P1005", "David Miller", "S105", "Dr. Emily Davis", "D5", "2026-08-26", "09:30", "Scheduled", "Viral infection recheck"),
    _appt("AP6", "P1006", "Olivia Taylor", "S106", "Dr. Daniel Thomas", "D6", "2026-08-25", "08:00", "Completed", "Abdominal pain ER visit"),
    _appt("AP7", "P1007", "William Anderson", "S101", "Dr. Sarah Smith", "D1", "2026-08-27", "13:00", "Scheduled", "Hypertension review"),
    _appt("AP8", "P1008", "Ava Thomas", "S107", "Dr. Christopher Lee", "D7", "2026-08-26", "15:00", "Scheduled", "Lymphoma treatment review"),
    _appt("AP9", "P1009", "James Wilson", "S108", "Dr. Lisa Martin", "D8", "2026-08-28", "10:00", "Scheduled", "Dehydration follow-up"),
    _appt("AP10", "P1010", "Mia Garcia", "S109", "Dr. Robert Clark", "D6", "2026-08-25", "07:30", "Completed", "Asthma ER visit"),
    _appt("AP11", "P1001", "John Doe", "S110", "Dr. Angela Perez", "D1", "2026-08-30", "09:00", "Scheduled", "Cardiology second opinion"),
    _appt("AP12", "P1003", "Robert Williams", "S103", "Dr. David Wilson", "D3", "2026-08-19", "09:00", "No-show", "Routine checkup"),
    _appt("AP13", "P1004", "Sophia Martinez", "S104", "Dr. James Anderson", "D4", "2026-08-29", "11:00", "Cancelled", "Physical therapy consult"),
    _appt("AP14", "P1002", "Emily Johnson", "S102", "Dr. Michael Brown", "D2", "2026-08-31", "10:00", "Scheduled", "Neurology check-in"),
    _appt("AP15", "P1005", "David Miller", "S105", "Dr. Emily Davis", "D5", "2026-08-22", "09:00", "Completed", "Initial consultation"),
]

_next_seq = len(appointments) + 1


def _next_id() -> str:
    global _next_seq
    appointment_id = f"AP{_next_seq}"
    _next_seq += 1
    return appointment_id


def get_appointments() -> list[AppointmentResponse]:
    return appointments


def get_appointment_by_id(appointment_id: str) -> AppointmentResponse | None:
    return next((a for a in appointments if a.id == appointment_id), None)


def create_appointment(appointment: AppointmentCreate) -> AppointmentResponse:
    new_appointment = AppointmentResponse(id=_next_id(), **appointment.model_dump())
    appointments.append(new_appointment)
    return new_appointment


def update_appointment(
    appointment_id: str, appointment: AppointmentUpdate
) -> AppointmentResponse | None:
    existing = get_appointment_by_id(appointment_id)

    if existing is None:
        return None

    for field, value in appointment.model_dump().items():
        setattr(existing, field, value)

    return existing


def delete_appointment(appointment_id: str) -> AppointmentResponse | None:
    appointment = get_appointment_by_id(appointment_id)

    if appointment is None:
        return None

    appointments.remove(appointment)
    return appointment
