import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Bed, BedAdmitRequest, BedCreate } from '../models/bed.model';

@Injectable({
  providedIn: 'root',
})
export class BedService {
  private readonly apiUrl = `${environment.apiUrl}/beds`;
  private readonly http = inject(HttpClient);

  getBeds(): Observable<Bed[]> {
    return this.http.get<Bed[]>(this.apiUrl);
  }

  createBed(bed: BedCreate): Observable<Bed> {
    return this.http.post<Bed>(this.apiUrl, bed);
  }

  updateBed(id: string, bed: BedCreate): Observable<Bed> {
    return this.http.put<Bed>(`${this.apiUrl}/${id}`, bed);
  }

  deleteBed(id: string): Observable<Bed> {
    return this.http.delete<Bed>(`${this.apiUrl}/${id}`);
  }

  admitPatient(bedId: string, request: BedAdmitRequest): Observable<Bed> {
    return this.http.post<Bed>(`${this.apiUrl}/${bedId}/admit`, request);
  }

  releaseBed(bedId: string): Observable<Bed> {
    return this.http.post<Bed>(`${this.apiUrl}/${bedId}/release`, {});
  }
}
