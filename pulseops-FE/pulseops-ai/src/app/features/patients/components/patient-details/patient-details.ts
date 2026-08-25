import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Patient } from '../../models/patient.model';
import { PatientService } from '../../services/patient';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './patient-details.html',
  styleUrls: ['./patient-details.scss']
})
export class PatientDetails implements OnInit {

  private readonly patientService = inject(PatientService);

  patient: Patient | null = null;

  isLoading = true;
  hasError = false;

  aiSummary: string | null = null;

  isSummaryLoading = false;
  summaryError = false;

  constructor(
    private readonly dialogRef: MatDialogRef<PatientDetails>,
    @Inject(MAT_DIALOG_DATA) public data: { patientId: string },
    private readonly changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadPatient();
  }

  private loadPatient(): void {
    this.isLoading = true;
    this.hasError = false;
    this.patient = null;

    this.patientService.getPatientById(this.data.patientId).subscribe({
      next: (response: Patient) => {
        this.patient = response;
        this.isLoading = false;
        this.hasError = false;
        this.changeDetectorRef.detectChanges();
      },

      error: () => {
        this.isLoading = false;
        this.hasError = true;
        this.patient = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  generateSummary(): void {
    if (!this.patient || this.isSummaryLoading) {
      return;
    }

    this.isSummaryLoading = true;
    this.summaryError = false;
    this.aiSummary = null;

    this.patientService.generateAiSummary(this.patient.id).subscribe({
      next: (response) => {
        this.aiSummary = response.patient_summary;
        this.isSummaryLoading = false;
        this.summaryError = false;
        this.changeDetectorRef.detectChanges();
      },

      error: () => {
        this.isSummaryLoading = false;
        this.summaryError = true;
        this.aiSummary = null;
        this.changeDetectorRef.detectChanges();
      }
    });
  }
}
