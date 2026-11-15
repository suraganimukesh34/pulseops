"""Synthetic Indian hospital demo fixtures. Never use these records for patient care."""

from datetime import date, datetime, timedelta
from zoneinfo import ZoneInfo

INDIA_TZ = ZoneInfo("Asia/Kolkata")
TODAY = datetime.now(INDIA_TZ).date()


def date_at(day_offset: int) -> str:
    return (TODAY + timedelta(days=day_offset)).isoformat()


def timestamp_ago(hours: int = 0, minutes: int = 0) -> str:
    return (datetime.now(INDIA_TZ) - timedelta(hours=hours, minutes=minutes)).isoformat(timespec="minutes")


DEPARTMENTS = [
    dict(id="D1", name="Cardiology", floor=2, head_doctor_id="S101", head_doctor_name="Dr. Arjun Rao", bed_capacity=6, status="Active"),
    dict(id="D2", name="Neurology", floor=3, head_doctor_id="S102", head_doctor_name="Dr. Ananya Iyer", bed_capacity=5, status="Active"),
    dict(id="D3", name="Orthopedics", floor=4, head_doctor_id="S103", head_doctor_name="Dr. Rohan Menon", bed_capacity=6, status="Active"),
    dict(id="D4", name="Obstetrics & Gynaecology", floor=5, head_doctor_id="S104", head_doctor_name="Dr. Meera Kulkarni", bed_capacity=5, status="Active"),
    dict(id="D5", name="Pediatrics", floor=6, head_doctor_id="S105", head_doctor_name="Dr. Kavya Nair", bed_capacity=6, status="Active"),
    dict(id="D6", name="Emergency", floor=0, head_doctor_id="S106", head_doctor_name="Dr. Kabir Shah", bed_capacity=8, status="Active"),
    dict(id="D7", name="Oncology", floor=7, head_doctor_id="S107", head_doctor_name="Dr. Aditi Deshmukh", bed_capacity=5, status="Active"),
    dict(id="D8", name="General Medicine", floor=3, head_doctor_id="S108", head_doctor_name="Dr. Vivek Reddy", bed_capacity=8, status="Active"),
]
DEPARTMENT_BY_ID = {row["id"]: row for row in DEPARTMENTS}


def _staff_row(staff_id, name, role, department_id, specialization, shift, status, years_ago):
    slug = name.removeprefix("Dr. ").lower().replace(" ", ".")
    phone = f"+91 90000 {90000 + int(staff_id[1:]):05d}"
    return dict(
        id=staff_id,
        name=name,
        role=role,
        department_id=department_id,
        specialization=specialization,
        shift=shift,
        status=status,
        email=f"{slug}@pulseops.example",
        phone=phone,
        joined_date=(TODAY - timedelta(days=365 * years_ago + int(staff_id[1:]) % 180)).isoformat(),
    )


