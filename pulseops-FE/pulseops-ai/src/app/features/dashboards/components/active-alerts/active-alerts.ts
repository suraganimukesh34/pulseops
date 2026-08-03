import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
interface Alert {
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
}

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

  alerts: Alert[] = [
    {
      title: 'ICU Occupancy High',
      description: 'ICU occupancy has reached 91%',
      severity: 'critical'
    },
    {
      title: 'ER Waiting Time',
      description: 'Average waiting time is 28 minutes',
      severity: 'warning'
    },
    {
      title: 'Staff Shortage',
      description: 'ICU requires 2 additional nurses',
      severity: 'warning'
    },
    {
      title: 'MRI Maintenance',
      description: 'Scheduled maintenance at 9:00 PM',
      severity: 'info'
    }
  ];

}
