import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { InventoryItem, InventoryItemCreate, RestockRequest } from '../models/inventory-item.model';

@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private readonly apiUrl = `${environment.apiUrl}/inventory`;
  private readonly http = inject(HttpClient);

  getItems(): Observable<InventoryItem[]> {
    return this.http.get<InventoryItem[]>(this.apiUrl);
  }

  createItem(item: InventoryItemCreate): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(this.apiUrl, item);
  }

  restockItem(itemId: string, request: RestockRequest): Observable<InventoryItem> {
    return this.http.post<InventoryItem>(`${this.apiUrl}/${itemId}/restock`, request);
  }
}
