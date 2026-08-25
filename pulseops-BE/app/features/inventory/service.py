from app.features.inventory.schemas import (
    InventoryItemCreate,
    InventoryItemResponse,
    InventoryItemUpdate,
)


def _item(id, name, category, quantity, unit, reorder_level, supplier, expiry_date=None):
    return InventoryItemResponse(
        id=id, name=name, category=category, quantity=quantity, unit=unit,
        reorder_level=reorder_level, expiry_date=expiry_date, supplier=supplier,
    )


items: list[InventoryItemResponse] = [
    _item("ITM1", "Amoxicillin 500mg", "Medicine", 40, "tablets", 100, "MedSupply Co.", "2027-01-15"),
    _item("ITM2", "Paracetamol 500mg", "Medicine", 500, "tablets", 150, "MedSupply Co.", "2027-06-01"),
    _item("ITM3", "Insulin (Rapid)", "Medicine", 25, "vials", 30, "PharmaDirect", "2026-12-01"),
    _item("ITM4", "Ibuprofen 200mg", "Medicine", 300, "tablets", 100, "MedSupply Co.", "2027-03-20"),
    _item("ITM5", "Saline IV Solution", "Medicine", 80, "bags", 50, "PharmaDirect", "2026-11-10"),
    _item("ITM6", "Morphine 10mg", "Medicine", 15, "ampoules", 20, "ControlledRx Inc.", "2026-10-05"),
    _item("ITM7", "Surgical Gloves (Box)", "Supply", 60, "boxes", 40, "SafeHands Ltd."),
    _item("ITM8", "Surgical Masks (Box)", "Supply", 20, "boxes", 50, "SafeHands Ltd."),
    _item("ITM9", "Syringes 5ml", "Supply", 400, "units", 200, "MedSupply Co."),
    _item("ITM10", "Gauze Rolls", "Supply", 150, "rolls", 80, "SafeHands Ltd."),
    _item("ITM11", "Ventilator", "Equipment", 6, "units", 2, "BioMed Systems"),
    _item("ITM12", "Infusion Pump", "Equipment", 10, "units", 4, "BioMed Systems"),
    _item("ITM13", "ECG Machine", "Equipment", 4, "units", 2, "BioMed Systems"),
    _item("ITM14", "Wheelchairs", "Equipment", 12, "units", 5, "MobilityPlus"),
    _item("ITM15", "Defibrillator", "Equipment", 3, "units", 2, "BioMed Systems"),
    _item("ITM16", "Antiseptic Solution", "Medicine", 45, "bottles", 30, "PharmaDirect", "2027-02-14"),
    _item("ITM17", "Oxygen Cylinders", "Supply", 18, "units", 15, "GasMed Supplies"),
    _item("ITM18", "Blood Pressure Cuffs", "Equipment", 25, "units", 10, "MobilityPlus"),
    _item("ITM19", "Thermometers (Digital)", "Equipment", 30, "units", 15, "MobilityPlus"),
    _item("ITM20", "Cotton Swabs (Pack)", "Supply", 100, "packs", 60, "SafeHands Ltd."),
]

_next_seq = len(items) + 1


def _next_id() -> str:
    global _next_seq
    item_id = f"ITM{_next_seq}"
    _next_seq += 1
    return item_id


def get_items() -> list[InventoryItemResponse]:
    return items


def get_item_by_id(item_id: str) -> InventoryItemResponse | None:
    return next((i for i in items if i.id == item_id), None)


def create_item(item: InventoryItemCreate) -> InventoryItemResponse:
    new_item = InventoryItemResponse(id=_next_id(), **item.model_dump())
    items.append(new_item)
    return new_item


def update_item(item_id: str, item: InventoryItemUpdate) -> InventoryItemResponse | None:
    existing = get_item_by_id(item_id)

    if existing is None:
        return None

    for field, value in item.model_dump().items():
        setattr(existing, field, value)

    return existing


def restock_item(item_id: str, quantity: int) -> InventoryItemResponse | None:
    item = get_item_by_id(item_id)

    if item is None:
        return None

    item.quantity += quantity

    return item


def delete_item(item_id: str) -> InventoryItemResponse | None:
    item = get_item_by_id(item_id)

    if item is None:
        return None

    items.remove(item)
    return item
