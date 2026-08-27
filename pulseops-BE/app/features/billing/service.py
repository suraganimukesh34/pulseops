from sqlalchemy.orm import Session

from app.features.billing.models import Invoice
from app.features.billing.schemas import InvoiceCreate, InvoiceUpdate


def _next_id(db: Session) -> str:
    existing_ids = [i.id for i in db.query(Invoice.id).all()]
    max_num = max((int(id_.lstrip("INV")) for id_ in existing_ids), default=0)
    return f"INV{max_num + 1}"


def get_invoices(db: Session) -> list[Invoice]:
    return db.query(Invoice).all()


def get_invoice_by_id(db: Session, invoice_id: str) -> Invoice | None:
    return db.query(Invoice).filter(Invoice.id == invoice_id).first()


def create_invoice(db: Session, invoice: InvoiceCreate) -> Invoice:
    total = round(sum(item.amount for item in invoice.items), 2)
    new_invoice = Invoice(id=_next_id(db), total_amount=total, **invoice.model_dump())
    db.add(new_invoice)
    db.commit()
    db.refresh(new_invoice)
    return new_invoice


def update_invoice(db: Session, invoice_id: str, invoice: InvoiceUpdate) -> Invoice | None:
    existing = get_invoice_by_id(db, invoice_id)

    if existing is None:
        return None

    total = round(sum(item.amount for item in invoice.items), 2)

    for field, value in invoice.model_dump().items():
        setattr(existing, field, value)

    existing.total_amount = total

    db.commit()
    db.refresh(existing)
    return existing


def mark_invoice_paid(db: Session, invoice_id: str) -> Invoice | None:
    invoice = get_invoice_by_id(db, invoice_id)

    if invoice is None:
        return None

    invoice.status = "Paid"

    db.commit()
    db.refresh(invoice)
    return invoice


def delete_invoice(db: Session, invoice_id: str) -> Invoice | None:
    invoice = get_invoice_by_id(db, invoice_id)

    if invoice is None:
        return None

    db.delete(invoice)
    db.commit()
    return invoice
