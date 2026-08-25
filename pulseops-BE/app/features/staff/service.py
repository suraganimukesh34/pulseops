from app.features.staff.schemas import StaffCreate, StaffResponse, StaffUpdate

staff: list[StaffResponse] = [
    StaffResponse(id="S101", name="Dr. Sarah Smith", role="Doctor", department_id="D1", specialization="Cardiologist", shift="Morning", status="On Duty", email="sarah.smith@pulseops.ai", phone="555-0101", joined_date="2019-03-01"),
    StaffResponse(id="S102", name="Dr. Michael Brown", role="Doctor", department_id="D2", specialization="Neurologist", shift="Morning", status="On Duty", email="michael.brown@pulseops.ai", phone="555-0102", joined_date="2018-06-15"),
    StaffResponse(id="S103", name="Dr. David Wilson", role="Doctor", department_id="D3", specialization="Pulmonologist", shift="Evening", status="On Duty", email="david.wilson@pulseops.ai", phone="555-0103", joined_date="2020-01-10"),
    StaffResponse(id="S104", name="Dr. James Anderson", role="Doctor", department_id="D4", specialization="Orthopedic Surgeon", shift="Morning", status="Off Duty", email="james.anderson@pulseops.ai", phone="555-0104", joined_date="2017-09-20"),
    StaffResponse(id="S105", name="Dr. Emily Davis", role="Doctor", department_id="D5", specialization="General Physician", shift="Morning", status="On Duty", email="emily.davis@pulseops.ai", phone="555-0105", joined_date="2021-02-05"),
    StaffResponse(id="S106", name="Dr. Daniel Thomas", role="Doctor", department_id="D6", specialization="Emergency Medicine", shift="Night", status="On Duty", email="daniel.thomas@pulseops.ai", phone="555-0106", joined_date="2019-11-11"),
    StaffResponse(id="S107", name="Dr. Christopher Lee", role="Doctor", department_id="D7", specialization="Oncologist", shift="Morning", status="On Duty", email="christopher.lee@pulseops.ai", phone="555-0107", joined_date="2016-04-18"),
    StaffResponse(id="S108", name="Dr. Lisa Martin", role="Doctor", department_id="D8", specialization="Geriatrician", shift="Morning", status="On Duty", email="lisa.martin@pulseops.ai", phone="555-0108", joined_date="2020-07-23"),
    StaffResponse(id="S109", name="Dr. Robert Clark", role="Doctor", department_id="D6", specialization="Emergency Medicine", shift="Evening", status="On Duty", email="robert.clark@pulseops.ai", phone="555-0109", joined_date="2018-10-02"),
    StaffResponse(id="S110", name="Dr. Angela Perez", role="Doctor", department_id="D1", specialization="Cardiologist", shift="Evening", status="Off Duty", email="angela.perez@pulseops.ai", phone="555-0110", joined_date="2022-01-15"),
    StaffResponse(id="S111", name="Karen White", role="Nurse", department_id="D1", specialization="Cardiac Care", shift="Morning", status="On Duty", email="karen.white@pulseops.ai", phone="555-0111", joined_date="2019-05-01"),
    StaffResponse(id="S112", name="Linda Harris", role="Nurse", department_id="D2", specialization="Neuro Care", shift="Morning", status="On Duty", email="linda.harris@pulseops.ai", phone="555-0112", joined_date="2020-03-12"),
    StaffResponse(id="S113", name="Patricia Clark", role="Nurse", department_id="D6", specialization="Emergency Care", shift="Night", status="On Duty", email="patricia.clark@pulseops.ai", phone="555-0113", joined_date="2021-08-09"),
    StaffResponse(id="S114", name="Nancy Lewis", role="Nurse", department_id="D4", specialization="Orthopedic Care", shift="Morning", status="On Duty", email="nancy.lewis@pulseops.ai", phone="555-0114", joined_date="2018-12-01"),
    StaffResponse(id="S115", name="Betty Walker", role="Nurse", department_id="D7", specialization="Oncology Care", shift="Night", status="On Duty", email="betty.walker@pulseops.ai", phone="555-0115", joined_date="2019-09-17"),
    StaffResponse(id="S116", name="Mark Young", role="Technician", department_id="D3", specialization="Respiratory Therapy", shift="Morning", status="On Duty", email="mark.young@pulseops.ai", phone="555-0116", joined_date="2021-06-04"),
    StaffResponse(id="S117", name="Kevin Hall", role="Technician", department_id="D6", specialization="Radiology", shift="Evening", status="On Duty", email="kevin.hall@pulseops.ai", phone="555-0117", joined_date="2020-10-28"),
    StaffResponse(id="S118", name="Susan King", role="Admin", department_id="D5", specialization="Ward Administration", shift="Morning", status="On Duty", email="susan.king@pulseops.ai", phone="555-0118", joined_date="2017-02-14"),
    StaffResponse(id="S119", name="Paul Wright", role="Admin", department_id="D8", specialization="Ward Administration", shift="Morning", status="On Duty", email="paul.wright@pulseops.ai", phone="555-0119", joined_date="2019-04-22"),
    StaffResponse(id="S120", name="Jessica Scott", role="Nurse", department_id="D5", specialization="General Care", shift="Morning", status="On Leave", email="jessica.scott@pulseops.ai", phone="555-0120", joined_date="2022-05-30"),
]

_next_seq = 121


def _next_id() -> str:
    global _next_seq
    staff_id = f"S{_next_seq}"
    _next_seq += 1
    return staff_id


def get_staff() -> list[StaffResponse]:
    return staff


def get_staff_by_id(staff_id: str) -> StaffResponse | None:
    return next((s for s in staff if s.id == staff_id), None)


def create_staff(member: StaffCreate) -> StaffResponse:
    new_member = StaffResponse(id=_next_id(), **member.model_dump())
    staff.append(new_member)
    return new_member


def update_staff(staff_id: str, member: StaffUpdate) -> StaffResponse | None:
    existing = get_staff_by_id(staff_id)

    if existing is None:
        return None

    for field, value in member.model_dump().items():
        setattr(existing, field, value)

    return existing


def delete_staff(staff_id: str) -> StaffResponse | None:
    member = get_staff_by_id(staff_id)

    if member is None:
        return None

    staff.remove(member)
    return member
