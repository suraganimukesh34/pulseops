from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user
from app.features.billing.schemas import InvoiceCreate, InvoiceResponse, InvoiceUpdate
from app.features.billing.service import (
    create_invoice,
    delete_invoice,
    get_invoice_by_id,
    get_invoices,
    mark_invoice_paid,
    update_invoice,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/billing", tags=["Billing"])


@router.get("", response_model=list[InvoiceResponse])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_invoices(db)


@router.post("", response_model=InvoiceResponse, status_code=201)
def add_invoice(
    invoice: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return create_invoice(db, invoice)


@router.get("/{invoice_id}", response_model=InvoiceResponse)
def get_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    invoice = get_invoice_by_id(db, invoice_id)

    if invoice is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found")

    return invoice


@router.put("/{invoice_id}", response_model=InvoiceResponse)
def edit_invoice(
    invoice_id: str,
    invoice: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = update_invoice(db, invoice_id, invoice)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found")

    return updated


@router.post("/{invoice_id}/mark-paid", response_model=InvoiceResponse)
def mark_paid(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = mark_invoice_paid(db, invoice_id)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found")

    return updated


@router.delete("/{invoice_id}", response_model=InvoiceResponse)
def remove_invoice(
    invoice_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    deleted = delete_invoice(db, invoice_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Invoice not found")

    return deleted