STAFF = [
    _staff_row("S101", "Dr. Arjun Rao", "Doctor", "D1", "Cardiology", "Morning", "On Duty", 8),
    _staff_row("S102", "Dr. Ananya Iyer", "Doctor", "D2", "Neurology", "Morning", "On Duty", 6),
    _staff_row("S103", "Dr. Rohan Menon", "Doctor", "D3", "Orthopedics", "Evening", "On Duty", 7),
    _staff_row("S104", "Dr. Meera Kulkarni", "Doctor", "D4", "Obstetrics and Gynaecology", "Morning", "On Duty", 9),
    _staff_row("S105", "Dr. Kavya Nair", "Doctor", "D5", "Pediatrics", "Morning", "On Duty", 5),
    _staff_row("S106", "Dr. Kabir Shah", "Doctor", "D6", "Emergency Medicine", "Night", "On Duty", 8),
    _staff_row("S107", "Dr. Aditi Deshmukh", "Doctor", "D7", "Oncology", "Morning", "On Duty", 6),
    _staff_row("S108", "Dr. Vivek Reddy", "Doctor", "D8", "General Medicine", "Morning", "On Duty", 10),
    _staff_row("S109", "Dr. Nikhil Patel", "Doctor", "D6", "Emergency Medicine", "Evening", "On Duty", 4),
    _staff_row("S110", "Dr. Sneha Banerjee", "Doctor", "D1", "Cardiology", "Evening", "Off Duty", 5),
    _staff_row("S111", "Dr. Farhan Qureshi", "Doctor", "D8", "Internal Medicine", "Night", "On Duty", 3),
    _staff_row("S112", "Dr. Divya Krishnan", "Doctor", "D4", "Obstetrics and Gynaecology", "Evening", "On Duty", 4),
    _staff_row("S113", "Pooja Sharma", "Nurse", "D1", "Cardiac Care", "Morning", "On Duty", 7),
    _staff_row("S114", "Lakshmi Menon", "Nurse", "D2", "Neuro Care", "Evening", "On Duty", 5),
    _staff_row("S115", "Rahul Das", "Nurse", "D6", "Emergency Care", "Night", "On Duty", 4),
    _staff_row("S116", "Nandita Rao", "Nurse", "D4", "Maternity Care", "Morning", "On Duty", 6),
    _staff_row("S117", "Gopal Pillai", "Nurse", "D5", "Paediatric Care", "Evening", "On Duty", 3),
    _staff_row("S118", "Ayesha Khan", "Nurse", "D7", "Oncology Care", "Night", "On Duty", 5),
    _staff_row("S119", "Kiran Joshi", "Nurse", "D8", "General Care", "Morning", "On Duty", 4),
    _staff_row("S120", "Suresh Babu", "Nurse", "D3", "Orthopedic Care", "Night", "On Leave", 2),
    _staff_row("S121", "Neha Verma", "Nurse", "D6", "Emergency Care", "Morning", "On Duty", 3),
    _staff_row("S122", "Ritu Chawla", "Nurse", "D5", "Paediatric Care", "Night", "On Duty", 2),
    _staff_row("S123", "Imran Sheikh", "Technician", "D6", "Radiology", "Evening", "On Duty", 5),
    _staff_row("S124", "Jaya Nair", "Technician", "D8", "Laboratory", "Morning", "On Duty", 4),
    _staff_row("S125", "Manoj Kumar", "Technician", "D6", "Biomedical Equipment", "Night", "On Duty", 6),
    _staff_row("S126", "Farida Ali", "Technician", "D8", "Pharmacy", "Morning", "On Duty", 3),
    _staff_row("S127", "Sanjay Bhatt", "Admin", "D1", "Ward Administration", "Morning", "On Duty", 8),
    _staff_row("S128", "Nisha Thomas", "Admin", "D8", "Billing Administration", "Morning", "On Duty", 5),
]
STAFF_BY_ID = {row["id"]: row for row in STAFF}


def _patient_row(patient_id, name, age, gender, department_id, ward, bed, status, priority,
                 doctor_id, diagnosis, symptoms, blood_group, admitted_days_ago, discharge_in_days):
    return dict(
        id=patient_id,
        name=name,
        age=age,
        gender=gender,
        department=DEPARTMENT_BY_ID[department_id]["name"],
        ward=ward,
        bed=bed,
        status=status,
        priority=priority,
        admission_date=date_at(-admitted_days_ago),
        expected_discharge_date=date_at(discharge_in_days),
        attending_doctor=STAFF_BY_ID[doctor_id]["name"],
        diagnosis=diagnosis,
        symptoms=symptoms,
        contact_number=f"+91 90001 {int(patient_id[1:]):05d}",
        blood_group=blood_group,
    )


