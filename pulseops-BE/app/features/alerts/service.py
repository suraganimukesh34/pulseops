from sqlalchemy.orm import Session

from app.features.alerts.models import Alert
from app.features.alerts.schemas import AlertCreate, AlertUpdate


def _next_id(db: Session) -> str:
    existing_ids = [a.id for a in db.query(Alert.id).all()]
    max_num = max((int(id_.lstrip("AL")) for id_ in existing_ids), default=0)
    return f"AL{max_num + 1}"


def get_alerts(db: Session) -> list[Alert]:
    return db.query(Alert).all()


def get_alert_by_id(db: Session, alert_id: str) -> Alert | None:
    return db.query(Alert).filter(Alert.id == alert_id).first()


def create_alert(db: Session, alert: AlertCreate) -> Alert:
    new_alert = Alert(id=_next_id(db), **alert.model_dump())
    db.add(new_alert)
    db.commit()
    db.refresh(new_alert)
    return new_alert


def update_alert(db: Session, alert_id: str, alert: AlertUpdate) -> Alert | None:
    existing = get_alert_by_id(db, alert_id)

    if existing is None:
        return None

    for field, value in alert.model_dump().items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing


def acknowledge_alert(db: Session, alert_id: str, acknowledged_by: str) -> Alert | None:
    alert = get_alert_by_id(db, alert_id)

    if alert is None:
        return None

    alert.acknowledged = True
    alert.acknowledged_by = acknowledged_by

    db.commit()
    db.refresh(alert)
    return alert


def delete_alert(db: Session, alert_id: str) -> Alert | None:
    alert = get_alert_by_id(db, alert_id)

    if alert is None:
        return None

    db.delete(alert)
    db.commit()
    return alert
