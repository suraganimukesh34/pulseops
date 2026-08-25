import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AppointmentCreate } from '../../models/appointment.model';
import { AppointmentService } from '../../services/appointment.service';
import { Patient } from '../../../patients/models/patient.model';
import { PatientService } from '../../../patients/services/patient';
import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';

@Component({
  selector: 'app-add-appointment-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-appointment-dialog.html',
  styleUrl: './add-appointment-dialog.scss',
})
export class AddAppointmentDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly appointmentService = inject(AppointmentService);
  private readonly patientService = inject(PatientService);
  private readonly departmentService = inject(DepartmentService);
  private readonly dialogRef = inject(MatDialogRef<AddAppointmentDialog>);
  private readonly cdr = inject(ChangeDetectorRef);

  isSubmitting = false;
  submitError = '';

  patients: Patient[] = [];
  departments: Department[] = [];

  readonly statusOptions = ['Scheduled', 'Completed', 'Cancelled', 'No-show'];

  readonly doctorOptions = [
    { id: 'S101', name: 'Dr. Sarah Smith' },
    { id: 'S102', name: 'Dr. Michael Brown' },
    { id: 'S103', name: 'Dr. David Wilson' },
    { id: 'S104', name: 'Dr. James Anderson' },
    { id: 'S105', name: 'Dr. Emily Davis' },
    { id: 'S106', name: 'Dr. Daniel Thomas' },
    { id: 'S107', name: 'Dr. Christopher Lee' },
    { id: 'S108', name: 'Dr. Lisa Martin' },
    { id: 'S109', name: 'Dr. Robert Clark' },
    { id: 'S110', name: 'Dr. Angela Perez' },
  ];

  readonly appointmentForm = this.fb.nonNullable.group({
    patient_id: ['', Validators.required],
    doctor_id: ['', Validators.required],
    department_id: ['', Validators.required],
    date: ['', Validators.required],
    time: ['', Validators.required],
    status: ['Scheduled', Validators.required],
    reason: ['', Validators.required],
    notes: [''],
  });

  get patient_id() {
    return this.appointmentForm.controls.patient_id;
  }
  get doctor_id() {
    return this.appointmentForm.controls.doctor_id;
  }
  get department_id() {
    return this.appointmentForm.controls.department_id;
  }
  get date() {
    return this.appointmentForm.controls.date;
  }
  get time() {
    return this.appointmentForm.controls.time;
  }
  get status() {
    return this.appointmentForm.controls.status;
  }
  get reason() {
    return this.appointmentForm.controls.reason;
  }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load patients', error),
    });

    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load departments', error),
    });
  }

  submit(): void {
    this.submitError = '';

    if (this.appointmentForm.invalid) {
      this.appointmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.appointmentForm.getRawValue();

    const selectedPatient = this.patients.find((p) => p.id === formValue.patient_id);
    const selectedDoctor = this.doctorOptions.find((d) => d.id === formValue.doctor_id);

    const appointment: AppointmentCreate = {
      patient_id: formValue.patient_id,
      patient_name: selectedPatient?.name ?? '',
      doctor_id: formValue.doctor_id,
      doctor_name: selectedDoctor?.name ?? '',
      department_id: formValue.department_id,
      date: formValue.date,
      time: formValue.time,
      status: formValue.status,
      reason: formValue.reason.trim(),
      notes: formValue.notes.trim() || null,
    };

    this.appointmentService.createAppointment(appointment).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.dialogRef.close(created);
      },
      error: (error) => {
        console.error('Failed to create appointment', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to add appointment. Please try again.';
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
