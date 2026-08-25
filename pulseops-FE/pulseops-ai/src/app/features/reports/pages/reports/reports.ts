import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { DashboardService } from '../../../dashboards/services/dashboard.service';
import { DepartmentLoadItem } from '../../../dashboards/models/dashboard-summary.model';
import { InvoiceService } from '../../../billing/services/invoice.service';
import { InventoryService } from '../../../inventory/services/inventory.service';
import { InventoryItem } from '../../../inventory/models/inventory-item.model';
import { PageHeaderService } from '../../../../core/services/page-header';
import { NotificationService } from '../../../../core/services/notification.service';

interface BillingBreakdown {
  status: string;
  count: number;
  total: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.scss',
})
export class ReportsComponent implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly invoiceService = inject(InvoiceService);
  private readonly inventoryService = inject(InventoryService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notifications = inject(NotificationService);

  departmentLoad: DepartmentLoadItem[] = [];
  billingBreakdown: BillingBreakdown[] = [];
  lowStockItems: InventoryItem[] = [];

  constructor(private pageHeader: PageHeaderService) {
    this.pageHeader.setHeader('Reports', 'Operational Analytics & Breakdowns');
  }

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.departmentLoad = summary.department_load;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load department load', error);
        this.notifications.error('Failed to load department load', 'Please try refreshing the page.');
      },
    });

    this.invoiceService.getInvoices().subscribe({
      next: (invoices) => {
        const statuses = ['Paid', 'Pending', 'Overdue'];
        this.billingBreakdown = statuses.map((status) => {
          const matching = invoices.filter((i) => i.status === status);
          return {
            status,
            count: matching.length,
            total: matching.reduce((sum, i) => sum + i.total_amount, 0),
          };
        });
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load invoices', error);
        this.notifications.error('Failed to load billing data', 'Please try refreshing the page.');
      },
    });

    this.inventoryService.getItems().subscribe({
      next: (items) => {
        this.lowStockItems = items.filter((i) => i.quantity < i.reorder_level);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load inventory', error);
        this.notifications.error('Failed to load inventory data', 'Please try refreshing the page.');
      },
    });
  }
}
