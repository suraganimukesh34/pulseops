import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { PatientService } from '../../services/patient';
import { Patient } from '../../models/patient.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AddPatientDialog } from '../../components/add-patient-dialog/add-patient-dialog';
import { MatDialog } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    StatCard,
    MatTableModule, 
    MatSortModule, 
    MatPaginatorModule,
    AddPatientDialog
    
  ],
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class PatientsComponent implements OnInit {

  patients: Patient[] = [];
  patientsCount = 0;

  constructor(
    private patientService: PatientService, 
    private pageHeader: PageHeaderService,
    private dialog: MatDialog
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
    this.loadPatients();
  }

  openAddPatientDialog(): void {
    console.log("Add Patient button clicked")
    const dialogRef = this.dialog.open(AddPatientDialog, {
      width: '600px',
      maxWidth: '90vw',
      panelClass: "pulseops-dialog"
    });

    dialogRef.afterClosed().subscribe((patient) => {
      if (patient) {
        this.loadPatients();
      }
    })
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.patientsCount = patients.length;
        this.dataSource.data = patients
      },
      error: (error) => {
        console.error('Failed to load patients', error)
      }
    });
  }

}
