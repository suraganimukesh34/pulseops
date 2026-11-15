"""Seed demo departments; pass --refresh-demo to update existing D1-D8 fixtures."""

import sys

from app.core.db import SessionLocal
from app.features.departments.models import Department
from seed_data import DEPARTMENTS


def main():
    refresh_demo = "--refresh-demo" in sys.argv[1:]
    db = SessionLocal()
    try:
        existing_rows = {row.id: row for row in db.query(Department).all()}
        if existing_rows and not refresh_demo:
            print("Departments table already has data — skipping. Use --refresh-demo only for this demo dataset.")
            return

        for values in DEPARTMENTS:
            current = existing_rows.get(values["id"])
            if current is None:
                db.add(Department(**values))
                continue
            for field, value in values.items():
                setattr(current, field, value)

        db.commit()
        verb = "Refreshed" if existing_rows else "Seeded"
        print(f"{verb} {len(DEPARTMENTS)} Indian demo departments.")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
