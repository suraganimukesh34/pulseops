import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-restock-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './restock-dialog.html',
  styleUrl: './restock-dialog.scss',
})
export class RestockDialog {
  private readonly fb = inject(FormBuilder);
  private readonly inventoryService = inject(InventoryService);
  private readonly dialogRef = inject(MatDialogRef<RestockDialog>);

  isSubmitting = false;
  submitError = '';

  readonly restockForm = this.fb.nonNullable.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

  constructor(@Inject(MAT_DIALOG_DATA) public data: { itemId: string; itemName: string }) {}

  get quantity() {
    return this.restockForm.controls.quantity;
  }

  submit(): void {
    this.submitError = '';

    if (this.restockForm.invalid) {
      this.restockForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.restockForm.getRawValue();

    this.inventoryService.restockItem(this.data.itemId, { quantity: formValue.quantity }).subscribe({
      next: (updated) => {
        this.isSubmitting = false;
        this.dialogRef.close(updated);
      },
      error: (error) => {
        console.error('Failed to restock item', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to restock item. Please try again.';
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
