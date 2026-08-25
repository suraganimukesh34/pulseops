import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Alert, AlertCreate } from '../models/alert.model';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  private readonly apiUrl = `${environment.apiUrl}/alerts`;
  private readonly http = inject(HttpClient);

  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(this.apiUrl);
  }

  createAlert(alert: AlertCreate): Observable<Alert> {
    return this.http.post<Alert>(this.apiUrl, alert);
  }

  acknowledgeAlert(alertId: string): Observable<Alert> {
    return this.http.post<Alert>(`${this.apiUrl}/${alertId}/acknowledge`, {});
  }
}
