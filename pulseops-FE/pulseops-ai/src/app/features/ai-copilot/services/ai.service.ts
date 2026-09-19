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

  async streamChat(sessionId: string ,message: string, onChunk: (text: string) => void): Promise<void> {
    const token = sessionStorage.getItem('access_token');
    const url = `${this.apiUrl}/chat/stream?message=${encodeURIComponent(message)}&session_id=${sessionId}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      onChunk(decoder.decode(value, { stream: true }));
    }
  }
}
