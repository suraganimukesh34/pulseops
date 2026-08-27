from app.features.departments.models import Department
from app.features.departments.schemas import (
    DepartmentCreate,
    DepartmentUpdate,
)
from sqlalchemy.orm import Session


def _next_id(db: Session) -> str:
    existing_ids = [d.id for d in db.query(Department.id).all()]
    max_num = max((int(id_.lstrip("D")) for id_ in existing_ids), default=0)
    return f"D{max_num + 1}"


def get_departments(db: Session) -> list[Department]:
    return db.query(Department).all()


def get_department_by_id(db: Session, department_id: str) -> Department | None:
    return db.query(Department).filter(Department.id == department_id).first()


def create_department(db: Session, department: DepartmentCreate) -> Department:
    new_department = Department(id=_next_id(db), **department.model_dump())
    db.add(new_department)
    db.commit()
    db.refresh(new_department)
    return new_department


def update_department(
    db: Session, department_id: str, department: DepartmentUpdate
) -> Department | None:
    existing = get_department_by_id(db, department_id)

    if existing is None:
        return None

    for field, value in department.model_dump().items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing


def delete_department(db: Session, department_id: str) -> Department | None:
    department = get_department_by_id(db, department_id)

    if department is None:
        return None

    db.delete(department)
    db.commit()
    return department
