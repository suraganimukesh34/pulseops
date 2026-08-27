from app.core.config import settings
from app.core.db import SessionLocal
from app.core.security import Role, hash_password
from app.features.alerts.models import Alert
from app.features.appointments.models import Appointment
from app.features.beds.models import Bed
from app.features.billing.models import Invoice
from app.features.inventory.models import InventoryItem
from app.features.patients.models import Patient
from app.features.staff.models import Staff
from app.features.users.models import User

db = SessionLocal()


def seed(model, rows):
    if db.query(model).count() > 0:
        print(f"{model.__tablename__} already has data — skipping.")
        return
    for row in rows:
        db.add(model(**row))
    db.commit()
    print(f"Seeded {len(rows)} rows into {model.__tablename__}.")


# ---------- Staff ----------
seed(Staff, [
    dict(id="S101", name="Dr. Sarah Smith", role="Doctor", department_id="D1", specialization="Cardiologist", shift="Morning", status="On Duty", email="sarah.smith@pulseops.ai", phone="555-0101", joined_date="2019-03-01"),
    dict(id="S102", name="Dr. Michael Brown", role="Doctor", department_id="D2", specialization="Neurologist", shift="Morning", status="On Duty", email="michael.brown@pulseops.ai", phone="555-0102", joined_date="2018-06-15"),
    dict(id="S103", name="Dr. David Wilson", role="Doctor", department_id="D3", specialization="Pulmonologist", shift="Evening", status="On Duty", email="david.wilson@pulseops.ai", phone="555-0103", joined_date="2020-01-10"),
    dict(id="S104", name="Dr. James Anderson", role="Doctor", department_id="D4", specialization="Orthopedic Surgeon", shift="Morning", status="Off Duty", email="james.anderson@pulseops.ai", phone="555-0104", joined_date="2017-09-20"),
    dict(id="S105", name="Dr. Emily Davis", role="Doctor", department_id="D5", specialization="General Physician", shift="Morning", status="On Duty", email="emily.davis@pulseops.ai", phone="555-0105", joined_date="2021-02-05"),
    dict(id="S106", name="Dr. Daniel Thomas", role="Doctor", department_id="D6", specialization="Emergency Medicine", shift="Night", status="On Duty", email="daniel.thomas@pulseops.ai", phone="555-0106", joined_date="2019-11-11"),
    dict(id="S107", name="Dr. Christopher Lee", role="Doctor", department_id="D7", specialization="Oncologist", shift="Morning", status="On Duty", email="christopher.lee@pulseops.ai", phone="555-0107", joined_date="2016-04-18"),
    dict(id="S108", name="Dr. Lisa Martin", role="Doctor", department_id="D8", specialization="Geriatrician", shift="Morning", status="On Duty", email="lisa.martin@pulseops.ai", phone="555-0108", joined_date="2020-07-23"),
    dict(id="S109", name="Dr. Robert Clark", role="Doctor", department_id="D6", specialization="Emergency Medicine", shift="Evening", status="On Duty", email="robert.clark@pulseops.ai", phone="555-0109", joined_date="2018-10-02"),
    dict(id="S110", name="Dr. Angela Perez", role="Doctor", department_id="D1", specialization="Cardiologist", shift="Evening", status="Off Duty", email="angela.perez@pulseops.ai", phone="555-0110", joined_date="2022-01-15"),
    dict(id="S111", name="Karen White", role="Nurse", department_id="D1", specialization="Cardiac Care", shift="Morning", status="On Duty", email="karen.white@pulseops.ai", phone="555-0111", joined_date="2019-05-01"),
    dict(id="S112", name="Linda Harris", role="Nurse", department_id="D2", specialization="Neuro Care", shift="Morning", status="On Duty", email="linda.harris@pulseops.ai", phone="555-0112", joined_date="2020-03-12"),
    dict(id="S113", name="Patricia Clark", role="Nurse", department_id="D6", specialization="Emergency Care", shift="Night", status="On Duty", email="patricia.clark@pulseops.ai", phone="555-0113", joined_date="2021-08-09"),
    dict(id="S114", name="Nancy Lewis", role="Nurse", department_id="D4", specialization="Orthopedic Care", shift="Morning", status="On Duty", email="nancy.lewis@pulseops.ai", phone="555-0114", joined_date="2018-12-01"),
    dict(id="S115", name="Betty Walker", role="Nurse", department_id="D7", specialization="Oncology Care", shift="Night", status="On Duty", email="betty.walker@pulseops.ai", phone="555-0115", joined_date="2019-09-17"),
    dict(id="S116", name="Mark Young", role="Technician", department_id="D3", specialization="Respiratory Therapy", shift="Morning", status="On Duty", email="mark.young@pulseops.ai", phone="555-0116", joined_date="2021-06-04"),
    dict(id="S117", name="Kevin Hall", role="Technician", department_id="D6", specialization="Radiology", shift="Evening", status="On Duty", email="kevin.hall@pulseops.ai", phone="555-0117", joined_date="2020-10-28"),
    dict(id="S118", name="Susan King", role="Admin", department_id="D5", specialization="Ward Administration", shift="Morning", status="On Duty", email="susan.king@pulseops.ai", phone="555-0118", joined_date="2017-02-14"),
    dict(id="S119", name="Paul Wright", role="Admin", department_id="D8", specialization="Ward Administration", shift="Morning", status="On Duty", email="paul.wright@pulseops.ai", phone="555-0119", joined_date="2019-04-22"),
    dict(id="S120", name="Jessica Scott", role="Nurse", department_id="D5", specialization="General Care", shift="Morning", status="On Leave", email="jessica.scott@pulseops.ai", phone="555-0120", joined_date="2022-05-30"),
])

