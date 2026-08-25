import { ChangeDetectorRef, Component, Inject, inject, Optional } from '@angular/core';
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
import { forkJoin } from 'rxjs';
import { Patient, PatientCreate } from '../../models/patient.model';
import { PatientService } from '../../services/patient';
import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';
import { Bed } from '../../../beds/models/bed.model';
import { BedService } from '../../../beds/services/bed.service';
import { Staff } from '../../../staff/models/staff.model';
import { StaffService } from '../../../staff/services/staff.service';

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
  private readonly departmentService = inject(DepartmentService);
  private readonly bedService = inject(BedService);
  private readonly staffService = inject(StaffService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly dialogRef =
    inject(MatDialogRef<AddPatientDialog>);

  readonly isEditMode: boolean;
  private readonly editingId: string | null;

  isSubmitting = false;
  submitError = '';

  isLoadingOptions = true;

  private departments: Department[] = [];
  private allBeds: Bed[] = [];
  private allDoctors: Staff[] = [];

  // Dropdown options
  readonly genderOptions = [
    'Male',
    'Female',
    'Other'
  ];

  departmentOptions: string[] = [];

  readonly wardOptions = [
    'Ward A',
    'Ward B',
    'Ward C',
    'Ward D',
    'Emergency'
  ];

  filteredBedOptions: Bed[] = [];

  filteredDoctorOptions: Staff[] = [];

  readonly bloodGroupOptions = [
    'A+', 'A-',
    'B+', 'B-',
    'AB+', 'AB-',
    'O+', 'O-'
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

    contact_number: [
      '',
      [
        Validators.pattern(/^[0-9+\-\s()]{7,20}$/)
      ]
    ],

    blood_group: [
      ''
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
      ''
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
        contact_number: data.patient.contact_number ?? '',
        blood_group: data.patient.blood_group ?? '',
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

    forkJoin({
      departments: this.departmentService.getDepartments(),
      beds: this.bedService.getBeds(),
      staff: this.staffService.getStaff(),
    }).subscribe({
      next: ({ departments, beds, staff }) => {
        this.departments = departments;
        this.departmentOptions = departments.map((department) => department.name);
        this.allBeds = beds;
        this.allDoctors = staff.filter((member) => member.role === 'Doctor');

        this.refreshBedOptions();
        this.refreshDoctorOptions();

        this.isLoadingOptions = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load department/bed/staff options', error);
        this.isLoadingOptions = false;
        this.cdr.detectChanges();
      }
    });

    // Bed and attending-doctor choices are scoped to the selected department.
    this.patientForm.controls.department.valueChanges.subscribe(() => {
      this.refreshBedOptions();
      this.refreshDoctorOptions();
      this.cdr.detectChanges();
    });
  }

  private refreshBedOptions(): void {
    const selectedDepartment = this.departments.find(
      (department) => department.name === this.patientForm.controls.department.value
    );

    const currentBed = this.patientForm.controls.bed.value;

    this.filteredBedOptions = selectedDepartment
      ? this.allBeds.filter(
        (bed) =>
          bed.department_id === selectedDepartment.id &&
          (bed.status === 'Available' || bed.bed_number === currentBed)
      )
      : [];

    const stillValid = this.filteredBedOptions.some((bed) => bed.bed_number === currentBed);

    if (!stillValid && currentBed) {
      this.patientForm.controls.bed.setValue('');
    }
  }

  private refreshDoctorOptions(): void {
    const selectedDepartment = this.departments.find(
      (department) => department.name === this.patientForm.controls.department.value
    );

    const currentDoctor = this.patientForm.controls.attending_doctor.value;

    this.filteredDoctorOptions = selectedDepartment
      ? this.allDoctors.filter((doctor) => doctor.department_id === selectedDepartment.id)
      : [];

    const stillValid = this.filteredDoctorOptions.some((doctor) => doctor.name === currentDoctor);

    if (!stillValid && currentDoctor) {
      this.patientForm.controls.attending_doctor.setValue('');
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

  get contactNumber() {
    return this.patientForm.controls.contact_number;
  }

  get bloodGroup() {
    return this.patientForm.controls.blood_group;
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
      contact_number: formValue.contact_number.trim(),
      blood_group: formValue.blood_group,
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
        formValue.attending_doctor,

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
