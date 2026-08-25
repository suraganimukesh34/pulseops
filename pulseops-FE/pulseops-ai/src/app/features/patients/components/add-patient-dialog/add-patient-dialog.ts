import { Component, Inject, inject, Optional } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { Patient, PatientCreate } from '../../models/patient.model';
import { PatientService } from '../../services/patient';

export interface AddPatientDialogData {
  patient: Patient;
}

@Component({
  selector: 'app-add-patient-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './add-patient-dialog.html',
  styleUrl: './add-patient-dialog.scss'
})
export class AddPatientDialog {

  private readonly fb = inject(FormBuilder);
  private readonly patientService = inject(PatientService);
  private readonly dialogRef =
    inject(MatDialogRef<AddPatientDialog>);

  readonly isEditMode: boolean;
  private readonly editingId: string | null;

  isSubmitting = false;
  submitError = '';

  // Dropdown options
  readonly genderOptions = [
    'Male',
    'Female',
    'Other'
  ];

  readonly departmentOptions = [
    'Emergency',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'General Medicine',
    'ICU'
  ];

  readonly wardOptions = [
    'Ward A',
    'Ward B',
    'Ward C',
    'ICU',
    'Emergency'
  ];

  readonly bedOptions = [
    'Bed 01',
    'Bed 02',
    'Bed 03',
    'Bed 04',
    'Bed 05',
    'Bed 06',
    'Bed 07',
    'Bed 08'
  ];

  readonly statusOptions = [
    'Critical',
    'Waiting',
    'Stable',
  ];

  readonly priorityOptions = [
    'Low',
    'Medium',
    'High',

  ];

  readonly patientForm = this.fb.nonNullable.group({
    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100)
      ]
    ],

    age: [
      0,
      [
        Validators.required,
        Validators.min(1),
        Validators.max(120)
      ]
    ],

    gender: [
      '',
      Validators.required
    ],

    department: [
      '',
      Validators.required
    ],

    ward: [
      '',
      Validators.required
    ],

    bed: [
      '',
      Validators.required
    ],

    status: [
      '',
      Validators.required
    ],

    priority: [
      '',
      Validators.required
    ],

    admission_date: [
      ''
    ],

    expected_discharge_date: [
      ''
    ],

    attending_doctor: [
      '',
      Validators.maxLength(100)
    ],

    diagnosis: [
      '',
      Validators.maxLength(500)
    ],

    symptoms: [
      '',
      Validators.maxLength(1000)
    ]
  });

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: AddPatientDialogData | null) {
    this.isEditMode = !!data?.patient;
    this.editingId = data?.patient.id ?? null;

    if (data?.patient) {
      this.patientForm.setValue({
        name: data.patient.name,
        age: data.patient.age,
        gender: data.patient.gender,
        department: data.patient.department,
        ward: data.patient.ward,
        bed: data.patient.bed,
        status: data.patient.status,
        priority: data.patient.priority,
        admission_date: data.patient.admission_date ?? '',
        expected_discharge_date: data.patient.expected_discharge_date ?? '',
        attending_doctor: data.patient.attending_doctor ?? '',
        diagnosis: data.patient.diagnosis ?? '',
        symptoms: data.patient.symptoms ?? '',
      });
    }
  }

  get name() {
    return this.patientForm.controls.name;
  }

  get age() {
    return this.patientForm.controls.age;
  }

  get gender() {
    return this.patientForm.controls.gender;
  }

  get department() {
    return this.patientForm.controls.department;
  }

  get ward() {
    return this.patientForm.controls.ward;
  }

  get bed() {
    return this.patientForm.controls.bed;
  }

  get status() {
    return this.patientForm.controls.status;
  }

  get priority() {
    return this.patientForm.controls.priority;
  }

  get admissionDate() {
    return this.patientForm.controls.admission_date;
  }

  get expectedDischargeDate() {
    return this.patientForm.controls.expected_discharge_date;
  }

  get attendingDoctor() {
    return this.patientForm.controls.attending_doctor;
  }

  get diagnosis() {
    return this.patientForm.controls.diagnosis;
  }

  get symptoms() {
    return this.patientForm.controls.symptoms;
  }

  submit(): void {
    this.submitError = '';

    // Show validation messages
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.patientForm.getRawValue();

    const patient: PatientCreate = {
      name: formValue.name.trim(),
      age: formValue.age,
      gender: formValue.gender,
      department: formValue.department,
      ward: formValue.ward,
      bed: formValue.bed,
      status: formValue.status,
      priority: formValue.priority,

      admission_date:
        formValue.admission_date || '',

      expected_discharge_date:
        formValue.expected_discharge_date || '',

      attending_doctor:
        formValue.attending_doctor.trim(),

      diagnosis:
        formValue.diagnosis.trim(),

      symptoms:
        formValue.symptoms.trim()
    };

    const request$ = this.isEditMode
      ? this.patientService.updatePatient(this.editingId!, patient)
      : this.patientService.createPatient(patient);

    request$.subscribe({
      next: (savedPatient) => {
        this.isSubmitting = false;

        // Return the saved patient to patients.ts
        this.dialogRef.close(savedPatient);
      },

      error: (error) => {
        console.error(
          `Failed to ${this.isEditMode ? 'update' : 'create'} patient`,
          error
        );

        this.isSubmitting = false;

        this.submitError =
          `Unable to ${this.isEditMode ? 'update' : 'add'} patient. Please try again.`;
      }
    });
  }

  cancel(): void {
    if (this.isSubmitting) {
      return;
    }

    this.dialogRef.close();
  }


}
