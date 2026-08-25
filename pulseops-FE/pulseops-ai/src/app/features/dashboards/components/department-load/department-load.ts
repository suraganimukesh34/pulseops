import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DashboardCard } from '../../../../shared/components/dashboard-card/dashboard-card';
import { DepartmentLoadItem } from '../../models/dashboard-summary.model';

interface DepartmentRow {
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

  @Input() set departmentLoad(value: DepartmentLoadItem[] | null) {
    this.departments = (value ?? []).map((d) => ({
      name: d.department_name,
      load: d.load_percentage,
    }));
  }

  departments: DepartmentRow[] = [];

}
