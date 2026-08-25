import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
import { AIInsight } from '../../models/dashboard-summary.model';

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

  @Input() statusMessage = 'PulseOps AI Copilot is in development.';
  @Input() insights: AIInsight[] = [];

}
