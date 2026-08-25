import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'pulseops.sidenav-collapsed';

@Injectable({
  providedIn: 'root',
})
export class LayoutStateService {
  readonly sidenavCollapsed = signal(localStorage.getItem(STORAGE_KEY) === 'true');

  toggleSidenav(): void {
    const next = !this.sidenavCollapsed();
    this.sidenavCollapsed.set(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }
}
