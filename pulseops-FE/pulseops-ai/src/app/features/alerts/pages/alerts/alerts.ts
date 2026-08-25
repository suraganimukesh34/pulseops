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

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './alerts.html',
  styleUrl: './alerts.scss',
})
export class AlertsComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);

  alerts: Alert[] = [];
  badgeClass = badgeClass;

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
    this.alertService.getAlerts().subscribe({
      next: (alerts) => {
        this.alerts = alerts;
        this.dataSource.data = alerts;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load alerts', error),
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
      next: () => this.loadAlerts(),
      error: (error) => console.error('Failed to acknowledge alert', error),
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
          next: () => this.loadAlerts(),
          error: (error) => console.error('Failed to delete alert', error),
        });
      });
  }
}
