import { Injectable, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CommandPalette } from '../../layout/command-palette/command-palette';

@Injectable({
  providedIn: 'root',
})
export class CommandPaletteService {
  private readonly dialog = inject(MatDialog);

  open(): void {
    if (this.dialog.openDialogs.length > 0) {
      return;
    }

    this.dialog.open(CommandPalette, {
      width: '560px',
      maxWidth: '92vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });
  }
}
