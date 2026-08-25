import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AlertCreate } from '../../models/alert.model';
import { AlertService } from '../../services/alert.service';
import { DepartmentService } from '../../../departments/services/department.service';
import { Department } from '../../../departments/models/department.model';

@Component({
  selector: 'app-add-alert-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-alert-dialog.html',
  styleUrl: './add-alert-dialog.scss',
})
export class AddAlertDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly departmentService = inject(DepartmentService);
  private readonly dialogRef = inject(MatDialogRef<AddAlertDialog>);
  private readonly cdr = inject(ChangeDetectorRef);

  isSubmitting = false;
  submitError = '';

  departments: Department[] = [];

  readonly severityOptions = ['Critical', 'Warning', 'Info'];
  readonly categoryOptions = ['Patient', 'Equipment', 'Staff', 'System', 'Inventory'];

  readonly alertForm = this.fb.nonNullable.group({
    severity: ['Warning', Validators.required],
    category: ['Patient', Validators.required],
    message: ['', [Validators.required, Validators.maxLength(500)]],
    source: ['', [Validators.required, Validators.maxLength(100)]],
    department_id: [''],
  });

  get severity() {
    return this.alertForm.controls.severity;
  }
  get category() {
    return this.alertForm.controls.category;
  }
  get message() {
    return this.alertForm.controls.message;
  }
  get source() {
    return this.alertForm.controls.source;
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

    if (this.alertForm.invalid) {
      this.alertForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.alertForm.getRawValue();

    const alert: AlertCreate = {
      severity: formValue.severity,
      category: formValue.category,
      message: formValue.message.trim(),
      source: formValue.source.trim(),
      department_id: formValue.department_id || null,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      acknowledged_by: null,
    };

    this.alertService.createAlert(alert).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.dialogRef.close(created);
      },
      error: (error) => {
        console.error('Failed to create alert', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to add alert. Please try again.';
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