# ---------- Appointments ----------
seed(Appointment, [
    dict(id="AP1", patient_id="P1001", patient_name="John Doe", doctor_id="S101", doctor_name="Dr. Sarah Smith", department_id="D1", date="2026-08-25", time="09:00", status="Scheduled", reason="Follow-up for chest pain"),
    dict(id="AP2", patient_id="P1002", patient_name="Emily Johnson", doctor_id="S102", doctor_name="Dr. Michael Brown", department_id="D2", date="2026-08-25", time="10:30", status="Scheduled", reason="Migraine review"),
    dict(id="AP3", patient_id="P1003", patient_name="Robert Williams", doctor_id="S103", doctor_name="Dr. David Wilson", department_id="D3", date="2026-08-24", time="14:00", status="Completed", reason="Pneumonia follow-up"),
    dict(id="AP4", patient_id="P1004", patient_name="Sophia Martinez", doctor_id="S104", doctor_name="Dr. James Anderson", department_id="D4", date="2026-08-23", time="11:00", status="Completed", reason="Wrist cast check"),
    dict(id="AP5", patient_id="P1005", patient_name="David Miller", doctor_id="S105", doctor_name="Dr. Emily Davis", department_id="D5", date="2026-08-26", time="09:30", status="Scheduled", reason="Viral infection recheck"),
    dict(id="AP6", patient_id="P1006", patient_name="Olivia Taylor", doctor_id="S106", doctor_name="Dr. Daniel Thomas", department_id="D6", date="2026-08-25", time="08:00", status="Completed", reason="Abdominal pain ER visit"),
    dict(id="AP7", patient_id="P1007", patient_name="William Anderson", doctor_id="S101", doctor_name="Dr. Sarah Smith", department_id="D1", date="2026-08-27", time="13:00", status="Scheduled", reason="Hypertension review"),
    dict(id="AP8", patient_id="P1008", patient_name="Ava Thomas", doctor_id="S107", doctor_name="Dr. Christopher Lee", department_id="D7", date="2026-08-26", time="15:00", status="Scheduled", reason="Lymphoma treatment review"),
    dict(id="AP9", patient_id="P1009", patient_name="James Wilson", doctor_id="S108", doctor_name="Dr. Lisa Martin", department_id="D8", date="2026-08-28", time="10:00", status="Scheduled", reason="Dehydration follow-up"),
    dict(id="AP10", patient_id="P1010", patient_name="Mia Garcia", doctor_id="S109", doctor_name="Dr. Robert Clark", department_id="D6", date="2026-08-25", time="07:30", status="Completed", reason="Asthma ER visit"),
    dict(id="AP11", patient_id="P1001", patient_name="John Doe", doctor_id="S110", doctor_name="Dr. Angela Perez", department_id="D1", date="2026-08-30", time="09:00", status="Scheduled", reason="Cardiology second opinion"),
    dict(id="AP12", patient_id="P1003", patient_name="Robert Williams", doctor_id="S103", doctor_name="Dr. David Wilson", department_id="D3", date="2026-08-19", time="09:00", status="No-show", reason="Routine checkup"),
    dict(id="AP13", patient_id="P1004", patient_name="Sophia Martinez", doctor_id="S104", doctor_name="Dr. James Anderson", department_id="D4", date="2026-08-29", time="11:00", status="Cancelled", reason="Physical therapy consult"),
    dict(id="AP14", patient_id="P1002", patient_name="Emily Johnson", doctor_id="S102", doctor_name="Dr. Michael Brown", department_id="D2", date="2026-08-31", time="10:00", status="Scheduled", reason="Neurology check-in"),
    dict(id="AP15", patient_id="P1005", patient_name="David Miller", doctor_id="S105", doctor_name="Dr. Emily Davis", department_id="D5", date="2026-08-22", time="09:00", status="Completed", reason="Initial consultation"),
])

