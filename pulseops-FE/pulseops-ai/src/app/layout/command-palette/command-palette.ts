import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

interface PaletteItem {
  label: string;
  icon: string;
  path: string;
  group: string;
}

const ITEMS: PaletteItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard', group: 'Overview' },
  { label: 'Reports', icon: 'bar_chart', path: '/reports', group: 'Overview' },
  { label: 'Patients', icon: 'groups', path: '/patients', group: 'Operations' },
  { label: 'Departments', icon: 'apartment', path: '/departments', group: 'Operations' },
  { label: 'Appointments', icon: 'event', path: '/appointments', group: 'Operations' },
  { label: 'Beds', icon: 'bed', path: '/beds', group: 'Operations' },
  { label: 'Staff', icon: 'badge', path: '/staff', group: 'Operations' },
  { label: 'Billing', icon: 'receipt_long', path: '/billing', group: 'Finance & Supply' },
  { label: 'Inventory', icon: 'inventory_2', path: '/inventory', group: 'Finance & Supply' },
  { label: 'Alerts', icon: 'warning', path: '/alerts', group: 'Monitoring' },
  { label: 'AI Copilot', icon: 'smart_toy', path: '/copilot', group: 'Monitoring' },
  { label: 'Settings', icon: 'settings', path: '/settings', group: 'System' },
];

@Component({
  selector: 'app-command-palette',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule],
  templateUrl: './command-palette.html',
  styleUrl: './command-palette.scss',
})
export class CommandPalette implements AfterViewInit {
  @ViewChild('queryInput') queryInput?: ElementRef<HTMLInputElement>;

  query = '';
  activeIndex = 0;

  constructor(
    private readonly dialogRef: MatDialogRef<CommandPalette>,
    private readonly router: Router,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  ngAfterViewInit(): void {
    setTimeout(() => this.queryInput?.nativeElement.focus());
  }

  get filtered(): PaletteItem[] {
    const q = this.query.trim().toLowerCase();
    if (!q) {
      return ITEMS;
    }
    return ITEMS.filter(
      (item) => item.label.toLowerCase().includes(q) || item.group.toLowerCase().includes(q),
    );
  }

  get groups(): string[] {
    return [...new Set(this.filtered.map((i) => i.group))];
  }

  itemsFor(group: string): PaletteItem[] {
    return this.filtered.filter((i) => i.group === group);
  }

  onQueryChange(): void {
    this.activeIndex = 0;
    this.cdr.detectChanges();
  }

  onKeydown(event: KeyboardEvent): void {
    const items = this.filtered;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.activeIndex = Math.min(this.activeIndex + 1, items.length - 1);
      this.cdr.detectChanges();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.activeIndex = Math.max(this.activeIndex - 1, 0);
      this.cdr.detectChanges();
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const item = items[this.activeIndex];
      if (item) {
        this.select(item);
      }
    }
  }

  isActive(item: PaletteItem): boolean {
    return this.filtered[this.activeIndex] === item;
  }

  select(item: PaletteItem): void {
    this.router.navigate([item.path]);
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}
