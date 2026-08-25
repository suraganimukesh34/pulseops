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
}