PATIENTS = [
    _patient_row("P1001", "Aarav Sharma", 64, "Male", "D1", "Cardiac Ward", "C-01", "Critical", "High", "S101", "Acute coronary syndrome", "Chest discomfort and shortness of breath", "O+", 2, 5),
    _patient_row("P1002", "Ananya Desai", 42, "Female", "D2", "Neuro Ward", "N-01", "Stable", "Medium", "S102", "Migraine", "Severe headache with light sensitivity", "A+", 1, 3),
    _patient_row("P1003", "Rohan Mukherjee", 71, "Male", "D3", "Orthopedic Ward", "O-01", "Stable", "Medium", "S103", "Hip fracture recovery", "Pain and limited mobility after a fall", "B+", 4, 6),
    _patient_row("P1004", "Meera Iyer", 35, "Female", "D4", "Maternity Ward", "M-01", "Stable", "Low", "S104", "Postpartum observation", "Routine post-delivery monitoring", "AB+", 1, 2),
    _patient_row("P1005", "Vihaan Kapoor", 8, "Male", "D5", "Paediatric Ward", "P-01", "Stable", "Medium", "S105", "Viral fever observation", "Fever and reduced appetite", "O+", 2, 3),
    _patient_row("P1006", "Sana Khan", 29, "Female", "D6", "Emergency", "ER-01", "Critical", "High", "S106", "Acute abdominal pain", "Severe abdominal pain with nausea", "A-", 0, 1),
    _patient_row("P1007", "Dev Patel", 67, "Male", "D8", "General Ward", "G-01", "Stable", "Medium", "S108", "Hypertension observation", "Dizziness with elevated blood pressure", "B-", 3, 5),
    _patient_row("P1008", "Aisha Nair", 51, "Female", "D7", "Oncology Ward", "ON-01", "Stable", "High", "S107", "Lymphoma treatment monitoring", "Fatigue and reduced appetite", "AB-", 5, 7),
    _patient_row("P1009", "Kabir Reddy", 76, "Male", "D1", "Cardiac Ward", "C-02", "Stable", "Medium", "S110", "Arrhythmia monitoring", "Intermittent palpitations", "O-", 1, 4),
    _patient_row("P1010", "Diya Chatterjee", 6, "Female", "D5", "Paediatric Ward", "P-02", "Stable", "Low", "S105", "Asthma observation", "Wheezing and cough", "A+", 0, 2),
    _patient_row("P1011", "Arjun Singh", 46, "Male", "D6", "Emergency", "Triage Bay 02", "Waiting", "High", "S109", "Acute asthma assessment", "Breathing difficulty and wheezing", "B+", 0, 1),
    _patient_row("P1012", "Tara Menon", 58, "Female", "D8", "General Ward", "G-02", "Stable", "Medium", "S111", "Community-acquired pneumonia", "Cough, fever and fatigue", "AB+", 2, 5),
]
PATIENT_BY_ID = {row["id"]: row for row in PATIENTS}
PATIENT_DEPARTMENT_IDS = {
    "P1001": "D1", "P1002": "D2", "P1003": "D3", "P1004": "D4",
    "P1005": "D5", "P1006": "D6", "P1007": "D8", "P1008": "D7",
    "P1009": "D1", "P1010": "D5", "P1011": "D6", "P1012": "D8",
}


BED_LAYOUTS = [
    ("D1", "C", 6), ("D2", "N", 5), ("D3", "O", 6), ("D4", "M", 5),
    ("D5", "P", 6), ("D6", "ER", 8), ("D7", "ON", 5), ("D8", "G", 8),
]
OCCUPIED_BEDS = {
    "C-01": "P1001", "C-02": "P1009", "N-01": "P1002", "O-01": "P1003",
    "M-01": "P1004", "P-01": "P1005", "P-02": "P1010", "ER-01": "P1006",
    "ON-01": "P1008", "G-01": "P1007", "G-02": "P1012",
}


