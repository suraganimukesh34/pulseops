import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { KpiCard } from '../components/kpi-card/kpi-card';
import { KpiCards } from '../models/dashboard.model';
import { CommonModule } from '@angular/common';
import { HospitalStatus } from '../components/hospital-status/hospital-status';
import { ActiveAlerts } from '../components/active-alerts/active-alerts';
import { BedOccupancy } from '../components/bed-occupancy/bed-occupancy';
import { DepartmentLoad } from '../components/department-load/department-load';
import { AiRecommendation } from '../components/ai-recommendation/ai-recommendation';
import { DashboardService } from '../services/dashboard.service';
import { AIInsight, DashboardAlertPreview, DashboardSummary } from '../models/dashboard-summary.model';

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
export class Dashboard implements OnInit {

  private readonly dashboardService = inject(DashboardService);
  private readonly cdr = inject(ChangeDetectorRef);

  summary: DashboardSummary | null = null;
  recentAlerts: DashboardAlertPreview[] = [];
  aiStatusMessage = 'PulseOps AI Copilot is in development.';
  aiInsights: AIInsight[] = [];

  kpis: KpiCards[] = [];

  constructor(private pageheader: PageHeaderService) {
    this.pageheader.setHeader('Dashboard', 'Hospital Operations Command Center')
  }

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: (summary) => {
        this.summary = summary;
        this.kpis = this.buildKpis(summary);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load dashboard summary', error),
    });

    this.dashboardService.getRecentAlerts().subscribe({
      next: (alerts) => {
        this.recentAlerts = alerts
          .filter((a) => !a.acknowledged)
          .slice(0, 4)
          .map((a) => ({
            title: a.message,
            description: `${a.category} • ${a.source}`,
            severity: a.severity.toLowerCase() as 'critical' | 'warning' | 'info',
          }));
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load alerts', error),
    });

    this.dashboardService.getAIStatus().subscribe({
      next: (status) => {
        this.aiStatusMessage = status.message;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load AI status', error),
    });

    this.dashboardService.getAIInsights().subscribe({
      next: (response) => {
        this.aiInsights = response.insights;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load AI insights', error),
    });
  }

  private buildKpis(summary: DashboardSummary): KpiCards[] {
    return [
      { title: 'Patients', value: summary.total_patients, icon: 'groups', color: 'primary' },
      { title: 'Available Beds', value: summary.available_beds, icon: 'bed', color: 'success' },
      { title: 'Bed Occupancy', value: `${summary.bed_occupancy_rate}%`, icon: 'favorite', color: 'danger' },
      { title: 'Staff On Duty', value: summary.staff_on_duty, icon: 'badge', color: 'primary' },
      { title: 'ER Queue', value: summary.er_queue, icon: 'emergency', color: 'warning' },
      { title: 'Active Alerts', value: summary.active_alerts, icon: 'warning', color: 'danger' },
      { title: 'Appointments Today', value: summary.appointments_today, icon: 'event', color: 'primary' },
      { title: 'Hospital Status', value: summary.hospital_status, icon: 'monitor_heart', color: summary.hospital_status === 'Normal' ? 'success' : summary.hospital_status === 'Elevated' ? 'warning' : 'danger' },
    ];
  }

}
