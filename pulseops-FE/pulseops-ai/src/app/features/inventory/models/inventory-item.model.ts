export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  expiry_date: string | null;
  supplier: string;
}

export interface InventoryItemCreate {
  name: string;
  category: string;
  quantity: number;
  unit: string;
  reorder_level: number;
  expiry_date: string | null;
  supplier: string;
}

export interface RestockRequest {
  quantity: number;
}
