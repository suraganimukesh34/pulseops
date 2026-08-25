import { ChangeDetectorRef, Component, Inject, inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Bed, BedCreate } from '../../models/bed.model';
import { BedService } from '../../services/bed.service';
import { Department } from '../../../departments/models/department.model';
import { DepartmentService } from '../../../departments/services/department.service';

export interface AddBedDialogData {
  bed: Bed;
}

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

  readonly isEditMode: boolean;
  private readonly editingId: string | null;
  private readonly existingPatientId: string | null;
  private readonly existingAdmittedDate: string | null;

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

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: AddBedDialogData | null) {
    this.isEditMode = !!data?.bed;
    this.editingId = data?.bed.id ?? null;
    this.existingPatientId = data?.bed.patient_id ?? null;
    this.existingAdmittedDate = data?.bed.admitted_date ?? null;

    if (data?.bed) {
      this.bedForm.setValue({
        department_id: data.bed.department_id,
        bed_number: data.bed.bed_number,
        status: data.bed.status,
      });
    }
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
      patient_id: this.isEditMode ? this.existingPatientId : null,
      admitted_date: this.isEditMode ? this.existingAdmittedDate : null,
    };

    const request$ = this.isEditMode
      ? this.bedService.updateBed(this.editingId!, bed)
      : this.bedService.createBed(bed);

    request$.subscribe({
      next: (saved) => {
        this.isSubmitting = false;
        this.dialogRef.close(saved);
      },
      error: (error) => {
        console.error('Failed to save bed', error);
        this.isSubmitting = false;
        this.submitError = `Unable to ${this.isEditMode ? 'update' : 'add'} bed. Please try again.`;
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
