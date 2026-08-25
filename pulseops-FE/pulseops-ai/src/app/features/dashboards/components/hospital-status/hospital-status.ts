import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
import { DashboardSummary } from '../../models/dashboard-summary.model';

@Component({
  selector: 'app-hospital-status',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DashboardCard
  ],
  templateUrl: './hospital-status.html',
  styleUrl: './hospital-status.scss'
})
export class HospitalStatus {

  @Input() summary: DashboardSummary | null = null;

  lastUpdated = 'just now';

  get healthScore(): number {
    if (!this.summary) {
      return 0;
    }
    const score = 100 - this.summary.critical_alerts * 8 - this.summary.overdue_invoices * 2;
    return Math.max(0, Math.min(100, score));
  }

  get status(): string {
    return this.summary?.hospital_status ?? 'Normal';
  }

  get statusClass(): 'success' | 'warning' | 'danger' {
    switch (this.status) {
      case 'Critical':
        return 'danger';
      case 'Elevated':
        return 'warning';
      default:
        return 'success';
    }
  }

  get checks(): string[] {
    if (!this.summary) {
      return [];
    }
    return [
      `${this.summary.bed_occupancy_rate}% bed occupancy`,
      `${this.summary.staff_on_duty}/${this.summary.staff_total} staff on duty`,
      `${this.summary.active_alerts} active alert${this.summary.active_alerts === 1 ? '' : 's'}`
    ];
  }

}
