from app.features.alerts.schemas import AlertCreate, AlertResponse, AlertUpdate


def _alert(id, severity, category, message, source, department_id, timestamp, acknowledged=False, acknowledged_by=None):
    return AlertResponse(
        id=id, severity=severity, category=category, message=message, source=source,
        department_id=department_id, timestamp=timestamp, acknowledged=acknowledged,
        acknowledged_by=acknowledged_by,
    )


alerts: list[AlertResponse] = [
    _alert("AL1", "Critical", "Patient", "Patient P1001 vitals unstable - immediate attention required", "Cardiac Monitor", "D1", "2026-08-25T07:15:00"),
    _alert("AL2", "Critical", "Patient", "Patient P1006 showing signs of deterioration", "ER Triage", "D6", "2026-08-25T06:40:00"),
    _alert("AL3", "Warning", "Equipment", "Ventilator #4 due for maintenance", "Biomedical Engineering", "D6", "2026-08-24T18:00:00"),
    _alert("AL4", "Warning", "Staff", "ICU understaffed for night shift", "Staff Scheduling", "D6", "2026-08-24T20:00:00", True, "Dr. Daniel Thomas"),
    _alert("AL5", "Info", "System", "Scheduled system maintenance tonight 2AM-3AM", "IT Operations", None, "2026-08-24T09:00:00", True, "System Administrator"),
    _alert("AL6", "Warning", "Inventory", "Amoxicillin stock below reorder level", "Pharmacy", None, "2026-08-25T05:30:00"),
    _alert("AL7", "Critical", "Equipment", "MRI Machine #2 offline", "Radiology", "D2", "2026-08-25T04:00:00"),
    _alert("AL8", "Info", "Patient", "10 new patient admissions today", "Admissions", None, "2026-08-25T00:05:00", True, "Front Desk"),
    _alert("AL9", "Warning", "Staff", "Dr. James Anderson on leave - Orthopedics coverage reduced", "Staff Scheduling", "D4", "2026-08-23T08:00:00", True, "System Administrator"),
    _alert("AL10", "Critical", "Patient", "Patient P1010 oxygen saturation dropping", "ER Monitor", "D6", "2026-08-25T08:10:00"),
]

_next_seq = len(alerts) + 1


def _next_id() -> str:
    global _next_seq
    alert_id = f"AL{_next_seq}"
    _next_seq += 1
    return alert_id


def get_alerts() -> list[AlertResponse]:
    return alerts


def get_alert_by_id(alert_id: str) -> AlertResponse | None:
    return next((a for a in alerts if a.id == alert_id), None)


def create_alert(alert: AlertCreate) -> AlertResponse:
    new_alert = AlertResponse(id=_next_id(), **alert.model_dump())
    alerts.append(new_alert)
    return new_alert


def update_alert(alert_id: str, alert: AlertUpdate) -> AlertResponse | None:
    existing = get_alert_by_id(alert_id)

    if existing is None:
        return None

    for field, value in alert.model_dump().items():
        setattr(existing, field, value)

    return existing


def acknowledge_alert(alert_id: str, acknowledged_by: str) -> AlertResponse | None:
    alert = get_alert_by_id(alert_id)

    if alert is None:
        return None

    alert.acknowledged = True
    alert.acknowledged_by = acknowledged_by

    return alert


def delete_alert(alert_id: str) -> AlertResponse | None:
    alert = get_alert_by_id(alert_id)

    if alert is None:
        return None

    alerts.remove(alert)
    return alert
