import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Staff, StaffCreate } from '../models/staff.model';

@Injectable({
  providedIn: 'root',
})
export class StaffService {
  private readonly apiUrl = `${environment.apiUrl}/staff`;
  private readonly http = inject(HttpClient);

  getStaff(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
  }

  createStaff(member: StaffCreate): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, member);
  }

  updateStaff(id: string, member: StaffCreate): Observable<Staff> {
    return this.http.put<Staff>(`${this.apiUrl}/${id}`, member);
  }

  deleteStaff(id: string): Observable<Staff> {
    return this.http.delete<Staff>(`${this.apiUrl}/${id}`);
  }
}
