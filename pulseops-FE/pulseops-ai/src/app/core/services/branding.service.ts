import { Injectable, inject, signal } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { SettingsService } from '../../features/settings/services/settings.service';
import { HospitalProfile } from '../../features/settings/models/settings.model';

const DEFAULTS = {
  appName: 'PulseOps AI',
  logoIcon: 'monitor_heart',
  accentColor: '#0d9488',
};

@Injectable({
  providedIn: 'root',
})
export class BrandingService {
  private readonly settingsService = inject(SettingsService);

  readonly appName = signal(DEFAULTS.appName);
  readonly logoIcon = signal(DEFAULTS.logoIcon);
  readonly accentColor = signal(DEFAULTS.accentColor);

  private loaded = false;

  /** Fetches branding once per app session; safe to call from every route activation. */
  ensureLoaded(): Observable<HospitalProfile | null> {
    if (this.loaded) {
      return of(null);
    }
    return this.fetch();
  }

  fetch(): Observable<HospitalProfile> {
    return this.settingsService.getHospitalProfile().pipe(
      tap((profile) => {
        this.loaded = true;
        this.appName.set(profile.app_name || DEFAULTS.appName);
        this.logoIcon.set(profile.logo_icon || DEFAULTS.logoIcon);
        this.accentColor.set(profile.accent_color || DEFAULTS.accentColor);
        this.applyAccentColor(this.accentColor());
        document.title = this.appName();
      }),
    );
  }

  private applyAccentColor(hex: string): void {
    document.documentElement.style.setProperty('--accent', hex);
  }
}
