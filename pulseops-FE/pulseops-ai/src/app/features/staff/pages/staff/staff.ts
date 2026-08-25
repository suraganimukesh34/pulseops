import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { StaffService } from '../../services/staff.service';
import { Staff } from '../../models/staff.model';
import { DepartmentService } from '../../../departments/services/department.service';
import { Department } from '../../../departments/models/department.model';
import { StatCard } from '../../../../shared/components/stat-card/stat-card';
import { PageHeaderService } from '../../../../core/services/page-header';
import { AddStaffDialog } from '../../components/add-staff-dialog/add-staff-dialog';
import { badgeClass } from '../../../../shared/utils/badge.util';
import { ConfirmDialogService } from '../../../../core/services/confirm-dialog.service';

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [CommonModule, StatCard, MatTableModule, MatIconModule],
  templateUrl: './staff.html',
  styleUrl: './staff.scss',
})
export class StaffComponent implements OnInit {
  private readonly confirmDialog = inject(ConfirmDialogService);

  staff: Staff[] = [];
  departments: Department[] = [];
  badgeClass = badgeClass;

  displayedColumns: string[] = [
    'name',
    'role',
    'department',
    'specialization',
    'shift',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<Staff>();

  constructor(
    private staffService: StaffService,
    private departmentService: DepartmentService,
    private pageHeader: PageHeaderService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {
    this.pageHeader.setHeader('Staff', 'Hospital Staff Directory');
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadStaff();
  }

  loadStaff(): void {
    this.staffService.getStaff().subscribe({
      next: (staff) => {
        this.staff = staff;
        this.dataSource.data = staff;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load staff', error),
    });
  }

  loadDepartments(): void {
    this.departmentService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.cdr.detectChanges();
      },
      error: (error) => console.error('Failed to load departments', error),
    });
  }

  departmentName(departmentId: string): string {
    return this.departments.find((d) => d.id === departmentId)?.name ?? '—';
  }

  get totalCount(): number {
    return this.staff.length;
  }

  get onDutyCount(): number {
    return this.staff.filter((s) => s.status === 'On Duty').length;
  }

  get onLeaveCount(): number {
    return this.staff.filter((s) => s.status === 'On Leave').length;
  }

  openAddStaffDialog(): void {
    const dialogRef = this.dialog.open(AddStaffDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((staff) => {
      if (staff) {
        this.loadStaff();
      }
    });
  }

  openEditStaffDialog(member: Staff): void {
    const dialogRef = this.dialog.open(AddStaffDialog, {
      width: '600px',
      maxWidth: '95vw',
      panelClass: 'pulseops-form-dialog',
      autoFocus: false,
      data: { staff: member },
    });

    dialogRef.afterClosed().subscribe((updated) => {
      if (updated) {
        this.loadStaff();
      }
    });
  }

  deleteStaff(member: Staff): void {
    this.confirmDialog
      .confirm({
        title: 'Remove Staff Member',
        message: `Are you sure you want to remove "${member.name}" from staff? This cannot be undone.`,
        confirmLabel: 'Delete',
        danger: true,
      })
      .subscribe((confirmed) => {
        if (!confirmed) {
          return;
        }
        this.staffService.deleteStaff(member.id).subscribe({
          next: () => this.loadStaff(),
          error: (error) => console.error('Failed to delete staff member', error),
        });
      });
  }
}