# ---------- Beds ----------
seed(Bed, [
    dict(id="B1", department_id="D1", bed_number="A-01", status="Available"),
    dict(id="B2", department_id="D1", bed_number="A-02", status="Available"),
    dict(id="B3", department_id="D1", bed_number="A-12", status="Occupied", patient_id="P1001", admitted_date="2026-08-15"),
    dict(id="B4", department_id="D1", bed_number="A-18", status="Occupied", patient_id="P1007", admitted_date="2026-08-12"),
    dict(id="B5", department_id="D1", bed_number="A-19", status="Cleaning"),
    dict(id="B6", department_id="D2", bed_number="B-01", status="Available"),
    dict(id="B7", department_id="D2", bed_number="B-02", status="Available"),
    dict(id="B8", department_id="D2", bed_number="B-08", status="Occupied", patient_id="P1002", admitted_date="2026-08-18"),
    dict(id="B9", department_id="D2", bed_number="B-03", status="Maintenance"),
    dict(id="B10", department_id="D2", bed_number="B-09", status="Cleaning"),
    dict(id="B11", department_id="D3", bed_number="E-01", status="Available"),
    dict(id="B12", department_id="D3", bed_number="E-02", status="Available"),
    dict(id="B13", department_id="D3", bed_number="A-15", status="Occupied", patient_id="P1003", admitted_date="2026-08-14"),
    dict(id="B14", department_id="D3", bed_number="E-04", status="Cleaning"),
    dict(id="B15", department_id="D3", bed_number="E-05", status="Available"),
    dict(id="B16", department_id="D4", bed_number="C-01", status="Available"),
    dict(id="B17", department_id="D4", bed_number="C-02", status="Available"),
    dict(id="B18", department_id="D4", bed_number="C-04", status="Occupied", patient_id="P1004", admitted_date="2026-08-19"),
    dict(id="B19", department_id="D4", bed_number="C-03", status="Maintenance"),
    dict(id="B20", department_id="D4", bed_number="C-05", status="Available"),
    dict(id="B21", department_id="D5", bed_number="B-15", status="Available"),
    dict(id="B22", department_id="D5", bed_number="B-16", status="Available"),
    dict(id="B23", department_id="D5", bed_number="B-14", status="Occupied", patient_id="P1005", admitted_date="2026-08-16"),
    dict(id="B24", department_id="D5", bed_number="B-17", status="Cleaning"),
    dict(id="B25", department_id="D5", bed_number="B-18", status="Available"),
    dict(id="B26", department_id="D6", bed_number="ER-01", status="Available"),
    dict(id="B27", department_id="D6", bed_number="ER-02", status="Available"),
    dict(id="B28", department_id="D6", bed_number="ER-03", status="Occupied", patient_id="P1006", admitted_date="2026-08-20"),
    dict(id="B29", department_id="D6", bed_number="ER-07", status="Occupied", patient_id="P1010", admitted_date="2026-08-20"),
    dict(id="B30", department_id="D6", bed_number="ER-04", status="Available"),
    dict(id="B31", department_id="D6", bed_number="ER-05", status="Cleaning"),
    dict(id="B32", department_id="D6", bed_number="ER-06", status="Maintenance"),
    dict(id="B33", department_id="D6", bed_number="ER-08", status="Available"),
    dict(id="B34", department_id="D7", bed_number="D-01", status="Available"),
    dict(id="B35", department_id="D7", bed_number="D-02", status="Available"),
    dict(id="B36", department_id="D7", bed_number="D-07", status="Occupied", patient_id="P1008", admitted_date="2026-08-10"),
    dict(id="B37", department_id="D7", bed_number="D-03", status="Cleaning"),
    dict(id="B38", department_id="D8", bed_number="F-01", status="Available"),
    dict(id="B39", department_id="D8", bed_number="F-02", status="Available"),
    dict(id="B40", department_id="D8", bed_number="C-11", status="Occupied", patient_id="P1009", admitted_date="2026-08-17"),
    dict(id="B41", department_id="D8", bed_number="F-03", status="Maintenance"),
])

