"""Load synthetic Indian hospital demo data into empty feature tables.

This script never creates accounts and skips any table that already has data.
The fixtures are fictional and for local demos only; do not use them for care.
"""

from app.core.db import SessionLocal
from app.features.alerts.models import Alert
from app.features.appointments.models import Appointment
from app.features.beds.models import Bed
from app.features.billing.models import Invoice
from app.features.inventory.models import InventoryItem
from app.features.patients.models import Patient
from app.features.staff.models import Staff
from seed_data import ALERTS, APPOINTMENTS, BEDS, INVOICES, INVENTORY, PATIENTS, STAFF


def seed(db, model, rows):
    if db.query(model).count() > 0:
        print(f"{model.__tablename__} already has data — skipping.")
        return

    db.add_all(model(**row) for row in rows)
    db.commit()
    print(f"Seeded {len(rows)} rows into {model.__tablename__}.")


def main():
    db = SessionLocal()
    try:
        for model, rows in (
            (Staff, STAFF),
            (Patient, PATIENTS),
            (Bed, BEDS),
            (Appointment, APPOINTMENTS),
            (Invoice, INVOICES),
            (InventoryItem, INVENTORY),
            (Alert, ALERTS),
        ):
            seed(db, model, rows)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()

    print("Demo data loaded. Existing users and settings were not changed.")


if __name__ == "__main__":
    main()
