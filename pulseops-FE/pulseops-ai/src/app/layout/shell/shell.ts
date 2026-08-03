import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../navbar/navbar';
import { Sidenav } from '../sidenav/sidenav';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-shell',
  imports: [
    RouterOutlet,
    Navbar,
    Sidenav,
    MatSidenavModule
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {}