# ---------- Inventory ----------
seed(InventoryItem, [
    dict(id="ITM1", name="Amoxicillin 500mg", category="Medicine", quantity=40, unit="tablets", reorder_level=100, supplier="MedSupply Co.", expiry_date="2027-01-15"),
    dict(id="ITM2", name="Paracetamol 500mg", category="Medicine", quantity=500, unit="tablets", reorder_level=150, supplier="MedSupply Co.", expiry_date="2027-06-01"),
    dict(id="ITM3", name="Insulin (Rapid)", category="Medicine", quantity=25, unit="vials", reorder_level=30, supplier="PharmaDirect", expiry_date="2026-12-01"),
    dict(id="ITM4", name="Ibuprofen 200mg", category="Medicine", quantity=300, unit="tablets", reorder_level=100, supplier="MedSupply Co.", expiry_date="2027-03-20"),
    dict(id="ITM5", name="Saline IV Solution", category="Medicine", quantity=80, unit="bags", reorder_level=50, supplier="PharmaDirect", expiry_date="2026-11-10"),
    dict(id="ITM6", name="Morphine 10mg", category="Medicine", quantity=15, unit="ampoules", reorder_level=20, supplier="ControlledRx Inc.", expiry_date="2026-10-05"),
    dict(id="ITM7", name="Surgical Gloves (Box)", category="Supply", quantity=60, unit="boxes", reorder_level=40, supplier="SafeHands Ltd."),
    dict(id="ITM8", name="Surgical Masks (Box)", category="Supply", quantity=20, unit="boxes", reorder_level=50, supplier="SafeHands Ltd."),
    dict(id="ITM9", name="Syringes 5ml", category="Supply", quantity=400, unit="units", reorder_level=200, supplier="MedSupply Co."),
    dict(id="ITM10", name="Gauze Rolls", category="Supply", quantity=150, unit="rolls", reorder_level=80, supplier="SafeHands Ltd."),
    dict(id="ITM11", name="Ventilator", category="Equipment", quantity=6, unit="units", reorder_level=2, supplier="BioMed Systems"),
    dict(id="ITM12", name="Infusion Pump", category="Equipment", quantity=10, unit="units", reorder_level=4, supplier="BioMed Systems"),
    dict(id="ITM13", name="ECG Machine", category="Equipment", quantity=4, unit="units", reorder_level=2, supplier="BioMed Systems"),
    dict(id="ITM14", name="Wheelchairs", category="Equipment", quantity=12, unit="units", reorder_level=5, supplier="MobilityPlus"),
    dict(id="ITM15", name="Defibrillator", category="Equipment", quantity=3, unit="units", reorder_level=2, supplier="BioMed Systems"),
    dict(id="ITM16", name="Antiseptic Solution", category="Medicine", quantity=45, unit="bottles", reorder_level=30, supplier="PharmaDirect", expiry_date="2027-02-14"),
    dict(id="ITM17", name="Oxygen Cylinders", category="Supply", quantity=18, unit="units", reorder_level=15, supplier="GasMed Supplies"),
    dict(id="ITM18", name="Blood Pressure Cuffs", category="Equipment", quantity=25, unit="units", reorder_level=10, supplier="MobilityPlus"),
    dict(id="ITM19", name="Thermometers (Digital)", category="Equipment", quantity=30, unit="units", reorder_level=15, supplier="MobilityPlus"),
    dict(id="ITM20", name="Cotton Swabs (Pack)", category="Supply", quantity=100, unit="packs", reorder_level=60, supplier="SafeHands Ltd."),
])

