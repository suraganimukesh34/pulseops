import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { InventoryService } from '../../services/inventory.service';
import { InventoryItem } from '../../models/inventory-item.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddItemDialog } from '../../components/add-item-dialog/add-item-dialog';
import { RestockDialog } from '../../components/restock-dialog/restock-dialog';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class InventoryComponent implements OnInit {
  items: InventoryItem[] = [];

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
    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.items = items;
        this.dataSource.data = items;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load inventory items', error),
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
        this.loadItems();
      }
    });
  }
}
