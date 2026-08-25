import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
import { DashboardAlertPreview } from '../../models/dashboard-summary.model';

@Component({
  selector: 'app-active-alerts',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DashboardCard
  ],
  templateUrl: './active-alerts.html',
  styleUrl: './active-alerts.scss'
})
export class ActiveAlerts {

  @Input() alerts: DashboardAlertPreview[] = [];

}
