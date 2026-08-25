import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../../services/ai.service';
import { AIInsight } from '../../models/ai-insight.model';
import { PageHeaderService } from '../../../../core/services/page-header';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-copilot',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './copilot.html',
  styleUrl: './copilot.scss',
})
export class CopilotComponent implements OnInit {
  private readonly aiService = inject(AiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notifications = inject(NotificationService);

  statusMessage = '';
  insights: AIInsight[] = [];

  constructor(private pageHeader: PageHeaderService) {
    this.pageHeader.setHeader('AI Copilot', 'Preview of upcoming intelligent capabilities');
  }

  ngOnInit(): void {
    this.aiService.getStatus().subscribe({
      next: (status) => {
        this.statusMessage = status.message;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load AI status', error);
        this.notifications.error('Failed to load AI Copilot status', 'Please try refreshing the page.');
      },
    });

    this.aiService.getInsights().subscribe({
      next: (response) => {
        this.insights = response.insights;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load AI insights', error);
        this.notifications.error('Failed to load AI insights', 'Please try refreshing the page.');
      },
    });
  }
}