# ---------- Invoices ----------
def _items(pairs):
    return [{"description": d, "amount": a} for d, a in pairs]


def _total(pairs):
    return round(sum(a for _, a in pairs), 2)


invoice_defs = [
    ("INV1", "P1001", "John Doe", [("Cardiology Consultation", 250.0), ("ECG Test", 120.0)], "Paid", "2026-08-15", "2026-08-22"),
    ("INV2", "P1002", "Emily Johnson", [("Neurology Consultation", 200.0), ("MRI Scan", 650.0)], "Pending", "2026-08-18", "2026-08-28"),
    ("INV3", "P1003", "Robert Williams", [("Pulmonology Consultation", 220.0), ("Chest X-Ray", 150.0), ("Antibiotics", 80.0)], "Overdue", "2026-08-14", "2026-08-21"),
    ("INV4", "P1004", "Sophia Martinez", [("Orthopedic Consultation", 180.0), ("Wrist X-Ray", 130.0), ("Cast Application", 90.0)], "Paid", "2026-08-19", "2026-08-26"),
    ("INV5", "P1005", "David Miller", [("General Consultation", 150.0), ("Blood Test", 60.0)], "Pending", "2026-08-16", "2026-08-23"),
    ("INV6", "P1006", "Olivia Taylor", [("ER Visit", 300.0), ("Abdominal Ultrasound", 200.0)], "Pending", "2026-08-20", "2026-08-27"),
    ("INV7", "P1007", "William Anderson", [("Cardiology Consultation", 250.0), ("Blood Pressure Monitoring", 50.0)], "Overdue", "2026-08-12", "2026-08-19"),
    ("INV8", "P1008", "Ava Thomas", [("Oncology Consultation", 280.0), ("Chemotherapy Session", 1200.0)], "Pending", "2026-08-10", "2026-08-24"),
    ("INV9", "P1009", "James Wilson", [("Geriatric Consultation", 160.0), ("IV Fluids", 70.0)], "Paid", "2026-08-17", "2026-08-24"),
    ("INV10", "P1010", "Mia Garcia", [("ER Visit", 300.0), ("Nebulizer Treatment", 90.0)], "Pending", "2026-08-20", "2026-08-27"),
    ("INV11", "P1001", "John Doe", [("Follow-up Consultation", 120.0)], "Pending", "2026-08-24", "2026-09-03"),
    ("INV12", "P1003", "Robert Williams", [("Follow-up X-Ray", 150.0)], "Pending", "2026-08-24", "2026-09-03"),
    ("INV13", "P1008", "Ava Thomas", [("Lab Panel", 95.0)], "Paid", "2026-08-20", "2026-08-27"),
    ("INV14", "P1005", "David Miller", [("Prescription Refill", 40.0)], "Paid", "2026-08-21", "2026-08-28"),
    ("INV15", "P1002", "Emily Johnson", [("Follow-up Consultation", 120.0)], "Overdue", "2026-08-19", "2026-08-26"),
]

