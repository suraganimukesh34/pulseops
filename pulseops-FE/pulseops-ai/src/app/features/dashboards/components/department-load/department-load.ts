import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
interface Department {
  name: string;
  load: number;
}

@Component({
  selector: 'app-department-load',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    DashboardCard
  ],
  templateUrl: './department-load.html',
  styleUrl: './department-load.scss'
})
export class DepartmentLoad {

  departments: Department[] = [
    { name: 'Emergency', load: 95 },
    { name: 'ICU', load: 88 },
    { name: 'General Ward', load: 72 },
    { name: 'Pediatrics', load: 54 },
    { name: 'Cardiology', load: 63 }
  ];

}

