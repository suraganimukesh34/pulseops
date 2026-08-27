from sqlalchemy.orm import Session

from app.features.inventory.models import InventoryItem
from app.features.inventory.schemas import InventoryItemCreate, InventoryItemUpdate


def _next_id(db: Session) -> str:
    existing_ids = [i.id for i in db.query(InventoryItem.id).all()]
    max_num = max((int(id_.lstrip("ITM")) for id_ in existing_ids), default=0)
    return f"ITM{max_num + 1}"


def get_items(db: Session) -> list[InventoryItem]:
    return db.query(InventoryItem).all()


def get_item_by_id(db: Session, item_id: str) -> InventoryItem | None:
    return db.query(InventoryItem).filter(InventoryItem.id == item_id).first()


def create_item(db: Session, item: InventoryItemCreate) -> InventoryItem:
    new_item = InventoryItem(id=_next_id(db), **item.model_dump())
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


def update_item(db: Session, item_id: str, item: InventoryItemUpdate) -> InventoryItem | None:
    existing = get_item_by_id(db, item_id)

    if existing is None:
        return None

    for field, value in item.model_dump().items():
        setattr(existing, field, value)

    db.commit()
    db.refresh(existing)
    return existing


def restock_item(db: Session, item_id: str, quantity: int) -> InventoryItem | None:
    item = get_item_by_id(db, item_id)

    if item is None:
        return None

    item.quantity += quantity

    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item_id: str) -> InventoryItem | None:
    item = get_item_by_id(db, item_id)

    if item is None:
        return None

    db.delete(item)
    db.commit()
    return item
