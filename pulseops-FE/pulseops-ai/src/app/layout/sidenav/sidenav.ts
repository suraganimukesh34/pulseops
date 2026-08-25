import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrentUserService } from '../../core/services/current-user.service';

@Component({
  selector: 'app-sidenav',
  imports: [
    RouterLinkActive,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss',
})
export class Sidenav {
  readonly currentUser = inject(CurrentUserService);
}
