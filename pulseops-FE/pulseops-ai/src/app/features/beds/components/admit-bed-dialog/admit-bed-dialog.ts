import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BedAdmitRequest } from '../../models/bed.model';
import { BedService } from '../../services/bed.service';

@Component({
  selector: 'app-admit-bed-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './admit-bed-dialog.html',
  styleUrl: './admit-bed-dialog.scss',
})
export class AdmitBedDialog {
  private readonly fb = inject(FormBuilder);
  private readonly bedService = inject(BedService);
  private readonly dialogRef = inject(MatDialogRef<AdmitBedDialog>);

  isSubmitting = false;
  submitError = '';

  readonly admitForm = this.fb.nonNullable.group({
    patient_id: ['', Validators.required],
    admitted_date: [new Date().toISOString().slice(0, 10), Validators.required],
  });

  get patient_id() {
    return this.admitForm.controls.patient_id;
  }
  get admitted_date() {
    return this.admitForm.controls.admitted_date;
  }

  constructor(@Inject(MAT_DIALOG_DATA) public data: { bedId: string }) {}

  submit(): void {
    this.submitError = '';

    if (this.admitForm.invalid) {
      this.admitForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.admitForm.getRawValue();

    const request: BedAdmitRequest = {
      patient_id: formValue.patient_id.trim(),
      admitted_date: formValue.admitted_date,
    };

    this.bedService.admitPatient(this.data.bedId, request).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.dialogRef.close(result);
      },
      error: (error) => {
        console.error('Failed to admit patient', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to admit patient. Please try again.';
      },
    });
  }

  cancel(): void {
    if (this.isSubmitting) {
      return;
    }
    this.dialogRef.close();
  }
}
