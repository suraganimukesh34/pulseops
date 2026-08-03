import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
selector: 'app-stat-card',
standalone: true,
imports: [
CommonModule,
MatIconModule
],
templateUrl: './stat-card.html',
styleUrl: './stat-card.scss'
})
export class StatCard {

@Input() icon = 'analytics';

@Input() title = '';

@Input() value = '';

@Input() subtitle = '';

@Input() color = 'var(--primary)';

}
