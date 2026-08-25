import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BedCreate } from '../../models/bed.model';
import { BedService } from '../../services/bed.service';
import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';

@Component({
  selector: 'app-add-bed-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-bed-dialog.html',
  styleUrl: './add-bed-dialog.scss',
})
export class AddBedDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly bedService = inject(BedService);
  private readonly departmentService = inject(DepartmentService);
  private readonly dialogRef = inject(MatDialogRef<AddBedDialog>);
  private readonly cdr = inject(ChangeDetectorRef);

  isSubmitting = false;
  submitError = '';

  departments: Department[] = [];

  readonly statusOptions = ['Available', 'Occupied', 'Cleaning', 'Maintenance'];

  readonly bedForm = this.fb.nonNullable.group({
    department_id: ['', Validators.required],
    bed_number: ['', [Validators.required, Validators.maxLength(20)]],
    status: ['Available', Validators.required],
  });

  get department_id() {
    return this.bedForm.controls.department_id;
  }
  get bed_number() {
    return this.bedForm.controls.bed_number;
  }
  get status() {
    return this.bedForm.controls.status;
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

    if (this.bedForm.invalid) {
      this.bedForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.bedForm.getRawValue();

    const bed: BedCreate = {
      department_id: formValue.department_id,
      bed_number: formValue.bed_number.trim(),
      status: formValue.status,
      patient_id: null,
      admitted_date: null,
    };

    this.bedService.createBed(bed).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.dialogRef.close(created);
      },
      error: (error) => {
        console.error('Failed to create bed', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to add bed. Please try again.';
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
