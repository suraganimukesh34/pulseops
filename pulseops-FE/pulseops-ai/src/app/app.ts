import { Component, HostListener, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';
import { CommandPaletteService } from './core/services/command-palette.service';
import { ToastContainer } from './shared/components/toast-container/toast-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  // Injected eagerly (not just relied upon) so the theme attribute is
  // applied to <html> before the first route renders, avoiding a flash
  // of the wrong theme.
  private readonly themeService = inject(ThemeService);
  private readonly commandPalette = inject(CommandPaletteService);

  @HostListener('window:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      this.commandPalette.open();
    }
  }
}
