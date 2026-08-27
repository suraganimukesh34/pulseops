from sqlalchemy.orm import Session

from app.features.beds.models import Bed
from app.features.beds.schemas import BedCreate, BedUpdate


def _next_id(db: Session) -> str:
    existing_ids = [b.id for b in db.query(Bed.id).all()]
    max_num = max((int(id_.lstrip("B")) for id_ in existing_ids), default=0)
    return f"B{max_num + 1}"


def get_beds(db: Session) -> list[Bed]:
    return db.query(Bed).all()


def get_bed_by_id(db: Session, bed_id: str) -> Bed | None:
    return db.query(Bed).filter(Bed.id == bed_id).first()


def create_bed(db: Session, bed: BedCreate) -> Bed:
    new_bed = Bed(id=_next_id(db), **bed.model_dump())
    db.add(new_bed)
    db.commit()
    db.refresh(new_bed)
    return new_bed


def update_bed(db: Session, bed_id: str, bed: BedUpdate) -> Bed | None:
    existing = get_bed_by_id(db, bed_id)

    if existing is None:
        return None

    for field, value in bed.model_dump().items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing


def admit_patient_to_bed(
    db: Session, bed_id: str, patient_id: str, admitted_date: str
) -> Bed | None:
    bed = get_bed_by_id(db, bed_id)

    if bed is None:
        return None

    bed.status = "Occupied"
    bed.patient_id = patient_id
    bed.admitted_date = admitted_date

    db.commit()
    db.refresh(bed)
    return bed


def release_bed(db: Session, bed_id: str) -> Bed | None:
    bed = get_bed_by_id(db, bed_id)

    if bed is None:
        return None

    bed.status = "Cleaning"
    bed.patient_id = None
    bed.admitted_date = None

    db.commit()
    db.refresh(bed)
    return bed


def delete_bed(db: Session, bed_id: str) -> Bed | None:
    bed = get_bed_by_id(db, bed_id)

    if bed is None:
        return None

    db.delete(bed)
    db.commit()
    return bed
