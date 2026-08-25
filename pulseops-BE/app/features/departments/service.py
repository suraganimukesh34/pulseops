from app.features.departments.schemas import (
    DepartmentCreate,
    DepartmentResponse,
    DepartmentUpdate,
)

departments: list[DepartmentResponse] = [
    DepartmentResponse(
        id="D1", name="Cardiology", floor=3, head_doctor_id="S101",
        head_doctor_name="Dr. Sarah Smith", bed_capacity=5, status="Active",
    ),
    DepartmentResponse(
        id="D2", name="Neurology", floor=4, head_doctor_id="S102",
        head_doctor_name="Dr. Michael Brown", bed_capacity=5, status="Active",
    ),
    DepartmentResponse(
        id="D3", name="Pulmonology", floor=3, head_doctor_id="S103",
        head_doctor_name="Dr. David Wilson", bed_capacity=5, status="Active",
    ),
    DepartmentResponse(
        id="D4", name="Orthopedics", floor=2, head_doctor_id="S104",
        head_doctor_name="Dr. James Anderson", bed_capacity=5, status="Active",
    ),
    DepartmentResponse(
        id="D5", name="General Medicine", floor=2, head_doctor_id="S105",
        head_doctor_name="Dr. Emily Davis", bed_capacity=5, status="Active",
    ),
    DepartmentResponse(
        id="D6", name="Emergency", floor=1, head_doctor_id="S106",
        head_doctor_name="Dr. Daniel Thomas", bed_capacity=8, status="Active",
    ),
    DepartmentResponse(
        id="D7", name="Oncology", floor=5, head_doctor_id="S107",
        head_doctor_name="Dr. Christopher Lee", bed_capacity=4, status="Active",
    ),
    DepartmentResponse(
        id="D8", name="Geriatrics", floor=4, head_doctor_id="S108",
        head_doctor_name="Dr. Lisa Martin", bed_capacity=4, status="Active",
    ),
]

_next_seq = len(departments) + 1


def _next_id() -> str:
    global _next_seq
    department_id = f"D{_next_seq}"
    _next_seq += 1
    return department_id


def get_departments() -> list[DepartmentResponse]:
    return departments


def get_department_by_id(department_id: str) -> DepartmentResponse | None:
    return next((d for d in departments if d.id == department_id), None)


def create_department(department: DepartmentCreate) -> DepartmentResponse:
    new_department = DepartmentResponse(id=_next_id(), **department.model_dump())
    departments.append(new_department)
    return new_department


def update_department(
    department_id: str, department: DepartmentUpdate
) -> DepartmentResponse | None:
    existing = get_department_by_id(department_id)

    if existing is None:
        return None

    for field, value in department.model_dump().items():
        setattr(existing, field, value)

    return existing


def delete_department(department_id: str) -> DepartmentResponse | None:
    department = get_department_by_id(department_id)

    if department is None:
        return None

    departments.remove(department)
    return department
