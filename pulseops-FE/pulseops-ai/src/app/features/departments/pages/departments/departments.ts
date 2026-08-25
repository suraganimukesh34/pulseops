import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddDepartmentDialog } from '../../components/add-department-dialog/add-department-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class DepartmentsComponent implements OnInit {
  departments: Department[] = [];
  badgeClass = badgeClass;

  displayedColumns: string[] = ['name', 'floor', 'head_doctor_name', 'bed_capacity', 'status'];
  dataSource = new MatTableDataSource<Department>();

  constructor(
    private departmentService: DepartmentService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageHeader.setHeader('Departments', 'Hospital Departments Overview');
  }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.dataSource.data = departments;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load departments', error),
    });
  }

  get totalBedCapacity(): number {
    return this.departments.reduce((sum, d) => sum + d.bed_capacity, 0);
  }

  get activeCount(): number {
    return this.departments.filter((d) => d.status === 'Active').length;
  }

  openAddDepartmentDialog(): void {
    const dialogRef = this.dialog.open(AddDepartmentDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((department) => {
      if (department) {
        this.loadDepartments();
      }
    });
  }
}
