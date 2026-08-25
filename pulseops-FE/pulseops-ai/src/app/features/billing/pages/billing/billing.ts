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
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-billing',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class BillingComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  invoices: Invoice[] = [];
  badgeClass = badgeClass;
  isLoading = true;

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
    this.isLoading = true;

    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        this.invoices = invoices;
        this.dataSource.data = invoices;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load invoices', error);
        this.isLoading = false;
        this.notifications.error('Failed to load invoices', 'Please try refreshing the page.');
        this.cdr.detectChanges();
      },
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
      next: () => {
        this.notifications.success('Invoice marked as paid', `${invoice.patient_name}'s invoice has been settled.`);
        this.loadInvoices();
      },
      error: (error) => {
        console.error('Failed to mark invoice paid', error);
        this.notifications.error('Failed to mark invoice paid', 'Please try again.');
      },
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
        this.notifications.success('Invoice added successfully', `Invoice for ${invoice.patient_name} has been created.`);
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
        this.notifications.success('Invoice updated successfully', `${updated.patient_name}'s invoice has been saved.`);
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
          next: () => {
            this.notifications.success('Invoice deleted', `${invoice.patient_name}'s invoice has been removed.`);
            this.loadInvoices();
          },
          error: (error) => {
            console.error('Failed to delete invoice', error);
            this.notifications.error('Failed to delete invoice', 'Please try again.');
          },
        });
      });
  }
}
