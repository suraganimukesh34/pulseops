import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
@Component({
  selector: 'app-ai-recommendation',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DashboardCard
  ],
  templateUrl: './ai-recommendation.html',
  styleUrl: './ai-recommendation.scss'
})
export class AiRecommendation {

  confidence = 96;

  recommendations = [
    'Transfer 2 stable patients to the Step-Down Unit.',
    'Reassign one nurse from General Ward to ICU.',
    'Monitor ER queue for the next 30 minutes.'
  ];

  impacts = [
    'ICU occupancy reduced to 84%',
    'ER waiting time reduced by 8 minutes',
    'Improved bed availability'
  ];

}