seed(Invoice, [
    dict(id=i, patient_id=pid, patient_name=pname, items=_items(pairs),
         total_amount=_total(pairs), status=status, issued_date=issued, due_date=due)
    for i, pid, pname, pairs, status, issued, due in invoice_defs
])

# ---------- Alerts ----------
seed(Alert, [
    dict(id="AL1", severity="Critical", category="Patient", message="Patient P1001 vitals unstable - immediate attention required", source="Cardiac Monitor", department_id="D1", timestamp="2026-08-25T07:15:00"),
    dict(id="AL2", severity="Critical", category="Patient", message="Patient P1006 showing signs of deterioration", source="ER Triage", department_id="D6", timestamp="2026-08-25T06:40:00"),
    dict(id="AL3", severity="Warning", category="Equipment", message="Ventilator #4 due for maintenance", source="Biomedical Engineering", department_id="D6", timestamp="2026-08-24T18:00:00"),
    dict(id="AL4", severity="Warning", category="Staff", message="ICU understaffed for night shift", source="Staff Scheduling", department_id="D6", timestamp="2026-08-24T20:00:00", acknowledged=True, acknowledged_by="Dr. Daniel Thomas"),
    dict(id="AL5", severity="Info", category="System", message="Scheduled system maintenance tonight 2AM-3AM", source="IT Operations", department_id=None, timestamp="2026-08-24T09:00:00", acknowledged=True, acknowledged_by="System Administrator"),
    dict(id="AL6", severity="Warning", category="Inventory", message="Amoxicillin stock below reorder level", source="Pharmacy", department_id=None, timestamp="2026-08-25T05:30:00"),
    dict(id="AL7", severity="Critical", category="Equipment", message="MRI Machine #2 offline", source="Radiology", department_id="D2", timestamp="2026-08-25T04:00:00"),
    dict(id="AL8", severity="Info", category="Patient", message="10 new patient admissions today", source="Admissions", department_id=None, timestamp="2026-08-25T00:05:00", acknowledged=True, acknowledged_by="Front Desk"),
    dict(id="AL9", severity="Warning", category="Staff", message="Dr. James Anderson on leave - Orthopedics coverage reduced", source="Staff Scheduling", department_id="D4", timestamp="2026-08-23T08:00:00", acknowledged=True, acknowledged_by="System Administrator"),
    dict(id="AL10", severity="Critical", category="Patient", message="Patient P1010 oxygen saturation dropping", source="ER Monitor", department_id="D6", timestamp="2026-08-25T08:10:00"),
])

