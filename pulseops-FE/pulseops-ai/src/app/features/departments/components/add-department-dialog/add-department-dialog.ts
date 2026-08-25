import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { DepartmentCreate } from '../../models/department.model';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-add-department-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-department-dialog.html',
  styleUrl: './add-department-dialog.scss',
})
export class AddDepartmentDialog {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly dialogRef = inject(MatDialogRef<AddDepartmentDialog>);

  isSubmitting = false;
  submitError = '';

  readonly statusOptions = ['Active', 'Under Maintenance'];

  readonly departmentForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    floor: [1, [Validators.required, Validators.min(0), Validators.max(50)]],
    bed_capacity: [1, [Validators.required, Validators.min(1), Validators.max(200)]],
    status: ['Active', Validators.required],
    head_doctor_name: ['', Validators.maxLength(100)],
  });

  get name() {
    return this.departmentForm.controls.name;
  }
  get floor() {
    return this.departmentForm.controls.floor;
  }
  get bedCapacity() {
    return this.departmentForm.controls.bed_capacity;
  }
  get status() {
    return this.departmentForm.controls.status;
  }

  submit(): void {
    this.submitError = '';

    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.departmentForm.getRawValue();

    const department: DepartmentCreate = {
      name: formValue.name.trim(),
      floor: formValue.floor,
      bed_capacity: formValue.bed_capacity,
      status: formValue.status,
      head_doctor_name: formValue.head_doctor_name.trim() || null,
      head_doctor_id: null,
    };

    this.departmentService.createDepartment(department).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.dialogRef.close(created);
      },
      error: (error) => {
        console.error('Failed to create department', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to add department. Please try again.';
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
