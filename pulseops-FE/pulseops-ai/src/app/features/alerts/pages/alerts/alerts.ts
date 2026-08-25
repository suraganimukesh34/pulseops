import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../../services/alert.service';
import { Alert } from '../../models/alert.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddAlertDialog } from '../../components/add-alert-dialog/add-alert-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
})
export class AlertsComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  alerts: Alert[] = [];
  badgeClass = badgeClass;
  isLoading = true;

  displayedColumns: string[] = [
    'severity',
    'category',
    'message',
    'source',
    'timestamp',
    'action',
  ];
  dataSource = new MatTableDataSource<Alert>();

  constructor(
    private alertService: AlertService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageHeader.setHeader('Alerts', 'Operational Alerts & Notifications');
  }

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.isLoading = true;

    this.alertService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.dataSource.data = alerts;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load alerts', error);
        this.isLoading = false;
        this.notifications.error('Failed to load alerts', 'Please try refreshing the page.');
        this.cdr.detectChanges();
      },
    });
  }

  get activeCount(): number {
    return this.alerts.filter((a) => !a.acknowledged).length;
  }

  get criticalCount(): number {
    return this.alerts.filter((a) => a.severity === 'Critical' && !a.acknowledged).length;
  }

  get acknowledgedCount(): number {
    return this.alerts.filter((a) => a.acknowledged).length;
  }

  formatTimestamp(timestamp: string): string {
    return timestamp.slice(0, 16).replace('T', ' ');
  }

  acknowledge(alert: Alert): void {
    this.alertService.acknowledgeAlert(alert.id).subscribe({
      next: () => {
        this.notifications.success('Alert acknowledged', `The ${alert.category} alert has been acknowledged.`);
        this.loadAlerts();
      },
      error: (error) => {
        console.error('Failed to acknowledge alert', error);
        this.notifications.error('Failed to acknowledge alert', 'Please try again.');
      },
    });
  }

  openAddAlertDialog(): void {
    const dialogRef = this.dialog.open(AddAlertDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((alert) => {
      if (alert) {
        this.notifications.success('Alert added successfully', `${alert.category} alert has been created.`);
        this.loadAlerts();
      }
    });
  }

  openEditAlertDialog(alert: Alert): void {
    const dialogRef = this.dialog.open(AddAlertDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { alert },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.notifications.success('Alert updated successfully', `${updated.category} alert has been saved.`);
        this.loadAlerts();
      }
    });
  }

  deleteAlert(alert: Alert): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Alert',
        message: `Are you sure you want to delete this alert? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.alertService.deleteAlert(alert.id).subscribe({
          next: () => {
            this.notifications.success('Alert deleted', `The ${alert.category} alert has been removed.`);
            this.loadAlerts();
          },
          error: (error) => {
            console.error('Failed to delete alert', error);
            this.notifications.error('Failed to delete alert', 'Please try again.');
          },
        });
      });
  }
}
