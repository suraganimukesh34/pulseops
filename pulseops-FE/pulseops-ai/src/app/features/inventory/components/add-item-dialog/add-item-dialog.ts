import { Component, Inject, inject, Optional } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { InventoryItem, InventoryItemCreate } from '../../models/inventory-item.model';
import { InventoryService } from '../../services/inventory.service';

export interface AddItemDialogData {
  item: InventoryItem;
}

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

  readonly isEditMode: boolean;
  private readonly editingId: string | null;

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

  constructor(@Optional() @Inject(MAT_DIALOG_DATA) data: AddItemDialogData | null) {
    this.isEditMode = !!data?.item;
    this.editingId = data?.item.id ?? null;

    if (data?.item) {
      this.itemForm.setValue({
        name: data.item.name,
        category: data.item.category,
        quantity: data.item.quantity,
        unit: data.item.unit,
        reorder_level: data.item.reorder_level,
        expiry_date: data.item.expiry_date ?? '',
        supplier: data.item.supplier,
      });
    }
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

    const request$ = this.isEditMode
      ? this.inventoryService.updateItem(this.editingId!, item)
      : this.inventoryService.createItem(item);

    request$.subscribe({
      next: (saved) => {
        this.isSubmitting = false;
        this.dialogRef.close(saved);
      },
      error: (error) => {
        console.error('Failed to save inventory item', error);
        this.isSubmitting = false;
        this.submitError = `Unable to ${this.isEditMode ? 'update' : 'add'} item. Please try again.`;
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
