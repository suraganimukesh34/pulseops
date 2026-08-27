from app.core.db import get_db
from app.core.security import CurrentUser, get_current_user
from app.features.inventory.schemas import (
    InventoryItemCreate,
    InventoryItemResponse,
    InventoryItemUpdate,
    RestockRequest,
)
from app.features.inventory.service import (
    create_item,
    delete_item,
    get_item_by_id,
    get_items,
    restock_item,
    update_item,
)
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("", response_model=list[InventoryItemResponse])
def list_items(
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return get_items(db)


@router.post("", response_model=InventoryItemResponse, status_code=201)
def add_item(
    item: InventoryItemCreate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    return create_item(db, item)


@router.get("/{item_id}", response_model=InventoryItemResponse)
def get_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    item = get_item_by_id(db, item_id)

    if item is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Inventory item not found")

    return item


@router.put("/{item_id}", response_model=InventoryItemResponse)
def edit_item(
    item_id: str,
    item: InventoryItemUpdate,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = update_item(db, item_id, item)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Inventory item not found")

    return updated


@router.post("/{item_id}/restock", response_model=InventoryItemResponse)
def restock(
    item_id: str,
    restock_request: RestockRequest,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    updated = restock_item(db, item_id, restock_request.quantity)

    if updated is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Inventory item not found")

    return updated


@router.delete("/{item_id}", response_model=InventoryItemResponse)
def remove_item(
    item_id: str,
    db: Session = Depends(get_db),
    current_user: CurrentUser = Depends(get_current_user),
):
    deleted = delete_item(db, item_id)

    if deleted is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Inventory item not found")

    return deleted
