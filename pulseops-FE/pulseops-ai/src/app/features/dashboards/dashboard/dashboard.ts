import { Component } from '@angular/core';
import { KpiCard } from '../components/kpi-card/kpi-card';
import { KpiCards } from '../models/dashboard.model';
import { CommonModule } from '@angular/common';
import { HospitalStatus } from '../components/hospital-status/hospital-status';
import { ActiveAlerts } from '../components/active-alerts/active-alerts';
import { BedOccupancy } from '../components/bed-occupancy/bed-occupancy';
import { DepartmentLoad } from '../components/department-load/department-load';
import { AiRecommendation } from '../components/ai-recommendation/ai-recommendation';

import { PageHeaderService } from '../../../core/services/page-header';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    KpiCard,
    CommonModule,
    HospitalStatus, 
    ActiveAlerts, 
    BedOccupancy,
    DepartmentLoad, 
    AiRecommendation
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  constructor(private pageheader: PageHeaderService) {
    this.pageheader.setHeader('Dashboard', 'Hospital Operations Command Center')
  }

  kpis: KpiCards[] = [
    {
      title: 'Patients',
      value: 1248,
      icon: 'groups',
      color: 'primary'
    },
    {
      title: 'Available Beds',
      value: 245,
      icon: 'bed',
      color: 'success'
    },
    {
      title: 'ICU Occupancy',
      value: '91%',
      icon: 'favorite',
      color: 'danger'
    },
    {
      title: 'Staff On Duty',
      value: 326,
      icon: 'badge',
      color: 'primary'
    },
    {
      title: 'ER Queue',
      value: 18,
      icon: 'emergency',
      color: 'warning'
    },
    {
      title: 'Alerts',
      value: 4,
      icon: 'warning',
      color: 'danger'
    },
    {
      title: 'Avg Wait',
      value: '28 min',
      icon: 'schedule',
      color: 'warning'
    },
    {
      title: 'Hospital Health',
      value: '92%',
      icon: 'monitor_heart',
      color: 'success'
    }
  ];

}
