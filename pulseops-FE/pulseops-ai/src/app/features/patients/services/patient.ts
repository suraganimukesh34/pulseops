
import { inject, Injectable } from '@angular/core';
import { Patient } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatientService {

    private readonly apiUrl = 'http://127.0.0.1:8000/patients';
    private readonly http = inject(HttpClient);

    getPatients(): Observable<Patient[]> {
        return this.http.get<Patient[]>(this.apiUrl)
    }

    createPatient(patient: Omit<Patient, 'id'>): Observable<Patient> {
        return this.http.post<Patient>(this.apiUrl, patient)
    }

}
