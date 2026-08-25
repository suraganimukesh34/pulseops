import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
import { DashboardSummary } from '../../models/dashboard-summary.model';

@Component({
  selector: 'app-bed-occupancy',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DashboardCard
  ],
  templateUrl: './bed-occupancy.html',
  styleUrl: './bed-occupancy.scss'
})
export class BedOccupancy {

  @Input() summary: DashboardSummary | null = null;

  get totalBeds(): number {
    return this.summary?.total_beds ?? 0;
  }

  get occupiedBeds(): number {
    return this.summary?.occupied_beds ?? 0;
  }

  get availableBeds(): number {
    return this.summary?.available_beds ?? 0;
  }

  get occupancyPercentage(): number {
    return this.summary?.bed_occupancy_rate ?? 0;
  }

}
