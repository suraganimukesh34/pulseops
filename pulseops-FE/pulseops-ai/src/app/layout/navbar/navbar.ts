import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PageHeaderService } from '../../core/services/page-header';
import { CurrentUserService } from '../../core/services/current-user.service';
import { ThemeService } from '../../core/services/theme.service';
import { CommandPaletteService } from '../../core/services/command-palette.service';
import { AuthService } from '../../features/auth/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

interface RawAlert {
  id: string;
  message: string;
  severity: string;
  acknowledged: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export class Navbar implements OnInit {
  pageHeader = inject(PageHeaderService);
  currentUser = inject(CurrentUserService);
  theme = inject(ThemeService);
  private readonly commandPalette = inject(CommandPaletteService);

  openPalette(): void {
    this.commandPalette.open();
  }

  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  unacknowledgedAlerts: RawAlert[] = [];

  ngOnInit(): void {
    this.loadAlerts();
  }

  private loadAlerts(): void {
    this.http.get<RawAlert[]>(`${environment.apiUrl}/alerts`).subscribe({
      next: (alerts) => {
        this.unacknowledgedAlerts = alerts.filter((a) => !a.acknowledged);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load alerts', error),
    });
  }

  get themeIcon(): string {
    switch (this.theme.mode()) {
      case 'light':
        return 'light_mode';
      case 'dark':
        return 'dark_mode';
      default:
        return 'brightness_auto';
    }
  }

  get themeLabel(): string {
    switch (this.theme.mode()) {
      case 'light':
        return 'Light theme';
      case 'dark':
        return 'Dark theme';
      default:
        return 'System theme';
    }
  }

  cycleTheme(): void {
    this.theme.cycle();
  }

  logout(): void {
    this.authService.logout();
    this.currentUser.clear();
    this.router.navigate(['/login']);
  }
}
