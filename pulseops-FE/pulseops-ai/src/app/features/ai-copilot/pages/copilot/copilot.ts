import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../../services/ai.service';
import { AIInsight } from '../../models/ai-insight.model';
import { PageHeaderService } from '../../../../core/services/page-header';

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
      error: (error) => console.error('Failed to load AI status', error),
    });

    this.aiService.getInsights().subscribe({
      next: (response) => {
        this.insights = response.insights;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load AI insights', error),
    });
  }
}
