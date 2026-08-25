import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

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
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../core/services/notification.service';

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

  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  patients: Patient[] = [];
  patientsCount = 0;
  badgeClass = badgeClass;
  isLoading = true;

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
    'actions'
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
        this.notifications.success('Patient added successfully', `${patient.name} has been admitted.`);
        this.loadPatients();
      }
    })
  }

  loadPatients(): void {
    this.isLoading = true;

    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.patientsCount = patients.length;
        this.dataSource.data = patients;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load patients', error);
        this.isLoading = false;
        this.notifications.error('Failed to load patients', 'Please try refreshing the page.');
        this.cdr.detectChanges();
      }
    });
  }


  viewPatientDetails(patientId: string): void {
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

  openEditPatientDialog(patient: Patient): void {
    const dialogRef = this.dialog.open(AddPatientDialog, {
      width: '700px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { patient }
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.notifications.success('Patient updated successfully', `${updated.name}'s record has been saved.`);
        this.loadPatients();
      }
    });
  }

  deletePatientRecord(patient: Patient): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Patient',
        message: `Are you sure you want to delete the record for "${patient.name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.patientService.deletePatient(patient.id).subscribe({
          next: () => {
            this.notifications.success('Patient deleted', `${patient.name}'s record has been removed.`);
            this.loadPatients();
          },
          error: (error) => {
            console.error('Failed to delete patient', error);
            this.notifications.error('Failed to delete patient', 'Please try again.');
          }
        });
      });
  }

}
