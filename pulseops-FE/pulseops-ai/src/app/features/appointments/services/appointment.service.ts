import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Appointment, AppointmentCreate } from '../models/appointment.model';

@Injectable({
  providedIn: 'root',
})
export class AppointmentService {
  private readonly apiUrl = `${environment.apiUrl}/appointments`;
  private readonly http = inject(HttpClient);

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl);
  }

  createAppointment(appointment: AppointmentCreate): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment);
  }
}
