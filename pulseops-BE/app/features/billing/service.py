from app.features.billing.schemas import InvoiceCreate, InvoiceItem, InvoiceResponse, InvoiceUpdate


def _invoice(id, patient_id, patient_name, items, status, issued_date, due_date):
    invoice_items = [InvoiceItem(description=d, amount=a) for d, a in items]
    return InvoiceResponse(
        id=id, patient_id=patient_id, patient_name=patient_name, items=invoice_items,
        total_amount=round(sum(i.amount for i in invoice_items), 2), status=status,
        issued_date=issued_date, due_date=due_date,
    )


invoices: list[InvoiceResponse] = [
    _invoice("INV1", "P1001", "John Doe", [("Cardiology Consultation", 250.0), ("ECG Test", 120.0)], "Paid", "2026-08-15", "2026-08-22"),
    _invoice("INV2", "P1002", "Emily Johnson", [("Neurology Consultation", 200.0), ("MRI Scan", 650.0)], "Pending", "2026-08-18", "2026-08-28"),
    _invoice("INV3", "P1003", "Robert Williams", [("Pulmonology Consultation", 220.0), ("Chest X-Ray", 150.0), ("Antibiotics", 80.0)], "Overdue", "2026-08-14", "2026-08-21"),
    _invoice("INV4", "P1004", "Sophia Martinez", [("Orthopedic Consultation", 180.0), ("Wrist X-Ray", 130.0), ("Cast Application", 90.0)], "Paid", "2026-08-19", "2026-08-26"),
    _invoice("INV5", "P1005", "David Miller", [("General Consultation", 150.0), ("Blood Test", 60.0)], "Pending", "2026-08-16", "2026-08-23"),
    _invoice("INV6", "P1006", "Olivia Taylor", [("ER Visit", 300.0), ("Abdominal Ultrasound", 200.0)], "Pending", "2026-08-20", "2026-08-27"),
    _invoice("INV7", "P1007", "William Anderson", [("Cardiology Consultation", 250.0), ("Blood Pressure Monitoring", 50.0)], "Overdue", "2026-08-12", "2026-08-19"),
    _invoice("INV8", "P1008", "Ava Thomas", [("Oncology Consultation", 280.0), ("Chemotherapy Session", 1200.0)], "Pending", "2026-08-10", "2026-08-24"),
    _invoice("INV9", "P1009", "James Wilson", [("Geriatric Consultation", 160.0), ("IV Fluids", 70.0)], "Paid", "2026-08-17", "2026-08-24"),
    _invoice("INV10", "P1010", "Mia Garcia", [("ER Visit", 300.0), ("Nebulizer Treatment", 90.0)], "Pending", "2026-08-20", "2026-08-27"),
    _invoice("INV11", "P1001", "John Doe", [("Follow-up Consultation", 120.0)], "Pending", "2026-08-24", "2026-09-03"),
    _invoice("INV12", "P1003", "Robert Williams", [("Follow-up X-Ray", 150.0)], "Pending", "2026-08-24", "2026-09-03"),
    _invoice("INV13", "P1008", "Ava Thomas", [("Lab Panel", 95.0)], "Paid", "2026-08-20", "2026-08-27"),
    _invoice("INV14", "P1005", "David Miller", [("Prescription Refill", 40.0)], "Paid", "2026-08-21", "2026-08-28"),
    _invoice("INV15", "P1002", "Emily Johnson", [("Follow-up Consultation", 120.0)], "Overdue", "2026-08-19", "2026-08-26"),
]

_next_seq = len(invoices) + 1


def _next_id() -> str:
    global _next_seq
    invoice_id = f"INV{_next_seq}"
    _next_seq += 1
    return invoice_id


def get_invoices() -> list[InvoiceResponse]:
    return invoices


def get_invoice_by_id(invoice_id: str) -> InvoiceResponse | None:
    return next((i for i in invoices if i.id == invoice_id), None)


def create_invoice(invoice: InvoiceCreate) -> InvoiceResponse:
    total = round(sum(item.amount for item in invoice.items), 2)
    new_invoice = InvoiceResponse(id=_next_id(), total_amount=total, **invoice.model_dump())
    invoices.append(new_invoice)
    return new_invoice


def update_invoice(invoice_id: str, invoice: InvoiceUpdate) -> InvoiceResponse | None:
    existing = get_invoice_by_id(invoice_id)

    if existing is None:
        return None

    total = round(sum(item.amount for item in invoice.items), 2)

    for field, value in invoice.model_dump().items():
        setattr(existing, field, value)

    existing.total_amount = total

    return existing


def mark_invoice_paid(invoice_id: str) -> InvoiceResponse | None:
    invoice = get_invoice_by_id(invoice_id)

    if invoice is None:
        return None

    invoice.status = "Paid"

    return invoice


def delete_invoice(invoice_id: str) -> InvoiceResponse | None:
    invoice = get_invoice_by_id(invoice_id)

    if invoice is None:
        return None

    invoices.remove(invoice)
    return invoice
