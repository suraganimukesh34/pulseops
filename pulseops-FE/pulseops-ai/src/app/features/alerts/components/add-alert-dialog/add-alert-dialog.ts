import { ChangeDetectorRef, Component, Inject, inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Alert, AlertCreate } from '../../models/alert.model';
import { AlertService } from '../../services/alert.service';
import { DepartmentService } from '../../../departments/services/department.service';
import { Department } from '../../../departments/models/department.model';

export interface AddAlertDialogData {
  alert: Alert;
}

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

  readonly isEditMode: boolean;
  private readonly editingId: string | null;
  private readonly editingAlert: Alert | null;

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

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: AddAlertDialogData | null) {
    this.isEditMode = !!data?.alert;
    this.editingId = data?.alert.id ?? null;
    this.editingAlert = data?.alert ?? null;

    if (data?.alert) {
      this.alertForm.setValue({
        severity: data.alert.severity,
        category: data.alert.category,
        message: data.alert.message,
        source: data.alert.source,
        department_id: data.alert.department_id ?? '',
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
      timestamp: this.editingAlert?.timestamp ?? new Date().toISOString(),
      acknowledged: this.editingAlert?.acknowledged ?? false,
      acknowledged_by: this.editingAlert?.acknowledged_by ?? null,
    };

    const request$ = this.isEditMode
      ? this.alertService.updateAlert(this.editingId!, alert)
      : this.alertService.createAlert(alert);

    request$.subscribe({
      next: (saved) => {
        this.isSubmitting = false;
        this.dialogRef.close(saved);
      },
      error: (error) => {
        console.error('Failed to save alert', error);
        this.isSubmitting = false;
        this.submitError = `Unable to ${this.isEditMode ? 'update' : 'add'} alert. Please try again.`;
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