def _build_beds():
    rows = []
    next_id = 1
    for department_id, prefix, capacity in BED_LAYOUTS:
        for number in range(1, capacity + 1):
            bed_number = f"{prefix}-{number:02d}"
            patient_id = OCCUPIED_BEDS.get(bed_number)
            if patient_id:
                patient = PATIENT_BY_ID[patient_id]
                rows.append(dict(id=f"B{next_id}", department_id=department_id, bed_number=bed_number,
                                 status="Occupied", patient_id=patient_id, admitted_date=patient["admission_date"]))
            else:
                status = "Cleaning" if number == capacity - 1 else "Maintenance" if number == capacity else "Available"
                rows.append(dict(id=f"B{next_id}", department_id=department_id, bed_number=bed_number,
                                 status=status, patient_id=None, admitted_date=None))
            next_id += 1
    return rows


BEDS = _build_beds()


def _appointment(appointment_id, patient_id, doctor_id, day_offset, time, status, reason):
    patient = PATIENT_BY_ID[patient_id]
    return dict(
        id=appointment_id,
        patient_id=patient_id,
        patient_name=patient["name"],
        doctor_id=doctor_id,
        doctor_name=STAFF_BY_ID[doctor_id]["name"],
        department_id=PATIENT_DEPARTMENT_IDS[patient_id],
        date=date_at(day_offset),
        time=time,
        status=status,
        reason=reason,
        notes=None,
    )


APPOINTMENTS = [
    _appointment("AP1", "P1001", "S110", -3, "09:00", "Completed", "Cardiology follow-up"),
    _appointment("AP2", "P1002", "S102", 0, "09:30", "Scheduled", "Neurology review"),
    _appointment("AP3", "P1003", "S103", -1, "10:00", "Completed", "Orthopedic post-operative review"),
    _appointment("AP4", "P1004", "S104", 1, "11:00", "Scheduled", "Postnatal follow-up"),
    _appointment("AP5", "P1005", "S105", 0, "11:30", "Scheduled", "Paediatric review"),
    _appointment("AP6", "P1006", "S106", 0, "08:15", "Completed", "Emergency assessment"),
    _appointment("AP7", "P1007", "S108", 2, "12:00", "Scheduled", "Blood pressure review"),
    _appointment("AP8", "P1008", "S107", 3, "14:00", "Scheduled", "Oncology treatment review"),
    _appointment("AP9", "P1009", "S101", -1, "15:00", "No-show", "Cardiology consultation"),
    _appointment("AP10", "P1010", "S105", 5, "10:30", "Scheduled", "Paediatric respiratory review"),
    _appointment("AP11", "P1011", "S109", 0, "13:00", "Scheduled", "Emergency assessment"),
    _appointment("AP12", "P1012", "S111", 0, "16:00", "Scheduled", "General medicine review"),
    _appointment("AP13", "P1003", "S103", -10, "09:00", "Completed", "Fracture clinic review"),
    _appointment("AP14", "P1002", "S102", -7, "10:15", "Cancelled", "Neurology consultation"),
    _appointment("AP15", "P1008", "S107", 10, "14:30", "Scheduled", "Oncology follow-up"),
    _appointment("AP16", "P1001", "S101", 2, "09:15", "Scheduled", "Cardiac monitoring review"),
    _appointment("AP17", "P1009", "S110", 7, "15:30", "Scheduled", "Cardiology consultation"),
    _appointment("AP18", "P1012", "S108", -2, "11:00", "Completed", "Respiratory symptoms review"),
]


def _invoice(invoice_id, patient_id, status, issued_offset, due_offset, line_items):
    patient = PATIENT_BY_ID[patient_id]
    items = [{"description": description, "amount": amount} for description, amount in line_items]
    return dict(
        id=invoice_id,
        patient_id=patient_id,
        patient_name=patient["name"],
        items=items,
        total_amount=round(sum(item["amount"] for item in items), 2),
        status=status,
        issued_date=date_at(issued_offset),
        due_date=date_at(due_offset),
    )


