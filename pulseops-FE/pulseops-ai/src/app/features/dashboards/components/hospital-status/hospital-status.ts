import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';

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

  healthScore = 92;

  lastUpdated = '2 min ago';

  checks = [
    'ICU Capacity Stable',
    'Staff Coverage Healthy',
    'Bed Availability Good'
  ];

}
