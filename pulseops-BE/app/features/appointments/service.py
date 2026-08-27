from sqlalchemy.orm import Session

from app.features.appointments.models import Appointment
from app.features.appointments.schemas import AppointmentCreate, AppointmentUpdate


def _next_id(db: Session) -> str:
    existing_ids = [a.id for a in db.query(Appointment.id).all()]
    max_num = max((int(id_.lstrip("AP")) for id_ in existing_ids), default=0)
    return f"AP{max_num + 1}"


def get_appointments(db: Session) -> list[Appointment]:
    return db.query(Appointment).all()


def get_appointment_by_id(db: Session, appointment_id: str) -> Appointment | None:
    return db.query(Appointment).filter(Appointment.id == appointment_id).first()


def create_appointment(db: Session, appointment: AppointmentCreate) -> Appointment:
    new_appointment = Appointment(id=_next_id(db), **appointment.model_dump())
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment


def update_appointment(
    db: Session, appointment_id: str, appointment: AppointmentUpdate
) -> Appointment | None:
    existing = get_appointment_by_id(db, appointment_id)

    if existing is None:
        return None

    for field, value in appointment.model_dump().items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing


def delete_appointment(db: Session, appointment_id: str) -> Appointment | None:
    appointment = get_appointment_by_id(db, appointment_id)

    if appointment is None:
        return None

    db.delete(appointment)
    db.commit()
    return appointment
