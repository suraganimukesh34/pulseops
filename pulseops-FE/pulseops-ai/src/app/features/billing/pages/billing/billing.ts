import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddInvoiceDialog } from '../../components/add-invoice-dialog/add-invoice-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class BillingComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);

  invoices: Invoice[] = [];
  badgeClass = badgeClass;

  displayedColumns: string[] = [
    'patient_name',
    'items',
    'total_amount',
    'status',
    'due_date',
    'action',
  ];
  dataSource = new MatTableDataSource<Invoice>();

  constructor(
    private invoiceService: InvoiceService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageHeader.setHeader('Billing', 'Patient Invoices & Payments');
  }

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.dataSource.data = invoices;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load invoices', error),
    });
  }

  itemDescriptions(invoice: Invoice): string {
    return invoice.items.map((i) => i.description).join(', ');
  }

  get pendingAmount(): number {
    return this.invoices
      .filter((i) => i.status === 'Pending' || i.status === 'Overdue')
      .reduce((sum, i) => sum + i.total_amount, 0);
  }

  get pendingAmountFormatted(): string {
    return `$${this.pendingAmount.toLocaleString()}`;
  }

  get overdueCount(): number {
    return this.invoices.filter((i) => i.status === 'Overdue').length;
  }

  markPaid(invoice: Invoice): void {
    this.invoiceService.markPaid(invoice.id).subscribe({
      next: () => this.loadInvoices(),
      error: (error) => console.error('Failed to mark invoice paid', error),
    });
  }

  openAddInvoiceDialog(): void {
    const dialogRef = this.dialog.open(AddInvoiceDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((invoice) => {
      if (invoice) {
        this.loadInvoices();
      }
    });
  }

  openEditInvoiceDialog(invoice: Invoice): void {
    const dialogRef = this.dialog.open(AddInvoiceDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { invoice },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.loadInvoices();
      }
    });
  }

  deleteInvoice(invoice: Invoice): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Invoice',
        message: `Are you sure you want to delete this invoice for "${invoice.patient_name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.invoiceService.deleteInvoice(invoice.id).subscribe({
          next: () => this.loadInvoices(),
          error: (error) => console.error('Failed to delete invoice', error),
        });
      });
  }
}
