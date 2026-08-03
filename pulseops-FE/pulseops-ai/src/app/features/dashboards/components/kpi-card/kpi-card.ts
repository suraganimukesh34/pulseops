import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { KpiCards } from '../../models/dashboard.model';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
import { MatIconModule } from '@angular/material/icon';
@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [
    CommonModule, 
    DashboardCard,
    MatIconModule
  ],
  templateUrl: './kpi-card.html',
  styleUrl: './kpi-card.scss',
})
export class KpiCard {
  @Input({ required: true})
  card!: KpiCards;
}
