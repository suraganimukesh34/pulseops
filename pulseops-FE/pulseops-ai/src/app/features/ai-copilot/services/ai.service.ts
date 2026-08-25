import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AIInsightsResponse, AIStatus } from '../models/ai-insight.model';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private readonly apiUrl = `${environment.apiUrl}/ai`;
  private readonly http = inject(HttpClient);

  getStatus(): Observable<AIStatus> {
    return this.http.get<AIStatus>(`${this.apiUrl}/status`);
  }

  getInsights(): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(`${this.apiUrl}/insights`);
  }
}
