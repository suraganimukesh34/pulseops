from app.core.db import SessionLocal
from app.features.departments.models import Department

DEPARTMENTS = [
    dict(
        id="D1",
        name="Cardiology",
        floor=3,
        head_doctor_id="S101",
        head_doctor_name="Dr. Sarah Smith",
        bed_capacity=5,
        status="Active",
    ),
    dict(
        id="D2",
        name="Neurology",
        floor=4,
        head_doctor_id="S102",
        head_doctor_name="Dr. Michael Brown",
        bed_capacity=5,
        status="Active",
    ),
    dict(
        id="D3",
        name="Pulmonology",
        floor=3,
        head_doctor_id="S103",
        head_doctor_name="Dr. David Wilson",
        bed_capacity=5,
        status="Active",
    ),
    dict(
        id="D4",
        name="Orthopedics",
        floor=2,
        head_doctor_id="S104",
        head_doctor_name="Dr. James Anderson",
        bed_capacity=5,
        status="Active",
    ),
    dict(
        id="D5",
        name="General Medicine",
        floor=2,
        head_doctor_id="S105",
        head_doctor_name="Dr. Emily Davis",
        bed_capacity=5,
        status="Active",
    ),
    dict(
        id="D6",
        name="Emergency",
        floor=1,
        head_doctor_id="S106",
        head_doctor_name="Dr. Daniel Thomas",
        bed_capacity=8,
        status="Active",
    ),
    dict(
        id="D7",
        name="Oncology",
        floor=5,
        head_doctor_id="S107",
        head_doctor_name="Dr. Christopher Lee",
        bed_capacity=4,
        status="Active",
    ),
    dict(
        id="D8",
        name="Geriatrics",
        floor=4,
        head_doctor_id="S108",
        head_doctor_name="Dr. Lisa Martin",
        bed_capacity=4,
        status="Active",
    ),
]

db = SessionLocal()

if db.query(Department).count() == 0:
    for row in DEPARTMENTS:
        db.add(Department(**row))
    db.commit()
    print(f"Seeded {len(DEPARTMENTS)} departments.")
else:
    print("Departments table already has data — skipping seed.")

db.close()
