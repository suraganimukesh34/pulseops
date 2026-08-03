import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-data-table',
  imports: [CommonModule, MatIconModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() title = '';
  @Input() subtitle = '';
}
