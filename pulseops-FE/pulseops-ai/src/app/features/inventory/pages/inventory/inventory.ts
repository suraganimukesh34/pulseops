import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddItemDialog } from '../../components/add-item-dialog/add-item-dialog';
import { RestockDialog } from '../../components/restock-dialog/restock-dialog';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class InventoryComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  items: InventoryItem[] = [];
  isLoading = true;

  displayedColumns: string[] = [
    'name',
    'category',
    'quantity',
    'unit',
    'reorder_level',
    'stock_status',
    'supplier',
    'action',
  ];
  dataSource = new MatTableDataSource<InventoryItem>();

  constructor(
    private inventoryService: InventoryService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageHeader.setHeader('Inventory', 'Pharmacy & Supply Inventory');
  }

  ngOnInit(): void {
    this.loadItems();
  }

  loadItems(): void {
    this.isLoading = true;

    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.dataSource.data = items;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load inventory items', error);
        this.isLoading = false;
        this.notifications.error('Failed to load inventory items', 'Please try refreshing the page.');
        this.cdr.detectChanges();
      },
    });
  }

  get lowStockCount(): number {
    return this.items.filter((item) => item.quantity < item.reorder_level).length;
  }

  get categoriesTracked(): number {
    return 3;
  }

  openAddItemDialog(): void {
    const dialogRef = this.dialog.open(AddItemDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((item) => {
      if (item) {
        this.notifications.success('Inventory item added successfully', `${item.name} has been added to inventory.`);
        this.loadItems();
      }
    });
  }

  openRestockDialog(item: InventoryItem): void {
    const dialogRef = this.dialog.open(RestockDialog, {
      width: '420px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { itemId: item.id, itemName: item.name },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.notifications.success('Item restocked', `${item.name} has been restocked.`);
        this.loadItems();
      }
    });
  }

  openEditItemDialog(item: InventoryItem): void {
    const dialogRef = this.dialog.open(AddItemDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { item },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.notifications.success('Inventory item updated successfully', `${updated.name}'s record has been saved.`);
        this.loadItems();
      }
    });
  }

  deleteItem(item: InventoryItem): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Item',
        message: `Are you sure you want to delete "${item.name}" from inventory? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.inventoryService.deleteItem(item.id).subscribe({
          next: () => {
            this.notifications.success('Inventory item deleted', `${item.name} has been removed from inventory.`);
            this.loadItems();
          },
          error: (error) => {
            console.error('Failed to delete inventory item', error);
            this.notifications.error('Failed to delete inventory item', 'Please try again.');
          },
        });
      });
  }
}