INVOICES = [
    _invoice("INV1001", "P1001", "Paid", -10, -3, [("Cardiology consultation", 1200), ("ECG", 850), ("Room charges", 5400)]),
    _invoice("INV1002", "P1002", "Pending", -2, 12, [("Neurology consultation", 1000), ("MRI scan", 7800)]),
    _invoice("INV1003", "P1003", "Overdue", -25, -10, [("Orthopedic consultation", 900), ("X-ray", 1400), ("Room charges", 4200)]),
    _invoice("INV1004", "P1004", "Paid", -16, -9, [("Maternity care package", 18500), ("Laboratory panel", 2400)]),
    _invoice("INV1005", "P1005", "Pending", -1, 14, [("Paediatric consultation", 700), ("Laboratory tests", 950)]),
    _invoice("INV1006", "P1006", "Pending", 0, 7, [("Emergency assessment", 1500), ("Ultrasound", 2800)]),
    _invoice("INV1007", "P1007", "Overdue", -45, -30, [("General medicine consultation", 800), ("Diagnostic tests", 3200)]),
    _invoice("INV1008", "P1008", "Pending", -4, 10, [("Oncology consultation", 1400), ("Day-care treatment", 9200)]),
    _invoice("INV1009", "P1009", "Paid", -20, -13, [("Cardiology consultation", 1200), ("Echocardiogram", 2600)]),
    _invoice("INV1010", "P1010", "Pending", 0, 15, [("Paediatric consultation", 700), ("Nebulisation", 900)]),
    _invoice("INV1011", "P1011", "Overdue", -18, -4, [("Emergency assessment", 1500), ("Observation charges", 2200)]),
    _invoice("INV1012", "P1012", "Pending", -2, 9, [("General medicine consultation", 800), ("Chest X-ray", 1600)]),
]


INVENTORY = [
    dict(id="ITM1", name="Paracetamol 500 mg", category="Medicine", quantity=420, unit="tablets", reorder_level=150, supplier="Aarogya Medical Supplies", expiry_date=date_at(210)),
    dict(id="ITM2", name="Cefixime 200 mg", category="Medicine", quantity=36, unit="strips", reorder_level=60, supplier="Swasthik Pharma Distributors", expiry_date=date_at(45)),
    dict(id="ITM3", name="Amoxicillin 500 mg", category="Medicine", quantity=150, unit="capsules", reorder_level=100, supplier="Aarogya Medical Supplies", expiry_date=date_at(150)),
    dict(id="ITM4", name="Human insulin 100 IU/mL", category="Medicine", quantity=18, unit="vials", reorder_level=25, supplier="Bharat LifeCare Pharma", expiry_date=date_at(120)),
    dict(id="ITM5", name="Normal saline 500 mL", category="Medicine", quantity=90, unit="bags", reorder_level=40, supplier="Bharat LifeCare Pharma", expiry_date=date_at(270)),
    dict(id="ITM6", name="Ceftriaxone 1 g", category="Medicine", quantity=22, unit="vials", reorder_level=30, supplier="Swasthik Pharma Distributors", expiry_date=date_at(80)),
    dict(id="ITM7", name="ORS sachets", category="Medicine", quantity=200, unit="sachets", reorder_level=80, supplier="Aarogya Medical Supplies", expiry_date=date_at(320)),
    dict(id="ITM8", name="Enoxaparin 40 mg", category="Medicine", quantity=34, unit="syringes", reorder_level=20, supplier="Bharat LifeCare Pharma", expiry_date=date_at(180)),
    dict(id="ITM9", name="N95 masks", category="Supply", quantity=180, unit="pieces", reorder_level=200, supplier="CareFirst Hospital Supplies", expiry_date=None),
    dict(id="ITM10", name="Sterile surgical gloves", category="Supply", quantity=72, unit="boxes", reorder_level=60, supplier="CareFirst Hospital Supplies", expiry_date=None),
    dict(id="ITM11", name="5 mL syringes", category="Supply", quantity=420, unit="pieces", reorder_level=200, supplier="Aarogya Medical Supplies", expiry_date=None),
    dict(id="ITM12", name="IV cannula 18G", category="Supply", quantity=48, unit="pieces", reorder_level=75, supplier="CareFirst Hospital Supplies", expiry_date=None),
    dict(id="ITM13", name="Sterile gauze rolls", category="Supply", quantity=110, unit="rolls", reorder_level=60, supplier="CareFirst Hospital Supplies", expiry_date=None),
    dict(id="ITM14", name="Oxygen cylinders", category="Supply", quantity=14, unit="cylinders", reorder_level=16, supplier="Deccan Medical Gases", expiry_date=None),
    dict(id="ITM15", name="ECG machine", category="Equipment", quantity=3, unit="units", reorder_level=2, supplier="Swasthik Biomedical", expiry_date=None),
    dict(id="ITM16", name="Patient monitor", category="Equipment", quantity=7, unit="units", reorder_level=3, supplier="Swasthik Biomedical", expiry_date=None),
    dict(id="ITM17", name="Infusion pump", category="Equipment", quantity=8, unit="units", reorder_level=4, supplier="Swasthik Biomedical", expiry_date=None),
    dict(id="ITM18", name="Wheelchair", category="Equipment", quantity=12, unit="units", reorder_level=5, supplier="Swasthik Biomedical", expiry_date=None),
    dict(id="ITM19", name="Defibrillator", category="Equipment", quantity=2, unit="units", reorder_level=2, supplier="Swasthik Biomedical", expiry_date=None),
    dict(id="ITM20", name="Digital thermometers", category="Equipment", quantity=30, unit="units", reorder_level=15, supplier="CareFirst Hospital Supplies", expiry_date=None),
]


