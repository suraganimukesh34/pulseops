import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';

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
import { MatIconModule } from '@angular/material/icon';
import { PatientDetails } from '../../components/patient-details/patient-details';
import { badgeClass } from '../../../../shared/utils/badge.util';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [
    CommonModule,
    StatCard,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    AddPatientDialog,
    MatIconModule

  ],
  templateUrl: './patients.html',
  styleUrl: './patients.scss'
})
export class PatientsComponent implements OnInit {

  patients: Patient[] = [];
  patientsCount = 0;
  badgeClass = badgeClass;

  constructor(
    private patientService: PatientService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {
    this.pageHeader.setHeader('Patients', 'Operational Patients Overview')

  }

  displayedColumns: string[] = [
    'id',
    'name',
    'department',
    'location',
    'status',
    'priority',
    'ai'
  ];

  dataSource = new MatTableDataSource<Patient>();

  ngOnInit(): void {
    this.loadPatients();
  }

  openAddPatientDialog(): void {
    const dialogRef = this.dialog.open(AddPatientDialog, {
      width: '700px',
      maxWidth: '95vw',
      panelClass: "pulseops-form-dialog",
      autoFocus: false
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
        this.dataSource.data = patients;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load patients', error)
      }
    });
  }


  openPatientAI(patientId: string): void {
    this.dialog.open(PatientDetails, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '92vh',
      panelClass: 'patient-ai-dialog-panel',
      data: {
        patientId: patientId
      }
    });
  }

}
