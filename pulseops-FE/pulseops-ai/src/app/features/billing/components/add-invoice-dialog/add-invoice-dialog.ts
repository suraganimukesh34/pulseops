import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InvoiceCreate } from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { Patient } from '../../../patients/models/patient.model';
import { PatientService } from '../../../patients/services/patient';

@Component({
  selector: 'app-add-invoice-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-invoice-dialog.html',
  styleUrl: './add-invoice-dialog.scss',
})
export class AddInvoiceDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly invoiceService = inject(InvoiceService);
  private readonly patientService = inject(PatientService);
  private readonly dialogRef = inject(MatDialogRef<AddInvoiceDialog>);
  private readonly cdr = inject(ChangeDetectorRef);

  isSubmitting = false;
  submitError = '';

  patients: Patient[] = [];

  readonly statusOptions = ['Paid', 'Pending', 'Overdue'];

  readonly invoiceForm = this.fb.nonNullable.group({
    patient_id: ['', Validators.required],
    description: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(0)]],
    status: ['Pending', Validators.required],
    issued_date: ['', Validators.required],
    due_date: ['', Validators.required],
  });

  get patient_id() {
    return this.invoiceForm.controls.patient_id;
  }
  get description() {
    return this.invoiceForm.controls.description;
  }
  get amount() {
    return this.invoiceForm.controls.amount;
  }
  get status() {
    return this.invoiceForm.controls.status;
  }
  get issued_date() {
    return this.invoiceForm.controls.issued_date;
  }
  get due_date() {
    return this.invoiceForm.controls.due_date;
  }

  ngOnInit(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load patients', error),
    });
  }

  submit(): void {
    this.submitError = '';

    if (this.invoiceForm.invalid) {
      this.invoiceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.invoiceForm.getRawValue();

    const selectedPatient = this.patients.find((p) => p.id === formValue.patient_id);

    const invoice: InvoiceCreate = {
      patient_id: formValue.patient_id,
      patient_name: selectedPatient?.name ?? '',
      items: [{ description: formValue.description.trim(), amount: formValue.amount }],
      status: formValue.status,
      issued_date: formValue.issued_date,
      due_date: formValue.due_date,
    };

    this.invoiceService.createInvoice(invoice).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.dialogRef.close(created);
      },
      error: (error) => {
        console.error('Failed to create invoice', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to add invoice. Please try again.';
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
