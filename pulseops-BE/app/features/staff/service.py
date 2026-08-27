from sqlalchemy.orm import Session

from app.features.staff.models import Staff
from app.features.staff.schemas import StaffCreate, StaffUpdate


def _next_id(db: Session) -> str:
    existing_ids = [s.id for s in db.query(Staff.id).all()]
    max_num = max((int(id_.lstrip("S")) for id_ in existing_ids), default=100)
    return f"S{max_num + 1}"


def get_staff(db: Session) -> list[Staff]:
    return db.query(Staff).all()


def get_staff_by_id(db: Session, staff_id: str) -> Staff | None:
    return db.query(Staff).filter(Staff.id == staff_id).first()


def create_staff(db: Session, member: StaffCreate) -> Staff:
    new_member = Staff(id=_next_id(db), **member.model_dump())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member


def update_staff(db: Session, staff_id: str, member: StaffUpdate) -> Staff | None:
    existing = get_staff_by_id(db, staff_id)

    if existing is None:
        return None

    for field, value in member.model_dump().items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing


def delete_staff(db: Session, staff_id: str) -> Staff | None:
    member = get_staff_by_id(db, staff_id)

    if member is None:
        return None

    db.delete(member)
    db.commit()
    return member
