import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';

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

  totalBeds = 1000;

  occupiedBeds = 755;

  availableBeds = 245;

  get occupancyPercentage(): number {
    return Math.round((this.occupiedBeds / this.totalBeds) * 100);
  }

}
