import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { PatientService } from '../../services/patient';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-patient-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatSnackBarModule
  ],
  templateUrl: './add-patient-dialog.html',
  styleUrl: './add-patient-dialog.scss',
})
export class AddPatientDialog {

  patientForm;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private dialogRef: MatDialogRef<AddPatientDialog>,
    private snackBar: MatSnackBar
  ) {
    this.patientForm = this.fb.nonNullable.group({
      name: ['', Validators.required],
      department: ['', Validators.required],
      ward: ['', Validators.required],
      bed: ['', Validators.required],
      status: ['', Validators.required],
      priority: ['', Validators.required],
    });
  }

  addPatient(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    const patient = this.patientForm.getRawValue();

    this.patientService.createPatient(patient).subscribe({
      next: (response) => {
        this.snackBar.open(
          `${patient.name} added successfully`,
          'Close',
          {
            duration: 3000
          }
        );

        this.dialogRef.close(response);
      },
      error: (error) => {
        console.error('Failed to add patient:', error);
        this.snackBar.open(
          'Failed to add patient',
          'Close',
          {
            duration: 3000
          }
        );
      }
    });

    console.log("New Patient:", patient)
  }
}
