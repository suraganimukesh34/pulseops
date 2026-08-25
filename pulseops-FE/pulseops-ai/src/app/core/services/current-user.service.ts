import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CurrentUser } from '../models/current-user.model';

@Injectable({
  providedIn: 'root',
})
export class CurrentUserService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly http = inject(HttpClient);

  readonly user = signal<CurrentUser | null>(null);
  readonly role = () => this.user()?.role ?? null;
  readonly isAdmin = () => this.user()?.role === 'Admin';

  fetchCurrentUser(): Observable<CurrentUser> {
    return this.http
      .get<CurrentUser>(`${this.apiUrl}/me`)
      .pipe(tap((user) => this.user.set(user)));
  }

  clear(): void {
    this.user.set(null);
  }
}
