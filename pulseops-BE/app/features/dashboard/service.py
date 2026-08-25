from datetime import date

from app.features.alerts.service import get_alerts
from app.features.appointments.service import get_appointments
from app.features.beds.service import get_beds
from app.features.billing.service import get_invoices
from app.features.dashboard.schemas import DashboardSummary, DepartmentLoad
from app.features.departments.service import get_departments
from app.features.inventory.service import get_items
from app.features.patients.service import get_patients
from app.features.staff.service import get_staff


def get_dashboard_summary() -> DashboardSummary:
    patients = get_patients()
    beds = get_beds()
    staff = get_staff()
    appointments = get_appointments()
    alerts = get_alerts()
    invoices = get_invoices()
    items = get_items()
    departments = get_departments()

    total_beds = len(beds)
    occupied_beds = sum(1 for b in beds if b.status == "Occupied")
    available_beds = sum(1 for b in beds if b.status == "Available")

    unacknowledged_alerts = [a for a in alerts if not a.acknowledged]
    critical_alerts = sum(1 for a in unacknowledged_alerts if a.severity == "Critical")
    warning_alerts = sum(1 for a in unacknowledged_alerts if a.severity == "Warning")

    if critical_alerts > 0:
        hospital_status = "Critical"
    elif warning_alerts > 2:
        hospital_status = "Elevated"
    else:
        hospital_status = "Normal"

    today = date.today().isoformat()

    department_load = []
    for dept in departments:
        dept_beds = [b for b in beds if b.department_id == dept.id]
        dept_occupied = sum(1 for b in dept_beds if b.status == "Occupied")
        dept_patients = sum(1 for p in patients if p.department == dept.name)
        capacity = dept.bed_capacity or 1
        department_load.append(
            DepartmentLoad(
                department_id=dept.id,
                department_name=dept.name,
                patient_count=dept_patients,
                bed_capacity=dept.bed_capacity,
                occupied_beds=dept_occupied,
                load_percentage=round((dept_occupied / capacity) * 100, 1),
            )
        )

    return DashboardSummary(
        total_patients=len(patients),
        critical_patients=sum(1 for p in patients if p.status == "Critical"),
        total_beds=total_beds,
        available_beds=available_beds,
        occupied_beds=occupied_beds,
        bed_occupancy_rate=round((occupied_beds / total_beds) * 100, 1) if total_beds else 0.0,
        staff_total=len(staff),
        staff_on_duty=sum(1 for s in staff if s.status == "On Duty"),
        appointments_today=sum(1 for a in appointments if a.date == today),
        active_alerts=len(unacknowledged_alerts),
        critical_alerts=critical_alerts,
        er_queue=sum(
            1 for p in patients if p.department == "Emergency" and p.status in ("Critical", "Waiting")
        ),
        pending_billing_total=round(
            sum(i.total_amount for i in invoices if i.status in ("Pending", "Overdue")), 2
        ),
        overdue_invoices=sum(1 for i in invoices if i.status == "Overdue"),
        low_stock_items=sum(1 for i in items if i.quantity < i.reorder_level),
        hospital_status=hospital_status,
        department_load=department_load,
    )
