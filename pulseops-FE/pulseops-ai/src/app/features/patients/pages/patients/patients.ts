import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    PageHeader,
    StatCard,
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class PatientsComponent implements OnInit {

  patients: Patient[] = [];
  patientsCount = 0;

  constructor(
    private patientService: PatientService, 
    private pageHeader: PageHeaderService
  ) {
    this.pageHeader.setHeader('Patients', 'Operational Patients Overview')

  }

  displayedColumns: string[] = [
    'id',
    'name',
    'department',
    'ward',
    'bed',
    'status',
    'priority'
  ]

  dataSource = new MatTableDataSource<Patient>();
  
  ngOnInit(): void {
    this.patients = this.patientService.getPatients();
    this.patientsCount = this.patients.length;
    this.dataSource.data = this.patientService.getPatients();
  }

}
