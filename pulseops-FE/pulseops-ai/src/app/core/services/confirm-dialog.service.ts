import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialog, ConfirmDialogData } from '../../shared/components/confirm-dialog/confirm-dialog';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  private readonly dialog = inject(MatDialog);

  confirm(data: ConfirmDialogData): Observable<boolean> {
    return this.dialog
      .open(ConfirmDialog, {
        width: '440px',
        maxWidth: '92vw',
        panelClass: 'pulseops-form-dialog',
        autoFocus: false,
        data,
      })
      .afterClosed()
      .pipe(map((result) => !!result));
  }
}
