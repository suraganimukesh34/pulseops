import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { SettingsService } from '../../services/settings.service';
import { UserAccount } from '../../models/settings.model';
import { PageHeaderService } from '../../../../core/services/page-header';
import { CurrentUserService } from '../../../../core/services/current-user.service';
import { badgeClass } from '../../../../shared/utils/badge.util';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatTabsModule, MatTableModule],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class SettingsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly settingsService = inject(SettingsService);
  readonly currentUser = inject(CurrentUserService);
  private readonly cdr = inject(ChangeDetectorRef);

  badgeClass = badgeClass;

  isSaving = false;
  saveError = '';
  saveSuccess = false;

  users: UserAccount[] = [];
  userColumns = ['name', 'email', 'role', 'active'];

  readonly profileForm = this.fb.nonNullable.group({
    hospital_name: ['', Validators.required],
    address: ['', Validators.required],
    phone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    timezone: ['', Validators.required],
  });

  constructor(private pageHeader: PageHeaderService) {
    this.pageHeader.setHeader('Settings', 'Hospital Profile & Platform Configuration');
  }

  get isAdmin(): boolean {
    return this.currentUser.isAdmin();
  }

  ngOnInit(): void {
    this.settingsService.getHospitalProfile().subscribe({
      next: (profile) => {
        this.profileForm.setValue(profile);
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load hospital profile', error),
    });

    // Fetch unconditionally rather than gating on `isAdmin` here: the guard's
    // current-user fetch may not have resolved yet at this exact instant, and
    // `isAdmin` is only read once. The User Management tab itself is hidden
    // reactively via `@if (isAdmin)`, so a 403 for a non-admin is harmless.
    this.settingsService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.cdr.detectChanges();
      },
      error: () => {
        // Expected for non-admin users (403) — nothing to show.
      },
    });
  }

  saveProfile(): void {
    if (!this.isAdmin || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.saveError = '';
    this.saveSuccess = false;

    this.settingsService.updateHospitalProfile(this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.isSaving = false;
        this.saveSuccess = true;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to save hospital profile', error);
        this.isSaving = false;
        this.saveError = 'Unable to save changes. Please try again.';
        this.cdr.detectChanges();
      },
    });
  }
}
