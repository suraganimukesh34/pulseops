import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Department, DepartmentCreate } from '../models/department.model';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly apiUrl = `${environment.apiUrl}/departments`;
  private readonly http = inject(HttpClient);

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(this.apiUrl);
  }

  createDepartment(department: DepartmentCreate): Observable<Department> {
    return this.http.post<Department>(this.apiUrl, department);
  }
}
