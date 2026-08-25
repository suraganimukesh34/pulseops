import { Injectable, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'pulseops.theme-mode';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  readonly mode = signal<ThemeMode>(this.readStoredMode());

  /** The concrete theme actually painted right now ('light' | 'dark'), resolving 'system'. */
  readonly resolved = signal<'light' | 'dark'>('light');

  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    this.apply(this.mode());

    this.media.addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.apply('system');
      }
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    this.apply(mode);
  }

  cycle(): void {
    const order: ThemeMode[] = ['light', 'dark', 'system'];
    const next = order[(order.indexOf(this.mode()) + 1) % order.length];
    this.setMode(next);
  }

  private apply(mode: ThemeMode): void {
    const resolved = mode === 'system' ? (this.media.matches ? 'dark' : 'light') : mode;
    this.resolved.set(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }

  private readStoredMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
