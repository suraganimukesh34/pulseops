import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InventoryItemCreate } from '../../models/inventory-item.model';
import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-add-item-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule],
  templateUrl: './add-item-dialog.html',
  styleUrl: './add-item-dialog.scss',
})
export class AddItemDialog {
  private readonly fb = inject(FormBuilder);
  private readonly inventoryService = inject(InventoryService);
  private readonly dialogRef = inject(MatDialogRef<AddItemDialog>);

  isSubmitting = false;
  submitError = '';

  readonly categoryOptions = ['Medicine', 'Equipment', 'Supply'];

  readonly itemForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    category: ['Medicine', Validators.required],
    quantity: [0, [Validators.required, Validators.min(0)]],
    unit: ['', [Validators.required, Validators.maxLength(50)]],
    reorder_level: [0, [Validators.required, Validators.min(0)]],
    expiry_date: [''],
    supplier: ['', [Validators.required, Validators.maxLength(100)]],
  });

  get name() {
    return this.itemForm.controls.name;
  }
  get category() {
    return this.itemForm.controls.category;
  }
  get quantity() {
    return this.itemForm.controls.quantity;
  }
  get unit() {
    return this.itemForm.controls.unit;
  }
  get reorderLevel() {
    return this.itemForm.controls.reorder_level;
  }
  get supplier() {
    return this.itemForm.controls.supplier;
  }

  submit(): void {
    this.submitError = '';

    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formValue = this.itemForm.getRawValue();

    const item: InventoryItemCreate = {
      name: formValue.name.trim(),
      category: formValue.category,
      quantity: formValue.quantity,
      unit: formValue.unit.trim(),
      reorder_level: formValue.reorder_level,
      expiry_date: formValue.expiry_date || null,
      supplier: formValue.supplier.trim(),
    };

    this.inventoryService.createItem(item).subscribe({
      next: (created) => {
        this.isSubmitting = false;
        this.dialogRef.close(created);
      },
      error: (error) => {
        console.error('Failed to create inventory item', error);
        this.isSubmitting = false;
        this.submitError = 'Unable to add item. Please try again.';
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
