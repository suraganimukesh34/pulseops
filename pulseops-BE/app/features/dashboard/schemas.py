from pydantic import BaseModel


class DepartmentLoad(BaseModel):
    department_id: str
    department_name: str
    patient_count: int
    bed_capacity: int
    occupied_beds: int
    load_percentage: float


class DashboardSummary(BaseModel):
    total_patients: int
    critical_patients: int
    total_beds: int
    available_beds: int
    occupied_beds: int
    bed_occupancy_rate: float
    staff_total: int
    staff_on_duty: int
    appointments_today: int
    active_alerts: int
    critical_alerts: int
    er_queue: int
    pending_billing_total: float
    overdue_invoices: int
    low_stock_items: int
    hospital_status: str  # Normal | Elevated | Critical
    department_load: list[DepartmentLoad]