ALERTS = [
    dict(id="AL1", severity="Critical", category="Patient", message="Synthetic patient P1006 requires an urgent clinical review.", source="Emergency Triage", department_id="D6", timestamp=timestamp_ago(minutes=18)),
    dict(id="AL2", severity="Warning", category="Inventory", message="N95 mask stock is below the reorder threshold.", source="Central Stores", department_id=None, timestamp=timestamp_ago(hours=1)),
    dict(id="AL3", severity="Warning", category="Equipment", message="Patient monitor PM-04 is due for preventive maintenance.", source="Biomedical Engineering", department_id="D6", timestamp=timestamp_ago(hours=3), acknowledged=True, acknowledged_by="Manoj Kumar"),
    dict(id="AL4", severity="Warning", category="Staff", message="Night-shift nursing coverage is below the planned roster in Emergency.", source="Staff Scheduling", department_id="D6", timestamp=timestamp_ago(hours=4)),
    dict(id="AL5", severity="Info", category="System", message="Routine application maintenance is scheduled for the coming weekend.", source="IT Operations", department_id=None, timestamp=timestamp_ago(hours=6), acknowledged=True, acknowledged_by="Sanjay Bhatt"),
    dict(id="AL6", severity="Warning", category="Inventory", message="Cefixime stock is below reorder level and expires within 60 days.", source="Pharmacy Stores", department_id=None, timestamp=timestamp_ago(hours=8)),
    dict(id="AL7", severity="Critical", category="Patient", message="Synthetic patient P1011 is awaiting emergency assessment.", source="Emergency Triage", department_id="D6", timestamp=timestamp_ago(minutes=42)),
    dict(id="AL8", severity="Info", category="Patient", message="New synthetic patient records were added to the demo environment.", source="Admissions", department_id=None, timestamp=timestamp_ago(hours=12), acknowledged=True, acknowledged_by="Nisha Thomas"),
    dict(id="AL9", severity="Warning", category="Staff", message="Orthopedics has one nurse marked as on leave this shift.", source="Staff Scheduling", department_id="D3", timestamp=timestamp_ago(hours=15), acknowledged=True, acknowledged_by="Dr. Rohan Menon"),
    dict(id="AL10", severity="Warning", category="Equipment", message="Defibrillator inventory is at the minimum reorder threshold.", source="Biomedical Engineering", department_id="D1", timestamp=timestamp_ago(hours=20)),
]
