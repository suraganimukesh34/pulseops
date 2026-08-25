import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Invoice, InvoiceCreate } from '../models/invoice.model';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private readonly apiUrl = `${environment.apiUrl}/billing`;
  private readonly http = inject(HttpClient);

  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(this.apiUrl);
  }

  createInvoice(invoice: InvoiceCreate): Observable<Invoice> {
    return this.http.post<Invoice>(this.apiUrl, invoice);
  }

  markPaid(invoiceId: string): Observable<Invoice> {
    return this.http.post<Invoice>(`${this.apiUrl}/${invoiceId}/mark-paid`, {});
  }
}
