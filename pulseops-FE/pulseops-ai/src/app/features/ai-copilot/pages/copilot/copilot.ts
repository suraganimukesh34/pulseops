import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AiService } from '../../services/ai.service';
import { AIInsight, ChatMessage } from '../../models/ai-insight.model';
import { PageHeaderService } from '../../../../core/services/page-header';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-copilot',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './copilot.html',
  styleUrl: './copilot.scss',
})
export class CopilotComponent implements OnInit {
  private readonly aiService = inject(AiService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly notifications = inject(NotificationService);

  @ViewChild('chatLog') chatLog?: ElementRef<HTMLDivElement>;

  statusMessage = '';
  aiAvailable = false;
  insights: AIInsight[] = [];

  messages: ChatMessage[] = [];
  draft = '';
  sending = false;

  readonly suggestions = [
    'How many free beds are in Cardiology?',
    'How many nurses are on shift right now?',
    "What's the ICU occupancy?",
  ];

  private readonly sessionId = crypto.randomUUID();

  constructor(private pageHeader: PageHeaderService) {
    this.pageHeader.setHeader('AI Copilot', 'Ask about beds, patients, appointments and more');
  }

  ngOnInit(): void {
    this.aiService.getStatus().subscribe({
      next: (status) => {
        this.statusMessage = status.message;
        this.aiAvailable = status.available;
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

  useSuggestion(text: string): void {
    if (this.sending) return;
    this.draft = text;
    this.send();
  }

  async send(): Promise<void> {
    const text = this.draft.trim();
    if (!text || this.sending) return;

    this.messages.push({ role: 'user', text });
    const assistantMsg: ChatMessage = { role: 'assistant', text: '' };
    this.messages.push(assistantMsg);
    this.draft = '';
    this.sending = true;
    this.scrollToBottom();

    try {
      await this.aiService.streamChat(this.sessionId, text, (chunk) => {
        assistantMsg.text += chunk;
        this.cdr.detectChanges();
        this.scrollToBottom();
      });
    } catch (error) {
      console.error('Copilot stream failed', error);
      assistantMsg.text = assistantMsg.text || 'Something went wrong reaching the AI Copilot.';
      this.notifications.error('AI Copilot request failed', 'Please try again.');
    } finally {
      this.sending = false;
      this.cdr.detectChanges();
      this.scrollToBottom();
    }
  }

  private scrollToBottom(): void {
    const el = this.chatLog?.nativeElement;
    if (!el) return;
    setTimeout(() => (el.scrollTop = el.scrollHeight), 0);
  }
}
