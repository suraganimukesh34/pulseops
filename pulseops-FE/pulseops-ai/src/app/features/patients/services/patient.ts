
import { inject, Injectable } from '@angular/core';
import { AIPatientSummaryResponse, Patient, PatientCreate } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    private readonly apiUrl = `${environment.apiUrl}/patients`;
    private readonly http = inject(HttpClient);

    getPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(this.apiUrl)
    }

    createPatient(patient: PatientCreate): Observable<Patient> {
        return this.http.post<Patient>(this.apiUrl, patient)
    }

    getPatientById(patientId: string): Observable<Patient> {
        return this.http.get<Patient>(`${this.apiUrl}/${patientId}`);
    }

    generateAiSummary(patientId: string): Observable<AIPatientSummaryResponse> {
        return this.http.post<AIPatientSummaryResponse>(`${this.apiUrl}/${patientId}/ai-summary`, {});
    }

}