# ---------- Patients ----------
seed(Patient, [
    dict(id="P1001", name="John Doe", age=64, gender="Male", department="Cardiology", ward="Ward A", bed="A-12", status="Critical", priority="High", admission_date="2026-08-15", expected_discharge_date="2026-08-22", attending_doctor="Dr. Sarah Smith", diagnosis="Chest pain", symptoms="Chest discomfort and shortness of breath", contact_number="555-2001", blood_group="O+"),
    dict(id="P1002", name="Emily Johnson", age=42, gender="Female", department="Neurology", ward="Ward B", bed="B-08", status="Stable", priority="Medium", admission_date="2026-08-18", expected_discharge_date="2026-08-24", attending_doctor="Dr. Michael Brown", diagnosis="Migraine", symptoms="Severe headache and sensitivity to light", contact_number="555-2002", blood_group="A+"),
    dict(id="P1003", name="Robert Williams", age=71, gender="Male", department="Pulmonology", ward="Ward A", bed="A-15", status="Critical", priority="High", admission_date="2026-08-14", expected_discharge_date="2026-08-25", attending_doctor="Dr. David Wilson", diagnosis="Pneumonia", symptoms="Difficulty breathing and persistent cough", contact_number="555-2003", blood_group="B+"),
    dict(id="P1004", name="Sophia Martinez", age=35, gender="Female", department="Orthopedics", ward="Ward C", bed="C-04", status="Stable", priority="Low", admission_date="2026-08-19", expected_discharge_date="2026-08-23", attending_doctor="Dr. James Anderson", diagnosis="Fractured wrist", symptoms="Wrist pain and swelling", contact_number="555-2004", blood_group="AB+"),
    dict(id="P1005", name="David Miller", age=58, gender="Male", department="General Medicine", ward="Ward B", bed="B-14", status="Waiting", priority="Medium", admission_date="2026-08-16", expected_discharge_date="2026-08-21", attending_doctor="Dr. Emily Davis", diagnosis="Viral infection", symptoms="Fever, fatigue and body aches", contact_number="555-2005", blood_group="O-"),
    dict(id="P1006", name="Olivia Taylor", age=29, gender="Female", department="Emergency", ward="Emergency", bed="ER-03", status="Critical", priority="High", admission_date="2026-08-20", expected_discharge_date="2026-08-23", attending_doctor="Dr. Daniel Thomas", diagnosis="Acute abdominal pain", symptoms="Severe abdominal pain and nausea", contact_number="555-2006", blood_group="A-"),
    dict(id="P1007", name="William Anderson", age=67, gender="Male", department="Cardiology", ward="Ward A", bed="A-18", status="Waiting", priority="Medium", admission_date="2026-08-12", expected_discharge_date="2026-08-21", attending_doctor="Dr. Sarah Smith", diagnosis="Hypertension", symptoms="Dizziness and elevated blood pressure", contact_number="555-2007", blood_group="B-"),
    dict(id="P1008", name="Ava Thomas", age=51, gender="Female", department="Oncology", ward="Ward D", bed="D-07", status="Stable", priority="High", admission_date="2026-08-10", expected_discharge_date="2026-08-27", attending_doctor="Dr. Christopher Lee", diagnosis="Lymphoma", symptoms="Fatigue and reduced appetite", contact_number="555-2008", blood_group="AB-"),
    dict(id="P1009", name="James Wilson", age=76, gender="Male", department="Geriatrics", ward="Ward C", bed="C-11", status="Stable", priority="Medium", admission_date="2026-08-17", expected_discharge_date="2026-08-26", attending_doctor="Dr. Lisa Martin", diagnosis="Dehydration", symptoms="Weakness and dizziness", contact_number="555-2009", blood_group="O+"),
    dict(id="P1010", name="Mia Garcia", age=46, gender="Female", department="Emergency", ward="Emergency", bed="ER-07", status="Critical", priority="High", admission_date="2026-08-20", expected_discharge_date="2026-08-23", attending_doctor="Dr. Robert Clark", diagnosis="Severe asthma", symptoms="Breathing difficulty and wheezing", contact_number="555-2010", blood_group="A+"),
])

# ---------- Users ----------
seed(User, [
    dict(id="U1", name="System Administrator", email=settings.dev_admin_email, hashed_password=hash_password(settings.dev_admin_password), role=Role.ADMIN, staff_id=None, active=True),
    dict(id="U2", name="Dr. Sarah Smith", email="doctor1@pulseops.ai", hashed_password=hash_password("Doctor@123"), role=Role.DOCTOR, staff_id="S101", active=True),
    dict(id="U3", name="Dr. Daniel Thomas", email="doctor2@pulseops.ai", hashed_password=hash_password("Doctor@123"), role=Role.DOCTOR, staff_id="S106", active=True),
    dict(id="U4", name="Karen White", email="nurse1@pulseops.ai", hashed_password=hash_password("Nurse@123"), role=Role.NURSE, staff_id="S111", active=True),
    dict(id="U5", name="Front Desk", email="frontdesk@pulseops.ai", hashed_password=hash_password("Reception@123"), role=Role.RECEPTIONIST, staff_id=None, active=True),
])

db.close()
print("Done.")
