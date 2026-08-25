import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserService } from '../../core/services/current-user.service';
import { BrandingService } from '../../core/services/branding.service';
import { LayoutStateService } from '../../core/services/layout-state.service';

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterLinkActive,
    MatIconModule,
    MatTooltipModule,
    RouterLink
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  readonly currentUser = inject(CurrentUserService);
  readonly branding = inject(BrandingService);
  readonly layout = inject(LayoutStateService);

  toggleCollapse(): void {
    this.layout.toggleSidenav();
  }
}
