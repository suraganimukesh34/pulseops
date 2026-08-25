import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
}

const DEFAULT_DURATION_MS: Record<ToastType, number> = {
  success: 4000,
  info: 4000,
  warning: 5500,
  error: 6500,
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly toasts = signal<Toast[]>([]);

  private nextId = 1;

  success(title: string, message?: string): void {
    this.show('success', title, message);
  }

  error(title: string, message?: string): void {
    this.show('error', title, message);
  }

  info(title: string, message?: string): void {
    this.show('info', title, message);
  }

  warning(title: string, message?: string): void {
    this.show('warning', title, message);
  }

  dismiss(id: number): void {
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  private show(type: ToastType, title: string, message?: string): void {
    const id = this.nextId++;

    this.toasts.update((current) => [...current, { id, type, title, message }]);

    setTimeout(() => this.dismiss(id), DEFAULT_DURATION_MS[type]);
  }
}
