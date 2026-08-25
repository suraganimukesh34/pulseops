import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/department.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddDepartmentDialog } from '../../components/add-department-dialog/add-department-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-departments',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './departments.html',
  styleUrl: './departments.scss',
})
export class DepartmentsComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);
  private readonly notifications = inject(NotificationService);

  departments: Department[] = [];
  badgeClass = badgeClass;
  isLoading = true;

  displayedColumns: string[] = ['name', 'floor', 'head_doctor_name', 'bed_capacity', 'status', 'actions'];
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
    this.isLoading = true;

    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.dataSource.data = departments;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load departments', error);
        this.isLoading = false;
        this.notifications.error('Failed to load departments', 'Please try refreshing the page.');
        this.cdr.detectChanges();
      },
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
        this.notifications.success('Department added successfully', `${department.name} has been added.`);
        this.loadDepartments();
      }
    });
  }

  openEditDepartmentDialog(department: Department): void {
    const dialogRef = this.dialog.open(AddDepartmentDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { department },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.notifications.success('Department updated successfully', `${updated.name}'s record has been saved.`);
        this.loadDepartments();
      }
    });
  }

  deleteDepartment(department: Department): void {
    this.confirmDialog
      .confirm({
        title: 'Delete Department',
        message: `Are you sure you want to delete "${department.name}"? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.departmentService.deleteDepartment(department.id).subscribe({
          next: () => {
            this.notifications.success('Department deleted', `${department.name}'s record has been removed.`);
            this.loadDepartments();
          },
          error: (error) => {
            console.error('Failed to delete department', error);
            this.notifications.error('Failed to delete department', 'Please try again.');
          },
        });
      });
  }
}
