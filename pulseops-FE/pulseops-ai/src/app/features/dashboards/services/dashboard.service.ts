import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AIInsight, DashboardSummary } from '../models/dashboard-summary.model';

interface RawAlert {
  message: string;
  category: string;
  source: string;
  severity: string;
  acknowledged: boolean;
}

interface AIInsightsResponse {
  generated: boolean;
  insights: AIInsight[];
}

interface AIStatusResponse {
  available: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private readonly apiUrl = environment.apiUrl;
  private readonly http = inject(HttpClient);

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/dashboard/summary`);
  }

  getRecentAlerts(): Observable<RawAlert[]> {
    return this.http.get<RawAlert[]>(`${this.apiUrl}/alerts`);
  }

  getAIInsights(): Observable<AIInsightsResponse> {
    return this.http.get<AIInsightsResponse>(`${this.apiUrl}/ai/insights`);
  }

  getAIStatus(): Observable<AIStatusResponse> {
    return this.http.get<AIStatusResponse>(`${this.apiUrl}/ai/status`);
  }
}
