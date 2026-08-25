import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HospitalProfile, UserAccount } from '../models/settings.model';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private readonly apiUrl = `${environment.apiUrl}/settings`;
  private readonly usersUrl = `${environment.apiUrl}/users`;
  private readonly http = inject(HttpClient);

  getHospitalProfile(): Observable<HospitalProfile> {
    return this.http.get<HospitalProfile>(`${this.apiUrl}/hospital-profile`);
  }

  updateHospitalProfile(profile: HospitalProfile): Observable<HospitalProfile> {
    return this.http.put<HospitalProfile>(`${this.apiUrl}/hospital-profile`, profile);
  }

  getUsers(): Observable<UserAccount[]> {
    return this.http.get<UserAccount[]>(this.usersUrl);
  }
}
