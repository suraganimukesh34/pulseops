from app.features.beds.schemas import BedCreate, BedResponse, BedUpdate


def _bed(id, department_id, bed_number, status, patient_id=None, admitted_date=None):
    return BedResponse(
        id=id,
        department_id=department_id,
        bed_number=bed_number,
        status=status,
        patient_id=patient_id,
        admitted_date=admitted_date,
    )


beds: list[BedResponse] = [
    # Cardiology (D1)
    _bed("B1", "D1", "A-01", "Available"),
    _bed("B2", "D1", "A-02", "Available"),
    _bed("B3", "D1", "A-12", "Occupied", "P1001", "2026-08-15"),
    _bed("B4", "D1", "A-18", "Occupied", "P1007", "2026-08-12"),
    _bed("B5", "D1", "A-19", "Cleaning"),
    # Neurology (D2)
    _bed("B6", "D2", "B-01", "Available"),
    _bed("B7", "D2", "B-02", "Available"),
    _bed("B8", "D2", "B-08", "Occupied", "P1002", "2026-08-18"),
    _bed("B9", "D2", "B-03", "Maintenance"),
    _bed("B10", "D2", "B-09", "Cleaning"),
    # Pulmonology (D3)
    _bed("B11", "D3", "E-01", "Available"),
    _bed("B12", "D3", "E-02", "Available"),
    _bed("B13", "D3", "A-15", "Occupied", "P1003", "2026-08-14"),
    _bed("B14", "D3", "E-04", "Cleaning"),
    _bed("B15", "D3", "E-05", "Available"),
    # Orthopedics (D4)
    _bed("B16", "D4", "C-01", "Available"),
    _bed("B17", "D4", "C-02", "Available"),
    _bed("B18", "D4", "C-04", "Occupied", "P1004", "2026-08-19"),
    _bed("B19", "D4", "C-03", "Maintenance"),
    _bed("B20", "D4", "C-05", "Available"),
    # General Medicine (D5)
    _bed("B21", "D5", "B-15", "Available"),
    _bed("B22", "D5", "B-16", "Available"),
    _bed("B23", "D5", "B-14", "Occupied", "P1005", "2026-08-16"),
    _bed("B24", "D5", "B-17", "Cleaning"),
    _bed("B25", "D5", "B-18", "Available"),
    # Emergency (D6)
    _bed("B26", "D6", "ER-01", "Available"),
    _bed("B27", "D6", "ER-02", "Available"),
    _bed("B28", "D6", "ER-03", "Occupied", "P1006", "2026-08-20"),
    _bed("B29", "D6", "ER-07", "Occupied", "P1010", "2026-08-20"),
    _bed("B30", "D6", "ER-04", "Available"),
    _bed("B31", "D6", "ER-05", "Cleaning"),
    _bed("B32", "D6", "ER-06", "Maintenance"),
    _bed("B33", "D6", "ER-08", "Available"),
    # Oncology (D7)
    _bed("B34", "D7", "D-01", "Available"),
    _bed("B35", "D7", "D-02", "Available"),
    _bed("B36", "D7", "D-07", "Occupied", "P1008", "2026-08-10"),
    _bed("B37", "D7", "D-03", "Cleaning"),
    # Geriatrics (D8)
    _bed("B38", "D8", "F-01", "Available"),
    _bed("B39", "D8", "F-02", "Available"),
    _bed("B40", "D8", "C-11", "Occupied", "P1009", "2026-08-17"),
    _bed("B41", "D8", "F-03", "Maintenance"),
]

_next_seq = len(beds) + 1


def _next_id() -> str:
    global _next_seq
    bed_id = f"B{_next_seq}"
    _next_seq += 1
    return bed_id


def get_beds() -> list[BedResponse]:
    return beds


def get_bed_by_id(bed_id: str) -> BedResponse | None:
    return next((b for b in beds if b.id == bed_id), None)


def create_bed(bed: BedCreate) -> BedResponse:
    new_bed = BedResponse(id=_next_id(), **bed.model_dump())
    beds.append(new_bed)
    return new_bed


def update_bed(bed_id: str, bed: BedUpdate) -> BedResponse | None:
    existing = get_bed_by_id(bed_id)

    if existing is None:
        return None

    for field, value in bed.model_dump().items():
        setattr(existing, field, value)

    return existing


def admit_patient_to_bed(
    bed_id: str, patient_id: str, admitted_date: str
) -> BedResponse | None:
    bed = get_bed_by_id(bed_id)

    if bed is None:
        return None

    bed.status = "Occupied"
    bed.patient_id = patient_id
    bed.admitted_date = admitted_date

    return bed


def release_bed(bed_id: str) -> BedResponse | None:
    bed = get_bed_by_id(bed_id)

    if bed is None:
        return None

    bed.status = "Cleaning"
    bed.patient_id = None
    bed.admitted_date = None

    return bed


def delete_bed(bed_id: str) -> BedResponse | None:
    bed = get_bed_by_id(bed_id)

    if bed is None:
        return None

    beds.remove(bed)
    return bed
