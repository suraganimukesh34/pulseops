import { ChangeDetectorRef, Component, Inject, inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Staff, StaffCreate } from '../../models/staff.model';
import { StaffService } from '../../services/staff.service';
import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';

export interface AddStaffDialogData {
  staff: Staff;
}

@Component({
  selector: 'app-add-staff-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-staff-dialog.html',
  styleUrl: './add-staff-dialog.scss',
})
export class AddStaffDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly staffService = inject(StaffService);
  private readonly departmentService = inject(DepartmentService);
  private readonly dialogRef = inject(MatDialogRef<AddStaffDialog>);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly isEditMode: boolean;
  private readonly editingId: string | null;

  isSubmitting = false;
  submitError = '';

  departments: Department[] = [];

  readonly roleOptions = ['Doctor', 'Nurse', 'Technician', 'Admin'];
  readonly shiftOptions = ['Morning', 'Evening', 'Night'];
  readonly statusOptions = ['On Duty', 'Off Duty', 'On Leave'];

  readonly staffForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    role: ['Doctor', Validators.required],
    department_id: ['', Validators.required],
    specialization: ['', Validators.maxLength(100)],
    shift: ['Morning', Validators.required],
    status: ['On Duty', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    joined_date: ['', Validators.required],
  });

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: AddStaffDialogData | null) {
    this.isEditMode = !!data?.staff;
    this.editingId = data?.staff.id ?? null;

    if (data?.staff) {
      this.staffForm.setValue({
        name: data.staff.name,
        role: data.staff.role,
        department_id: data.staff.department_id,
        specialization: data.staff.specialization ?? '',
        shift: data.staff.shift,
        status: data.staff.status,
        email: data.staff.email,
        phone: data.staff.phone,
        joined_date: data.staff.joined_date,
      });
    }
  }

  get name() {
    return this.staffForm.controls.name;
  }
  get role() {
    return this.staffForm.controls.role;
  }
  get department_id() {
    return this.staffForm.controls.department_id;
  }
  get shift() {
    return this.staffForm.controls.shift;
  }
  get status() {
    return this.staffForm.controls.status;
  }
  get email() {
    return this.staffForm.controls.email;
  }
  get phone() {
    return this.staffForm.controls.phone;
  }
  get joined_date() {
    return this.staffForm.controls.joined_date;
  }

  ngOnInit(): void {
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

    if (this.staffForm.invalid) {
      this.staffForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.staffForm.getRawValue();

    const member: StaffCreate = {
      name: formValue.name.trim(),
      role: formValue.role,
      department_id: formValue.department_id,
      specialization: formValue.specialization.trim() || null,
      shift: formValue.shift,
      status: formValue.status,
      email: formValue.email.trim(),
      phone: formValue.phone.trim(),
      joined_date: formValue.joined_date,
    };

    const request$ = this.isEditMode
      ? this.staffService.updateStaff(this.editingId!, member)
      : this.staffService.createStaff(member);

    request$.subscribe({
      next: (saved) => {
        this.isSubmitting = false;
        this.dialogRef.close(saved);
      },
      error: (error) => {
        console.error('Failed to save staff member', error);
        this.isSubmitting = false;
        this.submitError = `Unable to ${this.isEditMode ? 'update' : 'add'} staff member. Please try again.`;
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
